'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  direction: number
  life: number
  maxLife: number
  color: string
  opacity: number
}

interface ParticleSystemProps {
  type?: 'floating' | 'rising' | 'falling' | 'orbiting' | 'burst' | 'spiral'
  count?: number
  colors?: string[]
  speed?: number
  size?: number
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  onParticleCreate?: (particle: Particle) => void
  onParticleDestroy?: (particle: Particle) => void
}

const particleTypes = {
  floating: {
    colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
    speed: 0.5,
    size: 4,
    life: 100
  },
  rising: {
    colors: ['#fbbf24', '#f59e0b', '#d97706'],
    speed: 1,
    size: 6,
    life: 80
  },
  falling: {
    colors: ['#8b5cf6', '#6366f1', '#3b82f6'],
    speed: 1.2,
    size: 5,
    life: 90
  },
  orbiting: {
    colors: ['#06b6d4', '#0891b2', '#0e7490'],
    speed: 0.8,
    size: 3,
    life: 120
  },
  burst: {
    colors: ['#ef4444', '#f97316', '#eab308'],
    speed: 2,
    size: 8,
    life: 60
  },
  spiral: {
    colors: ['#8b5cf6', '#a855f7', '#c084fc'],
    speed: 1.5,
    size: 4,
    life: 100
  }
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type = 'floating',
  count = 50,
  colors,
  speed,
  size,
  intensity = 'medium',
  className = '',
  onParticleCreate,
  onParticleDestroy
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const [isVisible, setIsVisible] = useState(true)

  const config = particleTypes[type]
  const finalColors = colors || config.colors
  const finalSpeed = speed || config.speed
  const finalSize = size || config.size

  const intensityMultipliers = {
    low: { count: 0.5, speed: 0.7, size: 0.8 },
    medium: { count: 1, speed: 1, size: 1 },
    high: { count: 1.5, speed: 1.3, size: 1.2 }
  }

  const multiplier = intensityMultipliers[intensity]
  const adjustedCount = Math.floor(count * multiplier.count)
  const adjustedSpeed = finalSpeed * multiplier.speed
  const adjustedSize = finalSize * multiplier.size

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create initial particles
    const createParticle = (id: number): Particle => {
      const particle: Particle = {
        id,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: adjustedSize + Math.random() * adjustedSize,
        speed: adjustedSpeed + Math.random() * adjustedSpeed,
        direction: Math.random() * Math.PI * 2,
        life: config.life,
        maxLife: config.life,
        color: finalColors[Math.floor(Math.random() * finalColors.length)],
        opacity: 1
      }

      onParticleCreate?.(particle)
      return particle
    }

    // Initialize particles
    particlesRef.current = Array.from({ length: adjustedCount }, (_, i) => createParticle(i))

    const updateParticles = () => {
      if (!isVisible) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update particle based on type
        switch (type) {
          case 'floating':
            particle.x += Math.cos(particle.direction) * particle.speed
            particle.y += Math.sin(particle.direction) * particle.speed
            particle.direction += (Math.random() - 0.5) * 0.1
            break

          case 'rising':
            particle.y -= particle.speed
            particle.x += (Math.random() - 0.5) * 0.5
            break

          case 'falling':
            particle.y += particle.speed
            particle.x += (Math.random() - 0.5) * 0.3
            break

          case 'orbiting':
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            const radius = 100 + particle.id * 2
            particle.direction += particle.speed * 0.02
            particle.x = centerX + Math.cos(particle.direction) * radius
            particle.y = centerY + Math.sin(particle.direction) * radius
            break

          case 'burst':
            particle.x += Math.cos(particle.direction) * particle.speed
            particle.y += Math.sin(particle.direction) * particle.speed
            particle.speed *= 0.98
            break

          case 'spiral':
            const spiralCenterX = canvas.width / 2
            const spiralCenterY = canvas.height / 2
            const spiralRadius = particle.life * 0.5
            particle.direction += particle.speed * 0.05
            particle.x = spiralCenterX + Math.cos(particle.direction) * spiralRadius
            particle.y = spiralCenterY + Math.sin(particle.direction) * spiralRadius
            break
        }

        // Update life and opacity
        particle.life--
        particle.opacity = particle.life / particle.maxLife

        // Remove dead particles and create new ones
        if (particle.life <= 0) {
          onParticleDestroy?.(particle)
          particlesRef.current[index] = createParticle(particle.id)
        }

        // Keep particles within bounds
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect
        if (type === 'burst' || type === 'spiral') {
          ctx.shadowColor = particle.color
          ctx.shadowBlur = particle.size * 2
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(updateParticles)
    }

    updateParticles()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [type, adjustedCount, adjustedSpeed, adjustedSize, finalColors, config.life, isVisible, onParticleCreate, onParticleDestroy])

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  )
}

// Specialized particle systems
export const FloatingParticles: React.FC<Omit<ParticleSystemProps, 'type'>> = (props) => (
  <ParticleSystem type="floating" {...props} />
)

export const RisingParticles: React.FC<Omit<ParticleSystemProps, 'type'>> = (props) => (
  <ParticleSystem type="rising" {...props} />
)

export const FallingParticles: React.FC<Omit<ParticleSystemProps, 'type'>> = (props) => (
  <ParticleSystem type="falling" {...props} />
)

export const OrbitingParticles: React.FC<Omit<ParticleSystemProps, 'type'>> = (props) => (
  <ParticleSystem type="orbiting" {...props} />
)

export const BurstParticles: React.FC<Omit<ParticleSystemProps, 'type'>> = (props) => (
  <ParticleSystem type="burst" {...props} />
)

export const SpiralParticles: React.FC<Omit<ParticleSystemProps, 'type'>> = (props) => (
  <ParticleSystem type="spiral" {...props} />
)

// Ambient background component
export const AmbientBackground: React.FC<{
  type?: 'calm' | 'energetic' | 'focused' | 'meditative'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}> = ({ type = 'calm', intensity = 'medium', className = '' }) => {
  const backgroundConfigs = {
    calm: {
      particles: { type: 'floating' as const, count: 30, colors: ['#3b82f6', '#8b5cf6', '#06b6d4'] },
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    energetic: {
      particles: { type: 'burst' as const, count: 40, colors: ['#ef4444', '#f97316', '#eab308'] },
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)'
    },
    focused: {
      particles: { type: 'orbiting' as const, count: 25, colors: ['#10b981', '#059669', '#047857'] },
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    meditative: {
      particles: { type: 'spiral' as const, count: 20, colors: ['#8b5cf6', '#a855f7', '#c084fc'] },
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)'
    }
  }

  const config = backgroundConfigs[type]

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{ background: config.gradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ParticleSystem
        {...config.particles}
        intensity={intensity}
      />
    </motion.div>
  )
}

// Interactive particle system
export const InteractiveParticles: React.FC<{
  children: React.ReactNode
  particleType?: ParticleSystemProps['type']
  className?: string
}> = ({ children, particleType = 'floating', className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      
      {isHovering && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ParticleSystem
            type={particleType}
            count={20}
            intensity="low"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

// Achievement particle burst
export const AchievementBurst: React.FC<{
  trigger: boolean
  onComplete?: () => void
}> = ({ trigger, onComplete }) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsActive(true)
      setTimeout(() => {
        setIsActive(false)
        onComplete?.()
      }, 2000)
    }
  }, [trigger, onComplete])

  if (!isActive) return null

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ParticleSystem
        type="burst"
        count={100}
        colors={['#fbbf24', '#f59e0b', '#d97706', '#b45309']}
        intensity="high"
        className="absolute inset-0"
      />
    </motion.div>
  )
}
