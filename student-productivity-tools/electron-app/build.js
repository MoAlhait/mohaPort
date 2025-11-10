const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Focus Lock Desktop App...\n');

try {
  // Step 1: Build the Next.js web app
  console.log('📦 Building Next.js web app...');
  execSync('cd .. && npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed\n');

  // Step 2: Copy web app build to electron directory
  console.log('📁 Copying web app build to electron directory...');
  
  // Create out directory if it doesn't exist
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Copy the Next.js out directory to electron out directory
  const nextOutDir = path.join(__dirname, '..', 'out');
  if (fs.existsSync(nextOutDir)) {
    execSync(`cp -r ${nextOutDir}/* ${outDir}/`, { stdio: 'inherit' });
    console.log('✅ Web app copied to electron directory\n');
  } else {
    console.log('❌ Next.js out directory not found. Make sure to run "npm run build" first.');
    process.exit(1);
  }

  // Step 3: Install electron dependencies
  console.log('📦 Installing electron dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Electron dependencies installed\n');

  // Step 4: Build electron app
  console.log('🔨 Building electron app...');
  
  // Build for current platform
  const platform = process.platform;
  if (platform === 'win32') {
    execSync('npm run build-win', { stdio: 'inherit', cwd: __dirname });
  } else if (platform === 'darwin') {
    execSync('npm run build-mac', { stdio: 'inherit', cwd: __dirname });
  } else {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  }
  
  console.log('✅ Electron app build completed\n');

  // Step 5: Show build results
  console.log('🎉 Build completed successfully!');
  console.log(`📁 Build files are in: ${path.join(__dirname, 'dist')}`);
  console.log('\n📋 Next steps:');
  console.log('1. Test the app by running: npm start');
  console.log('2. Distribute the app using the files in the dist/ directory');
  console.log('3. For Windows: Look for .exe files');
  console.log('4. For macOS: Look for .dmg files');
  console.log('5. For Linux: Look for .AppImage files');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
