export interface UserImage {
    id: string;
    fileName: string;
    originalFileName: string;
    fileSize: number;
    mimeType: string;
    url: string; // S3 key
    thumbnailUrl: string; // S3 key
    width: number;
    height: number;
    uploadedAt: string;
    displayUrl?: string; // Presigned URL for display
    thumbnailDisplayUrl?: string; // Presigned URL for thumbnail
  }
  