#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

console.log('🚀 Focus Lock - Deployment System');
console.log('==================================\n');

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

// Deployment configuration
const deployConfig = {
  version: process.env.npm_package_version || '1.0.0',
  buildId: process.env.BUILD_ID || `build-${Date.now()}`,
  environment: process.env.NODE_ENV || 'production',
  platforms: ['windows', 'macos', 'linux'],
  distribution: {
    github: {
      enabled: process.env.GITHUB_TOKEN ? true : false,
      repo: process.env.GITHUB_REPO || 'mohammad-alhait/focus-lock',
      token: process.env.GITHUB_TOKEN
    },
    githubPages: {
      enabled: process.env.GITHUB_PAGES_TOKEN ? true : false,
      token: process.env.GITHUB_PAGES_TOKEN
    },
    s3: {
      enabled: process.env.AWS_ACCESS_KEY_ID ? true : false,
      bucket: process.env.S3_BUCKET || 'focus-lock-downloads',
      region: process.env.AWS_REGION || 'us-east-1'
    },
    firebase: {
      enabled: process.env.FIREBASE_TOKEN ? true : false,
      project: process.env.FIREBASE_PROJECT,
      token: process.env.FIREBASE_TOKEN
    }
  }
};

// Load deployment settings
function loadDeploySettings() {
  const settingsFile = path.join(__dirname, '../deploy-settings.json');
  if (fs.existsSync(settingsFile)) {
    const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    Object.assign(deployConfig.distribution, settings);
  }
  return deployConfig;
}

// Validate deployment environment
function validateEnvironment() {
  log('🔍 Validating deployment environment...', 'blue');
  
  const requiredFiles = [
    '../dist/build-manifest.json',
    '../dist/installers',
    '../dist/packages'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    const fullPath = path.join(__dirname, file);
    return !fs.existsSync(fullPath);
  });
  
  if (missingFiles.length > 0) {
    log('❌ Missing required files:', 'red');
    missingFiles.forEach(file => log(`  - ${file}`, 'red'));
    log('Please run the build process first.', 'yellow');
    process.exit(1);
  }
  
  log('✓ Environment validation passed', 'green');
}

// Create GitHub release
async function createGitHubRelease() {
  if (!deployConfig.distribution.github.enabled) {
    log('⏭️  GitHub release disabled', 'yellow');
    return;
  }
  
  log('📦 Creating GitHub release...', 'blue');
  
  const { Octokit } = require('@octokit/rest');
  const octokit = new Octokit({
    auth: deployConfig.distribution.github.token
  });
  
  const [owner, repo] = deployConfig.distribution.github.repo.split('/');
  
  try {
    // Create release
    const release = await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: `v${deployConfig.version}`,
      name: `Focus Lock v${deployConfig.version}`,
      body: generateReleaseNotes(),
      draft: false,
      prerelease: deployConfig.environment !== 'production'
    });
    
    log(`✓ GitHub release created: ${release.data.html_url}`, 'green');
    
    // Upload assets
    await uploadGitHubAssets(octokit, owner, repo, release.data.id);
    
  } catch (error) {
    log(`❌ GitHub release failed: ${error.message}`, 'red');
  }
}

// Upload assets to GitHub release
async function uploadGitHubAssets(octokit, owner, repo, releaseId) {
  log('📤 Uploading assets to GitHub...', 'blue');
  
  const assetsDir = path.join(__dirname, '../dist/installers');
  const files = fs.readdirSync(assetsDir);
  
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile() && stats.size > 0) {
      try {
        log(`  📤 Uploading ${file}...`, 'yellow');
        
        await octokit.rest.repos.uploadReleaseAsset({
          owner,
          repo,
          release_id: releaseId,
          name: file,
          data: fs.readFileSync(filePath)
        });
        
        log(`  ✓ Uploaded ${file}`, 'green');
      } catch (error) {
        log(`  ❌ Failed to upload ${file}: ${error.message}`, 'red');
      }
    }
  }
}

