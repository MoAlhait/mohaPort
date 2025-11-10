const { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;
let isFocusMode = false;
let allowedApp = '';
let appMonitor = null;

// Simple app list for testing
const commonApps = [
  'Safari',
  'Google Chrome', 
  'Firefox',
  'Discord',
  'Slack',
  'Messages',
  'WhatsApp',
  'Instagram',
  'Twitter',
  'YouTube',
  'Netflix',
  'Spotify',
  'Steam',
  'Photos',
  'Mail',
  'Calendar',
  'Finder',
  'Notes',
  'Terminal',
  'Visual Studio Code',
  'Notion',
  'Obsidian'
];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'Simple Focus Lock'
  });

  mainWindow.loadFile('simple-focus-lock.html');
  
  // Create system tray
  createTray();
  
  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(path.join(__dirname, 'assets/tray-icon.png'));
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    {
      label: 'Toggle Focus Mode',
      click: () => {
        toggleFocusMode();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Simple Focus Lock');
  
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

function toggleFocusMode() {
  if (!allowedApp) {
    dialog.showErrorBox('No App Selected', 'Please select an allowed app first');
    return;
  }
  
  isFocusMode = !isFocusMode;
  
  if (isFocusMode) {
    startFocusMode();
    tray.setToolTip(`Focus Mode ON - Allowed: ${allowedApp}`);
  } else {
    stopFocusMode();
    tray.setToolTip('Focus Mode OFF');
  }
  
  // Update UI
  if (mainWindow) {
    mainWindow.webContents.send('focus-mode-changed', { 
      isActive: isFocusMode, 
      allowedApp: allowedApp 
    });
  }
}

function startFocusMode() {
  console.log(`🎯 Starting Focus Mode - Allowed App: ${allowedApp}`);
  
  // Start monitoring for other apps
  appMonitor = setInterval(() => {
    checkForNonAllowedApps();
  }, 2000); // Check every 2 seconds
}

function stopFocusMode() {
  console.log('🛑 Stopping Focus Mode');
  
  if (appMonitor) {
    clearInterval(appMonitor);
    appMonitor = null;
  }
}

function checkForNonAllowedApps() {
  if (!isFocusMode || !allowedApp) return;
  
  // Get list of running applications
  const { exec } = require('child_process');
  
  // macOS command to get frontmost application
  exec('osascript -e "tell application \\"System Events\\" to get name of first application process whose frontmost is true"', (error, stdout, stderr) => {
    if (error) {
      console.error('Error getting frontmost app:', error);
      return;
    }
    
    const currentApp = stdout.trim();
    console.log(`Current app: ${currentApp}`);
    
    // Check if current app is not the allowed app
    if (currentApp !== allowedApp) {
      console.log(`🚫 Non-allowed app detected: ${currentApp}`);
      minimizeApp(currentApp);
    }
  });
}

function minimizeApp(appName) {
  console.log(`📱 Minimizing app: ${appName}`);
  
  const { exec } = require('child_process');
  
  // AppleScript to minimize the current app
  const script = `
    tell application "System Events"
      set frontmostProcess to first process whose frontmost is true
      if name of frontmostProcess is "${appName}" then
        set minimized of window 1 of frontmostProcess to true
      end if
    end tell
  `;
  
  exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Failed to minimize ${appName}:`, error);
    } else {
      console.log(`✅ Successfully minimized ${appName}`);
      
      // Switch back to allowed app
      switchToAllowedApp();
    }
  });
}

function switchToAllowedApp() {
  if (!allowedApp) return;
  
  console.log(`🔄 Switching to allowed app: ${allowedApp}`);
  
  const { exec } = require('child_process');
  
  // AppleScript to switch to the allowed app
  const script = `
    tell application "${allowedApp}"
      activate
    end tell
  `;
  
  exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Failed to switch to ${allowedApp}:`, error);
    } else {
      console.log(`✅ Successfully switched to ${allowedApp}`);
    }
  });
}

// IPC handlers
ipcMain.handle('get-app-list', () => {
  return commonApps;
});

ipcMain.handle('set-allowed-app', (event, appName) => {
  allowedApp = appName;
  console.log(`✅ Allowed app set to: ${allowedApp}`);
  return { success: true, allowedApp };
});

ipcMain.handle('get-focus-status', () => {
  return { 
    isActive: isFocusMode, 
    allowedApp: allowedApp 
  };
});

ipcMain.handle('toggle-focus-mode', () => {
  toggleFocusMode();
  return { 
    isActive: isFocusMode, 
    allowedApp: allowedApp 
  };
});

// App event handlers
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (isFocusMode) {
    stopFocusMode();
  }
});
