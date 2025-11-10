const Store = require('electron-store');

class FocusAnalytics {
  constructor() {
    this.store = new Store();
    this.sessionData = [];
    this.userStats = {};
    this.productivityInsights = [];
    this.goalTracking = {};
  }

  // Record a focus session
  recordSession(sessionData) {
    const {
      id,
      duration,
      startTime,
      endTime,
      focusMode,
      distractions,
      productivity,
      completed,
      breakTime,
      goals
    } = sessionData;

    const session = {
      id,
      duration,
      startTime,
      endTime,
      focusMode,
      distractions: distractions || 0,
      productivity: productivity || 0,
      completed: completed || false,
      breakTime: breakTime || 0,
      goals: goals || [],
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      hour: new Date().getHours()
    };

    this.sessionData.push(session);
    this.store.set(`sessions.${id}`, session);
    this.updateUserStats();
    this.generateInsights();
    
    return session;
  }

  // Update user statistics
  updateUserStats() {
    const sessions = this.getAllSessions();
    const now = new Date();
    
    // Daily stats
    const today = now.toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.date === today);
    
    // Weekly stats
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekStart);
    
    // Monthly stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSessions = sessions.filter(s => new Date(s.date) >= monthStart);

    this.userStats = {
      // Overall stats
      totalSessions: sessions.length,
      totalTimeFocused: sessions.reduce((sum, s) => sum + s.duration, 0),
      averageSessionLength: this.calculateAverage(sessions.map(s => s.duration)),
      completionRate: this.calculateCompletionRate(sessions),
      
      // Daily stats
      todaySessions: todaySessions.length,
      todayTimeFocused: todaySessions.reduce((sum, s) => sum + s.duration, 0),
      todayProductivity: this.calculateAverage(todaySessions.map(s => s.productivity)),
      
      // Weekly stats
      weekSessions: weekSessions.length,
      weekTimeFocused: weekSessions.reduce((sum, s) => sum + s.duration, 0),
      weekProductivity: this.calculateAverage(weekSessions.map(s => s.productivity)),
      
      // Monthly stats
      monthSessions: monthSessions.length,
      monthTimeFocused: monthSessions.reduce((sum, s) => sum + s.duration, 0),
      monthProductivity: this.calculateAverage(monthSessions.map(s => s.productivity)),
      
      // Productivity patterns
      peakHours: this.findPeakHours(sessions),
      mostProductiveDays: this.findMostProductiveDays(sessions),
      favoriteFocusModes: this.findFavoriteFocusModes(sessions),
      distractionTrends: this.analyzeDistractionTrends(sessions),
      
      // Streaks
      currentStreak: this.calculateCurrentStreak(sessions),
      longestStreak: this.calculateLongestStreak(sessions),
      
      // Goals
      goalsCompleted: this.calculateGoalsCompleted(sessions),
      goalsInProgress: this.calculateGoalsInProgress(sessions)
    };

    this.store.set('userStats', this.userStats);
    return this.userStats;
  }

  // Generate productivity insights
  generateInsights() {
    const sessions = this.getAllSessions();
    const insights = [];

    // Peak productivity time insight
    const peakHours = this.findPeakHours(sessions);
    if (peakHours.length > 0) {
      insights.push({
        type: 'peak-time',
        title: 'Peak Productivity Time',
        description: `You're most productive between ${peakHours[0]}:00 and ${peakHours[0] + 2}:00`,
        recommendation: 'Schedule your most important tasks during these hours',
        confidence: 0.85,
        actionable: true
      });
    }

    // Focus mode effectiveness
    const focusModeStats = this.analyzeFocusModeEffectiveness(sessions);
    if (focusModeStats.length > 0) {
      const bestMode = focusModeStats[0];
      insights.push({
        type: 'focus-mode',
        title: 'Most Effective Focus Mode',
        description: `"${bestMode.mode}" mode gives you ${bestMode.avgProductivity}% productivity`,
        recommendation: `Use ${bestMode.mode} mode for challenging tasks`,
        confidence: 0.78,
        actionable: true
      });
    }

    // Distraction patterns
    const distractionPatterns = this.analyzeDistractionPatterns(sessions);
    if (distractionPatterns.length > 0) {
      const pattern = distractionPatterns[0];
      insights.push({
        type: 'distraction',
        title: 'Distraction Pattern Detected',
        description: `Distractions increase by ${pattern.increase}% during ${pattern.timeframe}`,
        recommendation: 'Consider adjusting your environment or schedule during this time',
        confidence: 0.72,
        actionable: true
      });
    }

    // Consistency insight
    const consistency = this.analyzeConsistency(sessions);
    if (consistency < 0.7) {
      insights.push({
        type: 'consistency',
        title: 'Improve Consistency',
        description: `Your consistency score is ${Math.round(consistency * 100)}%`,
        recommendation: 'Try to maintain a regular study schedule',
        confidence: 0.90,
        actionable: true
      });
    }

    // Break optimization
    const breakAnalysis = this.analyzeBreakPatterns(sessions);
    if (breakAnalysis.needsOptimization) {
      insights.push({
        type: 'breaks',
        title: 'Optimize Your Breaks',
        description: breakAnalysis.description,
        recommendation: breakAnalysis.recommendation,
        confidence: 0.75,
        actionable: true
      });
    }

    this.productivityInsights = insights;
    this.store.set('productivityInsights', insights);
    return insights;
  }

  // Calculate average
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  // Calculate completion rate
  calculateCompletionRate(sessions) {
    if (sessions.length === 0) return 0;
    const completed = sessions.filter(s => s.completed).length;
    return completed / sessions.length;
  }

  // Find peak productivity hours
  findPeakHours(sessions) {
    const hourStats = {};
    
    sessions.forEach(session => {
      const hour = session.hour;
      if (!hourStats[hour]) {
        hourStats[hour] = { total: 0, count: 0, productivity: 0 };
      }
      hourStats[hour].total += session.duration;
      hourStats[hour].count++;
      hourStats[hour].productivity += session.productivity;
    });

    const avgProductivityByHour = Object.entries(hourStats)
      .map(([hour, stats]) => ({
        hour: parseInt(hour),
        avgProductivity: stats.productivity / stats.count,
        totalTime: stats.total
      }))
      .sort((a, b) => b.avgProductivity - a.avgProductivity)
      .slice(0, 3)
      .map(item => item.hour);

    return avgProductivityByHour;
  }

  // Find most productive days
  findMostProductiveDays(sessions) {
    const dayStats = {};
    
    sessions.forEach(session => {
      const day = session.dayOfWeek;
      if (!dayStats[day]) {
        dayStats[day] = { total: 0, count: 0, productivity: 0 };
      }
      dayStats[day].total += session.duration;
      dayStats[day].count++;
      dayStats[day].productivity += session.productivity;
    });

    return Object.entries(dayStats)
      .map(([day, stats]) => ({
        day,
        avgProductivity: stats.productivity / stats.count,
        totalTime: stats.total
      }))
      .sort((a, b) => b.avgProductivity - a.avgProductivity);
  }

  // Find favorite focus modes
  findFavoriteFocusModes(sessions) {
    const modeStats = {};
    
    sessions.forEach(session => {
      const mode = session.focusMode;
      if (!modeStats[mode]) {
        modeStats[mode] = { total: 0, count: 0, productivity: 0 };
      }
      modeStats[mode].total += session.duration;
      modeStats[mode].count++;
      modeStats[mode].productivity += session.productivity;
    });

    return Object.entries(modeStats)
      .map(([mode, stats]) => ({
        mode,
        avgProductivity: stats.productivity / stats.count,
        totalTime: stats.total,
        usage: stats.count
      }))
      .sort((a, b) => b.totalTime - a.totalTime);
  }

  // Analyze distraction trends
  analyzeDistractionTrends(sessions) {
    const recentSessions = sessions.slice(-10); // Last 10 sessions
    const olderSessions = sessions.slice(-20, -10); // Previous 10 sessions
    
    if (recentSessions.length === 0 || olderSessions.length === 0) {
      return { trend: 'stable', change: 0 };
    }

    const recentAvg = this.calculateAverage(recentSessions.map(s => s.distractions));
    const olderAvg = this.calculateAverage(olderSessions.map(s => s.distractions));
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    return {
      trend: change > 10 ? 'increasing' : change < -10 ? 'decreasing' : 'stable',
      change: Math.round(change),
      current: Math.round(recentAvg),
      previous: Math.round(olderAvg)
    };
  }

  // Calculate current streak
  calculateCurrentStreak(sessions) {
    const sortedSessions = sessions
      .filter(s => s.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = today;
    
    for (const session of sortedSessions) {
      if (session.date === currentDate) {
        streak++;
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        currentDate = date.toISOString().split('T')[0];
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Calculate longest streak
  calculateLongestStreak(sessions) {
    const sortedSessions = sessions
      .filter(s => s.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate = null;
    
    for (const session of sortedSessions) {
      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const sessionDate = new Date(session.date);
        const lastSessionDate = new Date(lastDate);
        const diffDays = Math.floor((sessionDate - lastSessionDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      }
      lastDate = session.date;
    }
    
    return Math.max(maxStreak, currentStreak);
  }

  // Analyze focus mode effectiveness
  analyzeFocusModeEffectiveness(sessions) {
    const modeStats = {};
    
    sessions.forEach(session => {
      const mode = session.focusMode;
      if (!modeStats[mode]) {
        modeStats[mode] = { productivity: 0, count: 0, duration: 0 };
      }
      modeStats[mode].productivity += session.productivity;
      modeStats[mode].count++;
      modeStats[mode].duration += session.duration;
    });

    return Object.entries(modeStats)
      .map(([mode, stats]) => ({
        mode,
        avgProductivity: stats.productivity / stats.count,
        totalDuration: stats.duration,
        usageCount: stats.count
      }))
      .sort((a, b) => b.avgProductivity - a.avgProductivity);
  }

  // Analyze distraction patterns
  analyzeDistractionPatterns(sessions) {
    const patterns = [];
    
    // Analyze by time of day
    const morningSessions = sessions.filter(s => s.hour >= 6 && s.hour < 12);
    const afternoonSessions = sessions.filter(s => s.hour >= 12 && s.hour < 18);
    const eveningSessions = sessions.filter(s => s.hour >= 18 && s.hour < 24);
    
    const morningAvg = this.calculateAverage(morningSessions.map(s => s.distractions));
    const afternoonAvg = this.calculateAverage(afternoonSessions.map(s => s.distractions));
    const eveningAvg = this.calculateAverage(eveningSessions.map(s => s.distractions));
    
    if (afternoonAvg > morningAvg * 1.2) {
      patterns.push({
        timeframe: 'afternoon',
        increase: Math.round(((afternoonAvg - morningAvg) / morningAvg) * 100),
        description: 'Distractions peak in the afternoon'
      });
    }
    
    return patterns;
  }

  // Analyze consistency
  analyzeConsistency(sessions) {
    if (sessions.length < 7) return 1;
    
    const lastWeek = sessions.slice(-7);
    const uniqueDays = new Set(lastWeek.map(s => s.date)).size;
    
    return uniqueDays / 7;
  }

  // Analyze break patterns
  analyzeBreakPatterns(sessions) {
    const avgBreakTime = this.calculateAverage(sessions.map(s => s.breakTime));
    const avgSessionLength = this.calculateAverage(sessions.map(s => s.duration));
    const breakRatio = avgBreakTime / avgSessionLength;
    
    if (breakRatio < 0.1) {
      return {
        needsOptimization: true,
        description: 'You\'re taking very few breaks',
        recommendation: 'Try the 25/5 Pomodoro technique for better focus'
      };
    } else if (breakRatio > 0.3) {
      return {
        needsOptimization: true,
        description: 'You\'re taking many breaks',
        recommendation: 'Try longer focus sessions with fewer, longer breaks'
      };
    }
    
    return { needsOptimization: false };
  }

  // Calculate goals completed
  calculateGoalsCompleted(sessions) {
    return sessions.reduce((sum, session) => {
      return sum + session.goals.filter(goal => goal.completed).length;
    }, 0);
  }

  // Calculate goals in progress
  calculateGoalsInProgress(sessions) {
    const allGoals = sessions.reduce((goals, session) => {
      return goals.concat(session.goals);
    }, []);
    
    const uniqueGoals = new Map();
    allGoals.forEach(goal => {
      if (!uniqueGoals.has(goal.id) || !goal.completed) {
        uniqueGoals.set(goal.id, goal);
      }
    });
    
    return Array.from(uniqueGoals.values()).filter(goal => !goal.completed).length;
  }

  // Get all sessions
  getAllSessions() {
    const sessions = this.store.get('sessions', {});
    return Object.values(sessions);
  }

  // Get sessions by date range
  getSessionsByDateRange(startDate, endDate) {
    const sessions = this.getAllSessions();
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }

  // Export data
  exportData() {
    return {
      sessions: this.getAllSessions(),
      userStats: this.userStats,
      insights: this.productivityInsights,
      exportDate: new Date().toISOString()
    };
  }

  // Import data
  importData(data) {
    if (data.sessions) {
      data.sessions.forEach(session => {
        this.store.set(`sessions.${session.id}`, session);
      });
    }
    
    if (data.userStats) {
      this.store.set('userStats', data.userStats);
    }
    
    if (data.insights) {
      this.store.set('productivityInsights', data.insights);
    }
    
    this.sessionData = this.getAllSessions();
    this.updateUserStats();
    this.generateInsights();
    
    return { success: true, message: 'Data imported successfully' };
  }
}

module.exports = FocusAnalytics;
