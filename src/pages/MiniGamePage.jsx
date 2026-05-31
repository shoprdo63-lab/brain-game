import{useParams,Link}from'react-router-dom'
import{useState,useEffect,useRef,useCallback}from'react'
import{miniGames,MINI_GAME_IDS,HEBREW_WORDS}from'../data/miniGamesData'
import{useUser}from'../context/UserContext'
const HL='אבגדהוזחטיכלמנסעפצקרשת'.split('')
function sh(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function r(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function p(a){return a[r(0,a.length-1)]}
function getHS(id){try{return JSON.parse(localStorage.getItem('mini_hs')||'{}')[id]||0}catch{return 0}}
function setHS(id,val){try{const a=JSON.parse(localStorage.getItem('mini_hs')||'{}');a[id]=val;localStorage.setItem('mini_hs',JSON.stringify(a))}catch{}}
function getPlays(id){try{return JSON.parse(localStorage.getItem('mini_plays')||'{}')[id]||0}catch{return 0}}
function addPlays(id){try{const a=JSON.parse(localStorage.getItem('mini_plays')||'{}');a[id]=(a[id]||0)+1;localStorage.setItem('mini_plays',JSON.stringify(a))}catch{}}

const INSTRUCTIONS={
  math:'פתרו את התרגיל המוצג. בחרו את התשובה הנכונה מבין 4 אפשרויות. עבדו מהר — לכל שאלה יש זמן מוגבל!',
  memoryDigits:'הסתכלו על המספרים/אותיות/מילים שמופיעות למשך כמה שניות. כשהן ייעלמו, הקלידו בדיוק מה ראיתם.',
  memoryColors:'צבעים יופיעו ברצף — זכרו את הסדר. לאחר מכן לחצו על הצבעים באותו הסדר.',
  reaction:'לחצו על המסך כאשר הוא משתנה לצבע המטרה (ירוק). אל תלחצו מוקדם מדי!',
  pattern:'הסתכלו על הדפוס וזהו את המשך הלוגי. בחרו את האיבר הבא הנכון.',
  word:'סדרו את האותיות המבולבלות, מצאו את האות החסרה, או בחרו את המילה הנכונה לפי ההוראה.',
  colorChallenge:'התעלמו מהמילה עצמה — התמקדו בצבע שלה. לחצו "תואם" אם המילה כתובה בצבע המתאים.',
  logic:'קראו את השאלה הלוגית והשתמשו בהגיון כדי לבחור בתשובה הנכונה.',
  counting:'ספרו במהירות את כל האובייקטים על המסך ובחרו את התשובה הנכונה.',
  aim:'לחצו על המטרות המופיעות במהירות. בחלק מהמצבים הן זזות או מתכווצות!',
  typing:'הקלידו במדויק את המילה המוצגת. לחצו רווח כדי לעבור למילה הבאה.',
  focusFind:'מצאו את הפריט המיוחד ברשת או בחרו לפי ההוראה המדויקת. קשבו לפרטים הקטנים.',
  sequence:'צבעים יופיעו ברצף — לחצו עליהם באותו סדר. במצב הפוך, חזרו בסדר ההפוך!',
  comparison:'החליטו מי גדול יותר או אם הם שווים. עבדו במהירות!',
}

const DIFF_LABEL={easy:'קל',medium:'בינוני',hard:'קשה'}
function getDiff(cfg){if(cfg.difficulty)return DIFF_LABEL[cfg.difficulty]||cfg.difficulty;if(cfg.max&&cfg.max<=10)return'קל';if(cfg.max&&cfg.max<=30)return'בינוני';if(cfg.max&&cfg.max>30)return'קשה';if(cfg.count&&cfg.count<=4)return'קל';if(cfg.count&&cfg.count<=6)return'בינוני';return'בינוני'}

function S({t,d,on,diff,inst}){return<div style={{textAlign:'center',padding:40,maxWidth:560,margin:'0 auto'}}><h2 style={{fontSize:32,marginBottom:12}}>{t}</h2><p style={{color:'var(--text-secondary)',marginBottom:20,lineHeight:1.8}}>{d}</p>{diff&&<span style={{display:'inline-block',padding:'6px 16px',borderRadius:20,fontSize:13,fontWeight:700,marginBottom:20,background:'rgba(255,255,255,0.06)',border:'1px solid var(--border)',color:'var(--accent)'}}>{diff}</span>}{inst&&<div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,padding:20,marginBottom:28,textAlign:'right',direction:'rtl',fontSize:15,color:'var(--text-secondary)',lineHeight:1.7}}><span style={{color:'var(--primary)',fontWeight:700}}>איך משחקים? </span>{inst}</div>}<button className="restart-btn" onClick={on}>התחל משחק</button><div style={{marginTop:24}}><Link to="/games" style={{color:'var(--text-secondary)',textDecoration:'none'}}>← חזרה למשחקים</Link></div></div>}

