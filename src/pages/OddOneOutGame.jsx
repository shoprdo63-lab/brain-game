import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

function generateGrid(level) {
  const size = Math.min(6, 3 + Math.floor(level / 3))
  const total = size * size
  const oddIndex = Math.floor(Math.random() * total)
  const baseHue = Math.floor(Math.random() * 360)
  const diff = Math.max(10, 40 - level * 2)
  return { size, oddIndex, baseHue, diff }
}

function OddOneOutGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [grid, setGrid] = useState(null)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('oddOneOutHighScore')) || 0)
  const timerRef = useRef(null)

  const startGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    setTimeLeft(30)
    setGrid(generateGrid(1))
    setPhase('playing')

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing') {
      setPhase('over')
      addPoints(Math.max(10, score), 'oddOneOut', score)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('oddOneOutHighScore', score.toString())
      }
    }
  }, [timeLeft, phase, score, highScore, addPoints])

  const handleClick = (index) => {
    if (phase !== 'playing' || !grid) return
    if (index === grid.oddIndex) {
      const pts = Math.max(5, 50 - level * 3)
      const newScore = score + pts
      setScore(newScore)
      const nextLevel = level + 1
      setLevel(nextLevel)
      setGrid(generateGrid(nextLevel))
    } else {
      setScore(s => Math.max(0, s - 10))
    }
  }

  const getColor = (index) => {
    if (!grid) return '#333'
    const isOdd = index === grid.oddIndex
    return `hsl(${grid.baseHue + (isOdd ? grid.diff : 0)}, 70%, 50%)`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>מצא את השונה</h2>
        <p style={{ color: 'var(--text-secondary)' }}>מצא את הריבוע בצבע שונה מכל השאר — ההבדל הולך וקטן</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שלב</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{level}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>ניקוד</p>
          <p style={{ fontSize: 22, fontWeight: 700 }}>{score}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>זמן</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: timeLeft <= 5 ? '#ff8a80' : 'var(--text)' }}>{timeLeft}s</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שיא</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>{highScore}</p>
        </div>
      </div>

      {phase === 'idle' && (
        <button className="restart-btn" onClick={startGame} style={{ fontSize: 18, padding: '16px 48px' }}>התחל משחק</button>
      )}

      {phase === 'over' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && grid && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid.size}, 1fr)`, gap: 6, maxWidth: 400, width: '100%' }}>
          {Array.from({ length: grid.size * grid.size }).map((_, i) => (
            <button
              key={`odd-${i}`}
              type="button"
              onClick={() => handleClick(i)}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                border: 'none',
                background: getColor(i),
                cursor: 'pointer',
                outline: 'none',
                padding: 0,
                transition: 'transform 0.1s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default OddOneOutGame
