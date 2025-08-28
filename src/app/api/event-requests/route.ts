import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, location, date_time, budget, guest_count, additional_notes } = body;

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not authenticated' 
        },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!event_id || !location || !date_time || !budget || !guest_count) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Insert event request
    const { data, error } = await supabase
      .from('user_event_requests')
      .insert({
        user_id: user.id,
        event_id,
        location,
        date_time,
        budget,
        guest_count,
        additional_notes
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      event_request: data 
    });
  } catch (error) {
    console.error('Error creating event request:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create event request' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventRequestId = searchParams.get('id');

    // Get user from session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not authenticated' 
        },
        { status: 401 }
      );
    }

    if (eventRequestId) {
      // Get specific event request
      const { data, error } = await supabase
        .from('user_event_requests')
        .select(`
          *,
          events(name, category, description)
        `)
        .eq('id', eventRequestId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        event_request: data 
      });
    } else {
      // Get all event requests for user
      const { data, error } = await supabase
        .from('user_event_requests')
        .select(`
          *,
          events(name, category, description)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        event_requests: data 
      });
    }
  } catch (error) {
    console.error('Error fetching event requests:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch event requests' 
      },
      { status: 500 }
    );
  }
}
