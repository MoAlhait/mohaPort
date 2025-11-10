#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Focus Lock - Deployment Testing Suite');
console.log('========================================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test configuration
const testConfig = {
  platforms: ['windows', 'macos', 'linux'],
  testTimeout: 30000, // 30 seconds
  distDir: path.join(__dirname, '../dist'),
  tempDir: path.join(__dirname, '../temp-test')
};

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Utility functions
function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'pipe', 
      encoding: 'utf8',
      timeout: testConfig.testTimeout,
      ...options 
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\nError: ${error.message}`);
  }
}

function createTempDir() {
  if (fs.existsSync(testConfig.tempDir)) {
    exec(`rm -rf "${testConfig.tempDir}"`);
  }
  fs.mkdirSync(testConfig.tempDir, { recursive: true });
}

function cleanupTempDir() {
  if (fs.existsSync(testConfig.tempDir)) {
    exec(`rm -rf "${testConfig.tempDir}"`);
  }
}

// Test runner
function runTest(testName, testFunction) {
  log(`🧪 Running test: ${testName}`, 'blue');
  
  try {
    testFunction();
    log(`✅ ${testName} - PASSED`, 'green');
    testResults.passed++;
    testResults.tests.push({ name: testName, status: 'PASSED', error: null });
  } catch (error) {
    log(`❌ ${testName} - FAILED`, 'red');
    log(`   Error: ${error.message}`, 'red');
    testResults.failed++;
    testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
  }
}

// Individual tests

function testBuildArtifactsExist() {
  const requiredFiles = [
    'build-manifest.json',
    'installers',
    'packages'
  ];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(testConfig.distDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required file/directory not found: ${file}`);
    }
  });
}

function testWindowsInstaller() {
  const installerDir = path.join(testConfig.distDir, 'installers');
  const files = fs.readdirSync(installerDir);
  const exeFile = files.find(file => file.endsWith('.exe'));
  
  if (!exeFile) {
    throw new Error('Windows installer (.exe) not found');
  }
  
  const filePath = path.join(installerDir, exeFile);
  const stats = fs.statSync(filePath);
  
  if (stats.size < 1024 * 1024) { // Less than 1MB
    throw new Error('Windows installer seems too small');
  }
}

function testMacOSInstaller() {
  const installerDir = path.join(testConfig.distDir, 'installers');
  const files = fs.readdirSync(installerDir);
  const dmgFile = files.find(file => file.endsWith('.dmg'));
  
  if (!dmgFile) {
    throw new Error('macOS installer (.dmg) not found');
  }
  
  const filePath = path.join(installerDir, dmgFile);
  const stats = fs.statSync(filePath);
  
  if (stats.size < 1024 * 1024) { // Less than 1MB
    throw new Error('macOS installer seems too small');
  }
}

function testLinuxInstaller() {
  const installerDir = path.join(testConfig.distDir, 'installers');
  const files = fs.readdirSync(installerDir);
  const appImageFile = files.find(file => file.endsWith('.AppImage'));
  
  if (!appImageFile) {
    throw new Error('Linux installer (.AppImage) not found');
  }
  
  const filePath = path.join(installerDir, appImageFile);
  const stats = fs.statSync(filePath);
  
  if (stats.size < 1024 * 1024) { // Less than 1MB
    throw new Error('Linux installer seems too small');
  }
}

function testPortablePackages() {
  const packagesDir = path.join(testConfig.distDir, 'packages');
  
  if (!fs.existsSync(packagesDir)) {
    throw new Error('Packages directory not found');
  }
  
  const files = fs.readdirSync(packagesDir);
  const zipFiles = files.filter(file => file.endsWith('.zip'));
  const tarFiles = files.filter(file => file.endsWith('.tar.gz'));
  
  if (zipFiles.length === 0 && tarFiles.length === 0) {
    throw new Error('No portable packages found');
  }
}

function testBuildManifest() {
  const manifestPath = path.join(testConfig.distDir, 'build-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Build manifest not found');
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  const requiredFields = ['buildId', 'version', 'timestamp', 'platforms', 'files'];
  requiredFields.forEach(field => {
    if (!manifest[field]) {
      throw new Error(`Build manifest missing required field: ${field}`);
    }
  });
  
  if (manifest.files.length === 0) {
    throw new Error('Build manifest has no files listed');
  }
}

function testWebAppBuild() {
  const webAppDir = path.join(__dirname, '../out');
  
  if (!fs.existsSync(webAppDir)) {
    throw new Error('Web app build directory not found');
  }
  
  const indexFile = path.join(webAppDir, 'index.html');
  if (!fs.existsSync(indexFile)) {
    throw new Error('Web app index.html not found');
  }
  
  // Check if HTML file contains expected content
  const content = fs.readFileSync(indexFile, 'utf8');
  if (!content.includes('<html') || !content.includes('</html>')) {
    throw new Error('Web app index.html seems invalid');
  }
}

