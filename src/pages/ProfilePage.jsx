import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function ProfilePage() {
  const { user, userData, isGuest, logout, loading, ensureGuest } = useUser()

  useEffect(() => {
    if (!loading && !userData) {
      ensureGuest()
    }
  }, [loading, userData, ensureGuest])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>טוען...</p>
      </div>
    )
  }

  if (!userData) return null

  const highScores = userData.highScores || {}
  const games = [
    { key: 'schulte', name: 'שולטה טייבל' },
    { key: 'reaction', name: 'מהירות תגובה' },
    { key: 'sequence', name: 'זיכרון סדר' },
    { key: 'math', name: 'חישוב מהיר' },
    { key: 'stroop', name: 'מבחן סטרופ' },
    { key: 'memory', name: 'זיכרון זוגות' },
    { key: 'pattern', name: 'זיכרון תבניות' },
    { key: 'numbers', name: 'זיכרון מספרים' },
  ]

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 16px',
            boxShadow: 'var(--glow-primary)',
          }}
        >
          {userData.displayName?.[0] || '👤'}
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{userData.displayName}</h2>
        {userData.email && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{userData.email}</p>}
        {isGuest && <p style={{ color: 'var(--warning)', fontSize: 13, marginTop: 4 }}>מצב אורח — התחבר כדי לשמור נתונים בענן</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>נקודות</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{userData.points || 0}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>משחקים</p>
          <p style={{ fontSize: 32, fontWeight: 800 }}>{userData.totalGamesPlayed || 0}</p>
        </div>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 16, border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>שיאים</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--success)' }}>{Object.keys(highScores).length}</p>
        </div>
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>שיאים לפי משחק</h3>
      <div style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
        {games.map(g => (
          <div key={g.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '14px 20px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600 }}>{g.name}</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}>{highScores[g.key] || 0}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/shop" className="restart-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>חנות נקודות</Link>
        <Link to="/games" className="restart-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', background: 'var(--surface)', color: 'var(--text)' }}>למשחקים</Link>
        {user && (
          <button className="restart-btn" onClick={logout} style={{ background: 'rgba(244,67,54,0.2)', color: '#ff8a80' }}>
            התנתק
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
