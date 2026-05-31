import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

const WORDS = ['מוח', 'זיכרון', 'קשב', 'ריכוז', 'מהירות', 'חשיבה', 'תשובה', 'אימון', 'כוח', 'מנטלי', 'לוגיקה', 'חוכמה', 'יצירתיות', 'תבונה', 'דיוק', 'רפלקס', 'עיבוד', 'נתונים', 'מבחן', 'תוצאה', 'שיא', 'ניצחון', 'מטרה', 'הצלחה', 'שיפור', 'מחשבה', 'בינה', 'חידה', 'פתרון', 'אתגר']

function scramble(word) {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  const result = arr.join('')
  return result === word ? scramble(word) : result
}

function WordScrambleGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [word, setWord] = useState('')
  const [scrambled, setScrambled] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [correct, setCorrect] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('wordScrambleHighScore')) || 0)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  const nextWord = useCallback(() => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(w)
    setScrambled(scramble(w))
    setInput('')
    inputRef.current?.focus()
  }, [])

  const startGame = useCallback(() => {
    setPhase('playing')
    setScore(0)
    setTimeLeft(60)
    setCorrect(0)
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
      addPoints(Math.max(10, score), 'wordScramble', score)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('wordScrambleHighScore', score.toString())
      }
    }
  }, [timeLeft, phase, score, highScore, addPoints])

  const handleSubmit = () => {
    if (input === word) {
      const pts = 15 + word.length * 3
      setScore(s => s + pts)
      setCorrect(c => c + 1)
      nextWord()
    } else {
      setScore(s => Math.max(0, s - 5))
      setInput('')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>פיענוח מילים</h2>
        <p style={{ color: 'var(--text-secondary)' }}>סדר את האותיות כדי ליצור מילה נכונה</p>
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
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>מילים נכונות: {correct}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && (
        <div style={{ textAlign: 'center', width: 'min(400px, 90vw)' }}>
          <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: 6, marginBottom: 24, color: 'var(--accent)', minHeight: 60 }}>
            {scrambled}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
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
              marginBottom: 16,
            }}
          />
          <button className="restart-btn" onClick={handleSubmit} style={{ fontSize: 16, padding: '12px 32px' }}>שלח (Enter)</button>
        </div>
      )}
    </div>
  )
}

export default WordScrambleGame
