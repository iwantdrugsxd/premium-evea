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

    console.log('📥 Received package update request:', {
      body,
      event_request_id,
      selected_package,
      event_request_id_type: typeof event_request_id,
      selected_package_type: typeof selected_package,
      timestamp: new Date().toISOString()
    });

    // Validate required fields
    if (!event_request_id || !selected_package) {
      console.error('❌ Missing required fields:', {
        event_request_id: event_request_id,
        selected_package: selected_package,
        event_request_id_exists: !!event_request_id,
        selected_package_exists: !!selected_package
      });
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: event_request_id, selected_package'
      }, { status: 400 });
    }

    // Validate package name
    const validPackages = ['basic', 'professional', 'premium'];
    if (!validPackages.includes(selected_package)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid package name. Must be one of: basic, professional, premium'
      }, { status: 400 });
    }

    // Update the event request with selected package
    const { data: updatedRequest, error } = await supabase
      .from('event_planning_requests')
      .update({
        selected_package,
        // Note: package_id is not set here since we're using selected_package as a string
        // In a real app, you might want to map selected_package to actual package_id
        updated_at: new Date().toISOString()
      })
      .eq('id', event_request_id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating event request:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString(),
        requestData: {
          event_request_id,
          selected_package
        }
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to update event request'
      }, { status: 500 });
    }

    if (!updatedRequest) {
      return NextResponse.json({
        success: false,
        error: 'Event request not found'
      }, { status: 404 });
    }

    console.log('✅ Successfully updated event request package:', {
      event_request_id,
      selected_package,
      updatedRequest: {
        id: updatedRequest.id,
        selected_package: updatedRequest.selected_package,
        status: updatedRequest.status
      },
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      event_request: updatedRequest
    });

  } catch (error) {
    console.error('❌ Error in update-package API:', error);
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
