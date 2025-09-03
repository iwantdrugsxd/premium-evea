const testEmail = async () => {
    const response = await fetch('http://localhost:3001/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'vnair0795@gmail.com',
        subject: 'Test Email from EVEA',
        html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>',
        text: 'Test Email - If you receive this, email is working!'
      })
    });
    
    const result = await response.json();
    console.log('Email test result:', result);
  };
  
  testEmail();