'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface AnimatedButtonProps extends Omit<MotionProps, 'children'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  onClick?: () => void
  onHover?: () => void
  onTap?: () => void
}

const buttonVariants = {
  primary: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    hover: {
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
      scale: 1.02
    },
    tap: {
      scale: 0.98,
      boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)'
    }
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#374151',
    border: '2px solid #e5e7eb',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    hover: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderColor: '#3b82f6',
      scale: 1.02
    },
    tap: {
      scale: 0.98
    }
  },
  ghost: {
    background: 'transparent',
    color: '#6b7280',
    border: 'none',
    hover: {
      background: 'rgba(0, 0, 0, 0.05)',
      color: '#374151',
      scale: 1.02
    },
    tap: {
      scale: 0.98
    }
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    hover: {
      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
      scale: 1.02
    },
    tap: {
      scale: 0.98
    }
  },
  success: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    hover: {
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
      scale: 1.02
    },
    tap: {
      scale: 0.98
    }
  }
}

const sizeVariants = {
  sm: {
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '8px',
    height: '36px'
  },
  md: {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '12px',
    height: '44px'
  },
  lg: {
    padding: '16px 32px',
    fontSize: '18px',
    borderRadius: '16px',
    height: '52px'
  }
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  onHover,
  onTap,
  ...motionProps
}) => {
  const variantStyle = buttonVariants[variant]
  const sizeStyle = sizeVariants[size]

  const buttonStyle = {
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    overflow: 'hidden'
  }

  const buttonClassName = className

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  const handleHover = () => {
    if (!disabled && !loading && onHover) {
      onHover()
    }
  }

  const handleTap = () => {
    if (!disabled && !loading && onTap) {
      onTap()
    }
  }

  return (
    <motion.button
      style={buttonStyle}
      className={buttonClassName}
      onClick={handleClick}
      onHoverStart={handleHover}
      onTap={handleTap}
      whileHover={disabled || loading ? {} : variantStyle.hover}
      whileTap={disabled || loading ? {} : variantStyle.tap}
      animate={loading ? { scale: [1, 1.02, 1] } : {}}
      transition={loading ? { duration: 1, repeat: Infinity } : { duration: 0.2 }}
      disabled={disabled || loading}
      {...motionProps}
    >
      {/* Shimmer effect */}
      {variant === 'primary' && (
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
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }
          }}
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <motion.div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Icon */}
      {Icon && !loading && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        </motion.div>
      )}

      {/* Button text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {children}
      </motion.span>

      {/* Ripple effect */}
      <motion.div
        style={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.3)',
          transform: 'scale(0)',
          pointerEvents: 'none'
        }}
        animate={{
          scale: [0, 1],
          opacity: [0.3, 0]
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut'
        }}
        className="ripple-effect"
      />
    </motion.button>
  )
}

// Specialized button components
export const PrimaryButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="primary" {...props} />
)

export const SecondaryButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="secondary" {...props} />
)

export const GhostButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="ghost" {...props} />
)

export const DangerButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="danger" {...props} />
)

export const SuccessButton: React.FC<Omit<AnimatedButtonProps, 'variant'>> = (props) => (
  <AnimatedButton variant="success" {...props} />
)

// Icon button variant
export const IconButton: React.FC<{
  icon: LucideIcon
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}> = ({ icon: Icon, onClick, size = 'md', variant = 'ghost', className = '' }) => {
  const sizeMap = { sm: 32, md: 40, lg: 48 }
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20

  return (
    <motion.button
      onClick={onClick}
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        background: variant === 'primary' ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 
                   variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        color: variant === 'primary' ? 'white' : '#6b7280',
        border: variant === 'secondary' ? '2px solid #e5e7eb' : 'none',
        cursor: 'pointer'
      }}
      whileHover={{
        scale: 1.1,
        background: variant === 'primary' ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' :
                   variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Icon size={iconSize} />
      </motion.div>
    </motion.button>
  )
}
