#!/usr/bin/env node

// Test complete signup flow with OTP
// Run with: node test-signup-flow.js

const BASE_URL = 'http://localhost:3001';
const TEST_EMAIL = 'vnair0795@gmail.com';

async function testSignupFlow() {
  console.log('🧪 Testing Complete Signup Flow with OTP...\n');

  try {
    // Step 1: Send OTP (simulating form submission)
    console.log('1️⃣ Sending OTP for signup...');
    const otpResponse = await fetch(`${BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: TEST_EMAIL }),
    });

    const otpData = await otpResponse.json();
    
    if (otpData.success) {
      console.log('✅ OTP sent successfully!');
      console.log(`📧 Check your email: ${TEST_EMAIL}`);
      
      // Step 2: Simulate OTP verification with account creation
      console.log('\n2️⃣ Testing OTP verification with account creation...');
      console.log('📝 Simulating user data:');
      const userData = {
        fullName: 'Vishnu Nair',
        phone: '9876543210',
        password: 'TestPassword123!'
      };
      console.log(JSON.stringify(userData, null, 2));
      
      console.log('\n🔢 To complete the test:');
      console.log('1. Check your email for the 6-digit OTP');
      console.log('2. Run this command with the actual OTP:');
      console.log(`curl -X POST ${BASE_URL}/api/auth/verify-otp \\
  -H "Content-Type: application/json" \\
  -d '{"email":"${TEST_EMAIL}","otp":"YOUR_6_DIGIT_CODE","userData":${JSON.stringify(userData)}}'`);
      
      console.log('\n🌐 Or test in browser:');
      console.log(`1. Go to: ${BASE_URL}/signup`);
      console.log('2. Fill form with:');
      console.log(`   - Full Name: Vishnu Nair`);
      console.log(`   - Mobile: 9876543210`);
      console.log(`   - Email: ${TEST_EMAIL}`);
      console.log(`   - Location: Mumbai`);
      console.log(`   - Password: TestPassword123!`);
      console.log('3. Click "Create Account"');
      console.log('4. Enter OTP from email');
      console.log('5. Account will be created automatically!');
      
    } else {
      console.log('❌ Failed to send OTP:', otpData.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testSignupFlow();
