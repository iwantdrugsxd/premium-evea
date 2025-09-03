# Simple Email Setup Guide

## 🔧 Quick Fix for Email Issues

### **Problem**: Emails are not being sent (falling back to simulation)

### **Solution**: Use simple nodemailer service

## 📧 Step 1: Configure Email Service

Add these variables to your `.env.local`:

```bash
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Base URL for internal API calls
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🔑 Step 2: Get Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** > **2-Step Verification**
3. Go to **App passwords**
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_PASS`

## 🚀 Step 3: Test Email Service

Run the test script to verify email is working:

```bash
node test-complete-plan-event-flow.js
```

## 📊 What's Fixed

### **✅ Event Request Lookup**
- Fixed `.single()` issue causing "Cannot coerce to JSON object"
- Now uses proper array handling

### **✅ Email Service**
- Primary: Edge Function (if configured)
- Fallback: Simple nodemailer service
- Final fallback: Simulation (for development)

### **✅ Call Schedules API**
- Fixed 404 errors
- Proper error handling
- Multiple email service fallbacks

## 🎯 Minimal Code Changes

### **1. Fixed Call Schedules API** (`/api/call-schedules/route.ts`)
```typescript
// Changed from .single() to array handling
const { data: eventRequests, error: eventError } = await supabase
  .from('event_planning_requests')
  .select(`*`)
  .eq('id', event_request_id);

if (!eventRequests || eventRequests.length === 0) {
  return NextResponse.json({
    success: false,
    error: 'Event request not found'
  }, { status: 404 });
}

const eventRequest = eventRequests[0];
```

### **2. Added Simple Email Service** (`/api/email/send-simple/route.ts`)
```typescript
// Simple nodemailer service
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### **3. Enhanced Email Fallback**
```typescript
// Multiple fallback levels
1. Edge Function (primary)
2. Supabase email service
3. Simple nodemailer service
4. Simulation (development)
```

## ✅ Expected Results

After setup, you should see:
- ✅ Event requests created successfully
- ✅ Call schedules created without 404 errors
- ✅ Real emails sent to admin
- ✅ No more "Cannot coerce to JSON object" errors

## 🔍 Troubleshooting

### **Email Still Not Sending**
1. Check `EMAIL_USER` and `EMAIL_PASS` are set correctly
2. Verify Gmail app password is correct
3. Check Gmail 2FA is enabled

### **Event Request Still Failing**
1. Check database connection
2. Verify event_planning_requests table exists
3. Check Supabase permissions

### **Call Schedules Still 404**
1. Ensure event request ID exists in database
2. Check admin_settings table has records
3. Verify consultation_calls table exists

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Test script shows "Email sent successfully"
- ✅ Admin receives real email notifications
- ✅ No more simulation messages in logs
- ✅ Call schedules created without errors

---

**Note**: This setup uses Gmail for simplicity. For production, consider using dedicated email services like SendGrid, Mailgun, or AWS SES.
