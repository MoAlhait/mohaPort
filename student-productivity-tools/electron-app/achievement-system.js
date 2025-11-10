const Store = require('electron-store');

class AchievementSystem {
  constructor() {
    this.store = new Store();
    this.achievements = this.initializeAchievements();
    this.userAchievements = this.loadUserAchievements();
    this.userStats = this.loadUserStats();
    this.levels = this.initializeLevels();
    this.userLevel = this.calculateUserLevel();
  }

  // Initialize all available achievements
  initializeAchievements() {
    return {
      // Focus Achievements
      'first-focus': {
        id: 'first-focus',
        name: 'First Steps',
        description: 'Complete your first focus session',
        icon: '🎯',
        category: 'focus',
        rarity: 'common',
        points: 10,
        requirement: { type: 'sessions_completed', value: 1 },
        unlocked: false,
        unlockedAt: null
      },
      'focus-marathon': {
        id: 'focus-marathon',
        name: 'Focus Marathon',
        description: 'Complete 10 focus sessions',
        icon: '🏃‍♂️',
        category: 'focus',
        rarity: 'uncommon',
        points: 25,
        requirement: { type: 'sessions_completed', value: 10 },
        unlocked: false,
        unlockedAt: null
      },
      'focus-master': {
        id: 'focus-master',
        name: 'Focus Master',
        description: 'Complete 50 focus sessions',
        icon: '👑',
        category: 'focus',
        rarity: 'rare',
        points: 100,
        requirement: { type: 'sessions_completed', value: 50 },
        unlocked: false,
        unlockedAt: null
      },
      'focus-legend': {
        id: 'focus-legend',
        name: 'Focus Legend',
        description: 'Complete 100 focus sessions',
        icon: '🌟',
        category: 'focus',
        rarity: 'epic',
        points: 250,
        requirement: { type: 'sessions_completed', value: 100 },
        unlocked: false,
        unlockedAt: null
      },

      // Time Achievements
      'time-keeper': {
        id: 'time-keeper',
        name: 'Time Keeper',
        description: 'Focus for a total of 10 hours',
        icon: '⏰',
        category: 'time',
        rarity: 'common',
        points: 20,
        requirement: { type: 'total_time', value: 600 }, // 10 hours in minutes
        unlocked: false,
        unlockedAt: null
      },
      'time-master': {
        id: 'time-master',
        name: 'Time Master',
        description: 'Focus for a total of 50 hours',
        icon: '⏳',
        category: 'time',
        rarity: 'uncommon',
        points: 50,
        requirement: { type: 'total_time', value: 3000 }, // 50 hours
        unlocked: false,
        unlockedAt: null
      },
      'time-legend': {
        id: 'time-legend',
        name: 'Time Legend',
        description: 'Focus for a total of 200 hours',
        icon: '🕰️',
        category: 'time',
        rarity: 'rare',
        points: 150,
        requirement: { type: 'total_time', value: 12000 }, // 200 hours
        unlocked: false,
        unlockedAt: null
      },

      // Streak Achievements
      'streak-starter': {
        id: 'streak-starter',
        name: 'Streak Starter',
        description: 'Maintain a 3-day focus streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'common',
        points: 15,
        requirement: { type: 'streak', value: 3 },
        unlocked: false,
        unlockedAt: null
      },
      'streak-warrior': {
        id: 'streak-warrior',
        name: 'Streak Warrior',
        description: 'Maintain a 7-day focus streak',
        icon: '💪',
        category: 'streak',
        rarity: 'uncommon',
        points: 40,
        requirement: { type: 'streak', value: 7 },
        unlocked: false,
        unlockedAt: null
      },
      'streak-champion': {
        id: 'streak-champion',
        name: 'Streak Champion',
        description: 'Maintain a 30-day focus streak',
        icon: '🏆',
        category: 'streak',
        rarity: 'rare',
        points: 100,
        requirement: { type: 'streak', value: 30 },
        unlocked: false,
        unlockedAt: null
      },
      'streak-legend': {
        id: 'streak-legend',
        name: 'Streak Legend',
        description: 'Maintain a 100-day focus streak',
        icon: '👑',
        category: 'streak',
        rarity: 'legendary',
        points: 500,
        requirement: { type: 'streak', value: 100 },
        unlocked: false,
        unlockedAt: null
      },

      // Mode Achievements
      'pomodoro-pro': {
        id: 'pomodoro-pro',
        name: 'Pomodoro Pro',
        description: 'Complete 25 Pomodoro sessions',
        icon: '🍅',
        category: 'mode',
        rarity: 'uncommon',
        points: 30,
        requirement: { type: 'mode_sessions', mode: 'pomodoro', value: 25 },
        unlocked: false,
        unlockedAt: null
      },
      'deep-diver': {
        id: 'deep-diver',
        name: 'Deep Diver',
        description: 'Complete 10 Deep Work sessions',
        icon: '🧠',
        category: 'mode',
        rarity: 'uncommon',
        points: 35,
        requirement: { type: 'mode_sessions', mode: 'deep-work', value: 10 },
        unlocked: false,
        unlockedAt: null
      },
      'study-scholar': {
        id: 'study-scholar',
        name: 'Study Scholar',
        description: 'Complete 20 Study sessions',
        icon: '📚',
        category: 'mode',
        rarity: 'common',
        points: 25,
        requirement: { type: 'mode_sessions', mode: 'study-session', value: 20 },
        unlocked: false,
        unlockedAt: null
      },
      'exam-warrior': {
        id: 'exam-warrior',
        name: 'Exam Warrior',
        description: 'Complete 5 Exam Prep sessions',
        icon: '🎯',
        category: 'mode',
        rarity: 'rare',
        points: 50,
        requirement: { type: 'mode_sessions', mode: 'exam-prep', value: 5 },
        unlocked: false,
        unlockedAt: null
      },

      // Break Achievements
      'break-master': {
        id: 'break-master',
        name: 'Break Master',
        description: 'Take 100 breaks',
        icon: '☕',
        category: 'breaks',
        rarity: 'common',
        points: 20,
        requirement: { type: 'breaks_taken', value: 100 },
        unlocked: false,
        unlockedAt: null
      },
      'eye-care': {
        id: 'eye-care',
        name: 'Eye Care Expert',
        description: 'Take 50 micro-breaks for eye health',
        icon: '👁️',
        category: 'breaks',
        rarity: 'uncommon',
        points: 30,
        requirement: { type: 'micro_breaks', value: 50 },
        unlocked: false,
        unlockedAt: null
      },

      // Productivity Achievements
      'productivity-ninja': {
        id: 'productivity-ninja',
        name: 'Productivity Ninja',
        description: 'Achieve 90% productivity rating',
        icon: '🥷',
        category: 'productivity',
        rarity: 'rare',
        points: 75,
        requirement: { type: 'productivity_rating', value: 90 },
        unlocked: false,
        unlockedAt: null
      },
      'consistency-king': {
        id: 'consistency-king',
        name: 'Consistency King',
        description: 'Maintain 80% session completion rate',
        icon: '👑',
        category: 'productivity',
        rarity: 'epic',
        points: 100,
        requirement: { type: 'completion_rate', value: 80 },
        unlocked: false,
        unlockedAt: null
      },

      // Special Achievements
      'early-bird': {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Complete 10 focus sessions before 8 AM',
        icon: '🌅',
        category: 'special',
        rarity: 'rare',
        points: 50,
        requirement: { type: 'early_sessions', value: 10 },
        unlocked: false,
        unlockedAt: null
      },
      'night-owl': {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Complete 10 focus sessions after 10 PM',
        icon: '🦉',
        category: 'special',
        rarity: 'rare',
        points: 50,
        requirement: { type: 'late_sessions', value: 10 },
        unlocked: false,
        unlockedAt: null
      },
      'weekend-warrior': {
        id: 'weekend-warrior',
        name: 'Weekend Warrior',
        description: 'Complete 20 focus sessions on weekends',
        icon: '⚔️',
        category: 'special',
        rarity: 'uncommon',
        points: 40,
        requirement: { type: 'weekend_sessions', value: 20 },
        unlocked: false,
        unlockedAt: null
      },
      'multi-tasker': {
        id: 'multi-tasker',
        name: 'Multi-Tasker',
        description: 'Use 5 different focus modes',
        icon: '🎭',
        category: 'special',
        rarity: 'uncommon',
        points: 35,
        requirement: { type: 'modes_used', value: 5 },
        unlocked: false,
        unlockedAt: null
      },

      // Milestone Achievements
      'century-club': {
        id: 'century-club',
        name: 'Century Club',
        description: 'Complete 100 hours of focused work',
        icon: '💯',
        category: 'milestone',
        rarity: 'epic',
        points: 200,
        requirement: { type: 'total_time', value: 6000 }, // 100 hours
        unlocked: false,
        unlockedAt: null
      },
      'half-marathon': {
        id: 'half-marathon',
        name: 'Half Marathon',
        description: 'Focus for 13 hours in a single day',
        icon: '🏃‍♀️',
        category: 'milestone',
        rarity: 'legendary',
        points: 300,
        requirement: { type: 'daily_time', value: 780 }, // 13 hours
        unlocked: false,
        unlockedAt: null
      }
    };
  }

