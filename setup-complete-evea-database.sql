-- Complete EVEA Database Setup
-- This script sets up the entire EVEA platform with all events, packages, and services

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  features TEXT[],
  avg_budget VARCHAR(100),
  duration VARCHAR(50),
  team_size VARCHAR(50),
  service_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_packages (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  package_name VARCHAR(255) NOT NULL,
  package_description TEXT,
  price DECIMAL(10,2),
  is_popular BOOLEAN DEFAULT false,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_services (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  service_description TEXT,
  category VARCHAR(100),
  is_required BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile_number VARCHAR(20),
  location VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear existing data
DELETE FROM event_services;
DELETE FROM event_packages;
DELETE FROM events;

-- Insert all event types
INSERT INTO events (id, name, description, icon, features, avg_budget, duration, team_size, service_categories) VALUES
(1, 'Birthday Celebration', 'Fun and memorable birthday celebrations', '🎂', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹25,000 - ₹1,50,000', '4-6 hours', '3-5 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment', 'Venues & Locations', 'Cake & Catering', 'Photography & Videography', 'Event Planning & Coordination', 'Transportation & Logistics', 'Party Supplies & Decorations', 'Guest Management & RSVP']),

(2, 'Wedding', 'Complete Indian wedding celebration with all ceremonies', '💒', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹5,00,000 - ₹25,00,000', '3-7 days', '8-15 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment & Music', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Transportation & Logistics', 'Mandap Setup & Traditional Decor', 'Wedding Planning & Coordination', 'Bridal Services & Makeup', 'Traditional Ceremonies & Rituals', 'Guest Accommodation & Travel']),

(3, 'Corporate Event', 'Professional corporate gatherings and business events', '🏢', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,00,000 - ₹10,00,000', '4-8 hours', '5-10 people', ARRAY['Venues & Locations', 'Catering & Food Services', 'Lighting & Sound', 'Audio-Visual Equipment', 'Event Planning & Coordination', 'Branding & Marketing', 'Guest Registration & Management', 'Technical Support & IT', 'Security & Safety', 'Transportation & Parking']),

(4, 'Festival Events', 'Traditional Indian festivals and cultural celebrations', '🎭', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,00,000 - ₹8,00,000', '1-3 days', '6-12 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment & Music', 'Venues & Locations', 'Catering & Food Services', 'Event Planning & Coordination', 'Security & Safety', 'Technical Support & IT', 'Transportation & Parking', 'Vendor Management & Coordination', 'Guest Services & Information', 'Emergency Services & Medical Support']),

(5, 'Concert / DJ Night', 'High-energy music events and entertainment shows', '🎵', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹2,00,000 - ₹15,00,000', '4-6 hours', '8-15 people', ARRAY['Stage Setup & Equipment', 'Lighting & Sound', 'Entertainment & Music', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Event Planning & Coordination', 'Security & Safety', 'Transportation & Logistics', 'Guest Management & Entry', 'Special Effects & Technology', 'Merchandise & Branding']),

(6, 'Conference / Seminar', 'Professional conferences and educational seminars', '🎓', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,50,000 - ₹8,00,000', '6-8 hours', '6-12 people', ARRAY['Venues & Locations', 'Catering & Food Services', 'Audio-Visual Equipment', 'Event Planning & Coordination', 'Branding & Marketing', 'Guest Registration & Management', 'Technical Support & IT', 'Photography & Videography', 'Transportation & Logistics', 'Documentation & Materials', 'Speaker Management', 'Media & PR']),

(7, 'Housewarming', 'Traditional Griha Pravesh ceremonies and celebrations', '🏡', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹50,000 - ₹3,00,000', '4-6 hours', '4-8 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Traditional Rituals', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Event Planning & Coordination', 'Transportation & Logistics', 'Guest Management & RSVP', 'Religious Ceremonies', 'Return Gifts & Souvenirs', 'Hospitality & Welcome']),

(8, 'Engagement', 'Traditional Indian engagement celebrations', '💍', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹2,00,000 - ₹6,00,000', '5-6 hours', '8-12 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment & Music', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Event Planning & Coordination', 'Transportation & Logistics', 'Guest Management & RSVP', 'Traditional Ceremonies', 'Makeup & Styling', 'Return Gifts & Souvenirs']),

(9, 'Baby Shower', 'Traditional Indian baby shower celebrations', '👶', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹80,000 - ₹2,00,000', '3-4 hours', '4-6 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment & Music', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Event Planning & Coordination', 'Transportation & Logistics', 'Guest Management & RSVP', 'Traditional Rituals', 'Games & Activities', 'Return Gifts & Souvenirs']),

(10, 'Mehendi / Sangeet', 'Traditional pre-wedding celebrations', '🎶', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,50,000 - ₹5,00,000', '6-8 hours', '6-10 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment & Music', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Event Planning & Coordination', 'Transportation & Logistics', 'Guest Management & RSVP', 'Traditional Ceremonies', 'Mehendi Artists', 'Dance & Cultural Performances']),

