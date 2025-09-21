import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Create a service role client for authentication operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Local Strategy for email/password authentication
export async function authenticateLocal(email: string, password: string) {
  try {
    // Find user by email
    const { data: user, error } = await supabaseAdmin
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
    console.log('Profile received:', profile);
    console.log('Profile email:', profile.email);
    console.log('Profile name:', profile.name);
    console.log('Profile ID:', profile.id);

    // Check if user already exists with Google ID
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('google_id', profile.id)
      .single()

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding user by Google ID:', findError);
    }

    if (existingUser) {
      console.log('Found existing user by Google ID:', existingUser);
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
    const { data: emailUser, error: emailError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', profile.email)
      .single()

    if (emailError && emailError.code !== 'PGRST116') {
      console.error('Error finding user by email:', emailError);
    }

    if (emailUser) {
      console.log('Found existing user by email:', emailUser);
      
      // Check if user already has a Google ID
      if (emailUser.google_id) {
        console.log('User already has Google ID:', emailUser.google_id);
        // User already linked, just return success
        const token = jwt.sign(
          { 
            userId: emailUser.id, 
            email: emailUser.email,
            fullName: emailUser.full_name
          },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return {
          success: true,
          user: {
            id: emailUser.id,
            fullName: emailUser.full_name,
            email: emailUser.email,
            mobileNumber: emailUser.mobile_number,
            location: emailUser.location
          },
          token
        };
      }
      
      // Check if another user already has this Google ID
      const { data: existingGoogleUser, error: googleCheckError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('google_id', profile.id)
        .single();

      if (googleCheckError && googleCheckError.code !== 'PGRST116') {
        console.error('Error checking for existing Google user:', googleCheckError);
        return { success: false, error: 'Failed to check Google account' }
      }

      if (existingGoogleUser) {
        console.log('Google ID already exists for another user:', existingGoogleUser);
        return { success: false, error: 'Google account already linked to another user' }
      }
      
      // Update existing user with Google ID
      const { data: updatedUsers, error: updateError } = await supabaseAdmin
        .from('users')
        .update({ google_id: profile.id })
        .eq('id', emailUser.id)
        .select()

      if (updateError) {
        console.error('Error updating user with Google ID:', updateError);
        return { success: false, error: 'Failed to link Google account' }
      }

      if (!updatedUsers || updatedUsers.length === 0) {
        console.error('No user was updated with Google ID');
        return { success: false, error: 'Failed to link Google account' }
      }

      const updatedUser = updatedUsers[0];

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

    console.log('Creating new user with profile:', {
      full_name: profile.name,
      email: profile.email,
      google_id: profile.id
    });

    // Create new user
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert([{
        full_name: profile.name,
        email: profile.email,
        google_id: profile.id,
        mobile_number: '',
        location: ''
      }])
      .select()
      .single()

    if (createError) {
      console.error('Error creating new user:', createError);
      return { success: false, error: 'Failed to create user account' }
    }

    console.log('Successfully created new user:', newUser);

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
