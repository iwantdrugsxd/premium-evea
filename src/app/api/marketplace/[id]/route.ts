import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendorId = params.id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Fetch vendor with complete details
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select(`
        *,
        vendor_portfolio (
          id,
          title,
          description,
          image_url,
          category,
          created_at
        )
      `)
      .eq('id', vendorId)
      .eq('status', 'approved')
      .single();

    if (error || !vendor) {
      console.error('Vendor fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Transform data to match frontend expectations
    const transformedVendor = {
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
    };

    return NextResponse.json({
      success: true,
      vendor: transformedVendor
    });

  } catch (error) {
    console.error('Vendor details fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
