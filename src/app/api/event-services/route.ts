import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Fetch services for the specific event
    const { data: services, error } = await supabase
      .from('event_services')
      .select('*')
      .eq('event_id', eventId)
      .order('is_required', { ascending: false })
      .order('is_popular', { ascending: false })
      .order('service_name', { ascending: true });

    if (error) {
      console.error('Error fetching event services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch event services' },
        { status: 500 }
      );
    }

    // Group services by category for better organization
    const groupedServices = services.reduce((acc, service) => {
      const category = service.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      services,
      groupedServices,
      totalServices: services.length
    });

  } catch (error) {
    console.error('Error in event services API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, serviceName, serviceDescription, category, isRequired, isPopular } = body;

    if (!eventId || !serviceName || !serviceDescription || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: service, error } = await supabase
      .from('event_services')
      .insert({
        event_id: eventId,
        service_name: serviceName,
        service_description: serviceDescription,
        category,
        is_required: isRequired || false,
        is_popular: isPopular || false
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating event service:', error);
      return NextResponse.json(
        { error: 'Failed to create event service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      service,
      message: 'Event service created successfully'
    });

  } catch (error) {
    console.error('Error in event services API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      );
  }
}
