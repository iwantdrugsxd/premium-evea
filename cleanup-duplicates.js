#!/usr/bin/env node

// Script to clean up duplicate vendors
// Run with: node cleanup-duplicates.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDuplicates() {
  try {
    console.log('🧹 Cleaning up duplicate vendors...\n');

    // Get all vendors
    const { data: allVendors, error: fetchError } = await supabase
      .from('vendors')
      .select('id, name, created_at')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.log('❌ Error fetching vendors:', fetchError.message);
      return;
    }

    console.log(`Found ${allVendors.length} total vendors`);

    // Group by name to find duplicates
    const grouped = {};
    allVendors.forEach(vendor => {
      if (!grouped[vendor.name]) {
        grouped[vendor.name] = [];
      }
      grouped[vendor.name].push(vendor);
    });

    // Find and delete duplicates (keep the first one)
    let deletedCount = 0;
    for (const [name, vendors] of Object.entries(grouped)) {
      if (vendors.length > 1) {
        console.log(`\n📝 Found ${vendors.length} duplicates for "${name}"`);
        
        // Keep the first one, delete the rest
        const toDelete = vendors.slice(1);
        for (const vendor of toDelete) {
          const { error: deleteError } = await supabase
            .from('vendors')
            .delete()
            .eq('id', vendor.id);
          
          if (deleteError) {
            console.log(`❌ Error deleting vendor ${vendor.id}:`, deleteError.message);
          } else {
            console.log(`✅ Deleted duplicate vendor ${vendor.id}`);
            deletedCount++;
          }
        }
      }
    }

    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} duplicate vendors`);

    // Verify final count
    const { data: finalVendors, error: finalError } = await supabase
      .from('vendors')
      .select('id, name, category, rating, events_count')
      .order('created_at', { ascending: true });

    if (finalError) {
      console.log('❌ Error fetching final vendors:', finalError.message);
    } else {
      console.log(`\n✅ Final vendor count: ${finalVendors.length}`);
      finalVendors.forEach(vendor => {
        console.log(`  - ${vendor.name}: ${vendor.category} (Rating: ${vendor.rating}, Events: ${vendor.events_count})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
cleanupDuplicates().catch(console.error);
