-- Force Update Admin Email to vnair0795@gmail.com
-- Run this in your Supabase SQL editor

-- 1. First, let's see what we have
SELECT 'Before update - Current admin settings:' as info;
SELECT 
  id,
  admin_whatsapp,
  admin_email,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings 
ORDER BY id;

-- 2. Update ALL admin settings to use your email
UPDATE public.admin_settings 
SET 
  admin_email = 'vnair0795@gmail.com',
  admin_name = 'EVEA Admin',
  is_active = true
WHERE admin_email != 'vnair0795@gmail.com' OR admin_email IS NULL;

-- 3. If no records exist, insert one
INSERT INTO public.admin_settings (admin_whatsapp, admin_email, admin_name, is_active)
SELECT '+919876543210', 'vnair0795@gmail.com', 'EVEA Admin', true
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings);

-- 4. Show the result
SELECT 'After update - Admin settings:' as info;
SELECT 
  id,
  admin_whatsapp,
  admin_email,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings 
ORDER BY id;

-- 5. Verify your email is set
SELECT 'Verification - Your email should be:' as info, 'vnair0795@gmail.com' as expected_email;
SELECT 
  'Current admin email:' as info,
  admin_email as actual_email,
  CASE 
    WHEN admin_email = 'vnair0795@gmail.com' THEN '✅ CORRECT'
    ELSE '❌ WRONG - Run the fix again'
  END as status
FROM public.admin_settings 
LIMIT 1;