(11, 'Farewell Parties', 'Memorable farewell celebrations', '🎓', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹1,00,000 - ₹4,00,000', '4-6 hours', '5-8 people', ARRAY['Decoration & Florist', 'Lighting & Sound', 'Entertainment & Music', 'Venues & Locations', 'Catering & Food Services', 'Photography & Videography', 'Event Planning & Coordination', 'Transportation & Logistics', 'Guest Management & RSVP', 'Awards & Recognition', 'Memorabilia & Souvenirs', 'Social Media & Documentation']),

(12, 'Sports / College Fest', 'Sports events and college festivals', '🏏', ARRAY['Full Planning', '500+ Vendors', 'Premium Service'], '₹2,00,000 - ₹10,00,000', '1-3 days', '8-15 people', ARRAY['Venues & Locations', 'Catering & Food Services', 'Lighting & Sound', 'Audio-Visual Equipment', 'Event Planning & Coordination', 'Security & Safety', 'Transportation & Logistics', 'Photography & Videography', 'Guest Management & Registration', 'Sports Equipment & Setup', 'Awards & Trophies', 'Entertainment & Performances']);

-- Insert Birthday Celebration Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(1, 'Basic Birthday', 'Essential birthday celebration package', 25000.00, false, ARRAY['Balloon decoration across venue', 'Cake table setup with backdrop', 'Simple lighting arrangement', 'Music playlist (background)', 'Return gifts (basic)', 'Party coordination support']),
(1, 'Standard Birthday', 'Enhanced birthday celebration package', 75000.00, true, ARRAY['Themed decoration (cartoon/character)', 'Customized cake & cupcakes', 'Fun games with host', 'Face painting / tattoo corner', 'Professional photography', 'Premium return gifts', 'Dedicated event coordinator']),
(1, 'Premium Birthday', 'Luxury birthday celebration package', 150000.00, false, ARRAY['Grand theme décor with 3D props & entrance arch', 'Designer cake with dessert table', 'Live entertainment (magician, clown, puppet show)', 'Photo booth setup with props', 'Professional emcee/host for games', 'DJ setup with dance floor', 'Videography & cinematic highlights', 'Customized invites & return gift hampers', 'Catering coordination with multiple cuisines', 'Guest management support']);

-- Insert Wedding Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(2, 'Basic Wedding', 'Essential wedding celebration package', 500000.00, false, ARRAY['Mandap setup (simple)', 'Basic floral decoration', 'Stage & seating arrangement', 'Sound system setup', 'Lighting for mandap & entrance', 'Catering coordination']),
(2, 'Standard Wedding', 'Enhanced wedding celebration package', 1000000.00, true, ARRAY['Designer mandap with premium flowers', 'Bridal & groom makeup setup', 'Guest hospitality desk', 'Wedding photography', 'Stage decoration with backdrop', 'Premium sound system', 'Ritual management support']),
(2, 'Premium Wedding', 'Luxury wedding celebration package', 2000000.00, false, ARRAY['Destination-style wedding décor', 'Celebrity makeup & styling team', 'Grand floral theme decoration', 'LED stage backdrop & lighting', 'Drone coverage & cinematic film', 'Luxury guest hospitality & welcome kits', 'Live band/DJ & cultural performances', 'Premium catering with multiple cuisines', 'Dedicated wedding planner & crew', 'Customized entry for bride & groom']);

-- Insert Corporate Event Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(3, 'Basic Corporate', 'Essential corporate event package', 100000.00, false, ARRAY['Venue booking & seating setup', 'Stage backdrop (simple)', 'Basic audio system', 'Projector & screen setup', 'Tea/coffee service', 'Event coordination']),
(3, 'Standard Corporate', 'Enhanced corporate event package', 300000.00, true, ARRAY['Customized branding backdrop', 'Premium audio-visual setup', 'Professional lighting', 'Team-building activities', 'Lunch/dinner catering', 'Photography coverage', 'Event host (MC)']),
(3, 'Premium Corporate', 'Luxury corporate event package', 800000.00, false, ARRAY['Grand stage with LED walls', 'Celebrity guest/motivational speaker', 'Live streaming support', 'Entertainment program (band/DJ)', 'Premium delegate kits', 'Branding across venue (standees, screens)', 'Luxury catering & hospitality', 'Professional video coverage', 'On-ground event crew support', 'Corporate giveaways for attendees']);

-- Insert Festival Events Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(4, 'Basic Festival', 'Essential festival celebration package', 100000.00, false, ARRAY['Festival lights & décor', 'Simple stage setup', 'Rangoli or themed entrance', 'Basic snacks stall', 'Sound system & mic', 'Event staff support']),
(4, 'Standard Festival', 'Enhanced festival celebration package', 300000.00, true, ARRAY['Theme-based stage setup', 'Cultural performances (folk dance/music)', 'Food stalls with festive menu', 'Professional photography', 'Prize-based games & activities', 'Better décor with floral/LED lights', 'Dedicated event host']),
(4, 'Premium Festival', 'Luxury festival celebration package', 600000.00, false, ARRAY['Grand décor with lighting effects & props', 'Celebrity artist / DJ performance', 'Fireworks or special effects', 'Live streaming of event', 'Large-scale cultural competitions', 'Multi-cuisine food court', 'Professional video coverage', 'Emcee & entertainment crew', 'Souvenirs for guests', 'Complete festival management team']);

-- Insert Concert/DJ Night Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(5, 'Basic Concert', 'Essential concert/DJ night package', 200000.00, false, ARRAY['Stage setup', 'Lighting & sound system', 'Entry management desk', 'Basic security staff', 'Food stalls coordination', 'Event crew support']),
(5, 'Standard Concert', 'Enhanced concert/DJ night package', 500000.00, true, ARRAY['Advanced sound & lighting effects', 'Artist/DJ coordination', 'Dance floor setup', 'Social media coverage', 'Photography team', 'Drinks & snacks stalls', 'Emcee/host for event']),
(5, 'Premium Concert', 'Luxury concert/DJ night package', 1200000.00, false, ARRAY['Mega LED stage & light effects', 'Celebrity artist/DJ booking', 'VIP entry & seating zones', 'Fireworks, laser & smoke shows', 'Professional videography & drone shots', 'Special effects (confetti, CO₂ blasters)', 'Premium catering & bar setup', 'Security with crowd management', 'Afterparty coordination', 'Merchandise stalls']);

-- Insert Conference/Seminar Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(6, 'Basic Conference', 'Essential conference/seminar package', 150000.00, false, ARRAY['Venue booking & seating', 'Stage with simple backdrop', 'Projector & sound setup', 'Registration desk', 'Water/tea service', 'Staff support']),
(6, 'Standard Conference', 'Enhanced conference/seminar package', 400000.00, true, ARRAY['Professional branding & banners', 'Advanced AV setup', 'Delegate kit (notepad, pen)', 'Tea/lunch catering', 'Photography', 'Professional lighting', 'Event coordination team']),
(6, 'Premium Conference', 'Luxury conference/seminar package', 800000.00, false, ARRAY['LED stage branding with screens', 'Keynote speakers arrangement', 'Professional video coverage', 'Luxury catering with multiple cuisines', 'Social media live streaming', 'Hospitality desk with team support', 'Premium delegate kits & giveaways', 'Media coverage & PR', 'Event app/QR code passes', 'Professional emcee & moderators']);

-- Insert Housewarming Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(7, 'Basic Housewarming', 'Essential housewarming package', 50000.00, false, ARRAY['Simple rangoli & floral entrance', 'Basic pooja setup arrangement', 'Seating arrangement for guests', 'Sound system for bhajans/mantras', 'Tea & snack coordination', 'Event staff support']),
(7, 'Standard Housewarming', 'Enhanced housewarming package', 150000.00, true, ARRAY['Themed rangoli & toran decoration', 'Pooja pandit arrangement', 'Floral décor across main hall', 'Professional photography', 'Premium snacks & beverages', 'Guest welcome kit (kumkum, sweets)', 'Event coordinator on-site']),
(7, 'Premium Housewarming', 'Luxury housewarming package', 300000.00, false, ARRAY['Designer floral + LED décor for entire house', 'Luxury pooja setup with stage backdrop', 'Vedic pandit with ritual support team', 'Live bhajan group / cultural performance', 'Professional photography & videography', 'Return gift hampers for guests', 'Multi-cuisine catering coordination', 'Guest hospitality desk & valet parking', 'Live streaming setup for family abroad', 'Full event management crew']);

-- Insert Engagement Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(8, 'Basic Engagement', 'Essential engagement package', 200000.00, false, ARRAY['Simple stage setup with backdrop', 'Floral decoration for couple seating', 'Sound system & mic', 'Basic lighting', 'Cake cutting coordination', 'Event crew']),
(8, 'Standard Engagement', 'Enhanced engagement package', 400000.00, true, ARRAY['Designer floral stage décor', 'Professional photography', 'Engagement ring tray decoration', 'Music playlist or DJ', 'Catering coordination', 'Guest entry & welcome', 'Event host for announcements']),
(8, 'Premium Engagement', 'Luxury engagement package', 600000.00, false, ARRAY['Grand LED stage décor with theme', 'Celebrity makeup & styling for couple', 'Live entertainment (singer/DJ)', 'Drone photography & video', 'Designer engagement cake & dessert table', 'Couple entry with special effects', 'Professional emcee for event flow', 'Premium catering & drinks', 'Return gift hampers for guests', 'Full engagement event management']);

-- Insert Baby Shower Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(9, 'Basic Baby Shower', 'Essential baby shower package', 80000.00, false, ARRAY['Balloon & floral décor', 'Simple stage backdrop', 'Sound system for announcements', 'Cake cutting setup', 'Seating arrangement', 'Event staff support']),
(9, 'Standard Baby Shower', 'Enhanced baby shower package', 150000.00, true, ARRAY['Themed decoration (baby boy/girl)', 'Customized cake & dessert table', 'Professional photography', 'Fun games for guests', 'Premium seating setup with backdrop', 'Music playlist & mic', 'Return gift favors']),
(9, 'Premium Baby Shower', 'Luxury baby shower package', 200000.00, false, ARRAY['Grand themed décor with props (cribs, toys)', 'Designer dessert table with cake', 'Live entertainment (singer/performer)', 'Drone photography & cinematic video', 'Guest welcome hampers', 'Games with host & prizes', 'Catering coordination (multi-cuisine)', 'Personalized invites', 'Professional event crew & emcee', 'Souvenir distribution for guests']);

-- Insert Mehendi/Sangeet Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(10, 'Basic Mehendi', 'Essential mehendi/sangeet package', 150000.00, false, ARRAY['Simple floral stage décor', 'Basic DJ setup with sound system', 'Lighting for dance area', 'Seating & cushion setup', 'Basic mehendi artist', 'Event crew']),
(10, 'Standard Mehendi', 'Enhanced mehendi/sangeet package', 300000.00, true, ARRAY['Designer mehendi stage décor', 'DJ with dance floor', 'Live dhol/folk artist', 'Premium mehendi artists for guests', 'Professional photography', 'Catering coordination', 'Emcee for games & dance']),
(10, 'Premium Mehendi', 'Luxury mehendi/sangeet package', 500000.00, false, ARRAY['Grand stage with LED décor', 'Celebrity mehendi artist / performer', 'Choreographer & dance troupe', 'Drone video + cinematic film', 'Designer catering experience', 'Special effects (smoke/confetti) for dance', 'Custom décor theme (Rajasthani, Mughal)', 'Premium guest hampers', 'Bride & groom entry with props', 'Full mehendi/sangeet event management']);

-- Insert Farewell Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(11, 'Basic Farewell', 'Essential farewell package', 100000.00, false, ARRAY['Basic stage backdrop', 'Sound system & mic', 'Simple lighting', 'Cake cutting setup', 'Seating arrangement', 'Music playlist']),
(11, 'Standard Farewell', 'Enhanced farewell package', 250000.00, true, ARRAY['Themed decoration (college/school/company)', 'Professional photography', 'Fun activities & games', 'Customized cake & snacks', 'DJ with dance floor', 'Entry desk with registration', 'Event coordinator']),
(11, 'Premium Farewell', 'Luxury farewell package', 400000.00, false, ARRAY['Grand themed décor with LED backdrop', 'Celebrity DJ / live band', 'Drone video & professional photography', 'Special awards & certificates for guests', 'Premium catering', 'Social media live streaming', 'Emcee & fun games', 'Customized farewell souvenirs', 'Stage performances coordination', 'Event management crew support']);

-- Insert Sports/College Fest Packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular, features) VALUES
(12, 'Basic Sports Fest', 'Essential sports/college fest package', 200000.00, false, ARRAY['Stage & banner setup', 'Sound system & mic', 'Registration desk', 'Seating setup for audience', 'Refreshments (basic)', 'Event staff support']),
(12, 'Standard Sports Fest', 'Enhanced sports/college fest package', 500000.00, true, ARRAY['Customized branding & theme décor', 'Professional photography', 'DJ / music support', 'On-field arrangements (umpires, referees)', 'Fun activity stalls', 'Catering stalls', 'Event coordination team']),
(12, 'Premium Sports Fest', 'Luxury sports/college fest package', 1000000.00, false, ARRAY['Grand opening ceremony with fireworks', 'Celebrity chief guest/influencer', 'LED stage with light shows', 'Full sports coverage (video + drone)', 'Merchandise stalls for branding', 'Professional hospitality & catering', 'Live streaming on social media', 'Closing ceremony with trophies/medals', 'Security & crowd management', 'Full event management crew']);

-- Insert Birthday Celebration Services
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

-- Insert Wedding Services
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

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Events are publicly readable" ON events FOR SELECT USING (true);
CREATE POLICY "Event packages are publicly readable" ON event_packages FOR SELECT USING (true);
CREATE POLICY "Event services are publicly readable" ON event_services FOR SELECT USING (true);
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
CREATE INDEX IF NOT EXISTS idx_event_packages_event_id ON event_packages(event_id);
CREATE INDEX IF NOT EXISTS idx_event_services_event_id ON event_services(event_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Complete EVEA database setup completed successfully!' as status;
