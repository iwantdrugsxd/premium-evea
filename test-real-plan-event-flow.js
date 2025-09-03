/**
 * Real Plan-Event Flow Test
 * 
 * This script tests the complete plan-event flow and sends real emails to vnair0795@gmail.com
 * 
 * Usage: node test-real-plan-event-flow.js
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
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logSubSection(title) {
  log(`\n${'-'.repeat(40)}`, 'yellow');
  log(`  ${title}`, 'yellow');
  log(`${'-'.repeat(40)}`, 'yellow');
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

class RealPlanEventTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.adminEmail = 'vnair0795@gmail.com';
    this.testResults = [];
    this.eventRequestId = null;
    this.callScheduleId = null;
  }

  async runRealTest() {
    logSection('REAL PLAN-EVENT FLOW TEST');
    logInfo(`Testing complete flow and sending emails to: ${this.adminEmail}\n`);

    try {
      // Step 1: Test server connectivity
      await this.testServerConnectivity();

      // Step 2: Complete plan-event flow
      await this.testCompletePlanEventFlow();

      // Step 3: Send real emails
      await this.sendRealEmails();

      // Step 4: Generate report
      await this.generateReport();

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

  async testCompletePlanEventFlow() {
    logSubSection('2. COMPLETE PLAN-EVENT FLOW TEST');

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
        additional_notes: 'Real flow test event - please check email notifications'
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

  async sendRealEmails() {
    logSubSection('3. SENDING REAL EMAILS');

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
      }
    ];

    for (const emailTest of emailTests) {
      logInfo(`Sending: ${emailTest.name} to ${emailTest.data.to}`);
      
      try {
        const response = await this.makeRequest('POST', '/api/email/send', emailTest.data);
        
        if (response.success) {
          logSuccess(`${emailTest.name}: SENT (${response.method || 'unknown'})`);
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
                <span class="value">Real flow test event - please check email notifications</span>
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
Additional Notes: Real flow test event - please check email notifications

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

  async generateReport() {
    logSubSection('4. TEST REPORT');

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
        failed: this.testResults.filter(r => r.status === 'FAILED').length
      }
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'real-plan-event-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    logSuccess(`Test report saved to: ${reportPath}`);

    // Display summary
    logSubSection('REAL TEST SUMMARY');
    logInfo(`Total Tests: ${report.summary.total}`);
    logSuccess(`Passed: ${report.summary.passed}`);
    logError(`Failed: ${report.summary.failed}`);

    if (report.summary.failed > 0) {
      logSubSection('FAILED TESTS');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(result => {
          logError(`${result.test}: ${result.details}`);
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
    logInfo('Look for subjects starting with "🎉 REAL TEST"');

    return report;
  }
}

// Run the test
async function main() {
  const tester = new RealPlanEventTester();
  await tester.runRealTest();
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = RealPlanEventTester;
