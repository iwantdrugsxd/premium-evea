-- Update Events Table with Service Categories
-- This script will update existing events and add new ones with proper service categories

-- First, let's add a service_categories column to the events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS service_categories TEXT[];

-- Clear existing events to avoid duplicates
DELETE FROM events;

-- Insert events with proper service categories
INSERT INTO events (name, description, icon, features, avg_budget, duration, team_size, service_categories) VALUES
('Anniversary', 'Celebrate years of togetherness', '💕', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹50,000 - ₹1,50,000', '4-6 hours', '3-5 people', ARRAY['Decoration & Florist', 'Music & Entertainment']),
('Birthday Party', 'Make birthdays unforgettable', '🎂', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹20,000 - ₹80,000', '3-4 hours', '2-4 people', ARRAY['Photography & Videography', 'Decoration & Florist', 'Music & Entertainment']),
('Corporate Event', 'Professional corporate gatherings', '🏢', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,00,000 - ₹5,00,000', '4-8 hours', '5-10 people', ARRAY['Venues & Locations', 'Catering & Food Services']),
('Custom Event', 'Your unique celebration', '✨', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹30,000 - ₹2,00,000', '3-6 hours', '3-6 people', ARRAY['Decoration & Florist', 'Music & Entertainment']),
('Festival/Concert', 'Large scale celebrations', '🎪', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹5,00,000 - ₹20,00,000', '6-12 hours', '10-20 people', ARRAY['Decoration & Florist', 'Music & Entertainment']),
('Wedding', 'Your special day', '💒', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹5,00,000 - ₹25,00,000', '8-12 hours', '8-15 people', ARRAY['Photography & Videography', 'Decoration & Florist']),
('Graduation Party', 'Celebrate academic achievements with style', '🎓', ARRAY['Professional Photography', 'Event Decoration', 'Catering Services'], '₹50,000 - ₹1,00,000', '4-6 hours', '5-8 people', ARRAY['Photography & Videography', 'Decoration & Florist', 'Catering & Food Services']),
('Baby Shower', 'Welcome the little one with love and joy', '👶', ARRAY['Theme Decoration', 'Photography', 'Catering'], '₹30,000 - ₹80,000', '3-4 hours', '3-5 people', ARRAY['Decoration & Florist', 'Photography & Videography', 'Catering & Food Services']),
('Engagement Ceremony', 'Begin the journey of togetherness', '💍', ARRAY['Traditional Decoration', 'Photography', 'Cultural Performances'], '₹1,00,000 - ₹2,50,000', '5-7 hours', '6-10 people', ARRAY['Decoration & Florist', 'Photography & Videography', 'Music & Entertainment']),
('Product Launch', 'Launch your product with impact', '🚀', ARRAY['Professional Setup', 'Audio-Visual Equipment', 'Catering'], '₹2,00,000 - ₹5,00,000', '3-4 hours', '8-12 people', ARRAY['Venues & Locations', 'Lighting & Sound', 'Catering & Food Services']),
('Team Building', 'Strengthen team bonds', '🤝', ARRAY['Activity Planning', 'Venue Setup', 'Catering'], '₹80,000 - ₹1,50,000', '6-8 hours', '4-6 people', ARRAY['Venues & Locations', 'Catering & Food Services', 'Decoration & Florist']);



-- Verify the updates
SELECT name, service_categories FROM events ORDER BY name;

-- Show all events with their service categories
SELECT 
  e.name,
  e.description,
  e.service_categories,
  e.avg_budget,
  e.duration
FROM events e
ORDER BY e.name;
