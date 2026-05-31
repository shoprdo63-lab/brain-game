import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const SHOP_ITEMS = [
  {
    id: 'proMode',
    name: 'מצב מקצועי',
    desc: 'משחקים במצב קשה יותר עם נקודות בונוס',
    cost: 500,
    icon: '🏆',
    color: 'var(--warning)',
  },
  {
    id: 'extraTime',
    name: 'זמן נוסף',
    desc: '+10 שניות בכל משחק עם הגבלת זמן',
    cost: 300,
    icon: '⏱️',
    color: 'var(--secondary)',
  },
  {
    id: 'themeNeon',
    name: 'ערכת ניאון',
    desc: 'צבעים זוהרים ואפקטים מיוחדים למשחקים',
    cost: 800,
    icon: '🌈',
    color: '#E040FB',
  },
  {
    id: 'hints',
    name: 'רמזים',
    desc: 'קבל רמז אחד בכל שלב במשחקי זיכרון',
    cost: 400,
    icon: '💡',
    color: '#FFD600',
  },
  {
    id: 'gameTyping',
    name: 'משחק הקלדה מהירה',
    desc: 'פתח משחק חדש — הקלד מילים במהירות',
    cost: 600,
    icon: '⌨️',
    color: '#00E5FF',
  },
  {
    id: 'gameGridRecall',
    name: 'משחק זיכרון רשת',
    desc: 'פתח משחק חדש — זכור תאים בהירים ברשת',
    cost: 600,
    icon: '📐',
    color: '#69F0AE',
  },
  {
    id: 'gameColorMatch',
    name: 'משחק התאמת צבעים',
    desc: 'פתח משחק חדש — לחץ כשצבע המילה תואם',
    cost: 500,
    icon: '🎨',
    color: '#FF4081',
  },
  {
    id: 'gameAimTrainer',
    name: 'אימון מיקוד',
    desc: 'פתח משחק חדש — לחץ על מטרות נעות במהירות',
    cost: 700,
    icon: '🎯',
    color: '#FF6B35',
  },
  {
    id: 'gameWordScramble',
    name: 'פיענוח מילים',
    desc: 'פתח משחק חדש — סדר אותיות מבולבלות למילים נכונות',
    cost: 600,
    icon: '📝',
    color: '#AB47BC',
  },
  {
    id: 'gameNBack',
    name: 'N-Back',
    desc: 'פתח משחק חדש — זיכרון עבודה מחקרי קלאסי',
    cost: 800,
    icon: '🔄',
    color: '#00897B',
  },
  {
    id: 'gameChimpTest',
    name: 'מבחן השימפנזה',
    desc: 'פתח משחק חדש — זכור מיקומי מספרים שנעלמים',
    cost: 750,
    icon: '🐵',
    color: '#6D4C41',
  },
  {
    id: 'gameOddOneOut',
    name: 'מצא את השונה',
    desc: 'פתח משחק חדש — זהה את הצבע השונה ברשת',
    cost: 550,
    icon: '🔍',
    color: '#C62828',
  },
  {
    id: 'gameFocusGrid',
    name: 'רשת הקשב',
    desc: 'פתח משחק חדש — זכור תאים בהירים ולחץ רק עליהם',
    cost: 650,
    icon: '🔵',
    color: '#1565C0',
  },
  {
    id: 'gameReflexChallenge',
    name: 'אתגר הרפלקסים',
    desc: 'פתח משחק חדש — החלט במהירות אם צבע זהה למטרה',
    cost: 500,
    icon: '⚡',
    color: '#F57F17',
  },
  {
    id: 'gameSpeedMatch',
    name: 'התאמה מהירה',
    desc: 'פתח משחק חדש — האם הצורה הנוכחית זהה לקודמת?',
    cost: 550,
    icon: '🎴',
    color: '#AD1457',
  },
]

function ShopPage() {
  const { userData, purchase } = useUser()
  const [message, setMessage] = useState('')

  if (!userData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>טוען...</p>
      </div>
    )
  }

  const handlePurchase = async (item) => {
    const unlocks = userData.unlocks || {}
    const points = userData.points ?? 0
    if (unlocks[item.id]) {
      setMessage(`${item.name} כבר רכושת!`)
      return
    }
    if (points < item.cost) {
      setMessage('אין מספיק נקודות — שחק כדי לצבור עוד!')
      return
    }
    const ok = await purchase(item.id, item.cost)
    if (ok) {
      setMessage(`רכשת בהצלחה: ${item.name}!`)
    } else {
      setMessage('הרכישה נכשלה. נסה שוב.')
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>חנות נקודות</h2>
        <p style={{ color: 'var(--text-secondary)' }}>צבור נקודות במשחקים ופתח תכונות ומשחקים חדשים</p>
        <div style={{ marginTop: 16, display: 'inline-block', background: 'var(--surface)', padding: '12px 28px', borderRadius: 14, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>נקודות זמינות: </span>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{userData.points ?? userData.points ?? 0}</span>
        </div>
      </div>

      {message && (
        <div
          style={{
            background: message.includes('רכשת') ? 'rgba(0,200,83,0.15)' : 'rgba(255,214,0,0.15)',
            border: `1px solid ${message.includes('רכשת') ? 'rgba(0,200,83,0.3)' : 'rgba(255,214,0,0.3)'}`,
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 24,
            textAlign: 'center',
            color: message.includes('רכשת') ? '#69f0ae' : '#FFD600',
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {SHOP_ITEMS.map(item => {
          const unlocks = userData.unlocks || {}
          const points = userData.points ?? 0
          const unlocked = unlocks[item.id]
          const canAfford = points >= item.cost
          return (
            <div
              key={item.id}
              style={{
                background: 'var(--surface)',
                borderRadius: 16,
                border: unlocked ? '2px solid var(--success)' : '1px solid var(--border)',
                padding: 24,
                opacity: unlocked ? 0.7 : 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{item.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, flex: 1 }}>{item.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.cost} ⭐</span>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={unlocked || !canAfford}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: unlocked ? 'var(--success)' : canAfford ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'var(--surface-solid)',
                    color: 'white',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: unlocked || !canAfford ? 'not-allowed' : 'pointer',
                    opacity: unlocked || !canAfford ? 0.6 : 1,
                  }}
                >
                  {unlocked ? 'נרכש' : canAfford ? 'רכוש' : 'חסרות נקודות'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to="/profile" className="restart-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>לפרופיל</Link>
      </div>
    </div>
  )
}

export default ShopPage
