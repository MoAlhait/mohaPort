'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, ArrowLeft, Clock, BookOpen, Brain, Coffee, Music, Volume2, VolumeX, Settings, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

type StudyMode = 'focus' | 'review' | 'break' | 'deep-work' | 'pomodoro'

interface StudySession {
  mode: StudyMode
  duration: number // in minutes
  color: string
  title: string
  description: string
  icon: any
  ambientSound?: string
}

interface SessionRecord {
  id: string
  mode: StudyMode
  duration: number
  completedAt: string
  productivity: number // 1-5 scale
  notes?: string
}

const studyModes: Record<StudyMode, StudySession> = {
  focus: {
    mode: 'focus',
    duration: 45,
    color: 'from-blue-500 to-cyan-500',
    title: 'Focus Session',
    description: 'Intensive study with full concentration',
    icon: Brain,
    ambientSound: 'rain'
  },
  review: {
    mode: 'review',
    duration: 30,
    color: 'from-green-500 to-emerald-500',
    title: 'Review Session',
    description: 'Review and consolidate learned material',
    icon: BookOpen,
    ambientSound: 'forest'
  },
  break: {
    mode: 'break',
    duration: 15,
    color: 'from-yellow-500 to-orange-500',
    title: 'Break Time',
    description: 'Rest and recharge between sessions',
    icon: Coffee,
    ambientSound: 'ocean'
  },
  'deep-work': {
    mode: 'deep-work',
    duration: 90,
    color: 'from-purple-500 to-pink-500',
    title: 'Deep Work',
    description: 'Extended focused work on complex tasks',
    icon: Target,
    ambientSound: 'cafe'
  },
  pomodoro: {
    mode: 'pomodoro',
    duration: 25,
    color: 'from-red-500 to-orange-500',
    title: 'Pomodoro',
    description: '25-minute focused work with short breaks',
    icon: Clock,
    ambientSound: 'rain'
  }
}

const ambientSounds = {
  rain: { name: 'Rain', url: '/sounds/rain.mp3' },
  forest: { name: 'Forest', url: '/sounds/forest.mp3' },
  ocean: { name: 'Ocean', url: '/sounds/ocean.mp3' },
  cafe: { name: 'Cafe', url: '/sounds/cafe.mp3' },
  none: { name: 'None', url: '' }
}

