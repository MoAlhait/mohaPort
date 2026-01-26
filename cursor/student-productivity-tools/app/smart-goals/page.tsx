'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit3, ArrowLeft, Target, Calendar, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface SMARTGoal {
  id: string
  title: string
  description: string
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
  deadline: string
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
  createdAt: string
}

const statusConfig = {
  'not-started': {
    label: 'Not Started',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    icon: AlertCircle
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    icon: TrendingUp
  },
  'completed': {
    label: 'Completed',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    icon: CheckCircle
  }
}

export default function SMARTGoals() {
  const [goals, setGoals] = useState<SMARTGoal[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    deadline: ''
  })

  const addGoal = () => {
    if (newGoal.title && newGoal.specific && newGoal.measurable && newGoal.achievable && newGoal.relevant && newGoal.timeBound) {
      const goal: SMARTGoal = {
        id: Date.now().toString(),
        ...newGoal,
        progress: 0,
        status: 'not-started',
        createdAt: new Date().toISOString()
      }
      setGoals([...goals, goal])
      setNewGoal({
        title: '',
        description: '',
        specific: '',
        measurable: '',
        achievable: '',
        relevant: '',
        timeBound: '',
        deadline: ''
      })
      setShowAddForm(false)
    }
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const updateProgress = (id: string, progress: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newStatus = progress === 0 ? 'not-started' : progress === 100 ? 'completed' : 'in-progress'
        return { ...goal, progress, status: newStatus }
      }
      return goal
    }))
  }

  const updateStatus = (id: string, status: SMARTGoal['status']) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newProgress = status === 'completed' ? 100 : status === 'not-started' ? 0 : goal.progress
        return { ...goal, status, progress: newProgress }
      }
      return goal
    }))
  }

  const getGoalsByStatus = (status: SMARTGoal['status']) => {
    return goals.filter(goal => goal.status === status)
  }

  const getTotalGoals = () => goals.length
  const getCompletedGoals = () => goals.filter(goal => goal.status === 'completed').length
  const getAverageProgress = () => {
    if (goals.length === 0) return 0
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0)
    return Math.round(totalProgress / goals.length)
  }

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
            <h1 className="text-xl font-bold gradient-text">SMART Goals</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">SMART Goals Tracker</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create Specific, Measurable, Achievable, Relevant, and Time-bound goals to achieve your objectives effectively.
          </p>
        </div>

        {/* Statistics */}
        {goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{getTotalGoals()}</div>
              <p className="text-gray-600">Total Goals</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{getCompletedGoals()}</div>
              <p className="text-gray-600">Completed</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{getAverageProgress()}%</div>
              <p className="text-gray-600">Avg Progress</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {getTotalGoals() > 0 ? Math.round((getCompletedGoals() / getTotalGoals()) * 100) : 0}%
              </div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        )}

        {/* Add Goal Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="w-6 h-6" />
            <span>Add New SMART Goal</span>
          </button>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-6">Create New SMART Goal</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., Improve my GPA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Brief description of your goal..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 font-bold">S</span>pecific
                  </label>
                  <textarea
                    value={newGoal.specific}
                    onChange={(e) => setNewGoal({...newGoal, specific: e.target.value})}
                    placeholder="What exactly do you want to achieve?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-orange-500 font-bold">M</span>easurable
                  </label>
                  <textarea
                    value={newGoal.measurable}
                    onChange={(e) => setNewGoal({...newGoal, measurable: e.target.value})}
                    placeholder="How will you measure success?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-yellow-500 font-bold">A</span>chievable
                  </label>
                  <textarea
                    value={newGoal.achievable}
                    onChange={(e) => setNewGoal({...newGoal, achievable: e.target.value})}
                    placeholder="Is this goal realistic and attainable?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-green-500 font-bold">R</span>elevant
                  </label>
                  <textarea
                    value={newGoal.relevant}
                    onChange={(e) => setNewGoal({...newGoal, relevant: e.target.value})}
                    placeholder="Why is this goal important to you?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-blue-500 font-bold">T</span>ime-bound
                  </label>
                  <textarea
                    value={newGoal.timeBound}
                    onChange={(e) => setNewGoal({...newGoal, timeBound: e.target.value})}
                    placeholder="When will you achieve this goal?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        {goals.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Your SMART Goals</h3>
            {goals.map((goal) => {
              const statusInfo = statusConfig[goal.status]
              const StatusIcon = statusInfo.icon

              return (
                <div key={goal.id} className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold mb-2">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-gray-600 mb-4">{goal.description}</p>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-500">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                          <span className={`text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        {goal.deadline && (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* SMART Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-red-600 font-bold text-sm mb-2">SPECIFIC</div>
                      <p className="text-sm text-gray-700">{goal.specific}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-orange-600 font-bold text-sm mb-2">MEASURABLE</div>
                      <p className="text-sm text-gray-700">{goal.measurable}</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-yellow-600 font-bold text-sm mb-2">ACHIEVABLE</div>
                      <p className="text-sm text-gray-700">{goal.achievable}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 font-bold text-sm mb-2">RELEVANT</div>
                      <p className="text-sm text-gray-700">{goal.relevant}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-blue-600 font-bold text-sm mb-2">TIME-BOUND</div>
                      <p className="text-sm text-gray-700">{goal.timeBound}</p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">Progress:</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-sm text-gray-500">{goal.progress}%</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Status:</label>
                      <select
                        value={goal.status}
                        onChange={(e) => updateStatus(goal.id, e.target.value as SMARTGoal['status'])}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">SMART Goals Framework</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">S</span>
              </div>
              <h4 className="font-semibold text-red-600 mb-2">Specific</h4>
              <p className="text-sm text-gray-600">Clearly defined and focused</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">M</span>
              </div>
              <h4 className="font-semibold text-orange-600 mb-2">Measurable</h4>
              <p className="text-sm text-gray-600">Quantifiable progress tracking</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold">A</span>
              </div>
              <h4 className="font-semibold text-yellow-600 mb-2">Achievable</h4>
              <p className="text-sm text-gray-600">Realistic and attainable</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">R</span>
              </div>
              <h4 className="font-semibold text-green-600 mb-2">Relevant</h4>
              <p className="text-sm text-gray-600">Important and meaningful</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">T</span>
              </div>
              <h4 className="font-semibold text-blue-600 mb-2">Time-bound</h4>
              <p className="text-sm text-gray-600">Clear deadline and timeline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
