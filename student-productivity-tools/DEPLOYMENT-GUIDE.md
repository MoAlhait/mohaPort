# 🚀 Focus Lock - Complete Deployment Guide

This guide covers everything you need to deploy Focus Lock as a production-ready desktop application across Windows, macOS, and Linux platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Build System](#build-system)
4. [Deployment Platforms](#deployment-platforms)
5. [Code Signing](#code-signing)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Distribution](#distribution)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Configuration](#advanced-configuration)

## 🔧 Prerequisites

### Required Software
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 8+** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Python 3.7+** (for native modules)

### Platform-Specific Requirements

#### Windows
- **Visual Studio Build Tools** or **Visual Studio Community**
- **Windows 10 SDK**
- **NSIS** (for installer creation) - Optional

#### macOS
- **Xcode Command Line Tools**: `xcode-select --install`
- **macOS 10.14+** for building
- **Apple Developer Account** (for code signing)

#### Linux
- **Build essentials**: `sudo apt-get install build-essential`
- **libnss3-dev**: `sudo apt-get install libnss3-dev`
- **libatk-bridge2.0-dev**: `sudo apt-get install libatk-bridge2.0-dev`

### Accounts & Services
- **GitHub Account** (for releases and CI/CD)
- **GitHub Personal Access Token** (for automated releases)
- **Firebase Project** (for web hosting) - Optional
- **AWS Account** (for S3 distribution) - Optional

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/mohammad-alhait/focus-lock.git
cd focus-lock/student-productivity-tools

# Install dependencies
npm install
cd electron-app
npm install
```

### 2. Build for All Platforms
```bash
# Build the complete application
node scripts/build-all.js
```

### 3. Deploy
```bash
# Deploy to all configured platforms
node scripts/deploy.js
```

### 4. Verify
- Check the `dist/` directory for build artifacts
- Test installers on target platforms
- Verify web deployment (if enabled)

## 🔨 Build System

### Automated Build Script

The `scripts/build-all.js` script provides a complete build pipeline:

```bash
node scripts/build-all.js
```

**What it does:**
1. ✅ Validates environment and prerequisites
2. ✅ Builds Next.js web application
3. ✅ Installs Electron dependencies
4. ✅ Creates production icons
5. ✅ Builds for all platforms (Windows, macOS, Linux)
6. ✅ Creates installer packages
7. ✅ Generates portable packages
8. ✅ Creates build manifest

### Manual Build Steps

If you prefer manual control:

```bash
# 1. Build web app
cd ..
npm run build
cd electron-app

# 2. Install Electron dependencies
npm install

# 3. Build for specific platform
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build        # Linux (or current platform)
```

### Build Configuration

Edit `package.json` to customize build settings:

```json
{
  "build": {
    "appId": "com.mohammad.focus-lock",
    "productName": "Focus Lock",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!**/node_modules/*/{CHANGELOG.md,README.md}",
      "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp}"
    ],
    "mac": {
      "category": "public.app-category.productivity",
      "target": [
        { "target": "dmg", "arch": ["x64", "arm64"] }
      ]
    },
    "win": {
      "target": [
        { "target": "nsis", "arch": ["x64"] }
      ]
    },
    "linux": {
      "target": [
        { "target": "AppImage", "arch": ["x64"] }
      ]
    }
  }
}
```

## 🌐 Deployment Platforms

### GitHub Releases

**Setup:**
1. Create GitHub Personal Access Token
2. Set environment variable: `export GITHUB_TOKEN=your_token`
3. Update `deploy-settings.json`:

```json
{
  "distribution": {
    "github": {
      "enabled": true,
      "repo": "your-username/focus-lock",
      "autoRelease": true
    }
  }
}
```

**Deploy:**
```bash
node scripts/deploy.js --github
```

### GitHub Pages

**Setup:**
1. Enable GitHub Pages in repository settings
2. Set source to `gh-pages` branch
3. Configure in `deploy-settings.json`

**Deploy:**
```bash
node scripts/deploy.js --github-pages
```

### Firebase Hosting

**Setup:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Configure project in `firebase.json`

**Deploy:**
```bash
node scripts/deploy.js --firebase
```

### AWS S3

**Setup:**
1. Configure AWS credentials
2. Set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   export S3_BUCKET=your-bucket-name
   ```

**Deploy:**
```bash
node scripts/deploy.js --s3
```

## 🔐 Code Signing

### Windows Code Signing

**Requirements:**
- Code signing certificate (.p12 file)
- Certificate password

**Setup:**
1. Obtain code signing certificate from trusted CA
2. Configure in `deploy-settings.json`:

```json
{
  "build": {
    "codeSigning": {
      "windows": {
        "enabled": true,
        "certificate": "path/to/certificate.p12",
        "password": "certificate_password"
      }
    }
  }
}
```

**Environment Variables:**
```bash
export CSC_LINK=file:///path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password
```

### macOS Code Signing

**Requirements:**
- Apple Developer Account
- Distribution certificate
- App-specific password

**Setup:**
1. Create distribution certificate in Apple Developer Portal
2. Download and install certificate
3. Configure in `deploy-settings.json`:

```json
{
  "build": {
    "codeSigning": {
      "macos": {
        "enabled": true,
        "identity": "Developer ID Application: Your Name"
      }
    },
    "notarization": {
      "macos": {
        "enabled": true,
        "appleId": "your@email.com",
        "appleIdPassword": "app-specific-password",
        "teamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Environment Variables:**
```bash
export APPLE_ID=your@email.com
export APPLE_PASSWORD=app-specific-password
export APPLE_TEAM_ID=YOUR_TEAM_ID
```

## 🔄 CI/CD Pipeline

### GitHub Actions

The included `.github/workflows/build-and-deploy.yml` provides:

- ✅ **Multi-platform builds** (Windows, macOS, Linux)
- ✅ **Automated testing**
- ✅ **Release creation**
- ✅ **Web deployment**
- ✅ **Notification system**

**Setup:**
1. Push code to GitHub repository
2. Set up secrets in repository settings:
   - `GITHUB_TOKEN`
   - `FIREBASE_TOKEN` (optional)
   - `AWS_ACCESS_KEY_ID` (optional)
   - `DISCORD_WEBHOOK` (optional)

**Usage:**
- **Manual trigger**: Go to Actions tab → Run workflow
- **Tag trigger**: Push a tag like `v1.0.0`
- **PR trigger**: Create pull request

### Custom CI/CD

For other CI/CD systems, use the build scripts:

```bash
# Install dependencies
npm install
cd electron-app && npm install

# Build web app
cd .. && npm run build

# Build desktop app
cd electron-app && npm run build

# Deploy
node scripts/deploy.js
```

## 📦 Distribution

### Installer Packages

**Windows (NSIS)**
- File: `Focus-Lock-Setup-1.0.0.exe`
- Features: Silent install, auto-updater, uninstaller
- Size: ~150MB

**macOS (DMG)**
- File: `Focus-Lock-1.0.0.dmg`
- Features: Drag-to-install, code signed, notarized
- Size: ~120MB

**Linux (AppImage)**
- File: `Focus-Lock-1.0.0.AppImage`
- Features: Portable, no installation required
- Size: ~130MB

### Portable Packages

**Windows**
- File: `Focus-Lock-Portable-1.0.0.zip`
- Extract and run `Focus Lock.exe`

**macOS**
- File: `Focus-Lock-Portable-1.0.0.zip`
- Extract and run `Focus Lock.app`

**Linux**
- File: `Focus-Lock-Portable-1.0.0.tar.gz`
- Extract and run `focus-lock`

### Auto-Updater

The app includes an auto-updater that:
- ✅ Checks for updates on startup
- ✅ Downloads updates in background
- ✅ Prompts user to restart
- ✅ Handles rollback on failure

**Configuration:**
```json
{
  "build": {
    "autoUpdate": {
      "enabled": true,
      "provider": "github",
      "updater": {
        "checkInterval": 3600000,
        "downloadUrl": "https://api.github.com/repos/your-repo/releases/latest"
      }
    }
  }
}
```

## 📊 Monitoring

### Build Monitoring

**Build Manifest**
- File: `dist/build-manifest.json`
- Contains: File list, checksums, build metadata

**Deployment Report**
- File: `dist/deployment-report.json`
- Contains: Deployment status, platform info, timestamps

### Analytics

**Google Analytics** (Optional)
```json
{
  "analytics": {
    "googleAnalytics": {
      "enabled": true,
      "trackingId": "GA_MEASUREMENT_ID"
    }
  }
}
```

**Telemetry**
```json
{
  "analytics": {
    "telemetry": {
      "enabled": true,
      "collectUsage": true,
      "collectErrors": true,
      "collectPerformance": false
    }
  }
}
```

## 🐛 Troubleshooting

### Common Build Issues

**Node.js Version**
```bash
# Ensure correct Node.js version
node --version  # Should be 18+
npm --version   # Should be 8+
```

**Python Issues**
```bash
# Install Python for native modules
# Windows: Download from python.org
# macOS: brew install python
# Linux: sudo apt-get install python3-dev
```

**Permission Issues**
```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Platform-Specific Issues

**Windows:**
- Ensure Visual Studio Build Tools are installed
- Run as Administrator if needed
- Check Windows Defender exclusions

**macOS:**
- Install Xcode Command Line Tools
- Ensure proper code signing setup
- Check Gatekeeper settings

**Linux:**
- Install build essentials
- Check library dependencies
- Ensure proper permissions

### Deployment Issues

**GitHub Releases:**
```bash
# Check token permissions
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

**Firebase:**
```bash
# Login and verify
firebase login
firebase projects:list
```

**S3:**
```bash
# Test AWS credentials
aws s3 ls
```

## ⚙️ Advanced Configuration

### Custom Build Scripts

Create custom build scripts in `scripts/`:

```javascript
// scripts/custom-build.js
const { buildAll } = require('./build-all');

async function customBuild() {
  // Custom build logic
  await buildAll();
  // Additional steps
}

customBuild();
```

### Environment-Specific Builds

**Development:**
```bash
NODE_ENV=development node scripts/build-all.js
```

**Staging:**
```bash
NODE_ENV=staging node scripts/build-all.js
```

**Production:**
```bash
NODE_ENV=production node scripts/build-all.js
```

### Feature Flags

Configure features in `deploy-settings.json`:

```json
{
  "features": {
    "beta": {
      "enabled": false,
      "allowBetaFeatures": false
    },
    "experimental": {
      "enabled": false,
      "allowExperimentalFeatures": false
    }
  }
}
```

### Localization

**Supported Languages:**
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Chinese (zh)
- Japanese (ja)

**Configuration:**
```json
{
  "localization": {
    "defaultLanguage": "en",
    "supportedLanguages": ["en", "es", "fr", "de", "zh", "ja"],
    "autoDetect": true
  }
}
```

## 📚 Additional Resources

### Documentation
- [Electron Builder Documentation](https://www.electron.build/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Community
- [Electron Discord](https://discord.gg/electron)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Focus Lock GitHub](https://github.com/mohammad-alhait/focus-lock)

### Support
- Create an issue on GitHub
- Email: support@focus-lock.app
- Documentation: [focus-lock.github.io](https://focus-lock.github.io)

---

## 🎉 Success Checklist

Before considering your deployment complete:

- [ ] ✅ All platforms build successfully
- [ ] ✅ Installers work on target platforms
- [ ] ✅ Code signing is configured (if needed)
- [ ] ✅ Auto-updater is working
- [ ] ✅ Web deployment is live
- [ ] ✅ Analytics are tracking (if enabled)
- [ ] ✅ Documentation is updated
- [ ] ✅ Release notes are published
- [ ] ✅ Users are notified of new release

**Congratulations! Your Focus Lock application is now deployed and ready for users! 🚀**
