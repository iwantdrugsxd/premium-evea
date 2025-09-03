import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Like/Unlike a story
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user already liked this story
    const { data: existingLike, error: checkError } = await supabase
      .from('story_likes')
      .select('id')
      .eq('story_id', storyId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingLike) {
      // Unlike the story
      const { error: deleteError } = await supabase
        .from('story_likes')
        .delete()
        .eq('story_id', storyId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      return NextResponse.json({
        success: true,
        action: 'unliked',
        message: 'Story unliked successfully'
      });
    } else {
      // Like the story
      const { error: insertError } = await supabase
        .from('story_likes')
        .insert({
          story_id: storyId,
          user_id: userId,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      return NextResponse.json({
        success: true,
        action: 'liked',
        message: 'Story liked successfully'
      });
    }

  } catch (error) {
    console.error('Error toggling story like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle story like' },
      { status: 500 }
    );
  }
}

// GET - Check if user liked a story
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: like, error } = await supabase
      .from('story_likes')
      .select('id')
      .eq('story_id', storyId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      success: true,
      isLiked: !!like
    });

  } catch (error) {
    console.error('Error checking story like:', error);
    return NextResponse.json(
      { error: 'Failed to check story like' },
      { status: 500 }
    );
  }
}
