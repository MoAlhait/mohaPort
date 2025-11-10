const Store = require('electron-store');

class FocusModes {
  constructor() {
    this.store = new Store();
    this.availableModes = this.initializeFocusModes();
    this.currentMode = null;
    this.modeHistory = [];
  }

  // Initialize all available focus modes
  initializeFocusModes() {
    return {
      'pomodoro': {
        id: 'pomodoro',
        name: 'Pomodoro Technique',
        description: '25-minute focused work sessions with 5-minute breaks',
        duration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        color: '#ef4444',
        icon: '🍅',
        benefits: [
          'Improves concentration',
          'Reduces mental fatigue',
          'Maintains consistent productivity',
          'Built-in break reminders'
        ],
        bestFor: [
          'Reading and studying',
          'Writing assignments',
          'Problem-solving tasks',
          'Creative work'
        ],
        ambientSound: 'focus',
        lighting: 'warm',
        notifications: {
          sessionStart: true,
          sessionEnd: true,
          breakStart: true,
          breakEnd: true
        }
      },
      
      'deep-work': {
        id: 'deep-work',
        name: 'Deep Work',
        description: 'Extended 90-minute sessions for complex, demanding tasks',
        duration: 90,
        breakDuration: 20,
        longBreakDuration: 60,
        longBreakInterval: 1,
        color: '#8b5cf6',
        icon: '🧠',
        benefits: [
          'Maximizes cognitive performance',
          'Eliminates distractions',
          'Builds focus endurance',
          'Produces high-quality work'
        ],
        bestFor: [
          'Research projects',
          'Complex problem solving',
          'Learning new concepts',
          'Writing theses or papers'
        ],
        ambientSound: 'nature',
        lighting: 'cool',
        notifications: {
          sessionStart: true,
          sessionEnd: true,
          breakStart: true,
          breakEnd: true,
          halfwayPoint: true
        }
      },
      
      'study-session': {
        id: 'study-session',
        name: 'Study Session',
        description: '45-minute academic study with 10-minute breaks',
        duration: 45,
        breakDuration: 10,
        longBreakDuration: 30,
        longBreakInterval: 3,
        color: '#3b82f6',
        icon: '📚',
        benefits: [
          'Optimal for academic work',
          'Balances focus and retention',
          'Prevents burnout',
          'Improves memory consolidation'
        ],
        bestFor: [
          'Exam preparation',
          'Reading textbooks',
          'Note-taking',
          'Reviewing materials'
        ],
        ambientSound: 'library',
        lighting: 'bright',
        notifications: {
          sessionStart: true,
          sessionEnd: true,
          breakStart: true,
          breakEnd: true,
          reviewReminder: true
        }
      },
      
      'exam-prep': {
        id: 'exam-prep',
        name: 'Exam Preparation',
        description: '2-hour intensive study sessions with strategic breaks',
        duration: 120,
        breakDuration: 15,
        longBreakDuration: 45,
        longBreakInterval: 1,
        color: '#dc2626',
        icon: '🎯',
        benefits: [
          'Simulates exam conditions',
          'Builds mental stamina',
          'Improves recall under pressure',
          'Reduces exam anxiety'
        ],
        bestFor: [
          'Final exam preparation',
          'Practice tests',
          'Intensive review',
          'Cramming sessions'
        ],
        ambientSound: 'silence',
        lighting: 'exam-bright',
        notifications: {
          sessionStart: true,
          sessionEnd: true,
          breakStart: true,
          breakEnd: true,
          timeCheck: true
        }
      },
      
      'creative-flow': {
        id: 'creative-flow',
        name: 'Creative Flow',
        description: 'Flexible sessions for creative and artistic work',
        duration: 60,
        breakDuration: 15,
        longBreakDuration: 30,
        longBreakInterval: 2,
        color: '#f59e0b',
        icon: '🎨',
        benefits: [
          'Enhances creativity',
          'Maintains inspiration',
          'Reduces creative blocks',
          'Improves artistic output'
        ],
        bestFor: [
          'Art and design projects',
          'Creative writing',
          'Music composition',
          'Brainstorming sessions'
        ],
        ambientSound: 'creative',
        lighting: 'warm',
        notifications: {
          sessionStart: false,
          sessionEnd: true,
          breakStart: false,
          breakEnd: true,
          inspirationPrompt: true
        }
      },
      
      'quick-focus': {
        id: 'quick-focus',
        name: 'Quick Focus',
        description: '15-minute bursts for quick tasks and rapid productivity',
        duration: 15,
        breakDuration: 3,
        longBreakDuration: 10,
        longBreakInterval: 5,
        color: '#10b981',
        icon: '⚡',
        benefits: [
          'Perfect for quick tasks',
          'Builds momentum',
          'Reduces procrastination',
          'Increases task completion'
        ],
        bestFor: [
          'Email management',
          'Quick reviews',
          'Short assignments',
          'Administrative tasks'
        ],
        ambientSound: 'energetic',
        lighting: 'neutral',
        notifications: {
          sessionStart: true,
          sessionEnd: true,
          breakStart: false,
          breakEnd: false
        }
      },
      
      'meditation-focus': {
        id: 'meditation-focus',
        name: 'Meditation Focus',
        description: 'Mindful focus sessions with breathing exercises',
        duration: 30,
        breakDuration: 10,
        longBreakDuration: 20,
        longBreakInterval: 2,
        color: '#6b7280',
        icon: '🧘',
        benefits: [
          'Reduces stress and anxiety',
          'Improves mental clarity',
          'Enhances concentration',
          'Promotes mindfulness'
        ],
        bestFor: [
          'Mindful studying',
          'Stress reduction',
          'Mental preparation',
          'Reflection and planning'
        ],
        ambientSound: 'meditation',
        lighting: 'soft',
        notifications: {
          sessionStart: true,
          sessionEnd: true,
          breakStart: true,
          breakEnd: true,
          breathingReminder: true
        }
      },
      
      'sprint-mode': {
        id: 'sprint-mode',
        name: 'Sprint Mode',
        description: 'High-intensity 20-minute sprints with minimal breaks',
        duration: 20,
        breakDuration: 2,
        longBreakDuration: 8,
        longBreakInterval: 6,
        color: '#f97316',
        icon: '🏃',
        benefits: [
          'Maximizes intensity',
          'Builds focus discipline',
          'Completes tasks quickly',
          'Reduces perfectionism'
        ],
        bestFor: [
          'Urgent deadlines',
          'Quick problem solving',
          'First drafts',
          'Rapid iteration'
        ],
        ambientSound: 'energetic',
        lighting: 'bright',
        notifications: {
          sessionStart: true,
          sessionEnd: true,
          breakStart: false,
          breakEnd: true,
          intensityReminder: true
        }
      }
    };
  }

  // Get all available focus modes
  getAllModes() {
    return Object.values(this.availableModes);
  }

  // Get mode by ID
  getMode(modeId) {
    return this.availableModes[modeId];
  }

  // Set current focus mode
  setCurrentMode(modeId) {
    const mode = this.getMode(modeId);
    if (mode) {
      this.currentMode = mode;
      this.modeHistory.push({
        modeId,
        timestamp: new Date().toISOString(),
        duration: mode.duration
      });
      
      // Keep only last 50 mode switches
      if (this.modeHistory.length > 50) {
        this.modeHistory = this.modeHistory.slice(-50);
      }
      
      this.store.set('currentMode', this.currentMode);
      this.store.set('modeHistory', this.modeHistory);
      
      return { success: true, mode: this.currentMode };
    }
    return { success: false, message: 'Mode not found' };
  }

  // Get current mode
  getCurrentMode() {
    return this.currentMode || this.store.get('currentMode');
  }

  // Get mode recommendations based on user stats
  getModeRecommendations(userStats) {
    const recommendations = [];
    
    // Based on time of day
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 10) {
      recommendations.push({
        mode: 'deep-work',
        reason: 'Morning is ideal for deep, complex work',
        confidence: 0.85
      });
    } else if (currentHour >= 10 && currentHour < 14) {
      recommendations.push({
        mode: 'study-session',
        reason: 'Midday is perfect for academic study',
        confidence: 0.80
      });
    } else if (currentHour >= 14 && currentHour < 18) {
      recommendations.push({
        mode: 'pomodoro',
        reason: 'Afternoon benefits from structured breaks',
        confidence: 0.75
      });
    } else {
      recommendations.push({
        mode: 'quick-focus',
        reason: 'Evening is best for quick, focused tasks',
        confidence: 0.70
      });
    }
    
    // Based on user productivity patterns
    if (userStats.avgSessionLength > 60) {
      recommendations.push({
        mode: 'deep-work',
        reason: 'You excel at longer focus sessions',
        confidence: 0.90
      });
    } else if (userStats.avgSessionLength < 30) {
      recommendations.push({
        mode: 'pomodoro',
        reason: 'Shorter sessions with breaks work well for you',
        confidence: 0.85
      });
    }
    
    // Based on distraction levels
    if (userStats.distractionTrends && userStats.distractionTrends.trend === 'increasing') {
      recommendations.push({
        mode: 'meditation-focus',
        reason: 'Help reduce distractions with mindful focus',
        confidence: 0.80
      });
    }
    
    // Based on upcoming deadlines
    const upcomingDeadlines = this.getUpcomingDeadlines();
    if (upcomingDeadlines.length > 0) {
      recommendations.push({
        mode: 'exam-prep',
        reason: 'Intensive preparation for upcoming deadlines',
        confidence: 0.95
      });
    }
    
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  // Get mode statistics
  getModeStats() {
    const history = this.store.get('modeHistory', []);
    const modeUsage = {};
    
    history.forEach(entry => {
      if (!modeUsage[entry.modeId]) {
        modeUsage[entry.modeId] = { count: 0, totalDuration: 0 };
      }
      modeUsage[entry.modeId].count++;
      modeUsage[entry.modeId].totalDuration += entry.duration;
    });
    
    const modeStats = Object.entries(modeUsage).map(([modeId, stats]) => {
      const mode = this.getMode(modeId);
      return {
        modeId,
        modeName: mode ? mode.name : modeId,
        usageCount: stats.count,
        totalDuration: stats.totalDuration,
        averageDuration: stats.totalDuration / stats.count,
        lastUsed: this.getLastUsedTime(modeId, history)
      };
    });
    
    return modeStats.sort((a, b) => b.usageCount - a.usageCount);
  }

  // Get last used time for a mode
  getLastUsedTime(modeId, history) {
    const modeEntries = history.filter(entry => entry.modeId === modeId);
    if (modeEntries.length === 0) return null;
    
    const lastEntry = modeEntries[modeEntries.length - 1];
    return lastEntry.timestamp;
  }

  // Create custom focus mode
  createCustomMode(modeConfig) {
    const {
      name,
      description,
      duration,
      breakDuration,
      longBreakDuration,
      longBreakInterval,
      color,
      icon,
      benefits,
      bestFor,
      ambientSound,
      lighting,
      notifications
    } = modeConfig;
    
    const modeId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const customMode = {
      id: modeId,
      name,
      description,
      duration,
      breakDuration,
      longBreakDuration,
      longBreakInterval,
      color,
      icon,
      benefits,
      bestFor,
      ambientSound,
      lighting,
      notifications,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    
    this.availableModes[modeId] = customMode;
    this.store.set(`customModes.${modeId}`, customMode);
    
    return { success: true, modeId, mode: customMode };
  }

  // Delete custom mode
  deleteCustomMode(modeId) {
    if (this.availableModes[modeId] && this.availableModes[modeId].isCustom) {
      delete this.availableModes[modeId];
      this.store.delete(`customModes.${modeId}`);
      return { success: true, message: 'Custom mode deleted successfully' };
    }
    return { success: false, message: 'Cannot delete built-in modes' };
  }

  // Get upcoming deadlines (placeholder - would integrate with calendar)
  getUpcomingDeadlines() {
    // This would integrate with calendar apps or manual deadline tracking
    return this.store.get('upcomingDeadlines', []);
  }

  // Set upcoming deadlines
  setUpcomingDeadlines(deadlines) {
    this.store.set('upcomingDeadlines', deadlines);
  }

  // Get mode effectiveness analysis
  getModeEffectiveness() {
    const history = this.store.get('modeHistory', []);
    const modePerformance = {};
    
    history.forEach(entry => {
      if (!modePerformance[entry.modeId]) {
        modePerformance[entry.modeId] = {
          totalSessions: 0,
          totalDuration: 0,
          completionRate: 0,
          productivity: 0
        };
      }
      
      modePerformance[entry.modeId].totalSessions++;
      modePerformance[entry.modeId].totalDuration += entry.duration;
      
      // This would integrate with analytics to get actual performance metrics
      // For now, using placeholder data
      modePerformance[entry.modeId].completionRate += Math.random() * 0.3 + 0.7;
      modePerformance[entry.modeId].productivity += Math.random() * 20 + 70;
    });
    
    return Object.entries(modePerformance).map(([modeId, stats]) => {
      const mode = this.getMode(modeId);
      return {
        modeId,
        modeName: mode ? mode.name : modeId,
        totalSessions: stats.totalSessions,
        totalDuration: stats.totalDuration,
        averageCompletionRate: stats.completionRate / stats.totalSessions,
        averageProductivity: stats.productivity / stats.totalSessions,
        effectiveness: (stats.completionRate / stats.totalSessions + stats.productivity / stats.totalSessions / 100) / 2
      };
    }).sort((a, b) => b.effectiveness - a.effectiveness);
  }

  // Initialize custom modes from storage
  initializeCustomModes() {
    const customModes = this.store.get('customModes', {});
    Object.values(customModes).forEach(mode => {
      this.availableModes[mode.id] = mode;
    });
  }

  // Export mode data
  exportModeData() {
    return {
      availableModes: this.availableModes,
      currentMode: this.currentMode,
      modeHistory: this.modeHistory,
      exportDate: new Date().toISOString()
    };
  }

  // Import mode data
  importModeData(data) {
    if (data.customModes) {
      Object.values(data.customModes).forEach(mode => {
        this.availableModes[mode.id] = mode;
        this.store.set(`customModes.${mode.id}`, mode);
      });
    }
    
    if (data.currentMode) {
      this.currentMode = data.currentMode;
      this.store.set('currentMode', this.currentMode);
    }
    
    if (data.modeHistory) {
      this.modeHistory = data.modeHistory;
      this.store.set('modeHistory', this.modeHistory);
    }
    
    return { success: true, message: 'Mode data imported successfully' };
  }
}

module.exports = FocusModes;
