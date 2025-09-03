import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;

    const { data: planningRequest, error } = await supabase
      .from('event_planning_requests')
      .select(`
        *,
        users!inner(
          id,
          full_name,
          email,
          mobile_number,
          location
        ),
        events!inner(
          id,
          name,
          description,
          icon,
          features,
          avg_budget,
          duration,
          team_size
        ),
        consultation_calls(
          id,
          scheduled_time,
          user_whatsapp,
          user_email,
          status,
          notes
        )
      `)
      .eq('id', requestId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Event planning request not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: planningRequest
    });

  } catch (error) {
    console.error('Error fetching event planning request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event planning request' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const body = await request.json();
    const { status, additional_notes, selected_package } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (additional_notes) updateData.additional_notes = additional_notes;
    if (selected_package) updateData.selected_package = selected_package;

    const { data: planningRequest, error } = await supabase
      .from('event_planning_requests')
      .update(updateData)
      .eq('id', requestId)
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Event planning request updated successfully'
    });

  } catch (error) {
    console.error('Error updating event planning request:', error);
    return NextResponse.json(
      { error: 'Failed to update event planning request' },
      { status: 500 }
    );
  }
}
