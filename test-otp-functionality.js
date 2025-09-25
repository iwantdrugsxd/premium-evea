#!/usr/bin/env node

// Test script for OTP functionality
// Run with: node test-otp-functionality.js

const testEmail = 'test@example.com';

async function testOTPFunctionality() {
  console.log('🧪 Testing OTP Functionality...\n');

  try {
    // Test 1: Send OTP
    console.log('1️⃣ Testing OTP Send...');
    const sendResponse = await fetch('http://localhost:3000/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const sendData = await sendResponse.json();
    console.log('Send OTP Response:', sendData);

    if (sendData.success) {
      console.log('✅ OTP sent successfully!');
      
      // Test 2: Verify OTP (with wrong OTP first)
      console.log('\n2️⃣ Testing OTP Verification (wrong OTP)...');
      const wrongVerifyResponse = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          otp: '123456' // Wrong OTP
        }),
      });

      const wrongVerifyData = await wrongVerifyResponse.json();
      console.log('Wrong OTP Response:', wrongVerifyData);

      if (!wrongVerifyData.success) {
        console.log('✅ Wrong OTP correctly rejected!');
      }

      // Test 3: Verify OTP (with correct OTP - you'll need to check your email)
      console.log('\n3️⃣ Testing OTP Verification (correct OTP)...');
      console.log('📧 Please check your email for the OTP and enter it below:');
      
      // In a real test, you'd need to manually enter the OTP
      // For now, we'll just show the structure
      console.log('To test with correct OTP, run:');
      console.log(`curl -X POST http://localhost:3000/api/auth/verify-otp \\
  -H "Content-Type: application/json" \\
  -d '{"email":"${testEmail}","otp":"YOUR_OTP_HERE"}'`);

    } else {
      console.log('❌ Failed to send OTP:', sendData.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your Next.js server is running on localhost:3000');
  }
}

// Run the test
testOTPFunctionality();
