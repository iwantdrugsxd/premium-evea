#!/usr/bin/env node

// Script to update existing vendors with Cloudinary URLs
// Run with: node update-existing-vendors.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cloudinary URLs based on the uploads that were successful
const cloudinaryUrls = {
  'rajpurohit_decorator_and_caterers': [
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_2.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_3.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_4.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_5.webp'
  ],
  'la_fiesta_decors': [
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_1.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_2.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_3.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_4.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_5.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_6.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_7.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_8.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_9.webp'
  ],
  'rr_decorators': [
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_1.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_2.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_3.webp'
  ]
};

async function updateExistingVendors() {
  try {
    console.log('🔍 Updating existing vendors with Cloudinary URLs...\n');

    // First, let's check what vendors exist
    const { data: existingVendors, error: fetchError } = await supabase
      .from('vendors')
      .select('*');

    if (fetchError) {
      console.log('❌ Error fetching vendors:', fetchError.message);
      return;
    }

    console.log(`📋 Found ${existingVendors.length} existing vendors`);

    if (existingVendors.length === 0) {
      console.log('⚠️  No vendors found. Please run the SQL script first to create the table and add vendors.');
      return;
    }

    // Update each vendor with their Cloudinary URLs
    for (const vendor of existingVendors) {
      console.log(`\n📝 Updating ${vendor.business_name}...`);

      // Determine which Cloudinary URLs to use based on business name
      let urls = [];
      if (vendor.business_name.toLowerCase().includes('rajpurohit')) {
        urls = cloudinaryUrls.rajpurohit_decorator_and_caterers;
      } else if (vendor.business_name.toLowerCase().includes('fiesta')) {
        urls = cloudinaryUrls.la_fiesta_decors;
      } else if (vendor.business_name.toLowerCase().includes('rr')) {
        urls = cloudinaryUrls.rr_decorators;
      }

      if (urls.length > 0) {
        const { error: updateError } = await supabase
          .from('vendors')
          .update({ portfolio_images: urls })
          .eq('id', vendor.id);

        if (updateError) {
          console.log(`❌ Error updating ${vendor.business_name}:`, updateError.message);
        } else {
          console.log(`✅ Updated ${vendor.business_name} with ${urls.length} Cloudinary images`);
        }
      } else {
        console.log(`⚠️  No Cloudinary URLs found for ${vendor.business_name}`);
      }
    }

    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { data: updatedVendors, error: verifyError } = await supabase
      .from('vendors')
      .select('business_name, portfolio_images')
      .order('business_name');

    if (verifyError) {
      console.log('❌ Error verifying updates:', verifyError.message);
    } else {
      console.log('✅ Updated vendors:');
      updatedVendors.forEach(vendor => {
        const imageCount = Array.isArray(vendor.portfolio_images) ? vendor.portfolio_images.length : 0;
        console.log(`  ${vendor.business_name}: ${imageCount} images`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
updateExistingVendors().catch(console.error);
