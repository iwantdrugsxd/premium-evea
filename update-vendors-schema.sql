-- Update vendors table schema for new vendor onboarding form
-- Run this in your Supabase SQL editor

-- Add status column for vendor approval workflow
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS status character varying DEFAULT 'pending';

-- Add phone and address columns if they don't exist
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS phone character varying;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS address text;



-- Add service_areas column if it doesn't exist
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS service_areas text[];

-- Update existing vendors to have approved status
UPDATE vendors SET status = 'approved' WHERE status IS NULL;

-- Create index for status for better query performance
CREATE INDEX IF NOT EXISTS vendors_status_idx ON vendors(status);

-- Create index for email for faster lookups
CREATE INDEX IF NOT EXISTS vendors_email_idx ON vendors(email);

-- Update RLS policies for vendors table
DO $$
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Public read access for approved vendors') THEN
        DROP POLICY "Public read access for approved vendors" ON vendors;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Vendors can insert their own profile') THEN
        DROP POLICY "Vendors can insert their own profile" ON vendors;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Vendors can update their own profile') THEN
        DROP POLICY "Vendors can update their own profile" ON vendors;
    END IF;
END $$;

-- Create new policies
-- Allow public read access for approved vendors only
CREATE POLICY "Public read access for approved vendors" ON vendors
  FOR SELECT USING (status = 'approved');

-- Allow vendors to insert their own profile
CREATE POLICY "Vendors can insert their own profile" ON vendors
  FOR INSERT WITH CHECK (true);

-- Allow vendors to update their own profile
CREATE POLICY "Vendors can update their own profile" ON vendors
  FOR UPDATE USING (email = auth.jwt() ->> 'email' OR auth.uid() IS NULL);

-- Update vendor_portfolio table policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_portfolio' AND policyname = 'Public read access for vendor portfolio') THEN
        DROP POLICY "Public read access for vendor portfolio" ON vendor_portfolio;
    END IF;
END $$;

CREATE POLICY "Public read access for vendor portfolio" ON vendor_portfolio
  FOR SELECT USING (true);

-- Update vendor_reviews table policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_reviews' AND policyname = 'Public read access for vendor reviews') THEN
        DROP POLICY "Public read access for vendor reviews" ON vendor_reviews;
    END IF;
END $$;

CREATE POLICY "Public read access for vendor reviews" ON vendor_reviews
  FOR SELECT USING (true);

-- Verify the updated structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'vendors'
AND table_schema = 'public'
ORDER BY ordinal_position;
