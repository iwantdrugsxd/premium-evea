#!/usr/bin/env node

// Final test script to verify everything is working
// Run with: node final-test.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalTest() {
  try {
    console.log('🎯 Final Test - Verifying everything is working...\n');

    // Test 1: Database query
    console.log('1. Testing database query...');
    const { data: vendors, error, count } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range(0, 11)
      .order('rating', { ascending: false })
      .order('events_count', { ascending: false });

    if (error) {
      console.log('❌ Database error:', error.message);
      return;
    }

    console.log(`✅ Database: Found ${vendors.length} vendors (total: ${count})`);

    // Test 2: API endpoint
    console.log('\n2. Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/marketplace?page=1&limit=12');
    const data = await response.json();
    
    console.log(`✅ API: Status ${response.status}, Found ${data.vendors?.length || 0} vendors`);

    if (data.success && data.vendors && data.vendors.length > 0) {
      console.log('\n🎉 SUCCESS! Everything is working perfectly!');
      console.log('\n📋 Vendor Summary:');
      data.vendors.forEach((vendor, index) => {
        console.log(`  ${index + 1}. ${vendor.name}`);
        console.log(`     Category: ${vendor.category}`);
        console.log(`     Rating: ${vendor.rating} ⭐`);
        console.log(`     Events: ${vendor.events} events`);
        console.log(`     Price: ${vendor.price}`);
        console.log(`     Location: ${vendor.location}`);
        console.log(`     Image: ${vendor.image ? '✅ Cloudinary' : '❌ Missing'}`);
        console.log('');
      });

      console.log('🌐 Your website is ready!');
      console.log('📱 Visit: http://localhost:3000');
      console.log('🎨 Vendor cards should display with Cloudinary images');
      console.log('🔍 "View Details" modals should show portfolio galleries');
    } else {
      console.log('\n❌ Something is still not working properly');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
finalTest().catch(console.error);
