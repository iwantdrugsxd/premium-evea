import { NextRequest, NextResponse } from 'next/server'
import { authenticateLocal } from '@/lib/auth-middleware'

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

    console.log('Attempting Passport.js login for:', { email })

    // Authenticate user using local strategy
    const result = await authenticateLocal(email, password)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    console.log('User authenticated successfully:', result.user.id)

    return NextResponse.json({
      success: true,
      token: result.token,
      user: result.user
    })

  } catch (error) {
    console.error('Passport login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
