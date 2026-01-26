const { ipcRenderer } = require('electron');

class EnhancedFocusLock {
  constructor() {
    this.isSessionActive = false;
    this.currentSession = null;
    this.runningApps = [];
    this.popularApps = [];
    this.selectedApp = null;
    this.sessionTimer = null;
    this.timeRemaining = 0;
    
    this.initializeUI();
    this.loadRunningApps();
    this.loadPopularApps();
  }

  initializeUI() {
    // Create the enhanced UI with stunning design
    document.body.innerHTML = `
      <div class="focus-lock-container">
        <div class="background-effects">
          <div class="floating-particles"></div>
          <div class="gradient-orbs">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
          </div>
        </div>
        
        <header class="focus-header">
          <div class="header-content">
            <div class="logo-container">
              <div class="logo-icon">🔒</div>
              <div class="logo-text">
                <h1>Focus Lock</h1>
                <p>Laser-focused productivity</p>
              </div>
            </div>
          </div>
        </header>

        <div class="session-setup" id="sessionSetup">
          <div class="task-input-section">
            <h2>What do you want to focus on?</h2>
            <input type="text" id="taskInput" placeholder="e.g., Study for math exam, Write report, Code project..." />
          </div>

          <div class="app-selection-section">
            <h2>Choose the app you want to use:</h2>
            
            <div class="app-selection-tabs">
              <button class="tab-btn active" data-tab="running">Currently Running</button>
              <button class="tab-btn" data-tab="popular">Popular Apps</button>
              <button class="tab-btn" data-tab="custom">Custom App</button>
              <button id="refreshApps" class="tab-btn refresh-btn" title="Refresh running apps">🔄</button>
            </div>

            <div class="app-list" id="runningAppsList">
              <div class="loading">Loading running applications...</div>
            </div>

            <div class="app-list hidden" id="popularAppsList">
              <div class="loading">Loading popular applications...</div>
            </div>

            <div class="app-list hidden" id="customAppList">
              <input type="text" id="customAppInput" placeholder="Enter app name (e.g., Visual Studio Code, Safari, etc.)" />
              <button id="addCustomApp" class="btn-secondary">Add Custom App</button>
            </div>
          </div>

          <div class="selected-app-display">
            <div id="selectedAppInfo" class="hidden">
              <h3>Selected App:</h3>
              <div class="selected-app-card">
                <span class="app-name" id="selectedAppName"></span>
                <button id="changeApp" class="btn-secondary">Change</button>
              </div>
            </div>
          </div>

          <div class="focus-mode-section">
            <h2>Focus Mode:</h2>
            <div class="focus-modes">
              <button class="focus-mode-btn active" data-mode="pomodoro">
                <span class="mode-icon">🍅</span>
                <span class="mode-name">Pomodoro</span>
                <span class="mode-duration">25 min</span>
              </button>
              <button class="focus-mode-btn" data-mode="deep-work">
                <span class="mode-icon">🧠</span>
                <span class="mode-name">Deep Work</span>
                <span class="mode-duration">90 min</span>
              </button>
              <button class="focus-mode-btn" data-mode="study">
                <span class="mode-icon">📚</span>
                <span class="mode-name">Study Session</span>
                <span class="mode-duration">45 min</span>
              </button>
              <button class="focus-mode-btn" data-mode="custom">
                <span class="mode-icon">⚙️</span>
                <span class="mode-name">Custom</span>
                <span class="mode-duration">Custom</span>
              </button>
            </div>
          </div>

          <div class="session-controls">
            <button id="startSession" class="btn-primary" disabled>
              🚀 Start Focus Lock Session
            </button>
          </div>
        </div>

        <div class="session-active hidden" id="sessionActive">
          <div class="session-header">
            <h2>Focus Session Active</h2>
            <div class="session-info">
              <span id="sessionTask">Working on: <strong id="currentTask"></strong></span>
              <span id="sessionApp">Using: <strong id="currentApp"></strong></span>
            </div>
          </div>

          <div class="timer-display">
            <div class="timer-circle">
              <svg class="timer-svg" viewBox="0 0 100 100">
                <circle class="timer-bg" cx="50" cy="50" r="45"></circle>
                <circle class="timer-progress" cx="50" cy="50" r="45" id="timerProgress"></circle>
              </svg>
              <div class="timer-text">
                <span id="timerDisplay">25:00</span>
              </div>
            </div>
          </div>

          <div class="session-controls">
            <button id="pauseSession" class="btn-secondary">⏸️ Pause</button>
            <button id="resumeSession" class="btn-secondary hidden">▶️ Resume</button>
            <button id="stopSession" class="btn-danger">⏹️ Stop Session</button>
          </div>

          <div class="session-stats">
            <div class="stat-item">
              <span class="stat-label">Apps Blocked:</span>
              <span class="stat-value" id="blockedAppsCount">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Focus Streak:</span>
              <span class="stat-value" id="focusStreak">0 days</span>
            </div>
          </div>
        </div>
      </div>

      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: #0a0a0a;
          color: #ffffff;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        .background-effects {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.2), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: float 20s linear infinite;
        }

        .gradient-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.7;
          animation: drift 15s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          top: 60%;
          right: 10%;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          bottom: 20%;
          left: 50%;
          animation-delay: 10s;
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(30px); }
          66% { transform: translateY(30px) translateX(-20px); }
          100% { transform: translateY(0px) translateX(0px); }
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 30px) scale(1.05); }
        }

        .focus-lock-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          position: relative;
          z-index: 1;
        }

        .focus-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          position: relative;
        }

        .header-content {
          position: relative;
          z-index: 2;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .logo-icon {
          font-size: 4rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }

        .logo-text h1 {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
        }

        .logo-text p {
          font-size: 1.2rem;
          color: #a1a1aa;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        @keyframes pulse-glow {
          0% { 
            filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
            transform: scale(1);
          }
          100% { 
            filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8));
            transform: scale(1.05);
          }
        }

        .session-setup, .session-active {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .session-setup::before, .session-active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        }

        .task-input-section {
          margin-bottom: 30px;
        }

        .task-input-section h2 {
          margin-bottom: 20px;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        #taskInput {
          width: 100%;
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          font-size: 16px;
          color: #ffffff;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-weight: 500;
        }

        #taskInput::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }

        #taskInput:focus {
          outline: none;
          border-color: rgba(102, 126, 234, 0.6);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 
            0 0 0 4px rgba(102, 126, 234, 0.1),
            0 8px 25px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        .app-selection-section {
          margin-bottom: 30px;
        }

        .app-selection-section h2 {
          margin-bottom: 25px;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .app-selection-tabs {
          display: flex;
          margin-bottom: 25px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 6px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-btn {
          background: transparent;
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          transition: all 0.3s ease;
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .tab-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tab-btn:hover::before {
          opacity: 1;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .refresh-btn {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white !important;
          border-radius: 12px;
          margin-left: 8px;
          font-size: 16px;
          padding: 12px 16px;
          min-width: 50px;
          box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
        }

        .refresh-btn:hover {
          transform: rotate(180deg) scale(1.1);
          box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
        }

        .app-list {
          min-height: 200px;
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #e1e5e9;
          border-radius: 10px;
          padding: 15px;
        }

        .app-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-bottom: 5px;
        }

        .app-item:hover {
          background-color: #f8f9fa;
        }

        .app-item.selected {
          background-color: #667eea;
          color: white;
        }

        .app-icon {
          width: 24px;
          height: 24px;
          margin-right: 10px;
          background-color: #ddd;
          border-radius: 4px;
        }

        .app-name {
          flex: 1;
          font-weight: 500;
        }

        .app-status {
          font-size: 12px;
          color: #28a745;
        }

        .selected-app-display {
          margin-bottom: 30px;
        }

        .selected-app-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 10px;
          border: 2px solid #667eea;
        }

        .focus-mode-section {
          margin-bottom: 30px;
        }

        .focus-mode-section h2 {
          margin-bottom: 25px;
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .focus-modes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }

        .focus-mode-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .focus-mode-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .focus-mode-btn:hover {
          border-color: rgba(102, 126, 234, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .focus-mode-btn:hover::before {
          opacity: 1;
        }

        .focus-mode-btn.active {
          border-color: rgba(102, 126, 234, 0.8);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .mode-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }

        .mode-name {
          font-weight: 700;
          margin-bottom: 8px;
          color: #ffffff;
          font-size: 16px;
          position: relative;
          z-index: 1;
        }

        .mode-duration {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .session-controls {
          text-align: center;
        }

        .btn-primary, .btn-secondary, .btn-danger {
          padding: 18px 36px;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 12px;
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-primary:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-secondary {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
        }

        .btn-danger {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
        }

        .btn-primary:hover:not(:disabled),
        .btn-secondary:hover,
        .btn-danger:hover {
          transform: translateY(-4px);
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary:hover {
          box-shadow: 0 12px 35px rgba(79, 172, 254, 0.4);
        }

        .btn-danger:hover {
          box-shadow: 0 12px 35px rgba(240, 147, 251, 0.4);
        }

        .timer-display {
          text-align: center;
          margin: 30px 0;
        }

        .timer-circle {
          position: relative;
          display: inline-block;
        }

        .timer-svg {
          width: 200px;
          height: 200px;
          transform: rotate(-90deg);
        }

        .timer-bg {
          fill: none;
          stroke: #e1e5e9;
          stroke-width: 8;
        }

        .timer-progress {
          fill: none;
          stroke: #667eea;
          stroke-width: 8;
          stroke-linecap: round;
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          transition: stroke-dashoffset 1s ease-in-out;
        }

        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }

        .session-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .session-info {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
          color: #666;
        }

        .session-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .stat-value {
          display: block;
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .hidden {
          display: none !important;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .loading-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          font-weight: 500;
        }

        .fallback-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .fallback-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }

        .fallback-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fallback-message {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .fallback-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .fallback-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      </style>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Task input
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('input', () => this.updateStartButton());

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Focus mode selection
    document.querySelectorAll('.focus-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectFocusMode(e.target.dataset.mode));
    });

    // Session controls
    document.getElementById('startSession').addEventListener('click', () => this.startSession());
    document.getElementById('pauseSession').addEventListener('click', () => this.pauseSession());
    document.getElementById('resumeSession').addEventListener('click', () => this.resumeSession());
    document.getElementById('stopSession').addEventListener('click', () => this.stopSession());

    // Custom app input
    document.getElementById('addCustomApp').addEventListener('click', () => this.addCustomApp());
    document.getElementById('customAppInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addCustomApp();
    });

    // Change app button
    document.getElementById('changeApp').addEventListener('click', () => this.showAppSelection());

    // Refresh apps button
    document.getElementById('refreshApps').addEventListener('click', () => this.refreshRunningApps());
  }

  async loadRunningApps() {
    try {
      // Show loading state with better animation
      const container = document.getElementById('runningAppsList');
      container.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">🔍 Detecting your applications...</div>
        </div>
      `;
      
      // Add a small delay to show the loading animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await window.electronAPI.getRunningApps();
      if (result && result.success && result.apps && result.apps.length > 0) {
        this.runningApps = result.apps;
        this.renderAppList('runningAppsList', this.runningApps);
      } else {
        // Show a more helpful fallback
        container.innerHTML = `
          <div class="fallback-container">
            <div class="fallback-icon">🎯</div>
            <div class="fallback-title">Ready to Focus!</div>
            <div class="fallback-message">
              Choose from popular apps below or enter a custom app name
            </div>
            <button class="fallback-btn" onclick="document.querySelector('[data-tab=popular]').click()">
              Browse Popular Apps
            </button>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading running apps:', error);
      const container = document.getElementById('runningAppsList');
      container.innerHTML = `
        <div class="fallback-container">
          <div class="fallback-icon">✨</div>
          <div class="fallback-title">Let's Get Started!</div>
          <div class="fallback-message">
            Choose your focus app from the Popular Apps tab or enter a custom name
          </div>
          <button class="fallback-btn" onclick="document.querySelector('[data-tab=popular]').click()">
            Explore Popular Apps
          </button>
        </div>
      `;
    }
  }

  async loadPopularApps() {
    try {
      const result = await window.electronAPI.getPopularApps();
      if (result.success) {
        this.popularApps = result.apps;
        this.renderAppList('popularAppsList', this.popularApps);
      }
    } catch (error) {
      console.error('Error loading popular apps:', error);
    }
  }

  renderAppList(containerId, apps) {
    const container = document.getElementById(containerId);
    if (apps.length === 0) {
      container.innerHTML = '<div class="loading">No applications found</div>';
      return;
    }

    container.innerHTML = apps.map(app => `
      <div class="app-item" data-app="${app}">
        <div class="app-icon"></div>
        <span class="app-name">${app}</span>
        <span class="app-status">Running</span>
      </div>
    `).join('');

    // Add click listeners
    container.querySelectorAll('.app-item').forEach(item => {
      item.addEventListener('click', () => this.selectApp(item.dataset.app));
    });
  }

  selectApp(appName) {
    this.selectedApp = appName;
    
    // Update UI
    document.querySelectorAll('.app-item').forEach(item => {
      item.classList.remove('selected');
    });
    document.querySelector(`[data-app="${appName}"]`).classList.add('selected');

    // Show selected app info
    document.getElementById('selectedAppName').textContent = appName;
    document.getElementById('selectedAppInfo').classList.remove('hidden');

    this.updateStartButton();
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Show/hide tab content
    document.querySelectorAll('.app-list').forEach(list => {
      list.classList.add('hidden');
    });
    document.getElementById(`${tabName}AppsList`).classList.remove('hidden');
  }

  selectFocusMode(mode) {
    document.querySelectorAll('.focus-mode-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  }

  updateStartButton() {
    const taskInput = document.getElementById('taskInput');
    const startBtn = document.getElementById('startSession');
    
    const hasTask = taskInput.value.trim().length > 0;
    const hasApp = this.selectedApp !== null;
    
    startBtn.disabled = !(hasTask && hasApp);
  }

  async startSession() {
    const task = document.getElementById('taskInput').value.trim();
    const selectedMode = document.querySelector('.focus-mode-btn.active').dataset.mode;
    
    const sessionData = {
      task,
      allowedApp: this.selectedApp,
      focusMode: selectedMode,
      duration: this.getModeDuration(selectedMode),
      timestamp: Date.now()
    };

    try {
      const result = await window.electronAPI.startFocusLock(sessionData);
      if (result.success) {
        this.currentSession = sessionData;
        this.isSessionActive = true;
        this.timeRemaining = sessionData.duration * 60; // Convert to seconds
        
        this.showSessionActive();
        this.startTimer();
        this.updateSessionInfo();
      } else {
        alert('Failed to start session: ' + result.error);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting session: ' + error.message);
    }
  }

  getModeDuration(mode) {
    const durations = {
      'pomodoro': 25,
      'deep-work': 90,
      'study': 45,
      'custom': 30
    };
    return durations[mode] || 25;
  }

  showSessionActive() {
    document.getElementById('sessionSetup').classList.add('hidden');
    document.getElementById('sessionActive').classList.remove('hidden');
  }

  showSessionSetup() {
    document.getElementById('sessionActive').classList.add('hidden');
    document.getElementById('sessionSetup').classList.remove('hidden');
  }

  startTimer() {
    this.sessionTimer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        this.completeSession();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timerDisplay').textContent = display;
    
    // Update progress circle
    const totalTime = this.currentSession.duration * 60;
    const progress = (totalTime - this.timeRemaining) / totalTime;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress * circumference);
    
    document.getElementById('timerProgress').style.strokeDashoffset = offset;
  }

  updateSessionInfo() {
    document.getElementById('currentTask').textContent = this.currentSession.task;
    document.getElementById('currentApp').textContent = this.currentSession.allowedApp;
  }

  pauseSession() {
    clearInterval(this.sessionTimer);
    document.getElementById('pauseSession').classList.add('hidden');
    document.getElementById('resumeSession').classList.remove('hidden');
  }

  resumeSession() {
    this.startTimer();
    document.getElementById('pauseSession').classList.remove('hidden');
    document.getElementById('resumeSession').classList.add('hidden');
  }

  async stopSession() {
    clearInterval(this.sessionTimer);
    
    try {
      await window.electronAPI.stopFocusLock();
      this.isSessionActive = false;
      this.currentSession = null;
      this.showSessionSetup();
      this.resetUI();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  }

  async completeSession() {
    clearInterval(this.sessionTimer);
    
    // Show completion message
    alert('🎉 Focus session completed! Great job staying focused!');
    
    try {
      await window.electronAPI.stopFocusLock();
      this.isSessionActive = false;
      this.currentSession = null;
      this.showSessionSetup();
      this.resetUI();
    } catch (error) {
      console.error('Error completing session:', error);
    }
  }

  resetUI() {
    document.getElementById('taskInput').value = '';
    this.selectedApp = null;
    document.getElementById('selectedAppInfo').classList.add('hidden');
    this.updateStartButton();
  }

  addCustomApp() {
    const customInput = document.getElementById('customAppInput');
    const appName = customInput.value.trim();
    
    if (appName) {
      this.selectApp(appName);
      customInput.value = '';
    }
  }

  showAppSelection() {
    document.getElementById('selectedAppInfo').classList.add('hidden');
    this.selectedApp = null;
    this.updateStartButton();
  }

  async refreshRunningApps() {
    console.log('Refreshing running apps...');
    await this.loadRunningApps();
  }
}

// Initialize the enhanced focus lock when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedFocusLock();
});
