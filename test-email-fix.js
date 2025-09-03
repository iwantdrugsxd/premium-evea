const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';

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

async function testEmailFix() {
  console.log('🧪 Testing Email Fix for Call Schedules...\n');
  
  try {
    // Test call scheduling with email notification
    console.log('📞 Testing call schedule with email notification...');
    const response = await makeRequest(`${BASE_URL}/api/call-schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, {
      event_request_id: 32,
      scheduled_time: '2025-08-31T06:00:00Z',
      user_email: 'test-email-fix@example.com'
    });

    console.log(`Status: ${response.status}`);
    if (response.status === 200) {
      console.log('✅ Call schedule created successfully');
      console.log('📧 Email should have been sent to vnair0795@gmail.com');
      console.log('📋 Check your email inbox for the notification');
    } else {
      console.log('❌ Call schedule failed');
      console.log('Error:', response.body?.error || 'Unknown error');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testEmailFix().catch(console.error);
