import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { supabase } from '../supabase'
import { Link } from 'react-router-dom'

function getBg(isMe, rank) {
  if (isMe) return 'rgba(255,107,53,0.1)'
  if (rank <= 3) return 'rgba(255,255,255,0.03)'
  return 'var(--surface)'
}
function getBorder(isMe) {
  if (isMe) return '1px solid rgba(255,107,53,0.3)'
  return '1px solid var(--border)'
}
function getMedalEmoji(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}
function getMedalColor(rank) {
  if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)'
  if (rank === 2) return 'linear-gradient(135deg, #C0C0C0, #E8E8E8)'
  if (rank === 3) return 'linear-gradient(135deg, #CD7F32, #E8A87C)'
  return 'var(--surface)'
}
function getHighScoreTotal(highScores) {
  if (!highScores) return 0
  return Object.values(highScores).reduce((sum, s) => sum + (Number(s) || 0), 0)
}

function DashboardPage() {
  const { sessionUser } = useUser()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('points')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy])

  async function fetchLeaderboard() {
    if (!supabase) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, points, total_games_played, high_scores, created_at')
        .order(sortBy === 'points' ? 'points' : 'total_games_played', { ascending: false })
        .limit(100)

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'points') return (b.points || 0) - (a.points || 0)
    if (sortBy === 'games') return (b.total_games_played || 0) - (a.total_games_played || 0)
    if (sortBy === 'highscore') return getHighScoreTotal(b.high_scores) - getHighScoreTotal(a.high_scores)
    return 0
  })

  const currentUserId = sessionUser?.id
  const myRank = sortedUsers.findIndex(u => u.id === currentUserId) + 1

  return (
    <div style={{ padding: '40px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>🏆 לוח המנהיגים</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>השחקנים הטובים ביותר בדע</p>
        {myRank > 0 && (
          <div style={{ marginTop: 16, display: 'inline-block', padding: '8px 20px', borderRadius: 14, background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>הדירוג שלך: #{myRank}</span>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: 'rgba(244,67,54,0.15)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: '#ff8a80', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { key: 'points', label: 'נקודות' },
          { key: 'games', label: 'משחקים' },
          { key: 'highscore', label: 'שיאים' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={sortBy === opt.key ? 'cat-chip active' : 'cat-chip'}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: sortBy === opt.key ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--surface)',
              color: sortBy === opt.key ? 'white' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div className="shimmer" style={{ width: '100%', height: 60, marginBottom: 12 }} />
          <div className="shimmer" style={{ width: '100%', height: 60, marginBottom: 12 }} />
          <div className="shimmer" style={{ width: '100%', height: 60, marginBottom: 12 }} />
          <div className="shimmer" style={{ width: '100%', height: 60, marginBottom: 12 }} />
          <div className="shimmer" style={{ width: '100%', height: 60 }} />
        </div>
      ) : sortedUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h3>אין עדיין נתונים</h3>
          <p>היה הראשון לשחק ולהיכנס ללוח!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sortedUsers.slice(0, 50).map((u, idx) => {
            const rank = idx + 1
            const isMe = u.id === currentUserId
            const totalHs = getHighScoreTotal(u.high_scores)
            return (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  borderRadius: 16,
                  background: getBg(isMe, rank),
                  border: getBorder(isMe),
                  transition: 'all 0.2s',
                  animation: `fadeInUp 0.4s ease ${idx * 0.03}s both`,
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: getMedalColor(rank),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: rank <= 3 ? 20 : 13,
                  flexShrink: 0,
                  boxShadow: rank <= 3 ? '0 4px 16px rgba(0,0,0,0.3)' : 'none',
                }}>
                  {rank <= 3 ? getMedalEmoji(rank) : rank}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {u.display_name || 'משתמש'}
                    {isMe && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'var(--primary)', color: 'white', fontWeight: 700 }}>אתה</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {u.total_games_played || 0} משחקים
                  </div>
                </div>

                <div style={{ textAlign: 'left', direction: 'ltr' }}>
                  <div style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {(u.points || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>נקודות</div>
                </div>

                <div style={{ textAlign: 'left', direction: 'ltr', minWidth: 60 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{totalHs.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>שיא</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link to="/games" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 15 }}>
          ← חזרה למשחקים
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
