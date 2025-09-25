#!/usr/bin/env node

// Script to check the actual vendors table schema
// Run with: node check-actual-schema.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualSchema() {
  console.log('🔍 Checking actual vendors table schema...\n');

  try {
    // Get all tables
    console.log('1. Getting all tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('❌ Error getting tables:', tablesError.message);
    } else {
      console.log('📋 Available tables:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    // Check if vendors table exists and get its columns
    console.log('\n2. Checking vendors table columns...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'vendors')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (columnsError) {
      console.log('❌ Error getting columns:', columnsError.message);
    } else if (columns.length === 0) {
      console.log('❌ Vendors table does not exist!');
    } else {
      console.log('📋 Vendors table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    // Try to select from vendors table
    console.log('\n3. Testing select from vendors...');
    const { data: vendors, error: selectError } = await supabase
      .from('vendors')
      .select('*')
      .limit(1);

    if (selectError) {
      console.log('❌ Error selecting from vendors:', selectError.message);
    } else {
      console.log(`✅ Successfully selected from vendors (${vendors.length} rows)`);
      if (vendors.length > 0) {
        console.log('Sample data:', JSON.stringify(vendors[0], null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
checkActualSchema().catch(console.error);
