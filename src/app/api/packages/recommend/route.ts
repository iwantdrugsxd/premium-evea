import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, budget, guest_count } = body;

    // Validate required fields
    if (!event_id || !budget || !guest_count) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: event_id, budget, guest_count'
      }, { status: 400 });
    }

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    // Get packages for this event type from event_packages table
    const { data: packages, error: packagesError } = await supabase
      .from('event_packages')
      .select('*')
      .eq('event_id', event_id)
      .order('id');

    if (packagesError) {
      console.error('❌ Error fetching packages:', packagesError);
      console.error('📊 Error details:', {
        message: packagesError.message,
        code: packagesError.code,
        details: packagesError.details,
        hint: packagesError.hint,
        timestamp: new Date().toISOString(),
        event_id,
        budget,
        guest_count
      });
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch packages'
      }, { status: 500 });
    }

    // Transform packages to match frontend expectations
    const transformedPackages = packages?.map(pkg => {
      const priceRange = pkg.price.split('-').map((p: string) => parseFloat(p.replace(/[^\d.]/g, '')));
      return {
        id: pkg.id,
        name: pkg.name.toLowerCase(),
        event_type: event.name.toLowerCase().replace(/\s+/g, '-'),
        price_range_min: priceRange[0] || 50000,
        price_range_max: priceRange[1] || 200000,
        guest_range_min: 50,
        guest_range_max: 500,
        features: pkg.features || [],
        is_active: true,
        created_at: pkg.created_at
      };
    }) || [];

    // Filter packages based on budget and guest count
    const recommendedPackages = transformedPackages.filter(pkg => {
      const budgetMatch = budget >= pkg.price_range_min && budget <= pkg.price_range_max;
      const guestMatch = guest_count >= pkg.guest_range_min && guest_count <= pkg.guest_range_max;
      return budgetMatch && guestMatch;
    });

    // If no exact matches, find the closest packages
    let finalPackages = recommendedPackages;
    if (finalPackages.length === 0) {
      // Find packages that are close to the budget and guest count
      finalPackages = transformedPackages
        .map(pkg => {
          const budgetDiff = Math.abs(budget - (pkg.price_range_min + pkg.price_range_max) / 2);
          const guestDiff = Math.abs(guest_count - (pkg.guest_range_min + pkg.guest_range_max) / 2);
          return { ...pkg, budgetDiff, guestDiff };
        })
        .sort((a, b) => (a.budgetDiff + a.guestDiff) - (b.budgetDiff + b.guestDiff))
        .slice(0, 3)
        .map(({ budgetDiff, guestDiff, ...pkg }) => pkg);
    }

    // Ensure we have exactly 3 packages (Basic, Professional, Premium)
    const packageNames = ['basic', 'professional', 'premium'];
    const finalPackagesMap = new Map();
    
    finalPackages.forEach(pkg => {
      finalPackagesMap.set(pkg.name, pkg);
    });

    // Fill missing packages with default ones
    const result = packageNames.map(name => {
      if (finalPackagesMap.has(name)) {
        return finalPackagesMap.get(name);
      } else {
        // Return a default package if not found
        return {
          id: null,
          name: name,
          event_type: event.category,
          price_range_min: name === 'basic' ? 50000 : name === 'professional' ? 150000 : 500000,
          price_range_max: name === 'basic' ? 150000 : name === 'professional' ? 500000 : 2000000,
          guest_range_min: name === 'basic' ? 50 : name === 'professional' ? 200 : 500,
          guest_range_max: name === 'basic' ? 200 : name === 'professional' ? 500 : 1000,
          features: name === 'basic' 
            ? ['Event Planning Consultation', 'Vendor Coordination', 'Basic Decoration Setup', 'Event Day Management', '5 EVEA Team Members', 'Basic Photography']
            : name === 'professional'
            ? ['Everything in Basic', 'Premium Vendor Selection', 'Custom Theme Design', 'Advanced Decoration', 'Professional Photography & Video', 'Entertainment Coordination', 'Guest Management System', 'Post-Event Support']
            : ['Everything in Professional', 'Luxury Venue Selection', 'Celebrity Chef Catering', 'Live Entertainment', 'Instagram Story Creation', 'Social Media Management', 'VIP Guest Services', 'Luxury Transportation', 'Premium Photography Package', 'Event Video Documentary'],
          is_active: true,
          created_at: new Date().toISOString()
        };
      }
    });

    console.log('✅ Successfully recommended packages:', {
      event_id,
      budget,
      guest_count,
      packageCount: result.length,
      packages: result.map((p: any) => ({ id: p.id, name: p.name, price: p.price })),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      packages: result,
      event: event
    });

  } catch (error) {
    console.error('❌ Error in package recommendation API:', error);
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
