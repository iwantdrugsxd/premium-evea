-- Cleanup Duplicate Events and Fix Packages
-- This script will remove duplicate events and ensure each event type has exactly 3 packages

-- Step 1: Show current state
SELECT 'Current Events:' as info;
SELECT id, name, service_categories FROM events ORDER BY name;

SELECT 'Current Packages:' as info;
SELECT 
  e.name as event_name,
  COUNT(ep.id) as package_count
FROM events e
LEFT JOIN event_packages ep ON e.id = ep.event_id
GROUP BY e.name
ORDER BY e.name;

-- Step 2: Remove duplicate events (keep the one with more service categories)
DELETE FROM event_packages WHERE event_id IN (
  SELECT id FROM events 
  WHERE name = 'Wedding' 
  AND id NOT IN (
    SELECT MIN(id) FROM events WHERE name = 'Wedding'
  )
);

DELETE FROM events 
WHERE name = 'Wedding' 
AND id NOT IN (
  SELECT MIN(id) FROM events WHERE name = 'Wedding'
);

-- Step 3: Clear all packages to start fresh
DELETE FROM event_packages;

-- Step 4: Create exactly 3 packages for each unique event
DO $$
DECLARE
    event_record RECORD;
    event_id INTEGER;
BEGIN
    -- Loop through all remaining events and create exactly 3 packages for each
    FOR event_record IN SELECT id, name, service_categories FROM events ORDER BY name LOOP
        event_id := event_record.id;
        
        -- Create exactly 3 packages for each event
        IF event_record.name = 'Birthday Party' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Birthday Package', 'Simple birthday celebration with essential services', '₹25,000 - ₹40,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Assistance', 'Birthday Cake'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Birthday Package', 'Complete birthday celebration with premium services', '₹50,000 - ₹80,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Premium Birthday Package', 'Luxury birthday celebration with all amenities', '₹1,00,000 - ₹1,50,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Photography & Videography'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
            
        ELSIF event_record.name = 'Wedding' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Wedding Package', 'Essential wedding services for intimate celebration', '₹5,00,000 - ₹8,00,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Setup', 'Basic Catering', 'Simple Photography', 'Basic Transportation'], ARRAY[1, 2, 3, 4, 5, 6, 7]),
            (event_id, 'Standard Wedding Package', 'Complete wedding celebration with traditional services', '₹10,00,000 - ₹15,00,000', ARRAY['Premium Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Luxury Transportation', 'Wedding Coordinator'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Wedding Package', 'Luxury wedding experience with all traditional ceremonies', '₹18,00,000 - ₹25,00,000', ARRAY['Luxury Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Cinematic Photography & Videography', 'Luxury Transportation', 'Wedding Planner', 'Traditional Ceremonies'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9]);
            
        ELSIF event_record.name = 'Corporate Event' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Corporate Package', 'Essential corporate event services', '₹1,00,000 - ₹1,50,000', ARRAY['Basic Venue Setup', 'Simple Audio-Visual', 'Basic Catering', 'Basic Lighting'], ARRAY[1, 2, 3, 4]),
            (event_id, 'Standard Corporate Package', 'Professional corporate event experience', '₹2,00,000 - ₹3,50,000', ARRAY['Premium Venue', 'Professional Audio-Visual', 'Full Catering', 'Professional Lighting & Sound', 'Event Coordination'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Premium Corporate Package', 'Executive corporate event with premium services', '₹5,00,000 - ₹10,00,000', ARRAY['Luxury Venue', 'Advanced Audio-Visual', 'Premium Catering', 'Advanced Lighting & Sound', 'Event Management', 'Professional Staff'], ARRAY[1, 2, 3, 4, 5, 6]);
            
        ELSIF event_record.name = 'Custom Event' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Custom Package', 'Simple custom event setup', '₹50,000 - ₹80,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Assistance', 'Basic Catering'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Custom Package', 'Complete custom event experience', '₹1,00,000 - ₹1,80,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Premium Custom Package', 'Luxury custom event with all amenities', '₹2,00,000 - ₹3,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Photography & Videography'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
            
        ELSIF event_record.name = 'Anniversary' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Anniversary Package', 'Simple anniversary celebration', '₹20,000 - ₹35,000', ARRAY['Basic Decoration', 'Simple Entertainment'], ARRAY[1, 2]),
            (event_id, 'Standard Anniversary Package', 'Complete anniversary celebration', '₹40,000 - ₹70,000', ARRAY['Premium Decoration', 'Live Entertainment', 'Catering Services'], ARRAY[1, 2, 3]),
            (event_id, 'Premium Anniversary Package', 'Luxury anniversary celebration', '₹80,000 - ₹1,20,000', ARRAY['Luxury Decoration', 'Premium Entertainment', 'Full Catering', 'Event Coordinator'], ARRAY[1, 2, 3, 4]);
            
        ELSIF event_record.name = 'Festival/Concert' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Festival Package', 'Simple festival celebration setup', '₹2,00,000 - ₹3,00,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Basic Venue'], ARRAY[1, 2, 3, 4]),
            (event_id, 'Standard Festival Package', 'Complete festival celebration experience', '₹4,00,000 - ₹6,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Premium Festival Package', 'Luxury festival celebration with all amenities', '₹8,00,000 - ₹12,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Professional Staff'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
            
        ELSE
            -- Default packages for any other event types
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Package', 'Essential event services', '₹50,000 - ₹1,00,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Assistance'], ARRAY[1, 2, 3, 4]),
            (event_id, 'Standard Package', 'Complete event experience', '₹1,00,000 - ₹2,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Entertainment', 'Premium Venue', 'Event Coordination'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Premium Package', 'Luxury event with all amenities', '₹2,00,000 - ₹4,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Event Planner', 'Professional Staff'], ARRAY[1, 2, 3, 4, 5, 6]);
        END IF;
        
        RAISE NOTICE 'Created exactly 3 packages for event: % (ID: %)', event_record.name, event_id;
    END LOOP;
END $$;

-- Step 5: Verify the cleanup and package creation
SELECT 'Final Events (No Duplicates):' as info;
SELECT id, name, service_categories FROM events ORDER BY name;

SELECT 'Final Package Count per Event:' as info;
SELECT 
  e.name as event_name,
  COUNT(ep.id) as package_count
FROM events e
LEFT JOIN event_packages ep ON e.id = ep.event_id
GROUP BY e.name
ORDER BY e.name;

SELECT 'All Packages Created:' as info;
SELECT 
  e.name as event_name,
  ep.name as package_name,
  ep.price
FROM events e
JOIN event_packages ep ON e.id = ep.event_id
ORDER BY e.name, ep.name;
