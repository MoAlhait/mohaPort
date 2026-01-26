'use client'

import { useState, useEffect } from 'react'
import StroopEffect from './components/StroopEffect'
import MemorySpanTask from './components/MemorySpanTask'
import VisualSearchTask from './components/VisualSearchTask'

export default function Home() {
  const [currentExperiment, setCurrentExperiment] = useState<string | null>(null)

  // Scroll to top when experiment changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentExperiment])

  const experiments = [
    {
      id: 'stroop',
      title: 'Stroop Effect Experiment',
      description: 'Test your cognitive interference by naming the ink color of color words. This classic experiment reveals how automatic reading processes interfere with color naming.',
      component: StroopEffect
    },
    {
      id: 'memory',
      title: 'Memory Span Task',
      description: 'Measure your working memory capacity by recalling sequences of numbers. This task helps understand the limits of short-term memory.',
      component: MemorySpanTask
    },
    {
      id: 'visual',
      title: 'Visual Search Task',
      description: 'Find target objects among distractors to test your attention and visual processing speed. This experiment reveals how we search for information.',
      component: VisualSearchTask
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6FFE7] to-[#C9FFD1]">
      {/* Modern Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a 
            href="https://mohammad-alhait.com" 
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all group"
          >
            <svg className="w-2 h-2 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Portfolio</span>
          </a>
          <div className="text-sm font-semibold text-gray-800">Cognitive Experiments</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {!currentExperiment ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                  Cognitive Science Experiments
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Interactive psychology experiments designed for college students (18-22). 
                  Explore classic cognitive psychology findings through hands-on participation.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#B5FFC1] to-[#8AE699] bg-clip-text text-transparent mb-2">3</div>
                  <div className="text-sm font-semibold text-gray-700">Interactive Experiments</div>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#B5FFC1] to-[#8AE699] bg-clip-text text-transparent mb-2">60+</div>
                  <div className="text-sm font-semibold text-gray-700">Data Points Collected</div>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#B5FFC1] to-[#8AE699] bg-clip-text text-transparent mb-2">100%</div>
                  <div className="text-sm font-semibold text-gray-700">Educational Value</div>
                </div>
              </div>

              {/* Experiment Cards */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your Experiment</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {experiments.map((experiment, index) => (
                    <div 
                      key={experiment.id} 
                      className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-[#B5FFC1] hover:-translate-y-1"
                      style={{
                        animationDelay: `${index * 0.15}s`,
                        animation: 'fadeInUp 0.6s ease forwards'
                      }}
                      onClick={() => setCurrentExperiment(experiment.id)}
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#5FAF6C] transition-colors">
                          {experiment.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {experiment.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentExperiment(experiment.id);
                        }}
                        className="w-full py-3 px-6 bg-gradient-to-r from-[#B5FFC1] to-[#8AE699] text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        Start Experiment →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why These Experiments Matter</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E6FFE7] to-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#B5FFC1] to-[#8AE699] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Scientific Accuracy</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Based on peer-reviewed research and validated methodologies used in 
                      leading cognitive psychology laboratories worldwide.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E6FFE7] to-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#B5FFC1] to-[#8AE699] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Data-Driven Insights</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Real-time performance metrics and comprehensive statistical analysis 
                      help you understand your cognitive patterns and abilities.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
              <button
                onClick={() => setCurrentExperiment(null)}
                className="mb-8 flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E6FFE7] to-[#C9FFD1] text-gray-700 font-semibold hover:shadow-lg transition-all duration-300 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Experiments</span>
              </button>
              
              {experiments.find(exp => exp.id === currentExperiment)?.component && 
                (() => {
                  const ExperimentComponent = experiments.find(exp => exp.id === currentExperiment)!.component
                  return <ExperimentComponent />
                })()
              }
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
