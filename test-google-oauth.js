// Test script to verify Google OAuth configuration
// Run with: node test-google-oauth.js

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Google OAuth Configuration...\n');

// Check required environment variables
const requiredVars = {
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'JWT_SECRET': process.env.JWT_SECRET
};

let allGood = true;

console.log('📋 Environment Variables Check:');
console.log('================================');

Object.entries(requiredVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${key}: MISSING`);
    allGood = false;
  }
});

console.log('\n🔧 Configuration Check:');
console.log('=======================');

// Check Google Client ID format
if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (clientId.includes('.apps.googleusercontent.com')) {
    console.log('✅ Google Client ID format looks correct');
  } else {
    console.log('❌ Google Client ID format might be incorrect (should end with .apps.googleusercontent.com)');
    allGood = false;
  }
} else {
  console.log('❌ Google Client ID not found');
  allGood = false;
}

// Check JWT Secret strength
if (process.env.JWT_SECRET) {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret.length >= 32) {
    console.log('✅ JWT Secret length is adequate');
  } else {
    console.log('⚠️  JWT Secret should be at least 32 characters long');
  }
} else {
  console.log('❌ JWT Secret not found');
  allGood = false;
}

// Check Supabase configuration
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('✅ Supabase configuration found');
} else {
  console.log('❌ Supabase configuration incomplete');
  allGood = false;
}

console.log('\n🎯 Test Results:');
console.log('================');

if (allGood) {
  console.log('✅ All configuration looks good!');
  console.log('🚀 You can now test Google OAuth by:');
  console.log('   1. Running: npm run dev');
  console.log('   2. Going to: http://localhost:3000/login');
  console.log('   3. Clicking "Continue with Google"');
} else {
  console.log('❌ Configuration issues found!');
  console.log('📖 Please check the GOOGLE_OAUTH_SETUP.md guide');
  console.log('🔧 Make sure your .env.local file has all required variables');
}

console.log('\n📝 Next Steps:');
console.log('===============');
console.log('1. Verify your Google Cloud Console OAuth setup');
console.log('2. Make sure redirect URI is: http://localhost:3000/api/auth/google/callback');
console.log('3. Test the login flow in your browser');
console.log('4. Check browser console and terminal for any errors');

