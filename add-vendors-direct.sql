-- SQL to add vendors with portfolio images directly
-- Run this in your Supabase SQL Editor

-- First, let's check the current table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vendors' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Insert vendors with portfolio images
-- Note: Adjust column names based on your actual schema

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
  is_verified,
  is_active,
  instagram_handle,
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
  '[
    "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center"
  ]'::jsonb,
  '["Wedding Planning", "Decoration", "Catering", "Photography"]'::jsonb,
  true,
  true,
  'rajpurohit_decorator',
  NOW()
),

-- Vendor 2: La Fiesta Decors
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
  '[
    "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1519167758481-83f1426e6a0e?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center"
  ]'::jsonb,
  '["Decoration", "Floral Design", "Event Styling"]'::jsonb,
  true,
  true,
  'la.fiesta.decors',
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
  jsonb_array_length(portfolio_images) as portfolio_count,
  created_at
FROM vendors 
WHERE business_name IN (
  'Rajpurohit Decorator and caterers',
  'La Fiesta Decors'
)
ORDER BY created_at DESC;
