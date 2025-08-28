# EVEA Event Planning Backend Documentation

## Overview
This document describes the complete backend implementation for the EVEA event planning flow, designed to work with your existing database schema.

## Database Schema

### Existing Tables (Your Current Schema)
- `events` - Event types and details
- `event_packages` - Available packages for each event
- `event_services` - Services offered for events
- `users` - User information
- `vendors` - Vendor information
- `vendor_reviews` - Vendor reviews
- `vendor_portfolio` - Vendor portfolio items
- `user_events` - User event bookings
- `user_vendor_selections` - User vendor selections

### New Tables (Added for Event Planning Flow)
- `event_planning_requests` - User event planning requests
- `consultation_calls` - Scheduled consultation calls
- `admin_settings` - Admin contact information

## API Endpoints

### 1. Events API
**GET** `/api/events`

Fetches all available event types from the `events` table.

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": 1,
      "name": "Wedding",
      "category": "wedding",
      "description": "Complete wedding planning and coordination",
      "base_price": 50000,
      "min_guests": 50,
      "max_guests": 500,
      "is_active": true
    }
  ]
}
```

### 2. Event Requests API
**POST** `/api/event-requests`

Creates a new event planning request.

**Request Body:**
```json
{
  "event_id": 1,
  "location": "Mumbai, Maharashtra",
  "date_time": "2024-12-25T18:00:00Z",
  "budget": 150000,
  "guest_count": 200,
  "additional_notes": "Outdoor wedding preferred"
}
```

**Response:**
```json
{
  "success": true,
  "event_request": {
    "id": 1,
    "user_id": 1,
    "event_id": 1,
    "location": "Mumbai, Maharashtra",
    "event_date": "2024-12-25T18:00:00Z",
    "budget": 150000,
    "guest_count": 200,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**GET** `/api/event-requests?user_id=1`

Fetches event requests for a specific user.

### 3. Package Recommendation API
**POST** `/api/packages/recommend`

Recommends packages based on event details.

**Request Body:**
```json
{
  "event_id": 1,
  "budget": 150000,
  "guest_count": 200
}
```

**Response:**
```json
{
  "success": true,
  "packages": [
    {
      "id": 1,
      "name": "basic",
      "event_type": "wedding",
      "price_range_min": 50000,
      "price_range_max": 150000,
      "guest_range_min": 50,
      "guest_range_max": 200,
      "features": ["Event Planning Consultation", "Vendor Coordination", "Basic Decoration Setup"]
    }
  ],
  "event": {
    "id": 1,
    "name": "Wedding",
    "description": "Complete wedding planning and coordination"
  }
}
```

### 4. Update Package API
**POST** `/api/event-requests/update-package`

Updates the selected package for an event request.

**Request Body:**
```json
{
  "event_request_id": 1,
  "selected_package": "professional"
}
```

### 5. Call Scheduling API
**POST** `/api/call-schedules`

Schedules a consultation call.

**Request Body:**
```json
{
  "event_request_id": 1,
  "scheduled_time": "2024-01-20T15:00:00Z",
  "user_whatsapp": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "call_schedule": {
    "id": 1,
    "event_planning_request_id": 1,
    "scheduled_time": "2024-01-20T15:00:00Z",
    "admin_whatsapp": "+919876543210",
    "user_whatsapp": "+919876543210",
    "status": "scheduled"
  },
  "message": "Call scheduled successfully"
}
```

**GET** `/api/call-schedules?event_request_id=1`

Fetches call schedules for a specific event request.

### 6. WhatsApp API
**POST** `/api/whatsapp/send`

Sends WhatsApp notifications (currently simulated).

**Request Body:**
```json
{
  "to": "+919876543210",
  "message": "Your consultation call has been scheduled!"
}
```

## Database Schema Details

### Event Planning Requests Table
```sql
CREATE TABLE public.event_planning_requests (
  id bigint PRIMARY KEY,
  user_id bigint REFERENCES public.users(id),
  event_id bigint REFERENCES public.events(id),
  package_id bigint REFERENCES public.event_packages(id),
  location character varying NOT NULL,
  event_date timestamp with time zone NOT NULL,
  budget numeric(10,2) NOT NULL,
  guest_count integer NOT NULL,
  selected_package character varying,
  status character varying DEFAULT 'pending',
  additional_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Consultation Calls Table
```sql
CREATE TABLE public.consultation_calls (
  id bigint PRIMARY KEY,
  event_planning_request_id bigint REFERENCES public.event_planning_requests(id),
  scheduled_time timestamp with time zone NOT NULL,
  admin_whatsapp character varying(20),
  user_whatsapp character varying(20),
  status character varying DEFAULT 'scheduled',
  notes text,
  created_at timestamp with time zone DEFAULT now()
);
```

### Admin Settings Table
```sql
CREATE TABLE public.admin_settings (
  id bigint PRIMARY KEY,
  admin_whatsapp character varying(20) NOT NULL,
  admin_email character varying(255) NOT NULL,
  admin_name character varying(100) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WhatsApp Integration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number

# Admin Contact Information
ADMIN_WHATSAPP=+919876543210
ADMIN_EMAIL=admin@evea.com
ADMIN_NAME=EVEA Admin
```

## Flow Overview

1. **Event Selection**: User selects an event type from `/api/events`
2. **Event Details**: User submits event details via `/api/event-requests`
3. **Package Recommendation**: System recommends packages via `/api/packages/recommend`
4. **Package Selection**: User selects a package via `/api/event-requests/update-package`
5. **Call Scheduling**: User schedules consultation via `/api/call-schedules`
6. **Notifications**: System sends WhatsApp notifications via `/api/whatsapp/send`

## Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Security Considerations

- All database operations use Supabase's built-in security
- Environment variables are used for sensitive data
- Input validation is implemented for all endpoints
- Error messages don't expose sensitive information

## Testing

1. Set up environment variables
2. Run the database schema updates
3. Test each API endpoint with sample data
4. Verify WhatsApp notifications (currently logged to console)
5. Check database for proper data insertion

## Production Deployment

1. Set up production Supabase project
2. Configure Twilio WhatsApp Business API
3. Set up proper email service
4. Update environment variables for production
5. Test the complete flow end-to-end
