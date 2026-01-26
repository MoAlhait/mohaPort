'use client'

import { useState, useEffect } from 'react'

interface StroopResult {
  word: string
  inkColor: string
  selectedColor: string
  reactionTime: number
  isCorrect: boolean
}

export default function StroopEffect() {
  const [phase, setPhase] = useState<'instructions' | 'level-selection' | 'practice' | 'test' | 'results'>('instructions')
  const [currentTrial, setCurrentTrial] = useState(0)
  const [results, setResults] = useState<StroopResult[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [showWord, setShowWord] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<'slow' | 'medium' | 'fast'>('medium')
  const [isWaitingForClick, setIsWaitingForClick] = useState(false)

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
  const practiceTrials = 6
  const testTrials = 20

  const levelSettings = {
    slow: { name: 'Slow', description: 'Word disappears when you click', displayTime: null },
    medium: { name: 'Medium', description: 'Word shows for 1 second', displayTime: 1000 },
    fast: { name: 'Fast', description: 'Word shows for 0.3 seconds', displayTime: 300 }
  }

  const getRandomWordAndColor = () => {
    const word = colors[Math.floor(Math.random() * colors.length)]
    let inkColor = colors[Math.floor(Math.random() * colors.length)]
    
    // 50% chance of incongruent (word and ink color don't match)
    if (Math.random() > 0.5) {
      while (inkColor === word) {
        inkColor = colors[Math.floor(Math.random() * colors.length)]
      }
    }
    
    return { word, inkColor }
  }

  const [currentWord, setCurrentWord] = useState(getRandomWordAndColor())

  const handleColorSelect = (selectedColor: string) => {
    // Allow clicking if word is shown OR if we're waiting for a click (word just disappeared)
    if (!showWord && !isWaitingForClick) return

    const reactionTime = Date.now() - startTime
    const isCorrect = selectedColor === currentWord.inkColor

    const newResult: StroopResult = {
      word: currentWord.word,
      inkColor: currentWord.inkColor,
      selectedColor,
      reactionTime,
      isCorrect
    }

    setResults([...results, newResult])
    setShowWord(false)
    setIsWaitingForClick(false)

    // Move to next trial automatically
    setTimeout(() => {
      if (currentTrial + 1 < testTrials) {
        setCurrentTrial(currentTrial + 1)
        setCurrentWord(getRandomWordAndColor())
        startTrial()
      } else {
        setPhase('results')
      }
    }, 800)
  }

  const startTrial = () => {
    setShowWord(true)
    setStartTime(Date.now())
    setIsWaitingForClick(true)

    // Auto-hide word after display time (except for slow level)
    const displayTime = levelSettings[selectedLevel].displayTime
    if (displayTime !== null) {
      setTimeout(() => {
        setShowWord(false)
        // Keep isWaitingForClick true so user can still click after word disappears
        setIsWaitingForClick(true)
      }, displayTime)
    }
  }

  const startExperiment = () => {
    setPhase('level-selection')
  }

  const selectLevelAndStart = (level: 'slow' | 'medium' | 'fast') => {
    setSelectedLevel(level)
    setPhase('test')
    setCurrentTrial(0)
    setResults([])
    setCurrentWord(getRandomWordAndColor())
    setTimeout(startTrial, 2000) // 2 second delay before first trial
  }

  const resetExperiment = () => {
    setPhase('instructions')
    setCurrentTrial(0)
    setResults([])
    setShowWord(false)
  }

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      orange: '#f97316'
    }
    return { color: colorMap[color] }
  }

  const calculateStats = () => {
    const correctTrials = results.filter(r => r.isCorrect)
    const incorrectTrials = results.filter(r => !r.isCorrect)
    
    const congruentTrials = results.filter(r => r.word === r.inkColor)
    const incongruentTrials = results.filter(r => r.word !== r.inkColor)
    
    const congruentCorrect = congruentTrials.filter(r => r.isCorrect)
    const incongruentCorrect = incongruentTrials.filter(r => r.isCorrect)
    
    return {
      accuracy: (correctTrials.length / results.length) * 100,
      avgReactionTime: results.reduce((sum, r) => sum + r.reactionTime, 0) / results.length,
      congruentAccuracy: congruentCorrect.length / congruentTrials.length * 100,
      incongruentAccuracy: incongruentCorrect.length / incongruentTrials.length * 100,
      congruentAvgTime: congruentTrials.reduce((sum, r) => sum + r.reactionTime, 0) / congruentTrials.length,
      incongruentAvgTime: incongruentTrials.reduce((sum, r) => sum + r.reactionTime, 0) / incongruentTrials.length
    }
  }

  if (phase === 'instructions') {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center text-3xl">
            🎨
          </div>
          <h2 className="text-4xl font-black mb-4 text-black">
            Stroop Effect Experiment
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="experiment-card">
            <h3 className="text-2xl font-bold mb-6 text-center">🧠 Stroop Effect Experiment</h3>
            
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-xl font-bold mb-3 text-blue-400">What is it?</h4>
                <p className="text-black font-bold leading-relaxed mb-4">
                  A classic demonstration of cognitive interference. You'll see color words printed in different ink colors, 
                  revealing how automatic reading interferes with color naming.
                </p>
                
                <h4 className="text-xl font-bold mb-3 text-green-400">Your Task</h4>
                <p className="text-black font-bold leading-relaxed">
                  <strong>Name the ink color as quickly and accurately as possible.</strong><br/>
                  <strong>⚠️ Ignore what the word says - only pay attention to the ink color!</strong>
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-bold mb-3 text-yellow-400">💡 Example</h4>
                <div className="p-6 backdrop-blur-sm rounded-2xl shadow-lg border"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '20px', border: 'none' }}>
                  <p className="text-black font-bold">
                    If you see the word <span className="text-blue-600 font-bold">"RED"</span> printed in blue ink, 
                    you should click <span className="text-blue-600 font-bold">"BLUE"</span> 
                    (the ink color), not "RED" (what the word says).
                  </p>
                </div>
                
                <div className="mt-4">
                  <div className="stat-card">
                    <div className="stat-value text-green-400">20</div>
                    <div className="stat-label">Test Trials</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startExperiment}
              className="modern-button text-xl px-12 py-4"
            >
              🚀 Choose Difficulty Level
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'level-selection') {
    return (
      <div className="text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Choose Speed Level
          </h2>
          <p className="text-lg text-black font-bold mb-6">
            Select your preferred difficulty level:
          </p>
        </div>
        
        <div className="experiment-card max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(levelSettings).map(([level, settings]) => (
              <button
                key={level}
                onClick={() => selectLevelAndStart(level as 'slow' | 'medium' | 'fast')}
                className="modern-button py-4 text-lg font-bold"
                style={{
                  background: level === 'slow' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                             level === 'medium' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                             'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                }}
              >
                {level === 'slow' ? '🐌' : level === 'medium' ? '🏃' : '⚡'} {settings.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-black font-bold">
            Slow: Click to remove • Medium: 1 second • Fast: 0.3 seconds
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setPhase('instructions')}
            className="modern-button"
            style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' }}
          >
            ← Back to Instructions
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'results') {
    const stats = calculateStats()
    
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-3xl">
            📊
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Stroop Effect Results
          </h2>
        </div>
        
        <div className="results-section">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">🎯 Overall Performance</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="stat-card">
                  <div className="stat-value text-green-400">{stats.accuracy.toFixed(1)}%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-blue-400">{stats.avgReactionTime.toFixed(0)}ms</div>
                  <div className="stat-label">Avg Time</div>
                </div>
              </div>
              
              <div className="p-6 bg-white/90 backdrop-blur-sm border border-cyan-200/50 rounded-2xl shadow-lg">
                <h4 className="text-xl font-black mb-3 text-black">💡 What This Shows</h4>
                <p className="text-black font-bold leading-relaxed">
                  The Stroop Effect is demonstrated when incongruent trials show lower accuracy 
                  and/or higher reaction times than congruent trials. This indicates that reading 
                  words is an automatic process that interferes with color naming!
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">🧠 Stroop Effect Analysis</h3>
              <div className="space-y-4">
                <div className="p-6 backdrop-blur-sm rounded-2xl shadow-lg border"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '20px', border: 'none' }}>
                  <h4 className="text-xl font-black mb-3 text-black">✅ Congruent Trials</h4>
                  <p className="text-black font-bold mb-3">(Word matches ink color)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="stat-value" style={{ background: 'var(--primary-gradient)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.congruentAccuracy.toFixed(1)}%</div>
                      <div className="stat-label">Accuracy</div>
                    </div>
                    <div>
                      <div className="stat-value" style={{ background: 'var(--primary-gradient)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.congruentAvgTime.toFixed(0)}ms</div>
                      <div className="stat-label">Avg Time</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/90 backdrop-blur-sm border border-cyan-200/50 rounded-2xl shadow-lg">
                  <h4 className="text-xl font-black mb-3 text-black">❌ Incongruent Trials</h4>
                  <p className="text-black font-bold mb-3">(Word differs from ink color)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="stat-value text-orange-600">{stats.incongruentAccuracy.toFixed(1)}%</div>
                      <div className="stat-label">Accuracy</div>
                    </div>
                    <div>
                      <div className="stat-value text-orange-600">{stats.incongruentAvgTime.toFixed(0)}ms</div>
                      <div className="stat-label">Avg Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={resetExperiment}
            className="modern-button text-xl px-12 py-4"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center text-2xl">
          🎨
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Stroop Effect Experiment
        </h2>
      </div>
      
      <div className="experiment-card">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="stat-card">
            <div className="stat-value text-green-400">{currentTrial + 1} / {testTrials}</div>
            <div className="stat-label">Trial Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'var(--primary-gradient)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{levelSettings[selectedLevel].name}</div>
            <div className="stat-label">Speed Level</div>
          </div>
        </div>

        <div className="mb-8">
          {showWord ? (
            <div 
              className="stroop-word"
              style={getColorStyle(currentWord.inkColor)}
            >
              {currentWord.word.toUpperCase()}
            </div>
          ) : (
            <div className="stroop-word text-black font-bold">
              {currentTrial === 0 && results.length === 0 ? 'Get ready...' : 'Next word coming...'}
            </div>
          )}
        </div>

        {currentTrial === 0 && results.length === 0 && (
          <div className="mb-6">
            <div className="loading-spinner"></div>
            <p className="text-lg text-black font-bold">
              Starting {levelSettings[selectedLevel].name.toLowerCase()} level - 
              {selectedLevel === 'slow' ? ' click to make words disappear' : 
               selectedLevel === 'medium' ? ' words show for 1 second' : 
               ' words show for 0.3 seconds'}
            </p>
          </div>
        )}

        <h3 className="text-xl font-bold mb-6 text-center">
          🎨 Select the ink color:
          {showWord && <span className="text-green-400 ml-2">(Click quickly!)</span>}
          {!showWord && isWaitingForClick && <span className="text-orange-400 ml-2">(Word disappeared - still click the color you saw!)</span>}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`color-button ${(showWord || isWaitingForClick) ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}
              style={{ backgroundColor: getColorStyle(color).color }}
            >
              {color.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
