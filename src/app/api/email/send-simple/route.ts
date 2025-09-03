import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    console.log('📧 Sending email via simple service:', {
      to,
      subject,
      hasHtml: !!html,
      hasText: !!text,
      timestamp: new Date().toISOString()
    });

    // Create transporter using Gmail (you can change this to your email provider)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: subject,
      html: html,
      text: text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: subject
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      status: 'sent',
      method: 'nodemailer'
    });

  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    
    // Fallback: simulate email sending
    console.log('📧 Email would be sent (simulated):', {
      to,
      subject,
      html: html?.substring(0, 100) + '...',
      text: text?.substring(0, 100) + '...'
    });
    
    return NextResponse.json({
      success: true,
      messageId: `simulated_${Date.now()}`,
      status: 'simulated',
      method: 'simulated',
      note: 'Email was simulated - configure EMAIL_USER and EMAIL_PASS for real sending'
    });
  }
}
