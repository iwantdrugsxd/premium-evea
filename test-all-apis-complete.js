/**
 * Comprehensive API Test Script
 * 
 * This script tests all APIs and the complete plan-event flow with real email sending
 * 
 * Usage: node test-all-apis-complete.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Load environment variables from .env.local
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
  console.log('✅ Loaded environment variables from .env.local');
} catch (error) {
  console.log('⚠️ Could not load .env.local, using system environment variables');
}

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(70)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(70)}`, 'cyan');
}

function logSubSection(title) {
  log(`\n${'-'.repeat(50)}`, 'yellow');
  log(`  ${title}`, 'yellow');
  log(`${'-'.repeat(50)}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

class ComprehensiveAPITester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.adminEmail = 'vnair0795@gmail.com';
    this.testResults = [];
    this.eventRequestId = null;
    this.callScheduleId = null;
  }

  async runAllTests() {
    logSection('COMPREHENSIVE API & PLAN-EVENT FLOW TEST');
    logInfo(`Testing all APIs and complete flow with real emails to: ${this.adminEmail}\n`);

    try {
      // Step 1: Test server connectivity
      await this.testServerConnectivity();

      // Step 2: Test all individual APIs
      await this.testAllAPIs();

      // Step 3: Test complete plan-event flow
      await this.testCompletePlanEventFlow();

      // Step 4: Test real email sending
      await this.testRealEmailSending();

      // Step 5: Generate comprehensive report
      await this.generateComprehensiveReport();

    } catch (error) {
      logError(`Test execution failed: ${error.message}`);
      console.error(error);
    }
  }

  async testServerConnectivity() {
    logSubSection('1. SERVER CONNECTIVITY TEST');

    try {
      const response = await this.makeRequest('GET', '/api/test-supabase');
      if (response.success) {
        logSuccess('Server is running and accessible');
        this.testResults.push({
          test: 'Server Connectivity',
          status: 'PASSED',
          details: 'Server is running and accessible'
        });
      } else {
        throw new Error(response.error || 'Server test failed');
      }
    } catch (error) {
      logError(`Server connectivity failed: ${error.message}`);
      this.testResults.push({
        test: 'Server Connectivity',
        status: 'FAILED',
        details: error.message
      });
      throw error;
    }
  }

  async testAllAPIs() {
    logSubSection('2. INDIVIDUAL API TESTS');

    const apiTests = [
      {
        name: 'Events API',
        method: 'GET',
        endpoint: '/api/events',
        description: 'Fetch available events'
      },
      {
        name: 'Event Requests API',
        method: 'POST',
        endpoint: '/api/event-requests',
        data: {
          event_id: 1,
          location: 'Mumbai, Maharashtra',
          date_time: '2024-12-25T18:00:00.000Z',
          budget: 500000,
          guest_count: 200,
          additional_notes: 'API test event'
        },
        description: 'Create event request'
      },
      {
        name: 'Package Recommendations API',
        method: 'POST',
        endpoint: '/api/packages/recommend',
        data: {
          event_id: 1,
          budget: 500000,
          guest_count: 200
        },
        description: 'Get package recommendations'
      },
      {
        name: 'Email Send API',
        method: 'POST',
        endpoint: '/api/email/send',
        data: {
          to: this.adminEmail,
          subject: '🧪 API Test Email - EVEA',
          html: '<h1>API Test</h1><p>This is a test email from the API test.</p>',
          text: 'API Test - This is a test email from the API test.'
        },
        description: 'Send test email'
      },
      {
        name: 'Debug Users API',
        method: 'GET',
        endpoint: '/api/debug-users',
        description: 'Debug users endpoint'
      },
      {
        name: 'Debug Vendors API',
        method: 'GET',
        endpoint: '/api/debug-vendors',
        description: 'Debug vendors endpoint'
      }
    ];

    for (const apiTest of apiTests) {
      logInfo(`Testing: ${apiTest.name} - ${apiTest.description}`);
      
      try {
        const response = await this.makeRequest(apiTest.method, apiTest.endpoint, apiTest.data);
        
        if (response.success || response.events || response.event_request || response.packages) {
          logSuccess(`${apiTest.name}: ACCESSIBLE`);
          this.testResults.push({
            test: `API - ${apiTest.name}`,
            status: 'PASSED',
            details: `${apiTest.description} - Accessible`
          });
          
          // Store event request ID for later use
          if (apiTest.name === 'Event Requests API' && response.event_request) {
            this.eventRequestId = response.event_request.id;
            logInfo(`Event Request ID: ${this.eventRequestId}`);
          }
        } else {
          logWarning(`${apiTest.name}: RESPONDED WITH ERROR - ${response.error || 'Unknown error'}`);
          this.testResults.push({
            test: `API - ${apiTest.name}`,
            status: 'PARTIAL',
            details: response.error || 'Unknown error'
          });
        }
      } catch (error) {
        logError(`${apiTest.name}: FAILED - ${error.message}`);
        this.testResults.push({
          test: `API - ${apiTest.name}`,
          status: 'FAILED',
          details: error.message
        });
      }
    }
  }

  async testCompletePlanEventFlow() {
    logSubSection('3. COMPLETE PLAN-EVENT FLOW TEST');

    try {
      // Step 1: Get available events
      logInfo('Step 1: Fetching available events...');
      const eventsResponse = await this.makeRequest('GET', '/api/events');
      if (!eventsResponse.success || !eventsResponse.events) {
        throw new Error('Failed to fetch events');
      }
      
      const eventId = eventsResponse.events[0]?.id || 1;
      logSuccess(`Found ${eventsResponse.events.length} events, using event ID: ${eventId}`);
      
      // Step 2: Create event request
      logInfo('Step 2: Creating event request...');
      const eventRequestData = {
        event_id: eventId,
        location: 'Mumbai, Maharashtra',
        date_time: '2024-12-25T18:00:00.000Z',
        budget: 500000,
        guest_count: 200,
        additional_notes: 'Complete flow test event - real email test'
      };

      const eventRequestResponse = await this.makeRequest('POST', '/api/event-requests', eventRequestData);
      if (!eventRequestResponse.success) {
        throw new Error(`Event request creation failed: ${eventRequestResponse.error}`);
      }
      
      this.eventRequestId = eventRequestResponse.event_request.id;
      logSuccess(`Event request created with ID: ${this.eventRequestId}`);
      
      // Step 3: Get package recommendations
      logInfo('Step 3: Getting package recommendations...');
      const packageData = {
        event_id: eventId,
        budget: 500000,
        guest_count: 200
      };

      const packageResponse = await this.makeRequest('POST', '/api/packages/recommend', packageData);
      if (!packageResponse.success) {
        throw new Error(`Package recommendations failed: ${packageResponse.error}`);
      }
      
      logSuccess(`Found ${packageResponse.packages?.length || 0} package recommendations`);
      
      // Step 4: Update package selection
      logInfo('Step 4: Updating package selection...');
      const packageUpdateData = {
        event_request_id: this.eventRequestId,
        selected_package: 'premium'
      };

      const packageUpdateResponse = await this.makeRequest('POST', '/api/event-requests/update-package', packageUpdateData);
      if (!packageUpdateResponse.success) {
        throw new Error(`Package update failed: ${packageUpdateResponse.error}`);
      }
      
      logSuccess('Package selection updated successfully');
      
      // Step 5: Schedule call
      logInfo('Step 5: Scheduling consultation call...');
      const callScheduleData = {
        event_request_id: this.eventRequestId,
        scheduled_time: new Date().toISOString(),
        user_email: 'test@example.com'
      };

      const callScheduleResponse = await this.makeRequest('POST', '/api/call-schedules', callScheduleData);
      if (!callScheduleResponse.success) {
        throw new Error(`Call scheduling failed: ${callScheduleResponse.error}`);
      }
      
      this.callScheduleId = callScheduleResponse.call_schedule.id;
      logSuccess(`Call scheduled with ID: ${this.callScheduleId}`);
      
      this.testResults.push({
        test: 'Complete Plan Event Flow',
        status: 'PASSED',
        details: `Flow completed successfully. Event Request: ${this.eventRequestId}, Call Schedule: ${this.callScheduleId}`
      });
      
    } catch (error) {
      logError(`Complete flow test failed: ${error.message}`);
      this.testResults.push({
        test: 'Complete Plan Event Flow',
        status: 'FAILED',
        details: error.message
      });
      throw error;
    }
  }

  async testRealEmailSending() {
    logSubSection('4. REAL EMAIL SENDING TEST');

    const emailTests = [
      {
        name: 'Admin Notification Email (Real)',
        data: {
          to: this.adminEmail,
          subject: '🎉 REAL TEST - New Event Planning Request - EVEA',
          html: this.generateRealAdminEmailHTML(),
          text: this.generateRealAdminEmailText()
        }
      },
      {
        name: 'User Confirmation Email (Real)',
        data: {
          to: this.adminEmail, // Sending to admin for testing
          subject: '🎉 REAL TEST - Your Event Planning Request Confirmation - EVEA',
          html: this.generateRealUserEmailHTML(),
          text: this.generateRealUserEmailText()
        }
      },
      {
        name: 'Simple Test Email',
        data: {
          to: this.adminEmail,
          subject: '🧪 Simple Test Email - EVEA System',
          html: '<h1>Simple Test Email</h1><p>This is a simple test email to verify the email system is working.</p>',
          text: 'Simple Test Email - This is a simple test email to verify the email system is working.'
        }
      }
    ];

    for (const emailTest of emailTests) {
      logInfo(`Sending: ${emailTest.name} to ${emailTest.data.to}`);
      
      try {
        const response = await this.makeRequest('POST', '/api/email/send', emailTest.data);
        
        if (response.success) {
          logSuccess(`${emailTest.name}: SENT (${response.method || 'unknown'})`);
          
          if (response.method === 'nodemailer') {
            logSuccess('✅ REAL EMAIL SENT via Gmail SMTP!');
          } else if (response.method === 'simulated') {
            logWarning('⚠️ Email was simulated - check configuration');
          }
          
          this.testResults.push({
            test: `Email Sending - ${emailTest.name}`,
            status: 'PASSED',
            details: `Email sent successfully via ${response.method || 'unknown'} method to ${emailTest.data.to}`
          });
        } else {
          logError(`${emailTest.name}: FAILED - ${response.error}`);
          this.testResults.push({
            test: `Email Sending - ${emailTest.name}`,
            status: 'FAILED',
            details: response.error
          });
        }
      } catch (error) {
        logError(`${emailTest.name}: ERROR - ${error.message}`);
        this.testResults.push({
          test: `Email Sending - ${emailTest.name}`,
          status: 'FAILED',
          details: error.message
        });
      }
    }
  }

  generateRealAdminEmailHTML() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>REAL TEST - New Event Planning Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          .detail { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 REAL TEST - New Event Planning Request</h1>
            <p>EVEA - Creating Unforgettable Moments</p>
            <p><strong>This is a REAL test email sent at ${new Date().toLocaleString()}</strong></p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>📋 Event Details</h3>
              <div class="detail">
                <span class="label">Event Type:</span>
                <span class="value">Wedding</span>
              </div>
              <div class="detail">
                <span class="label">Location:</span>
                <span class="value">Mumbai, Maharashtra</span>
              </div>
              <div class="detail">
                <span class="label">Event Date:</span>
                <span class="value">December 25, 2024</span>
              </div>
              <div class="detail">
                <span class="label">Budget:</span>
                <span class="value">₹500,000</span>
              </div>
              <div class="detail">
                <span class="label">Guest Count:</span>
                <span class="value">200</span>
              </div>
              <div class="detail">
                <span class="label">Selected Package:</span>
                <span class="value">PREMIUM</span>
              </div>
              <div class="detail">
                <span class="label">Additional Notes:</span>
                <span class="value">Complete flow test event - real email test</span>
              </div>
            </div>

            <div class="section">
              <h3>👤 Customer Information</h3>
              <div class="detail">
                <span class="label">Email Address:</span>
                <span class="value">test@example.com</span>
              </div>
              <div class="detail">
                <span class="label">Call Scheduled For:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>

            <div class="section">
              <h3>📞 Quick Actions</h3>
              <div class="highlight">
                <p><strong>This is a REAL test email! Please contact the customer at the scheduled time.</strong></p>
                <p>Email: <a href="mailto:test@example.com">test@example.com</a></p>
                <p>Event Request ID: ${this.eventRequestId}</p>
                <p>Call Schedule ID: ${this.callScheduleId}</p>
              </div>
            </div>

            <div class="section">
              <h3>📊 Request Summary</h3>
              <div class="detail">
                <span class="label">Request ID:</span>
                <span class="value">#${this.eventRequestId}</span>
              </div>
              <div class="detail">
                <span class="label">Submitted:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a REAL test notification from EVEA Event Planning System</p>
            <p>© 2024 EVEA. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateRealAdminEmailText() {
    return `
🎉 REAL TEST - NEW EVENT PLANNING REQUEST - EVEA

This is a REAL test email sent at ${new Date().toLocaleString()}

EVENT DETAILS:
━━━━━━━━━━━━━━━
Event Type: Wedding
Location: Mumbai, Maharashtra
Event Date: December 25, 2024
Budget: ₹500,000
Guest Count: 200
Selected Package: PREMIUM
Additional Notes: Complete flow test event - real email test

CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━
Email Address: test@example.com
Call Scheduled For: ${new Date().toLocaleString()}

QUICK ACTIONS:
━━━━━━━━━━━━━━━
This is a REAL test email! Please contact the customer at the scheduled time.
Email: test@example.com
Event Request ID: ${this.eventRequestId}
Call Schedule ID: ${this.callScheduleId}

REQUEST SUMMARY:
━━━━━━━━━━━━━━━
Request ID: #${this.eventRequestId}
Submitted: ${new Date().toLocaleString()}

---
This is a REAL test notification from EVEA Event Planning System
© 2024 EVEA. All rights reserved.
    `;
  }

  generateRealUserEmailHTML() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>REAL TEST - Event Planning Request Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 REAL TEST - Thank You for Your Event Planning Request!</h1>
            <p>EVEA - Creating Unforgettable Moments</p>
            <p><strong>This is a REAL test email sent at ${new Date().toLocaleString()}</strong></p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>✅ Request Confirmed</h3>
              <p>We've received your event planning request and our team will contact you at the scheduled time.</p>
              <p>You will receive a call from our team to discuss your event details.</p>
            </div>

            <div class="section">
              <h3>📋 Your Event Details</h3>
              <p><strong>Event Type:</strong> Wedding</p>
              <p><strong>Location:</strong> Mumbai, Maharashtra</p>
              <p><strong>Date:</strong> December 25, 2024</p>
              <p><strong>Budget:</strong> ₹500,000</p>
              <p><strong>Guest Count:</strong> 200</p>
              <p><strong>Package:</strong> Premium</p>
            </div>

            <div class="section">
              <h3>📞 Consultation Call</h3>
              <div class="highlight">
                <p><strong>Call Scheduled For:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Event Request ID:</strong> ${this.eventRequestId}</p>
                <p><strong>Call Schedule ID:</strong> ${this.callScheduleId}</p>
              </div>
            </div>

            <div class="section">
              <h3>📧 Contact Information</h3>
              <p>If you have any questions, please contact us at:</p>
              <p>Email: support@evea.com</p>
              <p>Phone: +91 1234567890</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a REAL test confirmation from EVEA Event Planning</p>
            <p>© 2024 EVEA. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateRealUserEmailText() {
    return `
🎉 REAL TEST - Thank You for Your Event Planning Request!

This is a REAL test email sent at ${new Date().toLocaleString()}

✅ REQUEST CONFIRMED
━━━━━━━━━━━━━━━
We've received your event planning request and our team will contact you at the scheduled time.
You will receive a call from our team to discuss your event details.

📋 YOUR EVENT DETAILS
━━━━━━━━━━━━━━━
Event Type: Wedding
Location: Mumbai, Maharashtra
Date: December 25, 2024
Budget: ₹500,000
Guest Count: 200
Package: Premium

📞 CONSULTATION CALL
━━━━━━━━━━━━━━━
Call Scheduled For: ${new Date().toLocaleString()}
Event Request ID: ${this.eventRequestId}
Call Schedule ID: ${this.callScheduleId}

📧 CONTACT INFORMATION
━━━━━━━━━━━━━━━
If you have any questions, please contact us at:
Email: support@evea.com
Phone: +91 1234567890

---
This is a REAL test confirmation from EVEA Event Planning
© 2024 EVEA. All rights reserved.
    `;
  }

  async makeRequest(method, endpoint, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      const req = client.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            resolve(response);
          } catch (error) {
            resolve({ success: false, error: 'Invalid JSON response', body });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async generateComprehensiveReport() {
    logSubSection('5. COMPREHENSIVE TEST REPORT');

    const report = {
      timestamp: new Date().toISOString(),
      adminEmail: this.adminEmail,
      testResults: this.testResults,
      flowData: {
        eventRequestId: this.eventRequestId,
        callScheduleId: this.callScheduleId
      },
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(r => r.status === 'PASSED').length,
        failed: this.testResults.filter(r => r.status === 'FAILED').length,
        partial: this.testResults.filter(r => r.status === 'PARTIAL').length
      }
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'comprehensive-api-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    logSuccess(`Comprehensive test report saved to: ${reportPath}`);

    // Display summary
    logSubSection('COMPREHENSIVE TEST SUMMARY');
    logInfo(`Total Tests: ${report.summary.total}`);
    logSuccess(`Passed: ${report.summary.passed}`);
    logError(`Failed: ${report.summary.failed}`);
    logWarning(`Partial: ${report.summary.partial}`);

    if (report.summary.failed > 0) {
      logSubSection('FAILED TESTS');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(result => {
          logError(`${result.test}: ${result.details}`);
        });
    }

    if (report.summary.partial > 0) {
      logSubSection('PARTIAL TESTS');
      this.testResults
        .filter(r => r.status === 'PARTIAL')
        .forEach(result => {
          logWarning(`${result.test}: ${result.details}`);
        });
    }

    // Show flow data
    if (this.eventRequestId || this.callScheduleId) {
      logSubSection('FLOW DATA');
      if (this.eventRequestId) {
        logInfo(`Event Request ID: ${this.eventRequestId}`);
      }
      if (this.callScheduleId) {
        logInfo(`Call Schedule ID: ${this.callScheduleId}`);
      }
    }

    // Final message
    logSubSection('EMAIL STATUS');
    logInfo(`Emails sent to: ${this.adminEmail}`);
    logInfo('Please check your email inbox for the test emails');
    logInfo('Look for subjects starting with "🎉 REAL TEST" or "🧪"');

    return report;
  }
}

// Run the comprehensive test
async function main() {
  const tester = new ComprehensiveAPITester();
  await tester.runAllTests();
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ComprehensiveAPITester;
