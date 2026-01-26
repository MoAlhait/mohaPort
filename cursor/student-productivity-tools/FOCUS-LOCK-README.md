# 🔒 Focus Lock - Distraction Blocking App

**Focus Lock** is a powerful Pomodoro application that actually **blocks you out of distractions** and forces you to focus on your chosen task. Unlike regular timers, Focus Lock implements system-level blocking to prevent access to distracting websites and applications.

## 🎯 What Makes Focus Lock Different

### Traditional Pomodoro Timer
- ⏰ Just a timer
- 📱 You can still access distractions
- 🤔 Easy to ignore and get distracted

### Focus Lock
- 🔒 **Actually blocks distracting apps and websites**
- 🚫 **System-level blocking** - you can't access them even if you try
- 🎯 **Forces focus** on your chosen task
- 🛡️ **Lock screen** prevents bypassing
- 📊 **Tracks distractions** and focus metrics

## 🚀 Features

### Core Functionality
- **Task-Focused Sessions**: Enter what you want to focus on
- **Multiple Focus Modes**: Pomodoro, Deep Work, Study Session, Quick Focus, Custom
- **System-Level Blocking**: Actually blocks apps and websites
- **Visual Lock Screen**: Immersive focus environment
- **Real-Time Monitoring**: Detects and blocks attempts to access distractions

### Blocking Capabilities
- **App Blocking**: Kills distracting applications
- **Website Blocking**: Blocks distracting websites via hosts file
- **Dock Icon Hiding**: Hides icons for blocked apps
- **Notification Blocking**: Disables notifications from blocked apps
- **Process Monitoring**: Continuously monitors for blocked apps trying to restart

### Focus Modes
1. **Pomodoro** (25 min) - Classic focus + break cycle
2. **Deep Work** (90 min) - Extended intense focus session
3. **Study Session** (45 min) - Optimal academic focus time
4. **Quick Focus** (15 min) - Rapid task completion
5. **Custom** - Set your own duration (5-180 minutes)

## 🛠️ How It Works

### 1. Session Setup
```
Enter Task → Select Focus Mode → Configure Blocked Apps → Start Session
```

### 2. Blocking Process
1. **Warning Screen**: 3-second countdown before locking
2. **App Termination**: Kills all distracting applications
3. **Website Blocking**: Modifies hosts file to block websites
4. **Dock Hiding**: Hides icons for blocked apps
5. **Lock Screen**: Full-screen focus environment

### 3. Monitoring
- **Continuous Monitoring**: Checks every 5 seconds for blocked apps
- **Automatic Re-blocking**: Kills any blocked apps that try to restart
- **Distraction Tracking**: Counts attempts to access blocked content

### 4. Session Completion
- **Automatic Unblocking**: Restores all blocked content
- **Completion Celebration**: Shows success metrics
- **Data Logging**: Saves session statistics

## 📱 Supported Applications

### Social Media
- Discord, Slack, Messages
- WhatsApp, Instagram, Twitter/X
- Facebook, Snapchat, TikTok

### Entertainment
- YouTube, Netflix, Spotify
- Steam, Epic Games, Twitch
- Safari, Chrome, Firefox

### Other Distractions
- Photos, Mail (configurable)
- Calendar (configurable)
- Finder (configurable)

## 🌐 Blocked Websites

### Social Media
- facebook.com, instagram.com, twitter.com
- tiktok.com, snapchat.com, reddit.com
- discord.com, linkedin.com

### Entertainment
- youtube.com, netflix.com, twitch.tv
- hulu.com, amazon.com, ebay.com
- reddit.com, 9gag.com

### News & Distractions
- cnn.com, bbc.com, nytimes.com
- buzzfeed.com, upworthy.com
- Any custom websites you add

## 🔧 Technical Implementation

### macOS Integration
- **AppleScript**: Gracefully quits applications
- **Process Killing**: Force kills stubborn processes
- **Hosts File**: Blocks websites at system level
- **Dock API**: Hides/shows dock icons
- **Notification Center**: Manages notifications

### Security Features
- **SIP Compatibility**: Works with System Integrity Protection
- **Permission Checks**: Validates system access
- **Graceful Fallbacks**: Continues working with limited permissions
- **Backup Creation**: Backs up system files before modification

### Monitoring System
- **Process Monitoring**: Continuous app detection
- **Website Monitoring**: Blocks new website access attempts
- **Distraction Tracking**: Counts and logs distraction attempts
- **Performance Optimization**: Minimal system impact

## 🚀 Getting Started

