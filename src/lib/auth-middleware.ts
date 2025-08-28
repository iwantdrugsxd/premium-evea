import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Local Strategy for email/password authentication
export async function authenticateLocal(email: string, password: string) {
  try {
    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, full_name, email, mobile_number, location, password_hash')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Invalid email or password' }
    }

    // Check if user has a password hash
    if (!user.password_hash) {
      return { success: false, error: 'Account exists but no password set. Please use Google login or reset password.' }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: 'Invalid email or password' }
    }

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

    return {
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        mobileNumber: user.mobile_number,
        location: user.location
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

// Google OAuth Strategy
export async function authenticateGoogle(profile: any) {
  try {
    // Check if user already exists with Google ID
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', profile.id)
      .single()

    if (existingUser) {
      // Generate JWT token for existing user
      const token = jwt.sign(
        { 
          userId: existingUser.id, 
          email: existingUser.email,
          fullName: existingUser.full_name 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return {
        success: true,
        token,
        user: {
          id: existingUser.id,
          fullName: existingUser.full_name,
          email: existingUser.email,
          mobileNumber: existingUser.mobile_number,
          location: existingUser.location
        }
      }
    }

    // Check if user exists with same email
    const { data: emailUser, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', profile.emails?.[0]?.value)
      .single()

    if (emailUser) {
      // Update existing user with Google ID
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ google_id: profile.id })
        .eq('id', emailUser.id)
        .select()
        .single()

      if (updateError) {
        return { success: false, error: 'Failed to link Google account' }
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: updatedUser.id, 
          email: updatedUser.email,
          fullName: updatedUser.full_name 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return {
        success: true,
        token,
        user: {
          id: updatedUser.id,
          fullName: updatedUser.full_name,
          email: updatedUser.email,
          mobileNumber: updatedUser.mobile_number,
          location: updatedUser.location
        }
      }
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        full_name: profile.displayName,
        email: profile.emails?.[0]?.value,
        google_id: profile.id,
        mobile_number: '',
        location: ''
      }])
      .select()
      .single()

    if (createError) {
      return { success: false, error: 'Failed to create user account' }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        fullName: newUser.full_name 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return {
      success: true,
      token,
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        mobileNumber: newUser.mobile_number,
        location: newUser.location
      }
    }
  } catch (error) {
    console.error('Google authentication error:', error)
    return { success: false, error: 'Google authentication failed' }
  }
}

// Verify JWT token
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return { success: true, user: decoded }
  } catch (error) {
    return { success: false, error: 'Invalid token' }
  }
}