function R({sc,ms,gid,on}){
  const{addPoints}=useUser();const[rp,setRp]=useState(false);const pct=Math.round(sc/ms*100)
  const prev=getHS(gid);const isNew=sc>prev
  useEffect(()=>{if(!rp){const pts=Math.max(5,Math.round(sc/ms*50));addPoints(pts,gid,sc);setRp(true);if(isNew)setHS(gid,sc)}},[rp])
  const msg=pct>=90?'מדהים! ביצוע מעולה!':pct>=70?'כל הכבוד! תוצאה מצוינת!':pct>=50?'לא רע! אפשר להשתפר עוד.':'נסו שוב — תרגול עושה את המומחה!'
  return<div style={{textAlign:'center',padding:40,maxWidth:560,margin:'0 auto'}}><h2 style={{fontSize:36,marginBottom:8}}>סיום!</h2><p style={{fontSize:18,color:'var(--text-secondary)',marginBottom:8}}>{msg}</p><div style={{fontSize:56,fontWeight:800,margin:'20px 0',background:'linear-gradient(135deg,var(--primary),var(--accent))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{sc} / {ms}</div><div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:20}}><div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'10px 20px'}}><p style={{fontSize:11,color:'var(--text-secondary)'}}>דיוק</p><p style={{fontSize:22,fontWeight:700}}>{pct}%</p></div>{isNew&&<div style={{background:'linear-gradient(135deg,rgba(255,107,53,0.15),rgba(124,77,255,0.15))',border:'1px solid var(--accent)',borderRadius:14,padding:'10px 20px'}}><p style={{fontSize:11,color:'var(--accent)'}}>שיא חדש!</p><p style={{fontSize:22,fontWeight:700,color:'var(--accent)'}}>{sc}</p></div>}<div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'10px 20px'}}><p style={{fontSize:11,color:'var(--text-secondary)'}}>שיא</p><p style={{fontSize:22,fontWeight:700}}>{Math.max(sc,prev)}</p></div></div><p style={{color:'var(--text-secondary)',marginBottom:32}}>צברת {Math.max(5,Math.round(sc/ms*50))} נקודות</p><button className="restart-btn" onClick={on}>שחק שוב</button><div style={{marginTop:24}}><Link to="/games" style={{color:'var(--text-secondary)',textDecoration:'none'}}>← חזרה למשחקים</Link></div></div>
}

function ProgressBar({q,total}){return<div style={{width:'100%',maxWidth:500,margin:'0 auto 20px',height:6,borderRadius:3,background:'var(--surface)',overflow:'hidden'}}><div style={{width:`${((q)/total)*100}%`,height:'100%',background:'linear-gradient(90deg,var(--primary),var(--accent))',borderRadius:3,transition:'width 0.3s'}}></div></div>}

function Combo({streak}){if(streak<3)return null;return<div style={{fontSize:16,fontWeight:700,color:'var(--warning)',marginBottom:8,animation:'pulse 0.6s infinite'}}>{streak} רצף! 🎉</div>}

function genM(cfg){
  const{ops=['+'],max=10,mode}=cfg;const min=cfg.min||0
  if(mode==='square'){const n=r(2,max);return{t:`${n}² = ?`,a:n*n,o:sh([n*n,n*n+r(1,5),n*n-r(1,5),n*n+r(6,10)])}}
  if(mode==='root'){const n=r(2,Math.floor(Math.sqrt(max)));return{t:`√${n*n} = ?`,a:n,o:sh([n,n+1,n-1,n+2])}}
  if(mode==='compare'){const a=r(min,max),b=r(min,max),c=r(min,max),d=r(min,max);const v1=a+b,v2=c+d;const ans=v1>v2?0:v2>v1?1:2;return{t:`${a}+${b}  ?  ${c}+${d}`,a:ans,o:sh([`${v1} גדול`,`${v2} גדול`,'שווים'])}}
  if(mode==='percent'){const n=r(1,Math.min(max,100)),pc=r(10,50);const res=Math.round(n*pc/100);return{t:`${pc}% מ-${n} = ?`,a:res,o:sh([res,res+r(1,3),res-r(1,3),res+r(4,7)])}}
  if(mode==='prime'){const n=r(2,max);const isP=![...Array(n-2)].some((_,i)=>n%(i+2)===0);return{t:`האם ${n} ראשוני?`,a:isP?0:1,o:['כן','לא']}}
  if(mode==='equation'){const x=r(1,cfg.max||20),a=r(2,10),c=a*x+r(1,20);const b=c-a*x;return{t:`פתח: ${a}x + ${b} = ${c}`,a:x,o:sh([x,x+1,x-1,x+2])}}
  if(mode==='priority'){const a=r(1,max),b=r(1,max),c=r(1,max);const o1=p(['+','-','*']),o2=p(['+','-','*']);let ans;if((o1==='+'||o1==='-')&&(o2==='*'||o2==='/')){const bc=o2==='*'?b*c:b/c;ans=o1==='+'?a+bc:a-bc}else{const ab=o1==='+'?a+b:o1==='-'?a-b:o1==='*'?a*b:a/b;ans=o2==='+'?ab+c:o2==='-'?ab-c:o2==='*'?ab*c:ab/c}ans=Math.round(ans);return{t:`${a} ${o1} ${b} ${o2} ${c} = ?`,a:ans,o:sh([ans,ans+r(1,5),ans-r(1,5),ans+r(6,10)])}}
  const op=p(ops);let a=r(min,max),b=r(min,max);if(op==='-'&&a<b)[a,b]=[b,a];if(op==='/'){b=r(1,max);a=b*r(1,max)}
  let ans=op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:Math.round(a/b)
  return{t:`${a} ${op} ${b} = ?`,a:ans,o:sh([ans,ans+r(1,5),ans-r(1,5),ans+r(6,10)])}
}

function MG({c,on}){
  const{timePerQ=10,totalQ=10}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[strk,setStrk]=useState(0);const[pr,setPr]=useState(()=>genM(c));const[tm,setTm]=useState(timePerQ);const[st,setSt]=useState(false);const[fl,setFl]=useState(null);const[la,setLa]=useState(null)
  useEffect(()=>{if(!st)return;const t=setInterval(()=>setTm(x=>{if(x<=1){ha(null);return timePerQ}return x-1}),1000);return()=>clearInterval(t)},[st,qi])
  useEffect(()=>{if(!st)return;const hk=e=>{const n=Number(e.key);if(n>=1&&n<=4){const idx=n-1;if(idx<pr.o.length)ha(pr.o[idx])}};window.addEventListener('keydown',hk);return()=>window.removeEventListener('keydown',hk)},[st,pr])
  function ha(ans){const cr=ans===pr.a;setLa(ans);if(cr){setSc(s=>s+1);setStrk(s=>s+1)}else{setStrk(0)}setFl(cr?'g':'b');setTimeout(()=>{setFl(null);setLa(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setPr(genM(c));setTm(timePerQ)}},400)}
  if(!st)return<S t="חישוב מהיר" d="פתור תרגילי חשבון במהירות" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.math}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><ProgressBar q={qi+1} total={totalQ}/><Combo streak={strk}/><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span><span style={{color:tm<=3?'#ef4444':'inherit'}}>זמן: {tm}</span></div><div style={{fontSize:42,fontWeight:700,margin:'32px 0',minHeight:60,color:fl==='g'?'#22c55e':fl==='b'?'#ef4444':'var(--text)',transition:'color 0.2s'}}>{pr.t}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{pr.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:`2px solid ${fl==='g'&&o===pr.a?'#22c55e':fl==='b'&&o===la?'#ef4444':'var(--border)'}`,background:fl==='g'&&o===pr.a?'rgba(34,197,94,0.08)':fl==='b'&&o===la?'rgba(239,68,68,0.08)':'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit',transform:fl==='g'&&o===pr.a?'scale(1.03)':fl==='b'&&o===la?'scale(0.97)':'none',transition:'all 0.15s'}}>{o}</button>)}</div><p style={{marginTop:12,fontSize:12,color:'var(--text-secondary)'}}>מקשי 1-4 לבחירה מהירה</p></div>
}

