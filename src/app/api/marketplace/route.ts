import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cache, CACHE_CONFIG, getCachedOrFetch } from '@/lib/cache';

// Create a fresh Supabase client for each request to avoid schema cache issues
function createFreshSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  });
}

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

    // Create a fresh Supabase client for this request
    const supabase = createFreshSupabaseClient();
    
    // Try to get vendors with error handling for schema cache issues
    let vendors, error, count;
    
    try {
      // First try with the full query
      let query = supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .range(offset, offset + limit - 1);

      // Add filters
      if (category && category !== 'All Vendors') {
        query = query.eq('category', category);
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const result = await query
        .order('rating', { ascending: false })
        .order('events_count', { ascending: false });
      
      vendors = result.data;
      error = result.error;
      count = result.count;
    } catch (schemaError) {
      console.log('Schema cache error, trying fallback query...');
      
      // Fallback: try with minimal filters
      const result = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .range(offset, offset + limit - 1);
      
      vendors = result.data;
      error = result.error;
      count = result.count;
    }

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
      business_name: vendor.name,
      category: vendor.category,
      rating: vendor.rating || 0,
      events: vendor.events_count || 0,
      price: vendor.price || 'Contact for pricing',
      priceLabel: vendor.price_label || 'Custom Quote',
      responseTime: vendor.response_time || 'Within 24 hours',
      badge: vendor.badge || 'New',
      image: vendor.image || '/api/placeholder/400/300',
      description: vendor.description,
      location: vendor.location || 'Multiple Locations',
      experience: vendor.experience || 'Not specified',
      email: vendor.email,
      phone: vendor.phone,
      serviceAreas: vendor.service_areas || [],
      servicesOffered: vendor.services_offered || [],
      portfolio: vendor.portfolio_images ? vendor.portfolio_images.map((img, index) => ({
        id: index,
        title: `Portfolio Image ${index + 1}`,
        description: 'Portfolio image',
        image_url: img,
        category: 'portfolio'
      })) : [],
      reviews: [], // Will be populated from vendor_reviews table if needed
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
