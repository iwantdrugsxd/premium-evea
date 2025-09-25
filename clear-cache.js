#!/usr/bin/env node

// Script to clear cache and test API
// Run with: node clear-cache.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clearCache() {
  try {
    console.log('🧹 Clearing cache and testing API...\n');

    // Test 1: Clear cache by making a request with a different parameter
    console.log('1. Making request with different parameters to clear cache...');
    const response1 = await fetch('http://localhost:3000/api/marketplace?page=1&limit=12&_t=' + Date.now());
    const data1 = await response1.json();
    console.log('Response 1:', data1.success ? 'SUCCESS' : 'FAILED');
    console.log('Vendors count:', data1.vendors?.length || 0);

    // Test 2: Make another request
    console.log('\n2. Making another request...');
    const response2 = await fetch('http://localhost:3000/api/marketplace?page=1&limit=12');
    const data2 = await response2.json();
    console.log('Response 2:', data2.success ? 'SUCCESS' : 'FAILED');
    console.log('Vendors count:', data2.vendors?.length || 0);

    // Test 3: Check if vendors exist in database
    console.log('\n3. Checking vendors in database...');
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('id, name, status')
      .eq('status', 'active');

    if (error) {
      console.log('❌ Database error:', error.message);
    } else {
      console.log(`✅ Found ${vendors.length} active vendors in database:`);
      vendors.forEach(vendor => {
        console.log(`  - ${vendor.name} (ID: ${vendor.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
clearCache().catch(console.error);
