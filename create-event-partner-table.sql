-- Create event partner table
CREATE TABLE IF NOT EXISTS event_partners (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    event_management_experience TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_event_partner_email ON event_partners(email);
CREATE INDEX IF NOT EXISTS idx_event_partner_status ON event_partners(status);
CREATE INDEX IF NOT EXISTS idx_event_partner_created_at ON event_partners(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE event_partners ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view their own applications
CREATE POLICY "Users can view their own event partner applications" ON event_partners
    FOR SELECT USING (auth.uid()::text = email);

-- Policy to allow public to insert event partner applications
CREATE POLICY "Public can insert event partner applications" ON event_partners
    FOR INSERT WITH CHECK (true);

-- Policy to allow admins to update event partner applications
CREATE POLICY "Admins can update event partner applications" ON event_partners
    FOR UPDATE USING (auth.role() = 'admin');

-- Function to update updated_at timestamp (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_event_partners_updated_at 
    BEFORE UPDATE ON event_partners 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
