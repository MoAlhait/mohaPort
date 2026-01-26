'use client'

import { useState } from 'react'
import { ArrowLeft, Calendar, Clock, User, Tag, Search, Filter } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: number
  category: string
  tags: string[]
  featured: boolean
  image: string
}

const articles: Article[] = [
  {
    id: '1',
    title: 'The Science of Procrastination: Why We Delay and How to Stop',
    excerpt: 'Understanding the psychological mechanisms behind procrastination and evidence-based strategies to overcome it.',
    content: 'Procrastination affects over 70% of college students, but understanding its root causes can help us develop effective counterstrategies...',
    author: 'Mohammad Alhait',
    publishDate: '2024-01-15',
    readTime: 8,
    category: 'Psychology',
    tags: ['procrastination', 'psychology', 'motivation', 'behavior'],
    featured: true,
    image: '/images/procrastination.jpg'
  },
  {
    id: '2',
    title: 'Building Effective Study Habits: A Complete Guide',
    excerpt: 'Learn how to create sustainable study habits that stick and dramatically improve your academic performance.',
    content: 'Effective study habits are the foundation of academic success. This comprehensive guide covers everything from habit formation to maintenance...',
    author: 'Mohammad Alhait',
    publishDate: '2024-01-10',
    readTime: 12,
    category: 'Study Methods',
    tags: ['study habits', 'academic success', 'learning', 'productivity'],
    featured: true,
    image: '/images/study-habits.jpg'
  },
  {
    id: '3',
    title: 'The Pomodoro Technique: Complete Implementation Guide',
    excerpt: 'Master the Pomodoro Technique with this step-by-step guide, including common pitfalls and advanced strategies.',
    content: 'The Pomodoro Technique has helped millions of people improve their focus and productivity. Here\'s everything you need to know...',
    author: 'Mohammad Alhait',
    publishDate: '2024-01-08',
    readTime: 6,
    category: 'Time Management',
    tags: ['pomodoro', 'focus', 'time management', 'productivity'],
    featured: false,
    image: '/images/pomodoro.jpg'
  },
  {
    id: '4',
    title: 'SMART Goals for Students: Setting and Achieving Academic Objectives',
    excerpt: 'Learn how to set Specific, Measurable, Achievable, Relevant, and Time-bound goals that actually work.',
    content: 'Goal setting is crucial for academic success, but most students set vague, unachievable goals. The SMART framework changes everything...',
    author: 'Mohammad Alhait',
    publishDate: '2024-01-05',
    readTime: 7,
    category: 'Goal Setting',
    tags: ['SMART goals', 'academic goals', 'planning', 'achievement'],
    featured: false,
    image: '/images/smart-goals.jpg'
  },
  {
    id: '5',
    title: 'Digital Minimalism for Students: Reducing Distraction in the Digital Age',
    excerpt: 'How to create a healthier relationship with technology while maintaining productivity and focus.',
    content: 'Technology can be both a blessing and a curse for students. Learn how to harness its benefits while minimizing its distractions...',
    author: 'Mohammad Alhait',
    publishDate: '2024-01-03',
    readTime: 10,
    category: 'Digital Wellness',
    tags: ['digital minimalism', 'focus', 'technology', 'distraction'],
    featured: false,
    image: '/images/digital-minimalism.jpg'
  },
  {
    id: '6',
    title: 'The Eisenhower Matrix: Prioritizing Tasks Like a Pro',
    excerpt: 'Master the art of task prioritization using the proven Eisenhower Matrix method.',
    content: 'Not all tasks are created equal. The Eisenhower Matrix helps you focus on what truly matters by categorizing tasks by urgency and importance...',
    author: 'Mohammad Alhait',
    publishDate: '2024-01-01',
    readTime: 5,
    category: 'Time Management',
    tags: ['eisenhower matrix', 'prioritization', 'time management', 'productivity'],
    featured: false,
    image: '/images/eisenhower.jpg'
  },
  {
    id: '7',
    title: 'Active Learning Strategies: Beyond Passive Reading',
    excerpt: 'Transform your study sessions with active learning techniques that improve retention and understanding.',
    content: 'Passive reading is one of the least effective study methods. Discover active learning strategies that dramatically improve your learning outcomes...',
    author: 'Mohammad Alhait',
    publishDate: '2023-12-28',
    readTime: 9,
    category: 'Study Methods',
    tags: ['active learning', 'study techniques', 'retention', 'understanding'],
    featured: false,
    image: '/images/active-learning.jpg'
  },
  {
    id: '8',
    title: 'Building a Personal Productivity System That Actually Works',
    excerpt: 'Create a customized productivity system that fits your unique needs and learning style.',
    content: 'One-size-fits-all productivity systems rarely work. Learn how to build a personalized system that adapts to your needs and preferences...',
    author: 'Mohammad Alhait',
    publishDate: '2023-12-25',
    readTime: 11,
    category: 'Productivity Systems',
    tags: ['productivity system', 'personalization', 'organization', 'efficiency'],
    featured: false,
    image: '/images/productivity-system.jpg'
  }
]

const categories = [
  'All',
  'Psychology',
  'Study Methods',
  'Time Management',
  'Goal Setting',
  'Digital Wellness',
  'Productivity Systems'
]

const tags = [
  'procrastination',
  'study habits',
  'pomodoro',
  'SMART goals',
  'digital minimalism',
  'eisenhower matrix',
  'active learning',
  'productivity system',
  'focus',
  'time management'
]

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')
  const [sortBy, setSortBy] = useState<'date' | 'readTime' | 'title'>('date')

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      const matchesTag = selectedTag === 'All' || article.tags.includes(selectedTag)
      
      return matchesSearch && matchesCategory && matchesTag
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        case 'readTime':
          return a.readTime - b.readTime
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const featuredArticles = articles.filter(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
            <h1 className="text-xl font-bold gradient-text">Productivity Blog</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Productivity & Study Tips</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based articles on productivity, time management, and study techniques to help you achieve academic success.
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
                placeholder="Search articles..."
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

            {/* Tag Filter */}
            <div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Tags</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
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
                <option value="date">Sort by Date</option>
                <option value="readTime">Sort by Read Time</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {selectedCategory === 'All' && selectedTag === 'All' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <div className="text-6xl">📚</div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime} min read
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{article.author}</span>
                        <Calendar className="w-4 h-4 ml-2" />
                        <span className="text-sm">{formatDate(article.publishDate)}</span>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        Read More
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">
            {selectedCategory === 'All' && selectedTag === 'All' && !searchTerm ? 'All Articles' : 'Search Results'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <div className="text-4xl">📖</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center text-gray-500 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}m
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-gray-500 text-xs">
                      <User className="w-3 h-3" />
                      <span>{article.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(article.publishDate)}</span>
                  </div>
                  <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    Read Article
                  </button>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest productivity tips and study strategies delivered to your inbox. No spam, just valuable content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-blue-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
