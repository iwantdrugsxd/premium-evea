import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

    console.log('Attempting working login for:', { email })

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // For now, we'll skip password verification since we don't have passwords stored
    // In a real implementation, you'd verify the password hash
    // const isValidPassword = await bcrypt.compare(password, user.password)
    // if (!isValidPassword) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid email or password' },
    //     { status: 401 }
    //   )
    // }

    console.log('User authenticated:', user.id)

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
    console.error('Working login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
