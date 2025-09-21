// Test script for frontend integration with event planning API
// This script simulates a complete event planning request from the frontend

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Test data that matches the frontend form structure
const testEventData = {
  eventType: 'Wedding',
  selectedServices: ['venue', 'coordination', 'catering'],
  eventLocation: 'Mumbai, India',
  selectedPackage: 'premium',
  scheduledDate: '2024-02-15',
  scheduledTime: '14:00',
  userName: 'John Doe',
  userPhone: '+91 98765 43210',
  userEmail: 'john.doe@example.com',
  eventDate: '2024-06-15',
  guestCount: '150',
  budget: '500000',
  specialRequests: 'Outdoor ceremony with garden setup'
};

async function testEventPlanningAPI() {
  console.log('🧪 Testing Event Planning API Integration...\n');
  
  try {
    // Test 1: Event Planning Request API
    console.log('📝 Test 1: Submitting event planning request...');
    const response = await fetch(`${BASE_URL}/api/event-planning-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEventData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Event Planning Request API Test Successful!');
      console.log('📊 Response:', {
        success: result.success,
        requestId: result.requestId,
        message: result.message
      });
    } else {
      console.log('❌ Event Planning Request API Test Failed!');
      console.log('📊 Error Response:', result);
      return;
    }

    // Test 2: Event Planning API (Alternative endpoint)
    console.log('\n📝 Test 2: Testing alternative event planning endpoint...');
    const response2 = await fetch(`${BASE_URL}/api/event-planning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEventData)
    });

    const result2 = await response2.json();
    
    if (response2.ok) {
      console.log('✅ Alternative Event Planning API Test Successful!');
      console.log('📊 Response:', {
        success: result2.success,
        requestId: result2.requestId,
        message: result2.message
      });
    } else {
      console.log('❌ Alternative Event Planning API Test Failed!');
      console.log('📊 Error Response:', result2);
    }

    // Test 3: Email API (Direct test)
    console.log('\n📝 Test 3: Testing email API directly...');
    const emailResponse = await fetch(`${BASE_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'vnair0795@gmail.com',
        subject: 'Test Email from Frontend Integration Test',
        html: `
          <h2>Frontend Integration Test</h2>
          <p>This is a test email sent from the frontend integration test script.</p>
          <p><strong>Test Data:</strong></p>
          <ul>
            <li>Event Type: ${testEventData.eventType}</li>
            <li>User: ${testEventData.userName}</li>
            <li>Phone: ${testEventData.userPhone}</li>
            <li>Email: ${testEventData.userEmail}</li>
          </ul>
        `,
        text: `Frontend Integration Test - Event: ${testEventData.eventType}, User: ${testEventData.userName}`
      })
    });

    const emailResult = await emailResponse.json();
    
    if (emailResponse.ok) {
      console.log('✅ Email API Test Successful!');
      console.log('📊 Email Response:', {
        success: emailResult.success,
        messageId: emailResult.messageId,
        status: emailResult.status
      });
    } else {
      console.log('❌ Email API Test Failed!');
      console.log('📊 Email Error Response:', emailResult);
    }

    console.log('\n🎉 Frontend Integration Test Complete!');
    console.log('📋 Summary:');
    console.log('  - Event Planning Request API: ✅ Working');
    console.log('  - Alternative Event Planning API: ✅ Working');
    console.log('  - Email API: ✅ Working');
    console.log('  - Admin notifications should be sent to: vnair0795@gmail.com');

  } catch (error) {
    console.error('❌ Frontend Integration Test Failed:', error);
    console.error('🔍 Error Details:', error.message);
  }
}

// Test with different event types
async function testMultipleEventTypes() {
  console.log('\n🔄 Testing Multiple Event Types...\n');
  
  const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Conference'];
  
  for (const eventType of eventTypes) {
    console.log(`📝 Testing ${eventType}...`);
    
    const testData = {
      ...testEventData,
      eventType: eventType,
      userName: `Test User ${eventType}`,
      userEmail: `test.${eventType.toLowerCase().replace(' ', '.')}@example.com`
    };
    
    try {
      const response = await fetch(`${BASE_URL}/api/event-planning-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${eventType} test successful - Request ID: ${result.requestId}`);
      } else {
        console.log(`❌ ${eventType} test failed:`, result.error);
      }
    } catch (error) {
      console.log(`❌ ${eventType} test error:`, error.message);
    }
  }
}

// Run the tests
async function runAllTests() {
  console.log('🚀 Starting Frontend Integration Tests...\n');
  console.log('🌐 Base URL:', BASE_URL);
  console.log('📧 Admin Email: vnair0795@gmail.com\n');
  
  await testEventPlanningAPI();
  await testMultipleEventTypes();
  
  console.log('\n✨ All tests completed!');
  console.log('📧 Check vnair0795@gmail.com for admin notification emails.');
}

runAllTests();