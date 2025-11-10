const Store = require('electron-store');

class AmbientFeatures {
  constructor() {
    this.store = new Store();
    this.audioContext = null;
    this.currentSound = null;
    this.lightingEffects = null;
    this.ambientSettings = this.loadAmbientSettings();
    this.isActive = false;
  }

  // Load ambient settings from storage
  loadAmbientSettings() {
    return this.store.get('ambientSettings', {
      sounds: {
        enabled: true,
        volume: 0.3,
        currentSound: 'focus',
        autoPlay: true,
        fadeIn: true,
        fadeOut: true,
        loop: true
      },
      lighting: {
        enabled: true,
        currentTheme: 'warm',
        brightness: 0.7,
        colorTemperature: 3000,
        adaptive: true,
        syncWithTime: true
      },
      environment: {
        temperature: 22, // Celsius
        humidity: 45,
        airQuality: 'good',
        noiseLevel: 'quiet'
      },
      effects: {
        particles: false,
        backgrounds: true,
        transitions: true,
        breathing: false,
        pulse: false
      }
    });
  }

  // Initialize ambient features
  initializeAmbientFeatures() {
    if (this.ambientSettings.sounds.enabled) {
      this.initializeAudio();
    }
    
    if (this.ambientSettings.lighting.enabled) {
      this.initializeLighting();
    }
    
    this.isActive = true;
    console.log('Ambient features initialized');
  }

