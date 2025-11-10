#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Focus Lock - Complete Build System');
console.log('=====================================\n');

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

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Build configuration
const buildConfig = {
  platforms: ['win', 'mac', 'linux'],
  architectures: ['x64', 'arm64'],
  environments: ['production', 'staging'],
  version: process.env.npm_package_version || '1.0.0',
  buildId: `build-${Date.now()}`,
  outputDir: path.join(__dirname, '../dist'),
  tempDir: path.join(__dirname, '../temp')
};

// Create necessary directories
function createDirectories() {
  log('📁 Creating build directories...', 'blue');
  
  const dirs = [
    buildConfig.outputDir,
    buildConfig.tempDir,
    path.join(buildConfig.outputDir, 'windows'),
    path.join(buildConfig.outputDir, 'macos'),
    path.join(buildConfig.outputDir, 'linux'),
    path.join(buildConfig.outputDir, 'installers'),
    path.join(buildConfig.outputDir, 'packages')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`  ✓ Created: ${dir}`, 'green');
    }
  });
}

// Clean previous builds
function cleanBuilds() {
  log('🧹 Cleaning previous builds...', 'blue');
  
  if (fs.existsSync(buildConfig.outputDir)) {
    exec(`rm -rf "${buildConfig.outputDir}"/*`);
  }
  
  if (fs.existsSync(buildConfig.tempDir)) {
    exec(`rm -rf "${buildConfig.tempDir}"/*`);
  }
  
  log('  ✓ Cleaned build directories', 'green');
}

// Build Next.js web app
function buildWebApp() {
  log('🌐 Building Next.js web application...', 'blue');
  
  const webAppDir = path.join(__dirname, '..');
  
  // Install web app dependencies
  log('  📦 Installing web app dependencies...', 'yellow');
  exec('npm install', { cwd: webAppDir });
  
  // Build web app
  log('  🔨 Building web app...', 'yellow');
  exec('npm run build', { cwd: webAppDir });
  
  // Verify build output
  const outDir = path.join(webAppDir, 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('Next.js build failed - out directory not found');
  }
  
  log('  ✓ Web app built successfully', 'green');
  return outDir;
}

// Install Electron dependencies
function installElectronDependencies() {
  log('📦 Installing Electron dependencies...', 'blue');
  
  const electronDir = __dirname;
  exec('npm install', { cwd: electronDir });
  
  log('  ✓ Electron dependencies installed', 'green');
}

