#!/usr/bin/env node

// Script to test vendors table directly
// Run with: node test-vendors-direct.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testVendorsDirect() {
  try {
    console.log('🔍 Testing vendors table directly...\n');

    // Test 1: Simple select all
    console.log('1. Testing simple select all...');
    const { data: allVendors, error: allError } = await supabase
      .from('vendors')
      .select('*')
      .limit(5);

    if (allError) {
      console.log('❌ Error selecting all vendors:', allError.message);
    } else {
      console.log(`✅ Successfully fetched ${allVendors.length} vendors`);
      if (allVendors.length > 0) {
        console.log('Sample vendor:', JSON.stringify(allVendors[0], null, 2));
      }
    }

    // Test 2: Select with specific columns
    console.log('\n2. Testing select with specific columns...');
    const { data: specificVendors, error: specificError } = await supabase
      .from('vendors')
      .select('id, business_name, business_type, city, state, portfolio_images')
      .limit(3);

    if (specificError) {
      console.log('❌ Error selecting specific columns:', specificError.message);
    } else {
      console.log(`✅ Successfully fetched ${specificVendors.length} vendors with specific columns`);
      if (specificVendors.length > 0) {
        console.log('Sample vendor with specific columns:', JSON.stringify(specificVendors[0], null, 2));
      }
    }

    // Test 3: Select with filtering
    console.log('\n3. Testing select with filtering...');
    const { data: filteredVendors, error: filterError } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .limit(3);

    if (filterError) {
      console.log('❌ Error filtering vendors:', filterError.message);
    } else {
      console.log(`✅ Successfully fetched ${filteredVendors.length} active vendors`);
    }

    // Test 4: Count vendors
    console.log('\n4. Testing count...');
    const { count, error: countError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error counting vendors:', countError.message);
    } else {
      console.log(`✅ Total vendors count: ${count}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
testVendorsDirect().catch(console.error);
