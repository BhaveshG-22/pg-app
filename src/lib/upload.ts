/**
 * Client-side upload utilities for presigned S3 uploads
 */

interface PresignResponse {
  url: string;
  key: string;
  headers: Record<string, string>;
  expiresIn: number;
}

interface UploadOptions {
  file: File;
  onProgress?: (progress: number) => void;
  onSuccess?: (s3Key: string) => void;
  onError?: (error: string) => void;
}

interface ConfirmUploadOptions {
  s3Key: string;
  presetId: string;
  inputValues?: Record<string, string>;
  outputSize: string;
}

/**
 * Request a presigned URL for uploading a file
 */
export async function requestPresignedUrl(file: File): Promise<PresignResponse> {
  const response = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type,
      fileSize: file.size,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get presigned URL');
  }

  return response.json();
}

/**
 * Upload file to S3 using presigned URL
 */
export async function uploadToS3(
  presignedUrl: string,
  file: File,
  headers: Record<string, string>,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'));
    });

    xhr.open('PUT', presignedUrl);

    // Set required headers
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(file);
  });
}

/**
 * Confirm upload and start processing
 */
export async function confirmUpload(options: ConfirmUploadOptions) {
  const { s3Key, presetId, inputValues = {}, outputSize } = options;

  const response = await fetch('/api/uploads/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      s3Key,
      presetId,
      inputValues,
      outputSize,
    }),
  });

  if (!response.ok) {
    const error = await response.json();

    // Create a custom error with the error code for better handling
    const customError = new Error(error.error || 'Failed to confirm upload');
    (customError as any).code = error.error;
    (customError as any).status = response.status;

    throw customError;
  }

  return response.json();
}

/**
 * Upload only: presign -> upload (no processing)
 */
export async function uploadOnly(options: UploadOptions) {
  const { file, onProgress, onSuccess, onError } = options;

  try {
    // Step 1: Get presigned URL
    const presignData = await requestPresignedUrl(file);

    // Step 2: Upload to S3
    await uploadToS3(presignData.url, file, presignData.headers, onProgress);

    onSuccess?.(presignData.key);
    return {
      s3Key: presignData.key,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    onError?.(errorMessage);
    throw error;
  }
}

/**
 * Complete upload flow: presign -> upload -> confirm
 */
export async function uploadAndProcess(options: UploadOptions & Omit<ConfirmUploadOptions, 's3Key'>) {
  const { file, onProgress, onSuccess, onError, ...confirmOptions } = options;

  try {
    // Step 1: Get presigned URL
    const presignData = await requestPresignedUrl(file);

    // Step 2: Upload to S3
    await uploadToS3(presignData.url, file, presignData.headers, onProgress);

    // Step 3: Confirm upload and start processing
    const confirmResult = await confirmUpload({
      s3Key: presignData.key,
      ...confirmOptions,
    });

    onSuccess?.(presignData.key);
    return {
      s3Key: presignData.key,
      jobId: confirmResult.jobId,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    onError?.(errorMessage);
    throw error;
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, userTier: 'FREE' | 'PRO' | 'CREATOR' = 'FREE') {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const sizeLimits = {
    FREE: 5 * 1024 * 1024,      // 5MB
    PRO: 20 * 1024 * 1024,      // 20MB
    CREATOR: 50 * 1024 * 1024 // 50MB
  };

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    };
  }

  const maxSize = sizeLimits[userTier];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size for ${userTier} tier is ${maxSize / (1024 * 1024)}MB.`,
    };
  }

  return { valid: true };
}