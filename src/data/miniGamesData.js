const PALETTE = [
  {c:'linear-gradient(135deg, #FF6B35, #FF8C42)',s:'rgba(255,107,53,0.3)'},
  {c:'linear-gradient(135deg, #00B8D4, #00E5FF)',s:'rgba(0,184,212,0.3)'},
  {c:'linear-gradient(135deg, #7C4DFF, #B388FF)',s:'rgba(124,77,255,0.3)'},
  {c:'linear-gradient(135deg, #00C853, #69F0AE)',s:'rgba(0,200,83,0.3)'},
  {c:'linear-gradient(135deg, #FF4081, #F8BBD0)',s:'rgba(255,64,129,0.3)'},
  {c:'linear-gradient(135deg, #9C27B0, #E1BEE7)',s:'rgba(156,39,176,0.3)'},
  {c:'linear-gradient(135deg, #FF9800, #FFCC80)',s:'rgba(255,152,0,0.3)'},
  {c:'linear-gradient(135deg, #3F51B5, #C5CAE9)',s:'rgba(63,81,181,0.3)'},
  {c:'linear-gradient(135deg, #00E5FF, #80DEEA)',s:'rgba(0,229,255,0.3)'},
  {c:'linear-gradient(135deg, #69F0AE, #B9F6CA)',s:'rgba(105,240,174,0.3)'},
  {c:'linear-gradient(135deg, #C62828, #EF9A9A)',s:'rgba(198,40,40,0.3)'},
  {c:'linear-gradient(135deg, #1565C0, #90CAF9)',s:'rgba(21,101,192,0.3)'},
  {c:'linear-gradient(135deg, #F57F17, #FFF59D)',s:'rgba(245,127,23,0.3)'},
  {c:'linear-gradient(135deg, #AD1457, #F48FB1)',s:'rgba(173,20,87,0.3)'},
  {c:'linear-gradient(135deg, #6D4C41, #BCAAA4)',s:'rgba(109,76,65,0.3)'},
  {c:'linear-gradient(135deg, #00897B, #80CBC4)',s:'rgba(0,137,123,0.3)'},
  {c:'linear-gradient(135deg, #5E35B1, #B39DDB)',s:'rgba(94,53,177,0.3)'},
  {c:'linear-gradient(135deg, #D84315, #FFAB91)',s:'rgba(216,67,21,0.3)'},
  {c:'linear-gradient(135deg, #2E7D32, #A5D6A7)',s:'rgba(46,125,50,0.3)'},
  {c:'linear-gradient(135deg, #0277BD, #81D4FA)',s:'rgba(2,119,189,0.3)'},
]

export const HEBREW_WORDS = [
  'שמש','ירח','כוכב','מים','אש','רוח','עץ','פרח','בית','ספר','עט','כיסא','שולחן','מחשב','טלפון','מכונית','אופניים','דרך','ים','הר',
  'שמיים','אדמה','אוויר','אור','צל','חום','קור','גשם','שלג','קיץ','חורף','אביב','סתיו','בוקר','ערב','לילה','יום','שנה','חודש','שבוע',
  'אבא','אמא','אח','אחות','חבר','אהבה','שמחה','שלום','בריאות','כוח','חכמה','אמת','יופי','טעם','ריח','צבע','צליל','מוזיקה','שיר','ריקוד',
  'ציור','ספורט','משחק','אוכל','לחם','חלב','בשר','דג','פרי','ירק','תפוח','בננה','תפוז','ענב','אגוז','דבש','מלח','סוכר','קפה','תה',
  'מיץ','שמן','חמאה','גבינה','ביצה','עוף','כלב','חתול','ציפור','אריה','דוב','שועל','זאב','ארנב','צבי','נחש','פרפר','דבורה','נמלה','עכביש',
]

let ci = 0
function g(id,name,desc,icon,skill,template,config){
  const p=PALETTE[ci%PALETTE.length];ci++
  return {id,name,desc,icon,color:p.c,shadow:p.s,skill,unlockKey:null,template,config}
}

const games=[]

