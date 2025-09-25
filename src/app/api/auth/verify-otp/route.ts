import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/email-otp';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, userData } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpResult = verifyOTP(email, otp);
    
    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: otpResult.message },
        { status: 400 }
      );
    }

    // If userData is provided, create user account
    if (userData) {
      try {
        // Create user in Supabase
        const { data: user, error: userError } = await supabase.auth.signUp({
          email: email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.fullName,
              phone: userData.phone
            }
          }
        });

        if (userError) {
          return NextResponse.json(
            { success: false, error: userError.message },
            { status: 400 }
          );
        }

        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            email: email,
            full_name: userData.fullName,
            phone: userData.phone
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail the request if profile creation fails
        }

        return NextResponse.json({
          success: true,
          message: 'Account created successfully',
          user: user.user
        });
      } catch (error) {
        console.error('User creation error:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to create account' },
          { status: 500 }
        );
      }
    }

    // Just verify OTP without creating account
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}