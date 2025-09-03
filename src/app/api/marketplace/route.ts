import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    let query = supabase
      .from('vendors')
      .select(`
        *,
        vendor_portfolio (
          id,
          title,
          description,
          image_url,
          category
        )
      `)
      .eq('status', 'approved'); // Only show approved vendors

    // Apply filters
    if (category && category !== 'All Vendors') {
      query = query.ilike('category', `%${category}%`);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const { data: vendors, error } = await query
      .order('rating', { ascending: false })
      .order('events_count', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch vendors' },
        { status: 500 }
      );
    }

    // Transform data to match frontend expectations
    const transformedVendors = vendors?.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      category: vendor.category,
      rating: vendor.rating || 0,
      events: vendor.events_count || 0,
      price: vendor.price || 'Contact for pricing',
      priceLabel: vendor.price_label || 'Custom Quote',
      responseTime: vendor.response_time || 'Within 24 hours',
      badge: vendor.badge || 'New',
      image: vendor.image || 'default',
      description: vendor.description,
      
      location: vendor.location,
      experience: vendor.experience || 'Not specified',
      email: vendor.email,
      serviceAreas: vendor.service_areas || [],
      servicesOffered: vendor.services_offered || [],
      portfolio: vendor.vendor_portfolio || [],
      reviews: [], // Will be populated from separate reviews table if needed
      createdAt: vendor.created_at,
      updatedAt: vendor.updated_at
    })) || [];

    return NextResponse.json({
      success: true,
      vendors: transformedVendors,
      total: transformedVendors.length
    });

  } catch (error) {
    console.error('Marketplace fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