// MATH (20)
games.push(g('math-add-easy','חיבור קל','פתור תרגילי חיבור פשוטים.','➕','חישוב מנטלי','math',{ops:['+'],max:10,timePerQ:8,totalQ:10}))
games.push(g('math-sub-easy','חיסור קל','פתור תרגילי חיסור פשוטים.','➖','חישוב מנטלי','math',{ops:['-'],max:10,timePerQ:8,totalQ:10}))
games.push(g('math-mul-easy','כפל קל','כפול מספרים עד 5.','✖️','חישוב מנטלי','math',{ops:['*'],max:5,timePerQ:10,totalQ:10}))
games.push(g('math-div-easy','חילוק קל','חלק מספרים קטנים.','➗','חישוב מנטלי','math',{ops:['/'],max:10,timePerQ:10,totalQ:10}))
games.push(g('math-add-med','חיבור בינוני','חבר מספרים עד 50.','➕','חישוב מנטלי','math',{ops:['+'],max:50,timePerQ:10,totalQ:12}))
games.push(g('math-sub-med','חיסור בינוני','חסר מספרים עד 50.','➖','חישוב מנטלי','math',{ops:['-'],max:50,timePerQ:10,totalQ:12}))
games.push(g('math-mul-med','כפל בינוני','כפול עד 12.','✖️','חישוב מנטלי','math',{ops:['*'],max:12,timePerQ:12,totalQ:12}))
games.push(g('math-div-med','חילוק בינוני','חלק עד 144.','➗','חישוב מנטלי','math',{ops:['/'],max:12,timePerQ:12,totalQ:12}))
games.push(g('math-mixed-easy','חשבון מעורב קל','+- פשוטים.','🧮','חישוב מנטלי','math',{ops:['+','-'],max:20,timePerQ:10,totalQ:12}))
games.push(g('math-mixed-med','חשבון מעורב','+-* בינוני.','🧮','חישוב מנטלי','math',{ops:['+','-','*'],max:30,timePerQ:12,totalQ:15}))
games.push(g('math-mixed-hard','חשבון קשה','+-*/ קשים.','🧮','חישוב מנטלי','math',{ops:['+','-','*','/'],max:50,timePerQ:15,totalQ:15}))
games.push(g('math-squares','ריבועים','חשב ריבועים.','📐','חישוב מנטלי','math',{mode:'square',max:20,timePerQ:10,totalQ:10}))
games.push(g('math-roots','שורשים','חשב שורשים.','√','חישוב מנטלי','math',{mode:'root',max:144,timePerQ:12,totalQ:10}))
games.push(g('math-compare','השוואה','איזה ביטוי גדול יותר.','⚖️','חישוב מנטלי','math',{mode:'compare',max:50,timePerQ:8,totalQ:12}))
games.push(g('math-negative','שליליים','פתור עם שליליים.','🧊','חישוב מנטלי','math',{ops:['+','-'],min:-20,max:20,timePerQ:12,totalQ:12}))
games.push(g('math-percent','אחוזים','חשב אחוזים.','%','חישוב מנטלי','math',{mode:'percent',max:100,timePerQ:15,totalQ:10}))
games.push(g('math-prime','ראשוניים','זהה ראשוניים.','🔢','חישוב מנטלי','math',{mode:'prime',max:100,timePerQ:8,totalQ:15}))
games.push(g('math-speed-add','מהירות חיבור','חבר הרבה בדקה.','⚡','חישוב + מהירות','math',{ops:['+'],max:20,timePerQ:3,totalQ:30}))
games.push(g('math-speed-mul','מהירות כפל','כפול הרבה בדקה.','⚡','חישוב + מהירות','math',{ops:['*'],max:10,timePerQ:4,totalQ:25}))
games.push(g('math-equation','משוואות','פתור משוואות פשוטות.','📊','חישוב מנטלי','math',{mode:'equation',max:20,timePerQ:15,totalQ:10}))

