require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'vnair0795@gmail.com';

// Test data
const testEventData = {
  event_id: 1, // Wedding
  location: 'Mumbai, Maharashtra',
  date_time: '2024-12-25T18:00:00Z',
  budget: 500000,
  guest_count: 200,
  additional_notes: 'Outdoor wedding preferred with traditional elements'
};

// Sample selected services for Wedding (event_id: 1)
const selectedServices = [1, 3, 4, 9, 10]; // Wedding Photography, Catering, Decoration, Venue, Planning

console.log('======================================================================');
console.log('  PLAN EVENT FLOW TEST WITH SERVICES');
console.log('======================================================================');
console.log(`ℹ️  Testing complete plan-event flow with services to: ${ADMIN_EMAIL}`);
console.log('');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testServerConnectivity() {
  console.log('--------------------------------------------------');
  console.log('  1. SERVER CONNECTIVITY TEST');
  console.log('--------------------------------------------------');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/events`);
    if (response.status === 200) {
      console.log('✅ Server is running and accessible');
      return true;
    } else {
      console.log('❌ Server responded with error status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Server connectivity failed:', error.message);
    return false;
  }
}

async function testCompleteFlow() {
  console.log('--------------------------------------------------');
  console.log('  2. COMPLETE PLAN-EVENT FLOW WITH SERVICES');
  console.log('--------------------------------------------------');
  
  let eventRequestId = null;
  let callScheduleId = null;
  
  try {
    // Step 1: Create event request
    console.log('ℹ️  Step 1: Creating event request...');
    const eventRequestResponse = await makeRequest(`${BASE_URL}/api/event-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEventData)
    });

    if (eventRequestResponse.status === 200 && eventRequestResponse.data.success) {
      eventRequestId = eventRequestResponse.data.event_request.id;
      console.log('✅ Event request created with ID:', eventRequestId);
    } else {
      console.log('❌ Failed to create event request:', eventRequestResponse.data);
      return false;
    }

    // Step 2: Update event request with selected services
    console.log('ℹ️  Step 2: Updating event request with selected services...');
    const servicesUpdateResponse = await makeRequest(`${BASE_URL}/api/event-requests/update-services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_request_id: eventRequestId,
        selected_services: selectedServices
      })
    });

    if (servicesUpdateResponse.status === 200 && servicesUpdateResponse.data.success) {
      console.log('✅ Event request updated with services successfully');
      console.log('📋 Selected services:', selectedServices);
    } else {
      console.log('❌ Failed to update event request with services:', servicesUpdateResponse.data);
      return false;
    }

    // Step 3: Update package selection
    console.log('ℹ️  Step 3: Updating package selection...');
    const packageUpdateResponse = await makeRequest(`${BASE_URL}/api/event-requests/update-package`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_request_id: eventRequestId,
        selected_package: 'premium'
      })
    });

    if (packageUpdateResponse.status === 200 && packageUpdateResponse.data.success) {
      console.log('✅ Package selection updated successfully');
    } else {
      console.log('❌ Failed to update package selection:', packageUpdateResponse.data);
      return false;
    }

    // Step 4: Schedule consultation call
    console.log('ℹ️  Step 4: Scheduling consultation call...');
    const callScheduleResponse = await makeRequest(`${BASE_URL}/api/call-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_request_id: eventRequestId,
        scheduled_time: '2024-12-20T10:00:00Z',
        user_email: 'test@example.com'
      })
    });

    if (callScheduleResponse.status === 200 && callScheduleResponse.data.success) {
      callScheduleId = callScheduleResponse.data.call_schedule.id;
      console.log('✅ Call scheduled with ID:', callScheduleId);
    } else {
      console.log('❌ Failed to schedule call:', callScheduleResponse.data);
      return false;
    }

    return { eventRequestId, callScheduleId };

  } catch (error) {
    console.log('❌ Error in complete flow test:', error.message);
    return false;
  }
}

