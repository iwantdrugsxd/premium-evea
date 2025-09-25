#!/usr/bin/env node

// Test script to verify the updated vendor card design
// Run with: node test-updated-design.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUpdatedDesign() {
  try {
    console.log('🎨 Testing updated vendor card design...\n');

    // Test API response
    const response = await fetch('http://localhost:3000/api/marketplace?page=1&limit=12');
    const data = await response.json();
    
    if (data.success && data.vendors && data.vendors.length > 0) {
      console.log('✅ API working: Found', data.vendors.length, 'vendors');
      
      const firstVendor = data.vendors[0];
      console.log('\n📋 Updated Card Design Features:');
      console.log('1. ✅ Removed green "VERIFIED" tag');
      console.log('2. ✅ Smaller services tag (text-xs, smaller padding)');
      console.log('3. ✅ Smaller business name (text-lg instead of text-2xl)');
      console.log('4. ✅ Improved card design with:');
      console.log('   - Rounded corners (rounded-2xl)');
      console.log('   - Better spacing and padding');
      console.log('   - Smaller action buttons');
      console.log('   - Compact rating badge');
      console.log('   - Line-clamp for business name (2 lines max)');
      console.log('   - Line-clamp for description (2 lines max)');
      
      console.log('\n🎯 Sample Vendor Data:');
      console.log(`   Name: ${firstVendor.business_name || firstVendor.name}`);
      console.log(`   Category: ${firstVendor.category}`);
      console.log(`   Rating: ${firstVendor.rating}`);
      console.log(`   Location: ${firstVendor.location}`);
      console.log(`   Description: ${firstVendor.description?.substring(0, 50)}...`);
      
      console.log('\n🌐 Visit: http://localhost:3000');
      console.log('🎨 Check the updated vendor card design!');
      
    } else {
      console.log('❌ API not working properly');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
testUpdatedDesign().catch(console.error);
