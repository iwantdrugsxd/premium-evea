#!/usr/bin/env node

// Script to test the fixed API
// Run with: node test-api-fixed.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Create a fresh Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAPIFixed() {
  try {
    console.log('🔍 Testing fixed API...\n');

    // Test the exact query from the API
    const { data: vendors, error, count } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .range(0, 11)
      .order('average_rating', { ascending: false })
      .order('total_events_completed', { ascending: false });

    if (error) {
      console.log('❌ Database query error:', error);
      return;
    }

    console.log(`✅ Successfully fetched ${vendors.length} vendors (total: ${count})`);
    
    if (vendors.length > 0) {
      console.log('\n📋 Sample vendor data:');
      console.log(JSON.stringify(vendors[0], null, 2));
    }

    // Test the API endpoint
    console.log('\n2. Testing API endpoint...');
    const response = await fetch('http://localhost:3001/api/marketplace?page=1&limit=12');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.success && data.vendors && data.vendors.length > 0) {
      console.log('\n🎉 SUCCESS! Vendors are now being fetched correctly!');
      console.log(`Found ${data.vendors.length} vendors`);
    } else {
      console.log('\n❌ API still not working properly');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
testAPIFixed().catch(console.error);