### 1. Setup
```bash
# Run the setup script
./setup-focus-lock.sh

# For full website blocking (requires admin)
sudo ./setup-focus-lock.sh
```

### 2. Start the Application
```bash
# Start the development server
npm run dev

# Or for production
npm run build && npm start
```

### 3. Use Focus Lock
1. Go to `http://localhost:3000/focus-lock`
2. Enter what you want to focus on
3. Select your focus mode
4. Configure which apps to block
5. Click "Start Focus Lock Session"

## ⚠️ Important Notes

### Permissions Required
- **Regular User**: Can block most applications
- **Admin/Sudo**: Required for full website blocking
- **System Preferences**: May need to grant accessibility permissions

### Security Considerations
- **Hosts File**: Modified to block websites
- **Process Control**: Kills and monitors applications
- **System Integration**: Uses AppleScript and system APIs
- **Backup**: Always creates backups before modifications

### Limitations
- **SIP Protection**: Some features limited with System Integrity Protection
- **App Store Apps**: Some sandboxed apps may be harder to block
- **Browser Extensions**: May bypass website blocking
- **System Apps**: Some system apps cannot be blocked

## 🎨 User Experience

### Visual Design
- **Immersive Lock Screen**: Full-screen focus environment
- **Smooth Animations**: Fluid transitions and effects
- **Particle Effects**: Ambient background effects
- **Progress Visualization**: Real-time timer with progress

### Interaction Design
- **Warning System**: Clear warnings before locking
- **Emergency Exit**: Stop session button (hard to access)
- **Status Feedback**: Clear indication of blocking status
- **Completion Celebration**: Success animations and metrics

### Accessibility
- **Reduced Motion**: Respects system accessibility settings
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with VoiceOver
- **High Contrast**: Clear visual indicators

## 📊 Analytics & Tracking

### Session Metrics
- **Focus Duration**: Total time focused
- **Distractions Blocked**: Number of blocked access attempts
- **Apps Blocked**: List of blocked applications
- **Websites Blocked**: List of blocked websites

### Productivity Insights
- **Focus Patterns**: When you focus best
- **Distraction Sources**: Most common distractions
- **Session Success**: Completion rates
- **Improvement Trends**: Progress over time

## 🔒 Security & Privacy

### Data Handling
- **Local Storage**: All data stored locally
- **No Tracking**: No external data collection
- **System Integration**: Only uses necessary system APIs
- **Transparent Operation**: Clear logging of all actions

### System Safety
- **Backup Creation**: Always backs up modified files
- **Rollback Capability**: Can restore system to previous state
- **Permission Validation**: Checks permissions before actions
- **Graceful Degradation**: Continues working with limited permissions

## 🛠️ Troubleshooting

### Common Issues

#### Apps Not Blocking
```bash
# Check if app is running
ps aux | grep "App Name"

# Try manual blocking
osascript -e 'tell application "App Name" to quit'
```

#### Websites Still Accessible
```bash
# Check hosts file
cat /etc/hosts

# Flush DNS cache
sudo dscacheutil -flushcache
```

#### Permission Denied
```bash
# Run with admin privileges
sudo npm start

# Or grant accessibility permissions in System Preferences
```

### Log Files
- **Activity Log**: `~/.focus-lock/logs/activity.log`
- **Error Log**: `~/.focus-lock/logs/errors.log`
- **Session Log**: `~/.focus-lock/logs/sessions.log`

## 🎯 Use Cases

### Students
- **Study Sessions**: Block social media during study time
- **Exam Prep**: Lock out all distractions during exam preparation
- **Assignment Focus**: Focus on specific assignments or projects

### Professionals
- **Deep Work**: Block distractions during important tasks
- **Meeting Prep**: Focus on preparation without interruptions
- **Creative Work**: Lock out distractions during creative sessions

### General Productivity
- **Task Completion**: Focus on specific tasks until completion
- **Habit Building**: Build focus habits by removing distractions
- **Time Management**: Use timed sessions for better time management

## 🚀 Future Enhancements

### Planned Features
- **Cross-Platform**: Windows and Linux support
- **Advanced Scheduling**: Recurring focus sessions
- **Team Features**: Shared focus sessions
- **Integration**: Calendar and task manager integration
- **AI Insights**: Smart recommendations based on patterns

### Advanced Blocking
- **Network-Level**: Router-based blocking
- **Browser Extension**: Enhanced website blocking
- **Mobile Integration**: Sync with mobile devices
- **Parental Controls**: Family focus management

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Documentation**: This README and inline code comments

---

**🔒 Focus Lock - Because sometimes you need to be forced to focus!**
