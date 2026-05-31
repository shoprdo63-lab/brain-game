import { useState, useCallback, useRef } from 'react'
import { useUser } from '../context/UserContext'

function ChimpTestGame() {
  const { addPoints } = useUser()
  const [phase, setPhase] = useState('idle')
  const [numbers, setNumbers] = useState([])
  const [visible, setVisible] = useState(true)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [nextNum, setNextNum] = useState(1)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('chimpHighScore')) || 0)
  const timeoutsRef = useRef([])

  const startLevel = useCallback((lvl) => {
    const count = 3 + lvl
    const cells = []
    while (cells.length < count) {
      const pos = Math.floor(Math.random() * 25)
      if (!cells.some(c => c.pos === pos)) {
        cells.push({ pos, val: cells.length + 1 })
      }
    }
    setNumbers(cells)
    setVisible(true)
    setNextNum(1)
    setPhase('watch')

    const t = setTimeout(() => {
      setVisible(false)
      setPhase('play')
    }, 1000 + lvl * 200)
    timeoutsRef.current.push(t)
  }, [])

  const startGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    startLevel(1)
  }, [startLevel])

  const handleCellClick = useCallback((val) => {
    if (phase !== 'play') return
    if (val !== nextNum) {
      setPhase('over')
      addPoints(Math.max(10, score), 'chimp', score)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('chimpHighScore', score.toString())
      }
      return
    }
    if (val === numbers.length) {
      const pts = level * 50
      const newScore = score + pts
      setScore(newScore)
      const nextLevel = level + 1
      setLevel(nextLevel)
      setPhase('watch')
      const t = setTimeout(() => startLevel(nextLevel), 500)
      timeoutsRef.current.push(t)
    } else {
      setNextNum(val + 1)
    }
  }, [phase, nextNum, numbers, level, score, highScore, startLevel, addPoints])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>מבחן השימפנזה</h2>
        <p style={{ color: 'var(--text-secondary)' }}>זכור את המיקומים של המספרים ולחץ עליהם בסדר עולה</p>
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
        <button className="restart-btn" onClick={startGame} style={{ fontSize: 18, padding: '16px 48px' }}>התחל משחק</button>
      )}

      {phase === 'over' && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>נגמר!</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>הגעת לשלב {level} | {score} נקודות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {(phase === 'watch' || phase === 'play') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, maxWidth: 380, width: '100%' }}>
          {Array.from({ length: 25 }).map((_, i) => {
            const cell = numbers.find(n => n.pos === i)
            const showVal = visible || (cell && cell.val < nextNum)
            return (
              <button
                key={`chimp-${i}`}
                type="button"
                onClick={() => cell && handleCellClick(cell.val)}
                disabled={!cell || phase === 'watch'}
                style={{
                  aspectRatio: '1',
                  borderRadius: 10,
                  border: '2px solid var(--border)',
                  background: cell ? (showVal ? 'var(--surface-solid)' : 'var(--surface)') : 'transparent',
                  cursor: cell && phase === 'play' ? 'pointer' : 'default',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text)',
                  outline: 'none',
                  padding: 0,
                }}
              >
                {cell && showVal ? cell.val : ''}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ChimpTestGame
