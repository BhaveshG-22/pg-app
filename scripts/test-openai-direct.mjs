// Using direct fetch to test OpenAI provider without TS compilation
import { config } from 'dotenv';
config({ path: '.env.local' });

async function testOpenAIImageEdit() {
  console.log('🧪 Testing OpenAI image edit directly...\n');

  try {
    // Test data
    const imageUrl = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=580&fit=crop&crop=face';
    const prompt = 'Create a giant hyper-realistic statue based on the given photo, keeping the original face exactly the same without changes. The statue stands tall in the middle of a roundabout in Kolkata, near a famous historical landmark like the Howrah Bridge. The statue is still under construction, surrounded by scaffolding, with many construction workers in yellow helmets and orange vests climbing, welding, and working on it. Parts of the statue\'s body are still exposed metal framework.';

    console.log('📝 Prompt:', prompt);
    console.log('🖼️  Image URL:', imageUrl);
    console.log('');

    // Test OpenAI API directly
    console.log('1️⃣ Downloading image...');

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const imageFile = new File([imageBuffer], 'image.png', { type: 'image/png' });

    console.log('2️⃣ Calling OpenAI image edit API...');

    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const startTime = Date.now();

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      prompt: prompt,
      image: imageFile,
      size: '1024x1024',
      n: 1
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    const resultImageUrl = response.data?.[0]?.url;
    if (!resultImageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    console.log('🎉 OpenAI image edit completed!');
    console.log('📊 Results:');
    console.log(`  ✅ Image generated successfully`);
    console.log(`  🔗 Image URL: ${resultImageUrl}`);
    console.log(`  ⏱️  Processing time: ${processingTime}ms`);
    console.log(`  🔧 Model: gpt-image-1`);
    console.log(`  📐 Size: 1024x1024`);

    // Download and save the result image
    console.log('💾 Downloading result image...');
    const resultResponse = await fetch(resultImageUrl);
    if (resultResponse.ok) {
      const imageData = Buffer.from(await resultResponse.arrayBuffer());
      const fs = await import('fs');
      fs.default.writeFileSync('test-result-statue.png', imageData);
      console.log('💾 Saved result to test-result-statue.png');
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testOpenAIImageEdit();