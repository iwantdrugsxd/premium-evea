-- Simple SQL to add three vendors without user IDs
-- Run this in your Supabase SQL Editor

INSERT INTO vendors (
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
  website_url,
  created_at
) VALUES 
-- Vendor 1: Rajpurohit Decorator and caterers
(
  'Rajpurohit Decorator and caterers',
  'Wedding Planning',
  'Baldev Singh Rajpurohit',
  '9833055077',
  'rajpurohitdecorator@gmail.com',
  '9833055077',
  'Mumbai',
  'Maharashtra',
  'Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar',
  'Wedding decorator and caterer',
  '[]', -- Will be updated with Cloudinary URLs later
  '["Wedding Planning", "Decoration", "Catering", "Photography"]',
  NULL,
  NULL,
  0,
  0,
  true,
  true,
  'Rajpurohit decorator',
  NULL,
  NOW()
),

-- Vendor 2: R R decorators
(
  'R R decorators',
  'Decoration & Florist',
  'Parag Thakkar',
  '9821009967',
  'parag.thakkar@example.com',
  '9821009967',
  'Mumbai',
  'Maharashtra',
  'R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080',
  'Table, chair fan, mandap, stage, lighting contractor.',
  '[]', -- Will be updated with Cloudinary URLs later
  '["Decoration", "Lighting", "Stage Setup", "Furniture Rental"]',
  NULL,
  NULL,
  0,
  0,
  true,
  true,
  NULL,
  NULL,
  NOW()
),

-- Vendor 3: La Fiesta Decors
(
  'La Fiesta Decors',
  'Decoration & Florist',
  'Hardik Neelam Thakkar',
  '8898811995',
  'Hardikthakkar1909@gmail.com',
  '8898811995',
  'Mumbai',
  'Maharashtra',
  'Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west',
  'We accept all types of decoration orders small events to big events',
  '[]', -- Will be updated with Cloudinary URLs later
  '["Decoration", "Floral Design", "Event Styling"]',
  NULL,
  NULL,
  0,
  0,
  true,
  true,
  'la.fiesta.decors',
  NULL,
  NOW()
);

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
  created_at
FROM vendors 
WHERE business_name IN (
  'Rajpurohit Decorator and caterers',
  'R R decorators', 
  'La Fiesta Decors'
)
ORDER BY created_at DESC;
