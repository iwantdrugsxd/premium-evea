#!/usr/bin/env node

// Script to test with fresh Supabase connection
// Run with: node test-fresh-connection.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testFreshConnection() {
  try {
    console.log('🔍 Testing with fresh Supabase connection...\n');

    // Create a completely fresh client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });

    // Test 1: Simple select
    console.log('1. Testing simple select...');
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .limit(5);

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Error code:', error.code);
      console.log('Error details:', error.details);
    } else {
      console.log(`✅ Successfully fetched ${vendors.length} vendors`);
      if (vendors.length > 0) {
        console.log('Sample vendor:', JSON.stringify(vendors[0], null, 2));
      }
    }

    // Test 2: Try to get the API response
    console.log('\n2. Testing API response...');
    const response = await fetch('http://localhost:3001/api/marketplace?page=1&limit=12');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
testFreshConnection().catch(console.error);
