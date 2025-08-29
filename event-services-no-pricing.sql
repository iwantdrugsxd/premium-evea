-- Event Services Without Pricing
-- Run this in your Supabase SQL editor

-- 1. Drop and recreate the event_services table with simpler structure
DROP TABLE IF EXISTS public.event_services;

CREATE TABLE public.event_services (
  id SERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  service_name VARCHAR NOT NULL,
  service_description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  is_required BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Insert event services for each event type (based on JustDial categories)

-- Wedding Services
INSERT INTO public.event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(1, 'Wedding Photography', 'Professional photography covering ceremony and reception', 'Photography', true, true),
(1, 'Wedding Videography', 'Cinematic wedding video with highlights', 'Videography', false, true),
(1, 'Wedding Catering', 'Multi-course meal for all guests', 'Catering', true, true),
(1, 'Wedding Decoration', 'Complete venue decoration with flowers', 'Decoration', true, true),
(1, 'Wedding Music', 'Live band or DJ for ceremony and reception', 'Entertainment', false, true),
(1, 'Wedding Transportation', 'Luxury cars for bride, groom, and family', 'Transportation', false, false),
(1, 'Wedding Makeup', 'Professional makeup for bride and family', 'Beauty & Makeup', false, true),
(1, 'Wedding Invitations', 'Design and printing of wedding cards', 'Stationery', false, false),
(1, 'Wedding Venue', 'Wedding hall or outdoor venue booking', 'Venue', true, true),
(1, 'Wedding Planning', 'Complete wedding coordination and planning', 'Event Management', true, true);

-- Corporate Event Services
INSERT INTO public.event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(2, 'Corporate Photography', 'Professional event photography', 'Photography', true, true),
(2, 'Corporate Catering', 'Business lunch or dinner service', 'Catering', true, true),
(2, 'Corporate Decoration', 'Professional venue setup', 'Decoration', false, true),
(2, 'Audio Visual Setup', 'Sound system, projector, and lighting', 'Technology', true, true),
(2, 'Corporate Gifts', 'Custom branded gifts for attendees', 'Gifts & Souvenirs', false, false),
(2, 'Event Management', 'Complete event coordination', 'Event Management', true, true),
(2, 'Corporate Venue', 'Conference hall or meeting space', 'Venue', true, true),
(2, 'Corporate Transportation', 'Transport for attendees', 'Transportation', false, false),
(2, 'Corporate Branding', 'Branded materials and signage', 'Branding', false, true);

-- Birthday Party Services
INSERT INTO public.event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(3, 'Birthday Photography', 'Fun and candid photography', 'Photography', false, true),
(3, 'Birthday Catering', 'Delicious food and beverages', 'Catering', true, true),
(3, 'Birthday Decoration', 'Colorful balloons and theme decoration', 'Decoration', true, true),
(3, 'Birthday Cake', 'Custom designed birthday cake', 'Food & Beverages', true, true),
(3, 'Birthday Entertainment', 'DJ, games, and activities', 'Entertainment', false, true),
(3, 'Birthday Favors', 'Party favors for all guests', 'Gifts & Souvenirs', false, false),
(3, 'Birthday Venue', 'Party hall or outdoor venue', 'Venue', true, true),
(3, 'Birthday Planning', 'Complete party coordination', 'Event Management', true, true),
(3, 'Birthday Transportation', 'Transport for guests', 'Transportation', false, false);

-- Anniversary Services
INSERT INTO public.event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(4, 'Anniversary Photography', 'Romantic couple photography', 'Photography', true, true),
(4, 'Anniversary Catering', 'Elegant dining experience', 'Catering', true, true),
(4, 'Anniversary Decoration', 'Romantic and elegant setup', 'Decoration', true, true),
(4, 'Anniversary Cake', 'Special anniversary cake', 'Food & Beverages', true, true),
(4, 'Anniversary Music', 'Live romantic music', 'Entertainment', false, true),
(4, 'Anniversary Gifts', 'Personalized anniversary gifts', 'Gifts & Souvenirs', false, false),
(4, 'Anniversary Venue', 'Romantic venue or restaurant', 'Venue', true, true),
(4, 'Anniversary Planning', 'Complete anniversary coordination', 'Event Management', true, true),
(4, 'Anniversary Transportation', 'Luxury transport for couple', 'Transportation', false, false);

-- Conference Services
INSERT INTO public.event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(5, 'Conference Photography', 'Professional event documentation', 'Photography', true, true),
(5, 'Conference Catering', 'Professional catering service', 'Catering', true, true),
(5, 'Conference Setup', 'Professional venue arrangement', 'Decoration', true, true),
(5, 'Audio Visual Equipment', 'Complete AV setup for presentations', 'Technology', true, true),
(5, 'Conference Materials', 'Printed materials and handouts', 'Stationery', false, false),
(5, 'Conference Management', 'Full event coordination', 'Event Management', true, true),
(5, 'Conference Venue', 'Large conference hall or auditorium', 'Venue', true, true),
(5, 'Conference Transportation', 'Transport for speakers and attendees', 'Transportation', false, false),
(5, 'Conference Branding', 'Conference branding and signage', 'Branding', false, true);

-- Seminar Services
INSERT INTO public.event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(6, 'Seminar Photography', 'Event documentation and coverage', 'Photography', false, true),
(6, 'Seminar Catering', 'Refreshments and snacks', 'Catering', false, true),
(6, 'Seminar Setup', 'Professional seating and setup', 'Decoration', true, true),
(6, 'Presentation Equipment', 'Projector, sound system, and lighting', 'Technology', true, true),
(6, 'Seminar Materials', 'Printed materials and certificates', 'Stationery', false, false),
(6, 'Seminar Coordination', 'Event management and coordination', 'Event Management', true, true),
(6, 'Seminar Venue', 'Seminar hall or training room', 'Venue', true, true),
(6, 'Seminar Transportation', 'Transport for participants', 'Transportation', false, false),
(6, 'Seminar Branding', 'Seminar branding materials', 'Branding', false, false);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_services_event_id ON public.event_services(event_id);
CREATE INDEX IF NOT EXISTS idx_event_services_category ON public.event_services(category);
CREATE INDEX IF NOT EXISTS idx_event_services_is_popular ON public.event_services(is_popular);

-- 4. Verify the data
SELECT 'Event Services Verification:' as info;
SELECT 
  e.name as event_name,
  COUNT(es.id) as service_count,
  STRING_AGG(DISTINCT es.category, ', ') as categories
FROM public.events e
LEFT JOIN public.event_services es ON e.id = es.event_id
GROUP BY e.id, e.name
ORDER BY e.id;

-- 5. Show services by category for each event
SELECT 'Services by Event and Category:' as info;
SELECT 
  e.name as event_name,
  es.category,
  COUNT(es.id) as services_in_category,
  STRING_AGG(es.service_name, ', ') as service_names
FROM public.events e
JOIN public.event_services es ON e.id = es.event_id
GROUP BY e.id, e.name, es.category
ORDER BY e.id, es.category;
