-- Create Indian Event Packages
-- Each event will have 3 packages: Basic, Standard, Premium
-- Tailored for Indian event market with traditional services

-- First, let's clear existing packages to avoid duplicates
DELETE FROM event_packages;

-- Helper function to get event ID safely
DO $$
DECLARE
    birthday_id INTEGER;
    marriage_id INTEGER;
    cultural_id INTEGER;
    navratri_id INTEGER;
    mandap_id INTEGER;
    corporate_id INTEGER;
    custom_id INTEGER;
BEGIN
    -- Get event IDs
    SELECT id INTO birthday_id FROM events WHERE name = 'Birthday' LIMIT 1;
    SELECT id INTO marriage_id FROM events WHERE name = 'Marriage' LIMIT 1;
    SELECT id INTO cultural_id FROM events WHERE name = 'Cultural Event' LIMIT 1;
    SELECT id INTO navratri_id FROM events WHERE name = 'Navratri' LIMIT 1;
    SELECT id INTO mandap_id FROM events WHERE name = 'Mandap Setup' LIMIT 1;
    SELECT id INTO corporate_id FROM events WHERE name = 'Corporate Events' LIMIT 1;
    SELECT id INTO custom_id FROM events WHERE name = 'Custom Event' LIMIT 1;

    -- Birthday Packages
    IF birthday_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (birthday_id, 'Basic Birthday Package', 'Simple birthday celebration with essential services', '₹25,000 - ₹40,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Assistance', 'Birthday Cake'], ARRAY[1, 2, 3, 4, 5]),
        (birthday_id, 'Standard Birthday Package', 'Complete birthday celebration with premium services', '₹50,000 - ₹80,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5, 6]),
        (birthday_id, 'Premium Birthday Package', 'Luxury birthday celebration with all amenities', '₹1,00,000 - ₹1,50,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Photography & Videography'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
    END IF;

    -- Marriage Packages
    IF marriage_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (marriage_id, 'Basic Marriage Package', 'Essential wedding services for intimate celebration', '₹5,00,000 - ₹8,00,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Setup', 'Basic Catering', 'Simple Photography', 'Basic Transportation'], ARRAY[1, 2, 3, 4, 5, 6, 7]),
        (marriage_id, 'Standard Marriage Package', 'Complete wedding celebration with traditional services', '₹10,00,000 - ₹15,00,000', ARRAY['Premium Decoration', 'Professional Lighting & Sound', 'Live Entertainment', 'Premium Venue', 'Full Catering Service', 'Professional Photography', 'Luxury Transportation', 'Wedding Coordinator'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]),
        (marriage_id, 'Premium Marriage Package', 'Luxury wedding experience with all traditional ceremonies', '₹18,00,000 - ₹25,00,000', ARRAY['Luxury Decoration', 'Advanced Lighting & Sound', 'Celebrity Entertainment', 'Luxury Venue', 'Premium Catering', 'Cinematic Photography & Videography', 'Luxury Transportation', 'Wedding Planner', 'Traditional Ceremonies'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9]);
    END IF;

    -- Cultural Event Packages
    IF cultural_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (cultural_id, 'Basic Cultural Package', 'Simple cultural celebration setup', '₹1,00,000 - ₹1,50,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Setup', 'Basic Catering'], ARRAY[1, 2, 3, 4, 5]),
        (cultural_id, 'Standard Cultural Package', 'Complete cultural celebration experience', '₹2,00,000 - ₹3,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Traditional Entertainment', 'Premium Venue', 'Full Catering', 'Traditional Attire', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5, 6, 7]),
        (cultural_id, 'Premium Cultural Package', 'Luxury cultural celebration with traditional elements', '₹4,00,000 - ₹5,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Traditional Entertainment', 'Luxury Venue', 'Premium Catering', 'Traditional Attire', 'Cultural Expert', 'Event Planner'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]);
    END IF;

    -- Navratri Packages
    IF navratri_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (navratri_id, 'Basic Navratri Package', 'Simple Navratri celebration setup', '₹2,00,000 - ₹3,00,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Setup', 'Basic Catering'], ARRAY[1, 2, 3, 4, 5]),
        (navratri_id, 'Standard Navratri Package', 'Complete Navratri celebration experience', '₹4,00,000 - ₹6,00,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Traditional Music & Dance', 'Premium Venue', 'Full Catering', 'Traditional Performances', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5, 6, 7]),
        (navratri_id, 'Premium Navratri Package', 'Luxury Navratri celebration with all traditional elements', '₹6,00,000 - ₹8,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Traditional Music & Dance', 'Luxury Venue', 'Premium Catering', 'Celebrity Performances', 'Cultural Expert', 'Event Planner'], ARRAY[1, 2, 3, 4, 5, 6, 7, 8]);
    END IF;

    -- Mandap Setup Packages
    IF mandap_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (mandap_id, 'Basic Mandap Package', 'Simple mandap setup with essential elements', '₹1,50,000 - ₹2,50,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Stage Setup', 'Simple Floral Arrangements'], ARRAY[1, 2, 3, 4]),
        (mandap_id, 'Standard Mandap Package', 'Complete mandap setup with traditional elements', '₹3,00,000 - ₹4,50,000', ARRAY['Premium Decoration', 'Professional Lighting & Sound', 'Professional Stage Setup', 'Premium Floral Arrangements', 'Traditional Decor', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5, 6]),
        (mandap_id, 'Premium Mandap Package', 'Luxury mandap setup with all traditional elements', '₹5,00,000 - ₹6,00,000', ARRAY['Luxury Decoration', 'Advanced Lighting & Sound', 'Luxury Stage Setup', 'Premium Floral Arrangements', 'Traditional Decor', 'Cultural Expert', 'Event Planner'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
    END IF;

    -- Corporate Events Packages
    IF corporate_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (corporate_id, 'Basic Corporate Package', 'Essential corporate event services', '₹1,00,000 - ₹1,50,000', ARRAY['Basic Venue Setup', 'Simple Audio-Visual', 'Basic Catering', 'Basic Lighting'], ARRAY[1, 2, 3, 4]),
        (corporate_id, 'Standard Corporate Package', 'Professional corporate event experience', '₹2,00,000 - ₹3,50,000', ARRAY['Premium Venue', 'Professional Audio-Visual', 'Full Catering', 'Professional Lighting & Sound', 'Event Coordination'], ARRAY[1, 2, 3, 4, 5]),
        (corporate_id, 'Premium Corporate Package', 'Executive corporate event with premium services', '₹5,00,000 - ₹10,00,000', ARRAY['Luxury Venue', 'Advanced Audio-Visual', 'Premium Catering', 'Advanced Lighting & Sound', 'Event Management', 'Professional Staff', 'Marketing Support'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
    END IF;

    -- Custom Event Packages
    IF custom_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (custom_id, 'Basic Custom Package', 'Simple custom event setup', '₹50,000 - ₹80,000', ARRAY['Basic Decoration', 'Simple Lighting', 'Basic Entertainment', 'Venue Assistance', 'Basic Catering'], ARRAY[1, 2, 3, 4, 5]),
        (custom_id, 'Standard Custom Package', 'Complete custom event experience', '₹1,00,000 - ₹1,80,000', ARRAY['Theme Decoration', 'Professional Lighting & Sound', 'Entertainment', 'Premium Venue', 'Full Catering', 'Event Coordination'], ARRAY[1, 2, 3, 4, 5, 6]),
        (custom_id, 'Premium Custom Package', 'Luxury custom event with all amenities', '₹2,00,000 - ₹3,00,000', ARRAY['Premium Theme Decoration', 'Advanced Lighting & Sound', 'Premium Entertainment', 'Luxury Venue', 'Premium Catering', 'Event Planner', 'Photography & Videography'], ARRAY[1, 2, 3, 4, 5, 6, 7]);
    END IF;

END $$;

-- Verify all packages were created
SELECT 
  e.name as event_name,
  ep.name as package_name,
  ep.price,
  ep.features
FROM events e
JOIN event_packages ep ON e.id = ep.event_id
ORDER BY e.name, ep.name;

-- Count packages per event
SELECT 
  e.name as event_name,
  COUNT(ep.id) as package_count
FROM events e
LEFT JOIN event_packages ep ON e.id = ep.event_id
GROUP BY e.name
ORDER BY e.name;
