# 🖼️ Cloudinary Setup Guide for Image Uploads

## 🚀 Quick Setup (5 minutes)

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up For Free"
3. Complete registration (no credit card required)

### 2. Get Your Credentials
1. After login, go to **Dashboard**
2. Copy these values:
   - **Cloud Name** (e.g., `d123456789`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnop`)

### 3. Create Upload Preset
1. In Dashboard, go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Set **Preset name**: `evea_stories`
5. Set **Signing Mode**: `Unsigned`
6. Set **Folder**: `evea/stories`
7. Click **Save**

### 4. Add Environment Variables
Add these to your `.env.local` file:

```env
# Cloudinary Configuration (REQUIRED for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_UPLOAD_PRESET=evea_stories
```

### 5. Restart Your Server
```bash
npm run dev
```

## 🔧 Testing the Setup

### Test with Frontend
1. Go to `/community` page
2. Click "Share Your Story"
3. Upload an image
4. Check browser console for logs
5. Check server terminal for Cloudinary logs

### Test with API
```bash
curl -X POST http://localhost:3001/api/stories \
  -F "title=Test Story" \
  -F "content=Testing image upload" \
  -F "eventType=Test Event" \
  -F "userId=test-user" \
  -F "tags=[\"test\"]" \
  -F "images=@/path/to/test-image.jpg"
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cloudinary configuration is incomplete"
**Solution**: Check your `.env.local` file has all required variables

#### 2. "Upload preset not found"
**Solution**: Ensure preset name is exactly `evea_stories` and is unsigned

#### 3. "Invalid cloud name"
**Solution**: Verify your cloud name from Dashboard

#### 4. Images not uploading
**Solution**: Check server logs for detailed error messages

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   echo $CLOUDINARY_CLOUD_NAME
   echo $CLOUDINARY_API_KEY
   echo $CLOUDINARY_API_SECRET
   echo $CLOUDINARY_UPLOAD_PRESET
   ```

2. **Check Server Logs**: Look for Cloudinary upload logs

3. **Test Upload Preset**: Try uploading manually in Cloudinary Dashboard

4. **Check File Types**: Ensure images are JPG, PNG, or GIF

## 📱 Features Available

✅ **Multiple Image Upload**: Up to 10 images per story
✅ **Drag & Drop**: Modern file selection interface
✅ **File Validation**: Size and type checking
✅ **Image Preview**: See images before upload
✅ **Cloudinary Storage**: Secure, optimized hosting
✅ **CDN Delivery**: Fast loading worldwide
✅ **Automatic Optimization**: Cloudinary handles image processing

## 🎯 Next Steps

1. **Test Basic Upload**: Upload a small image (under 1MB)
2. **Test Multiple Images**: Upload 2-3 images at once
3. **Test Large Images**: Try images around 5-10MB
4. **Test Different Formats**: JPG, PNG, GIF
5. **Verify in Database**: Check that image URLs are stored

## 📞 Support

If you're still having issues:

1. Check the server logs for detailed error messages
2. Verify your Cloudinary credentials
3. Ensure the upload preset is configured correctly
4. Test with a simple image first

## 🔒 Security Notes

- **API Secret**: Never expose this in frontend code
- **Upload Preset**: Set to "unsigned" for public uploads
- **File Limits**: Currently set to 10MB per image, 10 images max
- **File Types**: Only image files are accepted
