import { Queue } from 'bullmq';

let _imageQueue: Queue | null = null;

export function getImageQueue(): Queue {
  if (!_imageQueue) {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    _imageQueue = new Queue('image-generate', {
      connection: {
        url: redisUrl,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates for Aiven Redis
        }
      }
    });

    // Add error handling
    _imageQueue.on('error', (err) => {
      console.error('Queue error:', err);
    });
  }

  return _imageQueue;
}

// Job data interface for type safety
export interface ImageGenerationJobData {
  generationId: string;
  userId: string;
}

// Job result interface
export interface ImageGenerationJobResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

// Backward compatibility export
export const imageQueue = getImageQueue();