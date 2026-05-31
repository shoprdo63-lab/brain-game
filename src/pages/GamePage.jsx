import { useState, useEffect, useRef, useCallback } from 'react'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateBoard(size) {
  return shuffleArray(Array.from({ length: size * size }, (_, i) => i + 1))
}

function SidePanel({ size, onSizeChange, gamesPlayed, bestTime }) {
  const sizes = [3, 4, 5, 6, 7, 8, 9]
  const bt = bestTime[size] || '-'
  const gp = gamesPlayed[size] || 0

  return (
    <div className="game-sidebar">
      <div className="sidebar-title">
        <p className="label">דע</p>
        <p className="sub">שולטה טייבל — אימון ראייה פריפרית</p>
      </div>
      <div className="grid-size-section">
        <p className="grid-size-title">גודל רשת</p>
        {sizes.map(s => (
          <button
            key={s}
            className={`size-btn${size === s ? ' active' : ''}`}
            onClick={() => onSizeChange(s)}
          >
            {s}x{s}
          </button>
        ))}
      </div>
      <div className="sidebar-divider" />
      <div className="stats-section">
        <div>
          <p className="stat-title">זמן מיטבי</p>
          <p className="stat-value">{bt === '-' ? '-' : (bt / 100).toFixed(2) + 's'}</p>
        </div>
        <div>
          <p className="stat-title">משחקים</p>
          <p className="stat-value">{gp}</p>
        </div>
      </div>
    </div>
  )
}

function Board({ boardValues, size, gameWidth, next, done, onCellClick, wrongCell }) {
  const cellSize = gameWidth / size
  const fontSize = cellSize * 0.4

  return (
    <div
      className="board-container"
      style={{
        width: gameWidth,
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {boardValues.map(val => {
        let className = 'cell'
        if (done) className += ' disabled'
        else if (val < next) className += ' correct'
        else if (val === wrongCell) className += ' wrong'
        return (
          <button
            key={val}
            className={className}
            style={{
              width: cellSize,
              height: cellSize,
              fontSize: Math.min(fontSize, 28),
              border: 'none',
              outline: 'none',
            }}
            onClick={() => !done && onCellClick(val)}
            disabled={done}
          >
            {val}
          </button>
        )
      })}
    </div>
  )
}

function VictoryModal({ time, onRestart }) {
  return (
    <div className="victory-overlay" role="dialog" aria-modal="true">
      <div className="victory-card">
        <h2>כל הכבוד!</h2>
        <p>סיימת את האימון בהצלחה</p>
        <div className="time-display">{(time / 100).toFixed(2)}s</div>
        <p>המוח שלך עשה עבודה מעולה! כל אימון מחזק את החיבורים הנוירוניים שלך.</p>
        <button type="button" className="restart-btn" onClick={onRestart}>שחק שוב</button>
      </div>
    </div>
  )
}

function GamePage() {
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem('lastSize')
    return saved ? Number.parseInt(saved) : 5
  })
  const [boardValues, setBoardValues] = useState(() => generateBoard(5))
  const [next, setNext] = useState(1)
  const [time, setTime] = useState(0)
  const [timeRunning, setTimeRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [wrongCell, setWrongCell] = useState(null)
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
  const timerRef = useRef(null)
  const gameAreaRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const loadDefaultState = useCallback((newSize = size) => {
    clearInterval(timerRef.current)
    setNext(1)
    setTime(0)
    setTimeRunning(false)
    setDone(false)
    setWrongCell(null)
    setBoardValues(generateBoard(newSize))
  }, [size])

  const handleSizeChange = useCallback((newSize) => {
    localStorage.setItem('lastSize', newSize)
    setSize(newSize)
    loadDefaultState(newSize)
    setBoardValues(generateBoard(newSize))
  }, [loadDefaultState])

  const saveStats = useCallback((finalSize, finalTime) => {
    const keyGames = `gamesPlayed${finalSize}`
    const keyBest = `bestTime${finalSize}`
    const currentGames = Number.parseInt(localStorage.getItem(keyGames)) || 0
    localStorage.setItem(keyGames, currentGames + 1)
    const currentBest = Number.parseInt(localStorage.getItem(keyBest))
    if (!currentBest || currentBest > finalTime) {
      localStorage.setItem(keyBest, finalTime)
    }
  }, [])

  const handleCellClick = useCallback((val) => {
    if (done) return

    if (val === next) {
      if (val === size * size) {
        clearInterval(timerRef.current)
        setDone(true)
        setTimeRunning(false)
        setNext(val + 1)
        saveStats(size, time)
      } else {
        setNext(val + 1)
      }

      if (!timeRunning) {
        setTimeRunning(true)
        timerRef.current = setInterval(() => {
          setTime(t => t + 1)
        }, 10)
      }
    } else if (val >= next) {
      setWrongCell(val)
      setTimeout(() => setWrongCell(null), 400)
      if (!timeRunning) {
        setTimeRunning(true)
        timerRef.current = setInterval(() => {
          setTime(t => t + 1)
        }, 10)
      }
    }
  }, [next, size, done, timeRunning, time, saveStats])

  const handleRestart = useCallback(() => {
    loadDefaultState(size)
  }, [loadDefaultState, size])

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    loadDefaultState(size)
  }, [size])

  const sidebarWidth = dimensions.width > 768 ? 220 : 0
  let gameWidth = dimensions.width - sidebarWidth - 128
  if (gameWidth < 280) gameWidth = 280
  if (gameWidth > 420) gameWidth = 420

  const bestTime = {}
  const gamesPlayed = {}
  for (let s = 3; s <= 9; s++) {
    bestTime[s] = localStorage.getItem(`bestTime${s}`)
    gamesPlayed[s] = localStorage.getItem(`gamesPlayed${s}`)
  }

  return (
    <div className="game-page">
      {dimensions.width > 768 && (
        <SidePanel
          size={size}
          onSizeChange={handleSizeChange}
          bestTime={bestTime}
          gamesPlayed={gamesPlayed}
        />
      )}
      <div className="game-area" ref={gameAreaRef}>
        {dimensions.width <= 768 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[3,4,5,6,7,8,9].map(s => (
              <button
                key={s}
                className={`size-btn${size === s ? ' active' : ''}`}
                onClick={() => handleSizeChange(s)}
                style={{ width: 'auto', padding: '6px 14px' }}
              >
                {s}x{s}
              </button>
            ))}
          </div>
        )}
        <div className="game-top-bar" style={{ width: gameWidth }}>
          <p>הבא: <span className="next-val">{Math.min(next, size * size)}</span></p>
          <p className="timer">{(time / 100).toFixed(2)}</p>
        </div>
        <Board
          boardValues={boardValues}
          size={size}
          gameWidth={gameWidth}
          next={next}
          done={done}
          onCellClick={handleCellClick}
          wrongCell={wrongCell}
        />
        <p className="game-desc">
          לחץ על המספרים מ-1 עד {size * size} בסדר עולה
        </p>
        <button className="restart-btn" onClick={handleRestart}>
          התחל מחדש
        </button>
      </div>
      {done && (
        <VictoryModal time={time} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default GamePage
