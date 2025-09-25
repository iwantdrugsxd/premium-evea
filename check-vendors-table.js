#!/usr/bin/env node

// Script to check vendors table structure
// Run with: node check-vendors-table.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVendorsTable() {
  console.log('🔍 Checking vendors table structure...\n');

  try {
    // Get a sample vendor record to see the structure
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Error fetching vendors:', error.message);
      return;
    }

    if (vendors && vendors.length > 0) {
      console.log('📋 Available columns in vendors table:');
      Object.keys(vendors[0]).forEach(column => {
        console.log(`  - ${column}: ${typeof vendors[0][column]}`);
      });

      console.log('\n📊 Sample vendor data:');
      console.log(JSON.stringify(vendors[0], null, 2));
    } else {
      console.log('❌ No vendors found in table');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
checkVendorsTable().catch(console.error);
