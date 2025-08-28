-- Complete vendors table rebuild
-- Run this in your Supabase SQL editor

-- Drop existing vendors table if it exists
DROP TABLE IF EXISTS vendors CASCADE;

-- Create vendors table with all required columns
CREATE TABLE vendors (
  id bigint NOT NULL DEFAULT nextval('vendors_id_seq'::regclass),
  name character varying NOT NULL,
  category character varying NOT NULL,
  rating numeric DEFAULT 0.0,
  events_count integer DEFAULT 0,
  price character varying NOT NULL,
  price_label character varying NOT NULL,
  response_time character varying NOT NULL,
  badge character varying,
  image character varying NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL,
  location character varying NOT NULL,
  experience character varying NOT NULL,
  team_size character varying NOT NULL,
  availability character varying NOT NULL,
  email character varying,
  phone character varying,
  address text,
  status character varying DEFAULT 'pending',
  service_areas text[],
  services_offered text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vendors_pkey PRIMARY KEY (id)
);

-- Create indexes
CREATE INDEX vendors_status_idx ON vendors(status);
CREATE INDEX vendors_email_idx ON vendors(email);
CREATE INDEX vendors_category_idx ON vendors(category);

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for approved vendors" ON vendors
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Vendors can insert their own profile" ON vendors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendors can update their own profile" ON vendors
  FOR UPDATE USING (email = auth.jwt() ->> 'email' OR auth.uid() IS NULL);

-- Insert some sample data
INSERT INTO vendors (
  name, category, rating, events_count, price, price_label, response_time, 
  badge, image, description, features, location, experience, team_size, 
  availability, email, phone, address, status
) VALUES 
(
  'Royal Feast Catering',
  'Luxury Catering Services',
  4.9,
  234,
  '₹800',
  'Per Plate',
  '24hr',
  'Premium',
  'catering',
  'Premium catering services with celebrity chefs and international cuisine. Perfect for luxury events and corporate functions.',
  ARRAY['Multi-cuisine', 'Dietary Options', 'Live Cooking', 'Premium Service'],
  'Mumbai, Delhi, Bangalore',
  '8+ years',
  '25-50 people',
  'Next 3 months',
  'royal@catering.com',
  '+91-9876543210',
  '123 Food Street, Mumbai',
  'approved'
),
(
  'Cinematic Moments Studio',
  'Photography & Videography',
  5.0,
  189,
  '₹1L',
  'Per Day',
  '2hr',
  'Verified',
  'photography',
  'Professional photography and videography services capturing every precious moment of your special day.',
  ARRAY['4K Video', 'Drone Shots', 'Photo Editing', 'Same Day Preview'],
  'Pan India',
  '12+ years',
  '8-15 people',
  'Next 6 months',
  'cinematic@studio.com',
  '+91-9876543211',
  '456 Camera Lane, Delhi',
  'approved'
);

-- Verify the structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'vendors'
AND table_schema = 'public'
ORDER BY ordinal_position;
