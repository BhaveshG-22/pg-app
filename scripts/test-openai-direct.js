import { config } from 'dotenv';
config({ path: '.env.local' });

// Import directly from the compiled output or use require for now
const { OpenAIProvider } = require('../src/lib/providers/openai.ts');

async function testOpenAIImageEdit() {
  console.log('🧪 Testing OpenAI image edit directly...\n');

  try {
    // Test data
    const imageUrl = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=580&fit=crop&crop=face';
    const prompt = 'Create a giant hyper-realistic statue based on the given photo, keeping the original face exactly the same without changes. The statue stands tall in the middle of a roundabout in Kolkata, near a famous historical landmark like the Howrah Bridge. The statue is still under construction, surrounded by scaffolding, with many construction workers in yellow helmets and orange vests climbing, welding, and working on it. Parts of the statue\'s body are still exposed metal framework.';

    console.log('📝 Prompt:', prompt);
    console.log('🖼️  Image URL:', imageUrl);
    console.log('');

    // Test OpenAI provider directly
    console.log('1️⃣ Initializing OpenAI provider...');
    const provider = new OpenAIProvider();

    console.log('2️⃣ Calling OpenAI image edit...');
    const startTime = Date.now();

    const result = await provider.generate({
      prompt: prompt,
      outputSize: 'SQUARE',
      uploadedImageUrl: imageUrl // Treat as presigned S3 URL
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    console.log('🎉 OpenAI image edit completed!');
    console.log('📊 Results:');
    console.log(`  ✅ Output URL: ${result.outputUrl}`);
    console.log(`  ⚡ Engine: ${result.engine}`);
    console.log(`  ⏱️  Processing time: ${processingTime}ms`);
    console.log(`  📋 Engine Meta:`, JSON.stringify(result.engineMeta, null, 2));

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

testOpenAIImageEdit();