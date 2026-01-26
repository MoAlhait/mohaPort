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
  EyeOff
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
import { appBlocker } from '../lib/app-blocker-mock'

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
}

interface BlockedApp {
  name: string
  process: string
  icon: string
  category: 'social' | 'entertainment' | 'productivity' | 'other'
}

const defaultBlockedApps: BlockedApp[] = [
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
]

const focusModes = [
  { id: 'pomodoro', name: 'Pomodoro', duration: 25, color: '#ef4444', description: '25 min focus + 5 min break' },
  { id: 'deep', name: 'Deep Work', duration: 90, color: '#3b82f6', description: '90 min intense focus session' },
  { id: 'study', name: 'Study Session', duration: 45, color: '#10b981', description: '45 min academic focus' },
  { id: 'quick', name: 'Quick Focus', duration: 15, color: '#f59e0b', description: '15 min rapid task completion' },
  { id: 'custom', name: 'Custom', duration: 0, color: '#8b5cf6', description: 'Set your own duration' }
]

export const FocusLock: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [selectedMode, setSelectedMode] = useState(focusModes[0])
  const [customDuration, setCustomDuration] = useState(25)
  const [taskDescription, setTaskDescription] = useState('')
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>(defaultBlockedApps)
  const [showSettings, setShowSettings] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [distractions, setDistractions] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lockRef = useRef<HTMLDivElement>(null)

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
      breaks: 0
    }

    setCurrentSession(session)
    setTimeRemaining(duration * 60)
    setIsLocked(true)
    setDistractions(0)
    
    // Show warning before locking
    setShowWarning(true)
    setTimeout(() => {
      setShowWarning(false)
      // Here you would implement actual app blocking
      blockApplications()
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
      
      // Unblock applications
      unblockApplications()
      
      // Show completion celebration
      setTimeout(() => {
        setCurrentSession(null)
      }, 5000)
    }
  }

  const pauseSession = () => {
    setIsPaused(!isPaused)
  }

  const stopSession = () => {
    if (currentSession) {
      setCurrentSession(null)
      setIsLocked(false)
      setIsPaused(false)
      setTimeRemaining(0)
      unblockApplications()
    }
  }

  const blockApplications = async () => {
    try {
      // Update app blocker with current settings
      blockedApps.forEach(app => {
        if (app.category !== 'productivity') {
          appBlocker.addBlockedApp({
            name: app.name,
            process: app.process,
            category: app.category
          })
        }
      })
      
      // Start actual system-level blocking
      const success = await appBlocker.startBlocking()
      
      if (success) {
        console.log('✅ Apps blocked successfully')
        // Start monitoring for blocked apps
        appBlocker.monitorApps()
      } else {
        console.warn('⚠️ Some apps could not be blocked - check permissions')
        // Show user-friendly warning
        alert('Some apps could not be blocked. You may need to run the app with administrator privileges for full blocking functionality.')
      }
    } catch (error) {
      console.error('Failed to block applications:', error)
      alert('Failed to block applications. Please check your permissions.')
    }
  }

  const unblockApplications = async () => {
    try {
      const success = await appBlocker.stopBlocking()
      
      if (success) {
        console.log('✅ Apps unblocked successfully')
      } else {
        console.warn('⚠️ Some apps could not be unblocked')
      }
    } catch (error) {
      console.error('Failed to unblock applications:', error)
    }
  }

  const toggleAppBlock = (appName: string) => {
    setBlockedApps(prev => 
      prev.map(app => 
        app.name === appName 
          ? { ...app, category: app.category === 'productivity' ? 'other' : 'productivity' }
          : app
      )
    )
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
            <p>Distractions blocked: {distractions}</p>
            <p>Apps locked: {blockedApps.filter(app => app.category !== 'productivity').length}</p>
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
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Focus Lock
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lock yourself out of distractions and focus on what matters most
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
                  You're about to lock yourself out of all distractions. Make sure you're ready to focus!
                </p>
                <motion.div
                  className="flex space-x-2"
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
                disabled={!taskDescription.trim()}
              >
                Start Focus Lock Session
              </PrimaryButton>
            </div>
          </motion.div>
          
          {/* Settings Panel */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Settings className="w-6 h-6 mr-2 text-blue-500" />
                Blocked Apps
              </h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {blockedApps.map((app) => (
                <motion.div
                  key={app.name}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    app.category === 'productivity'
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <div className="font-medium">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.category}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleAppBlock(app.name)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      app.category === 'productivity'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {app.category === 'productivity' ? (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Allowed</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Blocked</span>
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">How it works</div>
                  <div className="text-sm text-blue-600 mt-1">
                    When you start a focus session, blocked apps will be closed and websites will be inaccessible until your session ends.
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
                  Duration: {Math.floor(currentSession.duration / 60)} minutes
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
