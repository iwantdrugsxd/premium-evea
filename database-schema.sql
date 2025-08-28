-- Database Schema for Plan Event Flow

-- 1. Events Table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  min_guests INTEGER,
  max_guests INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. User Event Requests Table
CREATE TABLE user_event_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_id INTEGER REFERENCES events(id),
  location VARCHAR(255) NOT NULL,
  date_time TIMESTAMP NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  guest_count INTEGER NOT NULL,
  selected_package VARCHAR(50), -- 'basic', 'professional', 'premium'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed'
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Packages Table
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL, -- 'basic', 'professional', 'premium'
  event_type VARCHAR(50) NOT NULL,
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  guest_range_min INTEGER,
  guest_range_max INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Call Schedules Table
CREATE TABLE call_schedules (
  id SERIAL PRIMARY KEY,
  user_event_request_id INTEGER REFERENCES user_event_requests(id),
  scheduled_time TIMESTAMP NOT NULL,
  admin_whatsapp VARCHAR(20),
  user_whatsapp VARCHAR(20),
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sample Data

-- Insert Events
INSERT INTO events (name, category, description, base_price, min_guests, max_guests) VALUES
('Wedding', 'Celebration', 'Traditional Indian wedding ceremonies with all rituals and celebrations', 50000, 50, 500),
('Birthday Party', 'Celebration', 'Birthday celebrations and parties for all ages', 15000, 10, 100),
('Corporate Event', 'Business', 'Corporate meetings, conferences, and business events', 25000, 20, 200),
('Navratri', 'Cultural', 'Navratri celebrations and garba events', 30000, 100, 1000),
('Anniversary', 'Celebration', 'Wedding anniversary celebrations', 20000, 30, 150),
('Baby Shower', 'Celebration', 'Baby shower ceremonies and celebrations', 12000, 20, 80);

-- Insert Packages
INSERT INTO packages (name, event_type, price_range_min, price_range_max, guest_range_min, guest_range_max, features) VALUES
('Basic', 'Wedding', 50000, 100000, 50, 150, '["Basic decoration", "Catering for 50-150 guests", "Basic photography", "Event coordination", "Basic sound system"]'),
('Professional', 'Wedding', 100000, 200000, 150, 300, '["Premium decoration", "Multi-cuisine catering", "Professional photography", "Videography", "Live music", "Event coordination", "Premium sound system"]'),
('Premium', 'Wedding', 200000, 500000, 300, 500, '["Luxury decoration", "International cuisine", "Cinematic videography", "Live entertainment", "Celebrity appearances", "Premium coordination", "Advanced sound & lighting"]'),

('Basic', 'Birthday Party', 15000, 30000, 10, 50, '["Basic decoration", "Catering", "Basic photography", "Music system", "Event coordination"]'),
('Professional', 'Birthday Party', 30000, 60000, 50, 100, '["Premium decoration", "Multi-cuisine catering", "Professional photography", "DJ", "Event coordination", "Games & activities"]'),
('Premium', 'Birthday Party', 60000, 120000, 100, 200, '["Luxury decoration", "International cuisine", "Cinematic videography", "Live entertainment", "Celebrity appearances", "Premium coordination"]'),

('Basic', 'Corporate Event', 25000, 50000, 20, 100, '["Basic setup", "Catering", "Basic AV equipment", "Event coordination"]'),
('Professional', 'Corporate Event', 50000, 100000, 100, 200, '["Premium setup", "Multi-cuisine catering", "Professional AV equipment", "Event coordination", "Branding"]'),
('Premium', 'Corporate Event', 100000, 250000, 200, 500, '["Luxury setup", "International cuisine", "Advanced AV equipment", "Live streaming", "Premium coordination", "Branding"]'),

('Basic', 'Navratri', 30000, 60000, 100, 300, '["Basic decoration", "Catering", "Basic sound system", "Event coordination"]'),
('Professional', 'Navratri', 60000, 120000, 300, 600, '["Premium decoration", "Multi-cuisine catering", "Professional sound system", "Live music", "Event coordination"]'),
('Premium', 'Navratri', 120000, 300000, 600, 1000, '["Luxury decoration", "International cuisine", "Advanced sound & lighting", "Live entertainment", "Celebrity performances", "Premium coordination"]');
