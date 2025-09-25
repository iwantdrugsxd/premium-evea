#!/usr/bin/env node

// Script to upload local portfolio images to Cloudinary and update vendor records
// Run with: node upload-local-portfolio-images.js

require('dotenv').config({ path: '.env.local' });

const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Portfolio images mapping based on your Supabase vendor IDs
const portfolioData = {
  "ab450fa5-39ad-40eb-b694-83ba683183c4": { // Rajpurohit Decorator and caterers
    businessName: "Rajpurohit Decorator and caterers",
    folderName: "baldevsingh rajpurohit",
    images: [
      "IMG-20191130-WA0010 - baldevsingh rajpurohit.jpg",
      "IMG-20191130-WA0011 - baldevsingh rajpurohit.jpg",
      "IMG-20191130-WA0012 - baldevsingh rajpurohit.jpg",
      "IMG-20191130-WA0013 - baldevsingh rajpurohit.jpg",
      "IMG-20191130-WA0019 - baldevsingh rajpurohit.jpg"
    ]
  },
  "df495df1-412e-4c91-860f-9d904f76d512": { // La Fiesta Decors
    businessName: "La Fiesta Decors",
    folderName: "Hiral shah",
    images: [
      "IMG-20250720-WA0017 - Hiral shah.jpg",
      "IMG-20250902-WA0008 - Hiral shah.jpg",
      "IMG-20250902-WA0009 - Hiral shah.jpg",
      "IMG-20250902-WA0010 - Hiral shah.jpg",
      "IMG-20250902-WA0011 - Hiral shah.jpg",
      "IMG-20250902-WA0012 - Hiral shah.jpg",
      "IMG-20250902-WA0013 - Hiral shah.jpg",
      "IMG-20250902-WA0014 - Hiral shah.jpg",
      "IMG-20250902-WA0016 - Hiral shah.jpg"
    ]
  }
};

// Upload image to Cloudinary
async function uploadImageToCloudinary(imagePath, vendorId, businessName, imageIndex) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
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

async function uploadLocalPortfolioImages() {
  console.log('📸 Uploading local portfolio images to Cloudinary...\n');

  const results = [];
  const portfolioDir = path.join(__dirname, 'vendor-portfolio');

  for (const [vendorId, data] of Object.entries(portfolioData)) {
    const { businessName, images } = data;
    console.log(`📁 Processing ${businessName} (${images.length} images)...`);

    const uploadedUrls = [];
    let successCount = 0;

    for (let i = 0; i < images.length; i++) {
      const imagePath = path.join(portfolioDir, images[i]);
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  File not found: ${images[i]}`);
        continue;
      }

      const cloudinaryUrl = await uploadImageToCloudinary(imagePath, vendorId, businessName, i);
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
uploadLocalPortfolioImages().catch(console.error);