// MEMORY (15)
games.push(g('mem-digits-4','זיכרון 4 ספרות','זכור 4 ספרות.','🔢','זיכרון ספרתי','memoryDigits',{count:4,flashMs:1200}))
games.push(g('mem-digits-6','זיכרון 6 ספרות','זכור 6 ספרות.','🔢','זיכרון ספרתי','memoryDigits',{count:6,flashMs:1500}))
games.push(g('mem-digits-8','זיכרון 8 ספרות','זכור 8 ספרות.','🔢','זיכרון ספרתי','memoryDigits',{count:8,flashMs:2000}))
games.push(g('mem-digits-10','זיכרון 10 ספרות','זכור 10 ספרות.','🔢','זיכרון ספרתי','memoryDigits',{count:10,flashMs:2500}))
games.push(g('mem-letters-4','זיכרון 4 אותיות','זכור 4 אותיות.','🔠','זיכרון ויזואלי','memoryDigits',{count:4,flashMs:1200,mode:'letters'}))
games.push(g('mem-letters-6','זיכרון 6 אותיות','זכור 6 אותיות.','🔠','זיכרון ויזואלי','memoryDigits',{count:6,flashMs:1500,mode:'letters'}))
games.push(g('mem-colors-4','זיכרון 4 צבעים','זכור 4 צבעים.','🎨','זיכרון ויזואלי','memoryColors',{count:4,flashMs:1500}))
games.push(g('mem-colors-6','זיכרון 6 צבעים','זכור 6 צבעים.','🎨','זיכרון ויזואלי','memoryColors',{count:6,flashMs:1800}))
games.push(g('mem-colors-8','זיכרון 8 צבעים','זכור 8 צבעים.','🎨','זיכרון ויזואלי','memoryColors',{count:8,flashMs:2200}))
games.push(g('mem-words-3','זיכרון 3 מילים','זכור 3 מילים.','📝','זיכרון מילולי','memoryDigits',{count:3,flashMs:2000,mode:'words'}))
games.push(g('mem-words-5','זיכרון 5 מילים','זכור 5 מילים.','📝','זיכרון מילולי','memoryDigits',{count:5,flashMs:2500,mode:'words'}))
games.push(g('mem-seq-5','רצף 5','חזור על 5 צעדים.','🔲','זיכרון סדר','sequence',{length:5,speed:600}))
games.push(g('mem-seq-7','רצף 7','חזור על 7 צעדים.','🔲','זיכרון סדר','sequence',{length:7,speed:550}))
games.push(g('mem-seq-9','רצף 9','חזור על 9 צעדים.','🔲','זיכרון סדר','sequence',{length:9,speed:500}))
games.push(g('mem-reverse-5','רצף הפוך 5','חזור בסדר הפוך.','🔄','זיכרון עבודה','sequence',{length:5,speed:600,reverse:true}))

// REACTION + AIM (10)
games.push(g('react-color','תגובה לצבע','לחץ כשהמסך ירוק.','🟢','רפלקסים','reaction',{stimulus:'color'}))
games.push(g('react-shape','תגובה לצורה','לחץ על צורה מסוימת.','🔷','רפלקסים','reaction',{stimulus:'shape'}))
games.push(g('react-number','תגובה למספר','לחץ על מספר זוגי.','🔢','רפלקסים','reaction',{stimulus:'number'}))
games.push(g('react-disappear','היעלמות','לחץ כשהעיגול נעלם.','💨','רפלקסים','reaction',{stimulus:'disappear'}))
games.push(g('react-moving','מטרה נעה','לחץ על מטרה נעה.','🏃','רפלקסים','aim',{mode:'moving',duration:30,targetSize:50}))
games.push(g('quick-tap-10','הקשה 10','הקש על 10 מטרות.','👆','קואורדינציה','aim',{mode:'static',targets:10,targetSize:60}))
games.push(g('quick-tap-20','הקשה 20','הקש על 20 מטרות.','👆','קואורדינציה','aim',{mode:'static',targets:20,targetSize:50}))
games.push(g('quick-tap-30','הקשה 30','הקש על 30 מטרות.','👆','קואורדינציה','aim',{mode:'static',targets:30,targetSize:45}))
games.push(g('aim-shrinking','מטרה מתכווצת','הקש על מטרות מתכווצות.','🎯','קואורדינציה','aim',{mode:'shrinking',targets:15,initialSize:80}))
games.push(g('aim-tracking','מעקב מטרה','עקוב אחרי מטרה נעה.','👁️','קואורדינציה','aim',{mode:'tracking',duration:30}))

