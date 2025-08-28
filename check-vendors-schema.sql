-- Check current vendors table structure
-- Run this in your Supabase SQL editor to see what columns exist

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'vendors'
AND table_schema = 'public'
ORDER BY ordinal_position;
