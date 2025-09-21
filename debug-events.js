const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugEvents() {
  console.log('🔍 DEBUGGING EVENTS DATABASE');
  console.log('============================\n');

  try {
    // Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    console.log(`   Service Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing'}\n`);

    // Check events table
    console.log('2. Checking events table...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('name');

    if (eventsError) {
      console.log(`   ❌ Error fetching events: ${eventsError.message}`);
      return;
    }

    console.log(`   ✅ Found ${events.length} events`);
    events.forEach(event => {
      console.log(`      - ${event.name} (ID: ${event.id})`);
    });

    // Check event_services table
    console.log('\n3. Checking event_services table...');
    const { data: services, error: servicesError } = await supabase
      .from('event_services')
      .select('*')
      .limit(10);

    if (servicesError) {
      console.log(`   ❌ Error fetching services: ${servicesError.message}`);
    } else {
      console.log(`   ✅ Found ${services.length} services`);
      services.forEach(service => {
        console.log(`      - ${service.name} (Event ID: ${service.event_id})`);
      });
    }

    // Check event_packages table
    console.log('\n4. Checking event_packages table...');
    const { data: packages, error: packagesError } = await supabase
      .from('event_packages')
      .select('*')
      .limit(10);

    if (packagesError) {
      console.log(`   ❌ Error fetching packages: ${packagesError.message}`);
    } else {
      console.log(`   ✅ Found ${packages.length} packages`);
      packages.forEach(pkg => {
        console.log(`      - ${pkg.name} (Event ID: ${pkg.event_id})`);
      });
    }

    // Check which events have both services and packages
    console.log('\n5. Checking events with both services and packages...');
    const eventsWithData = [];
    
    for (const event of events) {
      // Check if event has services
      const { data: eventServices, error: servicesError } = await supabase
        .from('event_services')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);

      if (servicesError) {
        console.log(`   ⚠️  Error checking services for ${event.name}: ${servicesError.message}`);
        continue;
      }

      // Check if event has packages
      const { data: eventPackages, error: packagesError } = await supabase
        .from('event_packages')
        .select('id')
        .eq('event_id', event.id)
        .limit(1);

      if (packagesError) {
        console.log(`   ⚠️  Error checking packages for ${event.name}: ${packagesError.message}`);
        continue;
      }

      console.log(`   ${event.name}: ${eventServices.length} services, ${eventPackages.length} packages`);
      
      // Only include events that have both services and packages
      if (eventServices.length > 0 && eventPackages.length > 0) {
        eventsWithData.push(event);
        console.log(`      ✅ ${event.name} has both services and packages`);
      } else {
        console.log(`      ❌ ${event.name} missing services or packages`);
      }
    }

    console.log(`\n6. Final result: ${eventsWithData.length} events with complete data`);
    eventsWithData.forEach(event => {
      console.log(`   - ${event.name}`);
    });

    if (eventsWithData.length === 0) {
      console.log('\n❌ No events have both services and packages!');
      console.log('   This is why the events API is returning an empty array.');
      console.log('\n💡 Solution: Run the database setup scripts to add events, services, and packages.');
    }

  } catch (error) {
    console.error('\n❌ DEBUG FAILED:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the debug
debugEvents();
