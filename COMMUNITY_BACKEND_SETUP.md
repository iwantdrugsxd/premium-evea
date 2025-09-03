# Community Stories Backend Setup

This document provides setup instructions for the community stories feature with Cloudinary integration.

## Prerequisites

1. **Supabase Project**: Ensure you have a Supabase project set up
2. **Cloudinary Account**: Create a Cloudinary account for image storage
3. **Environment Variables**: Configure the required environment variables

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=evea_stories
```

## Database Setup

1. **Run the SQL Schema**:
   - Open your Supabase dashboard
   - Go to the SQL Editor
   - Copy and paste the contents of `database/community_schema.sql`
   - Execute the SQL to create the required tables

2. **Verify Tables Created**:
   - `community_stories` - Main stories table
   - `story_likes` - Story likes tracking
   - `story_comments` - Story comments

## Cloudinary Setup

1. **Create Upload Preset**:
   - Go to your Cloudinary dashboard
   - Navigate to Settings > Upload
   - Create a new upload preset named `evea_stories`
   - Set it to "Unsigned" for public uploads
   - Configure folder: `evea/stories`

2. **Configure CORS** (if needed):
   - In Cloudinary settings, add your domain to allowed origins

## API Endpoints

### Stories
- `GET /api/stories` - Fetch all published stories
- `POST /api/stories` - Create a new story (with image upload)

### Story Interactions
- `GET /api/stories/[id]/like?userId=xxx` - Check if user liked a story
- `POST /api/stories/[id]/like` - Like/unlike a story
- `GET /api/stories/[id]/comments` - Fetch comments for a story
- `POST /api/stories/[id]/comments` - Add a comment to a story

## Features Implemented

### ✅ Story Creation
- Rich form with title, content, event type, location, date
- Multiple image upload with Cloudinary integration
- Tag system for categorization
- Real-time form validation

### ✅ Story Display
- Professional story cards with user information
- Image galleries with preview
- Event details and tags display
- Responsive design

### ✅ Social Features
- Like/unlike functionality
- Comment system with real-time updates
- User authentication checks
- Like and comment counters

### ✅ Image Management
- Cloudinary integration for secure image storage
- Multiple image upload support
- Image preview and removal
- Automatic image optimization

## Usage

1. **Share a Story**:
   - Click "Share Your Story" button on community page
   - Fill out the form with story details
   - Upload images (optional)
   - Add tags for better discoverability
   - Submit to publish

2. **Interact with Stories**:
   - Like stories by clicking the heart icon
   - Comment on stories by clicking the comment icon
   - View image galleries
   - Filter by event type

## Security Features

- Row Level Security (RLS) enabled on all tables
- User authentication checks for interactions
- Secure image upload with Cloudinary
- Input validation and sanitization

## Performance Optimizations

- Database indexes on frequently queried columns
- Pagination support for stories and comments
- Image optimization through Cloudinary
- Efficient query patterns with Supabase

## Testing

1. **Test Story Creation**:
   - Create a new story with images
   - Verify images are uploaded to Cloudinary
   - Check story appears in the community feed

2. **Test Interactions**:
   - Like/unlike stories
   - Add comments
   - Verify counters update correctly

3. **Test Image Upload**:
   - Upload multiple images
   - Verify image previews work
   - Check images are accessible via Cloudinary URLs

## Troubleshooting

### Common Issues

1. **Image Upload Fails**:
   - Check Cloudinary credentials
   - Verify upload preset is configured
   - Check CORS settings

2. **Database Errors**:
   - Ensure RLS policies are correct
   - Check user authentication
   - Verify table permissions

3. **API Errors**:
   - Check environment variables
   - Verify Supabase connection
   - Check API route implementations

### Debug Steps

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify database queries in Supabase dashboard
4. Test API endpoints directly with tools like Postman

## Future Enhancements

- User profiles and avatars
- Story categories and filtering
- Advanced search functionality
- Story moderation system
- Email notifications for interactions
- Story sharing and embedding
- Advanced analytics and insights
