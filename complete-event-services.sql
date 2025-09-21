-- Complete Event Services Setup for EVEA
-- This script creates all services for each event type

-- Clear existing services
DELETE FROM event_services;

-- Birthday Celebration Services
INSERT INTO event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(1, 'Balloon Decoration', 'Colorful balloon arrangements and themed decorations', 'Decoration & Florist', true, true),
(1, 'Cake Table Setup', 'Beautiful cake table with backdrop and lighting', 'Decoration & Florist', true, true),
(1, 'Lighting Arrangement', 'Basic to premium lighting setup for ambiance', 'Lighting & Sound', true, true),
(1, 'Music Playlist', 'Curated music playlist or DJ services', 'Entertainment', false, true),
(1, 'Return Gifts', 'Basic to premium return gifts for guests', 'Party Supplies & Decorations', false, true),
(1, 'Party Coordination', 'On-site event coordination and management', 'Event Planning & Coordination', true, true),
(1, 'Themed Decoration', 'Character or cartoon themed decorations', 'Decoration & Florist', false, true),
(1, 'Customized Cake', 'Designer cakes and cupcakes', 'Cake & Catering', true, true),
(1, 'Fun Games', 'Interactive games with professional host', 'Entertainment', false, true),
(1, 'Face Painting', 'Face painting and tattoo corner', 'Entertainment', false, true),
(1, 'Professional Photography', 'Event photography and candid shots', 'Photography & Videography', false, true),
(1, 'Live Entertainment', 'Magician, clown, or puppet show', 'Entertainment', false, false),
(1, 'Photo Booth', 'Photo booth with props and instant prints', 'Photography & Videography', false, false),
(1, 'DJ Setup', 'Professional DJ with dance floor', 'Entertainment', false, false),
(1, 'Videography', 'Cinematic highlights and video coverage', 'Photography & Videography', false, false);

-- Wedding Services
INSERT INTO event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(2, 'Mandap Setup', 'Traditional mandap design and setup', 'Mandap Setup & Traditional Decor', true, true),
(2, 'Floral Decoration', 'Premium floral arrangements and decorations', 'Decoration & Florist', true, true),
(2, 'Stage & Seating', 'Stage decoration and guest seating arrangement', 'Decoration & Florist', true, true),
(2, 'Sound System', 'Professional sound system for ceremonies', 'Lighting & Sound', true, true),
(2, 'Mandap Lighting', 'Special lighting for mandap and entrance', 'Lighting & Sound', true, true),
(2, 'Catering Coordination', 'Complete catering management and coordination', 'Catering & Food Services', true, true),
(2, 'Designer Mandap', 'Premium mandap with designer flowers', 'Mandap Setup & Traditional Decor', false, true),
(2, 'Bridal Makeup', 'Professional bridal and groom makeup', 'Bridal Services & Makeup', false, true),
(2, 'Guest Hospitality', 'Welcome desk and guest management', 'Guest Accommodation & Travel', false, true),
(2, 'Wedding Photography', 'Professional wedding photography', 'Photography & Videography', false, true),
(2, 'Stage Decoration', 'Premium stage with backdrop', 'Decoration & Florist', false, true),
(2, 'Premium Sound', 'High-end sound system', 'Lighting & Sound', false, true),
(2, 'Ritual Management', 'Traditional ceremony coordination', 'Traditional Ceremonies & Rituals', false, true),
(2, 'Destination Décor', 'Luxury destination-style decoration', 'Decoration & Florist', false, false),
(2, 'Celebrity Makeup', 'Celebrity makeup and styling team', 'Bridal Services & Makeup', false, false),
(2, 'Drone Coverage', 'Aerial photography and cinematic film', 'Photography & Videography', false, false),
(2, 'Live Band', 'Live music and cultural performances', 'Entertainment & Music', false, false),
(2, 'Wedding Planner', 'Dedicated wedding planning team', 'Wedding Planning & Coordination', false, false);