// Generate release notes
function generateReleaseNotes() {
  const changelogPath = path.join(__dirname, '../CHANGELOG.md');
  let releaseNotes = `# Focus Lock v${deployConfig.version}\n\n`;
  
  if (fs.existsSync(changelogPath)) {
    const changelog = fs.readFileSync(changelogPath, 'utf8');
    const versionMatch = changelog.match(new RegExp(`## \\[${deployConfig.version}\\]([\\s\\S]*?)(?=## \\[|$)`));
    
    if (versionMatch) {
      releaseNotes += versionMatch[1].trim();
    } else {
      releaseNotes += '## What\'s New\n\n- Enhanced productivity features\n- Improved user interface\n- Better performance and stability\n\n';
    }
  } else {
    releaseNotes += '## What\'s New\n\n- Enhanced productivity features\n- Improved user interface\n- Better performance and stability\n\n';
  }
  
  releaseNotes += `## Installation\n\n`;
  releaseNotes += `### Windows\n`;
  releaseNotes += `Download \`Focus-Lock-Setup-${deployConfig.version}.exe\` and run the installer.\n\n`;
  releaseNotes += `### macOS\n`;
  releaseNotes += `Download \`Focus-Lock-${deployConfig.version}.dmg\` and drag to Applications folder.\n\n`;
  releaseNotes += `### Linux\n`;
  releaseNotes += `Download \`Focus-Lock-${deployConfig.version}.AppImage\`, make executable, and run.\n\n`;
  
  releaseNotes += `## System Requirements\n\n`;
  releaseNotes += `- **Windows**: Windows 10 or later\n`;
  releaseNotes += `- **macOS**: macOS 10.14 or later\n`;
  releaseNotes += `- **Linux**: Ubuntu 18.04+ or equivalent\n`;
  releaseNotes += `- **RAM**: 4GB minimum, 8GB recommended\n`;
  releaseNotes += `- **Storage**: 200MB free space\n\n`;
  
  return releaseNotes;
}

// Deploy to GitHub Pages
async function deployToGitHubPages() {
  if (!deployConfig.distribution.githubPages.enabled) {
    log('⏭️  GitHub Pages deployment disabled', 'yellow');
    return;
  }
  
  log('🌐 Deploying to GitHub Pages...', 'blue');
  
  try {
    // Create deployment directory
    const pagesDir = path.join(__dirname, '../gh-pages');
    if (fs.existsSync(pagesDir)) {
      execSync(`rm -rf "${pagesDir}"`);
    }
    fs.mkdirSync(pagesDir, { recursive: true });
    
    // Copy web app files
    const webAppDir = path.join(__dirname, '../out');
    if (fs.existsSync(webAppDir)) {
      execSync(`cp -r "${webAppDir}"/* "${pagesDir}"`);
    }
    
    // Create download page
    createDownloadPage(pagesDir);
    
    // Initialize git repository
    execSync(`cd "${pagesDir}" && git init`);
    execSync(`cd "${pagesDir}" && git add .`);
    execSync(`cd "${pagesDir}" && git commit -m "Deploy Focus Lock v${deployConfig.version}"`);
    
    // Push to gh-pages branch
    const repoUrl = `https://${deployConfig.distribution.github.token}@github.com/${deployConfig.distribution.github.repo}.git`;
    execSync(`cd "${pagesDir}" && git remote add origin "${repoUrl}"`);
    execSync(`cd "${pagesDir}" && git push -f origin master:gh-pages`);
    
    log('✓ Deployed to GitHub Pages', 'green');
    
  } catch (error) {
    log(`❌ GitHub Pages deployment failed: ${error.message}`, 'red');
  }
}

// Create download page
function createDownloadPage(outputDir) {
  const downloadPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Focus Lock - Download</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            margin: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .version {
            color: #666;
            margin-bottom: 30px;
        }
        .download-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .download-card {
            border: 2px solid #f0f0f0;
            border-radius: 15px;
            padding: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .download-card:hover {
            border-color: #3b82f6;
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.1);
        }
        .platform-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .platform-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .download-size {
            color: #666;
            font-size: 14px;
        }
        .features {
            text-align: left;
            margin: 30px 0;
        }
        .feature {
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        .feature-icon {
            margin-right: 10px;
            color: #3b82f6;
        }
        .footer {
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Focus Lock</h1>
        <p class="version">Version ${deployConfig.version}</p>
        <p>Desktop app that locks you out of distracting websites and apps during study sessions</p>
        
        <div class="download-grid">
            <div class="download-card" onclick="downloadFile('windows')">
                <div class="platform-icon">🪟</div>
                <div class="platform-name">Windows</div>
                <div class="download-size">Setup Installer</div>
            </div>
            <div class="download-card" onclick="downloadFile('macos')">
                <div class="platform-icon">🍎</div>
                <div class="platform-name">macOS</div>
                <div class="download-size">DMG Package</div>
            </div>
            <div class="download-card" onclick="downloadFile('linux')">
                <div class="platform-icon">🐧</div>
                <div class="platform-name">Linux</div>
                <div class="download-size">AppImage</div>
            </div>
        </div>
        
        <div class="features">
            <h3>Key Features</h3>
            <div class="feature">
                <span class="feature-icon">🔒</span>
                <span>Block distracting websites and applications</span>
            </div>
            <div class="feature">
                <span class="feature-icon">⏰</span>
                <span>Multiple focus modes (Pomodoro, Deep Work, etc.)</span>
            </div>
            <div class="feature">
                <span class="feature-icon">📊</span>
                <span>Detailed productivity analytics</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🏆</span>
                <span>Achievement system and gamification</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🎵</span>
                <span>Ambient sounds and lighting themes</span>
            </div>
            <div class="feature">
                <span class="feature-icon">📅</span>
                <span>Smart scheduling and recurring sessions</span>
            </div>
        </div>
        
        <div class="footer">
            <p>Created by Mohammad Alhait</p>
            <p>For support and feedback, visit our GitHub repository</p>
        </div>
    </div>
    
    <script>
        function downloadFile(platform) {
            const files = {
                windows: 'Focus-Lock-Setup-${deployConfig.version}.exe',
                macos: 'Focus-Lock-${deployConfig.version}.dmg',
                linux: 'Focus-Lock-${deployConfig.version}.AppImage'
            };
            
            const filename = files[platform];
            if (filename) {
                window.open('https://github.com/${deployConfig.distribution.github.repo}/releases/download/v${deployConfig.version}/' + filename, '_blank');
            }
        }
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), downloadPage);
}

// Deploy to S3
async function deployToS3() {
  if (!deployConfig.distribution.s3.enabled) {
    log('⏭️  S3 deployment disabled', 'yellow');
    return;
  }
  
  log('☁️  Deploying to S3...', 'blue');
  
  try {
    const AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: deployConfig.distribution.s3.region
    });
    
    const s3 = new AWS.S3();
    const bucket = deployConfig.distribution.s3.bucket;
    
    // Upload installers
    const installersDir = path.join(__dirname, '../dist/installers');
    const files = fs.readdirSync(installersDir);
    
    for (const file of files) {
      const filePath = path.join(installersDir, file);
      const fileContent = fs.readFileSync(filePath);
      
      const params = {
        Bucket: bucket,
        Key: `releases/v${deployConfig.version}/${file}`,
        Body: fileContent,
        ContentType: getContentType(file),
        ACL: 'public-read'
      };
      
      await s3.upload(params).promise();
      log(`  ✓ Uploaded ${file}`, 'green');
    }
    
    // Upload web app
    await uploadWebAppToS3(s3, bucket);
    
    log('✓ Deployed to S3', 'green');
    
  } catch (error) {
    log(`❌ S3 deployment failed: ${error.message}`, 'red');
  }
}

