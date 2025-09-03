# Community Stories Setup Instructions

## 🚀 Quick Setup Guide

### 1. Environment Variables
Add these to your `.env.local` file:

```env
# Cloudinary Configuration (REQUIRED for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=evea_stories
```

### 2. Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com) and create an account
2. Get your credentials from the Dashboard
3. Create an upload preset:
   - Go to Settings > Upload
   - Create preset named `evea_stories`
   - Set to "Unsigned" for public uploads
   - Set folder to `evea/stories`

### 3. Database Setup
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database/create_community_tables.sql`
4. Execute the SQL

### 4. Test the Feature
1. Go to `/community` page
2. Click "Share Your Story"
3. Fill out the form and upload images
4. Submit and verify it appears in the feed

## 🔧 Troubleshooting

### Image Upload Issues
- Check Cloudinary credentials in `.env.local`
- Verify upload preset exists and is unsigned
- Check browser console for errors

### Database Issues
- Ensure tables were created successfully
- Check Supabase connection
- Verify RLS policies if enabled

### API Errors
- Check server logs for detailed error messages
- Verify all required fields are sent
- Check file size limits

## 📱 Features Available

✅ **Story Creation**: Rich form with image uploads
✅ **Image Management**: Cloudinary integration with previews
✅ **Social Features**: Likes and comments
✅ **Real-time Updates**: Live interaction counters
✅ **Responsive Design**: Works on all devices
✅ **Professional UI**: Modern card-based layout

## 🎯 Next Steps

1. Test basic functionality
2. Add user authentication
3. Implement story moderation
4. Add search and filtering
5. Enable notifications