-- Corporate Event Services
INSERT INTO event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(3, 'Venue Booking', 'Professional venue selection and booking', 'Venues & Locations', true, true),
(3, 'Seating Setup', 'Conference seating and arrangement', 'Venues & Locations', true, true),
(3, 'Stage Backdrop', 'Professional stage with branding', 'Branding & Marketing', true, true),
(3, 'Audio System', 'Basic to premium audio setup', 'Audio-Visual Equipment', true, true),
(3, 'Projector Setup', 'Projector and screen installation', 'Audio-Visual Equipment', true, true),
(3, 'Tea Service', 'Refreshments and beverage service', 'Catering & Food Services', true, true),
(3, 'Event Coordination', 'On-site event management', 'Event Planning & Coordination', true, true),
(3, 'Branding Backdrop', 'Customized branding and banners', 'Branding & Marketing', false, true),
(3, 'Premium AV', 'Advanced audio-visual equipment', 'Audio-Visual Equipment', false, true),
(3, 'Professional Lighting', 'Stage and venue lighting', 'Lighting & Sound', false, true),
(3, 'Team Building', 'Interactive team building activities', 'Event Planning & Coordination', false, true),
(3, 'Lunch Catering', 'Professional lunch and dinner service', 'Catering & Food Services', false, true),
(3, 'Photography', 'Event photography coverage', 'Photography & Videography', false, true),
(3, 'Event Host', 'Professional MC and event host', 'Event Planning & Coordination', false, true),
(3, 'LED Stage', 'Grand stage with LED walls', 'Audio-Visual Equipment', false, false),
(3, 'Celebrity Speaker', 'Motivational speaker arrangement', 'Event Planning & Coordination', false, false),
(3, 'Live Streaming', 'Online streaming and recording', 'Technical Support & IT', false, false),
(3, 'Entertainment', 'Band, DJ, or cultural performances', 'Entertainment & Music', false, false),
(3, 'Delegate Kits', 'Premium welcome kits for attendees', 'Guest Registration & Management', false, false),
(3, 'Video Coverage', 'Professional video documentation', 'Photography & Videography', false, false);

-- Festival Events Services
INSERT INTO event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(4, 'Festival Lights', 'Traditional festival lighting and décor', 'Decoration & Florist', true, true),
(4, 'Stage Setup', 'Festival stage and performance area', 'Venues & Locations', true, true),
(4, 'Rangoli Design', 'Traditional rangoli and entrance decoration', 'Decoration & Florist', true, true),
(4, 'Snacks Stall', 'Traditional festival food stalls', 'Catering & Food Services', true, true),
(4, 'Sound System', 'Festival sound and announcement system', 'Lighting & Sound', true, true),
(4, 'Event Staff', 'On-site coordination and support', 'Event Planning & Coordination', true, true),
(4, 'Theme Stage', 'Theme-based stage decoration', 'Decoration & Florist', false, true),
(4, 'Cultural Performances', 'Folk dance and music performances', 'Entertainment & Music', false, true),
(4, 'Food Stalls', 'Multi-cuisine festival food court', 'Catering & Food Services', false, true),
(4, 'Photography', 'Festival photography coverage', 'Photography & Videography', false, true),
(4, 'Games & Activities', 'Prize-based games and competitions', 'Entertainment', false, true),
(4, 'LED Décor', 'Advanced lighting and floral décor', 'Decoration & Florist', false, true),
(4, 'Event Host', 'Festival emcee and host', 'Event Planning & Coordination', false, true),
(4, 'Grand Décor', 'Luxury festival decoration with props', 'Decoration & Florist', false, false),
(4, 'Celebrity Artist', 'Celebrity performer or DJ', 'Entertainment & Music', false, false),
(4, 'Fireworks', 'Special effects and fireworks', 'Special Effects & Technology', false, false),
(4, 'Live Streaming', 'Online event streaming', 'Technical Support & IT', false, false),
(4, 'Cultural Competitions', 'Large-scale cultural competitions', 'Entertainment', false, false),
(4, 'Multi-cuisine Court', 'Extensive food court setup', 'Catering & Food Services', false, false),
(4, 'Video Coverage', 'Professional festival documentation', 'Photography & Videography', false, false);

