import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Toggle like on a post or article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, item_id, item_type } = body; // item_type: 'post' or 'article'

    if (!user_id || !item_id || !item_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from('community_likes')
      .select('id')
      .eq('user_id', user_id)
      .eq('item_id', item_id)
      .eq('item_type', item_type)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    let isLiked = false;
    let newLikesCount = 0;

    if (existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from('community_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) throw deleteError;

      // Decrease likes count
      const tableName = item_type === 'post' ? 'community_posts' : 'community_articles';
      const { data: item, error: updateError } = await supabase
        .from(tableName)
        .select('likes_count')
        .eq('id', item_id)
        .single();

      if (updateError) throw updateError;

      newLikesCount = Math.max(0, (item.likes_count || 0) - 1);

      const { error: countError } = await supabase
        .from(tableName)
        .update({ likes_count: newLikesCount })
        .eq('id', item_id);

      if (countError) throw countError;
    } else {
      // Like - add the like
      const { error: insertError } = await supabase
        .from('community_likes')
        .insert({
          user_id,
          item_id,
          item_type
        });

      if (insertError) throw insertError;

      // Increase likes count
      const tableName = item_type === 'post' ? 'community_posts' : 'community_articles';
      const { data: item, error: updateError } = await supabase
        .from(tableName)
        .select('likes_count')
        .eq('id', item_id)
        .single();

      if (updateError) throw updateError;

      newLikesCount = (item.likes_count || 0) + 1;

      const { error: countError } = await supabase
        .from(tableName)
        .update({ likes_count: newLikesCount })
        .eq('id', item_id);

      if (countError) throw countError;

      isLiked = true;
    }

    return NextResponse.json({ 
      isLiked,
      likesCount: newLikesCount,
      message: isLiked ? 'Liked successfully' : 'Unliked successfully'
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
