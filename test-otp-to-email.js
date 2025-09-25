#!/usr/bin/env node

// Test script to send OTP to vnair0795@gmail.com
// Run with: node test-otp-to-email.js

const BASE_URL = 'http://localhost:3001'; // Using port 3001 as shown in terminal
const TEST_EMAIL = 'vnair0795@gmail.com';

async function sendOTPToEmail() {
  console.log('📧 Sending OTP to vnair0795@gmail.com...\n');

  try {
    // Send OTP
    console.log('1️⃣ Sending OTP...');
    const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: TEST_EMAIL }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ OTP sent successfully!');
      console.log(`📧 Check your email: ${TEST_EMAIL}`);
      console.log('📱 Look for an email with subject: "EVEA - Email Verification Code"');
      console.log('\n🔢 The OTP will be a 6-digit number');
      console.log('⏰ OTP expires in 10 minutes');
      
      console.log('\n🧪 To verify the OTP, run:');
      console.log(`curl -X POST ${BASE_URL}/api/auth/verify-otp \\
  -H "Content-Type: application/json" \\
  -d '{"email":"${TEST_EMAIL}","otp":"YOUR_6_DIGIT_CODE"}'`);
      
      console.log('\n🌐 Or test the complete signup flow at:');
      console.log(`http://localhost:3001/signup`);
      
    } else {
      console.log('❌ Failed to send OTP:', data.error);
      console.log('\n💡 Make sure:');
      console.log('1. Your email credentials are set in .env.local');
      console.log('2. Gmail app password is configured correctly');
      console.log('3. 2-Step Verification is enabled on your Google account');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your Next.js server is running on port 3001');
  }
}

// Run the script
sendOTPToEmail();