async function testEmailWithServices() {
  console.log('--------------------------------------------------');
  console.log('  3. EMAIL TEST WITH SERVICES');
  console.log('--------------------------------------------------');
  
  try {
    const emailData = {
      to: ADMIN_EMAIL,
      subject: '🎉 TEST - Event Planning Request with Services - EVEA',
      html: `
        <h1>🎉 Event Planning Request with Services</h1>
        <p><strong>Event Type:</strong> Wedding</p>
        <p><strong>Location:</strong> Mumbai, Maharashtra</p>
        <p><strong>Budget:</strong> ₹500,000</p>
        <p><strong>Guest Count:</strong> 200</p>
        <p><strong>Selected Package:</strong> Premium</p>
        <p><strong>User Email:</strong> test@example.com</p>
        
        <h3>🎯 Selected Services:</h3>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #8b5cf6; margin-bottom: 8px;">Photography</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wedding Photography</li>
          </ul>
        </div>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #8b5cf6; margin-bottom: 8px;">Catering</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wedding Catering</li>
          </ul>
        </div>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #8b5cf6; margin-bottom: 8px;">Decoration</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wedding Decoration</li>
          </ul>
        </div>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #8b5cf6; margin-bottom: 8px;">Venue</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wedding Venue</li>
          </ul>
        </div>
        <div style="margin-bottom: 15px;">
          <h4 style="color: #8b5cf6; margin-bottom: 8px;">Event Management</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wedding Planning</li>
          </ul>
        </div>
      `,
      text: `
Event Planning Request with Services - Wedding
Location: Mumbai, Maharashtra
Budget: ₹500,000
Guest Count: 200
Selected Package: Premium
User Email: test@example.com

Selected Services:
Photography:
  • Wedding Photography
Catering:
  • Wedding Catering
Decoration:
  • Wedding Decoration
Venue:
  • Wedding Venue
Event Management:
  • Wedding Planning
      `
    };

    console.log('ℹ️  Sending test email with services...');
    const emailResponse = await makeRequest(`${BASE_URL}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (emailResponse.status === 200 && emailResponse.data.success) {
      console.log('✅ Email with services sent successfully');
      console.log('📧 Email details:', {
        method: emailResponse.data.method,
        messageId: emailResponse.data.messageId,
        status: emailResponse.data.status
      });
      return true;
    } else {
      console.log('❌ Failed to send email with services:', emailResponse.data);
      return false;
    }

  } catch (error) {
    console.log('❌ Error sending email with services:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Plan Event Flow Test with Services...');
  console.log('');

  // Test 1: Server connectivity
  const serverOk = await testServerConnectivity();
  if (!serverOk) {
    console.log('❌ Server connectivity failed. Please ensure the server is running.');
    return;
  }

  // Test 2: Complete flow with services
  const flowResult = await testCompleteFlow();
  if (!flowResult) {
    console.log('❌ Complete flow test failed.');
    return;
  }

  // Test 3: Email with services
  const emailOk = await testEmailWithServices();
  if (!emailOk) {
    console.log('❌ Email test failed.');
    return;
  }

  // Summary
  console.log('');
  console.log('--------------------------------------------------');
  console.log('  TEST SUMMARY');
  console.log('--------------------------------------------------');
  console.log('✅ Server connectivity: PASSED');
  console.log('✅ Complete flow with services: PASSED');
  console.log('✅ Email with services: PASSED');
  console.log('');
  console.log('📊 Flow Data:');
  console.log(`   Event Request ID: ${flowResult.eventRequestId}`);
  console.log(`   Call Schedule ID: ${flowResult.callScheduleId}`);
  console.log(`   Selected Services: ${selectedServices.length} services`);
  console.log('');
  console.log('📧 Email Status:');
  console.log(`   Emails sent to: ${ADMIN_EMAIL}`);
  console.log('   Please check your email inbox for the test email');
  console.log('   Look for subject: "🎉 TEST - Event Planning Request with Services - EVEA"');
  console.log('');
  console.log('🎯 Services included in email:');
  console.log('   • Wedding Photography');
  console.log('   • Wedding Catering');
  console.log('   • Wedding Decoration');
  console.log('   • Wedding Venue');
  console.log('   • Wedding Planning');
  console.log('');
  console.log('🎉 All tests completed successfully!');
}

main().catch(console.error);
