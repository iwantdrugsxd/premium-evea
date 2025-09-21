import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch event types with counts
export async function GET(request: NextRequest) {
  try {
    // Get event types and their counts from community_stories
    const { data: eventTypes, error } = await supabase
      .from('community_stories')
      .select('event_type')
      .eq('is_published', true);

    if (error) throw error;

    // Count occurrences of each event type
    const eventTypeCounts: { [key: string]: number } = {};
    eventTypes?.forEach(story => {
      const eventType = story.event_type;
      eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
    });

    // Convert to array format with image paths
    const eventTypesWithCounts = Object.entries(eventTypeCounts).map(([name, count]) => ({
      name,
      count,
      image: `/event-images/${name.toLowerCase().replace(/\s+/g, '-')}.png`
    }));

    // Sort by count (descending)
    eventTypesWithCounts.sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: eventTypesWithCounts
    });

  } catch (error) {
    console.error('Error fetching event types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    );
  }
}
