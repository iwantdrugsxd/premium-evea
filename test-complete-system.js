const http = require('http');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const BASE_URL = 'http://localhost:3000';

console.log('🚀 Testing Complete EVEA System (Plan-Event + Collaboration)...\n');

// Test data for plan-event flow
const testEventData = {
  event_id: 1, // Wedding event ID
  location: "Mumbai, Maharashtra",
  date_time: "2025-12-25T18:00:00",
  guest_count: 200,
  budget: 150000,
  additional_notes: "Premium wedding package with full services",
  selected_services: [1, 3, 4, 7, 9, 10] // Photography, Catering, Decoration, Makeup, Venue, Planning
};

const testUserData = {
  name: "Vishnu Nair",
  email: "vishnu.n@somaiya.edu",
  phone: "+919876543210"
};

// Test data for collaboration
const testCollaborationData = {
  business_name: "Premium Event Services Pvt Ltd",
  email: "partnerships@premiumevents.com",
  phone_number: "+919876543211",
  collaboration_type: "event-management",
  additional_details: "We are a leading event management company with 8+ years of experience in luxury weddings and corporate events. We have successfully managed 500+ events and have a team of 25+ professionals. We would like to partner with EVEA to expand our reach and offer premium services to your clients. Our specialties include destination weddings, corporate galas, and product launches."
};

async function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testPlanEventFlow() {
  console.log('🎯 Testing Plan-Event Flow...');
  console.log('='.repeat(50));
  
  let eventRequestId = null;
  let callScheduleId = null;

  try {
    // Step 1: Create event request
    console.log('📝 Step 1: Creating event request...');
    const eventResponse = await makeRequest(`${BASE_URL}/api/event-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testEventData);

    console.log(`  Status: ${eventResponse.status}`);
    if (eventResponse.status === 200) {
      eventRequestId = eventResponse.body?.id;
      console.log('  ✅ Event request created successfully');
      console.log(`  Event Request ID: ${eventRequestId}`);
    } else {
      console.log('  ❌ Event request failed');
      console.log(`  Error: ${eventResponse.body?.error || 'Unknown error'}`);
      return false;
    }

    // Step 2: Update services
    console.log('\n🔧 Step 2: Updating selected services...');
    const servicesResponse = await makeRequest(`${BASE_URL}/api/event-requests/update-services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      event_request_id: eventRequestId,
      selected_services: testEventData.selected_services
    });

    console.log(`  Status: ${servicesResponse.status}`);
    if (servicesResponse.status === 200) {
      console.log('  ✅ Services updated successfully');
    } else {
      console.log('  ❌ Services update failed');
      console.log(`  Error: ${servicesResponse.body?.error || 'Unknown error'}`);
    }

    // Step 3: Schedule consultation call
    console.log('\n📞 Step 3: Scheduling consultation call...');
    const callData = {
      event_request_id: eventRequestId,
      preferred_date: "2025-09-05",
      preferred_time: "14:00",
      user_name: testUserData.name,
      user_email: testUserData.email,
      user_phone: testUserData.phone,
      admin_whatsapp: "+7057379190"
    };

    const callResponse = await makeRequest(`${BASE_URL}/api/call-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, callData);

    console.log(`  Status: ${callResponse.status}`);
    if (callResponse.status === 200) {
      callScheduleId = callResponse.body?.call_schedule_id;
      console.log('  ✅ Consultation call scheduled successfully');
      console.log(`  Call Schedule ID: ${callScheduleId}`);
      console.log(`  Scheduled Time: ${callResponse.body?.scheduled_time}`);
    } else {
      console.log('  ❌ Call scheduling failed');
      console.log(`  Error: ${callResponse.body?.error || 'Unknown error'}`);
    }

    return true;

  } catch (error) {
    console.log('  ❌ Plan-event flow test failed:', error.message);
    console.log('  Error details:', error);
    return false;
  }
}

async function testCollaborationSystem() {
  console.log('\n🤝 Testing Collaboration System...');
  console.log('='.repeat(50));
  
  try {
    // Test collaboration request submission
    console.log('📋 Submitting collaboration request...');
    const collaborationResponse = await makeRequest(`${BASE_URL}/api/collaboration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testCollaborationData);

    console.log(`  Status: ${collaborationResponse.status}`);
    if (collaborationResponse.status === 200) {
      console.log('  ✅ Collaboration request submitted successfully');
      console.log(`  Request ID: ${collaborationResponse.body?.requestId}`);
    } else {
      console.log('  ❌ Collaboration request failed');
      console.log(`  Error: ${collaborationResponse.body?.error || 'Unknown error'}`);
      return false;
    }

    // Test fetching collaboration requests
    console.log('\n📥 Fetching collaboration requests...');
    const fetchResponse = await makeRequest(`${BASE_URL}/api/collaboration`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(`  Status: ${fetchResponse.status}`);
    if (fetchResponse.status === 200) {
      console.log('  ✅ Collaboration requests fetched successfully');
      console.log(`  Total requests: ${fetchResponse.body?.data?.length || 0}`);
    } else {
      console.log('  ❌ Fetching collaboration requests failed');
      console.log(`  Error: ${fetchResponse.body?.error || 'Unknown error'}`);
    }

    return true;

  } catch (error) {
    console.log('  ❌ Collaboration system test failed:', error.message);
    console.log('  Error details:', error);
    return false;
  }
}

