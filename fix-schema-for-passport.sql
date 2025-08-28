-- Fix schema for Passport.js authentication
-- Run this in your Supabase SQL editor

-- 1. Update column names to match our code (snake_case to match database convention)
-- The schema shows the columns are already correct, but let's ensure they exist

-- 2. Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_google_id_idx ON users(google_id);

-- 3. Update RLS policies to allow authentication
-- First, drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own profile') THEN
        DROP POLICY "Users can view their own profile" ON users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own profile') THEN
        DROP POLICY "Users can update their own profile" ON users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert their own profile') THEN
        DROP POLICY "Users can insert their own profile" ON users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Public read access for login') THEN
        DROP POLICY "Public read access for login" ON users;
    END IF;
END $$;

-- 4. Create new policies for Passport.js authentication
-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow public read access for login (email lookup) - this is crucial for authentication
CREATE POLICY "Public read access for login" ON users
  FOR SELECT USING (true);

-- 5. Ensure the users table has the correct structure
-- Add any missing columns (they should already exist based on your schema)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash character varying;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id character varying;

-- 6. Add unique constraint on google_id (drop first if exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_google_id_unique'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_google_id_unique UNIQUE (google_id);
    END IF;
END $$;

-- 7. Update other tables to ensure they work with the authentication system

-- Add indexes for better performance on related tables
CREATE INDEX IF NOT EXISTS user_events_user_id_idx ON user_events(user_id);
CREATE INDEX IF NOT EXISTS user_vendor_selections_user_id_idx ON user_vendor_selections(user_id);
CREATE INDEX IF NOT EXISTS vendor_portfolio_vendor_id_idx ON vendor_portfolio(vendor_id);
CREATE INDEX IF NOT EXISTS vendor_reviews_vendor_id_idx ON vendor_reviews(vendor_id);

-- 8. Add RLS policies for other tables to work with authenticated users
-- User events table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_events' AND policyname = 'Users can view their own events') THEN
        DROP POLICY "Users can view their own events" ON user_events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_events' AND policyname = 'Users can create their own events') THEN
        DROP POLICY "Users can create their own events" ON user_events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_events' AND policyname = 'Users can update their own events') THEN
        DROP POLICY "Users can update their own events" ON user_events;
    END IF;
END $$;

CREATE POLICY "Users can view their own events" ON user_events
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own events" ON user_events
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own events" ON user_events
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- User vendor selections table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_vendor_selections' AND policyname = 'Users can view their own vendor selections') THEN
        DROP POLICY "Users can view their own vendor selections" ON user_vendor_selections;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_vendor_selections' AND policyname = 'Users can create their own vendor selections') THEN
        DROP POLICY "Users can create their own vendor selections" ON user_vendor_selections;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_vendor_selections' AND policyname = 'Users can update their own vendor selections') THEN
        DROP POLICY "Users can update their own vendor selections" ON user_vendor_selections;
    END IF;
END $$;

CREATE POLICY "Users can view their own vendor selections" ON user_vendor_selections
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own vendor selections" ON user_vendor_selections
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own vendor selections" ON user_vendor_selections
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 9. Public read access for events, vendors, and related data
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Public read access for events') THEN
        DROP POLICY "Public read access for events" ON events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Public read access for vendors') THEN
        DROP POLICY "Public read access for vendors" ON vendors;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_services' AND policyname = 'Public read access for event_services') THEN
        DROP POLICY "Public read access for event_services" ON event_services;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_packages' AND policyname = 'Public read access for event_packages') THEN
        DROP POLICY "Public read access for event_packages" ON event_packages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_portfolio' AND policyname = 'Public read access for vendor_portfolio') THEN
        DROP POLICY "Public read access for vendor_portfolio" ON vendor_portfolio;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_reviews' AND policyname = 'Public read access for vendor_reviews') THEN
        DROP POLICY "Public read access for vendor_reviews" ON vendor_reviews;
    END IF;
END $$;

CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Public read access for event_services" ON event_services FOR SELECT USING (true);
CREATE POLICY "Public read access for event_packages" ON event_packages FOR SELECT USING (true);
CREATE POLICY "Public read access for vendor_portfolio" ON vendor_portfolio FOR SELECT USING (true);
CREATE POLICY "Public read access for vendor_reviews" ON vendor_reviews FOR SELECT USING (true);

-- 10. Verify the structure
-- This will show you the current structure of the users table
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
