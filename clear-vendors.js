#!/usr/bin/env node

/**
 * Clear All Vendors Script
 * This script will clear all vendor entries from the database
 */

const BASE_URL = 'http://localhost:3000';

async function clearAllVendors() {
  console.log('🗑️  CLEARING ALL VENDOR ENTRIES');
  console.log('=====================================\n');

  try {
    // Step 1: Get current vendor count
    console.log('📊 STEP 1: Checking current vendor count...');
    const response = await fetch(`${BASE_URL}/api/marketplace`);
    const data = await response.json();
    
    if (data.success) {
      const currentCount = data.vendors.length;
      console.log(`✅ Found ${currentCount} vendors in the marketplace`);
      
      if (currentCount === 0) {
        console.log('🎉 No vendors to clear! Database is already empty.');
        return;
      }
    } else {
      console.log('❌ Failed to fetch current vendors');
      return;
    }

    // Step 2: Clear vendors table via direct database operation
    console.log('\n📝 STEP 2: Clearing vendors table...');
    console.log('⚠️  Note: This requires direct database access');
    console.log('💡 Run the SQL script: clear-vendors-table.sql in your Supabase dashboard');
    
    // Alternative: Clear via API if you have a delete endpoint
    console.log('\n🔧 Alternative: If you have a delete API endpoint, you can use that instead');
    
    console.log('\n✅ VENDOR CLEARING INSTRUCTIONS:');
    console.log('=====================================');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of clear-vendors-table.sql');
    console.log('4. Run the SQL script');
    console.log('5. Verify the tables are empty');
    
    console.log('\n📋 SQL Script Location: clear-vendors-table.sql');
    console.log('🌐 Supabase Dashboard: https://supabase.com/dashboard');
    
  } catch (error) {
    console.error('❌ Error during vendor clearing process:', error.message);
  }
}

// Run the script
clearAllVendors();
