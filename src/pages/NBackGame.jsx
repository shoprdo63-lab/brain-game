import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

const SHAPES = ['🔴', '🟦', '🟢', '🟨']

function NBackGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [n, setN] = useState(2)
  const [sequence, setSequence] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('nBackHighScore')) || 0)
  const timeoutsRef = useRef([])

  const startGame = useCallback(() => {
    const seq = Array.from({ length: 25 }, () => Math.floor(Math.random() * SHAPES.length))
    setSequence(seq)
    setCurrentIndex(0)
    setScore(0)
    setCorrect(0)
    setWrong(0)
    setRounds(0)
    setPhase('playing')

    let idx = 0
    const show = () => {
      setCurrentIndex(idx)
      idx++
      if (idx < seq.length) {
        const t = setTimeout(show, 1500)
        timeoutsRef.current.push(t)
      } else {
        const t = setTimeout(() => {
          setPhase('over')
          const finalScore = Math.max(10, score + (correct - wrong) * 10)
          addPoints(finalScore, 'nBack', finalScore)
          if (finalScore > highScore) {
            setHighScore(finalScore)
            localStorage.setItem('nBackHighScore', finalScore.toString())
          }
        }, 1500)
        timeoutsRef.current.push(t)
      }
    }
    const t = setTimeout(show, 800)
    timeoutsRef.current.push(t)
  }, [n, score, correct, wrong, highScore, addPoints])

  const handleMatch = useCallback((isMatch) => {
    if (phase !== 'playing' || currentIndex < n) return
    const prev = sequence[currentIndex - n]
    const curr = sequence[currentIndex]
    const actualMatch = prev === curr

    if (isMatch === actualMatch) {
      setScore(s => s + 20)
      setCorrect(c => c + 1)
    } else {
      setScore(s => Math.max(0, s - 10))
      setWrong(w => w + 1)
    }
    setRounds(r => r + 1)
  }, [phase, currentIndex, n, sequence])

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>N-Back</h2>
        <p style={{ color: 'var(--text-secondary)' }}>האם הצורה הנוכחית זהה לצורה לפני {n} שלבים?</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>נקודות</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{score}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שלב N</p>
          <p style={{ fontSize: 22, fontWeight: 700 }}>{n}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שיא</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>{highScore}</p>
        </div>
      </div>

      {phase === 'idle' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>בחר רמת N:</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
            {[1, 2, 3, 4].map(val => (
              <button key={val} className="restart-btn" onClick={() => setN(val)} style={{ fontSize: 16, opacity: n === val ? 1 : 0.5 }}>N={val}</button>
            ))}
          </div>
          <button className="restart-btn" onClick={startGame} style={{ fontSize: 18, padding: '16px 48px' }}>התחל משחק</button>
        </div>
      )}

      {phase === 'over' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>נכונות: {correct} | טעויות: {wrong}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && sequence.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 32, minHeight: 100 }}>
            {SHAPES[sequence[currentIndex]]}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button className="restart-btn" onClick={() => handleMatch(false)} style={{ fontSize: 18, padding: '14px 36px', background: 'linear-gradient(135deg, #FF4081, #F8BBD0)' }}>שונה</button>
            <button className="restart-btn" onClick={() => handleMatch(true)} style={{ fontSize: 18, padding: '14px 36px' }}>זהה ✓</button>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: 14 }}>{currentIndex + 1} / {sequence.length}</p>
        </div>
      )}
    </div>
  )
}

export default NBackGame
