# Email Service Test for Plan-Event Flow

This document explains how to test the email service functionality in the plan-event flow, including both logged-in and non-logged-in user scenarios.

## Overview

The plan-event flow includes email notifications that are sent when:
1. A user completes the event planning process
2. A consultation call is scheduled
3. Admin notifications are sent for new event requests

## Test Scripts

### 1. Simulation Test Script (`test-email-plan-event-flow.js`)

This script simulates the email service functionality without making actual API calls.

**Usage:**
```bash
cd evea-nextjs
node test-email-plan-event-flow.js
```

**What it tests:**
- Environment variable validation
- Logged-in user flow simulation
- Non-logged-in user flow simulation
- Email sending simulation
- Generates a test report

### 2. Real API Test Script (`test-email-plan-event-flow-real.js`)

This script makes actual API calls to test the email service functionality.

**Usage:**
```bash
cd evea-nextjs
node test-email-plan-event-flow-real.js
```

**Prerequisites:**
- Next.js server must be running (`npm run dev`)
- All environment variables must be configured
- Supabase connection must be working

**What it tests:**
- Server connectivity
- Real API calls to create event requests
- Real email sending via API and Edge Functions
- User authentication flow
- Redirect logic for non-logged-in users

## Environment Variables Required

### Required Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
```

### Optional Variables
```bash
RESEND_API_KEY=your_resend_api_key
SUPABASE_EDGE_FUNCTION_URL=your_edge_function_url
ADMIN_EMAIL=admin@evea.com
ADMIN_WHATSAPP=+1234567890
TEST_BASE_URL=http://localhost:3000
```

## Plan-Event Flow Overview

### 1. Logged-in User Flow

When a user is logged in and has complete profile information:

1. **Event Type Selection** - User selects event type (wedding, corporate, etc.)
2. **Event Details** - User fills in location, date, budget, guest count
3. **Service Selection** - User selects required services
4. **Package Selection** - User chooses a package (basic, professional, premium)
5. **Call Scheduling** - User schedules a consultation call
6. **Email Notification** - Admin receives email with event details and call schedule
7. **Confirmation** - User sees confirmation page with call details

### 2. Non-Logged-in User Flow

When a user is not logged in or has incomplete profile:

1. **Event Planning Process** - Same steps 1-5 as above
2. **Redirect Logic** - System checks if user has complete profile
3. **Login Redirect** - If incomplete, redirects to login page
4. **Post-Login Redirect** - After login, redirects to confirmation page
5. **Email Notification** - Admin receives email with event details
6. **Confirmation** - User sees confirmation page with call details

## Email Service Components

### 1. API Route (`/api/email/send`)

Handles email sending via Resend API:
- Validates email data
- Sends emails using Resend service
- Returns success/failure status

### 2. Edge Function (`/supabase/functions/send-email`)

Supabase Edge Function for email sending:
- Multiple fallback methods (sendRawEmail, Resend, simulation)
- Handles CORS and authentication
- Provides detailed logging

### 3. Call Scheduling (`/api/call-schedules`)

Creates consultation call records and sends admin notifications:
- Creates call schedule in database
- Updates event request status
- Sends email notification to admin
- Includes event details and call information

## Test Scenarios

### Scenario 1: Complete User Profile
```
User Status: Logged in with complete profile
Expected Flow:
1. Complete event planning process
2. Schedule call successfully
3. Admin receives email notification
4. User sees confirmation page
5. No redirect to login required
```

### Scenario 2: Incomplete User Profile
```
User Status: Logged in but missing phone/location
Expected Flow:
1. Complete event planning process
2. Schedule call successfully
3. Admin receives email notification
4. Redirect to login page
5. After login, redirect to confirmation page
```

### Scenario 3: Non-Logged-in User
```
User Status: Not logged in
Expected Flow:
1. Complete event planning process
2. Schedule call successfully
3. Admin receives email notification
4. Redirect to login page
5. After login, redirect to confirmation page
```

## Email Templates

### Admin Notification Email
- **Subject**: "🎉 New Event Planning Request - [Event Type]"
- **Content**: Event details, customer information, call schedule
- **Recipient**: Admin email (from admin_settings table)

### User Confirmation Email
- **Subject**: "🎉 Your Event Planning Request - EVEA"
- **Content**: Confirmation message, call details, next steps
- **Recipient**: User's email address

## Confirmation Page

The confirmation page (`/plan-event/confirmation`) shows:
- Event details (type, location, date, budget, guests)
- Scheduled call information
- Next steps for the user
- Contact information

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   ```
   Error: NEXT_PUBLIC_SUPABASE_URL is not set
   Solution: Check .env.local file and ensure all required variables are set
   ```

2. **Server Not Running**
   ```
   Error: Server connectivity test failed
   Solution: Start the Next.js server with `npm run dev`
   ```

3. **Email Service Not Working**
   ```
   Error: Email sending failed
   Solution: Check Resend API key and Edge Function deployment
   ```

4. **Database Connection Issues**
   ```
   Error: Supabase connection failed
   Solution: Verify Supabase URL and service role key
   ```

### Debug Steps

1. **Check Environment Variables**
   ```bash
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
   ```

2. **Test Supabase Connection**
   ```bash
   curl http://localhost:3000/api/test-supabase
   ```

3. **Test Email Service**
   ```bash
   curl -X POST http://localhost:3000/api/email/send \
     -H "Content-Type: application/json" \
     -d '{"to":"test@example.com","subject":"Test","text":"Test email"}'
   ```

4. **Check Logs**
   - Next.js server logs
   - Supabase Edge Function logs
   - Browser console logs

## Test Reports

Both test scripts generate detailed reports:

- **Simulation Report**: `email-test-report.json`
- **Real API Report**: `real-email-test-report.json`

Reports include:
- Test results summary
- Environment information
- Failed test details
- Recommendations for fixes

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **API Keys**: Use service role keys only on the server side
3. **User Data**: Validate and sanitize all user inputs
4. **Email Content**: Use proper HTML escaping for email content

## Performance Considerations

1. **Email Queue**: Consider implementing email queuing for high volume
2. **Rate Limiting**: Implement rate limiting for email sending
3. **Caching**: Cache user profile data to reduce database calls
4. **Error Handling**: Implement proper error handling and retry logic

## Future Enhancements

1. **Email Templates**: Create more sophisticated email templates
2. **SMS Notifications**: Add SMS notifications for call reminders
3. **Email Tracking**: Implement email open/click tracking
4. **Automated Testing**: Add automated tests to CI/CD pipeline
5. **Email Preferences**: Allow users to set email preferences
