// Test Replicate OpenAI provider directly
import { config } from 'dotenv';
config({ path: '.env.local' });

async function testReplicateOpenAI() {
  console.log('🧪 Testing Replicate OpenAI provider directly...\n');

  try {
    // Test data
    const imageUrl = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=580&fit=crop&crop=face';
    const prompt = 'Create a giant hyper-realistic statue based on the given photo, keeping the original face exactly the same without changes. The statue stands tall in the middle of a roundabout in Kolkata, near a famous historical landmark like the Howrah Bridge. The statue is still under construction, surrounded by scaffolding, with many construction workers in yellow helmets and orange vests climbing, welding, and working on it. Parts of the statue\'s body are still exposed metal framework.';

    console.log('📝 Prompt:', prompt);
    console.log('🖼️  Image URL:', imageUrl);
    console.log('');

    // Test Replicate OpenAI directly
    console.log('1️⃣ Initializing Replicate client...');

    const { default: Replicate } = await import('replicate');
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log('2️⃣ Calling Replicate OpenAI gpt-image-1...');
    const startTime = Date.now();

    const input = {
      prompt: prompt,
      input_images: [imageUrl]
    };

    console.log('Input parameters:', {
      prompt: input.prompt.slice(0, 100) + '...',
      hasInputImages: !!input.input_images.length
    });

    const output = await replicate.run("openai/gpt-image-1", { input });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    console.log('🎉 Replicate OpenAI completed!');
    console.log('📊 Raw Output:', output);
    console.log('📊 Output type:', typeof output);
    console.log('📊 Is Array:', Array.isArray(output));

    // Extract the URL
    let outputUrl;
    if (Array.isArray(output) && output.length > 0) {
      const firstItem = output[0];
      if (firstItem && typeof firstItem.url === 'function') {
        outputUrl = firstItem.url();
      } else if (typeof firstItem === 'string') {
        outputUrl = firstItem;
      } else {
        outputUrl = String(firstItem);
      }
    }

    console.log('📊 Results:');
    console.log(`  ✅ Output URL: ${outputUrl}`);
    console.log(`  ⏱️  Processing time: ${processingTime}ms`);
    console.log(`  🔧 Model: openai/gpt-image-1 via Replicate`);

    // Download and save the result image
    if (outputUrl && outputUrl.startsWith('http')) {
      console.log('💾 Downloading result image...');
      const resultResponse = await fetch(outputUrl);
      if (resultResponse.ok) {
        const imageData = Buffer.from(await resultResponse.arrayBuffer());
        const fs = await import('fs');
        fs.default.writeFileSync('test-result-replicate-openai.png', imageData);
        console.log('💾 Saved result to test-result-replicate-openai.png');
      }
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testReplicateOpenAI();