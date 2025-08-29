-- Update Database Schema for Email Instead of WhatsApp
-- Run this in your Supabase SQL editor

-- 1. Add user_email column to consultation_calls table
ALTER TABLE public.consultation_calls 
ADD COLUMN IF NOT EXISTS user_email VARCHAR;

-- 2. Update existing consultation_calls to have a default email if user_whatsapp exists
UPDATE public.consultation_calls 
SET user_email = 'user@example.com' 
WHERE user_email IS NULL AND user_whatsapp IS NOT NULL;

-- 3. Make user_email NOT NULL for new records
ALTER TABLE public.consultation_calls 
ALTER COLUMN user_email SET NOT NULL;

-- 4. Add a comment to document the change
COMMENT ON COLUMN public.consultation_calls.user_email IS 'Customer email address for contact';

-- 5. Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'consultation_calls' 
AND column_name IN ('user_email', 'user_whatsapp')
ORDER BY column_name;

-- 6. Show sample data
SELECT 
  id,
  event_planning_request_id,
  scheduled_time,
  user_email,
  user_whatsapp,
  status,
  created_at
FROM public.consultation_calls 
ORDER BY created_at DESC 
LIMIT 5;
