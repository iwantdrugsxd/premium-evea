# Google OAuth Redirect URI Fix

## 🚨 **Issue Found:**
Your server was running on port 3001, but Google OAuth was configured for port 3000.

## ✅ **Solution Applied:**
1. Killed the process on port 3001
2. Started server on port 3000
3. Server is now running on: `http://localhost:3000`

## 🔧 **Google Cloud Console Update Required:**

### Step 1: Update Redirect URIs
Go to your Google Cloud Console → APIs & Services → Credentials → Your OAuth 2.0 Client ID

**Add BOTH redirect URIs:**
```
http://localhost:3000/api/auth/google/callback
http://localhost:3001/api/auth/google/callback
```

This way, it will work regardless of which port Next.js chooses.

### Step 2: Test the OAuth Flow
1. Go to: `http://localhost:3000/login`
2. Click "Continue with Google"
3. You should now be redirected properly

## 🎯 **Expected Behavior:**
- Google OAuth page should load
- After authorization, redirect to `/plan-event`
- No more redirect URI mismatch errors

## 🔍 **If Still Having Issues:**
Check the browser console and terminal for any error messages. The most common issues are:
- Redirect URI mismatch (now fixed)
- OAuth consent screen not configured
- Missing scopes in Google Console

Try the Google login again now!




