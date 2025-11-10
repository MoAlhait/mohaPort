# 🔒 Focus Lock - Minimize Mode

**Focus Lock Minimize Mode** is a smarter, more practical approach to distraction blocking that works by minimizing non-allowed applications instead of trying to block them entirely.

## 🎯 Why Minimize Mode?

### Problems with Traditional App Blocking:
- ❌ **Complex Permissions**: Requires system-level access and admin privileges
- ❌ **Detection Issues**: Hard to reliably detect all running applications
- ❌ **Platform Differences**: Different APIs for macOS, Windows, Linux
- ❌ **User Frustration**: Completely blocking apps can be too restrictive
- ❌ **Bypass Methods**: Users can easily find ways around blocks

### Benefits of Minimize Mode:
- ✅ **No Special Permissions**: Works without admin access
- ✅ **Gentle Approach**: Apps are still accessible if really needed
- ✅ **Builds Awareness**: Shows users their distraction patterns
- ✅ **Cross-Platform**: Same approach works everywhere
- ✅ **User-Friendly**: Less frustrating than complete blocking

## 🚀 How It Works

### 1. **App Selection**
- User selects ONE application they want to use during focus session
- Examples: VS Code, Notes, Notion, Terminal, etc.

### 2. **Focus Session Start**
- User starts their focus session with their chosen app
- System begins monitoring for other applications

### 3. **Automatic Minimization**
- When user tries to open any non-allowed app, it gets minimized automatically
- User stays focused on their chosen application

### 4. **Distraction Tracking**
- System tracks how many times user tried to open distracting apps
- Provides insights into distraction patterns

## 🛠️ Implementation

### Current Mock Implementation
The current version includes a mock implementation that simulates:
- App detection and monitoring
- Minimization events
- Statistics tracking
- Session management

### Real System Implementation
For production use, the system would integrate with:

#### macOS
```javascript
// AppleScript or Accessibility API
tell application "System Events"
  set frontmostProcess to first process whose frontmost is true
  if name of frontmostProcess is "Safari" then
    tell application "Safari"
      set minimized of window 1 to true
    end tell
  end if
end tell
```

#### Windows
```javascript
// PowerShell or Windows API
Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class Win32 {
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
  }
"@
$hwnd = [Win32]::FindWindow($null, "Chrome")
[Win32]::ShowWindow($hwnd, 6) # SW_MINIMIZE = 6
```

#### Linux
```bash
# wmctrl or xdotool
wmctrl -r "Firefox" -b add,hidden
```

## 📊 Features

### Core Functionality
- **One-App Focus**: User selects single allowed application
- **Automatic Minimization**: Non-allowed apps are minimized when opened
- **Real-time Monitoring**: Continuous app detection and minimization
- **Session Tracking**: Complete focus session management
- **Statistics**: Track minimization attempts and success rates

### User Experience
- **Gentle Approach**: Apps aren't blocked, just minimized
- **Awareness Building**: Shows distraction patterns
- **Flexible**: User can still access apps if really needed
- **Educational**: Helps build better focus habits

### Analytics
- **Minimization Count**: How many times apps were minimized
- **Success Rate**: Percentage of successful minimizations
- **Most Distracting Apps**: Which apps user tries to open most
- **Session Duration**: How long focus sessions last

## 🎨 UI Components

### App Selection Interface
- Grid of available applications with icons
- Category-based organization (productivity, social, entertainment)
- Clear indication of selected allowed app
- Easy app switching between sessions

### Focus Lock Screen
- Full-screen focus mode with timer
- Shows currently allowed application
- Real-time minimization statistics
- Pause/Resume/Stop controls
- Recent minimization history

### Session Statistics
- Total minimizations during session
- Success/failure rates
- Most minimized applications
- Session duration and productivity metrics

## 🔧 Technical Architecture

### Components
- `FocusLockMinimize.tsx`: Main component with UI and state management
- `app-minimizer-mock.ts`: Mock implementation of app monitoring
- Session management and timer logic
- Statistics tracking and display

### State Management
- Current focus session state
- Allowed application selection
- Minimization history and statistics
- Timer and session controls

### Monitoring System
- Continuous app detection
- Automatic minimization triggers
- Statistics collection
- Error handling and logging

## 🚀 Getting Started

### 1. **Setup**
```bash
cd student-productivity-tools
npm install
npm run dev
```

### 2. **Navigate to Focus Lock**
Visit `/focus-lock` in your browser

### 3. **Select Your App**
Choose the one application you want to use during focus sessions

### 4. **Start Session**
Enter your task description and start your focus session

### 5. **Stay Focused**
The system will automatically minimize any other apps you try to open

## 🎯 Use Cases

### Students
- **Study Sessions**: Use Notes or Notion, minimize social media
- **Coding**: Use VS Code, minimize Discord and YouTube
- **Writing**: Use Word or Google Docs, minimize entertainment apps

### Professionals
- **Deep Work**: Use specific tools, minimize communication apps
- **Research**: Use browser with specific tabs, minimize social media
- **Creative Work**: Use design tools, minimize distractions

### General Productivity
- **Task Management**: Use task app, minimize entertainment
- **Learning**: Use educational platforms, minimize social media
- **Planning**: Use calendar/planning tools, minimize distractions

## 🔮 Future Enhancements

### Advanced Features
- **Smart App Detection**: Better detection of running applications
- **Custom Minimization Rules**: Allow multiple apps in certain categories
- **Time-based Rules**: Different rules for different times of day
- **Integration APIs**: Connect with other productivity tools

### Analytics
- **Trend Analysis**: Long-term distraction pattern insights
- **Productivity Metrics**: Correlation between focus time and productivity
- **Goal Tracking**: Progress toward focus goals
- **Export Data**: Export statistics for analysis

### User Experience
- **Customizable UI**: Themes and layout options
- **Sound Notifications**: Audio feedback for minimizations
- **Haptic Feedback**: Physical feedback on mobile devices
- **Voice Commands**: Voice control for session management

## 🤝 Contributing

This is a mock implementation designed to demonstrate the concept. For a production version, you would need to:

1. **Implement Real System APIs**: Replace mock functions with actual OS APIs
2. **Add Error Handling**: Robust error handling for system calls
3. **Security Review**: Ensure safe system access
4. **Cross-Platform Testing**: Test on multiple operating systems
5. **Performance Optimization**: Optimize for minimal system impact

## 📝 License

This project is part of the Student Productivity Tools suite. See the main project license for details.
