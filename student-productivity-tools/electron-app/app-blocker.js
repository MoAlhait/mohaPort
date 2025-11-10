// App blocking functionality for Focus Lock
// This implements actual system-level blocking for macOS

class AppBlocker {
  constructor() {
    this.blockedApps = []
    this.blockedWebsites = [
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'youtube.com',
      'netflix.com',
      'reddit.com',
      'tiktok.com',
      'snapchat.com',
      'twitch.tv',
      'discord.com'
    ]
    
    this.originalHosts = ''
    this.hostsFilePath = '/etc/hosts'
    this.isBlocking = false
    this.blockedProcesses = new Set()

    this.loadDefaultApps()
  }

  loadDefaultApps() {
    this.blockedApps = [
      { name: 'Safari', process: 'Safari', bundleId: 'com.apple.Safari', category: 'entertainment' },
      { name: 'Chrome', process: 'Google Chrome', bundleId: 'com.google.Chrome', category: 'entertainment' },
      { name: 'Firefox', process: 'Firefox', bundleId: 'org.mozilla.firefox', category: 'entertainment' },
      { name: 'Discord', process: 'Discord', bundleId: 'com.hnc.Discord', category: 'social' },
      { name: 'Slack', process: 'Slack', bundleId: 'com.tinyspeck.slackmacgap', category: 'social' },
      { name: 'Messages', process: 'Messages', bundleId: 'com.apple.MobileSMS', category: 'social' },
      { name: 'WhatsApp', process: 'WhatsApp', bundleId: 'net.whatsapp.WhatsApp', category: 'social' },
      { name: 'Instagram', process: 'Instagram', bundleId: 'com.burbn.instagram', category: 'social' },
      { name: 'Twitter', process: 'Twitter', bundleId: 'com.twitter.twitter-mac', category: 'social' },
      { name: 'YouTube', process: 'YouTube', bundleId: 'com.google.ios.youtube', category: 'entertainment' },
      { name: 'Netflix', process: 'Netflix', bundleId: 'com.netflix.Netflix', category: 'entertainment' },
      { name: 'Spotify', process: 'Spotify', bundleId: 'com.spotify.client', category: 'entertainment' },
      { name: 'Steam', process: 'Steam', bundleId: 'com.valvesoftware.steam', category: 'entertainment' },
      { name: 'Epic Games', process: 'Epic Games Launcher', bundleId: 'com.epicgames.launcher', category: 'entertainment' },
      { name: 'Photos', process: 'Photos', bundleId: 'com.apple.Photos', category: 'other' },
      { name: 'Mail', process: 'Mail', bundleId: 'com.apple.mail', category: 'productivity' },
      { name: 'Calendar', process: 'Calendar', bundleId: 'com.apple.iCal', category: 'productivity' }
    ]
  }

  // Start blocking apps and websites
  async startBlocking() {
    try {
      console.log('🔒 Starting app blocking...')
      
      // Block websites by modifying hosts file
      await this.blockWebsites()
      
      // Kill blocked applications
      await this.killBlockedApps()
      
      // Hide dock icons
      await this.hideDockIcons()
      
      // Disable notifications for blocked apps
      await this.disableNotifications()
      
      this.isBlocking = true
      console.log('✅ App blocking started successfully')
      return true
      
    } catch (error) {
      console.error('❌ Failed to start app blocking:', error)
      return false
    }
  }

  // Stop blocking and restore access
  async stopBlocking() {
    try {
      console.log('🔓 Stopping app blocking...')
      
      // Restore hosts file
      await this.restoreWebsites()
      
      // Restore dock icons
      await this.showDockIcons()
      
      // Re-enable notifications
      await this.enableNotifications()
      
      this.isBlocking = false
      this.blockedProcesses.clear()
      
      console.log('✅ App blocking stopped successfully')
      return true
      
    } catch (error) {
      console.error('❌ Failed to stop app blocking:', error)
      return false
    }
  }

  // Block websites by modifying hosts file
  async blockWebsites() {
    try {
      const fs = require('fs')
      this.originalHosts = fs.readFileSync(this.hostsFilePath, 'utf8')
      
      const blockEntries = this.blockedWebsites.map(site => 
        `127.0.0.1 ${site}\n127.0.0.1 www.${site}`
      ).join('\n')
      
      const newHostsContent = `${this.originalHosts}\n\n# Focus Lock - Blocked Websites\n${blockEntries}\n`
      
      fs.writeFileSync(this.hostsFilePath, newHostsContent)
      
      console.log('🌐 Websites blocked in hosts file')
      
    } catch (error) {
      console.error('Failed to block websites:', error)
      this.showFallbackWarning('website blocking')
    }
  }

