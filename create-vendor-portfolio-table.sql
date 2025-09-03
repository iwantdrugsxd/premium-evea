-- Create vendor_portfolio table for storing vendor portfolio images
-- Run this in your Supabase SQL editor

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access for vendor portfolio" ON vendor_portfolio;
DROP POLICY IF EXISTS "Vendors can insert their own portfolio" ON vendor_portfolio;
DROP POLICY IF EXISTS "Vendors can update their own portfolio" ON vendor_portfolio;

-- Create vendor_portfolio table if it doesn't exist
CREATE TABLE IF NOT EXISTS vendor_portfolio (
  id SERIAL PRIMARY KEY,
  vendor_id BIGINT REFERENCES vendors(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'portfolio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS vendor_portfolio_vendor_id_idx ON vendor_portfolio(vendor_id);
CREATE INDEX IF NOT EXISTS vendor_portfolio_category_idx ON vendor_portfolio(category);

-- Enable RLS
ALTER TABLE vendor_portfolio ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if they don't exist)
DO $$
BEGIN
    -- Check if policy exists before creating
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'vendor_portfolio' 
        AND policyname = 'Public read access for vendor portfolio'
    ) THEN
        CREATE POLICY "Public read access for vendor portfolio" ON vendor_portfolio
          FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'vendor_portfolio' 
        AND policyname = 'Vendors can insert their own portfolio'
    ) THEN
        CREATE POLICY "Vendors can insert their own portfolio" ON vendor_portfolio
          FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'vendor_portfolio' 
        AND policyname = 'Vendors can update their own portfolio'
    ) THEN
        CREATE POLICY "Vendors can update their own portfolio" ON vendor_portfolio
          FOR UPDATE USING (true);
    END IF;
END $$;

-- Create function for automatic timestamp updates (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_vendor_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_vendor_portfolio_updated_at ON vendor_portfolio;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vendor_portfolio_updated_at 
  BEFORE UPDATE ON vendor_portfolio 
  FOR EACH ROW EXECUTE FUNCTION update_vendor_portfolio_updated_at();

-- Insert sample portfolio data for existing vendors (optional - uncomment if needed)
-- INSERT INTO vendor_portfolio (vendor_id, title, description, image_url, category) VALUES
--   (1, 'Wedding Catering Setup', 'Beautiful wedding catering arrangement', 'https://example.com/image1.jpg', 'portfolio'),
--   (1, 'Corporate Event Service', 'Professional corporate event catering', 'https://example.com/image2.jpg', 'portfolio'),
--   (2, 'Wedding Photography', 'Stunning wedding photography sample', 'https://example.com/image3.jpg', 'portfolio'),
--   (2, 'Corporate Event Coverage', 'Professional corporate event photography', 'https://example.com/image4.jpg', 'portfolio');

-- Verify the table was created successfully
SELECT 
  'vendor_portfolio table created successfully' as status,
  COUNT(*) as total_rows
FROM vendor_portfolio;
