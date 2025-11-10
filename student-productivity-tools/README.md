# Student Productivity Tools

A comprehensive web-based solution for college students to overcome procrastination and improve time management. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🚀 Core Features
- **Smart Dashboard**: Comprehensive analytics and productivity insights with real-time metrics
- **AI Productivity Coach**: Personalized recommendations, insights, and intelligent chat interface
- **Gamification System**: Achievements, rewards, leaderboards, and progress tracking
- **Study Groups & Social**: Join study groups, accountability partners, and collaborative features

### 🛠️ Interactive Tools
- **Advanced Pomodoro Timer**: 25-minute focused sessions with automatic breaks and progress tracking
- **Eisenhower Matrix**: Task prioritization with drag-and-drop functionality and visual progress
- **SMART Goals Tracker**: Complete goal-setting framework with progress monitoring and analytics
- **Habit Tracker**: Build positive habits with streak tracking, analytics, and progress visualization
- **Study Timer**: Advanced study sessions with ambient sounds, productivity tracking, and session analytics
- **Tools Directory**: Comprehensive reviews and comparisons of 10+ productivity tools

### 📚 Content & Resources
- **Blog Section**: 8+ evidence-based articles on productivity, time management, and study techniques
- **10 Proven Strategies**: Research-backed methodologies for improving productivity
- **Research Section**: Science and impact data on productivity solutions
- **About Page**: Creator information, mission statement, and background
- **Contact Page**: Professional feedback form and collaboration opportunities

### 🤖 AI-Powered Features
- **Personalized Insights**: AI analysis of productivity patterns and personalized recommendations
- **Smart Notifications**: Context-aware reminders and motivation based on user behavior
- **Predictive Analytics**: Trend analysis and productivity predictions
- **Voice Interface**: Voice input for hands-free interaction
- **Intelligent Suggestions**: AI-powered tips and strategy recommendations

### 🎮 Gamification Elements
- **Achievement System**: 20+ achievements with different rarity levels (Common, Rare, Epic, Legendary)
- **XP & Leveling**: Experience points, level progression, and unlockable rewards
- **Leaderboards**: Competitive rankings with friends and global community
- **Daily Challenges**: Rotating challenges with XP rewards
- **Rewards Shop**: Spend XP on premium features and customization options

### 🔧 Technical Features
- **Progressive Web App (PWA)**: Installable on mobile devices with offline capabilities
- **Desktop Application**: Cross-platform Electron app with website/app blocking capabilities
- **Website Blocker**: Blocks distracting sites during focus sessions with whitelist support
- **Application Blocker**: Prevents access to distracting desktop applications
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Local Storage**: Data persistence across sessions with cloud sync capabilities
- **Real-time Updates**: Live data synchronization and instant feedback
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized loading, smooth animations, and efficient rendering

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Fonts**: Inter (Google Fonts)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd student-productivity-tools
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Pomodoro Timer
- Start 25-minute focused work sessions
- Automatic breaks after each session
- Long breaks every 4 pomodoros
- Progress tracking and statistics

### Eisenhower Matrix
- Categorize tasks by urgency and importance
- Drag and drop between categories
- Visual progress tracking
- Task management with editing capabilities

### SMART Goals
- Create structured goals using the SMART framework
- Track progress with visual indicators
- Set deadlines and monitor completion
- Comprehensive goal analysis

## 📊 Research & Impact

- **70%** of college students report procrastination issues
- Web-based solutions **substantially reduce** procrastination
- **Significant improvement** in academic performance
- **Stress reduction** through better time management

## 🖥️ Desktop Application

### Focus Lock Desktop App
Transform the web application into a powerful desktop app that locks you out of distracting websites and applications during study sessions.

#### Features
- **Website Blocking**: Blocks Facebook, Twitter, YouTube, and other distracting sites
- **Application Blocking**: Prevents access to distracting desktop applications
- **Focus Sessions**: Quick preset sessions (25min Pomodoro, 45min Study, etc.)
- **Emergency Access**: Override blocking with confirmation dialog
- **System Tray**: Quick access from system tray
- **Cross-Platform**: Works on Windows, macOS, and Linux

#### Installation
```bash
# Navigate to desktop app directory
cd electron-app

# Install dependencies
npm install

# Build web app first
cd .. && npm run build && cd electron-app

# Start desktop app
npm start

# Build for distribution
npm run build
```

#### Usage
1. **Start a focus session** using preset buttons or custom duration
2. **Manage blocked sites** in the settings panel
3. **Emergency access** when needed with confirmation dialog
4. **System tray integration** for quick control

📖 **Detailed Guide**: See [DESKTOP-APP-GUIDE.md](./DESKTOP-APP-GUIDE.md) for complete setup and usage instructions.

## 🚀 Deployment

### Web Application

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Desktop Application
1. Build the web app: `npm run build`
2. Build the desktop app: `npm run build-desktop`
3. Distribute the files from `electron-app/dist/` directory

## 📝 Customization

All content and styling can be easily customized:
- Update strategies in the main page component
- Modify color schemes in `tailwind.config.js`
- Add new tools by creating additional pages
- Customize the research section with new data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

Created by **Mohammad Alhait**
- UC Berkeley Student
- Aspiring Product Manager
- Email: mo.alhait@gmail.com
- LinkedIn: [Mohammad Alhait](https://linkedin.com/in/mohammad-alhait-8719a0266)

---

Made with ❤️ using Next.js and Tailwind CSS
