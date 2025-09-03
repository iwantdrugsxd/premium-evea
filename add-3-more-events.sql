-- Add 3 More Events with Comprehensive Services and Packages
-- This script adds 3 new Indian event types to the existing system

-- Step 1: Add 3 new events with comprehensive services
INSERT INTO events (name, description, icon, features, avg_budget, duration, team_size, service_categories) VALUES
('Graduation Ceremony', 'Celebrate academic achievements with traditional Indian hospitality', '🎓', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,50,000 - ₹4,00,000', '4-6 hours', '6-10 people', ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Entertainment & Music',
  'Venues & Locations',
  'Catering & Food Services',
  'Photography & Videography',
  'Event Planning & Coordination',
  'Transportation & Logistics',
  'Graduation Attire & Accessories',
  'Academic Ceremony Setup',
  'Guest Management & Seating',
  'Memorabilia & Souvenirs'
]),

('Baby Shower', 'Traditional Indian baby shower celebration with blessings', '👶', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹80,000 - ₹2,00,000', '3-4 hours', '4-6 people', ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Traditional Music & Entertainment',
  'Venues & Locations',
  'Catering & Food Services',
  'Photography & Videography',
  'Event Planning & Coordination',
  'Traditional Rituals & Ceremonies',
  'Baby Shower Games & Activities',
  'Gift Management & Display',
  'Guest Accommodation & Travel',
  'Traditional Attire & Costumes'
]),

('Engagement Ceremony', 'Traditional Indian engagement celebration with cultural elements', '💍', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹2,00,000 - ₹6,00,000', '5-6 hours', '8-12 people', ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Traditional Music & Dance',
  'Venues & Locations',
  'Catering & Food Services',
  'Photography & Videography',
  'Event Planning & Coordination',
  'Transportation & Logistics',
  'Traditional Engagement Rituals',
  'Bridal & Groom Services',
  'Guest Accommodation & Travel',
  'Cultural Performances & Artists',
  'Traditional Attire & Jewelry',
  'Engagement Ring & Gift Setup'
]);

-- Step 2: Create packages for the new events
DO $$
DECLARE
    event_record RECORD;
    event_id INTEGER;
BEGIN
    -- Loop through the 3 new events and create packages for each
    FOR event_record IN SELECT id, name FROM events WHERE name IN ('Graduation Ceremony', 'Baby Shower', 'Engagement Ceremony') LOOP
        event_id := event_record.id;
        
        -- Create 3 packages for each new event
        IF event_record.name = 'Graduation Ceremony' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Graduation Package', 'Essential graduation celebration with core services', '₹1,50,000 - ₹2,00,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Assistance', 'Basic Catering', 'Simple Photography', 'Graduation Setup'], ARRAY[1, 2, 3, 4, 5, 6, 7]),
            (event_id, 'Standard Graduation Package', 'Complete graduation celebration with premium services', '₹2,50,000 - ₹3,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Event Coordination', 'Graduation Ceremony Setup'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Graduation Package', 'Luxury graduation celebration with all amenities', '₹3,50,000 - ₹4,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Professional Photography & Videography', 'Event Planner', 'Full Graduation Setup', 'Guest Management', 'Memorabilia Services'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Baby Shower' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Baby Shower Package', 'Essential baby shower with traditional elements', '₹80,000 - ₹1,20,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Assistance', 'Basic Catering', 'Simple Photography', 'Traditional Setup'], ARRAY[1, 2, 3, 4, 5, 6, 7]),
            (event_id, 'Standard Baby Shower Package', 'Complete baby shower with premium services', '₹1,40,000 - ₹1,70,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Traditional Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Event Coordination', 'Traditional Rituals'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Baby Shower Package', 'Luxury baby shower with all traditional services', '₹1,80,000 - ₹2,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Traditional Performances', 'Luxury Venue', 'Premium Catering', 'Professional Photography & Videography', 'Event Planner', 'Complete Traditional Setup', 'Guest Management', 'Gift Services'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Engagement Ceremony' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Engagement Package', 'Essential engagement celebration with traditional services', '₹2,00,000 - ₹3,00,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Assistance', 'Basic Catering', 'Simple Photography', 'Engagement Setup'], ARRAY[1, 2, 3, 4, 5, 6, 7]),
            (event_id, 'Standard Engagement Package', 'Complete engagement celebration with premium services', '₹3,50,000 - ₹4,50,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Traditional Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Event Coordination', 'Traditional Rituals'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Engagement Package', 'Luxury engagement celebration with all amenities', '₹5,00,000 - ₹6,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Traditional Performances', 'Luxury Venue', 'Premium Catering', 'Professional Photography & Videography', 'Event Planner', 'Complete Traditional Setup', 'Guest Management', 'Cultural Services', 'Attire & Jewelry'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        END IF;
        
        RAISE NOTICE 'Created 3 packages for event: % (ID: %)', event_record.name, event_id;
    END LOOP;
END $$;

-- Step 3: Verify the new events and packages
SELECT 'New Events Added:' as info;
SELECT 
  name,
  array_length(service_categories, 1) as service_count,
  service_categories
FROM events
WHERE name IN ('Graduation Ceremony', 'Baby Shower', 'Engagement Ceremony')
ORDER BY name;

SELECT 'New Packages Created:' as info;
SELECT 
  e.name as event_name,
  COUNT(ep.id) as package_count
FROM events e
LEFT JOIN event_packages ep ON e.id = ep.event_id
WHERE e.name IN ('Graduation Ceremony', 'Baby Shower', 'Engagement Ceremony')
GROUP BY e.name, e.service_categories
ORDER BY e.name;

-- Step 4: Show total count after adding new events
SELECT 'Total Events Summary:' as info;
SELECT 
  COUNT(*) as total_events,
  SUM(array_length(service_categories, 1)) as total_services,
  ROUND(AVG(array_length(service_categories, 1)), 1) as avg_services_per_event
FROM events;
