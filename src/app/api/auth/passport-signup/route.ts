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

    console.log('Attempting Passport.js signup for:', { email, fullName })

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError)
      return NextResponse.json(
        { success: false, error: 'Database error occurred' },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user in users table
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert([{
        full_name: fullName,
        email: email,
        mobile_number: mobileNumber,
        location: location,
        password_hash: passwordHash
      }])
      .select()
      .single()

    if (createError) {
      console.error('User creation error:', createError)
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 400 }
      )
    }

    console.log('User created successfully:', user.id)

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        fullName: user.full_name 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        mobileNumber: user.mobile_number,
        location: user.location
      }
    })

  } catch (error) {
    console.error('Passport signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