// Upload web app to S3
async function uploadWebAppToS3(s3, bucket) {
  const webAppDir = path.join(__dirname, '../out');
  
  function uploadDirectory(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(async (file) => {
      const filePath = path.join(dir, file);
      const key = path.join(prefix, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        uploadDirectory(filePath, key);
      } else {
        const fileContent = fs.readFileSync(filePath);
        
        const params = {
          Bucket: bucket,
          Key: key,
          Body: fileContent,
          ContentType: getContentType(file),
          ACL: 'public-read'
        };
        
        await s3.upload(params).promise();
        log(`  ✓ Uploaded web app file: ${key}`, 'green');
      }
    });
  }
  
  uploadDirectory(webAppDir);
}

// Get content type for file
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.exe': 'application/octet-stream',
    '.dmg': 'application/octet-stream',
    '.appimage': 'application/octet-stream',
    '.zip': 'application/zip',
    '.tar.gz': 'application/gzip'
  };
  
  return types[ext] || 'application/octet-stream';
}

// Deploy to Firebase
async function deployToFirebase() {
  if (!deployConfig.distribution.firebase.enabled) {
    log('⏭️  Firebase deployment disabled', 'yellow');
    return;
  }
  
  log('🔥 Deploying to Firebase...', 'blue');
  
  try {
    // Set Firebase token
    process.env.FIREBASE_TOKEN = deployConfig.distribution.firebase.token;
    
    // Deploy web app
    execSync('firebase deploy --only hosting', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    log('✓ Deployed to Firebase', 'green');
    
  } catch (error) {
    log(`❌ Firebase deployment failed: ${error.message}`, 'red');
  }
}

// Generate deployment report
function generateDeploymentReport() {
  log('📊 Generating deployment report...', 'blue');
  
  const report = {
    deploymentId: deployConfig.buildId,
    version: deployConfig.version,
    timestamp: new Date().toISOString(),
    environment: deployConfig.environment,
    platforms: deployConfig.platforms,
    distribution: {
      github: deployConfig.distribution.github.enabled,
      githubPages: deployConfig.distribution.githubPages.enabled,
      s3: deployConfig.distribution.s3.enabled,
      firebase: deployConfig.distribution.firebase.enabled
    },
    files: []
  };
  
  // Scan distribution files
  const distDir = path.join(__dirname, '../dist');
  function scanDirectory(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.join(prefix, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        scanDirectory(filePath, relativePath);
      } else {
        const stats = fs.statSync(filePath);
        report.files.push({
          path: relativePath,
          size: stats.size,
          modified: stats.mtime.toISOString()
        });
      }
    });
  }
  
  scanDirectory(distDir);
  
  // Write report
  const reportPath = path.join(distDir, 'deployment-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log('✓ Deployment report generated', 'green');
}

// Main deployment function
async function deploy() {
  try {
    log('🚀 Starting deployment process...', 'bright');
    log(`Version: ${deployConfig.version}`, 'cyan');
    log(`Environment: ${deployConfig.environment}`, 'cyan');
    log(`Build ID: ${deployConfig.buildId}`, 'cyan');
    log('', 'reset');
    
    // Validate environment
    validateEnvironment();
    
    // Load settings
    loadDeploySettings();
    
    // Deploy to all configured platforms
    await createGitHubRelease();
    await deployToGitHubPages();
    await deployToS3();
    await deployToFirebase();
    
    // Generate report
    generateDeploymentReport();
    
    log('\n🎉 Deployment completed successfully!', 'bright');
    log('', 'reset');
    log('📋 Deployment Summary:', 'blue');
    log(`  Version: ${deployConfig.version}`, 'green');
    log(`  Environment: ${deployConfig.environment}`, 'green');
    log(`  Platforms: ${deployConfig.platforms.join(', ')}`, 'green');
    log('', 'reset');
    log('🔗 Next steps:', 'yellow');
    log('  1. Verify downloads work correctly', 'reset');
    log('  2. Test installation on all platforms', 'reset');
    log('  3. Update documentation', 'reset');
    log('  4. Notify users of new release', 'reset');
    
  } catch (error) {
    log(`\n❌ Deployment failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run deployment if called directly
if (require.main === module) {
  deploy();
}

module.exports = { deploy, deployConfig };
