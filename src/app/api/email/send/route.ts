import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { to, subject, html, text } = await request.json();

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: to, subject, and either html or text'
      }, { status: 400 });
    }

    console.log('📧 Sending email:', {
      to,
      subject,
      hasHtml: !!html,
      hasText: !!text,
      timestamp: new Date().toISOString()
    });

    // Use Resend for email sending (free and reliable)
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.log('📧 Email would be sent (RESEND_API_KEY not configured):', {
        to,
        subject,
        html: html?.substring(0, 100) + '...',
        text: text?.substring(0, 100) + '...'
      });
      
      // For development, simulate success
      return NextResponse.json({
        success: true,
        messageId: 'email_sent_' + Date.now(),
        status: 'sent'
      });
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EVEA <noreply@evea.com>',
        to: [to],
        subject: subject,
        html: html,
        text: text
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Resend API Error:', data);
      return NextResponse.json({
        success: false,
        error: data.message || 'Failed to send email'
      }, { status: 500 });
    }

    console.log('✅ Email sent successfully via Resend:', data);

    return NextResponse.json({
      success: true,
      messageId: data.id,
      status: 'sent'
    });

  } catch (error: any) {
    console.error('❌ Email API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
