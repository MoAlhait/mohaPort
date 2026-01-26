const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = util.promisify(exec);

class AppMonitor {
  constructor() {
    this.runningApps = new Set();
    this.allowedApp = null;
    this.blockedApps = new Set();
    this.monitoringInterval = null;
    this.isMonitoring = false;
  }

  /**
   * Get all currently running applications on macOS
   * Uses multiple proven methods for maximum reliability
   */
  async getRunningApplications() {
    console.log('🔍 Starting comprehensive app detection...');
    let apps = [];

    // Method 1: AppleScript - Most reliable for GUI apps
    try {
      console.log('📱 Trying AppleScript method (most reliable)...');
      const script = `
        tell application "System Events"
          set appList to {}
          set runningApps to (name of every application process whose background only is false)
          repeat with appName in runningApps
            set end of appList to appName as string
          end repeat
          return appList
        end tell
      `;
      
      const { stdout } = await execAsync(`osascript -e '${script}'`, { timeout: 8000 });
      
      if (stdout && stdout.trim()) {
        apps = stdout
          .replace(/,/g, '\n')
          .split('\n')
          .map(app => app.trim())
          .filter(app => app && app.length > 0 && !this.isSystemApp(app));
        
        console.log(`✅ AppleScript found ${apps.length} apps:`, apps.slice(0, 8));
      }
    } catch (appleScriptError) {
      console.log('❌ AppleScript failed:', appleScriptError.message);
    }

    // Method 2: ps command with better filtering for GUI apps
    if (apps.length < 5) {
      try {
        console.log('🔍 Trying ps command with GUI filtering...');
        const { stdout } = await execAsync(`
          ps -ax -o pid,comm,args | grep -E '\\.app/Contents/MacOS/' | grep -v grep | awk '{print $3}' | sed 's|.*/\\([^/]*\\)\\.app/.*|\\1|' | sort -u
        `, { timeout: 6000 });
        
        const psApps = stdout
          .split('\n')
          .map(app => app.trim())
          .filter(app => app && !this.isSystemApp(app) && app.length > 2);
        
        apps = [...new Set([...apps, ...psApps])];
        console.log(`✅ PS method added ${psApps.length} apps, total: ${apps.length}`);
      } catch (psError) {
        console.log('❌ PS method failed:', psError.message);
      }
    }

    // Method 3: mdfind to find running applications
    if (apps.length < 5) {
      try {
        console.log('🔍 Trying mdfind for running apps...');
        const { stdout } = await execAsync(`
          mdfind "kMDItemContentType == 'com.apple.application-bundle' AND kMDItemFSInvisible != 1" | head -20 | xargs -I {} sh -c 'basename "{}" .app'
        `, { timeout: 5000 });
        
        const mdfindApps = stdout
          .split('\n')
          .map(app => app.trim())
          .filter(app => app && !this.isSystemApp(app));
        
        apps = [...new Set([...apps, ...mdfindApps])];
        console.log(`✅ mdfind added ${mdfindApps.length} apps, total: ${apps.length}`);
      } catch (mdfindError) {
        console.log('❌ mdfind failed:', mdfindError.message);
      }
    }

    // Method 4: Use lsof to find apps with GUI connections
    if (apps.length < 5) {
      try {
        console.log('🔍 Trying lsof for GUI apps...');
        const { stdout } = await execAsync(`
          lsof -c "Window Server" 2>/dev/null | grep -E '\\.app' | awk '{print $1}' | sort -u | head -15
        `, { timeout: 4000 });
        
        const lsofApps = stdout
          .split('\n')
          .map(app => app.trim())
          .filter(app => app && !this.isSystemApp(app));
        
        apps = [...new Set([...apps, ...lsofApps])];
        console.log(`✅ lsof added ${lsofApps.length} apps, total: ${apps.length}`);
      } catch (lsofError) {
        console.log('❌ lsof failed:', lsofError.message);
      }
    }

    // Method 5: Check /Applications for commonly used apps that might be running
    if (apps.length < 5) {
      try {
        console.log('🔍 Checking common applications...');
        const commonApps = [
          'Safari', 'Chrome', 'Firefox', 'Edge', 'Brave',
          'Messages', 'Mail', 'Calendar', 'Notes', 'Reminders',
          'Spotify', 'Music', 'Podcasts', 'Photos', 'Preview',
          'TextEdit', 'Pages', 'Numbers', 'Keynote',
          'Xcode', 'Visual Studio Code', 'Terminal', 'iTerm2',
          'Slack', 'Discord', 'Zoom', 'Teams', 'WhatsApp',
          'Finder', 'System Preferences', 'Activity Monitor'
        ];
        
        const runningCommonApps = [];
        for (const app of commonApps) {
          if (await this.isAppRunning(app)) {
            runningCommonApps.push(app);
          }
        }
        
        apps = [...new Set([...apps, ...runningCommonApps])];
        console.log(`✅ Common apps check found ${runningCommonApps.length} apps, total: ${apps.length}`);
      } catch (commonError) {
        console.log('❌ Common apps check failed:', commonError.message);
      }
    }

    // Final fallback to popular apps if detection completely fails
    if (apps.length === 0) {
      console.log('⚠️ All detection methods failed, using popular apps fallback...');
      apps = this.getCommonRunningApps();
    }

    // Clean up and deduplicate
    const finalApps = [...new Set(apps)]
      .filter(app => app && !this.isSystemApp(app))
      .sort();
    
    console.log(`🎉 Final result: ${finalApps.length} user-friendly apps detected`);
    console.log('📱 Apps found:', finalApps.slice(0, 10));
    
    return finalApps;
  }

