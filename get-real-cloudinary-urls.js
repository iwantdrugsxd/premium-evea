#!/usr/bin/env node

// Script to get real Cloudinary URLs from your account
// Run with: node get-real-cloudinary-urls.js

require('dotenv').config({ path: '.env.local' });

const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function getRealCloudinaryUrls() {
  try {
    console.log('🔍 Getting real Cloudinary URLs from your account...\n');

    // Get all resources from Cloudinary
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
      console.log(`\n${vendor}: ${urls.length} images`);
      urls.forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
      });
    });

    // Generate the SQL INSERT statements
    console.log('\n📝 SQL INSERT statements:');
    console.log('-- Copy this into your Supabase SQL Editor:');
    console.log('');

    const vendorData = {
      'rajpurohit_decorator_and_caterers': {
        business_name: 'Rajpurohit Decorator and caterers',
        business_type: 'Wedding Planning',
        contact_person_name: 'Baldev Singh Rajpurohit',
        phone: '9833055077',
        email: 'rajpurohitdecorator@gmail.com',
        whatsapp_number: '9833055077',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar',
        description: 'Wedding decorator and caterer with 40 years of experience',
        services: ['Wedding Planning', 'Decoration', 'Catering', 'Photography'],
        price_min: 50000,
        price_max: 200000,
        rating: 4.5,
        events: 150,
        instagram: 'rajpurohit_decorator'
      },
      'la_fiesta_decors': {
        business_name: 'La Fiesta Decors',
        business_type: 'Decoration & Florist',
        contact_person_name: 'Hardik Neelam Thakkar',
        phone: '8898811995',
        email: 'Hardikthakkar1909@gmail.com',
        whatsapp_number: '8898811995',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west',
        description: 'We accept all types of decoration orders small events to big events',
        services: ['Decoration', 'Floral Design', 'Event Styling'],
        price_min: 30000,
        price_max: 150000,
        rating: 4.8,
        events: 200,
        instagram: 'la.fiesta.decors'
      },
      'rr_decorators': {
        business_name: 'R R decorators',
        business_type: 'Decoration & Furniture',
        contact_person_name: 'Parag Thakkar',
        phone: '9821009967',
        email: 'rrdecorators@example.com',
        whatsapp_number: '9821009967',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080',
        description: 'Table, chair fan, mandap, stage, lighting contractor',
        services: ['Furniture Rental', 'Lighting', 'Stage Setup', 'Mandap Decoration'],
        price_min: 25000,
        price_max: 100000,
        rating: 4.3,
        events: 75,
        instagram: 'rr_decorators'
      }
    };

    Object.entries(vendorImages).forEach(([vendorFolder, urls]) => {
      const vendor = vendorData[vendorFolder];
      if (vendor) {
        const urlsJson = JSON.stringify(urls);
        const servicesJson = JSON.stringify(vendor.services);
        
        console.log(`-- ${vendor.business_name}`);
        console.log(`INSERT INTO public.vendors (`);
        console.log(`  business_name, business_type, contact_person_name, phone, email,`);
        console.log(`  whatsapp_number, city, state, address, description,`);
        console.log(`  portfolio_images, services_offered, price_range_min, price_range_max,`);
        console.log(`  average_rating, total_events_completed, is_verified, is_active, instagram_handle, created_at`);
        console.log(`) VALUES (`);
        console.log(`  '${vendor.business_name}',`);
        console.log(`  '${vendor.business_type}',`);
        console.log(`  '${vendor.contact_person_name}',`);
        console.log(`  '${vendor.phone}',`);
        console.log(`  '${vendor.email}',`);
        console.log(`  '${vendor.whatsapp_number}',`);
        console.log(`  '${vendor.city}',`);
        console.log(`  '${vendor.state}',`);
        console.log(`  '${vendor.address}',`);
        console.log(`  '${vendor.description}',`);
        console.log(`  '${urlsJson}'::jsonb,`);
        console.log(`  '${servicesJson}'::jsonb,`);
        console.log(`  ${vendor.price_min},`);
        console.log(`  ${vendor.price_max},`);
        console.log(`  ${vendor.rating},`);
        console.log(`  ${vendor.events},`);
        console.log(`  true,`);
        console.log(`  true,`);
        console.log(`  '${vendor.instagram}',`);
        console.log(`  NOW()`);
        console.log(`);`);
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
getRealCloudinaryUrls().catch(console.error);
