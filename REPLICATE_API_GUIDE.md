# Replicate API Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Schema & Input Structure](#schema--input-structure)
4. [API Call Patterns](#api-call-patterns)
5. [Response Handling](#response-handling)
6. [Supported Models](#supported-models)
7. [Best Practices](#best-practices)
8. [Code Examples](#code-examples)

---

## Overview

Replicate is a platform for running machine learning models in the cloud. This guide explains how we integrate with Replicate's API for AI image generation in our application.

### Key Concepts

- **Model**: A specific AI model hosted on Replicate (e.g., `google/nano-banana`, `stability-ai/stable-diffusion`)
- **Input**: Parameters sent to the model (prompt, dimensions, etc.)
- **Output**: Results returned by the model (typically image URLs or file objects)
- **Prediction**: A single execution of a model with specific inputs

---

## Authentication

### Setup

```typescript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
```

### Environment Variable

Add to your `.env` file:
```bash
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Security Note**: Never expose your API token in client-side code or commit it to version control.

---

## Schema & Input Structure

### Common Input Parameters

Different models accept different parameters, but here are the most common ones:

#### Text-to-Image Generation

```typescript
interface TextToImageInput {
  prompt: string;                    // Required: Text description
  width?: number;                    // Image width (default: 1024)
  height?: number;                   // Image height (default: 1024)
  num_inference_steps?: number;      // Quality/speed tradeoff (20-150)
  guidance_scale?: number;           // Prompt adherence (1-20)
  seed?: number;                     // For reproducibility
  negative_prompt?: string;          // What to avoid
  output_format?: string;            // "png" | "jpg" | "webp"
}
```

#### Image-to-Image Transformation

```typescript
interface ImageToImageInput {
  prompt: string;                    // Required: Transformation description
  image: string;                     // Required: Input image URL
  width?: number;                    // Output width
  height?: number;                   // Output height
  strength?: number;                 // Transformation intensity (0.0-1.0)
  num_inference_steps?: number;      // Quality iterations
  guidance_scale?: number;           // Prompt strength
  seed?: number;                     // Random seed
  negative_prompt?: string;          // Undesired features
}
```

### Model-Specific Schemas

#### 1. Google Nano Banana

```typescript
// Text-to-Image
const input = {
  prompt: "a beautiful sunset over mountains",
  output_format: "png"
};

// Image-to-Image
const input = {
  prompt: "transform this into a watercolor painting",
  image_input: ["https://example.com/image.jpg"], // Array format
  output_format: "png"
};
```

#### 2. Stable Diffusion

```typescript
// Text-to-Image
const input = {
  prompt: "a serene lake at dawn",
  width: 1024,
  height: 1024,
  num_inference_steps: 50,
  guidance_scale: 7.5,
  scheduler: "K_EULER_ANCESTRAL",
  seed: 42,
  negative_prompt: "blurry, low quality, distorted"
};

// Image-to-Image
const input = {
  prompt: "make it look like an oil painting",
  image: "https://example.com/photo.jpg",
  width: 1024,
  height: 1024,
  strength: 0.8,                     // 80% transformation
  num_inference_steps: 50,
  guidance_scale: 7.5
};
```

#### 3. FLUX-1.1 Pro (Kontext)

```typescript
const input = {
  prompt: "futuristic cityscape at night",
  width: 1344,
  height: 768,
  num_inference_steps: 28,
  guidance_scale: 3.5,
  seed: Math.floor(Math.random() * 1000000)
};
```

#### 4. OpenAI via Replicate

```typescript
// Image transformation only
const input = {
  prompt: "enhance the colors and add dramatic lighting",
  input_images: ["https://example.com/input.jpg"]
};
```

---

## API Call Patterns

### Basic Pattern

All Replicate API calls follow this structure:

```typescript
const output = await replicate.run(
  "model-owner/model-name:version-hash",
  { input: inputObject }
);
```

### Asynchronous Nature

Replicate API calls are **asynchronous** and may take several seconds to complete:

1. **Request Initiated**: Your code sends the input to Replicate
2. **Prediction Created**: Replicate queues your request
3. **Processing**: Model processes your input (5-60 seconds typically)
4. **Response Returned**: Output is sent back to your application

### Implementation Pattern

```typescript
async function generate(params: ProviderParams): Promise<ProviderResult> {
  try {
    // 1. Initialize client (singleton pattern)
    const client = getReplicateClient();

    // 2. Prepare input parameters
    const input = {
      prompt: params.prompt,
      width: 1024,
      height: 1024,
      // ... other parameters
    };

    // 3. Make API call
    const output = await client.run("model-id", { input });

    // 4. Handle response (see Response Handling section)
    const imageUrl = extractImageUrl(output);

    // 5. Download and store result
    const imageBuffer = await downloadImage(imageUrl);
    const s3Key = await uploadToS3(imageBuffer);

    // 6. Return standardized result
    return {
      outputUrl: s3Key,
      engine: 'model-name',
      engineMeta: { /* metadata */ }
    };

  } catch (error) {
    console.error('Generation error:', error);
    throw new Error('Generation failed');
  }
}
```

---

## Response Handling

### Response Types

Replicate models can return outputs in different formats:

#### 1. String URL
```typescript
// Direct URL string
const output = "https://replicate.delivery/pbxt/abc123.png";
```

#### 2. Array of URLs
```typescript
// Array of image URLs
const output = [
  "https://replicate.delivery/pbxt/abc123.png",
  "https://replicate.delivery/pbxt/def456.png"
];
```

#### 3. File Objects with `url()` Method
```typescript
// File object (most common)
const output = {
  url: () => "https://replicate.delivery/pbxt/abc123.png"
};
```

#### 4. ReadableStream
```typescript
// Binary stream (for direct image data)
const output = ReadableStream;
```

### Universal Response Handler

Here's a robust handler that works with all response types:

```typescript
function extractImageUrl(output: any): string {
  // Case 1: ReadableStream (binary data)
  if (output instanceof ReadableStream) {
    console.log('Received ReadableStream, needs conversion');
    // Convert to buffer (see code example below)
    return handleReadableStream(output);
  }

  // Case 2: File object with url() method
  if (output && typeof output.url === 'function') {
    return output.url();
  }

  // Case 3: Array of results
  if (Array.isArray(output) && output.length > 0) {
    const firstItem = output[0];

    // File object in array
    if (firstItem && typeof firstItem.url === 'function') {
      return firstItem.url();
    }

    // String URL in array
    if (typeof firstItem === 'string') {
      return firstItem;
    }
  }

  // Case 4: Direct string URL
  if (typeof output === 'string') {
    return output;
  }

  throw new Error('Unexpected output format from Replicate');
}
```

### Handling ReadableStream Responses

```typescript
async function handleReadableStream(stream: ReadableStream): Promise<Buffer> {
  console.log('Converting ReadableStream to buffer...');

  const response = new Response(stream);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log('Converted stream to buffer, size:', buffer.length);

  return buffer;
}
```

---

## Supported Models

### 1. **Google Nano Banana**
- **Model ID**: `google/nano-banana`
- **Use Cases**: General purpose image generation and transformation
- **Speed**: Fast (~10-15 seconds)
- **Output Formats**: PNG, JPG
- **Special Features**: Works with both text-to-image and image-to-image

```typescript
const output = await replicate.run("google/nano-banana", {
  input: {
    prompt: "cyberpunk cityscape",
    output_format: "png"
  }
});
```

### 2. **Stable Diffusion**
- **Model ID**: `stability-ai/stable-diffusion:ac732df...`
- **Use Cases**: High-quality text-to-image and img2img
- **Speed**: Moderate (~20-30 seconds)
- **Parameters**: Highly configurable (steps, guidance, scheduler)
- **Strengths**: Detailed, artistic outputs

```typescript
const output = await replicate.run(
  "stability-ai/stable-diffusion:ac732df83cea7fff...",
  {
    input: {
      prompt: "portrait of a cat astronaut",
      width: 1024,
      height: 1024,
      num_inference_steps: 50,
      guidance_scale: 7.5,
      negative_prompt: "blurry, distorted"
    }
  }
);
```

### 3. **FLUX-1.1 Pro**
- **Model ID**: `black-forest-labs/flux-1.1-pro`
- **Use Cases**: Professional-grade image generation
- **Speed**: Fast (~15-20 seconds)
- **Parameters**: Fewer steps needed for quality
- **Strengths**: Excellent prompt following, high detail

```typescript
const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
  input: {
    prompt: "minimalist logo design",
    width: 1024,
    height: 1024,
    num_inference_steps: 28,
    guidance_scale: 3.5
  }
});
```

### 4. **OpenAI via Replicate**
- **Model ID**: `openai/gpt-image-1`
- **Use Cases**: Image editing and enhancement
- **Speed**: Fast (~10 seconds)
- **Limitation**: Requires input image
- **Strengths**: Smart transformations

```typescript
const output = await replicate.run("openai/gpt-image-1", {
  input: {
    prompt: "add dramatic sunset lighting",
    input_images: ["https://example.com/image.jpg"]
  }
});
```

---

## Best Practices

### 1. **Singleton Client Pattern**

Initialize the Replicate client once and reuse it:

```typescript
let replicate: Replicate;

function getReplicateClient() {
  if (!replicate) {
    replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  return replicate;
}
```

**Why?**: Avoids creating multiple instances and improves performance.

### 2. **Error Handling**

Always wrap Replicate calls in try-catch blocks:

```typescript
try {
  const output = await replicate.run(modelId, { input });
  // Process output
} catch (error) {
  console.error('Replicate API error:', error);

  // Provide user-friendly error messages
  if (error.message.includes('quota')) {
    throw new Error('API quota exceeded. Please try again later.');
  }

  throw new Error('Image generation failed. Please try again.');
}
```

### 3. **Store Results Externally**

Replicate URLs expire after ~24 hours. Always download and store results:

```typescript
// ❌ Don't do this (URL will expire)
return { imageUrl: replicateUrl };

// ✅ Do this (permanent storage)
const imageBuffer = await fetch(replicateUrl).then(r => r.arrayBuffer());
const s3Key = await uploadToS3(Buffer.from(imageBuffer));
return { imageUrl: s3Url };
```

### 4. **Handle Public vs Presigned URLs**

When using input images from S3:

```typescript
// For public buckets: Use direct URL
const publicUrl = `https://bucket-name.s3.region.amazonaws.com/${key}`;

// For private buckets: Strip presigned params
const inputUrl = uploadedImageUrl.split('?')[0];
```

### 5. **Logging for Debugging**

Log key information for troubleshooting:

```typescript
console.log('Replicate input:', {
  model: modelId,
  prompt: input.prompt.slice(0, 100) + '...',
  dimensions: `${input.width}x${input.height}`,
  hasInputImage: !!input.image
});

console.log('Replicate output type:', typeof output);
console.log('Replicate output is array:', Array.isArray(output));
```

### 6. **Random Seeds for Variation**

Use random seeds for diverse outputs:

```typescript
const input = {
  prompt: "mountain landscape",
  seed: Math.floor(Math.random() * 1000000),
  // ... other params
};
```

For reproducible results, use a fixed seed:

```typescript
const input = {
  prompt: "mountain landscape",
  seed: 42, // Same input + seed = same output
  // ... other params
};
```

---

## Code Examples

### Complete Text-to-Image Example

```typescript
import Replicate from 'replicate';

async function generateImage(prompt: string) {
  // Initialize client
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  // Prepare input
  const input = {
    prompt: prompt,
    width: 1024,
    height: 1024,
    num_inference_steps: 50,
    guidance_scale: 7.5,
    seed: Math.floor(Math.random() * 1000000),
    negative_prompt: "blurry, low quality, distorted"
  };

  console.log('Starting image generation...');
  console.log('Prompt:', prompt);

  // Run model
  const output = await replicate.run(
    "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    { input }
  );

  console.log('Generation complete!');

  // Extract URL
  let imageUrl: string;
  if (Array.isArray(output) && output.length > 0) {
    imageUrl = typeof output[0] === 'string'
      ? output[0]
      : output[0].url();
  } else if (typeof output === 'string') {
    imageUrl = output;
  } else {
    throw new Error('Unexpected output format');
  }

  // Download and store
  const response = await fetch(imageUrl);
  const imageBuffer = Buffer.from(await response.arrayBuffer());

  // Upload to your storage (S3, etc.)
  const permanentUrl = await uploadToStorage(imageBuffer);

  return {
    url: permanentUrl,
    model: 'stable-diffusion',
    prompt: prompt
  };
}
```

### Complete Image-to-Image Example

```typescript
async function transformImage(inputImageUrl: string, prompt: string) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const input = {
    prompt: prompt,
    image: inputImageUrl,
    strength: 0.75,              // 75% transformation
    num_inference_steps: 50,
    guidance_scale: 7.5,
    negative_prompt: "blurry, distorted, low quality"
  };

  console.log('Transforming image...');
  console.log('Input image:', inputImageUrl);
  console.log('Transformation:', prompt);

  const output = await replicate.run(
    "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    { input }
  );

  // Handle response
  let resultUrl: string;
  if (output && typeof output.url === 'function') {
    resultUrl = output.url();
  } else if (Array.isArray(output)) {
    resultUrl = typeof output[0] === 'string'
      ? output[0]
      : output[0].url();
  } else {
    throw new Error('Unexpected output format');
  }

  // Download and store permanently
  const response = await fetch(resultUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  const permanentUrl = await uploadToStorage(buffer);

  return {
    url: permanentUrl,
    originalImage: inputImageUrl,
    transformation: prompt
  };
}
```

### Handling Multiple Response Types

```typescript
async function handleReplicateOutput(output: any): Promise<Buffer> {
  let imageUrl: string | null = null;
  let imageBuffer: Buffer;

  // Handle ReadableStream
  if (output instanceof ReadableStream) {
    const response = new Response(output);
    return Buffer.from(await response.arrayBuffer());
  }

  // Handle File object
  if (output && typeof output.url === 'function') {
    imageUrl = output.url();
  }

  // Handle Array
  else if (Array.isArray(output) && output.length > 0) {
    const firstItem = output[0];
    if (typeof firstItem.url === 'function') {
      imageUrl = firstItem.url();
    } else if (typeof firstItem === 'string') {
      imageUrl = firstItem;
    }
  }

  // Handle direct string
  else if (typeof output === 'string') {
    imageUrl = output;
  }

  // Validate URL
  if (!imageUrl || !imageUrl.startsWith('http')) {
    throw new Error(`Invalid image URL: ${imageUrl}`);
  }

  // Download image
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}
```

---

## Troubleshooting

### Common Issues

#### 1. **"Invalid API token"**
- Check that `REPLICATE_API_TOKEN` is set correctly
- Verify token starts with `r8_`
- Ensure token hasn't expired

#### 2. **"Unexpected output format"**
- Log the raw output: `console.log('Output:', typeof output, output)`
- Check if model schema has changed
- Verify you're handling all response types

#### 3. **"Image URL expired"**
- Replicate URLs expire after ~24 hours
- Always download and store images immediately
- Use S3 or similar permanent storage

#### 4. **Slow generation times**
- Different models have different speeds
- Reduce `num_inference_steps` for faster (but lower quality) results
- Consider using faster models like FLUX or Nano Banana

#### 5. **Quality issues**
- Increase `num_inference_steps` (30-150)
- Adjust `guidance_scale` (7-15 for most models)
- Use negative prompts to avoid unwanted features
- Try different models for different use cases

---

## Resources

- **Replicate Documentation**: https://replicate.com/docs
- **Model Explorer**: https://replicate.com/explore
- **API Reference**: https://replicate.com/docs/reference
- **Node.js SDK**: https://github.com/replicate/replicate-javascript
- **Pricing**: https://replicate.com/pricing

---

## Summary

### Key Takeaways

1. **Singleton Pattern**: Initialize Replicate client once
2. **Async Nature**: All calls are asynchronous (5-60 seconds)
3. **Response Handling**: Handle multiple output formats robustly
4. **Storage**: Always download and store results permanently
5. **Error Handling**: Wrap calls in try-catch with user-friendly messages
6. **Logging**: Log inputs/outputs for debugging
7. **Model Selection**: Choose the right model for your use case

### Quick Reference

```typescript
// Initialize
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Text-to-Image
const output = await replicate.run("model-id", {
  input: { prompt: "...", width: 1024, height: 1024 }
});

// Image-to-Image
const output = await replicate.run("model-id", {
  input: { prompt: "...", image: "url", strength: 0.8 }
});

// Handle response
const imageUrl = extractImageUrl(output);
const buffer = await fetch(imageUrl).then(r => r.arrayBuffer());
const permanentUrl = await uploadToS3(Buffer.from(buffer));
```
