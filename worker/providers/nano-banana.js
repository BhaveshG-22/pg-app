const Replicate = require('replicate');
const { Provider } = require('./types');

// Nano Banana only supports one standard size
const NANO_BANANA_SIZE = '1024x1024';

class NanoBananaProvider extends Provider {
  constructor() {
    super();
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error('Replicate API token not configured');
      }
      this.client = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });
    }
    return this.client;
  }

  async generate(params) {
    const { prompt, uploadedImageUrl } = params;

    try {
      console.log(`[NanoBanana] Generating image: ${prompt.slice(0, 100)}...`);

      const client = this.getClient();

      // Nano Banana model configuration
      const input = {
        prompt,
        output_format: "jpg"
      };

      // Add image input if provided
      if (uploadedImageUrl) {
        console.log('[NanoBanana] Using uploaded image for img2img:', uploadedImageUrl);
        input.image_input = [uploadedImageUrl];
        input.aspect_ratio = "match_input_image";
      } else {
        input.aspect_ratio = "1:1";
      }

      console.log('[NanoBanana] Input parameters:', {
        prompt: input.prompt,
        aspect_ratio: input.aspect_ratio,
        hasImage: !!input.image_input
      });

      // Use the nano-banana model
      const output = await client.run("google/nano-banana", { input });

      // Extract the output URL
      let outputUrl;

      if (output && typeof output.url === 'function') {
        // Handle File object from Replicate
        outputUrl = output.url();
        // Convert URL object to string if needed
        if (outputUrl && typeof outputUrl === 'object' && outputUrl.href) {
          outputUrl = outputUrl.href;
        } else if (outputUrl && typeof outputUrl === 'object') {
          // Force string conversion
          outputUrl = outputUrl.toString();
        }
      } else if (typeof output === 'string') {
        outputUrl = output;
      } else if (output && output.url && typeof output.url === 'string') {
        // Handle case where url is a string property
        outputUrl = output.url;
      } else {
        throw new Error('No output returned from Nano Banana');
      }

      if (!outputUrl || typeof outputUrl !== 'string' || !outputUrl.startsWith('http')) {
        throw new Error(`Invalid image URL returned from Nano Banana: ${JSON.stringify(outputUrl)}`);
      }

      console.log('[NanoBanana] Generated image URL:', outputUrl);

      return {
        outputUrl,
        engine: 'nano-banana',
        engineMeta: {
          model: 'google/nano-banana',
          via: 'replicate',
          aspect_ratio: input.aspect_ratio,
          type: uploadedImageUrl ? 'img2img' : 'text2img',
          prompt,
          output_format: input.output_format
        }
      };

    } catch (error) {
      console.error('[NanoBanana] Generation error:', error);

      // Handle rate limiting
      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        throw new Error('RATE_LIMIT_REPLICATE');
      }

      // Handle quota/billing issues
      if (error.message?.includes('quota') || error.message?.includes('billing')) {
        throw new Error('QUOTA_EXCEEDED_REPLICATE');
      }

      throw new Error(`Nano Banana generation failed: ${error.message}`);
    }
  }
}

module.exports = { NanoBananaProvider };