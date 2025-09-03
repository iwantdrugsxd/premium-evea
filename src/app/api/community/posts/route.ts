import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all community posts
export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new community post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      event_type,
      title,
      content,
      images,
      instagram_link,
      youtube_link,
      tags
    } = body;

    // Validate required fields
    if (!user_id || !event_type || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the post
    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        user_id,
        event_type,
        title,
        content,
        images: images || [],
        instagram_link,
        youtube_link,
        tags: tags || [],
        likes_count: 0,
        comments_count: 0,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      message: 'Post created successfully',
      post 
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json(
      { error: 'Failed to create community post' },
      { status: 500 }
    );
  }
}
