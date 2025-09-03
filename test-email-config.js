/**
 * Test Email Configuration
 * 
 * This script tests if email configuration is working
 * 
 * Usage: node test-email-config.js
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

class EmailConfigTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testEmail = 'vnair0795@gmail.com';
  }

  async testEmailConfiguration() {
    logSection('EMAIL CONFIGURATION TEST');
    logInfo(`Testing email configuration for: ${this.testEmail}\n`);

    // Check environment variables
    this.checkEnvironmentVariables();

    // Test email sending
    await this.testEmailSending();

    // Provide setup instructions
    this.provideSetupInstructions();
  }

  checkEnvironmentVariables() {
    logInfo('Checking environment variables...');
    
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
      logWarning('Email configuration incomplete. Please add EMAIL_USER and EMAIL_PASS to .env.local');
      logInfo('Expected: EMAIL_USER=eveateam2025@gmail.com');
    } else {
      logSuccess('Email configuration appears complete');
    }
  }

  async testEmailSending() {
    logInfo('Testing email sending...');
    
    try {
      const response = await this.makeRequest('POST', '/api/email/send', {
        to: this.testEmail,
        subject: '🧪 Email Configuration Test - EVEA',
        html: `
          <h1>🧪 Email Configuration Test</h1>
          <p>This is a test email to verify your email configuration is working.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Test ID:</strong> ${Date.now()}</p>
          <hr>
          <p>If you receive this email, your configuration is working correctly!</p>
        `,
        text: `
🧪 Email Configuration Test - EVEA

This is a test email to verify your email configuration is working.

Sent at: ${new Date().toLocaleString()}
Test ID: ${Date.now()}

If you receive this email, your configuration is working correctly!
        `
      });

      if (response.success) {
        logSuccess(`Email sent successfully via ${response.method || 'unknown'} method`);
        logInfo(`Message ID: ${response.messageId}`);
        
        if (response.method === 'nodemailer') {
          logSuccess('✅ REAL EMAIL SENT - Check your inbox!');
        } else if (response.method === 'simulated') {
          logWarning('⚠️ Email was simulated - configuration needed');
        } else {
          logInfo(`Email sent via ${response.method}`);
        }
      } else {
        logError(`Email sending failed: ${response.error}`);
      }
    } catch (error) {
      logError(`Email test failed: ${error.message}`);
    }
  }

  provideSetupInstructions() {
    logSection('SETUP INSTRUCTIONS');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      logWarning('To send real emails, you need to configure:');
      logInfo('1. Add to your .env.local file:');
      log('   EMAIL_USER=eveateam2025@gmail.com', 'cyan');
      log('   EMAIL_PASS=your-gmail-app-password', 'cyan');
      logInfo('2. Get Gmail App Password:');
      log('   - Go to https://myaccount.google.com/', 'cyan');
      log('   - Security → 2-Step Verification → App passwords', 'cyan');
      log('   - Generate password for "Mail"', 'cyan');
      log('   - Use the 16-character password', 'cyan');
      logInfo('3. Restart your Next.js server');
      logInfo('4. Run this test again');
    } else {
      logSuccess('Email configuration appears complete!');
      logInfo('Check your email inbox for the test email.');
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
  const tester = new EmailConfigTester();
  await tester.testEmailConfiguration();
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = EmailConfigTester;
