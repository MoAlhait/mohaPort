const cron = require('node-cron');
const Store = require('electron-store');

class AdvancedScheduler {
  constructor() {
    this.store = new Store();
    this.scheduledTasks = new Map();
    this.activeSchedules = [];
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Create a recurring focus session
  createRecurringSession(scheduleConfig) {
    const {
      name,
      duration,
      startTime,
      endTime,
      daysOfWeek,
      focusMode,
      autoStart,
      breakDuration,
      maxSessions,
      notifications
    } = scheduleConfig;

    const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const schedule = {
      id: scheduleId,
      name,
      duration,
      startTime,
      endTime,
      daysOfWeek,
      focusMode,
      autoStart,
      breakDuration: breakDuration || 5,
      maxSessions: maxSessions || 10,
      notifications,
      createdAt: new Date(),
      isActive: true,
      completedSessions: 0,
      totalTimeFocused: 0
    };

    // Create cron expression based on days and time
    const cronExpression = this.createCronExpression(startTime, daysOfWeek);
    
    if (cron.validate(cronExpression)) {
      const task = cron.schedule(cronExpression, () => {
        this.executeScheduledSession(schedule);
      }, {
        scheduled: false,
        timezone: this.timezone
      });

      this.scheduledTasks.set(scheduleId, task);
      this.activeSchedules.push(schedule);
      this.store.set(`schedules.${scheduleId}`, schedule);
      
      if (autoStart) {
        task.start();
      }

      return { success: true, scheduleId, message: 'Recurring session created successfully' };
    } else {
      return { success: false, message: 'Invalid schedule configuration' };
    }
  }

  // Create cron expression for recurring sessions
  createCronExpression(time, daysOfWeek) {
    const [hours, minutes] = time.split(':').map(Number);
    const dayNumbers = daysOfWeek.map(day => {
      const dayMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
      return dayMap[day];
    });

    // Cron format: second minute hour day-of-month month day-of-week
    return `${minutes} ${hours} * * ${dayNumbers.join(',')}`;
  }

  // Execute a scheduled session
  executeScheduledSession(schedule) {
    console.log(`Executing scheduled session: ${schedule.name}`);
    
    // Check if we're within the allowed time range
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTimeMinutes = this.timeToMinutes(schedule.startTime);
    const endTimeMinutes = this.timeToMinutes(schedule.endTime);

    if (currentTime < startTimeMinutes || currentTime > endTimeMinutes) {
      console.log('Scheduled session outside allowed time range');
      return;
    }

    // Check if max sessions reached
    if (schedule.completedSessions >= schedule.maxSessions) {
      console.log('Max sessions reached for this schedule');
      this.pauseSchedule(schedule.id);
      return;
    }

    // Emit event to start focus session
    if (typeof global !== 'undefined' && global.mainWindow) {
      global.mainWindow.webContents.send('scheduled-session-start', {
        schedule,
        duration: schedule.duration,
        focusMode: schedule.focusMode,
        breakDuration: schedule.breakDuration
      });
    }

    // Update schedule stats
    schedule.completedSessions++;
    schedule.totalTimeFocused += schedule.duration;
    this.store.set(`schedules.${schedule.id}`, schedule);
  }

  // Convert time string to minutes
  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Pause a schedule
  pauseSchedule(scheduleId) {
    const task = this.scheduledTasks.get(scheduleId);
    if (task) {
      task.stop();
      const schedule = this.activeSchedules.find(s => s.id === scheduleId);
      if (schedule) {
        schedule.isActive = false;
        this.store.set(`schedules.${scheduleId}`, schedule);
      }
      return { success: true, message: 'Schedule paused successfully' };
    }
    return { success: false, message: 'Schedule not found' };
  }

  // Resume a schedule
  resumeSchedule(scheduleId) {
    const task = this.scheduledTasks.get(scheduleId);
    if (task) {
      task.start();
      const schedule = this.activeSchedules.find(s => s.id === scheduleId);
      if (schedule) {
        schedule.isActive = true;
        this.store.set(`schedules.${scheduleId}`, schedule);
      }
      return { success: true, message: 'Schedule resumed successfully' };
    }
    return { success: false, message: 'Schedule not found' };
  }

  // Delete a schedule
  deleteSchedule(scheduleId) {
    const task = this.scheduledTasks.get(scheduleId);
    if (task) {
      task.stop();
      task.destroy();
      this.scheduledTasks.delete(scheduleId);
      
      this.activeSchedules = this.activeSchedules.filter(s => s.id !== scheduleId);
      this.store.delete(`schedules.${scheduleId}`);
      
      return { success: true, message: 'Schedule deleted successfully' };
    }
    return { success: false, message: 'Schedule not found' };
  }

  // Get all schedules
  getAllSchedules() {
    const schedules = this.store.get('schedules', {});
    return Object.values(schedules);
  }

  // Get schedule by ID
  getSchedule(scheduleId) {
    return this.store.get(`schedules.${scheduleId}`);
  }

  // Update schedule
  updateSchedule(scheduleId, updates) {
    const schedule = this.getSchedule(scheduleId);
    if (schedule) {
      const updatedSchedule = { ...schedule, ...updates };
      this.store.set(`schedules.${scheduleId}`, updatedSchedule);
      
      // Restart the cron job with new settings
      this.deleteSchedule(scheduleId);
      const result = this.createRecurringSession(updatedSchedule);
      
      return { success: true, message: 'Schedule updated successfully' };
    }
    return { success: false, message: 'Schedule not found' };
  }

  // Get today's scheduled sessions
  getTodaysSessions() {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    return this.activeSchedules.filter(schedule => 
      schedule.isActive && 
      schedule.daysOfWeek.includes(dayName)
    );
  }

  // Get upcoming sessions (next 7 days)
  getUpcomingSessions(days = 7) {
    const upcoming = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const daySessions = this.activeSchedules.filter(schedule => 
        schedule.isActive && 
        schedule.daysOfWeek.includes(dayName)
      ).map(schedule => ({
        ...schedule,
        scheduledDate: date.toISOString().split('T')[0],
        scheduledTime: schedule.startTime
      }));
      
      upcoming.push(...daySessions);
    }
    
    return upcoming.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }

