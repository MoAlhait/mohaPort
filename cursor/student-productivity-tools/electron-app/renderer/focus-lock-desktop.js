// Desktop version of Focus Lock that uses real Electron IPC for system-level blocking
// This runs in the Electron renderer process and communicates with the main process

class DesktopFocusLock {
  constructor() {
    this.isElectron = typeof window !== 'undefined' && window.electronAPI;
    this.currentSession = null;
    this.isLocked = false;
    this.timeRemaining = 0;
    this.isPaused = false;
    this.distractions = 0;
    
    this.initializeUI();
    this.setupEventListeners();
  }

  initializeUI() {
    // Create the focus lock UI
    this.createLockScreen();
    this.createSetupPanel();
    this.updateUI();
  }

  createLockScreen() {
    const lockScreen = document.createElement('div');
    lockScreen.id = 'focus-lock-screen';
    lockScreen.className = 'fixed inset-0 z-50 bg-black flex items-center justify-center hidden';
    
    lockScreen.innerHTML = `
      <div class="relative z-10 text-center text-white max-w-2xl mx-auto px-8">
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto text-red-400 mb-4 animate-pulse">
            <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
        </div>
        
        <h1 class="text-4xl font-bold mb-4">FOCUS LOCKED</h1>
        
        <p class="text-xl mb-8 text-gray-300">
          You are focusing on: <span class="text-red-400 font-semibold" id="current-task">Loading...</span>
        </p>
        
        <div class="mb-8">
          <div class="relative w-48 h-48 mx-auto">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#374151" stroke-width="8" fill="none"/>
              <circle cx="50" cy="50" r="45" stroke="#ef4444" stroke-width="8" fill="none" 
                      stroke-dasharray="283" stroke-dashoffset="0" 
                      id="progress-circle" 
                      style="transition: stroke-dashoffset 1s ease-in-out;"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-3xl font-bold" id="timer-display">25:00</div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-center space-x-4 mb-8">
          <button id="pause-btn" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            <span id="pause-text">Pause</span>
          </button>
          <button id="stop-btn" class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
            Stop Session
          </button>
        </div>
        
        <div class="text-sm text-gray-400">
          <p>Distractions blocked: <span id="distractions-count">0</span></p>
          <p>Apps locked: <span id="apps-locked-count">0</span></p>
        </div>
      </div>
    `;
    
    document.body.appendChild(lockScreen);
    this.lockScreen = lockScreen;
  }

  createSetupPanel() {
    const setupPanel = document.createElement('div');
    setupPanel.id = 'focus-setup-panel';
    setupPanel.className = 'max-w-4xl mx-auto p-8';
    
    setupPanel.innerHTML = `
      <div class="text-center mb-12">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
        
        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Focus Lock
        </h1>
        
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Lock yourself out of distractions and focus on what matters most
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-2xl p-8 shadow-xl">
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Focus Session Setup
          </h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                What do you want to focus on?
              </label>
              <input type="text" id="task-input" placeholder="e.g., Study for calculus exam, Write research paper..."
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Choose Focus Mode
              </label>
              <div class="grid grid-cols-2 gap-3" id="focus-modes">
                <!-- Focus modes will be populated by JavaScript -->
              </div>
            </div>
            
            <button id="start-focus-btn" class="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Start Focus Lock Session
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-8 shadow-xl">
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Blocked Apps
          </h2>
          
          <div class="space-y-3 max-h-80 overflow-y-auto" id="blocked-apps-list">
            <!-- Blocked apps will be populated by JavaScript -->
          </div>
          
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <div>
                <div class="font-medium text-blue-800">How it works</div>
                <div class="text-sm text-blue-600 mt-1">
                  When you start a focus session, blocked apps will be closed and websites will be inaccessible until your session ends.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="session-status" class="mt-8 hidden">
        <!-- Session status will be shown here -->
      </div>
    `;
    
    document.body.appendChild(setupPanel);
    this.setupPanel = setupPanel;
    this.populateFocusModes();
    this.populateBlockedApps();
  }

  populateFocusModes() {
    const focusModes = [
      { id: 'pomodoro', name: 'Pomodoro', duration: 25, color: '#ef4444', description: '25 min focus + 5 min break' },
      { id: 'deep', name: 'Deep Work', duration: 90, color: '#3b82f6', description: '90 min intense focus session' },
      { id: 'study', name: 'Study Session', duration: 45, color: '#10b981', description: '45 min academic focus' },
      { id: 'quick', name: 'Quick Focus', duration: 15, color: '#f59e0b', description: '15 min rapid task completion' },
      { id: 'custom', name: 'Custom', duration: 0, color: '#8b5cf6', description: 'Set your own duration' }
    ];

    const modesContainer = document.getElementById('focus-modes');
    modesContainer.innerHTML = '';

    focusModes.forEach(mode => {
      const modeButton = document.createElement('button');
      modeButton.className = 'p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-left transition-all focus:ring-2 focus:ring-red-500';
      modeButton.innerHTML = `
        <div class="font-semibold text-gray-800">${mode.name}</div>
        <div class="text-sm text-gray-600">${mode.description}</div>
      `;
      
      modeButton.addEventListener('click', () => {
        document.querySelectorAll('#focus-modes button').forEach(btn => {
          btn.classList.remove('border-red-500', 'bg-red-50');
          btn.classList.add('border-gray-200');
        });
        modeButton.classList.add('border-red-500', 'bg-red-50');
        this.selectedMode = mode;
      });
      
      modesContainer.appendChild(modeButton);
    });

    // Select first mode by default
    if (modesContainer.firstChild) {
      modesContainer.firstChild.click();
    }
  }

