-- Fix user_id constraint to allow NULL values for testing
-- Run this in your Supabase SQL editor

-- First, drop the existing foreign key constraint
ALTER TABLE public.event_planning_requests 
DROP CONSTRAINT IF EXISTS event_planning_requests_user_id_fkey;

-- Add the constraint back but allow NULL values
ALTER TABLE public.event_planning_requests 
ADD CONSTRAINT event_planning_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- Make the user_id column nullable
ALTER TABLE public.event_planning_requests 
ALTER COLUMN user_id DROP NOT NULL;
