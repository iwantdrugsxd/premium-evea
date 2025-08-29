-- CHECK ALL ENTRIES WITH HIGHER LIMITS
-- Run this in Supabase SQL Editor

-- 1. Admin Settings (all entries)
SELECT '=== ADMIN SETTINGS (ALL) ===' as info;
SELECT * FROM public.admin_settings;

-- 2. Events (all entries)
SELECT '=== EVENTS (ALL) ===' as info;
SELECT * FROM public.events ORDER BY id;

-- 3. Event Planning Requests (last 50)
SELECT '=== EVENT PLANNING REQUESTS (LAST 50) ===' as info;
SELECT * FROM public.event_planning_requests ORDER BY created_at DESC LIMIT 50;

-- 4. Consultation Calls (last 50)
SELECT '=== CONSULTATION CALLS (LAST 50) ===' as info;
SELECT * FROM public.consultation_calls ORDER BY created_at DESC LIMIT 50;

-- 5. Event Packages (all entries)
SELECT '=== EVENT PACKAGES (ALL) ===' as info;
SELECT * FROM public.event_packages ORDER BY id;

-- 6. Event Services (all entries)
SELECT '=== EVENT SERVICES (ALL) ===' as info;
SELECT * FROM public.event_services ORDER BY id;

-- 7. Count all entries
SELECT '=== TOTAL COUNTS ===' as info;
SELECT 'admin_settings' as table_name, COUNT(*) as count FROM public.admin_settings
UNION ALL
SELECT 'events' as table_name, COUNT(*) as count FROM public.events
UNION ALL
SELECT 'event_planning_requests' as table_name, COUNT(*) as count FROM public.event_planning_requests
UNION ALL
SELECT 'consultation_calls' as table_name, COUNT(*) as count FROM public.consultation_calls
UNION ALL
SELECT 'event_packages' as table_name, COUNT(*) as count FROM public.event_packages
UNION ALL
SELECT 'event_services' as table_name, COUNT(*) as count FROM public.event_services;
