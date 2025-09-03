-- Update Events for Indian Event Market
-- This script will create events specific to Indian cultural events and their services

-- First, let's clear existing events to avoid duplicates
DELETE FROM events;

-- Insert Indian event types with their specific services
INSERT INTO events (name, description, icon, features, avg_budget, duration, team_size, service_categories) VALUES
('Birthday', 'Celebrate birthdays with traditional and modern Indian flair', '🎂', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹25,000 - ₹1,50,000', '4-6 hours', '3-5 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment', 'Venues & Locations', 'Cake & Catering']),

('Marriage', 'Complete Indian wedding celebration with all traditional ceremonies', '💒', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹5,00,000 - ₹25,00,000', '3-7 days', '8-15 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Transportation', 'Mandap Setup']),

('Cultural Event', 'Traditional Indian cultural celebrations and festivals', '🎭', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,00,000 - ₹5,00,000', '1-3 days', '5-10 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment', 'Venues & Locations', 'Catering & Food Services', 'Traditional Attire']),

('Navratri', 'Nine nights of traditional Indian festival celebration', '🕉️', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹2,00,000 - ₹8,00,000', '9 days', '6-12 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment', 'Venues & Locations', 'Catering & Food Services', 'Traditional Music', 'Dance Performances']),

('Mandap Setup', 'Traditional Indian wedding mandap and stage setup', '🏛️', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,50,000 - ₹6,00,000', '1-2 days', '4-8 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Traditional Decor', 'Stage Setup', 'Floral Arrangements']),

('Corporate Events', 'Professional corporate events with Indian hospitality', '🏢', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,00,000 - ₹10,00,000', '1-3 days', '5-15 people', ARRAY['Venues & Locations', 'Catering & Food Services', 'Lighting & Sound', 'Audio-Visual Equipment', 'Event Coordination']),

('Custom Event', 'Personalized events tailored to your specific requirements', '✨', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹50,000 - ₹3,00,000', '1-7 days', '3-10 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography']);

-- Verify the events were created
SELECT 
  name,
  service_categories,
  avg_budget,
  duration
FROM events
ORDER BY name;
