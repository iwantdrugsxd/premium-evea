import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase Auth...')
    
    // Test auth signup with a simple email
    const testEmail = 'test@test.com'
    const testPassword = 'password123'
    
    console.log('Attempting auth signup with:', testEmail)
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })
    
    if (error) {
      console.error('Auth test error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        status: error.status
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Auth test successful',
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: data.user.email_confirmed_at
      } : null,
      session: data.session ? 'Session created' : 'No session'
    })
    
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test auth'
    })
  }
}
