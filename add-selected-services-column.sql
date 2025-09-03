-- Add selected_services column to event_planning_requests table
-- Run this in your Supabase SQL editor

-- Add selected_services column as JSONB to store array of service IDs
ALTER TABLE public.event_planning_requests 
ADD COLUMN IF NOT EXISTS selected_services JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN public.event_planning_requests.selected_services IS 'Array of selected service IDs from event_services table';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'event_planning_requests' 
AND column_name = 'selected_services'
AND table_schema = 'public';
