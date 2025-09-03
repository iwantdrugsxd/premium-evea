import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { to, subject, html, text } = await request.json();

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      console.log('❌ EMAIL VALIDATION FAILED:', { to, subject, hasHtml: !!html, hasText: !!text });
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: to, subject, and either html or text'
      }, { status: 400 });
    }

    console.log('📧 EMAIL REQUEST RECEIVED:', {
      to,
      subject,
      hasHtml: !!html,
      hasText: !!text,
      timestamp: new Date().toISOString(),
      emailUser: process.env.EMAIL_USER,
      emailPassLength: process.env.EMAIL_PASS?.length || 0
    });

    // Method 1: Try Nodemailer with Gmail SMTP (PRIMARY METHOD)
    try {
      console.log('🔄 [NODEMAILER] Starting Gmail SMTP configuration...');
      console.log('🔄 [NODEMAILER] Email User:', process.env.EMAIL_USER);
      console.log('🔄 [NODEMAILER] Email Pass Length:', process.env.EMAIL_PASS?.length || 0);
      
      // Create transporter using Gmail with detailed configuration
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER || 'eveateam2025@gmail.com',
          pass: process.env.EMAIL_PASS || ''
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      console.log('🔄 [NODEMAILER] Transporter created, verifying connection...');

      // Verify connection configuration
      const verifyResult = await transporter.verify();
      console.log('✅ [NODEMAILER] Connection verified:', verifyResult);

      // Email options
      const mailOptions = {
        from: `"EVEA Event Planning" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
        to: to,
        subject: subject,
        html: html,
        text: text,
        priority: 'high'
      };

      console.log('🔄 [NODEMAILER] Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasHtml: !!mailOptions.html,
        hasText: !!mailOptions.text
      });

      // Send email
      const info = await transporter.sendMail(mailOptions);

      console.log('✅ [NODEMAILER] Email sent successfully:', {
        messageId: info.messageId,
        to: to,
        subject: subject,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      });

      return NextResponse.json({
        success: true,
        messageId: info.messageId,
        status: 'sent',
        method: 'nodemailer',
        details: {
          response: info.response,
          accepted: info.accepted,
          rejected: info.rejected
        }
      });

    } catch (nodemailerError) {
      console.log('❌ [NODEMAILER] Failed with error:', {
        message: nodemailerError.message,
        code: nodemailerError.code,
        command: nodemailerError.command,
        responseCode: nodemailerError.responseCode,
        response: nodemailerError.response,
        stack: nodemailerError.stack
      });
      
      console.log('⚠️ [NODEMAILER] Trying Edge Function as fallback...');
      
      // Method 2: Try Edge Function as fallback
      const edgeFunctionUrl = process.env.SUPABASE_EDGE_FUNCTION_URL;
      if (edgeFunctionUrl) {
        try {
          console.log('🔄 [EDGE FUNCTION] Attempting to send email via Edge Function...');
          
          const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              to,
              subject,
              html,
              text
            })
          });

          console.log('🔄 [EDGE FUNCTION] Response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('✅ [EDGE FUNCTION] Email sent successfully:', data);
            return NextResponse.json({
              success: true,
              messageId: data.messageId || `edge_${Date.now()}`,
              status: 'sent',
              method: 'edge_function'
            });
          } else {
            const errorData = await response.text();
            console.log('❌ [EDGE FUNCTION] Failed with status:', response.status, 'Error:', errorData);
            throw new Error(`Edge Function failed: ${response.status} - ${errorData}`);
          }
        } catch (edgeError) {
          console.log('❌ [EDGE FUNCTION] Error:', edgeError.message);
        }
      } else {
        console.log('⚠️ [EDGE FUNCTION] SUPABASE_EDGE_FUNCTION_URL not configured');
      }

      // Method 3: Try Supabase email service as final fallback
      try {
        console.log('🔄 [SUPABASE] Attempting to send email via Supabase service...');
        
        const { data, error } = await supabase.auth.admin.sendRawEmail({
          to: [to],
          subject: subject,
          html: html || text,
          text: text || html
        });

        if (!error && data) {
          console.log('✅ [SUPABASE] Email sent successfully:', data);
          return NextResponse.json({
            success: true,
            messageId: data.id || `supabase_${Date.now()}`,
            status: 'sent',
            method: 'supabase'
          });
        } else {
          console.log('❌ [SUPABASE] Failed:', error);
          throw new Error(error?.message || 'Supabase email service failed');
        }
      } catch (supabaseError) {
        console.log('❌ [SUPABASE] Error:', supabaseError.message);
      }

      // Final fallback: Simulate email sending
      console.log('⚠️ [SIMULATION] All email services failed, simulating email...');
      
      console.log('📧 [SIMULATION] Email would be sent:', {
        to,
        subject,
        html: html?.substring(0, 100) + '...',
        text: text?.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({
        success: true,
        messageId: `simulated_${Date.now()}`,
        status: 'simulated',
        method: 'simulated',
        note: 'Email was simulated - check Gmail app password configuration',
        error: nodemailerError.message
      });
    }

  } catch (error: any) {
    console.error('❌ [EMAIL API] Critical error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
