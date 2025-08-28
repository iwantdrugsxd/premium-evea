import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

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

    console.log('Attempting direct database signup for:', { email, fullName })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Try to insert directly into users table
    const { data, error } = await supabase
      .from('users')
      .insert([{
        full_name: fullName,
        email: email,
        mobile_number: mobileNumber,
        location: location,
        password: hashedPassword
      }])
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    console.log('User created directly in database:', data)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        mobileNumber: data.mobile_number,
        location: data.location
      }
    })

  } catch (error) {
    console.error('Direct signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
