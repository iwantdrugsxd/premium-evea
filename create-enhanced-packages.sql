-- Create Enhanced Packages for All Events
-- Each event will have 3 packages: Basic, Standard, Premium
-- Tailored for Indian event market with comprehensive services

-- First, let's clear existing packages to avoid duplicates
DELETE FROM event_packages;

-- Helper function to get event ID safely and create packages
DO $$
DECLARE
    event_record RECORD;
    event_id INTEGER;
BEGIN
    -- Loop through all events and create packages for each
    FOR event_record IN SELECT id, name, service_categories FROM events ORDER BY name LOOP
        event_id := event_record.id;
        
        -- Create 3 packages for each event based on their name
        IF event_record.name = 'Birthday Party' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Birthday Package', 'Essential birthday celebration with core services', '₹25,000 - ₹40,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Assistance', 'Birthday Cake & Basic Catering', 'Simple Photography'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Standard Birthday Package', 'Complete birthday celebration with premium services', '₹50,000 - ₹80,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Event Coordination', 'Basic Transportation'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Birthday Package', 'Luxury birthday celebration with all amenities', '₹1,00,000 - ₹1,50,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Professional Photography & Videography', 'Event Planner', 'Full Transportation', 'Guest Management', 'Party Supplies'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Wedding' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Wedding Package', 'Essential wedding services for intimate celebration', '₹5,00,000 - ₹8,00,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Setup', 'Basic Catering', 'Simple Photography', 'Basic Transportation', 'Simple Mandap Setup'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Standard Wedding Package', 'Complete wedding celebration with traditional services', '₹10,00,000 - ₹15,00,000', ARRAY['Premium Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Luxury Transportation', 'Traditional Mandap Setup', 'Wedding Coordination', 'Bridal Services'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
            (event_id, 'Premium Wedding Package', 'Luxury wedding experience with all traditional ceremonies', '₹18,00,000 - ₹25,00,000', ARRAY['Luxury Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Cinematic Photography & Videography', 'Luxury Transportation', 'Luxury Mandap Setup', 'Wedding Planner', 'Traditional Ceremonies', 'Guest Accommodation', 'Full Bridal Services'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            
        ELSIF event_record.name = 'Corporate Event' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Corporate Package', 'Essential corporate event services', '₹1,00,000 - ₹1,50,000', ARRAY['Basic Venue Setup', 'Simple Audio-Visual', 'Basic Catering', 'Basic Lighting & Sound', 'Basic Event Coordination'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Corporate Package', 'Professional corporate event experience', '₹2,00,000 - ₹3,50,000', ARRAY['Premium Venue', 'Professional Audio-Visual', 'Full Catering', 'Professional Lighting & Sound', 'Event Coordination', 'Basic Branding', 'Guest Registration', 'Technical Support'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Corporate Package', 'Executive corporate event with premium services', '₹5,00,000 - ₹10,00,000', ARRAY['Luxury Venue', 'Advanced Audio-Visual', 'Premium Catering', 'Advanced Lighting & Sound', 'Event Management', 'Full Branding & Marketing', 'Advanced Guest Management', 'Premium Technical Support', 'Security Services', 'Transportation & Parking'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Custom Event' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Custom Package', 'Simple custom event setup', '₹50,000 - ₹80,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Venue Assistance', 'Basic Catering', 'Basic Photography'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Standard Custom Package', 'Complete custom event experience', '₹1,00,000 - ₹1,80,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination', 'Professional Photography', 'Basic Transportation', 'Guest Management'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9]),
            (event_id, 'Premium Custom Package', 'Luxury custom event with all amenities', '₹2,00,000 - ₹3,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Professional Photography & Videography', 'Full Transportation', 'Advanced Guest Management', 'Special Effects & Technology'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Anniversary' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Anniversary Package', 'Simple anniversary celebration', '₹20,000 - ₹35,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Basic Venue', 'Simple Catering'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Anniversary Package', 'Complete anniversary celebration', '₹40,000 - ₹70,000', ARRAY['Premium Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering', 'Professional Photography', 'Event Coordination', 'Basic Transportation'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Anniversary Package', 'Luxury anniversary celebration', '₹80,000 - ₹1,20,000', ARRAY['Luxury Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Premium Catering', 'Professional Photography & Videography', 'Event Planner', 'Full Transportation', 'Gift Management', 'Guest Accommodation'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Festival/Concert' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Festival Package', 'Simple festival celebration setup', '₹2,00,000 - ₹3,00,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Entertainment', 'Basic Venue', 'Basic Catering', 'Basic Security'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Standard Festival Package', 'Complete festival celebration experience', '₹4,00,000 - ₹6,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination', 'Security Services', 'Technical Support', 'Basic Transportation'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9]),
            (event_id, 'Premium Festival Package', 'Luxury festival celebration with all amenities', '₹8,00,000 - ₹12,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Premium Security', 'Advanced Technical Support', 'Full Transportation', 'Vendor Management', 'Guest Services', 'Emergency Services'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            
        ELSIF event_record.name = 'Navratri Celebration' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Navratri Package', 'Simple Navratri celebration setup', '₹2,00,000 - ₹3,00,000', ARRAY['Basic Decoration', 'Simple Lighting & Sound', 'Basic Traditional Music', 'Basic Venue', 'Basic Catering', 'Basic Cultural Setup'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Standard Navratri Package', 'Complete Navratri celebration experience', '₹4,00,000 - ₹6,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Traditional Music & Dance', 'Premium Venue', 'Full Catering', 'Event Coordination', 'Traditional Attire', 'Cultural Performances', 'Basic Accommodation'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9]),
            (event_id, 'Premium Navratri Package', 'Luxury Navratri celebration with all traditional elements', '₹6,00,000 - ₹8,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Traditional Music & Dance', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Traditional Attire & Costumes', 'Celebrity Cultural Performances', 'Full Guest Accommodation', 'Religious Ceremonies', 'Cultural Workshops'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Mandap & Stage Setup' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Mandap Package', 'Simple mandap setup with essential elements', '₹1,50,000 - ₹2,50,000', ARRAY['Basic Mandap Construction', 'Simple Decoration', 'Basic Lighting & Sound', 'Basic Stage Setup', 'Simple Floral Arrangements'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Mandap Package', 'Complete mandap setup with traditional elements', '₹3,00,000 - ₹4,50,000', ARRAY['Professional Mandap Construction', 'Premium Decoration', 'Professional Lighting & Sound', 'Professional Stage Setup', 'Premium Floral Arrangements', 'Traditional Decor', 'Event Coordination', 'Safety Support'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Mandap Package', 'Luxury mandap setup with all traditional elements', '₹5,00,000 - ₹6,00,000', ARRAY['Luxury Mandap Construction', 'Luxury Decoration', 'Advanced Lighting & Sound', 'Luxury Stage Setup', 'Premium Floral Arrangements', 'Traditional Decor & Props', 'Cultural Expert', 'Event Planner', 'Full Safety Support', 'Setup & Dismantling'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Cultural Festival' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Cultural Package', 'Simple cultural celebration setup', '₹1,00,000 - ₹1,50,000', ARRAY['Basic Decoration', 'Basic Lighting & Sound', 'Basic Traditional Entertainment', 'Basic Venue', 'Basic Catering', 'Basic Cultural Setup'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Standard Cultural Package', 'Complete cultural celebration experience', '₹2,00,000 - ₹3,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Traditional Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination', 'Traditional Attire', 'Cultural Performances', 'Basic Guest Services'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9]),
            (event_id, 'Premium Cultural Package', 'Luxury cultural celebration with traditional elements', '₹4,00,000 - ₹5,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Traditional Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Traditional Attire & Costumes', 'Celebrity Cultural Performances', 'Full Guest Services', 'Cultural Workshops & Activities'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Product Launch' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Product Launch Package', 'Essential product launch services', '₹2,00,000 - ₹2,50,000', ARRAY['Basic Venue Setup', 'Basic Audio-Visual', 'Basic Catering', 'Basic Event Coordination', 'Simple Branding'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Product Launch Package', 'Professional product launch experience', '₹3,00,000 - ₹4,00,000', ARRAY['Premium Venue', 'Professional Audio-Visual', 'Full Catering', 'Event Coordination', 'Professional Branding', 'Guest Registration', 'Technical Support', 'Basic Security'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Product Launch Package', 'Executive product launch with premium services', '₹4,50,000 - ₹5,00,000', ARRAY['Luxury Venue', 'Advanced Audio-Visual', 'Premium Catering', 'Event Management', 'Premium Branding & Marketing', 'Advanced Guest Management', 'Premium Technical Support', 'Full Security Services', 'Transportation & Parking', 'Media & Press Management'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSIF event_record.name = 'Team Building' THEN
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Team Building Package', 'Simple team building setup', '₹80,000 - ₹1,00,000', ARRAY['Basic Venue Setup', 'Basic Catering', 'Basic Team Activities', 'Basic Event Coordination', 'Basic Equipment'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Team Building Package', 'Complete team building experience', '₹1,20,000 - ₹1,35,000', ARRAY['Premium Venue', 'Full Catering', 'Professional Team Activities', 'Event Coordination', 'Professional Equipment', 'Basic Transportation', 'Facilitation Services', 'Basic Guest Services'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
            (event_id, 'Premium Team Building Package', 'Luxury team building with premium services', '₹1,40,000 - ₹1,50,000', ARRAY['Luxury Venue', 'Premium Catering', 'Premium Team Activities', 'Event Management', 'Premium Equipment', 'Full Transportation', 'Professional Facilitation', 'Full Guest Services', 'Safety & Emergency Services', 'Feedback & Assessment'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            
        ELSE
            -- Default packages for any other event types
            INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
            (event_id, 'Basic Package', 'Essential event services', '₹50,000 - ₹1,00,000', ARRAY['Basic Decoration', 'Basic Lighting & Sound', 'Basic Entertainment', 'Basic Venue', 'Basic Catering'], ARRAY[1, 2, 3, 4, 5]),
            (event_id, 'Standard Package', 'Complete event experience', '₹1,00,000 - ₹2,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Entertainment', 'Premium Venue', 'Event Coordination', 'Professional Catering'], ARRAY[1, 2, 3, 4, 5, 6]),
            (event_id, 'Premium Package', 'Luxury event with all amenities', '₹2,00,000 - ₹4,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Event Planner', 'Premium Catering', 'Professional Staff'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
        END IF;
        
        RAISE NOTICE 'Created 3 packages for event: % (ID: %)', event_record.name, event_id;
    END LOOP;
END $$;

-- Verify all packages were created
SELECT 'Enhanced Packages Created:' as info;
SELECT 
  e.name as event_name,
  ep.name as package_name,
  ep.price,
  ep.features
FROM events e
JOIN event_packages ep ON e.id = ep.event_id
ORDER BY e.name, ep.name;

-- Count packages per event
SELECT 'Final Package Count per Event:' as info;
SELECT 
  e.name as event_name,
  COUNT(ep.id) as package_count,
  array_length(e.service_categories, 1) as service_count
FROM events e
LEFT JOIN event_packages ep ON e.id = ep.event_id
GROUP BY e.name, e.service_categories
ORDER BY e.name;
