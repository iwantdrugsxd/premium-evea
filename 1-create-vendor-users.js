#!/usr/bin/env node

// Script to create vendor users in Supabase
// Run with: node 1-create-vendor-users.js

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Vendor data from Google Form
const vendorData = [
  {
    fullName: "Baldev Singh Rajpurohit",
    email: "rajpurohitdecorator@gmail.com",
    phone: "9833055077",
    businessName: "Rajpurohit Decorator and caterers"
  },
  {
    fullName: "Parag Thakkar",
    email: "parag.thakkar@example.com", // Using example email since original was "Nan"
    phone: "9821009967",
    businessName: "R R decorators"
  },
  {
    fullName: "Hardik Neelam Thakkar",
    email: "Hardikthakkar1909@gmail.com",
    phone: "8898811995",
    businessName: "La Fiesta Decors"
  }
];

async function createVendorUsers() {
  console.log('👥 Creating vendor users in Supabase...\n');

  const results = [];

  for (let i = 0; i < vendorData.length; i++) {
    const vendor = vendorData[i];
    console.log(`Creating user ${i + 1}/${vendorData.length}: ${vendor.fullName}`);

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: vendor.email,
        password: `Vendor${vendor.phone}@2025`, // Temporary password
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: vendor.fullName,
          phone: vendor.phone,
          business_name: vendor.businessName,
          user_type: 'vendor'
        }
      });

      if (authError) {
        console.log(`❌ Auth error for ${vendor.fullName}:`, authError.message);
        results.push({
          vendor: vendor.fullName,
          success: false,
          error: authError.message,
          userId: null
        });
        continue;
      }

      // Create user profile in users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: vendor.email,
          full_name: vendor.fullName,
          phone: vendor.phone
        })
        .select()
        .single();

      if (profileError) {
        console.log(`❌ Profile error for ${vendor.fullName}:`, profileError.message);
        results.push({
          vendor: vendor.fullName,
          success: false,
          error: profileError.message,
          userId: authData.user.id
        });
        continue;
      }

      console.log(`✅ User created successfully: ${vendor.fullName} (ID: ${authData.user.id})`);
      results.push({
        vendor: vendor.fullName,
        success: true,
        userId: authData.user.id,
        email: vendor.email
      });

    } catch (error) {
      console.log(`❌ Error creating user ${vendor.fullName}:`, error.message);
      results.push({
        vendor: vendor.fullName,
        success: false,
        error: error.message,
        userId: null
      });
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log('\n✅ Successfully created users:');
    successful.forEach(r => {
      console.log(`  - ${r.vendor} (${r.email}) - ID: ${r.userId}`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed to create:');
    failed.forEach(r => {
      console.log(`  - ${r.vendor}: ${r.error}`);
    });
  }

  // Save results for next script
  const fs = require('fs');
  fs.writeFileSync('vendor-users-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Results saved to vendor-users-results.json');

  return results;
}

// Run the script
createVendorUsers().catch(console.error);
