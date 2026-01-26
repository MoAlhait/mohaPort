# 🖥️ Focus Lock Desktop App - Complete Setup Guide

Transform your Student Productivity Tools into a powerful desktop application that locks you out of distracting websites and applications during study sessions.

## 🎯 What This Desktop App Does

### 🔒 **Website Blocking**
- Blocks Facebook, Twitter, YouTube, Instagram, TikTok, and other distracting sites
- Redirects blocked sites to a custom blocking page
- Maintains a whitelist for essential study sites (Google, Stack Overflow, etc.)
- Works by modifying your system's hosts file

### 📱 **Application Blocking**
- Blocks desktop applications during focus sessions
- Platform-specific blocking (Windows Task Scheduler, macOS AppleScript, Linux process killing)
- Real-time monitoring and termination of blocked apps
- Configurable application blacklist

### ⏰ **Focus Sessions**
- Quick preset sessions (25min Pomodoro, 45min Study, 90min Deep Work, 2hr Exam Prep)
- Custom duration sessions
- Timer with countdown display
- Automatic session end

### 🚨 **Emergency Features**
- Emergency access override with confirmation dialog
- Global keyboard shortcut (Ctrl+Shift+L / Cmd+Shift+L)
- System tray integration
- One-click session start/stop

## 🛠️ Installation Instructions

### Prerequisites
- **Node.js 16+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Administrator/Sudo privileges** (required for system-level blocking)

### Step 1: Install Dependencies

```bash
# Navigate to the electron app directory
cd student-productivity-tools/electron-app

# Install Electron dependencies
npm install
```

### Step 2: Build the Web App First

```bash
# Go back to main directory
cd ..

# Build the Next.js web application
npm run build

# Return to electron directory
cd electron-app
```

### Step 3: Create App Icons (Optional)

```bash
# Create placeholder icons
node assets/create-icons.js

# Note: Replace with proper icons for production
```

### Step 4: Test the Desktop App

```bash
# Start the desktop app in development mode
npm start
```

### Step 5: Build for Distribution

```bash
# Build for your current platform
npm run build

# Or build for specific platforms:
npm run build-win    # Windows
npm run build-mac    # macOS
```

## 🎮 How to Use the Desktop App

### Starting a Focus Session

1. **Launch the app** - You'll see the Focus Lock interface
2. **Choose a session type:**
   - **Quick Sessions:** Click preset buttons (25min Pomodoro, 45min Study, etc.)
   - **Custom Session:** Click "Start Indefinite Focus Session"
3. **The app will immediately start blocking** distracting websites and apps

### Managing Blocked Sites

1. **Click the Settings icon** (gear) in the top-right
2. **Add blocked sites:**
   - Click "Add Site" in the Blocked Websites section
   - Enter domain names (e.g., "facebook.com", "twitter.com")
3. **Manage allowed sites:**
   - Add essential sites to the whitelist (e.g., "google.com", "stackoverflow.com")
   - Whitelisted sites take priority over blocked sites

### Emergency Access

