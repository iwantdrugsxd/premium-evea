# 🎉 Complete Setup Guide - Event Services & Email Fix

## 📋 **What's New**
- ✅ **Event Services Selection**: Users can now select specific services for their event type
- ✅ **Email Notifications**: Fixed admin email notifications using Resend
- ✅ **5-Step Flow**: Event Type → Details → Services → Package → Schedule Call

## 🚀 **Step-by-Step Setup**

### **Step 1: Fix Email Issue (CRITICAL)**
Run this SQL in your Supabase SQL Editor:

```sql
-- FINAL EMAIL FIX
DELETE FROM public.admin_settings;
INSERT INTO public.admin_settings (admin_whatsapp, admin_email, admin_name, is_active) 
VALUES ('+919876543210', 'vnair0795@gmail.com', 'EVEA Admin', true);
```

### **Step 2: Create Event Services Database**
Run this SQL in your Supabase SQL Editor:

```sql
-- Event Services Without Pricing
DROP TABLE IF EXISTS public.event_services;

CREATE TABLE public.event_services (
  id SERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  service_name VARCHAR NOT NULL,
  service_description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  is_required BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert services for each event type
-- (The full SQL is in event-services-no-pricing.sql)
```

### **Step 3: Environment Variables**
Make sure your `.env.local` has:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend Email
RESEND_API_KEY=your_resend_api_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **Step 4: Install Dependencies**
```bash
npm install resend
```

## 🎯 **How It Works**

### **Event Services Flow:**
1. **User selects event type** (Wedding, Corporate, etc.)
2. **User fills event details** (location, date, budget, guests)
3. **User selects services** (Photography, Catering, Decoration, etc.)
4. **User chooses package** (Basic, Professional, Premium)
5. **User schedules consultation call**

### **Service Categories (Based on JustDial):**
- 📸 **Photography** - Event photography services
- 🍽️ **Catering** - Food and beverage services
- 🎨 **Decoration** - Venue decoration and setup
- 🎵 **Entertainment** - Music, DJ, performers
- 🚗 **Transportation** - Vehicle services
- 🏢 **Venue** - Event space booking
- 💻 **Technology** - Audio/visual equipment
- 💄 **Beauty & Makeup** - Styling services
- 📝 **Stationery** - Invitations and materials
- 🎁 **Gifts & Souvenirs** - Party favors
- 🍰 **Food & Beverages** - Special food items
- 📋 **Event Management** - Planning and coordination
- 🏷️ **Branding** - Custom branding materials

### **Service Features:**
- ✅ **Required Services**: Auto-selected, cannot be deselected
- ⭐ **Popular Services**: Highlighted as recommended
- 📂 **Categorized**: Services grouped by category
- 🎯 **Event-Specific**: Different services for each event type

## 📧 **Email Notifications**

### **Admin Email Content:**
```
🎉 NEW EVENT BOOKING!

Event Details:
━━━━━━━━━━━━━━━
📌 Event Type: Wedding
📍 Location: Mumbai, Maharashtra
📅 Date: 15/12/2024
⏰ Time: 2:00 PM
💰 Budget: ₹500,000
👥 Guests: 200
📦 Package: PROFESSIONAL

Selected Services:
━━━━━━━━━━━━━━━
✅ Wedding Photography (Required)
✅ Wedding Catering (Required)
✅ Wedding Decoration (Required)
✅ Wedding Music (Popular)
✅ Wedding Makeup (Popular)

Customer Contact:
━━━━━━━━━━━━━━━
📧 Email: user@example.com
📞 Call Scheduled: 20/11/2024 3:00 PM

Quick Actions:
━━━━━━━━━━━━━━━
📧 Reply to customer: user@example.com
📋 View in dashboard: http://localhost:3000/admin/events/123
```

## 🔧 **API Endpoints**

### **GET /api/event-services?event_id=1**
Returns services for a specific event type:
```json
{
  "success": true,
  "services": [
    {
      "id": 1,
      "name": "Wedding Photography",
      "description": "Professional photography covering ceremony and reception",
      "category": "Photography",
      "isRequired": true,
      "isPopular": true
    }
  ],
  "groupedServices": {
    "Photography": [...],
    "Catering": [...],
    "Decoration": [...]
  }
}
```

## 🎨 **UI Features**

### **Service Selection Interface:**
- 🎯 **Category-based grouping** with emoji icons
- ✅ **Checkbox selection** with visual feedback
- 🔴 **Required services** marked with orange badges
- ⭐ **Popular services** marked with yellow badges
- 📊 **Selection summary** showing chosen services
- 🎨 **Glassmorphism design** matching landing page

### **Responsive Design:**
- 📱 **Mobile-first** approach
- 🖥️ **Desktop optimized** with side-by-side layout
- 🎭 **Smooth animations** using Framer Motion
- 🌈 **Gradient accents** and hover effects

## 🐛 **Troubleshooting**

### **Email Not Working:**
1. Check Resend API key in `.env.local`
2. Verify admin email in database
3. Check browser console for errors
4. Ensure `NEXT_PUBLIC_BASE_URL` is set

### **Services Not Loading:**
1. Run the event services SQL script
2. Check event ID mapping
3. Verify API endpoint `/api/event-services`
4. Check browser network tab

### **Database Errors:**
1. Ensure all tables exist
2. Check foreign key constraints
3. Verify data types match
4. Run verification queries

## 📊 **Database Schema**

### **event_services Table:**
```sql
CREATE TABLE public.event_services (
  id SERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id),
  service_name VARCHAR NOT NULL,
  service_description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  is_required BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🎯 **Next Steps**

1. **Test the complete flow** from event selection to email
2. **Customize service categories** for your specific needs
3. **Add more event types** if needed
4. **Implement admin dashboard** to view bookings
5. **Add service pricing** if required later

## 🎉 **Success Indicators**

✅ **Email working**: Admin receives detailed booking emails
✅ **Services loading**: All event types show relevant services
✅ **Flow complete**: Users can go through all 5 steps
✅ **Data saved**: All selections stored in database
✅ **UI responsive**: Works on all device sizes

---

**Need help?** Check the terminal logs for detailed error messages and debugging information.