  // Initialize level system
  initializeLevels() {
    return [
      { level: 1, name: 'Beginner', points: 0, color: '#6B7280', icon: '🌱' },
      { level: 2, name: 'Novice', points: 50, color: '#3B82F6', icon: '📖' },
      { level: 3, name: 'Apprentice', points: 150, color: '#10B981', icon: '🎓' },
      { level: 4, name: 'Practitioner', points: 300, color: '#F59E0B', icon: '⚡' },
      { level: 5, name: 'Expert', points: 500, color: '#EF4444', icon: '🔥' },
      { level: 6, name: 'Master', points: 750, color: '#8B5CF6', icon: '👑' },
      { level: 7, name: 'Grandmaster', points: 1000, color: '#F97316', icon: '🌟' },
      { level: 8, name: 'Legend', points: 1500, color: '#06B6D4', icon: '💫' },
      { level: 9, name: 'Mythic', points: 2000, color: '#EC4899', icon: '✨' },
      { level: 10, name: 'Transcendent', points: 3000, color: '#FFFFFF', icon: '☀️' }
    ];
  }

  // Load user achievements
  loadUserAchievements() {
    return this.store.get('userAchievements', {});
  }

  // Load user stats
  loadUserStats() {
    return this.store.get('userStats', {
      totalSessions: 0,
      totalTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      sessionsByMode: {},
      totalBreaks: 0,
      microBreaks: 0,
      productivityRating: 0,
      completionRate: 0,
      earlySessions: 0,
      lateSessions: 0,
      weekendSessions: 0,
      modesUsed: new Set(),
      dailyTime: {}
    });
  }