function testElectronMainProcess() {
  const mainFile = path.join(__dirname, '../main.js');
  
  if (!fs.existsSync(mainFile)) {
    throw new Error('Electron main.js not found');
  }
  
  // Basic syntax check
  try {
    require(mainFile);
  } catch (error) {
    throw new Error(`Electron main.js has syntax errors: ${error.message}`);
  }
}

function testPackageJson() {
  const packageFile = path.join(__dirname, '../package.json');
  
  if (!fs.existsSync(packageFile)) {
    throw new Error('package.json not found');
  }
  
  const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  
  const requiredFields = ['name', 'version', 'main', 'scripts'];
  requiredFields.forEach(field => {
    if (!packageData[field]) {
      throw new Error(`package.json missing required field: ${field}`);
    }
  });
  
  // Check for required scripts
  const requiredScripts = ['start', 'build', 'build-win', 'build-mac'];
  requiredScripts.forEach(script => {
    if (!packageData.scripts[script]) {
      throw new Error(`package.json missing required script: ${script}`);
    }
  });
}

function testDependencies() {
  const packageFile = path.join(__dirname, '../package.json');
  const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  
  const requiredDeps = ['electron', 'electron-builder'];
  requiredDeps.forEach(dep => {
    if (!packageData.dependencies[dep] && !packageData.devDependencies[dep]) {
      throw new Error(`Required dependency missing: ${dep}`);
    }
  });
}

function testFilePermissions() {
  const executableFiles = [
    '../main.js',
    '../preload.js',
    '../scripts/build-all.js',
    '../scripts/deploy.js'
  ];
  
  executableFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (!stats.mode.toString(8).includes('6')) {
        log(`⚠️  File may need executable permissions: ${file}`, 'yellow');
      }
    }
  });
}

function testEnvironmentVariables() {
  const requiredEnvVars = [];
  const optionalEnvVars = ['GITHUB_TOKEN', 'FIREBASE_TOKEN', 'AWS_ACCESS_KEY_ID'];
  
  // Check if optional environment variables are set
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      log(`✓ Environment variable set: ${envVar}`, 'green');
    } else {
      log(`⚠️  Environment variable not set: ${envVar}`, 'yellow');
    }
  });
}

function testGitHubWorkflow() {
  const workflowFile = path.join(__dirname, '../.github/workflows/build-and-deploy.yml');
  
  if (!fs.existsSync(workflowFile)) {
    throw new Error('GitHub Actions workflow file not found');
  }
  
  const content = fs.readFileSync(workflowFile, 'utf8');
  
  if (!content.includes('name: Build and Deploy Focus Lock')) {
    throw new Error('GitHub workflow seems invalid');
  }
}

function testDeploymentSettings() {
  const settingsFile = path.join(__dirname, '../deploy-settings.json');
  
  if (!fs.existsSync(settingsFile)) {
    throw new Error('Deployment settings file not found');
  }
  
  const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
  
  if (!settings.distribution) {
    throw new Error('Deployment settings missing distribution config');
  }
}

function testFirebaseConfig() {
  const firebaseFile = path.join(__dirname, '../firebase.json');
  
  if (!fs.existsSync(firebaseFile)) {
    log('⚠️  Firebase config not found (optional)', 'yellow');
    return;
  }
  
  const config = JSON.parse(fs.readFileSync(firebaseFile, 'utf8'));
  
  if (!config.hosting) {
    throw new Error('Firebase config missing hosting configuration');
  }
}

// Integration tests
function testBasicFunctionality() {
  // Test if we can require main modules
  try {
    require('../main.js');
  } catch (error) {
    throw new Error(`Main process failed to load: ${error.message}`);
  }
}

