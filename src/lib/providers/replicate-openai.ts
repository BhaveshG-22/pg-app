import Replicate from 'replicate';
import { Provider, ProviderParams, ProviderResult } from './types';

let replicate: Replicate;

function getReplicateClient() {
  if (!replicate) {
    replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  return replicate;
}

const OUTPUT_SIZE_MAP = {
  SQUARE: '1024x1024',
  PORTRAIT: '1024x1792',
  VERTICAL: '1024x1792',
  LANDSCAPE: '1792x1024',
  STANDARD: '1024x1024',
} as const;

export class ReplicateOpenAIProvider implements Provider {
  async generate(params: ProviderParams): Promise<ProviderResult> {
    const { prompt, outputSize, uploadedImageUrl } = params;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('Replicate API token not configured');
    }


    const imageSize = OUTPUT_SIZE_MAP[outputSize as keyof typeof OUTPUT_SIZE_MAP] || '1024x1024';

    try {
      console.log(`Generating Replicate OpenAI image: ${prompt.slice(0, 100)}...`);

      const client = getReplicateClient();

      if (uploadedImageUrl) {
        console.log('Using uploaded image for Replicate OpenAI transformation:', uploadedImageUrl);

        // Use the openai/gpt-image-1 model through Replicate for image editing
        const input = {
          prompt: prompt,
          input_images: [uploadedImageUrl] // Array of input images
        };

        console.log('Replicate OpenAI input:', {
          prompt: input.prompt,
          hasInputImages: !!input.input_images.length
        });

        const output = await client.run("openai/gpt-image-1", { input });

        console.log('=== REPLICATE OPENAI RESPONSE DEBUG ===');
        console.log('Type:', typeof output);
        console.log('Value:', output);
        console.log('Is Array:', Array.isArray(output));
        console.log('=== END DEBUG ===');

        // Extract the output URL
        let outputUrl: string;

        if (Array.isArray(output) && output.length > 0) {
          // Check if output items have url() method (File objects)
          const firstItem = output[0];
          if (firstItem && typeof firstItem.url === 'function') {
            outputUrl = firstItem.url();
          } else if (typeof firstItem === 'string') {
            outputUrl = firstItem;
          } else {
            throw new Error('Unexpected output format from Replicate OpenAI');
          }
        } else {
          throw new Error('No output returned from Replicate OpenAI');
        }

        if (!outputUrl || !outputUrl.startsWith('http')) {
          throw new Error(`Invalid image URL returned from Replicate OpenAI: ${outputUrl}`);
        }

        console.log('Replicate OpenAI generated image URL:', outputUrl);

        // Download the result and upload to S3 for consistent storage
        const response = await fetch(outputUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Replicate OpenAI result: ${response.status}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'replicate-openai-result.png');

        // Create presigned URL for the uploaded result
        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400); // 24 hours

        console.log('Uploaded Replicate OpenAI result to S3:', s3Key);

        return {
          outputUrl: imageUrl,
          engine: 'replicate-openai-gpt-image-1',
          engineMeta: {
            model: 'openai/gpt-image-1',
            via: 'replicate',
            size: imageSize,
            type: 'image_edit',
            prompt,
            debug_output: output
          }
        };

      } else {
        // For text-to-image generation without input image, fall back to standard generation
        // Note: The openai/gpt-image-1 model on Replicate is primarily for image editing
        // For pure text-to-image, we might want to use a different approach
        throw new Error('Replicate OpenAI provider currently only supports image-to-image transformations');
      }

    } catch (error) {
      console.error('Replicate OpenAI image generation error:', error);
      throw new Error(error instanceof Error ? error.message : 'Replicate OpenAI generation failed');
    }
  }
}