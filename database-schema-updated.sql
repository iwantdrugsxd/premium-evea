-- Updated Database Schema for EVEA Event Planning
-- This schema works with your existing database structure

-- Add new tables for event planning flow while keeping existing structure

-- Create sequences first
CREATE SEQUENCE IF NOT EXISTS public.event_planning_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.consultation_calls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.admin_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 1. Event Planning Requests Table (new)
CREATE TABLE public.event_planning_requests (
  id bigint NOT NULL DEFAULT nextval('event_planning_requests_id_seq'::regclass),
  user_id bigint REFERENCES public.users(id),
  event_id bigint REFERENCES public.events(id),
  package_id bigint REFERENCES public.event_packages(id),
  location character varying NOT NULL,
  event_date timestamp with time zone NOT NULL,
  budget numeric(10,2) NOT NULL,
  guest_count integer NOT NULL,
  selected_package character varying, -- 'basic', 'professional', 'premium'
  status character varying DEFAULT 'pending',
  additional_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_planning_requests_pkey PRIMARY KEY (id)
);

-- 2. Consultation Calls Table (new)
CREATE TABLE public.consultation_calls (
  id bigint NOT NULL DEFAULT nextval('consultation_calls_id_seq'::regclass),
  event_planning_request_id bigint REFERENCES public.event_planning_requests(id),
  scheduled_time timestamp with time zone NOT NULL,
  admin_whatsapp character varying(20),
  user_whatsapp character varying(20),
  status character varying DEFAULT 'scheduled',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT consultation_calls_pkey PRIMARY KEY (id)
);

-- 3. Admin Settings Table (new)
CREATE TABLE public.admin_settings (
  id bigint NOT NULL DEFAULT nextval('admin_settings_id_seq'::regclass),
  admin_whatsapp character varying(20) NOT NULL,
  admin_email character varying(255) NOT NULL,
  admin_name character varying(100) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_settings_pkey PRIMARY KEY (id)
);

-- Insert sample admin settings
INSERT INTO public.admin_settings (admin_whatsapp, admin_email, admin_name) VALUES
('+919876543210', 'admin@evea.com', 'EVEA Admin');

-- Create indexes for better performance
CREATE INDEX idx_event_planning_requests_user_id ON public.event_planning_requests(user_id);
CREATE INDEX idx_event_planning_requests_event_id ON public.event_planning_requests(event_id);
CREATE INDEX idx_event_planning_requests_status ON public.event_planning_requests(status);
CREATE INDEX idx_consultation_calls_request_id ON public.consultation_calls(event_planning_request_id);
CREATE INDEX idx_consultation_calls_status ON public.consultation_calls(status);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_event_planning_requests_updated_at 
  BEFORE UPDATE ON public.event_planning_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at 
  BEFORE UPDATE ON public.admin_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
