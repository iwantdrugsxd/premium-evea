// Optimized Supabase client with connection pooling and performance improvements
import { createClient } from '@supabase/supabase-js';

// Connection pool configuration
const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  options: {
    auth: {
      persistSession: false, // Disable session persistence for API routes
      autoRefreshToken: false, // Disable auto refresh for better performance
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'evea-optimized',
      },
    },
    // Connection pooling settings
    realtime: {
      enabled: false, // Disable realtime for API routes
    },
  }
};

// Create optimized clients
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  SUPABASE_CONFIG.options
);

export const supabaseAdmin = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.serviceRoleKey,
  {
    ...SUPABASE_CONFIG.options,
    auth: {
      ...SUPABASE_CONFIG.options.auth,
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Query optimization helpers
export class OptimizedQueries {
  // Get vendors with optimized query
  static async getVendors(filters: {
    category?: string;
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, location, search, page = 1, limit = 12 } = filters;
    const offset = (page - 1) * limit;

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
      .range(offset, offset + limit - 1);

    // Apply filters efficiently
    if (category && category !== 'All Vendors') {
      query = query.eq('category', category);
    }

    if (location) {
      query = query.ilike('location', `${location}%`);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    return query
      .order('rating', { ascending: false })
      .order('events_count', { ascending: false });
  }

  // Get events with optimized query
  static async getEvents() {
    return supabase
      .from('events')
      .select(`
        *,
        event_services!inner(id),
        event_packages!inner(id)
      `)
      .order('name');
  }

  // Get vendor by ID with optimized query
  static async getVendorById(id: string) {
    return supabase
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
      .eq('id', id)
      .eq('status', 'approved')
      .single();
  }

  // Get stories with optimized query
  static async getStories(filters: {
    eventType?: string;
    page?: number;
    limit?: number;
  }) {
    const { eventType, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('community_stories')
      .select(`
        *,
        story_likes(count),
        story_comments(count)
      `, { count: 'exact' })
      .eq('is_published', true)
      .range(offset, offset + limit - 1);

    if (eventType && eventType !== 'All') {
      query = query.eq('event_type', eventType);
    }

    return query.order('created_at', { ascending: false });
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static queries = new Map<string, { count: number; totalTime: number }>();

  static startQuery(queryName: string) {
    return {
      end: () => {
        const endTime = Date.now();
        const existing = this.queries.get(queryName) || { count: 0, totalTime: 0 };
        this.queries.set(queryName, {
          count: existing.count + 1,
          totalTime: existing.totalTime + endTime
        });
      }
    };
  }

  static getStats() {
    const stats: Record<string, { count: number; avgTime: number }> = {};
    
    for (const [queryName, data] of this.queries.entries()) {
      stats[queryName] = {
        count: data.count,
        avgTime: data.totalTime / data.count
      };
    }
    
    return stats;
  }

  static reset() {
    this.queries.clear();
  }
}

// Export the optimized client as default
export default supabase;
