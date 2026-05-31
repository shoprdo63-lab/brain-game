import { useState, useCallback, useEffect, useRef } from 'react'

const WORDS = ['אדום', 'כחול', 'ירוק', 'צהוב', 'סגול']
const COLORS = [
  { name: 'אדום', hex: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
  { name: 'כחול', hex: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
  { name: 'ירוק', hex: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
  { name: 'צהוב', hex: '#eab308', glow: 'rgba(234,179,8,0.4)' },
  { name: 'סגול', hex: '#a855f7', glow: 'rgba(168,85,247,0.4)' },
]

function generateTrial() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  return { word, color }
}

function StroopGame() {
  const [phase, setPhase] = useState('idle')
  const [trial, setTrial] = useState(null)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('stroopHighScore')) || 0)
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(0)
  const totalTimeRef = useRef(0)

  const TOTAL_ROUNDS = 20

  const nextTrial = useCallback(() => {
    const t = generateTrial()
    setTrial(t)
    setFeedback(null)
    startTimeRef.current = performance.now()
  }, [])

  const startGame = useCallback(() => {
    setPhase('playing')
    setScore(0)
    setCorrect(0)
    setWrong(0)
    setRound(0)
    setTimeLeft(45)
    totalTimeRef.current = 0
    nextTrial()

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('over')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [nextTrial])

  const handleAnswer = useCallback((colorName) => {
    if (phase !== 'playing' || !trial) return

    const reactionTime = performance.now() - startTimeRef.current
    totalTimeRef.current += reactionTime

    const isCorrect = colorName === trial.color.name
    if (isCorrect) {
      const timeBonus = reactionTime < 800 ? 5 : reactionTime < 1200 ? 3 : 1
      const newScore = score + 10 + timeBonus
      setScore(newScore)
      setCorrect(c => c + 1)
      setFeedback('correct')
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem('stroopHighScore', newScore.toString())
      }
    } else {
      setWrong(w => w + 1)
      setFeedback('wrong')
    }

    const newRound = round + 1
    setRound(newRound)

    if (newRound >= TOTAL_ROUNDS) {
      clearInterval(timerRef.current)
      setPhase('over')
    } else {
      setTimeout(() => nextTrial(), isCorrect ? 400 : 800)
    }
  }, [phase, trial, round, score, highScore, nextTrial])

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0
  const avgTime = correct + wrong > 0 ? Math.round(totalTimeRef.current / (correct + wrong)) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>מבחן סטרופ</h2>
        <p style={{ color: 'var(--text-secondary)' }}>זהה את צבע הטקסט, לא את המילה עצמה</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>נקודות</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{score}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>סבב</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{round}/{TOTAL_ROUNDS}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>זמן</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: timeLeft <= 5 ? '#ff8a80' : 'var(--text)' }}>{timeLeft}s</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
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
          <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>דיוק: {accuracy}% | ממוצע: {avgTime}ms</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && trial && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 500 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              marginBottom: 32,
              color: feedback === 'correct' ? '#69f0ae' : feedback === 'wrong' ? '#ff8a80' : trial.color.hex,
              textShadow: feedback === 'correct' ? '0 0 30px rgba(0,200,83,0.3)' : feedback === 'wrong' ? '0 0 30px rgba(244,67,54,0.3)' : `0 0 30px ${trial.color.glow}`,
              minHeight: 80,
              transition: 'all 0.2s',
              direction: 'rtl',
            }}
          >
            {trial.word}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, maxWidth: 500, margin: '0 auto' }}>
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => handleAnswer(c.name)}
                disabled={feedback !== null}
                style={{
                  padding: '14px 20px',
                  borderRadius: 14,
                  outline: 'none',
                  cursor: feedback !== null ? 'default' : 'pointer',
                  background: `${c.hex}25`,
                  color: c.hex,
                  fontFamily: 'inherit',
                  fontSize: 16,
                  fontWeight: 700,
                  border: `2px solid ${c.hex}50`,
                  transition: 'all 0.2s',
                  opacity: feedback !== null ? 0.5 : 1,
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StroopGame
