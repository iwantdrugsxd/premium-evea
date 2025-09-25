#!/usr/bin/env node

// Script to create vendor data in vendors table
// Run with: node 2-create-vendor-data.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Load user results from previous script
let userResults = [];
try {
  userResults = JSON.parse(fs.readFileSync('vendor-users-results.json', 'utf8'));
} catch (error) {
  console.log('❌ Could not load vendor-users-results.json. Please run 1-create-vendor-users.js first.');
  process.exit(1);
}

// Vendor data from Google Form
const vendorData = [
  {
    fullName: "Baldev Singh Rajpurohit",
    email: "rajpurohitdecorator@gmail.com",
    phone: "9833055077",
    socialMedia: "Rajpurohit decorator",
    businessName: "Rajpurohit Decorator and caterers",
    businessDescription: "Wedding decorator and caterer",
    primaryServiceCategory: "All services",
    businessAddress: "Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar",
    yearsOfExperience: "40",
    serviceAreas: "All over mumbai and navi mumbai",
    portfolioImages: "https://drive.google.com/open?id=1C9DIMk6pzICxyduOGyQUO1YOL1m5WAZb, https://drive.google.com/open?id=1j3yA-YTxz6zMx58Cji5faAQk6FfoJppP, https://drive.google.com/open?id=1qW6j995NwYP2RY8BD8Ei87-cfLbio_yA, https://drive.google.com/open?id=1CU6qarQBTrIjTsZfEID0OxVYxG9Rclol, https://drive.google.com/open?id=11vQUsMlKJVf-XxmItmLXIP6a56x1tXbl"
  },
  {
    fullName: "Parag Thakkar",
    email: "parag.thakkar@example.com",
    phone: "9821009967",
    socialMedia: "",
    businessName: "R R decorators",
    businessDescription: "Table, chair fan, mandap, stage, lighting contractor.",
    primaryServiceCategory: "Table, chair fan, mandap, stage, lighting contractor.",
    businessAddress: "R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080",
    yearsOfExperience: "10",
    serviceAreas: "All over mumbai",
    portfolioImages: "https://drive.google.com/open?id=1HWhhsttAIieQMICVGNCGQ-BzJxvX9ObN"
  },
  {
    fullName: "Hardik Neelam Thakkar",
    email: "Hardikthakkar1909@gmail.com",
    phone: "8898811995",
    socialMedia: "la.fiesta.decors",
    businessName: "La Fiesta Decors",
    businessDescription: "We accept all types of decoration orders small events to big events",
    primaryServiceCategory: "Decoration and Florist",
    businessAddress: "Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west",
    yearsOfExperience: "6",
    serviceAreas: "All over Mumbai, n even destination",
    portfolioImages: "https://drive.google.com/open?id=1LEw5SGGGp9H8_rZb8-jXzXT1U1lPkRpR, https://drive.google.com/open?id=1O-O9kTb_endWRO11s-yohcchtA9RiAVi, https://drive.google.com/open?id=1jFfTbFJKXXad63gSk7BfJF2WjvSlZW3N, https://drive.google.com/open?id=1binvmvOMsNON-rMRU7HzaHCc-UTOdMrF, https://drive.google.com/open?id=1nIlJjUSFXTpHs-8TVIuciafq5U-FJoM4, https://drive.google.com/open?id=12ztdOQkvfpHSznWowVEIEjqZfMj5zwOO, https://drive.google.com/open?id=1olHxxTy6FODObZxSQ7Qg3Y8JUkMpD_Ru, https://drive.google.com/open?id=1w4d_url5Y36eZgbhezEs2Nl7B9V5jqb, https://drive.google.com/open?id=1cInIp72hk8sR_5rThOWWFURtvI58X1c8, https://drive.google.com/open?id=1-LhVgbvUST9iqfVdDs29s1CdDYRbp7Q1"
  }
];

// Helper functions
function mapServiceCategory(category) {
  const categoryMap = {
    "All services": "Wedding Planning",
    "Table, chair fan, mandap, stage, lighting contractor.": "Decoration & Florist",
    "Decoration and Florist": "Decoration & Florist",
    "Wedding decorator and caterer": "Decoration & Florist"
  };
  return categoryMap[category] || "Event Services";
}

