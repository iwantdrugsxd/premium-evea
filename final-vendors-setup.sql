-- Final SQL script to create vendors table and add vendors with Cloudinary URLs
-- Run this in your Supabase SQL Editor

-- First, let's check what exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vendors' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Drop existing vendors table if it exists (be careful!)
DROP TABLE IF EXISTS public.vendors CASCADE;

-- Create the vendors table with the correct schema
CREATE TABLE public.vendors (
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

-- Insert the vendor data with Cloudinary URLs
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
  'Wedding decorator and caterer with 40 years of experience',
  '[
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_1.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_2.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_3.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_4.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rajpurohit_decorator_and_caterers/portfolio_5.webp"
  ]'::jsonb,
  '["Wedding Planning", "Decoration", "Catering", "Photography"]'::jsonb,
  50000,
  200000,
  4.5,
  150,
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
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_1.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_2.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_3.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_4.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_5.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_6.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_7.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_8.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/la_fiesta_decors/portfolio_9.webp"
  ]'::jsonb,
  '["Decoration", "Floral Design", "Event Styling"]'::jsonb,
  30000,
  150000,
  4.8,
  200,
  true,
  true,
  'la.fiesta.decors',
  NOW()
),

-- Vendor 3: R R decorators
(
  'R R decorators',
  'Decoration & Furniture',
  'Parag Thakkar',
  '9821009967',
  'rrdecorators@example.com',
  '9821009967',
  'Mumbai',
  'Maharashtra',
  'R R DECORATORS PRADHAN UKEDA BUILDING MG ROAD OPP QUALTY ICECREAM MULUND WEST 400080',
  'Table, chair fan, mandap, stage, lighting contractor',
  '[
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_1.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_2.webp",
    "https://res.cloudinary.com/dackojgpt/image/upload/v1758294000/evea/vendors/rr_decorators/portfolio_3.webp"
  ]'::jsonb,
  '["Furniture Rental", "Lighting", "Stage Setup", "Mandap Decoration"]'::jsonb,
  25000,
  100000,
  4.3,
  75,
  true,
  true,
  'rr_decorators',
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
  average_rating,
  total_events_completed,
  created_at
FROM vendors 
ORDER BY created_at DESC;
