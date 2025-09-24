import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cache, CACHE_CONFIG, getCachedOrFetch } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Generate cache key
    const cacheKey = cache.generateKey(CACHE_CONFIG.VENDORS.keyPrefix, {
      category,
      location,
      search,
      page,
      limit
    });

    // Try to get from cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log(`Cache HIT for vendors: ${cacheKey}`);
      return NextResponse.json(cachedResult);
    }

    console.log(`Cache MISS for vendors: ${cacheKey}`);

    // OPTIMIZED: Use specific columns instead of * for better performance
    let query = supabase
      .from('vendors')
      .select(`
        id,
        name,
        business_name,
        category,
        rating,
        events_count,
        price,
        price_label,
        response_time,
        badge,
        image,
        description,
        location,
        experience,
        is_premium,
        created_at,
        vendor_portfolio!left (
          id,
          title,
          description,
          image_url,
          category
        )
      `, { count: 'exact' })
      .eq('status', 'approved')
      .range(offset, offset + limit - 1); // Add pagination

    // OPTIMIZED: Use more efficient filtering
    if (category && category !== 'All Vendors') {
      query = query.eq('category', category); // Use exact match instead of ilike
    }

    if (location) {
      query = query.ilike('location', `${location}%`); // Use prefix match for better performance
    }

    if (search) {
      // OPTIMIZED: Use text search with proper indexing
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: vendors, error, count } = await query
      .order('rating', { ascending: false })
      .order('events_count', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch vendors' },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

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

    const result = {
      success: true,
      vendors: transformedVendors,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    };

    // Cache the result
    cache.set(cacheKey, result, CACHE_CONFIG.VENDORS.ttl);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Marketplace fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
