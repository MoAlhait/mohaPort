'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit3, ArrowLeft, AlertTriangle, Clock, CheckCircle, Target } from 'lucide-react'
import Link from 'next/link'

interface Task {
  id: string
  text: string
  category: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important'
}

const categoryConfig = {
  'urgent-important': {
    title: 'Do First',
    subtitle: 'Urgent & Important',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
    description: 'Crises, emergencies, deadlines'
  },
  'not-urgent-important': {
    title: 'Schedule',
    subtitle: 'Not Urgent & Important',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: Target,
    description: 'Planning, prevention, personal development'
  },
  'urgent-not-important': {
    title: 'Delegate',
    subtitle: 'Urgent & Not Important',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Clock,
    description: 'Interruptions, some emails, some calls'
  },
  'not-urgent-not-important': {
    title: 'Eliminate',
    subtitle: 'Not Urgent & Not Important',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: Trash2,
    description: 'Time wasters, some emails, some calls'
  }
}

export default function EisenhowerMatrix() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const addTask = (category: Task['category']) => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        category
      }
      setTasks([...tasks, task])
      setNewTask('')
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setEditingText(task.text)
  }

  const saveEdit = () => {
    if (editingText.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingTask 
          ? { ...task, text: editingText.trim() }
          : task
      ))
    }
    setEditingTask(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditingText('')
  }

  const moveTask = (taskId: string, newCategory: Task['category']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, category: newCategory }
        : task
    ))
  }

  const getTasksByCategory = (category: Task['category']) => {
    return tasks.filter(task => task.category === category)
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
            <h1 className="text-xl font-bold gradient-text">Eisenhower Matrix</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Eisenhower Matrix</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Organize your tasks by urgency and importance to prioritize effectively and focus on what matters most.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(categoryConfig).map(([category, config]) => {
            const categoryTasks = getTasksByCategory(category as Task['category'])
            const IconComponent = config.icon

            return (
              <div
                key={category}
                className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6 min-h-[400px]`}
              >
                {/* Category Header */}
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.color} text-white mb-6`}>
                  <IconComponent className="w-5 h-5" />
                  <div>
                    <div className="font-bold">{config.title}</div>
                    <div className="text-xs opacity-90">{config.subtitle}</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{config.description}</p>

                {/* Add Task Input */}
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTask(category as Task['category'])
                      }
                    }}
                    placeholder="Add a task..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => addTask(category as Task['category'])}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categoryTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                    >
                      {editingTask === task.id ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="flex-1 text-gray-800">{task.text}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditing(task)}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Move to other categories */}
                {categoryTasks.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Move to:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(categoryConfig).map(([otherCategory, otherConfig]) => {
                        if (otherCategory === category) return null
                        return (
                          <button
                            key={otherCategory}
                            onClick={() => {
                              categoryTasks.forEach(task => moveTask(task.id, otherCategory as Task['category']))
                            }}
                            className={`px-2 py-1 text-xs rounded-full ${otherConfig.bgColor} ${otherConfig.borderColor} border hover:shadow-sm transition-all`}
                          >
                            {otherConfig.title}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">How to Use the Eisenhower Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-red-600">Do First (Urgent & Important)</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Crises and emergencies</li>
                <li>• Deadline-driven projects</li>
                <li>• Problems that need immediate attention</li>
                <li>• Health and safety issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-green-600">Schedule (Not Urgent & Important)</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Long-term planning</li>
                <li>• Relationship building</li>
                <li>• Personal development</li>
                <li>• Preventive measures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-yellow-600">Delegate (Urgent & Not Important)</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Some emails and calls</li>
                <li>• Interruptions from others</li>
                <li>• Some meetings</li>
                <li>• Tasks others can handle</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gray-600">Eliminate (Not Urgent & Not Important)</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Time wasters</li>
                <li>• Excessive social media</li>
                <li>• Some emails and calls</li>
                <li>• Busy work</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {tasks.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Your Task Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryConfig).map(([category, config]) => {
                const count = getTasksByCategory(category as Task['category']).length
                const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0
                
                return (
                  <div key={category} className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${config.color.replace('from-', 'text-').replace(' to-', '-')}`}>
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">{config.title}</div>
                    <div className="text-xs text-gray-400">{percentage}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
