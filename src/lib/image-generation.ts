import { OUTPUT_SIZES, type OutputSize } from '@/lib/constants';

interface GenerateImageParams {
  // selectedImage: string | null;
  presetId: string;
  inputValues: Record<string, string>;
  otherIdeas: string;
  selectedOutputSize: OutputSize;
}

interface GenerationResult {
  success: boolean;
  generatedImages?: Array<{ url: string; aspectRatio: string }>;
  error?: string;
}

export async function generateImage(params: GenerateImageParams): Promise<GenerationResult> {
  const {
    // selectedImage,
    presetId,
    inputValues,
    otherIdeas,
    selectedOutputSize
  } = params;

  console.log("params Received");
  console.log(params);

  // if (!selectedImage || !presetId) {
  if (!presetId) {
    return { success: false, error: 'Missing required parameters' };
  }

  try {
    // Add other ideas to input values if provided
    const finalInputValues = { ...inputValues };
    if (otherIdeas.trim()) {
      finalInputValues['additional_ideas'] = otherIdeas;
    }

    const response = await fetch('/api/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `${presetId}-${Date.now()}-${Math.random()}`
      },
      body: JSON.stringify({
        presetId,
        inputValues: finalInputValues,
        outputSize: selectedOutputSize
      }),
    });

    const result = await response.json();

    if (result.jobId) {
      // Job was queued successfully, now poll for completion
      return await pollForCompletion(result.jobId, selectedOutputSize);
    } else {
      return {
        success: false,
        error: result.error || 'Failed to queue image generation'
      };
    }

  } catch (error) {
    console.error('Generation error:', error);
    return {
      success: false,
      error: 'An error occurred during generation'
    };
  }
}

// Poll for job completion
async function pollForCompletion(jobId: string, selectedOutputSize: OutputSize): Promise<GenerationResult> {
  const maxAttempts = 60; // 5 minutes max (5s intervals)
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`/api/generations/${jobId}`);
      const result = await response.json();

      if (result.status === 'COMPLETED' && result.outputUrl) {
        const selectedAspectRatio = OUTPUT_SIZES[selectedOutputSize].aspectRatio;
        
        // Return the single generated image
        const generatedImages = [
          {
            url: result.outputUrl,
            aspectRatio: selectedAspectRatio
          }
        ];

        return {
          success: true,
          generatedImages: generatedImages
        };
      }

      if (result.status === 'FAILED' || result.status === 'CANCELED') {
        return {
          success: false,
          error: result.error || 'Generation failed'
        };
      }

      // Still processing, wait and retry
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
      attempts++;

    } catch (error) {
      console.error('Polling error:', error);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  return {
    success: false,
    error: 'Generation timed out'
  };
}