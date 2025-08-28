import { NextRequest, NextResponse } from 'next/server'
import { authAPI } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { fullName, mobileNumber, email, location, password } = await request.json()

    // Validate required fields
    if (!fullName || !mobileNumber || !email || !location || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    console.log('Attempting to sign up user:', { email, fullName })

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await authAPI.signUp({
      fullName,
      email,
      mobileNumber,
      location,
      password
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      )
    }

    console.log('User created in Supabase Auth:', authData.user.id)

    // Create user profile in users table
    const { data: profileData, error: profileError } = await authAPI.createUserProfile({
      fullName,
      email,
      mobileNumber,
      location
    })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Note: User is already created in auth, but profile creation failed
      return NextResponse.json(
        { success: false, error: 'Account created but profile setup failed' },
        { status: 500 }
      )
    }

    console.log('User profile created:', profileData)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: profileData.id,
        fullName: profileData.fullName,
        email: profileData.email,
        mobileNumber: profileData.mobileNumber,
        location: profileData.location
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
