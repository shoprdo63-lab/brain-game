import { useState, useCallback, useEffect, useRef } from 'react'

const ICONS = ['🧠', '⚡', '🎯', '🔥', '🌟', '💎', '🚀', '🎵', '🍀', '🌈', '🦋', '🎲']

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function MemoryGame() {
  const [phase, setPhase] = useState('idle')
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('memoryHighScore')) || 0)
  const [gridSize, setGridSize] = useState(16)
  const timerRef = useRef(null)
  const lockRef = useRef(false)

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const startGame = useCallback((size) => {
    const pairs = size / 2
    const selected = ICONS.slice(0, pairs)
    const deck = shuffle([...selected, ...selected])
    setCards(deck.map((icon, i) => ({ id: i, icon })))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTime(0)
    setPhase('playing')
    setGridSize(size)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
  }, [])

  const handleCardClick = useCallback((cardId) => {
    if (lockRef.current) return
    if (flipped.includes(cardId)) return
    if (matched.includes(cardId)) return
    if (flipped.length >= 2) return

    const newFlipped = [...flipped, cardId]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      if (cards[first].icon === cards[second].icon) {
        setMatched(m => [...m, first, second])
        setFlipped([])
      } else {
        lockRef.current = true
        setTimeout(() => {
          setFlipped([])
          lockRef.current = false
        }, 800)
      }
    }
  }, [flipped, matched, cards])

  useEffect(() => {
    if (matched.length === gridSize && phase === 'playing') {
      clearInterval(timerRef.current)
      const score = Math.max(0, 1000 - moves * 20 - time * 5)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('memoryHighScore', score.toString())
      }
      setPhase('over')
    }
  }, [matched, gridSize, phase, moves, time, highScore])

  const cols = gridSize === 12 ? 4 : gridSize === 20 ? 5 : 4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>זיכרון זוגות</h2>
        <p style={{ color: 'var(--text-secondary)' }}>חפש זוגות מתאימים בכמה שפחות מהלכים</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>מהלכים</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{moves}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>זמן</p>
          <p style={{ fontSize: 22, fontWeight: 700 }}>{time}s</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שיא</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>{highScore}</p>
        </div>
      </div>

      {phase === 'idle' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>בחר רמת קושי:</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="restart-btn" onClick={() => startGame(12)} style={{ fontSize: 16 }}>קל (12 כרטיסים)</button>
            <button className="restart-btn" onClick={() => startGame(16)} style={{ fontSize: 16 }}>בינוני (16 כרטיסים)</button>
            <button className="restart-btn" onClick={() => startGame(20)} style={{ fontSize: 16 }}>קשה (20 כרטיסים)</button>
          </div>
        </div>
      )}

      {phase === 'over' && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>כל הכבוד!</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{moves} מהלכים | {time} שניות</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highScore}</p>
          <button className="restart-btn" onClick={() => setPhase('idle')}>שחק שוב</button>
        </div>
      )}

      {phase === 'playing' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 12,
            maxWidth: cols === 5 ? 500 : 420,
            width: '100%',
          }}
        >
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(i)
            const isMatched = matched.includes(i)
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleCardClick(i)}
                disabled={isFlipped}
                style={{
                  aspectRatio: '1',
                  borderRadius: 16,
                  border: isMatched ? '2px solid var(--success)' : '2px solid var(--border)',
                  background: isFlipped ? 'var(--surface-solid)' : 'linear-gradient(135deg, rgba(124,77,255,0.3), rgba(0,184,212,0.3))',
                  cursor: isFlipped ? 'default' : 'pointer',
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
                  opacity: isMatched ? 0.6 : 1,
                  outline: 'none',
                  padding: 0,
                }}
              >
                {isFlipped ? card.icon : '❓'}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MemoryGame
