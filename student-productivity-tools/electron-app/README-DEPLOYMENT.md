# 🚀 Focus Lock - Production Deployment System

This document provides everything you need to deploy Focus Lock as a production-ready desktop application across Windows, macOS, and Linux platforms.

## 🎯 Quick Start

### One-Command Deploy
```bash
# Build and deploy everything
./scripts/quick-deploy.sh -d

# Or using npm
npm run quick-deploy -- --deploy
```

### Manual Deploy
```bash
# 1. Build for all platforms
npm run build-all

# 2. Test deployment
npm run test-deployment

# 3. Deploy to GitHub
npm run deploy-github
```

## 📁 Project Structure

```
electron-app/
├── scripts/                    # Build and deployment scripts
│   ├── build-all.js           # Complete build system
│   ├── deploy.js              # Deployment system
│   ├── quick-deploy.sh        # Quick deployment script
│   └── test-deployment.js     # Testing suite
├── .github/workflows/         # CI/CD pipeline
│   └── build-and-deploy.yml   # GitHub Actions workflow
├── assets/                    # App icons and resources
├── dist/                      # Build output directory
├── deploy-settings.json       # Deployment configuration
├── firebase.json             # Firebase hosting config
├── CHANGELOG.md              # Release notes
└── DEPLOYMENT-GUIDE.md       # Detailed deployment guide
```

## 🔧 Available Commands

### Build Commands
```bash
npm run build-all              # Build for all platforms
npm run build-win              # Build for Windows only
npm run build-mac              # Build for macOS only
npm run build-linux            # Build for Linux only
npm run clean                  # Clean build artifacts
```

### Deployment Commands
```bash
npm run deploy                 # Deploy to all configured platforms
npm run deploy-github          # Deploy to GitHub releases
npm run deploy-firebase        # Deploy web app to Firebase
npm run deploy-s3              # Deploy to AWS S3
npm run quick-deploy -- --deploy  # Quick build and deploy
```

### Testing Commands
```bash
npm run test-deployment        # Run deployment test suite
npm run setup                  # Initial setup and dependency installation
```

## 🌐 Deployment Platforms

### GitHub Releases
- **Purpose**: Primary distribution for desktop apps
- **Files**: Windows .exe, macOS .dmg, Linux .AppImage
- **Setup**: Set `GITHUB_TOKEN` environment variable
- **Usage**: `npm run deploy-github`

### GitHub Pages
- **Purpose**: Web app hosting and download page
- **URL**: `https://your-username.github.io/focus-lock`
- **Setup**: Enable Pages in repository settings
- **Usage**: `npm run deploy` (includes GitHub Pages)

### Firebase Hosting
- **Purpose**: Alternative web hosting with custom domain
- **Setup**: Install Firebase CLI and configure project
- **Usage**: `npm run deploy-firebase`

### AWS S3
- **Purpose**: CDN distribution for downloads
- **Setup**: Configure AWS credentials
- **Usage**: `npm run deploy-s3`

## ⚙️ Configuration

### Environment Variables

#### Required for GitHub Releases
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

#### Required for Firebase
```bash
export FIREBASE_TOKEN=your_firebase_token
export FIREBASE_PROJECT=your_project_id
```

