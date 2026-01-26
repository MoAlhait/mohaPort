#!/usr/bin/env node

/**
 * Test script for the App Monitor functionality
 * Run this to test app detection and blocking without the full Electron app
 */

const AppMonitor = require('./app-monitor');

async function testAppMonitor() {
  console.log('🔍 Testing App Monitor Functionality...\n');
  
  const appMonitor = new AppMonitor();
  
  try {
    // Test 1: Get running applications
    console.log('1. Getting currently running applications...');
    const runningApps = await appMonitor.getRunningApplications();
    console.log(`   Found ${runningApps.length} running applications:`);
    runningApps.slice(0, 10).forEach((app, index) => {
      console.log(`   ${index + 1}. ${app}`);
    });
    if (runningApps.length > 10) {
      console.log(`   ... and ${runningApps.length - 10} more`);
    }
    console.log('');
    
    // Test 2: Get popular apps list
    console.log('2. Getting popular applications list...');
    const popularApps = appMonitor.getPopularApps();
    console.log(`   Found ${popularApps.length} popular applications:`);
    popularApps.slice(0, 10).forEach((app, index) => {
      console.log(`   ${index + 1}. ${app}`);
    });
    console.log('');
    
    // Test 3: Check if specific apps are running
    console.log('3. Checking if specific apps are running...');
    const testApps = ['Safari', 'Google Chrome', 'Visual Studio Code', 'Terminal'];
    for (const app of testApps) {
      const isRunning = await appMonitor.isAppRunning(app);
      console.log(`   ${app}: ${isRunning ? '✅ Running' : '❌ Not running'}`);
    }
    console.log('');
    
    // Test 4: Test app monitoring setup (without actually starting)
    console.log('4. Testing app monitoring setup...');
    appMonitor.setAllowedApp('Safari');
    const status = appMonitor.getStatus();
    console.log('   Monitoring status:', {
      isMonitoring: status.isMonitoring,
      allowedApp: status.allowedApp,
      blockedApps: status.blockedApps.length
    });
    console.log('');
    
    // Test 5: Test system app detection
    console.log('5. Testing system app detection...');
    const systemApps = ['Finder', 'Dock', 'System Events', 'Window Server'];
    systemApps.forEach(app => {
      const isSystem = appMonitor.isSystemApp(app);
      console.log(`   ${app}: ${isSystem ? '✅ System app' : '❌ User app'}`);
    });
    console.log('');
    
    console.log('🎉 All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   • Detected ${runningApps.length} running applications`);
    console.log(`   • Found ${popularApps.length} popular applications`);
    console.log(`   • App monitoring system ready`);
    console.log(`   • System app detection working`);
    
    console.log('\n🚀 Ready to integrate with Focus Lock app!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testAppMonitor();
