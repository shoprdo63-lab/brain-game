import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

const COLORS = [
  { name: 'אדום', hex: '#ef4444' },
  { name: 'כחול', hex: '#3b82f6' },
  { name: 'ירוק', hex: '#22c55e' },
  { name: 'צהוב', hex: '#eab308' },
]

function ReflexChallengeGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [round, setRound] = useState(0)
  const [current, setCurrent] = useState(null)
  const [targetColor, setTargetColor] = useState(null)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('reflexHighScore')) || 0)
  const timerRef = useRef(null)
  const timeoutsRef = useRef([])
  const TOTAL_ROUNDS = 25

  const nextRound = useCallback(() => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const target = COLORS[Math.floor(Math.random() * COLORS.length)]
    setCurrent(color)
    setTargetColor(target)
  }, [])

  const startGame = useCallback(() => {
    setPhase('playing')
    setScore(0)
    setTimeLeft(30)
    setRound(0)
    nextRound()

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [nextRound])

  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing') {
      clearInterval(timerRef.current)
      setPhase('over')
      addPoints(Math.max(10, score), 'reflex', score)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('reflexHighScore', score.toString())
      }
    }
  }, [timeLeft, phase, score, highScore, addPoints])

  const handleAnswer = useCallback((isSame) => {
    if (phase !== 'playing' || !current || !targetColor) return
    const actualSame = current.name === targetColor.name
    const correct = isSame === actualSame

    if (correct) {
      setScore(s => s + 15)
    } else {
      setScore(s => Math.max(0, s - 10))
    }

    const newRound = round + 1
    setRound(newRound)

    if (newRound >= TOTAL_ROUNDS) {
      clearInterval(timerRef.current)
      addPoints(Math.max(10, correct ? score + 15 : score), 'reflex', correct ? score + 15 : score)
      setPhase('over')
    } else {
      nextRound()
    }
  }, [phase, current, targetColor, round, score, nextRound, addPoints])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>אתגר הרפלקסים</h2>
        <p style={{ color: 'var(--text-secondary)' }}>האם הצבע הנוכחי זהה לצבע המטרה?</p>
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

      {phase === 'playing' && current && targetColor && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>מטרה: </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: targetColor.hex }}>{targetColor.name}</span>
          </div>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 20,
              background: current.hex,
              margin: '0 auto 32px',
              boxShadow: `0 0 40px ${current.hex}66`,
            }}
          />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button className="restart-btn" onClick={() => handleAnswer(false)} style={{ fontSize: 18, padding: '14px 36px', background: 'linear-gradient(135deg, #FF4081, #F8BBD0)' }}>שונה</button>
            <button className="restart-btn" onClick={() => handleAnswer(true)} style={{ fontSize: 18, padding: '14px 36px' }}>זהה ✓</button>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: 14 }}>{round + 1} / {TOTAL_ROUNDS}</p>
        </div>
      )}
    </div>
  )
}

export default ReflexChallengeGame
