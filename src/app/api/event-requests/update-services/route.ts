import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_request_id, selected_services } = body;

    console.log('📥 Received services update request:', {
      event_request_id,
      selected_services,
      event_request_id_type: typeof event_request_id,
      selected_services_type: typeof selected_services,
      timestamp: new Date().toISOString()
    });

    // Validate required fields
    if (!event_request_id || !selected_services) {
      console.error('❌ Missing required fields:', {
        event_request_id: event_request_id,
        selected_services: selected_services,
        event_request_id_exists: !!event_request_id,
        selected_services_exists: !!selected_services
      });
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: event_request_id, selected_services'
      }, { status: 400 });
    }

    // Validate selected_services is an array
    if (!Array.isArray(selected_services)) {
      return NextResponse.json({
        success: false,
        error: 'selected_services must be an array'
      }, { status: 400 });
    }

    // Update the event request with selected services
    const { data: updatedRequest, error } = await supabase
      .from('event_planning_requests')
      .update({
        selected_services,
        updated_at: new Date().toISOString()
      })
      .eq('id', event_request_id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating event request with services:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString(),
        event_request_id,
        selected_services
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to update event request with services'
      }, { status: 500 });
    }

    console.log('✅ Successfully updated event request with services:', {
      event_request_id,
      selected_services_count: selected_services.length,
      updated_request: updatedRequest,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Event request updated with services successfully',
      event_request: updatedRequest
    });

  } catch (error) {
    console.error('❌ Error in update-services API:', error);
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
