#!/usr/bin/env node

// Script to test API after running the SQL
// Run with: node test-api-after-sql.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAPIAfterSQL() {
  try {
    console.log('🔍 Testing API after SQL execution...\n');

    // Test direct Supabase query
    console.log('1. Testing direct Supabase query...');
    const { data: vendors, error, count } = await supabase
      .from('vendors')
      .select(`
        id,
        business_name,
        business_type,
        average_rating,
        total_events_completed,
        price_range_min,
        price_range_max,
        description,
        city,
        state,
        email,
        phone,
        portfolio_images,
        services_offered,
        is_verified,
        is_active,
        created_at
      `, { count: 'exact' })
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
testAPIAfterSQL().catch(console.error);
