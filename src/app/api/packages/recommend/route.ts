import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { event_id, budget, guest_count } = await request.json();

    // Validate required fields
    if (!event_id || !budget || !guest_count) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Get event details first
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError) throw eventError;

    // Get packages based on event type and criteria
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .eq('event_type', event.name)
      .gte('price_range_min', budget * 0.7) // Within 30% of budget
      .lte('price_range_max', budget * 1.3)
      .gte('guest_range_min', guest_count * 0.7)
      .lte('guest_range_max', guest_count * 1.3)
      .eq('is_active', true)
      .order('price_range_min');

    if (error) throw error;

    // If no packages found, get default packages for the event type
    let recommendedPackages = packages;
    if (!packages || packages.length === 0) {
      const { data: defaultPackages, error: defaultError } = await supabase
        .from('packages')
        .select('*')
        .eq('event_type', event.name)
        .eq('is_active', true)
        .order('price_range_min')
        .limit(3);

      if (defaultError) throw defaultError;
      recommendedPackages = defaultPackages;
    }

    // Ensure we have exactly 3 packages (Basic, Professional, Premium)
    const finalPackages = [];
    const packageNames = ['Basic', 'Professional', 'Premium'];
    
    for (const packageName of packageNames) {
      const pkg = recommendedPackages?.find(p => p.name === packageName);
      if (pkg) {
        finalPackages.push(pkg);
      }
    }

    // If we don't have all 3, fill with available ones
    if (finalPackages.length < 3 && recommendedPackages) {
      for (const pkg of recommendedPackages) {
        if (!finalPackages.find(fp => fp.name === pkg.name)) {
          finalPackages.push(pkg);
          if (finalPackages.length >= 3) break;
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      packages: finalPackages.slice(0, 3),
      event: event
    });
  } catch (error) {
    console.error('Error getting package recommendations:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get package recommendations' 
      },
      { status: 500 }
    );
  }
}
