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

    // OPTIMIZED: Use single query with JOINs instead of N+1 queries
    const { data: eventsWithData, error: joinError } = await supabase
      .from('events')
      .select(`
        *,
        event_services!inner(id),
        event_packages!inner(id)
      `)
      .order('name');

    if (joinError) {
      console.error('Join query error, falling back to all events:', joinError);
      // Fallback to all events if join fails
      return NextResponse.json({
        success: true,
        data: allEvents,
        message: 'Using all events - join query failed'
      });
    }

    // Return optimized results
    return NextResponse.json({
      success: true,
      data: eventsWithData || [],
      message: eventsWithData?.length > 0 ? 'Events with services and packages found' : 'No events with complete data found'
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