-- Check Current Admin Settings
-- Run this in your Supabase SQL editor to see what's configured

SELECT 'Current admin settings:' as info;
SELECT 
  id,
  admin_whatsapp,
  admin_email,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings 
ORDER BY id;

-- Count total records
SELECT 'Total admin settings:' as info, COUNT(*) as count FROM public.admin_settings;

-- Check if your email exists
SELECT 'Looking for vnair0795@gmail.com:' as info;
SELECT 
  id,
  admin_email,
  is_active
FROM public.admin_settings 
WHERE admin_email = 'vnair0795@gmail.com';
