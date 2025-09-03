import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all events
    const { data: allEvents, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('name');

    if (eventsError) throw eventsError;

    // Filter events that have both services and packages
    const eventsWithData = [];
    
    for (const event of allEvents) {
      // Check if event has services
      const { data: services, error: servicesError } = await supabase
        .from('event_services')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);

      if (servicesError) continue;

      // Check if event has packages
      const { data: packages, error: packagesError } = await supabase
        .from('event_packages')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);

      if (packagesError) continue;

      // Only include events that have both services and packages
      if (services.length > 0 && packages.length > 0) {
        eventsWithData.push(event);
      }
    }

    return NextResponse.json({
      success: true,
      data: eventsWithData
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}