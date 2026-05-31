import { useState, useCallback, useEffect, useRef } from 'react'

function generateProblem(level) {
  const ops = ['+', '-', '×', '÷']
  const opCount = level >= 5 ? 4 : level >= 3 ? 3 : 2
  const op = ops[Math.floor(Math.random() * opCount)]
  let a, b

  if (op === '+') {
    a = Math.floor(Math.random() * (10 + level * 5)) + 1
    b = Math.floor(Math.random() * (10 + level * 5)) + 1
  } else if (op === '-') {
    a = Math.floor(Math.random() * (15 + level * 5)) + 5
    b = Math.floor(Math.random() * a) + 1
  } else if (op === '×') {
    a = Math.floor(Math.random() * (5 + level)) + 2
    b = Math.floor(Math.random() * (5 + level)) + 2
  } else {
    b = Math.floor(Math.random() * (4 + level)) + 2
    const result = Math.floor(Math.random() * (5 + level)) + 2
    a = b * result
  }

  let answer
  if (op === '+') answer = a + b
  else if (op === '-') answer = a - b
  else if (op === '×') answer = a * b
  else answer = a / b

  return { text: `${a} ${op} ${b} = ?`, answer, a, b, op }
}

function QuickMathGame() {
  const [phase, setPhase] = useState('idle')
  const [problem, setProblem] = useState(null)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(30)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('mathHighScore')) || 0)
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)
  const inputRef = useRef(null)
  const timeoutsRef = useRef([])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [])

  const nextProblem = useCallback((lvl) => {
    const p = generateProblem(lvl)
    setProblem(p)
    setInput('')
    setFeedback(null)
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    timeoutsRef.current.push(t)
  }, [])

  const startGame = useCallback(() => {
    setPhase('playing')
    setScore(0)
    setLevel(1)
    setTimeLeft(30)
    setCorrect(0)
    setWrong(0)
    setStreak(0)
    nextProblem(1)

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
  }, [nextProblem])

  const submitAnswer = useCallback(() => {
    if (!problem || phase !== 'playing') return
    const val = Number.parseInt(input)
    if (Number.isNaN(val)) return

    if (val === problem.answer) {
      const newStreak = streak + 1
      const bonus = newStreak >= 3 ? 5 : 0
      const newScore = score + 10 + bonus + level * 2
      setScore(newScore)
      setCorrect(c => c + 1)
      setStreak(newStreak)
      setFeedback('correct')
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem('mathHighScore', newScore.toString())
      }
      if (correct > 0 && (correct + 1) % 5 === 0) {
        setLevel(l => l + 1)
        nextProblem(level + 1)
      } else {
        nextProblem(level)
      }
    } else {
      setWrong(w => w + 1)
      setStreak(0)
      setFeedback('wrong')
      const t = setTimeout(() => {
        setInput('')
        setFeedback(null)
        inputRef.current?.focus()
      }, 600)
      timeoutsRef.current.push(t)
    }
  }, [problem, input, phase, score, level, correct, streak, highScore, nextProblem])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') submitAnswer()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [submitAnswer])

  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>חישוב מהיר</h2>
        <p style={{ color: 'var(--text-secondary)' }}>פתור כמה שיותר תרגילים ב-30 שניות</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>נקודות</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{score}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>זמן</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: timeLeft <= 5 ? '#ff8a80' : 'var(--text)' }}>{timeLeft}s</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שלב</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{level}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>רצף</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: streak >= 3 ? 'var(--success)' : 'var(--text)' }}>{streak}🔥</p>
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
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>דיוק: {accuracy}% | נכונות: {correct} | טעויות: {wrong}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && problem && (
        <div style={{ textAlign: 'center' }}>
          <div
            dir="ltr"
            style={{
              direction: 'ltr',
              fontSize: 48,
              fontWeight: 700,
              marginBottom: 24,
              color: feedback === 'correct' ? '#69f0ae' : feedback === 'wrong' ? '#ff8a80' : 'var(--text)',
              transition: 'color 0.2s',
              minHeight: 60,
            }}
          >
            {problem.text}
          </div>

          <input
            ref={inputRef}
            dir="ltr"
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="תשובה..."
            style={{
              direction: 'ltr',
              fontSize: 28,
              padding: '16px 24px',
              borderRadius: 16,
              border: `2px solid ${feedback === 'correct' ? 'rgba(0,200,83,0.5)' : feedback === 'wrong' ? 'rgba(244,67,54,0.5)' : 'var(--border)'}`,
              background: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'inherit',
              fontWeight: 600,
              width: 'min(280px, 80vw)',
              textAlign: 'center',
              outline: 'none',
              boxShadow: feedback === 'correct' ? '0 0 30px rgba(0,200,83,0.2)' : feedback === 'wrong' ? '0 0 30px rgba(244,67,54,0.2)' : 'none',
              transition: 'all 0.2s',
            }}
          />

          <div style={{ marginTop: 16 }}>
            <button
              className="restart-btn"
              onClick={submitAnswer}
              style={{ fontSize: 16, padding: '12px 32px' }}
            >
              שלח (Enter)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickMathGame
