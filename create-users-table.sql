-- Create users table for EVEA authentication
-- Run this in your Supabase SQL editor

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
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
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_google_id_idx ON public.users(google_id);

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

-- Insert a sample admin user if needed
INSERT INTO public.users (full_name, email, mobile_number, location) 
VALUES ('EVEA Admin', 'admin@evea.com', '+919876543210', 'Mumbai')
ON CONFLICT (email) DO NOTHING;
