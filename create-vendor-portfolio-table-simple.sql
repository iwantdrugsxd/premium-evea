-- Simple vendor_portfolio table creation (drops existing table)
-- Use this if you want to start fresh and avoid policy conflicts

-- Drop existing table and all associated objects
DROP TABLE IF EXISTS vendor_portfolio CASCADE;

-- Create vendor_portfolio table
CREATE TABLE vendor_portfolio (
  id SERIAL PRIMARY KEY,
  vendor_id BIGINT REFERENCES vendors(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'portfolio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX vendor_portfolio_vendor_id_idx ON vendor_portfolio(vendor_id);
CREATE INDEX vendor_portfolio_category_idx ON vendor_portfolio(category);

-- Enable RLS
ALTER TABLE vendor_portfolio ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for vendor portfolio" ON vendor_portfolio
  FOR SELECT USING (true);

CREATE POLICY "Vendors can insert their own portfolio" ON vendor_portfolio
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendors can update their own portfolio" ON vendor_portfolio
  FOR UPDATE USING (true);

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_vendor_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vendor_portfolio_updated_at 
  BEFORE UPDATE ON vendor_portfolio 
  FOR EACH ROW EXECUTE FUNCTION update_vendor_portfolio_updated_at();

-- Verify creation
SELECT 'vendor_portfolio table created successfully' as status;
