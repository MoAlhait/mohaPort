const Store = require('electron-store');

class BreakReminder {
  constructor() {
    this.store = new Store();
    this.breakTimer = null;
    this.eyeStrainTimer = null;
    this.isBreakActive = false;
    this.breakSettings = this.loadBreakSettings();
    this.breakHistory = [];
    this.eyeStrainData = {
      blinkRate: 0,
      screenTime: 0,
      lastBlinkTime: Date.now(),
      strainLevel: 0
    };
  }

  // Load break settings from storage
  loadBreakSettings() {
    return this.store.get('breakSettings', {
      enabled: true,
      microBreaks: {
        enabled: true,
        interval: 20, // minutes
        duration: 20 // seconds
      },
      shortBreaks: {
        enabled: true,
        interval: 60, // minutes
        duration: 5 // minutes
      },
      longBreaks: {
        enabled: true,
        interval: 120, // minutes
        duration: 15 // minutes
      },
      eyeStrain: {
        enabled: true,
        blinkReminder: true,
        lookAwayReminder: true,
        screenBrightness: 'adaptive',
        blueLightFilter: true
      },
      physical: {
        stretchReminder: true,
        postureReminder: true,
        hydrationReminder: true,
        movementReminder: true
      },
      notifications: {
        sound: true,
        visual: true,
        systemNotification: true,
        breakScreen: true
      }
    });
  }

  // Start break reminder system
  startBreakReminders() {
    if (!this.breakSettings.enabled) return;

    this.stopBreakReminders(); // Stop any existing timers

    // Start micro-break timer (20-20 rule)
    if (this.breakSettings.microBreaks.enabled) {
      this.breakTimer = setInterval(() => {
        this.triggerMicroBreak();
      }, this.breakSettings.microBreaks.interval * 60 * 1000);
    }

    // Start eye strain monitoring
    if (this.breakSettings.eyeStrain.enabled) {
      this.startEyeStrainMonitoring();
    }

    console.log('Break reminder system started');
  }

  // Stop break reminder system
  stopBreakReminders() {
    if (this.breakTimer) {
      clearInterval(this.breakTimer);
      this.breakTimer = null;
    }

    if (this.eyeStrainTimer) {
      clearInterval(this.eyeStrainTimer);
      this.eyeStrainTimer = null;
    }

    console.log('Break reminder system stopped');
  }

  // Trigger micro-break (20-20-20 rule)
  triggerMicroBreak() {
    if (this.isBreakActive) return;

    const breakData = {
      type: 'micro',
      duration: this.breakSettings.microBreaks.duration,
      timestamp: new Date().toISOString(),
      completed: false
    };

    this.breakHistory.push(breakData);
    this.isBreakActive = true;

    // Show break reminder
    this.showBreakReminder(breakData);

    // Auto-complete after duration
    setTimeout(() => {
      this.completeBreak(breakData);
    }, this.breakSettings.microBreaks.duration * 1000);
  }

  // Trigger short break
  triggerShortBreak() {
    if (this.isBreakActive) return;

    const breakData = {
      type: 'short',
      duration: this.breakSettings.shortBreaks.duration,
      timestamp: new Date().toISOString(),
      completed: false
    };

    this.breakHistory.push(breakData);
    this.isBreakActive = true;

    this.showBreakReminder(breakData);

    setTimeout(() => {
      this.completeBreak(breakData);
    }, this.breakSettings.shortBreaks.duration * 60 * 1000);
  }

  // Trigger long break
  triggerLongBreak() {
    if (this.isBreakActive) return;

    const breakData = {
      type: 'long',
      duration: this.breakSettings.longBreaks.duration,
      timestamp: new Date().toISOString(),
      completed: false
    };

    this.breakHistory.push(breakData);
    this.isBreakActive = true;

    this.showBreakReminder(breakData);

    setTimeout(() => {
      this.completeBreak(breakData);
    }, this.breakSettings.longBreaks.duration * 60 * 1000);
  }

