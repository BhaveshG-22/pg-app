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

export class FluxKontextProvider implements Provider {
  async generate(params: ProviderParams): Promise<ProviderResult> {
    const { prompt, outputSize, uploadedImageUrl } = params;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('Replicate API token not configured');
    }

    const dimensions = OUTPUT_SIZE_MAP[outputSize as keyof typeof OUTPUT_SIZE_MAP] || OUTPUT_SIZE_MAP.SQUARE;

    try {
      console.log(`Generating FLUX-1 Kontext image: ${prompt.slice(0, 100)}...`);

      const client = getReplicateClient();

      if (uploadedImageUrl) {
        console.log('Using uploaded image for FLUX-1 Kontext transformation:', uploadedImageUrl);

        const input = {
          prompt: prompt,
          image: uploadedImageUrl,
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 28,
          guidance_scale: 3.5,
          strength: 0.8,
          seed: Math.floor(Math.random() * 1000000)
        };

        console.log('FLUX-1 Kontext input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          hasImage: !!input.image,
          dimensions: `${input.width}x${input.height}`,
          strength: input.strength,
          steps: input.num_inference_steps
        });

        const output = await client.run("black-forest-labs/flux-1.1-pro", { input });

        console.log('=== FLUX-1 KONTEXT RESPONSE DEBUG ===');
        console.log('Type:', typeof output);
        console.log('Value:', output);
        console.log('Is Array:', Array.isArray(output));
        console.log('=== END DEBUG ===');

        let outputUrl: string;

        if (output && typeof (output as any).url === 'function') {
          outputUrl = (output as any).url();
        } else if (Array.isArray(output) && output.length > 0) {
          const firstItem = output[0];
          if (firstItem && typeof (firstItem as any).url === 'function') {
            outputUrl = (firstItem as any).url();
          } else if (typeof firstItem === 'string') {
            outputUrl = firstItem;
          } else {
            throw new Error('Unexpected output format from FLUX-1 Kontext');
          }
        } else if (typeof output === 'string') {
          outputUrl = output;
        } else {
          throw new Error('No output returned from FLUX-1 Kontext');
        }

        if (!outputUrl || !outputUrl.startsWith('http')) {
          throw new Error(`Invalid image URL returned from FLUX-1 Kontext: ${outputUrl}`);
        }

        console.log('FLUX-1 Kontext generated image URL:', outputUrl);

        const response = await fetch(outputUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch FLUX-1 Kontext result: ${response.status}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'flux-kontext-result.png');

        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400);

        console.log('Uploaded FLUX-1 Kontext result to S3:', s3Key);

        return {
          outputUrl: imageUrl,
          engine: 'flux-kontext-img2img',
          engineMeta: {
            model: 'black-forest-labs/flux-1.1-pro',
            provider: 'replicate',
            dimensions,
            strength: input.strength,
            guidance_scale: input.guidance_scale,
            num_inference_steps: input.num_inference_steps,
            type: 'image_to_image',
            debug_output: output
          }
        };

      } else {
        const input = {
          prompt: prompt,
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 28,
          guidance_scale: 3.5,
          seed: Math.floor(Math.random() * 1000000)
        };

        console.log('FLUX-1 Kontext text2img input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          dimensions: `${input.width}x${input.height}`,
          steps: input.num_inference_steps,
          guidance: input.guidance_scale
        });

        const output = await client.run("black-forest-labs/flux-1.1-pro", { input });

        let outputUrl: string;
        if (output && typeof (output as any).url === 'function') {
          outputUrl = (output as any).url();
        } else if (Array.isArray(output) && output.length > 0) {
          const firstItem = output[0];
          if (firstItem && typeof (firstItem as any).url === 'function') {
            outputUrl = (firstItem as any).url();
          } else if (typeof firstItem === 'string') {
            outputUrl = firstItem;
          } else {
            throw new Error('Unexpected output format from FLUX-1 Kontext');
          }
        } else if (typeof output === 'string') {
          outputUrl = output;
        } else {
          throw new Error('No output returned from FLUX-1 Kontext');
        }

        const response = await fetch(outputUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch FLUX-1 Kontext result: ${response.status}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'flux-kontext-generated.png');

        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400);

        return {
          outputUrl: imageUrl,
          engine: 'flux-kontext-txt2img',
          engineMeta: {
            model: 'black-forest-labs/flux-1.1-pro',
            provider: 'replicate',
            dimensions,
            guidance_scale: input.guidance_scale,
            num_inference_steps: input.num_inference_steps,
            type: 'text_to_image'
          }
        };
      }

    } catch (error) {
      console.error('FLUX-1 Kontext image generation error:', error);
      throw new Error(error instanceof Error ? error.message : 'FLUX-1 Kontext generation failed');
    }
  }
}