const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Supabase Connection...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testConnection() {
  try {
    console.log('\n🔗 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:');
      console.log('Error:', error.message);
      console.log('Code:', error.code);
      console.log('Details:', error.details);
      console.log('Hint:', error.hint);
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n💡 Solution: You need to run the database schema first!');
        console.log('Run this SQL in your Supabase SQL Editor:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Run the content from fix-auth-database-schema.sql');
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('Users table exists and is accessible.');
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    
    if (err.message.includes('fetch failed')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your Supabase URL is correct');
      console.log('2. Check your Service Role Key is correct');
      console.log('3. Make sure your Supabase project is active');
      console.log('4. Check your internet connection');
    }
  }
}

testConnection();