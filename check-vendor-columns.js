#!/usr/bin/env node

// Script to check actual vendor table columns
// Run with: node check-vendor-columns.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkVendorColumns() {
  try {
    console.log('🔍 Checking vendor table columns...\n');

    // First, let's try to get all columns by selecting *
    console.log('1. Getting all columns with SELECT *...');
    const { data: allData, error: allError } = await supabase
      .from('vendors')
      .select('*')
      .limit(1);

    if (allError) {
      console.log('❌ Error selecting all columns:', allError.message);
    } else if (allData && allData.length > 0) {
      console.log('✅ Available columns:');
      Object.keys(allData[0]).forEach(column => {
        console.log(`  - ${column}: ${typeof allData[0][column]}`);
      });
      
      console.log('\n📋 Sample data:');
      console.log(JSON.stringify(allData[0], null, 2));
    } else {
      console.log('⚠️  No data found in vendors table');
    }

    // Try to query information_schema
    console.log('\n2. Querying information_schema...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'vendors' });

    if (columnsError) {
      console.log('❌ Error querying information_schema:', columnsError.message);
      
      // Try alternative approach
      console.log('\n3. Trying alternative column check...');
      const { data: altData, error: altError } = await supabase
        .from('vendors')
        .select('id, name, business_name, business_type, contact_person_name')
        .limit(1);

      if (altError) {
        console.log('❌ Alternative query error:', altError.message);
      } else {
        console.log('✅ Alternative query successful:', altData);
      }
    } else {
      console.log('✅ Columns from information_schema:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
checkVendorColumns().catch(console.error);
