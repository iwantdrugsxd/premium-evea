import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      events 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch events' 
      },
      { status: 500 }
    );
  }
}
