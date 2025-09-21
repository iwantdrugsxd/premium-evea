# Complete Google OAuth Fix

## 🚨 **Current Issue:**
The Google OAuth callback is working, but there's a redirect URI mismatch because:
1. Your server is now running on port 3000 ✅
2. But Google Cloud Console redirect URI might still be set to port 3001 ❌

## 🔧 **Step-by-Step Fix:**

### Step 1: Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. In "Authorized redirect URIs", make sure you have:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
5. Remove any port 3001 entries
6. Click "Save"

### Step 2: Test the OAuth Flow
1. Go to: `http://localhost:3000/login`
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth page
4. After authorization, you should be redirected back to `/plan-event`

### Step 3: If Still Having Issues
Check the browser console for any error messages. Common issues:

**Error: "redirect_uri_mismatch"**
- Solution: Update Google Cloud Console redirect URI to port 3000

**Error: "access_denied"**
- Solution: Check OAuth consent screen configuration
- Make sure your email is added as a test user

**Error: "invalid_client"**
- Solution: Verify Client ID and Client Secret are correct

## 🎯 **Expected Flow:**
1. Click "Continue with Google" → Google OAuth page
2. Authorize the app → Redirect to `/api/auth/google/callback`
3. Server processes the code → Redirect to `/plan-event`
4. User is logged in and can see event planning page

## 🔍 **Debug Steps:**
1. Check browser console for errors
2. Check terminal logs for server errors
3. Verify redirect URI in Google Console
4. Test with a fresh browser session

Try the Google login now with the updated redirect URI!




