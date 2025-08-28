-- Fix Package Selection Issues
-- Run this in your Supabase SQL editor

-- 1. First, let's check if we have the required tables and data
-- Check if events table has data
SELECT 'Events count:' as info, COUNT(*) as count FROM public.events;

-- Check if event_packages table has data
SELECT 'Event packages count:' as info, COUNT(*) as count FROM public.event_packages;

-- Check if admin_settings table has data
SELECT 'Admin settings count:' as info, COUNT(*) as count FROM public.admin_settings;

-- 2. If events table is empty, add sample events
INSERT INTO public.events (name, description, icon, features, avg_budget, duration, team_size) 
SELECT * FROM (VALUES
  ('Wedding', 'Complete wedding planning and coordination with premium services', 'heart', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹50,000 - ₹5,00,000', '6-12 months', '5-15 members'),
  ('Corporate Event', 'Professional corporate events with tech setup and streaming', 'building', ARRAY['Tech Setup', 'Streaming', 'Catering'], '₹75,000 - ₹10,00,000', '2-6 months', '3-10 members'),
  ('Birthday Party', 'Fun and memorable birthday celebrations for all ages', 'cake', ARRAY['Themes', 'Entertainment', 'Decor'], '₹25,000 - ₹2,00,000', '1-3 months', '3-8 members'),
  ('Anniversary', 'Romantic anniversary celebrations with intimate settings', 'gift', ARRAY['Intimate', 'Romantic', 'Memorable'], '₹35,000 - ₹3,00,000', '2-4 months', '3-6 members'),
  ('Festival/Concert', 'Large-scale events with professional production', 'music', ARRAY['Stage Setup', 'Sound', 'Security'], '₹1,00,000 - ₹50,00,000', '3-8 months', '10-50 members'),
  ('Custom Event', 'Unique celebrations designed for your vision', 'zap', ARRAY['Flexible', 'Creative', 'Unique'], '₹40,000 - ₹10,00,000', '1-6 months', '5-20 members')
) AS v(name, description, icon, features, avg_budget, duration, team_size)
WHERE NOT EXISTS (SELECT 1 FROM public.events);

-- 3. If event_packages table is empty, add sample packages
INSERT INTO public.event_packages (event_id, name, description, price, features, service_ids) 
SELECT * FROM (VALUES
  (1, 'Basic Wedding', 'Essential wedding planning services', '₹50,000 - ₹1,50,000', ARRAY['Event Planning Consultation', 'Vendor Coordination', 'Basic Decoration Setup', 'Event Day Management', '5 EVEA Team Members', 'Basic Photography'], ARRAY[1, 2, 3]),
  (1, 'Professional Wedding', 'Comprehensive wedding planning with premium services', '₹1,50,000 - ₹5,00,000', ARRAY['Everything in Basic', 'Premium Vendor Selection', 'Custom Theme Design', 'Advanced Decoration', 'Professional Photography & Video', 'Entertainment Coordination', 'Guest Management System', 'Post-Event Support'], ARRAY[1, 2, 3, 4, 5]),
  (1, 'Premium Wedding', 'Luxury wedding planning with exclusive services', '₹5,00,000 - ₹20,00,000', ARRAY['Everything in Professional', 'Luxury Venue Selection', 'Celebrity Chef Catering', 'Live Entertainment', 'Instagram Story Creation', 'Social Media Management', 'VIP Guest Services', 'Luxury Transportation', 'Premium Photography Package', 'Event Video Documentary'], ARRAY[1, 2, 3, 4, 5, 6]),
  (2, 'Basic Corporate', 'Essential corporate event services', '₹75,000 - ₹2,00,000', ARRAY['Event Planning Consultation', 'Tech Setup Coordination', 'Basic Catering', 'Event Day Management', '3 EVEA Team Members', 'Basic Documentation'], ARRAY[7, 8, 9]),
  (2, 'Professional Corporate', 'Advanced corporate event planning', '₹2,00,000 - ₹5,00,000', ARRAY['Everything in Basic', 'Advanced Tech Setup', 'Premium Catering', 'Professional Documentation', 'Live Streaming', 'Guest Management', 'Post-Event Support'], ARRAY[7, 8, 9, 10, 11]),
  (2, 'Premium Corporate', 'Luxury corporate event planning', '₹5,00,000 - ₹15,00,000', ARRAY['Everything in Professional', 'Luxury Venue', 'Celebrity Speakers', 'Advanced Tech Integration', 'VIP Services', 'Comprehensive Documentation'], ARRAY[7, 8, 9, 10, 11, 12]),
  (3, 'Basic Birthday', 'Fun birthday party planning', '₹25,000 - ₹75,000', ARRAY['Theme Planning', 'Basic Decoration', 'Catering Coordination', 'Entertainment Setup', '3 EVEA Team Members'], ARRAY[13, 14, 15]),
  (3, 'Professional Birthday', 'Premium birthday celebration', '₹75,000 - ₹1,50,000', ARRAY['Everything in Basic', 'Custom Theme Design', 'Advanced Decoration', 'Professional Entertainment', 'Photography', 'Guest Management'], ARRAY[13, 14, 15, 16, 17]),
  (3, 'Premium Birthday', 'Luxury birthday celebration', '₹1,50,000 - ₹3,00,000', ARRAY['Everything in Professional', 'Luxury Venue', 'Celebrity Entertainment', 'Premium Catering', 'Social Media Coverage', 'VIP Services'], ARRAY[13, 14, 15, 16, 17, 18]),
  (4, 'Basic Anniversary', 'Romantic anniversary planning', '₹35,000 - ₹1,00,000', ARRAY['Romantic Planning', 'Intimate Decoration', 'Catering Coordination', 'Music Setup', '3 EVEA Team Members'], ARRAY[19, 20, 21]),
  (4, 'Professional Anniversary', 'Premium anniversary celebration', '₹1,00,000 - ₹2,00,000', ARRAY['Everything in Basic', 'Custom Romantic Theme', 'Premium Decoration', 'Live Music', 'Professional Photography', 'Guest Management'], ARRAY[19, 20, 21, 22, 23]),
  (4, 'Premium Anniversary', 'Luxury anniversary celebration', '₹2,00,000 - ₹5,00,000', ARRAY['Everything in Professional', 'Luxury Venue', 'Celebrity Entertainment', 'Premium Catering', 'Social Media Coverage', 'VIP Services'], ARRAY[19, 20, 21, 22, 23, 24]),
  (5, 'Basic Festival', 'Essential festival planning', '₹1,00,000 - ₹3,00,000', ARRAY['Event Planning', 'Stage Setup', 'Basic Sound System', 'Security Coordination', '10 EVEA Team Members'], ARRAY[25, 26, 27]),
  (5, 'Professional Festival', 'Advanced festival planning', '₹3,00,000 - ₹8,00,000', ARRAY['Everything in Basic', 'Advanced Stage Setup', 'Professional Sound System', 'Enhanced Security', 'Live Streaming', 'Vendor Management'], ARRAY[25, 26, 27, 28, 29]),
  (5, 'Premium Festival', 'Luxury festival planning', '₹8,00,000 - ₹20,00,000', ARRAY['Everything in Professional', 'Luxury Stage Design', 'Premium Sound System', 'Celebrity Performers', 'Comprehensive Security', 'VIP Services'], ARRAY[25, 26, 27, 28, 29, 30]),
  (6, 'Basic Custom', 'Flexible custom event planning', '₹40,000 - ₹1,20,000', ARRAY['Custom Planning', 'Flexible Coordination', 'Basic Setup', 'Event Management', '5 EVEA Team Members'], ARRAY[31, 32, 33]),
  (6, 'Professional Custom', 'Advanced custom event planning', '₹1,20,000 - ₹3,00,000', ARRAY['Everything in Basic', 'Advanced Custom Design', 'Premium Coordination', 'Professional Services', 'Comprehensive Management'], ARRAY[31, 32, 33, 34, 35]),
  (6, 'Premium Custom', 'Luxury custom event planning', '₹3,00,000 - ₹10,00,000', ARRAY['Everything in Professional', 'Luxury Custom Design', 'Premium Services', 'Celebrity Integration', 'VIP Experience', 'Exclusive Features'], ARRAY[31, 32, 33, 34, 35, 36])
) AS v(event_id, name, description, price, features, service_ids)
WHERE NOT EXISTS (SELECT 1 FROM public.event_packages);

-- 4. If admin_settings table is empty, add admin settings
INSERT INTO public.admin_settings (admin_whatsapp, admin_email, admin_name) 
SELECT * FROM (VALUES
  ('+919876543210', 'admin@evea.com', 'EVEA Admin')
) AS v(admin_whatsapp, admin_email, admin_name)
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings);

-- 5. Ensure the event_planning_requests table allows NULL user_id
ALTER TABLE public.event_planning_requests 
ALTER COLUMN user_id DROP NOT NULL;

-- 6. Drop and recreate the user_id foreign key constraint to allow NULL
ALTER TABLE public.event_planning_requests 
DROP CONSTRAINT IF EXISTS event_planning_requests_user_id_fkey;

ALTER TABLE public.event_planning_requests 
ADD CONSTRAINT event_planning_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- 7. Verify the data
SELECT 'Final verification:' as info;
SELECT 'Events:' as table_name, COUNT(*) as count FROM public.events
UNION ALL
SELECT 'Event Packages:' as table_name, COUNT(*) as count FROM public.event_packages
UNION ALL
SELECT 'Admin Settings:' as table_name, COUNT(*) as count FROM public.admin_settings;

-- 8. Show sample data for verification
SELECT 'Sample events:' as info;
SELECT id, name, description FROM public.events LIMIT 3;

SELECT 'Sample packages:' as info;
SELECT id, event_id, name, price FROM public.event_packages LIMIT 3;
