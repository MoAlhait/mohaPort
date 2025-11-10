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
    <>
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a 
            href="https://mohammad-alhait.com" 
            className="text-lg font-semibold text-gray-800 dark:text-white hover:text-pink-500 transition-colors"
          >
            ← Back to Portfolio
          </a>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Mohammad Alhait - Cognitive Experiments
          </h1>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-20"></div>

      {/* Animated Background Particles */}
      <div className="background-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 6 + 's',
              animationDuration: (Math.random() * 4 + 4) + 's'
            }}
          />
        ))}
      </div>

      <div className="experiment-container">
        {!currentExperiment ? (
          <>
            {/* Panel 1: Hero + Stats */}
            <div className="experiment-card">
              <div className="text-center mb-8">
                <h1 className="hero-title">
                  Cognitive Science Experiments
                </h1>
                <p className="hero-subtitle">
                  Interactive psychology experiments designed for college students (18-22). 
                  Explore classic cognitive psychology findings through hands-on participation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Interactive Experiments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">60+</div>
                  <div className="stat-label">Data Points Collected</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Educational Value</div>
                </div>
              </div>
            </div>

            {/* Panel 2: Experiment Cards */}
            <div className="experiment-card">
              <h3 className="text-4xl font-bold mb-10 text-center" style={{ color: 'var(--text-primary)' }}>Choose Your Experiment</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {experiments.map((experiment, index) => (
                  <div 
                    key={experiment.id} 
                    className="p-8 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animation: 'fadeInUp 0.8s ease forwards',
                      background: 'rgba(249, 168, 212, 0.95)',
                      borderRadius: '24px',
                      boxShadow: '0 10px 30px rgba(236, 72, 153, 0.15), 0 5px 15px rgba(0, 0, 0, 0.05)'
                    }}
                    onClick={() => setCurrentExperiment(experiment.id)}
                  >
                    <div className="mb-6">
                      <div className="text-5xl font-extrabold text-center my-2" style={{ color: 'black', textShadow: '2px 4px 24px rgba(0,0,0,0.98), 0 2px 8px rgba(0,0,0,0.55)' }}>
                        {experiment.title}
                      </div>
                      <div className="text-2xl font-extrabold text-center my-2" style={{ color: 'black', textShadow: '1.8px 3.5px 14px rgba(0,0,0,0.85), 0 1.5px 6px rgba(0,0,0,0.33)' }}>
                        {experiment.description}
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentExperiment(experiment.id);
                        }}
                        className="w-full font-extrabold py-6 px-8 text-white text-3xl text-center transition-all duration-300 hover:opacity-90"
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          border: 'none',
                          textShadow: '2px 4px 18px rgba(0,0,0,0.38), 0 1.5px 8px rgba(0,0,0,0.44)'
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Why These Experiments Matter */}
            <div className="experiment-card">
              <h3 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>Why These Experiments Matter</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '24px' }}>
                  <h4 className="text-2xl font-bold mb-4 text-white">Scientific Accuracy</h4>
                  <p className="leading-relaxed text-white/90" style={{ fontWeight: '400' }}>
                    Based on peer-reviewed research and validated methodologies used in 
                    leading cognitive psychology laboratories worldwide.
                  </p>
                </div>
                <div className="p-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '24px' }}>
                  <h4 className="text-2xl font-bold mb-4 text-white">Data-Driven Insights</h4>
                  <p className="leading-relaxed text-white/90" style={{ fontWeight: '400' }}>
                    Real-time performance metrics and comprehensive statistical analysis 
                    help you understand your cognitive patterns and abilities.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="experiment-card">
            <button
              onClick={() => setCurrentExperiment(null)}
                    className="mb-8 text-lg font-semibold px-8 py-3 text-white transition-all duration-300 hover:opacity-90"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: 'none'
                    }}
                  >
                    ← Back to Experiments
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
