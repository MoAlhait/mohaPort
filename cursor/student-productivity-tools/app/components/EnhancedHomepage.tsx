'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Target, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Brain,
  Zap,
  Award,
  BookOpen,
  Focus,
  Play,
  Star,
  TrendingUp,
  Users,
  Sparkles,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { AnimatedButton, PrimaryButton, SecondaryButton } from './AnimatedButton'
import { AnimatedCard, ElevatedCard, GradientCard } from './AnimatedCard'
import { FluidTimer, PomodoroTimer, StudyTimer } from './FluidTimer'
import { ParticleSystem, AmbientBackground, FloatingParticles } from './ParticleSystem'
import { LoadingSpinner, SkeletonCard } from './LoadingStates'
import { SwipeCard, TiltCard, MagneticButton, HoverGlow } from './GestureAnimations'
import { 
  fadeInUp, 
  fadeInDown, 
  scaleIn, 
  staggerContainer, 
  staggerItem,
  slideInFromTop,
  slideInFromBottom,
  hoverScale,
  hoverLift,
  springConfig,
  smoothTransition
} from './AnimationProvider'

const tools = [
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    description: '25-minute focused work sessions with 5-minute breaks',
    icon: Clock,
    color: 'from-red-500 to-pink-500',
    href: '/pomodoro',
    features: ['Focus sessions', 'Break reminders', 'Productivity tracking']
  },
  {
    id: 'eisenhower',
    title: 'Eisenhower Matrix',
    description: 'Prioritize tasks by urgency and importance',
    icon: Target,
    color: 'from-blue-500 to-indigo-500',
    href: '/eisenhower',
    features: ['Task prioritization', 'Visual organization', 'Decision making']
  },
  {
    id: 'smart-goals',
    title: 'SMART Goals',
    description: 'Set Specific, Measurable, Achievable, Relevant, Time-bound goals',
    icon: CheckSquare,
    color: 'from-green-500 to-emerald-500',
    href: '/smart-goals',
    features: ['Goal setting', 'Progress tracking', 'Achievement planning']
  },
  {
    id: 'habits',
    title: 'Habit Tracker',
    description: 'Build and maintain positive study habits',
    icon: Calendar,
    color: 'from-purple-500 to-violet-500',
    href: '/habits',
    features: ['Habit tracking', 'Streak monitoring', 'Motivation system']
  },
  {
    id: 'study-timer',
    title: 'Study Timer',
    description: 'Advanced timer with multiple focus modes',
    icon: BookOpen,
    color: 'from-orange-500 to-amber-500',
    href: '/study-timer',
    features: ['Multiple modes', 'Custom sessions', 'Progress analytics']
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track your productivity and study patterns',
    icon: BarChart3,
    color: 'from-teal-500 to-cyan-500',
    href: '/analytics',
    features: ['Progress insights', 'Trend analysis', 'Performance metrics']
  },
  {
    id: 'focus-lock',
    title: 'Focus Lock',
    description: 'Lock yourself out of distractions and focus on your task',
    icon: Lock,
    color: 'from-red-500 to-pink-500',
    href: '/focus-lock',
    features: ['App blocking', 'Website blocking', 'System-level focus']
  }
]

const features = [
  {
    icon: Brain,
    title: 'Smart Focus Modes',
    description: 'Adaptive timers that adjust to your productivity patterns',
    color: 'text-blue-500'
  },
  {
    icon: Zap,
    title: 'Instant Activation',
    description: 'Start focusing in seconds with one-click timer activation',
    color: 'text-yellow-500'
  },
  {
    icon: Award,
    title: 'Achievement System',
    description: 'Gamified progress tracking with rewards and milestones',
    color: 'text-purple-500'
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Detailed insights into your productivity and study habits',
    color: 'text-green-500'
  },
  {
    icon: Focus,
    title: 'Distraction Blocking',
    description: 'Built-in tools to minimize distractions during study sessions',
    color: 'text-red-500'
  },
  {
    icon: Users,
    title: 'Community Features',
    description: 'Connect with other students and share productivity tips',
    color: 'text-indigo-500'
  }
]

const stats = [
  { number: '10K+', label: 'Active Users', icon: Users },
  { number: '50M+', label: 'Focus Minutes', icon: Clock },
  { number: '95%', label: 'Success Rate', icon: TrendingUp },
  { number: '4.9/5', label: 'User Rating', icon: Star }
]

