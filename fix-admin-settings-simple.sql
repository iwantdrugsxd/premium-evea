-- Simple Fix for Admin Settings - Remove Duplicates
-- Run this in your Supabase SQL editor

-- 1. Show current admin settings
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

-- 2. Delete all existing admin settings
DELETE FROM public.admin_settings;

-- 3. Insert a single, clean admin setting with your email
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

-- 4. Verify we have only one admin setting
SELECT 'After cleanup - admin settings:' as info;
SELECT 
  id,
  admin_whatsapp,
  admin_email,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings 
ORDER BY id;

-- 5. Show the count to confirm only one record
SELECT 'Total admin settings:' as info, COUNT(*) as count FROM public.admin_settings;
