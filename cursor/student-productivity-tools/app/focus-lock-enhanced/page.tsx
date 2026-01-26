'use client'

import { useState, useEffect } from 'react'
import { 
  Lock, 
  Unlock, 
  Shield, 
  Globe, 
  Monitor, 
  Settings, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Zap,
  Timer,
  TrendingUp,
  Award,
  Target,
  Calendar,
  BarChart3,
  Volume2,
  VolumeX,
  Palette,
  Star,
  Trophy,
  Flame,
  Brain,
  BookOpen,
  Coffee,
  Sun,
  Moon,
  Headphones,
  Activity,
  Users,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react'

interface FocusSession {
  id: string
  name: string
  duration: number
  isActive: boolean
  startTime?: Date
  endTime?: Date
  focusMode: string
  productivity: number
  distractions: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rarity: string
  points: number
  unlocked: boolean
  unlockedAt?: string
}

interface UserStats {
  totalSessions: number
  totalTime: number
  currentStreak: number
  longestStreak: number
  completionRate: number
  productivityRating: number
  level: number
  points: number
}

export default function FocusLockEnhanced() {
  const [isBlocking, setIsBlocking] = useState(false)
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [focusModes, setFocusModes] = useState<any[]>([])
  const [currentMode, setCurrentMode] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState('focus')
  const [ambientSound, setAmbientSound] = useState(false)
  const [lightingTheme, setLightingTheme] = useState('warm')
  const [breakStats, setBreakStats] = useState<any>(null)
  const [productivityInsights, setProductivityInsights] = useState<any[]>([])

  // Load data on component mount
  useEffect(() => {
    loadInitialData()
    
    // Set up event listeners
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.onBlockingStarted(() => setIsBlocking(true))
      ;(window as any).electronAPI.onBlockingStopped(() => setIsBlocking(false))
      ;(window as any).electronAPI.onAchievementUnlocked((achievement: any) => {
        setAchievements(prev => prev.map(a => a.id === achievement.id ? { ...a, unlocked: true } : a))
      })
    }
  }, [])

  // Update timer when session is active
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (activeSession && activeSession.isActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [activeSession, timeRemaining])

  const loadInitialData = async () => {
    if (typeof window === 'undefined' || !(window as any).electronAPI) return

    try {
      // Load user stats
      const stats = await (window as any).electronAPI.getUserStats()
      setUserStats(stats)

      // Load achievements
      const unlockedAchievements = await (window as any).electronAPI.getUnlockedAchievements()
      setAchievements(unlockedAchievements)

      // Load focus modes
      const modes = await (window as any).electronAPI.getAllFocusModes()
      setFocusModes(modes)

      // Load break stats
      const breaks = await (window as any).electronAPI.getBreakStats()
      setBreakStats(breaks)

      // Load productivity insights
      const insights = await (window as any).electronAPI.getProductivityInsights()
      setProductivityInsights(insights)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  const startSession = async (mode: any, duration?: number) => {
    if (!(window as any).electronAPI) return

    try {
      // Set current mode
      await (window as any).electronAPI.setCurrentMode(mode.id)
      setCurrentMode(mode)

      // Start blocking
      await (window as any).electronAPI.startBlocking()
      setIsBlocking(true)

      // Create session
      const session: FocusSession = {
        id: Date.now().toString(),
        name: `${mode.name} Session`,
        duration: duration || mode.duration,
        isActive: true,
        startTime: new Date(),
        focusMode: mode.id,
        productivity: 0,
        distractions: 0
      }

      setActiveSession(session)
      setTimeRemaining((duration || mode.duration) * 60)

      // Start ambient features
      if (mode.ambientSound) {
        await (window as any).electronAPI.playAmbientSound(mode.ambientSound)
        setAmbientSound(true)
      }

      if (mode.lighting) {
        await (window as any).electronAPI.applyLightingTheme(mode.lighting)
        setLightingTheme(mode.lighting)
      }

    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const stopSession = async () => {
    if (!(window as any).electronAPI) return

    try {
      await (window as any).electronAPI.stopBlocking()
      setIsBlocking(false)
      setActiveSession(null)
      setTimeRemaining(0)

      // Stop ambient features
      if (ambientSound) {
        await (window as any).electronAPI.stopAmbientSound()
        setAmbientSound(false)
      }

    } catch (error) {
      console.error('Failed to stop session:', error)
    }
  }

  const completeSession = async () => {
    if (!activeSession || !(window as any).electronAPI) return

    try {
      const completedSession = {
        ...activeSession,
        isActive: false,
        endTime: new Date(),
        completed: true,
        productivity: Math.floor(Math.random() * 40) + 60 // Simulated productivity
      }

      // Record session in analytics
      await (window as any).electronAPI.recordSession(completedSession)

      // Stop blocking
      await (window as any).electronAPI.stopBlocking()
      setIsBlocking(false)
      setActiveSession(null)
      setTimeRemaining(0)

      // Stop ambient features
      if (ambientSound) {
        await (window as any).electronAPI.stopAmbientSound()
        setAmbientSound(false)
      }

      // Refresh stats
      await loadInitialData()

    } catch (error) {
      console.error('Failed to complete session:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'uncommon': return 'text-green-600 bg-green-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isBlocking ? 'bg-red-500 animate-pulse' : 'bg-green-500'
              }`}>
                {isBlocking ? <Lock className="w-7 h-7 text-white" /> : <Unlock className="w-7 h-7 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Focus Lock Enhanced</h1>
                <p className="text-sm text-gray-600">
                  {isBlocking ? 'Deep Focus Active' : 'Ready for Productivity'}
                </p>
              </div>
            </div>
            
            {/* User Level Badge */}
            {userStats && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Level {userStats.level}</div>
                  <div className="text-xs text-gray-500">{userStats.points} XP</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {[
            { id: 'focus', name: 'Focus', icon: Target },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 },
            { id: 'achievements', name: 'Achievements', icon: Trophy },
            { id: 'schedules', name: 'Schedules', icon: Calendar },
            { id: 'ambient', name: 'Ambient', icon: Headphones }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Focus Tab */}
        {activeTab === 'focus' && (
          <div className="space-y-8">
            {/* Status Card */}
            <div className={`rounded-2xl p-8 shadow-lg ${
              isBlocking ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {isBlocking ? 'Deep Focus Active' : 'Ready to Focus'}
                  </h2>
                  <p className="opacity-90 text-lg">
                    {isBlocking 
                      ? `Focusing in ${currentMode?.name || 'Custom'} mode`
                      : 'Choose a focus mode to begin your productive session'
                    }
                  </p>
                  {activeSession && (
                    <div className="mt-4 flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Timer className="w-6 h-6" />
                        <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
                      </div>
                      <div className="text-lg opacity-90">
                        {activeSession.name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-5 h-5" />
                        <span>{Math.round((1 - timeRemaining / (activeSession.duration * 60)) * 100)}% Complete</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-6xl mb-2">
                    {isBlocking ? '🔒' : '🔓'}
                  </div>
                  <div className="text-lg opacity-90">
                    {isBlocking ? 'Locked In' : 'Unlocked'}
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Modes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Focus Modes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {focusModes.slice(0, 8).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => startSession(mode)}
                    disabled={isBlocking}
                    className={`p-6 rounded-xl transition-all text-left ${
                      isBlocking 
                        ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-br hover:shadow-lg hover:scale-105'
                    } ${
                      mode.id === 'pomodoro' ? 'from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100' :
                      mode.id === 'deep-work' ? 'from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100' :
                      mode.id === 'study-session' ? 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100' :
                      'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-3xl">{mode.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{mode.name}</h4>
                        <p className="text-sm text-gray-600">{mode.duration} min</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{mode.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Stop Session Button */}
            {isBlocking && (
              <div className="text-center">
                <button
                  onClick={stopSession}
                  className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Unlock className="w-6 h-6" />
                    <span>Stop Focus Session</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            {userStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Sessions</p>
                      <p className="text-2xl font-bold text-gray-800">{userStats.totalSessions}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Time</p>
                      <p className="text-2xl font-bold text-gray-800">{Math.round(userStats.totalTime / 60)}h</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Current Streak</p>
                      <p className="text-2xl font-bold text-gray-800">{userStats.currentStreak} days</p>
                    </div>
                    <Flame className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Productivity</p>
                      <p className="text-2xl font-bold text-gray-800">{Math.round(userStats.productivityRating)}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Break Stats */}
            {breakStats && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Break Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{breakStats.todayBreaks}</div>
                    <div className="text-sm text-gray-600">Breaks Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{breakStats.completionRate * 100}%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(breakStats.totalBreakTime / 60)}m</div>
                    <div className="text-sm text-gray-600">Total Break Time</div>
                  </div>
                </div>
              </div>
            )}

            {/* Productivity Insights */}
            {productivityInsights.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Productivity Insights</h3>
                <div className="space-y-4">
                  {productivityInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Brain className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900">{insight.title}</h4>
                          <p className="text-blue-800 text-sm mt-1">{insight.description}</p>
                          <p className="text-blue-700 text-sm mt-2 font-medium">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            {/* Achievement Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Achievement Progress</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {achievements.filter(a => a.unlocked).length} / {achievements.length}
                  </div>
                  <div className="text-sm text-gray-600">Achievements Unlocked</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-xl shadow-lg transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200' 
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">{achievement.points} XP</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="mt-3 text-xs text-gray-500">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Scheduled Sessions</h3>
              <p className="text-gray-600 mb-6">Set up recurring focus sessions to maintain consistent productivity habits.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-800 mb-2">Create New Schedule</h4>
                  <p className="text-sm text-gray-600 mb-4">Set up recurring focus sessions</p>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    New Schedule
                  </button>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Smart Scheduling</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Based on your productivity patterns, we recommend scheduling focus sessions during your peak hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Tab */}
        {activeTab === 'ambient' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Ambient Environment</h3>
              
              {/* Sound Controls */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Ambient Sounds</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['focus', 'nature', 'rain', 'ocean'].map((sound) => (
                    <button
                      key={sound}
                      onClick={() => (window as any).electronAPI?.playAmbientSound(sound)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        ambientSound ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Headphones className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium capitalize">{sound}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Controls */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Lighting Themes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['warm', 'cool', 'dim', 'adaptive'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        (window as any).electronAPI?.applyLightingTheme(theme)
                        setLightingTheme(theme)
                      }}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        lightingTheme === theme ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {theme === 'warm' ? <Sun className="w-6 h-6 mx-auto mb-2" /> :
                       theme === 'cool' ? <Sun className="w-6 h-6 mx-auto mb-2" /> :
                       theme === 'dim' ? <Moon className="w-6 h-6 mx-auto mb-2" /> :
                       <RefreshCw className="w-6 h-6 mx-auto mb-2" />}
                      <div className="text-sm font-medium capitalize">{theme}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Controls */}
              <div className="flex space-x-4">
                <button
                  onClick={() => (window as any).electronAPI?.stopAmbientSound()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>Stop All</span>
                </button>
                <button
                  onClick={() => (window as any).electronAPI?.updateAmbientSettings({ sounds: { enabled: !ambientSound } })}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{ambientSound ? 'Disable' : 'Enable'} Sounds</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