export const EnhancedHomepage: React.FC = () => {
  const [currentToolIndex, setCurrentToolIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto-rotate featured tools
    const interval = setInterval(() => {
      setCurrentToolIndex((prev) => (prev + 1) % tools.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <LoadingSpinner size="xl" className="mb-4" />
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading your productivity suite...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background */}
      <AmbientBackground type="calm" intensity="low" />
      
      {/* Floating Particles */}
      <FloatingParticles 
        count={30} 
        colors={['#3b82f6', '#8b5cf6', '#06b6d4']}
        className="opacity-30"
      />

      {/* Hero Section */}
      <motion.section
        className="relative px-4 py-20 text-center"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={staggerItem} className="max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            variants={slideInFromTop}
            transition={springConfig}
          >
            Student Productivity Tools
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            variants={fadeInUp}
            transition={{ ...smoothTransition, delay: 0.2 }}
          >
            Transform your study habits with our comprehensive suite of productivity tools designed specifically for students
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
            transition={{ ...smoothTransition, delay: 0.4 }}
          >
            <PrimaryButton
              size="lg"
              icon={Play}
              className="px-8 py-4 text-lg"
            >
              Get Started Free
            </PrimaryButton>
            
            <SecondaryButton
              size="lg"
              icon={Sparkles}
              className="px-8 py-4 text-lg"
              onClick={() => setShowDemo(!showDemo)}
            >
              Watch Demo
            </SecondaryButton>
          </motion.div>
        </motion.div>

        {/* Demo Timer */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              className="mt-12 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={springConfig}
            >
              <TiltCard intensity={15}>
                <PomodoroTimer
                  duration={25 * 60}
                  isActive={false}
                />
              </TiltCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center"
              >
                <HoverGlow glowColor="#3b82f6" intensity={0.3}>
                  <ElevatedCard className="p-6">
                    <motion.div
                      className="flex flex-col items-center space-y-3"
                      whileHover={hoverScale}
                      transition={smoothTransition}
                    >
                      <stat.icon className="w-8 h-8 text-blue-500" />
                      <motion.div
                        className="text-3xl font-bold text-gray-800"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ ...springConfig, delay: index * 0.1 }}
                      >
                        {stat.number}
                      </motion.div>
                      <p className="text-gray-600 font-medium">{stat.label}</p>
                    </motion.div>
                  </ElevatedCard>
                </HoverGlow>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Tools Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={slideInFromTop}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Productivity Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to maximize your study efficiency and achieve your academic goals
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {tools.map((tool, index) => (
              <motion.div key={tool.id} variants={staggerItem}>
                <SwipeCard
                  onSwipeLeft={() => setCurrentToolIndex((prev) => (prev + 1) % tools.length)}
                  onSwipeRight={() => setCurrentToolIndex((prev) => (prev - 1 + tools.length) % tools.length)}
                  className="h-full"
                >
                  <Link href={tool.href}>
                    <GradientCard
                      className={`h-full p-8 bg-gradient-to-br ${tool.color} text-white cursor-pointer`}
                      whileHover={hoverLift}
                      transition={smoothTransition}
                    >
                      <motion.div
                        className="flex flex-col h-full"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div
                          className="flex items-center mb-4"
                          whileHover={{ rotate: 5 }}
                          transition={smoothTransition}
                        >
                          <tool.icon className="w-8 h-8 mr-3" />
                          <h3 className="text-2xl font-bold">{tool.title}</h3>
                        </motion.div>
                        
                        <p className="text-lg mb-6 flex-grow">
                          {tool.description}
                        </p>
                        
                        <div className="space-y-2">
                          {tool.features.map((feature, featureIndex) => (
                            <motion.div
                              key={feature}
                              className="flex items-center text-sm"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                            >
                              <div className="w-2 h-2 bg-white rounded-full mr-3" />
                              {feature}
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div
                          className="mt-6 flex items-center text-sm font-medium"
                          whileHover={{ x: 5 }}
                          transition={smoothTransition}
                        >
                          Get Started →
                        </motion.div>
                      </motion.div>
                    </GradientCard>
                  </Link>
                </SwipeCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={slideInFromBottom}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Why Choose Our Tools?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for students with features that actually improve productivity
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <MagneticButton intensity={0.2}>
                  <ElevatedCard className="p-8 h-full">
                    <motion.div
                      className="text-center"
                      whileHover={hoverScale}
                      transition={smoothTransition}
                    >
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center ${feature.color}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="w-8 h-8" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </motion.div>
                  </ElevatedCard>
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Ready to Boost Your Productivity?
          </motion.h2>
          
          <motion.p
            className="text-xl mb-8 opacity-90"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of students who have transformed their study habits
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <PrimaryButton
              size="lg"
              icon={Zap}
              className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Free Trial
            </PrimaryButton>
            
            <SecondaryButton
              size="lg"
              icon={Users}
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
            >
              View Pricing
            </SecondaryButton>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
