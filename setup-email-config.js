/**
 * Setup Email Configuration
 * 
 * This script helps you add email configuration to your .env.local file
 * 
 * Usage: node setup-email-config.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

async function setupEmailConfig() {
  logSection('EMAIL CONFIGURATION SETUP');
  logInfo('Setting up email configuration for eveateam2025@gmail.com\n');

  const envFilePath = path.join(process.cwd(), '.env.local');
  
  // Check if .env.local exists
  if (!fs.existsSync(envFilePath)) {
    logError('.env.local file not found!');
    logInfo('Please create a .env.local file in your project root first.');
    return;
  }

  // Read current .env.local content
  let envContent = fs.readFileSync(envFilePath, 'utf8');
  
  // Check if email config already exists
  const hasEmailUser = envContent.includes('EMAIL_USER=');
  const hasEmailPass = envContent.includes('EMAIL_PASS=');

  if (hasEmailUser && hasEmailPass) {
    logWarning('Email configuration already exists in .env.local');
    logInfo('Current configuration:');
    
    const emailUserMatch = envContent.match(/EMAIL_USER=(.+)/);
    const emailPassMatch = envContent.match(/EMAIL_PASS=(.+)/);
    
    if (emailUserMatch) {
      logInfo(`EMAIL_USER: ${emailUserMatch[1]}`);
    }
    if (emailPassMatch) {
      const pass = emailPassMatch[1];
      const maskedPass = pass.length >= 4 ? 
        pass.substring(0, 2) + '*'.repeat(pass.length - 4) + pass.substring(pass.length - 2) :
        '*'.repeat(pass.length);
      logInfo(`EMAIL_PASS: ${maskedPass} (${pass.length} characters)`);
    }
    
    logInfo('\nIf you want to update the configuration, please edit .env.local manually.');
    return;
  }

  // Add email configuration
  logInfo('Adding email configuration to .env.local...');
  
  let updatedContent = envContent;
  
  // Add EMAIL_USER if not exists
  if (!hasEmailUser) {
    updatedContent += '\n# Email Configuration\nEMAIL_USER=eveateam2025@gmail.com\n';
    logSuccess('Added EMAIL_USER=eveateam2025@gmail.com');
  }
  
  // Add EMAIL_PASS placeholder if not exists
  if (!hasEmailPass) {
    updatedContent += 'EMAIL_PASS=your-gmail-app-password\n';
    logWarning('Added EMAIL_PASS placeholder - you need to replace with actual app password');
  }
  
  // Write updated content
  fs.writeFileSync(envFilePath, updatedContent);
  
  logSuccess('Email configuration added to .env.local');
  
  // Provide next steps
  logSection('NEXT STEPS');
  logInfo('1. Get Gmail App Password:');
  log('   - Go to https://myaccount.google.com/', 'cyan');
  log('   - Security → 2-Step Verification → App passwords', 'cyan');
  log('   - Generate password for "Mail"', 'cyan');
  log('   - Copy the 16-character password', 'cyan');
  
  logInfo('\n2. Update .env.local:');
  log('   - Open .env.local file', 'cyan');
  log('   - Replace "your-gmail-app-password" with the actual app password', 'cyan');
  
  logInfo('\n3. Test the configuration:');
  log('   - Restart your Next.js server', 'cyan');
  log('   - Run: node test-email-config.js', 'cyan');
  
  logInfo('\n4. Test the complete flow:');
  log('   - Run: node test-real-plan-event-flow.js', 'cyan');
  
  logSection('CURRENT .env.local CONTENT');
  log('Here is what was added to your .env.local file:', 'yellow');
  log('```', 'cyan');
  log('# Email Configuration', 'white');
  log('EMAIL_USER=eveateam2025@gmail.com', 'white');
  log('EMAIL_PASS=your-gmail-app-password', 'white');
  log('```', 'cyan');
  logWarning('Remember to replace "your-gmail-app-password" with the actual app password!');
}

// Run the setup
if (require.main === module) {
  setupEmailConfig().catch(console.error);
}

module.exports = { setupEmailConfig };
