-- Create collaboration table
CREATE TABLE IF NOT EXISTS collaboration_requests (
    id SERIAL PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    collaboration_type VARCHAR(100) NOT NULL,
    additional_details TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_collaboration_email ON collaboration_requests(email);
CREATE INDEX IF NOT EXISTS idx_collaboration_status ON collaboration_requests(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_created_at ON collaboration_requests(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view their own requests
CREATE POLICY "Users can view their own collaboration requests" ON collaboration_requests
    FOR SELECT USING (auth.uid()::text = email);

-- Policy to allow public to insert collaboration requests
CREATE POLICY "Public can insert collaboration requests" ON collaboration_requests
    FOR INSERT WITH CHECK (true);

-- Policy to allow admins to update collaboration requests
CREATE POLICY "Admins can update collaboration requests" ON collaboration_requests
    FOR UPDATE USING (auth.role() = 'admin');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_collaboration_requests_updated_at 
    BEFORE UPDATE ON collaboration_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
