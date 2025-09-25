#!/usr/bin/env node

// Quick test script to upload portfolio images
// Run with: node test-upload-images.js

console.log('🚀 Testing Portfolio Image Upload...\n');

// Check if environment variables are set
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing environment variables:');
  missingVars.forEach(varName => {
    console.log(`  - ${varName}`);
  });
  console.log('\n💡 Add these to your .env.local file:');
  console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('CLOUDINARY_API_KEY=your_api_key');
  console.log('CLOUDINARY_API_SECRET=your_api_secret');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

console.log('✅ All environment variables are set');
console.log('📸 Running portfolio image upload...\n');

// Run the upload script
const { spawn } = require('child_process');

const child = spawn('node', ['upload-vendor-portfolio-images.js'], { stdio: 'inherit' });

child.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Portfolio images uploaded successfully!');
    console.log('\n🌐 Check your website at: http://localhost:3001');
    console.log('📱 The vendor cards should now display with their portfolio images');
  } else {
    console.log(`\n❌ Upload failed with exit code ${code}`);
  }
});

child.on('error', (error) => {
  console.error('❌ Error running upload script:', error.message);
});
