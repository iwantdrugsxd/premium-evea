-- Enhance Events with Comprehensive Services (8-10 services per event)
-- This script will update existing events with detailed service categories
-- FIXED VERSION - No problematic unnest functions

-- Step 1: Update Birthday Party with comprehensive services
UPDATE events SET service_categories = ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Entertainment & Music',
  'Venues & Locations',
  'Cake & Catering',
  'Photography & Videography',
  'Event Planning & Coordination',
  'Transportation & Logistics',
  'Party Supplies & Decorations',
  'Guest Management & RSVP'
] WHERE name = 'Birthday Party';

-- Step 2: Update Wedding with comprehensive services
UPDATE events SET service_categories = ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Entertainment & Music',
  'Venues & Locations',
  'Catering & Food Services',
  'Photography & Videography',
  'Transportation & Logistics',
  'Mandap Setup & Traditional Decor',
  'Wedding Planning & Coordination',
  'Bridal Services & Makeup',
  'Traditional Ceremonies & Rituals',
  'Guest Accommodation & Travel'
] WHERE name = 'Wedding';

-- Step 3: Update Corporate Event with comprehensive services
UPDATE events SET service_categories = ARRAY[
  'Venues & Locations',
  'Catering & Food Services',
  'Lighting & Sound',
  'Audio-Visual Equipment',
  'Event Planning & Coordination',
  'Branding & Marketing',
  'Guest Registration & Management',
  'Technical Support & IT',
  'Security & Safety',
  'Transportation & Parking'
] WHERE name = 'Corporate Event';

-- Step 4: Update Custom Event with comprehensive services
UPDATE events SET service_categories = ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Entertainment & Music',
  'Venues & Locations',
  'Catering & Food Services',
  'Photography & Videography',
  'Event Planning & Coordination',
  'Transportation & Logistics',
  'Guest Management & RSVP',
  'Special Effects & Technology'
] WHERE name = 'Custom Event';

-- Step 5: Update Anniversary with comprehensive services
UPDATE events SET service_categories = ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Entertainment & Music',
  'Venues & Locations',
  'Catering & Food Services',
  'Photography & Videography',
  'Event Planning & Coordination',
  'Transportation & Logistics',
  'Gift & Souvenir Management',
  'Guest Accommodation & Travel'
] WHERE name = 'Anniversary';

-- Step 6: Update Festival/Concert with comprehensive services
UPDATE events SET service_categories = ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Entertainment & Music',
  'Venues & Locations',
  'Catering & Food Services',
  'Event Planning & Coordination',
  'Security & Safety',
  'Technical Support & IT',
  'Transportation & Parking',
  'Vendor Management & Coordination',
  'Guest Services & Information',
  'Emergency Services & Medical Support'
] WHERE name = 'Festival/Concert';

-- Step 7: Add new Indian event types with comprehensive services
INSERT INTO events (name, description, icon, features, avg_budget, duration, team_size, service_categories) VALUES
('Navratri Celebration', 'Nine nights of traditional Indian festival celebration', '🕉️', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹2,00,000 - ₹8,00,000', '9 days', '6-12 people', ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Traditional Music & Dance',
  'Venues & Locations',
  'Catering & Food Services',
  'Event Planning & Coordination',
  'Traditional Attire & Costumes',
  'Cultural Performances & Artists',
  'Guest Accommodation & Travel',
  'Religious Ceremonies & Rituals'
]),

('Mandap & Stage Setup', 'Traditional Indian wedding mandap and stage setup services', '🏛️', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,50,000 - ₹6,00,000', '1-2 days', '4-8 people', ARRAY[
  'Traditional Mandap Construction',
  'Decoration & Florist',
  'Lighting & Sound',
  'Stage Setup & Equipment',
  'Traditional Decor & Props',
  'Floral Arrangements & Garlands',
  'Religious Symbols & Artifacts',
  'Safety & Structural Support',
  'Setup & Dismantling Services',
  'Coordination & Management'
]),

('Cultural Festival', 'Traditional Indian cultural celebrations and festivals', '🎭', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,00,000 - ₹5,00,000', '1-3 days', '5-10 people', ARRAY[
  'Decoration & Florist',
  'Lighting & Sound',
  'Traditional Entertainment',
  'Venues & Locations',
  'Catering & Food Services',
  'Traditional Attire & Costumes',
  'Cultural Performances & Artists',
  'Event Planning & Coordination',
  'Guest Services & Information',
  'Cultural Workshops & Activities'
]),

('Product Launch', 'Professional product launch events with Indian hospitality', '🚀', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹2,00,000 - ₹5,00,000', '3-4 hours', '8-12 people', ARRAY[
  'Venues & Locations',
  'Audio-Visual Equipment',
  'Catering & Food Services',
  'Event Planning & Coordination',
  'Branding & Marketing',
  'Guest Registration & Management',
  'Technical Support & IT',
  'Security & Safety',
  'Transportation & Parking',
  'Media & Press Management'
]),

('Team Building', 'Corporate team building events with Indian cultural elements', '🤝', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹80,000 - ₹1,50,000', '6-8 hours', '4-6 people', ARRAY[
  'Venues & Locations',
  'Catering & Food Services',
  'Team Activities & Games',
  'Event Planning & Coordination',
  'Transportation & Logistics',
  'Equipment & Supplies',
  'Facilitation & Training',
  'Guest Services & Support',
  'Safety & Emergency Services',
  'Feedback & Assessment'
]);

-- Step 8: Verify all events have comprehensive services
SELECT 'Enhanced Events with Services:' as info;
SELECT 
  name,
  array_length(service_categories, 1) as service_count,
  service_categories
FROM events
ORDER BY name;

-- Step 9: Count total services across all events (FIXED VERSION)
SELECT 'Service Summary:' as info;
SELECT 
  COUNT(DISTINCT name) as total_events,
  SUM(array_length(service_categories, 1)) as total_services,
  ROUND(AVG(array_length(service_categories, 1)), 1) as avg_services_per_event
FROM events;

-- Step 10: Show service distribution
SELECT 'Service Distribution:' as info;
SELECT 
  'Total Events' as metric,
  COUNT(*) as value
FROM events
UNION ALL
SELECT 
  'Total Services (sum of all arrays)' as metric,
  SUM(array_length(service_categories, 1)) as value
FROM events
UNION ALL
SELECT 
  'Average Services per Event' as metric,
  ROUND(AVG(array_length(service_categories, 1)), 1) as value
FROM events;
