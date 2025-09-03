/**
 * Direct Gmail SMTP Test
 * 
 * This script tests Gmail SMTP directly to identify authentication issues
 * 
 * Usage: node test-gmail-direct.js
 */

const nodemailer = require('nodemailer').default || require('nodemailer');
require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

async function testGmailDirect() {
  logSection('DIRECT GMAIL SMTP TEST');
  
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  logInfo('Configuration:');
  log(`Email User: ${emailUser}`, 'white');
  log(`Email Pass Length: ${emailPass?.length || 0}`, 'white');
  
  if (!emailUser || !emailPass) {
    logError('Missing email configuration!');
    return;
  }
  
  logInfo('Creating Gmail transporter...');
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    logSuccess('Transporter created successfully');
    
    logInfo('Verifying connection...');
    const verifyResult = await transporter.verify();
    logSuccess(`Connection verified: ${verifyResult}`);
    
    logInfo('Sending test email...');
    
    const mailOptions = {
      from: `"EVEA Test" <${emailUser}>`,
      to: 'vnair0795@gmail.com',
      subject: '🧪 Direct Gmail SMTP Test - EVEA',
      html: `
        <h1>🧪 Direct Gmail SMTP Test</h1>
        <p>This email was sent directly via Gmail SMTP.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Test ID:</strong> ${Date.now()}</p>
        <hr>
        <p>If you receive this email, Gmail SMTP is working correctly!</p>
      `,
      text: `
🧪 Direct Gmail SMTP Test - EVEA

This email was sent directly via Gmail SMTP.

Sent at: ${new Date().toLocaleString()}
Test ID: ${Date.now()}

If you receive this email, Gmail SMTP is working correctly!
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    logSuccess('Email sent successfully!');
    logInfo(`Message ID: ${info.messageId}`);
    logInfo(`Response: ${info.response}`);
    logInfo(`Accepted: ${info.accepted}`);
    logInfo(`Rejected: ${info.rejected}`);
    
  } catch (error) {
    logError('Gmail SMTP failed!');
    logError(`Error: ${error.message}`);
    logError(`Code: ${error.code}`);
    logError(`Command: ${error.command}`);
    logError(`Response Code: ${error.responseCode}`);
    logError(`Response: ${error.response}`);
    
    logSection('TROUBLESHOOTING');
    logInfo('Common Gmail SMTP issues:');
    log('1. 2-Step Verification not enabled', 'yellow');
    log('2. App password not generated', 'yellow');
    log('3. App password incorrect', 'yellow');
    log('4. Gmail account settings blocking access', 'yellow');
    log('5. Network/firewall blocking SMTP', 'yellow');
    
    logInfo('To fix:');
    log('1. Go to https://myaccount.google.com/', 'cyan');
    log('2. Security → 2-Step Verification → App passwords', 'cyan');
    log('3. Generate new app password for "Mail"', 'cyan');
    log('4. Update EMAIL_PASS in .env.local', 'cyan');
    log('5. Restart server and test again', 'cyan');
  }
}

// Run the test
testGmailDirect().catch(console.error);