// PATTERN (10)
games.push(g('pattern-num-easy','דפוס מספרים קל','השלם דפוס פשוט.','📊','זיהוי דפוסים','pattern',{type:'number',difficulty:'easy',totalQ:10}))
games.push(g('pattern-num-med','דפוס מספרים','השלם דפוס מספרים.','📊','זיהוי דפוסים','pattern',{type:'number',difficulty:'medium',totalQ:10}))
games.push(g('pattern-color','דפוס צבעים','השלם דפוס צבעים.','🎨','זיהוי דפוסים','pattern',{type:'color',difficulty:'easy',totalQ:10}))
games.push(g('pattern-shape','דפוס צורות','השלם דפוס צורות.','🔷','זיהוי דפוסים','pattern',{type:'shape',difficulty:'easy',totalQ:10}))
games.push(g('pattern-alternating','דפוס מתחלף','זהה דפוס מתחלף.','🔀','זיהוי דפוסים','pattern',{type:'alternating',difficulty:'medium',totalQ:10}))
games.push(g('pattern-skip','דפוס דילוג','דפוס עם דילוגים.','⏭️','זיהוי דפוסים','pattern',{type:'skip',difficulty:'medium',totalQ:10}))
games.push(g('pattern-double','דפוס כפול','דפוס עם שתי חוקיות.','🔀','זיהוי דפוסים','pattern',{type:'double',difficulty:'hard',totalQ:8}))
games.push(g('pattern-letter','דפוס אותיות','השלם דפוס אותיות.','🔤','זיהוי דפוסים','pattern',{type:'letter',difficulty:'easy',totalQ:10}))
games.push(g('pattern-missing','חסר בדפוס','מצא איבר חסר.','❓','זיהוי דפוסים','pattern',{type:'missing',difficulty:'medium',totalQ:10}))
games.push(g('pattern-progression','תרדמת','השלם תרדמת מספרים.','📈','זיהוי דפוסים','pattern',{type:'progression',difficulty:'medium',totalQ:10}))

// WORD (14)
games.push(g('word-scramble-easy','מילים מבולבלות קל','סדר מילים קלות.','📝','שפה','word',{difficulty:'easy',totalQ:12}))
games.push(g('word-scramble-med','מילים מבולבלות','סדר מילים בעברית.','📝','שפה','word',{difficulty:'medium',totalQ:12}))
games.push(g('word-scramble-hard','מילים מבולבלות קשה','סדר מילים קשות.','📝','שפה','word',{difficulty:'hard',totalQ:10}))
games.push(g('word-missing','אות חסרה','מצא אות חסרה.','❓','שפה','word',{mode:'missing',totalQ:15}))
games.push(g('word-rhyme','חרוזים','האם מילים נחרזות.','🎵','שפה','logic',{mode:'rhyme',totalQ:15}))
games.push(g('word-opposite','הפכים','מצא הפך.','↔️','שפה','word',{mode:'opposite',totalQ:12}))
games.push(g('word-category','קטגוריה','מיין לקטגוריות.','🏷️','שפה','logic',{mode:'category',totalQ:15}))
games.push(g('word-beginning','התחלה','מילה שמתחילה באות.','🔤','שפה','word',{mode:'beginning',totalQ:12}))
games.push(g('word-ending','סוף','מילה שמסתיימת באות.','🔚','שפה','word',{mode:'ending',totalQ:12}))
games.push(g('word-longest','הארוכה','בחר מילה ארוכה.','📏','שפה','logic',{mode:'longest',totalQ:15}))
games.push(g('word-anagram-3','אנגרם 3','סדר 3 אותיות.','🔡','שפה','word',{mode:'anagram',length:3,totalQ:15}))
games.push(g('word-anagram-4','אנגרם 4','סדר 4 אותיות.','🔡','שפה','word',{mode:'anagram',length:4,totalQ:12}))
games.push(g('word-anagram-5','אנגרם 5','סדר 5 אותיות.','🔡','שפה','word',{mode:'anagram',length:5,totalQ:10}))
games.push(g('word-syllable','הברות','ספור הברות.','🔢','שפה','logic',{mode:'syllable',totalQ:15}))

