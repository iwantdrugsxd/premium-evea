// Test script to verify nodemailer fix
const nodemailer = require('nodemailer');

async function testNodemailerFix() {
  console.log('🧪 Testing Nodemailer Fix...\n');
  
  try {
    // Test the correct method name
    console.log('📝 Testing nodemailer.createTransport (correct method)...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'eveateam2025@gmail.com',
        pass: process.env.EMAIL_PASS || ''
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ nodemailer.createTransport works correctly!');

    // Test sending an email
    console.log('📝 Testing email sending...');
    
    const mailOptions = {
      from: `"EVEA Test" <${process.env.EMAIL_USER || 'eveateam2025@gmail.com'}>`,
      to: 'vnair0795@gmail.com',
      subject: 'Nodemailer Fix Test',
      html: `
        <h2>Nodemailer Fix Test</h2>
        <p>This email confirms that the nodemailer fix is working correctly.</p>
        <p><strong>Method:</strong> nodemailer.createTransport (correct)</p>
        <p><strong>Status:</strong> ✅ Fixed</p>
      `,
      text: 'Nodemailer Fix Test - Method: nodemailer.createTransport (correct) - Status: Fixed'
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📊 Email Details:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });

    console.log('\n🎉 Nodemailer Fix Test Complete!');
    console.log('✅ The fix is working correctly.');
    console.log('📧 Test email sent to: vnair0795@gmail.com');

  } catch (error) {
    console.error('❌ Nodemailer Fix Test Failed:', error);
    console.error('🔍 Error Details:', error.message);
  }
}

testNodemailerFix();
