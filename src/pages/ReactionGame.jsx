import { useState, useRef, useCallback } from 'react'

const PHASE = {
  READY: 'ready',
  WAITING: 'waiting',
  GO: 'go',
  RESULT: 'result',
  TOO_EARLY: 'too_early',
}

function ReactionGame() {
  const [phase, setPhase] = useState(PHASE.READY)
  const [time, setTime] = useState(0)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('reactionHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [round, setRound] = useState(0)
  const timerRef = useRef(null)
  const startTimeRef = useRef(0)

  const startRound = useCallback(() => {
    setPhase(PHASE.WAITING)
    setTime(0)
    const delay = 1500 + Math.random() * 2500
    timerRef.current = setTimeout(() => {
      setPhase(PHASE.GO)
      startTimeRef.current = performance.now()
    }, delay)
  }, [])

  const handleClick = useCallback(() => {
    if (phase === PHASE.READY) {
      startRound()
    } else if (phase === PHASE.WAITING) {
      clearTimeout(timerRef.current)
      setPhase(PHASE.TOO_EARLY)
    } else if (phase === PHASE.GO) {
      const reaction = Math.round(performance.now() - startTimeRef.current)
      setTime(reaction)
      const newHistory = [...history, reaction]
      if (newHistory.length > 10) newHistory.shift()
      setHistory(newHistory)
      localStorage.setItem('reactionHistory', JSON.stringify(newHistory))
      setRound(r => r + 1)
      setPhase(PHASE.RESULT)
    } else if (phase === PHASE.RESULT || phase === PHASE.TOO_EARLY) {
      if (round >= 4) {
        setPhase(PHASE.READY)
        setRound(0)
      } else {
        startRound()
      }
    }
  }, [phase, history, round, startRound])

  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0
  const best = history.length > 0 ? Math.min(...history) : 0

  const getBg = () => {
    switch (phase) {
      case PHASE.READY: return 'linear-gradient(135deg, #1e293b, #0f172a)'
      case PHASE.WAITING: return 'linear-gradient(135deg, #b91c1c, #7f1d1d)'
      case PHASE.GO: return 'linear-gradient(135deg, #15803d, #14532d)'
      case PHASE.RESULT: return 'linear-gradient(135deg, #1e293b, #0f172a)'
      case PHASE.TOO_EARLY: return 'linear-gradient(135deg, #7c2d12, #451a03)'
    }
  }

  const getMessage = () => {
    switch (phase) {
      case PHASE.READY: return 'לחץ כדי להתחיל'
      case PHASE.WAITING: return 'חכה לירוק...'
      case PHASE.GO: return 'לחץ עכשיו!'
      case PHASE.RESULT: return `${time}ms`
      case PHASE.TOO_EARLY: return 'מוקדם מדי!'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>מהירות תגובה</h2>
        <p style={{ color: 'var(--text-secondary)' }}>סבב {Math.min(round + 1, 5)} מתוך 5</p>
      </div>

      <button
        onClick={handleClick}
        style={{
          width: 'min(400px, 90vw)',
          height: 'min(400px, 90vw)',
          borderRadius: 24,
          background: getBg(),
          border: `2px solid ${phase === PHASE.GO ? 'rgba(0,200,83,0.5)' : 'var(--border)'}`,
          boxShadow: phase === PHASE.GO ? '0 0 60px rgba(0,200,83,0.3)' : 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
          transform: phase === PHASE.GO ? 'scale(1.02)' : 'scale(1)',
          color: 'white',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      >
        <span style={{ fontSize: 52, fontWeight: 800, marginBottom: 12 }}>{getMessage()}</span>
        {phase === PHASE.RESULT && (
          <span style={{ fontSize: 16, opacity: 0.8 }}>
            {time < 200 ? 'מדהים!' : time < 300 ? 'מהיר!' : time < 400 ? 'טוב' : 'תרגל עוד'}
          </span>
        )}
        {phase === PHASE.TOO_EARLY && (
          <span style={{ fontSize: 16, opacity: 0.8 }}>לחץ שוב כדי לנסות</span>
        )}
      </button>

      {history.length > 0 && (
        <div style={{ marginTop: 40, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '20px 32px', borderRadius: 16, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>ממוצע</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{avg}ms</p>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '20px 32px', borderRadius: 16, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>שיא</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>{best}ms</p>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '20px 32px', borderRadius: 16, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>נסיונות</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>{history.length}</p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {history.map((t, i) => (
            <div
              key={i}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                background: t === best ? 'rgba(0,200,83,0.15)' : 'var(--surface)',
                border: `1px solid ${t === best ? 'rgba(0,200,83,0.3)' : 'var(--border)'}`,
                fontSize: 14,
                fontWeight: 600,
                color: t === best ? '#69f0ae' : 'var(--text)',
              }}
            >
              {t}ms
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReactionGame
