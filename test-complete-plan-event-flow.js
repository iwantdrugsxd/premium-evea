/**
 * Complete Plan-Event Flow Test Script
 * 
 * This script tests the entire plan-event flow with real API calls:
 * 1. Tests all API endpoints
 * 2. Tests complete user flow scenarios
 * 3. Tests email sending functionality
 * 4. Tests database operations
 * 5. Tests redirect logic
 * 
 * Usage: node test-complete-plan-event-flow.js
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

class CompletePlanEventTester {
  constructor() {
    this.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
    this.testResults = [];
    this.authToken = null;
    this.eventRequestId = null;
    this.callScheduleId = null;
  }

  async runTests() {
    logSection('COMPLETE PLAN-EVENT FLOW TEST');
    logInfo('Testing entire plan-event flow with real API calls...\n');

    try {
      // Step 1: Check environment and connectivity
      await this.checkEnvironmentAndConnectivity();

      // Step 2: Test API endpoints
      await this.testAPIEndpoints();

      // Step 3: Test complete plan-event flow
      await this.testCompletePlanEventFlow();

      // Step 4: Test email functionality
      await this.testEmailFunctionality();

      // Step 5: Test user scenarios
      await this.testUserScenarios();

      // Step 6: Generate comprehensive report
      await this.generateComprehensiveReport();

    } catch (error) {
      logError(`Test execution failed: ${error.message}`);
      console.error(error);
    }
  }

  async checkEnvironmentAndConnectivity() {
    logSubSection('1. ENVIRONMENT & CONNECTIVITY CHECK');

    // Check environment variables
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'JWT_SECRET'
    ];

    logInfo('Checking environment variables...');
    for (const envVar of requiredVars) {
      if (process.env[envVar]) {
        logSuccess(`${envVar}: Configured`);
      } else {
        logError(`${envVar}: NOT SET`);
        this.testResults.push({
          test: 'Environment Variables',
          status: 'FAILED',
          details: `${envVar} is not set`
        });
      }
    }

    // Test server connectivity
    logInfo('Testing server connectivity...');
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
        logError(`Server test failed: ${response.error}`);
        this.testResults.push({
          test: 'Server Connectivity',
          status: 'FAILED',
          details: response.error
        });
      }
    } catch (error) {
      logError(`Server connectivity failed: ${error.message}`);
      this.testResults.push({
        test: 'Server Connectivity',
        status: 'FAILED',
        details: error.message
      });
    }
  }

  async testAPIEndpoints() {
    logSubSection('2. API ENDPOINTS TEST');

    const endpoints = [
      { name: 'Events API', method: 'GET', path: '/api/events' },
      { name: 'Event Requests API', method: 'POST', path: '/api/event-requests' },
      { name: 'Package Recommendations API', method: 'POST', path: '/api/packages/recommend' },
      { name: 'Call Schedules API', method: 'POST', path: '/api/call-schedules' },
      { name: 'Email Send API', method: 'POST', path: '/api/email/send' },
      { name: 'Debug Users API', method: 'GET', path: '/api/debug-users' },
      { name: 'Debug Vendors API', method: 'GET', path: '/api/debug-vendors' }
    ];

    for (const endpoint of endpoints) {
      logInfo(`Testing: ${endpoint.name}`);
      
      try {
        let response;
        if (endpoint.method === 'GET') {
          response = await this.makeRequest('GET', endpoint.path);
        } else {
          // For POST endpoints, send test data
          const testData = this.getTestDataForEndpoint(endpoint.path);
          response = await this.makeRequest('POST', endpoint.path, testData);
        }

        if (response.success || response.status === 200) {
          logSuccess(`${endpoint.name}: ACCESSIBLE`);
          this.testResults.push({
            test: `API Endpoint - ${endpoint.name}`,
            status: 'PASSED',
            details: 'Endpoint is accessible'
          });
        } else {
          logWarning(`${endpoint.name}: RESPONDED WITH ERROR - ${response.error || 'Unknown error'}`);
          this.testResults.push({
            test: `API Endpoint - ${endpoint.name}`,
            status: 'PARTIAL',
            details: response.error || 'Endpoint responded with error'
          });
        }
      } catch (error) {
        logError(`${endpoint.name}: FAILED - ${error.message}`);
        this.testResults.push({
          test: `API Endpoint - ${endpoint.name}`,
          status: 'FAILED',
          details: error.message
        });
      }
    }
  }

  getTestDataForEndpoint(path) {
    switch (path) {
      case '/api/event-requests':
        return {
          event_id: 1,
          location: 'Mumbai, Maharashtra',
          date_time: '2024-12-25T18:00:00.000Z',
          budget: 500000,
          guest_count: 200,
          additional_notes: 'Test event request'
        };
      
      case '/api/packages/recommend':
        return {
          event_id: 1,
          budget: 500000,
          guest_count: 200
        };
      
      case '/api/call-schedules':
        return {
          event_request_id: this.eventRequestId || 1,
          scheduled_time: new Date().toISOString(),
          user_email: 'test@example.com'
        };
      
      case '/api/email/send':
        return {
          to: 'test@example.com',
          subject: 'Test Email',
          html: '<h1>Test</h1>',
          text: 'Test email'
        };
      
      default:
        return {};
    }
  }

  async testCompletePlanEventFlow() {
    logSubSection('3. COMPLETE PLAN-EVENT FLOW TEST');

    logInfo('Testing complete plan-event flow with real data...');

    try {
      // Step 1: Get available events
      logInfo('Step 1: Fetching available events...');
      const eventsResponse = await this.makeRequest('GET', '/api/events');
      if (eventsResponse.success && eventsResponse.events) {
        logSuccess(`Found ${eventsResponse.events.length} events`);
        const eventId = eventsResponse.events[0]?.id || 1;
        
        // Step 2: Create event request
        logInfo('Step 2: Creating event request...');
        const eventRequestData = {
          event_id: eventId,
          location: 'Mumbai, Maharashtra',
          date_time: '2024-12-25T18:00:00.000Z',
          budget: 500000,
          guest_count: 200,
          additional_notes: 'Complete flow test event'
        };

        const eventRequestResponse = await this.makeRequest('POST', '/api/event-requests', eventRequestData);
        if (eventRequestResponse.success) {
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
          if (packageResponse.success) {
            logSuccess(`Found ${packageResponse.packages?.length || 0} package recommendations`);
            
            // Step 4: Update package selection
            logInfo('Step 4: Updating package selection...');
            const packageUpdateData = {
              event_request_id: this.eventRequestId,
              selected_package: 'premium'
            };

            const packageUpdateResponse = await this.makeRequest('POST', '/api/event-requests/update-package', packageUpdateData);
            if (packageUpdateResponse.success) {
              logSuccess('Package selection updated successfully');
              
              // Step 5: Schedule call
              logInfo('Step 5: Scheduling consultation call...');
              const callScheduleData = {
                event_request_id: this.eventRequestId,
                scheduled_time: new Date().toISOString(),
                user_email: 'test@example.com'
              };

              const callScheduleResponse = await this.makeRequest('POST', '/api/call-schedules', callScheduleData);
              if (callScheduleResponse.success) {
                this.callScheduleId = callScheduleResponse.call_schedule.id;
                logSuccess(`Call scheduled with ID: ${this.callScheduleId}`);
                
                this.testResults.push({
                  test: 'Complete Plan Event Flow',
                  status: 'PASSED',
                  details: `Flow completed successfully. Event Request: ${this.eventRequestId}, Call Schedule: ${this.callScheduleId}`
                });
              } else {
                throw new Error(`Call scheduling failed: ${callScheduleResponse.error}`);
              }
            } else {
              throw new Error(`Package update failed: ${packageUpdateResponse.error}`);
            }
          } else {
            throw new Error(`Package recommendations failed: ${packageResponse.error}`);
          }
        } else {
          throw new Error(`Event request creation failed: ${eventRequestResponse.error}`);
        }
      } else {
        throw new Error(`Events fetch failed: ${eventsResponse.error}`);
      }
    } catch (error) {
      logError(`Complete flow test failed: ${error.message}`);
      this.testResults.push({
        test: 'Complete Plan Event Flow',
        status: 'FAILED',
        details: error.message
      });
    }
  }

  async testEmailFunctionality() {
    logSubSection('4. EMAIL FUNCTIONALITY TEST');

    const emailTests = [
      {
        name: 'Admin Notification Email',
        data: {
          to: process.env.ADMIN_EMAIL || 'admin@evea.com',
          subject: '🧪 Test Email - Complete Flow Test',
          html: this.generateTestEmailHTML('Admin Test'),
          text: this.generateTestEmailText('Admin Test')
        }
      },
      {
        name: 'User Confirmation Email',
        data: {
          to: 'test@example.com',
          subject: '🎉 Your Event Planning Request - EVEA',
          html: this.generateUserEmailHTML(),
          text: this.generateUserEmailText()
        }
      }
    ];

    for (const emailTest of emailTests) {
      logInfo(`Testing: ${emailTest.name}`);
      
      try {
        const response = await this.makeRequest('POST', '/api/email/send', emailTest.data);
        
        if (response.success) {
          logSuccess(`${emailTest.name}: SENT (${response.method || 'unknown'})`);
          this.testResults.push({
            test: `Email Sending - ${emailTest.name}`,
            status: 'PASSED',
            details: `Email sent successfully via ${response.method || 'unknown'} method`
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

  async testUserScenarios() {
    logSubSection('5. USER SCENARIOS TEST');

    const scenarios = [
      {
        name: 'Logged-in User with Complete Profile',
        userEmail: 'complete@example.com',
        expectedRedirect: false
      },
      {
        name: 'Logged-in User with Incomplete Profile',
        userEmail: 'incomplete@example.com',
        expectedRedirect: true
      },
      {
        name: 'Non-Logged-in User',
        userEmail: 'guest@example.com',
        expectedRedirect: true
      }
    ];

    for (const scenario of scenarios) {
      logInfo(`Testing: ${scenario.name}`);
      
      try {
        // Test user lookup
        const userResponse = await this.makeRequest('GET', `/api/debug-users?email=${scenario.userEmail}`);
        
        if (userResponse.success) {
          const hasUser = userResponse.users && userResponse.users.length > 0;
          const user = hasUser ? userResponse.users[0] : null;
          const hasCompleteProfile = user && user.mobile_number && user.location;
          
          const shouldRedirect = !hasUser || !hasCompleteProfile;
          
          if (shouldRedirect === scenario.expectedRedirect) {
            logSuccess(`${scenario.name}: CORRECT REDIRECT LOGIC`);
            this.testResults.push({
              test: `User Scenario - ${scenario.name}`,
              status: 'PASSED',
              details: `Redirect logic working correctly (should redirect: ${shouldRedirect})`
            });
          } else {
            logError(`${scenario.name}: INCORRECT REDIRECT LOGIC`);
            this.testResults.push({
              test: `User Scenario - ${scenario.name}`,
              status: 'FAILED',
              details: `Expected redirect: ${scenario.expectedRedirect}, got: ${shouldRedirect}`
            });
          }
        } else {
          logWarning(`${scenario.name}: USER LOOKUP FAILED - ${userResponse.error}`);
          this.testResults.push({
            test: `User Scenario - ${scenario.name}`,
            status: 'PARTIAL',
            details: `User lookup failed: ${userResponse.error}`
          });
        }
      } catch (error) {
        logError(`${scenario.name}: ERROR - ${error.message}`);
        this.testResults.push({
          test: `User Scenario - ${scenario.name}`,
          status: 'FAILED',
          details: error.message
        });
      }
    }
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

      if (this.authToken) {
        options.headers['Authorization'] = `Bearer ${this.authToken}`;
      }

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

  generateTestEmailHTML(type) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Email - ${type}</title>
      </head>
      <body>
        <h1>🧪 Test Email</h1>
        <p>This is a test email for the complete plan-event flow.</p>
        <p>Type: ${type}</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Service: Supabase Default Email</p>
      </body>
      </html>
    `;
  }

  generateTestEmailText(type) {
    return `
🧪 Test Email - ${type}

This is a test email for the complete plan-event flow.

Type: ${type}
Timestamp: ${new Date().toISOString()}
Service: Supabase Default Email

---
EVEA Test System
    `;
  }

  generateUserEmailHTML() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Planning Request Confirmation</title>
      </head>
      <body>
        <h1>🎉 Thank You for Your Event Planning Request!</h1>
        <p>We've received your event planning request and our team will contact you at the scheduled time.</p>
        <p>You will receive a call from our team to discuss your event details.</p>
        <p><strong>Service:</strong> Supabase Default Email</p>
      </body>
      </html>
    `;
  }

  generateUserEmailText() {
    return `
🎉 Thank You for Your Event Planning Request!

We've received your event planning request and our team will contact you at the scheduled time.

You will receive a call from our team to discuss your event details.

Service: Supabase Default Email

---
EVEA Event Planning
    `;
  }

  async generateComprehensiveReport() {
    logSubSection('6. COMPREHENSIVE TEST REPORT');

    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        baseUrl: this.baseUrl,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      },
      testResults: this.testResults,
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(r => r.status === 'PASSED').length,
        partial: this.testResults.filter(r => r.status === 'PARTIAL').length,
        failed: this.testResults.filter(r => r.status === 'FAILED').length
      },
      flowData: {
        eventRequestId: this.eventRequestId,
        callScheduleId: this.callScheduleId
      }
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'complete-plan-event-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    logSuccess(`Comprehensive test report saved to: ${reportPath}`);

    // Display summary
    logSubSection('COMPREHENSIVE TEST SUMMARY');
    logInfo(`Total Tests: ${report.summary.total}`);
    logSuccess(`Passed: ${report.summary.passed}`);
    logWarning(`Partial: ${report.summary.partial}`);
    logError(`Failed: ${report.summary.failed}`);

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

    // Generate recommendations
    logSubSection('RECOMMENDATIONS');
    
    if (report.summary.failed === 0 && report.summary.partial === 0) {
      logSuccess('🎉 All tests passed! Your plan-event flow is working perfectly.');
      logInfo('✅ All API endpoints are accessible');
      logInfo('✅ Complete flow works end-to-end');
      logInfo('✅ Email service is functional');
      logInfo('✅ User scenarios are handled correctly');
    } else {
      logWarning('Some tests failed or are partial. Please check the following:');
      logInfo('1. Ensure the Next.js server is running on the correct port');
      logInfo('2. Check Supabase connection and permissions');
      logInfo('3. Verify database tables and relationships');
      logInfo('4. Test email service configuration');
      logInfo('5. Review API endpoint implementations');
    }

    // Show flow data if available
    if (this.eventRequestId || this.callScheduleId) {
      logSubSection('FLOW DATA');
      if (this.eventRequestId) {
        logInfo(`Event Request ID: ${this.eventRequestId}`);
      }
      if (this.callScheduleId) {
        logInfo(`Call Schedule ID: ${this.callScheduleId}`);
      }
    }

    return report;
  }
}

// Run the tests
async function main() {
  const tester = new CompletePlanEventTester();
  await tester.runTests();
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = CompletePlanEventTester;
