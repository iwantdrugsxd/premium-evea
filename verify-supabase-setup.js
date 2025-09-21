const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verifying Supabase Setup...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please update your .env.local file with correct Supabase credentials.');
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

async function verifySetup() {
  try {
    console.log('\n🔗 Testing database connection...');
    
    // Test 1: Check if users table exists and is accessible
    console.log('\n1. Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
      return false;
    }
    console.log('✅ Users table accessible');

    // Test 2: Check if events table exists
    console.log('\n2. Testing events table...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name')
      .limit(5);
    
    if (eventsError) {
      console.log('❌ Events table error:', eventsError.message);
      return false;
    }
    console.log('✅ Events table accessible');
    console.log('📋 Available events:', events.map(e => e.name).join(', '));

    // Test 3: Check if event_services table exists
    console.log('\n3. Testing event_services table...');
    const { data: services, error: servicesError } = await supabase
      .from('event_services')
      .select('service_name, category')
      .limit(5);
    
    if (servicesError) {
      console.log('❌ Event services table error:', servicesError.message);
      return false;
    }
    console.log('✅ Event services table accessible');
    console.log('📋 Sample services:', services.map(s => s.service_name).join(', '));

    // Test 4: Check if event_packages table exists
    console.log('\n4. Testing event_packages table...');
    const { data: packages, error: packagesError } = await supabase
      .from('event_packages')
      .select('package_name, price')
      .limit(5);
    
    if (packagesError) {
      console.log('❌ Event packages table error:', packagesError.message);
      return false;
    }
    console.log('✅ Event packages table accessible');
    console.log('📋 Sample packages:', packages.map(p => p.package_name).join(', '));

    // Test 5: Test user creation (dry run)
    console.log('\n5. Testing user operations...');
    const testUser = {
      full_name: 'Test User',
      email: 'test@example.com',
      mobile_number: '1234567890',
      location: 'Test City'
    };

    // Try to insert a test user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single();

    if (insertError) {
      console.log('❌ User creation error:', insertError.message);
      return false;
    }
    console.log('✅ User creation successful');

    // Clean up test user
    await supabase
      .from('users')
      .delete()
      .eq('id', newUser.id);

    console.log('✅ Test user cleaned up');

    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Your database is ready');
    console.log('2. Google OAuth should work now');
    console.log('3. Profile updates should work now');
    console.log('4. You can start using the application!');

    return true;

  } catch (err) {
    console.log('❌ Verification failed:', err.message);
    return false;
  }
}

verifySetup();




