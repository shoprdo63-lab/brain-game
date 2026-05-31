import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

const WORDS = ['מוח', 'זיכרון', 'קשב', 'ריכוז', 'מהירות', 'חשיבה', 'תשובה', 'אימון', 'כוח', 'מנטלי', 'לוגיקה', 'חוכמה', 'יצירתיות', 'תבונה', 'דיוק', 'רפלקס', 'עיבוד', 'נתונים', 'מבחן', 'תוצאה', 'שיא', 'ניצחון', 'מטרה', 'הצלחה', 'שיפור']

function TypingGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [word, setWord] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('typingHighScore')) || 0)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  const nextWord = useCallback(() => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(w)
    setInput('')
    inputRef.current?.focus()
  }, [])

  const startGame = useCallback(() => {
    setPhase('playing')
    setScore(0)
    setTimeLeft(60)
    setCorrect(0)
    setStreak(0)
    nextWord()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [nextWord])

  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing') {
      setPhase('over')
      addPoints(Math.max(10, score), 'typing', score)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('typingHighScore', score.toString())
      }
    }
  }, [timeLeft, phase, score, highScore, addPoints])

  const handleInput = (e) => {
    const val = e.target.value
    setInput(val)
    if (val === word) {
      const newStreak = streak + 1
      const bonus = newStreak >= 3 ? 10 : newStreak >= 2 ? 5 : 0
      const pts = 10 + word.length * 2 + bonus
      setScore(s => s + pts)
      setCorrect(c => c + 1)
      setStreak(newStreak)
      nextWord()
    } else if (word.startsWith(val)) {
      // still typing correctly
    } else {
      setStreak(0)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>הקלדה מהירה</h2>
        <p style={{ color: 'var(--text-secondary)' }}>הקלד את המילים במהירות — ככל שתהיה מדויק יותר, תרוויח יותר</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>נקודות</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{score}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>זמן</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: timeLeft <= 10 ? '#ff8a80' : 'var(--text)' }}>{timeLeft}s</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>רצף</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: streak >= 2 ? 'var(--success)' : 'var(--text)' }}>{streak}🔥</p>
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
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>מילים נכונות: {correct}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && (
        <div style={{ textAlign: 'center', width: 'min(400px, 90vw)' }}>
          <div style={{ fontSize: 42, fontWeight: 700, marginBottom: 24, letterSpacing: 4, minHeight: 56 }}>
            {word.split('').map((char, i) => (
              <span key={i} style={{ color: i < input.length ? (input[i] === char ? 'var(--success)' : '#ff8a80') : 'var(--text)' }}>
                {char}
              </span>
            ))}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            autoFocus
            style={{
              fontSize: 28,
              padding: '16px 24px',
              borderRadius: 16,
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'inherit',
              fontWeight: 600,
              width: '100%',
              textAlign: 'center',
              outline: 'none',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default TypingGame
