'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'

interface AnimatedCardProps extends Omit<MotionProps, 'children'> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  glow?: boolean
  className?: string
  onClick?: () => void
  onHover?: () => void
  onTap?: () => void
}

const cardVariants = {
  default: {
    background: 'white',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    hover: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      y: -2
    }
  },
  elevated: {
    background: 'white',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    hover: {
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      y: -4
    }
  },
  outlined: {
    background: 'transparent',
    border: '2px solid #e5e7eb',
    boxShadow: 'none',
    hover: {
      borderColor: '#3b82f6',
      y: -2
    }
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hover: {
      background: 'rgba(255, 255, 255, 0.2)',
      y: -2
    }
  },
  gradient: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    color: 'white',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    hover: {
      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
      y: -4
    }
  }
}

const sizeVariants = {
  sm: {
    padding: '16px',
    borderRadius: '12px'
  },
  md: {
    padding: '24px',
    borderRadius: '16px'
  },
  lg: {
    padding: '32px',
    borderRadius: '20px'
  }
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  interactive = true,
  glow = false,
  className = '',
  onClick,
  onHover,
  onTap,
  ...motionProps
}) => {
  const variantStyle = cardVariants[variant]
  const sizeStyle = sizeVariants[size]

  const cardClassName = `bg-white border border-gray-200 rounded-lg shadow-sm ${interactive ? 'cursor-pointer' : 'cursor-default'} ${className}`

  const handleClick = () => {
    if (interactive && onClick) {
      onClick()
    }
  }

  const handleHover = () => {
    if (interactive && onHover) {
      onHover()
    }
  }

  const handleTap = () => {
    if (interactive && onTap) {
      onTap()
    }
  }

  return (
    <motion.div
      className={cardClassName}
      onClick={handleClick}
      onHoverStart={handleHover}
      onTap={handleTap}
      whileHover={interactive ? variantStyle.hover : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      {...motionProps}
    >
      {/* Glow effect */}
      {glow && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: sizeStyle.borderRadius,
            background: 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
            pointerEvents: 'none'
          }}
          animate={{
            opacity: [0, 1, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        />
      )}

      {/* Shimmer effect for gradient cards */}
      {variant === 'gradient' && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            borderRadius: sizeStyle.borderRadius
          }}
          animate={{
            left: ['100%', '100%'],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5
            }
          }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Ripple effect */}
      {interactive && (
        <motion.div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
            transform: 'scale(0)',
            pointerEvents: 'none'
          }}
          animate={{
            scale: [0, 2],
            opacity: [0.5, 0]
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut'
          }}
          className="ripple-effect"
        />
      )}
    </motion.div>
  )
}

// Specialized card components
export const ElevatedCard: React.FC<Omit<AnimatedCardProps, 'variant'>> = (props) => (
  <AnimatedCard variant="elevated" {...props} />
)

export const OutlinedCard: React.FC<Omit<AnimatedCardProps, 'variant'>> = (props) => (
  <AnimatedCard variant="outlined" {...props} />
)

export const GlassCard: React.FC<Omit<AnimatedCardProps, 'variant'>> = (props) => (
  <AnimatedCard variant="glass" {...props} />
)

export const GradientCard: React.FC<Omit<AnimatedCardProps, 'variant'>> = (props) => (
  <AnimatedCard variant="gradient" {...props} />
)

// Card with hover animation
export const HoverCard: React.FC<{
  children: React.ReactNode
  hoverContent?: React.ReactNode
  className?: string
}> = ({ children, hoverContent, className = '' }) => {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      
      {hoverContent && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {hoverContent}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Card with loading state
export const LoadingCard: React.FC<{
  children: React.ReactNode
  loading?: boolean
  className?: string
}> = ({ children, loading = false, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={loading ? { opacity: 0.6 } : { opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      {loading && (
        <motion.div
          className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

// Card with progress indicator
export const ProgressCard: React.FC<{
  children: React.ReactNode
  progress: number
  className?: string
}> = ({ children, progress, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

// Card with counter animation
export const CounterCard: React.FC<{
  children: React.ReactNode
  count: number
  className?: string
}> = ({ children, count, className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      <motion.div
        className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: 'backOut' }}
      >
        {count}
      </motion.div>
    </motion.div>
  )
}
