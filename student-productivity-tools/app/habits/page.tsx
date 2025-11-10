'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, ArrowLeft, Calendar, TrendingUp, Target, Award, Flame, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface Habit {
  id: string
  name: string
  description: string
  category: string
  frequency: 'daily' | 'weekly' | 'custom'
  customDays?: number[]
  target: number
  unit: string
  color: string
  icon: string
  createdAt: string
  streak: number
  bestStreak: number
  totalCompletions: number
  completionRate: number
}

interface HabitEntry {
  id: string
  habitId: string
  date: string
  completed: boolean
  value?: number
  notes?: string
}

const habitCategories = [
  { name: 'Study', color: 'from-blue-500 to-cyan-500', icon: '📚' },
  { name: 'Health', color: 'from-green-500 to-emerald-500', icon: '💪' },
  { name: 'Productivity', color: 'from-purple-500 to-pink-500', icon: '⚡' },
  { name: 'Mindfulness', color: 'from-yellow-500 to-orange-500', icon: '🧘' },
  { name: 'Social', color: 'from-red-500 to-rose-500', icon: '👥' },
  { name: 'Creative', color: 'from-indigo-500 to-violet-500', icon: '🎨' },
  { name: 'Other', color: 'from-gray-500 to-slate-500', icon: '📝' }
]