  // Update user stats
  updateUserStats(sessionData) {
    this.userStats.totalSessions++;
    this.userStats.totalTime += sessionData.duration;
    
    // Update mode stats
    if (!this.userStats.sessionsByMode[sessionData.focusMode]) {
      this.userStats.sessionsByMode[sessionData.focusMode] = 0;
    }
    this.userStats.sessionsByMode[sessionData.focusMode]++;
    
    // Update modes used
    this.userStats.modesUsed.add(sessionData.focusMode);
    
    // Update time-based stats
    const hour = new Date(sessionData.startTime).getHours();
    const dayOfWeek = new Date(sessionData.startTime).getDay();
    
    if (hour < 8) {
      this.userStats.earlySessions++;
    } else if (hour > 22) {
      this.userStats.lateSessions++;
    }
    
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      this.userStats.weekendSessions++;
    }
    
    // Update daily time
    const date = new Date(sessionData.startTime).toISOString().split('T')[0];
    if (!this.userStats.dailyTime[date]) {
      this.userStats.dailyTime[date] = 0;
    }
    this.userStats.dailyTime[date] += sessionData.duration;
    
    // Update completion rate
    if (sessionData.completed) {
      this.userStats.completionRate = (this.userStats.completionRate * (this.userStats.totalSessions - 1) + 100) / this.userStats.totalSessions;
    } else {
      this.userStats.completionRate = (this.userStats.completionRate * (this.userStats.totalSessions - 1) + 0) / this.userStats.totalSessions;
    }
    
    // Update productivity rating
    if (sessionData.productivity) {
      this.userStats.productivityRating = (this.userStats.productivityRating * (this.userStats.totalSessions - 1) + sessionData.productivity) / this.userStats.totalSessions;
    }
    
