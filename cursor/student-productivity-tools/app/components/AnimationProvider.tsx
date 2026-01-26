'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface AnimationContextType {
  prefersReducedMotion: boolean
  animationDuration: number
  animationEasing: string
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export const useAnimation = () => {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider')
  }
  return context
}

// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.1 }
}

export const slideInFromTop = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
}

export const slideInFromBottom = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 }
}

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
}

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Spring animations
export const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
}

export const gentleSpring = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1
}

export const bouncySpring = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.8
}

export const smoothSpring = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1
}

// Transition configurations
export const defaultTransition = {
  duration: 0.3,
  ease: [0.4, 0.0, 0.2, 1]
}

export const fastTransition = {
  duration: 0.15,
  ease: [0.4, 0.0, 0.2, 1]
}

export const slowTransition = {
  duration: 0.5,
  ease: [0.4, 0.0, 0.2, 1]
}

export const smoothTransition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94]
}

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
}

export const hoverLift = {
  y: -2,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  transition: { duration: 0.2 }
}

export const hoverGlow = {
  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
  transition: { duration: 0.2 }
}

export const hoverRotate = {
  rotate: 5,
  transition: { duration: 0.2 }
}

// Loading animations
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const breathe = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const shimmer = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export const rotate360 = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// Focus animations
export const focusGlow = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 0 10px rgba(59, 130, 246, 0.1)",
      "0 0 0 0 rgba(59, 130, 246, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const progressFill = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.5, ease: "easeOut" }
  })
}

export const countUp = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "backOut" }
}

// Particle animations
export const floatUp = {
  initial: { opacity: 0, y: 0 },
  animate: {
    opacity: [0, 1, 0],
    y: -100,
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
}

export const floatDown = {
  initial: { opacity: 0, y: 0 },
  animate: {
    opacity: [0, 1, 0],
    y: 100,
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
}

export const orbit = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

// Notification animations
export const slideInNotification = {
  initial: { opacity: 0, x: 300, scale: 0.8 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 300, scale: 0.8 }
}

export const toastBounce = {
  initial: { opacity: 0, scale: 0.3, y: -50 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.3, 
    y: -50,
    transition: { duration: 0.2 }
  }
}

// Tab animations
export const tabSlide = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
}

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const modalSlide = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 }
}

// Button animations
export const buttonPress = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 }
}

export const buttonGlow = {
  whileHover: {
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
    transition: { duration: 0.2 }
  }
}

// Card animations
export const cardHover = {
  whileHover: {
    y: -5,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  }
}

export const cardTap = {
  whileTap: { scale: 0.98 }
}

// Text animations
export const typewriter = {
  animate: {
    opacity: [0, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
}

export const textSlide = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
}

// Achievement animations
export const achievementPop = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  }
}

export const achievementGlow = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(255, 215, 0, 0)",
      "0 0 0 20px rgba(255, 215, 0, 0.2)",
      "0 0 0 0 rgba(255, 215, 0, 0)"
    ],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

interface AnimationProviderProps {
  children: React.ReactNode
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion()
  const [animationSpeed, setAnimationSpeedState] = useState<'slow' | 'normal' | 'fast'>('normal')

  const animationDuration = animationSpeed === 'slow' ? 0.5 : animationSpeed === 'fast' ? 0.15 : 0.3
  const animationEasing = prefersReducedMotion ? 'linear' : 'ease-out'

  const setAnimationSpeed = (speed: 'slow' | 'normal' | 'fast') => {
    setAnimationSpeedState(speed)
  }

  // Apply reduced motion preferences
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimationSpeed('fast')
    }
  }, [prefersReducedMotion])

  const contextValue: AnimationContextType = {
    prefersReducedMotion: !!prefersReducedMotion,
    animationDuration,
    animationEasing,
    setAnimationSpeed
  }

  return (
    <AnimationContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </AnimationContext.Provider>
  )
}

// Utility components for common animations
export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
)

export const SlideIn: React.FC<{ 
  children: React.ReactNode; 
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number 
}> = ({ children, direction = 'up', delay = 0 }) => {
  const variants = {
    up: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }
  }

  return (
    <motion.div
      initial={variants[direction].initial}
      animate={variants[direction].animate}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

export const ScaleIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay, ease: "backOut" }}
  >
    {children}
  </motion.div>
)

export const StaggerContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
  >
    {children}
  </motion.div>
)

export const StaggerItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={staggerItem}>
    {children}
  </motion.div>
)
