import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

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
  },
]

function GamesHub() {
  const { userData } = useUser()
  const unlocks = userData?.unlocks || {}

  return (
    <div>
      <section className="hero" style={{ minHeight: '50vh', padding: '80px 24px 60px' }}>
        <h1>זירת המשחקים</h1>
        <p>דע — 12 משחקי אימון מוחי מדעיים. כל אחד מפתח יכולת קוגניטיבית אחרת. צבור נקודות כדי לפתוח משחקים חדשים!</p>
      </section>

      <section style={{ padding: '40px 24px 80px' }}>
        <div className="card-grid" style={{ maxWidth: 1100 }}>
          {ALL_GAMES.map(g => {
            const locked = g.unlockKey && !unlocks[g.unlockKey]
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
                <p style={{ marginBottom: 16 }}>{g.desc}</p>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '5px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {g.skill}
                </span>
              </div>
            )

            if (locked) {
              return (
                <div key={g.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  {CardContent}
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
