import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'

function GridRecallGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [level, setLevel] = useState(1)
  const [gridSize, setGridSize] = useState(9)
  const [highlighted, setHighlighted] = useState([])
  const [selected, setSelected] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('gridRecallHighScore')) || 0)
  const timeoutsRef = useRef([])

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [])

  const startGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    setGridSize(9)
    startLevel(1, 9)
  }, [])

  const startLevel = useCallback((lvl, size) => {
    setPhase('watch')
    setSelected([])
    const count = Math.min(2 + Math.floor(lvl / 2), 8)
    const cells = []
    while (cells.length < count) {
      const c = Math.floor(Math.random() * size)
      if (!cells.includes(c)) cells.push(c)
    }
    setHighlighted(cells)
    const t = setTimeout(() => {
      setHighlighted([])
      setPhase('play')
    }, 1000 + lvl * 300)
    timeoutsRef.current.push(t)
  }, [])

  const handleCellClick = useCallback((cell) => {
    if (phase !== 'play') return
    if (selected.includes(cell)) return
    const newSelected = [...selected, cell]
    setSelected(newSelected)
  }, [phase, selected])

  useEffect(() => {
    if (phase !== 'play' || selected.length === 0) return
    const needed = highlighted.length
    if (selected.length >= needed) {
      const correct = selected.filter(s => highlighted.includes(s)).length
      if (correct === needed && selected.length === needed) {
        const pts = level * 50
        const newScore = score + pts
        setScore(newScore)
        setPhase('correct')
        const t = setTimeout(() => {
          const nextLevel = level + 1
          const newSize = nextLevel >= 5 ? 16 : 9
          setLevel(nextLevel)
          setGridSize(newSize)
          startLevel(nextLevel, newSize)
        }, 600)
        timeoutsRef.current.push(t)
      } else {
        setPhase('over')
        addPoints(Math.max(10, score), 'gridRecall', score)
        if (score > highScore) {
          setHighScore(score)
          localStorage.setItem('gridRecallHighScore', score.toString())
        }
      }
    }
  }, [phase, selected, highlighted, level, score, highScore, startLevel, addPoints])

  const cols = gridSize === 16 ? 4 : 3

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>זיכרון רשת</h2>
        <p style={{ color: 'var(--text-secondary)' }}>זכור אילו תאים הבהיקו והחזר עליהם</p>
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

      {phase === 'over' && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>נגמר!</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>הגעת לשלב {level} | {score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {(phase === 'watch' || phase === 'play' || phase === 'correct') && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, maxWidth: 360, width: '100%' }}>
          {Array.from({ length: gridSize }).map((_, i) => {
            const isHighlighted = highlighted.includes(i)
            const isSelected = selected.includes(i)
            return (
              <button
                key={`cell-${i}`}
                type="button"
                onClick={() => handleCellClick(i)}
                disabled={phase !== 'play'}
                style={{
                  aspectRatio: '1',
                  borderRadius: 12,
                  border: '2px solid var(--border)',
                  background: isHighlighted ? 'linear-gradient(135deg, var(--secondary), var(--accent))' : isSelected ? 'var(--surface-solid)' : 'var(--surface)',
                  cursor: phase === 'play' ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  outline: 'none',
                  padding: 0,
                  boxShadow: isHighlighted ? '0 0 20px rgba(0,184,212,0.4)' : 'none',
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default GridRecallGame
