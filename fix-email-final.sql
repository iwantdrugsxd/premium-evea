-- FINAL EMAIL FIX - Run this in Supabase SQL Editor
-- This will permanently fix the email issue

-- 1. Delete ALL existing admin settings
DELETE FROM public.admin_settings;

-- 2. Insert ONLY ONE admin setting with your correct email
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
SELECT 'EMAIL FIX VERIFICATION:' as info;
SELECT 
  'Admin Email:' as field,
  admin_email as value,
  CASE 
    WHEN admin_email = 'vnair0795@gmail.com' THEN '✅ CORRECT - Email will work!'
    ELSE '❌ WRONG - Run this script again'
  END as status
FROM public.admin_settings;

-- 4. Show total count (should be exactly 1)
SELECT 'Total admin settings:' as info, COUNT(*) as count FROM public.admin_settings;
