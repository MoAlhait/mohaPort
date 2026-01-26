'use client'

import { useState } from 'react'
import { ArrowLeft, ExternalLink, Star, Filter, Search, Clock, Target, Users, Brain, CheckCircle, DollarSign, Smartphone, Monitor } from 'lucide-react'
import Link from 'next/link'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  url: string
  pricing: 'free' | 'freemium' | 'paid'
  rating: number
  features: string[]
  pros: string[]
  cons: string[]
  platforms: ('web' | 'mobile' | 'desktop')[]
  bestFor: string[]
  icon: string
}

const tools: Tool[] = [
  {
    id: '1',
    name: 'MyStudyLife',
    description: 'Comprehensive student planner with scheduling, reminders, and focus tools',
    category: 'Planning & Organization',
    url: 'https://mystudylife.com',
    pricing: 'free',
    rating: 4.5,
    features: ['Class scheduling', 'Assignment tracking', 'Exam reminders', 'Study planner', 'Grade tracking'],
    pros: ['Student-focused design', 'Comprehensive features', 'Cross-platform sync', 'Free to use'],
    cons: ['Can be overwhelming for new users', 'Limited customization options'],
    platforms: ['web', 'mobile'],
    bestFor: ['High school students', 'College students', 'Study groups'],
    icon: '📚'
  },
  {
    id: '2',
    name: 'Reclaim.ai',
    description: 'AI-powered time blocking and calendar optimization',
    category: 'Time Blocking',
    url: 'https://reclaim.ai',
    pricing: 'freemium',
    rating: 4.7,
    features: ['Smart scheduling', 'Habit tracking', 'Meeting optimization', 'Focus time blocking'],
    pros: ['AI-powered scheduling', 'Integrates with Google Calendar', 'Automated time blocking', 'Habit integration'],
    cons: ['Limited free plan', 'Learning curve for AI features'],
    platforms: ['web'],
    bestFor: ['Busy professionals', 'Students with complex schedules', 'Remote workers'],
    icon: '🤖'
  },
  {
    id: '3',
    name: 'Pomofocus',
    description: 'Simple and elegant Pomodoro timer for focused work sessions',
    category: 'Focus & Productivity',
    url: 'https://pomofocus.io',
    pricing: 'free',
    rating: 4.6,
    features: ['Pomodoro timer', 'Task management', 'Statistics tracking', 'Customizable sessions'],
    pros: ['Clean, simple interface', 'No account required', 'Built-in task management', 'Statistics tracking'],
    cons: ['Limited advanced features', 'No team collaboration'],
    platforms: ['web', 'mobile'],
    bestFor: ['Focus workers', 'Students', 'Freelancers'],
    icon: '🍅'
  },
  {
    id: '4',
    name: 'Notion',
    description: 'All-in-one workspace for notes, projects, and collaboration',
    category: 'Note-taking & Organization',
    url: 'https://notion.so',
    pricing: 'freemium',
    rating: 4.8,
    features: ['Note-taking', 'Database management', 'Project tracking', 'Team collaboration', 'Templates'],
    pros: ['Extremely flexible', 'Powerful database features', 'Great templates', 'Team collaboration'],
    cons: ['Steep learning curve', 'Can be overwhelming', 'Performance issues with large databases'],
    platforms: ['web', 'mobile', 'desktop'],
    bestFor: ['Knowledge workers', 'Students', 'Teams', 'Content creators'],
    icon: '📝'
  },
  {
    id: '5',
    name: 'Focusmate',
    description: 'Virtual coworking sessions for accountability and focus',
    category: 'Accountability',
    url: 'https://focusmate.com',
    pricing: 'freemium',
    rating: 4.4,
    features: ['Virtual coworking', '50-minute sessions', 'Accountability partners', 'Progress tracking'],
    pros: ['Great for accountability', 'Structured sessions', 'Global community', 'Flexible scheduling'],
    cons: ['Requires camera', 'Limited free sessions', 'Time zone challenges'],
    platforms: ['web'],
    bestFor: ['Remote workers', 'Students', 'Freelancers', 'Anyone needing accountability'],
    icon: '👥'
  },
  {
    id: '6',
    name: 'Todoist',
    description: 'Task management and productivity app with natural language processing',
    category: 'Task Management',
    url: 'https://todoist.com',
    pricing: 'freemium',
    rating: 4.5,
    features: ['Task management', 'Project organization', 'Due dates', 'Labels and filters', 'Team collaboration'],
    pros: ['Natural language input', 'Powerful filtering', 'Cross-platform sync', 'Good free plan'],
    cons: ['Limited project views', 'Advanced features require premium'],
    platforms: ['web', 'mobile', 'desktop'],
    bestFor: ['Task-oriented users', 'Students', 'Small teams'],
    icon: '✅'
  },
  {
    id: '7',
    name: 'Forest',
    description: 'Focus app that plants real trees when you stay focused',
    category: 'Focus & Productivity',
    url: 'https://forestapp.cc',
    pricing: 'freemium',
    rating: 4.3,
    features: ['Focus timer', 'Tree planting', 'Forest visualization', 'Statistics tracking', 'Team challenges'],
    pros: ['Gamified focus', 'Environmental impact', 'Beautiful interface', 'Motivating rewards'],
    cons: ['Limited free features', 'Mobile-focused', 'No web version'],
    platforms: ['mobile', 'desktop'],
    bestFor: ['Environmentally conscious users', 'Students', 'Focus seekers'],
    icon: '🌳'
  },
  {
    id: '8',
    name: 'Toggl Track',
    description: 'Time tracking and productivity analytics tool',
    category: 'Time Tracking',
    url: 'https://toggl.com',
    pricing: 'freemium',
    rating: 4.4,
    features: ['Time tracking', 'Project tracking', 'Team management', 'Detailed reports', 'Calendar integration'],
    pros: ['Easy to use', 'Detailed analytics', 'Team features', 'Good free plan'],
    cons: ['Limited project management', 'Can be distracting to track'],
    platforms: ['web', 'mobile', 'desktop'],
    bestFor: ['Freelancers', 'Students tracking study time', 'Teams', 'Consultants'],
    icon: '⏱️'
  },
  {
    id: '9',
    name: 'Obsidian',
    description: 'Knowledge management and note-taking with powerful linking',
    category: 'Note-taking & Organization',
    url: 'https://obsidian.md',
    pricing: 'freemium',
    rating: 4.7,
    features: ['Linked notes', 'Graph view', 'Markdown support', 'Plugins', 'Local storage'],
    pros: ['Powerful linking system', 'Local file storage', 'Extensive plugin ecosystem', 'Privacy-focused'],
    cons: ['Steep learning curve', 'No real-time collaboration', 'Mobile app limitations'],
    platforms: ['web', 'mobile', 'desktop'],
    bestFor: ['Researchers', 'Students', 'Knowledge workers', 'Privacy-conscious users'],
    icon: '🔗'
  },
  {
    id: '10',
    name: 'Habitica',
    description: 'Gamified habit tracking and task management',
    category: 'Habit Tracking',
    url: 'https://habitica.com',
    pricing: 'freemium',
    rating: 4.2,
    features: ['Habit tracking', 'Task management', 'Gamification', 'Party system', 'Rewards'],
    pros: ['Highly motivating', 'Fun gamification', 'Social features', 'Comprehensive tracking'],
    cons: ['Can become overwhelming', 'Limited customization', 'Requires consistent use'],
    platforms: ['web', 'mobile'],
    bestFor: ['Gamers', 'Habit builders', 'Students', 'Anyone needing motivation'],
    icon: '🎮'
  }
]

