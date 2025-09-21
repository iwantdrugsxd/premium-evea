# 🎉 Plan Event Flow - Complete Documentation

## 📋 Overview
Complete end-to-end documentation for the Plan Event feature, covering user journey, frontend components, backend APIs, database schema, and notifications.

## 🚀 User Journey
1. Open `/plan-event`
2. Step 1: Choose event type
3. Step 2: Select desired services
4. Step 3: Enter event details (location, budget, guests, notes)
5. Step 4: Choose a package (Basic/Professional/Premium)
6. Step 5: Schedule preferred date/time for call by evea partners for giving qoutation and fine tuning the requirements
7. Step 6: Share contact details and email and submit
8. Email sent to admin; request saved; status updated on scheduling

## 🎨 Frontend (orchestrator + components)
- **Orchestrator**: `src/app/plan-event/page.tsx`
- **Components**:
  - `EventTypeSelection` – step 1 card grid
  - `ServiceSelection` – required/popular tags
  - `EventDetailsForm` – location/budget/guests/notes
  - `PackageSelection` – 3-tier compare
  - `SchedulingForm` – preferred date/time/duration/flexibility
  - `EmailForm` – name/email/phone; triggers submission
  - `ConfirmationStep` – final confirmation

## 🔧 Backend APIs
- **GET `/api/events`**
  - Returns events filtered by available vendor categories + attached packages
- **GET `/api/event-services?event_id`**
  - Returns services and groupedServices for an event
- **POST `/api/event-planning`**
  - Body: eventId, packageId, location, eventDate, budget, guestCount, selectedPackage, additionalNotes, selectedServices[], userEmail, userName, userPhone
  - Creates/gets `users` record, inserts `event_planning_requests`, emails admin, returns requestId 
- **POST `/api/packages/recommend`**
  - Body: event_id, budget, guest_count
  - Returns up to 3 packages (basic/professional/premium), with defaults if none match
- **POST `/api/call-schedules`**
  - Body: event_request_id, scheduled_time, user_email
  - Inserts `consultation_calls`, sets request status to confirmed, emails admin

## 🗄️ Database (key tables/fields)
- **`events`**: id, name, description, service_categories[], icon, features[], avg_budget, duration, team_size
- **`event_services`**: id, event_id, service_name, service_description, category, is_required, is_popular
- **`event_packages`**: id, event_id, name, description, price, features[]
- **`users`**: id, full_name, email, mobile_number, location
- **`event_planning_requests`**: id, user_id, event_id, package_id, location, event_date, budget, guest_count, selected_package, status, additional_notes, selected_services[]
- **`consultation_calls`**: id, event_planning_request_id, scheduled_time, user_email, admin_whatsapp, status
- **`admin_settings`**: admin_email, admin_whatsapp, is_active (used by call scheduling)

## 📧 Notifications
- **Email API**: `POST /api/email/send`
  - Primary: Gmail SMTP via Nodemailer; fallback: Supabase auth admin sendRawEmail (default service)
- **Admin recipient**: from `admin_settings.admin_email`; event creation additionally sends to `vnair0795@gmail.com`

## 🔐 Environment Variables (minimum)
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Base URL**: `NEXT_PUBLIC_BASE_URL`
- **Email**: `EMAIL_USER`, `EMAIL_PASS` (for primary SMTP); Supabase works as fallback
- **Admin settings**: seeded in DB (`admin_settings` table)

## 🧪 Testing and URLs
- **Frontend**: `/plan-event`
- **Test scripts**: `test-complete-event-planning.js`, `test-plan-event-page.js`
- **APIs health check**: open `/api/events`, `/api/event-services?event_id=1`

---

**Status**: ✅ Complete, unified documentation covering user flow, frontend pieces, API endpoints, DB schema, email, environment variables, and tests, aligned to current code and default Supabase email setup.


