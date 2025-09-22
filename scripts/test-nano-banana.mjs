// Test Nano Banana provider directly
import { config } from 'dotenv';
config({ path: '.env.local' });

async function testNanoBanana() {
  console.log('🧪 Testing Nano Banana provider directly...\n');

  try {
    // Test data
    const imageUrl = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=580&fit=crop&crop=face';
    const prompt = 'Create a giant hyper-realistic statue based on the given photo, keeping the original face exactly the same without changes. The statue stands tall in the middle of a roundabout in Kolkata, near a famous historical landmark like the Howrah Bridge. The statue is still under construction, surrounded by scaffolding, with many construction workers in yellow helmets and orange vests climbing, welding, and working on it. Parts of the statue\'s body are still exposed metal framework.';

    console.log('📝 Prompt:', prompt);
    console.log('🖼️  Image URL:', imageUrl);
    console.log('');

    // Test Nano Banana directly via Replicate
    console.log('1️⃣ Initializing Replicate client...');

    const { default: Replicate } = await import('replicate');
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log('2️⃣ Calling Nano Banana google/nano-banana...');
    const startTime = Date.now();

    const input = {
      prompt: prompt,
      image: imageUrl,
      width: 1024,
      height: 1024,
      num_inference_steps: 20,
      guidance_scale: 7.5,
      strength: 0.8,
      seed: Math.floor(Math.random() * 1000000),
      negative_prompt: "blurry, low quality, distorted, deformed, ugly"
    };

    console.log('Input parameters:', {
      prompt: input.prompt.slice(0, 100) + '...',
      hasImage: !!input.image,
      dimensions: `${input.width}x${input.height}`,
      strength: input.strength,
      steps: input.num_inference_steps,
      guidance: input.guidance_scale
    });

    const output = await replicate.run("google/nano-banana", { input });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    console.log('🎉 Nano Banana completed!');
    console.log('📊 Raw Output:', output);
    console.log('📊 Output type:', typeof output);
    console.log('📊 Is Array:', Array.isArray(output));

    // Handle different output types
    let outputUrl;

    if (output && typeof output.url === 'function') {
      // File object with url() method
      outputUrl = output.url();
    } else if (typeof output === 'string') {
      // Direct URL string
      outputUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      // Array of results
      const firstItem = output[0];
      if (firstItem && typeof firstItem.url === 'function') {
        outputUrl = firstItem.url();
      } else if (typeof firstItem === 'string') {
        outputUrl = firstItem;
      }
    } else {
      outputUrl = String(output);
    }

    console.log('📊 Results:');
    console.log(`  ✅ Output URL: ${outputUrl}`);
    console.log(`  ⏱️  Processing time: ${processingTime}ms`);
    console.log(`  🔧 Model: google/nano-banana`);
    console.log(`  📐 Size: 1024x1024`);
    console.log(`  💪 Strength: ${input.strength}`);
    console.log(`  🎯 Steps: ${input.num_inference_steps}`);
    console.log(`  🧭 Guidance: ${input.guidance_scale}`);

    // Download and save the result image
    if (outputUrl && typeof outputUrl === 'string' && outputUrl.startsWith('http')) {
      console.log('💾 Downloading result image...');
      const resultResponse = await fetch(outputUrl);
      if (resultResponse.ok) {
        const imageData = Buffer.from(await resultResponse.arrayBuffer());
        const fs = await import('fs');
        fs.default.writeFileSync('test-result-nano-banana.png', imageData);
        console.log('💾 Saved result to test-result-nano-banana.png');
      }
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testNanoBanana();