function MDG({c,on}){
  const{count=4,flashMs=1200,mode='digits'}=c
  const[ph,setPh]=useState('start');const[it,setIt]=useState([]);const[ip,setIp]=useState('');const[sc,setSc]=useState(0);const[rd,setRd]=useState(0);const totalRounds=5
  function gi(){if(mode==='letters')return Array.from({length:count},()=>p(HL));if(mode==='words')return sh([...HEBREW_WORDS]).slice(0,count);return Array.from({length:count},()=>r(0,9))}
  function sr(){const items=gi();setIt(items);setPh('show');setTimeout(()=>setPh('input'),flashMs)}
  function ck(){const cr=mode==='words'?ip.trim().split(/\s+/).join(' ')===it.join(' '):ip.trim()===it.join('');if(cr)setSc(s=>s+1);setPh(cr?'correct':'wrong');setTimeout(()=>{setIp('');if(rd+1>=totalRounds){on(sc+(cr?1:0),totalRounds)}else{setRd(x=>x+1);sr()}},800)}
  if(ph==='start')return<S t="זיכרון" d={`זכור ${mode==='digits'?count+' ספרות':mode==='letters'?count+' אותיות':count+' מילים'}`} on={()=>{setSc(0);setRd(0);sr()}} diff={getDiff(c)} inst={INSTRUCTIONS.memoryDigits}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{color:'var(--text-secondary)',marginBottom:20}}>סיבוב {rd+1}/{totalRounds} | נקודות: {sc}</div>{ph==='show'&&<div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',minHeight:80,alignItems:'center'}}>{it.map((x,i)=><div key={i} style={{minWidth:60,height:60,borderRadius:14,background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:mode==='words'?20:28,fontWeight:700,padding:'0 16px'}}>{x}</div>)}</div>}{ph==='input'&&<><p style={{color:'var(--text-secondary)',marginBottom:16}}>מה ראית?</p><input autoFocus value={ip} onChange={e=>setIp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ck()} style={{padding:'14px 20px',fontSize:22,textAlign:'center',borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',fontFamily:'inherit',width:'100%',maxWidth:320,direction:'rtl'}}/></>}{ph==='input'&&<div style={{marginTop:16}}><button className="restart-btn" onClick={ck}>בדוק</button></div>}{ph==='correct'&&<div style={{fontSize:48,color:'#22c55e',fontWeight:800}}>נכון!</div>}{ph==='wrong'&&<div style={{fontSize:24,color:'#ef4444'}}>לא נכון. התשובה: <strong>{it.join(mode==='words'?' ':'')}</strong></div>}</div>
}

