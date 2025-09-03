#!/usr/bin/env node

/**
 * Test Events Integration Script
 * This script will test the updated events API with service categories and packages
 */

const BASE_URL = 'http://localhost:3000';

async function testEventsIntegration() {
  console.log('🧪 TESTING EVENTS INTEGRATION');
  console.log('=====================================\n');

  try {
    // Step 1: Test the events API
    console.log('📊 STEP 1: Testing Events API...');
    const response = await fetch(`${BASE_URL}/api/events`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Events API working - Found ${data.events.length} events`);
      console.log(`📋 Available service categories: ${data.availableServiceCategories.join(', ')}`);
      
      // Display events with their packages
      data.events.forEach(event => {
        console.log(`\n🎯 Event: ${event.name}`);
        console.log(`   Description: ${event.description}`);
        console.log(`   Service Categories: ${event.serviceCategories.join(', ')}`);
        console.log(`   Available Services: ${event.availableServices.join(', ')}`);
        console.log(`   Packages: ${event.packages.length} packages available`);
        
        event.packages.forEach(pkg => {
          console.log(`     📦 ${pkg.name} - ${pkg.price}`);
          console.log(`        Features: ${pkg.features.join(', ')}`);
        });
      });
      
    } else {
      console.log('❌ Events API failed:', data.error);
      return;
    }

    // Step 2: Test marketplace to see available vendors
    console.log('\n📊 STEP 2: Checking available vendors...');
    const marketplaceResponse = await fetch(`${BASE_URL}/api/marketplace`);
    const marketplaceData = await marketplaceResponse.json();
    
    if (marketplaceData.success) {
      console.log(`✅ Marketplace API working - Found ${marketplaceData.vendors.length} vendors`);
      
      if (marketplaceData.vendors.length === 0) {
        console.log('⚠️  No vendors available - events won\'t show up');
        console.log('💡 You need to create vendors first to see events');
      } else {
        console.log('✅ Vendors available - events should display properly');
      }
    } else {
      console.log('❌ Marketplace API failed:', marketplaceData.error);
    }

    console.log('\n🎉 EVENTS INTEGRATION TEST COMPLETE!');
    console.log('=====================================');
    console.log('📱 Test the plan event flow at: http://localhost:3000/plan-event');
    console.log('🏪 Check marketplace at: http://localhost:3000/marketplace');
    
  } catch (error) {
    console.error('❌ Error during events integration test:', error.message);
  }
}

// Run the test
testEventsIntegration();
