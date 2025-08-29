# Email Setup with Resend (Recommended)

## Why Resend?

- ✅ **Free tier**: 3,000 emails/month free
- ✅ **Simple setup**: Just API key needed
- ✅ **Reliable delivery**: 99.9% delivery rate
- ✅ **No SMTP configuration**: Works out of the box
- ✅ **Professional emails**: Beautiful HTML templates

## Setup Steps

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### Step 2: Get Your API Key

1. Go to your Resend dashboard
2. Navigate to **API Keys**
3. Click **Create API Key**
4. Copy the API key (starts with `re_`)

### Step 3: Add to Environment Variables

Add this to your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Your admin email
ADMIN_EMAIL=your-email@example.com
```

### Step 4: Update Admin Email in Database

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

### Step 5: Test the Email System

1. **Complete an event planning request**:
   - Go to `http://localhost:3001/plan-event`
   - Fill out all steps
   - Submit the request

2. **Check your email**:
   - You should receive a professional HTML email
   - Check spam folder if not received

## Email Features

### What You'll Receive:

1. **Event Details Section**
   - Event type (Wedding, Corporate, etc.)
   - Location
   - Event date and time
   - Budget
   - Guest count
   - Selected package (Basic/Professional/Premium)
   - Additional notes (if any)

2. **Customer Information Section**
   - Email address
   - Scheduled call time

3. **Quick Actions Section**
   - Direct email link
   - Phone call link
   - Request ID for tracking

4. **Professional Styling**
   - EVEA branding and colors
   - Responsive design
   - Both HTML and plain text versions

## Troubleshooting

### Email Not Received
1. **Check spam folder**
2. **Verify RESEND_API_KEY in .env.local**
3. **Check admin email in database**
4. **Review server logs for errors**

### API Key Issues
1. **Make sure API key starts with `re_`**
2. **Check Resend dashboard for usage limits**
3. **Verify email domain is verified in Resend**

### Database Issues
1. **Run the SQL script to update admin email**
2. **Check if admin_settings table has data**
3. **Verify user_email column exists in consultation_calls**

## Production Considerations

1. **Verify your domain** in Resend dashboard
2. **Set up SPF/DKIM records** for better delivery
3. **Monitor email delivery rates**
4. **Set up webhooks** for delivery tracking

## Alternative: Gmail SMTP

If you prefer Gmail:

1. **Enable 2-Factor Authentication** on your Gmail
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → App passwords
   - Generate for "Mail"
3. **Add to .env.local**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   ```

## Current Status

The system is now configured to:
- ✅ Collect email addresses from users
- ✅ Send professional HTML emails to admin
- ✅ Include all event details and contact information
- ✅ Work with Resend (recommended) or Gmail SMTP

**Test the complete flow now!** 🚀