  /**
   * Get a list of commonly running applications as fallback
   */
  getCommonRunningApps() {
    const commonApps = [
      'Safari',
      'Google Chrome',
      'Firefox',
      'Microsoft Edge',
      'Visual Studio Code',
      'Xcode',
      'Terminal',
      'iTerm2',
      'Finder',
      'Mail',
      'Calendar',
      'Messages',
      'Spotify',
      'Slack',
      'Discord',
      'Zoom',
      'Notion',
      'Obsidian'
    ];

    // Filter out system apps
    return commonApps.filter(app => !this.isSystemApp(app));
  }

  /**
   * Check if an app is a system application that shouldn't be blocked
   */
  isSystemApp(appName) {
    const systemApps = [
      'Finder',
      'System Preferences',
      'System Events',
      'Window Server',
      'Dock',
      'MenuMeters',
      'Spotlight',
      'NotificationCenter',
      'SystemUIServer',
      'loginwindow',
      'kernel_task',
      'Focus Lock', // Don't block our own app
      'Helper',
      'Renderer',
      'Agent',
      'daemon',
      'd',
      'com',
      'com.apple',
      'CoreServices',
      'WindowManager',
      'identityservices',
      'BluetoothSettings',
      'Software Update',
      'FindMy',
      'NewsTag',
      'PhotosRelive',
      'Widget',
      'Extension',
      'Background',
      'Service',
      'Framework',
      'Library',
      'Support'
    ];
    
    const lowerAppName = appName.toLowerCase();
    
    // Check if it's a system app
    const isSystem = systemApps.some(systemApp => 
      lowerAppName.includes(systemApp.toLowerCase())
    );
    
    // Also filter out very short names and technical processes
    const isTooShort = appName.length < 3;
    const isTechnical = /^[a-z]+$/.test(appName) || appName.includes('Helper') || appName.includes('Agent');
    
    return isSystem || isTooShort || isTechnical;
  }

  /**
   * Get detailed information about a specific application
   */
  async getAppInfo(appName) {
    try {
      const { stdout } = await execAsync(`
        osascript -e 'tell application "System Events" to get properties of application process "${appName}"'
      `);
      return stdout;
    } catch (error) {
      console.error(`Error getting info for ${appName}:`, error);
      return null;
    }
  }

  /**
   * Force quit an application
   */
  async forceQuitApp(appName) {
    try {
      console.log(`Force quitting application: ${appName}`);
      await execAsync(`killall "${appName}"`);
      return true;
    } catch (error) {
      console.error(`Error force quitting ${appName}:`, error);
      return false;
    }
  }

  /**
   * Hide an application (alternative to force quit)
   */
  async hideApp(appName) {
    try {
      await execAsync(`
        osascript -e 'tell application "${appName}" to set visible to false'
      `);
      return true;
    } catch (error) {
      console.error(`Error hiding ${appName}:`, error);
      return false;
    }
  }