#### Required for AWS S3
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export S3_BUCKET=your_bucket_name
```

### Deployment Settings

Edit `deploy-settings.json` to configure:

```json
{
  "distribution": {
    "github": {
      "enabled": true,
      "repo": "your-username/focus-lock",
      "autoRelease": true
    },
    "githubPages": {
      "enabled": true
    },
    "firebase": {
      "enabled": true,
      "project": "your-project-id"
    },
    "s3": {
      "enabled": false,
      "bucket": "your-bucket"
    }
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

The included workflow automatically:

1. **Tests** the application on pull requests
2. **Builds** for all platforms on tag push
3. **Creates** GitHub releases with installers
4. **Deploys** web app to multiple platforms
5. **Notifies** via Discord/Slack (if configured)

#### Triggering a Release

```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Build for all platforms
# 2. Create a release
# 3. Deploy web app
# 4. Send notifications
```

### Manual Workflow

```bash
# 1. Update version in package.json
npm version patch  # or minor, major

# 2. Build and test
npm run build-all
npm run test-deployment

# 3. Deploy
npm run deploy

# 4. Create GitHub release manually (if needed)
```

## 📦 Build Output

### Directory Structure
```
dist/
├── installers/               # Platform-specific installers
│   ├── Focus-Lock-Setup-1.0.0.exe
│   ├── Focus-Lock-1.0.0.dmg
│   └── Focus-Lock-1.0.0.AppImage
├── packages/                 # Portable packages
│   ├── Focus-Lock-Portable-1.0.0.zip (Windows)
│   ├── Focus-Lock-Portable-1.0.0.zip (macOS)
│   └── Focus-Lock-Portable-1.0.0.tar.gz (Linux)
├── windows/                  # Windows build files
├── macos/                    # macOS build files
├── linux/                    # Linux build files
├── build-manifest.json       # Build metadata
└── deployment-report.json    # Deployment status
```

### File Sizes (Approximate)
- **Windows Installer**: ~150MB
- **macOS DMG**: ~120MB
- **Linux AppImage**: ~130MB
- **Portable Packages**: ~100MB each

## 🧪 Testing

### Automated Test Suite

```bash
npm run test-deployment
```

**Tests include:**
- ✅ Build artifacts exist and are valid
- ✅ Installers are properly created
- ✅ Configuration files are correct
- ✅ Dependencies are installed
- ✅ Security scan passes
- ✅ File permissions are correct
- ✅ Performance benchmarks

### Manual Testing Checklist

- [ ] **Windows**: Test installer on Windows 10/11
- [ ] **macOS**: Test DMG on macOS 10.14+
- [ ] **Linux**: Test AppImage on Ubuntu 18.04+
- [ ] **Web App**: Verify download page works
- [ ] **Auto-updater**: Test update mechanism
- [ ] **Permissions**: Verify admin privileges work

## 🔐 Security

### Code Signing

#### Windows
- Requires code signing certificate
- Configure in `deploy-settings.json`
- Set `CSC_LINK` and `CSC_KEY_PASSWORD` environment variables

#### macOS
- Requires Apple Developer account
- Configure in `deploy-settings.json`
- Set Apple ID and app-specific password

### Security Features
- ✅ Local data storage (no cloud dependencies)
- ✅ Encrypted settings
- ✅ Safe system file modifications
- ✅ Permission validation
- ✅ Security scanning in tests

## 📊 Monitoring

### Build Monitoring
- Build manifest with file checksums
- Deployment report with status
- Test results with pass/fail counts

### Analytics (Optional)
- Google Analytics integration
- Usage telemetry
- Error reporting
- Performance monitoring

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clean and rebuild
npm run clean
npm run build-all

# Check dependencies
npm install
cd .. && npm install
```

#### Deployment Failures
```bash
# Test deployment first
npm run test-deployment

# Check environment variables
echo $GITHUB_TOKEN
echo $FIREBASE_TOKEN

# Check network connectivity
ping github.com
```

#### Permission Issues
```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Make scripts executable
chmod +x scripts/*.sh
```

### Getting Help

1. **Check logs**: Build and deployment scripts provide detailed logs
2. **Run tests**: `npm run test-deployment` identifies common issues
3. **Review documentation**: See `DEPLOYMENT-GUIDE.md` for detailed info
4. **Create issue**: Use GitHub Issues for bug reports

## 🚀 Advanced Usage

### Custom Build Scripts

Create custom build scripts in `scripts/`:

```javascript
// scripts/custom-build.js
const { buildAll } = require('./build-all');

async function customBuild() {
  // Pre-build steps
  console.log('Running custom pre-build steps...');
  
  // Standard build
  await buildAll();
  
  // Post-build steps
  console.log('Running custom post-build steps...');
}

customBuild();
```

### Environment-Specific Builds

```bash
# Development build
NODE_ENV=development npm run build-all

# Staging build
NODE_ENV=staging npm run build-all

# Production build
NODE_ENV=production npm run build-all
```

### Custom Deployment

```bash
# Deploy only to specific platforms
node scripts/deploy.js --github --firebase

# Deploy with custom settings
node scripts/deploy.js --config custom-deploy-settings.json
```

## 📚 Documentation

- **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - Complete deployment guide
- **[ENHANCED-FEATURES.md](./ENHANCED-FEATURES.md)** - Feature documentation
- **[CHANGELOG.md](./CHANGELOG.md)** - Release notes
- **[DESKTOP-APP-GUIDE.md](./DESKTOP-APP-GUIDE.md)** - User guide

## 🎉 Success Checklist

Before considering your deployment complete:

- [ ] ✅ All platforms build successfully
- [ ] ✅ Test suite passes (`npm run test-deployment`)
- [ ] ✅ Installers work on target platforms
- [ ] ✅ Web deployment is live
- [ ] ✅ GitHub release is created
- [ ] ✅ Auto-updater is working
- [ ] ✅ Documentation is updated
- [ ] ✅ Users are notified

## 🔗 Links

- **GitHub Repository**: [mohammad-alhait/focus-lock](https://github.com/mohammad-alhait/focus-lock)
- **Download Page**: [focus-lock.github.io](https://focus-lock.github.io)
- **Documentation**: [focus-lock.github.io/docs](https://focus-lock.github.io/docs)
- **Issues**: [GitHub Issues](https://github.com/mohammad-alhait/focus-lock/issues)

---

**🎉 Congratulations! Your Focus Lock application is now ready for production deployment!**

For questions or support, please create an issue on GitHub or contact the development team.
