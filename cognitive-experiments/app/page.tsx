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
            {/* Back to Portfolio Button */}
            <div className="mb-6">
              <a
                href="https://mohammad-alhait.com"
                className="back-button inline-flex items-center gap-2 w-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Portfolio</span>
              </a>
            </div>

            {/* Hero Section */}
            <div className="hero-section">
              <h1 className="hero-title">
                Cognitive Science Experiments
              </h1>
              <p className="hero-subtitle">
                Interactive psychology experiments designed for college students. 
                Explore classic cognitive psychology findings through hands-on participation.
              </p>
            </div>

            {/* Experiment Cards */}
            <div className="experiments-grid">
              {experiments.map((experiment, index) => (
                <div 
                  key={experiment.id} 
                  className="experiment-item-card group"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animation: 'fadeInUp 0.6s ease forwards'
                  }}
                  onClick={() => setCurrentExperiment(experiment.id)}
                >
                  <div className="flex-grow flex flex-col pr-4">
                    <h4 className="experiment-item-title">
                      {experiment.title}
                    </h4>
                    <p className="experiment-item-description">
                      {experiment.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentExperiment(experiment.id);
                      }}
                      className="experiment-start-button"
                    >
                      Start
                      <span className="ml-1.5">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="experiment-card">
            <button
              onClick={() => setCurrentExperiment(null)}
              className="back-button mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
