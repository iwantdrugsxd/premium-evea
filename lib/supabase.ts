import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface User {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  location: string;
  google_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  icon: string;
  features: string[];
  avg_budget: string;
  duration: string;
  team_size: string;
  created_at: string;
  updated_at: string;
}

export interface EventService {
  id: number;
  event_id: number;
  name: string;
  description: string;
  price: string;
  price_label: string;
  category: string;
  created_at: string;
}

export interface EventPackage {
  id: number;
  event_id: number;
  name: string;
  description: string;
  price: string;
  features: string[];
  service_ids: number[];
  created_at: string;
}

export interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  events_count: number;
  price: string;
  price_label: string;
  response_time: string;
  badge: string;
  image: string;
  description: string;
  features: string[];
  location: string;
  experience: string;
  team_size: string;
  availability: string;
  created_at: string;
  updated_at: string;
}

export interface VendorPortfolio {
  id: number;
  vendor_id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface VendorReview {
  id: number;
  vendor_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Database functions
export const authAPI = {
  // User authentication
  async signUp(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    return { data, error };
  },

  async signIn(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    return { data, error };
  },

  async getUserById(id: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }
};

export const eventsAPI = {
  // Get all events
  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('name');
    
    return { data, error };
  },

  // Get event by ID with services and packages
  async getEventById(id: number) {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (eventError) return { data: null, error: eventError };

    const { data: services, error: servicesError } = await supabase
      .from('event_services')
      .select('*')
      .eq('event_id', id);

    const { data: packages, error: packagesError } = await supabase
      .from('event_packages')
      .select('*')
      .eq('event_id', id);

    return {
      data: {
        ...event,
        services: services || [],
        packages: packages || []
      },
      error: servicesError || packagesError
    };
  }
};

export const vendorsAPI = {
  // Get all vendors
  async getAllVendors() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name');
    
    return { data, error };
  },

  // Get vendor by ID with portfolio and reviews
  async getVendorById(id: number) {
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (vendorError) return { data: null, error: vendorError };

    const { data: portfolio, error: portfolioError } = await supabase
      .from('vendor_portfolio')
      .select('*')
      .eq('vendor_id', id);

    const { data: reviews, error: reviewsError } = await supabase
      .from('vendor_reviews')
      .select('*')
      .eq('vendor_id', id)
      .order('created_at', { ascending: false });

    return {
      data: {
        ...vendor,
        portfolio: portfolio || [],
        reviews: reviews || []
      },
      error: portfolioError || reviewsError
    };
  },

  // Get vendors by category
  async getVendorsByCategory(category: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .ilike('category', `%${category}%`)
      .order('name');
    
    return { data, error };
  }
};
