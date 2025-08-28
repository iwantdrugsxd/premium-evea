import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Checking users in database...')
    
    // Get all users (without password hashes for security)
    const { data: users, error } = await supabase
      .from('users')
      .select('id, full_name, email, mobile_number, location, created_at, password_hash')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      })
    }
    
    return NextResponse.json({
      success: true,
      users: users,
      count: users?.length || 0
    })
    
  } catch (error) {
    console.error('Debug users error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    })
  }
}
