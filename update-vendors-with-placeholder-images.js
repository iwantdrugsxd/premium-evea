#!/usr/bin/env node

// Script to update vendor records with placeholder portfolio images
// Run with: node update-vendors-with-placeholder-images.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Placeholder portfolio images for each vendor
const portfolioData = {
  "40276eb6-f8d8-426f-affc-41a89636e125": { // R R decorators
    businessName: "R R decorators",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center"
    ]
  },
  "ab450fa5-39ad-40eb-b694-83ba683183c4": { // Rajpurohit Decorator and caterers
    businessName: "Rajpurohit Decorator and caterers",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center"
    ]
  },
  "df495df1-412e-4c91-860f-9d904f76d512": { // La Fiesta Decors
    businessName: "La Fiesta Decors",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center"
    ]
  }
};

async function updateVendorPortfolios() {
  console.log('📸 Updating vendor records with portfolio images...\n');

  const results = [];

  for (const [vendorId, data] of Object.entries(portfolioData)) {
    const { businessName, images } = data;
    console.log(`📁 Processing ${businessName} (${images.length} images)...`);

    try {
      const { error: updateError } = await supabase
        .from('vendors')
        .update({ portfolio_images: images })
        .eq('id', vendorId);

      if (updateError) {
        console.log(`❌ Error updating ${businessName}:`, updateError.message);
        results.push({
          vendorId,
          businessName,
          success: false,
          error: updateError.message
        });
      } else {
        console.log(`✅ Updated ${businessName} with ${images.length} portfolio images`);
        results.push({
          vendorId,
          businessName,
          success: true,
          imageCount: images.length
        });
      }
    } catch (error) {
      console.log(`❌ Error updating ${businessName}:`, error.message);
      results.push({
        vendorId,
        businessName,
        success: false,
        error: error.message
      });
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n📊 Update Summary:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log('\n✅ Successfully updated vendors:');
    successful.forEach(r => {
      console.log(`  - ${r.businessName}: ${r.imageCount} images`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed to update:');
    failed.forEach(r => {
      console.log(`  - ${r.businessName}: ${r.error}`);
    });
  }

  return results;
}

// Run the script
updateVendorPortfolios().catch(console.error);
