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

    if (eventsError) {
      console.error('Database error, using mock data:', eventsError);
      // Return mock data when database is not accessible
      const mockEvents = [
        {
          id: 1,
          name: 'Wedding',
          category: 'wedding',
          description: 'Complete wedding planning and coordination',
          base_price: 50000.00,
          min_guests: 50,
          max_guests: 500,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Birthday Party',
          category: 'birthday',
          description: 'Fun and memorable birthday celebrations',
          base_price: 25000.00,
          min_guests: 10,
          max_guests: 100,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Corporate Event',
          category: 'corporate',
          description: 'Professional corporate event management',
          base_price: 75000.00,
          min_guests: 20,
          max_guests: 200,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Anniversary',
          category: 'anniversary',
          description: 'Romantic anniversary celebrations',
          base_price: 35000.00,
          min_guests: 20,
          max_guests: 150,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          name: 'Festival/Concert',
          category: 'festival',
          description: 'Large-scale festival and concert management',
          base_price: 100000.00,
          min_guests: 100,
          max_guests: 1000,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 6,
          name: 'Custom Event',
          category: 'custom',
          description: 'Unique custom event planning',
          base_price: 40000.00,
          min_guests: 10,
          max_guests: 300,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockEvents,
        message: 'Using mock data - database not accessible'
      });
    }

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

    // If no events have both services and packages, return all events
    if (eventsWithData.length === 0) {
      console.warn('No events with both services and packages found, returning all events');
      return NextResponse.json({
        success: true,
        data: allEvents,
        message: 'No events with complete data found'
      });
    }

    return NextResponse.json({
      success: true,
      data: eventsWithData
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    
    // Return mock data as fallback
    const mockEvents = [
      {
        id: 1,
        name: 'Wedding',
        category: 'wedding',
        description: 'Complete wedding planning and coordination',
        base_price: 50000.00,
        min_guests: 50,
        max_guests: 500,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Birthday Party',
        category: 'birthday',
        description: 'Fun and memorable birthday celebrations',
        base_price: 25000.00,
        min_guests: 10,
        max_guests: 100,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Corporate Event',
        category: 'corporate',
        description: 'Professional corporate event management',
        base_price: 75000.00,
        min_guests: 20,
        max_guests: 200,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Anniversary',
        category: 'anniversary',
        description: 'Romantic anniversary celebrations',
        base_price: 35000.00,
        min_guests: 20,
        max_guests: 150,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Festival/Concert',
        category: 'festival',
        description: 'Large-scale festival and concert management',
        base_price: 100000.00,
        min_guests: 100,
        max_guests: 1000,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Custom Event',
        category: 'custom',
        description: 'Unique custom event planning',
        base_price: 40000.00,
        min_guests: 10,
        max_guests: 300,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockEvents,
      message: 'Using mock data - database error occurred'
    });
  }
}