#!/usr/bin/env node

// Script to upload portfolio images to Cloudinary and update existing vendor records
// Run with: node upload-vendor-portfolio-images.js

require('dotenv').config({ path: '.env.local' });

const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');

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

// Portfolio images data mapped to your existing vendors
const portfolioData = {
  // Based on the UUIDs I can see in your Supabase table
  "40276eb6-f8d8-426f-affc-41a89636e125": { // R R decorators
    businessName: "R R decorators",
    images: [
      "https://drive.google.com/open?id=1HWhhsttAIieQMICVGNCGQ-BzJxvX9ObN"
    ]
  },
  "ab450fa5-39ad-40eb-b694-83ba683183c4": { // Rajpurohit Decorator and caterers
    businessName: "Rajpurohit Decorator and caterers",
    images: [
      "https://drive.google.com/open?id=1C9DIMk6pzICxyduOGyQUO1YOL1m5WAZb",
      "https://drive.google.com/open?id=1j3yA-YTxz6zMx58Cji5faAQk6FfoJppP",
      "https://drive.google.com/open?id=1qW6j995NwYP2RY8BD8Ei87-cfLbio_yA",
      "https://drive.google.com/open?id=1CU6qarQBTrIjTsZfEID0OxVYxG9Rclol",
      "https://drive.google.com/open?id=11vQUsMlKJVf-XxmItmLXIP6a56x1tXbl"
    ]
  },
  "df495df1-412e-4c91-860f-9d904f76d512": { // La Fiesta Decors
    businessName: "La Fiesta Decors",
    images: [
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
  }
};

// Convert Google Drive URLs to direct download URLs
function convertGoogleDriveUrl(url) {
  const fileId = url.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Upload image to Cloudinary
async function uploadImageToCloudinary(imageUrl, vendorId, businessName, imageIndex) {
  try {
    const directUrl = convertGoogleDriveUrl(imageUrl);
    if (!directUrl) {
      console.log(`❌ Invalid Google Drive URL: ${imageUrl}`);
      return null;
    }

    const result = await cloudinary.uploader.upload(directUrl, {
      folder: `evea/vendors/${businessName.replace(/\s+/g, '_').toLowerCase()}`,
      public_id: `portfolio_${imageIndex + 1}`,
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' },
        { format: 'webp' }
      ]
    });

    console.log(`✅ Uploaded: ${businessName} - Image ${imageIndex + 1}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${businessName} - Image ${imageIndex + 1}:`, error.message);
    return null;
  }
}

async function uploadAndUpdateVendorPortfolios() {
  console.log('📸 Uploading portfolio images and updating vendor records...\n');

  const results = [];

  for (const [vendorId, data] of Object.entries(portfolioData)) {
    const { businessName, images } = data;
    console.log(`📁 Processing ${businessName} (${images.length} images)...`);

    const uploadedUrls = [];
    let successCount = 0;

    for (let i = 0; i < images.length; i++) {
      const cloudinaryUrl = await uploadImageToCloudinary(images[i], vendorId, businessName, i);
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
          console.log(`❌ Error updating ${businessName} with portfolio images:`, updateError.message);
        } else {
          console.log(`✅ Updated ${businessName} with ${uploadedUrls.length} portfolio images`);
        }
      } catch (error) {
        console.log(`❌ Error updating ${businessName}:`, error.message);
      }
    }

    results.push({
      vendorId,
      businessName,
      totalImages: images.length,
      uploadedImages: successCount,
      cloudinaryUrls: uploadedUrls
    });

    console.log(`✅ Completed ${businessName}: ${successCount}/${images.length} images uploaded\n`);
  }

  // Summary
  console.log('📊 Upload Summary:');
  results.forEach(result => {
    console.log(`  ${result.businessName}: ${result.uploadedImages}/${result.totalImages} images uploaded`);
    console.log(`  Cloudinary URLs: ${result.cloudinaryUrls.length} URLs generated`);
  });

  return results;
}

// Run the script
uploadAndUpdateVendorPortfolios().catch(console.error);