function MCG({c,on}){
  const{count=4,flashMs=1500}=c
  const[ph,setPh]=useState('start');const[sq,setSq]=useState([]);const[ps,setPs]=useState([]);const[sc,setSc]=useState(0);const[rd,setRd]=useState(0);const totalRounds=5
  const cm=['#ef4444','#22c55e','#3b82f6','#eab308','#a855f7','#ec4899']
  function sr(){const s=Array.from({length:count},()=>r(0,5));setSq(s);setPs([]);setPh('show');let i=0;const iv=setInterval(()=>{setPh(`h-${s[i]}`);i++;if(i>=s.length){clearInterval(iv);setTimeout(()=>setPh('input'),400)}},flashMs/count)}
  function hc(idx){if(ph!=='input')return;const nx=[...ps,idx];setPs(nx);if(nx.length===sq.length){const cr=nx.every((v,i)=>v===sq[i]);if(cr)setSc(s=>s+1);setPh(cr?'correct':'wrong');setTimeout(()=>{if(rd+1>=totalRounds){on(sc+(cr?1:0),totalRounds)}else{setRd(x=>x+1);sr()}},800)}}
  if(ph==='start')return<S t="זיכרון צבעים" d={`זכור רצף של ${count} צבעים`} on={()=>{setSc(0);setRd(0);sr()}} diff={getDiff(c)} inst={INSTRUCTIONS.memoryColors}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{color:'var(--text-secondary)',marginBottom:20}}>סיבוב {rd+1}/{totalRounds} | נקודות: {sc}</div>{ph.startsWith('h-')&&<div style={{width:120,height:120,margin:'0 auto',borderRadius:20,background:cm[parseInt(ph.split('-')[1])],transition:'all 0.3s'}}/>}{ph==='show'&&<div style={{width:120,height:120,margin:'0 auto',borderRadius:20,background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-secondary)'}}>שים לב...</div>}{(ph==='input'||ph==='correct'||ph==='wrong')&&<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,maxWidth:300,margin:'0 auto'}}>{cm.slice(0,6).map((c,i)=><button key={i} onClick={()=>hc(i)} style={{width:'100%',aspectRatio:1,borderRadius:16,border:'none',background:c,cursor:ph==='input'?'pointer':'default',opacity:ph==='input'?1:0.5}}/>)}</div>}{ph==='correct'&&<div style={{marginTop:20,fontSize:32,color:'#22c55e',fontWeight:800}}>נכון!</div>}{ph==='wrong'&&<div style={{marginTop:20,fontSize:20,color:'#ef4444'}}>לא נכון</div>}</div>
}

function RG({c,on}){
  const[ph,setPh]=useState('start');const[ts,setTs]=useState([]);const sr=useRef(0);const tr=useRef(null);const rounds=5
  function srnd(){setPh('wait');tr.current=setTimeout(()=>{setPh('go');sr.current=performance.now()},1500+Math.random()*2500)}
  function hc(){if(ph==='start'){setTs([]);srnd()}else if(ph==='wait'){clearTimeout(tr.current);setPh('early')}else if(ph==='go'){const t=Math.round(performance.now()-sr.current);setTs(prev=>[...prev,t]);setPh('result')}else if(ph==='result'||ph==='early'){if(ts.length>=rounds){const avg=ts.reduce((a,b)=>a+b,0)/ts.length;on(Math.max(1,Math.round(500/avg*rounds)),rounds*100)}else{srnd()}}}
  const bg=ph==='wait'?'#ef4444':ph==='go'?'#22c55e':'var(--surface-solid)'
  const tx=ph==='start'?'לחץ כדי להתחיל':ph==='wait'?'חכה...':ph==='go'?'לחץ!':ph==='early'?'מהר מדי!':`זמן: ${ts[ts.length-1]}ms`
  return<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 64px)',padding:24}}><div onClick={hc} style={{width:320,height:320,borderRadius:24,background:bg,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'background 0.15s',boxShadow:'var(--shadow-lg)'}}><span style={{fontSize:28,fontWeight:700,color:ph==='go'?'#064e3b':'white',userSelect:'none'}}>{tx}</span></div><div style={{marginTop:24,color:'var(--text-secondary)'}}>ממוצע: {ts.length?Math.round(ts.reduce((a,b)=>a+b,0)/ts.length)+'ms':'—'} | {ts.length}/{rounds}</div></div>
}

function genP(cfg){
  const{type,difficulty}=cfg
  if(type==='number'){const st=r(1,20),sp=difficulty==='easy'?r(1,5):r(2,9);const sq=[st,st+sp,st+sp*2,st+sp*3];return{sq,ans:st+sp*4,o:sh([st+sp*4,st+sp*4+r(1,3),st+sp*4-r(1,3),st+sp*4+r(4,6)])}}
  if(type==='color'){const st=r(0,5),sp=r(1,2);const sq=[st,(st+sp)%6,(st+sp*2)%6,(st+sp*3)%6];const ans=(st+sp*4)%6;return{sq,ans,o:sh([ans,(ans+1)%6,(ans+2)%6,(ans+3)%6]),mode:'color'}}
  if(type==='shape'){const st=r(0,4);const sq=[st,(st+1)%5,(st+2)%5,(st+3)%5];const ans=(st+4)%5;return{sq,ans,o:sh([ans,(ans+1)%5,(ans+2)%5,(ans+3)%5]),mode:'shape'}}
  if(type==='letter'){const st=r(0,18),sp=difficulty==='easy'?1:r(1,3);const sq=[st,(st+sp)%22,((st+sp*2)%22),((st+sp*3)%22)];const ans=((st+sp*4)%22);return{sq:sq.map(i=>HL[i]),ans:HL[ans],o:sh([HL[ans],HL[(ans+1)%22],HL[(ans+2)%22],HL[(ans+3)%22]])}}
  if(type==='alternating'){const a=r(1,10),b=r(1,10),c=r(1,10);const sq=[a,b,a+c,b+c];const ans=a+c*2;return{sq,ans,o:sh([ans,ans+1,ans-1,ans+2])}}
  if(type==='skip'){const st=r(1,10),sp=difficulty==='easy'?2:r(2,4);const sq=[st,st+sp,st+sp*2,st+sp*3];return{sq,ans:st+sp*4,o:sh([st+sp*4,st+sp*4+1,st+sp*4-1,st+sp*4+2])}}
  if(type==='double'){const a=r(1,5);const sq=[a,a*2,a*3,a*4];const ans=a*5;return{sq,ans,o:sh([ans,ans+a,ans-a,ans+a*2])}}
  if(type==='missing'){const st=r(1,20),sp=r(1,5);const full=[st,st+sp,st+sp*2,st+sp*3,st+sp*4];const mIdx=r(1,3);const sq=full.map((v,i)=>i===mIdx?'?':v);return{sq,ans:full[mIdx],o:sh([full[mIdx],full[mIdx]+1,full[mIdx]-1,full[mIdx]+2])}}
  if(type==='progression'){const st=r(1,10),sp=r(1,5);const sq=[st,st+sp,st+sp*2,st+sp*3];return{sq,ans:st+sp*4,o:sh([st+sp*4,st+sp*4+1,st+sp*4-1,st+sp*4+2])}}
  if(type==='logic'){const a=r(1,9);const sq=[a,a+2,a+4,a+6];return{sq,ans:a+8,o:sh([a+8,a+7,a+9,a+10])}}
  return{sq:[1,2,3,4],ans:5,o:sh([5,4,6,7])}
}
const SM=['■','▲','●','◆','★'];const CM=['#ef4444','#22c55e','#3b82f6','#eab308','#a855f7','#ec4899']

