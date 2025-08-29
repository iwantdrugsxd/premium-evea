-- Fix Event Services Table Structure
-- Run this in your Supabase SQL editor

-- 1. First, let's see the current table structure
SELECT 'Current table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'event_services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add is_required column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_services' 
        AND column_name = 'is_required'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.event_services ADD COLUMN is_required BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_required column';
    ELSE
        RAISE NOTICE 'is_required column already exists';
    END IF;

    -- Add is_popular column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_services' 
        AND column_name = 'is_popular'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.event_services ADD COLUMN is_popular BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_popular column';
    ELSE
        RAISE NOTICE 'is_popular column already exists';
    END IF;
END $$;

-- 3. Verify the updated table structure
SELECT 'Updated table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'event_services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Clear existing data to avoid conflicts
DELETE FROM public.event_services;

-- 5. Now insert the services with the correct structure
-- Wedding Services
INSERT INTO public.event_services (event_id, name, description, price, price_label, category, is_required, is_popular) VALUES
(1, 'Wedding Photography', 'Professional photography covering ceremony and reception', '₹25,000 - ₹50,000', 'Starting from ₹25,000', 'Photography', true, true),
(1, 'Wedding Videography', 'Cinematic wedding video with highlights', '₹35,000 - ₹75,000', 'Starting from ₹35,000', 'Videography', false, true),
(1, 'Wedding Catering', 'Multi-course meal for all guests', '₹500 - ₹1,200', 'Per person', 'Catering', true, true),
(1, 'Wedding Decoration', 'Complete venue decoration with flowers', '₹50,000 - ₹1,50,000', 'Starting from ₹50,000', 'Decoration', true, true),
(1, 'Wedding Music', 'Live band or DJ for ceremony and reception', '₹15,000 - ₹40,000', 'Starting from ₹15,000', 'Entertainment', false, true),
(1, 'Wedding Transportation', 'Luxury cars for bride, groom, and family', '₹20,000 - ₹50,000', 'Starting from ₹20,000', 'Transportation', false, false),
(1, 'Wedding Makeup', 'Professional makeup for bride and family', '₹15,000 - ₹35,000', 'Starting from ₹15,000', 'Beauty', false, true),
(1, 'Wedding Invitations', 'Design and printing of wedding cards', '₹5,000 - ₹15,000', 'Starting from ₹5,000', 'Stationery', false, false);

-- Corporate Event Services
INSERT INTO public.event_services (event_id, name, description, price, price_label, category, is_required, is_popular) VALUES
(2, 'Corporate Photography', 'Professional event photography', '₹15,000 - ₹30,000', 'Starting from ₹15,000', 'Photography', true, true),
(2, 'Corporate Catering', 'Business lunch or dinner service', '₹300 - ₹800', 'Per person', 'Catering', true, true),
(2, 'Corporate Decoration', 'Professional venue setup', '₹25,000 - ₹75,000', 'Starting from ₹25,000', 'Decoration', false, true),
(2, 'Audio Visual Setup', 'Sound system, projector, and lighting', '₹20,000 - ₹50,000', 'Starting from ₹20,000', 'Technology', true, true),
(2, 'Corporate Gifts', 'Custom branded gifts for attendees', '₹500 - ₹2,000', 'Per person', 'Gifts', false, false),
(2, 'Event Management', 'Complete event coordination', '₹50,000 - ₹1,00,000', 'Starting from ₹50,000', 'Management', true, true);

-- Birthday Party Services
INSERT INTO public.event_services (event_id, name, description, price, price_label, category, is_required, is_popular) VALUES
(3, 'Birthday Photography', 'Fun and candid photography', '₹8,000 - ₹20,000', 'Starting from ₹8,000', 'Photography', false, true),
(3, 'Birthday Catering', 'Delicious food and beverages', '₹200 - ₹600', 'Per person', 'Catering', true, true),
(3, 'Birthday Decoration', 'Colorful balloons and theme decoration', '₹15,000 - ₹40,000', 'Starting from ₹15,000', 'Decoration', true, true),
(3, 'Birthday Cake', 'Custom designed birthday cake', '₹2,000 - ₹8,000', 'Starting from ₹2,000', 'Food', true, true),
(3, 'Birthday Entertainment', 'DJ, games, and activities', '₹10,000 - ₹25,000', 'Starting from ₹10,000', 'Entertainment', false, true),
(3, 'Birthday Favors', 'Party favors for all guests', '₹100 - ₹300', 'Per person', 'Gifts', false, false);

