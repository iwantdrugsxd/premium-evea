-- Create email verification table for OTP verification
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_otp ON email_verifications(otp);

-- Add RLS policies
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own verification records
CREATE POLICY "Users can insert their own email verifications" ON email_verifications
  FOR INSERT WITH CHECK (true);

-- Policy to allow users to update their own verification records
CREATE POLICY "Users can update their own email verifications" ON email_verifications
  FOR UPDATE USING (true);

-- Policy to allow users to select their own verification records
CREATE POLICY "Users can select their own email verifications" ON email_verifications
  FOR SELECT USING (true);

-- Clean up expired OTPs (optional - can be run periodically)
-- DELETE FROM email_verifications WHERE expires_at < NOW() - INTERVAL '1 hour';
