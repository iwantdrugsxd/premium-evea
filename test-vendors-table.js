#!/usr/bin/env node

// Script to test vendors table and debug the issue
// Run with: node test-vendors-table.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVendorsTable() {
  console.log('🔍 Testing vendors table...\n');

  try {
    // First, let's check if the table exists and get its structure
    console.log('1. Checking table structure...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'vendors' });

    if (columnsError) {
      console.log('❌ Error getting columns:', columnsError.message);
      
      // Try a different approach - just select all columns
      console.log('\n2. Trying to select all columns...');
      const { data: allData, error: allError } = await supabase
        .from('vendors')
        .select('*')
        .limit(1);

      if (allError) {
        console.log('❌ Error selecting from vendors:', allError.message);
        return;
      }

      if (allData && allData.length > 0) {
        console.log('✅ Table exists! Available columns:');
        Object.keys(allData[0]).forEach(column => {
          console.log(`  - ${column}: ${typeof allData[0][column]}`);
        });
      } else {
        console.log('⚠️  Table exists but is empty');
      }
    } else {
      console.log('✅ Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }

    // Try to insert a test vendor
    console.log('\n3. Testing vendor insertion...');
    const testVendor = {
      business_name: 'Test Vendor',
      business_type: 'Test Type',
      contact_person_name: 'Test Person',
      phone: '1234567890',
      email: 'test@example.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Test description',
      portfolio_images: ['https://example.com/image1.jpg'],
      services_offered: ['Test Service'],
      is_verified: true,
      is_active: true
    };

    const { data: insertData, error: insertError } = await supabase
      .from('vendors')
      .insert(testVendor)
      .select();

    if (insertError) {
      console.log('❌ Error inserting test vendor:', insertError.message);
    } else {
      console.log('✅ Successfully inserted test vendor:', insertData[0].id);
      
      // Clean up - delete the test vendor
      await supabase
        .from('vendors')
        .delete()
        .eq('id', insertData[0].id);
      console.log('🧹 Cleaned up test vendor');
    }

    // Try to fetch vendors
    console.log('\n4. Testing vendor fetch...');
    const { data: vendors, error: fetchError } = await supabase
      .from('vendors')
      .select('*')
      .limit(5);

    if (fetchError) {
      console.log('❌ Error fetching vendors:', fetchError.message);
    } else {
      console.log(`✅ Successfully fetched ${vendors.length} vendors`);
      if (vendors.length > 0) {
        console.log('Sample vendor:', JSON.stringify(vendors[0], null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
testVendorsTable().catch(console.error);
