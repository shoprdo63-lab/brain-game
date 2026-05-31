import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, login, loginWithGoogle, ensureGuest } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await register(email, password, displayName)
      } else {
        await login(email, password)
      }
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'שגיאה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = () => {
    ensureGuest()
    navigate('/profile')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ width: 'min(400px, 90vw)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
            {mode === 'login' ? 'התחברות' : 'הרשמה'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'התחבר כדי לשמור נקודות ולהתקדם' : 'צור חשבון חדש והתחל לצבור נקודות'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244,67,54,0.15)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#ff8a80', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>שם תצוגה</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="השם שלך במשחק"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: '2px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: 16,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>אימייל</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 12,
                border: '2px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 16,
                fontFamily: 'inherit',
                outline: 'none',
                direction: 'ltr',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 12,
                border: '2px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 16,
                fontFamily: 'inherit',
                outline: 'none',
                direction: 'ltr',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="restart-btn"
            style={{ width: '100%', fontSize: 16, padding: '14px 0', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'טוען...' : mode === 'login' ? 'התחבר' : 'צור חשבון'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={async () => {
              try { await loginWithGoogle() } catch (err) { setError(err.message) }
            }}
            style={{
              width: '100%',
              padding: '12px 0',
              borderRadius: 12,
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'inherit',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>G</span> התחבר עם Google
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {mode === 'login' ? 'אין חשבון? הירשם' : 'יש חשבון? התחבר'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={handleGuest}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            המשך כאורח
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