// COLOR (8)
games.push(g('color-name','שם הצבע','זהה שם הצבע.','🎨','עיבוד ויזואלי','colorChallenge',{mode:'name',totalQ:15}))
games.push(g('color-match','התאמת צבע','האם המילה תואמת.','🎨','שליטה עצמית','colorChallenge',{mode:'match',totalQ:15}))
games.push(g('color-mismatch','אי-התאמה','האם המילה לא תואמת.','🎭','שליטה עצמית','colorChallenge',{mode:'mismatch',totalQ:15}))
games.push(g('color-count','ספירת צבעים','ספור צבעים.','🌈','קשב','counting',{mode:'color',totalQ:12}))
games.push(g('color-find','מצא צבע','מצא צבע שונה.','🔍','ראייה פריפרית','focusFind',{mode:'color',totalQ:15}))
games.push(g('color-sequence','רצף צבעים','זכור רצף צבעים.','🌈','זיכרון','memoryColors',{count:6,flashMs:1800}))
games.push(g('color-shade','גוון','מצא גוון שונה.','👁️','הבחנה','focusFind',{mode:'shade',totalQ:15}))
games.push(g('color-mix','ערבוב','תוצאת ערבוב צבעים.','🎨','ידע','logic',{mode:'colormix',totalQ:12}))

// LOGIC (12)
games.push(g('logic-true-false','נכון או לא','נכון או לא נכון.','✅','לוגיקה','logic',{mode:'truefalse',totalQ:15}))
games.push(g('logic-heavier','מי כבד','מי כבד יותר.','⚖️','לוגיקה','logic',{mode:'heavier',totalQ:12}))
games.push(g('logic-odd-num','שונה במספרים','מצא מספר שונה.','🔍','לוגיקה','focusFind',{mode:'oddNumber',totalQ:15}))
games.push(g('logic-odd-shape','שונה בצורות','מצא צורה שונה.','🔍','לוגיקה','focusFind',{mode:'oddShape',totalQ:15}))
games.push(g('logic-sort','מיון','ספר בסדר.','📊','לוגיקה','logic',{mode:'sort',totalQ:10}))
games.push(g('logic-categorize','קטגוריזציה','מיין פריטים.','🏷️','לוגיקה','logic',{mode:'categorize',totalQ:12}))
games.push(g('logic-math-riddle','חידת חשבון','חידות חשבון.','🧩','לוגיקה','logic',{mode:'riddle',totalQ:12}))
games.push(g('logic-bigger-smaller','גדול או קטן','השווה מהר.','⚖️','לוגיקה','comparison',{totalQ:20}))
games.push(g('logic-approx','הערכה','הערך תשובה.','🎯','לוגיקה','logic',{mode:'approx',totalQ:12}))
games.push(g('logic-priority','סדר פעולות','סדר פעולות.','📐','לוגיקה','math',{mode:'priority',max:50,timePerQ:15,totalQ:10}))
games.push(g('logic-sequence','סדר לוגי','הפריט הבא.','🔀','לוגיקה','pattern',{type:'logic',difficulty:'medium',totalQ:10}))
games.push(g('logic-deduction','הסקה','הסק מנתונים.','🕵️','לוגיקה','logic',{mode:'deduction',totalQ:10}))

// COUNTING (6)
games.push(g('count-dots','ספירת נקודות','ספור נקודות.','🔵','קשב','counting',{mode:'dots',max:12,totalQ:15}))
games.push(g('count-shapes','ספירת צורות','ספור צורות.','🔷','קשב','counting',{mode:'shapes',max:10,totalQ:15}))
games.push(g('count-fast','ספירה מהירה','ספור מהר.','⚡','קשב','counting',{mode:'fast',max:15,totalQ:15}))
games.push(g('count-grouped','ספירה קבוצתית','ספור קבוצות.','📦','קשב','counting',{mode:'grouped',max:20,totalQ:12}))
games.push(g('count-compare','השוואת כמויות','איזו קבוצה גדולה.','⚖️','קשב','counting',{mode:'compare',totalQ:15}))
games.push(g('count-remember','ספור וזכור','זכור ספירות.','🧠','זיכרון','counting',{mode:'remember',totalQ:10}))