function PG({c,on}){
  const{totalQ=10}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[pt,setPt]=useState(()=>genP(c));const[st,setSt]=useState(false);const[fl,setFl]=useState(null)
  function ha(ans){const cr=ans===pt.ans;if(cr)setSc(s=>s+1);setFl(cr?'g':'b');setTimeout(()=>{setFl(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setPt(genP(c))}},400)}
  if(!st)return<S t="דפוסים" d="השלם את הדפוס" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.pattern}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span></div><div style={{display:'flex',gap:12,justifyContent:'center',margin:'24px 0',flexWrap:'wrap',minHeight:60,alignItems:'center'}}>{pt.sq.map((it,i)=>{const isQ=it==='?';return<div key={i} style={{minWidth:60,height:60,borderRadius:14,background:isQ?'var(--surface)':pt.mode==='color'?CM[it]:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:700,color:'var(--text)',border:'1px solid var(--border)'}}>{pt.mode==='shape'?SM[it]:pt.mode==='color'?'':it}</div>})}</div><div style={{fontSize:20,fontWeight:700,marginBottom:16,color:fl==='g'?'#22c55e':fl==='b'?'#ef4444':'var(--text)'}}>מה המשך הדפוס?</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{pt.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit'}}>{pt.mode==='shape'?SM[o]:pt.mode==='color'?<span style={{display:'inline-block',width:24,height:24,borderRadius:6,background:CM[o]}}/>:o}</button>)}</div></div>
}

function genW(cfg){
  const{difficulty='easy',mode='scramble',length=3}=cfg
  if(mode==='missing'){const w=p(HEBREW_WORDS);const idx=r(0,w.length-1);return{q:w.split('').map((c,i)=>i===idx?' _ ':c).join(''),ans:w[idx],o:sh([w[idx],p(HL),p(HL),p(HL)])}}
  if(mode==='opposite'){const pairs=[['חם','קר'],['יום','לילה'],['גדול','קטן'],['מהר','לאט'],['רע','טוב']];const pr=p(pairs);return{q:`ההפך של ${pr[0]}`,ans:pr[1],o:sh([pr[1],p(HEBREW_WORDS),p(HEBREW_WORDS),p(HEBREW_WORDS)])}}
  if(mode==='beginning'){const letter=p(HL);const correct=p(HEBREW_WORDS.filter(w=>w.startsWith(letter)));return{q:`מילה שמתחילה ב-${letter}`,ans:correct,o:sh([correct,p(HEBREW_WORDS),p(HEBREW_WORDS),p(HEBREW_WORDS)])}}
  if(mode==='ending'){const letter=p(HL);const correct=p(HEBREW_WORDS.filter(w=>w.endsWith(letter)));return{q:`מילה שמסתיימת ב-${letter}`,ans:correct,o:sh([correct,p(HEBREW_WORDS),p(HEBREW_WORDS),p(HEBREW_WORDS)])}}
  if(mode==='anagram'){const words=HEBREW_WORDS.filter(w=>w.length===length);const w=p(words.length?words:HEBREW_WORDS);return{q:sh(w.split('')).join(' '),ans:w,o:sh([w,p(HEBREW_WORDS),p(HEBREW_WORDS),p(HEBREW_WORDS)])}}
  const words=difficulty==='easy'?HEBREW_WORDS.filter(w=>w.length<=4):difficulty==='medium'?HEBREW_WORDS.filter(w=>w.length<=5):HEBREW_WORDS
  const w=p(words);return{q:sh(w.split('')).join(' '),ans:w,o:sh([w,p(words),p(words),p(words)])}
}

function WG({c,on}){
  const{totalQ=12}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[wd,setWd]=useState(()=>genW(c));const[st,setSt]=useState(false);const[fl,setFl]=useState(null)
  function ha(ans){const cr=ans===wd.ans;if(cr)setSc(s=>s+1);setFl(cr?'g':'b');setTimeout(()=>{setFl(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setWd(genW(c))}},400)}
  if(!st)return<S t="מילים" d="פתור חידות מילים בעברית" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.word}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span></div><div style={{fontSize:32,fontWeight:700,margin:'32px 0',minHeight:60,color:fl==='g'?'#22c55e':fl==='b'?'#ef4444':'var(--text)',direction:'rtl'}}>{wd.q}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{wd.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit',direction:'rtl'}}>{o}</button>)}</div></div>
}

function genCC(cfg){
  const names=[['אדום','#ef4444'],['ירוק','#22c55e'],['כחול','#3b82f6'],['צהוב','#eab308'],['סגול','#a855f7'],['ורוד','#ec4899']]
  const{mode}=cfg
  if(mode==='name'){const[n,c]=p(names);return{t:<span style={{color:c,fontSize:48,fontWeight:800}}>{n}</span>,a:n,o:sh(names.map(x=>x[0]))}}
  if(mode==='match'){const[n,c]=p(names);const same=Math.random()>0.5;const sc=same?c:p(names.filter(x=>x[1]!==c))[1];return{t:<span style={{color:sc,fontSize:48,fontWeight:800}}>{n}</span>,a:same?0:1,o:['תואם','לא תואם']}}
  if(mode==='mismatch'){const[n,c]=p(names);const same=Math.random()>0.5;const sc=same?c:p(names.filter(x=>x[1]!==c))[1];return{t:<span style={{color:sc,fontSize:48,fontWeight:800}}>{n}</span>,a:same?1:0,o:['תואם','לא תואם']}}
  return{t:'צבע',a:'אדום',o:['אדום','ירוק']}
}

