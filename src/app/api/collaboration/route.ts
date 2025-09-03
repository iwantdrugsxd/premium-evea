import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Collaboration API: Starting request processing...');
    
    const body = await request.json();
    const { business_name, email, phone_number, collaboration_type, additional_details } = body;

    // Validation
    if (!business_name || !email || !phone_number || !collaboration_type) {
      console.log('❌ Collaboration API: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Collaboration API: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone_number.replace(/\s/g, ''))) {
      console.log('❌ Collaboration API: Invalid phone number format');
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    console.log('✅ Collaboration API: Validation passed, inserting into database...');

    // Insert into database
    const { data, error } = await supabase
      .from('collaboration_requests')
      .insert([
        {
          business_name,
          email,
          phone_number,
          collaboration_type,
          additional_details: additional_details || null,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.log('❌ Collaboration API: Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save collaboration request' },
        { status: 500 }
      );
    }

    console.log('✅ Collaboration API: Successfully saved to database, ID:', data.id);

    // Send email notification to admin
    try {
      console.log('📧 Collaboration API: Sending email notification to admin...');
      
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
        from: `"EVEA Collaboration System" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
        to: 'vnair0795@gmail.com',
        subject: 'New Collaboration Request - EVEA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🎯 New Collaboration Request</h2>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Business Details</h3>
              <p><strong>Business Name:</strong> ${business_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone_number}</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Collaboration Details</h3>
              <p><strong>Type:</strong> ${collaboration_type}</p>
              ${additional_details ? `<p><strong>Additional Details:</strong></p><p style="background: #3a3a3a; padding: 10px; border-radius: 5px; margin-top: 10px;">${additional_details}</p>` : ''}
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px;">
              <h3 style="color: #EC4899; margin-top: 0;">Request Information</h3>
              <p><strong>Request ID:</strong> ${data.id}</p>
              <p><strong>Status:</strong> Pending</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
              <p style="color: #9CA3AF; font-size: 14px;">
                This is an automated notification from EVEA's collaboration system.
              </p>
            </div>
          </div>
        `
      };

      const adminInfo = await transporter.sendMail(adminMailOptions);
      console.log('✅ Collaboration API: Admin email sent successfully:', adminInfo.messageId);

    } catch (adminEmailError) {
      console.log('⚠️ Collaboration API: Admin email error:', adminEmailError);
    }

    // Send confirmation email to the user
    try {
      console.log('📧 Collaboration API: Sending confirmation email to user...');
      
      const userMailOptions = {
        from: `"EVEA Collaboration System" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
        to: email,
        subject: 'Collaboration Request Received - EVEA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🎯 Collaboration Request Received</h2>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Thank You!</h3>
              <p>Dear ${business_name},</p>
              <p>We have successfully received your collaboration request. Our team will review your proposal and get back to you within 2-3 business days.</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Request Summary</h3>
              <p><strong>Business Name:</strong> ${business_name}</p>
              <p><strong>Collaboration Type:</strong> ${collaboration_type}</p>
              <p><strong>Request ID:</strong> ${data.id}</p>
              <p><strong>Status:</strong> Under Review</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #EC4899; margin-top: 0;">Next Steps</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Our partnership team will review your proposal</li>
                <li>We'll schedule a call to discuss details</li>
                <li>You'll receive a detailed partnership proposal</li>
                <li>Upon agreement, we'll start the collaboration</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
              <p style="color: #9CA3AF; font-size: 14px;">
                If you have any questions, please contact us at partnerships@evea.com
              </p>
              <p style="color: #8B5CF6; font-size: 16px; font-weight: bold;">
                Thank you for choosing EVEA! 🚀
              </p>
            </div>
          </div>
        `
      };

      const userTransporter = nodemailer.createTransport({
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

      const userInfo = await userTransporter.sendMail(userMailOptions);
      console.log('✅ Collaboration API: User confirmation email sent successfully:', userInfo.messageId);

    } catch (userEmailError) {
      console.log('⚠️ Collaboration API: User confirmation email error:', userEmailError);
    }

    console.log('🎉 Collaboration API: Request processed successfully');

    return NextResponse.json({
      success: true,
      message: 'Collaboration request submitted successfully',
      requestId: data.id
    });

  } catch (error) {
    console.log('❌ Collaboration API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('📋 Collaboration API: Fetching collaboration requests...');
    
    const { data, error } = await supabase
      .from('collaboration_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Collaboration API: Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch collaboration requests' },
        { status: 500 }
      );
    }

    console.log('✅ Collaboration API: Successfully fetched', data.length, 'requests');
    return NextResponse.json({ data });

  } catch (error) {
    console.log('❌ Collaboration API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
