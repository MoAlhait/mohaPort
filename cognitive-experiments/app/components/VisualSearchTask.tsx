'use client'

import { useState, useEffect } from 'react'

interface VisualSearchResult {
  trialType: 'feature' | 'conjunction'
  targetPresent: boolean
  userFound: boolean
  reactionTime: number
  isCorrect: boolean
  gridSize: number
  targetPosition?: { row: number; col: number }
}

interface GridItem {
  id: string
  shape: 'circle' | 'square'
  color: 'red' | 'blue'
  isTarget: boolean
  position: { row: number; col: number }
}

export default function VisualSearchTask() {
  const [phase, setPhase] = useState<'instructions' | 'practice' | 'test' | 'results'>('instructions')
  const [currentTrial, setCurrentTrial] = useState(0)
  const [results, setResults] = useState<VisualSearchResult[]>([])
  const [grid, setGrid] = useState<GridItem[]>([])
  const [trialStarted, setTrialStarted] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [currentTrialType, setCurrentTrialType] = useState<'feature' | 'conjunction'>('feature')

  const practiceTrials = 6
  const testTrials = 24
  const gridSizes = [16, 24, 32] // 4x4, 6x4, 8x4 grids

  const generateGrid = (trialType: 'feature' | 'conjunction', gridSize: number): GridItem[] => {
    const items: GridItem[] = []
    const targetPresent = Math.random() > 0.5 // 50% chance target is present
    
    // Calculate grid dimensions (make it square)
    const gridDimension = Math.ceil(Math.sqrt(gridSize))
    let targetPosition: { row: number; col: number } | null = null

    if (targetPresent) {
      // Place target at a random position
      targetPosition = {
        row: Math.floor(Math.random() * gridDimension),
        col: Math.floor(Math.random() * gridDimension)
      }
    }

    // Fill all positions in the grid
    for (let row = 0; row < gridDimension; row++) {
      for (let col = 0; col < gridDimension; col++) {
        // If this is the target position and target is present
        if (targetPosition && row === targetPosition.row && col === targetPosition.col) {
          items.push({
            id: 'target',
            shape: 'circle',
            color: 'red',
            isTarget: true,
            position: targetPosition
          })
          continue
        }

        // Create distractor
        let shape: 'circle' | 'square'
        let color: 'red' | 'blue'

        if (trialType === 'feature') {
          // Feature search: all distractors are the same (blue circles)
          shape = 'circle'
          color = 'blue'
        } else {
          // Conjunction search: distractors are mixed (blue circles and red squares)
          shape = Math.random() > 0.5 ? 'circle' : 'square'
          color = shape === 'circle' ? 'blue' : 'red'
        }

        items.push({
          id: `${row}-${col}`,
          shape,
          color,
          isTarget: false,
          position: { row, col }
        })
      }
    }

    return items
  }

  const startTrial = () => {
    const trialType = Math.random() > 0.5 ? 'feature' : 'conjunction'
    const gridSize = gridSizes[Math.floor(Math.random() * gridSizes.length)]
    
    setCurrentTrialType(trialType)
    setGrid(generateGrid(trialType, gridSize))
    setTrialStarted(true)
    setStartTime(Date.now())
  }

  const handleItemClick = (item: GridItem) => {
    if (!trialStarted) return

    const reactionTime = Date.now() - startTime
    const targetPresent = grid.some(g => g.isTarget)
    const userFound = item.isTarget
    const isCorrect = targetPresent === userFound

    recordResult(targetPresent, userFound, reactionTime, isCorrect)
  }

  const handleNoTargetClick = () => {
    if (!trialStarted) return

    const reactionTime = Date.now() - startTime
    const targetPresent = grid.some(g => g.isTarget)
    const userFound = false
    const isCorrect = !targetPresent

    recordResult(targetPresent, userFound, reactionTime, isCorrect)
  }

  const recordResult = (targetPresent: boolean, userFound: boolean, reactionTime: number, isCorrect: boolean) => {
    const result: VisualSearchResult = {
      trialType: currentTrialType,
      targetPresent,
      userFound,
      reactionTime,
      isCorrect,
      gridSize: grid.length,
      targetPosition: targetPresent ? grid.find(g => g.isTarget)?.position : undefined
    }

    setResults([...results, result])
    setTrialStarted(false)

    // Move to next trial
    setTimeout(() => {
      if (currentTrial + 1 < (phase === 'practice' ? practiceTrials : testTrials)) {
        setCurrentTrial(currentTrial + 1)
      } else {
        if (phase === 'practice') {
          setPhase('test')
          setCurrentTrial(0)
          setResults([])
        } else {
          setPhase('results')
        }
      }
    }, 1500)
  }

  const startExperiment = () => {
    setPhase('practice')
    setCurrentTrial(0)
    setResults([])
    setTimeout(startTrial, 2000)
  }

  const resetExperiment = () => {
    setPhase('instructions')
    setCurrentTrial(0)
    setResults([])
    setTrialStarted(false)
  }

  const calculateStats = () => {
    if (results.length === 0) return null

    const correctTrials = results.filter(r => r.isCorrect)
    const accuracy = (correctTrials.length / results.length) * 100

    // Separate by trial type
    const featureTrials = results.filter(r => r.trialType === 'feature')
    const conjunctionTrials = results.filter(r => r.trialType === 'conjunction')

    const featureAccuracy = featureTrials.length > 0 
      ? (featureTrials.filter(r => r.isCorrect).length / featureTrials.length) * 100 
      : 0
    const conjunctionAccuracy = conjunctionTrials.length > 0 
      ? (conjunctionTrials.filter(r => r.isCorrect).length / conjunctionTrials.length) * 100 
      : 0

    const featureAvgTime = featureTrials.length > 0 
      ? featureTrials.reduce((sum, r) => sum + r.reactionTime, 0) / featureTrials.length 
      : 0
    const conjunctionAvgTime = conjunctionTrials.length > 0 
      ? conjunctionTrials.reduce((sum, r) => sum + r.reactionTime, 0) / conjunctionTrials.length 
      : 0

    return {
      accuracy,
      featureAccuracy,
      conjunctionAccuracy,
      featureAvgTime,
      conjunctionAvgTime,
      avgReactionTime: results.reduce((sum, r) => sum + r.reactionTime, 0) / results.length
    }
  }

  if (phase === 'instructions') {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'var(--primary-gradient)' }}>
            🔍
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Visual Search Task
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="experiment-card">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#ec4899' }}>What is it?</h3>
                <p className="text-lg text-black font-bold leading-relaxed mb-4">
                  This experiment tests your visual attention and search abilities. You'll see grids 
                  of colored shapes and need to quickly determine if a target is present.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-green-400">Your Task</h3>
                <p className="text-lg text-black font-bold leading-relaxed">
                  Look for a red circle in each grid. Click on it if you find it, or click anywhere else if it's not there. 
                  Be as fast and accurate as possible!
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">💡 Two Types of Trials</h3>
                <div className="p-6 backdrop-blur-sm rounded-2xl shadow-lg mb-6 border"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '20px', border: 'none' }}>
                  <div className="space-y-3">
                    <p className="text-black font-bold">
                      <strong>Feature Search:</strong> Red circle among blue circles<br/>
                      <span className="text-green-600 font-bold">(easy - pop-out effect)</span>
                    </p>
                    <p className="text-black font-bold">
                      <strong>Conjunction Search:</strong> Red circle among blue circles and red squares<br/>
                      <span className="text-orange-600 font-bold">(harder - requires attention)</span>
                    </p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value text-green-400">24</div>
                  <div className="stat-label">Test Trials</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={startExperiment}
              className="modern-button text-xl px-12 py-4"
            >
              🚀 Start Experiment
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'results') {
    const stats = calculateStats()
    
    if (!stats) return null

    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'var(--primary-gradient)' }}>
            📊
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Visual Search Results
          </h2>
        </div>
        
        <div className="results-section">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">🎯 Overall Performance</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="stat-card">
                  <div className="stat-value text-green-400">{stats.accuracy.toFixed(1)}%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value text-blue-400">{stats.avgReactionTime.toFixed(0)}ms</div>
                  <div className="stat-label">Avg Time</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ background: 'var(--primary-gradient)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{results.length}</div>
                  <div className="stat-label">Total Trials</div>
                </div>
              </div>
              
              <div className="p-6 backdrop-blur-sm border rounded-2xl shadow-lg"
                style={{ background: 'rgba(253, 242, 248, 0.95)', borderColor: 'rgba(236, 72, 153, 0.15)' }}>
                <h4 className="text-xl font-black mb-3 text-black">💡 What This Shows</h4>
                <p className="text-black font-bold leading-relaxed">
                  Feature search is typically faster and more accurate than conjunction search. 
                  This demonstrates how visual attention works - some features "pop out" automatically, 
                  while others require focused attention to find.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">🔍 Performance by Search Type</h3>
              <div className="space-y-4">
                <div className="p-6 backdrop-blur-sm border rounded-2xl shadow-lg"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '20px', border: 'none' }}>
                  <h4 className="text-xl font-black mb-3 text-black">Feature Search</h4>
                  <p className="text-black font-bold mb-3">(Easy - pop-out effect)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="stat-value text-orange-600">{stats.featureAccuracy.toFixed(1)}%</div>
                      <div className="stat-label">Accuracy</div>
                    </div>
                    <div>
                      <div className="stat-value text-orange-600">{stats.featureAvgTime.toFixed(0)}ms</div>
                      <div className="stat-label">Avg Time</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 backdrop-blur-sm rounded-2xl shadow-lg border"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '20px', border: 'none' }}>
                  <h4 className="text-xl font-black mb-3 text-black">Conjunction Search</h4>
                  <p className="text-black font-bold mb-3">(Harder - requires attention)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="stat-value text-red-600">{stats.conjunctionAccuracy.toFixed(1)}%</div>
                      <div className="stat-label">Accuracy</div>
                    </div>
                    <div>
                      <div className="stat-value text-red-600">{stats.conjunctionAvgTime.toFixed(0)}ms</div>
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
      <h2 className="text-3xl font-bold mb-6">Visual Search Task</h2>
      
      <div className="mb-6">
        <p className="text-lg">
          Phase: <span className="font-bold">{phase === 'practice' ? 'Practice' : 'Test'}</span>
        </p>
        <p className="text-lg">
          Trial: {currentTrial + 1} of {phase === 'practice' ? practiceTrials : testTrials}
        </p>
        <p className="text-lg">
          Type: <span className="font-bold">
            {currentTrialType === 'feature' ? 'Feature Search' : 'Conjunction Search'}
          </span>
        </p>
      </div>

      {!trialStarted && currentTrial === 0 && results.length === 0 && (
        <div className="mb-6">
          <p className="text-lg">The experiment will start in a few seconds...</p>
        </div>
      )}

      {!trialStarted && (currentTrial > 0 || results.length > 0) && (
        <button
          onClick={startTrial}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Start Next Trial
        </button>
      )}

      {trialStarted && (
        <div className="experiment-card">
          <h3 className="text-xl font-bold mb-6 text-center">🔍 Find the red circle!</h3>
          <div className="visual-grid-wrapper">
            <div 
              className="visual-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(grid.length))}, 1fr)`,
              }}
            >
              {grid.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`visual-item ${
                    item.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                  } ${item.shape === 'circle' ? 'rounded-full' : 'rounded-none'}`}
                >
                  {item.isTarget && <span className="text-white font-bold text-2xl">🎯</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={handleNoTargetClick}
              className="modern-button bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Target Not Present
            </button>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-black font-bold">
                💡 Click on the red circle if you see it, or click "Target Not Present" if it's not there
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
