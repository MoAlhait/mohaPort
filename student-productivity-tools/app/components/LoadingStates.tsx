'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#3b82f6',
  className = ''
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        width={sizeMap[size]}
        height={sizeMap[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
    </motion.div>
  )
}

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  rounded?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  rounded = false
}) => {
  return (
    <motion.div
      className={`bg-gray-200 ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    />
  )
}

export const SkeletonText: React.FC<{
  lines?: number
  className?: string
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '75%' : '100%'}
          height="16px"
        />
      ))}
    </div>
  )
}

export const SkeletonCard: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <Skeleton width="40px" height="40px" rounded />
        <div className="flex-1">
          <Skeleton width="60%" height="16px" className="mb-2" />
          <Skeleton width="40%" height="14px" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

export const SkeletonTable: React.FC<{
  rows?: number
  columns?: number
  className?: string
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} height="20px" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="16px" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  color?: string
  height?: string
  className?: string
  showPercentage?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#3b82f6',
  height = '8px',
  className = '',
  showPercentage = false
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 'md',
  color = '#3b82f6',
  className = ''
}) => {
  const sizeMap = {
    sm: 12,
    md: 16,
    lg: 20
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            width: sizeMap[size],
            height: sizeMap[size],
            background: color
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

interface DotsLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({
  size = 'md',
  color = '#3b82f6',
  className = ''
}) => {
  const sizeMap = {
    sm: 4,
    md: 6,
    lg: 8
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            width: sizeMap[size],
            height: sizeMap[size],
            background: color
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

interface WaveLoaderProps {
  width?: number
  height?: number
  color?: string
  className?: string
}

export const WaveLoader: React.FC<WaveLoaderProps> = ({
  width = 60,
  height = 40,
  color = '#3b82f6',
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.rect
          key={index}
          x={index * 12}
          y={height / 2}
          width="4"
          height={height * 0.3}
          fill={color}
          animate={{
            height: [height * 0.3, height * 0.8, height * 0.3],
            y: [height / 2, height * 0.1, height / 2]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </svg>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  progress?: number
  className?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  progress,
  className = ''
}) => {
  if (!isVisible) return null

  return (
    <motion.div
      className={`fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <LoadingSpinner size="xl" className="mb-4" />
        
        <motion.p
          className="text-gray-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
        
        {progress !== undefined && (
          <div className="mt-4 w-64">
            <ProgressBar progress={progress} showPercentage />
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  className = '',
  onClick,
  disabled = false
}) => {
  return (
    <motion.button
      className={`relative px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="flex items-center justify-center space-x-2"
        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
      >
        {loading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <LoadingSpinner size="sm" color="white" />
          </motion.div>
        )}
        
        <motion.span
          animate={loading ? { opacity: 0.5 } : { opacity: 1 }}
        >
          {children}
        </motion.span>
      </motion.div>
    </motion.button>
  )
}

interface ShimmerEffectProps {
  children: React.ReactNode
  isLoading: boolean
  className?: string
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  children,
  isLoading,
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '100%'],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }
          }}
        />
      )}
    </div>
  )
}

// Loading states for specific components
export const LoadingCard: React.FC<{
  isLoading: boolean
  children: React.ReactNode
  className?: string
}> = ({ isLoading, children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SkeletonCard />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

export const LoadingList: React.FC<{
  isLoading: boolean
  itemCount?: number
  children: React.ReactNode
  className?: string
}> = ({ isLoading, itemCount = 3, children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {isLoading ? (
        <>
          {Array.from({ length: itemCount }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkeletonCard />
            </motion.div>
          ))}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
