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

    // Validate required fields
    if (!event_id || !location || !date_time || !budget || !guest_count) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // For now, we'll skip user_id since we don't have authentication set up
    // In a real app, you would get the user_id from the authenticated session
    
    // Insert the event request without user_id for now
    const { data: eventRequest, error } = await supabase
      .from('event_planning_requests')
      .insert({
        user_id: null, // Set to null for now
        event_id,
        location,
        event_date: date_time,
        budget,
        guest_count,
        additional_notes: additional_notes || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating event request:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString(),
        requestData: {
          event_id,
          location,
          date_time,
          budget,
          guest_count,
          additional_notes
        }
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to create event request'
      }, { status: 500 });
    }

    console.log('✅ Successfully created event request:', {
      id: eventRequest.id,
      event_id: eventRequest.event_id,
      location: eventRequest.location,
      budget: eventRequest.budget,
      guest_count: eventRequest.guest_count,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      event_request: eventRequest
    });

  } catch (error) {
    console.error('❌ Error in event-requests API:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const { data: eventRequests, error } = await supabase
      .from('event_planning_requests')
      .select(`
        *,
        events (
          id,
          name,
          description
        )
      `)
      .eq('user_id', parseInt(user_id))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching event requests:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString(),
        user_id
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch event requests'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      event_requests: eventRequests
    });

  } catch (error) {
    console.error('Error in event-requests API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