  populateBlockedApps() {
    const blockedApps = [
      { name: 'Safari', process: 'Safari', icon: '🌐', category: 'entertainment' },
      { name: 'Chrome', process: 'Google Chrome', icon: '🌐', category: 'entertainment' },
      { name: 'Firefox', process: 'Firefox', icon: '🦊', category: 'entertainment' },
      { name: 'Discord', process: 'Discord', icon: '💬', category: 'social' },
      { name: 'Slack', process: 'Slack', icon: '💼', category: 'social' },
      { name: 'Messages', process: 'Messages', icon: '💬', category: 'social' },
      { name: 'WhatsApp', process: 'WhatsApp', icon: '💬', category: 'social' },
      { name: 'Instagram', process: 'Instagram', icon: '📸', category: 'social' },
      { name: 'Twitter/X', process: 'Twitter', icon: '🐦', category: 'social' },
      { name: 'YouTube', process: 'YouTube', icon: '📺', category: 'entertainment' },
      { name: 'Netflix', process: 'Netflix', icon: '🎬', category: 'entertainment' },
      { name: 'Spotify', process: 'Spotify', icon: '🎵', category: 'entertainment' },
      { name: 'Steam', process: 'Steam', icon: '🎮', category: 'entertainment' },
      { name: 'Epic Games', process: 'Epic Games Launcher', icon: '🎮', category: 'entertainment' },
      { name: 'Photos', process: 'Photos', icon: '📷', category: 'other' },
      { name: 'Mail', process: 'Mail', icon: '📧', category: 'productivity' },
      { name: 'Calendar', process: 'Calendar', icon: '📅', category: 'productivity' },
      { name: 'Finder', process: 'Finder', icon: '📁', category: 'other' }
    ];

    const appsContainer = document.getElementById('blocked-apps-list');
    appsContainer.innerHTML = '';

    blockedApps.forEach(app => {
      const appItem = document.createElement('div');
      appItem.className = `flex items-center justify-between p-3 rounded-lg border ${
        app.category === 'productivity' 
          ? 'border-green-200 bg-green-50' 
          : 'border-red-200 bg-red-50'
      }`;
      
      appItem.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="text-2xl">${app.icon}</span>
          <div>
            <div class="font-medium">${app.name}</div>
            <div class="text-sm text-gray-500">${app.category}</div>
          </div>
        </div>
        
        <button class="toggle-app-btn flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          app.category === 'productivity'
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }" data-app="${app.name}">
          <span class="toggle-icon">${app.category === 'productivity' ? '👁️' : '🚫'}</span>
          <span class="toggle-text">${app.category === 'productivity' ? 'Allowed' : 'Blocked'}</span>
        </button>
      `;
      
      appsContainer.appendChild(appItem);
    });

    // Add event listeners for toggle buttons
    appsContainer.addEventListener('click', (e) => {
      if (e.target.closest('.toggle-app-btn')) {
        const button = e.target.closest('.toggle-app-btn');
        const appName = button.dataset.app;
        this.toggleAppBlock(appName);
      }
    });
  }

  setupEventListeners() {
    // Start focus session
    document.getElementById('start-focus-btn').addEventListener('click', () => {
      this.startFocusSession();
    });

    // Pause/resume session
    document.getElementById('pause-btn').addEventListener('click', () => {
      this.pauseSession();
    });

    // Stop session
    document.getElementById('stop-btn').addEventListener('click', () => {
      this.stopSession();
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.isLocked) {
        // Prevent certain keyboard shortcuts during locked session
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
        }
      }
    });
  }

  async startFocusSession() {
    const taskInput = document.getElementById('task-input');
    const task = taskInput.value.trim();

    if (!task) {
      alert('Please enter what you want to focus on!');
      return;
    }

    if (!this.selectedMode) {
      alert('Please select a focus mode!');
      return;
    }

    const duration = this.selectedMode.id === 'custom' ? 25 : this.selectedMode.duration; // Default to 25 if custom
    const blockedApps = this.getBlockedApps();

    const sessionData = {
      task,
      duration: duration * 60, // Convert to seconds
      blockedApps,
      startTime: new Date().toISOString()
    };

    try {
      if (this.isElectron) {
        const result = await window.electronAPI.startFocusLock(sessionData);
        if (result.success) {
          this.currentSession = sessionData;
          this.isLocked = true;
          this.timeRemaining = duration * 60;
          this.distractions = 0;
          this.showLockScreen();
          this.startTimer();
        } else {
          alert('Failed to start focus session: ' + result.error);
        }
      } else {
        // Fallback for web version
        this.currentSession = sessionData;
        this.isLocked = true;
        this.timeRemaining = duration * 60;
        this.distractions = 0;
        this.showLockScreen();
        this.startTimer();
      }
    } catch (error) {
      console.error('Failed to start focus session:', error);
      alert('Failed to start focus session. Please try again.');
    }
  }

  async stopSession() {
    try {
      if (this.isElectron) {
        await window.electronAPI.stopFocusLock();
      }
      
      this.isLocked = false;
      this.currentSession = null;
      this.hideLockScreen();
      this.stopTimer();
      this.updateUI();
    } catch (error) {
      console.error('Failed to stop focus session:', error);
    }
  }

  pauseSession() {
    this.isPaused = !this.isPaused;
    const pauseText = document.getElementById('pause-text');
    pauseText.textContent = this.isPaused ? 'Resume' : 'Pause';
  }

  getBlockedApps() {
    const blockedApps = [];
    const appItems = document.querySelectorAll('#blocked-apps-list > div');
    
    appItems.forEach(item => {
      const button = item.querySelector('.toggle-app-btn');
      const appName = button.dataset.app;
      const isAllowed = button.classList.contains('bg-green-100');
      
      if (!isAllowed) {
        blockedApps.push({
          name: appName,
          process: appName, // Simplified for this example
          category: 'entertainment' // Default category
        });
      }
    });
    
    return blockedApps;
  }

  toggleAppBlock(appName) {
    const button = document.querySelector(`[data-app="${appName}"]`);
    const isAllowed = button.classList.contains('bg-green-100');
    
    if (isAllowed) {
      // Block the app
      button.classList.remove('bg-green-100', 'text-green-700', 'hover:bg-green-200');
      button.classList.add('bg-red-100', 'text-red-700', 'hover:bg-red-200');
      button.querySelector('.toggle-icon').textContent = '🚫';
      button.querySelector('.toggle-text').textContent = 'Blocked';
      
      // Update parent styling
      const parent = button.closest('.flex.items-center.justify-between');
      parent.classList.remove('border-green-200', 'bg-green-50');
      parent.classList.add('border-red-200', 'bg-red-50');
    } else {
      // Allow the app
      button.classList.remove('bg-red-100', 'text-red-700', 'hover:bg-red-200');
      button.classList.add('bg-green-100', 'text-green-700', 'hover:bg-green-200');
      button.querySelector('.toggle-icon').textContent = '👁️';
      button.querySelector('.toggle-text').textContent = 'Allowed';
      
      // Update parent styling
      const parent = button.closest('.flex.items-center.justify-between');
      parent.classList.remove('border-red-200', 'bg-red-50');
      parent.classList.add('border-green-200', 'bg-green-50');
    }
  }

  showLockScreen() {
    this.setupPanel.style.display = 'none';
    this.lockScreen.classList.remove('hidden');
    
    // Update lock screen content
    document.getElementById('current-task').textContent = this.currentSession.task;
    this.updateTimerDisplay();
    this.updateProgress();
  }

  hideLockScreen() {
    this.lockScreen.classList.add('hidden');
    this.setupPanel.style.display = 'block';
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.timeRemaining > 0) {
        this.timeRemaining--;
        this.updateTimerDisplay();
        this.updateProgress();
        
        if (this.timeRemaining === 0) {
          this.handleSessionComplete();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleSessionComplete() {
    this.stopTimer();
    
    // Show completion message
    const taskElement = document.getElementById('current-task');
    taskElement.innerHTML = `
      <span class="text-green-400">🎉 Session Complete!</span><br>
      Great job focusing on: <span class="text-white">${this.currentSession.task}</span>
    `;
    
    // Hide timer and show completion stats
    document.getElementById('timer-display').textContent = 'Done!';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.stopSession();
    }, 5000);
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    document.getElementById('timer-display').textContent = 
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  updateProgress() {
    if (!this.currentSession) return;
    
    const totalDuration = this.currentSession.duration;
    const elapsed = totalDuration - this.timeRemaining;
    const progress = (elapsed / totalDuration) * 100;
    
    const circle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (progress / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
  }

  updateUI() {
    // Update any UI elements that need refreshing
    if (this.isLocked) {
      document.getElementById('distractions-count').textContent = this.distractions;
      document.getElementById('apps-locked-count').textContent = this.getBlockedApps().length;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DesktopFocusLock();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DesktopFocusLock;
}
