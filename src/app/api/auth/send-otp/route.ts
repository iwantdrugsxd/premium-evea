import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    const { error: insertError } = await supabase
      .from('email_verifications')
      .upsert({
        email: email,
        otp: otp,
        expires_at: expiresAt.toISOString(),
        verified: false
      });

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    // Send OTP email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #7c3aed, #db2777, #2563eb); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">EVEA Email Verification</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Verify your email address</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #7c3aed; margin-top: 0;">Your Verification Code</h2>
          <p style="color: #666; margin-bottom: 20px;">Please use the following code to verify your email address:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This code will expire in 5 minutes. If you didn't request this verification, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
          <p>Thank you for choosing EVEA!</p>
        </div>
      </div>
    `;

    // Send OTP email using Supabase
    const { data: emailData, error: emailError } = await supabase.auth.admin.sendRawEmail({
      to: [email],
      subject: 'EVEA - Email Verification Code',
      html: emailContent,
      text: `Your EVEA verification code is: ${otp}. This code will expire in 5 minutes.`
    });

    if (emailError) {
      console.error('Error sending OTP email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 300 // 5 minutes in seconds
    });

  } catch (error) {
    console.error('Error in send-otp API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