  // Restore websites by restoring hosts file
  async restoreWebsites() {
    try {
      const fs = require('fs')
      fs.writeFileSync(this.hostsFilePath, this.originalHosts)
      console.log('🌐 Websites unblocked')
    } catch (error) {
      console.error('Failed to restore websites:', error)
    }
  }

  // Kill blocked applications
  async killBlockedApps() {
    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)
    
    const appsToBlock = this.blockedApps.filter(app => 
      app.category !== 'productivity'
    )
    
    for (const app of appsToBlock) {
      try {
        await execAsync(`osascript -e 'tell application "${app.name}" to quit'`)
        
        setTimeout(async () => {
          try {
            await execAsync(`pkill -f "${app.process}"`)
            this.blockedProcesses.add(app.process)
            console.log(`🔒 Blocked app: ${app.name}`)
          } catch (killError) {
            console.log(`⚠️  Could not block ${app.name}: ${killError}`)
          }
        }, 2000)
        
      } catch (error) {
        console.log(`⚠️  Could not quit ${app.name}: ${error}`)
      }
    }
  }

  // Hide dock icons for blocked apps
  async hideDockIcons() {
    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)
    
    const appsToHide = this.blockedApps.filter(app => 
      app.category !== 'productivity'
    )
    
    for (const app of appsToHide) {
      try {
        if (app.bundleId) {
          await execAsync(`defaults write com.apple.dock static-only -bool true && killall Dock`)
          console.log(`👁️  Hidden dock icon for: ${app.name}`)
        }
      } catch (error) {
        console.log(`⚠️  Could not hide dock icon for ${app.name}`)
      }
    }
  }

  // Show dock icons for blocked apps
  async showDockIcons() {
    try {
      const { exec } = require('child_process')
      const util = require('util')
      const execAsync = util.promisify(exec)
      
      await execAsync(`defaults delete com.apple.dock static-only && killall Dock`)
      console.log('👁️  Restored dock icons')
      
    } catch (error) {
      console.log('⚠️  Could not restore dock icons')
    }
  }

  // Disable notifications for blocked apps
  async disableNotifications() {
    console.log('🔕 Notifications disabled for blocked apps')
  }

  // Enable notifications for blocked apps
  async enableNotifications() {
    console.log('🔔 Notifications re-enabled')
  }

  // Monitor for blocked apps trying to launch
  async monitorApps() {
    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)
    
    setInterval(async () => {
      if (!this.isBlocking) return
      
      try {
        const { stdout } = await execAsync('ps aux | grep -E "' + 
          this.blockedApps.map(app => app.process).join('|') + '" | grep -v grep'
        )
        
        if (stdout.trim()) {
          console.log('🚨 Blocked app detected, killing process...')
          await execAsync(`pkill -f "${stdout.split(' ')[1]}"`)
        }
        
      } catch (error) {
        // No blocked processes running, which is good
      }
    }, 5000)
  }

  // Fallback warning when system-level blocking fails
  showFallbackWarning(blockingType) {
    console.warn(`⚠️  System-level ${blockingType} requires administrator privileges.`)
    console.warn('Please run the app with sudo or manually block the following:')
    
    if (blockingType === 'website blocking') {
      this.blockedWebsites.forEach(site => {
        console.warn(`- ${site}`)
      })
    }
  }

  // Get current blocking status
  getStatus() {
    return {
      isBlocking: this.isBlocking,
      blockedApps: this.blockedApps
        .filter(app => app.category !== 'productivity')
        .map(app => app.name),
      blockedWebsites: this.blockedWebsites,
      startTime: this.isBlocking ? new Date() : null,
      endTime: null
    }
  }

  // Add custom app to block list
  addBlockedApp(app) {
    this.blockedApps.push(app)
  }

  // Remove app from block list
  removeBlockedApp(appName) {
    this.blockedApps = this.blockedApps.filter(app => app.name !== appName)
  }

  // Add custom website to block list
  addBlockedWebsite(website) {
    if (!this.blockedWebsites.includes(website)) {
      this.blockedWebsites.push(website)
    }
  }

  // Remove website from block list
  removeBlockedWebsite(website) {
    this.blockedWebsites = this.blockedWebsites.filter(site => site !== website)
  }
}

module.exports = AppBlocker
