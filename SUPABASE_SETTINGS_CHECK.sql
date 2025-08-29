-- CHECK SUPABASE SETTINGS AND LIMITS
-- Run this in Supabase SQL Editor

-- 1. Check current session settings
SELECT '=== SESSION SETTINGS ===' as info;
SELECT 
  'statement_timeout' as setting_name,
  setting as value
FROM pg_settings 
WHERE name = 'statement_timeout'
UNION ALL
SELECT 
  'work_mem' as setting_name,
  setting as value
FROM pg_settings 
WHERE name = 'work_mem'
UNION ALL
SELECT 
  'max_connections' as setting_name,
  setting as value
FROM pg_settings 
WHERE name = 'max_connections';

-- 2. Check if RLS is enabled on tables
SELECT '=== RLS STATUS ===' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('events', 'event_planning_requests', 'consultation_calls', 'admin_settings', 'event_services', 'event_packages')
ORDER BY tablename;

-- 3. Check current user and permissions
SELECT '=== CURRENT USER INFO ===' as info;
SELECT 
  'current_user' as info_type,
  current_user as value
UNION ALL
SELECT 
  'current_database' as info_type,
  current_database() as value
UNION ALL
SELECT 
  'current_schema' as info_type,
  current_schema as value;

-- 4. Check if we can access all tables
SELECT '=== TABLE ACCESS TEST ===' as info;
SELECT 
  'admin_settings' as table_name,
  COUNT(*) as accessible_rows
FROM public.admin_settings
UNION ALL
SELECT 
  'events' as table_name,
  COUNT(*) as accessible_rows
FROM public.events
UNION ALL
SELECT 
  'event_planning_requests' as table_name,
  COUNT(*) as accessible_rows
FROM public.event_planning_requests
UNION ALL
SELECT 
  'consultation_calls' as table_name,
  COUNT(*) as accessible_rows
FROM public.consultation_calls;
