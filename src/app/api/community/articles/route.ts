import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all community articles
export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from('community_articles')
      .select(`
        *,
        author:users(name, avatar_url)
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching community articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community articles' },
      { status: 500 }
    );
  }
}

// POST - Create a new community article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      author_id,
      category,
      title,
      excerpt,
      content,
      reading_time,
      cover_image,
      tags,
      is_draft = false
    } = body;

    // Validate required fields
    if (!author_id || !category || !title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the article
    const { data: article, error } = await supabase
      .from('community_articles')
      .insert({
        author_id,
        category,
        title,
        excerpt,
        content,
        reading_time: reading_time || '5 min read',
        cover_image,
        tags: tags || [],
        is_published: !is_draft,
        published_at: !is_draft ? new Date().toISOString() : null,
        views_count: 0,
        likes_count: 0,
        comments_count: 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      message: is_draft ? 'Article saved as draft' : 'Article published successfully',
      article 
    });
  } catch (error) {
    console.error('Error creating community article:', error);
    return NextResponse.json(
      { error: 'Failed to create community article' },
      { status: 500 }
    );
  }
}
