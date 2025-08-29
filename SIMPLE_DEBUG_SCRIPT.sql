-- SIMPLE DEBUG SCRIPT - Run this in Supabase SQL Editor
-- This will show us exactly what we need to fix the email issue

-- 1. Check if tables exist
SELECT '=== TABLES EXIST ===' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'event_planning_requests', 'consultation_calls', 'admin_settings', 'event_services', 'event_packages')
ORDER BY table_name;

-- 2. Check admin settings (this is critical for email)
SELECT '=== ADMIN SETTINGS ===' as info;
SELECT * FROM public.admin_settings;

-- 3. Check recent event requests
SELECT '=== RECENT EVENT REQUESTS ===' as info;
SELECT 
  id,
  event_id,
  location,
  event_date,
  budget,
  guest_count,
  selected_package,
  status,
  created_at
FROM public.event_planning_requests 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check recent consultation calls
SELECT '=== RECENT CONSULTATION CALLS ===' as info;
SELECT 
  id,
  event_planning_request_id,
  scheduled_time,
  user_email,
  admin_whatsapp,
  status,
  created_at
FROM public.consultation_calls 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Check events data
SELECT '=== EVENTS DATA ===' as info;
SELECT * FROM public.events ORDER BY id;

-- 6. Check event packages
SELECT '=== EVENT PACKAGES ===' as info;
SELECT * FROM public.event_packages ORDER BY id LIMIT 10;

-- 7. Check event services
SELECT '=== EVENT SERVICES COUNT ===' as info;
SELECT COUNT(*) as total_services FROM public.event_services;

-- 8. Test email data (create if missing)
SELECT '=== CREATING TEST EMAIL DATA ===' as info;

-- Insert admin settings if missing
INSERT INTO public.admin_settings (admin_whatsapp, admin_email, admin_name, is_active)
VALUES ('+919876543210', 'vnair0795@gmail.com', 'EVEA Admin', true)
ON CONFLICT DO NOTHING
RETURNING 'Admin settings created/updated' as status;

-- Insert test event if missing
INSERT INTO public.events (name, description, category, avg_budget, min_guests, max_guests, is_active)
VALUES ('Wedding', 'Complete wedding planning services', 'wedding', 500000, 50, 500, true)
ON CONFLICT DO NOTHING
RETURNING 'Test event created/updated' as status;

-- 9. Final verification
SELECT '=== FINAL VERIFICATION ===' as info;
SELECT 
  'Admin Email' as field,
  admin_email as value
FROM public.admin_settings
UNION ALL
SELECT 
  'Total Events' as field,
  COUNT(*)::text as value
FROM public.events
UNION ALL
SELECT 
  'Total Event Requests' as field,
  COUNT(*)::text as value
FROM public.event_planning_requests
UNION ALL
SELECT 
  'Total Consultation Calls' as field,
  COUNT(*)::text as value
FROM public.consultation_calls;
