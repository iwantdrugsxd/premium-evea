// Using built-in fetch (Node.js 18+)

async function testEmailAPI() {
  try {
    console.log('🧪 Testing Email API...');
    
    const response = await fetch('http://localhost:3000/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'vnair0795@gmail.com',
        subject: 'Test Email - Event Planning System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #7c3aed;">Test Email</h1>
            <p>This is a test email to verify the email system is working correctly.</p>
            <p>If you receive this email, the system is functioning properly!</p>
          </div>
        `,
        text: 'Test Email - Event Planning System is working correctly!'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email API Test Successful:', result);
    } else {
      console.log('❌ Email API Test Failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Email API Test Error:', error);
  }
}

testEmailAPI();