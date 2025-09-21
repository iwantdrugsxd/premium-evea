-- Complete Database Setup for EVEA
-- Run this in your Supabase SQL Editor

-- 1. Create users table with proper schema
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

-- 2. Create events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create event_services table
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

-- 4. Create event_packages table
CREATE TABLE IF NOT EXISTS event_packages (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  package_name VARCHAR(255) NOT NULL,
  package_description TEXT,
  price DECIMAL(10,2),
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insert sample events
INSERT INTO events (id, name, description, image_url) VALUES
(1, 'Wedding', 'Elegant wedding celebrations', '/images/wedding.jpg'),
(2, 'Birthday Party', 'Fun birthday celebrations', '/images/birthday.jpg'),
(3, 'Corporate Event', 'Professional corporate gatherings', '/images/corporate.jpg'),
(4, 'Anniversary', 'Special anniversary celebrations', '/images/anniversary.jpg'),
(5, 'Graduation', 'Academic achievement celebrations', '/images/graduation.jpg')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert sample event services
INSERT INTO event_services (event_id, service_name, service_description, category, is_required, is_popular) VALUES
-- Wedding services
(1, 'Wedding Photography', 'Professional wedding photography', 'Photography', true, true),
(1, 'Wedding Catering', 'Elegant wedding catering', 'Catering', true, true),
(1, 'Wedding Decoration', 'Beautiful wedding decorations', 'Decoration', true, true),
(1, 'Wedding Music', 'Live music and DJ services', 'Entertainment', false, true),
(1, 'Wedding Cake', 'Custom wedding cake', 'Food', true, true),

-- Birthday Party services
(2, 'Birthday Photography', 'Fun and candid photography', 'Photography', false, true),
(2, 'Birthday Catering', 'Delicious food and beverages', 'Catering', true, true),
(2, 'Birthday Decoration', 'Colorful balloons and theme decoration', 'Decoration', true, true),
(2, 'Birthday Cake', 'Custom designed birthday cake', 'Food', true, true),
(2, 'Birthday Entertainment', 'DJ, games, and activities', 'Entertainment', false, true),

-- Corporate Event services
(3, 'Corporate Photography', 'Professional event photography', 'Photography', false, true),
(3, 'Corporate Catering', 'Professional catering services', 'Catering', true, true),
(3, 'AV Equipment', 'Audio-visual equipment rental', 'Technology', true, true),
(3, 'Event Management', 'Complete event coordination', 'Management', true, true),

-- Anniversary services
(4, 'Anniversary Photography', 'Romantic anniversary photos', 'Photography', false, true),
(4, 'Anniversary Dinner', 'Special anniversary dinner', 'Catering', true, true),
(4, 'Anniversary Decoration', 'Romantic decorations', 'Decoration', true, true),

-- Graduation services
(5, 'Graduation Photography', 'Graduation ceremony photos', 'Photography', true, true),
(5, 'Graduation Party', 'Graduation celebration', 'Catering', true, true),
(5, 'Graduation Decoration', 'Academic theme decorations', 'Decoration', true, true)
ON CONFLICT DO NOTHING;

-- 7. Insert sample event packages
INSERT INTO event_packages (event_id, package_name, package_description, price, is_popular) VALUES
-- Wedding packages
(1, 'Basic Wedding Package', 'Essential wedding services', 50000.00, false),
(1, 'Premium Wedding Package', 'Complete wedding experience', 100000.00, true),
(1, 'Luxury Wedding Package', 'Ultimate wedding celebration', 200000.00, false),

-- Birthday packages
(2, 'Kids Birthday Package', 'Fun kids birthday party', 15000.00, true),
(2, 'Adult Birthday Package', 'Elegant adult birthday celebration', 25000.00, true),
(2, 'Luxury Birthday Package', 'Premium birthday experience', 50000.00, false),

-- Corporate packages
(3, 'Basic Corporate Package', 'Essential corporate event services', 30000.00, false),
(3, 'Premium Corporate Package', 'Complete corporate event', 60000.00, true),

-- Anniversary packages
(4, 'Romantic Anniversary Package', 'Special anniversary celebration', 20000.00, true),
(4, 'Luxury Anniversary Package', 'Premium anniversary experience', 40000.00, false),

-- Graduation packages
(5, 'Graduation Celebration Package', 'Complete graduation party', 18000.00, true),
(5, 'Premium Graduation Package', 'Luxury graduation celebration', 35000.00, false)
ON CONFLICT DO NOTHING;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_packages ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- Events are publicly readable
CREATE POLICY "Events are publicly readable" ON events
  FOR SELECT USING (true);

-- Event services are publicly readable
CREATE POLICY "Event services are publicly readable" ON event_services
  FOR SELECT USING (true);

-- Event packages are publicly readable
CREATE POLICY "Event packages are publicly readable" ON event_packages
  FOR SELECT USING (true);

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_event_services_event_id ON event_services(event_id);
CREATE INDEX IF NOT EXISTS idx_event_packages_event_id ON event_packages(event_id);

-- 11. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database setup completed successfully!' as status;




