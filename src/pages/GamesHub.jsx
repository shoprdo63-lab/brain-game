import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { miniGames } from '../data/miniGamesData'

const ALL_GAMES = [
  {
    id: 'schulte',
    name: 'שולטה טייבל',
    desc: 'מצא מספרים בסדר עולה ברשת אקראית. מאמן ראייה פריפרית, תשומת לב וקריאה מהירה.',
    icon: '🔢',
    color: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
    shadow: 'rgba(255,107,53,0.3)',
    skill: 'תשומת לב + ראייה פריפרית',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'reaction',
    name: 'מהירות תגובה',
    desc: 'לחץ במהירות המרבית כשהמסך משתנה צבע. מודד זמן תגובה במילישניות.',
    icon: '⚡',
    color: 'linear-gradient(135deg, #00B8D4, #00E5FF)',
    shadow: 'rgba(0,184,212,0.3)',
    skill: 'רפלקסים + עיבוד ויזואלי',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'sequence',
    name: 'זיכרון סדר',
    desc: 'זכור וחזור על רצף של צבעים וצלילים. משחק סימון סיימון מדעי.',
    icon: '🧩',
    color: 'linear-gradient(135deg, #7C4DFF, #B388FF)',
    shadow: 'rgba(124,77,255,0.3)',
    skill: 'זיכרון עבודה + דפוסים',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'math',
    name: 'חישוב מהיר',
    desc: 'פתור תרגילי חשבון תחת לחץ זמן. משפר יכולת עיבוד מספרי וזריזות חשיבה.',
    icon: '🧮',
    color: 'linear-gradient(135deg, #00C853, #69F0AE)',
    shadow: 'rgba(0,200,83,0.3)',
    skill: 'חישוב מנטלי + מהירות',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'stroop',
    name: 'מבחן סטרופ',
    desc: 'זהה את צבע הטקסט, לא את המילה. מודד שליטה עצמית וגמישות קוגניטיבית.',
    icon: '🎨',
    color: 'linear-gradient(135deg, #FF4081, #F8BBD0)',
    shadow: 'rgba(255,64,129,0.3)',
    skill: 'שליטה עצמית + התנגדות להפרעות',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'memory',
    name: 'זיכרון זוגות',
    desc: 'חפש זוגות כרטיסים זהים ברשת הפוכה. מפתח זיכרון ויזואלי וקשב.',
    icon: '🃏',
    color: 'linear-gradient(135deg, #9C27B0, #E1BEE7)',
    shadow: 'rgba(156,39,176,0.3)',
    skill: 'זיכרון ויזואלי + קשב',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'pattern',
    name: 'זיכרון תבניות',
    desc: 'זכור וחזור על רצף של נקודות בהירות. מפתח זיכרון סדר וזיכרון מרחבי.',
    icon: '🔲',
    color: 'linear-gradient(135deg, #FF9800, #FFCC80)',
    shadow: 'rgba(255,152,0,0.3)',
    skill: 'זיכרון מרחבי + סדר',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'numbers',
    name: 'זיכרון מספרים',
    desc: 'זכור מספר שמופיע לרגע והקלד אותו. מפתח זיכרון לטווח קצר וקיבולת ספרתית.',
    icon: '🔢',
    color: 'linear-gradient(135deg, #3F51B5, #C5CAE9)',
    shadow: 'rgba(63,81,181,0.3)',
    skill: 'זיכרון ספרתי + קיבולת',
    unlockKey: null,
    cost: 0,
  },
  {
    id: 'typing',
    name: 'הקלדה מהירה',
    desc: 'הקלד מילים במהירות ודיוק. מפתח קואורדינציה בין עין ליד ועיבוד ויזואלי.',
    icon: '⌨️',
    color: 'linear-gradient(135deg, #00E5FF, #80DEEA)',
    shadow: 'rgba(0,229,255,0.3)',
    skill: 'קואורדינציה + עיבוד ויזואלי',
    unlockKey: 'gameTyping',
    cost: 600,
  },
  {
    id: 'grid',
    name: 'זיכרון רשת',
    desc: 'זכור תאים בהירים ברשת והחזר עליהם. מפתח זיכרון מרחבי וקשב סלקטיבי.',
    icon: '📐',
    color: 'linear-gradient(135deg, #69F0AE, #B9F6CA)',
    shadow: 'rgba(105,240,174,0.3)',
    skill: 'זיכרון מרחבי + קשב',
    unlockKey: 'gameGridRecall',
    cost: 600,
  },
  {
    id: 'color',
    name: 'התאמת צבעים',
    desc: 'החלט במהירות אם המילה תואמת לצבע שלה. מודד שליטה עצמית ומהירות תגובה.',
    icon: '🎨',
    color: 'linear-gradient(135deg, #FF4081, #F8BBD0)',
    shadow: 'rgba(255,64,129,0.3)',
    skill: 'שליטה עצמית + מהירות',
    unlockKey: 'gameColorMatch',
    cost: 500,
  },
  {
    id: 'aim',
    name: 'אימון מיקוד',
    desc: 'לחץ על מטרות נעות במהירות. מפתח קואורדינציה עין-יד ורפלקסים.',
    icon: '🎯',
    color: 'linear-gradient(135deg, #FF6B35, #FFAB91)',
    shadow: 'rgba(255,107,53,0.3)',
    skill: 'קואורדינציה + רפלקסים',
    unlockKey: 'gameAimTrainer',
    cost: 700,
  },
  {
    id: 'word',
    name: 'פיענוח מילים',
    desc: 'סדר אותיות מבולבלות ליצירת מילים בעברית. מפתח זיהוי דפוסים ושפה.',
    icon: '📝',
    color: 'linear-gradient(135deg, #AB47BC, #CE93D8)',
    shadow: 'rgba(171,71,188,0.3)',
    skill: 'זיהוי דפוסים + שפה',
    unlockKey: 'gameWordScramble',
    cost: 600,
  },
  {
    id: 'nback',
    name: 'N-Back',
    desc: 'זכור צורות לפי מרחק N שלבים אחורה. משחק זיכרון עבודה מחקרי קלאסי.',
    icon: '🔄',
    color: 'linear-gradient(135deg, #00897B, #80CBC4)',
    shadow: 'rgba(0,137,123,0.3)',
    skill: 'זיכרון עבודה + עדכון',
    unlockKey: 'gameNBack',
    cost: 800,
  },
  {
    id: 'chimp',
    name: 'מבחן השימפנזה',
    desc: 'זכור מיקומי מספרים שמופיעים לרגע. מודד זיכרון מרחבי מודע.',
    icon: '🐵',
    color: 'linear-gradient(135deg, #6D4C41, #BCAAA4)',
    shadow: 'rgba(109,76,65,0.3)',
    skill: 'זיכרון מרחבי + מהירות',
    unlockKey: 'gameChimpTest',
    cost: 750,
  },
  {
    id: 'odd',
    name: 'מצא את השונה',
    desc: 'זהה את הריבוע בצבע שונה מכל השאר. ההבדל הולך וקטן ככל שמתקדמים.',
    icon: '🔍',
    color: 'linear-gradient(135deg, #C62828, #EF9A9A)',
    shadow: 'rgba(198,40,40,0.3)',
    skill: 'ראייה פריפרית + הבחנה',
    unlockKey: 'gameOddOneOut',
    cost: 550,
  },
  {
    id: 'focus',
    name: 'רשת הקשב',
    desc: 'זכור תאים בהירים ברשת ולחץ רק עליהם כשהם נעלמים. מפתח קשב סלקטיבי.',
    icon: '🎯',
    color: 'linear-gradient(135deg, #1565C0, #90CAF9)',
    shadow: 'rgba(21,101,192,0.3)',
    skill: 'קשב סלקטיבי + זיכרון',
    unlockKey: 'gameFocusGrid',
    cost: 650,
  },
  {
    id: 'reflex',
    name: 'אתגר הרפלקסים',
    desc: 'החלט במהירות אם צבע נוכחי זהה לצבע מטרה. מודד מהירות עיבוד ותגובה.',
    icon: '⚡',
    color: 'linear-gradient(135deg, #F57F17, #FFF59D)',
    shadow: 'rgba(245,127,23,0.3)',
    skill: 'מהירות תגובה + עיבוד',
    unlockKey: 'gameReflexChallenge',
    cost: 500,
  },
  {
    id: 'speed',
    name: 'התאמה מהירה',
    desc: 'החלט במהירות אם הצורה הנוכחית זהה לקודמת. מפתח עיבוד מהיר וזיכרון.',
    icon: '🎴',
    color: 'linear-gradient(135deg, #AD1457, #F48FB1)',
    shadow: 'rgba(173,20,87,0.3)',
    skill: 'עיבוד מהיר + זיכרון',
    unlockKey: 'gameSpeedMatch',
    cost: 550,
  },
]

