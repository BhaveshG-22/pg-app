const { prisma } = require('./prisma');
const { getProvider } = require('./providers');
const { uploadImageToS3, getPublicS3Url } = require('./s3');

/**
 * Core engine that processes image generation jobs
 */
class ImageGenerationEngine {
  constructor() {
    this.abortController = new AbortController();
  }

  /**
   * Process a single image generation job
   * @param {string} generationId - The generation ID to process
   * @returns {Promise<Object>} Processing result
   */
  async processGeneration(generationId) {
    console.log(`[Engine] Processing generation: ${generationId}`);

    // Load generation from database
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
      include: {
        user: { select: { id: true, credits: true } },
        preset: { select: { prompt: true, provider: true } }
      }
    });

    if (!generation) {
      throw new Error(`Generation not found: ${generationId}`);
    }

    if (generation.status === 'CANCELLED') {
      console.log(`[Engine] Generation ${generationId} is cancelled, skipping`);
      return { status: 'cancelled' };
    }

    console.log(`[Engine] Generation details:`, {
      id: generation.id,
      userId: generation.userId,
      status: generation.status,
      provider: generation.preset.provider,
      creditsUsed: generation.creditsUsed
    });

    // Build final prompt by replacing placeholders
    const finalPrompt = this.buildPrompt(generation.preset.prompt, generation.inputValues);

    // Extract uploaded image URL if present
    const uploadedImageUrl = generation.inputValues?.__uploadedImageKey
      ? await this.getUploadedImageUrl(generation.inputValues.__uploadedImageKey)
      : undefined;

    console.log(`[Engine] Final prompt: ${finalPrompt.slice(0, 200)}...`);
    if (uploadedImageUrl) {
      console.log(`[Engine] Using uploaded image: ${uploadedImageUrl.slice(0, 100)}...`);
    }

    // Get provider and generate image
    const provider = getProvider(generation.preset.provider);

    // Create timeout for provider call
    const timeoutMs = 12000; // 12 seconds
    const timeout = setTimeout(() => {
      this.abortController.abort('Provider timeout');
    }, timeoutMs);

    try {
      const result = await provider.generate({
        prompt: finalPrompt,
        outputSize: generation.outputSize,
        signal: this.abortController.signal,
        uploadedImageUrl
      });

      clearTimeout(timeout);

      console.log(`[Engine] Provider result:`, {
        engine: result.engine,
        hasUrl: !!result.outputUrl
      });

      // Download and upload to S3 for consistent storage
      const finalImageUrl = await this.downloadAndUploadToS3(
        result.outputUrl,
        generation.id,
        generation.userId
      );

      return {
        status: 'completed',
        outputUrl: finalImageUrl,
        engine: result.engine,
        engineMeta: result.engineMeta
      };

    } catch (error) {
      clearTimeout(timeout);

      console.error(`[Engine] Provider error:`, error.message);

      // Check if it's an abort error
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw new Error('PROVIDER_TIMEOUT');
      }

      throw error;
    }
  }

  /**
   * Build final prompt by replacing placeholders
   * @param {string} template - Prompt template with {{placeholders}}
   * @param {Object} inputValues - Values to replace placeholders
   * @returns {string} Final prompt
   */
  buildPrompt(template, inputValues) {
    let finalPrompt = template;

    Object.entries(inputValues || {}).forEach(([key, value]) => {
      // Skip internal keys
      if (!key.startsWith('__')) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        finalPrompt = finalPrompt.replace(placeholder, value);
      }
    });

    return finalPrompt;
  }

  /**
   * Get public URL for uploaded image (accessible to external services)
   * @param {string} imageKey - S3 key for uploaded image
   * @returns {Promise<string>} Public S3 URL
   */
  async getUploadedImageUrl(imageKey) {
    // Return public S3 URL instead of presigned URL for external service access
    return getPublicS3Url(imageKey);
  }

  /**
   * Download image from provider and upload to S3
   * @param {string} imageUrl - Provider's image URL
   * @param {string} generationId - Generation ID
   * @param {string} userId - User ID
   * @returns {Promise<string>} Final S3 presigned URL
   */
  async downloadAndUploadToS3(imageUrl, generationId, userId) {
    console.log(`[Engine] Downloading image from provider: ${imageUrl.slice(0, 100)}...`);

    // Download image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    console.log(`[Engine] Downloaded image, size: ${imageBuffer.length} bytes`);

    // Upload to S3
    const s3Key = await uploadImageToS3(imageBuffer, generationId, userId);
    console.log(`[Engine] Uploaded to S3: ${s3Key}`);

    // Return public S3 URL instead of presigned URL
    const publicUrl = getPublicS3Url(s3Key);
    console.log(`[Engine] Created public URL for result`);

    return publicUrl;
  }

  /**
   * Abort current processing
   */
  abort() {
    this.abortController.abort('Job cancelled');
  }
}

module.exports = { ImageGenerationEngine };