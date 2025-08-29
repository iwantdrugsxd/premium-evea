import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json({
        success: false,
        error: 'Event ID is required'
      }, { status: 400 });
    }

    console.log('🔍 Fetching services for event ID:', eventId);

    // Fetch event services for the specific event
    const { data: services, error } = await supabase
      .from('event_services')
      .select('*')
      .eq('event_id', eventId)
      .order('is_required', { ascending: false })
      .order('is_popular', { ascending: false })
      .order('category', { ascending: true });

    if (error) {
      console.error('❌ Error fetching event services:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString(),
        eventId
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch event services'
      }, { status: 500 });
    }

    // Group services by category
    const groupedServices = services.reduce((acc: any, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push({
        id: service.id,
        name: service.service_name,
        description: service.service_description,
        category: service.category,
        isRequired: service.is_required,
        isPopular: service.is_popular
      });
      return acc;
    }, {});

    console.log('✅ Successfully fetched event services:', {
      eventId,
      totalServices: services.length,
      categories: Object.keys(groupedServices),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      services: services.map(service => ({
        id: service.id,
        name: service.service_name,
        description: service.service_description,
        category: service.category,
        isRequired: service.is_required,
        isPopular: service.is_popular
      })),
      groupedServices: groupedServices,
      totalServices: services.length
    });

  } catch (error) {
    console.error('❌ Error in event-services API:', error);
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
