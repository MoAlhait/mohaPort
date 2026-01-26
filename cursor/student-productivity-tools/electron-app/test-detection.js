#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

console.log('🔍 Testing macOS App Detection Methods...\n');

async function testMethod(name, command, description) {
  console.log(`📱 Testing: ${name}`);
  console.log(`   ${description}`);
  
  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
    
    if (stderr) {
      console.log(`   ⚠️  Warning: ${stderr.trim()}`);
    }
    
    if (stdout && stdout.trim()) {
      const lines = stdout.trim().split('\n');
      const cleanApps = lines
        .map(line => line.trim())
        .filter(line => line && line.length > 0)
        .filter(line => !line.includes('Helper') && !line.includes('Agent') && !line.includes('Renderer'))
        .slice(0, 10);
      
      console.log(`   ✅ Found ${cleanApps.length} apps:`);
      cleanApps.forEach((app, i) => {
        console.log(`      ${i + 1}. ${app}`);
      });
    } else {
      console.log('   ❌ No output');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('');
}

async function runTests() {
  // Test 1: AppleScript - Most reliable
  await testMethod(
    'AppleScript (System Events)',
    `osascript -e 'tell application "System Events" to get name of every application process whose background only is false'`,
    'Uses AppleScript to query System Events for GUI applications'
  );

  // Test 2: ps command with .app filtering
  await testMethod(
    'PS Command (.app filtering)',
    `ps -ax -o pid,comm,args | grep -E '\\.app/Contents/MacOS/' | grep -v grep | awk '{print $3}' | sed 's|.*/\\([^/]*\\)\\.app/.*|\\1|' | sort -u`,
    'Uses ps to find processes with .app paths and extracts app names'
  );

  // Test 3: mdfind
  await testMethod(
    'mdfind (Spotlight)',
    `mdfind "kMDItemContentType == 'com.apple.application-bundle'" | head -10 | xargs -I {} basename {} .app`,
    'Uses Spotlight metadata to find application bundles'
  );

  // Test 4: Simple ps
  await testMethod(
    'PS Command (simple)',
    `ps -ax -o comm= | grep -v -E '(Helper|Agent|Renderer|daemon|kernel)' | head -15`,
    'Simple ps command filtered for user processes'
  );

  // Test 5: Check specific common apps
  console.log('📱 Testing specific app detection:');
  const commonApps = ['Safari', 'Chrome', 'Firefox', 'Messages', 'Mail', 'Notes', 'Terminal', 'Finder'];
  
  for (const app of commonApps) {
    try {
      const { stdout } = await execAsync(`pgrep -f "${app}"`, { timeout: 2000 });
      const isRunning = stdout.trim().length > 0;
      console.log(`   ${isRunning ? '✅' : '❌'} ${app}: ${isRunning ? 'Running' : 'Not running'}`);
    } catch (error) {
      console.log(`   ❌ ${app}: Error checking`);
    }
  }

  console.log('\n🎯 Recommendation:');
  console.log('   Use AppleScript as primary method (most reliable for GUI apps)');
  console.log('   Use ps command as fallback for additional detection');
  console.log('   Combine results and filter out system processes');
}

runTests().catch(console.error);