  // Show break reminder
  showBreakReminder(breakData) {
    const breakType = breakData.type;
    const duration = breakData.duration;
    
    let message = '';
    let activities = [];

    switch (breakType) {
      case 'micro':
        message = `Time for a ${duration}-second micro-break!`;
        activities = [
          'Look at something 20 feet away for 20 seconds',
          'Blink your eyes slowly 10 times',
          'Roll your shoulders gently',
          'Take 5 deep breaths'
        ];
        break;
      
      case 'short':
        message = `Time for a ${duration}-minute break!`;
        activities = [
          'Stand up and stretch',
          'Walk around for a few minutes',
          'Drink some water',
          'Look away from your screen',
          'Do some light stretching'
        ];
        break;
      
      case 'long':
        message = `Time for a ${duration}-minute long break!`;
        activities = [
          'Take a short walk outside',
          'Have a healthy snack',
          'Do some light exercise',
          'Meditate or relax',
          'Step away from all screens'
        ];
        break;
    }

    // Send notification to main window
    if (global.mainWindow) {
      global.mainWindow.webContents.send('break-reminder', {
        type: breakType,
        message,
        activities,
        duration,
        timestamp: breakData.timestamp
      });
    }

    // Show system notification
    if (this.breakSettings.notifications.systemNotification && global.mainWindow) {
      global.mainWindow.webContents.send('show-notification', {
        title: 'Break Reminder',
        body: message,
        icon: 'break-icon.png'
      });
    }

    // Play sound notification
    if (this.breakSettings.notifications.sound) {
      this.playBreakSound(breakType);
    }
  }

  // Complete a break
  completeBreak(breakData) {
    breakData.completed = true;
    breakData.completedAt = new Date().toISOString();
    this.isBreakActive = false;

    // Send completion notification
    if (global.mainWindow) {
      global.mainWindow.webContents.send('break-completed', {
        type: breakData.type,
        duration: breakData.duration,
        timestamp: breakData.completedAt
      });
    }

    // Save break history
    this.saveBreakHistory();
  }

  // Start eye strain monitoring
  startEyeStrainMonitoring() {
    this.eyeStrainTimer = setInterval(() => {
      this.monitorEyeStrain();
    }, 10000); // Check every 10 seconds

    // Initialize eye strain data
    this.eyeStrainData = {
      blinkRate: 0,
      screenTime: 0,
      lastBlinkTime: Date.now(),
      strainLevel: 0,
      lookAwayCount: 0
    };
  }

  // Monitor eye strain indicators
  monitorEyeStrain() {
    const now = Date.now();
    const timeSinceLastBlink = now - this.eyeStrainData.lastBlinkTime;
    
    // Estimate blink rate (normal: 15-20 blinks per minute)
    this.eyeStrainData.blinkRate = this.calculateBlinkRate();
    
    // Calculate strain level
    this.eyeStrainData.strainLevel = this.calculateStrainLevel();
    
    // Trigger eye strain reminders
    if (this.eyeStrainData.strainLevel > 0.7) {
      this.triggerEyeStrainReminder();
    }

    // Look-away reminder (every 20 minutes)
    if (this.eyeStrainSettings.lookAwayReminder && timeSinceLastBlink > 20 * 60 * 1000) {
      this.triggerLookAwayReminder();
    }
  }

  // Calculate blink rate
  calculateBlinkRate() {
    // This would integrate with webcam or eye tracking
    // For now, using a simulated calculation
    const recentBreaks = this.breakHistory.filter(b => 
      new Date(b.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );
    
    // Simulate blink rate based on break frequency
    const baseRate = 18; // Normal blink rate
    const breakBonus = recentBreaks.length * 2; // More breaks = better eye health
    
    return Math.min(baseRate + breakBonus, 25);
  }

  // Calculate eye strain level
  calculateStrainLevel() {
    const blinkRate = this.eyeStrainData.blinkRate;
    const screenTime = this.eyeStrainData.screenTime;
    
    // Normalize blink rate (15-20 is normal)
    const blinkScore = Math.max(0, Math.min(1, (blinkRate - 10) / 15));
    
    // Screen time factor (more time = more strain)
    const screenScore = Math.min(screenTime / (8 * 60 * 60 * 1000), 1); // 8 hours max
    
    // Calculate overall strain level
    return (1 - blinkScore) * 0.6 + screenScore * 0.4;
  }

  // Trigger eye strain reminder
  triggerEyeStrainReminder() {
    if (global.mainWindow) {
      global.mainWindow.webContents.send('eye-strain-reminder', {
        strainLevel: this.eyeStrainData.strainLevel,
        suggestions: [
          'Look at something 20 feet away for 20 seconds',
          'Blink your eyes slowly and deliberately',
          'Close your eyes and rest them for 30 seconds',
          'Adjust your screen brightness',
          'Consider using blue light filters'
        ]
      });
    }
  }

  // Trigger look-away reminder
  triggerLookAwayReminder() {
    if (global.mainWindow) {
      global.mainWindow.webContents.send('look-away-reminder', {
        message: 'Remember to look away from your screen',
        activity: 'Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds'
      });
    }
  }

  // Play break sound
  playBreakSound(breakType) {
    // This would play different sounds based on break type
    const sounds = {
      micro: 'gentle-chime.mp3',
      short: 'break-bell.mp3',
      long: 'relaxing-tone.mp3'
    };

    // Send audio command to renderer
    if (global.mainWindow) {
      global.mainWindow.webContents.send('play-break-sound', {
        sound: sounds[breakType],
        volume: 0.5
      });
    }
  }

  // Update break settings
  updateBreakSettings(newSettings) {
    this.breakSettings = { ...this.breakSettings, ...newSettings };
    this.store.set('breakSettings', this.breakSettings);
    
    // Restart break reminders with new settings
    this.startBreakReminders();
    
    return { success: true, settings: this.breakSettings };
  }

  // Get break statistics
  getBreakStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayBreaks = this.breakHistory.filter(breakItem => 
      new Date(breakItem.timestamp) >= today
    );
    
    const completedBreaks = todayBreaks.filter(breakItem => breakItem.completed);
    
    const totalBreakTime = completedBreaks.reduce((total, breakItem) => {
      const duration = breakItem.type === 'micro' ? breakItem.duration : breakItem.duration * 60;
      return total + duration;
    }, 0);
    
    return {
      todayBreaks: todayBreaks.length,
      completedBreaks: completedBreaks.length,
      completionRate: todayBreaks.length > 0 ? completedBreaks.length / todayBreaks.length : 0,
      totalBreakTime: totalBreakTime,
      averageBreakDuration: completedBreaks.length > 0 ? totalBreakTime / completedBreaks.length : 0,
      eyeStrainLevel: this.eyeStrainData.strainLevel,
      blinkRate: this.eyeStrainData.blinkRate,
      breakTypes: {
        micro: completedBreaks.filter(b => b.type === 'micro').length,
        short: completedBreaks.filter(b => b.type === 'short').length,
        long: completedBreaks.filter(b => b.type === 'long').length
      }
    };
  }

  // Save break history
  saveBreakHistory() {
    this.store.set('breakHistory', this.breakHistory);
  }

  // Load break history
  loadBreakHistory() {
    this.breakHistory = this.store.get('breakHistory', []);
  }

  // Get break recommendations
  getBreakRecommendations() {
    const stats = this.getBreakStats();
    const recommendations = [];
    
    if (stats.completionRate < 0.7) {
      recommendations.push({
        type: 'completion',
        message: 'You\'re skipping too many breaks',
        suggestion: 'Try setting shorter break intervals or more flexible break types',
        priority: 'high'
      });
    }
    
    if (stats.eyeStrainLevel > 0.6) {
      recommendations.push({
        type: 'eye-strain',
        message: 'High eye strain detected',
        suggestion: 'Increase micro-break frequency and consider blue light filters',
        priority: 'high'
      });
    }
    
    if (stats.blinkRate < 15) {
      recommendations.push({
        type: 'blinking',
        message: 'Low blink rate detected',
        suggestion: 'Consciously blink more often and take regular eye breaks',
        priority: 'medium'
      });
    }
    
    if (stats.totalBreakTime < 30 * 60) { // Less than 30 minutes of breaks
      recommendations.push({
        type: 'break-time',
        message: 'Not enough break time',
        suggestion: 'Aim for at least 30 minutes of breaks throughout the day',
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  // Skip current break
  skipBreak() {
    if (this.isBreakActive) {
      const currentBreak = this.breakHistory[this.breakHistory.length - 1];
      currentBreak.skipped = true;
      currentBreak.skippedAt = new Date().toISOString();
      this.isBreakActive = false;
      
      this.saveBreakHistory();
      
      if (global.mainWindow) {
        global.mainWindow.webContents.send('break-skipped', {
          type: currentBreak.type,
          timestamp: currentBreak.skippedAt
        });
      }
      
      return { success: true, message: 'Break skipped' };
    }
    
    return { success: false, message: 'No active break to skip' };
  }

  // Force break
  forceBreak(type = 'micro') {
    switch (type) {
      case 'micro':
        this.triggerMicroBreak();
        break;
      case 'short':
        this.triggerShortBreak();
        break;
      case 'long':
        this.triggerLongBreak();
        break;
    }
    
    return { success: true, message: `${type} break triggered` };
  }

  // Get break settings
  getBreakSettings() {
    return this.breakSettings;
  }

  // Export break data
  exportBreakData() {
    return {
      settings: this.breakSettings,
      history: this.breakHistory,
      stats: this.getBreakStats(),
      recommendations: this.getBreakRecommendations(),
      exportDate: new Date().toISOString()
    };
  }
}

module.exports = BreakReminder;
