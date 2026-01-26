'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Clock, 
  Users, 
  Award, 
  Brain, 
  Bell, 
  Zap, 
  BarChart3,
  Calendar,
  BookOpen,
  Coffee,
  Star,
  Trophy,
  MessageCircle,
  Settings,
  Plus,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Activity,
  Flame
} from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  totalStudyTime: number
  completedGoals: number
  currentStreak: number
  productivityScore: number
  focusSessions: number
  habitsCompleted: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  unlocked: boolean
  progress: number
  maxProgress: number
  reward: string
}

interface StudyGroup {
  id: string
  name: string
  members: number
  activeNow: number
  subject: string
  nextSession: string
}

interface AIInsight {
  id: string
  type: 'tip' | 'warning' | 'achievement' | 'recommendation'
  title: string
  message: string
  action?: string
  priority: 'high' | 'medium' | 'low'
}

export default function Dashboard() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalStudyTime: 1240,
    completedGoals: 8,
    currentStreak: 12,
    productivityScore: 87,
    focusSessions: 45,
    habitsCompleted: 23
  })

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Focus Master',
      description: 'Complete 100 Pomodoro sessions',
      icon: Target,
      unlocked: false,
      progress: 45,
      maxProgress: 100,
      reward: 'Unlock Advanced Timer'
    },
    {
      id: '2',
      title: 'Habit Builder',
      description: 'Maintain a habit for 30 days',
      icon: CheckCircle,
      unlocked: true,
      progress: 30,
      maxProgress: 30,
      reward: 'Golden Habit Badge'
    },
    {
      id: '3',
      title: 'Goal Crusher',
      description: 'Complete 10 SMART goals',
      icon: Trophy,
      unlocked: false,
      progress: 8,
      maxProgress: 10,
      reward: 'Goal Master Title'
    }
  ])

  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'CS 61A Study Group',
      members: 12,
      activeNow: 4,
      subject: 'Computer Science',
      nextSession: 'Today, 2:00 PM'
    },
    {
      id: '2',
      name: 'Productivity Masters',
      members: 8,
      activeNow: 2,
      subject: 'Study Techniques',
      nextSession: 'Tomorrow, 10:00 AM'
    }
  ])

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'tip',
      title: 'Peak Performance Time',
      message: 'You\'re most productive between 9-11 AM. Schedule your hardest tasks then!',
      action: 'Schedule Important Task',
      priority: 'medium'
    },
    {
      id: '2',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You\'ve maintained your study streak for 12 days. Keep it up!',
      priority: 'high'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Study Group Recommendation',
      message: 'Join the "Advanced Calculus" group - 6 active members studying similar topics.',
      action: 'Join Group',
      priority: 'low'
    }
  ])

  const [quickActions] = useState([
    { id: '1', title: 'Start Focus Session', icon: Target, color: 'from-red-500 to-orange-500', href: '/pomodoro' },
    { id: '2', title: 'Track Habit', icon: CheckCircle, color: 'from-green-500 to-emerald-500', href: '/habits' },
    { id: '3', title: 'Set New Goal', icon: Star, color: 'from-purple-500 to-pink-500', href: '/smart-goals' },
    { id: '4', title: 'Join Study Group', icon: Users, color: 'from-blue-500 to-cyan-500', href: '/study-groups' }
  ])

  const getProductivityLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 75) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const productivityLevel = getProductivityLevel(userStats.productivityScore)

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
            <h1 className="text-xl font-bold gradient-text">Productivity Dashboard</h1>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Mohammad! 👋</h1>
          <p className="text-gray-600">Here's your productivity overview for today</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Study Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% from last week
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.currentStreak} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <Award className="w-4 h-4 mr-1" />
              Personal best!
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Productivity Score</p>
                <p className="text-2xl font-bold text-purple-600">{userStats.productivityScore}/100</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${productivityLevel.color} ${productivityLevel.bg}`}>
                {productivityLevel.level}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Goals Completed</p>
                <p className="text-2xl font-bold text-green-600">{userStats.completedGoals}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Star className="w-4 h-4 mr-1" />
              2 more to unlock badge
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Powered by AI
                </span>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                    insight.priority === 'high' ? 'border-red-500 bg-red-50' :
                    insight.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{insight.message}</p>
                        {insight.action && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            {insight.action} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.href}
                    className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all transform hover:-translate-y-1`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <action.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{action.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Study Groups */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Your Study Groups</h3>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Join More</span>
                </button>
              </div>
              <div className="space-y-4">
                {studyGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{group.name}</h4>
                        <p className="text-sm text-gray-600">{group.subject} • {group.members} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{group.activeNow} active now</span>
                      </div>
                      <p className="text-sm text-gray-500">Next: {group.nextSession}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Achievements</h3>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                    achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <achievement.icon className={`w-6 h-6 ${
                        achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          achievement.unlocked ? 'text-green-800' : 'text-gray-800'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-800">{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                      {achievement.unlocked && (
                        <p className="text-xs text-green-600 font-medium">🎉 {achievement.reward}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Focus */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Focus</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">Complete CS 61A Assignment</p>
                    <p className="text-sm text-gray-600">Due: Tomorrow, 11:59 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">30-minute workout</p>
                    <p className="text-sm text-gray-600">Completed ✓</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800">Read Chapter 5</p>
                    <p className="text-sm text-gray-600">Progress: 60%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Productivity Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">This Week's Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tuesday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wednesday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thursday</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
