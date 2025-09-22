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

export class NanoBananaProvider implements Provider {
  async generate(params: ProviderParams): Promise<ProviderResult> {
    const { prompt, outputSize, uploadedImageUrl } = params;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('Replicate API token not configured');
    }

    const dimensions = OUTPUT_SIZE_MAP[outputSize as keyof typeof OUTPUT_SIZE_MAP] || OUTPUT_SIZE_MAP.SQUARE;

    try {
      console.log(`Generating Nano Banana image: ${prompt.slice(0, 100)}...`);

      const client = getReplicateClient();

      if (uploadedImageUrl) {
        console.log('Using uploaded image for Nano Banana transformation:', uploadedImageUrl);

        // Since S3 bucket is now public, convert presigned URL to direct S3 URL
        const inputS3Key = uploadedImageUrl.split('?')[0].split('/').slice(3).join('/'); // Extract key from presigned URL
        const publicImageUrl = `https://pixelglow-user-uploads.s3.us-east-1.amazonaws.com/${inputS3Key}`;
        console.log('Using direct S3 URL (bucket is now public):', publicImageUrl);

        // Use google/nano-banana for image transformation
        const input = {
          prompt: prompt,
          image_input: [publicImageUrl], // Input image for transformation (array format)
          output_format: "png"
        };

        console.log('Nano Banana input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          hasImages: input.image_input && input.image_input.length > 0,
          imageCount: input.image_input ? input.image_input.length : 0,
          firstImageUrl: input.image_input && input.image_input[0] ? input.image_input[0].slice(0, 100) + '...' : 'none',
          outputFormat: input.output_format
        });

        console.log('=== FULL NANO BANANA INPUT DEBUG ===');
        console.log(JSON.stringify(input, null, 2));
        console.log('=== END FULL INPUT DEBUG ===');

        const output = await client.run("google/nano-banana", { input });

        console.log('=== NANO BANANA RESPONSE DEBUG ===');
        console.log('Type:', typeof output);
        console.log('Value:', output);
        console.log('Is Array:', Array.isArray(output));
        console.log('=== END DEBUG ===');

        // Handle ReadableStream response from Replicate
        let imageBuffer: Buffer;

        if (output && output instanceof ReadableStream) {
          // Convert ReadableStream to buffer
          console.log('Nano Banana returned ReadableStream, converting to buffer');
          const response = new Response(output);
          imageBuffer = Buffer.from(await response.arrayBuffer());
          console.log('Converted ReadableStream to buffer, size:', imageBuffer.length);
        } else if (output && typeof (output as any).url === 'function') {
          // File object with url() method
          const outputUrl = (output as any).url();
          if (!outputUrl || !outputUrl.startsWith('http')) {
            throw new Error(`Invalid image URL returned from Nano Banana: ${outputUrl}`);
          }
          console.log('Nano Banana generated image URL:', outputUrl);
          const response = await fetch(outputUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch Nano Banana result: ${response.status}`);
          }
          imageBuffer = Buffer.from(await response.arrayBuffer());
        } else if (Array.isArray(output) && output.length > 0) {
          // Array of results
          const firstItem = output[0];
          if (firstItem && typeof (firstItem as any).url === 'function') {
            const outputUrl = (firstItem as any).url();
            if (!outputUrl || !outputUrl.startsWith('http')) {
              throw new Error(`Invalid image URL returned from Nano Banana: ${outputUrl}`);
            }
            console.log('Nano Banana generated image URL:', outputUrl);
            const response = await fetch(outputUrl);
            if (!response.ok) {
              throw new Error(`Failed to fetch Nano Banana result: ${response.status}`);
            }
            imageBuffer = Buffer.from(await response.arrayBuffer());
          } else if (typeof firstItem === 'string' && firstItem.startsWith('http')) {
            console.log('Nano Banana generated image URL:', firstItem);
            const response = await fetch(firstItem);
            if (!response.ok) {
              throw new Error(`Failed to fetch Nano Banana result: ${response.status}`);
            }
            imageBuffer = Buffer.from(await response.arrayBuffer());
          } else {
            throw new Error('Unexpected output format from Nano Banana');
          }
        } else {
          throw new Error('No valid output returned from Nano Banana');
        }

        // Upload the image buffer to S3
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'nano-banana-result.png');

        // Create direct S3 URL (bucket is public)
        const imageUrl = `https://pixelglow-user-uploads.s3.us-east-1.amazonaws.com/${s3Key}`;

        console.log('Uploaded Nano Banana result to S3:', s3Key);

        return {
          outputUrl: imageUrl,
          engine: 'nano-banana',
          engineMeta: {
            model: 'google/nano-banana',
            dimensions,
            type: 'image_transformation',
            debug_output: output
          }
        };

      } else {
        // For text-to-image generation without input image
        const input = {
          prompt: prompt,
          output_format: "png"
        };

        console.log('Nano Banana text-to-image input:', {
          prompt: input.prompt.slice(0, 100) + '...',
          outputFormat: input.output_format
        });

        const output = await client.run("google/nano-banana", { input });

        // Handle ReadableStream response from Replicate (same as image-to-image)
        let imageBuffer: Buffer;

        if (output && output instanceof ReadableStream) {
          // Convert ReadableStream to buffer
          console.log('Nano Banana returned ReadableStream, converting to buffer');
          const response = new Response(output);
          imageBuffer = Buffer.from(await response.arrayBuffer());
          console.log('Converted ReadableStream to buffer, size:', imageBuffer.length);
        } else if (output && typeof (output as any).url === 'function') {
          // File object with url() method
          const outputUrl = (output as any).url();
          if (!outputUrl || !outputUrl.startsWith('http')) {
            throw new Error(`Invalid image URL returned from Nano Banana: ${outputUrl}`);
          }
          console.log('Nano Banana generated image URL:', outputUrl);
          const response = await fetch(outputUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch Nano Banana result: ${response.status}`);
          }
          imageBuffer = Buffer.from(await response.arrayBuffer());
        } else if (Array.isArray(output) && output.length > 0) {
          // Array of results
          const firstItem = output[0];
          if (firstItem && typeof (firstItem as any).url === 'function') {
            const outputUrl = (firstItem as any).url();
            if (!outputUrl || !outputUrl.startsWith('http')) {
              throw new Error(`Invalid image URL returned from Nano Banana: ${outputUrl}`);
            }
            console.log('Nano Banana generated image URL:', outputUrl);
            const response = await fetch(outputUrl);
            if (!response.ok) {
              throw new Error(`Failed to fetch Nano Banana result: ${response.status}`);
            }
            imageBuffer = Buffer.from(await response.arrayBuffer());
          } else if (typeof firstItem === 'string' && firstItem.startsWith('http')) {
            console.log('Nano Banana generated image URL:', firstItem);
            const response = await fetch(firstItem);
            if (!response.ok) {
              throw new Error(`Failed to fetch Nano Banana result: ${response.status}`);
            }
            imageBuffer = Buffer.from(await response.arrayBuffer());
          } else {
            throw new Error('Unexpected output format from Nano Banana');
          }
        } else {
          throw new Error('No valid output returned from Nano Banana');
        }
        const { uploadImageToS3 } = await import('../s3');
        const s3Key = await uploadImageToS3(imageBuffer, 'nano-banana-generated.png');

        // Create direct S3 URL (bucket is public)
        const imageUrl = `https://pixelglow-user-uploads.s3.us-east-1.amazonaws.com/${s3Key}`;

        return {
          outputUrl: imageUrl,
          engine: 'nano-banana',
          engineMeta: {
            model: 'google/nano-banana',
            dimensions,
            type: 'text_to_image'
          }
        };
      }

    } catch (error) {
      console.error('Nano Banana image generation error:', error);
      throw new Error(error instanceof Error ? error.message : 'Nano Banana generation failed');
    }
  }
}