1. **During a focus session:** Click the "Emergency Access" button
2. **Confirm the dialog:** Click "End Session" to stop blocking
3. **Global shortcut:** Press `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (macOS)

### System Tray

- **Right-click** the tray icon for quick actions
- **Left-click** to show/hide the main window
- **Start/Stop** blocking directly from the tray menu

## 🔧 Configuration Options

### Website Blocking Settings
- **Blocked Websites:** List of domains to block
- **Allowed Websites:** Whitelist of essential sites
- **Auto-start:** Automatically start blocking when app launches

### Application Blocking Settings
- **Blocked Apps:** List of applications to block
- **Blocking Method:** Platform-specific blocking mechanisms
- **Emergency Override:** Allow emergency access during sessions

### Notification Settings
- **System Notifications:** Enable/disable notifications
- **Session Alerts:** Notify when sessions start/end
- **Quiet Hours:** Disable notifications during specific times

## 🚨 Important Security Notes

### Required Permissions
- **Windows:** Administrator privileges for hosts file modification and Task Scheduler
- **macOS:** Admin password for system file access and AppleScript execution
- **Linux:** Sudo access for hosts file and process management

### What the App Does
- **Modifies hosts file** to redirect blocked websites to localhost
- **Uses Task Scheduler** (Windows) to automatically terminate blocked applications
- **Executes system commands** to monitor and control running processes
- **Stores settings** in user data directory

### Security Considerations
- Some antivirus software may flag the app due to system modifications
- Always download from trusted sources
- The app requires elevated privileges to function properly
- Backup important data before installation

## 🐛 Troubleshooting

### App Won't Start
1. **Check Node.js version:** Must be 16 or higher
2. **Install dependencies:** Run `npm install` in electron-app directory
3. **Build web app first:** Run `npm run build` in main directory
4. **Check console errors:** Look for error messages in the terminal

### Blocking Not Working
1. **Check permissions:** Ensure app has admin/sudo privileges
2. **Antivirus interference:** Whitelist the app in your antivirus
3. **Hosts file issues:** Manually check if hosts file is being modified
4. **Restart with privileges:** Close and reopen the app as administrator

### Build Issues
1. **Web app not built:** Ensure Next.js app is built before building Electron app
2. **Missing dependencies:** Run `npm install` in electron-app directory
3. **Platform-specific tools:** Install required build tools for your platform
4. **Check electron-builder config:** Verify build configuration in package.json

### Performance Issues
1. **Too many blocked sites:** Reduce the number of blocked websites
2. **System resource usage:** Close other resource-intensive applications
3. **Background processes:** Disable unnecessary background applications

## 📁 File Structure

```
student-productivity-tools/
├── electron-app/                 # Desktop app directory
│   ├── main.js                  # Main Electron process
│   ├── preload.js               # Security layer
│   ├── build.js                 # Build script
│   ├── package.json             # Electron dependencies
│   ├── scripts/
│   │   └── blocker.js           # Platform-specific blocking
│   ├── assets/                  # Icons and resources
│   └── dist/                    # Built app files
├── app/
│   └── focus-lock/
│       └── page.tsx             # Focus Lock web interface
└── out/                         # Next.js build output
```

## 🚀 Distribution

### Building Installers
```bash
# Windows (.exe installer)
npm run build-desktop-win

# macOS (.dmg file)
npm run build-desktop-mac

# Linux (.AppImage)
npm run build
```

### Distributing the App
1. **Test thoroughly** on target platforms
2. **Create proper icons** (replace placeholder icons)
3. **Code signing** (recommended for distribution)
4. **Virus scanning** before distribution
5. **User documentation** and installation guides

## 🔄 Updates and Maintenance

### Updating the App
1. **Pull latest changes** from the repository
2. **Rebuild the web app:** `npm run build`
3. **Rebuild the desktop app:** `npm run build-desktop`
4. **Test thoroughly** before distribution

### Maintaining Block Lists
- **Regular updates** to blocked site lists
- **User feedback** for new blocking requests
- **Platform updates** for blocking mechanisms
- **Security patches** for system modifications

## 📞 Support and Help

### Getting Help
1. **Check this guide** for common issues
2. **Review the README** in electron-app directory
3. **Check console logs** for error messages
4. **Test with minimal configuration** to isolate issues

### Reporting Issues
1. **Include platform information** (Windows/macOS/Linux)
2. **Provide error messages** from console
3. **Describe steps to reproduce** the issue
4. **Include system information** (Node.js version, etc.)

---

## 🎉 Congratulations!

You now have a powerful desktop application that can:
- ✅ Block distracting websites during study sessions
- ✅ Block desktop applications automatically
- ✅ Provide emergency access when needed
- ✅ Work across Windows, macOS, and Linux
- ✅ Integrate with your existing productivity tools

**Start your first focus session and experience distraction-free studying!** 🎯📚

---

**⚠️ Disclaimer:** This app modifies system files and processes. Use at your own risk and always backup important data before installation. The app requires elevated privileges to function properly.
