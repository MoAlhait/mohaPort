'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Eye,
  EyeOff,
  AppWindow,
  Minimize2,
  Maximize2,
  Monitor,
  Smartphone,
  Globe,
  Plus,
  Trash2,
  Activity
} from 'lucide-react'
import { AnimatedButton, PrimaryButton, DangerButton } from './AnimatedButton'
import { FluidTimer } from './FluidTimer'
import { ParticleSystem } from './ParticleSystem'
import { 
  fadeInUp, 
  scaleIn, 
  slideInFromTop,
  springConfig,
  smoothTransition
} from './AnimationProvider'
import { appMinimizer, MinimizationResult } from '../lib/app-minimizer-mock'

interface FocusSession {
  id: string
  task: string
  duration: number
  isActive: boolean
  isLocked: boolean
  startTime: Date | null
  endTime: Date | null
  distractions: number
  breaks: number
  allowedApp: string
}

interface App {
  name: string
  process: string
  icon: string
  category: 'productivity' | 'social' | 'entertainment' | 'other'
  isAllowed: boolean
}

const defaultApps: App[] = [
  { name: 'VS Code', process: 'Code', icon: '💻', category: 'productivity', isAllowed: false },
  { name: 'Safari', process: 'Safari', icon: '🌐', category: 'entertainment', isAllowed: false },
  { name: 'Chrome', process: 'Google Chrome', icon: '🌐', category: 'entertainment', isAllowed: false },
  { name: 'Firefox', process: 'Firefox', icon: '🦊', category: 'entertainment', isAllowed: false },
  { name: 'Discord', process: 'Discord', icon: '💬', category: 'social', isAllowed: false },
  { name: 'Slack', process: 'Slack', icon: '💼', category: 'social', isAllowed: false },
  { name: 'Messages', process: 'Messages', icon: '💬', category: 'social', isAllowed: false },
  { name: 'WhatsApp', process: 'WhatsApp', icon: '💬', category: 'social', isAllowed: false },
  { name: 'Instagram', process: 'Instagram', icon: '📸', category: 'social', isAllowed: false },
  { name: 'Twitter/X', process: 'Twitter', icon: '🐦', category: 'social', isAllowed: false },
  { name: 'YouTube', process: 'YouTube', icon: '📺', category: 'entertainment', isAllowed: false },
  { name: 'Netflix', process: 'Netflix', icon: '🎬', category: 'entertainment', isAllowed: false },
  { name: 'Spotify', process: 'Spotify', icon: '🎵', category: 'entertainment', isAllowed: false },
  { name: 'Steam', process: 'Steam', icon: '🎮', category: 'entertainment', isAllowed: false },
  { name: 'Photos', process: 'Photos', icon: '📷', category: 'other', isAllowed: false },
  { name: 'Mail', process: 'Mail', icon: '📧', category: 'productivity', isAllowed: false },
  { name: 'Calendar', process: 'Calendar', icon: '📅', category: 'productivity', isAllowed: false },
  { name: 'Finder', process: 'Finder', icon: '📁', category: 'other', isAllowed: false },
  { name: 'Notes', process: 'Notes', icon: '📝', category: 'productivity', isAllowed: false },
  { name: 'Notion', process: 'Notion', icon: '📋', category: 'productivity', isAllowed: false },
  { name: 'Obsidian', process: 'Obsidian', icon: '🔗', category: 'productivity', isAllowed: false },
  { name: 'Terminal', process: 'Terminal', icon: '💻', category: 'productivity', isAllowed: false }
]

const focusModes = [
  { id: 'pomodoro', name: 'Pomodoro', duration: 25, color: '#ef4444', description: '25 min focus + 5 min break' },
  { id: 'deep', name: 'Deep Work', duration: 90, color: '#3b82f6', description: '90 min intense focus session' },
  { id: 'study', name: 'Study Session', duration: 45, color: '#10b981', description: '45 min academic focus' },
  { id: 'quick', name: 'Quick Focus', duration: 15, color: '#f59e0b', description: '15 min rapid task completion' },
  { id: 'custom', name: 'Custom', duration: 0, color: '#8b5cf6', description: 'Set your own duration' }
]

