# Focus Lock Desktop App

A powerful desktop application that locks you out of distracting websites and applications during study sessions. Built with Electron for cross-platform support.

## 🚀 Features

### 🔒 Website Blocking
- Block distracting websites (Facebook, Twitter, YouTube, etc.)
- Whitelist essential sites (Google, Stack Overflow, etc.)
- Automatic redirection to blocking page
- Emergency access override

### 📱 Application Blocking
- Block desktop applications during focus sessions
- Platform-specific blocking mechanisms
- Real-time process monitoring
- Automatic app termination

### ⏰ Focus Sessions
- Quick session presets (25min Pomodoro, 45min Study, etc.)
- Custom session durations
- Timer with countdown display
- Automatic session end

### 🎯 Smart Features
- System tray integration
- Global keyboard shortcuts (Ctrl+Shift+L)
- Auto-start on app launch
- System notifications
- Emergency access dialog

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Development Setup

1. **Clone and navigate to the project:**
   ```bash
   cd student-productivity-tools/electron-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the web app first:**
   ```bash
   cd ..
   npm run build
   cd electron-app
   ```

4. **Start the desktop app:**
   ```bash
   npm start
   ```

### Building for Distribution

1. **Build for current platform:**
   ```bash
   npm run build
   ```

2. **Build for specific platforms:**
   ```bash
   # Windows
   npm run build-win
   
   # macOS
   npm run build-mac
   ```

3. **Find your built app in:**
   - `dist/` directory
   - Windows: `.exe` installer
   - macOS: `.dmg` file
   - Linux: `.AppImage` file

## 🎮 Usage

### Starting a Focus Session

1. **Quick Sessions:** Click on preset buttons (25min Pomodoro, 45min Study, etc.)
2. **Custom Session:** Click "Start Indefinite Focus Session" for manual control
3. **Scheduled Sessions:** Set up automatic sessions in settings

### Managing Blocked Sites

1. **Add Sites:** Click "Add Site" in the blocked websites section
2. **Remove Sites:** Click the trash icon next to any site
3. **Whitelist Sites:** Add essential sites to the allowed list

### Emergency Access

1. **During a session:** Click "Emergency Access" button
2. **Confirm dialog:** Click "End Session" to stop blocking
3. **Global shortcut:** Press `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (macOS)

### System Tray

- **Right-click** the tray icon for quick actions
- **Left-click** to show/hide the main window
- **Start/Stop** blocking directly from tray

## ⚙️ Settings

### Website Blocking
- Add/remove blocked websites
- Manage whitelist for essential sites
- Enable/disable auto-start

### Application Blocking
- Block specific desktop applications
- Configure blocking behavior
- Set emergency overrides

### Notifications
- Enable/disable system notifications
- Customize notification content
- Set quiet hours

## 🔧 Technical Details

### Platform Support
- **Windows:** Uses PowerShell and Task Scheduler
- **macOS:** Uses AppleScript and system commands
- **Linux:** Uses shell commands and process management

### Security
- Requires admin/sudo privileges for system-level blocking
- Secure IPC communication between processes
- Protected settings storage

### File Locations
- **Settings:** Stored in user data directory
- **Logs:** Application logs in user data
- **Builds:** Distribution files in `dist/` directory

## 🚨 Important Notes

### Permissions Required
- **Windows:** Administrator privileges for hosts file modification
- **macOS:** Admin password for system file access
- **Linux:** Sudo access for hosts file and process management

### Security Considerations
- The app modifies system files (hosts file) for website blocking
- Some antivirus software may flag the app due to system modifications
- Always download from trusted sources

### Limitations
- Website blocking uses hosts file redirection
- Application blocking may not work with all apps
- Some system processes cannot be blocked for security reasons

## 🐛 Troubleshooting

### App Won't Start
1. Check Node.js version (16+ required)
2. Run `npm install` to ensure dependencies are installed
3. Check console for error messages

### Blocking Not Working
1. Ensure app has required permissions
2. Check if antivirus is interfering
3. Verify hosts file modifications
4. Restart the app with admin privileges

### Build Issues
1. Ensure Next.js web app is built first
2. Check electron-builder configuration
3. Verify platform-specific build tools

## 📝 Development

### Project Structure
```
electron-app/
├── main.js              # Main Electron process
├── preload.js           # Preload script for security
├── scripts/
│   └── blocker.js       # Platform-specific blocking logic
├── assets/              # App icons and resources
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Key Scripts
- `npm start` - Run in development
- `npm run build` - Build for distribution
- `npm run build-win` - Build Windows installer
- `npm run build-mac` - Build macOS app

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**⚠️ Disclaimer:** This app modifies system files and processes. Use at your own risk and always backup important data before installation.