function CCG({c,on}){
  const{totalQ=15}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[q,setQ]=useState(()=>genCC(c));const[st,setSt]=useState(false);const[fl,setFl]=useState(null)
  function ha(ans){const cr=ans===q.a;if(cr)setSc(s=>s+1);setFl(cr?'g':'b');setTimeout(()=>{setFl(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setQ(genCC(c))}},400)}
  if(!st)return<S t="צבעים" d="זהה צבעים במהירות" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.colorChallenge}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span></div><div style={{minHeight:80,margin:'24px 0',color:fl==='g'?'#22c55e':fl==='b'?'#ef4444':'var(--text)'}}>{q.t}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{q.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit'}}>{o}</button>)}</div></div>
}

function genL(cfg){
  const{mode}=cfg
  if(mode==='truefalse'){const statements=[['2+2=4',true],['5>10',false],['שמש זה כוכב',false],['לילה בא אחרי יום',true],['100 גרם = 1 קילו',false]];const[s,ans]=p(statements);return{q:s,a:ans?0:1,o:['נכון','לא נכון']}}
  if(mode==='heavier'){const items=[['ברזל','כותנה',0],['עופרת','עץ',0],['נוצה','אבן',1],['מים','שמן',1]];const[it,ans]=p(items);return{q:`מי כבד יותר: ${it[0]} או ${it[1]}?`,a:ans,o:[it[0],it[1]]}}
  if(mode==='riddle'){const riddles=[['יש לי 3 תפוחים, לקחתי 2. כמה נשארו?',1],['5+5*0?',5],['האבא בן 30, הבן בן 5. בעוד כמה שנים האבא יהיה פי 4 מהבן?',10],['מה המספר שכפול 3 ועוד 7 שווה 22?',5]];const[rd,ans]=p(riddles);return{q:rd[0],a:ans,o:sh([ans,ans+1,ans-1,ans+2])}}
  if(mode==='approx'){const a=r(10,500),b=r(10,500);const ans=a+b;return{q:`הערך: ${a} + ${b}`,a:ans,o:sh([ans,ans+r(5,20),ans-r(5,20),ans+r(21,40)])}}
  if(mode==='deduction'){const color=p(['אדום','כחול','ירוק']);const object=p(['כדור','ספר','כוס']);return{q:`יש לי ${object} בצבע ${color}. האם זה ${object}?`,a:0,o:['כן','לא']}}
  if(mode==='sort'){const nums=sh([r(1,50),r(1,50),r(1,50),r(1,50)]);const sorted=[...nums].sort((a,b)=>a-b);return{q:`סדר: ${nums.join(', ')}`,a:sorted.join(','),o:sh([sorted.join(','),sh(sorted).join(','),sh(sorted).join(','),sorted.reverse().join(',')])}}
  if(mode==='categorize'){const animals=['כלב','חתול','אריה','דוב'];const fruits=['תפוח','בננה','ענב'];const item=p([...animals,...fruits]);const ans=animals.includes(item)?'חיה':'פרי';return{q:`מה הקטגוריה של ${item}?`,a:ans,o:sh(['חיה','פרי','כלי','צבע'])}}
  return{q:'שאלה',a:0,o:['א','ב']}
}

function LG({c,on}){
  const{totalQ=15}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[q,setQ]=useState(()=>genL(c));const[st,setSt]=useState(false);const[fl,setFl]=useState(null)
  function ha(ans){const cr=ans===q.a;if(cr)setSc(s=>s+1);setFl(cr?'g':'b');setTimeout(()=>{setFl(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setQ(genL(c))}},400)}
  if(!st)return<S t="לוגיקה" d="פתור חידות לוגיות" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.logic}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span></div><div style={{fontSize:24,fontWeight:700,margin:'32px 0',minHeight:60,color:fl==='g'?'#22c55e':fl==='b'?'#ef4444':'var(--text)',direction:'rtl'}}>{q.q}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{q.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit'}}>{o}</button>)}</div></div>
}

function CG({c,on}){
  const{mode='dots',max=12,totalQ=15}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[st,setSt]=useState(false);const[fl,setFl]=useState(null);const[q,setQ]=useState(()=>genC())
  function genC(){if(mode==='dots'){const n=r(3,max);return{q:<div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>{Array.from({length:n},(_,i)=><div key={i} style={{width:20,height:20,borderRadius:'50%',background:'#3b82f6'}}/>)}</div>,a:n,o:sh([n,n+1,n-1,n+2])}}if(mode==='shapes'){const n=r(3,max);return{q:<div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>{Array.from({length:n},(_,i)=><div key={i} style={{fontSize:28}}>{p(['■','▲','●'])}</div>)}</div>,a:n,o:sh([n,n+1,n-1,n+2])}}if(mode==='compare'){const a=r(3,15),b=r(3,15);return{q:<div style={{display:'flex',gap:40,justifyContent:'center',fontSize:32}}><div>{Array.from({length:a},(_,i)=><span key={i}>●</span>)}</div><div>{Array.from({length:b},(_,i)=><span key={i}>●</span>)}</div></div>,a:a>b?0:b>a?1:2,o:sh(['שמאל גדול יותר','ימין גדול יותר','שווים'])}}return{q:'כמה?',a:5,o:[5,4,6,7]}}
  function ha(ans){const cr=ans===q.a;if(cr)setSc(s=>s+1);setFl(cr?'g':'b');setTimeout(()=>{setFl(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setQ(genC())}},600)}
  if(!st)return<S t="ספירה" d="ספור אובייקטים במהירות" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.counting}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span></div><div style={{margin:'24px 0'}}>{q.q}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{q.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit'}}>{o}</button>)}</div></div>
}

