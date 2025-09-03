# Quick Email Setup for eveateam2025@gmail.com

## 🚨 URGENT: Add These Lines to Your `.env.local` File

Add these lines to your `.env.local` file:

```bash
# Email Configuration for Real Email Sending
EMAIL_USER=eveateam2025@gmail.com
EMAIL_PASS=your-gmail-app-password
```

## 🔑 How to Get Gmail App Password

1. **Go to Google Account Settings**: https://myaccount.google.com/
2. **Navigate to Security** → **2-Step Verification** (enable if not already)
3. **Go to App passwords**
4. **Generate new app password** for "Mail"
5. **Copy the 16-character password**
6. **Paste it in EMAIL_PASS** in your `.env.local` file

## ✅ Test Email Sending

After adding the credentials, run:

```bash
node test-email-config.js
```

## 📧 Expected Result

You should see:
- ✅ "Email sent successfully via Nodemailer"
- ✅ Real emails sent from eveateam2025@gmail.com to vnair0795@gmail.com
- ✅ Professional HTML emails with event details

## 🔍 Troubleshooting

### If emails still don't send:
1. Check Gmail 2FA is enabled for eveateam2025@gmail.com
2. Verify app password is correct (16 characters)
3. Check spam folder
4. Restart your Next.js server after adding env vars

### If you get authentication errors:
1. Make sure you're using app password, not regular password
2. Check Gmail account settings for eveateam2025@gmail.com
3. Try generating a new app password

## 🎯 Quick Test

Run this command to test email immediately:

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "vnair0795@gmail.com",
    "subject": "Test Email from EVEA Team",
    "html": "<h1>Test Email</h1><p>This is a test email from EVEA system.</p>",
    "text": "Test Email - This is a test email from EVEA system."
  }'
```

---

**Note**: This setup will send REAL emails from eveateam2025@gmail.com to vnair0795@gmail.com using Gmail SMTP.
