const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_VENDOR = {
  name: 'Test Vendor Integration',
  serviceCategories: ['Photography & Videography', 'Decoration & Florist'],
  description: 'This is a test vendor to verify the complete onboarding to marketplace integration flow. We provide professional photography and decoration services.',
  location: 'Mumbai, Maharashtra',
  email: `test.integration.${Date.now()}@evea.com`,
  services_offered: ['Wedding Photography', 'Corporate Events', 'Portrait Sessions'],
  experience: '5+ years',
  events_count: 50,
  service_areas: ['Mumbai', 'Pune', 'Goa']
};

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  }
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addTestResult(testName, status, details = '') {
  const result = {
    name: testName,
    status,
    details,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  testResults.summary.total++;
  
  if (status === 'PASSED') {
    testResults.summary.passed++;
    log(`${testName}: PASSED`, 'success');
  } else {
    testResults.summary.failed++;
    testResults.summary.errors.push(result);
    log(`${testName}: FAILED - ${details}`, 'error');
  }
}

// Test functions
async function testAPIHealth() {
  try {
    const response = await fetch(`${BASE_URL}/api/vendors`);
    if (response.ok) {
      addTestResult('API Health Check', 'PASSED', 'Vendors API is accessible');
    } else {
      addTestResult('API Health Check', 'FAILED', `API returned status ${response.status}`);
    }
  } catch (error) {
    addTestResult('API Health Check', 'FAILED', `Error: ${error.message}`);
  }
}

async function testMarketplaceAPI() {
  try {
    const response = await fetch(`${BASE_URL}/api/marketplace`);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        addTestResult('Marketplace API', 'PASSED', `Found ${data.vendors?.length || 0} vendors`);
      } else {
        addTestResult('Marketplace API', 'FAILED', `API returned error: ${data.error}`);
      }
    } else {
      addTestResult('Marketplace API', 'FAILED', `API returned status ${response.status}`);
    }
  } catch (error) {
    addTestResult('Marketplace API', 'FAILED', `Error: ${error.message}`);
  }
}

async function testVendorOnboarding() {
  try {
    // Create FormData for vendor onboarding
    const formData = new FormData();
    
    // Add all form fields
    formData.append('name', TEST_VENDOR.name);
    formData.append('serviceCategories', JSON.stringify(TEST_VENDOR.serviceCategories));
    formData.append('description', TEST_VENDOR.description);
    formData.append('location', TEST_VENDOR.location);
    formData.append('email', TEST_VENDOR.email);

    formData.append('services_offered', JSON.stringify(TEST_VENDOR.services_offered));
    formData.append('experience', TEST_VENDOR.experience);
    formData.append('events_count', TEST_VENDOR.events_count.toString());
    formData.append('service_areas', JSON.stringify(TEST_VENDOR.service_areas));
    
    // Create a mock image file (since we can't actually upload files in Node.js)
    const mockImageBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
    formData.append('cover_image', mockImageBlob, 'test-cover.jpg');
    
    const mockPortfolioBlob = new Blob(['mock portfolio data'], { type: 'image/jpeg' });
    formData.append('portfolio_images', mockPortfolioBlob, 'test-portfolio.jpg');
    
    const response = await fetch(`${BASE_URL}/api/vendors`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        addTestResult('Vendor Onboarding', 'PASSED', `Vendor created with ID: ${result.vendor?.id}`);
        return result.vendor?.id;
      } else {
        addTestResult('Vendor Onboarding', 'FAILED', `API returned error: ${result.error}`);
        return null;
      }
    } else {
      addTestResult('Vendor Onboarding', 'FAILED', `API returned status ${response.status}`);
      return null;
    }
  } catch (error) {
    addTestResult('Vendor Onboarding', 'FAILED', `Error: ${error.message}`);
    return null;
  }
}

async function testVendorInMarketplace(vendorId) {
  if (!vendorId) {
    addTestResult('Vendor Marketplace Display', 'FAILED', 'No vendor ID to test');
    return;
  }
  
  try {
    // Wait a bit for the database to update
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await fetch(`${BASE_URL}/api/marketplace`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.vendors) {
        const testVendor = data.vendors.find(v => v.id == vendorId);
        if (testVendor) {
          addTestResult('Vendor Marketplace Display', 'PASSED', `Vendor found in marketplace: ${testVendor.name}`);
          
          // Test individual vendor details API
          await testVendorDetailsAPI(vendorId);
        } else {
          addTestResult('Vendor Marketplace Display', 'FAILED', 'Vendor not found in marketplace after creation');
        }
      } else {
        addTestResult('Vendor Marketplace Display', 'FAILED', `Marketplace API error: ${data.error}`);
      }
    } else {
      addTestResult('Vendor Marketplace Display', 'FAILED', `Marketplace API returned status ${response.status}`);
    }
  } catch (error) {
    addTestResult('Vendor Marketplace Display', 'FAILED', `Error: ${error.message}`);
  }
}

