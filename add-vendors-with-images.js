#!/usr/bin/env node

// Script to add vendors with portfolio images directly
// Run with: node add-vendors-with-images.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Vendor data with placeholder portfolio images
const vendorData = [
  {
    id: "ab450fa5-39ad-40eb-b694-83ba683183c4",
    business_name: "Rajpurohit Decorator and caterers",
    business_type: "Wedding Planning",
    contact_person_name: "Baldev Singh Rajpurohit",
    phone: "9833055077",
    email: "rajpurohitdecorator@gmail.com",
    whatsapp_number: "9833055077",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar",
    description: "Wedding decorator and caterer",
    portfolio_images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center"
    ],
    services_offered: ["Wedding Planning", "Decoration", "Catering", "Photography"],
    price_range_min: null,
    price_range_max: null,
    average_rating: 4.5,
    total_events_completed: 150,
    is_verified: true,
    is_active: true,
    instagram_handle: "rajpurohit_decorator",
    website_url: null
  },
  {
    id: "df495df1-412e-4c91-860f-9d904f76d512",
    business_name: "La Fiesta Decors",
    business_type: "Decoration & Florist",
    contact_person_name: "Hardik Neelam Thakkar",
    phone: "8898811995",
    email: "Hardikthakkar1909@gmail.com",
    whatsapp_number: "8898811995",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west",
    description: "We accept all types of decoration orders small events to big events",
    portfolio_images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center"
    ],
    services_offered: ["Decoration", "Floral Design", "Event Styling"],
    price_range_min: null,
    price_range_max: null,
    average_rating: 4.8,
    total_events_completed: 200,
    is_verified: true,
    is_active: true,
    instagram_handle: "la.fiesta.decors",
    website_url: null
  }
];

async function addVendorsWithImages() {
  console.log('🏢 Adding vendors with portfolio images...\n');

  for (const vendor of vendorData) {
    console.log(`📝 Adding vendor: ${vendor.business_name}`);
    
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert(vendor)
        .select();

      if (error) {
        console.log(`❌ Error adding ${vendor.business_name}:`, error.message);
      } else {
        console.log(`✅ Successfully added ${vendor.business_name} with ${vendor.portfolio_images.length} portfolio images`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${vendor.business_name}:`, error.message);
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎉 Vendor addition complete!');
  console.log('🌐 Check your website at: http://localhost:3001');
}

// Run the script
addVendorsWithImages().catch(console.error);
