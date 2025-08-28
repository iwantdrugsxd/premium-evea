import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('name');

    if (error) throw error;

    // Transform events to match the frontend expectations
    const transformedEvents = events?.map(event => ({
      id: event.id,
      name: event.name,
      category: event.name.toLowerCase().replace(/\s+/g, '-'), // Convert name to category
      description: event.description,
      base_price: parseFloat(event.avg_budget.replace(/[^\d.]/g, '')), // Extract numeric value
      min_guests: 50, // Default values
      max_guests: 500,
      is_active: true
    })) || [];

    console.log('✅ Successfully fetched events:', {
      count: transformedEvents.length,
      events: transformedEvents.map(e => ({ id: e.id, name: e.name, category: e.category })),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true,
      events: transformedEvents
    });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch events' 
      },
      { status: 500 }
    );
  }
}