async function testVendorDetailsAPI(vendorId) {
  try {
    const response = await fetch(`${BASE_URL}/api/marketplace/${vendorId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.vendor) {
        const vendor = data.vendor;
        
        // Verify all onboarding data is present
        const requiredFields = ['name', 'description', 'location', 'email', 'servicesOffered', 'serviceAreas', 'experience'];
        const missingFields = requiredFields.filter(field => !vendor[field]);
        
        if (missingFields.length === 0) {
          addTestResult('Vendor Details API', 'PASSED', 'All onboarding data is present in vendor details');
        } else {
          addTestResult('Vendor Details API', 'FAILED', `Missing fields: ${missingFields.join(', ')}`);
        }
      } else {
        addTestResult('Vendor Details API', 'FAILED', `API returned error: ${data.error}`);
      }
    } else {
      addTestResult('Vendor Details API', 'FAILED', `API returned status ${response.status}`);
    }
  } catch (error) {
    addTestResult('Vendor Details API', 'FAILED', `Error: ${error.message}`);
  }
}

async function testFrontendPages() {
  try {
    // Test marketplace page accessibility
    const marketplaceResponse = await fetch(`${BASE_URL}/marketplace`);
    if (marketplaceResponse.ok) {
      addTestResult('Marketplace Page', 'PASSED', 'Marketplace page is accessible');
    } else {
      addTestResult('Marketplace Page', 'FAILED', `Page returned status ${marketplaceResponse.status}`);
    }
    
    // Test vendor onboarding page accessibility
    const onboardingResponse = await fetch(`${BASE_URL}/vendor-onboarding`);
    if (onboardingResponse.ok) {
      addTestResult('Vendor Onboarding Page', 'PASSED', 'Vendor onboarding page is accessible');
    } else {
      addTestResult('Vendor Onboarding Page', 'FAILED', `Page returned status ${onboardingResponse.status}`);
    }
  } catch (error) {
    addTestResult('Frontend Pages', 'FAILED', `Error: ${error.message}`);
  }
}

async function cleanupTestVendor(vendorId) {
  if (!vendorId) return;
  
  try {
    // Note: This would require a DELETE endpoint in your API
    // For now, we'll just log that cleanup is needed
    log(`Test vendor with ID ${vendorId} should be cleaned up manually from the database`, 'info');
    addTestResult('Test Cleanup', 'INFO', `Test vendor ID ${vendorId} created - manual cleanup required`);
  } catch (error) {
    addTestResult('Test Cleanup', 'FAILED', `Error: ${error.message}`);
  }
}

// Main test execution
async function runAllTests() {
  log('🚀 Starting EVEA Marketplace Integration Tests...', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  log('', 'info');
  
  // Test 1: API Health
  await testAPIHealth();
  
  // Test 2: Marketplace API
  await testMarketplaceAPI();
  
  // Test 3: Frontend Pages
  await testFrontendPages();
  
  // Test 4: Vendor Onboarding
  const vendorId = await testVendorOnboarding();
  
  // Test 5: Vendor in Marketplace
  await testVendorInMarketplace(vendorId);
  
  // Test 6: Cleanup
  await cleanupTestVendor(vendorId);
  
  // Generate test report
  generateTestReport();
}

function generateTestReport() {
  log('', 'info');
  log('📊 Test Results Summary:', 'info');
  log(`Total Tests: ${testResults.summary.total}`, 'info');
  log(`Passed: ${testResults.summary.passed}`, 'success');
  log(`Failed: ${testResults.summary.failed}`, testResults.summary.failed > 0 ? 'error' : 'success');
  
  if (testResults.summary.failed > 0) {
    log('', 'info');
    log('❌ Failed Tests:', 'error');
    testResults.summary.errors.forEach(error => {
      log(`  - ${error.name}: ${error.details}`, 'error');
    });
  }
  
  // Save detailed report to file
  const reportPath = path.join(__dirname, 'marketplace-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  log(``, 'info');
  log(`📄 Detailed report saved to: ${reportPath}`, 'info');
  
  // Final status
  if (testResults.summary.failed === 0) {
    log('🎉 All tests passed! Marketplace integration is working perfectly!', 'success');
  } else {
    log('⚠️  Some tests failed. Check the report above for details.', 'error');
  }
}

// Run the tests
runAllTests().catch(error => {
  log(`Fatal error during testing: ${error.message}`, 'error');
  process.exit(1);
});
