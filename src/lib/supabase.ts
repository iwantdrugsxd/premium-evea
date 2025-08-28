import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

// Ensure URL has proper format
const formattedUrl = supabaseUrl.startsWith('https://') ? supabaseUrl : `https://${supabaseUrl}`

export const supabase = createClient(formattedUrl, supabaseAnonKey)

// TypeScript interfaces
export interface User {
  id: number
  fullName: string
  email: string
  mobileNumber: string
  location: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: number
  name: string
  description: string
  icon: string
  features: string[]
  avgBudget: string
  duration: string
  teamSize: string
  created_at: string
  updated_at: string
}

export interface EventService {
  id: number
  eventId: number
  name: string
  description: string
  price: string
  priceLabel: string
  category: string
  created_at: string
  updated_at: string
}

export interface EventPackage {
  id: number
  eventId: number
  name: string
  description: string
  price: string
  features: string[]
  services: number[]
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: number
  name: string
  category: string
  rating: number
  events: number
  price: string
  priceLabel: string
  responseTime: string
  badge: string
  image: string
  description: string
  features: string[]
  location: string
  experience: string
  teamSize: string
  availability: string
  created_at: string
  updated_at: string
}

export interface VendorPortfolio {
  id: number
  vendorId: number
  title: string
  description: string
  image: string
  category: string
  created_at: string
  updated_at: string
}

export interface VendorReview {
  id: number
  vendorId: number
  name: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
}

// API functions for Supabase integration
export const authAPI = {
  async signUp(userData: { fullName: string; email: string; mobileNumber: string; location: string; password: string }) {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Attempting signup with email:', userData.email)
    
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
          mobile_number: userData.mobileNumber,
          location: userData.location
        }
      }
    })
    
    if (error) {
      console.error('Supabase signup error details:', {
        message: error.message,
        status: error.status,
        code: error.code
      })
    }
    
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (data) {
      // Map the database columns back to our interface
      const mappedData = {
        id: data.id,
        fullName: data.full_name || data.fullName,  // Handle both possible column names
        email: data.email,
        mobileNumber: data.mobile_number || data.mobileNumber,  // Handle both possible column names
        location: data.location,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      return { data: mappedData, error }
    }
    
    return { data, error }
  },

  async createUserProfile(userData: { fullName: string; email: string; mobileNumber: string; location: string }) {
    // Map the data to match the actual database schema
    const profileData = {
      full_name: userData.fullName,  // Assuming the column is named full_name
      email: userData.email,
      mobile_number: userData.mobileNumber,  // Assuming the column is named mobile_number
      location: userData.location
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([profileData])
      .select()
      .single()
    return { data, error }
  }
}

export const eventsAPI = {
  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
    return { data, error }
  },

  async getEventById(id: number) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  }
}

export const vendorsAPI = {
  async getAllVendors() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
    return { data, error }
  },

  async getVendorById(id: number) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  }
}
