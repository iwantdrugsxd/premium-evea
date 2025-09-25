#!/usr/bin/env node

// Final test script after adding portfolio_images column
// Run with: node test-final-structure.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFinalStructure() {
  try {
    console.log('🎯 Final Test - Verifying updated structure...\n');

    // Test 1: Check if portfolio_images column exists
    console.log('1. Checking portfolio_images column...');
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('id, name, portfolio_images')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    if (vendors.length > 0) {
      const vendor = vendors[0];
      if (vendor.portfolio_images !== undefined) {
        console.log('✅ portfolio_images column exists');
        console.log(`Portfolio images count: ${vendor.portfolio_images.length}`);
        console.log('Sample images:', vendor.portfolio_images.slice(0, 2));
      } else {
        console.log('❌ portfolio_images column still does not exist');
        console.log('Please run the SQL script first!');
        return;
      }
    }

    // Test 2: Test API with portfolio images
    console.log('\n2. Testing API with portfolio images...');
    const response = await fetch('http://localhost:3000/api/marketplace?page=1&limit=12');
    const data = await response.json();
    
    if (data.success && data.vendors && data.vendors.length > 0) {
      const firstVendor = data.vendors[0];
      console.log(`✅ API working: Found ${data.vendors.length} vendors`);
      console.log(`Portfolio images for ${firstVendor.name}: ${firstVendor.portfolio.length}`);
      
      if (firstVendor.portfolio.length > 0) {
        console.log('🎉 SUCCESS! Portfolio images are working!');
        console.log('\n📋 What you should see on your website:');
        console.log('1. ✅ Vendor cards with main images');
        console.log('2. ✅ "View Details" modal with restructured layout:');
        console.log('   - Left side: About, Location, Experience, Events, Email, Service Areas, Services, Reviews');
        console.log('   - Right side: Pricing & Details + Portfolio images grid');
        console.log('3. ✅ No "Contact Vendor" button');
        console.log('4. ✅ No "Response Time" field');
        console.log('\n🌐 Visit: http://localhost:3000');
      } else {
        console.log('⚠️ Portfolio images not showing in API response');
      }
    } else {
      console.log('❌ API not working properly');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
testFinalStructure().catch(console.error);