const habitIcons = ['📚', '💪', '⚡', '🧘', '👥', '🎨', '📝', '🏃', '🍎', '💤', '🎵', '📖', '✍️', '🎯', '🌟']

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [entries, setEntries] = useState<HabitEntry[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Study',
    frequency: 'daily' as const,
    customDays: [] as number[],
    target: 1,
    unit: 'times',
    color: 'from-blue-500 to-cyan-500',
    icon: '📚'
  })

  // Load data from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    const savedEntries = localStorage.getItem('habitEntries')
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem('habitEntries', JSON.stringify(entries))
  }, [entries])

  // Calculate streaks and statistics
  useEffect(() => {
    if (habits.length > 0 && entries.length > 0) {
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          const habitEntries = entries.filter(entry => entry.habitId === habit.id)
          const { streak, bestStreak, totalCompletions, completionRate } = calculateHabitStats(habit, habitEntries)
          
          return {
            ...habit,
            streak,
            bestStreak,
            totalCompletions,
            completionRate
          }
        })
      )
    }
  }, [entries])

  const calculateHabitStats = (habit: Habit, habitEntries: HabitEntry[]) => {
    const sortedEntries = habitEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    let streak = 0
    let bestStreak = 0
    let currentStreak = 0
    let totalCompletions = 0
    
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 30) // Check last 30 days
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      const dayEntry = sortedEntries.find(entry => entry.date === dateStr)
      
      if (dayEntry && dayEntry.completed) {
        currentStreak++
        totalCompletions++
        bestStreak = Math.max(bestStreak, currentStreak)
      } else {
        if (d.toDateString() === today.toDateString()) {
          streak = currentStreak
        }
        currentStreak = 0
      }
    }
    
    const totalDays = Math.ceil((today.getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const completionRate = totalDays > 0 ? Math.round((totalCompletions / totalDays) * 100) : 0
    
    return { streak, bestStreak, totalCompletions, completionRate }
  }

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        ...newHabit,
        createdAt: new Date().toISOString(),
        streak: 0,
        bestStreak: 0,
        totalCompletions: 0,
        completionRate: 0
      }
      setHabits([...habits, habit])
      setNewHabit({
        name: '',
        description: '',
        category: 'Study',
        frequency: 'daily',
        customDays: [],
        target: 1,
        unit: 'times',
        color: 'from-blue-500 to-cyan-500',
        icon: '📚'
      })
      setShowAddForm(false)
    }
  }

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id))
    setEntries(entries.filter(entry => entry.habitId !== id))
  }

  const toggleHabitEntry = (habitId: string, date: string) => {
    const existingEntry = entries.find(entry => entry.habitId === habitId && entry.date === date)
    
    if (existingEntry) {
      setEntries(entries.map(entry => 
        entry.id === existingEntry.id 
          ? { ...entry, completed: !entry.completed }
          : entry
      ))
    } else {
      const newEntry: HabitEntry = {
        id: Date.now().toString(),
        habitId,
        date,
        completed: true
      }
      setEntries([...entries, newEntry])
    }
  }

  const isHabitCompleted = (habitId: string, date: string) => {
    const entry = entries.find(entry => entry.habitId === habitId && entry.date === date)
    return entry ? entry.completed : false
  }

  const getDateEntries = (date: string) => {
    return entries.filter(entry => entry.date === date)
  }

  const getHabitsForDate = (date: string) => {
    const dayOfWeek = new Date(date).getDay()
    return habits.filter(habit => {
      if (habit.frequency === 'daily') return true
      if (habit.frequency === 'weekly' && habit.customDays?.includes(dayOfWeek)) return true
      return false
    })
  }

  const getTotalStats = () => {
    const totalHabits = habits.length
    const activeHabits = habits.filter(habit => habit.streak > 0).length
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0)
    const avgCompletionRate = habits.length > 0 
      ? Math.round(habits.reduce((sum, habit) => sum + habit.completionRate, 0) / habits.length)
      : 0
    
    return { totalHabits, activeHabits, totalCompletions, avgCompletionRate }
  }

  const stats = getTotalStats()

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
            <h1 className="text-xl font-bold gradient-text">Habit Tracker</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Habit Tracker</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build positive habits and track your progress with detailed analytics and streak tracking.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalHabits}</div>
            <p className="text-gray-600">Total Habits</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeHabits}</div>
            <p className="text-gray-600">Active Streaks</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalCompletions}</div>
            <p className="text-gray-600">Total Completions</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.avgCompletionRate}%</div>
            <p className="text-gray-600">Avg Completion Rate</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-lg font-semibold border-none focus:outline-none"
              />
            </div>
            <div className="text-sm text-gray-500">
              {getHabitsForDate(selectedDate).length} habits for this day
            </div>
          </div>
        </div>

        {/* Add Habit Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="w-6 h-6" />
            <span>Add New Habit</span>
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-6">Create New Habit</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  placeholder="e.g., Read for 30 minutes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {habitCategories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {habitIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewHabit({...newHabit, icon})}
                      className={`p-2 rounded-lg text-2xl hover:bg-gray-100 transition-colors ${
                        newHabit.icon === icon ? 'bg-blue-100 border-2 border-blue-500' : ''
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={newHabit.target}
                    onChange={(e) => setNewHabit({...newHabit, target: parseInt(e.target.value) || 1})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newHabit.unit}
                    onChange={(e) => setNewHabit({...newHabit, unit: e.target.value})}
                    placeholder="times"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addHabit}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Habit
              </button>
            </div>
          </div>
        )}

        {/* Habits List */}
        {habits.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Your Habits</h3>
            
            {/* Daily Habits */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-700">Today's Habits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getHabitsForDate(selectedDate).map((habit) => {
                  const isCompleted = isHabitCompleted(habit.id, selectedDate)
                  const category = habitCategories.find(cat => cat.name === habit.category)
                  
                  return (
                    <div key={habit.id} className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{habit.icon}</span>
                          <div>
                            <h5 className="font-semibold text-gray-800">{habit.name}</h5>
                            <p className="text-sm text-gray-500">{habit.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-lg font-bold text-orange-500">{habit.streak}</span>
                          </div>
                          <p className="text-xs text-gray-500">Current Streak</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-lg font-bold text-yellow-500">{habit.bestStreak}</span>
                          </div>
                          <p className="text-xs text-gray-500">Best Streak</p>
                        </div>
                      </div>

                      {/* Completion Button */}
                      <button
                        onClick={() => toggleHabitEntry(habit.id, selectedDate)}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                          isCompleted
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {isCompleted ? (
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <span>Mark Complete</span>
                          </div>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">Habit Building Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-blue-600">Start Small</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Begin with 2-3 minutes per day</li>
                <li>• Focus on consistency over intensity</li>
                <li>• Build momentum before increasing difficulty</li>
                <li>• Celebrate small wins</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-green-600">Stack Habits</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Attach new habits to existing routines</li>
                <li>• Use habit stacking formula: "After [existing habit], I will [new habit]"</li>
                <li>• Create environmental cues</li>
                <li>• Make it obvious and easy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-purple-600">Track Progress</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Monitor streaks and completion rates</li>
                <li>• Review weekly progress</li>
                <li>• Adjust targets based on performance</li>
                <li>• Learn from missed days</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-orange-600">Stay Motivated</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Focus on identity change, not just behavior</li>
                <li>• Remember your "why"</li>
                <li>• Join accountability groups</li>
                <li>• Reward yourself for milestones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
