#!/usr/bin/env node

// Performance testing script for EVEA database optimizations
const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 50;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          statusCode: res.statusCode,
          responseTime,
          dataLength: data.length,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runPerformanceTest() {
  log('🚀 Starting EVEA Performance Test', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const endpoints = [
    '/api/marketplace',
    '/api/marketplace?page=1&limit=12',
    '/api/marketplace?page=2&limit=12',
    '/api/events',
    '/api/performance?action=stats'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    log(`\n📊 Testing ${endpoint}`, 'blue');
    log('-'.repeat(30), 'cyan');
    
    const url = `${BASE_URL}${endpoint}`;
    const times = [];
    const errors = [];
    
    // Run concurrent requests
    const promises = [];
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
      promises.push(
        makeRequest(url)
          .then(result => {
            times.push(result.responseTime);
            if (!result.success) {
              errors.push(`Status: ${result.statusCode}`);
            }
          })
          .catch(err => {
            errors.push(err.message);
          })
      );
      
      // Add small delay between batches to avoid overwhelming the server
      if (i % CONCURRENT_REQUESTS === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    await Promise.all(promises);
    
    // Calculate statistics
    const successfulRequests = times.length;
    const errorCount = errors.length;
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const p95Time = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];
    
    results[endpoint] = {
      successfulRequests,
      errorCount,
      avgTime: Math.round(avgTime),
      minTime,
      maxTime,
      p95Time,
      errors: errors.slice(0, 5) // Show first 5 errors
    };
    
    // Display results
    log(`✅ Successful: ${successfulRequests}/${TOTAL_REQUESTS}`, 'green');
    log(`❌ Errors: ${errorCount}`, errorCount > 0 ? 'red' : 'green');
    log(`⏱️  Average: ${Math.round(avgTime)}ms`, avgTime < 500 ? 'green' : avgTime < 1000 ? 'yellow' : 'red');
    log(`⚡ Min: ${minTime}ms`, 'cyan');
    log(`🐌 Max: ${maxTime}ms`, maxTime > 2000 ? 'red' : 'yellow');
    log(`📈 95th percentile: ${p95Time}ms`, p95Time < 1000 ? 'green' : 'yellow');
    
    if (errors.length > 0) {
      log(`\n❌ Sample errors:`, 'red');
      errors.slice(0, 3).forEach(error => log(`   ${error}`, 'red'));
    }
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'cyan');
  log('📋 PERFORMANCE SUMMARY', 'bold');
  log('='.repeat(50), 'cyan');
  
  const allAvgTimes = Object.values(results).map(r => r.avgTime);
  const overallAvg = allAvgTimes.reduce((a, b) => a + b, 0) / allAvgTimes.length;
  const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errorCount, 0);
  
  log(`\n🎯 Overall Average Response Time: ${Math.round(overallAvg)}ms`, 
      overallAvg < 500 ? 'green' : overallAvg < 1000 ? 'yellow' : 'red');
  log(`❌ Total Errors: ${totalErrors}`, totalErrors === 0 ? 'green' : 'red');
  
  // Performance recommendations
  log('\n💡 RECOMMENDATIONS:', 'bold');
  
  if (overallAvg > 1000) {
    log('⚠️  Response times are high. Consider:', 'yellow');
    log('   - Adding more database indexes', 'yellow');
    log('   - Implementing Redis caching', 'yellow');
    log('   - Using CDN for static assets', 'yellow');
  } else if (overallAvg > 500) {
    log('✅ Good performance, but could be improved:', 'yellow');
    log('   - Consider adding more caching', 'yellow');
    log('   - Optimize database queries further', 'yellow');
  } else {
    log('🚀 Excellent performance!', 'green');
  }
  
  if (totalErrors > 0) {
    log('🔧 Fix errors before deploying to production', 'red');
  }
  
  // Cache performance check
  log('\n🔍 CACHE PERFORMANCE:', 'bold');
  try {
    const cacheStats = await makeRequest(`${BASE_URL}/api/performance?action=stats`);
    if (cacheStats.success) {
      const stats = JSON.parse(cacheStats.data);
      log(`📦 Cache size: ${stats.data.cache.size} items`, 'cyan');
      log(`📊 Cache keys: ${stats.data.cache.keys.length}`, 'cyan');
    }
  } catch (err) {
    log('⚠️  Could not fetch cache stats', 'yellow');
  }
  
  log('\n✨ Performance test completed!', 'bold');
}

// Run the test
runPerformanceTest().catch(console.error);