  /**
   * Show an application
   */
  async showApp(appName) {
    try {
      await execAsync(`
        osascript -e 'tell application "${appName}" to set visible to true'
      `);
      return true;
    } catch (error) {
      console.error(`Error showing ${appName}:`, error);
      return false;
    }
  }

  /**
   * Start monitoring running applications
   */
  startMonitoring(allowedAppName) {
    this.allowedApp = allowedAppName;
    this.isMonitoring = true;
    
    console.log(`Starting app monitoring. Allowed app: ${allowedAppName}`);
    
    this.monitoringInterval = setInterval(async () => {
      await this.monitorAndBlock();
    }, 2000); // Check every 2 seconds
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Stopped app monitoring');
  }

  /**
   * Monitor and block unauthorized applications
   */
  async monitorAndBlock() {
    if (!this.isMonitoring) return;

    try {
      const runningApps = await this.getRunningApplications();
      
      for (const app of runningApps) {
        // Skip system apps and the allowed app
        if (this.isSystemApp(app) || app === this.allowedApp) {
          continue;
        }

        // Block the app
        console.log(`Blocking unauthorized app: ${app}`);
        await this.forceQuitApp(app);
        this.blockedApps.add(app);
      }
    } catch (error) {
      console.error('Error during monitoring:', error);
    }
  }

  /**
   * Restore all previously blocked applications
   */
  async restoreBlockedApps() {
    console.log('Restoring blocked applications...');
    
    for (const app of this.blockedApps) {
      try {
        // Try to launch the app
        await execAsync(`open -a "${app}"`);
        console.log(`Restored app: ${app}`);
      } catch (error) {
        console.error(`Error restoring ${app}:`, error);
      }
    }
    
    this.blockedApps.clear();
  }

  /**
   * Get current monitoring status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      allowedApp: this.allowedApp,
      blockedApps: Array.from(this.blockedApps),
      runningApps: Array.from(this.runningApps)
    };
  }

  /**
   * Set the allowed application for focus sessions
   */
  setAllowedApp(appName) {
    this.allowedApp = appName;
    console.log(`Set allowed app to: ${appName}`);
  }

  /**
   * Get a list of popular applications that users might want to focus on
   */
  getPopularApps() {
    return [
      'Safari',
      'Google Chrome',
      'Firefox',
      'Microsoft Edge',
      'Visual Studio Code',
      'Xcode',
      'IntelliJ IDEA',
      'Sublime Text',
      'Atom',
      'Terminal',
      'iTerm2',
      'Notion',
      'Obsidian',
      'Bear',
      'Typora',
      'Microsoft Word',
      'Pages',
      'Keynote',
      'PowerPoint',
      'Numbers',
      'Excel',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Figma',
      'Sketch',
      'Spotify',
      'Apple Music',
      'Slack',
      'Discord',
      'Zoom',
      'Microsoft Teams',
      'Calendar',
      'Mail',
      'Messages',
      'WhatsApp',
      'Telegram'
    ];
  }

  /**
   * Check if a specific application is currently running
   * Uses multiple methods for reliability
   */
  async isAppRunning(appName) {
    try {
      // Method 1: pgrep - most reliable for process detection
      try {
        const { stdout } = await execAsync(`pgrep -f "${appName}"`, { timeout: 2000 });
        if (stdout.trim().length > 0) {
          return true;
        }
      } catch (pgrepError) {
        // Continue to next method
      }

      // Method 2: ps command
      try {
        const { stdout } = await execAsync(`ps -ax | grep -i "${appName}" | grep -v grep`, { timeout: 2000 });
        if (stdout.trim().length > 0) {
          return true;
        }
      } catch (psError) {
        // Continue to next method
      }

      // Method 3: AppleScript check
      try {
        const script = `tell application "System Events" to return (name of application processes) contains "${appName}"`;
        const { stdout } = await execAsync(`osascript -e '${script}'`, { timeout: 3000 });
        return stdout.trim().toLowerCase() === 'true';
      } catch (appleScriptError) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Launch a specific application
   */
  async launchApp(appName) {
    try {
      await execAsync(`open -a "${appName}"`);
      return true;
    } catch (error) {
      console.error(`Error launching ${appName}:`, error);
      return false;
    }
  }
}

module.exports = AppMonitor;