// SEQUENCE + TYPING + EXTRA (14)
games.push(g('seq-letters','רצף אותיות','השלם רצף אותיות.','🔤','זיכרון','pattern',{type:'letter',difficulty:'easy',totalQ:12}))
games.push(g('seq-numbers','רצף מספרים','השלם רצף מספרים.','🔢','זיכרון','pattern',{type:'number',difficulty:'easy',totalQ:12}))
games.push(g('seq-tap-5','הקשה רצף 5','הקש 5 צעדים ברצף.','🔲','זיכרון','sequence',{length:5,speed:600}))
games.push(g('seq-tap-7','הקשה רצף 7','הקש 7 צעדים ברצף.','🔲','זיכרון','sequence',{length:7,speed:550}))
games.push(g('seq-tap-9','הקשה רצף 9','הקש 9 צעדים ברצף.','🔲','זיכרון','sequence',{length:9,speed:500}))
games.push(g('seq-reverse-7','רצף הפוך 7','חזור בסדר הפוך.','🔄','זיכרון','sequence',{length:7,speed:600,reverse:true}))
games.push(g('seq-missing-3','חסר 3','מצא חסר ברצף 3.','❓','זיכרון','pattern',{type:'missing',difficulty:'easy',totalQ:12}))
games.push(g('typing-short','הקלדה קצרה','הקלד מילים קצרות.','⌨️','קואורדינציה','typing',{difficulty:'easy',totalWords:12}))
games.push(g('typing-medium','הקלדה בינונית','הקלד מילים בינוניות.','⌨️','קואורדינציה','typing',{difficulty:'medium',totalWords:12}))
games.push(g('typing-long','הקלדה ארוכה','הקלד מילים ארוכות.','⌨️','קואורדינציה','typing',{difficulty:'hard',totalWords:10}))
games.push(g('focus-num','מצא מספר','מצא מספר מסוים.','🔍','קשב','focusFind',{mode:'number',totalQ:15}))
games.push(g('focus-letter','מצא אות','מצא אות מסוימת.','🔍','קשב','focusFind',{mode:'letter',totalQ:15}))
games.push(g('focus-vigilance','עירנות','לחץ רק על מטרה מסוימת.','👁️','קשב','focusFind',{mode:'vigilance',totalQ:20}))
games.push(g('focus-inhibition','עיכוב','אל תלחץ על צבע אדום.','🛑','שליטה עצמית','focusFind',{mode:'inhibition',totalQ:20}))

games.forEach(game => {
  const cfg = game.config || {}
  let cost = 300
  if (cfg.difficulty === 'easy') cost = 150
  else if (cfg.difficulty === 'medium') cost = 300
  else if (cfg.difficulty === 'hard') cost = 600
  else if (game.template === 'math' && cfg.max <= 10) cost = 100
  else if (game.template === 'memoryDigits' && cfg.count <= 4) cost = 100
  else if (game.template === 'memoryColors' && cfg.count <= 4) cost = 100
  else if (game.template === 'reaction') cost = 200
  else if (game.template === 'aim') cost = 250
  else if (game.template === 'pattern') cost = 250
  else if (game.template === 'word') cost = 200
  else if (game.template === 'colorChallenge') cost = 250
  else if (game.template === 'logic') cost = 300
  else if (game.template === 'counting') cost = 150
  else if (game.template === 'sequence') cost = 200
  else if (game.template === 'typing') cost = 250
  else if (game.template === 'focusFind') cost = 200
  else if (game.template === 'comparison') cost = 250
  else if (game.template === 'math' && cfg.max <= 30) cost = 200
  else if (game.template === 'memoryDigits' && cfg.count <= 6) cost = 200
  else if (game.template === 'memoryColors' && cfg.count <= 6) cost = 200
  game.cost = cost
  game.unlockKey = `unlock_${game.id}`
})

export const miniGames = games
export const MINI_GAME_IDS = new Set(games.map(g => g.id))
export const MINI_GAME_UNLOCK_KEYS = games.map(g => g.unlockKey)
