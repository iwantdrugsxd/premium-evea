#!/usr/bin/env node

// Script to upload portfolio images to Cloudinary
// Run with: node 3-upload-portfolio-images.js

const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
});

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Load vendor results from previous script
let vendorResults = [];
try {
  vendorResults = JSON.parse(fs.readFileSync('vendor-data-results.json', 'utf8'));
} catch (error) {
  console.log('❌ Could not load vendor-data-results.json. Please run 2-create-vendor-data.js first.');
  process.exit(1);
}

// Portfolio images data
const portfolioData = {
  "Rajpurohit Decorator and caterers": [
    "https://drive.google.com/open?id=1C9DIMk6pzICxyduOGyQUO1YOL1m5WAZb",
    "https://drive.google.com/open?id=1j3yA-YTxz6zMx58Cji5faAQk6FfoJppP",
    "https://drive.google.com/open?id=1qW6j995NwYP2RY8BD8Ei87-cfLbio_yA",
    "https://drive.google.com/open?id=1CU6qarQBTrIjTsZfEID0OxVYxG9Rclol",
    "https://drive.google.com/open?id=11vQUsMlKJVf-XxmItmLXIP6a56x1tXbl"
  ],
  "R R decorators": [
    "https://drive.google.com/open?id=1HWhhsttAIieQMICVGNCGQ-BzJxvX9ObN"
  ],
  "La Fiesta Decors": [
    "https://drive.google.com/open?id=1LEw5SGGGp9H8_rZb8-jXzXT1U1lPkRpR",
    "https://drive.google.com/open?id=1O-O9kTb_endWRO11s-yohcchtA9RiAVi",
    "https://drive.google.com/open?id=1jFfTbFJKXXad63gSk7BfJF2WjvSlZW3N",
    "https://drive.google.com/open?id=1binvmvOMsNON-rMRU7HzaHCc-UTOdMrF",
    "https://drive.google.com/open?id=1nIlJjUSFXTpHs-8TVIuciafq5U-FJoM4",
    "https://drive.google.com/open?id=12ztdOQkvfpHSznWowVEIEjqZfMj5zwOO",
    "https://drive.google.com/open?id=1olHxxTy6FODObZxSQ7Qg3Y8JUkMpD_Ru",
    "https://drive.google.com/open?id=1w4d_url5Y36eZgbhezEs2Nl7B9V5jqb",
    "https://drive.google.com/open?id=1cInIp72hk8sR_5rThOWWFURtvI58X1c8",
    "https://drive.google.com/open?id=1-LhVgbvUST9iqfVdDs29s1CdDYRbp7Q1"
  ]
};

// Convert Google Drive URLs to direct download URLs
function convertGoogleDriveUrl(url) {
  const fileId = url.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Upload image to Cloudinary
async function uploadImageToCloudinary(imageUrl, vendorName, imageIndex) {
  try {
    const directUrl = convertGoogleDriveUrl(imageUrl);
    if (!directUrl) {
      console.log(`❌ Invalid Google Drive URL: ${imageUrl}`);
      return null;
    }

    const result = await cloudinary.uploader.upload(directUrl, {
      folder: `evea/vendors/${vendorName.replace(/\s+/g, '_').toLowerCase()}`,
      public_id: `portfolio_${imageIndex + 1}`,
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' },
        { format: 'webp' }
      ]
    });

    console.log(`✅ Uploaded: ${vendorName} - Image ${imageIndex + 1}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${vendorName} - Image ${imageIndex + 1}:`, error.message);
    return null;
  }
}

async function uploadPortfolioImages() {
  console.log('📸 Uploading portfolio images to Cloudinary...\n');

  const results = [];

  for (const vendorResult of vendorResults) {
    if (!vendorResult.success) {
      console.log(`⏭️  Skipping ${vendorResult.vendor} (not created successfully)`);
      continue;
    }

    const vendorName = vendorResult.vendor;
    const vendorId = vendorResult.vendorId;
    const imageUrls = portfolioData[vendorName] || [];

    if (imageUrls.length === 0) {
      console.log(`⚠️  No images found for ${vendorName}`);
      continue;
    }

    console.log(`📁 Processing ${vendorName} (${imageUrls.length} images)...`);

    const uploadedUrls = [];
    let successCount = 0;

    for (let i = 0; i < imageUrls.length; i++) {
      const cloudinaryUrl = await uploadImageToCloudinary(imageUrls[i], vendorName, i);
      if (cloudinaryUrl) {
        uploadedUrls.push(cloudinaryUrl);
        successCount++;
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Update vendor record with Cloudinary URLs
    if (uploadedUrls.length > 0) {
      try {
        const { error: updateError } = await supabase
          .from('vendors')
          .update({ portfolio_images: uploadedUrls })
          .eq('id', vendorId);

        if (updateError) {
          console.log(`❌ Error updating ${vendorName} with portfolio images:`, updateError.message);
        } else {
          console.log(`✅ Updated ${vendorName} with ${uploadedUrls.length} portfolio images`);
        }
      } catch (error) {
        console.log(`❌ Error updating ${vendorName}:`, error.message);
      }
    }

    results.push({
      vendor: vendorName,
      vendorId: vendorId,
      totalImages: imageUrls.length,
      uploadedImages: successCount,
      cloudinaryUrls: uploadedUrls
    });

    console.log(`✅ Completed ${vendorName}: ${successCount}/${imageUrls.length} images uploaded\n`);
  }

  // Summary
  console.log('📊 Upload Summary:');
  results.forEach(result => {
    console.log(`  ${result.vendor}: ${result.uploadedImages}/${result.totalImages} images uploaded`);
  });

  // Save results
  fs.writeFileSync('portfolio-upload-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Results saved to portfolio-upload-results.json');

  return results;
}

// Run the script
uploadPortfolioImages().catch(console.error);
