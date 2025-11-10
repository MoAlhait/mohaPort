'use client'

import React, { useEffect, useState } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'

interface FluidTimerProps {
  duration: number // in seconds
  isActive: boolean
  onComplete?: () => void
  onTick?: (remaining: number) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'circular' | 'linear' | 'radial'
  showProgress?: boolean
  showTime?: boolean
  color?: string
  className?: string
}

const sizeMap = {
  sm: { size: 120, strokeWidth: 8, fontSize: '14px' },
  md: { size: 160, strokeWidth: 10, fontSize: '18px' },
  lg: { size: 200, strokeWidth: 12, fontSize: '24px' },
  xl: { size: 280, strokeWidth: 16, fontSize: '32px' }
}

export const FluidTimer: React.FC<FluidTimerProps> = ({
  duration,
  isActive,
  onComplete,
  onTick,
  size = 'lg',
  variant = 'circular',
  showProgress = true,
  showTime = true,
  color = '#3b82f6',
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isComplete, setIsComplete] = useState(false)
  
  const controls = useAnimation()
  const progressValue = useMotionValue(0)
  const timeValue = useMotionValue(duration)
  
  const sizeConfig = sizeMap[size]
  const radius = (sizeConfig.size - sizeConfig.strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  
  const progress = useTransform(progressValue, [0, 1], [0, circumference])
  const timeDisplay = useTransform(timeValue, (value) => formatTime(Math.max(0, value)))

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1
          if (newTime <= 0) {
            setIsComplete(true)
            onComplete?.()
            return 0
          }
          return newTime
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [isActive, timeRemaining, onComplete])

  useEffect(() => {
    const progressAmount = 1 - (timeRemaining / duration)
    progressValue.set(progressAmount)
    timeValue.set(timeRemaining)
    onTick?.(timeRemaining)
  }, [timeRemaining, duration, progressValue, timeValue, onTick])

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
      })
    } else {
      controls.stop()
      controls.set({ scale: 1 })
    }
  }, [isActive, controls])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (variant === 'circular') {
    return (
      <motion.div
        className={`relative flex items-center justify-center ${className}`}
        animate={controls}
        style={{ width: sizeConfig.size, height: sizeConfig.size }}
      >
        {/* Background circle */}
        <svg
          width={sizeConfig.size}
          height={sizeConfig.size}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={sizeConfig.size / 2}
            cy={sizeConfig.size / 2}
            r={radius}
            stroke="rgba(59, 130, 246, 0.1)"
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={sizeConfig.size / 2}
            cy={sizeConfig.size / 2}
            r={radius}
            stroke={color}
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
            }}
          />
        </svg>

        {/* Time display */}
        {showTime && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="font-mono font-bold text-gray-800"
              style={{ fontSize: sizeConfig.fontSize }}
              animate={isActive ? { 
                color: [color, '#ef4444', color],
                transition: { duration: 2, repeat: Infinity }
              } : {}}
            >
              {formatTime(timeRemaining)}
            </motion.span>
          </motion.div>
        )}

        {/* Progress percentage */}
        {showProgress && (
          <motion.div
            className="absolute bottom-2 text-xs text-gray-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Math.round(((duration - timeRemaining) / duration) * 100)}%
          </motion.div>
        )}

        {/* Completion animation */}
        {isComplete && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  if (variant === 'linear') {
    return (
      <motion.div
        className={`relative ${className}`}
        style={{ width: sizeConfig.size * 2, height: sizeConfig.size / 4 }}
      >
        {/* Background bar */}
        <div
          className="absolute inset-0 bg-gray-200 rounded-full"
          style={{ height: sizeConfig.strokeWidth }}
        />
        
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ height: sizeConfig.strokeWidth }}
          initial={{ width: 0 }}
          animate={{ width: `${((duration - timeRemaining) / duration) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Time display */}
        {showTime && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span
              className="font-mono font-bold text-gray-800"
              style={{ fontSize: sizeConfig.fontSize }}
            >
              {formatTime(timeRemaining)}
            </span>
          </motion.div>
        )}
      </motion.div>
    )
  }

  if (variant === 'radial') {
    return (
      <motion.div
        className={`relative ${className}`}
        style={{ width: sizeConfig.size, height: sizeConfig.size }}
        animate={controls}
      >
        {/* Radial progress */}
        <svg
          width={sizeConfig.size}
          height={sizeConfig.size}
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          
          <motion.circle
            cx={sizeConfig.size / 2}
            cy={sizeConfig.size / 2}
            r={radius}
            stroke="url(#radialGradient)"
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={circumference * 0.75}
            initial={{ rotate: -90 }}
            animate={{ rotate: isActive ? [0, 360] : 0 }}
            transition={{ duration: duration, ease: 'linear' }}
          />
        </svg>

        {/* Center content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {showTime && (
            <motion.span
              className="font-mono font-bold text-gray-800"
              style={{ fontSize: sizeConfig.fontSize }}
            >
              {formatTime(timeRemaining)}
            </motion.span>
          )}
          
          {showProgress && (
            <motion.span
              className="text-xs text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {Math.round(((duration - timeRemaining) / duration) * 100)}%
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    )
  }

  return null
}

// Preset timer components
export const PomodoroTimer: React.FC<{
  duration: number
  isActive: boolean
  onComplete?: () => void
}> = (props) => (
  <FluidTimer
    {...props}
    size="lg"
    variant="circular"
    color="#ef4444"
    className="mx-auto"
  />
)

export const StudyTimer: React.FC<{
  duration: number
  isActive: boolean
  onComplete?: () => void
}> = (props) => (
  <FluidTimer
    {...props}
    size="xl"
    variant="radial"
    color="#3b82f6"
    className="mx-auto"
  />
)

export const QuickTimer: React.FC<{
  duration: number
  isActive: boolean
  onComplete?: () => void
}> = (props) => (
  <FluidTimer
    {...props}
    size="md"
    variant="linear"
    color="#10b981"
    className="mx-auto"
  />
)

// Timer with custom controls
export const ControllableTimer: React.FC<{
  duration: number
  isActive: boolean
  onComplete?: () => void
  onPause?: () => void
  onReset?: () => void
}> = ({ duration, isActive, onComplete, onPause, onReset }) => {
  const [currentDuration, setCurrentDuration] = useState(duration)

  return (
    <motion.div
      className="flex flex-col items-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FluidTimer
        duration={currentDuration}
        isActive={isActive}
        onComplete={onComplete}
        size="xl"
        variant="circular"
      />
      
      <div className="flex space-x-2">
        <motion.button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={onPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? 'Pause' : 'Resume'}
        </motion.button>
        
        <motion.button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={() => {
            setCurrentDuration(duration)
            onReset?.()
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>
    </motion.div>
  )
}
