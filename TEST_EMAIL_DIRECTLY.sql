-- DIRECT EMAIL TEST SCRIPT
-- Run this to test email functionality

-- ========================================
-- 1. CHECK ADMIN SETTINGS
-- ========================================
SELECT '=== ADMIN SETTINGS CHECK ===' as info;
SELECT 
  id,
  admin_email,
  admin_whatsapp,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings;

-- ========================================
-- 2. CHECK RECENT CONSULTATION CALLS
-- ========================================
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

-- ========================================
-- 3. CHECK EVENT REQUESTS WITH PACKAGES
-- ========================================
SELECT '=== EVENT REQUESTS WITH PACKAGES ===' as info;
SELECT 
  epr.id,
  epr.event_id,
  epr.location,
  epr.event_date,
  epr.budget,
  epr.guest_count,
  epr.selected_package,
  epr.status,
  epr.created_at,
  e.name as event_name
FROM public.event_planning_requests epr
LEFT JOIN public.events e ON epr.event_id = e.id
WHERE epr.selected_package IS NOT NULL
ORDER BY epr.created_at DESC
LIMIT 5;

-- ========================================
-- 4. CREATE TEST DATA FOR EMAIL TESTING
-- ========================================
SELECT '=== CREATING TEST DATA ===' as info;

-- Insert test event request if none exists
INSERT INTO public.event_planning_requests (
  event_id, 
  location, 
  event_date, 
  budget, 
  guest_count, 
  additional_notes, 
  status
) VALUES (
  1, 
  'Mumbai, Maharashtra', 
  '2024-12-15 14:00:00', 
  500000, 
  200, 
  'Test event for email debugging', 
  'pending'
) ON CONFLICT DO NOTHING
RETURNING id as test_event_request_id;

-- Insert test consultation call
INSERT INTO public.consultation_calls (
  event_planning_request_id,
  scheduled_time,
  user_email,
  admin_whatsapp,
  status
) VALUES (
  (SELECT id FROM public.event_planning_requests WHERE additional_notes = 'Test event for email debugging' LIMIT 1),
  '2024-11-20 15:00:00',
  'test@example.com',
  '+919876543210',
  'scheduled'
) ON CONFLICT DO NOTHING
RETURNING id as test_call_id;

-- ========================================
-- 5. VERIFY TEST DATA
-- ========================================
SELECT '=== VERIFYING TEST DATA ===' as info;

-- Check test event request
SELECT '--- Test Event Request ---' as data_type;
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
WHERE additional_notes = 'Test event for email debugging';

-- Check test consultation call
SELECT '--- Test Consultation Call ---' as data_type;
SELECT 
  id,
  event_planning_request_id,
  scheduled_time,
  user_email,
  admin_whatsapp,
  status,
  created_at
FROM public.consultation_calls 
WHERE user_email = 'test@example.com';

-- ========================================
-- 6. EMAIL TEST DATA SUMMARY
-- ========================================
SELECT '=== EMAIL TEST DATA SUMMARY ===' as info;
SELECT 
  'Admin Email' as field,
  admin_email as value
FROM public.admin_settings
UNION ALL
SELECT 
  'Test Event Request ID' as field,
  id::text as value
FROM public.event_planning_requests 
WHERE additional_notes = 'Test event for email debugging'
UNION ALL
SELECT 
  'Test Call ID' as field,
  id::text as value
FROM public.consultation_calls 
WHERE user_email = 'test@example.com';

-- ========================================
-- 7. CLEANUP INSTRUCTIONS
-- ========================================
SELECT '=== CLEANUP INSTRUCTIONS ===' as info;
SELECT 
  'To clean up test data, run:' as instruction,
  'DELETE FROM public.consultation_calls WHERE user_email = ''test@example.com'';' as cleanup_sql
UNION ALL
SELECT 
  'And:' as instruction,
  'DELETE FROM public.event_planning_requests WHERE additional_notes = ''Test event for email debugging'';' as cleanup_sql;
