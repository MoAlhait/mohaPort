const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Blocking controls
  startBlocking: () => ipcRenderer.invoke('start-blocking'),
  stopBlocking: () => ipcRenderer.invoke('stop-blocking'),
  getBlockingStatus: () => ipcRenderer.invoke('get-blocking-status'),
  
      // Focus Lock specific methods
      startFocusLock: (sessionData) => ipcRenderer.invoke('focus-lock-start', sessionData),
      stopFocusLock: () => ipcRenderer.invoke('focus-lock-stop'),
      getFocusLockStatus: () => ipcRenderer.invoke('focus-lock-status'),

      // App monitoring methods
      getRunningApps: () => ipcRenderer.invoke('get-running-apps'),
      getPopularApps: () => ipcRenderer.invoke('get-popular-apps'),
      checkAppRunning: (appName) => ipcRenderer.invoke('check-app-running', appName),
      launchApp: (appName) => ipcRenderer.invoke('launch-app', appName),
  
  // Settings management
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  
  // Block list management
  updateBlockList: (blockList) => ipcRenderer.invoke('update-block-list', blockList),
  updateAllowedSites: (allowedSites) => ipcRenderer.invoke('update-allowed-sites', allowedSites),
  
  // Emergency access
  showEmergencyDialog: () => ipcRenderer.invoke('show-emergency-dialog'),
  
  // Event listeners
  onBlockingStarted: (callback) => ipcRenderer.on('blocking-started', callback),
  onBlockingStopped: (callback) => ipcRenderer.on('blocking-stopped', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // App info
  appVersion: process.env.npm_package_version || '1.0.0',

  // Advanced Features API
  
  // Scheduler API
  createRecurringSession: (scheduleConfig) => ipcRenderer.invoke('create-recurring-session', scheduleConfig),
  getAllSchedules: () => ipcRenderer.invoke('get-all-schedules'),
  pauseSchedule: (scheduleId) => ipcRenderer.invoke('pause-schedule', scheduleId),
  resumeSchedule: (scheduleId) => ipcRenderer.invoke('resume-schedule', scheduleId),
  deleteSchedule: (scheduleId) => ipcRenderer.invoke('delete-schedule', scheduleId),
  getTodaysSessions: () => ipcRenderer.invoke('get-todays-sessions'),
  getUpcomingSessions: (days) => ipcRenderer.invoke('get-upcoming-sessions', days),

  // Analytics API
  recordSession: (sessionData) => ipcRenderer.invoke('record-session', sessionData),
  getUserStats: () => ipcRenderer.invoke('get-user-stats'),
  getProductivityInsights: () => ipcRenderer.invoke('get-productivity-insights'),
  getSessionsByDateRange: (startDate, endDate) => ipcRenderer.invoke('get-sessions-by-date-range', startDate, endDate),
  exportAnalyticsData: () => ipcRenderer.invoke('export-analytics-data'),

  // Focus Modes API
  getAllFocusModes: () => ipcRenderer.invoke('get-all-focus-modes'),
  setCurrentMode: (modeId) => ipcRenderer.invoke('set-current-mode', modeId),
  getModeRecommendations: (userStats) => ipcRenderer.invoke('get-mode-recommendations', userStats),
  createCustomMode: (modeConfig) => ipcRenderer.invoke('create-custom-mode', modeConfig),
  getModeStats: () => ipcRenderer.invoke('get-mode-stats'),

  // Break Reminder API
  updateBreakSettings: (newSettings) => ipcRenderer.invoke('update-break-settings', newSettings),
  getBreakStats: () => ipcRenderer.invoke('get-break-stats'),
  forceBreak: (type) => ipcRenderer.invoke('force-break', type),
  skipBreak: () => ipcRenderer.invoke('skip-break'),
  getBreakRecommendations: () => ipcRenderer.invoke('get-break-recommendations'),

  // Ambient Features API
  playAmbientSound: (soundId) => ipcRenderer.invoke('play-ambient-sound', soundId),
  stopAmbientSound: () => ipcRenderer.invoke('stop-ambient-sound'),
  adjustSoundVolume: (volume) => ipcRenderer.invoke('adjust-sound-volume', volume),
  applyLightingTheme: (themeId) => ipcRenderer.invoke('apply-lighting-theme', themeId),
  enableAmbientEffect: (effectId) => ipcRenderer.invoke('enable-ambient-effect', effectId),
  updateAmbientSettings: (newSettings) => ipcRenderer.invoke('update-ambient-settings', newSettings),
  getAmbientStatus: () => ipcRenderer.invoke('get-ambient-status'),

  // Achievement System API
  getAchievementStats: () => ipcRenderer.invoke('get-achievement-stats'),
  getUnlockedAchievements: () => ipcRenderer.invoke('get-unlocked-achievements'),
  getUserLevel: () => ipcRenderer.invoke('get-user-level'),
  getProgressToNextLevel: () => ipcRenderer.invoke('get-progress-to-next-level'),
  getAchievementsByCategory: (category) => ipcRenderer.invoke('get-achievements-by-category', category),

  // Advanced Event Listeners
  onBreakReminder: (callback) => ipcRenderer.on('break-reminder', callback),
  onBreakCompleted: (callback) => ipcRenderer.on('break-completed', callback),
  onBreakSkipped: (callback) => ipcRenderer.on('break-skipped', callback),
  onScheduledSessionStart: (callback) => ipcRenderer.on('scheduled-session-start', callback),
  onAchievementUnlocked: (callback) => ipcRenderer.on('achievement-unlocked', callback),
  onSessionCompleted: (callback) => ipcRenderer.on('session-completed', callback),
  onEyeStrainReminder: (callback) => ipcRenderer.on('eye-strain-reminder', callback),
  onLookAwayReminder: (callback) => ipcRenderer.on('look-away-reminder', callback)
});