-- Anniversary Services
INSERT INTO public.event_services (event_id, name, description, price, price_label, category, is_required, is_popular) VALUES
(4, 'Anniversary Photography', 'Romantic couple photography', '₹12,000 - ₹25,000', 'Starting from ₹12,000', 'Photography', true, true),
(4, 'Anniversary Catering', 'Elegant dining experience', '₹400 - ₹1,000', 'Per person', 'Catering', true, true),
(4, 'Anniversary Decoration', 'Romantic and elegant setup', '₹20,000 - ₹60,000', 'Starting from ₹20,000', 'Decoration', true, true),
(4, 'Anniversary Cake', 'Special anniversary cake', '₹3,000 - ₹10,000', 'Starting from ₹3,000', 'Food', true, true),
(4, 'Anniversary Music', 'Live romantic music', '₹12,000 - ₹30,000', 'Starting from ₹12,000', 'Entertainment', false, true),
(4, 'Anniversary Gifts', 'Personalized anniversary gifts', '₹1,000 - ₹5,000', 'Per couple', 'Gifts', false, false);

-- Conference Services
INSERT INTO public.event_services (event_id, name, description, price, price_label, category, is_required, is_popular) VALUES
(5, 'Conference Photography', 'Professional event documentation', '₹20,000 - ₹40,000', 'Starting from ₹20,000', 'Photography', true, true),
(5, 'Conference Catering', 'Professional catering service', '₹400 - ₹1,200', 'Per person', 'Catering', true, true),
(5, 'Conference Setup', 'Professional venue arrangement', '₹30,000 - ₹80,000', 'Starting from ₹30,000', 'Decoration', true, true),
(5, 'Audio Visual Equipment', 'Complete AV setup for presentations', '₹25,000 - ₹60,000', 'Starting from ₹25,000', 'Technology', true, true),
(5, 'Conference Materials', 'Printed materials and handouts', '₹5,000 - ₹15,000', 'Starting from ₹5,000', 'Stationery', false, false),
(5, 'Conference Management', 'Full event coordination', '₹75,000 - ₹1,50,000', 'Starting from ₹75,000', 'Management', true, true);

-- Seminar Services
INSERT INTO public.event_services (event_id, name, description, price, price_label, category, is_required, is_popular) VALUES
(6, 'Seminar Photography', 'Event documentation and coverage', '₹12,000 - ₹25,000', 'Starting from ₹12,000', 'Photography', false, true),
(6, 'Seminar Catering', 'Refreshments and snacks', '₹200 - ₹500', 'Per person', 'Catering', false, true),
(6, 'Seminar Setup', 'Professional seating and setup', '₹15,000 - ₹40,000', 'Starting from ₹15,000', 'Decoration', true, true),
(6, 'Presentation Equipment', 'Projector, sound system, and lighting', '₹15,000 - ₹35,000', 'Starting from ₹15,000', 'Technology', true, true),
(6, 'Seminar Materials', 'Printed materials and certificates', '₹3,000 - ₹10,000', 'Starting from ₹3,000', 'Stationery', false, false),
(6, 'Seminar Coordination', 'Event management and coordination', '₹40,000 - ₹80,000', 'Starting from ₹40,000', 'Management', true, true);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_services_event_id ON public.event_services(event_id);
CREATE INDEX IF NOT EXISTS idx_event_services_category ON public.event_services(category);
CREATE INDEX IF NOT EXISTS idx_event_services_is_popular ON public.event_services(is_popular);

-- 7. Verify the data
SELECT 'Event Services Verification:' as info;
SELECT 
  e.name as event_name,
  COUNT(es.id) as service_count,
  STRING_AGG(es.category, ', ') as categories
FROM public.events e
LEFT JOIN public.event_services es ON e.id = es.event_id
GROUP BY e.id, e.name
ORDER BY e.id;

-- 8. Show sample services for each event
SELECT 'Sample services by event:' as info;
SELECT 
  e.name as event_name,
  es.name as service_name,
  es.category,
  es.price,
  es.is_required,
  es.is_popular
FROM public.events e
JOIN public.event_services es ON e.id = es.event_id
ORDER BY e.id, es.category, es.is_required DESC, es.is_popular DESC
LIMIT 20;
