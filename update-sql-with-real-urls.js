#!/usr/bin/env node

// Script to get real Cloudinary URLs and update SQL file
// Run with: node update-sql-with-real-urls.js

require('dotenv').config({ path: '.env.local' });

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function updateSQLWithRealUrls() {
  try {
    console.log('🔍 Getting real Cloudinary URLs...\n');

    // Get all resources from Cloudinary
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

    // Create the SQL content with real URLs
    const sqlContent = `-- SQL script to create vendors table with actual Cloudinary URLs
-- Run this in your Supabase SQL Editor

-- First, let's check what exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vendors' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Drop existing vendors table if it exists (be careful!)
-- DROP TABLE IF EXISTS public.vendors CASCADE;

-- Create the vendors table with the correct schema
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  business_name character varying NOT NULL,
  business_type character varying,
  contact_person_name character varying NOT NULL,
  phone character varying NOT NULL,
  email character varying NOT NULL,
  whatsapp_number character varying,
  city character varying NOT NULL,
  state character varying NOT NULL,
  address text,
  description text,
  portfolio_images jsonb DEFAULT '[]'::jsonb,
  services_offered jsonb DEFAULT '[]'::jsonb,
  price_range_min numeric,
  price_range_max numeric,
  average_rating numeric DEFAULT 0,
  total_events_completed integer DEFAULT 0,
  is_verified boolean DEFAULT true,
  is_active boolean DEFAULT true,
  instagram_handle character varying,
  website_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vendors_pkey PRIMARY KEY (id),
  CONSTRAINT vendors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Insert the vendor data with REAL Cloudinary URLs
INSERT INTO public.vendors (
  business_name,
  business_type,
  contact_person_name,
  phone,
  email,
  whatsapp_number,
  city,
  state,
  address,
  description,
  portfolio_images,
  services_offered,
  price_range_min,
  price_range_max,
  average_rating,
  total_events_completed,
  is_verified,
  is_active,
  instagram_handle,
  created_at
) VALUES `;

    // Add vendor data with real URLs
    const vendorData = [
      {
        business_name: 'Rajpurohit Decorator and caterers',
        business_type: 'Wedding Planning',
        contact_person_name: 'Baldev Singh Rajpurohit',
        phone: '9833055077',
        email: 'rajpurohitdecorator@gmail.com',
        whatsapp_number: '9833055077',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar',
        description: 'Wedding decorator and caterer with 40 years of experience',
        services: '["Wedding Planning", "Decoration", "Catering", "Photography"]',
        price_min: 50000,
        price_max: 200000,
        rating: 4.5,
        events: 150,
        instagram: 'rajpurohit_decorator',
        folder: 'rajpurohit_decorator_and_caterers'
      },
      {
        business_name: 'La Fiesta Decors',
        business_type: 'Decoration & Florist',
        contact_person_name: 'Hardik Neelam Thakkar',
        phone: '8898811995',
        email: 'Hardikthakkar1909@gmail.com',
        whatsapp_number: '8898811995',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west',
        description: 'We accept all types of decoration orders small events to big events',
        services: '["Decoration", "Floral Design", "Event Styling"]',
        price_min: 30000,
        price_max: 150000,
        rating: 4.8,
        events: 200,
        instagram: 'la.fiesta.decors',
        folder: 'la_fiesta_decors'
      },
      {
        business_name: 'R R decorators',
        business_type: 'Decoration & Furniture',
        contact_person_name: 'Parag Thakkar',
        phone: '9821009967',
        email: 'rrdecorators@example.com',
        whatsapp_number: '9821009967',
        city: 'Mumbai',
        state: 'Maharashtra',
        address: 'R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080',
        description: 'Table, chair fan, mandap, stage, lighting contractor',
        services: '["Furniture Rental", "Lighting", "Stage Setup", "Mandap Decoration"]',
        price_min: 25000,
        price_max: 100000,
        rating: 4.3,
        events: 75,
        instagram: 'rr_decorators',
        folder: 'rr_decorators'
      }
    ];

    let insertValues = '';
    vendorData.forEach((vendor, index) => {
      const urls = vendorImages[vendor.folder] || [];
      const urlsJson = JSON.stringify(urls);
      
      insertValues += `(
  '${vendor.business_name}',
  '${vendor.business_type}',
  '${vendor.contact_person_name}',
  '${vendor.phone}',
  '${vendor.email}',
  '${vendor.whatsapp_number}',
  '${vendor.city}',
  '${vendor.state}',
  '${vendor.address}',
  '${vendor.description}',
  '${urlsJson}'::jsonb,
  '${vendor.services}'::jsonb,
  ${vendor.price_min},
  ${vendor.price_max},
  ${vendor.rating},
  ${vendor.events},
  true,
  true,
  '${vendor.instagram}',
  NOW()
)${index < vendorData.length - 1 ? ',' : ';'}`;
    });

    const finalSQL = sqlContent + insertValues + `

-- Verify the data was inserted
SELECT 
  id,
  business_name,
  business_type,
  contact_person_name,
  phone,
  email,
  city,
  state,
  is_verified,
  is_active,
  jsonb_array_length(portfolio_images) as portfolio_count,
  average_rating,
  total_events_completed,
  created_at
FROM vendors 
ORDER BY created_at DESC;`;

    // Write to file
    fs.writeFileSync('create-vendors-with-real-cloudinary.sql', finalSQL);
    console.log('\n✅ Updated SQL file created: create-vendors-with-real-cloudinary.sql');
    console.log('📝 This file contains the real Cloudinary URLs from your uploads');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
updateSQLWithRealUrls().catch(console.error);
