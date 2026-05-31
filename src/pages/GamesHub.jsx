import { Link } from 'react-router-dom'

function GamesHub() {
  const games = [
    {
      id: 'schulte',
      name: 'שולטה טייבל',
      desc: 'מצא מספרים בסדר עולה ברשת אקראית. מאמן ראייה פריפרית, תשומת לב וקריאה מהירה.',
      icon: '🔢',
      color: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
      shadow: 'rgba(255,107,53,0.3)',
      skill: 'תשומת לב + ראייה פריפרית',
    },
    {
      id: 'reaction',
      name: 'מהירות תגובה',
      desc: 'לחץ במהירות המרבית כשהמסך משתנה צבע. מודד זמן תגובה במילישניות.',
      icon: '⚡',
      color: 'linear-gradient(135deg, #00B8D4, #00E5FF)',
      shadow: 'rgba(0,184,212,0.3)',
      skill: 'רפלקסים + עיבוד ויזואלי',
    },
    {
      id: 'sequence',
      name: 'זיכרון סדר',
      desc: 'זכור וחזור על רצף של צבעים וצלילים. משחק סימון סיימון מדעי.',
      icon: '🧩',
      color: 'linear-gradient(135deg, #7C4DFF, #B388FF)',
      shadow: 'rgba(124,77,255,0.3)',
      skill: 'זיכרון עבודה + דפוסים',
    },
    {
      id: 'math',
      name: 'חישוב מהיר',
      desc: 'פתור תרגילי חשבון תחת לחץ זמן. משפר יכולת עיבוד מספרי וזריזות חשיבה.',
      icon: '🧮',
      color: 'linear-gradient(135deg, #00C853, #69F0AE)',
      shadow: 'rgba(0,200,83,0.3)',
      skill: 'חישוב מנטלי + מהירות',
    },
    {
      id: 'stroop',
      name: 'מבחן סטרופ',
      desc: 'זהה את צבע הטקסט, לא את המילה. מודד שליטה עצמית וגמישות קוגניטיבית.',
      icon: '🎨',
      color: 'linear-gradient(135deg, #FF4081, #F8BBD0)',
      shadow: 'rgba(255,64,129,0.3)',
      skill: 'שליטה עצמית + התנגדות להפרעות',
    },
  ]

  return (
    <div>
      <section className="hero" style={{ minHeight: '50vh', padding: '80px 24px 60px' }}>
        <h1>זירת המשחקים</h1>
        <p>דע — 5 משחקי אימון מוחי מדעיים. כל אחד מפתח יכולת קוגניטיבית אחרת. התחל לאמן היום.</p>
      </section>

      <section style={{ padding: '40px 24px 80px' }}>
        <div className="card-grid" style={{ maxWidth: 1100 }}>
          {games.map(g => (
            <Link
              key={g.id}
              to={`/game/${g.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div
                className="card"
                style={{ cursor: 'pointer', height: '100%' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 40px ${g.shadow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default GamesHub