  // Create smart schedule suggestions based on user patterns
  generateSmartSuggestions(userStats) {
    const suggestions = [];
    
    // Analyze peak productivity times
    if (userStats.peakHours && userStats.peakHours.length > 0) {
      const peakHour = userStats.peakHours[0];
      suggestions.push({
        type: 'peak-time',
        name: `Peak Productivity Session (${peakHour}:00)`,
        duration: 90,
        startTime: `${peakHour}:00`,
        endTime: `${peakHour + 3}:00`,
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        focusMode: 'Deep Work',
        reasoning: 'Based on your most productive hours'
      });
    }

    // Suggest break patterns
    if (userStats.avgSessionLength > 60) {
      suggestions.push({
        type: 'break-pattern',
        name: 'Pomodoro Study Block',
        duration: 25,
        breakDuration: 5,
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        focusMode: 'Pomodoro',
        reasoning: 'Regular breaks help maintain focus during long study sessions'
      });
    }

    // Suggest weekend review sessions
    suggestions.push({
      type: 'review',
      name: 'Weekly Review & Planning',
      duration: 60,
      startTime: '10:00',
      endTime: '12:00',
      daysOfWeek: ['Sunday'],
      focusMode: 'Planning',
      reasoning: 'Weekly review helps maintain momentum and plan ahead'
    });

    return suggestions;
  }

  // Initialize all stored schedules
  initializeStoredSchedules() {
    const schedules = this.getAllSchedules();
    
    schedules.forEach(schedule => {
      if (schedule.isActive) {
        const cronExpression = this.createCronExpression(schedule.startTime, schedule.daysOfWeek);
        
        if (cron.validate(cronExpression)) {
          const task = cron.schedule(cronExpression, () => {
            this.executeScheduledSession(schedule);
          }, {
            scheduled: false,
            timezone: this.timezone
          });

          this.scheduledTasks.set(schedule.id, task);
          this.activeSchedules.push(schedule);
          task.start();
        }
      }
    });

    console.log(`Initialized ${this.activeSchedules.length} active schedules`);
  }

  // Clean up old completed schedules
  cleanupOldSchedules() {
    const schedules = this.getAllSchedules();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // Keep schedules from last 30 days

    schedules.forEach(schedule => {
      if (schedule.completedSessions >= schedule.maxSessions && 
          new Date(schedule.createdAt) < cutoffDate) {
        this.deleteSchedule(schedule.id);
      }
    });
  }

  // Get schedule statistics
  getScheduleStats() {
    const schedules = this.getAllSchedules();
    const activeCount = schedules.filter(s => s.isActive).length;
    const totalSessions = schedules.reduce((sum, s) => sum + s.completedSessions, 0);
    const totalTime = schedules.reduce((sum, s) => sum + s.totalTimeFocused, 0);

    return {
      totalSchedules: schedules.length,
      activeSchedules: activeCount,
      totalSessionsCompleted: totalSessions,
      totalTimeFocused: totalTime,
      averageSessionLength: totalSessions > 0 ? totalTime / totalSessions : 0
    };
  }
}

module.exports = AdvancedScheduler;
