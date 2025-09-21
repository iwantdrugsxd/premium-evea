# Cloudinary Setup Guide for EVEA Community Stories

## Quick Fix for Current Issue

**The error shows**: `"Upload preset not found"` for preset `evea_stories`

**Immediate solution**: Create the upload preset with the exact name `evea_stories`

## Step-by-Step Setup

### 1. Create Cloudinary Account
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for a free account
- Verify your email

### 2. Get Your Credentials
- Go to Dashboard → Account Details
- Copy these values:
  - **Cloud Name** (e.g., `dackojgpt`)
  - **API Key** (e.g., `123456789012345`)
  - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 3. Create Upload Preset
- Go to Dashboard → Settings → Upload
- Scroll to "Upload presets"
- Click "Add upload preset"
- Set these values:
  - **Preset name**: `evea_stories` (exactly this name)
  - **Signing Mode**: `Unsigned`
  - **Folder**: `evea_stories` (optional)
  - **Allowed formats**: `jpg, png, gif, webp`
  - **Max file size**: `10MB`
  - **Transformation**: None (or add if you want)
- Click "Save"

### 4. Add Environment Variables
Create/update your `.env.local` file in the `evea-nextjs` folder:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_UPLOAD_PRESET=evea_stories

# Other existing variables...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 5. Restart Your Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Test the Setup

1. Go to `/community` page
2. Click "Share Your Story"
3. Add some images
4. Submit the form
5. Check the console for Cloudinary success messages

## Troubleshooting

### "Upload preset not found" Error
- **Solution**: Make sure the preset name is exactly `evea_stories` (case-sensitive)
- **Check**: Go to Cloudinary Dashboard → Settings → Upload → Upload presets

### "Invalid API key" Error
- **Solution**: Verify your API key and secret are correct
- **Check**: Copy from Cloudinary Dashboard → Account Details

### "Cloud name not found" Error
- **Solution**: Verify your cloud name is correct
- **Check**: It's in your Cloudinary URL: `https://res.cloudinary.com/YOUR_CLOUD_NAME/...`

### Images not uploading
- **Check**: Browser console for JavaScript errors
- **Check**: Server terminal for API errors
- **Verify**: Environment variables are loaded correctly

## Security Notes

- **Never commit** `.env.local` to version control
- **Use unsigned uploads** for public image uploads (more secure)
- **Set file size limits** in both frontend and Cloudinary preset
- **Restrict file types** to images only

## Alternative: Use Different Preset Name

If you want to use a different preset name:

1. Create the preset with your preferred name
2. Update `CLOUDINARY_UPLOAD_PRESET` in `.env.local`
3. Restart the server

## Current Status

✅ **Frontend**: Fixed and working  
✅ **Backend API**: Ready and configured  
❌ **Cloudinary**: Needs preset creation  
✅ **Database**: Tables created automatically  

Once you create the `evea_stories` preset, everything should work perfectly!
