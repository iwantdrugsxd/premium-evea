import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_request_id, selected_package } = body;

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
    if (!event_request_id || !selected_package) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Verify event request belongs to user
    const { data: eventRequest, error: eventError } = await supabase
      .from('user_event_requests')
      .select('*')
      .eq('id', event_request_id)
      .eq('user_id', user.id)
      .single();

    if (eventError || !eventRequest) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Event request not found' 
        },
        { status: 404 }
      );
    }

    // Update event request with selected package
    const { data, error } = await supabase
      .from('user_event_requests')
      .update({ 
        selected_package,
        updated_at: new Date().toISOString()
      })
      .eq('id', event_request_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      event_request: data 
    });
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update package' 
      },
      { status: 500 }
    );
  }
}
