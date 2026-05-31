import { useState, useCallback, useEffect, useRef } from 'react'

const GRID = 9

function PatternGame() {
  const [phase, setPhase] = useState('idle')
  const [pattern, setPattern] = useState([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('patternHighScore')) || 0)
  const [activeCell, setActiveCell] = useState(null)
  const [showing, setShowing] = useState(false)
  const timeoutsRef = useRef([])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [])

  const safeSet = useCallback((fn) => {
    if (mountedRef.current) fn()
  }, [])

  const showPattern = useCallback(async (seq) => {
    safeSet(() => setShowing(true))
    for (let i = 0; i < seq.length; i++) {
      if (!mountedRef.current) return
      safeSet(() => setActiveCell(seq[i]))
      await new Promise(r => {
        const t = setTimeout(r, 400)
        timeoutsRef.current.push(t)
      })
      safeSet(() => setActiveCell(null))
      await new Promise(r => {
        const t = setTimeout(r, 200)
        timeoutsRef.current.push(t)
      })
    }
    if (!mountedRef.current) return
    safeSet(() => setShowing(false))
    safeSet(() => setPlayerIndex(0))
  }, [safeSet])

  const startGame = useCallback(() => {
    const newPattern = [Math.floor(Math.random() * GRID)]
    setPattern(newPattern)
    setLevel(1)
    setScore(0)
    setPhase('watch')
    const t = setTimeout(() => showPattern(newPattern), 600)
    timeoutsRef.current.push(t)
  }, [showPattern])

  const handleCellClick = useCallback((cellIndex) => {
    if (phase !== 'play' || showing) return

    safeSet(() => setActiveCell(cellIndex))
    const t = setTimeout(() => safeSet(() => setActiveCell(null)), 200)
    timeoutsRef.current.push(t)

    if (cellIndex === pattern[playerIndex]) {
      if (playerIndex + 1 === pattern.length) {
        const newScore = score + level * 50
        setScore(newScore)
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem('patternHighScore', newScore.toString())
        }
        const nextPattern = [...pattern, Math.floor(Math.random() * GRID)]
        setPattern(nextPattern)
        setLevel(l => l + 1)
        setPhase('watch')
        const t2 = setTimeout(() => showPattern(nextPattern), 600)
        timeoutsRef.current.push(t2)
      } else {
        setPlayerIndex(i => i + 1)
      }
    } else {
      setPhase('gameover')
    }
  }, [phase, showing, pattern, playerIndex, score, level, highScore, showPattern, safeSet])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>זיכרון תבניות</h2>
        <p style={{ color: 'var(--text-secondary)' }}>זכור את הרצף והחזר עליו — כל שלב מוסיף נקודה</p>
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
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שיא</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>{highScore}</p>
        </div>
      </div>

      {phase === 'idle' && (
        <button className="restart-btn" onClick={startGame} style={{ fontSize: 18, padding: '16px 48px' }}>
          התחל משחק
        </button>
      )}

      {phase === 'gameover' && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>נגמר!</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>הגעת לשלב {level} | {score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {(phase === 'watch' || phase === 'play' || phase === 'gameover') && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            maxWidth: 360,
            width: '100%',
          }}
        >
          {Array.from({ length: GRID }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleCellClick(i)}
              disabled={phase !== 'play' || showing}
              style={{
                aspectRatio: '1',
                borderRadius: 16,
                border: '2px solid var(--border)',
                background: activeCell === i
                  ? 'linear-gradient(135deg, var(--secondary), var(--accent))'
                  : 'var(--surface)',
                cursor: phase === 'play' && !showing ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                outline: 'none',
                padding: 0,
                boxShadow: activeCell === i ? '0 0 30px rgba(0,184,212,0.4)' : 'none',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PatternGame
