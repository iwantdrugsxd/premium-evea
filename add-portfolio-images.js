#!/usr/bin/env node

// Script to add portfolio images to existing vendors
// Run with: node add-portfolio-images.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Portfolio images for each vendor
const portfolioImages = {
  'Rajpurohit Decorator and caterers': [
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_2.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_3.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_4.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_5.webp'
  ],
  'La Fiesta Decors': [
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
  'R R decorators': [
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_1.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_2.webp',
    'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_3.webp'
  ]
};

async function addPortfolioImages() {
  try {
    console.log('🖼️ Adding portfolio images to vendors...\n');

    // Get all vendors
    const { data: vendors, error: fetchError } = await supabase
      .from('vendors')
      .select('id, name')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.log('❌ Error fetching vendors:', fetchError.message);
      return;
    }

    console.log(`Found ${vendors.length} vendors`);

    // Update each vendor with portfolio images
    for (const vendor of vendors) {
      const images = portfolioImages[vendor.name];
      if (images) {
        console.log(`📝 Adding ${images.length} portfolio images to ${vendor.name}...`);
        
        const { error: updateError } = await supabase
          .from('vendors')
          .update({ portfolio_images: images })
          .eq('id', vendor.id);

        if (updateError) {
          console.log(`❌ Error updating ${vendor.name}:`, updateError.message);
        } else {
          console.log(`✅ Successfully added portfolio images to ${vendor.name}`);
        }
      } else {
        console.log(`⚠️ No portfolio images found for ${vendor.name}`);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Verify the updates
    console.log('\n🔍 Verifying portfolio images...');
    const { data: updatedVendors, error: verifyError } = await supabase
      .from('vendors')
      .select('id, name, portfolio_images')
      .order('created_at', { ascending: true });

    if (verifyError) {
      console.log('❌ Error verifying vendors:', verifyError.message);
    } else {
      console.log('✅ Portfolio images verification:');
      updatedVendors.forEach(vendor => {
        const imageCount = vendor.portfolio_images ? vendor.portfolio_images.length : 0;
        console.log(`  - ${vendor.name}: ${imageCount} portfolio images`);
      });
    }

    console.log('\n🎉 Portfolio images addition complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
addPortfolioImages().catch(console.error);
