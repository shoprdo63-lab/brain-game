import { useState, useCallback, useRef, useEffect } from 'react'

const COLORS = [
  { id: 0, color: '#FF6B35', glow: 'rgba(255,107,53,0.5)', name: 'כתום' },
  { id: 1, color: '#00B8D4', glow: 'rgba(0,184,212,0.5)', name: 'טורקיז' },
  { id: 2, color: '#7C4DFF', glow: 'rgba(124,77,255,0.5)', name: 'סגול' },
  { id: 3, color: '#00C853', glow: 'rgba(0,200,83,0.5)', name: 'ירוק' },
]

function SequenceGame() {
  const [sequence, setSequence] = useState([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [activeColor, setActiveColor] = useState(null)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number.parseInt(localStorage.getItem('sequenceHighScore')) || 0)
  const [showing, setShowing] = useState(false)
  const timeoutRef = useRef(null)

  const playTone = useCallback((freq, duration = 200) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
      osc.start()
      osc.stop(ctx.currentTime + duration / 1000)
    } catch { /* ignore audio errors */ }
  }, [])

  const flashColor = useCallback((colorId, duration = 400) => {
    setActiveColor(colorId)
    playTone(300 + colorId * 150, duration)
    timeoutRef.current = setTimeout(() => setActiveColor(null), duration)
  }, [playTone])

  const showSequence = useCallback(async (seq) => {
    setShowing(true)
    setPhase('watch')
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      flashColor(seq[i], 350)
      await new Promise(r => setTimeout(r, 350))
    }
    setShowing(false)
    setPhase('play')
    setPlayerIndex(0)
  }, [flashColor])

  const startGame = useCallback(() => {
    const newSeq = [Math.floor(Math.random() * 4)]
    setSequence(newSeq)
    setLevel(1)
    setScore(0)
    setPhase('watch')
    setTimeout(() => showSequence(newSeq), 500)
  }, [showSequence])

  const handleColorClick = useCallback((colorId) => {
    if (phase !== 'play' || showing) return

    flashColor(colorId, 200)

    if (colorId === sequence[playerIndex]) {
      if (playerIndex + 1 === sequence.length) {
        const newScore = score + level * 10
        setScore(newScore)
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem('sequenceHighScore', newScore.toString())
        }
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)]
        setSequence(nextSeq)
        setLevel(l => l + 1)
        setPhase('watch')
        setTimeout(() => showSequence(nextSeq), 800)
      } else {
        setPlayerIndex(i => i + 1)
      }
    } else {
      setPhase('gameover')
      playTone(150, 500)
    }
  }, [phase, showing, sequence, playerIndex, score, level, highScore, flashColor, playTone, showSequence])

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>זיכרון סדר</h2>
        <p style={{ color: 'var(--text-secondary)' }}>חזור על הרצף. ככל שתתקדם — הרצף יתארך.</p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', padding: '12px 24px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שלב</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{level}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 24px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>נקודות</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{score}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '12px 24px', borderRadius: 14, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שיא</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>{highScore}</p>
        </div>
      </div>

      {phase === 'idle' && (
        <button className="restart-btn" onClick={startGame} style={{ fontSize: 18, padding: '16px 48px' }}>
          התחל משחק
        </button>
      )}

      {phase === 'gameover' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#ff8a80', marginBottom: 8 }}>טעות!</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>הגעת לשלב {level} עם {score} נקודות</p>
          <button className="restart-btn" onClick={startGame}>שחק שוב</button>
        </div>
      )}

      {(phase === 'watch' || phase === 'play') && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          width: 'min(320px, 80vw)',
          height: 'min(320px, 80vw)',
        }}>
          {COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => handleColorClick(c.id)}
              disabled={phase === 'watch'}
              style={{
                borderRadius: 20,
                border: 'none',
                outline: 'none',
                cursor: phase === 'watch' ? 'default' : 'pointer',
                background: activeColor === c.id ? c.color : `${c.color}30`,
                boxShadow: activeColor === c.id ? `0 0 40px ${c.glow}` : 'none',
                transition: 'all 0.15s',
                transform: activeColor === c.id ? 'scale(0.95)' : 'scale(1)',
                opacity: phase === 'watch' ? 0.6 : 1,
              }}
            />
          ))}
        </div>
      )}

      {phase === 'watch' && (
        <p style={{ marginTop: 24, color: 'var(--text-secondary)', fontSize: 16 }}>שמור על הרצף...</p>
      )}
      {phase === 'play' && (
        <p style={{ marginTop: 24, color: 'var(--text-secondary)', fontSize: 16 }}>תורך! חזור על הרצף</p>
      )}
    </div>
  )
}

export default SequenceGame