  // Initialize audio system
  initializeAudio() {
    try {
      // Create audio context for web audio API
      if (typeof AudioContext !== 'undefined') {
        this.audioContext = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        this.audioContext = new webkitAudioContext();
      }
      
      if (this.audioContext) {
        console.log('Audio context initialized');
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  // Initialize lighting system
  initializeLighting() {
    // This would integrate with smart lighting systems
    // For now, we'll manage virtual lighting effects
    this.lightingEffects = {
      currentTheme: this.ambientSettings.lighting.currentTheme,
      brightness: this.ambientSettings.lighting.brightness,
      colorTemperature: this.ambientSettings.lighting.colorTemperature,
      isAdaptive: this.ambientSettings.lighting.adaptive
    };
    
    this.applyLightingTheme(this.lightingEffects.currentTheme);
  }

  // Available ambient sounds
  getAvailableSounds() {
    return {
      'focus': {
        name: 'Deep Focus',
        description: 'Minimal ambient tones for deep concentration',
        duration: 'infinite',
        category: 'focus',
        file: 'sounds/focus.mp3',
        frequency: [432, 528, 639],
        volume: 0.3
      },
      'nature': {
        name: 'Forest Sounds',
        description: 'Gentle nature sounds for relaxation and focus',
        duration: 'infinite',
        category: 'nature',
        file: 'sounds/forest.mp3',
        frequency: [200, 400, 800],
        volume: 0.4
      },
      'rain': {
        name: 'Rain & Thunder',
        description: 'Calming rain sounds with distant thunder',
        duration: 'infinite',
        category: 'nature',
        file: 'sounds/rain.mp3',
        frequency: [100, 200, 400],
        volume: 0.5
      },
      'ocean': {
        name: 'Ocean Waves',
        description: 'Rhythmic ocean waves for meditation and study',
        duration: 'infinite',
        category: 'nature',
        file: 'sounds/ocean.mp3',
        frequency: [150, 300, 600],
        volume: 0.4
      },
      'library': {
        name: 'Library Ambiance',
        description: 'Subtle library sounds for academic focus',
        duration: 'infinite',
        category: 'academic',
        file: 'sounds/library.mp3',
        frequency: [250, 500, 1000],
        volume: 0.2
      },
      'cafe': {
        name: 'Coffee Shop',
        description: 'Gentle cafe ambiance for creative work',
        duration: 'infinite',
        category: 'social',
        file: 'sounds/cafe.mp3',
        frequency: [300, 600, 1200],
        volume: 0.3
      },
      'meditation': {
        name: 'Meditation Bells',
        description: 'Soft meditation bells for mindfulness',
        duration: 'infinite',
        category: 'meditation',
        file: 'sounds/meditation.mp3',
        frequency: [256, 512, 1024],
        volume: 0.3
      },
      'energetic': {
        name: 'Energetic Focus',
        description: 'Upbeat ambient music for motivation',
        duration: 'infinite',
        category: 'motivation',
        file: 'sounds/energetic.mp3',
        frequency: [400, 800, 1600],
        volume: 0.4
      },
      'silence': {
        name: 'Pure Silence',
        description: 'Complete silence for maximum concentration',
        duration: 'infinite',
        category: 'minimal',
        file: null,
        frequency: [],
        volume: 0
      }
    };
  }

  // Play ambient sound
  playSound(soundId) {
    if (!this.ambientSettings.sounds.enabled) return;

    const sounds = this.getAvailableSounds();
    const sound = sounds[soundId];
    
    if (!sound) {
      console.error('Sound not found:', soundId);
      return;
    }

    // Stop current sound
    this.stopSound();

    if (sound.file) {
      // Send audio command to renderer process
      if (global.mainWindow) {
        global.mainWindow.webContents.send('play-ambient-sound', {
          soundId,
          sound,
          volume: this.ambientSettings.sounds.volume,
          loop: this.ambientSettings.sounds.loop,
          fadeIn: this.ambientSettings.sounds.fadeIn,
          fadeOut: this.ambientSettings.sounds.fadeOut
        });
      }
    }

    this.currentSound = soundId;
    this.ambientSettings.sounds.currentSound = soundId;
    this.store.set('ambientSettings', this.ambientSettings);
  }

  // Stop ambient sound
  stopSound() {
    if (global.mainWindow) {
      global.mainWindow.webContents.send('stop-ambient-sound', {
        fadeOut: this.ambientSettings.sounds.fadeOut
      });
    }
    
    this.currentSound = null;
  }

  // Adjust sound volume
  adjustVolume(volume) {
    this.ambientSettings.sounds.volume = Math.max(0, Math.min(1, volume));
    this.store.set('ambientSettings', this.ambientSettings);
    
    if (global.mainWindow) {
      global.mainWindow.webContents.send('adjust-sound-volume', {
        volume: this.ambientSettings.sounds.volume
      });
    }
  }

  // Available lighting themes
  getAvailableLightingThemes() {
    return {
      'warm': {
        name: 'Warm Focus',
        description: 'Soft warm light for comfortable studying',
        color: '#FFE5B4',
        temperature: 3000,
        brightness: 0.7,
        effect: 'warm-glow'
      },
      'cool': {
        name: 'Cool Concentration',
        description: 'Bright cool light for alertness',
        color: '#E6F3FF',
        temperature: 6500,
        brightness: 0.8,
        effect: 'cool-bright'
      },
      'neutral': {
        name: 'Balanced Light',
        description: 'Natural balanced lighting',
        color: '#FFFFFF',
        temperature: 4000,
        brightness: 0.75,
        effect: 'natural'
      },
      'dim': {
        name: 'Soft Dim',
        description: 'Gentle dim light for evening study',
        color: '#F0F0F0',
        temperature: 2700,
        brightness: 0.5,
        effect: 'soft-dim'
      },
      'exam-bright': {
        name: 'Exam Bright',
        description: 'Maximum brightness for intense focus',
        color: '#FFFFFF',
        temperature: 7000,
        brightness: 0.9,
        effect: 'exam-bright'
      },
      'meditation': {
        name: 'Meditation Soft',
        description: 'Very soft light for mindfulness',
        color: '#FFF8DC',
        temperature: 2500,
        brightness: 0.3,
        effect: 'meditation-glow'
      },
      'adaptive': {
        name: 'Adaptive Lighting',
        description: 'Automatically adjusts based on time of day',
        color: 'dynamic',
        temperature: 'dynamic',
        brightness: 'dynamic',
        effect: 'adaptive'
      }
    };
  }

  // Apply lighting theme
  applyLightingTheme(themeId) {
    if (!this.ambientSettings.lighting.enabled) return;

    const themes = this.getAvailableLightingThemes();
    const theme = themes[themeId];
    
    if (!theme) {
      console.error('Lighting theme not found:', themeId);
      return;
    }

    // Send lighting command to renderer
    if (global.mainWindow) {
      global.mainWindow.webContents.send('apply-lighting-theme', {
        themeId,
        theme,
        settings: this.ambientSettings.lighting
      });
    }

    this.lightingEffects.currentTheme = themeId;
    this.ambientSettings.lighting.currentTheme = themeId;
    this.store.set('ambientSettings', this.ambientSettings);
  }

  // Adjust lighting brightness
  adjustBrightness(brightness) {
    this.ambientSettings.lighting.brightness = Math.max(0.1, Math.min(1, brightness));
    this.store.set('ambientSettings', this.ambientSettings);
    
    if (global.mainWindow) {
      global.mainWindow.webContents.send('adjust-lighting-brightness', {
        brightness: this.ambientSettings.lighting.brightness
      });
    }
  }

  // Set color temperature
  setColorTemperature(temperature) {
    this.ambientSettings.lighting.colorTemperature = Math.max(2000, Math.min(8000, temperature));
    this.store.set('ambientSettings', this.ambientSettings);
    
    if (global.mainWindow) {
      global.mainWindow.webContents.send('set-color-temperature', {
        temperature: this.ambientSettings.lighting.colorTemperature
      });
    }
  }

  // Enable adaptive lighting
  enableAdaptiveLighting() {
    this.ambientSettings.lighting.adaptive = true;
    this.store.set('ambientSettings', this.ambientSettings);
    
    // Start adaptive lighting timer
    this.startAdaptiveLighting();
  }

  // Disable adaptive lighting
  disableAdaptiveLighting() {
    this.ambientSettings.lighting.adaptive = false;
    this.store.set('ambientSettings', this.ambientSettings);
    
    if (this.adaptiveLightingTimer) {
      clearInterval(this.adaptiveLightingTimer);
      this.adaptiveLightingTimer = null;
    }
  }

  // Start adaptive lighting
  startAdaptiveLighting() {
    if (this.adaptiveLightingTimer) {
      clearInterval(this.adaptiveLightingTimer);
    }
    
    this.adaptiveLightingTimer = setInterval(() => {
      this.updateAdaptiveLighting();
    }, 60000); // Update every minute
    
    this.updateAdaptiveLighting(); // Initial update
  }

  // Update adaptive lighting based on time
  updateAdaptiveLighting() {
    const now = new Date();
    const hour = now.getHours();
    
    let themeId;
    let brightness;
    
    if (hour >= 6 && hour < 10) {
      // Morning: Cool and bright
      themeId = 'cool';
      brightness = 0.8;
    } else if (hour >= 10 && hour < 14) {
      // Midday: Neutral
      themeId = 'neutral';
      brightness = 0.75;
    } else if (hour >= 14 && hour < 18) {
      // Afternoon: Warm
      themeId = 'warm';
      brightness = 0.7;
    } else if (hour >= 18 && hour < 22) {
      // Evening: Dim warm
      themeId = 'dim';
      brightness = 0.6;
    } else {
      // Night: Very dim
      themeId = 'meditation';
      brightness = 0.3;
    }
    
    this.applyLightingTheme(themeId);
    this.adjustBrightness(brightness);
  }

  // Get ambient effects
  getAvailableEffects() {
    return {
      'particles': {
        name: 'Floating Particles',
        description: 'Subtle floating particles for visual interest',
        type: 'visual',
        intensity: 0.3
      },
      'backgrounds': {
        name: 'Dynamic Backgrounds',
        description: 'Slowly changing background gradients',
        type: 'visual',
        intensity: 0.5
      },
      'transitions': {
        name: 'Smooth Transitions',
        description: 'Smooth transitions between focus states',
        type: 'visual',
        intensity: 0.4
      },
      'breathing': {
        name: 'Breathing Guide',
        description: 'Visual breathing guide for relaxation',
        type: 'interactive',
        intensity: 0.6
      },
      'pulse': {
        name: 'Focus Pulse',
        description: 'Gentle pulsing effect for concentration',
        type: 'visual',
        intensity: 0.2
      }
    };
  }

  // Enable effect
  enableEffect(effectId) {
    this.ambientSettings.effects[effectId] = true;
    this.store.set('ambientSettings', this.ambientSettings);
    
    if (global.mainWindow) {
      global.mainWindow.webContents.send('enable-ambient-effect', {
        effectId,
        effect: this.getAvailableEffects()[effectId]
      });
    }
  }

  // Disable effect
  disableEffect(effectId) {
    this.ambientSettings.effects[effectId] = false;
    this.store.set('ambientSettings', this.ambientSettings);
    
    if (global.mainWindow) {
      global.mainWindow.webContents.send('disable-ambient-effect', {
        effectId
      });
    }
  }

  // Get environment recommendations
  getEnvironmentRecommendations() {
    const recommendations = [];
    const now = new Date();
    const hour = now.getHours();
    
    // Time-based recommendations
    if (hour >= 6 && hour < 10) {
      recommendations.push({
        type: 'lighting',
        message: 'Use cool, bright lighting for morning focus',
        suggestion: 'Try the "Cool Concentration" theme',
        priority: 'medium'
      });
    } else if (hour >= 18 && hour < 22) {
      recommendations.push({
        type: 'lighting',
        message: 'Use warm, dim lighting for evening study',
        suggestion: 'Try the "Soft Dim" theme',
        priority: 'medium'
      });
    }
    
    // Sound recommendations
    const currentSound = this.currentSound;
    if (!currentSound || currentSound === 'silence') {
      recommendations.push({
        type: 'sound',
        message: 'Try ambient sounds for better focus',
        suggestion: 'Start with "Deep Focus" or "Forest Sounds"',
        priority: 'low'
      });
    }
    
    // Effect recommendations
    if (!this.ambientSettings.effects.backgrounds) {
      recommendations.push({
        type: 'effect',
        message: 'Enable dynamic backgrounds for visual appeal',
        suggestion: 'Turn on "Dynamic Backgrounds" in effects',
        priority: 'low'
      });
    }
    
    return recommendations;
  }

  // Update ambient settings
  updateAmbientSettings(newSettings) {
    this.ambientSettings = { ...this.ambientSettings, ...newSettings };
    this.store.set('ambientSettings', this.ambientSettings);
    
    // Apply changes
    if (newSettings.sounds) {
      if (newSettings.sounds.enabled && !this.isActive) {
        this.initializeAudio();
      }
    }
    
    if (newSettings.lighting) {
      if (newSettings.lighting.enabled && !this.isActive) {
        this.initializeLighting();
      }
      
      if (newSettings.lighting.adaptive) {
        this.enableAdaptiveLighting();
      } else {
        this.disableAdaptiveLighting();
      }
    }
    
    return { success: true, settings: this.ambientSettings };
  }

  // Get current ambient status
  getAmbientStatus() {
    return {
      isActive: this.isActive,
      currentSound: this.currentSound,
      currentTheme: this.lightingEffects?.currentTheme,
      settings: this.ambientSettings,
      recommendations: this.getEnvironmentRecommendations()
    };
  }

  // Stop all ambient features
  stopAmbientFeatures() {
    this.stopSound();
    this.disableAdaptiveLighting();
    this.isActive = false;
    
    if (global.mainWindow) {
      global.mainWindow.webContents.send('stop-all-ambient-features');
    }
    
    console.log('Ambient features stopped');
  }

  // Export ambient data
  exportAmbientData() {
    return {
      settings: this.ambientSettings,
      currentSound: this.currentSound,
      currentTheme: this.lightingEffects?.currentTheme,
      status: this.getAmbientStatus(),
      exportDate: new Date().toISOString()
    };
  }
}

module.exports = AmbientFeatures;
