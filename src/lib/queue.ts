import { Queue } from 'bullmq';

export const imageQueue = new Queue('image-generate', {
  connection: { 
    url: process.env.REDIS_URL! 
  }
});

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