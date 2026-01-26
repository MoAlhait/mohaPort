#!/usr/bin/env node

// Post-install script for Focus Lock Desktop App
console.log('🔒 Setting up Focus Lock Desktop App...');

const fs = require('fs');
const path = require('path');

// Create necessary directories
const directories = [
  'logs',
  'backups',
  'temp'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create log files
const logFiles = [
  'logs/activity.log',
  'logs/errors.log',
  'logs/sessions.log'
];

logFiles.forEach(logFile => {
  const filePath = path.join(__dirname, '..', logFile);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `# Focus Lock Desktop - ${path.basename(logFile)}\n# Created on ${new Date().toISOString()}\n`);
    console.log(`✅ Created log file: ${logFile}`);
  }
});

// Set up configuration
const configPath = path.join(__dirname, '..', 'config.json');
if (!fs.existsSync(configPath)) {
  const defaultConfig = {
    "app": {
      "name": "Focus Lock Desktop",
      "version": "1.0.0",
      "autoStart": false,
      "minimizeToTray": true
    },
    "blocking": {
      "enabled": true,
      "strictMode": false,
      "emergencyTimeout": 300
    },
    "scheduling": {
      "enabled": true,
      "defaultDuration": 25,
      "breakDuration": 5
    },
    "notifications": {
      "enabled": true,
      "soundEnabled": true,
      "breakReminders": true
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log('✅ Created default configuration');
}

console.log('🎉 Focus Lock Desktop App setup complete!');
console.log('');
console.log('🚀 To run the desktop app:');
console.log('   npm start');
console.log('');
console.log('🔨 To build the desktop app:');
console.log('   npm run build-mac    # For macOS');
console.log('   npm run build-win    # For Windows');
console.log('   npm run build-linux  # For Linux');
console.log('');
console.log('📱 For the web version:');
console.log('   cd .. && npm run dev');
