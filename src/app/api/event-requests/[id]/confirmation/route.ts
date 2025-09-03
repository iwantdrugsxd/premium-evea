import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventRequestId = params.id;

    if (!eventRequestId) {
      return NextResponse.json({
        success: false,
        error: 'Event request ID is required'
      }, { status: 400 });
    }

    // Get event request details with related data
    const { data: eventRequest, error: eventError } = await supabase
      .from('event_planning_requests')
      .select(`
        *,
        events (
          id,
          name,
          description
        ),
        consultation_calls (
          id,
          scheduled_time,
          user_email,
          status
        )
      `)
      .eq('id', eventRequestId)
      .single();

    if (eventError || !eventRequest) {
      console.error('❌ Error fetching event request:', eventError);
      return NextResponse.json({
        success: false,
        error: 'Event request not found'
      }, { status: 404 });
    }

    // Get the latest consultation call
    const latestCall = eventRequest.consultation_calls?.[0];

    if (!latestCall) {
      return NextResponse.json({
        success: false,
        error: 'No consultation call found for this event request'
      }, { status: 404 });
    }

    // Format confirmation data
    const confirmationData = {
      eventType: eventRequest.events?.name || 'Custom Event',
      location: eventRequest.location,
      date: eventRequest.event_date,
      budget: eventRequest.budget,
      guestCount: eventRequest.guest_count,
      scheduledTime: latestCall.scheduled_time,
      userEmail: latestCall.user_email,
      package: eventRequest.selected_package || 'basic',
      additionalNotes: eventRequest.additional_notes,
      requestId: eventRequest.id,
      callId: latestCall.id
    };

    console.log('✅ Confirmation data fetched successfully:', {
      eventRequestId,
      confirmationData: {
        eventType: confirmationData.eventType,
        location: confirmationData.location,
        scheduledTime: confirmationData.scheduledTime,
        userEmail: confirmationData.userEmail
      }
    });

    return NextResponse.json({
      success: true,
      confirmation: confirmationData
    });

  } catch (error) {
    console.error('❌ Error in confirmation API:', error);
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
