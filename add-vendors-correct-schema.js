#!/usr/bin/env node

// Script to add vendors with correct schema
// Run with: node add-vendors-correct-schema.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Vendor data with correct schema
const vendorData = [
  {
    name: 'Rajpurohit Decorator and caterers',
    category: 'Wedding Planning',
    rating: 4.5,
    events_count: 150,
    price: '₹50,000 - ₹2,00,000',
    price_label: 'Price Range',
    response_time: 'Within 24 hours',
    badge: 'Verified',
    image: 'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp',
    description: 'Wedding decorator and caterer with 40 years of experience',
    location: 'Mumbai, Maharashtra',
    experience: '40+ years',
    team_size: '10-15 members',
    availability: 'Available',
    email: 'rajpurohitdecorator@gmail.com',
    phone: '9833055077',
    address: 'Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar',
    status: 'active',
    features: ['Wedding Planning', 'Decoration', 'Catering', 'Photography'],
    service_areas: ['Mumbai', 'Navi Mumbai', 'Thane'],
    services_offered: ['Wedding Planning', 'Decoration', 'Catering', 'Photography']
  },
  {
    name: 'La Fiesta Decors',
    category: 'Decoration & Florist',
    rating: 4.8,
    events_count: 200,
    price: '₹30,000 - ₹1,50,000',
    price_label: 'Price Range',
    response_time: 'Within 24 hours',
    badge: 'Verified',
    image: 'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_1.webp',
    description: 'We accept all types of decoration orders small events to big events',
    location: 'Mumbai, Maharashtra',
    experience: '6+ years',
    team_size: '5-10 members',
    availability: 'Available',
    email: 'Hardikthakkar1909@gmail.com',
    phone: '8898811995',
    address: 'Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west',
    status: 'active',
    features: ['Decoration', 'Floral Design', 'Event Styling'],
    service_areas: ['Mumbai', 'Navi Mumbai', 'Thane'],
    services_offered: ['Decoration', 'Floral Design', 'Event Styling']
  },
  {
    name: 'R R decorators',
    category: 'Decoration & Furniture',
    rating: 4.3,
    events_count: 75,
    price: '₹25,000 - ₹1,00,000',
    price_label: 'Price Range',
    response_time: 'Within 24 hours',
    badge: 'Verified',
    image: 'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_1.webp',
    description: 'Table, chair fan, mandap, stage, lighting contractor',
    location: 'Mumbai, Maharashtra',
    experience: '10+ years',
    team_size: '8-12 members',
    availability: 'Available',
    email: 'rrdecorators@example.com',
    phone: '9821009967',
    address: 'R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080',
    status: 'active',
    features: ['Furniture Rental', 'Lighting', 'Stage Setup', 'Mandap Decoration'],
    service_areas: ['Mumbai', 'Navi Mumbai', 'Thane'],
    services_offered: ['Furniture Rental', 'Lighting', 'Stage Setup', 'Mandap Decoration']
  }
];

async function addVendorsCorrectSchema() {
  try {
    console.log('🏢 Adding vendors with correct schema...\n');

    for (const vendor of vendorData) {
      console.log(`📝 Adding ${vendor.name}...`);
      
      const { data, error } = await supabase
        .from('vendors')
        .insert(vendor)
        .select();

      if (error) {
        console.log(`❌ Error adding ${vendor.name}:`, error.message);
      } else {
        console.log(`✅ Successfully added ${vendor.name} with ID: ${data[0].id}`);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Verify the data was added
    console.log('\n🔍 Verifying added vendors...');
    const { data: allVendors, error: verifyError } = await supabase
      .from('vendors')
      .select('id, name, category, rating, events_count, status')
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.log('❌ Error verifying vendors:', verifyError.message);
    } else {
      console.log(`✅ Found ${allVendors.length} vendors in database:`);
      allVendors.forEach(vendor => {
        console.log(`  - ${vendor.name}: ${vendor.category} (Rating: ${vendor.rating}, Events: ${vendor.events_count}, Status: ${vendor.status})`);
      });
    }

    console.log('\n🎉 Vendor addition complete!');
    console.log('🌐 Check your website at: http://localhost:3000');
    console.log('📱 The vendor cards should now display with their Cloudinary images');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
addVendorsCorrectSchema().catch(console.error);
