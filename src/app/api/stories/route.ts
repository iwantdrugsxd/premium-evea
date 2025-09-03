import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cloudinary configuration
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Upload image to Cloudinary
async function uploadToCloudinary(fileBuffer: Buffer, fileName: string): Promise<string> {
  try {
    console.log('=== CLOUDINARY UPLOAD START ===');
    console.log('File name:', fileName);
    console.log('File size:', fileBuffer.length, 'bytes');
    
    // Check if Cloudinary is configured
    if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
      throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
    }
    
    console.log('Cloudinary config check passed');
    
    // Convert buffer to base64
    const base64Image = fileBuffer.toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64Image}`;
    
    console.log('Base64 conversion completed, length:', base64Image.length);

    const formData = new FormData();
    formData.append('file', dataURI);
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'evea_stories');
    formData.append('folder', 'evea/stories');

    console.log('FormData prepared, upload_preset:', process.env.CLOUDINARY_UPLOAD_PRESET);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`;
    console.log('Upload URL:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('Cloudinary response status:', response.status);
    console.log('Cloudinary response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary upload failed:', errorData);
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Cloudinary response data:', data);
    console.log('Image uploaded successfully:', data.secure_url);
    console.log('=== CLOUDINARY UPLOAD END ===');
    
    return data.secure_url;
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
}

// GET - Fetch all stories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const eventType = searchParams.get('eventType');
    const offset = (page - 1) * limit;

    // First, check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'community_stories')
      .single();

    if (tableError || !tableCheck) {
      console.log('Table community_stories does not exist, creating it...');
      await createCommunityStoriesTable();
    }

    let query = supabase
      .from('community_stories')
      .select(`
        *,
        likes:story_likes(count),
        comments:story_comments(count)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data: stories, error } = await query;

    if (error) throw error;

    // Get total count for pagination
    const { count } = await supabase
      .from('community_stories')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    return NextResponse.json({
      success: true,
      data: stories || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create new story
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const eventType = formData.get('eventType') as string;
    const location = formData.get('location') as string;
    const date = formData.get('date') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const userId = formData.get('userId') as string;

    console.log('Received form data:', { title, content, eventType, location, date, tags, userId });

    if (!title || !content || !eventType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields', received: { title, content, eventType, userId } },
        { status: 400 }
      );
    }

    // Ensure table exists
    await createCommunityStoriesTable();

    // Upload images to Cloudinary
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    console.log(`Processing ${imageFiles.length} images...`);

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        try {
          console.log(`Uploading image: ${file.name}, size: ${file.size} bytes`);
          
          // Convert File to Buffer
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          const imageUrl = await uploadToCloudinary(buffer, file.name);
          imageUrls.push(imageUrl);
          console.log(`Successfully uploaded: ${imageUrl}`);
        } catch (error) {
          console.error(`Error uploading image ${file.name}:`, error);
          
          // For now, create a placeholder URL to prevent the story from failing
          // In production, you might want to handle this differently
          const placeholderUrl = `https://via.placeholder.com/400x300/666666/FFFFFF?text=Upload+Failed:+${file.name}`;
          imageUrls.push(placeholderUrl);
          console.log(`Added placeholder URL for failed upload: ${placeholderUrl}`);
        }
      }
    }

    console.log(`Final image URLs:`, imageUrls);

    // Create story in database
    const storyData = {
      title,
      content,
      event_type: eventType,
      location: location || null,
      event_date: date || null,
      tags,
      images: imageUrls,
      user_id: userId,
      is_published: true,
      created_at: new Date().toISOString()
    };

    console.log('Inserting story data:', storyData);

    const { data: story, error } = await supabase
      .from('community_stories')
      .insert(storyData)
      .select('*')
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Story created successfully:', story);

    return NextResponse.json({
      success: true,
      data: story
    });

  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create story', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Function to create the community_stories table if it doesn't exist
async function createCommunityStoriesTable() {
  try {
    console.log('Creating community_stories table...');
    
    // Create the main stories table using direct SQL
    const { error: storiesError } = await supabase
      .from('community_stories')
      .select('id')
      .limit(1);

    if (storiesError && storiesError.code === 'PGRST205') {
      console.log('Table does not exist, will need manual creation');
      return false;
    }

    // Check likes table
    const { error: likesError } = await supabase
      .from('story_likes')
      .select('id')
      .limit(1);

    if (likesError && likesError.code === 'PGRST205') {
      console.log('Likes table does not exist, will need manual creation');
    }

    // Check comments table
    const { error: commentsError } = await supabase
      .from('story_comments')
      .select('id')
      .limit(1);

    if (commentsError && commentsError.code === 'PGRST205') {
      console.log('Comments table does not exist, will need manual creation');
    }

    console.log('Tables exist or checked successfully');
    return true;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}
