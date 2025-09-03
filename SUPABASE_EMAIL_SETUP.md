# Supabase Email Service Setup Guide

This guide will help you set up Supabase's default email service for the plan-event flow without using external email providers like Resend.

## 📋 Prerequisites

1. Supabase project created
2. Next.js application running
3. Environment variables configured

## 🔧 Step 1: Environment Variables Setup

### Required Variables
Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# JWT Secret (generate this)
JWT_SECRET=your_generated_jwt_secret

# Admin Configuration
ADMIN_EMAIL=admin@evea.com
ADMIN_WHATSAPP=+1234567890

# Optional: Edge Function URL
SUPABASE_EDGE_FUNCTION_URL=https://your-project-ref.supabase.co/functions/v1/send-email
```

### Generate JWT Secret
```bash
# Run this command to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Step 2: Deploy Edge Function

### Option A: Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the Edge Function
supabase functions deploy send-email
```

### Option B: Using Supabase Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Edge Functions** in the left sidebar
4. Click **Create a new function**
5. Name it `send-email`
6. Copy the code from `supabase/functions/send-email/index.ts`
7. Click **Deploy**

## 📧 Step 3: Configure Email Service

### Check Email Service Status
1. Go to your Supabase Dashboard
2. Navigate to **Settings** > **API**
3. Check if email service is enabled
4. Note your project reference (you'll need this for the Edge Function URL)

### Set Edge Function URL
After deploying the Edge Function, set the URL in your `.env.local`:

```bash
SUPABASE_EDGE_FUNCTION_URL=https://your-project-ref.supabase.co/functions/v1/send-email
```

Replace `your-project-ref` with your actual project reference.

## 🧪 Step 4: Test the Setup

### Run the Test Script
```bash
cd evea-nextjs
node test-supabase-email-flow.js
```

### Expected Output
```
============================================================
  SUPABASE EMAIL FLOW TEST
============================================================

ℹ️ Testing plan-event flow with Supabase default email service...

----------------------------------------
  1. ENVIRONMENT VARIABLES CHECK
----------------------------------------
✅ NEXT_PUBLIC_SUPABASE_URL: https://your...
✅ SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOi...
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOi...
✅ JWT_SECRET: your_generated_secret...
✅ SUPABASE_EDGE_FUNCTION_URL: https://your-project-ref.supabase.co/functions/v1/send-email
✅ ADMIN_EMAIL: admin@evea.com
```

## 🔍 Step 5: Verify Email Service

### Test Email Sending
The test script will verify:
1. ✅ Environment variables are set correctly
2. ✅ Supabase email service is configured
3. ✅ Edge Function is deployed and accessible
4. ✅ Plan-event flow scenarios work correctly
5. ✅ Email sending via both API and Edge Function

### Check Logs
Monitor the logs in:
- **Supabase Dashboard** > **Edge Functions** > **send-email** > **Logs**
- **Next.js console** when running the application
- **Test script output** for detailed results

## 🎯 Step 6: Plan-Event Flow Verification

### Test Scenarios
The test script validates these scenarios:

1. **Logged-in User with Complete Profile**
   - Complete event planning process
   - Schedule call successfully
   - Admin receives email notification
   - User sees confirmation page
   - No redirect to login required

2. **Logged-in User with Incomplete Profile**
   - Complete event planning process
   - Schedule call successfully
   - Admin receives email notification
   - Redirect to login page
   - After login, redirect to confirmation page

3. **Non-Logged-in User**
   - Complete event planning process
   - Schedule call successfully
   - Admin receives email notification
   - Redirect to login page
   - After login, redirect to confirmation page

## 📊 Step 7: Monitor and Debug

### Check Email Delivery
1. **Admin Notifications**: Check the email configured in `ADMIN_EMAIL`
2. **User Confirmations**: Check the user's email address
3. **Edge Function Logs**: Monitor for any errors

### Common Issues and Solutions

#### Issue: "Email service not configured"
**Solution:**
```bash
# Check if Edge Function is deployed
supabase functions list

# Redeploy if needed
supabase functions deploy send-email
```

#### Issue: "Missing environment variables"
**Solution:**
```bash
# Verify .env.local file exists and has all required variables
cat .env.local

# Generate missing JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Issue: "Edge Function not accessible"
**Solution:**
1. Check the Edge Function URL in your `.env.local`
2. Verify the project reference is correct
3. Ensure the function is deployed and active

#### Issue: "Supabase email service failed"
**Solution:**
1. Check Supabase project settings
2. Verify service role key has proper permissions
3. Check if email service is enabled in your plan

## 🔄 Step 8: Production Deployment

### Environment Variables for Production
```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
JWT_SECRET=your_production_jwt_secret
ADMIN_EMAIL=admin@evea.com
SUPABASE_EDGE_FUNCTION_URL=https://your-project-ref.supabase.co/functions/v1/send-email
```

### Deploy Edge Function to Production
```bash
# Deploy to production
supabase functions deploy send-email --project-ref your-project-ref
```

## 📈 Step 9: Performance Optimization

### Email Queue (Optional)
For high-volume applications, consider implementing email queuing:

1. **Database Queue**: Store emails in a queue table
2. **Background Processing**: Process emails asynchronously
3. **Rate Limiting**: Implement rate limiting for email sending

### Monitoring
1. **Email Delivery Rates**: Monitor successful vs failed emails
2. **Response Times**: Track email sending performance
3. **Error Rates**: Monitor and alert on email failures

## 🛡️ Step 10: Security Considerations

### Environment Variables
- ✅ Never commit sensitive keys to version control
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly

### Email Content
- ✅ Sanitize user inputs in email content
- ✅ Use proper HTML escaping
- ✅ Validate email addresses before sending

### Access Control
- ✅ Use service role key only on the server side
- ✅ Implement proper authentication for email endpoints
- ✅ Rate limit email sending to prevent abuse

## 📞 Support

If you encounter issues:

1. **Check the test script output** for detailed error messages
2. **Review Supabase documentation** for email service setup
3. **Check Edge Function logs** for debugging information
4. **Verify environment variables** are set correctly

## 🎉 Success Indicators

You'll know the setup is working when:

1. ✅ Test script runs without errors
2. ✅ Admin receives email notifications for new event requests
3. ✅ Users can complete the plan-event flow successfully
4. ✅ Confirmation page displays correctly
5. ✅ Redirect logic works for non-logged-in users

## 📝 Next Steps

After successful setup:

1. **Customize Email Templates**: Update email content and styling
2. **Add Email Tracking**: Implement open/click tracking
3. **Set up Notifications**: Configure admin notifications
4. **Monitor Performance**: Set up monitoring and alerting
5. **Scale Up**: Implement email queuing for high volume

---

**Note**: This setup uses Supabase's default email service. For production applications with high email volume, consider using dedicated email service providers like SendGrid, Mailgun, or AWS SES.
