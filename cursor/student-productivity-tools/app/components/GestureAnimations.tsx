'use client'

import React, { useRef, useState } from 'react'
import { motion, useDragControls, useMotionValue, useTransform, PanInfo } from 'framer-motion'

interface SwipeCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 100,
  className = ''
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -threshold, 0, threshold, 200], [0, 0.5, 1, 0.5, 0])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > 500) {
      if (offset.y > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }

    // Reset position
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => void
  threshold?: number
  className?: string
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 100,
  className = ''
}) => {
  const y = useMotionValue(0)
  const pullDistance = useTransform(y, [0, threshold], [0, 1])
  const rotate = useTransform(y, [0, threshold], [0, 360])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > threshold) {
      onRefresh()
    }
    y.set(0)
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full"
        style={{ opacity: pullDistance, scale: pullDistance }}
      >
        <motion.div
          style={{ rotate }}
          transition={{ duration: 0.5 }}
        >
          ↻
        </motion.div>
      </motion.div>

      {children}
    </motion.div>
  )
}

interface PinchZoomProps {
  children: React.ReactNode
  minScale?: number
  maxScale?: number
  className?: string
}

export const PinchZoom: React.FC<PinchZoomProps> = ({
  children,
  minScale = 0.5,
  maxScale = 3,
  className = ''
}) => {
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{ scale, rotate }}
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1 }}
      onWheel={(event) => {
        event.preventDefault()
        const delta = event.deltaY > 0 ? -0.1 : 0.1
        const newScale = Math.max(minScale, Math.min(maxScale, scale.get() + delta))
        scale.set(newScale)
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

interface TiltCardProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  intensity = 20,
  className = ''
}) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (event.clientX - centerX) / rect.width
    const deltaY = (event.clientY - centerY) / rect.height
    
    setRotateY(deltaX * intensity)
    setRotateX(-deltaY * intensity)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      className={`transform-gpu ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

interface MagneticButtonProps {
  children: React.ReactNode
  intensity?: number
  className?: string
  onClick?: () => void
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  intensity = 0.3,
  className = '',
  onClick
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (event.clientX - centerX) * intensity
    const deltaY = (event.clientY - centerY) * intensity
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={`cursor-pointer ${className}`}
      style={{
        x: position.x,
        y: position.y
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

interface GestureSliderProps {
  children: React.ReactNode[]
  currentIndex: number
  onIndexChange: (index: number) => void
  className?: string
}

export const GestureSlider: React.FC<GestureSliderProps> = ({
  children,
  currentIndex,
  onIndexChange,
  className = ''
}) => {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    const { offset, velocity } = info

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && currentIndex > 0) {
        onIndexChange(currentIndex - 1)
      } else if (offset.x < 0 && currentIndex < children.length - 1) {
        onIndexChange(currentIndex + 1)
      }
    }

    x.set(0)
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ x }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="flex"
        style={{
          x: useTransform(x, (value) => -currentIndex * (containerRef.current?.offsetWidth || 0) + value)
        }}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0.7,
              scale: index === currentIndex ? 1 : 0.9
            }}
            transition={{ duration: 0.3 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

interface LongPressProps {
  children: React.ReactNode
  onLongPress: () => void
  duration?: number
  className?: string
}

export const LongPress: React.FC<LongPressProps> = ({
  children,
  onLongPress,
  duration = 500,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const pressTimer = useRef<NodeJS.Timeout>()

  const handlePressStart = () => {
    setIsPressed(true)
    pressTimer.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
    }, duration)
  }

  const handlePressEnd = () => {
    setIsPressed(false)
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
    }
  }

  return (
    <motion.div
      className={className}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      animate={{
        scale: isPressed ? 0.95 : 1,
        opacity: isPressed ? 0.8 : 1
      }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxScrollProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  children,
  offset = 50,
  className = ''
}) => {
  const y = useMotionValue(0)
  const yTransform = useTransform(y, [0, -1], [0, offset])

  return (
    <motion.div
      className={className}
      style={{ y: yTransform }}
      onViewportEnter={() => y.set(-1)}
      onViewportLeave={() => y.set(0)}
    >
      {children}
    </motion.div>
  )
}

interface DragToReorderProps {
  items: any[]
  onReorder: (newOrder: any[]) => void
  renderItem: (item: any, index: number) => React.ReactNode
  className?: string
}

export const DragToReorder: React.FC<DragToReorderProps> = ({
  items,
  onReorder,
  renderItem,
  className = ''
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newItems = [...items]
      const draggedItem = newItems.splice(draggedIndex, 1)[0]
      newItems.splice(dragOverIndex, 0, draggedItem)
      onReorder(newItems)
    }
    
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="cursor-grab active:cursor-grabbing"
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragStart={() => handleDragStart(index)}
          onDragEnd={handleDragEnd}
          onDragOver={() => setDragOverIndex(index)}
          whileDrag={{ scale: 1.05, zIndex: 1000 }}
          animate={{
            y: draggedIndex === index ? -5 : 0,
            opacity: draggedIndex === index ? 0.8 : 1
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </div>
  )
}

interface HoverGlowProps {
  children: React.ReactNode
  glowColor?: string
  intensity?: number
  className?: string
}

export const HoverGlow: React.FC<HoverGlowProps> = ({
  children,
  glowColor = '#3b82f6',
  intensity = 0.5,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered
          ? `0 0 20px ${glowColor}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`
          : '0 0 0px transparent'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