// Create production icons
function createProductionIcons() {
  log('🎨 Creating production icons...', 'blue');
  
  const iconsDir = path.join(__dirname, '../assets');
  const iconSizes = [16, 32, 64, 128, 256, 512, 1024];
  
  // Create a simple SVG icon generator
  const createIcon = (size, filename) => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size/8}" fill="url(#grad)"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="white" font-family="Arial, sans-serif" font-size="${size/4}" font-weight="bold">FL</text>
</svg>`;
    
    fs.writeFileSync(path.join(iconsDir, filename), svg);
  };
  
  // Create icons
  iconSizes.forEach(size => {
    createIcon(size, `icon-${size}x${size}.png`);
  });
  
  // Create tray icon
  createIcon(16, 'tray-icon.png');
  
  // Create main icon
  createIcon(512, 'icon.png');
  
  log('  ✓ Production icons created', 'green');
}

// Build for specific platform
function buildForPlatform(platform, arch = 'x64') {
  log(`🔨 Building for ${platform} (${arch})...`, 'blue');
  
  const buildCommand = platform === 'win' ? 'build-win' : 
                      platform === 'mac' ? 'build-mac' : 'build-linux';
  
  // Set architecture-specific environment variables
  const env = { ...process.env };
  if (arch === 'arm64') {
    env.TARGET_ARCH = 'arm64';
  }
  
  exec(`npm run ${buildCommand}`, { 
    cwd: __dirname,
    env 
  });
  
  log(`  ✓ Built for ${platform} (${arch})`, 'green');
}

// Create installer packages
function createInstallers() {
  log('📦 Creating installer packages...', 'blue');
  
  const installerDir = path.join(buildConfig.outputDir, 'installers');
  
  // Windows installer
  const winDistDir = path.join(buildConfig.outputDir, 'windows');
  if (fs.existsSync(winDistDir)) {
    log('  🪟 Creating Windows installer...', 'yellow');
    
    // Copy NSIS installer script
    const nsisScript = `!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "Focus Lock"
OutFile "${installerDir}/Focus-Lock-Setup-${buildConfig.version}.exe"
InstallDir "$PROGRAMFILES\\Focus Lock"
InstallDirRegKey HKLM "Software\\Focus Lock" "Install_Dir"
RequestExecutionLevel admin

!define MUI_ICON "${__dirname}/../assets/icon.ico"
!define MUI_UNICON "${__dirname}/../assets/icon.ico"

!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "${__dirname}/../assets/header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "${__dirname}/../assets/welcome.bmp"

!define MUI_FINISHPAGE_RUN "$INSTDIR\\Focus Lock.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch Focus Lock"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "${__dirname}/../LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "Focus Lock"
  SetOutPath $INSTDIR
  
  File /r "${winDistDir}\\*"
  
  WriteRegStr HKLM "Software\\Focus Lock" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Focus Lock" "DisplayName" "Focus Lock"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Focus Lock" "UninstallString" '"$INSTDIR\\uninstall.exe"'
  WriteRegDWORD HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Focus Lock" "NoModify" 1
  WriteRegDWORD HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Focus Lock" "NoRepair" 1
  
  WriteUninstaller "$INSTDIR\\uninstall.exe"
  
  CreateDirectory "$SMPROGRAMS\\Focus Lock"
  CreateShortCut "$SMPROGRAMS\\Focus Lock\\Focus Lock.lnk" "$INSTDIR\\Focus Lock.exe"
  CreateShortCut "$DESKTOP\\Focus Lock.lnk" "$INSTDIR\\Focus Lock.exe"
SectionEnd

Section "Uninstall"
  DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Focus Lock"
  DeleteRegKey HKLM "Software\\Focus Lock"
  
  RMDir /r "$INSTDIR"
  RMDir /r "$SMPROGRAMS\\Focus Lock"
  Delete "$DESKTOP\\Focus Lock.lnk"
SectionEnd`;

    fs.writeFileSync(path.join(__dirname, 'installer.nsi'), nsisScript);
    
    // Run NSIS compiler if available
    try {
      exec(`makensis "${path.join(__dirname, 'installer.nsi')}"`);
      log('  ✓ Windows installer created', 'green');
    } catch (error) {
      log('  ⚠️  NSIS not found - skipping Windows installer', 'yellow');
    }
  }
  
  // macOS installer
  const macDistDir = path.join(buildConfig.outputDir, 'macos');
  if (fs.existsSync(macDistDir)) {
    log('  🍎 Creating macOS installer...', 'yellow');
    
    // Create DMG using hdiutil
    try {
      exec(`hdiutil create -volname "Focus Lock" -srcfolder "${macDistDir}" -ov -format UDZO "${installerDir}/Focus-Lock-${buildConfig.version}.dmg"`);
      log('  ✓ macOS DMG created', 'green');
    } catch (error) {
      log('  ⚠️  Failed to create macOS DMG', 'yellow');
    }
  }
  
  // Linux AppImage
  const linuxDistDir = path.join(buildConfig.outputDir, 'linux');
  if (fs.existsSync(linuxDistDir)) {
    log('  🐧 Creating Linux AppImage...', 'yellow');
    
    // Copy AppImage files
    const appImageFiles = fs.readdirSync(linuxDistDir).filter(file => file.endsWith('.AppImage'));
    appImageFiles.forEach(file => {
      fs.copyFileSync(
        path.join(linuxDistDir, file),
        path.join(installerDir, `Focus-Lock-${buildConfig.version}.AppImage`)
      );
    });
    
    log('  ✓ Linux AppImage created', 'green');
  }
}

// Create portable packages
function createPortablePackages() {
  log('📦 Creating portable packages...', 'blue');
  
  const portableDir = path.join(buildConfig.outputDir, 'packages');
  
  // Windows portable
  const winDistDir = path.join(buildConfig.outputDir, 'windows');
  if (fs.existsSync(winDistDir)) {
    log('  🪟 Creating Windows portable package...', 'yellow');
    
    exec(`cd "${winDistDir}" && zip -r "${portableDir}/Focus-Lock-Portable-${buildConfig.version}.zip" .`);
    log('  ✓ Windows portable package created', 'green');
  }
  
  // macOS portable
  const macDistDir = path.join(buildConfig.outputDir, 'macos');
  if (fs.existsSync(macDistDir)) {
    log('  🍎 Creating macOS portable package...', 'yellow');
    
    exec(`cd "${macDistDir}" && zip -r "${portableDir}/Focus-Lock-Portable-${buildConfig.version}.zip" .`);
    log('  ✓ macOS portable package created', 'green');
  }
  
  // Linux portable
  const linuxDistDir = path.join(buildConfig.outputDir, 'linux');
  if (fs.existsSync(linuxDistDir)) {
    log('  🐧 Creating Linux portable package...', 'yellow');
    
    exec(`cd "${linuxDistDir}" && tar -czf "${portableDir}/Focus-Lock-Portable-${buildConfig.version}.tar.gz" .`);
    log('  ✓ Linux portable package created', 'green');
  }
}

// Generate build manifest
function generateBuildManifest() {
  log('📋 Generating build manifest...', 'blue');
  
  const manifest = {
    buildId: buildConfig.buildId,
    version: buildConfig.version,
    timestamp: new Date().toISOString(),
    platforms: buildConfig.platforms,
    architectures: buildConfig.architectures,
    files: [],
    checksums: {}
  };
  
  // Scan output directory for files
  function scanDirectory(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.join(prefix, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        scanDirectory(filePath, relativePath);
      } else {
        manifest.files.push(relativePath);
        
        // Calculate file size
        const stats = fs.statSync(filePath);
        manifest.checksums[relativePath] = {
          size: stats.size,
          modified: stats.mtime.toISOString()
        };
      }
    });
  }
  
  scanDirectory(buildConfig.outputDir);
  
  // Write manifest
  fs.writeFileSync(
    path.join(buildConfig.outputDir, 'build-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  log('  ✓ Build manifest generated', 'green');
}

// Main build function
async function buildAll() {
  try {
    log('🚀 Starting complete build process...', 'bright');
    log(`Build ID: ${buildConfig.buildId}`, 'cyan');
    log(`Version: ${buildConfig.version}`, 'cyan');
    log('', 'reset');
    
    // Step 1: Setup
    createDirectories();
    cleanBuilds();
    
    // Step 2: Build web app
    const webAppPath = buildWebApp();
    
    // Step 3: Setup Electron
    installElectronDependencies();
    createProductionIcons();
    
    // Step 4: Copy web app to Electron
    const electronOutDir = path.join(__dirname, '../out');
    if (fs.existsSync(electronOutDir)) {
      exec(`rm -rf "${electronOutDir}"`);
    }
    exec(`cp -r "${webAppPath}" "${electronOutDir}"`);
    
    // Step 5: Build for all platforms
    for (const platform of buildConfig.platforms) {
      for (const arch of buildConfig.architectures) {
        buildForPlatform(platform, arch);
      }
    }
    
    // Step 6: Create packages
    createInstallers();
    createPortablePackages();
    
    // Step 7: Generate manifest
    generateBuildManifest();
    
    // Final summary
    log('\n🎉 Build completed successfully!', 'bright');
    log('', 'reset');
    log('📁 Build output:', 'blue');
    log(`  Installers: ${path.join(buildConfig.outputDir, 'installers')}`, 'green');
    log(`  Packages: ${path.join(buildConfig.outputDir, 'packages')}`, 'green');
    log(`  Platform builds: ${buildConfig.outputDir}`, 'green');
    log('', 'reset');
    log('📋 Next steps:', 'yellow');
    log('  1. Test installers on target platforms', 'reset');
    log('  2. Upload to distribution platforms', 'reset');
    log('  3. Update documentation', 'reset');
    log('  4. Create release notes', 'reset');
    
  } catch (error) {
    log(`\n❌ Build failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  buildAll();
}

module.exports = { buildAll, buildConfig };