function GamesHub() {
  const { userData, purchase, isLoggedIn } = useUser()
  const navigate = useNavigate()
  const unlocks = userData?.unlocks || {}
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('הכל')
  const [toast, setToast] = useState('')

  const ALL = [...ALL_GAMES, ...miniGames]
  const cats = ['הכל', ...Array.from(new Set(ALL.map(g => g.skill.split(' + ')[0])))]
  const filtered = ALL.filter(g => {
    const m = search.trim()
    if (!m) return cat === 'הכל' || g.skill.includes(cat)
    return (g.name + ' ' + g.desc + ' ' + g.skill).toLowerCase().includes(m.toLowerCase())
  })

  const handleBuy = async (game) => {
    if (!isLoggedIn && !userData) {
      navigate('/login')
      return
    }
    const points = userData?.points ?? 0
    if (points < game.cost) {
      setToast('אין מספיק נקודות — שחק כדי לצבור!')
      setTimeout(() => setToast(''), 2000)
      return
    }
    const ok = await purchase(game.unlockKey, game.cost)
    if (ok) {
      setToast(`פתחת: ${game.name}!`)
    } else {
      setToast('הרכישה נכשלה')
    }
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div>
      <section className="hero" style={{ minHeight: '40vh', padding: '80px 24px 40px' }}>
        <h1>זירת המשחקים</h1>
        <p>דע — {ALL.length}+ משחקי אימון מוחי מדעיים. כל אחד מפתח יכולת קוגניטיבית אחרת. צבור נקודות כדי לפתוח משחקים חדשים!</p>
      </section>

      <section style={{ padding: '24px 24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חפש משחק..."
            style={{ padding: '12px 20px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', fontSize: 16, width: 280, direction: 'rtl' }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {cats.slice(0, 8).map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border)',
                  background: cat === c ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--surface)',
                  color: cat === c ? 'white' : 'var(--text-secondary)', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}
              >{c}</button>
            ))}
          </div>
        </div>
      </section>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 24px', boxShadow: 'var(--shadow-lg)', fontWeight: 600, animation: 'fadeInUp 0.3s ease' }}>
          {toast}
        </div>
      )}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', marginBottom: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
          מוצגים {filtered.length} משחקים מתוך {ALL.length}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ marginBottom: 8 }}>לא נמצאו משחקים</h3>
            <p>נסו לחפש מילה אחרת או לבחור קטגוריה אחרת</p>
          </div>
        )}
        <div className="card-grid" style={{ maxWidth: 1100 }}>
          {filtered.map(g => {
            const locked = g.unlockKey && !unlocks[g.unlockKey]
            const diffLabel = g.template ? (g.config?.difficulty === 'easy' ? 'קל' : g.config?.difficulty === 'medium' ? 'בינוני' : g.config?.difficulty === 'hard' ? 'קשה' : g.config?.max && g.config.max <= 10 ? 'קל' : g.config?.max && g.config.max <= 30 ? 'בינוני' : g.config?.count && g.config.count <= 4 ? 'קל' : 'בינוני') : null
            const miniHs = g.template ? (JSON.parse(localStorage.getItem('mini_hs') || '{}')[g.id] || 0) : 0
            const hasHs = miniHs > 0
            const CardContent = (
              <div
                className="card"
                style={{
                  cursor: locked ? 'not-allowed' : 'pointer',
                  height: '100%',
                  opacity: locked ? 0.5 : 1,
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (locked) return
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 40px ${g.shadow}`
                }}
                onMouseLeave={e => {
                  if (locked) return
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {locked && (
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: 10,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--warning)',
                    zIndex: 2,
                  }}>
                    🔒 נעול
                  </div>
                )}
                {hasHs && !locked && (
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,193,7,0.15)',
                    borderRadius: 10,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#ffc107',
                    zIndex: 2,
                    border: '1px solid rgba(255,193,7,0.3)',
                  }}>
                    ⭐ {miniHs}
                  </div>
                )}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: g.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    marginBottom: 20,
                    boxShadow: `0 8px 28px ${g.shadow}`,
                  }}
                >
                  {g.icon}
                </div>
                <h3 style={{ fontSize: 22, marginBottom: 8 }}>{g.name}</h3>
                <p style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.6 }}>{g.desc}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {g.skill}
                  </span>
                  {diffLabel && (
                    <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: diffLabel === 'קל' ? 'rgba(34,197,94,0.12)' : diffLabel === 'קשה' ? 'rgba(239,68,68,0.12)' : 'rgba(234,179,8,0.12)', color: diffLabel === 'קל' ? '#22c55e' : diffLabel === 'קשה' ? '#ef4444' : '#eab308', border: `1px solid ${diffLabel === 'קל' ? 'rgba(34,197,94,0.3)' : diffLabel === 'קשה' ? 'rgba(239,68,68,0.3)' : 'rgba(234,179,8,0.3)'}` }}>
                      {diffLabel}
                    </span>
                  )}
                </div>
              </div>
            )

            if (locked) {
              return (
                <div key={g.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  {CardContent}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBuy(g) }}
                    style={{
                      width: '100%',
                      marginTop: -12,
                      padding: '10px 0',
                      borderRadius: '0 0 16px 16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      color: 'white',
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: 'pointer',
                    }}
                  >
                    🔓 פתח ב-{g.cost} ⭐
                  </button>
                </div>
              )
            }

            return (
              <Link key={g.id} to={`/game/${g.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                {CardContent}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default GamesHub
