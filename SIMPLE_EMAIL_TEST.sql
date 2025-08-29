-- SIMPLE EMAIL TEST - Run this in Supabase SQL Editor
-- This will test the email functionality step by step

-- 1. First, let's check if we have the right admin email
SELECT '=== CHECKING ADMIN EMAIL ===' as info;
SELECT 
  id,
  admin_email,
  admin_whatsapp,
  admin_name,
  is_active
FROM public.admin_settings;

-- 2. Create a test event request
SELECT '=== CREATING TEST EVENT REQUEST ===' as info;
INSERT INTO public.event_planning_requests (
  event_id,
  location,
  event_date,
  budget,
  guest_count,
  additional_notes,
  status,
  selected_package
) VALUES (
  1,
  'Mumbai, Maharashtra',
  '2024-12-15 14:00:00',
  500000,
  200,
  'Test event for email debugging - ' || now(),
  'pending',
  'professional'
) RETURNING id as test_event_id;

-- 3. Create a test consultation call
SELECT '=== CREATING TEST CONSULTATION CALL ===' as info;
INSERT INTO public.consultation_calls (
  event_planning_request_id,
  scheduled_time,
  user_email,
  admin_whatsapp,
  status
) VALUES (
  (SELECT id FROM public.event_planning_requests WHERE additional_notes LIKE 'Test event for email debugging%' ORDER BY created_at DESC LIMIT 1),
  '2024-11-20 15:00:00',
  'test@example.com',
  '+919876543210',
  'scheduled'
) RETURNING id as test_call_id;

-- 4. Show what we created
SELECT '=== TEST DATA CREATED ===' as info;
SELECT 
  'Test Event Request ID' as data_type,
  id::text as value
FROM public.event_planning_requests 
WHERE additional_notes LIKE 'Test event for email debugging%'
ORDER BY created_at DESC
LIMIT 1
UNION ALL
SELECT 
  'Test Call ID' as data_type,
  id::text as value
FROM public.consultation_calls 
WHERE user_email = 'test@example.com'
ORDER BY created_at DESC
LIMIT 1
UNION ALL
SELECT 
  'Admin Email' as data_type,
  admin_email as value
FROM public.admin_settings;

-- 5. Show the complete test data
SELECT '=== COMPLETE TEST DATA ===' as info;
SELECT 
  epr.id as event_request_id,
  epr.location,
  epr.event_date,
  epr.budget,
  epr.guest_count,
  epr.selected_package,
  cc.id as call_id,
  cc.scheduled_time,
  cc.user_email,
  cc.admin_whatsapp,
  e.name as event_name
FROM public.event_planning_requests epr
LEFT JOIN public.events e ON epr.event_id = e.id
LEFT JOIN public.consultation_calls cc ON cc.event_planning_request_id = epr.id
WHERE epr.additional_notes LIKE 'Test event for email debugging%'
ORDER BY epr.created_at DESC
LIMIT 1;
