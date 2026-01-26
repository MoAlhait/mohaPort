const { app, BrowserWindow, ipcMain, dialog, shell, globalShortcut, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const cron = require('node-cron');

// Import advanced features
const AdvancedScheduler = require('./advanced-scheduler');
const FocusAnalytics = require('./analytics-engine');
const FocusModes = require('./focus-modes');
const BreakReminder = require('./break-reminder');
const AmbientFeatures = require('./ambient-features');
const AchievementSystem = require('./achievement-system');
const AppBlocker = require('./app-blocker');
const AppMonitor = require('./app-monitor');

// Initialize electron store for settings
const store = new Store();

let mainWindow;
let tray;
let isBlocking = false;
let blockList = [];
let allowedSites = [];
let currentSession = null;

// Initialize advanced features
let scheduler;
let analytics;
let focusModes;
let breakReminder;
let ambientFeatures;
let achievementSystem;
let appBlocker;
let appMonitor;

// Default blocked websites and apps
const defaultBlockList = [
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'tiktok.com',
  'youtube.com',
  'reddit.com',
  'discord.com',
  'slack.com',
  'netflix.com',
  'hulu.com',
  'amazon.com',
  'ebay.com',
  'pinterest.com',
  'snapchat.com',
  'whatsapp.com',
  'telegram.org'
];

const defaultAllowedSites = [
  'google.com',
  'stackoverflow.com',
  'github.com',
  'wikipedia.org',
  'coursera.org',
  'khanacademy.org',
  'edx.org',
  'scholar.google.com'
];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Initialize advanced features
  initializeAdvancedFeatures();

  // Load the Focus Lock HTML
  const htmlPath = path.join(__dirname, 'focus-lock.html');
  if (fs.existsSync(htmlPath)) {
    mainWindow.loadFile(htmlPath);
  } else {
    // Fallback to web app if HTML file doesn't exist
    mainWindow.loadURL('http://localhost:3000/focus-lock');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create system tray
  createTray();
}

// Initialize advanced features
function initializeAdvancedFeatures() {
  console.log('Initializing advanced features...');
  
  // Initialize all feature modules
  scheduler = new AdvancedScheduler();
  analytics = new FocusAnalytics();
  focusModes = new FocusModes();
  breakReminder = new BreakReminder();
  ambientFeatures = new AmbientFeatures();
  achievementSystem = new AchievementSystem();
  appBlocker = new AppBlocker();
  appMonitor = new AppMonitor();
  
  // Initialize stored schedules
  scheduler.initializeStoredSchedules();
  
  // Initialize custom focus modes
  focusModes.initializeCustomModes();
  
  // Initialize ambient features
  ambientFeatures.initializeAmbientFeatures();
  
  // Load break history
  breakReminder.loadBreakHistory();
  
  console.log('Advanced features initialized successfully');
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets/tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isBlocking ? 'Stop Blocking' : 'Start Focus Session',
      click: () => {
        if (isBlocking) {
          stopBlocking();
        } else {
          startBlocking();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Focus Lock - Desktop Productivity App');
  
  tray.on('click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

function startBlocking() {
  isBlocking = true;
  blockList = store.get('blockList', defaultBlockList);
  allowedSites = store.get('allowedSites', defaultAllowedSites);
  
  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    if (isBlocking) {
      stopBlocking();
    } else {
      startBlocking();
    }
  });

  // Start blocking websites
  startWebsiteBlocking();
  
  // Start blocking applications
  startAppBlocking();
  
  // Update UI
  if (mainWindow) {
    mainWindow.webContents.send('blocking-started', {
      blockList,
      allowedSites,
      timestamp: new Date().toISOString()
    });
  }
  
  // Update tray
  updateTrayMenu();
  
  console.log('Focus blocking started');
}

function stopBlocking() {
  isBlocking = false;
  
  // Unregister global shortcuts
  globalShortcut.unregisterAll();
  
  // Stop blocking
  stopWebsiteBlocking();
  stopAppBlocking();
  
  // Update UI
  if (mainWindow) {
    mainWindow.webContents.send('blocking-stopped', {
      timestamp: new Date().toISOString()
    });
  }
  
  // Update tray
  updateTrayMenu();
  
  console.log('Focus blocking stopped');
}

function startWebsiteBlocking() {
  // Block websites by intercepting navigation
  if (mainWindow) {
    mainWindow.webContents.session.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, callback) => {
      const url = new URL(details.url);
      const hostname = url.hostname.toLowerCase();
      
      // Check if site is blocked
      const isBlocked = blockList.some(blockedSite => {
        return hostname.includes(blockedSite.toLowerCase()) || 
               blockedSite.toLowerCase().includes(hostname);
      });
      
      // Check if site is allowed (whitelist takes priority)
      const isAllowed = allowedSites.some(allowedSite => {
        return hostname.includes(allowedSite.toLowerCase()) || 
               allowedSite.toLowerCase().includes(hostname);
      });
      
      if (isBlocked && !isAllowed) {
        // Redirect to blocking page
        callback({ redirectURL: `data:text/html,${getBlockingPageHTML(hostname)}` });
      } else {
        callback({});
      }
    });
  }
}

function stopWebsiteBlocking() {
  if (mainWindow) {
    mainWindow.webContents.session.webRequest.onBeforeRequest(null, () => {});
  }
}

function startAppBlocking() {
  // This is a simplified version - in a real implementation, you'd need platform-specific code
  // For macOS, you might use AppleScript or System Events
  // For Windows, you might use PowerShell or WMI
  
  console.log('App blocking started (simplified implementation)');
}

function stopAppBlocking() {
  console.log('App blocking stopped');
}

function getBlockingPageHTML(blockedSite) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Site Blocked - Focus Lock</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: white;
        }
        .container {
          text-align: center;
          max-width: 600px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 32px;
          margin-bottom: 16px;
        }
        p {
          font-size: 18px;
          margin-bottom: 30px;
          opacity: 0.9;
        }
        .emergency-btn {
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin: 0 10px;
        }
        .emergency-btn:hover {
          background: #ff5252;
        }
        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin: 0 10px;
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🚫</div>
        <h1>Site Blocked</h1>
        <p><strong>${blockedSite}</strong> is blocked during your focus session.</p>
        <p>Stay focused on your studies! You can access this site when your session ends.</p>
        <button class="emergency-btn" onclick="requestEmergencyAccess()">Emergency Access</button>
        <button class="back-btn" onclick="goBack()">Go Back</button>
      </div>
      <script>
        function requestEmergencyAccess() {
          if (confirm('Are you sure you need emergency access? This will end your focus session.')) {
            // Send message to main process to stop blocking
            window.electronAPI?.stopBlocking();
          }
        }
        
        function goBack() {
          window.history.back();
        }
        
        // Auto-refresh every 30 seconds to check if blocking is still active
        setTimeout(() => {
          location.reload();
        }, 30000);
      </script>
    </body>
    </html>
  `;
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isBlocking ? 'Stop Blocking' : 'Start Focus Session',
      click: () => {
        if (isBlocking) {
          stopBlocking();
        } else {
          startBlocking();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
}

// IPC handlers
ipcMain.handle('start-blocking', async () => {
  try {
    if (appBlocker) {
      const success = await appBlocker.startBlocking();
      if (success) {
        isBlocking = true;
        // Start monitoring for blocked apps
        appBlocker.monitorApps();
      }
      return { success };
    } else {
      startBlocking(); // Fallback to old method
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to start blocking:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-blocking', async () => {
  try {
    if (appBlocker) {
      const success = await appBlocker.stopBlocking();
      if (success) {
        isBlocking = false;
      }
      return { success };
    } else {
      stopBlocking(); // Fallback to old method
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to stop blocking:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-blocking-status', () => {
  return {
    isBlocking,
    blockList,
    allowedSites,
    currentSession
  };
});

ipcMain.handle('update-block-list', (event, newBlockList) => {
  blockList = newBlockList;
  store.set('blockList', blockList);
  return { success: true };
});

// Focus Lock specific IPC handlers
ipcMain.handle('focus-lock-start', async (event, sessionData) => {
  try {
    if (appBlocker && appMonitor) {
      // Add blocked apps based on session data
      if (sessionData.blockedApps) {
        sessionData.blockedApps.forEach(app => {
          appBlocker.addBlockedApp(app);
        });
      }

      // Start app monitoring with the allowed app
      if (sessionData.allowedApp) {
        appMonitor.setAllowedApp(sessionData.allowedApp);
        appMonitor.startMonitoring(sessionData.allowedApp);
      }

      const success = await appBlocker.startBlocking();
      if (success) {
        isBlocking = true;
        currentSession = sessionData;
        appBlocker.monitorApps();
      }
      return { success, sessionId: Date.now().toString() };
    }
    return { success: false, error: 'App blocker or monitor not initialized' };
  } catch (error) {
    console.error('Failed to start focus lock session:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('focus-lock-stop', async () => {
  try {
    if (appBlocker && appMonitor) {
      // Stop app monitoring
      appMonitor.stopMonitoring();
      await appMonitor.restoreBlockedApps();
      
      const success = await appBlocker.stopBlocking();
      if (success) {
        isBlocking = false;
        currentSession = null;
      }
      return { success };
    }
    return { success: false, error: 'App blocker or monitor not initialized' };
  } catch (error) {
    console.error('Failed to stop focus lock session:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('focus-lock-status', () => {
  if (appBlocker && appMonitor) {
    const status = appBlocker.getStatus();
    const monitorStatus = appMonitor.getStatus();
    return {
      ...status,
      ...monitorStatus,
      currentSession,
      isBlocking
    };
  }
  return { isBlocking: false, currentSession: null };
});

// App monitoring IPC handlers
ipcMain.handle('get-running-apps', async () => {
  try {
    if (appMonitor) {
      const apps = await appMonitor.getRunningApplications();
      return { success: true, apps };
    }
    return { success: false, error: 'App monitor not initialized' };
  } catch (error) {
    console.error('Error getting running apps:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-popular-apps', () => {
  try {
    if (appMonitor) {
      const apps = appMonitor.getPopularApps();
      return { success: true, apps };
    }
    return { success: false, error: 'App monitor not initialized' };
  } catch (error) {
    console.error('Error getting popular apps:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-app-running', async (event, appName) => {
  try {
    if (appMonitor) {
      const isRunning = await appMonitor.isAppRunning(appName);
      return { success: true, isRunning };
    }
    return { success: false, error: 'App monitor not initialized' };
  } catch (error) {
    console.error('Error checking app status:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('launch-app', async (event, appName) => {
  try {
    if (appMonitor) {
      const success = await appMonitor.launchApp(appName);
      return { success, appName };
    }
    return { success: false, error: 'App monitor not initialized' };
  } catch (error) {
    console.error('Error launching app:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-allowed-sites', (event, newAllowedSites) => {
  allowedSites = newAllowedSites;
  store.set('allowedSites', allowedSites);
  return { success: true };
});

ipcMain.handle('get-settings', () => {
  return {
    blockList: store.get('blockList', defaultBlockList),
    allowedSites: store.get('allowedSites', defaultAllowedSites),
    autoStart: store.get('autoStart', false),
    notifications: store.get('notifications', true)
  };
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('blockList', settings.blockList);
  store.set('allowedSites', settings.allowedSites);
  store.set('autoStart', settings.autoStart);
  store.set('notifications', settings.notifications);
  return { success: true };
});

ipcMain.handle('show-emergency-dialog', async () => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: 'Emergency Access',
    message: 'Are you sure you need emergency access?',
    detail: 'This will end your current focus session.',
    buttons: ['Cancel', 'End Session'],
    defaultId: 0,
    cancelId: 0
  });
  
  if (result.response === 1) {
    stopBlocking();
    return { accessGranted: true };
  }
  
  return { accessGranted: false };
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

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Advanced Features IPC Handlers

// Scheduler handlers
ipcMain.handle('create-recurring-session', async (event, scheduleConfig) => {
  return scheduler.createRecurringSession(scheduleConfig);
});

ipcMain.handle('get-all-schedules', async () => {
  return scheduler.getAllSchedules();
});

ipcMain.handle('pause-schedule', async (event, scheduleId) => {
  return scheduler.pauseSchedule(scheduleId);
});

ipcMain.handle('resume-schedule', async (event, scheduleId) => {
  return scheduler.resumeSchedule(scheduleId);
});

ipcMain.handle('delete-schedule', async (event, scheduleId) => {
  return scheduler.deleteSchedule(scheduleId);
});

ipcMain.handle('get-todays-sessions', async () => {
  return scheduler.getTodaysSessions();
});

ipcMain.handle('get-upcoming-sessions', async (event, days) => {
  return scheduler.getUpcomingSessions(days);
});

// Analytics handlers
ipcMain.handle('record-session', async (event, sessionData) => {
  const session = analytics.recordSession(sessionData);
  achievementSystem.updateUserStats(sessionData);
  return session;
});

ipcMain.handle('get-user-stats', async () => {
  return analytics.updateUserStats();
});

ipcMain.handle('get-productivity-insights', async () => {
  return analytics.generateInsights();
});

ipcMain.handle('get-sessions-by-date-range', async (event, startDate, endDate) => {
  return analytics.getSessionsByDateRange(startDate, endDate);
});

ipcMain.handle('export-analytics-data', async () => {
  return analytics.exportData();
});

// Focus modes handlers
ipcMain.handle('get-all-focus-modes', async () => {
  return focusModes.getAllModes();
});

ipcMain.handle('set-current-mode', async (event, modeId) => {
  return focusModes.setCurrentMode(modeId);
});

ipcMain.handle('get-mode-recommendations', async (event, userStats) => {
  return focusModes.getModeRecommendations(userStats);
});

ipcMain.handle('create-custom-mode', async (event, modeConfig) => {
  return focusModes.createCustomMode(modeConfig);
});

ipcMain.handle('get-mode-stats', async () => {
  return focusModes.getModeStats();
});

// Break reminder handlers
ipcMain.handle('update-break-settings', async (event, newSettings) => {
  return breakReminder.updateBreakSettings(newSettings);
});

ipcMain.handle('get-break-stats', async () => {
  return breakReminder.getBreakStats();
});

ipcMain.handle('force-break', async (event, type) => {
  return breakReminder.forceBreak(type);
});

ipcMain.handle('skip-break', async () => {
  return breakReminder.skipBreak();
});

ipcMain.handle('get-break-recommendations', async () => {
  return breakReminder.getBreakRecommendations();
});

// Ambient features handlers
ipcMain.handle('play-ambient-sound', async (event, soundId) => {
  return ambientFeatures.playSound(soundId);
});

ipcMain.handle('stop-ambient-sound', async () => {
  return ambientFeatures.stopSound();
});

ipcMain.handle('adjust-sound-volume', async (event, volume) => {
  return ambientFeatures.adjustVolume(volume);
});

ipcMain.handle('apply-lighting-theme', async (event, themeId) => {
  return ambientFeatures.applyLightingTheme(themeId);
});

ipcMain.handle('enable-ambient-effect', async (event, effectId) => {
  return ambientFeatures.enableEffect(effectId);
});

ipcMain.handle('update-ambient-settings', async (event, newSettings) => {
  return ambientFeatures.updateAmbientSettings(newSettings);
});

ipcMain.handle('get-ambient-status', async () => {
  return ambientFeatures.getAmbientStatus();
});

// Achievement system handlers
ipcMain.handle('get-achievement-stats', async () => {
  return achievementSystem.getAchievementStats();
});

ipcMain.handle('get-unlocked-achievements', async () => {
  return achievementSystem.getUnlockedAchievements();
});

ipcMain.handle('get-user-level', async () => {
  return achievementSystem.getUserLevel();
});

ipcMain.handle('get-progress-to-next-level', async () => {
  return achievementSystem.getProgressToNextLevel();
});

ipcMain.handle('get-achievements-by-category', async (event, category) => {
  return achievementSystem.getAchievementsByCategory(category);
});

// Event listeners for break reminders
ipcMain.on('break-reminder', (event, breakData) => {
  // Handle break reminder in renderer
});

ipcMain.on('break-completed', (event, breakData) => {
  achievementSystem.updateBreakStats(breakData);
});

ipcMain.on('break-skipped', (event, breakData) => {
  // Handle break skipped
});

// Event listeners for scheduled sessions
ipcMain.on('scheduled-session-start', (event, sessionData) => {
  // Handle scheduled session start
  startBlocking(sessionData.duration);
});

// Event listeners for achievements
ipcMain.on('achievement-unlocked', (event, achievementData) => {
  // Handle achievement unlocked notification
});

// Event listeners for analytics
ipcMain.on('session-completed', (event, sessionData) => {
  analytics.recordSession(sessionData);
  achievementSystem.updateUserStats(sessionData);
});

// Prevent app from being closed during blocking
app.on('before-quit', (event) => {
  if (isBlocking) {
    event.preventDefault();
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'Focus Session Active',
      message: 'You have an active focus session.',
      detail: 'Are you sure you want to quit? This will end your focus session.',
      buttons: ['Cancel', 'Quit'],
      defaultId: 0,
      cancelId: 0
    }).then((result) => {
      if (result.response === 1) {
        stopBlocking();
        app.quit();
      }
    });
  }
});
