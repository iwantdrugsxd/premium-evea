const BASE_URL = 'http://localhost:3000';

async function testPlanEventPage() {
  console.log('🧪 TESTING PLAN EVENT PAGE LOAD');
  console.log('================================\n');

  try {
    // Test 1: Check if the page loads
    console.log('📊 STEP 1: Testing page load...');
    const response = await fetch(`${BASE_URL}/plan-event`);
    
    if (response.ok) {
      console.log('✅ Plan event page loads successfully');
      console.log(`📄 Status: ${response.status} ${response.statusText}`);
    } else {
      console.log('❌ Plan event page failed to load');
      console.log(`📄 Status: ${response.status} ${response.statusText}`);
      return;
    }

    // Test 2: Check if events are available
    console.log('\n📊 STEP 2: Testing events availability...');
    const eventsResponse = await fetch(`${BASE_URL}/api/events`);
    const eventsData = await eventsResponse.json();
    
    if (eventsData.success) {
      console.log(`✅ Events API working - Found ${eventsData.events.length} events`);
      eventsData.events.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.name} - ${event.serviceCategories.length} services, ${event.packages.length} packages`);
      });
    } else {
      console.log('❌ Events API failed:', eventsData.message);
    }

    // Test 3: Check if vendors are available
    console.log('\n📊 STEP 3: Testing vendors availability...');
    const vendorsResponse = await fetch(`${BASE_URL}/api/marketplace`);
    const vendorsData = await vendorsResponse.json();
    
    if (vendorsData.success) {
      console.log(`✅ Vendors API working - Found ${vendorsData.vendors.length} vendors`);
      if (vendorsData.vendors.length > 0) {
        console.log('✅ Vendors available - events should display properly');
      } else {
        console.log('⚠️  No vendors available - events won\'t show up');
      }
    } else {
      console.log('❌ Vendors API failed:', vendorsData.message);
    }

    console.log('\n🎉 PLAN EVENT PAGE TEST COMPLETE!');
    console.log('==================================');
    console.log('📱 Visit the enhanced plan event flow at:', `${BASE_URL}/plan-event`);
    console.log('🎯 Expected: 6-step enhanced flow with beautiful UI');
    console.log('🎨 Features: Event selection, packages, details, scheduling, email, confirmation');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testPlanEventPage();
