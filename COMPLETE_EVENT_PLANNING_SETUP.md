# 🎯 Complete Event Planning System Setup Guide

## **Overview**
This guide will help you set up the complete event planning system with:
- Event selection from available events
- Service selection for chosen events
- Package selection (Basic, Professional, Premium)
- Event details input (location, time, date, budget, guest count)
- Email submission to admin (vnair0795@gmail.com)
- Complete backend and frontend integration

## **🚀 Quick Start**

### **1. Database Setup**
Run this SQL script in your Supabase dashboard:

```sql
-- Run the complete setup script
\i setup-complete-event-planning.sql
```

### **2. Test the System**
Run the test script to verify everything is working:

```bash
node test-complete-event-planning.js
```

### **3. Access the Frontend**
Navigate to: `http://localhost:3000/plan-event`

## **📋 Complete Flow Breakdown**

### **Step 1: Event Selection**
- User sees list of available events from database
- Each event shows name, icon, and service count
- Professional UI with hover effects and animations

### **Step 2: Service Selection**
- User selects services for their chosen event
- Services are fetched from `event_services` table
- Required services are auto-selected
- Popular services are highlighted

### **Step 3: Package Selection**
- User chooses from 3 packages: Basic, Professional, Premium
- Packages are fetched from `event_packages` table
- Each package shows features and pricing

### **Step 4: Event Details**
- User inputs event specifics:
  - Event name
  - Guest count
  - Location
  - Budget
  - Special requirements

### **Step 5: Scheduling**
- User provides scheduling details:
  - Preferred date
  - Preferred time
  - Duration
  - Flexibility

### **Step 6: Contact & Submission**
- User provides contact information
- System submits complete event planning request
- Email is sent to admin (vnair0795@gmail.com)
- Request is stored in database

## **🗄️ Database Schema**

### **Tables Created/Used:**

1. **`events`** - Event types with service categories
2. **`event_services`** - Services available for each event
3. **`event_packages`** - Package options for each event
4. **`event_planning_requests`** - User requests
5. **`users`** - User information

### **Key Relationships:**
- Events → Event Services (one-to-many)
- Events → Event Packages (one-to-many)
- Users → Event Planning Requests (one-to-many)
- Events → Event Planning Requests (one-to-many)

## **🔧 API Endpoints**

### **1. Events API**
```
GET /api/events
- Fetches all available events with packages
- Filters events based on available vendor services
```

### **2. Event Services API**
```
GET /api/event-services?event_id={id}
- Fetches services for a specific event
- Returns required, popular, and all services
```

### **3. Event Planning API**
```
POST /api/event-planning
- Creates event planning request
- Creates/updates user record
- Sends email to admin

GET /api/event-planning
- Fetches all event planning requests
- Includes related event and package data
```

### **4. Email API**
```
POST /api/email/send
- Sends emails to specified recipients
- Used for admin notifications
```

## **🎨 Frontend Components**

### **1. EventTypeSelection**
- Professional event cards with hover effects
- Service and package count badges
- Responsive grid layout

### **2. ServiceSelection**
- Categorized service display
- Required vs. optional services
- Popular service highlighting

### **3. PackageSelection**
- Package comparison cards
- Feature lists and pricing
- Selection indicators

### **4. EventDetailsForm**
- Comprehensive event details input
- Budget and guest count selection
- Special requirements field

### **5. SchedulingForm**
- Date and time selection
- Duration options
- Flexibility preferences

### **6. EmailForm**
- Contact information collection
- Email preview
- Submission handling

## **📧 Email System**

### **Admin Email Content:**
- Event type and package details
- Location, date, and budget information
- Guest count and special requirements
- User contact information
- Selected services list
- Request ID and status

### **Email Recipient:**
- **Primary:** vnair0795@gmail.com (Admin)
- **Subject:** "New Event Planning Request"
- **Format:** HTML with structured information

## **🧪 Testing**

### **1. Unit Tests**
- Test each API endpoint individually
- Verify data validation and error handling

### **2. Integration Tests**
- Test complete flow from frontend to backend
- Verify database operations and email sending

### **3. End-to-End Tests**
- Test complete user journey
- Verify all data is captured and stored

## **🚨 Troubleshooting**

### **Common Issues:**

1. **Database Connection Errors**
   - Check Supabase credentials
   - Verify table permissions

2. **Email Sending Failures**
   - Check email API configuration
   - Verify admin email address

3. **Frontend Loading Issues**
   - Check API endpoints
   - Verify component imports

4. **Data Not Persisting**
   - Check database constraints
   - Verify API error handling

### **Debug Commands:**
```bash
# Check API status
curl http://localhost:3000/api/events

# Test email sending
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'

# Check database tables
# Run in Supabase SQL editor:
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM event_services;
SELECT COUNT(*) FROM event_packages;
```

## **📈 Monitoring & Analytics**

### **Key Metrics to Track:**
- Event planning requests per day
- Most popular event types
- Service selection patterns
- Package preference distribution
- Email delivery success rate

### **Database Queries:**
```sql
-- Daily request count
SELECT DATE(created_at), COUNT(*) 
FROM event_planning_requests 
GROUP BY DATE(created_at) 
ORDER BY DATE(created_at) DESC;

-- Popular event types
SELECT e.name, COUNT(*) as request_count
FROM event_planning_requests epr
JOIN events e ON epr.event_id = e.id
GROUP BY e.id, e.name
ORDER BY request_count DESC;

-- Service popularity
SELECT es.service_name, COUNT(*) as selection_count
FROM event_planning_requests epr
CROSS JOIN LATERAL jsonb_array_elements_text(epr.selected_services) AS service
JOIN event_services es ON es.service_name = service
GROUP BY es.service_name
ORDER BY selection_count DESC;
```

## **🔮 Future Enhancements**

### **Planned Features:**
1. **Vendor Integration**
   - Connect selected services to actual vendors
   - Real-time availability checking

2. **Payment Processing**
   - Package payment integration
   - Deposit and final payment handling

3. **Calendar Integration**
   - Google Calendar sync
   - Automated scheduling

4. **Progress Tracking**
   - Real-time event planning status
   - Milestone tracking

5. **Communication Hub**
   - In-app messaging
   - File sharing and collaboration

## **📞 Support**

### **For Technical Issues:**
- Check the troubleshooting section above
- Review API response logs
- Verify database schema and data

### **For Feature Requests:**
- Document specific requirements
- Consider impact on existing flow
- Plan database schema changes

---

## **🎉 You're All Set!**

Your complete event planning system is now ready to:
- ✅ Accept event planning requests
- ✅ Manage service selections
- ✅ Handle package choices
- ✅ Collect event details
- ✅ Send admin notifications
- ✅ Store all data securely

**Next step:** Test the complete flow and start planning events! 🚀
