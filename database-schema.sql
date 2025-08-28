-- EVEA Event Planning Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Events Table - Store different event types
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

-- 2. User Event Requests Table - Store user event planning requests
CREATE TABLE user_event_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_id INTEGER REFERENCES events(id),
  location VARCHAR(255) NOT NULL,
  date_time TIMESTAMP NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  guest_count INTEGER NOT NULL,
  selected_package VARCHAR(50), -- 'basic', 'professional', 'premium'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Packages Table - Store available packages
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

-- 4. Call Schedules Table - Store consultation call schedules
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

-- 5. Admin Settings Table - Store admin contact information
CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  admin_whatsapp VARCHAR(20) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  admin_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data

-- Sample Events
INSERT INTO events (name, category, description, base_price, min_guests, max_guests) VALUES
('Wedding', 'wedding', 'Complete wedding planning and coordination', 50000.00, 50, 500),
('Corporate Event', 'corporate', 'Professional corporate event management', 75000.00, 20, 200),
('Birthday Party', 'birthday', 'Fun and memorable birthday celebrations', 25000.00, 10, 100),
('Anniversary', 'anniversary', 'Romantic anniversary celebrations', 35000.00, 20, 150),
('Festival/Concert', 'festival', 'Large-scale festival and concert management', 100000.00, 100, 1000),
('Custom Event', 'custom', 'Unique custom event planning', 40000.00, 10, 300);

-- Sample Packages
INSERT INTO packages (name, event_type, price_range_min, price_range_max, guest_range_min, guest_range_max, features) VALUES
('basic', 'wedding', 50000.00, 150000.00, 50, 200, '["Event Planning Consultation", "Vendor Coordination", "Basic Decoration Setup", "Event Day Management", "5 EVEA Team Members", "Basic Photography"]'),
('professional', 'wedding', 150000.00, 500000.00, 200, 500, '["Everything in Basic", "Premium Vendor Selection", "Custom Theme Design", "Advanced Decoration", "Professional Photography & Video", "Entertainment Coordination", "Guest Management System", "Post-Event Support"]'),
('premium', 'wedding', 500000.00, 2000000.00, 500, 1000, '["Everything in Professional", "Luxury Venue Selection", "Celebrity Chef Catering", "Live Entertainment", "Instagram Story Creation", "Social Media Management", "VIP Guest Services", "Luxury Transportation", "Premium Photography Package", "Event Video Documentary"]'),

('basic', 'corporate', 75000.00, 200000.00, 20, 100, '["Event Planning Consultation", "Tech Setup Coordination", "Basic Catering", "Event Day Management", "3 EVEA Team Members", "Basic Documentation"]'),
('professional', 'corporate', 200000.00, 500000.00, 100, 300, '["Everything in Basic", "Advanced Tech Setup", "Premium Catering", "Professional Documentation", "Live Streaming", "Guest Management", "Post-Event Support"]'),
('premium', 'corporate', 500000.00, 1500000.00, 300, 500, '["Everything in Professional", "Luxury Venue", "Celebrity Speakers", "Advanced Tech Integration", "VIP Services", "Comprehensive Documentation"]'),

('basic', 'birthday', 25000.00, 75000.00, 10, 50, '["Theme Planning", "Basic Decoration", "Catering Coordination", "Entertainment Setup", "3 EVEA Team Members"]'),
('professional', 'birthday', 75000.00, 150000.00, 50, 100, '["Everything in Basic", "Custom Theme Design", "Advanced Decoration", "Professional Entertainment", "Photography", "Guest Management"]'),
('premium', 'birthday', 150000.00, 300000.00, 100, 200, '["Everything in Professional", "Luxury Venue", "Celebrity Entertainment", "Premium Catering", "Social Media Coverage", "VIP Services"]'),

('basic', 'anniversary', 35000.00, 100000.00, 20, 100, '["Romantic Planning", "Intimate Decoration", "Catering Coordination", "Music Setup", "3 EVEA Team Members"]'),
('professional', 'anniversary', 100000.00, 200000.00, 100, 200, '["Everything in Basic", "Custom Romantic Theme", "Premium Decoration", "Live Music", "Professional Photography", "Guest Management"]'),
('premium', 'anniversary', 200000.00, 500000.00, 200, 300, '["Everything in Professional", "Luxury Venue", "Celebrity Entertainment", "Premium Catering", "Social Media Coverage", "VIP Services"]'),

('basic', 'festival', 100000.00, 300000.00, 100, 500, '["Event Planning", "Stage Setup", "Basic Sound System", "Security Coordination", "10 EVEA Team Members"]'),
('professional', 'festival', 300000.00, 800000.00, 500, 1000, '["Everything in Basic", "Advanced Stage Setup", "Professional Sound System", "Enhanced Security", "Live Streaming", "Vendor Management"]'),
('premium', 'festival', 800000.00, 2000000.00, 1000, 2000, '["Everything in Professional", "Luxury Stage Design", "Premium Sound System", "Celebrity Performers", "Comprehensive Security", "VIP Services"]'),

('basic', 'custom', 40000.00, 120000.00, 10, 100, '["Custom Planning", "Flexible Coordination", "Basic Setup", "Event Management", "5 EVEA Team Members"]'),
('professional', 'custom', 120000.00, 300000.00, 100, 300, '["Everything in Basic", "Advanced Custom Design", "Premium Coordination", "Professional Services", "Comprehensive Management"]'),
('premium', 'custom', 300000.00, 1000000.00, 300, 500, '["Everything in Professional", "Luxury Custom Design", "Premium Services", "Celebrity Integration", "VIP Experience", "Exclusive Features"]');

-- Sample Admin Settings
INSERT INTO admin_settings (admin_whatsapp, admin_email, admin_name) VALUES
('+919876543210', 'admin@evea.com', 'EVEA Admin');

-- Create indexes for better performance
CREATE INDEX idx_user_event_requests_user_id ON user_event_requests(user_id);
CREATE INDEX idx_user_event_requests_event_id ON user_event_requests(event_id);
CREATE INDEX idx_user_event_requests_status ON user_event_requests(status);
CREATE INDEX idx_call_schedules_user_event_request_id ON call_schedules(user_event_request_id);
CREATE INDEX idx_call_schedules_status ON call_schedules(status);
CREATE INDEX idx_packages_event_type ON packages(event_type);
CREATE INDEX idx_packages_name ON packages(name);

-- Create RLS (Row Level Security) policies
ALTER TABLE user_event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Policies for user_event_requests
CREATE POLICY "Users can view their own event requests" ON user_event_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own event requests" ON user_event_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event requests" ON user_event_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for call_schedules
CREATE POLICY "Users can view their own call schedules" ON call_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_event_requests 
      WHERE user_event_requests.id = call_schedules.user_event_request_id 
      AND user_event_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own call schedules" ON call_schedules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_event_requests 
      WHERE user_event_requests.id = call_schedules.user_event_request_id 
      AND user_event_requests.user_id = auth.uid()
    )
  );

-- Admin can view all data
CREATE POLICY "Admin can view all event requests" ON user_event_requests
  FOR SELECT USING (true);

CREATE POLICY "Admin can view all call schedules" ON call_schedules
  FOR SELECT USING (true);

CREATE POLICY "Admin can view all settings" ON admin_settings
  FOR SELECT USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_user_event_requests_updated_at 
  BEFORE UPDATE ON user_event_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at 
  BEFORE UPDATE ON admin_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
