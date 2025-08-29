-- CHECK TABLE ENTRIES
-- Run this in Supabase SQL Editor

-- 1. Admin Settings
SELECT '=== ADMIN SETTINGS ===' as info;
SELECT * FROM public.admin_settings;

-- 2. Events
SELECT '=== EVENTS ===' as info;
SELECT * FROM public.events ORDER BY id;

-- 3. Event Planning Requests
SELECT '=== EVENT PLANNING REQUESTS ===' as info;
SELECT * FROM public.event_planning_requests ORDER BY created_at DESC LIMIT 10;

-- 4. Consultation Calls
SELECT '=== CONSULTATION CALLS ===' as info;
SELECT * FROM public.consultation_calls ORDER BY created_at DESC LIMIT 10;

-- 5. Event Packages
SELECT '=== EVENT PACKAGES ===' as info;
SELECT * FROM public.event_packages ORDER BY id LIMIT 10;

-- 6. Event Services
SELECT '=== EVENT SERVICES ===' as info;
SELECT * FROM public.event_services ORDER BY id LIMIT 10;
