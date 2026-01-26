'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Clock, CheckCircle, Coffee, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface PomodoroSession {
  mode: TimerMode
  duration: number // in minutes
  color: string
  title: string
  description: string
}

const pomodoroConfig: Record<TimerMode, PomodoroSession> = {
  work: {
    mode: 'work',
    duration: 25,
    color: 'from-red-500 to-orange-500',
    title: 'Focus Time',
    description: 'Work on your most important task'
  },
  shortBreak: {
    mode: 'shortBreak',
    duration: 5,
    color: 'from-green-500 to-emerald-500',
    title: 'Short Break',
    description: 'Take a quick 5-minute break'
  },
  longBreak: {
    mode: 'longBreak',
    duration: 15,
    color: 'from-blue-500 to-cyan-500',
    title: 'Long Break',
    description: 'Take a longer 15-minute break'
  }
}

export default function PomodoroTimer() {
  const [currentMode, setCurrentMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio for notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3') // You can add a notification sound
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  // Browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [])

  const handleTimerComplete = () => {
    setIsRunning(false)
    setShowNotification(true)
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore errors if audio can't play
      })
    }

    // Show browser notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const config = pomodoroConfig[currentMode]
      new Notification(`${config.title} Complete!`, {
        body: config.description,
        icon: '/favicon.ico'
      })
    }

    // Handle session completion logic
    if (currentMode === 'work') {
      setCompletedPomodoros(prev => prev + 1)
      setSessionCount(prev => {
        const newCount = prev + 1
        // Every 4 pomodoros, take a long break
        if (newCount % 4 === 0) {
          setTimeout(() => setCurrentMode('longBreak'), 1000)
        } else {
          setTimeout(() => setCurrentMode('shortBreak'), 1000)
        }
        return newCount
      })
    } else {
      // After break, return to work
      setTimeout(() => setCurrentMode('work'), 1000)
    }
  }

  const startTimer = () => {
    setIsRunning(true)
    setShowNotification(false)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    const config = pomodoroConfig[currentMode]
    setTimeLeft(config.duration * 60)
    setShowNotification(false)
  }

  const switchMode = (mode: TimerMode) => {
    setIsRunning(false)
    setCurrentMode(mode)
    const config = pomodoroConfig[mode]
    setTimeLeft(config.duration * 60)
    setShowNotification(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((pomodoroConfig[currentMode].duration * 60 - timeLeft) / (pomodoroConfig[currentMode].duration * 60)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold gradient-text">Pomodoro Timer</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">{completedPomodoros}</div>
            <p className="text-gray-600">Completed Pomodoros</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">{sessionCount}</div>
            <p className="text-gray-600">Total Sessions</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {Math.floor(completedPomodoros * 25 / 60)}h {completedPomodoros * 25 % 60}m
            </div>
            <p className="text-gray-600">Focus Time</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <div className="flex space-x-2">
              {Object.entries(pomodoroConfig).map(([mode, config]) => (
                <button
                  key={mode}
                  onClick={() => switchMode(mode as TimerMode)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    currentMode === mode
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {config.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Timer */}
        <div className="text-center mb-12">
          <div className={`inline-block p-8 rounded-full bg-gradient-to-r ${pomodoroConfig[currentMode].color} shadow-2xl mb-8`}>
            <div className="relative">
              {/* Progress Circle */}
              <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              
              {/* Timer Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white/80 text-lg">
                  {pomodoroConfig[currentMode].title}
                </div>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                isRunning
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>
            
            <button
              onClick={resetTimer}
              className="flex items-center space-x-2 px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl font-semibold transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-6 h-6" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-6 rounded-2xl shadow-2xl z-50 animate-bounce">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">Session Complete!</h3>
                <p className="text-sm opacity-90">{pomodoroConfig[currentMode].description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">Pomodoro Technique Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Work Sessions (25 min)</h4>
                  <p className="text-gray-600 text-sm">Focus on a single task without distractions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Coffee className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Short Breaks (5 min)</h4>
                  <p className="text-gray-600 text-sm">Step away from your desk, stretch, or grab a drink</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Long Breaks (15 min)</h4>
                  <p className="text-gray-600 text-sm">Take every 4th break as a longer, more restorative break</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Track Progress</h4>
                  <p className="text-gray-600 text-sm">Monitor your completed pomodoros to build momentum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
