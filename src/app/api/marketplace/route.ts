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
        business_name,
        business_type,
        average_rating,
        total_events_completed,
        price_range_min,
        price_range_max,
        description,
        city,
        state,
        email,
        phone,
        portfolio_images,
        services_offered,
        is_verified,
        is_active,
        created_at
      `, { count: 'exact' })
      .eq('is_active', true)
      .range(offset, offset + limit - 1); // Add pagination

    // OPTIMIZED: Use more efficient filtering
    if (category && category !== 'All Vendors') {
      query = query.eq('business_type', category); // Use exact match instead of ilike
    }

    if (location) {
      query = query.or(`city.ilike.%${location}%,state.ilike.%${location}%`); // Search in city and state
    }

    if (search) {
      // OPTIMIZED: Use text search with proper indexing
      query = query.or(`business_name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: vendors, error, count } = await query
      .order('average_rating', { ascending: false })
      .order('total_events_completed', { ascending: false });

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
      name: vendor.business_name,
      business_name: vendor.business_name,
      category: vendor.business_type,
      rating: vendor.average_rating || 0,
      events: vendor.total_events_completed || 0,
      price: vendor.price_range_min ? `₹${vendor.price_range_min} - ₹${vendor.price_range_max || 'Contact'}` : 'Contact for pricing',
      priceLabel: vendor.price_range_min ? 'Price Range' : 'Custom Quote',
      responseTime: 'Within 24 hours', // Default value
      badge: vendor.is_verified ? 'Verified' : 'New',
      image: Array.isArray(vendor.portfolio_images) && vendor.portfolio_images.length > 0 
        ? vendor.portfolio_images[0] 
        : '/api/placeholder/400/300',
      description: vendor.description,
      
      location: `${vendor.city}, ${vendor.state}`,
      experience: 'Not specified', // Default value
      email: vendor.email,
      phone: vendor.phone,
      serviceAreas: [], // Will be populated from service_areas table if needed
      servicesOffered: vendor.services_offered || [],
      portfolio: Array.isArray(vendor.portfolio_images) 
        ? vendor.portfolio_images.map((img, index) => ({
            id: index,
            title: `Portfolio Image ${index + 1}`,
            description: 'Portfolio image',
            image_url: img,
            category: 'portfolio'
          }))
        : [],
      reviews: [], // Will be populated from simple_reviews table if needed
      createdAt: vendor.created_at,
      updatedAt: vendor.created_at
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
