# 🎉 Plan Your Event - Complete Flow Documentation

## 📋 Overview
This document outlines the complete user flow for the "Plan Your Event" feature, including frontend implementation, backend API routes, database schema, and WhatsApp integration.

## 🔄 User Flow Summary
```
User Plans → Selects Event → Adds Details → Gets Packages → Chooses One → Schedules Call
```

## 🗄️ Database Schema (Supabase)

### 1. Events Table
```sql
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
```

### 2. User Event Requests Table
```sql
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
```

### 3. Packages Table
```sql
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
```

### 4. Call Schedules Table
```sql
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
```

## 🎨 Frontend Implementation (Next.js)

### 1. Event Planning Homepage (`/plan-event`)

```typescript
// src/app/plan-event/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Event {
  id: number;
  name: string;
  category: string;
  description: string;
  base_price: number;
}

export default function PlanEventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [step, setStep] = useState(1);
  
  // Fetch events from Supabase
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch('/api/events');
    const data = await response.json();
    setEvents(data.events);
  };

  return (
    <div className="min-h-screen">
      {/* Step 1: Event Selection */}
      {step === 1 && (
        <EventSelectionStep 
          events={events}
          onEventSelect={(event) => {
            setSelectedEvent(event);
            setStep(2);
          }}
        />
      )}

      {/* Step 2: Event Details */}
      {step === 2 && selectedEvent && (
        <EventDetailsStep 
          event={selectedEvent}
          onDetailsSubmit={(details) => {
            // Store details and move to packages
            setStep(3);
          }}
        />
      )}

      {/* Step 3: Package Selection */}
      {step === 3 && (
        <PackageSelectionStep 
          onPackageSelect={(package) => {
            setStep(4);
          }}
        />
      )}

      {/* Step 4: Call Scheduling */}
      {step === 4 && (
        <CallSchedulingStep 
          onScheduleComplete={(schedule) => {
            // Trigger WhatsApp notification
            triggerWhatsAppNotification(schedule);
          }}
        />
      )}
    </div>
  );
}
```

### 2. Event Selection Component

```typescript
// src/components/EventSelection.tsx
interface EventSelectionProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
}

export function EventSelectionStep({ events, onEventSelect }: EventSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-8"
    >
      <h1 className="text-4xl font-bold mb-8">Choose Your Event Type</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer"
            onClick={() => onEventSelect(event)}
          >
            <h3 className="text-xl font-bold mb-2">{event.name}</h3>
            <p className="text-gray-400 mb-4">{event.description}</p>
            <div className="text-purple-500 font-semibold">
              Starting from ₹{event.base_price.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
```

### 3. Event Details Form

```typescript
// src/components/EventDetails.tsx
interface EventDetails {
  location: string;
  date_time: string;
  budget: number;
  guest_count: number;
  additional_notes?: string;
}

export function EventDetailsStep({ event, onDetailsSubmit }: EventDetailsProps) {
  const [details, setDetails] = useState<EventDetails>({
    location: '',
    date_time: '',
    budget: 0,
    guest_count: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store in Supabase
    const response = await fetch('/api/event-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: event.id,
        ...details
      })
    });

    if (response.ok) {
      onDetailsSubmit(details);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-8"
    >
      <h2 className="text-3xl font-bold mb-8">Event Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Location</label>
          <input
            type="text"
            value={details.location}
            onChange={(e) => setDetails({...details, location: e.target.value})}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Date & Time</label>
          <input
            type="datetime-local"
            value={details.date_time}
            onChange={(e) => setDetails({...details, date_time: e.target.value})}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Budget (₹)</label>
            <input
              type="number"
              value={details.budget}
              onChange={(e) => setDetails({...details, budget: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Guest Count</label>
            <input
              type="number"
              value={details.guest_count}
              onChange={(e) => setDetails({...details, guest_count: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold"
        >
          Get Package Recommendations
        </button>
      </form>
    </motion.div>
  );
}
```

## 🔧 Backend API Routes (Next.js)

### 1. Events API Route

```typescript
// src/app/api/events/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
```

### 2. Event Requests API Route

```typescript
// src/app/api/event-requests/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, location, date_time, budget, guest_count, additional_notes } = body;

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Insert event request
    const { data, error } = await supabase
      .from('user_event_requests')
      .insert({
        user_id: user.id,
        event_id,
        location,
        date_time,
        budget,
        guest_count,
        additional_notes
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      event_request: data 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event request' },
      { status: 500 }
    );
  }
}
```

### 3. Package Recommendations API Route

```typescript
// src/app/api/packages/recommend/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { event_id, budget, guest_count } = await request.json();

    // Get packages based on event type and criteria
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .eq('event_type', event_id)
      .gte('price_range_min', budget * 0.8) // Within 20% of budget
      .lte('price_range_max', budget * 1.2)
      .gte('guest_range_min', guest_count * 0.8)
      .lte('guest_range_max', guest_count * 1.2)
      .eq('is_active', true)
      .order('price_range_min');

    if (error) throw error;

    // Return 3 packages (Basic, Professional, Premium)
    const recommendedPackages = packages.slice(0, 3);

    return NextResponse.json({ packages: recommendedPackages });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get package recommendations' },
      { status: 500 }
    );
  }
}
```

