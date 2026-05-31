import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

function AimTrainerGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [target, setTarget] = useState(null)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('aimHighScore')) || 0)
  const timerRef = useRef(null)
  const containerRef = useRef(null)
  const timeoutsRef = useRef([])

  const spawnTarget = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const size = Math.max(40, 80 - hits * 2)
    const x = Math.random() * (rect.width - size - 20) + 10
    const y = Math.random() * (rect.height - size - 20) + 10
    setTarget({ x, y, size, id: Date.now() })
  }, [hits])

  const startGame = useCallback(() => {
    setPhase('playing')
    setScore(0)
    setTimeLeft(30)
    setHits(0)
    setMisses(0)
    setTarget(null)
    const t = setTimeout(() => spawnTarget(), 500)
    timeoutsRef.current.push(t)

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('over')
          addPoints(Math.max(10, score), 'aim', score)
          if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('aimHighScore', score.toString())
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [spawnTarget, addPoints, score, highScore])

  const handleHit = useCallback(() => {
    if (phase !== 'playing') return
    const timeBonus = Math.max(1, 20 - hits)
    const pts = 15 + timeBonus
    setScore(s => s + pts)
    setHits(h => h + 1)
    setTarget(null)
    const t = setTimeout(() => spawnTarget(), 300 + Math.random() * 400)
    timeoutsRef.current.push(t)
  }, [phase, hits, spawnTarget])

  const handleMiss = useCallback((e) => {
    if (phase !== 'playing') return
    if (e.target === containerRef.current) {
      setMisses(m => m + 1)
      setScore(s => Math.max(0, s - 5))
    }
  }, [phase])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>אימון מיקוד</h2>
        <p style={{ color: 'var(--text-secondary)' }}>לחץ על המטרות במהירות — הן מתכווצות ככל שמתקדמים</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>נקודות</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{score}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>זמן</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: timeLeft <= 5 ? '#ff8a80' : 'var(--text)' }}>{timeLeft}s</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>פגיעות</p>
          <p style={{ fontSize: 22, fontWeight: 700 }}>{hits}</p>
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

      {phase === 'over' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>פגיעות: {hits} | החטאות: {misses}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && (
        <div
          ref={containerRef}
          onClick={handleMiss}
          style={{
            position: 'relative',
            width: 'min(500px, 90vw)',
            height: 300,
            background: 'var(--surface)',
            borderRadius: 20,
            border: '2px solid var(--border)',
            overflow: 'hidden',
            cursor: 'crosshair',
          }}
        >
          {target && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleHit() }}
              style={{
                position: 'absolute',
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                border: '3px solid white',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(255,107,53,0.5)',
                outline: 'none',
                padding: 0,
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default AimTrainerGame
