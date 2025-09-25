#!/usr/bin/env node

// Script to test current vendor structure
// Run with: node test-current-structure.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCurrentStructure() {
  try {
    console.log('🔍 Testing current vendor structure...\n');

    // Get one vendor to see the current structure
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    if (vendors.length > 0) {
      console.log('📋 Current vendor structure:');
      console.log(JSON.stringify(vendors[0], null, 2));
      
      console.log('\n🔍 Checking for portfolio_images column...');
      if (vendors[0].portfolio_images !== undefined) {
        console.log('✅ portfolio_images column exists');
        console.log('Portfolio images:', vendors[0].portfolio_images);
      } else {
        console.log('❌ portfolio_images column does not exist');
      }
    } else {
      console.log('❌ No vendors found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
testCurrentStructure().catch(console.error);