    this.store.set('userStats', this.userStats);
    this.checkAchievements();
  }

  // Update break stats
  updateBreakStats(breakData) {
    this.userStats.totalBreaks++;
    
    if (breakData.type === 'micro') {
      this.userStats.microBreaks++;
    }
    
    this.store.set('userStats', this.userStats);
    this.checkAchievements();
  }

  // Update streak
  updateStreak(currentStreak) {
    this.userStats.currentStreak = currentStreak;
    this.userStats.longestStreak = Math.max(this.userStats.longestStreak, currentStreak);
    
    this.store.set('userStats', this.userStats);
    this.checkAchievements();
  }

  // Check for new achievements
  checkAchievements() {
    const newAchievements = [];
    
    Object.values(this.achievements).forEach(achievement => {
      if (!this.userAchievements[achievement.id] && this.isAchievementUnlocked(achievement)) {
        this.unlockAchievement(achievement);
        newAchievements.push(achievement);
      }
    });
    
    return newAchievements;
  }

  // Check if achievement is unlocked
  isAchievementUnlocked(achievement) {
    const requirement = achievement.requirement;
    
    switch (requirement.type) {
      case 'sessions_completed':
        return this.userStats.totalSessions >= requirement.value;
      
      case 'total_time':
        return this.userStats.totalTime >= requirement.value;
      
      case 'streak':
        return this.userStats.currentStreak >= requirement.value;
      
      case 'mode_sessions':
        return this.userStats.sessionsByMode[requirement.mode] >= requirement.value;
      
      case 'breaks_taken':
        return this.userStats.totalBreaks >= requirement.value;
      
      case 'micro_breaks':
        return this.userStats.microBreaks >= requirement.value;
      
      case 'productivity_rating':
        return this.userStats.productivityRating >= requirement.value;
      
      case 'completion_rate':
        return this.userStats.completionRate >= requirement.value;
      
      case 'early_sessions':
        return this.userStats.earlySessions >= requirement.value;
      
      case 'late_sessions':
        return this.userStats.lateSessions >= requirement.value;
      
      case 'weekend_sessions':
        return this.userStats.weekendSessions >= requirement.value;
      
      case 'modes_used':
        return this.userStats.modesUsed.size >= requirement.value;
      
      case 'daily_time':
        const today = new Date().toISOString().split('T')[0];
        return (this.userStats.dailyTime[today] || 0) >= requirement.value;
      
      default:
        return false;
    }
  }

  // Unlock achievement
  unlockAchievement(achievement) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();
    
    this.userAchievements[achievement.id] = {
      unlockedAt: achievement.unlockedAt,
      points: achievement.points
    };
    
    this.store.set('userAchievements', this.userAchievements);
    
    // Send notification
    if (global.mainWindow) {
      global.mainWindow.webContents.send('achievement-unlocked', {
        achievement,
        totalPoints: this.getTotalPoints(),
        newLevel: this.calculateUserLevel()
      });
    }
  }

  // Get total points
  getTotalPoints() {
    return Object.values(this.userAchievements).reduce((total, achievement) => {
      return total + achievement.points;
    }, 0);
  }

  // Calculate user level
  calculateUserLevel() {
    const totalPoints = this.getTotalPoints();
    
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (totalPoints >= this.levels[i].points) {
        this.userLevel = this.levels[i];
        return this.userLevel;
      }
    }
    
    this.userLevel = this.levels[0];
    return this.userLevel;
  }

  // Get user level
  getUserLevel() {
    return this.userLevel;
  }

  // Get progress to next level
  getProgressToNextLevel() {
    const currentLevelIndex = this.levels.findIndex(level => level.level === this.userLevel.level);
    
    if (currentLevelIndex >= this.levels.length - 1) {
      return { progress: 1, nextLevel: null, pointsNeeded: 0 };
    }
    
    const nextLevel = this.levels[currentLevelIndex + 1];
    const currentPoints = this.getTotalPoints();
    const pointsNeeded = nextLevel.points - currentPoints;
    const progress = (currentPoints - this.userLevel.points) / (nextLevel.points - this.userLevel.points);
    
    return {
      progress: Math.max(0, Math.min(1, progress)),
      nextLevel,
      pointsNeeded: Math.max(0, pointsNeeded)
    };
  }

  // Get unlocked achievements
  getUnlockedAchievements() {
    return Object.values(this.achievements).filter(achievement => achievement.unlocked);
  }

  // Get locked achievements
  getLockedAchievements() {
    return Object.values(this.achievements).filter(achievement => !achievement.unlocked);
  }

  // Get achievements by category
  getAchievementsByCategory(category) {
    return Object.values(this.achievements).filter(achievement => achievement.category === category);
  }

  // Get achievements by rarity
  getAchievementsByRarity(rarity) {
    return Object.values(this.achievements).filter(achievement => achievement.rarity === rarity);
  }

  // Get achievement statistics
  getAchievementStats() {
    const total = Object.keys(this.achievements).length;
    const unlocked = Object.keys(this.userAchievements).length;
    const locked = total - unlocked;
    
    const byCategory = {};
    const byRarity = {};
    
    Object.values(this.achievements).forEach(achievement => {
      // By category
      if (!byCategory[achievement.category]) {
        byCategory[achievement.category] = { total: 0, unlocked: 0 };
      }
      byCategory[achievement.category].total++;
      if (achievement.unlocked) {
        byCategory[achievement.category].unlocked++;
      }
      
      // By rarity
      if (!byRarity[achievement.rarity]) {
        byRarity[achievement.rarity] = { total: 0, unlocked: 0 };
      }
      byRarity[achievement.rarity].total++;
      if (achievement.unlocked) {
        byRarity[achievement.rarity].unlocked++;
      }
    });
    
    return {
      total,
      unlocked,
      locked,
      completionRate: unlocked / total,
      totalPoints: this.getTotalPoints(),
      currentLevel: this.userLevel,
      progressToNext: this.getProgressToNextLevel(),
      byCategory,
      byRarity
    };
  }

  // Get leaderboard data (for future social features)
  getLeaderboardData() {
    // This would integrate with a backend service
    // For now, return local data
    return {
      weekly: [],
      monthly: [],
      allTime: []
    };
  }

  // Export achievement data
  exportAchievementData() {
    return {
      achievements: this.achievements,
      userAchievements: this.userAchievements,
      userStats: this.userStats,
      userLevel: this.userLevel,
      stats: this.getAchievementStats(),
      exportDate: new Date().toISOString()
    };
  }
}

module.exports = AchievementSystem;