const categories = [
  'All',
  'Planning & Organization',
  'Time Blocking',
  'Focus & Productivity',
  'Note-taking & Organization',
  'Accountability',
  'Task Management',
  'Time Tracking',
  'Habit Tracking'
]

const pricingOptions = ['All', 'Free', 'Freemium', 'Paid']

export default function ToolsDirectory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPricing, setSelectedPricing] = useState('All')
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'category'>('rating')

  const filteredTools = tools
    .filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
      const matchesPricing = selectedPricing === 'All' || tool.pricing === selectedPricing.toLowerCase()
      
      return matchesSearch && matchesCategory && matchesPricing
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'text-green-600 bg-green-100'
      case 'freemium': return 'text-yellow-600 bg-yellow-100'
      case 'paid': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
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
            <h1 className="text-xl font-bold gradient-text">Tools Directory</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Productivity Tools Directory</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and compare the best productivity tools for students. Each tool is carefully reviewed with pros, cons, and detailed feature analysis.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Pricing Filter */}
            <div>
              <select
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pricingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{tool.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{tool.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">{getRatingStars(tool.rating)}</div>
                      <span className="text-sm text-gray-600">({tool.rating}/5)</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPricingColor(tool.pricing)}`}>
                      {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                    </span>
                  </div>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <span className="text-sm font-medium">Visit</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{tool.description}</p>

              {/* Category and Platforms */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {tool.category}
                </span>
                <div className="flex items-center space-x-2">
                  {tool.platforms.map(platform => (
                    <span key={platform} className="p-1 bg-gray-100 rounded text-xs">
                      {platform === 'web' && <Monitor className="w-3 h-3" />}
                      {platform === 'mobile' && <Smartphone className="w-3 h-3" />}
                      {platform === 'desktop' && <Monitor className="w-3 h-3" />}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Key Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ Pros:</h4>
                  <ul className="space-y-1">
                    {tool.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-600">• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">❌ Cons:</h4>
                  <ul className="space-y-1">
                    {tool.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-600">• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best For */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best For:</h4>
                <div className="flex flex-wrap gap-2">
                  {tool.bestFor.map((audience, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No tools found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Tool Comparison */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">Tool Comparison Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-blue-600">Free Tools</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• MyStudyLife - Student planning</li>
                <li>• Pomofocus - Pomodoro timer</li>
                <li>• Notion - Note-taking (limited)</li>
                <li>• Todoist - Task management (limited)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-yellow-600">Freemium Tools</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Reclaim.ai - Time blocking</li>
                <li>• Focusmate - Accountability</li>
                <li>• Forest - Focus timer</li>
                <li>• Habitica - Habit tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-green-600">Best Overall</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Notion - Most versatile</li>
                <li>• Reclaim.ai - Best AI features</li>
                <li>• Focusmate - Best accountability</li>
                <li>• Toggl Track - Best time tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
