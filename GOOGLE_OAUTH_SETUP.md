# Google OAuth Setup Guide for EVEA

## 🔧 Required Environment Variables

Your `.env.local` file should contain these **exact** variable names:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_here_make_it_long_and_random

# Google OAuth Configuration (IMPORTANT: Use these exact names)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Admin Contact Information
ADMIN_WHATSAPP=+919876543210
ADMIN_EMAIL=admin@evea.com
ADMIN_NAME=EVEA Admin
```

## 🚀 Google Cloud Console Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "EVEA Event Planning" (or any name you prefer)
4. Click "Create"

### Step 2: Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google People API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name it "EVEA Web Client"

### Step 4: Configure OAuth Consent Screen
1. Go to "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "EVEA Event Planning"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email for testing)

### Step 5: Set Authorized Redirect URIs
In your OAuth 2.0 Client ID settings, add these redirect URIs:

**For Development:**
```
http://localhost:3000/api/auth/google/callback
```

**For Production (when you deploy):**
```
https://yourdomain.com/api/auth/google/callback
```

### Step 6: Get Your Credentials
1. Copy the **Client ID** → paste as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. Copy the **Client Secret** → paste as `GOOGLE_CLIENT_SECRET`

## 🔍 Troubleshooting Common Issues

### Issue 1: "Google OAuth not configured"
- Make sure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
- Restart your development server after adding env vars

### Issue 2: "redirect_uri_mismatch"
- Check that the redirect URI in Google Console exactly matches:
  `http://localhost:3000/api/auth/google/callback`
- Make sure there are no extra spaces or characters

### Issue 3: "invalid_client"
- Verify your Client ID and Client Secret are correct
- Make sure you're using the right project in Google Console

### Issue 4: "access_denied"
- Check OAuth consent screen is properly configured
- Make sure your email is added as a test user
- Verify the scopes include `email`, `profile`, `openid`

## 🧪 Testing Your Setup

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test Google Login:**
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google"
   - You should be redirected to Google's OAuth page
   - After authorization, you should be redirected back to `/plan-event`

3. **Check Console Logs:**
   - Look for "Google user info:" in your terminal
   - Check browser console for any errors

## 📝 Important Notes

- **Client ID** must start with `NEXT_PUBLIC_` to be accessible in the browser
- **Client Secret** should NOT have `NEXT_PUBLIC_` prefix (server-side only)
- Always restart your dev server after changing `.env.local`
- The redirect URI must match exactly (including http vs https)
- For production, update the redirect URI in Google Console

## 🚨 Security Best Practices

- Never commit `.env.local` to version control
- Use different Google OAuth apps for development and production
- Regularly rotate your Client Secret
- Use strong, unique JWT secrets
- Enable 2FA on your Google Cloud account

