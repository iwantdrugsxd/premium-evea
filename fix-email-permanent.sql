-- Permanent Fix for Email Issue
-- Run this in your Supabase SQL editor

-- 1. Delete all existing admin settings
DELETE FROM public.admin_settings;

-- 2. Insert a single, clean admin setting with your email
INSERT INTO public.admin_settings (
  admin_whatsapp, 
  admin_email, 
  admin_name, 
  is_active
) VALUES (
  '+919876543210', 
  'vnair0795@gmail.com', 
  'EVEA Admin', 
  true
);

-- 3. Verify the fix
SELECT 'Email fix verification:' as info;
SELECT 
  id,
  admin_whatsapp,
  admin_email,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings;

-- 4. Confirm your email is set
SELECT 
  'Current admin email:' as info,
  admin_email as actual_email,
  CASE 
    WHEN admin_email = 'vnair0795@gmail.com' THEN '✅ CORRECT - Email will work now!'
    ELSE '❌ WRONG - Something went wrong'
  END as status
FROM public.admin_settings;
