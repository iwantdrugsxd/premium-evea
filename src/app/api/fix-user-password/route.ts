import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Fixing password for user:', email)

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // First check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError || !existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Update the user's password hash
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', existingUser.id)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 400 }
      )
    }

    // Get updated user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, full_name, email, mobile_number, location')
      .eq('id', existingUser.id)
      .single()

    if (fetchError || !user) {
      console.error('Error fetching updated user:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch updated user data' },
        { status: 500 }
      )
    }

    console.log('Password fixed for user:', user.id)

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      user: user
    })

  } catch (error) {
    console.error('Fix password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
