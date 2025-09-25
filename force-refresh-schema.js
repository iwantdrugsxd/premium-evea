#!/usr/bin/env node

// Script to force refresh schema and test vendors
// Run with: node force-refresh-schema.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceRefreshSchema() {
  try {
    console.log('🔍 Force refreshing schema and testing vendors...\n');

    // Test 1: Try to get all vendors with minimal query
    console.log('1. Testing minimal query...');
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('*');

    if (vendorsError) {
      console.log('❌ Error getting vendors:', vendorsError.message);
      console.log('Error code:', vendorsError.code);
      console.log('Error details:', vendorsError.details);
    } else {
      console.log(`✅ Successfully fetched ${vendors.length} vendors`);
      if (vendors.length > 0) {
        console.log('Sample vendor:', JSON.stringify(vendors[0], null, 2));
      }
    }

    // Test 2: Try with raw SQL query
    console.log('\n2. Testing with raw SQL...');
    const { data: rawData, error: rawError } = await supabase
      .rpc('get_vendors_count');

    if (rawError) {
      console.log('❌ Error with raw SQL:', rawError.message);
    } else {
      console.log('✅ Raw SQL result:', rawData);
    }

    // Test 3: Try to create a simple function to test
    console.log('\n3. Testing with simple function...');
    const { data: funcData, error: funcError } = await supabase
      .rpc('get_vendors_simple');

    if (funcError) {
      console.log('❌ Error with function:', funcError.message);
    } else {
      console.log('✅ Function result:', funcData);
    }

    // Test 4: Try to insert a vendor with minimal fields
    console.log('\n4. Testing insert with minimal fields...');
    const { data: insertData, error: insertError } = await supabase
      .from('vendors')
      .insert({
        business_name: 'Test Vendor 2',
        contact_person_name: 'Test Person 2',
        phone: '1234567890',
        email: 'test2@example.com',
        city: 'Mumbai',
        state: 'Maharashtra'
      })
      .select();

    if (insertError) {
      console.log('❌ Error inserting minimal vendor:', insertError.message);
    } else {
      console.log('✅ Successfully inserted minimal vendor:', insertData[0].id);
      
      // Clean up
      await supabase
        .from('vendors')
        .delete()
        .eq('id', insertData[0].id);
      console.log('🧹 Cleaned up test vendor');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
forceRefreshSchema().catch(console.error);
