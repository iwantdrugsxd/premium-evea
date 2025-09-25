# Email OTP Setup Guide

## 1. Environment Variables Setup

Add these variables to your `.env.local` file:

```bash
# Email Configuration (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 2. Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled
4. Go to App passwords
5. Generate a new app password for "Mail"
6. Use this password as `EMAIL_PASS` in your environment variables

## 3. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your environment variables

## 4. Test the Setup

Run the image upload script:
```bash
node upload-images-to-cloudinary.js
```

## 5. Features Implemented

### Email OTP System
- ✅ Send OTP to email during signup
- ✅ 6-digit OTP verification
- ✅ 10-minute expiration
- ✅ Resend functionality with cooldown
- ✅ Beautiful email template
- ✅ Auto-focus and paste support

### Cloudinary Integration
- ✅ Upload Google Drive images to Cloudinary
- ✅ Automatic image optimization
- ✅ Organized folder structure
- ✅ Generate updated SQL with Cloudinary URLs

### Updated Signup Flow
1. User fills signup form
2. System sends OTP to email
3. User enters OTP
4. Account is created after verification
5. User is redirected to login

## 6. Next Steps

1. Set up your environment variables
2. Test the OTP functionality
3. Run the image upload script
4. Update your database with the new vendor data
5. Test the complete signup flow

## 7. Troubleshooting

### Email not sending
- Check Gmail app password
- Verify EMAIL_USER and EMAIL_PASS
- Check Gmail security settings

### Cloudinary upload failing
- Verify Cloudinary credentials
- Check image URLs are accessible
- Ensure sufficient Cloudinary credits

### OTP verification failing
- Check server logs
- Verify email format
- Check OTP expiration (10 minutes)
