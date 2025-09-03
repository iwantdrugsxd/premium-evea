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
    const { id: eventId } = await params;

    const { data: packages, error } = await supabase
      .from('event_packages')
      .select('*')
      .eq('event_id', eventId)
      .order('name');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: packages
    });

  } catch (error) {
    console.error('Error fetching event packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event packages' },
      { status: 500 }
    );
  }
}
