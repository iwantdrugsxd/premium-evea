const BASE_URL = 'http://localhost:3000';

async function testEnhancedServices() {
  console.log('🧪 TESTING ENHANCED SERVICES INTEGRATION');
  console.log('=========================================\n');

  try {
    // Step 1: Test the events API
    console.log('📊 STEP 1: Testing Enhanced Events API...');
    const response = await fetch(`${BASE_URL}/api/events`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Events API working - Found ${data.events.length} events`);
      console.log(`📋 Available service categories: ${data.availableServiceCategories.join(', ')}\n`);
      
      data.events.forEach(event => {
        console.log(`🎯 Event: ${event.name}`);
        console.log(`   Description: ${event.description}`);
        console.log(`   Service Categories: ${event.serviceCategories.length} services`);
        console.log(`   Services: ${event.serviceCategories.join(', ')}`);
        console.log(`   Available Services: ${event.availableServices.join(', ')}`);
        console.log(`   Packages: ${event.packages.length} packages available`);
        console.log(`   Budget: ${event.avgBudget}`);
        console.log(`   Duration: ${event.duration}`);
        console.log(`   Team Size: ${event.teamSize}`);
        
        if (event.packages.length > 0) {
          console.log(`   📦 Packages:`);
          event.packages.forEach(pkg => {
            console.log(`      - ${pkg.name}: ${pkg.price}`);
            console.log(`        Features: ${pkg.features.join(', ')}`);
          });
        }
        console.log('');
      });
    } else {
      console.log('❌ Events API failed:', data.message);
      return;
    }

    // Step 2: Test marketplace to see available vendors
    console.log('📊 STEP 2: Checking available vendors...');
    const marketplaceResponse = await fetch(`${BASE_URL}/api/marketplace`);
    const marketplaceData = await marketplaceResponse.json();
    
    if (marketplaceData.success) {
      console.log(`✅ Marketplace API working - Found ${marketplaceData.vendors.length} vendors`);
      
      if (marketplaceData.vendors.length > 0) {
        console.log('✅ Vendors available - events should display properly');
        console.log('\n🏪 Available Vendors:');
        marketplaceData.vendors.forEach(vendor => {
          console.log(`   📍 ${vendor.name} - ${vendor.category}`);
        });
      } else {
        console.log('⚠️  No vendors available - events won\'t show up');
        console.log('💡 You need to create vendors first to see events');
      }
    } else {
      console.log('❌ Marketplace API failed:', marketplaceData.message);
    }

    // Step 3: Summary
    console.log('\n📊 ENHANCED SERVICES SUMMARY:');
    console.log('================================');
    const totalServices = data.events.reduce((sum, event) => sum + event.serviceCategories.length, 0);
    const avgServices = (totalServices / data.events.length).toFixed(1);
    
    console.log(`🎯 Total Events: ${data.events.length}`);
    console.log(`🔧 Total Services: ${totalServices}`);
    console.log(`📊 Average Services per Event: ${avgServices}`);
    console.log(`📦 Total Packages: ${data.events.reduce((sum, event) => sum + event.packages.length, 0)}`);
    
    console.log('\n🎉 ENHANCED SERVICES INTEGRATION TEST COMPLETE!');
    console.log('===============================================');
    console.log('📱 Test the plan event flow at:', `${BASE_URL}/plan-event`);
    console.log('🏪 Check marketplace at:', `${BASE_URL}/marketplace`);
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testEnhancedServices();
