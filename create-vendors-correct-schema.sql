-- SQL script to insert vendors with correct schema
-- Run this in your Supabase SQL Editor

-- Insert the vendor data with the correct schema
INSERT INTO public.vendors (
  name,
  category,
  rating,
  events_count,
  price,
  price_label,
  response_time,
  badge,
  image,
  description,
  location,
  experience,
  team_size,
  availability,
  email,
  phone,
  address,
  status,
  features,
  service_areas,
  services_offered,
  created_at
) VALUES 
-- Vendor 1: Rajpurohit Decorator and caterers
(
  'Rajpurohit Decorator and caterers',
  'Wedding Planning',
  4.5,
  150,
  '₹50,000 - ₹2,00,000',
  'Price Range',
  'Within 24 hours',
  'Verified',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp',
  'Wedding decorator and caterer with 40 years of experience',
  'Mumbai, Maharashtra',
  '40+ years',
  '10-15 members',
  'Available',
  'rajpurohitdecorator@gmail.com',
  '9833055077',
  'Rajpurohit 302 New Murli Malhar chs SN road tambe Nagar',
  'active',
  ARRAY['Wedding Planning', 'Decoration', 'Catering', 'Photography'],
  ARRAY['Mumbai', 'Navi Mumbai', 'Thane'],
  ARRAY['Wedding Planning', 'Decoration', 'Catering', 'Photography'],
  NOW()
),

-- Vendor 2: La Fiesta Decors
(
  'La Fiesta Decors',
  'Decoration & Florist',
  4.8,
  200,
  '₹30,000 - ₹1,50,000',
  'Price Range',
  'Within 24 hours',
  'Verified',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_1.webp',
  'We accept all types of decoration orders small events to big events',
  'Mumbai, Maharashtra',
  '6+ years',
  '5-10 members',
  'Available',
  'Hardikthakkar1909@gmail.com',
  '8898811995',
  'Shop no 1, vimal darshan , rrt road, opp. Miss World, next to baking hub, mulund west',
  'active',
  ARRAY['Decoration', 'Floral Design', 'Event Styling'],
  ARRAY['Mumbai', 'Navi Mumbai', 'Thane'],
  ARRAY['Decoration', 'Floral Design', 'Event Styling'],
  NOW()
),

-- Vendor 3: R R decorators
(
  'R R decorators',
  'Decoration & Furniture',
  4.3,
  75,
  '₹25,000 - ₹1,00,000',
  'Price Range',
  'Within 24 hours',
  'Verified',
  'https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_1.webp',
  'Table, chair fan, mandap, stage, lighting contractor',
  'Mumbai, Maharashtra',
  '10+ years',
  '8-12 members',
  'Available',
  'rrdecorators@example.com',
  '9821009967',
  'R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080',
  'active',
  ARRAY['Furniture Rental', 'Lighting', 'Stage Setup', 'Mandap Decoration'],
  ARRAY['Mumbai', 'Navi Mumbai', 'Thane'],
  ARRAY['Furniture Rental', 'Lighting', 'Stage Setup', 'Mandap Decoration'],
  NOW()
);

-- Verify the data was inserted
SELECT 
  id,
  name,
  category,
  rating,
  events_count,
  price,
  price_label,
  location,
  status,
  array_length(features, 1) as features_count,
  array_length(services_offered, 1) as services_count,
  created_at
FROM vendors 
ORDER BY created_at DESC;
