import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ImageGenerationOptions {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
}

export interface ImageGenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: 'OpenAI API key not configured'
      };
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: options.prompt,
      size: options.size || '1024x1024',
      quality: options.quality || 'standard',
      style: options.style || 'vivid',
      n: options.n || 1,
    });

    const imageUrl = response.data?.[0]?.url;
    
    if (!imageUrl) {
      return {
        success: false,
        error: 'No image URL returned from OpenAI'
      };
    }

    return {
      success: true,
      imageUrl
    };
  } catch (error) {
    console.error('OpenAI image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export const IMAGE_GENERATION_PROVIDERS = {
  openai: 'OpenAI DALL-E 3'
} as const;

export type ImageGenerationProvider = keyof typeof IMAGE_GENERATION_PROVIDERS;