import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const { data: consultationCall, error } = await supabase
      .from('consultation_calls')
      .select(`
        *,
        event_planning_requests!inner(
          id,
          user_id,
          event_id,
          location,
          event_date,
          budget,
          guest_count,
          selected_package,
          additional_notes,
          selected_services,
          status
        )
      `)
      .eq('event_planning_request_id', requestId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Consultation call not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: consultationCall
    });

  } catch (error) {
    console.error('Error fetching consultation call:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultation call' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventPlanningRequestId,
      scheduledTime,
      userWhatsapp,
      userEmail,
      notes,
      status = 'scheduled'
    } = body;

    // Validate required fields
    if (!eventPlanningRequestId || !scheduledTime || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: eventPlanningRequestId, scheduledTime, userEmail' },
        { status: 400 }
      );
    }

    // Create consultation call
    const { data: consultationCall, error } = await supabase
      .from('consultation_calls')
      .insert({
        event_planning_request_id: eventPlanningRequestId,
        scheduled_time: new Date(scheduledTime),
        user_whatsapp: userWhatsapp,
        user_email: userEmail,
        status: status,
        notes: notes || ''
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      consultationId: consultationCall.id,
      message: 'Consultation call scheduled successfully'
    });

  } catch (error) {
    console.error('Error creating consultation call:', error);
    return NextResponse.json(
      { error: 'Failed to create consultation call' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes, scheduledTime } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Consultation call ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (scheduledTime) updateData.scheduled_time = new Date(scheduledTime);

    const { data: consultationCall, error } = await supabase
      .from('consultation_calls')
      .update(updateData)
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Consultation call updated successfully'
    });

  } catch (error) {
    console.error('Error updating consultation call:', error);
    return NextResponse.json(
      { error: 'Failed to update consultation call' },
      { status: 500 }
    );
  }
}