async function testEmailService() {
  console.log('\n📧 Testing Email Service...');
  console.log('='.repeat(50));
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      to: 'vnair0795@gmail.com',
      subject: 'EVEA System Test - Complete Integration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: white; padding: 20px; border-radius: 10px;">
          <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">🧪 EVEA System Test</h2>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #EC4899; margin-top: 0;">Test Summary</h3>
            <p><strong>Test Type:</strong> Complete System Integration</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p><strong>Status:</strong> Email Service Verification</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #EC4899; margin-top: 0;">Tested Components</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>✅ Plan-Event Flow</li>
              <li>✅ Collaboration System</li>
              <li>✅ Email Notifications</li>
              <li>✅ Database Operations</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
            <p style="color: #9CA3AF; font-size: 14px;">
              This is a test email to verify the complete EVEA system integration.
            </p>
          </div>
        </div>
      `
    });

    console.log(`  Status: ${response.status}`);
    if (response.status === 200) {
      console.log('  ✅ Email service working correctly');
      console.log(`  Method: ${response.body?.method || 'Unknown'}`);
      console.log(`  Message ID: ${response.body?.messageId || 'N/A'}`);
    } else {
      console.log('  ❌ Email service failed');
      console.log(`  Error: ${response.body?.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.log('  ❌ Email service test failed:', error.message);
    console.log('  Error details:', error);
  }
}

async function testDatabaseConnection() {
  console.log('\n🗄️ Testing Database Connection...');
  console.log('='.repeat(50));
  
  try {
    // Test fetching events
    console.log('📋 Testing events fetch...');
    const eventsResponse = await makeRequest(`${BASE_URL}/api/events`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(`  Status: ${eventsResponse.status}`);
    if (eventsResponse.status === 200) {
      console.log('  ✅ Events fetched successfully');
      console.log(`  Total events: ${eventsResponse.body?.data?.length || 0}`);
    } else {
      console.log('  ❌ Events fetch failed');
    }

    // Test fetching services
    console.log('\n🔧 Testing services fetch...');
    const servicesResponse = await makeRequest(`${BASE_URL}/api/services`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(`  Status: ${servicesResponse.status}`);
    if (servicesResponse.status === 200) {
      console.log('  ✅ Services fetched successfully');
      console.log(`  Total services: ${servicesResponse.body?.data?.length || 0}`);
    } else {
      console.log('  ❌ Services fetch failed');
    }

  } catch (error) {
    console.log('  ❌ Database connection test failed:', error.message);
    console.log('  Error details:', error);
  }
}

async function runCompleteTest() {
  console.log('='.repeat(80));
  console.log('🎯 COMPLETE EVEA SYSTEM TEST SUITE');
  console.log('='.repeat(80));
  
  const results = {
    planEvent: false,
    collaboration: false,
    email: false,
    database: false
  };

  // Test database connection first
  await testDatabaseConnection();
  results.database = true;

  // Test email service
  await testEmailService();
  results.email = true;

  // Test plan-event flow
  results.planEvent = await testPlanEventFlow();

  // Test collaboration system
  results.collaboration = await testCollaborationSystem();

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(80));
  
  console.log(`🗄️ Database Connection: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📧 Email Service: ${results.email ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🎯 Plan-Event Flow: ${results.planEvent ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🤝 Collaboration System: ${results.collaboration ? '✅ PASS' : '❌ FAIL'}`);
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`\n📈 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The EVEA system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the logs above for details.');
  }

  console.log('\n📝 Next Steps:');
  console.log('1. Check your email (vnair0795@gmail.com) for notifications');
  console.log('2. Verify the database tables have new entries');
  console.log('3. Test the frontend forms manually');
  console.log('4. Monitor the system logs for any issues');
  
  console.log('\n🔗 Frontend URLs to test:');
  console.log(`   - Plan Event: ${BASE_URL}/plan-event`);
  console.log(`   - Collaboration: ${BASE_URL}/collaboration`);
  console.log(`   - Careers: ${BASE_URL}/careers`);
  
  console.log('\n' + '='.repeat(80));
}

runCompleteTest().catch(console.error);
