#!/usr/bin/env node

// Script to update vendor records with Cloudinary URLs using correct column name
// Run with: node update-vendors-with-cloudinary-urls.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Cloudinary URLs from the previous upload
const cloudinaryUrls = {
  "ab450fa5-39ad-40eb-b694-83ba683183c4": { // Rajpurohit Decorator and caterers
    businessName: "Rajpurohit Decorator and caterers",
    urls: [
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_2.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_3.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_4.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_5.webp"
    ]
  },
  "df495df1-412e-4c91-860f-9d904f76d512": { // La Fiesta Decors
    businessName: "La Fiesta Decors",
    urls: [
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_1.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_2.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_3.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_4.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_5.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_6.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_7.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_8.webp",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/evea/vendors/la_fiesta_decors/portfolio_9.webp"
    ]
  }
};

async function updateVendorPortfolios() {
  console.log('📸 Updating vendor records with Cloudinary URLs...\n');

  // First, let's check the actual column name in the vendors table
  console.log('🔍 Checking vendors table structure...');
  
  try {
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
        console.log(`  - ${column}`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Try different possible column names
  const possibleColumns = ['portfolio_images', 'images', 'gallery', 'photos'];
  
  for (const columnName of possibleColumns) {
    console.log(`\n🧪 Trying column: ${columnName}`);
    
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ [columnName]: ['test'] })
        .eq('id', 'ab450fa5-39ad-40eb-b694-83ba683183c4');

      if (!error) {
        console.log(`✅ Found working column: ${columnName}`);
        
        // Now update with actual URLs
        for (const [vendorId, data] of Object.entries(cloudinaryUrls)) {
          const { businessName, urls } = data;
          console.log(`📁 Updating ${businessName} with ${urls.length} images...`);

          const { error: updateError } = await supabase
            .from('vendors')
            .update({ [columnName]: urls })
            .eq('id', vendorId);

          if (updateError) {
            console.log(`❌ Error updating ${businessName}:`, updateError.message);
          } else {
            console.log(`✅ Updated ${businessName} successfully!`);
          }
        }
        break;
      } else {
        console.log(`❌ Column ${columnName} not found:`, error.message);
      }
    } catch (error) {
      console.log(`❌ Error testing column ${columnName}:`, error.message);
    }
  }
}

// Run the script
updateVendorPortfolios().catch(console.error);
