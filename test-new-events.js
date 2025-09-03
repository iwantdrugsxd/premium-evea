const BASE_URL = 'http://localhost:3000';

async function testNewEvents() {
  console.log('🧪 TESTING NEW EVENTS ADDITION');
  console.log('===============================\n');

  try {
    // Step 1: Test the events API
    console.log('📊 STEP 1: Testing Events API...');
    const response = await fetch(`${BASE_URL}/api/events`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Events API working - Found ${data.events.length} events`);
      
      // Show all events with their details
      data.events.forEach((event, index) => {
        console.log(`\n🎯 Event ${index + 1}: ${event.name}`);
        console.log(`   Icon: ${event.icon}`);
        console.log(`   Services: ${event.serviceCategories.length} service categories`);
        console.log(`   Packages: ${event.packages.length} packages available`);
        console.log(`   Budget: ${event.avgBudget}`);
        console.log(`   Duration: ${event.duration}`);
        console.log(`   Team Size: ${event.teamSize}`);
        
        // Show first few services
        if (event.serviceCategories.length > 0) {
          console.log(`   Sample Services: ${event.serviceCategories.slice(0, 3).join(', ')}...`);
        }
        
        // Show package names
        if (event.packages.length > 0) {
          console.log(`   Packages: ${event.packages.map(p => p.name).join(', ')}`);
        }
      });
      
      // Check for new events
      const newEvents = ['Graduation Ceremony', 'Baby Shower', 'Engagement Ceremony'];
      const foundNewEvents = newEvents.filter(eventName => 
        data.events.some(event => event.name === eventName)
      );
      
      if (foundNewEvents.length > 0) {
        console.log(`\n🎉 NEW EVENTS FOUND: ${foundNewEvents.length}/3`);
        foundNewEvents.forEach(eventName => {
          console.log(`   ✅ ${eventName}`);
        });
      } else {
        console.log('\n⚠️  No new events found yet. Run the SQL script first!');
      }
      
    } else {
      console.log('❌ Events API failed:', data.message);
      return;
    }

    // Step 2: Summary
    console.log('\n📊 EVENTS SUMMARY:');
    console.log('==================');
    const totalServices = data.events.reduce((sum, event) => sum + event.serviceCategories.length, 0);
    const avgServices = (totalServices / data.events.length).toFixed(1);
    const totalPackages = data.events.reduce((sum, event) => sum + event.packages.length, 0);
    
    console.log(`🎯 Total Events: ${data.events.length}`);
    console.log(`🔧 Total Services: ${totalServices}`);
    console.log(`📊 Average Services per Event: ${avgServices}`);
    console.log(`📦 Total Packages: ${totalPackages}`);
    
    console.log('\n🎉 NEW EVENTS TEST COMPLETE!');
    console.log('==============================');
    console.log('📱 Test the simplified event cards at:', `${BASE_URL}/plan-event`);
    
    if (data.events.length >= 7) {
      console.log('✅ Expected: 7+ events with clean, simple cards showing only event names');
    } else {
      console.log('⚠️  Expected: 7+ events after running the SQL script');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testNewEvents();
