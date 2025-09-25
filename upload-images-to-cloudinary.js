#!/usr/bin/env node

// Script to upload Google Drive images to Cloudinary
// Run with: node upload-images-to-cloudinary.js

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary (replace with your credentials)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
});

// Google Drive URLs from your vendor data
const vendorImages = {
  'Rajpurohit Decorator and caterers': [
    'https://drive.google.com/open?id=1C9DIMk6pzICxyduOGyQUO1YOL1m5WAZb',
    'https://drive.google.com/open?id=1j3yA-YTxz6zMx58Cji5faAQk6FfoJppP',
    'https://drive.google.com/open?id=1qW6j995NwYP2RY8BD8Ei87-cfLbio_yA',
    'https://drive.google.com/open?id=1CU6qarQBTrIjTsZfEID0OxVYxG9Rclol',
    'https://drive.google.com/open?id=11vQUsMlKJVf-XxmItmLXIP6a56x1tXbl'
  ],
  'R R decorators': [
    'https://drive.google.com/open?id=1HWhhsttAIieQMICVGNCGQ-BzJxvX9ObN'
  ],
  'La Fiesta Decors': [
    'https://drive.google.com/open?id=1LEw5SGGGp9H8_rZb8-jXzXT1U1lPkRpR',
    'https://drive.google.com/open?id=1O-O9kTb_endWRO11s-yohcchtA9RiAVi',
    'https://drive.google.com/open?id=1jFfTbFJKXXad63gSk7BfJF2WjvSlZW3N',
    'https://drive.google.com/open?id=1binvmvOMsNON-rMRU7HzaHCc-UTOdMrF',
    'https://drive.google.com/open?id=1nIlJjUSFXTpHs-8TVIuciafq5U-FJoM4',
    'https://drive.google.com/open?id=12ztdOQkvfpHSznWowVEIEjqZfMj5zwOO',
    'https://drive.google.com/open?id=1olHxxTy6FODObZxSQ7Qg3Y8JUkMpD_Ru',
    'https://drive.google.com/open?id=1w4d_url5Y36eZgbhezEs2Nl7B9V5jqb',
    'https://drive.google.com/open?id=1cInIp72hk8sR_5rThOWWFURtvI58X1c8',
    'https://drive.google.com/open?id=1-LhVgbvUST9iqfVdDs29s1CdDYRbp7Q1'
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

// Upload all images for all vendors
async function uploadAllImages() {
  console.log('🚀 Starting image upload to Cloudinary...\n');
  
  const results = {};
  
  for (const [vendorName, imageUrls] of Object.entries(vendorImages)) {
    console.log(`📁 Processing ${vendorName}...`);
    results[vendorName] = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      const cloudinaryUrl = await uploadImageToCloudinary(imageUrls[i], vendorName, i);
      if (cloudinaryUrl) {
        results[vendorName].push(cloudinaryUrl);
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`✅ Completed ${vendorName}: ${results[vendorName].length}/${imageUrls.length} images uploaded\n`);
  }
  
  return results;
}

// Generate updated SQL with Cloudinary URLs
function generateUpdatedSQL(cloudinaryResults) {
  console.log('\n📝 Updated SQL with Cloudinary URLs:\n');
  
  const vendorData = [
    {
      name: 'Rajpurohit Decorator and caterers',
      business_type: 'Wedding Planning',
      contact_person_name: 'Baldev Singh Rajpurohit',
      phone: '9833055077',
      email: 'rajpurohitdecorator@gmail.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar',
      description: 'Wedding decorator and caterer',
      instagram_handle: 'Rajpurohit decorator'
    },
    {
      name: 'R R decorators',
      business_type: 'Decoration & Florist',
      contact_person_name: 'Parag Thakkar',
      phone: '9821009967',
      email: null,
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080',
      description: 'Table, chair fan, mandap, stage, lighting contractor.',
      instagram_handle: null
    },
    {
      name: 'La Fiesta Decors',
      business_type: 'Decoration & Florist',
      contact_person_name: 'Hardik Neelam Thakkar',
      phone: '8898811995',
      email: 'Hardikthakkar1909@gmail.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west',
      description: 'We accept all types of decoration orders small events to big events',
      instagram_handle: 'la.fiesta.decors'
    }
  ];

  vendorData.forEach((vendor, index) => {
    const vendorName = vendor.name;
    const cloudinaryUrls = cloudinaryResults[vendorName] || [];
    
    console.log(`-- ${vendorName}`);
    console.log(`INSERT INTO vendors (`);
    console.log(`  business_name,`);
    console.log(`  business_type,`);
    console.log(`  contact_person_name,`);
    console.log(`  phone,`);
    console.log(`  email,`);
    console.log(`  whatsapp_number,`);
    console.log(`  city,`);
    console.log(`  state,`);
    console.log(`  address,`);
    console.log(`  description,`);
    console.log(`  portfolio_images,`);
    console.log(`  services_offered,`);
    console.log(`  is_verified,`);
    console.log(`  is_active,`);
    console.log(`  instagram_handle,`);
    console.log(`  created_at`);
    console.log(`) VALUES (`);
    console.log(`  '${vendor.name}',`);
    console.log(`  '${vendor.business_type}',`);
    console.log(`  '${vendor.contact_person_name}',`);
    console.log(`  '${vendor.phone}',`);
    console.log(`  ${vendor.email ? `'${vendor.email}'` : 'NULL'},`);
    console.log(`  '${vendor.phone}',`);
    console.log(`  '${vendor.city}',`);
    console.log(`  '${vendor.state}',`);
    console.log(`  '${vendor.address}',`);
    console.log(`  '${vendor.description}',`);
    console.log(`  '${JSON.stringify(cloudinaryUrls)}',`);
    console.log(`  '["Event Services"]',`);
    console.log(`  true,`);
    console.log(`  true,`);
    console.log(`  ${vendor.instagram_handle ? `'${vendor.instagram_handle}'` : 'NULL'},`);
    console.log(`  NOW()`);
    console.log(`);\n`);
  });
}

// Main execution
async function main() {
  try {
    const results = await uploadAllImages();
    generateUpdatedSQL(results);
    
    console.log('✅ All images uploaded successfully!');
    console.log('📋 Next steps:');
    console.log('1. Copy the updated SQL statements above');
    console.log('2. Run them in your Supabase SQL Editor');
    console.log('3. Your vendors will now have Cloudinary-hosted images');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
main();
