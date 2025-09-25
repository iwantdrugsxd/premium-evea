#!/usr/bin/env node

// Master script to run all vendor creation scripts in sequence
// Run with: node run-all-vendor-scripts.js

const { spawn } = require('child_process');
const fs = require('fs');

async function runScript(scriptName, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 ${description}...`);
    console.log(`Running: node ${scriptName}\n`);
    
    const child = spawn('node', [scriptName], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${description} completed successfully!`);
        resolve();
      } else {
        console.log(`\n❌ ${description} failed with exit code ${code}`);
        reject(new Error(`Script failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.log(`\n❌ Error running ${scriptName}:`, error.message);
      reject(error);
    });
  });
}

async function runAllScripts() {
  console.log('🎯 Starting Complete Vendor Creation Process...\n');
  console.log('This will:');
  console.log('1. Create vendor users in Supabase Auth');
  console.log('2. Create vendor profiles in users table');
  console.log('3. Create vendor data in vendors table');
  console.log('4. Upload portfolio images to Cloudinary');
  console.log('5. Update vendor records with Cloudinary URLs\n');

  try {
    // Step 1: Create vendor users
    await runScript('1-create-vendor-users.js', 'Creating vendor users');
    
    // Step 2: Create vendor data
    await runScript('2-create-vendor-data.js', 'Creating vendor data');
    
    // Step 3: Upload portfolio images
    await runScript('3-upload-portfolio-images.js', 'Uploading portfolio images');
    
    console.log('\n🎉 All scripts completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Vendor users created');
    console.log('✅ Vendor data added to database');
    console.log('✅ Portfolio images uploaded to Cloudinary');
    console.log('✅ Vendor records updated with image URLs');
    
    console.log('\n📁 Check these files for detailed results:');
    console.log('- vendor-users-results.json');
    console.log('- vendor-data-results.json');
    console.log('- portfolio-upload-results.json');
    
  } catch (error) {
    console.log('\n❌ Process failed:', error.message);
    console.log('\n💡 Check the error above and try running individual scripts:');
    console.log('1. node 1-create-vendor-users.js');
    console.log('2. node 2-create-vendor-data.js');
    console.log('3. node 3-upload-portfolio-images.js');
  }
}

// Run all scripts
runAllScripts();
