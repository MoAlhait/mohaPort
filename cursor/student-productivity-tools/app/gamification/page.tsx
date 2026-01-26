'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Trophy, Star, Target, Flame, Zap, Award, Crown, Medal, Shield, Gem, Gift } from 'lucide-react'
import Link from 'next/link'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  category: 'focus' | 'habits' | 'goals' | 'streaks' | 'social' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  progress: number
  maxProgress: number
  xpReward: number
  unlockedAt?: Date
  reward?: string
}

interface UserLevel {
  level: number
  xp: number
  xpToNext: number
  title: string
  nextTitle: string
  badge: string
}

interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  xp: number
  level: number
  badges: number
  streak: number
  rank: number
}

export default function Gamification() {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 15,
    xp: 2840,
    xpToNext: 160,
    title: 'Productivity Master',
    nextTitle: 'Focus Legend',
    badge: '🔥'
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Focus Novice',
      description: 'Complete your first Pomodoro session',
      icon: Target,
      category: 'focus',
      rarity: 'common',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      xpReward: 50,
      unlockedAt: new Date('2024-01-01'),
      reward: 'Unlock Advanced Timer'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Maintain a 30-day study streak',
      icon: Flame,
      category: 'streaks',
      rarity: 'epic',
      unlocked: true,
      progress: 30,
      maxProgress: 30,
      xpReward: 500,
      unlockedAt: new Date('2024-01-15'),
      reward: 'Golden Streak Badge'
    },
    {
      id: '3',
      title: 'Goal Crusher',
      description: 'Complete 50 SMART goals',
      icon: Trophy,
      category: 'goals',
      rarity: 'legendary',
      unlocked: false,
      progress: 32,
      maxProgress: 50,
      xpReward: 1000,
      reward: 'Legendary Goal Master Title'
    },
    {
      id: '4',
      title: 'Habit Builder',
      description: 'Maintain 5 habits for 60 days',
      icon: Zap,
      category: 'habits',
      rarity: 'rare',
      unlocked: false,
      progress: 45,
      maxProgress: 60,
      xpReward: 300,
      reward: 'Habit Master Badge'
    },
    {
      id: '5',
      title: 'Study Marathon',
      description: 'Study for 100 hours total',
      icon: Star,
      category: 'focus',
      rarity: 'epic',
      unlocked: false,
      progress: 87,
      maxProgress: 100,
      xpReward: 750,
      reward: 'Marathon Runner Badge'
    },
    {
      id: '6',
      title: 'Team Player',
      description: 'Join 5 study groups',
      icon: Award,
      category: 'social',
      rarity: 'common',
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      xpReward: 100,
      reward: 'Social Butterfly Badge'
    }
  ])

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'Mohammad Alhait', avatar: '👨‍💻', xp: 2840, level: 15, badges: 12, streak: 12, rank: 1 },
    { id: '2', name: 'Sarah Chen', avatar: '👩‍🎓', xp: 2650, level: 14, badges: 10, streak: 8, rank: 2 },
    { id: '3', name: 'Alex Rodriguez', avatar: '👨‍🔬', xp: 2400, level: 13, badges: 9, streak: 15, rank: 3 },
    { id: '4', name: 'Emma Wilson', avatar: '👩‍💼', xp: 2200, level: 12, badges: 8, streak: 6, rank: 4 },
    { id: '5', name: 'David Kim', avatar: '👨‍🎨', xp: 2050, level: 11, badges: 7, streak: 9, rank: 5 }
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-300 bg-yellow-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600'
      case 'rare': return 'text-blue-600'
      case 'epic': return 'text-purple-600'
      case 'legendary': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'focus': return '🎯'
      case 'habits': return '⚡'
      case 'goals': return '🏆'
      case 'streaks': return '🔥'
      case 'social': return '👥'
      case 'special': return '💎'
      default: return '⭐'
    }
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  const totalXP = achievements.reduce((sum, achievement) => sum + (achievement.unlocked ? achievement.xpReward : 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">Achievements & Rewards</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Level Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="w-8 h-8" />
                <h2 className="text-2xl font-bold">{userLevel.title} {userLevel.badge}</h2>
              </div>
              <p className="text-blue-100 mb-4">Level {userLevel.level} • {userLevel.xp} XP</p>
              <div className="w-full bg-blue-400 rounded-full h-3 mb-2">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(userLevel.xp / (userLevel.xp + userLevel.xpToNext)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-100">{userLevel.xpToNext} XP to {userLevel.nextTitle}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-2">{totalXP}</div>
              <p className="text-blue-100">Total XP Earned</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Unlocked Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Medal className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Unlocked Achievements ({unlockedAchievements.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <achievement.icon className={`w-6 h-6 ${getRarityTextColor(achievement.rarity)}`} />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${getRarityTextColor(achievement.rarity)}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">+{achievement.xpReward}</div>
                        <div className="text-xs text-gray-500">XP</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {getCategoryIcon(achievement.category)} {achievement.category}
                      </span>
                      <span className={`text-xs font-medium ${getRarityTextColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </span>
                    </div>
                    {achievement.reward && (
                      <div className="mt-2 p-2 bg-green-100 rounded text-sm text-green-800">
                        🎁 Reward: {achievement.reward}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Achievements in Progress ({lockedAchievements.length})</h3>
              </div>
              <div className="space-y-4">
                {lockedAchievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} opacity-75`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <achievement.icon className={`w-6 h-6 ${getRarityTextColor(achievement.rarity)}`} />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${getRarityTextColor(achievement.rarity)}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-400">{achievement.xpReward}</div>
                        <div className="text-xs text-gray-500">XP</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-800">{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getRarityTextColor(achievement.rarity).replace('text-', 'bg-')}`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {getCategoryIcon(achievement.category)} {achievement.category}
                      </span>
                      <span className={`text-xs font-medium ${getRarityTextColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Leaderboard</h3>
              </div>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div key={user.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    user.rank === 1 ? 'bg-yellow-50 border-2 border-yellow-200' :
                    user.rank === 2 ? 'bg-gray-50 border-2 border-gray-200' :
                    user.rank === 3 ? 'bg-orange-50 border-2 border-orange-200' :
                    'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                      {user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{user.name}</h4>
                      <p className="text-sm text-gray-600">Level {user.level} • {user.xp} XP</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-orange-600">
                        <Flame className="w-4 h-4" />
                        <span>{user.streak}</span>
                      </div>
                      <div className="text-xs text-gray-500">{user.badges} badges</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Challenges */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Challenges</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">Focus Marathon</h4>
                    <span className="text-sm text-blue-600">+100 XP</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Complete 4 Pomodoro sessions today</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Progress: 3/4</span>
                    <div className="w-20 bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-800">Habit Master</h4>
                    <span className="text-sm text-green-600">+50 XP</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">Complete all daily habits</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Progress: 5/7</span>
                    <div className="w-20 bg-green-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-800">Social Butterfly</h4>
                    <span className="text-sm text-purple-600">+75 XP</span>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">Join a study group session</p>
                  <button className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                    Join Session
                  </button>
                </div>
              </div>
            </div>

            {/* Rewards Shop */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Rewards Shop</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Premium Timer Themes</h4>
                    <span className="text-sm">500 XP</span>
                  </div>
                  <p className="text-sm text-yellow-100 mb-3">Unlock beautiful timer themes</p>
                  <button className="w-full py-2 bg-white text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium">
                    Purchase
                  </button>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Advanced Analytics</h4>
                    <span className="text-sm">750 XP</span>
                  </div>
                  <p className="text-sm text-blue-100 mb-3">Get detailed productivity insights</p>
                  <button className="w-full py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                    Purchase
                  </button>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Study Group Creator</h4>
                    <span className="text-sm">1000 XP</span>
                  </div>
                  <p className="text-sm text-green-100 mb-3">Create and manage study groups</p>
                  <button className="w-full py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
