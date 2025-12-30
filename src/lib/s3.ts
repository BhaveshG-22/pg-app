import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 client singleton
let s3Client: S3Client;

export function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3Client;
}

// Generate presigned URL for uploads
export async function createPresignedPutUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300 // 5 minutes default
) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}

// Generate presigned URL for downloads (if needed)
export async function createPresignedGetUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ResponseContentType: 'image/*',  // Explicitly set content type for images
  });

  return getSignedUrl(getS3Client(), command, {
    expiresIn,
    unhoistableHeaders: new Set(['x-amz-checksum-mode']) // Remove problematic headers
  });
}

// Helper to generate unique S3 keys
export function generateUploadKey(userId: string, originalFilename?: string): string {
  const timestamp = Date.now();
  const uuid = crypto.randomUUID();
  const extension = originalFilename?.split('.').pop() || 'jpg';
  
  return `uploads/${userId}/${timestamp}-${uuid}.${extension}`;
}

// Helper to generate result keys
export function generateResultKey(userId: string, generationId: string): string {
  const timestamp = Date.now();
  return `results/${userId}/${generationId}-${timestamp}.webp`;
}

// Validate file type and size
export function validateUpload(
  mimeType: string,
  fileSize: number,
  userTier: 'FREE' | 'PRO' | 'CREATOR' = 'FREE'
) {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
    };
  }

  // Size limits based on tier (in bytes)
  const sizeLimits = {
    FREE: 5 * 1024 * 1024,      // 5MB
    PRO: 20 * 1024 * 1024,      // 20MB
    CREATOR: 50 * 1024 * 1024 // 50MB
  };

  const maxSize = sizeLimits[userTier];
  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size for ${userTier} tier is ${maxSize / (1024 * 1024)}MB.`
    };
  }

  return { valid: true };
}

// Convert S3 key to full URL
export function s3KeyToUrl(s3Key: string): string {
  const bucket = process.env.S3_BUCKET || 'pixelglow-user-uploads';
  const region = process.env.AWS_REGION || 'us-east-1';
  return `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
}

// Extract S3 key from full URL
export function urlToS3Key(url: string): string {
  const bucket = process.env.S3_BUCKET || 'pixelglow-user-uploads';
  const region = process.env.AWS_REGION || 'us-east-1';
  const baseUrl = `https://${bucket}.s3.${region}.amazonaws.com/`;
  return url.replace(baseUrl, '');
}

// Upload buffer directly to S3
export async function uploadImageToS3(buffer: Buffer, filename: string): Promise<string> {
  const key = `generated/${Date.now()}-${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: 'image/jpeg',
  });

  await getS3Client().send(command);
  return key;
}