### 4. Call Scheduling API Route

```typescript
// src/app/api/call-schedules/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { event_request_id, scheduled_time, user_whatsapp } = await request.json();

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Insert call schedule
    const { data: schedule, error } = await supabase
      .from('call_schedules')
      .insert({
        user_event_request_id: event_request_id,
        scheduled_time,
        user_whatsapp,
        admin_whatsapp: process.env.ADMIN_WHATSAPP
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger WhatsApp notification
    await triggerWhatsAppNotification(schedule);

    return NextResponse.json({ 
      success: true, 
      schedule 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to schedule call' },
      { status: 500 }
    );
  }
}
```

## 📱 WhatsApp Integration

### 1. WhatsApp Notification Function

```typescript
// src/lib/whatsapp.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function triggerWhatsAppNotification(schedule: any) {
  try {
    // Get event request details
    const { data: eventRequest } = await supabase
      .from('user_event_requests')
      .select(`
        *,
        events(name),
        auth.users(email, phone)
      `)
      .eq('id', schedule.user_event_request_id)
      .single();

    // Format message
    const message = `
🎉 *New Event Planning Request*

*Event Type:* ${eventRequest.events.name}
*Location:* ${eventRequest.location}
*Date:* ${new Date(eventRequest.date_time).toLocaleDateString()}
*Time:* ${new Date(eventRequest.date_time).toLocaleTimeString()}
*Budget:* ₹${eventRequest.budget.toLocaleString()}
*Guests:* ${eventRequest.guest_count}

*Customer Details:*
📧 Email: ${eventRequest.auth.users.email}
📱 Phone: ${eventRequest.auth.users.phone}

*Call Scheduled:* ${new Date(schedule.scheduled_time).toLocaleString()}

Please contact the customer to discuss their event requirements.
    `;

    // Send WhatsApp message using Twilio
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: process.env.ADMIN_WHATSAPP,
        message: message
      })
    });

    // Send email backup
    await sendEmailNotification(eventRequest, schedule);

    return { success: true };
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
    return { success: false, error };
  }
}
```

### 2. WhatsApp API Route (Twilio)

```typescript
// src/app/api/whatsapp/send/route.ts
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();

    const twilioMessage = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });

    return NextResponse.json({ 
      success: true, 
      messageId: twilioMessage.sid 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    );
  }
}
```

### 3. Email Backup Notification

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer';

export async function sendEmailNotification(eventRequest: any, schedule: any) {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const emailContent = `
    <h2>New Event Planning Request</h2>
    <p><strong>Event Type:</strong> ${eventRequest.events.name}</p>
    <p><strong>Location:</strong> ${eventRequest.location}</p>
    <p><strong>Date:</strong> ${new Date(eventRequest.date_time).toLocaleDateString()}</p>
    <p><strong>Budget:</strong> ₹${eventRequest.budget.toLocaleString()}</p>
    <p><strong>Guests:</strong> ${eventRequest.guest_count}</p>
    <p><strong>Call Scheduled:</strong> ${new Date(schedule.scheduled_time).toLocaleString()}</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Event Planning Request - EVEA',
    html: emailContent
  });
}
```

## 🔐 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number

# Admin Contact
ADMIN_WHATSAPP=+919876543210
ADMIN_EMAIL=admin@evea.com

# SMTP for Email Backup
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 📊 Sample Data

### Events Table
```sql
INSERT INTO events (name, category, description, base_price, min_guests, max_guests) VALUES
('Wedding', 'Celebration', 'Traditional Indian wedding ceremonies', 50000, 50, 500),
('Birthday Party', 'Celebration', 'Birthday celebrations and parties', 15000, 10, 100),
('Corporate Event', 'Business', 'Corporate meetings and events', 25000, 20, 200),
('Navratri', 'Cultural', 'Navratri celebrations and garba', 30000, 100, 1000);
```

### Packages Table
```sql
INSERT INTO packages (name, event_type, price_range_min, price_range_max, guest_range_min, guest_range_max, features) VALUES
('Basic', 'Wedding', 50000, 100000, 50, 150, '["Basic decoration", "Catering", "Photography"]'),
('Professional', 'Wedding', 100000, 200000, 150, 300, '["Premium decoration", "Multi-cuisine catering", "Professional photography", "Videography"]'),
('Premium', 'Wedding', 200000, 500000, 300, 500, '["Luxury decoration", "International cuisine", "Cinematic videography", "Live entertainment"]');
```

## 🚀 Deployment Checklist

- [ ] Set up Supabase database with all tables
- [ ] Configure environment variables
- [ ] Set up Twilio WhatsApp integration
- [ ] Configure SMTP for email notifications
- [ ] Test complete user flow
- [ ] Deploy to production
- [ ] Monitor WhatsApp delivery rates
- [ ] Set up admin dashboard for managing requests

## 📈 Analytics & Monitoring

- Track event request conversion rates
- Monitor WhatsApp message delivery success
- Analyze popular event types and packages
- Track call scheduling completion rates
- Monitor admin response times

---

*This documentation provides a complete implementation guide for the Plan Your Event feature with full frontend, backend, and integration details.*
