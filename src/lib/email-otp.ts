// Email OTP functionality for user signup
import nodemailer from 'nodemailer';

// OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expires: number; email: string }>();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(email, { otp, expires, email });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'EVEA - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; font-size: 32px; margin: 0; font-weight: bold;">EVEA</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Redefining Event Planning</p>
            </div>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Verify Your Email</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for signing up with EVEA! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <h3 style="color: #333; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h3>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin: 20px 0;">
              This code will expire in 10 minutes for security reasons.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'OTP sent successfully to your email'
    };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return {
      success: false,
      message: 'Failed to send OTP email'
    };
  }
}

// Verify OTP
export function verifyOTP(email: string, otp: string): { success: boolean; message: string } {
  const storedData = otpStorage.get(email);
  
  if (!storedData) {
    return {
      success: false,
      message: 'OTP not found or expired'
    };
  }
  
  if (Date.now() > storedData.expires) {
    otpStorage.delete(email);
    return {
      success: false,
      message: 'OTP has expired'
    };
  }
  
  if (storedData.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP'
    };
  }
  
  // OTP is valid, remove it
  otpStorage.delete(email);
  
  return {
    success: true,
    message: 'Email verified successfully'
  };
}

// Clean up expired OTPs
export function cleanupExpiredOTPs(): void {
  const now = Date.now();
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expires) {
      otpStorage.delete(email);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
