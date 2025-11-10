// Mock app blocker for web version - simulates blocking without system access
// Real blocking is only available in the Electron desktop app

interface BlockedApp {
  name: string
  process: string
  bundleId?: string
  category: 'social' | 'entertainment' | 'productivity' | 'other'
}

interface BlockingStatus {
  isBlocking: boolean
  blockedApps: string[]
  blockedWebsites: string[]
  startTime: Date | null
  endTime: Date | null
}

class AppBlockerMock {
  private blockedApps: BlockedApp[] = []
  private blockedWebsites: string[] = [
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
  
  private isBlocking: boolean = false
  private blockedProcesses: Set<string> = new Set()

  constructor() {
    this.loadDefaultApps()
  }

  private loadDefaultApps() {
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

  // Mock blocking - shows warning instead of actual blocking
  async startBlocking(): Promise<boolean> {
    try {
      console.log('🔒 [MOCK] Starting app blocking...')
      
      // Simulate blocking process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.isBlocking = true
      console.log('✅ [MOCK] App blocking simulation started')
      
      // Show warning to user
      this.showWebAppWarning()
      
      return true
      
    } catch (error) {
      console.error('❌ [MOCK] Failed to start app blocking simulation:', error)
      return false
    }
  }

  // Mock unblocking
  async stopBlocking(): Promise<boolean> {
    try {
      console.log('🔓 [MOCK] Stopping app blocking...')
      
      // Simulate unblocking process
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.isBlocking = false
      this.blockedProcesses.clear()
      
      console.log('✅ [MOCK] App blocking simulation stopped')
      return true
      
    } catch (error) {
      console.error('❌ [MOCK] Failed to stop app blocking simulation:', error)
      return false
    }
  }

  // Show warning about web app limitations
  private showWebAppWarning() {
    const warningMessage = `
🌐 Web App Limitation Notice

This is the web version of Focus Lock. For full system-level blocking, please use the desktop app:

📱 Desktop App Features:
• Actually blocks distracting applications
• Blocks websites at system level
• Hides dock icons
• Prevents bypassing

🚀 To get the full experience:
1. Build the desktop app: npm run build-desktop-mac
2. Run: npm run start-desktop
3. Experience true distraction blocking!

For now, this web version provides:
• Focus timer with visual lock screen
• Task tracking and session management
• Preparation for real blocking with desktop app
    `
    
    console.warn(warningMessage)
    
    // Show in browser console for developers
    if (typeof window !== 'undefined') {
      console.group('🔒 Focus Lock - Web Version')
      console.log('This is a simulation. Real blocking requires the desktop app.')
      console.log('Visit /electron-app directory for full system-level blocking.')
      console.groupEnd()
    }
  }

  // Mock monitoring
  async monitorApps(): Promise<void> {
    if (typeof window !== 'undefined') {
      console.log('🔍 [MOCK] Monitoring apps (simulation only)')
      
      setInterval(() => {
        if (this.isBlocking) {
          console.log('🔍 [MOCK] Checking for blocked apps...')
        }
      }, 10000) // Check every 10 seconds in mock mode
    }
  }

  // Get current blocking status
  getStatus(): BlockingStatus {
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
  addBlockedApp(app: BlockedApp): void {
    this.blockedApps.push(app)
  }

  // Remove app from block list
  removeBlockedApp(appName: string): void {
    this.blockedApps = this.blockedApps.filter(app => app.name !== appName)
  }

  // Add custom website to block list
  addBlockedWebsite(website: string): void {
    if (!this.blockedWebsites.includes(website)) {
      this.blockedWebsites.push(website)
    }
  }

  // Remove website from block list
  removeBlockedWebsite(website: string): void {
    this.blockedWebsites = this.blockedWebsites.filter(site => site !== website)
  }
}

// Export singleton instance
export const appBlocker = new AppBlockerMock()

// Export types
export type { BlockedApp, BlockingStatus }
