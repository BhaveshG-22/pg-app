# Nano Banana Image Input Guide

## Executive Summary

This report documents the correct way to send images as input to Google's Nano Banana model via the Replicate API, based on analysis of the PixelGlow codebase implementation.

**Key Finding**: Nano Banana uses `image_input` parameter as an **array of URLs**, not a single URL string.

---

## Table of Contents

1. [Overview](#overview)
2. [Input Schema](#input-schema)
3. [Implementation Analysis](#implementation-analysis)
4. [Image URL Formats](#image-url-formats)
5. [Code Examples](#code-examples)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Best Practices](#best-practices)

---

## Overview

**Model**: `google/nano-banana`
**Provider**: Replicate
**Capabilities**: Text-to-Image & Image-to-Image transformation
**Primary Use Case**: Image transformation with prompt-based modifications

### Key Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | ✅ Yes | Description of desired transformation |
| `image_input` | string[] | ❌ No | Array of input image URLs (for img2img) |
| `output_format` | string | ❌ No | Output format: "png", "jpg", "webp" |
| `aspect_ratio` | string | ❌ No | "1:1" or "match_input_image" |

---

## Input Schema

### Text-to-Image (No Input Image)

```typescript
const input = {
  prompt: "a beautiful sunset over mountains",
  output_format: "png",
  aspect_ratio: "1:1"
};
```

### Image-to-Image Transformation

```typescript
const input = {
  prompt: "transform this into a watercolor painting",
  image_input: ["https://example.com/image.jpg"], // ⚠️ MUST be an array
  output_format: "png",
  aspect_ratio: "match_input_image"
};
```

### ❌ Common Mistake

```typescript
// WRONG - Will fail
const input = {
  prompt: "stylize this image",
  image_input: "https://example.com/image.jpg" // ❌ String instead of array
};

// CORRECT
const input = {
  prompt: "stylize this image",
  image_input: ["https://example.com/image.jpg"] // ✅ Array with single URL
};
```

---

## Implementation Analysis

### Production Implementation (TypeScript)

**File**: `src/lib/providers/nano-banana.ts`

```typescript
// Line 47-50
const input = {
  prompt: prompt,
  image_input: [publicImageUrl], // ✅ Array format
  output_format: "png"
};
```

**Key Implementation Details**:

1. **URL Processing** (Lines 42-44):
   ```typescript
   // Convert presigned S3 URL to direct public URL
   const inputS3Key = uploadedImageUrl.split('?')[0].split('/').slice(3).join('/');
   const publicImageUrl = `https://pixelglow-user-uploads.s3.us-east-1.amazonaws.com/${inputS3Key}`;
   ```

2. **Input Construction** (Lines 47-51):
   ```typescript
   const input = {
     prompt: prompt,
     image_input: [publicImageUrl], // Array with single URL
     output_format: "png"
   };
   ```

3. **API Call** (Line 65):
   ```typescript
   const output = await client.run("google/nano-banana", { input });
   ```

### Worker Implementation (JavaScript)

**File**: `worker/providers/nano-banana.js`

```javascript
// Lines 40-43
if (uploadedImageUrl) {
  console.log('[NanoBanana] Using uploaded image for img2img:', uploadedImageUrl);
  input.image_input = [uploadedImageUrl]; // ✅ Array format
  input.aspect_ratio = "match_input_image";
}
```

### Test Implementation

**File**: `scripts/test-nano-banana.mjs`

**Note**: The test file shows an **incorrect approach** for reference:

```javascript
// Lines 28-38 - This is testing a DIFFERENT model schema
const input = {
  prompt: prompt,
  image: imageUrl,  // ❌ Wrong parameter name for Nano Banana
  width: 1024,
  height: 1024,
  num_inference_steps: 20,
  guidance_scale: 7.5,
  strength: 0.8,
  // ... other Stable Diffusion parameters
};
```

**Issue**: This test uses Stable Diffusion's schema (`image`, `width`, `height`, `strength`) instead of Nano Banana's schema (`image_input` array).

---

## Image URL Formats

Nano Banana accepts publicly accessible HTTP(S) URLs. The image must be downloadable without authentication.

### ✅ Supported URL Formats

1. **Direct S3 URLs** (Public buckets):
   ```
   https://pixelglow-user-uploads.s3.us-east-1.amazonaws.com/uploads/user123/image.png
   ```

2. **Presigned S3 URLs**:
   ```
   https://pixelglow-user-uploads.s3.us-east-1.amazonaws.com/uploads/user123/image.png?X-Amz-Algorithm=...
   ```

3. **CDN URLs**:
   ```
   https://cdn.example.com/images/photo.jpg
   ```

4. **External Image Hosting**:
   ```
   https://images.unsplash.com/photo-123456789
   ```

### ❌ Unsupported Formats

- Base64 encoded images
- Data URIs (`data:image/png;base64,...`)
- Local file paths (`/uploads/image.png`)
- Private URLs requiring authentication headers

### URL Processing in PixelGlow

The codebase converts presigned URLs to direct S3 URLs:

```typescript
// src/lib/providers/nano-banana.ts:42-44
const inputS3Key = uploadedImageUrl.split('?')[0]  // Remove query params
  .split('/').slice(3).join('/');                  // Extract key from path
const publicImageUrl = `https://pixelglow-user-uploads.s3.us-east-1.amazonaws.com/${inputS3Key}`;
```

**Why**: Ensures clean, permanent URLs for Replicate's servers to download.

---

## Code Examples

### Example 1: Basic Image Transformation

```typescript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

async function transformImage() {
  const input = {
    prompt: "transform into a cyberpunk style artwork with neon colors",
    image_input: ["https://example.com/photo.jpg"],
    output_format: "png"
  };

  const output = await replicate.run("google/nano-banana", { input });

  // Handle ReadableStream response
  if (output instanceof ReadableStream) {
    const response = new Response(output);
    const buffer = Buffer.from(await response.arrayBuffer());
    // Save or process buffer
  }
}
```

### Example 2: With Error Handling

```typescript
async function safeTransform(imageUrl: string, prompt: string) {
  try {
    // Validate URL is accessible
    const testResponse = await fetch(imageUrl, { method: 'HEAD' });
    if (!testResponse.ok) {
      throw new Error(`Image URL not accessible: ${testResponse.status}`);
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    const input = {
      prompt: prompt,
      image_input: [imageUrl],  // Array format
      output_format: "png"
    };

    console.log('Nano Banana input:', JSON.stringify(input, null, 2));

    const output = await replicate.run("google/nano-banana", { input });

    // Handle different output types
    let imageBuffer: Buffer;

    if (output instanceof ReadableStream) {
      const response = new Response(output);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else if (typeof output?.url === 'function') {
      const outputUrl = output.url();
      const response = await fetch(outputUrl);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      throw new Error('Unexpected output format from Nano Banana');
    }

    return imageBuffer;

  } catch (error) {
    console.error('Nano Banana transformation failed:', error);
    throw error;
  }
}
```

### Example 3: Multiple Images (If Supported)

```typescript
// Nano Banana supports image_input as an array
// Check if multiple images are supported in your use case
const input = {
  prompt: "combine these images into a collage",
  image_input: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  output_format: "png"
};
```

**Note**: Verify multi-image support with Replicate's API documentation, as behavior may vary.

---

## Common Issues & Solutions

### Issue 1: "Invalid input parameter"

**Symptom**: API returns error about invalid `image_input`

**Cause**: Using string instead of array

**Solution**:
```typescript
// ❌ Wrong
image_input: imageUrl

// ✅ Correct
image_input: [imageUrl]
```

### Issue 2: "Image not found" / 403 Error

**Symptom**: Replicate cannot access the image URL

**Causes**:
- Image requires authentication
- S3 bucket is private
- URL has expired (presigned URLs)

**Solutions**:
```typescript
// 1. Use public S3 URLs
const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

// 2. Generate longer-expiring presigned URLs
const presignedUrl = await s3.getSignedUrl('getObject', {
  Bucket: bucket,
  Key: key,
  Expires: 3600  // 1 hour
});

// 3. Make S3 bucket public (if appropriate)
// Update bucket policy to allow public read access
```

### Issue 3: Wrong Parameter Names

**Symptom**: Image not being used in transformation

**Cause**: Using wrong parameter name (e.g., `image` instead of `image_input`)

**Models have different schemas**:
```typescript
// Nano Banana
{ image_input: [url] }

// Stable Diffusion
{ image: url }

// FLUX
{ image: url }

// OpenAI
{ input_images: [url] }
```

**Solution**: Always check model-specific documentation

### Issue 4: ReadableStream Response Handling

**Symptom**: Cannot process output directly

**Cause**: Replicate returns ReadableStream for some outputs

**Solution**:
```typescript
if (output instanceof ReadableStream) {
  const response = new Response(output);
  const buffer = Buffer.from(await response.arrayBuffer());
  // Now you can save or process the buffer
}
```

---

## Best Practices

### 1. URL Validation

Always validate image URLs before sending to Replicate:

```typescript
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}
```

### 2. Use Public URLs

For production systems:
- Use public S3 buckets with proper CORS configuration
- Or use long-expiring presigned URLs (1+ hour)
- Avoid authenticated URLs

### 3. Clean URL Processing

Remove query parameters for cleaner URLs:

```typescript
const cleanUrl = imageUrl.split('?')[0];
const input = {
  prompt: prompt,
  image_input: [cleanUrl],
  output_format: "png"
};
```

### 4. Comprehensive Logging

Log input parameters for debugging:

```typescript
console.log('Nano Banana input:', {
  prompt: input.prompt.slice(0, 100),
  hasImages: input.image_input?.length > 0,
  imageCount: input.image_input?.length || 0,
  firstImageUrl: input.image_input?.[0]?.slice(0, 100),
  outputFormat: input.output_format
});
```

### 5. Response Type Handling

Handle all possible response formats:

```typescript
async function extractImageUrl(output: unknown): Promise<string | Buffer> {
  if (output instanceof ReadableStream) {
    const response = new Response(output);
    return Buffer.from(await response.arrayBuffer());
  }

  if (typeof output?.url === 'function') {
    return output.url();
  }

  if (Array.isArray(output) && output.length > 0) {
    return extractImageUrl(output[0]);
  }

  if (typeof output === 'string' && output.startsWith('http')) {
    return output;
  }

  throw new Error('Unsupported output format');
}
```

### 6. Error Handling

Implement retry logic for transient errors:

```typescript
async function generateWithRetry(input: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await replicate.run("google/nano-banana", { input });
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Check if error is retryable
      if (error.message?.includes('rate limit') ||
          error.message?.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      throw error;
    }
  }
}
```

---

## Summary

### Required Format for Image Input

```typescript
{
  prompt: string,
  image_input: string[],  // ⚠️ MUST be an array of URLs
  output_format: "png" | "jpg" | "webp"
}
```

### Quick Reference

| Aspect | Requirement |
|--------|-------------|
| Parameter Name | `image_input` (NOT `image`) |
| Data Type | `string[]` (Array) |
| URL Format | Publicly accessible HTTP(S) URLs |
| Multiple Images | Supported via array |
| Base64 | ❌ Not supported |
| Local Files | ❌ Not supported |

### Implementation Checklist

- [ ] Use `image_input` parameter (not `image`)
- [ ] Wrap URL in array: `[url]` not `url`
- [ ] Ensure URL is publicly accessible
- [ ] Use clean URLs without unnecessary query params
- [ ] Handle ReadableStream responses
- [ ] Implement comprehensive error handling
- [ ] Add logging for debugging
- [ ] Validate image URLs before API call

---

## References

- **Replicate Nano Banana Model**: `google/nano-banana`
- **PixelGlow Implementation**: `src/lib/providers/nano-banana.ts`
- **Worker Implementation**: `worker/providers/nano-banana.js`
- **Replicate API Docs**: https://replicate.com/docs
- **Nano Banana Model Page**: https://replicate.com/google/nano-banana

---

**Report Generated**: January 9, 2026
**Codebase Version**: PixelGlow Dashboard
**Author**: Claude Code Analysis
