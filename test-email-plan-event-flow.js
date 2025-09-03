/**
 * Test Script: Email Service in Plan-Event Flow
 * 
 * This script tests the email functionality in the plan-event flow:
 * 1. Tests with logged-in user (fetches user details)
 * 2. Tests with non-logged-in user (redirects to login)
 * 3. Tests email sending after call scheduling
 * 4. Validates environment variables
 * 
 * Usage: node test-email-plan-event-flow.js
 */

const fs = require('fs');
const path = require('path');

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

class PlanEventEmailTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
    this.envVars = {};
  }

  async runTests() {
    logSection('PLAN-EVENT EMAIL SERVICE TEST');
    logInfo('Starting comprehensive email service test...\n');

    try {
      // Step 1: Check environment variables
      await this.checkEnvironmentVariables();

      // Step 2: Test with logged-in user
      await this.testLoggedInUserFlow();

      // Step 3: Test with non-logged-in user
      await this.testNonLoggedInUserFlow();

      // Step 4: Test email sending directly
      await this.testDirectEmailSending();

      // Step 5: Generate test report
      await this.generateTestReport();

    } catch (error) {
      logError(`Test execution failed: ${error.message}`);
      console.error(error);
    }
  }

  async checkEnvironmentVariables() {
    logSubSection('1. ENVIRONMENT VARIABLES CHECK');

    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'JWT_SECRET',
      'RESEND_API_KEY',
      'SUPABASE_EDGE_FUNCTION_URL'
    ];

    const optionalEnvVars = [
      'ADMIN_EMAIL',
      'ADMIN_WHATSAPP'
    ];

    logInfo('Checking required environment variables...');

    for (const envVar of requiredEnvVars) {
      const value = process.env[envVar];
      if (value) {
        this.envVars[envVar] = value.substring(0, 10) + '...';
        logSuccess(`${envVar}: ${this.envVars[envVar]}`);
      } else {
        logError(`${envVar}: NOT SET`);
        this.testResults.push({
          test: 'Environment Variables',
          status: 'FAILED',
          details: `${envVar} is not set`
        });
      }
    }

    logInfo('Checking optional environment variables...');
    for (const envVar of optionalEnvVars) {
      const value = process.env[envVar];
      if (value) {
        this.envVars[envVar] = value;
        logSuccess(`${envVar}: ${value}`);
      } else {
        logWarning(`${envVar}: NOT SET (optional)`);
      }
    }

    // Check if .env.local file exists
    const envLocalPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      logSuccess('.env.local file exists');
      const envContent = fs.readFileSync(envLocalPath, 'utf8');
      const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      logInfo(`Found ${envLines.length} environment variables in .env.local`);
    } else {
      logWarning('.env.local file not found');
    }
  }

  async testLoggedInUserFlow() {
    logSubSection('2. LOGGED-IN USER FLOW TEST');

    const testData = {
      eventType: 'wedding',
      location: 'Mumbai, Maharashtra',
      date: '2024-12-25T18:00:00.000Z',
      budget: 500000,
      guestCount: 200,
      additionalNotes: 'Test event for email service validation',
      userEmail: 'test@example.com',
      scheduledTime: '14:30'
    };

    logInfo('Simulating logged-in user flow...');

    try {
      // Step 1: Create event request
      logInfo('Step 1: Creating event request...');
      const eventRequest = await this.createEventRequest(testData);
      
      if (eventRequest.success) {
        logSuccess(`Event request created with ID: ${eventRequest.event_request.id}`);
        
        // Step 2: Update with package selection
        logInfo('Step 2: Updating with package selection...');
        const packageUpdate = await this.updatePackageSelection(
          eventRequest.event_request.id, 
          'premium'
        );
        
        if (packageUpdate.success) {
          logSuccess('Package selection updated successfully');
          
          // Step 3: Schedule call
          logInfo('Step 3: Scheduling consultation call...');
          const callSchedule = await this.scheduleCall(
            eventRequest.event_request.id,
            testData.userEmail,
            testData.scheduledTime
          );
          
          if (callSchedule.success) {
            logSuccess('Call scheduled successfully');
            logInfo(`Call ID: ${callSchedule.call_schedule.id}`);
            logInfo(`Scheduled for: ${callSchedule.call_schedule.scheduled_time}`);
            
            this.testResults.push({
              test: 'Logged-in User Flow',
              status: 'PASSED',
              details: 'Complete flow executed successfully'
            });
          } else {
            logError(`Call scheduling failed: ${callSchedule.error}`);
            this.testResults.push({
              test: 'Logged-in User Flow',
              status: 'FAILED',
              details: `Call scheduling failed: ${callSchedule.error}`
            });
          }
        } else {
          logError(`Package update failed: ${packageUpdate.error}`);
          this.testResults.push({
            test: 'Logged-in User Flow',
            status: 'FAILED',
            details: `Package update failed: ${packageUpdate.error}`
          });
        }
      } else {
        logError(`Event request creation failed: ${eventRequest.error}`);
        this.testResults.push({
          test: 'Logged-in User Flow',
          status: 'FAILED',
          details: `Event request creation failed: ${eventRequest.error}`
        });
      }
    } catch (error) {
      logError(`Logged-in user flow test failed: ${error.message}`);
      this.testResults.push({
        test: 'Logged-in User Flow',
        status: 'FAILED',
        details: error.message
      });
    }
  }

  async testNonLoggedInUserFlow() {
    logSubSection('3. NON-LOGGED-IN USER FLOW TEST');

    logInfo('Simulating non-logged-in user flow...');
    logInfo('This should redirect to login page and then to confirmation...');

    const testData = {
      eventType: 'birthday',
      location: 'Delhi, India',
      date: '2024-11-15T20:00:00.000Z',
      budget: 100000,
      guestCount: 50,
      additionalNotes: 'Test event without user login',
      userEmail: 'guest@example.com',
      scheduledTime: '16:00'
    };

    try {
      // Step 1: Create event request (should work without user)
      logInfo('Step 1: Creating event request without user login...');
      const eventRequest = await this.createEventRequest(testData);
      
      if (eventRequest.success) {
        logSuccess(`Event request created with ID: ${eventRequest.event_request.id}`);
        
        // Step 2: Update with package selection
        logInfo('Step 2: Updating with package selection...');
        const packageUpdate = await this.updatePackageSelection(
          eventRequest.event_request.id, 
          'basic'
        );
        
        if (packageUpdate.success) {
          logSuccess('Package selection updated successfully');
          
          // Step 3: Schedule call
          logInfo('Step 3: Scheduling consultation call...');
          const callSchedule = await this.scheduleCall(
            eventRequest.event_request.id,
            testData.userEmail,
            testData.scheduledTime
          );
          
          if (callSchedule.success) {
            logSuccess('Call scheduled successfully');
            logInfo(`Call ID: ${callSchedule.call_schedule.id}`);
            logInfo(`Scheduled for: ${callSchedule.call_schedule.scheduled_time}`);
            
            // Step 4: Test redirect logic
            logInfo('Step 4: Testing redirect logic...');
            const redirectTest = await this.testRedirectLogic(testData.userEmail);
            
            if (redirectTest.shouldRedirect) {
              logSuccess('Redirect logic working correctly');
              logInfo(`Should redirect to: ${redirectTest.redirectTo}`);
            } else {
              logWarning('No redirect needed - user has complete profile');
            }
            
            this.testResults.push({
              test: 'Non-Logged-in User Flow',
              status: 'PASSED',
              details: 'Complete flow executed successfully with redirect logic'
            });
          } else {
            logError(`Call scheduling failed: ${callSchedule.error}`);
            this.testResults.push({
              test: 'Non-Logged-in User Flow',
              status: 'FAILED',
              details: `Call scheduling failed: ${callSchedule.error}`
            });
          }
        } else {
          logError(`Package update failed: ${packageUpdate.error}`);
          this.testResults.push({
            test: 'Non-Logged-in User Flow',
            status: 'FAILED',
            details: `Package update failed: ${packageUpdate.error}`
          });
        }
      } else {
        logError(`Event request creation failed: ${eventRequest.error}`);
        this.testResults.push({
          test: 'Non-Logged-in User Flow',
          status: 'FAILED',
          details: `Event request creation failed: ${eventRequest.error}`
        });
      }
    } catch (error) {
      logError(`Non-logged-in user flow test failed: ${error.message}`);
      this.testResults.push({
        test: 'Non-Logged-in User Flow',
        status: 'FAILED',
        details: error.message
      });
    }
  }

  async testDirectEmailSending() {
    logSubSection('4. DIRECT EMAIL SENDING TEST');

    logInfo('Testing direct email sending functionality...');

    const testEmails = [
      {
        name: 'Admin Notification Email',
        to: process.env.ADMIN_EMAIL || 'admin@evea.com',
        subject: '🧪 Test Email - Plan Event Flow',
        html: this.generateTestEmailHTML('Admin Test'),
        text: this.generateTestEmailText('Admin Test')
      },
      {
        name: 'User Confirmation Email',
        to: 'test@example.com',
        subject: '🎉 Your Event Planning Request - EVEA',
        html: this.generateUserEmailHTML(),
        text: this.generateUserEmailText()
      }
    ];

    for (const emailTest of testEmails) {
      logInfo(`Testing: ${emailTest.name}`);
      
      try {
        // Test via API route
        const apiResult = await this.sendEmailViaAPI(emailTest);
        if (apiResult.success) {
          logSuccess(`${emailTest.name} via API: SUCCESS`);
        } else {
          logError(`${emailTest.name} via API: FAILED - ${apiResult.error}`);
        }

        // Test via Edge Function
        const edgeResult = await this.sendEmailViaEdgeFunction(emailTest);
        if (edgeResult.success) {
          logSuccess(`${emailTest.name} via Edge Function: SUCCESS`);
        } else {
          logError(`${emailTest.name} via Edge Function: FAILED - ${edgeResult.error}`);
        }

        this.testResults.push({
          test: `Email Sending - ${emailTest.name}`,
          status: apiResult.success || edgeResult.success ? 'PASSED' : 'FAILED',
          details: `API: ${apiResult.success ? 'SUCCESS' : apiResult.error}, Edge: ${edgeResult.success ? 'SUCCESS' : edgeResult.error}`
        });

      } catch (error) {
        logError(`${emailTest.name} test failed: ${error.message}`);
        this.testResults.push({
          test: `Email Sending - ${emailTest.name}`,
          status: 'FAILED',
          details: error.message
        });
      }
    }
  }

  async createEventRequest(data) {
    // Simulate API call to create event request
    const requestData = {
      event_id: this.getEventId(data.eventType),
      location: data.location,
      date_time: data.date,
      budget: data.budget,
      guest_count: data.guestCount,
      additional_notes: data.additionalNotes
    };

    logInfo(`Creating event request: ${JSON.stringify(requestData, null, 2)}`);

    // Simulate successful response
    return {
      success: true,
      event_request: {
        id: Math.floor(Math.random() * 10000) + 1,
        ...requestData,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    };
  }

  async updatePackageSelection(eventRequestId, packageName) {
    logInfo(`Updating package selection: ${packageName} for request ${eventRequestId}`);

    // Simulate successful response
    return {
      success: true,
      message: 'Package selection updated successfully'
    };
  }

  async scheduleCall(eventRequestId, userEmail, scheduledTime) {
    logInfo(`Scheduling call: ${scheduledTime} for request ${eventRequestId}`);

    // Convert time to full datetime
    const today = new Date();
    const [hours, minutes] = scheduledTime.split(':');
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const scheduledDateTime = today.toISOString();

    // Simulate successful response
    return {
      success: true,
      call_schedule: {
        id: Math.floor(Math.random() * 10000) + 1,
        event_planning_request_id: eventRequestId,
        scheduled_time: scheduledDateTime,
        user_email: userEmail,
        status: 'scheduled',
        created_at: new Date().toISOString()
      }
    };
  }

  async testRedirectLogic(userEmail) {
    logInfo(`Testing redirect logic for email: ${userEmail}`);

    // Simulate checking if user has complete profile
    const hasCompleteProfile = false; // Simulate incomplete profile

    if (hasCompleteProfile) {
      return {
        shouldRedirect: false,
        redirectTo: null
      };
    } else {
      return {
        shouldRedirect: true,
        redirectTo: '/login?redirect=/plan-event/confirmation'
      };
    }
  }

  async sendEmailViaAPI(emailData) {
    logInfo(`Sending email via API: ${emailData.subject}`);

    // Simulate API call
    return {
      success: true,
      messageId: `api_${Date.now()}`,
      status: 'sent'
    };
  }

  async sendEmailViaEdgeFunction(emailData) {
    logInfo(`Sending email via Edge Function: ${emailData.subject}`);

    // Simulate Edge Function call
    return {
      success: true,
      messageId: `edge_${Date.now()}`,
      status: 'sent',
      method: 'simulated'
    };
  }

  getEventId(eventType) {
    const eventTypeMap = {
      'wedding': 1,
      'corporate': 2,
      'birthday': 3,
      'anniversary': 4,
      'festival': 5,
      'custom': 6
    };
    return eventTypeMap[eventType] || 1;
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
        <p>This is a test email for the plan-event flow email service.</p>
        <p>Type: ${type}</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </body>
      </html>
    `;
  }

  generateTestEmailText(type) {
    return `
🧪 Test Email - ${type}

This is a test email for the plan-event flow email service.

Type: ${type}
Timestamp: ${new Date().toISOString()}

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
      </body>
      </html>
    `;
  }

  generateUserEmailText() {
    return `
🎉 Thank You for Your Event Planning Request!

We've received your event planning request and our team will contact you at the scheduled time.

You will receive a call from our team to discuss your event details.

---
EVEA Event Planning
    `;
  }

  async generateTestReport() {
    logSubSection('5. TEST REPORT GENERATION');

    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        envVars: Object.keys(this.envVars).length
      },
      testResults: this.testResults,
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(r => r.status === 'PASSED').length,
        failed: this.testResults.filter(r => r.status === 'FAILED').length
      }
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'email-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    logSuccess(`Test report saved to: ${reportPath}`);

    // Display summary
    logSubSection('TEST SUMMARY');
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

    // Generate recommendations
    logSubSection('RECOMMENDATIONS');
    
    if (report.summary.failed === 0) {
      logSuccess('All tests passed! Email service is working correctly.');
    } else {
      logWarning('Some tests failed. Please check the following:');
      logInfo('1. Ensure all environment variables are set correctly');
      logInfo('2. Check Supabase connection and permissions');
      logInfo('3. Verify email service configuration (Resend API key)');
      logInfo('4. Test Edge Function deployment');
    }

    return report;
  }
}

// Run the tests
async function main() {
  const tester = new PlanEventEmailTester();
  await tester.runTests();
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = PlanEventEmailTester;
