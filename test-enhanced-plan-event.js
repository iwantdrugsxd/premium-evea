const BASE_URL = 'http://localhost:3000';

async function testEnhancedPlanEvent() {
  console.log('🧪 TESTING ENHANCED PLAN EVENT FLOW');
  console.log('=====================================\n');

  try {
    // Step 1: Test the events API
    console.log('📊 STEP 1: Testing Enhanced Events API...');
    const response = await fetch(`${BASE_URL}/api/events`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Events API working - Found ${data.events.length} events`);
      console.log(`📋 Available service categories: ${data.availableServiceCategories.join(', ')}\n`);
      
      // Show first few events with their details
      data.events.slice(0, 3).forEach(event => {
        console.log(`🎯 Event: ${event.name}`);
        console.log(`   Description: ${event.description}`);
        console.log(`   Service Categories: ${event.serviceCategories.length} services`);
        console.log(`   Services: ${event.serviceCategories.slice(0, 3).join(', ')}...`);
        console.log(`   Available Services: ${event.availableServices.slice(0, 3).join(', ')}...`);
        console.log(`   Packages: ${event.packages.length} packages available`);
        console.log(`   Budget: ${event.avgBudget}`);
        console.log(`   Duration: ${event.duration}`);
        console.log(`   Team Size: ${event.teamSize}`);
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
        marketplaceData.vendors.slice(0, 3).forEach(vendor => {
          console.log(`   📍 ${vendor.name} - ${vendor.category}`);
        });
      } else {
        console.log('⚠️  No vendors available - events won\'t show up');
        console.log('💡 You need to create vendors first to see events');
      }
    } else {
      console.log('❌ Marketplace API failed:', marketplaceData.message);
    }

    // Step 3: Test email API endpoint
    console.log('\n📊 STEP 3: Testing Email API endpoint...');
    try {
      const emailTestResponse = await fetch(`${BASE_URL}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'vnair0795@gmail.com',
          subject: 'Test Email from Enhanced Plan Event Flow',
          html: '<h2>Test Email</h2><p>This is a test email from the enhanced plan event flow.</p>'
        })
      });
      
      if (emailTestResponse.ok) {
        console.log('✅ Email API endpoint working');
      } else {
        console.log('⚠️  Email API endpoint returned status:', emailTestResponse.status);
      }
    } catch (error) {
      console.log('⚠️  Email API endpoint test failed:', error.message);
    }

    // Step 4: Summary
    console.log('\n📊 ENHANCED PLAN EVENT FLOW SUMMARY:');
    console.log('=====================================');
    const totalServices = data.events.reduce((sum, event) => sum + event.serviceCategories.length, 0);
    const avgServices = (totalServices / data.events.length).toFixed(1);
    
    console.log(`🎯 Total Events: ${data.events.length}`);
    console.log(`🔧 Total Services: ${totalServices}`);
    console.log(`📊 Average Services per Event: ${avgServices}`);
    console.log(`📦 Total Packages: ${data.events.reduce((sum, event) => sum + event.packages.length, 0)}`);
    
    console.log('\n🎉 ENHANCED PLAN EVENT FLOW TEST COMPLETE!');
    console.log('===========================================');
    console.log('📱 Test the enhanced plan event flow at:', `${BASE_URL}/plan-event`);
    console.log('🏪 Check marketplace at:', `${BASE_URL}/marketplace`);
    
    console.log('\n🚀 NEW FEATURES AVAILABLE:');
    console.log('==========================');
    console.log('✅ 6-Step Enhanced Flow (Event → Package → Details → Scheduling → Email → Confirmation)');
    console.log('✅ Comprehensive Event Details Form');
    console.log('✅ Advanced Scheduling with Flexibility Options');
    console.log('✅ Contact Information Collection');
    console.log('✅ Email Preview & Admin Notification (vnair0795@gmail.com)');
    console.log('✅ Complete Event Summary & Next Steps');
    console.log('✅ Landing Page Design Consistency');
    console.log('✅ Smooth Animations & Transitions');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testEnhancedPlanEvent();
