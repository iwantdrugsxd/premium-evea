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

    const { data: services, error } = await supabase
      .from('event_services')
      .select('*')
      .eq('event_id', eventId)
      .order('category', { ascending: true })
      .order('is_required', { ascending: false })
      .order('is_popular', { ascending: false });

    if (error) throw error;

    // Group services by category
    const groupedServices = services.reduce((acc: any, service: any) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        services: services,
        groupedServices: groupedServices
      }
    });

  } catch (error) {
    console.error('Error fetching event services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event services' },
      { status: 500 }
    );
  }
}
