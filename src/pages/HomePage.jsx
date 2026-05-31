import { Link } from 'react-router-dom'

function HomePage() {
  const benefits = [
    { icon: '🎯', title: 'תשומת לב ממוקדת', desc: 'מאמן את המוח לזהות מידע במהירות מבלי להיתקע על פרטים לא רלוונטיים', color: 'orange' },
    { icon: '👁️', title: 'ראייה פריפרית', desc: 'מפתח את היכולת לראות ולעבד מידע במרחב רחב יותר מהמרכז הוויזואלי', color: 'teal' },
    { icon: '🧠', title: 'מהירות עיבוד', desc: 'משפר את קצב תגובת העצבים ומקצר את זמן קבלת ההחלטות', color: 'purple' },
    { icon: '⚡', title: 'זיכרון עבודה', desc: 'מחזק את הזיכרון הקצר-טווח שמאפשר לשמור על מספרים בסדר הנכון', color: 'green' },
  ]

  return (
    <div>
      <section className="hero">
        <h1>סינפס</h1>
        <p>אקדמיית אימון קוגניטיבי — 5 משחקי מוח מדעיים לשיפור תשומת הלב, זיכרון, מהירות תגובה וחישוב מנטלי.</p>
        <div style={{ marginTop: 32 }}>
          <Link to="/games" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            color: 'white',
            padding: '16px 48px',
            borderRadius: 16,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: '0 4px 24px rgba(255,107,53,0.4), 0 0 40px rgba(255,107,53,0.15)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            letterSpacing: '0.5px',
          }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,53,0.5), 0 0 60px rgba(255,107,53,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,107,53,0.4), 0 0 40px rgba(255,107,53,0.15)'; }}>
            התחל לאמן ➜
          </Link>
        </div>
      </section>

      <section style={{ padding: '60px 24px' }}>
        <h2 className="section-title">למה אימון קוגניטיבי עובד?</h2>
        <p className="section-subtitle">מחקרים מדעיים מוכיחים — אימון קבוע באמצעות משחקי חשיבה יכול לשנות את המוח שלך</p>
        <div className="card-grid">
          {benefits.map((b, i) => (
            <div className="card" key={i}>
              <div className={`card-icon ${b.color}`}>{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">איך זה עובד?</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 17, marginBottom: 40 }}>
            לוח השולטה מכיל רשת של מספרים מסודרים באופן אקראי. המטרה — למצוא את המספרים לפי סדר עולה (1, 2, 3...) כמה שיותר מהר.
            נשמע פשוט? המוח שלך עושה עבודה קשה — הוא מחפש דפוס, מעבד מידע ויזואלי, ומבצע החלטות במהירות.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
            <div style={{ padding: 32, background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow)' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(255,107,53,0.3)' }}>1</div>
              <h4 style={{ fontSize: 19, marginBottom: 10, fontWeight: 700 }}>בחר גודל רשת</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>התחל עם 3x3 והתקדם ל-5x5, 7x7 ואף 9x9</p>
            </div>
            <div style={{ padding: 32, background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow)' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), #00E5FF)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(0,184,212,0.3)' }}>2</div>
              <h4 style={{ fontSize: 19, marginBottom: 10, fontWeight: 700 }}>מצא את הסדר</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>לחץ על המספרים לפי סדר עולה — 1, 2, 3...</p>
            </div>
            <div style={{ padding: 32, background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow)' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #B388FF)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(124,77,255,0.3)' }}>3</div>
              <h4 style={{ fontSize: 19, marginBottom: 10, fontWeight: 700 }}>שפר את הזמן</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>אמן יומיומי ישפר את המהירות והדיוק שלך</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, rgba(30,41,59,0.3), rgba(15,23,42,0.5))' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">היתרונות המוכחים מדעית</h2>
          <p className="section-subtitle">מחקרים נוירולוגיים מראים שאימון קבוע משפיע על המוח</p>
          <div className="benefits-grid" style={{ marginTop: 40 }}>
            <div className="benefit-item">
              <h4>פלסטיות מוחית</h4>
              <p>המוח יוצר חיבורים נוירוניים חדשים — תהליך שנקרא נוירופלסטיות</p>
            </div>
            <div className="benefit-item">
              <h4>זרימת דם מוגברת</h4>
              <p>אזורי המוח המעורבים בתשומת לב מקבלים יותר חמצן וגלוקוז</p>
            </div>
            <div className="benefit-item">
              <h4>האצת עיבוד</h4>
              <p>זמן התגובה הממוצע יורד ב-15-30% אחרי 4 שבועות אימון</p>
            </div>
            <div className="benefit-item">
              <h4>מניעת ירידה קוגניטיבית</h4>
              <p>אימון מוחי קבוע מפחית את הסיכון לדמנציה ואלצהיימר</p>
            </div>
            <div className="benefit-item">
              <h4>קריאה מהירה יותר</h4>
              <p>מגביר את טווח הראייה הפריפרית — המפתח לסריקת טקסט מהירה</p>
            </div>
            <div className="benefit-item">
              <h4>ריכוז ממושך</h4>
              <p>מחזק את היכולת לשמור על תשומת לב לאורך זמן מבלי להתפזר</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>סינפס — אקדמיית אימון קוגניטיבי</p>
        <p>האתר נבנה כדי לעזור לאנשים לשפר את יכולות הקוגניציה שלהם בדרך מהנה ומדעית</p>
        <p style={{ marginTop: 16, fontSize: 12, opacity: 0.6 }}>© 2025 Synapse Cognitive Training</p>
      </footer>
    </div>
  )
}

export default HomePage
