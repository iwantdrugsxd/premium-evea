import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Event Partner API: Starting request processing...');
    
    const body = await request.json();
    const { full_name, email, phone_number, event_management_experience } = body;

    // Validation
    if (!full_name || !email || !phone_number || !event_management_experience) {
      console.log('❌ Event Partner API: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Event Partner API: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone_number.replace(/\s/g, ''))) {
      console.log('❌ Event Partner API: Invalid phone number format');
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    console.log('✅ Event Partner API: Validation passed, inserting into database...');

    // Insert into database
    const { data, error } = await supabase
      .from('event_partners')
      .insert([
        {
          full_name,
          email,
          phone_number,
          event_management_experience,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.log('❌ Event Partner API: Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save event partner application' },
        { status: 500 }
      );
    }

    console.log('✅ Event Partner API: Successfully saved to database, ID:', data.id);

    // Send email notification to admin
    try {
      console.log('📧 Event Partner API: Sending email notification to admin...');
      
      // Create transporter using Gmail SMTP
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || 'eveateam2025@gmail.com',
          pass: process.env.EMAIL_PASS || ''
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Admin email
      const adminMailOptions = {
        from: `"EVEA Event Partner System" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
        to: 'vnair0795@gmail.com',
        subject: 'New Event Partner Application - EVEA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🎯 New Event Partner Application</h2>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Applicant Details</h3>
              <p><strong>Full Name:</strong> ${full_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone_number}</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Event Management Experience</h3>
              <p style="background: #3a3a3a; padding: 15px; border-radius: 5px; margin-top: 10px; line-height: 1.6;">${event_management_experience}</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px;">
              <h3 style="color: #EC4899; margin-top: 0;">Application Information</h3>
              <p><strong>Application ID:</strong> ${data.id}</p>
              <p><strong>Status:</strong> Pending Review</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
              <p style="color: #9CA3AF; font-size: 14px;">
                This is an automated notification from EVEA's event partner application system.
              </p>
            </div>
          </div>
        `
      };

      const adminInfo = await transporter.sendMail(adminMailOptions);
      console.log('✅ Event Partner API: Admin email sent successfully:', adminInfo.messageId);

    } catch (adminEmailError) {
      console.log('⚠️ Event Partner API: Admin email error:', adminEmailError);
    }

    // Send confirmation email to the applicant
    try {
      console.log('📧 Event Partner API: Sending confirmation email to applicant...');
      
      const userMailOptions = {
        from: `"EVEA Event Partner System" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
        to: email,
        subject: 'Event Partner Application Received - EVEA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🎯 Application Received</h2>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Thank You!</h3>
              <p>Dear ${full_name},</p>
              <p>We have successfully received your event partner application. Our team will review your experience and qualifications, and get back to you within 3-5 business days.</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Application Summary</h3>
              <p><strong>Full Name:</strong> ${full_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Application ID:</strong> ${data.id}</p>
              <p><strong>Status:</strong> Under Review</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Next Steps</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Our HR team will review your application</li>
                <li>We'll schedule an interview if shortlisted</li>
                <li>You'll receive training and onboarding details</li>
                <li>Upon approval, you'll join our event partner network</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
              <p style="color: #9CA3AF; font-size: 14px;">
                If you have any questions, please contact us at careers@evea.com
              </p>
              <p style="color: #8B5CF6; font-size: 16px; font-weight: bold;">
                Thank you for your interest in joining EVEA! 🚀
              </p>
            </div>
          </div>
        `
      };

      const userInfo = await transporter.sendMail(userMailOptions);
      console.log('✅ Event Partner API: Applicant confirmation email sent successfully:', userInfo.messageId);

    } catch (userEmailError) {
      console.log('⚠️ Event Partner API: Applicant confirmation email error:', userEmailError);
    }

    console.log('🎉 Event Partner API: Application processed successfully');

    return NextResponse.json({
      success: true,
      message: 'Event partner application submitted successfully',
      applicationId: data.id
    });

  } catch (error) {
    console.log('❌ Event Partner API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('📋 Event Partner API: Fetching event partner applications...');
    
    const { data, error } = await supabase
      .from('event_partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Event Partner API: Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch event partner applications' },
        { status: 500 }
      );
    }

    console.log('✅ Event Partner API: Successfully fetched', data.length, 'applications');
    return NextResponse.json({ data });

  } catch (error) {
    console.log('❌ Event Partner API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
