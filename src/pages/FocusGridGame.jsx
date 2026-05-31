import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

function FocusGridGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [level, setLevel] = useState(1)
  const [targets, setTargets] = useState([])
  const [found, setFound] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('focusGridHighScore')) || 0)
  const timerRef = useRef(null)

  const size = Math.min(7, 4 + Math.floor(level / 3))
  const total = size * size
  const targetCount = Math.min(5, 2 + Math.floor(level / 2))

  const startLevel = useCallback((lvl) => {
    const s = Math.min(7, 4 + Math.floor(lvl / 3))
    const t = Math.min(5, 2 + Math.floor(lvl / 2))
    const cells = []
    while (cells.length < t) {
      const c = Math.floor(Math.random() * (s * s))
      if (!cells.includes(c)) cells.push(c)
    }
    setTargets(cells)
    setFound([])
    setTimeLeft(30)
    setPhase('watch')

    const timeout = setTimeout(() => {
      setPhase('play')
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }, 1500 + lvl * 200)
    return timeout
  }, [])

  const startGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    startLevel(1)
  }, [startLevel])

  useEffect(() => {
    if (timeLeft === 0 && phase === 'play') {
      clearInterval(timerRef.current)
      setPhase('over')
      addPoints(Math.max(10, score), 'focusGrid', score)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('focusGridHighScore', score.toString())
      }
    }
  }, [timeLeft, phase, score, highScore, addPoints])

  const handleClick = useCallback((cell) => {
    if (phase !== 'play') return
    if (found.includes(cell)) return

    if (targets.includes(cell)) {
      const newFound = [...found, cell]
      setFound(newFound)
      if (newFound.length === targets.length) {
        clearInterval(timerRef.current)
        const pts = level * 40
        const newScore = score + pts
        setScore(newScore)
        const nextLevel = level + 1
        setLevel(nextLevel)
        const t = setTimeout(() => startLevel(nextLevel), 400)
        timerRef.current = t
      }
    } else {
      setScore(s => Math.max(0, s - 15))
    }
  }, [phase, found, targets, level, score, startLevel])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>רשת הקשב</h2>
        <p style={{ color: 'var(--text-secondary)' }}>זכור אילו תאים הבהיקו ולחץ רק עליהם</p>
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
          <p style={{ fontSize: 22, fontWeight: 700, color: timeLeft <= 5 ? '#ff8a80' : 'var(--text)' }}>{phase === 'watch' ? '—' : `${timeLeft}s`}</p>
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
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>נגמר!</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>הגעת לשלב {level} | {score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {(phase === 'watch' || phase === 'play') && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: 8, maxWidth: 380, width: '100%' }}>
          {Array.from({ length: total }).map((_, i) => {
            const isTarget = targets.includes(i)
            const isFound = found.includes(i)
            const showHighlight = phase === 'watch' && isTarget
            return (
              <button
                key={`focus-${i}`}
                type="button"
                onClick={() => handleClick(i)}
                disabled={phase !== 'play'}
                style={{
                  aspectRatio: '1',
                  borderRadius: 10,
                  border: '2px solid var(--border)',
                  background: showHighlight ? 'linear-gradient(135deg, var(--primary), var(--accent))' : isFound ? 'var(--success)' : 'var(--surface)',
                  cursor: phase === 'play' ? 'pointer' : 'default',
                  outline: 'none',
                  padding: 0,
                  transition: 'all 0.15s',
                  opacity: isFound ? 0.5 : 1,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FocusGridGame