function AG({c,on}){
  const{mode='static',targets=10,targetSize=60,duration=30}=c
  const[ph,setPh]=useState('start');const[sc,setSc]=useState(0);const[rem,setRem]=useState(targets);const[time,setTime]=useState(duration);const areaRef=useRef(null)
  const[pos,setPos]=useState({x:50,y:50})
  useEffect(()=>{if(ph!=='play')return;const t=setInterval(()=>setTime(x=>{if(x<=1){setPh('done');return 0}return x-1}),1000);return()=>clearInterval(t)},[ph])
  useEffect(()=>{if(ph!=='play'||mode!=='moving')return;const iv=setInterval(()=>setPos({x:r(10,90),y:r(10,90)}),800);return()=>clearInterval(iv)},[ph,mode])
  function sp(){setSc(0);setRem(targets);setPh('play');setTime(duration);setPos({x:50,y:50})}
  function hit(){setSc(s=>s+1);setRem(r=>r-1);if(rem<=1){setPh('done');on(sc+1,targets)}else if(mode!=='static'){setPos({x:r(10,90),y:r(10,90)})}}
  if(ph==='start')return<S t="אימון מיקוד" d="הקש על המטרות במהירות" on={()=>{setSc(0);setRem(targets);sp()}} diff={getDiff(c)} inst={INSTRUCTIONS.aim}/>
  if(ph==='done')return<div style={{textAlign:'center',padding:40}}><h2>סיום!</h2><p>הקשות: {sc} / {targets}</p><button className="restart-btn" onClick={()=>{setPh('start');setSc(0);setRem(targets)}}>שחק שוב</button></div>
  return<div style={{maxWidth:600,margin:'0 auto',padding:24,position:'relative',height:'60vh',background:'var(--surface)',borderRadius:20,border:'1px solid var(--border)'}} ref={areaRef}>
    <div style={{position:'absolute',top:12,left:12,color:'var(--text-secondary)'}}>נותרו: {rem} | זמן: {time}</div>
    {mode==='static'&&Array.from({length:rem},(_,i)=><button key={i} onClick={hit} style={{position:'absolute',left:`${r(5,85)}%`,top:`${r(10,80)}%`,width:targetSize,height:targetSize,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--accent))',border:'none',cursor:'pointer',boxShadow:'var(--glow-primary)'}}/>)}
    {(mode==='moving'||mode==='tracking')&&<button onClick={hit} style={{position:'absolute',left:`${pos.x}%`,top:`${pos.y}%`,width:targetSize,height:targetSize,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--accent))',border:'none',cursor:'pointer',boxShadow:'var(--glow-primary)',transition:'all 0.3s'}}/>}
  </div>
}

function TG({c,on}){
  const{difficulty='easy',totalWords=12}=c
  const words=difficulty==='easy'?HEBREW_WORDS.filter(w=>w.length<=4):difficulty==='medium'?HEBREW_WORDS.filter(w=>w.length<=5):HEBREW_WORDS
  const[st,setSt]=useState(false);const[sc,setSc]=useState(0);const[qi,setQi]=useState(0);const[ip,setIp]=useState('');const[wd,setWd]=useState(p(words));const[startT,setStartT]=useState(0)
  function nx(){if(ip.trim()===wd){setSc(s=>s+1)}setIp('');if(qi+1>=totalWords){const elapsed=(Date.now()-startT)/1000;const wpm=Math.round((sc+(ip.trim()===wd?1:0))/elapsed*60);on(Math.round(wpm/5),100)}else{setQi(i=>i+1);setWd(p(words))}}
  if(!st)return<S t="הקלדה מהירה" d="הקלד מילים בדיוק ובמהירות" on={()=>{setSt(true);setStartT(Date.now());setSc(0);setQi(0);setIp('');setWd(p(words))}} diff={getDiff(c)} inst={INSTRUCTIONS.typing}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{fontSize:36,fontWeight:700,margin:'40px 0',letterSpacing:4}}>{wd}</div><input autoFocus value={ip} onChange={e=>setIp(e.target.value)} onKeyDown={e=>e.key===' '&&nx()} style={{padding:'14px 20px',fontSize:24,textAlign:'center',borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',fontFamily:'inherit',width:'100%',maxWidth:320,direction:'rtl'}}/><div style={{marginTop:16,color:'var(--text-secondary)'}}>{qi+1}/{totalWords} | נכון: {sc}</div></div>
}

function genF(cfg){
  const{mode='number'}=cfg
  if(mode==='number'){const target=r(1,9);const grid=Array.from({length:20},()=>r(1,9));return{q:<div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,maxWidth:300,margin:'0 auto'}}>{grid.map((n,i)=><div key={i} style={{padding:12,borderRadius:10,background:'var(--surface)',fontSize:20,fontWeight:700,color:n===target?'var(--primary)':'var(--text)'}}>{n}</div>)}</div>,a:target,o:[target,target+1,target-1,target+2]}}
  if(mode==='letter'){const target=p(HL);const grid=Array.from({length:20},()=>p(HL));return{q:<div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,maxWidth:300,margin:'0 auto'}}>{grid.map((n,i)=><div key={i} style={{padding:12,borderRadius:10,background:'var(--surface)',fontSize:20,fontWeight:700,color:n===target?'var(--primary)':'var(--text)'}}>{n}</div>)}</div>,a:target,o:sh([target,p(HL),p(HL),p(HL)])}}
  if(mode==='vigilance'){const target=p(['■','▲','●']);return{q:<div style={{fontSize:24,marginBottom:16}}>לחץ רק על {target}</div>,a:target,o:['■','▲','●']}}
  if(mode==='inhibition'){return{q:<div style={{fontSize:24,marginBottom:16}}>לחץ על כל הצבעים חוץ מאדום</div>,a:1,o:['כן','לא']}}
  return{q:'?',a:0,o:[0,1]}
}

function FG({c,on}){
  const{totalQ=15}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[q,setQ]=useState(()=>genF(c));const[st,setSt]=useState(false);const[fl,setFl]=useState(null)
  function ha(ans){const cr=ans===q.a;if(cr)setSc(s=>s+1);setFl(cr?'g':'b');setTimeout(()=>{setFl(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setQ(genF(c))}},600)}
  if(!st)return<S t="קשב" d="מצא את הפריט המיוחד" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.focusFind}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span></div><div style={{margin:'24px 0'}}>{q.q}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{q.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit'}}>{o}</button>)}</div></div>
}

