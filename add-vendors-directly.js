#!/usr/bin/env node

// Script to add vendors directly to Supabase with Cloudinary URLs
// Run with: node add-vendors-directly.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Vendor data with Cloudinary URLs
const vendorData = [
  {
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
    portfolio_images: [
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_2.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_3.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_4.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_5.webp'
    ],
    services_offered: ['Wedding Planning', 'Decoration', 'Catering', 'Photography'],
    price_range_min: 50000,
    price_range_max: 200000,
    average_rating: 4.5,
    total_events_completed: 150,
    is_verified: true,
    is_active: true,
    instagram_handle: 'rajpurohit_decorator'
  },
  {
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
    portfolio_images: [
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_1.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_2.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_3.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_4.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_5.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_6.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_7.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_8.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_9.webp'
    ],
    services_offered: ['Decoration', 'Floral Design', 'Event Styling'],
    price_range_min: 30000,
    price_range_max: 150000,
    average_rating: 4.8,
    total_events_completed: 200,
    is_verified: true,
    is_active: true,
    instagram_handle: 'la.fiesta.decors'
  },
  {
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
    portfolio_images: [
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_1.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_2.webp',
      'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_3.webp'
    ],
    services_offered: ['Furniture Rental', 'Lighting', 'Stage Setup', 'Mandap Decoration'],
    price_range_min: 25000,
    price_range_max: 100000,
    average_rating: 4.3,
    total_events_completed: 75,
    is_verified: true,
    is_active: true,
    instagram_handle: 'rr_decorators'
  }
];

async function addVendorsDirectly() {
  try {
    console.log('🏢 Adding vendors directly to Supabase...\n');

    // First, let's check if the table exists and has the right structure
    console.log('1. Checking vendors table...');
    const { data: existingVendors, error: checkError } = await supabase
      .from('vendors')
      .select('*')
      .limit(1);

    if (checkError) {
      console.log('❌ Error checking vendors table:', checkError.message);
      console.log('Please run the SQL script first to create the table.');
      return;
    }

    console.log('✅ Vendors table exists');

    // Add each vendor
    for (const vendor of vendorData) {
      console.log(`\n📝 Adding ${vendor.business_name}...`);
      
      const { data, error } = await supabase
        .from('vendors')
        .insert(vendor)
        .select();

      if (error) {
        console.log(`❌ Error adding ${vendor.business_name}:`, error.message);
      } else {
        console.log(`✅ Successfully added ${vendor.business_name} with ${vendor.portfolio_images.length} portfolio images`);
        console.log(`   Vendor ID: ${data[0].id}`);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Verify the data was added
    console.log('\n🔍 Verifying added vendors...');
    const { data: allVendors, error: verifyError } = await supabase
      .from('vendors')
      .select('business_name, portfolio_images, is_active')
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.log('❌ Error verifying vendors:', verifyError.message);
    } else {
      console.log(`✅ Found ${allVendors.length} vendors in database:`);
      allVendors.forEach(vendor => {
        const imageCount = Array.isArray(vendor.portfolio_images) ? vendor.portfolio_images.length : 0;
        console.log(`  - ${vendor.business_name}: ${imageCount} images (active: ${vendor.is_active})`);
      });
    }

    console.log('\n🎉 Vendor addition complete!');
    console.log('🌐 Check your website at: http://localhost:3001');
    console.log('📱 The vendor cards should now display with their Cloudinary images');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
addVendorsDirectly().catch(console.error);
