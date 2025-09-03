# Plan Event Flow - Backend Implementation

## Overview
Complete backend implementation for the plan-event flow with database integration, email notifications, and API endpoints.

## API Endpoints

### 1. Event Planning Requests
**POST** `/api/event-planning-requests`
- Creates a new event planning request
- Handles user creation/retrieval
- Creates event type if it doesn't exist
- Schedules consultation call
- Sends admin notification email

**GET** `/api/event-planning-requests/[id]`
- Retrieves a specific event planning request
- Includes user, event, and consultation call details

**PUT** `/api/event-planning-requests/[id]`
- Updates event planning request status
- Updates additional notes and package selection

### 2. Consultation Calls
**GET** `/api/consultation-calls?requestId={id}`
- Retrieves consultation call for a specific request

**POST** `/api/consultation-calls`
- Creates a new consultation call
- Links to event planning request

**PUT** `/api/consultation-calls`
- Updates consultation call status, notes, or scheduled time

### 3. Email Notifications
**POST** `/api/email/send`
- Sends email notifications (already implemented)
- Used for admin notifications

## Database Schema Integration

### Tables Used
1. **users** - User information
2. **events** - Event types and details
3. **event_planning_requests** - Main request data
4. **consultation_calls** - Scheduled consultation details

### Data Flow
1. User submits form → API validates data
2. Create/retrieve user record
3. Create/retrieve event type
4. Create event planning request
5. Create consultation call
6. Send admin notification email
7. Return success response with request ID

## Email Notification System

### Admin Notification
- **Recipient**: vnair0795@gmail.com
- **Subject**: New Event Planning Request - {eventType} - #EVE-{requestId}
- **Content**: Complete form details in HTML format
- **Includes**:
  - Event details (type, location, date, guests, budget)
  - Selected services
  - Package selection
  - Consultation schedule
  - Contact information
  - Additional notes

### Email Template Features
- Professional HTML design
- Gradient header with EVEA branding
- Organized sections with clear labels
- Responsive layout
- Fallback text version

## Frontend Integration

### Form Submission
- **Endpoint**: `/api/event-planning-requests`
- **Method**: POST
- **Payload**: Complete form data
- **Response**: Request ID and success status

### Success Handling
- Displays request ID
- Shows scheduled call information
- Provides team contact message
- Navigation options (home, community)

## Error Handling

### API Errors
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Database constraint violations

### Frontend Errors
- Network errors
- Validation failures
- User-friendly error messages
- Retry mechanisms

## Security Features

### Data Validation
- Required field validation
- Email format validation
- Phone number validation
- Date/time validation

### Database Security
- Parameterized queries
- Foreign key constraints
- Data type validation
- Service role authentication

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

## Testing

### API Testing
- Test form submission with valid data
- Test validation with missing fields
- Test email notification delivery
- Test database record creation

### Frontend Testing
- Test complete form flow
- Test error handling
- Test success page display
- Test navigation

## Deployment Notes

1. Ensure all environment variables are set
2. Verify Supabase connection
3. Test email configuration
4. Monitor API response times
5. Check database performance

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live status updates
2. **File Uploads**: Support for event images and documents
3. **Payment Integration**: Stripe integration for package payments
4. **Calendar Integration**: Google Calendar for consultation scheduling
5. **SMS Notifications**: Twilio integration for SMS reminders
6. **Admin Dashboard**: Web interface for managing requests
7. **Analytics**: Request tracking and reporting
8. **Multi-language**: Internationalization support

## Troubleshooting

### Common Issues
1. **Email not sending**: Check Gmail app password
2. **Database errors**: Verify Supabase connection
3. **Form validation**: Check required fields
4. **API timeouts**: Increase timeout limits

### Debug Steps
1. Check browser console for errors
2. Verify API endpoint responses
3. Check Supabase logs
4. Test email configuration
5. Validate environment variables
