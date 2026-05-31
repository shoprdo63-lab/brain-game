import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

const SHAPES = ['🔴', '🔵', '🟢', '🟡']

function SpeedMatchGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [prevCard, setPrevCard] = useState(null)
  const [currCard, setCurrCard] = useState(null)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('speedMatchHighScore')) || 0)
  const timerRef = useRef(null)

  const TOTAL_ROUNDS = 25

  const nextCard = useCallback(() => {
    const card = Math.floor(Math.random() * SHAPES.length)
    setPrevCard(currCard)
    setCurrCard(card)
  }, [currCard])

  const startGame = useCallback(() => {
    const first = Math.floor(Math.random() * SHAPES.length)
    setPrevCard(first)
    setCurrCard(first)
    setPhase('playing')
    setScore(0)
    setCorrect(0)
    setWrong(0)
    setRound(0)
    setTimeLeft(30)

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
      clearInterval(timerRef.current)
      setPhase('over')
      addPoints(Math.max(10, score), 'speedMatch', score)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('speedMatchHighScore', score.toString())
      }
    }
  }, [timeLeft, phase, score, highScore, addPoints])

  const handleAnswer = useCallback((isSame) => {
    if (phase !== 'playing' || prevCard === null || currCard === null) return
    const actualSame = prevCard === currCard
    const right = isSame === actualSame

    if (right) {
      setScore(s => s + 20)
      setCorrect(c => c + 1)
    } else {
      setScore(s => Math.max(0, s - 10))
      setWrong(w => w + 1)
    }

    const newRound = round + 1
    setRound(newRound)

    if (newRound >= TOTAL_ROUNDS) {
      clearInterval(timerRef.current)
      addPoints(Math.max(10, right ? score + 20 : score), 'speedMatch', right ? score + 20 : score)
      setPhase('over')
    } else {
      nextCard()
    }
  }, [phase, prevCard, currCard, round, score, nextCard, addPoints])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>התאמה מהירה</h2>
        <p style={{ color: 'var(--text-secondary)' }}>האם הצורה הנוכחית זהה לקודמת?</p>
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
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>דיוק: {correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0}%</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && currCard !== null && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 32, minHeight: 100 }}>
            {SHAPES[currCard]}
          </div>
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

export default SpeedMatchGame
