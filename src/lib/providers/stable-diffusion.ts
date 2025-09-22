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

export class StableDiffusionProvider implements Provider {
  async generate(params: ProviderParams): Promise<ProviderResult> {
    const { prompt, outputSize, uploadedImageUrl } = params;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('Replicate API token not configured');
    }

    const dimensions = OUTPUT_SIZE_MAP[outputSize as keyof typeof OUTPUT_SIZE_MAP] || OUTPUT_SIZE_MAP.SQUARE;

    try {
      console.log(`Generating Stable Diffusion image: ${prompt.slice(0, 100)}...`);

      const client = getReplicateClient();

      if (uploadedImageUrl) {
        console.log('Using uploaded image for Stable Diffusion img2img:', uploadedImageUrl);

        // Use stability-ai/stable-diffusion for image-to-image transformation
        const input = {
          prompt: prompt,
          image: uploadedImageUrl, // Input image for img2img
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          strength: 0.8, // How much to change the original image (0.0-1.0)
          scheduler: "K_EULER_ANCESTRAL", // Sampling method
          seed: Math.floor(Math.random() * 1000000), // Random seed
          negative_prompt: "blurry, low quality, distorted, deformed" // What to avoid
        };

        console.log('Stable Diffusion img2img input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          hasImage: !!input.image,
          dimensions: `${input.width}x${input.height}`,
          strength: input.strength,
          steps: input.num_inference_steps
        });

        const output = await client.run("stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", { input });

        console.log('=== STABLE DIFFUSION RESPONSE DEBUG ===');
        console.log('Type:', typeof output);
        console.log('Value:', output);
        console.log('Is Array:', Array.isArray(output));
        console.log('=== END DEBUG ===');

        // Extract the output URL
        let outputUrl: string;

        if (output && typeof (output as any).url === 'function') {
          // File object with url() method
          outputUrl = (output as any).url();
        } else if (Array.isArray(output) && output.length > 0) {
          // Array of results
          const firstItem = output[0];
          if (firstItem && typeof (firstItem as any).url === 'function') {
            outputUrl = (firstItem as any).url();
          } else if (typeof firstItem === 'string') {
            outputUrl = firstItem;
          } else {
            throw new Error('Unexpected output format from Stable Diffusion');
          }
        } else if (typeof output === 'string') {
          outputUrl = output;
        } else {
          throw new Error('No output returned from Stable Diffusion');
        }

        if (!outputUrl || !outputUrl.startsWith('http')) {
          throw new Error(`Invalid image URL returned from Stable Diffusion: ${outputUrl}`);
        }

        console.log('Stable Diffusion generated image URL:', outputUrl);

        // Download the result and upload to S3 for consistent storage
        const response = await fetch(outputUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Stable Diffusion result: ${response.status}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'stable-diffusion-result.png');

        // Create presigned URL for the uploaded result
        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400); // 24 hours

        console.log('Uploaded Stable Diffusion result to S3:', s3Key);

        return {
          outputUrl: imageUrl,
          engine: 'stable-diffusion-img2img',
          engineMeta: {
            model: 'stability-ai/stable-diffusion',
            dimensions,
            strength: input.strength,
            guidance_scale: input.guidance_scale,
            num_inference_steps: input.num_inference_steps,
            scheduler: input.scheduler,
            type: 'image_to_image',
            negative_prompt: input.negative_prompt,
            debug_output: output
          }
        };

      } else {
        // For text-to-image generation without input image
        const input = {
          prompt: prompt,
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "K_EULER_ANCESTRAL",
          seed: Math.floor(Math.random() * 1000000),
          negative_prompt: "blurry, low quality, distorted, deformed"
        };

        console.log('Stable Diffusion text2img input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          dimensions: `${input.width}x${input.height}`,
          steps: input.num_inference_steps,
          guidance: input.guidance_scale
        });

        const output = await client.run("stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", { input });

        // Extract URL same way as above
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
            throw new Error('Unexpected output format from Stable Diffusion');
          }
        } else if (typeof output === 'string') {
          outputUrl = output;
        } else {
          throw new Error('No output returned from Stable Diffusion');
        }

        // Download and upload to S3
        const response = await fetch(outputUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Stable Diffusion result: ${response.status}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'stable-diffusion-generated.png');

        const { createPresignedGetUrl } = await import('../s3');
        const imageUrl = await createPresignedGetUrl(s3Key, 86400);

        return {
          outputUrl: imageUrl,
          engine: 'stable-diffusion-txt2img',
          engineMeta: {
            model: 'stability-ai/stable-diffusion',
            dimensions,
            guidance_scale: input.guidance_scale,
            num_inference_steps: input.num_inference_steps,
            scheduler: input.scheduler,
            type: 'text_to_image',
            negative_prompt: input.negative_prompt
          }
        };
      }

    } catch (error) {
      console.error('Stable Diffusion image generation error:', error);
      throw new Error(error instanceof Error ? error.message : 'Stable Diffusion generation failed');
    }
  }
}