function testBuildScripts() {
  // Test if build scripts exist and are executable
  const buildScripts = [
    '../scripts/build-all.js',
    '../scripts/deploy.js'
  ];
  
  buildScripts.forEach(script => {
    const scriptPath = path.join(__dirname, script);
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Build script not found: ${script}`);
    }
  });
}

// Platform-specific tests
function testPlatformSpecificFiles() {
  const platformDirs = ['windows', 'macos', 'linux'];
  
  platformDirs.forEach(platform => {
    const platformDir = path.join(testConfig.distDir, platform);
    if (fs.existsSync(platformDir)) {
      const files = fs.readdirSync(platformDir);
      if (files.length === 0) {
        log(`⚠️  Platform directory empty: ${platform}`, 'yellow');
      } else {
        log(`✓ Platform directory has files: ${platform} (${files.length} files)`, 'green');
      }
    }
  });
}

// Performance tests
function testBuildPerformance() {
  const manifestPath = path.join(testConfig.distDir, 'build-manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const buildTime = new Date(manifest.timestamp);
    const now = new Date();
    const timeDiff = now - buildTime;
    
    if (timeDiff > 3600000) { // More than 1 hour
      log(`⚠️  Build is more than 1 hour old`, 'yellow');
    } else {
      log(`✓ Build is recent (${Math.round(timeDiff / 60000)} minutes old)`, 'green');
    }
  }
}

function testFileSizes() {
  const installerDir = path.join(testConfig.distDir, 'installers');
  
  if (fs.existsSync(installerDir)) {
    const files = fs.readdirSync(installerDir);
    
    files.forEach(file => {
      const filePath = path.join(installerDir, file);
      const stats = fs.statSync(filePath);
      const sizeMB = Math.round(stats.size / (1024 * 1024));
      
      if (sizeMB > 500) {
        log(`⚠️  Large file detected: ${file} (${sizeMB}MB)`, 'yellow');
      } else {
        log(`✓ File size OK: ${file} (${sizeMB}MB)`, 'green');
      }
    });
  }
}

// Security tests
function testSecurityScan() {
  // Basic security checks
  const securityFiles = [
    '../main.js',
    '../preload.js'
  ];
  
  securityFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for potentially dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/,
        /new Function/,
        /innerHTML\s*=/,
        /document\.write/
      ];
      
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          log(`⚠️  Potentially dangerous pattern found in ${file}`, 'yellow');
        }
      });
    }
  });
}

// Main test runner
async function runAllTests() {
  log('🧪 Starting deployment testing suite...', 'bright');
  log('', 'reset');
  
  createTempDir();
  
  try {
    // Basic structure tests
    runTest('Build artifacts exist', testBuildArtifactsExist);
    runTest('Build manifest is valid', testBuildManifest);
    runTest('Web app build exists', testWebAppBuild);
    runTest('Package.json is valid', testPackageJson);
    runTest('Dependencies are installed', testDependencies);
    
    // Installer tests
    runTest('Windows installer exists', testWindowsInstaller);
    runTest('macOS installer exists', testMacOSInstaller);
    runTest('Linux installer exists', testLinuxInstaller);
    runTest('Portable packages exist', testPortablePackages);
    
    // Configuration tests
    runTest('Electron main process loads', testElectronMainProcess);
    runTest('GitHub workflow exists', testGitHubWorkflow);
    runTest('Deployment settings exist', testDeploymentSettings);
    runTest('Firebase config exists', testFirebaseConfig);
    
    // Integration tests
    runTest('Basic functionality works', testBasicFunctionality);
    runTest('Build scripts exist', testBuildScripts);
    
    // Platform tests
    runTest('Platform-specific files exist', testPlatformSpecificFiles);
    
    // Performance tests
    runTest('Build performance check', testBuildPerformance);
    runTest('File sizes check', testFileSizes);
    
    // Security tests
    runTest('Security scan', testSecurityScan);
    
    // Environment tests
    runTest('Environment variables check', testEnvironmentVariables);
    runTest('File permissions check', testFilePermissions);
    
  } finally {
    cleanupTempDir();
  }
  
  // Generate test report
  generateTestReport();
}

function generateTestReport() {
  log('', 'reset');
  log('📊 Test Results Summary', 'bright');
  log('=====================', 'bright');
  log('', 'reset');
  
  log(`✅ Passed: ${testResults.passed}`, 'green');
  log(`❌ Failed: ${testResults.failed}`, 'red');
  log(`⚠️  Skipped: ${testResults.skipped}`, 'yellow');
  log(`📋 Total: ${testResults.tests.length}`, 'blue');
  log('', 'reset');
  
  if (testResults.failed > 0) {
    log('❌ Failed Tests:', 'red');
    testResults.tests
      .filter(test => test.status === 'FAILED')
      .forEach(test => {
        log(`  - ${test.name}: ${test.error}`, 'red');
      });
    log('', 'reset');
  }
  
  // Overall status
  if (testResults.failed === 0) {
    log('🎉 All tests passed! Deployment is ready.', 'bright');
    log('', 'reset');
    log('Next steps:', 'blue');
    log('1. Deploy to staging environment', 'reset');
    log('2. Test installers on target platforms', 'reset');
    log('3. Deploy to production', 'reset');
    log('4. Monitor for issues', 'reset');
  } else {
    log('❌ Some tests failed. Please fix issues before deploying.', 'bright');
    process.exit(1);
  }
  
  // Write test report to file
  const reportPath = path.join(testConfig.distDir, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      total: testResults.tests.length
    },
    tests: testResults.tests
  }, null, 2));
  
  log(`📄 Test report saved to: ${reportPath}`, 'blue');
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(`❌ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runAllTests, testResults };
