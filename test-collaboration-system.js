const http = require('http');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

console.log('🚀 Testing Collaboration System...\n');

// Test data
const testCollaborationData = {
  business_name: "Test Event Services Pvt Ltd",
  email: "test@example.com",
  phone_number: "+919876543210",
  collaboration_type: "event-management",
  additional_details: "We are a leading event management company with 5+ years of experience in corporate events and weddings. We would like to partner with EVEA to expand our reach and offer premium services to your clients."
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

async function testCollaborationAPI() {
  console.log('📋 Testing Collaboration API...');
  
  try {
    // Test POST request
    console.log('  📤 Testing POST /api/collaboration...');
    const postResponse = await makeRequest(`${BASE_URL}/api/collaboration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, testCollaborationData);

    console.log(`    Status: ${postResponse.status}`);
    if (postResponse.status === 200) {
      console.log('    ✅ POST request successful');
      console.log(`    Request ID: ${postResponse.body?.requestId}`);
    } else {
      console.log('    ❌ POST request failed');
      console.log(`    Error: ${postResponse.body?.error || 'Unknown error'}`);
    }

    // Test GET request
    console.log('  📥 Testing GET /api/collaboration...');
    const getResponse = await makeRequest(`${BASE_URL}/api/collaboration`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(`    Status: ${getResponse.status}`);
    if (getResponse.status === 200) {
      console.log('    ✅ GET request successful');
      console.log(`    Found ${getResponse.body?.data?.length || 0} collaboration requests`);
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
    business_name: "",
    email: "invalid-email",
    phone_number: "123",
    collaboration_type: ""
  };

  try {
    const response = await makeRequest(`${BASE_URL}/api/collaboration`, {
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
      to: 'test@example.com',
      subject: 'Test Collaboration Email',
      html: '<h1>Test Email</h1><p>This is a test email for collaboration system.</p>'
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
  console.log('🎯 COLLABORATION SYSTEM TEST SUITE');
  console.log('='.repeat(60));
  
  await testCollaborationAPI();
  await testValidation();
  await testEmailService();
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Suite Completed');
  console.log('='.repeat(60));
  
  console.log('\n📝 Next Steps:');
  console.log('1. Run the SQL script in your Supabase database:');
  console.log('   - Go to Supabase Dashboard > SQL Editor');
  console.log('   - Copy and paste the contents of create-collaboration-table.sql');
  console.log('   - Execute the script');
  console.log('\n2. Test the frontend:');
  console.log('   - Visit http://localhost:3001/collaboration');
  console.log('   - Fill out the form and submit');
  console.log('   - Check your email for notifications');
  console.log('\n3. Check the database:');
  console.log('   - Go to Supabase Dashboard > Table Editor');
  console.log('   - Check the collaboration_requests table');
}

runAllTests().catch(console.error);
