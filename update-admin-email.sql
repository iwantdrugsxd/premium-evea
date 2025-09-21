-- Update Admin Email to vnair0795@gmail.com
-- Run this in your Supabase SQL editor

-- Update existing admin settings
UPDATE public.admin_settings 
SET admin_email = 'vnair0795@gmail.com'
WHERE id = 1;

-- If no admin settings exist, insert new one
INSERT INTO public.admin_settings (admin_whatsapp, admin_email, admin_name)
VALUES ('+919876543210', 'vnair0795@gmail.com', 'EVEA Admin')
ON CONFLICT (id) DO UPDATE SET
  admin_email = EXCLUDED.admin_email;

-- Verify the update
SELECT 
  id,
  admin_whatsapp,
  admin_email,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings 
ORDER BY id DESC;
 