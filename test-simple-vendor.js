const BASE_URL = 'http://localhost:3000';

async function testSimpleVendor() {
  try {
    console.log('🚀 Testing simple vendor creation...');
    
    // Create FormData with minimal required fields
    const formData = new FormData();
    formData.append('name', 'Simple Test Vendor');
    formData.append('categories', JSON.stringify(['Photography']));
    formData.append('description', 'A simple test vendor');
    formData.append('location', 'Mumbai');
    formData.append('email', `simple.test.${Date.now()}@evea.com`);
    formData.append('services_offered', JSON.stringify(['Photography']));
    formData.append('experience', '2 years');
    formData.append('events_count', '10');
    formData.append('service_areas', JSON.stringify(['Mumbai']));
    
    // Create mock image
    const mockImageBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
    formData.append('cover_image', mockImageBlob, 'test.jpg');
    
    console.log('📤 Submitting vendor data...');
    
    const response = await fetch(`${BASE_URL}/api/vendors`, {
      method: 'POST',
      body: formData
    });
    
    console.log(`📥 Response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('❌ Error details:', errorJson);
      } catch (e) {
        console.log('❌ Raw error:', errorText);
      }
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

testSimpleVendor();