export default function StudyTimer() {
  const [currentMode, setCurrentMode] = useState<StudyMode>('focus')
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(false)
  const [volume, setVolume] = useState(50)
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([])
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [productivityRating, setProductivityRating] = useState(3)
  const [sessionNotes, setSessionNotes] = useState('')
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load session history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studySessionHistory')
    if (saved) {
      setSessionHistory(JSON.parse(saved))
    }
  }, [])

  // Save session history to localStorage
  useEffect(() => {
    localStorage.setItem('studySessionHistory', JSON.stringify(sessionHistory))
  }, [sessionHistory])

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.loop = true
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete()
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

  // Ambient sound control
  useEffect(() => {
    if (audioRef.current && ambientSoundEnabled && isRunning) {
      const sound = studyModes[currentMode].ambientSound
      if (sound && ambientSounds[sound as keyof typeof ambientSounds]) {
        audioRef.current.src = ambientSounds[sound as keyof typeof ambientSounds].url
        audioRef.current.play().catch(() => {})
      }
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [ambientSoundEnabled, isRunning, currentMode])

  const handleSessionComplete = () => {
    setIsRunning(false)
    setShowCompletionModal(true)
    
    // Add to session history
    const newSession: SessionRecord = {
      id: Date.now().toString(),
      mode: currentMode,
      duration: studyModes[currentMode].duration,
      completedAt: new Date().toISOString(),
      productivity: productivityRating,
      notes: sessionNotes
    }
    setSessionHistory([...sessionHistory, newSession])
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(studyModes[currentMode].duration * 60)
  }

  const switchMode = (mode: StudyMode) => {
    setIsRunning(false)
    setCurrentMode(mode)
    setTimeLeft(studyModes[mode].duration * 60)
  }

  const completeSession = () => {
    setShowCompletionModal(false)
    setProductivityRating(3)
    setSessionNotes('')
    
    // Auto-suggest next session
    if (currentMode === 'focus' || currentMode === 'deep-work') {
      switchMode('break')
    } else if (currentMode === 'break') {
      switchMode('review')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((studyModes[currentMode].duration * 60 - timeLeft) / (studyModes[currentMode].duration * 60)) * 100

  const getTotalStudyTime = () => {
    return sessionHistory.reduce((total, session) => {
      return total + (session.mode === 'break' ? 0 : session.duration)
    }, 0)
  }

  const getProductivityAverage = () => {
    if (sessionHistory.length === 0) return 0
    const total = sessionHistory.reduce((sum, session) => sum + session.productivity, 0)
    return Math.round((total / sessionHistory.length) * 10) / 10
  }

  const getMostProductiveMode = () => {
    const modeAverages = Object.keys(studyModes).map(mode => {
      const sessions = sessionHistory.filter(s => s.mode === mode)
      const avg = sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length
        : 0
      return { mode, average: avg, count: sessions.length }
    })
    
    return modeAverages.sort((a, b) => b.average - a.average)[0]
  }

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
            <h1 className="text-xl font-bold gradient-text">Study Timer</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.floor(getTotalStudyTime() / 60)}h {getTotalStudyTime() % 60}m
            </div>
            <p className="text-gray-600">Total Study Time</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{sessionHistory.length}</div>
            <p className="text-gray-600">Sessions Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{getProductivityAverage()}/5</div>
            <p className="text-gray-600">Avg Productivity</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {sessionHistory.length > 0 ? Math.round(getTotalStudyTime() / sessionHistory.length) : 0}m
            </div>
            <p className="text-gray-600">Avg Session Length</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(studyModes).map(([mode, config]) => {
                const IconComponent = config.icon
                return (
                  <button
                    key={mode}
                    onClick={() => switchMode(mode as StudyMode)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      currentMode === mode
                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{config.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Timer */}
        <div className="text-center mb-12">
          <div className={`inline-block p-8 rounded-full bg-gradient-to-r ${studyModes[currentMode].color} shadow-2xl mb-8`}>
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
                  {studyModes[currentMode].title}
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

          {/* Ambient Sound Controls */}
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => setAmbientSoundEnabled(!ambientSoundEnabled)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                ambientSoundEnabled 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {ambientSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>Ambient Sound</span>
            </button>
            
            {ambientSoundEnabled && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">{volume}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Recent Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionHistory.slice(-6).reverse().map((session) => {
                const modeConfig = studyModes[session.mode]
                const IconComponent = modeConfig.icon
                
                return (
                  <div key={session.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{modeConfig.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(session.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{session.duration}m</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < session.productivity ? 'bg-yellow-400' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {session.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">"{session.notes}"</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Study Tips */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">Study Session Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-blue-600">Focus Sessions</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Remove all distractions (phone, social media)</li>
                <li>• Use ambient sounds to block external noise</li>
                <li>• Take notes actively during study</li>
                <li>• Set specific learning objectives</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-green-600">Review Sessions</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Summarize key concepts in your own words</li>
                <li>• Create mind maps or diagrams</li>
                <li>• Test yourself with practice questions</li>
                <li>• Focus on weak areas identified earlier</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-purple-600">Deep Work</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Work on complex, challenging material</li>
                <li>• Break large tasks into smaller chunks</li>
                <li>• Take longer breaks between sessions</li>
                <li>• Track your productivity levels</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-orange-600">Break Time</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Step away from your study area</li>
                <li>• Do light physical activity or stretching</li>
                <li>• Hydrate and have a healthy snack</li>
                <li>• Avoid screens during breaks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6 text-center">Session Complete!</h3>
            <p className="text-gray-600 mb-6 text-center">
              Great job completing your {studyModes[currentMode].title}! How productive did you feel?
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Productivity Rating (1-5)
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setProductivityRating(rating)}
                    className={`w-10 h-10 rounded-full border-2 transition-colors ${
                      rating <= productivityRating
                        ? 'bg-yellow-400 border-yellow-400'
                        : 'bg-white border-gray-300 hover:border-yellow-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="How did the session go? Any insights?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={completeSession}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Complete Session
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
