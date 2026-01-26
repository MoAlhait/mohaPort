'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Brain, MessageCircle, Lightbulb, Target, TrendingUp, AlertCircle, CheckCircle, Star, Send, Mic, MicOff } from 'lucide-react'
import Link from 'next/link'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIInsight {
  id: string
  type: 'tip' | 'warning' | 'achievement' | 'recommendation'
  title: string
  message: string
  confidence: number
  actionable: boolean
}

export default function AICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi Mohammad! I'm your AI productivity coach. I've analyzed your study patterns and I'm here to help you optimize your productivity. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Help me plan my study schedule",
        "Analyze my productivity patterns",
        "Suggest improvements for my habits",
        "Create a focus session plan"
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'tip',
      title: 'Peak Performance Analysis',
      message: 'You\'re most productive between 9-11 AM and 7-9 PM. Schedule your most challenging tasks during these windows.',
      confidence: 94,
      actionable: true
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Study Session Optimization',
      message: 'Your 45-minute study sessions show 23% better retention than 25-minute sessions. Consider extending your Pomodoro timer.',
      confidence: 87,
      actionable: true
    },
    {
      id: '3',
      type: 'warning',
      title: 'Break Pattern Alert',
      message: 'You\'re taking breaks 15% less frequently than optimal. This could lead to burnout. Try setting automatic break reminders.',
      confidence: 76,
      actionable: true
    }
  ])

  const sendMessage = (message: string) => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message)
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const generateAIResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('schedule') || message.includes('plan')) {
      return {
        content: "Based on your productivity patterns, I recommend this schedule:\n\n🌅 **Morning (9-11 AM)**: Deep work sessions - tackle your most challenging CS 61A assignments\n☀️ **Midday (11 AM-1 PM)**: Review sessions - consolidate what you've learned\n🌆 **Evening (7-9 PM)**: Creative work - problem-solving and project development\n\nWould you like me to create a detailed daily schedule for you?",
        suggestions: [
          "Create detailed daily schedule",
          "Set up automatic reminders",
          "Adjust for weekend routine",
          "Sync with my calendar"
        ]
      }
    }
    
    if (message.includes('productivity') || message.includes('patterns')) {
      return {
        content: "Here's what I've discovered about your productivity:\n\n📊 **Strengths**:\n• Consistent morning routine (87% success rate)\n• Excellent focus during 45-minute sessions\n• Strong habit completion on weekdays\n\n⚠️ **Areas for improvement**:\n• Break frequency could be optimized\n• Evening productivity drops after 9 PM\n• Weekend consistency needs work\n\nWould you like specific strategies to address these areas?",
        suggestions: [
          "Optimize break schedule",
          "Improve evening routine",
          "Boost weekend productivity",
          "Get personalized tips"
        ]
      }
    }
    
    if (message.includes('habit') || message.includes('routine')) {
      return {
        content: "Your habit analysis shows some interesting patterns:\n\n✅ **Strong habits**: Morning study routine, exercise, goal tracking\n📈 **Improving**: Reading habits (+15% this month)\n🔄 **Needs attention**: Sleep schedule consistency\n\nI recommend the 'Habit Stacking' technique - attach new habits to your existing strong ones. For example, add 5 minutes of meditation right after your morning study session.",
        suggestions: [
          "Set up habit stacking",
          "Create sleep routine",
          "Track habit improvements",
          "Get weekly habit report"
        ]
      }
    }
    
    if (message.includes('focus') || message.includes('concentration')) {
      return {
        content: "Your focus patterns reveal some key insights:\n\n🎯 **Optimal focus duration**: 45-50 minutes\n🔊 **Best environment**: Quiet spaces with ambient sounds\n⏰ **Peak focus times**: 9-11 AM and 7-9 PM\n\nTry this focus technique: Start with a 5-minute 'focus warm-up' - do a quick review of what you'll work on, then dive into your main task. This increases focus quality by 23%.",
        suggestions: [
          "Start focus warm-up routine",
          "Optimize study environment",
          "Try new focus techniques",
          "Track focus improvements"
        ]
      }
    }
    
    return {
      content: "That's a great question! Based on your data, I can help you with study optimization, habit building, goal setting, or productivity analysis. What specific area would you like to explore?",
      suggestions: [
        "Analyze my study patterns",
        "Help with goal setting",
        "Improve my habits",
        "Optimize my schedule"
      ]
    }
  }

  const handleVoiceInput = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      setInputMessage("Help me improve my study routine")
    }, 2000)
  }

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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">AI Productivity Coach</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">AI Coach</h3>
                    <p className="text-sm text-gray-500">Powered by advanced analytics</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => sendMessage(suggestion)}
                              className={`block w-full text-left p-2 rounded-lg text-sm transition-colors ${
                                message.type === 'user'
                                  ? 'bg-blue-400 hover:bg-blue-300 text-white'
                                  : 'bg-white hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                      placeholder="Ask me anything about your productivity..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleVoiceInput}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                        isListening ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:text-blue-500'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim()}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'tip' ? 'border-green-500 bg-green-50' :
                    insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    insight.type === 'achievement' ? 'border-purple-500 bg-purple-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{insight.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.message}</p>
                    {insight.actionable && (
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Take Action →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => sendMessage("Analyze my productivity patterns")}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-800">Productivity Analysis</span>
                </button>
                <button 
                  onClick={() => sendMessage("Help me plan my study schedule")}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-gray-800">Schedule Planning</span>
                </button>
                <button 
                  onClick={() => sendMessage("Suggest improvements for my habits")}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-800">Habit Optimization</span>
                </button>
                <button 
                  onClick={() => sendMessage("Create a focus session plan")}
                  className="w-full flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-800">Focus Session Plan</span>
                </button>
              </div>
            </div>

            {/* AI Capabilities */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">What I Can Do</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Analyze your productivity patterns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Optimize your study schedule</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Suggest habit improvements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Create personalized strategies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Predict productivity trends</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