export const FocusLockMinimize: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [selectedMode, setSelectedMode] = useState(focusModes[0])
  const [customDuration, setCustomDuration] = useState(25)
  const [taskDescription, setTaskDescription] = useState('')
  const [apps, setApps] = useState<App[]>(defaultApps)
  const [showSettings, setShowSettings] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [distractions, setDistractions] = useState(0)
  const [allowedApp, setAllowedApp] = useState<string>('')
  const [minimizedApps, setMinimizedApps] = useState<string[]>([])
  const [showAppSelector, setShowAppSelector] = useState(false)
  const [minimizationHistory, setMinimizationHistory] = useState<MinimizationResult[]>([])
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lockRef = useRef<HTMLDivElement>(null)
  const appMonitorRef = useRef<NodeJS.Timeout | null>(null)

  // Timer logic
  useEffect(() => {
    if (currentSession?.isActive && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentSession?.isActive, isPaused, timeRemaining])

  // App monitoring logic
  useEffect(() => {
    if (currentSession?.isLocked && isLocked && allowedApp) {
      // Start monitoring for non-allowed apps
      startAppMonitoring()
    } else {
      stopAppMonitoring()
    }

    return () => {
      stopAppMonitoring()
    }
  }, [currentSession?.isLocked, isLocked, allowedApp])

  const startAppMonitoring = async () => {
    try {
      const success = await appMinimizer.startMonitoring(allowedApp)
      if (success) {
        console.log('✅ App monitoring started successfully')
        
        // Update minimization history periodically
        appMonitorRef.current = setInterval(() => {
          const history = appMinimizer.getMinimizationHistory()
          setMinimizationHistory(history)
          
          // Update minimized apps list
          const minimizedAppNames = history
            .filter(result => result.success)
            .map(result => result.appName)
            .slice(-10) // Keep last 10
          
          setMinimizedApps(minimizedAppNames)
          setDistractions(minimizedAppNames.length)
        }, 2000) // Update every 2 seconds
      } else {
        console.warn('⚠️ Failed to start app monitoring')
      }
    } catch (error) {
      console.error('Error starting app monitoring:', error)
    }
  }

  const stopAppMonitoring = async () => {
    try {
      await appMinimizer.stopMonitoring()
      if (appMonitorRef.current) {
        clearInterval(appMonitorRef.current)
        appMonitorRef.current = null
      }
      console.log('🛑 App monitoring stopped')
    } catch (error) {
      console.error('Error stopping app monitoring:', error)
    }
  }

  // Lock screen when session is active
  useEffect(() => {
    if (currentSession?.isLocked && isLocked) {
      // Prevent context menu
      const preventContext = (e: Event) => e.preventDefault()
      
      // Prevent right click
      document.addEventListener('contextmenu', preventContext)
      
      // Prevent keyboard shortcuts
      const preventShortcuts = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault()
        }
      }
      
      document.addEventListener('keydown', preventShortcuts)
      
      return () => {
        document.removeEventListener('contextmenu', preventContext)
        document.removeEventListener('keydown', preventShortcuts)
      }
    }
  }, [currentSession?.isLocked, isLocked])

  const startFocusSession = () => {
    if (!taskDescription.trim()) {
      alert('Please enter what you want to focus on!')
      return
    }

    if (!allowedApp) {
      setShowAppSelector(true)
      return
    }

    const duration = selectedMode.id === 'custom' ? customDuration : selectedMode.duration
    const session: FocusSession = {
      id: Date.now().toString(),
      task: taskDescription,
      duration: duration * 60, // Convert to seconds
      isActive: true,
      isLocked: true,
      startTime: new Date(),
      endTime: null,
      distractions: 0,
      breaks: 0,
      allowedApp
    }

    setCurrentSession(session)
    setTimeRemaining(duration * 60)
    setIsLocked(true)
    setDistractions(0)
    setMinimizedApps([])
    
    // Show warning before locking
    setShowWarning(true)
    setTimeout(() => {
      setShowWarning(false)
    }, 3000)
  }

  const handleSessionComplete = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        isActive: false,
        isLocked: false,
        endTime: new Date()
      }
      
      setCurrentSession(completedSession)
      setIsLocked(false)
      stopAppMonitoring()
      
      // Show completion celebration
      setTimeout(() => {
        setCurrentSession(null)
        setMinimizedApps([])
      }, 5000)
    }
  }

  const pauseSession = async () => {
    setIsPaused(!isPaused)
    if (!isPaused) {
      await stopAppMonitoring()
    } else {
      await startAppMonitoring()
    }
  }

  const stopSession = async () => {
    if (currentSession) {
      setCurrentSession(null)
      setIsLocked(false)
      setIsPaused(false)
      setTimeRemaining(0)
      await stopAppMonitoring()
      setMinimizedApps([])
    }
  }

  const toggleAppAllow = (appName: string) => {
    if (allowedApp === appName) {
      setAllowedApp('')
    } else {
      setAllowedApp(appName)
    }
  }

  const selectAllowedApp = (appName: string) => {
    setAllowedApp(appName)
    setShowAppSelector(false)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    if (!currentSession) return 0
    return ((currentSession.duration - timeRemaining) / currentSession.duration) * 100
  }

  if (isLocked && currentSession) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Lock overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Particle effects */}
        <ParticleSystem
          type="falling"
          count={50}
          colors={['#ef4444', '#dc2626', '#991b1b']}
          intensity="high"
          className="absolute inset-0"
        />
        
        {/* Lock screen content */}
        <motion.div
          className="relative z-10 text-center text-white max-w-2xl mx-auto px-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springConfig}
        >
          <motion.div
            className="mb-8"
            animate={{ 
              rotate: [0, 5, -5, 0],
              transition: { duration: 2, repeat: Infinity }
            }}
          >
            <Lock className="w-24 h-24 mx-auto text-red-400 mb-4" />
          </motion.div>
          
          <motion.h1
            className="text-4xl font-bold mb-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            FOCUS LOCKED
          </motion.h1>
          
          <motion.p
            className="text-xl mb-8 text-gray-300"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            You are focusing on: <span className="text-red-400 font-semibold">{currentSession.task}</span>
          </motion.p>

          <motion.div
            className="mb-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg mb-2">Allowed App:</p>
            <div className="flex items-center justify-center space-x-2">
              <AppWindow className="w-6 h-6" />
              <span className="text-xl font-semibold text-green-400">{allowedApp}</span>
            </div>
          </motion.div>
          
          <motion.div
            className="mb-8"
            variants={scaleIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <FluidTimer
              duration={currentSession.duration}
              isActive={currentSession.isActive}
              size="xl"
              variant="circular"
              color="#ef4444"
            />
          </motion.div>
          
          <motion.div
            className="flex justify-center space-x-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
          >
            <PrimaryButton
              onClick={pauseSession}
              icon={isPaused ? Play : Pause}
              size="lg"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </PrimaryButton>
            
            <DangerButton
              onClick={stopSession}
              icon={Square}
              size="lg"
            >
              Stop Session
            </DangerButton>
          </motion.div>
          
          <motion.div
            className="mt-8 text-sm text-gray-400"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-red-400">{distractions}</p>
                <p>Apps Minimized</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-green-400">{minimizedApps.length}</p>
                <p>Total Minimized</p>
              </div>
            </div>
            
            {minimizedApps.length > 0 && (
              <div className="mt-4">
                <p className="text-xs mb-2">Recently minimized:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {minimizedApps.slice(-3).map((app) => (
                    <span key={app} className="px-2 py-1 bg-red-500/20 rounded text-xs">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {minimizationHistory.length > 0 && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-xs mb-2 text-center">Session Stats</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-green-400">✓ {minimizationHistory.filter(r => r.success).length}</span>
                    <p className="text-gray-400">Successful</p>
                  </div>
                  <div>
                    <span className="text-red-400">✗ {minimizationHistory.filter(r => !r.success).length}</span>
                    <p className="text-gray-400">Failed</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background particles */}
      <ParticleSystem
        type="floating"
        count={20}
        colors={['#ef4444', '#f59e0b', '#10b981']}
        intensity="low"
        className="absolute inset-0"
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-12"
          variants={slideInFromTop}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={springConfig}
          >
            <Minimize2 className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Focus Lock - Minimize Mode
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose one app to use, and we'll minimize all others when you try to open them
          </p>
        </motion.div>

        <AnimatePresence>
          {showWarning && (
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={springConfig}
              >
                <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Warning!</h3>
                <p className="text-gray-600 mb-6">
                  You're about to start focus mode. Only <span className="font-semibold text-blue-600">{allowedApp}</span> will be allowed to stay open!
                </p>
                <motion.div
                  className="flex space-x-2 justify-center"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAppSelector && (
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={springConfig}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Select Your Allowed App</h3>
                  <button
                    onClick={() => setShowAppSelector(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Choose the one application you want to use during your focus session. All other apps will be minimized when you try to open them.
                </p>
                
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {apps.map((app) => (
                    <motion.button
                      key={app.name}
                      onClick={() => selectAllowedApp(app.name)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        allowedApp === app.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{app.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{app.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{app.category}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Setup */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-red-500" />
              Focus Session Setup
            </h2>
            
            <div className="space-y-6">
              {/* Task Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you want to focus on?
                </label>
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="e.g., Study for calculus exam, Write research paper..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Allowed App Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Allowed App
                </label>
                {allowedApp ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{apps.find(app => app.name === allowedApp)?.icon}</span>
                      <div>
                        <div className="font-semibold text-green-800">{allowedApp}</div>
                        <div className="text-sm text-green-600">Allowed during focus session</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAppSelector(true)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAppSelector(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Select Allowed App</span>
                    </div>
                  </button>
                )}
              </div>
              
              {/* Focus Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Focus Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {focusModes.map((mode) => (
                    <motion.button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMode.id === mode.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">{mode.name}</div>
                        <div className="text-sm text-gray-600">{mode.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Custom Duration */}
              {selectedMode.id === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value) || 25)}
                    min="5"
                    max="180"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </motion.div>
              )}
              
              {/* Start Button */}
              <PrimaryButton
                onClick={startFocusSession}
                size="lg"
                icon={Lock}
                className="w-full"
                disabled={!taskDescription.trim() || !allowedApp}
              >
                Start Focus Lock Session
              </PrimaryButton>
            </div>
          </motion.div>
          
          {/* How It Works */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-500" />
              How Minimize Mode Works
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Select Your Allowed App</h3>
                  <p className="text-gray-600 text-sm">Choose the one application you need for your focus session (e.g., VS Code, Notes, etc.)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Start Your Session</h3>
                  <p className="text-gray-600 text-sm">Begin your focus session with your chosen app ready to use</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Automatic Minimization</h3>
                  <p className="text-gray-600 text-sm">When you try to open any other app, it will be automatically minimized to keep you focused</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Track Distractions</h3>
                  <p className="text-gray-600 text-sm">See how many times you tried to open distracting apps and build better habits</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Benefits of Minimize Mode</div>
                  <div className="text-sm text-green-600 mt-1">
                    • Gentler than blocking - apps are still accessible if really needed<br/>
                    • Builds awareness of distraction patterns<br/>
                    • Works on any operating system<br/>
                    • No special permissions required
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Current Session Status */}
        {currentSession && !isLocked && (
          <motion.div
            className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Session Completed! 🎉</h3>
                <p className="text-green-100">
                  Great job focusing on: <span className="font-semibold">{currentSession.task}</span>
                </p>
                <p className="text-sm text-green-200 mt-1">
                  Duration: {Math.floor(currentSession.duration / 60)} minutes | 
                  Distractions minimized: {distractions}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
