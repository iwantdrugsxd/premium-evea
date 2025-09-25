#!/usr/bin/env node

// Script to test the working API
// Run with: node test-api-working.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAPIWorking() {
  try {
    console.log('🔍 Testing working API...\n');

    // Test 1: Direct Supabase query
    console.log('1. Testing direct Supabase query...');
    const { data: vendors, error, count } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range(0, 11)
      .order('rating', { ascending: false })
      .order('events_count', { ascending: false });

    if (error) {
      console.log('❌ Database query error:', error.message);
    } else {
      console.log(`✅ Successfully fetched ${vendors.length} vendors (total: ${count})`);
      if (vendors.length > 0) {
        console.log('Sample vendor:', JSON.stringify(vendors[0], null, 2));
      }
    }

    // Test 2: API endpoint
    console.log('\n2. Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/marketplace?page=1&limit=12');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n🎉 SUCCESS! API is working correctly!');
      console.log(`Found ${data.vendors.length} vendors`);
    } else {
      console.log('\n❌ API still not working properly');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
testAPIWorking().catch(console.error);
