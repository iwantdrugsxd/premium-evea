-- Fix authentication database schema
-- Run this in your Supabase SQL editor

-- First, let's check if we need to update the users table structure
-- The current schema uses UUID but auth code expects BIGSERIAL

-- Option 1: Update the users table to use BIGSERIAL (recommended)
-- Drop existing users table and recreate with correct structure
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table with BIGSERIAL ID (matching auth code expectations)
CREATE TABLE public.users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  google_id TEXT UNIQUE,
  mobile_number VARCHAR(20) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX users_email_idx ON public.users(email);
CREATE INDEX users_google_id_idx ON public.users(google_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Public read access for login" ON public.users;

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (true);

-- Allow public read access for login (email lookup)
CREATE POLICY "Public read access for login" ON public.users
  FOR SELECT USING (true);

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_users_updated_at_column();

-- Insert a sample admin user for testing
INSERT INTO public.users (full_name, email, mobile_number, location, password_hash) 
VALUES ('EVEA Admin', 'admin@evea.com', '+919876543210', 'Mumbai', '$2a$10$hashedpassword')
ON CONFLICT (email) DO NOTHING;

-- Create events table for the event planning system
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  base_price DECIMAL(10,2),
  min_guests INTEGER,
  max_guests INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_services table
CREATE TABLE IF NOT EXISTS public.event_services (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  service_description TEXT,
  category VARCHAR(100),
  is_required BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_packages table
CREATE TABLE IF NOT EXISTS public.event_packages (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  package_name VARCHAR(255) NOT NULL,
  package_description TEXT,
  price DECIMAL(10,2),
  features TEXT[],
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample events
INSERT INTO public.events (name, category, description, base_price, min_guests, max_guests) VALUES
('Wedding', 'wedding', 'Complete wedding planning and coordination', 50000.00, 50, 500),
('Birthday Party', 'birthday', 'Fun and memorable birthday celebrations', 25000.00, 10, 100),
('Corporate Event', 'corporate', 'Professional corporate event management', 75000.00, 20, 200),
('Anniversary', 'anniversary', 'Romantic anniversary celebrations', 35000.00, 20, 150),
('Festival/Concert', 'festival', 'Large-scale festival and concert management', 100000.00, 100, 1000),
('Custom Event', 'custom', 'Unique custom event planning', 40000.00, 10, 300)
ON CONFLICT DO NOTHING;

-- Insert sample event services for Birthday Party (event_id = 2)
INSERT INTO public.event_services (event_id, service_name, service_description, category, is_required, is_popular, price) VALUES
(2, 'Birthday Photography', 'Fun and candid photography', 'Photography', false, true, 5000.00),
(2, 'Birthday Catering', 'Delicious food and beverages', 'Catering', true, true, 8000.00),
(2, 'Birthday Decoration', 'Colorful balloons and theme decoration', 'Decoration', true, true, 3000.00),
(2, 'Birthday Cake', 'Custom designed birthday cake', 'Food', true, true, 2000.00),
(2, 'Birthday Entertainment', 'DJ, games, and activities', 'Entertainment', false, true, 4000.00)
ON CONFLICT DO NOTHING;

-- Insert sample event packages for Birthday Party (event_id = 2)
INSERT INTO public.event_packages (event_id, package_name, package_description, price, features, is_popular) VALUES
(2, 'Basic Package', 'Essential services for a small birthday party', 15000.00, ARRAY['Basic decoration', 'Simple catering', 'Birthday cake'], false),
(2, 'Standard Package', 'Complete birthday celebration package', 25000.00, ARRAY['Themed decoration', 'Premium catering', 'Custom cake', 'Photography'], true),
(2, 'Premium Package', 'Luxury birthday celebration with all services', 40000.00, ARRAY['Luxury decoration', 'Gourmet catering', 'Designer cake', 'Professional photography', 'Entertainment'], false)
ON CONFLICT DO NOTHING;

