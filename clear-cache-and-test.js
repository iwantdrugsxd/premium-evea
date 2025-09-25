#!/usr/bin/env node

// Script to clear cache and test API
// Run with: node clear-cache-and-test.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clearCacheAndTest() {
  try {
    console.log('🔍 Clearing cache and testing API...\n');

    // Test 1: Direct query without filters
    console.log('1. Testing direct query without filters...');
    const { data: allVendors, error: allError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' });

    if (allError) {
      console.log('❌ Error:', allError.message);
    } else {
      console.log(`✅ Found ${allVendors.length} total vendors`);
    }

    // Test 2: Query with status filter
    console.log('\n2. Testing query with status filter...');
    const { data: activeVendors, error: activeError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    if (activeError) {
      console.log('❌ Error:', activeError.message);
    } else {
      console.log(`✅ Found ${activeVendors.length} active vendors`);
    }

    // Test 3: Query with range
    console.log('\n3. Testing query with range...');
    const { data: rangedVendors, error: rangedError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range(0, 11);

    if (rangedError) {
      console.log('❌ Error:', rangedError.message);
    } else {
      console.log(`✅ Found ${rangedVendors.length} vendors with range`);
    }

    // Test 4: API endpoint
    console.log('\n4. Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/marketplace?page=1&limit=12');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
clearCacheAndTest().catch(console.error);
