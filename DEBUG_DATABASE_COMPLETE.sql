-- COMPLETE DATABASE DEBUG SCRIPT
-- Run this in Supabase SQL Editor to see everything

-- ========================================
-- 1. LIST ALL TABLES
-- ========================================
SELECT '=== ALL TABLES ===' as info;
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ========================================
-- 2. TABLE STRUCTURES
-- ========================================
SELECT '=== TABLE STRUCTURES ===' as info;

-- events table
SELECT '--- events table ---' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'events'
ORDER BY ordinal_position;

-- event_planning_requests table
SELECT '--- event_planning_requests table ---' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'event_planning_requests'
ORDER BY ordinal_position;

-- event_packages table
SELECT '--- event_packages table ---' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'event_packages'
ORDER BY ordinal_position;

-- consultation_calls table
SELECT '--- consultation_calls table ---' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'consultation_calls'
ORDER BY ordinal_position;

-- admin_settings table
SELECT '--- admin_settings table ---' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'admin_settings'
ORDER BY ordinal_position;

-- event_services table
SELECT '--- event_services table ---' as table_name;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'event_services'
ORDER BY ordinal_position;

-- ========================================
-- 3. ALL DATA IN TABLES
-- ========================================
SELECT '=== ALL DATA IN TABLES ===' as info;

-- events data
SELECT '--- events data ---' as table_name;
SELECT * FROM public.events ORDER BY id;

-- event_planning_requests data
SELECT '--- event_planning_requests data ---' as table_name;
SELECT * FROM public.event_planning_requests ORDER BY id DESC LIMIT 10;

-- event_packages data
SELECT '--- event_packages data ---' as table_name;
SELECT * FROM public.event_packages ORDER BY id;

-- consultation_calls data
SELECT '--- consultation_calls data ---' as table_name;
SELECT * FROM public.consultation_calls ORDER BY id DESC LIMIT 10;

-- admin_settings data
SELECT '--- admin_settings data ---' as table_name;
SELECT * FROM public.admin_settings ORDER BY id;

-- event_services data
SELECT '--- event_services data (first 20) ---' as table_name;
SELECT * FROM public.event_services ORDER BY id LIMIT 20;

-- ========================================
-- 4. ROW LEVEL SECURITY POLICIES
-- ========================================
SELECT '=== ROW LEVEL SECURITY POLICIES ===' as info;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 5. FOREIGN KEY CONSTRAINTS
-- ========================================
SELECT '=== FOREIGN KEY CONSTRAINTS ===' as info;
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ========================================
-- 6. INDEXES
-- ========================================
SELECT '=== INDEXES ===' as info;
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ========================================
-- 7. TRIGGERS
-- ========================================
SELECT '=== TRIGGERS ===' as info;
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ========================================
-- 8. SEQUENCES
-- ========================================
SELECT '=== SEQUENCES ===' as info;
SELECT 
  sequence_name,
  data_type,
  start_value,
  minimum_value,
  maximum_value,
  increment
FROM information_schema.sequences 
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- ========================================
-- 9. RECENT ACTIVITY (LAST 10 ENTRIES)
-- ========================================
SELECT '=== RECENT ACTIVITY ===' as info;

-- Recent event requests
SELECT '--- Recent Event Requests ---' as activity_type;
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
LIMIT 10;

-- Recent consultation calls
SELECT '--- Recent Consultation Calls ---' as activity_type;
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
LIMIT 10;

-- ========================================
-- 10. EMAIL DEBUG INFO
-- ========================================
SELECT '=== EMAIL DEBUG INFO ===' as info;

-- Admin settings for email
SELECT '--- Admin Settings for Email ---' as debug_info;
SELECT 
  id,
  admin_email,
  admin_whatsapp,
  admin_name,
  is_active,
  created_at
FROM public.admin_settings;

-- Check if there are any consultation calls without emails
SELECT '--- Consultation Calls Without Emails ---' as debug_info;
SELECT 
  id,
  event_planning_request_id,
  scheduled_time,
  user_email,
  admin_whatsapp,
  status,
  created_at
FROM public.consultation_calls 
WHERE user_email IS NULL OR user_email = '';

-- Check event requests with packages
SELECT '--- Event Requests with Packages ---' as debug_info;
SELECT 
  epr.id,
  epr.event_id,
  epr.selected_package,
  epr.status,
  e.name as event_name,
  epr.created_at
FROM public.event_planning_requests epr
LEFT JOIN public.events e ON epr.event_id = e.id
WHERE epr.selected_package IS NOT NULL
ORDER BY epr.created_at DESC
LIMIT 10;

-- ========================================
-- 11. DATA COUNTS
-- ========================================
SELECT '=== DATA COUNTS ===' as info;
SELECT 'events' as table_name, COUNT(*) as count FROM public.events
UNION ALL
SELECT 'event_planning_requests' as table_name, COUNT(*) as count FROM public.event_planning_requests
UNION ALL
SELECT 'event_packages' as table_name, COUNT(*) as count FROM public.event_packages
UNION ALL
SELECT 'consultation_calls' as table_name, COUNT(*) as count FROM public.consultation_calls
UNION ALL
SELECT 'admin_settings' as table_name, COUNT(*) as count FROM public.admin_settings
UNION ALL
SELECT 'event_services' as table_name, COUNT(*) as count FROM public.event_services;

-- ========================================
-- 12. ENVIRONMENT CHECK
-- ========================================
SELECT '=== ENVIRONMENT CHECK ===' as info;
SELECT 
  'Database Name' as check_type,
  current_database() as value
UNION ALL
SELECT 
  'Current User' as check_type,
  current_user as value
UNION ALL
SELECT 
  'Current Schema' as check_type,
  current_schema as value
UNION ALL
SELECT 
  'Current Timestamp' as check_type,
  current_timestamp::text as value;
