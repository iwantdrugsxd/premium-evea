#!/usr/bin/env node

// Script to get Cloudinary URLs and update vendor records
// Run with: node get-cloudinary-urls-and-update.js

require('dotenv').config({ path: '.env.local' });

const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCloudinaryUrlsAndUpdate() {
  console.log('🔍 Getting Cloudinary URLs and updating vendor records...\n');

  try {
    // Get all resources from Cloudinary for our vendors
    const { resources } = await cloudinary.search
      .expression('folder:evea/vendors/*')
      .sort_by([['created_at', 'desc']])
      .max_results(50)
      .execute();

    console.log(`📸 Found ${resources.length} images in Cloudinary`);

    // Group images by vendor folder
    const vendorImages = {};
    resources.forEach(resource => {
      const folderParts = resource.folder.split('/');
      const vendorFolder = folderParts[folderParts.length - 1];
      
      if (!vendorImages[vendorFolder]) {
        vendorImages[vendorFolder] = [];
      }
      vendorImages[vendorFolder].push(resource.secure_url);
    });

    console.log('\n📁 Images by vendor:');
    Object.entries(vendorImages).forEach(([vendor, urls]) => {
      console.log(`  ${vendor}: ${urls.length} images`);
    });

    // Map vendor folders to vendor IDs
    const vendorMapping = {
      'rajpurohit_decorator_and_caterers': 'ab450fa5-39ad-40eb-b694-83ba683183c4',
      'la_fiesta_decors': 'df495df1-412e-4c91-860f-9d904f76d512'
    };

    // Update vendor records
    for (const [vendorFolder, urls] of Object.entries(vendorImages)) {
      const vendorId = vendorMapping[vendorFolder];
      if (!vendorId) {
        console.log(`⚠️  No mapping found for vendor folder: ${vendorFolder}`);
        continue;
      }

      console.log(`\n📝 Updating vendor ${vendorFolder} with ${urls.length} images...`);

      // Try to update the vendor record
      // First, let's check what columns exist
      const { data: vendor, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (fetchError) {
        console.log(`❌ Error fetching vendor ${vendorFolder}:`, fetchError.message);
        continue;
      }

      console.log('📋 Available columns:', Object.keys(vendor));

      // Try to update with different possible column names
      const updatePromises = [
        supabase.from('vendors').update({ portfolio_images: urls }).eq('id', vendorId),
        supabase.from('vendors').update({ images: urls }).eq('id', vendorId),
        supabase.from('vendors').update({ gallery: urls }).eq('id', vendorId),
        supabase.from('vendors').update({ photos: urls }).eq('id', vendorId)
      ];

      let updated = false;
      for (let i = 0; i < updatePromises.length; i++) {
        const { error } = await updatePromises[i];
        if (!error) {
          console.log(`✅ Successfully updated vendor ${vendorFolder} with column ${['portfolio_images', 'images', 'gallery', 'photos'][i]}`);
          updated = true;
          break;
        }
      }

      if (!updated) {
        console.log(`❌ Could not update vendor ${vendorFolder} with any column name`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
getCloudinaryUrlsAndUpdate().catch(console.error);
