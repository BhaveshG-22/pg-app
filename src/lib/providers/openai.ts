import OpenAI from 'openai';
import { Provider, ProviderParams, ProviderResult } from './types';

let openai: OpenAI;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const OUTPUT_SIZE_MAP = {
  SQUARE: '1024x1024',
  PORTRAIT: '1024x1792',
  VERTICAL: '1024x1792',
  LANDSCAPE: '1792x1024',
  STANDARD: '1024x1024',
} as const;

/** Helper function to create a File object from URL */
async function fileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());

  // Create a File object that the OpenAI SDK expects
  return new File([buffer], 'image.png', { type: 'image/png' });
}

export class OpenAIProvider implements Provider {
  async generate(params: ProviderParams): Promise<ProviderResult> {
    const { prompt, outputSize, uploadedImageUrl } = params;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const imageSize = OUTPUT_SIZE_MAP[outputSize as keyof typeof OUTPUT_SIZE_MAP] || '1024x1024';

    try {
      console.log(`Generating OpenAI image: ${prompt.slice(0, 100)}...`);

      let response;

      if (uploadedImageUrl) {
        console.log('Using uploaded image for OpenAI transformation:', uploadedImageUrl);

        // Create File object from the presigned URL
        const imageFile = await fileFromUrl(uploadedImageUrl);

        // Use the image edit endpoint for image-to-image transformation
        response = await getOpenAIClient().images.edit({
          model: 'gpt-image-1', // New model for image edits
          prompt,
          image: imageFile,
          size: imageSize as '256x256' | '512x512' | '1024x1024',
          n: 1,
        });

        const resultImageUrl = response.data?.[0]?.url;
        if (!resultImageUrl) {
          throw new Error('No image returned from OpenAI edits API');
        }

        // Download the result and upload to S3 for consistent storage
        const resultResponse = await fetch(resultImageUrl);
        if (!resultResponse.ok) {
          throw new Error(`Failed to fetch OpenAI result: ${resultResponse.status}`);
        }

        const resultBuffer = Buffer.from(await resultResponse.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(resultBuffer, 'openai-edited.png');

        // Create presigned URL for the uploaded result
        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400); // 24 hours

        return {
          outputUrl: imageUrl,
          engine: 'gpt-image-1-edits',
          engineMeta: {
            model: 'gpt-image-1',
            size: imageSize,
            type: 'image_edit',
            prompt
          }
        };
      } else {
        // Standard image generation without input image
        response = await getOpenAIClient().images.generate({
          model: 'dall-e-3',
          prompt,
          size: imageSize as '1024x1024' | '1792x1024' | '1024x1792',
          quality: 'standard',
          style: 'vivid',
          n: 1,
        });

        const imageUrl = response.data?.[0]?.url;

        if (!imageUrl) {
          throw new Error('No image URL returned from OpenAI');
        }

        return {
          outputUrl: imageUrl,
          engine: 'dalle-3',
          engineMeta: {
            model: 'dall-e-3',
            size: imageSize,
            quality: 'standard',
            style: 'vivid',
            revised_prompt: response.data?.[0]?.revised_prompt
          }
        };
      }

    } catch (error) {
      console.error('OpenAI image generation error:', error);
      throw new Error(error instanceof Error ? error.message : 'OpenAI generation failed');
    }
  }
}