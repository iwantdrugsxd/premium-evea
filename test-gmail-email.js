/**
 * Gmail Email Test Script
 * 
 * This script tests Gmail SMTP email sending with detailed logging
 * 
 * Usage: node test-gmail-email.js
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

class GmailEmailTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testEmail = 'vnair0795@gmail.com';
  }

  async testGmailEmail() {
    logSection('GMAIL EMAIL TEST');
    logInfo(`Testing Gmail SMTP email sending to: ${this.testEmail}\n`);

    // Check environment variables
    this.checkEnvironmentVariables();

    // Test email sending
    await this.testEmailSending();

    // Provide troubleshooting info
    this.provideTroubleshootingInfo();
  }

  checkEnvironmentVariables() {
    logInfo('Checking Gmail configuration...');
    
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (emailUser) {
      logSuccess(`EMAIL_USER: ${emailUser}`);
    } else {
      logError('EMAIL_USER: NOT SET');
    }
    
    if (emailPass) {
      const maskedPass = emailPass.length >= 4 ? 
        emailPass.substring(0, 2) + '*'.repeat(emailPass.length - 4) + emailPass.substring(emailPass.length - 2) :
        '*'.repeat(emailPass.length);
      logSuccess(`EMAIL_PASS: ${maskedPass} (${emailPass.length} characters)`);
    } else {
      logError('EMAIL_PASS: NOT SET');
    }

    if (!emailUser || !emailPass) {
      logWarning('Gmail configuration incomplete!');
    } else {
      logSuccess('Gmail configuration appears complete');
    }
  }

  async testEmailSending() {
    logInfo('Testing Gmail email sending...');
    
    const testEmails = [
      {
        name: 'Simple Test Email',
        data: {
          to: this.testEmail,
          subject: '🧪 Gmail Test Email - EVEA',
          html: `
            <h1>🧪 Gmail Test Email</h1>
            <p>This is a test email to verify Gmail SMTP is working.</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Test ID:</strong> ${Date.now()}</p>
            <hr>
            <p>If you receive this email, Gmail SMTP is working correctly!</p>
          `,
          text: `
🧪 Gmail Test Email - EVEA

This is a test email to verify Gmail SMTP is working.

Sent at: ${new Date().toLocaleString()}
Test ID: ${Date.now()}

If you receive this email, Gmail SMTP is working correctly!
          `
        }
      },
      {
        name: 'Event Planning Test Email',
        data: {
          to: this.testEmail,
          subject: '🎉 Event Planning Request Test - EVEA',
          html: `
            <h1>🎉 Event Planning Request Test</h1>
            <p>This simulates a real event planning request email.</p>
            
            <h3>📋 Event Details</h3>
            <p><strong>Event Type:</strong> Wedding</p>
            <p><strong>Location:</strong> Mumbai, Maharashtra</p>
            <p><strong>Budget:</strong> ₹500,000</p>
            <p><strong>Guest Count:</strong> 200</p>
            <p><strong>Package:</strong> Premium</p>
            
            <h3>👤 Customer Information</h3>
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Call Scheduled:</strong> ${new Date().toLocaleString()}</p>
            
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          `,
          text: `
🎉 Event Planning Request Test - EVEA

This simulates a real event planning request email.

📋 Event Details:
Event Type: Wedding
Location: Mumbai, Maharashtra
Budget: ₹500,000
Guest Count: 200
Package: Premium

👤 Customer Information:
Email: test@example.com
Call Scheduled: ${new Date().toLocaleString()}

Sent at: ${new Date().toLocaleString()}
          `
        }
      }
    ];

    for (const emailTest of testEmails) {
      logInfo(`Sending: ${emailTest.name} to ${emailTest.data.to}`);
      
      try {
        const response = await this.makeRequest('POST', '/api/email/send', emailTest.data);
        
        if (response.success) {
          logSuccess(`${emailTest.name}: SENT (${response.method || 'unknown'})`);
          
          if (response.method === 'nodemailer') {
            logSuccess('✅ REAL EMAIL SENT via Gmail SMTP!');
            logInfo(`Message ID: ${response.messageId}`);
            if (response.details) {
              logInfo(`Response: ${response.details.response}`);
              logInfo(`Accepted: ${response.details.accepted}`);
              logInfo(`Rejected: ${response.details.rejected}`);
            }
          } else if (response.method === 'simulated') {
            logWarning('⚠️ Email was simulated - Gmail SMTP failed');
            if (response.error) {
              logError(`Error: ${response.error}`);
            }
          } else {
            logInfo(`Email sent via ${response.method}`);
          }
        } else {
          logError(`${emailTest.name}: FAILED - ${response.error}`);
        }
      } catch (error) {
        logError(`${emailTest.name}: ERROR - ${error.message}`);
      }
    }
  }

  provideTroubleshootingInfo() {
    logSection('TROUBLESHOOTING INFORMATION');
    
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass) {
      logWarning('Gmail configuration is missing!');
      logInfo('To fix this:');
      log('1. Add to your .env.local file:', 'cyan');
      log('   EMAIL_USER=eveateam2025@gmail.com', 'white');
      log('   EMAIL_PASS=your-gmail-app-password', 'white');
      log('2. Get Gmail App Password:', 'cyan');
      log('   - Go to https://myaccount.google.com/', 'white');
      log('   - Security → 2-Step Verification → App passwords', 'white');
      log('   - Generate password for "Mail"', 'white');
      log('   - Use the 16-character password', 'white');
      log('3. Restart your Next.js server', 'cyan');
      log('4. Run this test again', 'cyan');
    } else {
      logInfo('Gmail configuration is present. If emails are still not sending:');
      log('1. Check Gmail 2FA is enabled', 'cyan');
      log('2. Verify app password is correct (16 characters)', 'cyan');
      log('3. Check Gmail account settings', 'cyan');
      log('4. Try generating a new app password', 'cyan');
      log('5. Check spam folder', 'cyan');
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
}

// Run the test
async function main() {
  const tester = new GmailEmailTester();
  await tester.testGmailEmail();
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = GmailEmailTester;
