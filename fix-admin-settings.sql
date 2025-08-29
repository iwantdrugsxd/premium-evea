-- Fix Admin Settings - Remove Duplicates and Set Single Admin
-- Run this in your Supabase SQL editor

-- 1. First, let's see what we have
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

-- 5. Add a unique constraint to prevent future duplicates (drop first if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_settings_single_row') THEN
        ALTER TABLE public.admin_settings DROP CONSTRAINT admin_settings_single_row;
    END IF;
END $$;

ALTER TABLE public.admin_settings 
ADD CONSTRAINT admin_settings_single_row 
CHECK (id = 1);

-- 6. Add a comment for documentation
COMMENT ON TABLE public.admin_settings IS 'Single admin configuration for EVEA system';