function SG({c,on}){
  const{length=5,speed=600,reverse=false}=c
  const[ph,setPh]=useState('start');const[sq,setSq]=useState([]);const[ps,setPs]=useState([]);const[sc,setSc]=useState(0);const[rd,setRd]=useState(0);const totalRounds=5
  const cols=['#ef4444','#22c55e','#3b82f6','#eab308']
  function sr(){const s=Array.from({length},()=>r(0,3));setSq(s);setPs([]);setPh('show');let i=0;const iv=setInterval(()=>{setPh(`h-${s[i]}`);i++;if(i>=s.length){clearInterval(iv);setTimeout(()=>setPh('input'),400)}},speed)}
  function hc(idx){if(ph!=='input')return;const nx=[...ps,idx];setPs(nx);if(nx.length===sq.length){let cr;if(reverse){cr=nx.every((v,i)=>v===sq[sq.length-1-i])}else{cr=nx.every((v,i)=>v===sq[i])}if(cr)setSc(s=>s+1);setPh(cr?'correct':'wrong');setTimeout(()=>{if(rd+1>=totalRounds){on(sc+(cr?1:0),totalRounds)}else{setRd(x=>x+1);sr()}},800)}}
  if(ph==='start')return<S t={reverse?"זיכרון הפוך":"זיכרון סדר"} d={`זכור רצף של ${length} צעדים${reverse?' וחזור בסדר הפוך':''}`} on={()=>{setSc(0);setRd(0);sr()}} diff={getDiff(c)} inst={INSTRUCTIONS.sequence}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{color:'var(--text-secondary)',marginBottom:20}}>סיבוב {rd+1}/{totalRounds} | נקודות: {sc}</div>{ph.startsWith('h-')&&<div style={{width:120,height:120,margin:'0 auto',borderRadius:20,background:cols[parseInt(ph.split('-')[1])],transition:'all 0.3s'}}/>}{ph==='show'&&<div style={{width:120,height:120,margin:'0 auto',borderRadius:20,background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-secondary)'}}>שים לב...</div>}{(ph==='input'||ph==='correct'||ph==='wrong')&&<div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,maxWidth:260,margin:'0 auto'}}>{cols.map((c,i)=><button key={i} onClick={()=>hc(i)} style={{width:'100%',aspectRatio:1,borderRadius:16,border:'none',background:c,cursor:ph==='input'?'pointer':'default',opacity:ph==='input'?1:0.5}}/>)}</div>}{ph==='correct'&&<div style={{marginTop:20,fontSize:32,color:'#22c55e',fontWeight:800}}>נכון!</div>}{ph==='wrong'&&<div style={{marginTop:20,fontSize:20,color:'#ef4444'}}>לא נכון</div>}</div>
}

function CMP({c,on}){
  const{totalQ=20}=c
  const[qi,setQi]=useState(0);const[sc,setSc]=useState(0);const[q,setQ]=useState(()=>genCmp());const[st,setSt]=useState(false);const[fl,setFl]=useState(null)
  function genCmp(){const a=r(1,100),b=r(1,100);return{q:`${a}  ?  ${b}`,a:a>b?0:b>a?1:2,o:['A גדול יותר','B גדול יותר','שווים']}}
  function ha(ans){const cr=ans===q.a;if(cr)setSc(s=>s+1);setFl(cr?'g':'b');setTimeout(()=>{setFl(null);if(qi+1>=totalQ){on(sc+(cr?1:0),totalQ)}else{setQi(i=>i+1);setQ(genCmp())}},300)}
  if(!st)return<S t="השוואה מהירה" d="החלט מי גדול יותר" on={()=>setSt(true)} diff={getDiff(c)} inst={INSTRUCTIONS.comparison}/>
  return<div style={{maxWidth:500,margin:'0 auto',padding:24,textAlign:'center'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:16,color:'var(--text-secondary)'}}><span>שאלה {qi+1}/{totalQ}</span><span>נקודות: {sc}</span></div><div style={{fontSize:48,fontWeight:700,margin:'32px 0',color:fl==='g'?'#22c55e':fl==='b'?'#ef4444':'var(--text)'}}>{q.q}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{q.o.map((o,i)=><button key={i} onClick={()=>ha(o)} style={{padding:'18px 12px',fontSize:20,fontWeight:700,borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',cursor:'pointer',fontFamily:'inherit'}}>{o}</button>)}</div></div>
}

export default function MiniGamePage(){
  const{gameId}=useParams()
  const game=miniGames.find(g=>g.id===gameId)
  const[finished,setFinished]=useState(false);const[sc,setSc]=useState(0);const[ms,setMs]=useState(0)
  if(!game||!MINI_GAME_IDS.has(gameId))return<div style={{textAlign:'center',padding:40}}><h2>משחק לא נמצא</h2><Link to="/games">חזרה למשחקים</Link></div>
  if(finished)return<R sc={sc} ms={ms} gid={gameId} on={()=>{setFinished(false);setSc(0);setMs(0)}}/>
  const Template={math:MG,memoryDigits:MDG,memoryColors:MCG,reaction:RG,pattern:PG,word:WG,colorChallenge:CCG,logic:LG,counting:CG,aim:AG,typing:TG,focusFind:FG,sequence:SG,comparison:CMP}[game.template]
  if(!Template)return<div style={{textAlign:'center',padding:40}}><h2>תבנית לא נמצאה</h2></div>
  return<div style={{paddingTop:24}}><Template c={game.config} on={(s,m)=>{addPlays(gameId);setSc(s);setMs(m);setFinished(true)}}/></div>
}

