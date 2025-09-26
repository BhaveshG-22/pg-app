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
  SQUARE: { width: 1024, height: 1024 },
  PORTRAIT: { width: 768, height: 1024 },
  VERTICAL: { width: 768, height: 1344 },
  LANDSCAPE: { width: 1344, height: 768 },
  STANDARD: { width: 1024, height: 768 },
} as const;

export class SeedreamProvider implements Provider {
  async generate(params: ProviderParams): Promise<ProviderResult> {
    const { prompt, outputSize, uploadedImageUrl } = params;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('Replicate API token not configured');
    }

    const dimensions = OUTPUT_SIZE_MAP[outputSize as keyof typeof OUTPUT_SIZE_MAP] || OUTPUT_SIZE_MAP.SQUARE;

    try {
      console.log(`Generating Seedream image: ${prompt.slice(0, 100)}...`);

      const client = getReplicateClient();

      if (uploadedImageUrl) {
        console.log('Using uploaded image for Seedream transformation:', uploadedImageUrl);

        // Use the bytedance/seedream-3 model for image editing
        const input = {
          prompt: prompt,
          image: uploadedImageUrl, // Input image for transformation
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          strength: 0.8, // How much to change the original image (0.0-1.0)
          seed: Math.floor(Math.random() * 1000000) // Random seed for variation
        };

        console.log('Seedream input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          hasImage: !!input.image,
          dimensions: `${input.width}x${input.height}`,
          strength: input.strength
        });

        const output = await client.run("bytedance/seedream-3", { input });

        console.log('=== SEEDREAM RESPONSE DEBUG ===');
        console.log('Type:', typeof output);
        console.log('Value:', output);
        console.log('Is Array:', Array.isArray(output));
        console.log('=== END DEBUG ===');

        // Extract the output URL
        let outputUrl: string;

        if (output && typeof (output as any).url === 'function') {
          // File object with url() method (common case)
          outputUrl = (output as any).url();
        } else if (Array.isArray(output) && output.length > 0) {
          // Array of results
          const firstItem = output[0];
          if (firstItem && typeof (firstItem as any).url === 'function') {
            outputUrl = (firstItem as any).url();
          } else if (typeof firstItem === 'string') {
            outputUrl = firstItem;
          } else {
            throw new Error('Unexpected output format from Seedream');
          }
        } else if (typeof output === 'string') {
          outputUrl = output;
        } else {
          throw new Error('No output returned from Seedream');
        }

        if (!outputUrl || !outputUrl.startsWith('http')) {
          throw new Error(`Invalid image URL returned from Seedream: ${outputUrl}`);
        }

        console.log('Seedream generated image URL:', outputUrl);

        // Download the result and upload to S3 for consistent storage
        const response = await fetch(outputUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Seedream result: ${response.status}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'seedream-result.png');

        // Create presigned URL for the uploaded result
        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400); // 24 hours

        console.log('Uploaded Seedream result to S3:', s3Key);

        return {
          outputUrl: imageUrl,
          engine: 'seedream-3',
          engineMeta: {
            model: 'bytedance/seedream-3',
            dimensions,
            strength: input.strength,
            guidance_scale: input.guidance_scale,
            num_inference_steps: input.num_inference_steps,
            type: 'image_transformation',
            debug_output: output
          }
        };

      } else {
        // For text-to-image generation without input image
        const input = {
          prompt: prompt,
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000)
        };

        console.log('Seedream text-to-image input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          dimensions: `${input.width}x${input.height}`
        });

        const output = await client.run("bytedance/seedream-3", { input });

        // Extract URL same way as above
        let outputUrl: string;
        if (output && typeof (output as any).url === 'function') {
          // File object with url() method (common case)
          outputUrl = (output as any).url();
        } else if (Array.isArray(output) && output.length > 0) {
          const firstItem = output[0];
          if (firstItem && typeof (firstItem as any).url === 'function') {
            outputUrl = (firstItem as any).url();
          } else if (typeof firstItem === 'string') {
            outputUrl = firstItem;
          } else {
            throw new Error('Unexpected output format from Seedream');
          }
        } else if (typeof output === 'string') {
          outputUrl = output;
        } else {
          throw new Error('No output returned from Seedream');
        }

        // Download and upload to S3
        const response = await fetch(outputUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Seedream result: ${response.status}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'seedream-generated.png');

        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400);

        return {
          outputUrl: imageUrl,
          engine: 'seedream-3',
          engineMeta: {
            model: 'bytedance/seedream-3',
            dimensions,
            guidance_scale: input.guidance_scale,
            num_inference_steps: input.num_inference_steps,
            type: 'text_to_image'
          }
        };
      }

    } catch (error) {
      console.error('Seedream image generation error:', error);
      throw new Error(error instanceof Error ? error.message : 'Seedream generation failed');
    }
  }
}