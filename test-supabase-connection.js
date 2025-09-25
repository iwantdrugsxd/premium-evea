#!/usr/bin/env node

// Script to test Supabase connection and debug the issue
// Run with: node test-supabase-connection.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase connection...\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseServiceKey);
console.log('Service Key (first 20 chars):', supabaseServiceKey?.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabaseConnection() {
  try {
    // Test 1: Check if we can connect to the database
    console.log('\n1. Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('vendors')
      .select('id')
      .limit(1);

    if (testError) {
      console.log('❌ Database connection error:', testError.message);
      console.log('Error code:', testError.code);
      console.log('Error details:', testError.details);
      console.log('Error hint:', testError.hint);
    } else {
      console.log('✅ Database connection successful');
      console.log('Test data:', testData);
    }

    // Test 2: Check what tables exist
    console.log('\n2. Checking available tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('❌ Error getting tables:', tablesError.message);
    } else {
      console.log('✅ Available tables:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    // Test 3: Check vendors table structure
    console.log('\n3. Checking vendors table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'vendors')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (columnsError) {
      console.log('❌ Error getting columns:', columnsError.message);
    } else {
      console.log('✅ Vendors table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }

    // Test 4: Try to insert a test record
    console.log('\n4. Testing insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('vendors')
      .insert({
        business_name: 'Test Vendor',
        business_type: 'Test Type',
        contact_person_name: 'Test Person',
        phone: '1234567890',
        email: 'test@example.com',
        city: 'Mumbai',
        state: 'Maharashtra',
        description: 'Test description',
        is_active: true
      })
      .select();

    if (insertError) {
      console.log('❌ Error inserting test vendor:', insertError.message);
    } else {
      console.log('✅ Successfully inserted test vendor:', insertData[0].id);
      
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
testSupabaseConnection().catch(console.error);