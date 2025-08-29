# Email Notification Setup Guide

## Overview

The EVEA event planning system now uses Supabase's built-in email service to send professional notifications to admins when users create event planning requests.

## Features

- ✅ **Professional HTML Emails** - Beautifully formatted with EVEA branding
- ✅ **Complete Event Details** - All user requirements and package information
- ✅ **Customer Contact Info** - Phone number and scheduled call time
- ✅ **Quick Action Links** - Direct call and WhatsApp links
- ✅ **Request Tracking** - Unique request IDs for tracking

## Email Content

### Admin Notification Email Includes:

1. **Event Details Section**
   - Event type (Wedding, Corporate, etc.)
   - Location
   - Event date and time
   - Budget
   - Guest count
   - Selected package (Basic/Professional/Premium)
   - Additional notes (if any)

2. **Customer Information Section**
   - Phone number
   - Scheduled call time

3. **Quick Actions Section**
   - Direct call link
   - WhatsApp chat link
   - Request ID for tracking

4. **Professional Styling**
   - EVEA branding and colors
   - Responsive design
   - Both HTML and plain text versions

## Setup Instructions

### Step 1: Configure Supabase Email Settings

1. **Go to your Supabase Dashboard**
2. **Navigate to Settings → Auth**
3. **Configure SMTP Settings**:
   - Enable "Enable email confirmations"
   - Set up your SMTP provider (Gmail, SendGrid, etc.)
   - Or use Supabase's built-in email service

### Step 2: Update Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# Admin Email (update with your email)
ADMIN_EMAIL=admin@evea.com
```

### Step 3: Update Admin Settings in Database

Run this SQL in your Supabase SQL editor:

```sql
-- Update admin settings with your email
UPDATE public.admin_settings 
SET admin_email = 'your-email@example.com'
WHERE id = 1;

-- Or insert if not exists
INSERT INTO public.admin_settings (admin_whatsapp, admin_email, admin_name)
VALUES ('+919876543210', 'your-email@example.com', 'EVEA Admin')
ON CONFLICT (id) DO UPDATE SET
  admin_email = EXCLUDED.admin_email;
```

## Testing the Email System

1. **Complete an event planning request**:
   - Go to `http://localhost:3001/plan-event`
   - Fill out all steps
   - Submit the request

2. **Check your email**:
   - You should receive a professional HTML email
   - Check spam folder if not received

3. **Verify email content**:
   - All event details should be present
   - Links should work correctly
   - Styling should look professional

## Email Templates

The system uses dynamic HTML templates that include:

- **Header**: EVEA branding with gradient
- **Sections**: Organized information with clear labels
- **Highlight Box**: Important action items
- **Footer**: Professional signature and branding

## Troubleshooting

### Email Not Received
1. **Check spam folder**
2. **Verify SMTP settings in Supabase**
3. **Check admin email in database**
4. **Review server logs for errors**

### Email Formatting Issues
1. **Check HTML template in code**
2. **Test with different email clients**
3. **Verify CSS compatibility**

### API Errors
1. **Check Supabase service role key**
2. **Verify API endpoint is working**
3. **Review console logs for detailed errors**

## Production Considerations

1. **Use a professional SMTP service** (SendGrid, AWS SES, etc.)
2. **Set up email authentication** (SPF, DKIM, DMARC)
3. **Monitor email delivery rates**
4. **Set up email templates for different scenarios**
5. **Implement email tracking and analytics**

## Customization

You can customize the email template by editing the `adminEmailHtml` variable in `/api/call-schedules/route.ts`. The template includes:

- **Colors and branding**
- **Layout and sections**
- **Content organization**
- **Call-to-action buttons**

## Security Notes

- ✅ **No sensitive data in emails** - Only necessary information
- ✅ **Secure API endpoints** - Protected with service role key
- ✅ **Input validation** - All data is validated before sending
- ✅ **Error handling** - Graceful failure with detailed logging
