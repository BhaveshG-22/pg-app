const { PrismaClient } = require('@prisma/client');
const { getProvider } = require('./providers');
const { createPresignedGetUrl } = require('./s3');

const prisma = new PrismaClient();

async function callEngineAndUploadToS3(params) {
  const { presetId, inputValues, outputSize, signal, generationId } = params;

  // Get preset details including provider
  const preset = await prisma.preset.findUnique({
    where: { id: presetId },
    select: { prompt: true, title: true, provider: true }
  });

  if (!preset) {
    throw new Error('Preset not found');
  }

  // Check if there's an uploaded image to process
  const uploadedImageKey = inputValues.__uploadedImageKey;
  let uploadedImageUrl;

  if (uploadedImageKey) {
    console.log('Processing uploaded image:', uploadedImageKey);
    // Create a temporary signed URL for the provider to access the uploaded image
    uploadedImageUrl = await createPresignedGetUrl(uploadedImageKey, 3600); // 1 hour
    console.log('Created signed URL for uploaded image');
  }

  // Build prompt by replacing placeholders (excluding internal keys)
  let finalPrompt = preset.prompt;
  Object.entries(inputValues).forEach(([key, value]) => {
    if (!key.startsWith('__')) { // Skip internal keys like __uploadedImageKey
      finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
  });

  // Get the appropriate provider and generate image
  const provider = getProvider(preset.provider);
  const result = await provider.generate({
    prompt: finalPrompt,
    outputSize,
    signal,
    uploadedImageUrl // Pass the uploaded image URL if available
  });

  console.log("ENGINE result");
  console.log(result);

  // Validate and sanitize the result
  console.log('=== ENGINE RESULT DEBUG ===');
  console.log('Result type:', typeof result);
  console.log('Result value:', result);
  console.log('OutputUrl type:', typeof result?.outputUrl);
  console.log('OutputUrl value:', result?.outputUrl);
  console.log('=== END ENGINE DEBUG ===');

  if (!result || typeof result !== 'object') {
    throw new Error('Provider returned invalid result');
  }

  if (!result.outputUrl || typeof result.outputUrl !== 'string') {
    console.error('Invalid outputUrl from provider:', typeof result.outputUrl, result.outputUrl);
    console.error('Full result object:', JSON.stringify(result, null, 2));
    throw new Error('Provider returned invalid outputUrl');
  }

  return {
    outputUrl: result.outputUrl,
    engine: result.engine || 'unknown',
    engineMeta: result.engineMeta || {}
  };
}

module.exports = { callEngineAndUploadToS3 };