function extractCity(address) {
  const addressLower = address.toLowerCase();
  if (addressLower.includes('mumbai')) return 'Mumbai';
  if (addressLower.includes('delhi')) return 'Delhi';
  if (addressLower.includes('bangalore')) return 'Bangalore';
  if (addressLower.includes('chennai')) return 'Chennai';
  if (addressLower.includes('kolkata')) return 'Kolkata';
  if (addressLower.includes('pune')) return 'Pune';
  if (addressLower.includes('hyderabad')) return 'Hyderabad';
  return 'Mumbai';
}

function extractState(address) {
  const addressLower = address.toLowerCase();
  if (addressLower.includes('mumbai') || addressLower.includes('mulund')) return 'Maharashtra';
  if (addressLower.includes('delhi')) return 'Delhi';
  if (addressLower.includes('bangalore')) return 'Karnataka';
  if (addressLower.includes('chennai')) return 'Tamil Nadu';
  if (addressLower.includes('kolkata')) return 'West Bengal';
  if (addressLower.includes('pune')) return 'Maharashtra';
  if (addressLower.includes('hyderabad')) return 'Telangana';
  return 'Maharashtra';
}

function formatServicesOffered(category) {
  const servicesMap = {
    "All services": ["Wedding Planning", "Decoration", "Catering", "Photography"],
    "Table, chair fan, mandap, stage, lighting contractor.": ["Decoration", "Lighting", "Stage Setup", "Furniture Rental"],
    "Decoration and Florist": ["Decoration", "Floral Design", "Event Styling"],
    "Wedding decorator and caterer": ["Wedding Decoration", "Catering", "Event Planning"]
  };
  return servicesMap[category] || ["Event Services"];
}

async function createVendorData() {
  console.log('🏢 Creating vendor data in vendors table...\n');

  const results = [];

  for (let i = 0; i < vendorData.length; i++) {
    const vendor = vendorData[i];
    console.log(`Processing vendor ${i + 1}/${vendorData.length}: ${vendor.businessName}`);

    // Find corresponding user ID
    const userResult = userResults.find(u => u.email === vendor.email);
    if (!userResult || !userResult.success) {
      console.log(`❌ No user found for ${vendor.businessName}. Skipping.`);
      results.push({
        vendor: vendor.businessName,
        success: false,
        error: 'No corresponding user found'
      });
      continue;
    }

    try {
      // Prepare vendor data
      const vendorRecord = {
        user_id: userResult.userId,
        business_name: vendor.businessName,
        business_type: mapServiceCategory(vendor.primaryServiceCategory),
        contact_person_name: vendor.fullName,
        phone: vendor.phone,
        email: vendor.email === "Nan" ? null : vendor.email,
        whatsapp_number: vendor.phone,
        city: extractCity(vendor.businessAddress),
        state: extractState(vendor.businessAddress),
        address: vendor.businessAddress,
        description: vendor.businessDescription,
        portfolio_images: [], // Will be updated after Cloudinary upload
        services_offered: formatServicesOffered(vendor.primaryServiceCategory),
        price_range_min: null,
        price_range_max: null,
        average_rating: 0,
        total_events_completed: 0,
        is_verified: true,
        is_active: true,
        instagram_handle: vendor.socialMedia || null,
        website_url: null
      };

      // Insert vendor data
      const { data, error } = await supabase
        .from('vendors')
        .insert(vendorRecord)
        .select()
        .single();

      if (error) {
        console.log(`❌ Error creating vendor ${vendor.businessName}:`, error.message);
        results.push({
          vendor: vendor.businessName,
          success: false,
          error: error.message
        });
        continue;
      }

      console.log(`✅ Vendor created successfully: ${vendor.businessName} (ID: ${data.id})`);
      results.push({
        vendor: vendor.businessName,
        success: true,
        vendorId: data.id,
        userId: userResult.userId
      });

    } catch (error) {
      console.log(`❌ Error creating vendor ${vendor.businessName}:`, error.message);
      results.push({
        vendor: vendor.businessName,
        success: false,
        error: error.message
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
    console.log('\n✅ Successfully created vendors:');
    successful.forEach(r => {
      console.log(`  - ${r.vendor} (Vendor ID: ${r.vendorId}, User ID: ${r.userId})`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed to create:');
    failed.forEach(r => {
      console.log(`  - ${r.vendor}: ${r.error}`);
    });
  }

  // Save results for next script
  fs.writeFileSync('vendor-data-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Results saved to vendor-data-results.json');

  return results;
}

// Run the script
createVendorData().catch(console.error);
