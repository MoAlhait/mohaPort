'use client'

import { useState, useEffect } from 'react'

interface MemoryResult {
  sequenceLength: number
  sequence: number[]
  userInput: number[]
  isCorrect: boolean
  responseTime: number
}

export default function MemorySpanTask() {
  const [phase, setPhase] = useState<'instructions' | 'practice' | 'test' | 'results'>('instructions')
  const [currentTrial, setCurrentTrial] = useState(0)
  const [results, setResults] = useState<MemoryResult[]>([])
  const [currentSequence, setCurrentSequence] = useState<number[]>([])
  const [showSequence, setShowSequence] = useState(false)
  const [userInput, setUserInput] = useState<number[]>([])
  const [inputComplete, setInputComplete] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  const practiceTrials = 3
  const testTrials = 12
  const maxSpan = 8

  const generateSequence = (length: number): number[] => {
    const sequence: number[] = []
    for (let i = 0; i < length; i++) {
      let num
      do {
        num = Math.floor(Math.random() * 9) + 1 // Numbers 1-9
      } while (sequence.includes(num)) // Avoid duplicates
      sequence.push(num)
    }
    return sequence
  }

  const getTrialLength = (trialIndex: number): number => {
    // Start with length 3, gradually increase
    const baseLength = 3
    const increment = Math.floor(trialIndex / 2) // Increase every 2 trials
    return Math.min(baseLength + increment, maxSpan)
  }

  const startSequenceDisplay = () => {
    const length = getTrialLength(currentTrial)
    const sequence = generateSequence(length)
    setCurrentSequence(sequence)
    setShowSequence(true)
    setStartTime(Date.now())

    // Hide sequence after 1 second per digit
    setTimeout(() => {
      setShowSequence(false)
      setUserInput([])
      setInputComplete(false)
    }, length * 1000)
  }

  const handleNumberClick = (num: number) => {
    if (showSequence || inputComplete) return

    const newInput = [...userInput, num]
    setUserInput(newInput)

    // Check if input is complete
    if (newInput.length === currentSequence.length) {
      setInputComplete(true)
      const responseTime = Date.now() - startTime
      const isCorrect = JSON.stringify(newInput) === JSON.stringify(currentSequence)

      const result: MemoryResult = {
        sequenceLength: currentSequence.length,
        sequence: [...currentSequence],
        userInput: [...newInput],
        isCorrect,
        responseTime
      }

      setResults([...results, result])

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
      }, 2000)
    }
  }

  const clearInput = () => {
    setUserInput([])
    setInputComplete(false)
  }

  const startExperiment = () => {
    setPhase('practice')
    setCurrentTrial(0)
    setResults([])
    setTimeout(startSequenceDisplay, 2000)
  }

  const resetExperiment = () => {
    setPhase('instructions')
    setCurrentTrial(0)
    setResults([])
    setShowSequence(false)
    setUserInput([])
    setInputComplete(false)
  }

  const calculateStats = () => {
    if (results.length === 0) return null

    const correctTrials = results.filter(r => r.isCorrect)
    const accuracy = (correctTrials.length / results.length) * 100

    // Calculate memory span (longest sequence recalled correctly)
    const memorySpan = correctTrials.length > 0 
      ? Math.max(...correctTrials.map(r => r.sequenceLength))
      : 0

    // Group by sequence length
    const byLength = results.reduce((acc, result) => {
      const length = result.sequenceLength
      if (!acc[length]) {
        acc[length] = { total: 0, correct: 0 }
      }
      acc[length].total++
      if (result.isCorrect) acc[length].correct++
      return acc
    }, {} as { [key: number]: { total: number; correct: number } })

    return {
      accuracy,
      memorySpan,
      byLength,
      avgResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
    }
  }

  if (phase === 'instructions') {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-3xl">
            🧠
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Memory Span Task
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="experiment-card">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-blue-400">What is it?</h3>
                <p className="text-lg text-black font-bold leading-relaxed mb-4">
                  This experiment tests your working memory capacity - the ability to temporarily 
                  hold and manipulate information in your mind.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 text-green-400">Your Task</h3>
                <p className="text-lg text-black font-bold leading-relaxed">
                  You'll see a sequence of numbers appear one at a time. After the sequence disappears, 
                  enter the numbers in the exact order you saw them. The sequences will gradually get longer!
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">💡 Example</h3>
                <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-6 border border-cyan-200/50">
                  <p className="text-lg text-black font-bold">
                    If you see 7 → 2 → 9, then you should click 7, then 2, then 9.
                  </p>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value text-green-400">20</div>
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
              🧠
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-3xl">
            📊
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Memory Span Results
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
                  <div className="stat-value text-blue-400">{stats.memorySpan}</div>
                  <div className="stat-label">Memory Span</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ background: 'var(--primary-gradient)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.avgResponseTime.toFixed(0)}ms</div>
                  <div className="stat-label">Avg Time</div>
                </div>
              </div>
              
                <div className="p-6 backdrop-blur-sm rounded-2xl shadow-lg border"
                  style={{ background: 'rgba(249, 168, 212, 0.95)', borderRadius: '20px', border: 'none' }}>
                <h4 className="text-xl font-black mb-3 text-black">💡 What This Shows</h4>
                <p className="text-black font-bold leading-relaxed">
                  Your memory span indicates your working memory capacity. The average adult can hold 
                  7±2 items in working memory. Performance typically decreases as sequence length increases 
                  due to the limited capacity of working memory.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">📊 Performance by Length</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(stats.byLength)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([length, data]) => (
                    <div key={length} className="stat-card">
                      <div className="stat-value text-blue-400">{length} digits</div>
                      <div className="stat-label">{data.correct}/{data.total} correct</div>
                      <div className="text-sm text-black font-bold">
                        {(data.correct / data.total * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
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
      <h2 className="text-3xl font-bold mb-6">Memory Span Task</h2>
      
      <div className="mb-6">
        <p className="text-lg">
          Phase: <span className="font-bold">{phase === 'practice' ? 'Practice' : 'Test'}</span>
        </p>
        <p className="text-lg">
          Trial: {currentTrial + 1} of {phase === 'practice' ? practiceTrials : testTrials}
        </p>
      </div>

      <div className="mb-8">
        {showSequence ? (
          <div className="memory-sequence">
            {currentSequence.map((num, index) => (
              <span key={index} className="inline-block mx-2">
                {num}
              </span>
            ))}
          </div>
        ) : (
          <div className="memory-sequence text-black font-bold">
            {userInput.length > 0 ? 'Enter the sequence:' : 'Memorize the sequence...'}
          </div>
        )}
      </div>

      {!showSequence && (
        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg max-w-md mx-auto">
            <p className="text-lg font-bold mb-2">Your Input:</p>
            <div className="text-2xl">
              {userInput.length > 0 ? userInput.join(' → ') : 'Click numbers below'}
            </div>
          </div>
        </div>
      )}

      {!showSequence && !inputComplete && (
        <div className="mb-6">
          <button
            onClick={clearInput}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Clear Input
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={showSequence || inputComplete}
            className="number-button py-4 px-6"
          >
            {num}
          </button>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Click the numbers in the order you saw them appear</p>
      </div>
    </div>
  )
}
