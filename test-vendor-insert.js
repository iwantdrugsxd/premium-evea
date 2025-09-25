#!/usr/bin/env node

// Script to test vendor insertion and discover schema
// Run with: node test-vendor-insert.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testVendorInsert() {
  try {
    console.log('🔍 Testing vendor insertion to discover schema...\n');

    // Try different column name variations
    const testData = [
      {
        name: 'Test Vendor 1',
        business_name: 'Test Business 1',
        business_type: 'Wedding Planning',
        contact_person: 'Test Person 1',
        contact_person_name: 'Test Person 1',
        phone: '1234567890',
        email: 'test1@example.com',
        city: 'Mumbai',
        state: 'Maharashtra',
        description: 'Test description',
        is_active: true
      }
    ];

    console.log('1. Trying with business_name...');
    const { data: data1, error: error1 } = await supabase
      .from('vendors')
      .insert(testData)
      .select();

    if (error1) {
      console.log('❌ Error with business_name:', error1.message);
    } else {
      console.log('✅ Success with business_name:', data1);
      return;
    }

    console.log('\n2. Trying with name only...');
    const testData2 = [{
      name: 'Test Vendor 2',
      business_type: 'Wedding Planning',
      contact_person: 'Test Person 2',
      phone: '1234567890',
      email: 'test2@example.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Test description',
      is_active: true
    }];

    const { data: data2, error: error2 } = await supabase
      .from('vendors')
      .insert(testData2)
      .select();

    if (error2) {
      console.log('❌ Error with name only:', error2.message);
    } else {
      console.log('✅ Success with name only:', data2);
    }

    // Try to get table info using a different approach
    console.log('\n3. Trying to get table info...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('tablename', 'vendors');

    if (tableError) {
      console.log('❌ Error getting table info:', tableError.message);
    } else {
      console.log('✅ Table info:', tableInfo);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
testVendorInsert().catch(console.error);
