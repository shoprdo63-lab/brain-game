import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

const WORDS = ['אדום', 'כחול', 'ירוק', 'צהוב']
const COLORS = [
  { name: 'אדום', hex: '#ef4444' },
  { name: 'כחול', hex: '#3b82f6' },
  { name: 'ירוק', hex: '#22c55e' },
  { name: 'צהוב', hex: '#eab308' },
]

function generateTrial() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  return { word, color }
}

function ColorMatchGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [trial, setTrial] = useState(null)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('colorMatchHighScore')) || 0)
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)
  const timeoutsRef = useRef([])

  const TOTAL_ROUNDS = 20

  const nextTrial = useCallback(() => {
    setTrial(generateTrial())
    setFeedback(null)
  }, [])

  const startGame = useCallback(() => {
    setPhase('playing')
    setScore(0)
    setCorrect(0)
    setWrong(0)
    setRound(0)
    setTimeLeft(30)
    nextTrial()

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          addPoints(Math.max(10, score), 'colorMatch', score)
          setPhase('over')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [nextTrial, addPoints, score])

  const handleAnswer = useCallback((match) => {
    if (phase !== 'playing' || !trial) return
    const isMatch = trial.word === trial.color.name
    const isCorrect = match === isMatch

    if (isCorrect) {
      const newScore = score + 15
      setScore(newScore)
      setCorrect(c => c + 1)
      setFeedback('correct')
    } else {
      setWrong(w => w + 1)
      setFeedback('wrong')
    }

    const newRound = round + 1
    setRound(newRound)

    if (newRound >= TOTAL_ROUNDS) {
      clearInterval(timerRef.current)
      addPoints(Math.max(10, isCorrect ? score + 15 : score), 'colorMatch', isCorrect ? score + 15 : score)
      setPhase('over')
    } else {
      const t = setTimeout(() => nextTrial(), isCorrect ? 300 : 500)
      timeoutsRef.current.push(t)
    }
  }, [phase, trial, round, score, nextTrial, addPoints])

  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>התאמת צבעים</h2>
        <p style={{ color: 'var(--text-secondary)' }}>האם המילה מתאימה לצבע שלה? כן או לא?</p>
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
        <button className="restart-btn" onClick={startGame} style={{ fontSize: 18, padding: '16px 48px' }}>
          התחל משחק
        </button>
      )}

      {phase === 'over' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>דיוק: {accuracy}% | נכונות: {correct} | טעויות: {wrong}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && trial && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              marginBottom: 32,
              color: trial.color.hex,
              transition: 'color 0.2s',
              minHeight: 70,
            }}
          >
            {trial.word}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button
              className="restart-btn"
              onClick={() => handleAnswer(true)}
              style={{ fontSize: 18, padding: '14px 36px', background: 'linear-gradient(135deg, #00C853, #69F0AE)' }}
            >
              כן ✓
            </button>
            <button
              className="restart-btn"
              onClick={() => handleAnswer(false)}
              style={{ fontSize: 18, padding: '14px 36px', background: 'linear-gradient(135deg, #FF4081, #F8BBD0)' }}
            >
              לא ✗
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorMatchGame
