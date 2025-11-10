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
  CheckCircle,
  AlertTriangle,
  FileText,
  Copy,
  Download
} from 'lucide-react'

interface FocusSession {
  id: string
  task: string
  duration: number
  isActive: boolean
  startTime: Date | null
  endTime: Date | null
  completed: boolean
}

interface TaskResult {
  task: string
  success: boolean
  message: string
  timestamp: Date
  details: string[]
}

const focusModes = [
  { id: 'pomodoro', name: 'Pomodoro', duration: 25, description: '25 min focus + 5 min break' },
  { id: 'deep', name: 'Deep Work', duration: 90, description: '90 min intense focus session' },
  { id: 'study', name: 'Study Session', duration: 45, description: '45 min academic focus' },
  { id: 'quick', name: 'Quick Focus', duration: 15, description: '15 min rapid task completion' },
  { id: 'custom', name: 'Custom', duration: 0, description: 'Set your own duration' }
]

export default function FocusLockPage() {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)
  const [selectedMode, setSelectedMode] = useState(focusModes[0])
  const [customDuration, setCustomDuration] = useState(25)
  const [taskDescription, setTaskDescription] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [taskResults, setTaskResults] = useState<TaskResult[]>([])
  const [showResults, setShowResults] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
      startTime: new Date(),
      endTime: null,
      completed: false
    }

    setCurrentSession(session)
    setTimeRemaining(duration * 60)
    setIsPaused(false)
    
    // Record task start
    recordTaskResult('Session Started', true, `Started ${duration}-minute focus session`, [
      `Task: ${taskDescription}`,
      `Mode: ${selectedMode.name}`,
      `Duration: ${duration} minutes`,
      `Start Time: ${new Date().toLocaleTimeString()}`
    ])
  }

  const handleSessionComplete = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        isActive: false,
        endTime: new Date(),
        completed: true
      }
      
      setCurrentSession(completedSession)
      
      // Record completion
      const duration = Math.floor((completedSession.endTime!.getTime() - completedSession.startTime!.getTime()) / 1000 / 60)
      recordTaskResult('Session Completed', true, `Successfully completed ${duration}-minute focus session`, [
        `Task: ${completedSession.task}`,
        `Duration: ${duration} minutes`,
        `End Time: ${completedSession.endTime!.toLocaleTimeString()}`,
        `Focus Mode: ${selectedMode.name}`,
        `Status: Completed Successfully`
      ])
      
      // Show results after completion
      setTimeout(() => {
        setShowResults(true)
      }, 2000)
    }
  }

  const pauseSession = () => {
    setIsPaused(!isPaused)
    
    const action = isPaused ? 'Resumed' : 'Paused'
    recordTaskResult(`Session ${action}`, true, `${action} focus session`, [
      `Task: ${currentSession?.task}`,
      `Time Remaining: ${formatTime(timeRemaining)}`,
      `Action: ${action}`,
      `Timestamp: ${new Date().toLocaleTimeString()}`
    ])
  }

  const stopSession = () => {
    if (currentSession) {
      const duration = Math.floor((Date.now() - currentSession.startTime!.getTime()) / 1000 / 60)
      
      recordTaskResult('Session Stopped', true, `Stopped focus session after ${duration} minutes`, [
        `Task: ${currentSession.task}`,
        `Duration: ${duration} minutes`,
        `Reason: User stopped session`,
        `Time Remaining: ${formatTime(timeRemaining)}`,
        `Status: Stopped by user`
      ])
      
      setCurrentSession(null)
      setIsPaused(false)
      setTimeRemaining(0)
      
      // Show results
      setTimeout(() => {
        setShowResults(true)
      }, 1000)
    }
  }

  const recordTaskResult = (task: string, success: boolean, message: string, details: string[]) => {
    const result: TaskResult = {
      task,
      success,
      message,
      timestamp: new Date(),
      details
    }
    
    setTaskResults(prev => [...prev, result])
    console.log('📋 Task Result:', result)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generateScript = (): string => {
    const script = `# Focus Lock Session Report
# Generated on ${new Date().toLocaleString()}

## Session Summary
${currentSession ? `
- Task: ${currentSession.task}
- Mode: ${selectedMode.name}
- Duration: ${Math.floor(currentSession.duration / 60)} minutes
- Status: ${currentSession.completed ? 'Completed' : 'In Progress'}
- Start Time: ${currentSession.startTime?.toLocaleString()}
- End Time: ${currentSession.endTime?.toLocaleString() || 'N/A'}
` : 'No active session'}

## Task Execution Log
${taskResults.map((result, index) => `
### ${index + 1}. ${result.task}
- **Status**: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}
- **Message**: ${result.message}
- **Timestamp**: ${result.timestamp.toLocaleString()}
- **Details**:
${result.details.map(detail => `  - ${detail}`).join('\n')}
`).join('\n')}

## Statistics
- Total Tasks Executed: ${taskResults.length}
- Successful Tasks: ${taskResults.filter(r => r.success).length}
- Failed Tasks: ${taskResults.filter(r => !r.success).length}
- Success Rate: ${taskResults.length > 0 ? Math.round((taskResults.filter(r => r.success).length / taskResults.length) * 100) : 0}%

## System Information
- Platform: Web Browser
- Focus Lock Version: Simple Mode v1.0
- Session ID: ${currentSession?.id || 'N/A'}
- Generated: ${new Date().toISOString()}
`

    return script
  }

  const copyScript = () => {
    const script = generateScript()
    navigator.clipboard.writeText(script)
    recordTaskResult('Script Copied', true, 'Session report copied to clipboard', [
      'Action: Copy to clipboard',
      'Content: Complete session report',
      'Format: Markdown',
      'Timestamp: ' + new Date().toLocaleTimeString()
    ])
  }

  const downloadScript = () => {
    const script = generateScript()
    const blob = new Blob([script], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focus-session-report-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    recordTaskResult('Script Downloaded', true, 'Session report downloaded as file', [
      'Action: Download file',
      'Format: Markdown (.md)',
      'Filename: focus-session-report-' + Date.now() + '.md',
      'Timestamp: ' + new Date().toLocaleTimeString()
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Focus Lock - Simple Mode
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your focus sessions and get detailed reports of what you accomplished
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Setup */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-500" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          ? 'border-blue-500 bg-blue-50'
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </motion.div>
              )}
              
              {/* Start Button */}
              <motion.button
                onClick={startFocusSession}
                disabled={!taskDescription.trim() || currentSession?.isActive}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  !taskDescription.trim() || currentSession?.isActive
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 hover:shadow-lg'
                }`}
                whileHover={!taskDescription.trim() || currentSession?.isActive ? {} : { scale: 1.02 }}
                whileTap={!taskDescription.trim() || currentSession?.isActive ? {} : { scale: 0.98 }}
              >
                {currentSession?.isActive ? 'Session Active' : 'Start Focus Session'}
              </motion.button>
            </div>
          </motion.div>
          
          {/* Session Status */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-green-500" />
              Session Status
            </h2>
            
            {currentSession ? (
              <div className="space-y-6">
                {/* Timer */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-800 mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-lg text-gray-600">
                    {currentSession.task}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${((currentSession.duration - timeRemaining) / currentSession.duration) * 100}%` 
                    }}
                  />
                </div>
                
                {/* Controls */}
                <div className="flex space-x-4">
                  <motion.button
                    onClick={pauseSession}
                    className="flex-1 py-3 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPaused ? <Play className="w-5 h-5 mx-auto" /> : <Pause className="w-5 h-5 mx-auto" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </motion.button>
                  
                  <motion.button
                    onClick={stopSession}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Square className="w-5 h-5 mx-auto" />
                    Stop
                  </motion.button>
                </div>
                
                {/* Session Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-700">Mode</div>
                      <div className="text-gray-600">{selectedMode.name}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700">Started</div>
                      <div className="text-gray-600">{currentSession.startTime?.toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No active session</p>
                <p className="text-sm">Start a focus session to begin tracking</p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Task Results */}
        {taskResults.length > 0 && (
          <motion.div
            className="mt-8 bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-500" />
                Task Execution Log
              </h2>
              
              <div className="flex space-x-2">
                <motion.button
                  onClick={copyScript}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Report</span>
                </motion.button>
                
                <motion.button
                  onClick={downloadScript}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </motion.button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {taskResults.map((result, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.success 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                        <h3 className="font-semibold text-gray-800">{result.task}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.success 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {result.success ? 'SUCCESS' : 'FAILED'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{result.message}</p>
                      <div className="text-sm text-gray-500">
                        {result.timestamp.toLocaleString()}
                      </div>
                      {result.details.length > 0 && (
                        <div className="mt-2">
                          <details className="text-sm">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                              View Details
                            </summary>
                            <ul className="mt-2 space-y-1 text-gray-600">
                              {result.details.map((detail, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-gray-400 mr-2">•</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}