-- Concert/DJ Night Services
INSERT INTO event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(5, 'Stage Setup', 'Concert stage and equipment setup', 'Stage Setup & Equipment', true, true),
(5, 'Lighting System', 'Concert lighting and effects', 'Lighting & Sound', true, true),
(5, 'Sound System', 'Professional concert sound', 'Lighting & Sound', true, true),
(5, 'Entry Management', 'Ticket and entry management', 'Guest Management & Entry', true, true),
(5, 'Security Staff', 'Event security and safety', 'Security & Safety', true, true),
(5, 'Food Stalls', 'Concert food and beverage stalls', 'Catering & Food Services', true, true),
(5, 'Event Crew', 'On-site technical support', 'Event Planning & Coordination', true, true),
(5, 'Advanced Lighting', 'Premium lighting and sound effects', 'Lighting & Sound', false, true),
(5, 'Artist Coordination', 'Performer and DJ coordination', 'Entertainment & Music', false, true),
(5, 'Dance Floor', 'Professional dance floor setup', 'Venues & Locations', false, true),
(5, 'Social Media', 'Live social media coverage', 'Special Effects & Technology', false, true),
(5, 'Photography', 'Concert photography team', 'Photography & Videography', false, true),
(5, 'Drinks Stalls', 'Premium beverage service', 'Catering & Food Services', false, true),
(5, 'Event Host', 'Concert emcee and host', 'Event Planning & Coordination', false, true),
(5, 'LED Stage', 'Mega LED stage and effects', 'Stage Setup & Equipment', false, false),
(5, 'Celebrity Artist', 'Celebrity performer booking', 'Entertainment & Music', false, false),
(5, 'VIP Zones', 'VIP entry and seating areas', 'Guest Management & Entry', false, false),
(5, 'Special Effects', 'Fireworks, laser, and smoke shows', 'Special Effects & Technology', false, false),
(5, 'Drone Shots', 'Aerial photography and videography', 'Photography & Videography', false, false),
(5, 'Merchandise', 'Artist merchandise and branding', 'Merchandise & Branding', false, false);

-- Conference/Seminar Services
INSERT INTO event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
(6, 'Venue Booking', 'Conference venue selection', 'Venues & Locations', true, true),
(6, 'Seating Arrangement', 'Professional conference seating', 'Venues & Locations', true, true),
(6, 'Stage Backdrop', 'Conference stage with branding', 'Branding & Marketing', true, true),
(6, 'Projector Setup', 'Presentation equipment setup', 'Audio-Visual Equipment', true, true),
(6, 'Sound System', 'Conference audio system', 'Audio-Visual Equipment', true, true),
(6, 'Registration Desk', 'Attendee registration and check-in', 'Guest Registration & Management', true, true),
(6, 'Water Service', 'Refreshment and water service', 'Catering & Food Services', true, true),
(6, 'Staff Support', 'On-site coordination team', 'Event Planning & Coordination', true, true),
(6, 'Professional Branding', 'Customized banners and branding', 'Branding & Marketing', false, true),
(6, 'Advanced AV', 'Premium audio-visual equipment', 'Audio-Visual Equipment', false, true),
(6, 'Delegate Kits', 'Welcome kits for attendees', 'Guest Registration & Management', false, true),
(6, 'Lunch Catering', 'Professional meal service', 'Catering & Food Services', false, true),
(6, 'Photography', 'Conference documentation', 'Photography & Videography', false, true),
(6, 'Professional Lighting', 'Stage and venue lighting', 'Lighting & Sound', false, true),
(6, 'Coordination Team', 'Event management team', 'Event Planning & Coordination', false, true),
(6, 'LED Branding', 'LED stage with screens', 'Audio-Visual Equipment', false, false),
(6, 'Keynote Speakers', 'Speaker arrangement and management', 'Speaker Management', false, false),
(6, 'Video Coverage', 'Professional video documentation', 'Photography & Videography', false, false),
(6, 'Luxury Catering', 'Multi-cuisine catering service', 'Catering & Food Services', false, false),
(6, 'Live Streaming', 'Social media live streaming', 'Technical Support & IT', false, false),
(6, 'Hospitality Desk', 'Premium guest services', 'Guest Registration & Management', false, false),
(6, 'Media Coverage', 'Press and media coordination', 'Media & PR', false, false),
(6, 'Event App', 'Digital passes and QR codes', 'Technical Support & IT', false, false),
(6, 'Professional Emcee', 'Conference moderators and hosts', 'Event Planning & Coordination', false, false);

-- Success message
SELECT 'Complete event services setup completed successfully!' as status;
