import { useState, useCallback, useEffect, useRef } from 'react'

function NumberMemoryGame() {
  const [phase, setPhase] = useState('idle')
  const [sequence, setSequence] = useState('')
  const [input, setInput] = useState('')
  const [level, setLevel] = useState(1)
  const [highLevel, setHighLevel] = useState(() => Number.parseInt(localStorage.getItem('numberMemoryHighLevel')) || 0)
  const [showing, setShowing] = useState(false)
  const timeoutsRef = useRef([])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [])

  const generateNumber = (digits) => {
    let num = ''
    for (let i = 0; i < digits; i++) num += Math.floor(Math.random() * 10)
    return num
  }

  const startGame = useCallback(() => {
    setLevel(1)
    setInput('')
    showNumber(1)
  }, [])

  const showNumber = useCallback((lvl) => {
    setPhase('watch')
    setInput('')
    const num = generateNumber(lvl + 2)
    setSequence(num)
    setShowing(true)
    const displayTime = Math.min(1000 + lvl * 400, 5000)
    const t = setTimeout(() => {
      if (!mountedRef.current) return
      setShowing(false)
      setPhase('play')
    }, displayTime)
    timeoutsRef.current.push(t)
  }, [])

  const submitAnswer = useCallback(() => {
    if (phase !== 'play') return

    if (input === sequence) {
      if (level > highLevel) {
        setHighLevel(level)
        localStorage.setItem('numberMemoryHighLevel', level.toString())
      }
      const nextLevel = level + 1
      setLevel(nextLevel)
      setPhase('watch')
      const t = setTimeout(() => showNumber(nextLevel), 600)
      timeoutsRef.current.push(t)
    } else {
      setPhase('gameover')
    }
  }, [phase, input, sequence, level, highLevel, showNumber])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') submitAnswer()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [submitAnswer])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>זיכרון מספרים</h2>
        <p style={{ color: 'var(--text-secondary)' }}>זכור את המספר שמופיע — ככל שתתקדם, המספרים יתארכו</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שלב</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{level}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>תווים</p>
          <p style={{ fontSize: 22, fontWeight: 700 }}>{level + 2}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שיא שלב</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>{highLevel}</p>
        </div>
      </div>

      {phase === 'idle' && (
        <button className="restart-btn" onClick={startGame} style={{ fontSize: 18, padding: '16px 48px' }}>
          התחל משחק
        </button>
      )}

      {phase === 'gameover' && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>נגמר!</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>המספר היה: {sequence}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>הגעת לשלב {level} ({level + 2} ספרות)</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>שיא: {highLevel} ({highLevel + 2} ספרות)</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {(phase === 'watch' || phase === 'play') && (
        <div style={{ textAlign: 'center', width: 'min(400px, 90vw)' }}>
          {showing ? (
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: 8,
                color: 'var(--text)',
                marginBottom: 32,
                minHeight: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                direction: 'ltr',
              }}
            >
              {sequence}
            </div>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                value={input}
                onChange={e => setInput(e.target.value.replace(/\D/g, ''))}
                placeholder="הקלד את המספר..."
                autoFocus
                style={{
                  fontSize: 32,
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
                  direction: 'ltr',
                }}
              />
              <button className="restart-btn" onClick={submitAnswer} style={{ fontSize: 16, padding: '12px 32px' }}>
                שלח (Enter)
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default NumberMemoryGame
