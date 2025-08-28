import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

    console.log('Attempting working signup for:', { email, fullName })

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user profile in public.users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{
        full_name: fullName,
        email: email,
        mobile_number: mobileNumber,
        location: location
      }])
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return NextResponse.json(
        { success: false, error: profileError.message },
        { status: 400 }
      )
    }

    console.log('User profile created:', profileData)

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: profileData.id, 
        email: profileData.email,
        fullName: profileData.full_name 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: profileData.id,
        fullName: profileData.full_name,
        email: profileData.email,
        mobileNumber: profileData.mobile_number,
        location: profileData.location
      }
    })

  } catch (error) {
    console.error('Working signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
