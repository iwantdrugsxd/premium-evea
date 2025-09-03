const http = require('http');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const BASE_URL = 'http://localhost:3000';

console.log('🚀 Testing Event Partner System...\n');

// Test data for event partner application
const testEventPartnerData = {
  full_name: "Priya Sharma",
  email: "priya.sharma@example.com",
  phone_number: "+919876543212",
  event_management_experience: "I have 5+ years of experience in event management, specializing in corporate events and weddings. I have successfully managed over 50 events including product launches, annual conferences, and destination weddings. My expertise includes vendor coordination, timeline management, budget control, and on-ground event execution. I have worked with teams of 10-20 people and have experience in both indoor and outdoor venues. I am proficient in using event management software and have excellent communication skills in English, Hindi, and Marathi."
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

async function testEventPartnerAPI() {
  console.log('📋 Testing Event Partner API...');
  
  try {
    // Test POST request
    console.log('  📤 Testing POST /api/event-partners...');
    const postResponse = await makeRequest(`${BASE_URL}/api/event-partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, testEventPartnerData);

    console.log(`    Status: ${postResponse.status}`);
    if (postResponse.status === 200) {
      console.log('    ✅ POST request successful');
      console.log(`    Application ID: ${postResponse.body?.applicationId}`);
    } else {
      console.log('    ❌ POST request failed');
      console.log(`    Error: ${postResponse.body?.error || 'Unknown error'}`);
    }

    // Test GET request
    console.log('  📥 Testing GET /api/event-partners...');
    const getResponse = await makeRequest(`${BASE_URL}/api/event-partners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(`    Status: ${getResponse.status}`);
    if (getResponse.status === 200) {
      console.log('    ✅ GET request successful');
      console.log(`    Found ${getResponse.body?.data?.length || 0} event partner applications`);
    } else {
      console.log('    ❌ GET request failed');
      console.log(`    Error: ${getResponse.body?.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.log('    ❌ API test failed:', error.message);
  }
}

async function testValidation() {
  console.log('\n🔍 Testing Form Validation...');
  
  const invalidData = {
    full_name: "",
    email: "invalid-email",
    phone_number: "123",
    event_management_experience: ""
  };

  try {
    const response = await makeRequest(`${BASE_URL}/api/event-partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, invalidData);

    console.log(`  Status: ${response.status}`);
    if (response.status === 400) {
      console.log('  ✅ Validation working correctly');
      console.log(`  Error: ${response.body?.error}`);
    } else {
      console.log('  ❌ Validation not working as expected');
    }
  } catch (error) {
    console.log('  ❌ Validation test failed:', error.message);
  }
}

async function testEmailService() {
  console.log('\n📧 Testing Email Service Integration...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, {
      to: 'vnair0795@gmail.com',
      subject: 'Test Event Partner Email',
      html: '<h1>Test Email</h1><p>This is a test email for event partner system.</p>'
    });

    console.log(`  Status: ${response.status}`);
    if (response.status === 200) {
      console.log('  ✅ Email service working');
    } else {
      console.log('  ⚠️ Email service may have issues');
      console.log(`  Response: ${response.body?.message || 'Unknown'}`);
    }
  } catch (error) {
    console.log('  ❌ Email service test failed:', error.message);
  }
}

async function runAllTests() {
  console.log('='.repeat(60));
  console.log('🎯 EVENT PARTNER SYSTEM TEST SUITE');
  console.log('='.repeat(60));
  
  await testEventPartnerAPI();
  await testValidation();
  await testEmailService();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Suite Completed');
  console.log('='.repeat(60));
  
  console.log('\n📝 Next Steps:');
  console.log('1. Run the SQL script in your Supabase database:');
  console.log('   - Go to Supabase Dashboard > SQL Editor');
  console.log('   - Copy and paste the contents of create-event-partner-table.sql');
  console.log('   - Execute the script');
  console.log('\n2. Test the frontend:');
  console.log('   - Visit http://localhost:3000/event-partner');
  console.log('   - Fill out the form and submit');
  console.log('   - Check your email for notifications');
  console.log('\n3. Check the database:');
  console.log('   - Go to Supabase Dashboard > Table Editor');
  console.log('   - Check the event_partners table');
  console.log('\n4. Test from careers page:');
  console.log('   - Visit http://localhost:3000/careers');
  console.log('   - Click "Apply Now" on Event Partners card');
  console.log('   - Should redirect to event partner form');
}

runAllTests().catch(console.error);
