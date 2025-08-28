-- Update users table to support Passport.js authentication
-- Run this in your Supabase SQL editor

-- Add password_hash column for local authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add google_id column for Google OAuth
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;

-- Add unique constraint on google_id
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS users_google_id_unique UNIQUE (google_id);

-- Update RLS policies to allow user registration and login
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Public read access" ON users;

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow public read access for login (email lookup)
CREATE POLICY "Public read access for login" ON users
  FOR SELECT USING (true);

-- Create index on email for faster login lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Create index on google_id for OAuth lookups
CREATE INDEX IF NOT EXISTS users_google_id_idx ON users(google_id);
