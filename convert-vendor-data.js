#!/usr/bin/env node

// Script to convert Google Form vendor data to SQL INSERT statements
// Run with: node convert-vendor-data.js

const vendorData = [
  {
    timestamp: "9/1/2025 16:33:02",
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
    timestamp: "9/1/2025 17:55:51",
    fullName: "Parag Thakkar",
    email: "Nan",
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
    timestamp: "9/2/2025 16:55:21",
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

// Function to clean and format data
function cleanData(data) {
  return {
    business_name: data.businessName.replace(/'/g, "''"), // Escape single quotes
    business_type: mapServiceCategory(data.primaryServiceCategory),
    contact_person_name: data.fullName.replace(/'/g, "''"),
    phone: data.phone,
    email: data.email === "Nan" ? null : data.email,
    whatsapp_number: data.phone, // Assuming same as phone
    city: extractCity(data.businessAddress),
    state: extractState(data.businessAddress),
    address: data.businessAddress.replace(/'/g, "''"),
    description: data.businessDescription.replace(/'/g, "''"),
    portfolio_images: formatPortfolioImages(data.portfolioImages),
    services_offered: formatServicesOffered(data.primaryServiceCategory),
    price_range_min: null, // Not provided in form
    price_range_max: null, // Not provided in form
    average_rating: 0,
    total_events_completed: 0,
    is_verified: true,
    is_active: true,
    instagram_handle: data.socialMedia || null,
    website_url: null,
    created_at: new Date().toISOString()
  };
}

// Map service categories to your database categories
function mapServiceCategory(category) {
  const categoryMap = {
    "All services": "Wedding Planning",
    "Table, chair fan, mandap, stage, lighting contractor.": "Decoration & Florist",
    "Decoration and Florist": "Decoration & Florist",
    "Wedding decorator and caterer": "Decoration & Florist"
  };
  
  return categoryMap[category] || "Event Services";
}

// Extract city from address
function extractCity(address) {
  const addressLower = address.toLowerCase();
  
  if (addressLower.includes('mumbai')) return 'Mumbai';
  if (addressLower.includes('delhi')) return 'Delhi';
  if (addressLower.includes('bangalore')) return 'Bangalore';
  if (addressLower.includes('chennai')) return 'Chennai';
  if (addressLower.includes('kolkata')) return 'Kolkata';
  if (addressLower.includes('pune')) return 'Pune';
  if (addressLower.includes('hyderabad')) return 'Hyderabad';
  
  // Default to Mumbai for these entries
  return 'Mumbai';
}

// Extract state from address
function extractState(address) {
  const addressLower = address.toLowerCase();
  
  if (addressLower.includes('mumbai') || addressLower.includes('mulund')) return 'Maharashtra';
  if (addressLower.includes('delhi')) return 'Delhi';
  if (addressLower.includes('bangalore')) return 'Karnataka';
  if (addressLower.includes('chennai')) return 'Tamil Nadu';
  if (addressLower.includes('kolkata')) return 'West Bengal';
  if (addressLower.includes('pune')) return 'Maharashtra';
  if (addressLower.includes('hyderabad')) return 'Telangana';
  
  // Default to Maharashtra for these entries
  return 'Maharashtra';
}

// Format portfolio images as JSON array
function formatPortfolioImages(imagesString) {
  if (!imagesString) return '[]';
  
  const imageUrls = imagesString.split(', ').map(url => url.trim());
  return JSON.stringify(imageUrls);
}

// Format services offered as JSON array
function formatServicesOffered(category) {
  const servicesMap = {
    "All services": ["Wedding Planning", "Decoration", "Catering", "Photography"],
    "Table, chair fan, mandap, stage, lighting contractor.": ["Decoration", "Lighting", "Stage Setup", "Furniture Rental"],
    "Decoration and Florist": ["Decoration", "Floral Design", "Event Styling"],
    "Wedding decorator and caterer": ["Wedding Decoration", "Catering", "Event Planning"]
  };
  
  return JSON.stringify(servicesMap[category] || ["Event Services"]);
}

// Generate SQL INSERT statements
function generateSQL() {
  console.log('-- Vendor Data Import SQL');
  console.log('-- Generated from Google Form submissions');
  console.log('-- Run this in your Supabase SQL Editor\n');
  
  vendorData.forEach((vendor, index) => {
    const cleanedData = cleanData(vendor);
    
    console.log(`-- Vendor ${index + 1}: ${cleanedData.business_name}`);
    console.log(`INSERT INTO vendors (`);
    console.log(`  business_name,`);
    console.log(`  business_type,`);
    console.log(`  contact_person_name,`);
    console.log(`  phone,`);
    console.log(`  email,`);
    console.log(`  whatsapp_number,`);
    console.log(`  city,`);
    console.log(`  state,`);
    console.log(`  address,`);
    console.log(`  description,`);
    console.log(`  portfolio_images,`);
    console.log(`  services_offered,`);
    console.log(`  price_range_min,`);
    console.log(`  price_range_max,`);
    console.log(`  average_rating,`);
    console.log(`  total_events_completed,`);
    console.log(`  is_verified,`);
    console.log(`  is_active,`);
    console.log(`  instagram_handle,`);
    console.log(`  website_url,`);
    console.log(`  created_at`);
    console.log(`) VALUES (`);
    console.log(`  '${cleanedData.business_name}',`);
    console.log(`  '${cleanedData.business_type}',`);
    console.log(`  '${cleanedData.contact_person_name}',`);
    console.log(`  '${cleanedData.phone}',`);
    console.log(`  ${cleanedData.email ? `'${cleanedData.email}'` : 'NULL'},`);
    console.log(`  '${cleanedData.whatsapp_number}',`);
    console.log(`  '${cleanedData.city}',`);
    console.log(`  '${cleanedData.state}',`);
    console.log(`  '${cleanedData.address}',`);
    console.log(`  '${cleanedData.description}',`);
    console.log(`  '${cleanedData.portfolio_images}',`);
    console.log(`  '${cleanedData.services_offered}',`);
    console.log(`  ${cleanedData.price_range_min || 'NULL'},`);
    console.log(`  ${cleanedData.price_range_max || 'NULL'},`);
    console.log(`  ${cleanedData.average_rating},`);
    console.log(`  ${cleanedData.total_events_completed},`);
    console.log(`  ${cleanedData.is_verified},`);
    console.log(`  ${cleanedData.is_active},`);
    console.log(`  ${cleanedData.instagram_handle ? `'${cleanedData.instagram_handle}'` : 'NULL'},`);
    console.log(`  ${cleanedData.website_url || 'NULL'},`);
    console.log(`  '${cleanedData.created_at}'`);
    console.log(`);\n`);
  });
}

// Generate CSV format for easy import
function generateCSV() {
  console.log('\n-- CSV Format (for Supabase import):');
  console.log('business_name,business_type,contact_person_name,phone,email,whatsapp_number,city,state,address,description,portfolio_images,services_offered,price_range_min,price_range_max,average_rating,total_events_completed,is_verified,is_active,instagram_handle,website_url,created_at');
  
  vendorData.forEach((vendor) => {
    const cleanedData = cleanData(vendor);
    console.log(`"${cleanedData.business_name}","${cleanedData.business_type}","${cleanedData.contact_person_name}","${cleanedData.phone}","${cleanedData.email || ''}","${cleanedData.whatsapp_number}","${cleanedData.city}","${cleanedData.state}","${cleanedData.address}","${cleanedData.description}","${cleanedData.portfolio_images}","${cleanedData.services_offered}","${cleanedData.price_range_min || ''}","${cleanedData.price_range_max || ''}","${cleanedData.average_rating}","${cleanedData.total_events_completed}","${cleanedData.is_verified}","${cleanedData.is_active}","${cleanedData.instagram_handle || ''}","${cleanedData.website_url || ''}","${cleanedData.created_at}"`);
  });
}

// Run the script
console.log('🚀 Converting Google Form vendor data to SQL...\n');
generateSQL();
generateCSV();

console.log('\n✅ Conversion complete!');
console.log('\n📋 Next steps:');
console.log('1. Copy the SQL statements above');
console.log('2. Go to your Supabase SQL Editor');
console.log('3. Paste and run the SQL statements');
console.log('4. Or use the CSV format for bulk import');
console.log('\n⚠️  Note: Portfolio images are Google Drive links - you may want to download and upload them to your own storage');
