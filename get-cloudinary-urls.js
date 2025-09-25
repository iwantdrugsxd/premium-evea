#!/usr/bin/env node

// Script to get Cloudinary URLs from previous uploads
// Run with: node get-cloudinary-urls.js

require('dotenv').config({ path: '.env.local' });

const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function getCloudinaryUrls() {
  try {
    console.log('🔍 Getting Cloudinary URLs from previous uploads...\n');

    // Get all resources from Cloudinary for our vendors
    const { resources } = await cloudinary.search
      .expression('folder:evea/vendors/*')
      .sort_by([['created_at', 'desc']])
      .max_results(50)
      .execute();

    console.log(`📸 Found ${resources.length} images in Cloudinary`);

    // Group images by vendor folder
    const vendorImages = {};
    resources.forEach(resource => {
      const folderParts = resource.folder.split('/');
      const vendorFolder = folderParts[folderParts.length - 1];
      
      if (!vendorImages[vendorFolder]) {
        vendorImages[vendorFolder] = [];
      }
      vendorImages[vendorFolder].push(resource.secure_url);
    });

    console.log('\n📁 Images by vendor:');
    Object.entries(vendorImages).forEach(([vendor, urls]) => {
      console.log(`  ${vendor}: ${urls.length} images`);
      urls.forEach((url, index) => {
        console.log(`    ${index + 1}. ${url}`);
      });
    });

    // Generate SQL with actual Cloudinary URLs
    console.log('\n📝 SQL INSERT statements with Cloudinary URLs:');
    console.log('-- Copy this into your SQL script:');
    console.log('');

    const vendorMapping = {
      'rajpurohit_decorator_and_caterers': {
        business_name: 'Rajpurohit Decorator and caterers',
        contact_person: 'Baldev Singh Rajpurohit',
        phone: '9833055077',
        email: 'rajpurohitdecorator@gmail.com',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar',
        description: 'Wedding decorator and caterer with 40 years of experience',
        services: '["Wedding Planning", "Decoration", "Catering", "Photography"]',
        price_min: 50000,
        price_max: 200000,
        rating: 4.5,
        events: 150,
        instagram: 'rajpurohit_decorator'
      },
      'la_fiesta_decors': {
        business_name: 'La Fiesta Decors',
        contact_person: 'Hardik Neelam Thakkar',
        phone: '8898811995',
        email: 'Hardikthakkar1909@gmail.com',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west',
        description: 'We accept all types of decoration orders small events to big events',
        services: '["Decoration", "Floral Design", "Event Styling"]',
        price_min: 30000,
        price_max: 150000,
        rating: 4.8,
        events: 200,
        instagram: 'la.fiesta.decors'
      }
    };

    Object.entries(vendorImages).forEach(([vendorFolder, urls]) => {
      const vendor = vendorMapping[vendorFolder];
      if (vendor) {
        const urlsJson = JSON.stringify(urls);
        console.log(`-- ${vendor.business_name}`);
        console.log(`('${vendor.business_name}',`);
        console.log(`'${vendor.contact_person}',`);
        console.log(`'${vendor.phone}',`);
        console.log(`'${vendor.email}',`);
        console.log(`'${vendor.city}',`);
        console.log(`'${vendor.state}',`);
        console.log(`'${vendor.address}',`);
        console.log(`'${vendor.description}',`);
        console.log(`'${urlsJson}'::jsonb,`);
        console.log(`'${vendor.services}'::jsonb,`);
        console.log(`${vendor.price_min},`);
        console.log(`${vendor.price_max},`);
        console.log(`${vendor.rating},`);
        console.log(`${vendor.events},`);
        console.log(`true,`);
        console.log(`true,`);
        console.log(`'${vendor.instagram}',`);
        console.log(`NOW()),`);
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
getCloudinaryUrls().catch(console.error);
