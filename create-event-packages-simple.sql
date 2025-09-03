-- Create Event Packages for Each Event Type
-- Each event will have 3 packages: Basic, Standard, Premium

-- First, let's clear existing packages to avoid duplicates
DELETE FROM event_packages;

-- Helper function to get event ID safely
DO $$
DECLARE
    wedding_id INTEGER;
    birthday_id INTEGER;
    corporate_id INTEGER;
    anniversary_id INTEGER;
    graduation_id INTEGER;
    babyshower_id INTEGER;
    engagement_id INTEGER;
    productlaunch_id INTEGER;
    teambuilding_id INTEGER;
BEGIN
    -- Get event IDs
    SELECT id INTO wedding_id FROM events WHERE name = 'Wedding' LIMIT 1;
    SELECT id INTO birthday_id FROM events WHERE name = 'Birthday Party' LIMIT 1;
    SELECT id INTO corporate_id FROM events WHERE name = 'Corporate Event' LIMIT 1;
    SELECT id INTO anniversary_id FROM events WHERE name = 'Anniversary' LIMIT 1;
    SELECT id INTO graduation_id FROM events WHERE name = 'Graduation Party' LIMIT 1;
    SELECT id INTO babyshower_id FROM events WHERE name = 'Baby Shower' LIMIT 1;
    SELECT id INTO engagement_id FROM events WHERE name = 'Engagement Ceremony' LIMIT 1;
    SELECT id INTO productlaunch_id FROM events WHERE name = 'Product Launch' LIMIT 1;
    SELECT id INTO teambuilding_id FROM events WHERE name = 'Team Building' LIMIT 1;

    -- Wedding Packages
    IF wedding_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (wedding_id, 'Basic Wedding Package', 'Essential services for a beautiful wedding celebration', '₹2,00,000 - ₹3,50,000', ARRAY['Basic Photography (6 hours)', 'Simple Decoration', 'Basic Catering', 'Venue Assistance'], ARRAY[1, 2, 3, 4]),
        (wedding_id, 'Standard Wedding Package', 'Comprehensive wedding services for a memorable day', '₹4,00,000 - ₹6,00,000', ARRAY['Full Day Photography', 'Premium Decoration', 'Full Catering Service', 'Venue + Decoration', 'Wedding Coordinator'], ARRAY[1, 2, 3, 4, 5]),
        (wedding_id, 'Premium Wedding Package', 'Luxury wedding experience with premium services', '₹7,00,000 - ₹12,00,000', ARRAY['Cinematic Videography', 'Luxury Decoration', 'Premium Catering', 'Full Venue Package', 'Wedding Planner', 'Entertainment Package'], ARRAY[1, 2, 3, 4, 5, 6]);
    END IF;

    -- Birthday Party Packages
    IF birthday_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (birthday_id, 'Basic Birthday Package', 'Simple birthday celebration setup', '₹15,000 - ₹25,000', ARRAY['Basic Decoration', 'Simple Photography', 'Basic Catering'], ARRAY[1, 2, 3]),
        (birthday_id, 'Standard Birthday Package', 'Complete birthday celebration experience', '₹30,000 - ₹50,000', ARRAY['Theme Decoration', 'Professional Photography', 'Full Catering', 'Entertainment Setup'], ARRAY[1, 2, 3, 4]),
        (birthday_id, 'Premium Birthday Package', 'Luxury birthday celebration with all amenities', '₹60,000 - ₹1,00,000', ARRAY['Premium Theme Decoration', 'Professional Photography + Videography', 'Premium Catering', 'Live Entertainment', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5]);
    END IF;

    -- Corporate Event Packages
    IF corporate_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (corporate_id, 'Basic Corporate Package', 'Essential corporate event services', '₹50,000 - ₹80,000', ARRAY['Basic Venue Setup', 'Simple Catering', 'Basic Audio-Visual'], ARRAY[1, 2, 3]),
        (corporate_id, 'Standard Corporate Package', 'Professional corporate event experience', '₹1,00,000 - ₹1,50,000', ARRAY['Premium Venue', 'Professional Catering', 'Full Audio-Visual Setup', 'Event Coordination'], ARRAY[1, 2, 3, 4]),
        (corporate_id, 'Premium Corporate Package', 'Executive corporate event with premium services', '₹2,00,000 - ₹3,50,000', ARRAY['Luxury Venue', 'Premium Catering', 'Advanced Audio-Visual', 'Event Management', 'Professional Staff'], ARRAY[1, 2, 3, 4, 5]);
    END IF;

    -- Anniversary Packages
    IF anniversary_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (anniversary_id, 'Basic Anniversary Package', 'Simple anniversary celebration', '₹20,000 - ₹35,000', ARRAY['Basic Decoration', 'Simple Entertainment'], ARRAY[1, 2]),
        (anniversary_id, 'Standard Anniversary Package', 'Complete anniversary celebration', '₹40,000 - ₹70,000', ARRAY['Premium Decoration', 'Live Entertainment', 'Catering Services'], ARRAY[1, 2, 3]),
        (anniversary_id, 'Premium Anniversary Package', 'Luxury anniversary celebration', '₹80,000 - ₹1,20,000', ARRAY['Luxury Decoration', 'Premium Entertainment', 'Full Catering', 'Event Coordinator'], ARRAY[1, 2, 3, 4]);
    END IF;

    -- Graduation Party Packages
    IF graduation_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (graduation_id, 'Basic Graduation Package', 'Simple graduation celebration', '₹25,000 - ₹40,000', ARRAY['Basic Decoration', 'Simple Photography', 'Basic Catering'], ARRAY[1, 2, 3]),
        (graduation_id, 'Standard Graduation Package', 'Complete graduation celebration', '₹50,000 - ₹80,000', ARRAY['Theme Decoration', 'Professional Photography', 'Full Catering', 'Entertainment'], ARRAY[1, 2, 3, 4]),
        (graduation_id, 'Premium Graduation Package', 'Luxury graduation celebration', '₹1,00,000 - ₹1,50,000', ARRAY['Premium Theme Decoration', 'Professional Photography + Videography', 'Premium Catering', 'Live Entertainment', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5]);
    END IF;

    -- Baby Shower Packages
    IF babyshower_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (babyshower_id, 'Basic Baby Shower Package', 'Simple baby shower celebration', '₹15,000 - ₹25,000', ARRAY['Basic Decoration', 'Simple Photography', 'Basic Catering'], ARRAY[1, 2, 3]),
        (babyshower_id, 'Standard Baby Shower Package', 'Complete baby shower experience', '₹30,000 - ₹50,000', ARRAY['Theme Decoration', 'Professional Photography', 'Full Catering', 'Entertainment'], ARRAY[1, 2, 3, 4]),
        (babyshower_id, 'Premium Baby Shower Package', 'Luxury baby shower celebration', '₹60,000 - ₹90,000', ARRAY['Premium Theme Decoration', 'Professional Photography + Videography', 'Premium Catering', 'Live Entertainment', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5]);
    END IF;

    -- Engagement Ceremony Packages
    IF engagement_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (engagement_id, 'Basic Engagement Package', 'Simple engagement celebration', '₹50,000 - ₹80,000', ARRAY['Basic Decoration', 'Simple Photography', 'Basic Entertainment'], ARRAY[1, 2, 3]),
        (engagement_id, 'Standard Engagement Package', 'Complete engagement celebration', '₹1,00,000 - ₹1,50,000', ARRAY['Premium Decoration', 'Professional Photography', 'Live Entertainment', 'Catering Services'], ARRAY[1, 2, 3, 4]),
        (engagement_id, 'Premium Engagement Package', 'Luxury engagement celebration', '₹2,00,000 - ₹3,00,000', ARRAY['Luxury Decoration', 'Professional Photography + Videography', 'Premium Entertainment', 'Full Catering', 'Event Coordinator'], ARRAY[1, 2, 3, 4, 5]);
    END IF;

    -- Product Launch Packages
    IF productlaunch_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (productlaunch_id, 'Basic Product Launch Package', 'Essential product launch services', '₹1,00,000 - ₹1,50,000', ARRAY['Basic Venue Setup', 'Simple Audio-Visual', 'Basic Catering'], ARRAY[1, 2, 3]),
        (productlaunch_id, 'Standard Product Launch Package', 'Professional product launch experience', '₹2,00,000 - ₹3,00,000', ARRAY['Premium Venue', 'Professional Audio-Visual', 'Full Catering', 'Event Coordination'], ARRAY[1, 2, 3, 4]),
        (productlaunch_id, 'Premium Product Launch Package', 'Executive product launch with premium services', '₹4,00,000 - ₹6,00,000', ARRAY['Luxury Venue', 'Advanced Audio-Visual', 'Premium Catering', 'Event Management', 'Professional Staff', 'Marketing Support'], ARRAY[1, 2, 3, 4, 5, 6]);
    END IF;

    -- Team Building Packages
    IF teambuilding_id IS NOT NULL THEN
        INSERT INTO event_packages (event_id, name, description, price, features, service_ids) VALUES
        (teambuilding_id, 'Basic Team Building Package', 'Simple team building setup', '₹40,000 - ₹60,000', ARRAY['Basic Venue Setup', 'Simple Catering', 'Basic Activities'], ARRAY[1, 2, 3]),
        (teambuilding_id, 'Standard Team Building Package', 'Complete team building experience', '₹80,000 - ₹1,20,000', ARRAY['Premium Venue', 'Full Catering', 'Professional Activities', 'Event Coordination'], ARRAY[1, 2, 3, 4]),
        (teambuilding_id, 'Premium Team Building Package', 'Luxury team building with premium services', '₹1,50,000 - ₹2,50,000', ARRAY['Luxury Venue', 'Premium Catering', 'Professional Activities', 'Event Management', 'Professional Staff', 'Custom Activities'], ARRAY[1, 2, 3, 4, 5, 6]);
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
