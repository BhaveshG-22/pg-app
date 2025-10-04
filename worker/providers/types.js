/**
 * Base provider interface for AI image generation
 */
class Provider {
  /**
   * Generate image from prompt
   * @param {ProviderParams} params - Generation parameters
   * @returns {Promise<ProviderResult>} - Generation result
   */
  async generate(params) {
    throw new Error('Provider generate method must be implemented');
  }
}

/**
 * @typedef {Object} ProviderParams
 * @property {string} prompt - Text prompt for image generation
 * @property {string} outputSize - Output image size (SQUARE, PORTRAIT, LANDSCAPE, etc.)
 * @property {AbortSignal} [signal] - Abort signal for cancellation
 * @property {string} [uploadedImageUrl] - URL of uploaded image for processing
 */

/**
 * @typedef {Object} ProviderResult
 * @property {string} outputUrl - URL of generated image
 * @property {string} engine - Engine/model used for generation
 * @property {Object} engineMeta - Additional metadata from engine
 */

module.exports = { Provider };