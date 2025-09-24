// Google Apps Script to handle form submissions and send to your API
// Deploy this as a web app in Google Apps Script

function onFormSubmit(e) {
  try {
    // Get form response data
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Extract vendor data from form responses
    const vendorData = {
      business_name: getResponseByTitle(itemResponses, 'Business Name'),
      business_type: getResponseByTitle(itemResponses, 'Business Type'),
      contact_person_name: getResponseByTitle(itemResponses, 'Contact Person Name'),
      phone: getResponseByTitle(itemResponses, 'Phone Number'),
      email: getResponseByTitle(itemResponses, 'Email Address'),
      whatsapp_number: getResponseByTitle(itemResponses, 'WhatsApp Number'),
      city: getResponseByTitle(itemResponses, 'City'),
      state: getResponseByTitle(itemResponses, 'State'),
      address: getResponseByTitle(itemResponses, 'Address'),
      description: getResponseByTitle(itemResponses, 'Business Description'),
      services_offered: getResponseByTitle(itemResponses, 'Services Offered'),
      price_range_min: parseFloat(getResponseByTitle(itemResponses, 'Minimum Price')) || null,
      price_range_max: parseFloat(getResponseByTitle(itemResponses, 'Maximum Price')) || null,
      instagram_handle: getResponseByTitle(itemResponses, 'Instagram Handle'),
      website_url: getResponseByTitle(itemResponses, 'Website URL'),
      portfolio_images: getResponseByTitle(itemResponses, 'Portfolio Images') ? 
        getResponseByTitle(itemResponses, 'Portfolio Images').split(',').map(url => url.trim()) : [],
      is_verified: false, // New vendors start as unverified
      is_active: true
    };

    // Send data to your API
    const apiUrl = 'https://premium-evea.vercel.app/api/vendors';
    
    const options = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'payload': JSON.stringify(vendorData)
    };

    const response = UrlFetchApp.fetch(apiUrl, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.success) {
      console.log('Vendor data successfully submitted:', result);
      
      // Optional: Send confirmation email
      sendConfirmationEmail(vendorData.email, vendorData.business_name);
    } else {
      console.error('Failed to submit vendor data:', result.error);
    }
    
  } catch (error) {
    console.error('Error processing form submission:', error);
  }
}

function getResponseByTitle(itemResponses, title) {
  const response = itemResponses.find(item => item.getItem().getTitle() === title);
  return response ? response.getResponse() : '';
}

function sendConfirmationEmail(email, businessName) {
  try {
    const subject = 'Welcome to EVEA - Vendor Registration Confirmed';
    const body = `
      Dear ${businessName},
      
      Thank you for registering as a vendor with EVEA!
      
      Your vendor profile has been successfully submitted and is currently under review.
      Our team will review your application and get back to you within 24-48 hours.
      
      In the meantime, you can:
      - Complete your vendor profile
      - Upload portfolio images
      - Set your service areas
      
      If you have any questions, please don't hesitate to contact us.
      
      Best regards,
      The EVEA Team
    `;
    
    GmailApp.sendEmail(email, subject, body);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

// Test function to manually trigger (for testing)
function testFormSubmission() {
  const mockEvent = {
    response: {
      getItemResponses: () => [
        { getItem: () => ({ getTitle: () => 'Business Name' }), getResponse: () => 'Test Business' },
        { getItem: () => ({ getTitle: () => 'Business Type' }), getResponse: () => 'Photography' },
        { getItem: () => ({ getTitle: () => 'Contact Person Name' }), getResponse: () => 'John Doe' },
        { getItem: () => ({ getTitle: () => 'Phone Number' }), getResponse: () => '+91 9876543210' },
        { getItem: () => ({ getTitle: () => 'Email Address' }), getResponse: () => 'test@example.com' },
        { getItem: () => ({ getTitle: () => 'WhatsApp Number' }), getResponse: () => '+91 9876543210' },
        { getItem: () => ({ getTitle: () => 'City' }), getResponse: () => 'Mumbai' },
        { getItem: () => ({ getTitle: () => 'State' }), getResponse: () => 'Maharashtra' },
        { getItem: () => ({ getTitle: () => 'Address' }), getResponse: () => '123 Test Street' },
        { getItem: () => ({ getTitle: () => 'Business Description' }), getResponse: () => 'Professional photography services' },
        { getItem: () => ({ getTitle: () => 'Services Offered' }), getResponse: () => 'Wedding Photography, Event Photography' },
        { getItem: () => ({ getTitle: () => 'Minimum Price' }), getResponse: () => '50000' },
        { getItem: () => ({ getTitle: () => 'Maximum Price' }), getResponse: () => '200000' },
        { getItem: () => ({ getTitle: () => 'Instagram Handle' }), getResponse: () => '@testphotography' },
        { getItem: () => ({ getTitle: () => 'Website URL' }), getResponse: () => 'https://testphotography.com' },
        { getItem: () => ({ getTitle: () => 'Portfolio Images' }), getResponse: () => 'https://example.com/image1.jpg,https://example.com/image2.jpg' }
      ]
    }
  };
  
  onFormSubmit(mockEvent);
}
