import { NextRequest, NextResponse } from 'next/server'
import { authAPI } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Attempting to sign in user:', { email })

    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await authAPI.signIn(email, password)

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', authData.user.id)

    // Get user profile from users table
    const { data: profileData, error: profileError } = await authAPI.getUser(authData.user.id)

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      )
    }

    console.log('User profile retrieved:', profileData)

    return NextResponse.json({
      success: true,
      token: authData.session?.access_token,
      user: {
        id: profileData.id,
        fullName: profileData.fullName,
        email: profileData.email,
        mobileNumber: profileData.mobileNumber,
        location: profileData.location
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
