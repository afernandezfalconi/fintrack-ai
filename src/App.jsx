import { useState, useRef, useEffect, useCallback } from "react";
import {
  CreditCard, TrendingUp, TrendingDown, Plus, X,
  Tag, Calendar, Zap, Send, Paperclip, FileText,
  MessageCircle, LayoutDashboard, Sparkles, Check, CheckCheck,
  Sun, Moon, ArrowDownLeft, Wallet,
  Bell, ChevronRight, AlertTriangle,
  BarChart2, Target, PiggyBank, Clock
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

/* ═══════════════════════════════════════════════════════════════
   FIREBASE — Auth + Firestore
═══════════════════════════════════════════════════════════════ */
const _fbConfig = {
  apiKey: "AIzaSyDvNTAU4ma8NGuv6Gb-a6HKQn6VaGOt-wM",
  authDomain: "finzio-001.firebaseapp.com",
  projectId: "finzio-001",
  storageBucket: "finzio-001.firebasestorage.app",
  messagingSenderId: "797349902468",
  appId: "1:797349902468:web:3aa2a88a11b7902626aad1"
};
const fbApp      = initializeApp(_fbConfig);
const fbAuth     = getAuth(fbApp);
const fbDb       = getFirestore(fbApp);
const fbProvider = new GoogleAuthProvider();

const fbSignIn =  () => signInWithPopup(fbAuth, fbProvider).catch(e=>console.warn("SignIn:",e));
const fbSignOut = () => signOut(fbAuth).catch(e=>console.warn("SignOut:",e));

async function syncToFirestore(uid, data){
  try{ await setDoc(doc(fbDb,"users",uid),{...data,updatedAt:Date.now()},{merge:true}); }
  catch(e){ console.warn("fbSave:",e); }
}
async function loadFromFirestore(uid){
  try{ const s=await getDoc(doc(fbDb,"users",uid)); return s.exists()?s.data():null; }
  catch(e){ console.warn("fbLoad:",e); return null; }
}

/* ═══════════════════════════════════════════════════════════════
   THEME TOKENS
═══════════════════════════════════════════════════════════════ */
const DARK = {
  bg:        "#07070f",
  shell:     "#09090f",
  surface:   "#0e0e1e",
  surface2:  "#13132a",
  border:    "#12122a",
  border2:   "#1e1e34",
  text:      "#e8e8f0",
  textMid:   "#a0a0c0",
  textDim:   "#303050",
  inputBg:   "#111128",
  navBg:     "#09090f",
  headerBg:  "#09090f",
  scrollBar: "#22223a",
  bodyBg:    "#04040a",
  shadow:    "0 0 80px #7c6af710, 0 32px 120px #00000080",
  cardDate:  "#383858",
};
const LIGHT = {
  bg:        "#f0f2f8",
  shell:     "#ffffff",
  surface:   "#f5f6fb",
  surface2:  "#eaecf5",
  border:    "#dde0ef",
  border2:   "#c8ccdf",
  text:      "#1a1a2e",
  textMid:   "#5a5a7a",
  textDim:   "#9090b0",
  inputBg:   "#eef0f8",
  navBg:     "#ffffff",
  headerBg:  "#ffffff",
  scrollBar: "#c0c4dc",
  bodyBg:    "#dde0ef",
  shadow:    "0 0 60px #7c6af718, 0 24px 80px #00000018",
  cardDate:  "#7070a0",
};

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
function GlobalStyles({ th }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500;700&display=swap');
      *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
      html { height:100%; height:100dvh; }
      body {
        background:${th.bg};
        font-family:'Syne',sans-serif;
        color:${th.text};
        height:100%; height:100dvh;
        overflow:hidden;
        -webkit-font-smoothing:antialiased;
        overscroll-behavior:none;
        transition: background 0.3s ease, color 0.3s ease;
      }
      #root { height:100%; display:flex; align-items:stretch; justify-content:center; background:${th.bodyBg}; }
      .app-shell {
        display:flex; flex-direction:column; width:100%; max-width:480px;
        height:100%; height:100dvh; min-height:0; position:fixed;
        top:0; left:0; right:0; bottom:0;
        background:${th.shell}; overflow:hidden;
        transition: background 0.3s ease;
      }
      @supports (height: 100dvh) {
        .app-shell { height: 100dvh; }
      }
      @media(min-width:768px){
        #root { align-items:center; }
        .app-shell {
          position:relative;
          border-left:1px solid ${th.border};
          border-right:1px solid ${th.border};
          box-shadow:${th.shadow};
        }
      }
      .scroll-area { overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch; }
      .scroll-area::-webkit-scrollbar { width:2px; }
      .scroll-area::-webkit-scrollbar-thumb { background:${th.scrollBar}; border-radius:99px; }
      @keyframes spin    { to{transform:rotate(360deg)} }
      @keyframes fadeUp  { from{transform:translateY(10px);opacity:0} to{transform:none;opacity:1} }
      @keyframes slideR  { from{transform:translateX(16px);opacity:0} to{transform:none;opacity:1} }
      @keyframes slideL  { from{transform:translateX(-16px);opacity:0} to{transform:none;opacity:1} }
      @keyframes pop     { 0%{transform:scale(0.88);opacity:0} 60%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
      @keyframes toastIn { from{transform:translateY(12px);opacity:0} to{transform:none;opacity:1} }
      @keyframes typing  { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
      @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
      @keyframes glow    { 0%,100%{box-shadow:0 0 12px #7c6af744} 50%{box-shadow:0 0 24px #7c6af788} }
      @keyframes shakeDot{ 0%,100%{transform:none} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      input[type=date]::-webkit-calendar-picker-indicator { filter:${th === DARK ? 'invert(0.5)' : 'invert(0.3)'}; }
      textarea { resize:none; font-family:'Syne',sans-serif; }
      select,input,button { font-family:'Syne',sans-serif; }
      button { -webkit-tap-highlight-color:transparent; }
      .safe-top    { padding-top: max(env(safe-area-inset-top, 0px), 44px); }
      .safe-bottom { padding-bottom: calc(env(safe-area-inset-bottom, 16px) + 10px); }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA — CREDIT & DEBIT CARDS
═══════════════════════════════════════════════════════════════ */
const CREDIT_CARDS = [];
const DEBIT_CARDS  = [];
const SEED_TXS     = [];

const SEED_CHAT = [{
  id:"m0", role:"assistant", ts:Date.now()-120000, status:"read",
  text:"¡Hola! 👋 Soy tu asistente financiero.\n\nPuedo registrar:\n• Gastos en tarjetas de crédito 💳\n• Ingresos y egresos en débito 🏦\n• Pagos a tu tarjeta de crédito 💰\n• Leer tickets en foto o PDF 📸\n\n¡Cuéntame en qué gastaste!"
}];

/* ═══════════════════════════════════════════════════════════════
   REMINDER SYSTEM
═══════════════════════════════════════════════════════════════ */
const DEFAULT_REMINDER_SETTINGS = {
  enabled: true,
  notifyHour: 9,
  daysBeforeOptions: [1, 3, 7],
  showAmountInNotif: true,
};
const DEFAULT_CARD_REMINDERS = {
  cc1: { enabled:true, cutDay:7,  payDay:14 },
  cc2: { enabled:true, cutDay:10, payDay:17 },
  cc3: { enabled:true, cutDay:15, payDay:22 },
};

function daysUntilPayment(payDay) {
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), payDay);
  if (thisMonth <= today) {
    const next = new Date(today.getFullYear(), today.getMonth()+1, payDay);
    return Math.ceil((next - today) / 86400000);
  }
  return Math.ceil((thisMonth - today) / 86400000);
}
function nextPayDate(payDay) {
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), payDay);
  if (thisMonth <= today) return new Date(today.getFullYear(), today.getMonth()+1, payDay);
  return thisMonth;
}
function urgencyLevel(days) {
  if (days <= 0) return "today";
  if (days <= 3) return "warn";
  if (days <= 7) return "soon";
  return "ok";
}
async function requestNotifPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}
function sendBrowserNotif(title, body, tag) {
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag, icon: "/fintrack-ai/icon.svg" });
  } catch(e) {}
}
function useDailyNotifCheck(creditCards, cardReminders, reminderSettings) {
  useEffect(() => {
    if (!reminderSettings.enabled) return;
    const check = () => {
      const now = new Date();
      if (now.getHours() !== reminderSettings.notifyHour) return;
      if (now.getMinutes() > 5) return;
      creditCards.forEach(card => {
        const cfg = cardReminders[card.id];
        if (!cfg?.enabled) return;
        const days = daysUntilPayment(cfg.payDay);
        const should = days === 0 || reminderSettings.daysBeforeOptions.includes(days);
        if (!should) return;
        const tag = `fintrack-${card.id}-${now.toDateString()}`;
        const title = days === 0
          ? `\uD83D\uDEA8 \u00a1Pago vence HOY! \u2014 ${card.name}`
          : `\u23F0 Pago en ${days} d\u00eda${days>1?"s":""} \u2014 ${card.name}`;
        const body = reminderSettings.showAmountInNotif
          ? `Saldo: ${new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(card.balance)} \u00b7 L\u00edmite: d\u00eda ${cfg.payDay}`
          : `Fecha l\u00edmite: d\u00eda ${cfg.payDay}`;
        sendBrowserNotif(title, body, tag);
      });
    };
    check();
    const id = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [creditCards, cardReminders, reminderSettings]);
}

let _uid = 1000;
const genId = () => String(_uid++);
const fmt   = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n);
const fmtD  = d => new Date(d).toLocaleDateString("es-MX",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
const fmtT  = t => new Date(t).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});
const b64   = b => new Promise((res,rej)=>{ const r=new FileReader(); r.onloadend=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(b); });


/* ═══════════════════════════════════════════════════════════════
   CATEGORÍAS
═══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {id:"food",      label:"Comida",        emoji:"🍔", color:"#f5a623"},
  {id:"transport", label:"Transporte",    emoji:"🚗", color:"#4a90e2"},
  {id:"entertain", label:"Entretenimiento",emoji:"🎬",color:"#e91e8c"},
  {id:"health",    label:"Salud",         emoji:"🏥", color:"#6abf69"},
  {id:"shopping",  label:"Compras",       emoji:"🛍️", color:"#7c6af7"},
  {id:"services",  label:"Servicios",     emoji:"💡", color:"#00bcd4"},
  {id:"education", label:"Educación",     emoji:"📚", color:"#ff9800"},
  {id:"savings",   label:"Ahorro",        emoji:"💰", color:"#34d5b0"},
  {id:"other",     label:"Otro",          emoji:"📌", color:"#888"},
];
const catById = id => CATEGORIES.find(c=>c.id===id) || CATEGORIES[CATEGORIES.length-1];

/* ═══════════════════════════════════════════════════════════════
   CLAUDE API
═══════════════════════════════════════════════════════════════ */
const SYSTEM = `Eres Finzio, un asistente financiero personal inteligente.

REGLAS:
1. Detecta transacciones y responde con JSON al FINAL del mensaje:
   [TRANSACTIONS]
   [{"amount":123.45,"description":"desc","type":"expense","category":"food","cardHint":""}]
   [/TRANSACTIONS]
2. Múltiples items en un ticket → un objeto por item.
3. Imagen/PDF de ticket → extrae TODOS los artículos con precios.
4. Solo conversación → responde normalmente, sin bloque JSON.
5. Respuestas cortas y con emojis. amount siempre positivo.
6. type: "expense" para gastos, "income" para ingresos/depósitos, "payment" para pagos a tarjeta de crédito.
7. category: asigna SIEMPRE una categoría según el gasto:
   - "food" → restaurantes, comida, supermercado, cafetería, delivery
   - "transport" → uber, taxi, gasolina, metro, transporte, caseta
   - "entertain" → netflix, spotify, cine, juegos, streaming, suscripciones
   - "health" → farmacia, médico, hospital, gym, laboratorio
   - "shopping" → ropa, amazon, tienda, liverpool, mercado libre
   - "services" → luz, agua, internet, teléfono, renta, cfe, telmex
   - "education" → escuela, colegio, curso, libro, universidad
   - "savings" → ahorro, inversión, transferencia personal
   - "other" → cualquier cosa que no encaje arriba
Las tarjetas disponibles se indican en cada mensaje del usuario.`;

async function callClaude(messages) {
  try{
  const _k=["sk-ant-api","03-gC1rL_OG9kd2apVOe6GgVrI-IoxNzjpt-Od3SGhZLPXRAU5T00mSTwGl","_eseFDribBkWN7WxbK1J6-ePUUf5kA-y8_I9wAA"];
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key":_k.join(""),
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true",
    },
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:SYSTEM, messages })
  });
  if(!r.ok) throw new Error("API "+r.status);
  const d = await r.json();
  return d.content.map(b=>b.text||"").join("");
  }catch(e){throw e;}
}

const parseTxs    = t => { const m=t.match(/\[TRANSACTIONS\]([\s\S]*?)\[\/TRANSACTIONS\]/); if(!m) return []; try{ return JSON.parse(m[1].trim()); }catch{ return []; } };
const stripTxBlock= t => t.replace(/\[TRANSACTIONS\][\s\S]*?\[\/TRANSACTIONS\]/,"").trim();

/* ═══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
function useToast(){
  const [toasts,set]=useState([]);
  const add=useCallback((msg,type="info")=>{
    const id=genId(); set(p=>[...p,{id,msg,type}]);
    setTimeout(()=>set(p=>p.filter(t=>t.id!==id)),3500);
  },[]);
  return {toasts,add};
}
function Toasts({toasts}){
  return(
    <div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:6,alignItems:"center",pointerEvents:"none",maxWidth:320,width:"90%"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          background:t.type==="error"?"#e03030":t.type==="success"?"#00a866":t.type==="info"?"#7c6af7":"#1c1c2e",
          color:"#fff",padding:"9px 18px",borderRadius:99,fontSize:12,
          fontFamily:"'JetBrains Mono',monospace",fontWeight:600,
          boxShadow:"0 8px 24px #0009",animation:"toastIn 0.25s ease",textAlign:"center",
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CARD CHIP SVG
═══════════════════════════════════════════════════════════════ */
function CardChip(){
  return(
    <svg width="28" height="21" viewBox="0 0 28 21" fill="none">
      <rect width="28" height="21" rx="3" fill="#ffffff14"/>
      <rect x="1" y="7" width="26" height="7" fill="#ffffff08"/>
      <rect x="10" y="1" width="8" height="19" rx="1" fill="#ffffff08"/>
      <rect x="0.5" y="0.5" width="27" height="20" rx="2.5" stroke="#ffffff18"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CREDIT CARD VISUAL
═══════════════════════════════════════════════════════════════ */
function CreditCardVisual({card,selected,onClick}){
  const pct=Math.min((card.balance/card.limit)*100,100);
  return(
    <div onClick={onClick} style={{
      background:`linear-gradient(145deg,${card.color} 0%,${card.accent}18 100%)`,
      border:`2px solid ${selected?card.accent:"#1c1c2c"}`,
      borderRadius:20,padding:"18px 20px",cursor:"pointer",
      flexShrink:0,width:228,
      transition:"all 0.22s ease",
      boxShadow:selected?`0 0 28px ${card.accent}44,0 12px 40px #00000060`:"0 4px 20px #00000040",
      transform:selected?"translateY(-3px) scale(1.01)":"scale(0.97)",
      position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:-30,right:-30,width:90,height:90,background:card.accent+"08",borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div style={{fontSize:9,color:card.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:1.5}}>{card.name.toUpperCase()}</div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:8,color:"#ffffff44",fontFamily:"'JetBrains Mono',monospace",background:"#ffffff10",padding:"2px 6px",borderRadius:4}}>CRÉDITO</span>
          <CardChip/>
        </div>
      </div>
      <div style={{fontSize:20,fontWeight:800,color:"#fff",letterSpacing:-0.5,marginBottom:1}}>{fmt(card.balance)}</div>
      <div style={{fontSize:9,color:"#ffffff38",fontFamily:"'JetBrains Mono',monospace",marginBottom:10}}>saldo utilizado de {fmt(card.limit)}</div>
      <div style={{height:2,background:"#ffffff14",borderRadius:1,marginBottom:4}}>
        <div style={{height:"100%",width:`${pct}%`,background:card.accent,borderRadius:1,transition:"width 0.5s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:8,color:"#ffffff33",fontFamily:"'JetBrains Mono',monospace"}}>UTILIZADO {pct.toFixed(0)}%</span>
        <span style={{fontSize:8,color:card.accent+"cc",fontFamily:"'JetBrains Mono',monospace"}}>DISPONIBLE {fmt(card.available)}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEBIT CARD VISUAL
═══════════════════════════════════════════════════════════════ */
function DebitCardVisual({card,selected,onClick}){
  return(
    <div onClick={onClick} style={{
      background:`linear-gradient(145deg,${card.color} 0%,${card.accent}18 100%)`,
      border:`2px solid ${selected?card.accent:"#1c1c2c"}`,
      borderRadius:20,padding:"18px 20px",cursor:"pointer",
      flexShrink:0,width:228,
      transition:"all 0.22s ease",
      boxShadow:selected?`0 0 28px ${card.accent}44,0 12px 40px #00000060`:"0 4px 20px #00000040",
      transform:selected?"translateY(-3px) scale(1.01)":"scale(0.97)",
      position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:-30,right:-30,width:90,height:90,background:card.accent+"08",borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div style={{fontSize:9,color:card.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:1.5}}>{card.name.toUpperCase()}</div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:8,color:"#ffffff44",fontFamily:"'JetBrains Mono',monospace",background:"#ffffff10",padding:"2px 6px",borderRadius:4}}>DÉBITO</span>
          <Wallet size={14} color={card.accent+"aa"}/>
        </div>
      </div>
      <div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:-0.5,marginBottom:4}}>{fmt(card.balance)}</div>
      <div style={{fontSize:9,color:"#ffffff44",fontFamily:"'JetBrains Mono',monospace"}}>SALDO DISPONIBLE</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAYMENT MODAL (for credit cards)
═══════════════════════════════════════════════════════════════ */
function PaymentModal({card,th,onPay,onClose}){
  const [amount,setAmount]=useState("");
  const [note,setNote]=useState("Pago tarjeta de crédito");
  const maxPay=card.balance;
  const inp={
    background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,
    padding:"9px 12px",color:th.text,fontFamily:"'JetBrains Mono',monospace",
    fontSize:13,width:"100%",outline:"none",
  };
  const doMin=()=>setAmount(String(Math.min(500,maxPay)));
  const doAll=()=>setAmount(String(maxPay));

  return(
    <div style={{position:"fixed",inset:0,background:"#00000090",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:800}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:th.shell,borderRadius:"24px 24px 0 0",padding:"20px 20px 32px",width:"100%",maxWidth:480,boxShadow:"0 -20px 60px #000c",animation:"fadeUp 0.3s ease"}}>
        <div style={{width:36,height:4,background:th.border2,borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <span style={{fontWeight:800,fontSize:16,color:th.text}}>💳 Pagar tarjeta</span>
            <div style={{fontSize:11,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{card.name} · Saldo: {fmt(card.balance)}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:th.textMid,cursor:"pointer"}}><X size={18}/></button>
        </div>

        {/* Quick amounts */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[{l:"Mínimo",fn:doMin},{l:"Total",fn:doAll}].map(({l,fn})=>(
            <button key={l} onClick={fn} style={{flex:1,padding:"7px 0",borderRadius:10,border:`1px solid ${th.border2}`,background:th.surface2,color:"#7c6af7",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700}}>{l}</button>
          ))}
          <button onClick={()=>setAmount(String(Math.round(card.balance*0.5)))} style={{flex:1,padding:"7px 0",borderRadius:10,border:`1px solid ${th.border2}`,background:th.surface2,color:"#7c6af7",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700}}>50%</button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>MONTO A PAGAR (MXN)</div>
            <input type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} style={{...inp}} autoFocus/>
          </div>
          <div>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>CONCEPTO</div>
            <input type="text" value={note} onChange={e=>setNote(e.target.value)} style={{...inp}}/>
          </div>
          <button
            onClick={()=>{
              const amt=parseFloat(amount);
              if(!amt||amt<=0||amt>maxPay) return;
              onPay(amt,note);
            }}
            style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:12,padding:"13px",color:"#fff",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:4}}>
            ✓ Registrar pago {amount?fmt(parseFloat(amount)||0):""}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUICK ADD MODAL
═══════════════════════════════════════════════════════════════ */
function QuickAdd({cards,activeCard,cardMode,th,onAdd,onClose}){
  // For credit: only expense. For debit: expense or income.
  const initType = cardMode==="credit"?"expense":"expense";
  const [form,setForm]=useState({
    cardId:activeCard?.id||cards[0]?.id,
    amount:"",description:"",
    type:initType,
    date:new Date().toISOString().slice(0,10)
  });
  const inp={background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontFamily:"'JetBrains Mono',monospace",fontSize:12,width:"100%",outline:"none"};
  const sub=e=>{ e.preventDefault(); if(!form.amount||!form.description) return; onAdd({...form,amount:parseFloat(form.amount),date:new Date(form.date).toISOString()}); };

  const typeOptions = cardMode==="credit"
    ? [{v:"expense",l:"− Gasto"}]
    : [{v:"expense",l:"− Egreso"},{v:"income",l:"+ Ingreso"}];

  return(
    <div style={{position:"fixed",inset:0,background:"#00000090",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:800}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:th.shell,borderRadius:"24px 24px 0 0",padding:"20px 20px 32px",width:"100%",maxWidth:480,boxShadow:"0 -20px 60px #000c",animation:"fadeUp 0.3s ease"}}>
        <div style={{width:36,height:4,background:th.border2,borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:800,fontSize:16,color:th.text}}>Agregar manual</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:th.textMid,cursor:"pointer"}}><X size={18}/></button>
        </div>
        <form onSubmit={sub} style={{display:"flex",flexDirection:"column",gap:11}}>
          {typeOptions.length>1&&(
            <div style={{display:"flex",gap:8}}>
              {typeOptions.map(({v,l})=>(
                <button type="button" key={v} onClick={()=>setForm(p=>({...p,type:v}))} style={{flex:1,padding:"8px",borderRadius:10,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,border:"none",background:form.type===v?(v==="expense"?"#ff404028":"#00c37a28"):th.surface2,color:form.type===v?(v==="expense"?"#ff6060":"#00c37a"):th.textDim}}>
                  {l}
                </button>
              ))}
            </div>
          )}
          {/* Category chips */}
          {form.type==="expense"&&(
            <div>
              <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>CATEGORÍA</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {CATEGORIES.filter(c=>c.id!=="savings").map(c=>(
                  <button type="button" key={c.id} onClick={()=>setForm(p=>({...p,category:c.id}))}
                    style={{padding:"4px 9px",borderRadius:8,border:`1px solid ${form.category===c.id?c.color:th.border2}`,
                      background:form.category===c.id?c.color+"22":"transparent",
                      color:form.category===c.id?c.color:th.textDim,
                      fontSize:11,cursor:"pointer",fontWeight:form.category===c.id?700:400}}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {[
            {l:"TARJETA",e:<select value={form.cardId} onChange={e=>setForm(p=>({...p,cardId:e.target.value}))} style={{...inp,cursor:"pointer"}}>{cards.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>},
            {l:"MONTO",e:<input type="number" placeholder="0.00" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={{...inp}} required/>},
            {l:"DESCRIPCIÓN",e:<input type="text" placeholder="¿Qué fue?" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={{...inp}} required/>},
            {l:"FECHA",e:<input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={{...inp}}/>},
          ].map(({l,e})=>(
            <div key={l}>
              <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>{l}</div>
              {e}
            </div>
          ))}
          <button type="submit" style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:12,padding:"12px",color:"#fff",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:4}}>Registrar</button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAT BUBBLES
═══════════════════════════════════════════════════════════════ */
function TypingDots({th}){
  return(
    <div style={{display:"flex",gap:8,alignItems:"flex-end",animation:"slideL 0.2s ease"}}>
      <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Sparkles size={12} color="#fff"/></div>
      <div style={{background:th.surface2,border:`1px solid ${th.border}`,borderRadius:"16px 16px 16px 4px",padding:"11px 14px",display:"flex",gap:4,alignItems:"center"}}>
        {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#7c6af7",animation:`typing 1.2s ease ${i*0.2}s infinite`}}/>)}
      </div>
    </div>
  );
}

function TxConfirm({txs,cards,th,onConfirm,activeCard}){
  const [sel,setSel]=useState(()=>txs.map(()=>activeCard?.id||cards[0]?.id));
  return(
    <div style={{background:th.surface,border:"1px solid #7c6af733",borderRadius:14,padding:14,marginTop:8}}>
      <div style={{fontSize:10,color:"#7c6af7",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:1,marginBottom:10}}>TRANSACCIONES DETECTADAS</div>
      {txs.map((tx,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
          <span style={{
            background:tx.type==="income"?"#00c37a18":tx.type==="payment"?"#7c6af718":"#ff404018",
            border:`1px solid ${tx.type==="income"?"#00c37a44":tx.type==="payment"?"#7c6af744":"#ff404044"}`,
            color:tx.type==="income"?"#00c37a":tx.type==="payment"?"#7c6af7":"#ff6060",
            borderRadius:8,padding:"3px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,flexShrink:0,
          }}>{tx.type==="income"?"+":tx.type==="payment"?"💳":"-"}{fmt(tx.amount)}</span>
          <span style={{flex:1,fontSize:12,color:th.textMid,minWidth:80}}>
            {tx.category&&tx.category!=="other"?<span style={{marginRight:4}}>{catById(tx.category).emoji}</span>:null}
            {tx.description}
          </span>
          <select value={sel[i]} onChange={e=>{const n=[...sel];n[i]=e.target.value;setSel(n);}} style={{background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:8,color:th.text,padding:"4px 6px",fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer"}}>
            {cards.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      ))}
      <button onClick={()=>onConfirm(txs,sel)} style={{width:"100%",background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:10,padding:"10px",color:"#fff",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:12,cursor:"pointer",marginTop:6}}>✓ Confirmar y registrar</button>
    </div>
  );
}

function Bubble({msg,cards,th,onConfirm,activeCard}){
  const isU=msg.role==="user";
  const allCards=[...cards.credit,...cards.debit];
  return(
    <div style={{display:"flex",gap:8,alignItems:"flex-end",justifyContent:isU?"flex-end":"flex-start",animation:isU?"slideR 0.22s ease":"slideL 0.22s ease",marginBottom:2}}>
      {!isU&&<div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Sparkles size={12} color="#fff"/></div>}
      <div style={{maxWidth:"78%"}}>
        {msg.attachment&&(
          <div style={{marginBottom:4,borderRadius:12,overflow:"hidden",border:`1px solid ${th.border2}`}}>
            {msg.attachment.type==="image"
              ?<img src={msg.attachment.preview} alt="ticket" style={{width:"100%",maxHeight:180,objectFit:"cover",display:"block"}}/>
              :<div style={{background:th.surface2,padding:"9px 12px",display:"flex",gap:6,alignItems:"center",color:th.textMid,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}><FileText size={14} color="#7c6af7"/>{msg.attachment.name}</div>
            }
          </div>
        )}
        {msg.isVoice&&(
          <div style={{background:isU?"linear-gradient(135deg,#7c6af7,#5a4fd6)":th.surface2,border:isU?"none":`1px solid ${th.border}`,borderRadius:isU?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"9px 13px",display:"flex",alignItems:"center",gap:10,marginBottom:msg.text?4:0}}>
            <Volume2 size={13} color={isU?"#fff":"#7c6af7"}/>
            <div style={{flex:1,height:2,background:isU?"#ffffff44":th.border2,borderRadius:1,position:"relative"}}>
              <div style={{position:"absolute",inset:0,width:"60%",background:isU?"#fff":"#7c6af7",borderRadius:1}}/>
            </div>
            <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:isU?"#ffffffcc":th.textDim}}>{msg.voiceDuration||"0:00"}</span>
          </div>
        )}
        {msg.text&&(
          <div style={{background:isU?"linear-gradient(135deg,#7c6af7,#5a4fd6)":th.surface2,border:isU?"none":`1px solid ${th.border}`,borderRadius:isU?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",color:isU?"#fff":th.text,fontSize:13,lineHeight:1.55,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{msg.text}</div>
        )}
        {msg.pendingTxs?.length>0&&!msg.confirmed&&(
          <TxConfirm txs={msg.pendingTxs} cards={allCards} th={th} onConfirm={onConfirm} activeCard={activeCard}/>
        )}
        {msg.confirmed&&<div style={{fontSize:10,color:"#00c37a",fontFamily:"'JetBrains Mono',monospace",marginTop:3,paddingLeft:2}}>✓ Registrado</div>}
        <div style={{display:"flex",alignItems:"center",gap:3,justifyContent:isU?"flex-end":"flex-start",marginTop:3,paddingLeft:2}}>
          <span style={{fontSize:9,color:th.cardDate,fontFamily:"'JetBrains Mono',monospace"}}>{fmtT(msg.ts)}</span>
          {isU&&(msg.status==="sent"?<Check size={9} color={th.cardDate}/>:<CheckCheck size={9} color="#7c6af7"/>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAT VIEW
═══════════════════════════════════════════════════════════════ */
function ChatView({cards,activeCard,th,onAddTx}){
  const [msgs,setMsgs]=useState(SEED_CHAT);
  const [input,setInput]=useState("");
  const [thinking,setTk]=useState(false);
  const [att,setAtt]=useState(null);
  const bottomRef=useRef(null),fileRef=useRef(null);
  const {toasts,add:toast}=useToast();
  const allCards=[...cards.credit,...cards.debit];

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,thinking]);

  const confirm=useCallback((txs,cardIds,msgId)=>{
    txs.forEach((tx,i)=>onAddTx({cardId:cardIds[i],amount:tx.amount,description:tx.description,type:tx.type,category:tx.category||"other",date:new Date().toISOString()}));
    setMsgs(p=>p.map(m=>m.id===msgId?{...m,confirmed:true}:m));
    toast(`✓ ${txs.length} transacción${txs.length>1?"es":""} registrada${txs.length>1?"s":""}!`,"success");
  },[onAddTx,toast]);

  const sendClaude=async(text,userAtt)=>{
    setTk(true);
    const history=msgs.slice(-10).map(m=>({role:m.role,content:m.role==="user"?m.rawContent||m.text:stripTxBlock(m.text)||m.text||"..."}));
    let content=[];
    if(userAtt){
      if(userAtt.type==="image") content.push({type:"image",source:{type:"base64",media_type:userAtt.mimeType,data:userAtt.base64}});
      else content.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:userAtt.base64}});
    }
    if(text) content.push({type:"text",text});
    if(!content.length) content=[{type:"text",text:"(adjunto)"}];
    try{
      const reply=await callClaude([...history,{role:"user",content}]);
      const ptxs=parseTxs(reply),dtext=stripTxBlock(reply),bid=genId();
      setMsgs(p=>[...p,{id:bid,role:"assistant",text:dtext,pendingTxs:ptxs.length?ptxs:undefined,ts:Date.now(),status:"read"}]);
    }catch(e){
      setMsgs(p=>[...p,{id:genId(),role:"assistant",text:"Error al procesar. Intenta de nuevo 😕",ts:Date.now(),status:"read"}]);
    }finally{setTk(false);}
  };

  const send=async()=>{
    const t=input.trim(); if(!t&&!att) return;
    const uid=genId();
    setMsgs(p=>[...p,{id:uid,role:"user",text:t||(att?.type==="image"?"📷 Ticket adjunto":"📄 PDF adjunto"),rawContent:t,attachment:att?{type:att.type,preview:att.preview,name:att.name}:undefined,ts:Date.now(),status:"sent"}]);
    const a=att; setInput(""); setAtt(null);
    await sendClaude(t,a);
    setMsgs(p=>p.map(m=>m.id===uid?{...m,status:"read"}:m));
  };

  const handleFile=async(e)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const isImg=f.type.startsWith("image/"),isPdf=f.type==="application/pdf";
    if(!isImg&&!isPdf){toast("Solo imagen o PDF","error");return;}
    if(f.size>10*1024*1024){toast("Máx 10MB","error");return;}
    const bdata=await b64(f);
    setAtt({type:isImg?"image":"pdf",base64:bdata,mimeType:f.type,name:f.name,preview:isImg?URL.createObjectURL(f):null});
    e.target.value="";
  };


  const onKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0,background:th.shell}}>
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0,background:th.headerBg}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Sparkles size={16} color="#fff"/>
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:th.text}}>Asistente Finzio</div>
          <div style={{fontSize:10,color:"#34d5b0",fontFamily:"'JetBrains Mono',monospace",display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#34d5b0",display:"inline-block",animation:"pulse 2s ease infinite"}}/>
            en línea
          </div>
        </div>
      </div>

      <div className="scroll-area" style={{flex:1,padding:"16px 14px",display:"flex",flexDirection:"column",gap:6}}>
        {msgs.map(m=><Bubble key={m.id} msg={m} cards={cards} th={th} activeCard={activeCard} onConfirm={(txs,ids)=>confirm(txs,ids,m.id)}/>)}
        {thinking&&<TypingDots th={th}/>}
        <div ref={bottomRef}/>
      </div>

      {att&&(
        <div style={{padding:"7px 14px",borderTop:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:8,background:th.surface,flexShrink:0}}>
          {att.type==="image"
            ?<img src={att.preview} alt="" style={{width:44,height:44,objectFit:"cover",borderRadius:8,border:`1px solid ${th.border2}`}}/>
            :<div style={{background:th.surface2,borderRadius:8,padding:"7px 10px",display:"flex",gap:5,alignItems:"center",color:th.textMid,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}><FileText size={13} color="#7c6af7"/>{att.name}</div>
          }
          <button onClick={()=>setAtt(null)} style={{background:"none",border:"none",color:th.textDim,cursor:"pointer",marginLeft:"auto"}}><X size={15}/></button>
        </div>
      )}

      <div style={{padding:"10px 12px",borderTop:`1px solid ${th.border}`,display:"flex",gap:8,alignItems:"flex-end",background:th.navBg,flexShrink:0}} className="safe-bottom">
        <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} style={{display:"none"}}/>
        <button onClick={()=>fileRef.current?.click()} style={{width:38,height:38,borderRadius:12,background:th.surface2,border:`1px solid ${th.border2}`,color:"#7c6af7",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Paperclip size={15}/>
        </button>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey}
          placeholder="Escribe un gasto o sube un ticket…" rows={1}
          style={{flex:1,background:th.surface2,border:`1px solid ${th.border2}`,borderRadius:14,padding:"9px 12px",color:th.text,fontSize:13,outline:"none",lineHeight:1.45,maxHeight:90,overflowY:"auto"}}
        />
        <button onClick={send} disabled={thinking||(!input.trim()&&!att)} style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:(thinking||(!input.trim()&&!att))?0.4:1}}>
          <Send size={15}/>
        </button>
      </div>
      <Toasts toasts={toasts}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REMINDER BANNER (in-app top alert)
═══════════════════════════════════════════════════════════════ */
function ReminderBanner({creditCards, cardReminders, th, onDismiss, onGoTo}) {
  const urgent = creditCards.filter(card => {
    const cfg = cardReminders[card.id];
    if (!cfg?.enabled) return false;
    return daysUntilPayment(cfg.payDay) <= 3;
  }).map(card => ({
    card,
    cfg: cardReminders[card.id],
    days: daysUntilPayment(card.id in cardReminders ? cardReminders[card.id].payDay : 0)
  })).sort((a,b) => a.days - b.days);

  if (!urgent.length) return null;
  const top = urgent[0];
  const isToday = top.days <= 0;
  const color = isToday ? "#ff6060" : top.days <= 3 ? "#f5a623" : "#7c6af7";
  const bgColor = isToday ? "#ff404018" : top.days <= 3 ? "#f5a62318" : "#7c6af718";

  return (
    <div style={{
      margin:"10px 14px 0",
      background:bgColor,
      border:`1px solid ${color}44`,
      borderRadius:14,
      padding:"10px 12px",
      display:"flex", gap:10, alignItems:"center",
      animation:"fadeUp 0.3s ease",
      position:"relative", overflow:"hidden",
      cursor:"pointer",
    }} onClick={()=>onGoTo(top.card)}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:color,borderRadius:2}}/>
      <div style={{fontSize:18, flexShrink:0, marginLeft:4}}>
        {isToday ? "🚨" : "⏰"}
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontWeight:700, fontSize:12, color:th.text}}>
          {isToday ? "¡Pago vence HOY!" : `Pago en ${top.days} día${top.days>1?"s":""}`}
          {" — "}<span style={{color}}>{top.card.name}</span>
        </div>
        <div style={{fontSize:10, color:th.textDim, fontFamily:"'JetBrains Mono',monospace", marginTop:1}}>
          Saldo: {fmt(top.card.balance)} · Límite: día {top.cfg.payDay}
        </div>
      </div>
      <button onClick={e=>{e.stopPropagation();onDismiss();}} style={{background:"none",border:"none",color:th.textDim,cursor:"pointer",padding:2,flexShrink:0}}>
        <X size={14}/>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESET DIALOG — double confirmation
═══════════════════════════════════════════════════════════════ */
function ResetDialog({th, onCancel, onConfirm}){
  const [step,setStep]=useState(1);

  if(step===1) return(
    <div style={{position:"fixed",inset:0,background:"#00000095",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9500,padding:24}}>
      <div style={{background:th.shell,border:`1px solid #ff606044`,borderRadius:24,padding:"28px 24px",width:"100%",maxWidth:340,animation:"pop 0.25s ease",boxShadow:"0 24px 80px #000c"}}>
        <div style={{width:52,height:52,borderRadius:16,background:"#ff404020",border:"1px solid #ff606044",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <AlertTriangle size={24} color="#ff6060"/>
        </div>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontWeight:800,fontSize:17,color:th.text,marginBottom:8}}>¿Borrar todo?</div>
          <div style={{fontSize:13,color:th.textMid,lineHeight:1.6}}>
            Esto eliminará <span style={{color:"#ff6060",fontWeight:700}}>todas tus tarjetas, transacciones y configuración</span>. La app volverá al estado inicial.
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${th.border2}`,background:th.surface2,color:th.textMid,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            Cancelar
          </button>
          <button onClick={()=>setStep(2)} style={{flex:1,padding:"12px",borderRadius:12,border:"1px solid #ff606044",background:"#ff404028",color:"#ff6060",fontWeight:700,fontSize:13,cursor:"pointer"}}>
            Sí, borrar
          </button>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,background:"#00000099",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9500,padding:24}}>
      <div style={{background:th.shell,border:`2px solid #ff6060`,borderRadius:24,padding:"28px 24px",width:"100%",maxWidth:340,animation:"pop 0.2s ease",boxShadow:"0 24px 80px #ff606020"}}>
        <div style={{width:52,height:52,borderRadius:16,background:"#ff404040",border:"2px solid #ff6060",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",animation:"glow 1s ease infinite"}}>
          <AlertTriangle size={24} color="#ff6060"/>
        </div>
        <div style={{textAlign:"center",marginBottom:8}}>
          <div style={{fontWeight:800,fontSize:17,color:"#ff6060",marginBottom:8}}>¿Estás REALMENTE seguro?</div>
          <div style={{fontSize:12,color:th.textMid,lineHeight:1.6,marginBottom:6}}>
            No hay vuelta atrás. Una vez borrado,
          </div>
          <div style={{fontSize:13,fontWeight:700,color:"#ff6060",fontFamily:"'JetBrains Mono',monospace",background:"#ff404018",border:"1px solid #ff606044",borderRadius:8,padding:"8px 12px",marginBottom:16}}>
            ⚠️ TODO SE PERDERÁ PARA SIEMPRE
          </div>
          <div style={{fontSize:11,color:th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>
            Tarjetas · Transacciones · PIN · Configuración
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={onCancel} style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${th.border2}`,background:th.surface2,color:th.textMid,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            No, cancelar
          </button>
          <button onClick={onConfirm} style={{flex:1,padding:"12px",borderRadius:12,border:"2px solid #ff6060",background:"#ff404030",color:"#ff6060",fontWeight:800,fontSize:13,cursor:"pointer"}}>
            Sí, BORRAR TODO
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS VIEW (full screen panel)
═══════════════════════════════════════════════════════════════ */
function NotificationsView({creditCards, cardReminders, setCardReminders, reminderSettings, setReminderSettings, th, onBack}) {
  const [showReset, setShowReset] = useState(false);
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const requestPerm = async () => {
    const ok = await requestNotifPermission();
    setNotifPerm(ok ? "granted" : "denied");
  };

  const tog = (key, val) => setReminderSettings(p => ({...p, [key]: val}));
  const toggleDay = d => {
    setReminderSettings(p => {
      const cur = p.daysBeforeOptions;
      return {...p, daysBeforeOptions: cur.includes(d) ? cur.filter(x=>x!==d) : [...cur, d].sort((a,b)=>a-b)};
    });
  };
  const toggleCard = id => setCardReminders(p => ({...p, [id]: {...p[id], enabled: !p[id]?.enabled}}));
  const updateDay = (id, field, val) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 1 || num > 31) return;
    setCardReminders(p => ({...p, [id]: {...p[id], [field]: num}}));
  };

  const inp = {background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:8,padding:"5px 8px",color:th.text,fontFamily:"'JetBrains Mono',monospace",fontSize:12,width:48,outline:"none",textAlign:"center"};

  const urgColors = {today:"#ff6060", warn:"#f5a623", soon:"#7c6af7", ok:"#34d5b0"};

  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0,background:th.bg}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0,background:th.headerBg}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:th.textMid,cursor:"pointer",display:"flex",alignItems:"center"}}><ChevronRight size={18} style={{transform:"rotate(180deg)"}}/></button>
        <Bell size={16} color="#7c6af7"/>
        <span style={{fontWeight:700,fontSize:15,color:th.text}}>Recordatorios de pago</span>
      </div>

      <div className="scroll-area" style={{flex:1,padding:"16px",display:"flex",flexDirection:"column",gap:14}}>

        {/* ── Próximos vencimientos ── */}
        <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:2,marginBottom:-6}}>PRÓXIMOS VENCIMIENTOS</div>
        {creditCards.map(card => {
          const cfg = cardReminders[card.id];
          if (!cfg) return null;
          const days = daysUntilPayment(cfg.payDay);
          const urg = urgencyLevel(days);
          const c = urgColors[urg];
          const pd = nextPayDate(cfg.payDay);
          const dateStr = pd.toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"});
          return (
            <div key={card.id} style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,animation:"fadeUp 0.3s ease"}}>
              <div style={{width:10,height:10,borderRadius:3,background:card.accent,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,color:th.text}}>{card.name}</div>
                <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{dateStr} · Saldo: {fmt(card.balance)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,color:c}}>{fmt(card.balance)}</div>
                <div style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:99,background:c+"18",border:`1px solid ${c}44`,fontSize:9,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:c,marginTop:3}}>
                  {days<=0?"HOY":days===1?"MAÑANA":`${days} DÍAS`}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Permiso notificaciones ── */}
        {notifPerm !== "granted" && (
          <div style={{background:"#7c6af718",border:"1px solid #7c6af744",borderRadius:14,padding:"12px 14px"}}>
            <div style={{fontWeight:700,fontSize:13,color:th.text,marginBottom:4}}>🔔 Activa las notificaciones push</div>
            <div style={{fontSize:11,color:th.textMid,marginBottom:10,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5}}>
              {notifPerm === "denied"
                ? "Bloqueaste las notificaciones. Ve a Ajustes del navegador para permitirlas."
                : "Recibe alertas aunque tengas la app cerrada (funciona mejor si la añades a pantalla de inicio)."}
            </div>
            {notifPerm !== "denied" && (
              <button onClick={requestPerm} style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:10,padding:"9px 16px",color:"#fff",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                Permitir notificaciones
              </button>
            )}
          </div>
        )}
        {notifPerm === "granted" && (
          <div style={{background:"#00c37a18",border:"1px solid #00c37a44",borderRadius:12,padding:"10px 14px",display:"flex",gap:8,alignItems:"center"}}>
            <Check size={14} color="#00c37a"/>
            <span style={{fontSize:11,color:"#00c37a",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>Notificaciones push activas</span>
          </div>
        )}

        {/* ── Configuración global ── */}
        <div style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:16,overflow:"hidden"}}>
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:8}}>
            <Settings size={13} color="#7c6af7"/>
            <span style={{fontWeight:700,fontSize:13,color:th.text}}>Configuración general</span>
          </div>

          {/* Enable toggle */}
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${th.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:th.text}}>Recordatorios activos</div>
              <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>Alertas dentro y fuera de la app</div>
            </div>
            <div onClick={()=>tog("enabled",!reminderSettings.enabled)} style={{width:42,height:24,borderRadius:99,background:reminderSettings.enabled?"#7c6af7":th.surface2,border:`1px solid ${reminderSettings.enabled?"#7c6af7":th.border2}`,position:"relative",cursor:"pointer",transition:"all 0.2s"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:reminderSettings.enabled?21:3,transition:"left 0.2s",boxShadow:"0 1px 4px #0006"}}/>
            </div>
          </div>

          {/* Days before */}
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${th.border}`}}>
            <div style={{fontSize:13,fontWeight:600,color:th.text,marginBottom:2}}>Avisar con anticipación</div>
            <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:10}}>Días antes del vencimiento</div>
            <div style={{display:"flex",gap:8}}>
              {[1,3,7,15].map(d=>{
                const on = reminderSettings.daysBeforeOptions.includes(d);
                return <div key={d} onClick={()=>toggleDay(d)} style={{width:36,height:36,borderRadius:10,border:`1px solid ${on?"#7c6af7":th.border2}`,background:on?"#7c6af7":th.surface2,color:on?"#fff":th.textDim,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,transition:"all 0.15s"}}>{d}</div>
              })}
            </div>
          </div>

          {/* Notify hour */}
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${th.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:th.text}}>Hora del aviso</div>
              <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>Notificación push diaria</div>
            </div>
            <select value={reminderSettings.notifyHour} onChange={e=>tog("notifyHour",parseInt(e.target.value))}
              style={{background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:8,padding:"5px 8px",color:th.text,fontFamily:"'JetBrains Mono',monospace",fontSize:12,cursor:"pointer",outline:"none"}}>
              {[7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(h=>(
                <option key={h} value={h}>{String(h).padStart(2,"0")}:00 {h<12?"AM":"PM"}</option>
              ))}
            </select>
          </div>

          {/* Show amount */}
          <div style={{padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:th.text}}>Mostrar monto</div>
              <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>Ver saldo en la notificación</div>
            </div>
            <div onClick={()=>tog("showAmountInNotif",!reminderSettings.showAmountInNotif)} style={{width:42,height:24,borderRadius:99,background:reminderSettings.showAmountInNotif?"#7c6af7":th.surface2,border:`1px solid ${reminderSettings.showAmountInNotif?"#7c6af7":th.border2}`,position:"relative",cursor:"pointer",transition:"all 0.2s"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:reminderSettings.showAmountInNotif?21:3,transition:"left 0.2s",boxShadow:"0 1px 4px #0006"}}/>
            </div>
          </div>
        </div>

        {/* ── Per-card config ── */}
        <div style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:16,overflow:"hidden"}}>
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:8}}>
            <CreditCard size={13} color="#7c6af7"/>
            <span style={{fontWeight:700,fontSize:13,color:th.text}}>Por tarjeta</span>
          </div>
          {creditCards.map((card,i) => {
            const cfg = cardReminders[card.id] || {enabled:true,cutDay:1,payDay:15};
            return (
              <div key={card.id} style={{padding:"12px 14px",borderBottom:i<creditCards.length-1?`1px solid ${th.border}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:cfg.enabled?10:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:10,height:10,borderRadius:3,background:card.accent}}/>
                    <span style={{fontSize:13,fontWeight:600,color:th.text}}>{card.name}</span>
                  </div>
                  <div onClick={()=>toggleCard(card.id)} style={{width:42,height:24,borderRadius:99,background:cfg.enabled?"#7c6af7":th.surface2,border:`1px solid ${cfg.enabled?"#7c6af7":th.border2}`,position:"relative",cursor:"pointer",transition:"all 0.2s"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:cfg.enabled?21:3,transition:"left 0.2s",boxShadow:"0 1px 4px #0006"}}/>
                  </div>
                </div>
                {cfg.enabled && (
                  <div style={{display:"flex",gap:14}}>
                    <div>
                      <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>DÍA CORTE</div>
                      <input type="number" min="1" max="31" value={cfg.cutDay}
                        onChange={e=>updateDay(card.id,"cutDay",e.target.value)}
                        style={{background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:8,padding:"5px 8px",color:th.text,fontFamily:"'JetBrains Mono',monospace",fontSize:12,width:50,outline:"none",textAlign:"center"}}/>
                    </div>
                    <div>
                      <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>DÍA PAGO</div>
                      <input type="number" min="1" max="31" value={cfg.payDay}
                        onChange={e=>updateDay(card.id,"payDay",e.target.value)}
                        style={{background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:8,padding:"5px 8px",color:th.text,fontFamily:"'JetBrains Mono',monospace",fontSize:12,width:50,outline:"none",textAlign:"center"}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                      <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>PRÓXIMO</div>
                      <div style={{fontSize:10,color:"#7c6af7",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,paddingBottom:6}}>
                        {nextPayDate(cfg.payDay).toLocaleDateString("es-MX",{day:"2-digit",month:"short"})}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Reset App ── */}
        <div style={{background:th.surface,border:`1px solid #ff606033`,borderRadius:16,overflow:"hidden"}}>
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:8}}>
            <AlertTriangle size={13} color="#ff6060"/>
            <span style={{fontWeight:700,fontSize:13,color:th.text}}>Zona de peligro</span>
          </div>
          <div style={{padding:"14px"}}>
            <div style={{fontSize:12,color:th.textMid,marginBottom:12,lineHeight:1.5}}>
              Elimina todos los datos, tarjetas, transacciones y configuración. La app volverá al estado inicial.
            </div>
            <button onClick={()=>setShowReset(true)} style={{width:"100%",padding:"11px",borderRadius:12,border:"1px solid #ff606044",background:"#ff404018",color:"#ff6060",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <AlertTriangle size={14}/> Reinicio total de la app
            </button>
          </div>
        </div>

        <div style={{height:20}}/>
      </div>
      {showReset&&<ResetDialog th={th} onCancel={()=>setShowReset(false)} onConfirm={()=>{
        localStorage.clear();
        window.location.reload();
      }}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD VIEW
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   EDIT / DELETE TRANSACTION MODAL
═══════════════════════════════════════════════════════════════ */
function EditTxModal({tx, cards, th, onSave, onDelete, onClose}){
  const allCards = [...(cards.credit||[]),...(cards.debit||[])];
  const [form,setForm] = useState({
    amount: String(tx.amount),
    description: tx.description,
    type: tx.type,
    date: new Date(tx.date).toISOString().slice(0,10),
    cardId: tx.cardId,
    category: tx.category||"other",
  });
  const [confirmDel,setConfirmDel] = useState(false);
  const inp = {background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontSize:12,width:"100%",outline:"none",fontFamily:"'Syne',sans-serif"};

  const handleSave = () => {
    if(!form.amount||!form.description) return;
    onSave({...tx,...form,amount:parseFloat(form.amount),date:new Date(form.date).toISOString()});
  };

  return(
    <div style={{position:"fixed",inset:0,background:"#00000090",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:900}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:th.shell,borderRadius:"24px 24px 0 0",padding:"20px 20px 36px",width:"100%",maxWidth:480,boxShadow:"0 -20px 60px #000c",animation:"fadeUp 0.3s ease"}}>
        <div style={{width:36,height:4,background:th.border2,borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:800,fontSize:16,color:th.text}}>Editar movimiento</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:th.textMid,cursor:"pointer"}}><X size={18}/></button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {/* Type */}
          <div style={{display:"flex",gap:8}}>
            {[{v:"expense",l:"− Gasto"},{v:"income",l:"+ Ingreso"},{v:"payment",l:"↓ Pago"}].map(({v,l})=>(
              <button key={v} onClick={()=>setForm(p=>({...p,type:v}))} style={{flex:1,padding:"8px",borderRadius:10,cursor:"pointer",fontSize:11,fontWeight:700,border:"none",
                background:form.type===v?(v==="expense"?"#ff404028":v==="income"?"#00c37a28":"#7c6af728"):"transparent",
                color:form.type===v?(v==="expense"?"#ff6060":v==="income"?"#00c37a":"#7c6af7"):th.textDim}}>
                {l}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>MONTO</div>
            <input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} style={inp}/>
          </div>

          {/* Description */}
          <div>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>DESCRIPCIÓN</div>
            <input type="text" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={inp}/>
          </div>

          {/* Category */}
          <div>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>CATEGORÍA</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {CATEGORIES.filter(c=>c.id!=="savings").map(c=>(
                <button key={c.id} onClick={()=>setForm(p=>({...p,category:c.id}))}
                  style={{padding:"4px 9px",borderRadius:8,border:`1px solid ${form.category===c.id?c.color:th.border2}`,
                    background:form.category===c.id?c.color+"22":"transparent",
                    color:form.category===c.id?c.color:th.textDim,
                    fontSize:11,cursor:"pointer",fontWeight:form.category===c.id?700:400}}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>FECHA</div>
            <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={inp}/>
          </div>

          {/* Card */}
          {allCards.length>1&&(
            <div>
              <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>TARJETA</div>
              <select value={form.cardId} onChange={e=>setForm(p=>({...p,cardId:e.target.value}))} style={{...inp,cursor:"pointer"}}>
                {allCards.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Actions */}
          <button onClick={handleSave} style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:12,padding:"12px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:4}}>
            Guardar cambios
          </button>

          {!confirmDel
            ? <button onClick={()=>setConfirmDel(true)} style={{background:"none",border:`1px solid #ff606044`,borderRadius:12,padding:"10px",color:"#ff6060",fontWeight:600,fontSize:12,cursor:"pointer"}}>
                🗑 Eliminar transacción
              </button>
            : <div style={{background:"#ff404018",border:"1px solid #ff606044",borderRadius:12,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:12,color:"#ff6060",marginBottom:12}}>¿Eliminar este movimiento? No hay vuelta atrás.</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmDel(false)} style={{flex:1,background:"none",border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px",color:th.textDim,fontSize:12,cursor:"pointer"}}>Cancelar</button>
                  <button onClick={()=>onDelete(tx.id)} style={{flex:1,background:"#ff6060",border:"none",borderRadius:10,padding:"9px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Sí, eliminar</button>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

function DashView({cards,setCards,transactions,activeCard,setActiveCard,cardMode,setCardMode,th,onAddTx,onEditTx,onDeleteTx}){
  const [modal,setModal]=useState(false);
  const [payModal,setPayModal]=useState(false);
  const [editTx,setEditTx]=useState(null);

  const currentCards = cardMode==="credit" ? cards.credit : cards.debit;
  const txs = transactions.filter(t=>t.cardId===activeCard?.id);
  const exp = txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const inc = txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const pays= txs.filter(t=>t.type==="payment").reduce((s,t)=>s+t.amount,0);

  const handlePay=(amount,note)=>{
    // Add payment transaction
    onAddTx({cardId:activeCard?.id,amount,description:note,type:"payment",date:new Date().toISOString()});
    setPayModal(false);
  };

  // Tx type label helper
  const txLabel=(type)=>{
    if(type==="income") return{label:"Ingreso",color:"#00c37a",bg:"#00c37a18"};
    if(type==="payment") return{label:"Pago",color:"#7c6af7",bg:"#7c6af718"};
    return{label:"Gasto",color:"#ff6060",bg:"#ff404018"};
  };

  return(
    <div className="scroll-area" style={{flex:1,minHeight:0,background:th.bg}}>

      {/* ── Mode Toggle: Gastos (Crédito) / Ingresos (Débito) ── */}
      <div style={{padding:"16px 16px 0"}}>
        <div style={{display:"flex",background:th.surface2,borderRadius:16,padding:4,border:`1px solid ${th.border}`}}>
          {[
            {id:"credit",label:"💳 Gastos / Crédito"},
            {id:"debit", label:"🏦 Ingresos / Débito"},
          ].map(({id,label})=>(
            <button key={id} onClick={()=>{
              setCardMode(id);
              const target=(id==="credit"?cards.credit:cards.debit)[0];
              if(target) setActiveCard(target);
            }} style={{
              flex:1,padding:"10px 8px",borderRadius:12,border:"none",cursor:"pointer",
              fontWeight:700,fontSize:12,fontFamily:"'JetBrains Mono',monospace",
              transition:"all 0.2s",
              background:cardMode===id?"linear-gradient(90deg,#7c6af7,#34d5b0)":"transparent",
              color:cardMode===id?"#fff":th.textDim,
              boxShadow:cardMode===id?"0 2px 12px #7c6af740":"none",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── Card Carousel ── */}
      <div style={{padding:"14px 16px 0"}}>
        <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:2,marginBottom:10}}>
          {cardMode==="credit"?"MIS TARJETAS DE CRÉDITO":"MIS TARJETAS DE DÉBITO"}
        </div>
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch"}}>
          {currentCards.map(c=>(
            <div key={c.id} style={{scrollSnapAlign:"start",flexShrink:0}}>
              {cardMode==="credit"
                ?<CreditCardVisual card={c} selected={activeCard?.id===c.id} onClick={()=>setActiveCard(c)}/>
                :<DebitCardVisual  card={c} selected={activeCard?.id===c.id} onClick={()=>setActiveCard(c)}/>
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Credit card actions ── */}
      {cardMode==="credit"&&(
        <div style={{padding:"12px 16px 0",display:"flex",gap:8}}>
          <button onClick={()=>setPayModal(true)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#7c6af7,#5a4fd6)",color:"#fff",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,boxShadow:"0 4px 16px #7c6af730"}}>
            <ArrowDownLeft size={14}/> Registrar Pago
          </button>
          <button onClick={()=>setModal(true)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:12,border:`1px solid ${th.border2}`,background:th.surface2,color:th.textMid,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700}}>
            <Plus size={14}/> Gasto Manual
          </button>
        </div>
      )}
      {cardMode==="debit"&&(
        <div style={{padding:"12px 16px 0"}}>
          <button onClick={()=>setModal(true)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",borderRadius:12,border:`1px solid ${th.border2}`,background:th.surface2,color:"#7c6af7",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700}}>
            <Plus size={14}/> Agregar Movimiento
          </button>
        </div>
      )}

      {/* ── Stats ── */}
      <div style={{display:"grid",gridTemplateColumns:cardMode==="credit"?"1fr 1fr 1fr":"1fr 1fr",gap:10,padding:"14px 16px 0"}}>
        {(cardMode==="credit"?[
          {l:"GASTOS",  v:fmt(exp),  c:"#ff6060",I:TrendingDown},
          {l:"PAGOS",   v:fmt(pays), c:"#7c6af7",I:ArrowDownLeft},
          {l:"MOVIM.",  v:String(txs.length), c:"#34d5b0",I:CreditCard},
        ]:[
          {l:"EGRESOS", v:fmt(exp),  c:"#ff6060",I:TrendingDown},
          {l:"INGRESOS",v:fmt(inc),  c:"#00c37a",I:TrendingUp},
        ].concat(txs.length?[{l:"MOVIM.",v:String(txs.length),c:"#7c6af7",I:Wallet}]:[])).map(({l,v,c,I},i)=>(
          <div key={i} style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:16,padding:"13px 12px",animation:`fadeUp 0.35s ease ${i*0.06}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div style={{fontSize:8,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:0.5}}>{l}</div>
              <div style={{width:22,height:22,background:c+"18",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <I size={11} color={c}/>
              </div>
            </div>
            <div style={{fontSize:16,fontWeight:800,color:th.text,letterSpacing:-0.5}}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Transaction list ── */}
      <div style={{padding:"14px 16px 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:2}}>{activeCard?.name.toUpperCase()}</div>
        </div>
        {txs.length===0&&<div style={{textAlign:"center",padding:32,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>Sin movimientos</div>}
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {txs.map((tx,i)=>{
            const {label,color,bg}=txLabel(tx.type);
            return(
              <div key={tx.id} onClick={()=>setEditTx(tx)} style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:14,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,animation:`fadeUp 0.28s ease ${i*0.03}s both`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=th.border2} onMouseLeave={e=>e.currentTarget.style.borderColor=th.border}>
                <div style={{width:34,height:34,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {tx.type==="income"?<TrendingUp size={14} color="#00c37a"/>:tx.type==="payment"?<ArrowDownLeft size={14} color="#7c6af7"/>:<Tag size={14} color="#ff6060"/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:th.text}}>
                    {tx.category&&tx.category!=="other"?catById(tx.category).emoji+' ':''}{tx.description}
                  </div>
                  <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:1,display:"flex",gap:6,alignItems:"center"}}>
                    <Calendar size={8}/>{fmtD(tx.date)}
                    <span style={{background:bg,color,borderRadius:4,padding:"1px 5px",fontSize:9,fontWeight:700}}>{label}</span>
                  </div>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,color,flexShrink:0}}>
                  {tx.type==="income"?"+":tx.type==="payment"?"↓":"-"}{fmt(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editTx&&<EditTxModal
        tx={editTx}
        cards={cards}
        th={th}
        onSave={tx=>{onEditTx(tx);setEditTx(null);}}
        onDelete={id=>{onDeleteTx(id);setEditTx(null);}}
        onClose={()=>setEditTx(null)}
      />}
      {modal&&<QuickAdd
        cards={cardMode==="credit"?cards.credit:cards.debit}
        activeCard={activeCard}
        cardMode={cardMode}
        th={th}
        onAdd={tx=>{onAddTx(tx);setModal(false);}}
        onClose={()=>setModal(false)}
      />}
      {payModal&&cardMode==="credit"&&<PaymentModal
        card={activeCard}
        th={th}
        onPay={handlePay}
        onClose={()=>setPayModal(false)}
      />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   HISTORIAL GLOBAL DE TRANSACCIONES
═══════════════════════════════════════════════════════════════ */
function HistoryView({transactions, cards, th, onEditTx, onDeleteTx}){
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [editTx, setEditTx] = useState(null);

  const allCards = [...(cards.credit||[]),...(cards.debit||[])];
  const cardById = id => allCards.find(c=>c.id===id);

  const fmt = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n);
  const fmtD = d => new Date(d).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"});

  const filtered = transactions
    .filter(t=>{
      const matchSearch = !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (cardById(t.cardId)?.name||"").toLowerCase().includes(search.toLowerCase());
      const matchType = filterType==="all" || t.type===filterType;
      const matchCat = filterCat==="all" || (t.category||"other")===filterCat;
      return matchSearch && matchType && matchCat;
    })
    .sort((a,b)=>new Date(b.date)-new Date(a.date));

  const totalExp = filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const totalInc = filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);

  const txLabel = type => {
    if(type==="income") return{label:"Ingreso",color:"#00c37a",bg:"#00c37a18"};
    if(type==="payment") return{label:"Pago",color:"#7c6af7",bg:"#7c6af718"};
    return{label:"Gasto",color:"#ff6060",bg:"#ff404018"};
  };

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0,background:th.bg}}>
      {/* Header fijo */}
      <div style={{padding:"14px 16px 10px",borderBottom:`1px solid ${th.border}`,background:th.shell,flexShrink:0}}>
        <div style={{fontSize:13,fontWeight:800,color:th.text,marginBottom:12,letterSpacing:-0.3}}>🗂 Historial</div>

        {/* Search */}
        <div style={{position:"relative",marginBottom:10}}>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar movimiento o tarjeta…"
            style={{width:"100%",background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:12,padding:"9px 12px 9px 36px",color:th.text,fontSize:12,outline:"none",fontFamily:"'Syne',sans-serif"}}
          />
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:th.textDim,fontSize:14}}>🔍</span>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:th.textDim,cursor:"pointer",fontSize:16}}>×</button>}
        </div>

        {/* Type filter */}
        <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:2}}>
          {[{id:"all",l:"Todos"},{id:"expense",l:"Gastos"},{id:"income",l:"Ingresos"},{id:"payment",l:"Pagos"}].map(({id,l})=>(
            <button key={id} onClick={()=>setFilterType(id)} style={{
              flexShrink:0,padding:"5px 12px",borderRadius:20,border:`1px solid ${filterType===id?"#7c6af7":th.border2}`,
              background:filterType===id?"#7c6af718":"transparent",color:filterType===id?"#7c6af7":th.textDim,
              fontSize:11,fontWeight:filterType===id?700:400,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"
            }}>{l}</button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:2}}>
          <button onClick={()=>setFilterCat("all")} style={{
            flexShrink:0,padding:"4px 10px",borderRadius:20,border:`1px solid ${filterCat==="all"?"#7c6af7":th.border2}`,
            background:filterCat==="all"?"#7c6af718":"transparent",color:filterCat==="all"?"#7c6af7":th.textDim,
            fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"
          }}>Todas</button>
          {CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setFilterCat(c.id)} style={{
              flexShrink:0,padding:"4px 10px",borderRadius:20,border:`1px solid ${filterCat===c.id?c.color:th.border2}`,
              background:filterCat===c.id?c.color+"22":"transparent",color:filterCat===c.id?c.color:th.textDim,
              fontSize:11,cursor:"pointer"
            }}>{c.emoji}</button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      {filtered.length>0&&(
        <div style={{display:"flex",gap:0,borderBottom:`1px solid ${th.border}`,flexShrink:0}}>
          <div style={{flex:1,padding:"8px 16px",textAlign:"center",borderRight:`1px solid ${th.border}`}}>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>GASTOS</div>
            <div style={{fontSize:13,fontWeight:700,color:"#ff6060"}}>{fmt(totalExp)}</div>
          </div>
          <div style={{flex:1,padding:"8px 16px",textAlign:"center",borderRight:`1px solid ${th.border}`}}>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>INGRESOS</div>
            <div style={{fontSize:13,fontWeight:700,color:"#00c37a"}}>{fmt(totalInc)}</div>
          </div>
          <div style={{flex:1,padding:"8px 16px",textAlign:"center"}}>
            <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>MOVIM.</div>
            <div style={{fontSize:13,fontWeight:700,color:th.text}}>{filtered.length}</div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="scroll-area" style={{flex:1,minHeight:0,padding:"10px 16px 24px"}}>
        {filtered.length===0
          ? <div style={{textAlign:"center",padding:"48px 0",color:th.textDim,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>
              <div style={{fontSize:32,marginBottom:12}}>🔍</div>
              Sin movimientos{search?" para esa búsqueda":""}
            </div>
          : filtered.map((tx,i)=>{
              const {label,color,bg}=txLabel(tx.type);
              const cat = catById(tx.category||"other");
              const card = cardById(tx.cardId);
              return(
                <div key={tx.id} onClick={()=>setEditTx(tx)}
                  style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:14,padding:"11px 14px",
                    display:"flex",alignItems:"center",gap:12,marginBottom:7,cursor:"pointer",
                    animation:`fadeUp 0.2s ease ${Math.min(i,10)*0.02}s both`}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=th.border2}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=th.border}>
                  {/* Category icon */}
                  <div style={{width:36,height:36,borderRadius:10,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
                    {cat.emoji}
                  </div>
                  {/* Info */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.description}</div>
                    <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:2,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                      <span>{fmtD(tx.date)}</span>
                      {card&&<span style={{color:card.accent}}>· {card.name}</span>}
                      <span style={{background:bg,color,borderRadius:4,padding:"1px 5px",fontSize:9,fontWeight:700}}>{label}</span>
                    </div>
                  </div>
                  {/* Amount */}
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,color,flexShrink:0}}>
                    {tx.type==="income"?"+":tx.type==="payment"?"↓":"-"}{fmt(tx.amount)}
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Edit modal */}
      {editTx&&<EditTxModal
        tx={editTx}
        cards={cards}
        th={th}
        onSave={tx=>{onEditTx(tx);setEditTx(null);}}
        onDelete={id=>{onDeleteTx(id);setEditTx(null);}}
        onClose={()=>setEditTx(null)}
      />}
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════
   AUTH SYSTEM — PIN + WebAuthn (Face ID / Huella)
═══════════════════════════════════════════════════════════════ */
const AUTH_KEY = "fintrack_auth_v1";

function loadAuth(){
  try{ const r=localStorage.getItem(AUTH_KEY); return r?JSON.parse(r):null; }catch{ return null; }
}
function saveAuth(data){
  try{ localStorage.setItem(AUTH_KEY,JSON.stringify(data)); }catch{}
}

// Simple hash (not cryptographic, but enough for local PIN)
async function hashPin(pin){
  try{
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin+"fintrack_salt_2026"));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
  }catch(e){
    // Fallback simple hash for browsers without crypto.subtle
    let h=0;
    const s=pin+"fintrack_salt_2026";
    for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}
    return "fallback_"+Math.abs(h).toString(16);
  }
}

// Generate recovery code (8 random words from numbers)
function genRecoveryCode(){
  const words=[];
  for(let i=0;i<3;i++) words.push(Math.random().toString(36).slice(2,7).toUpperCase());
  return words.join("-");
}

// WebAuthn helpers
async function registerBiometric(userId){
  if(!window.PublicKeyCredential) return false;
  try{
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const cred = await navigator.credentials.create({
      publicKey:{
        challenge,
        rp:{name:"Finzio", id:location.hostname},
        user:{id:new TextEncoder().encode(userId), name:userId, displayName:"Finzio User"},
        pubKeyCredParams:[{alg:-7,type:"public-key"},{alg:-257,type:"public-key"}],
        authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"},
        timeout:60000,
      }
    });
    if(!cred) return false;
    const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
    return credId;
  }catch(e){ return false; }
}

async function verifyBiometric(credentialId){
  if(!credentialId||!window.PublicKeyCredential) return false;
  try{
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const rawId = Uint8Array.from(atob(credentialId),c=>c.charCodeAt(0));
    const assertion = await navigator.credentials.get({
      publicKey:{
        challenge,
        allowCredentials:[{id:rawId,type:"public-key"}],
        userVerification:"required",
        timeout:60000,
      }
    });
    return !!assertion;
  }catch(e){ return false; }
}

/* ── PIN SETUP SCREEN ── */

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS VIEW
═══════════════════════════════════════════════════════════════ */
function AnalyticsView({transactions, th}){
  const [period, setPeriod] = useState("month");
  const now = new Date();
  const filtered = transactions.filter(t=>{
    const d = new Date(t.date);
    if(period==="month") return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
    if(period==="week"){const diff=(now-d)/86400000; return diff<=7;}
    return d.getFullYear()===now.getFullYear();
  });
  const expenses = filtered.filter(t=>t.type==="expense");
  const totalExp = expenses.reduce((s,t)=>s+t.amount,0);
  const totalInc = filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);

  // Group by category
  const byCat = {};
  expenses.forEach(t=>{
    const cid = t.category||"other";
    byCat[cid] = (byCat[cid]||0) + t.amount;
  });
  const catData = Object.entries(byCat)
    .map(([id,amt])=>({...catById(id), amt}))
    .sort((a,b)=>b.amt-a.amt);

  // Group by day for sparkline
  const byDay = {};
  expenses.forEach(t=>{
    const day = new Date(t.date).toLocaleDateString("es-MX",{day:"2-digit",month:"short"});
    byDay[day] = (byDay[day]||0) + t.amount;
  });
  const dayData = Object.entries(byDay).slice(-14);
  const maxDay = Math.max(...dayData.map(d=>d[1]), 1);

  const fmt = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n);

  return(
    <div className="scroll-area" style={{flex:1,minHeight:0,background:th.bg,padding:"16px"}}>
      <div style={{fontSize:13,fontWeight:800,color:th.text,marginBottom:16,letterSpacing:-0.3}}>📊 Análisis</div>

      {/* Period selector */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{id:"week",l:"7 días"},{id:"month",l:"Este mes"},{id:"year",l:"Este año"}].map(({id,l})=>(
          <button key={id} onClick={()=>setPeriod(id)} style={{
            flex:1,padding:"8px",borderRadius:10,border:`1px solid ${period===id?"#7c6af7":th.border2}`,
            background:period===id?"#7c6af718":"transparent",color:period===id?"#7c6af7":th.textDim,
            fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"
          }}>{l}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {label:"Gastos",amt:totalExp,color:"#ff6060",bg:"#ff404018"},
          {label:"Ingresos",amt:totalInc,color:"#00c37a",bg:"#00c37a18"},
        ].map(({label,amt,color,bg})=>(
          <div key={label} style={{background:bg,border:`1px solid ${color}22`,borderRadius:14,padding:"14px 12px"}}>
            <div style={{fontSize:10,color,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,marginBottom:6}}>{label.toUpperCase()}</div>
            <div style={{fontSize:18,fontWeight:800,color,letterSpacing:-0.5}}>{fmt(amt)}</div>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      {dayData.length>0&&(
        <div style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:14,padding:"14px",marginBottom:20}}>
          <div style={{fontSize:11,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>GASTOS POR DÍA</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:60}}>
            {dayData.map(([day,amt])=>(
              <div key={day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",background:"linear-gradient(180deg,#7c6af7,#34d5b0)",borderRadius:"3px 3px 0 0",
                  height:`${Math.round((amt/maxDay)*56)}px`,minHeight:2,transition:"height 0.3s"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:9,color:th.textDim}}>{dayData[0]?.[0]}</span>
            <span style={{fontSize:9,color:th.textDim}}>{dayData[dayData.length-1]?.[0]}</span>
          </div>
        </div>
      )}

      {/* By category */}
      <div style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:14,padding:"14px"}}>
        <div style={{fontSize:11,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:14}}>POR CATEGORÍA</div>
        {catData.length===0
          ? <div style={{textAlign:"center",color:th.textDim,fontSize:12,padding:"20px 0"}}>Sin gastos en este período</div>
          : catData.map(({id,label,emoji,color,amt})=>(
            <div key={id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:12,color:th.text}}>{emoji} {label}</span>
                <span style={{fontSize:12,fontWeight:700,color,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(amt)}</span>
              </div>
              <div style={{height:5,background:th.border2,borderRadius:3}}>
                <div style={{height:"100%",width:`${Math.round((amt/totalExp)*100)}%`,background:color,borderRadius:3,transition:"width 0.5s"}}/>
              </div>
              <div style={{fontSize:9,color:th.textDim,marginTop:3,fontFamily:"'JetBrains Mono',monospace"}}>
                {Math.round((amt/totalExp)*100)}% del total
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BUDGETS VIEW
═══════════════════════════════════════════════════════════════ */
function BudgetsView({transactions, budgets, setBudgets, th}){
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({category:"food", limit:""});
  const fmt = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n);
  const now = new Date();

  const monthExp = transactions.filter(t=>{
    const d=new Date(t.date);
    return t.type==="expense" && d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  });

  const spentByCat = {};
  monthExp.forEach(t=>{ const c=t.category||"other"; spentByCat[c]=(spentByCat[c]||0)+t.amount; });

  const addBudget = () => {
    if(!form.limit) return;
    setBudgets(p=>({...p, [form.category]: parseFloat(form.limit)}));
    setForm({category:"food", limit:""});
    setAdding(false);
  };

  const usedCats = Object.keys(budgets);

  return(
    <div className="scroll-area" style={{flex:1,minHeight:0,background:th.bg,padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:th.text,letterSpacing:-0.3}}>💰 Presupuestos</div>
        <button onClick={()=>setAdding(true)} style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Agregar</button>
      </div>

      {adding&&(
        <div style={{background:th.surface,border:`1px solid ${th.border2}`,borderRadius:14,padding:"14px",marginBottom:16}}>
          <div style={{fontSize:11,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:10}}>NUEVA CATEGORÍA</div>
          <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
            style={{width:"100%",background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontSize:12,marginBottom:10,outline:"none"}}>
            {CATEGORIES.filter(c=>c.id!=="savings").map(c=>(
              <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
            ))}
          </select>
          <input type="number" placeholder="Límite mensual" value={form.limit} onChange={e=>setForm(p=>({...p,limit:e.target.value}))}
            style={{width:"100%",background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontSize:12,outline:"none",marginBottom:10}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addBudget} style={{flex:1,background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:10,padding:"10px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Guardar</button>
            <button onClick={()=>setAdding(false)} style={{flex:1,background:"none",border:`1px solid ${th.border2}`,borderRadius:10,padding:"10px",color:th.textDim,fontSize:12,cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      )}

      {usedCats.length===0&&!adding
        ? <div style={{textAlign:"center",color:th.textDim,fontSize:12,padding:"40px 0"}}>
            <div style={{fontSize:32,marginBottom:12}}>💸</div>
            Sin presupuestos definidos.<br/>Agrega uno para controlar tus gastos.
          </div>
        : usedCats.map(cid=>{
            const cat = catById(cid);
            const limit = budgets[cid];
            const spent = spentByCat[cid]||0;
            const pct = Math.min(100, Math.round((spent/limit)*100));
            const over = spent>limit;
            return(
              <div key={cid} style={{background:th.surface,border:`1px solid ${over?"#ff606044":th.border}`,borderRadius:14,padding:"14px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:13,color:th.text}}>{cat.emoji} {cat.label}</span>
                  <button onClick={()=>setBudgets(p=>{const n={...p};delete n[cid];return n;})}
                    style={{background:"none",border:"none",color:th.textDim,cursor:"pointer",fontSize:16}}>×</button>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:11,color:over?"#ff6060":th.textMid,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(spent)} gastado</span>
                  <span style={{fontSize:11,color:th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>de {fmt(limit)}</span>
                </div>
                <div style={{height:6,background:th.border2,borderRadius:3}}>
                  <div style={{height:"100%",width:`${pct}%`,background:over?"#ff6060":cat.color,borderRadius:3,transition:"width 0.5s"}}/>
                </div>
                <div style={{fontSize:10,color:over?"#ff6060":"#34d5b0",fontFamily:"'JetBrains Mono',monospace",marginTop:5,fontWeight:700}}>
                  {over?`⚠ Excedido por ${fmt(spent-limit)}`:`✓ ${fmt(limit-spent)} disponible`}
                </div>
              </div>
            );
          })
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GOALS VIEW
═══════════════════════════════════════════════════════════════ */
function GoalsView({goals, setGoals, th}){
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({name:"", target:"", saved:"", emoji:"🎯", deadline:""});
  const fmt = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n);
  const EMOJIS = ["🎯","🏠","🚗","✈️","💻","💍","🎓","🏋️","🌴","💼"];

  const addGoal = () => {
    if(!form.name||!form.target) return;
    setGoals(p=>[...p,{id:Date.now().toString(),name:form.name,emoji:form.emoji,target:parseFloat(form.target),saved:parseFloat(form.saved)||0,deadline:form.deadline}]);
    setForm({name:"",target:"",saved:"",emoji:"🎯",deadline:""});
    setAdding(false);
  };

  const addSavings = (id, amt) => {
    setGoals(p=>p.map(g=>g.id===id?{...g,saved:Math.min(g.target,g.saved+amt)}:g));
  };

  return(
    <div className="scroll-area" style={{flex:1,minHeight:0,background:th.bg,padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:th.text,letterSpacing:-0.3}}>🎯 Metas</div>
        <button onClick={()=>setAdding(true)} style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:10,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Nueva</button>
      </div>

      {adding&&(
        <div style={{background:th.surface,border:`1px solid ${th.border2}`,borderRadius:14,padding:"14px",marginBottom:16}}>
          <div style={{fontSize:11,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:10}}>NUEVA META</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            {EMOJIS.map(e=>(<button key={e} onClick={()=>setForm(p=>({...p,emoji:e}))}
              style={{width:36,height:36,borderRadius:10,border:`2px solid ${form.emoji===e?"#7c6af7":th.border2}`,background:form.emoji===e?"#7c6af718":"transparent",fontSize:18,cursor:"pointer"}}>{e}</button>))}
          </div>
          <input placeholder="Nombre de la meta" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
            style={{width:"100%",background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontSize:12,outline:"none",marginBottom:10}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <input type="number" placeholder="Meta ($)" value={form.target} onChange={e=>setForm(p=>({...p,target:e.target.value}))}
              style={{background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontSize:12,outline:"none"}}/>
            <input type="number" placeholder="Ya ahorré ($)" value={form.saved} onChange={e=>setForm(p=>({...p,saved:e.target.value}))}
              style={{background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontSize:12,outline:"none"}}/>
          </div>
          <input type="date" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))}
            style={{width:"100%",background:th.inputBg,border:`1px solid ${th.border2}`,borderRadius:10,padding:"9px 12px",color:th.text,fontSize:12,outline:"none",marginBottom:10}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addGoal} style={{flex:1,background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:10,padding:"10px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Guardar</button>
            <button onClick={()=>setAdding(false)} style={{flex:1,background:"none",border:`1px solid ${th.border2}`,borderRadius:10,padding:"10px",color:th.textDim,fontSize:12,cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      )}

      {goals.length===0&&!adding
        ? <div style={{textAlign:"center",color:th.textDim,fontSize:12,padding:"40px 0"}}>
            <div style={{fontSize:32,marginBottom:12}}>🎯</div>
            Sin metas definidas.<br/>Crea una para empezar a ahorrar con propósito.
          </div>
        : goals.map(g=>{
            const pct = Math.min(100,Math.round((g.saved/g.target)*100));
            const done = g.saved>=g.target;
            const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline)-new Date())/86400000) : null;
            return(
              <div key={g.id} style={{background:th.surface,border:`1px solid ${done?"#34d5b044":th.border}`,borderRadius:14,padding:"14px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:28}}>{g.emoji}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:th.text}}>{g.name}</div>
                      {daysLeft!==null&&<div style={{fontSize:10,color:daysLeft<7?"#ff6060":th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>
                        {daysLeft>0?`${daysLeft} días restantes`:"¡Venció!"}
                      </div>}
                    </div>
                  </div>
                  <button onClick={()=>setGoals(p=>p.filter(x=>x.id!==g.id))}
                    style={{background:"none",border:"none",color:th.textDim,cursor:"pointer",fontSize:16}}>×</button>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:th.textMid,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(g.saved)}</span>
                  <span style={{fontSize:12,color:"#7c6af7",fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{pct}%</span>
                  <span style={{fontSize:12,color:th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(g.target)}</span>
                </div>
                <div style={{height:8,background:th.border2,borderRadius:4,marginBottom:10}}>
                  <div style={{height:"100%",width:`${pct}%`,background:done?"#34d5b0":"linear-gradient(90deg,#7c6af7,#34d5b0)",borderRadius:4,transition:"width 0.5s"}}/>
                </div>
                {!done&&(
                  <div style={{display:"flex",gap:6}}>
                    {[500,1000,5000].map(amt=>(
                      <button key={amt} onClick={()=>addSavings(g.id,amt)} style={{flex:1,background:th.surface2,border:`1px solid ${th.border2}`,borderRadius:8,padding:"6px",color:"#7c6af7",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>+{fmt(amt)}</button>
                    ))}
                  </div>
                )}
                {done&&<div style={{textAlign:"center",color:"#34d5b0",fontWeight:700,fontSize:13}}>🎉 ¡Meta alcanzada!</div>}
              </div>
            );
          })
      }
    </div>
  );
}

function PinSetup({th, onDone}){
  const [step,setStep]=useState("pin"); // pin | confirm | recovery
  const [pin,setPin]=useState("");
  const [confirm,setConfirm]=useState("");
  const [error,setError]=useState("");
  const [recovery,setRecovery]=useState("");
  const [bioAvail,setBioAvail]=useState(false);
  const [shake,setShake]=useState(false);

  useEffect(()=>{
    window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.()
      .then(ok=>setBioAvail(ok)).catch(()=>{});
  },[]);

  const doShake=()=>{ setShake(true); setTimeout(()=>setShake(false),500); };

  const handleDigit=(d)=>{
    if(step==="pin"&&pin.length<6) setPin(p=>p+d);
    if(step==="confirm"&&confirm.length<6) setConfirm(p=>p+d);
  };
  const handleDel=()=>{
    if(step==="pin") setPin(p=>p.slice(0,-1));
    if(step==="confirm") setConfirm(p=>p.slice(0,-1));
  };

  const handleNext=async()=>{
    if(step==="pin"){
      if(pin.length<4){ setError("Mínimo 4 dígitos"); doShake(); return; }
      setError(""); setStep("confirm");
    } else if(step==="confirm"){
      if(confirm!==pin){ setError("Los PINs no coinciden"); doShake(); setConfirm(""); return; }
      const rc=genRecoveryCode();
      setRecovery(rc);
      setStep("recovery");
    } else if(step==="recovery"){
      const hashed=await hashPin(pin);
      const authData={pinHash:hashed, recoveryCode:recovery, credentialId:null, setupDone:true};
      // Try to register biometric
      if(bioAvail){
        const credId=await registerBiometric("fintrack-user");
        if(credId) authData.credentialId=credId;
      }
      saveAuth(authData);
      onDone();
    }
  };

  const dots=(val,max=6)=>Array.from({length:max},(_,i)=>(
    <div key={i} style={{width:12,height:12,borderRadius:"50%",background:i<val.length?"#7c6af7":th.border2,border:`2px solid ${i<val.length?"#7c6af7":th.border2}`,transition:"all 0.15s"}}/>
  ));

  const Pad=()=>(
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,width:"100%",maxWidth:320,margin:"0 auto"}}>
      {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i)=>(
        <button key={i} onClick={()=>d===""?null:d==="⌫"?handleDel():handleDigit(String(d))}
          style={{height:76,borderRadius:20,border:`1px solid ${th.border2}`,background:d===""?"transparent":th.surface2,
            color:th.text,fontSize:d==="⌫"?22:26,fontWeight:700,cursor:d===""?"default":"pointer",
            fontFamily:"'JetBrains Mono',monospace",transition:"all 0.1s",
            opacity:d===""?0:1,
          }}>{d}</button>
      ))}
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9000,padding:24}}>
      <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
        <Zap size={22} color="#fff" fill="#fff"/>
      </div>
      <div style={{fontWeight:800,fontSize:22,color:th.text,marginBottom:6,letterSpacing:-0.5}}>finzio</div>

      {step==="pin"&&<>
        <div style={{fontSize:13,color:th.textMid,marginBottom:28,textAlign:"center"}}>Crea tu PIN de acceso</div>
        <div style={{display:"flex",gap:10,marginBottom:8,animation:shake?"shakeDot 0.4s ease":"none"}}>{dots(pin)}</div>
        <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:28}}>{pin.length}/6 dígitos (mínimo 4)</div>
        {error&&<div style={{fontSize:11,color:"#ff6060",marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>{error}</div>}
        <Pad/>
        <button onClick={handleNext} disabled={pin.length<4}
          style={{marginTop:24,background:pin.length>=4?"linear-gradient(90deg,#7c6af7,#34d5b0)":"#333",border:"none",borderRadius:14,padding:"13px 40px",color:"#fff",fontWeight:700,fontSize:14,cursor:pin.length>=4?"pointer":"default",opacity:pin.length>=4?1:0.4}}>
          Continuar →
        </button>
      </>}

      {step==="confirm"&&<>
        <div style={{fontSize:13,color:th.textMid,marginBottom:28,textAlign:"center"}}>Confirma tu PIN</div>
        <div style={{display:"flex",gap:10,marginBottom:8,animation:shake?"shakeDot 0.4s ease":"none"}}>{dots(confirm)}</div>
        <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:28}}>{confirm.length}/6</div>
        {error&&<div style={{fontSize:11,color:"#ff6060",marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>{error}</div>}
        <Pad/>
        <button onClick={handleNext} disabled={confirm.length<4}
          style={{marginTop:24,background:confirm.length>=4?"linear-gradient(90deg,#7c6af7,#34d5b0)":"#333",border:"none",borderRadius:14,padding:"13px 40px",color:"#fff",fontWeight:700,fontSize:14,cursor:confirm.length>=4?"pointer":"default",opacity:confirm.length>=4?1:0.4}}>
          Confirmar PIN →
        </button>
        <button onClick={()=>{setStep("pin");setPin("");setConfirm("");setError("");}} style={{marginTop:12,background:"none",border:"none",color:th.textDim,fontSize:12,cursor:"pointer"}}>← Cambiar PIN</button>
      </>}

      {step==="recovery"&&<>
        <div style={{fontSize:13,color:th.textMid,marginBottom:20,textAlign:"center",maxWidth:300}}>¡PIN creado! Guarda tu código de recuperación en un lugar seguro</div>
        <div style={{background:th.surface,border:"1px solid #7c6af744",borderRadius:16,padding:"18px 24px",marginBottom:20,textAlign:"center"}}>
          <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:2,marginBottom:8}}>CÓDIGO DE RECUPERACIÓN</div>
          <div style={{fontSize:22,fontWeight:800,color:"#7c6af7",fontFamily:"'JetBrains Mono',monospace",letterSpacing:2}}>{recovery}</div>
        </div>
        <div style={{background:"#f5a62318",border:"1px solid #f5a62344",borderRadius:12,padding:"10px 14px",marginBottom:24,maxWidth:300}}>
          <div style={{fontSize:11,color:"#f5a623",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5,textAlign:"center"}}>
            ⚠️ Si pierdes este código y olvidas tu PIN, no podrás recuperar tu cuenta. Guárdalo en notas o screenshot.
          </div>
        </div>
        {bioAvail&&<div style={{fontSize:11,color:"#34d5b0",fontFamily:"'JetBrains Mono',monospace",marginBottom:16,textAlign:"center"}}>✓ Face ID / Huella también se activará</div>}
        <button onClick={handleNext}
          style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:14,padding:"13px 40px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>
          Ya lo guardé — Entrar →
        </button>
      </>}
    </div>
  );
}

/* ── LOCK SCREEN ── */
function LockScreen({th, onUnlock}){
  const [pin,setPin]=useState("");
  const [error,setError]=useState("");
  const [attempts,setAttempts]=useState(0);
  const [locked,setLocked]=useState(false);
  const [lockUntil,setLockUntil]=useState(0);
  const [recovering,setRecovering]=useState(false);
  const [recInput,setRecInput]=useState("");
  const [shake,setShake]=useState(false);
  const [bioAvail,setBioAvail]=useState(false);
  const auth=loadAuth();

  useEffect(()=>{
    window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.()
      .then(ok=>setBioAvail(ok&&!!auth?.credentialId)).catch(()=>{});
    // Auto-try biometric on mount
    if(auth?.credentialId){
      setTimeout(()=>tryBio(),400);
    }
  },[]);

  // Countdown timer
  useEffect(()=>{
    if(!locked) return;
    const id=setInterval(()=>{
      if(Date.now()>=lockUntil){ setLocked(false); setAttempts(0); }
    },1000);
    return ()=>clearInterval(id);
  },[locked,lockUntil]);

  const doShake=()=>{ setShake(true); setTimeout(()=>setShake(false),500); };

  const tryBio=async()=>{
    const ok=await verifyBiometric(auth.credentialId);
    if(ok) onUnlock();
    else setError("Biométrico no reconocido");
  };

  const handleDigit=(d)=>{ if(pin.length<6&&!locked) setPin(p=>p+d); };
  const handleDel=()=>{ if(!locked) setPin(p=>p.slice(0,-1)); };

  const handleUnlock=async()=>{
    if(locked||pin.length<4) return;
    const hashed=await hashPin(pin);
    if(hashed===auth.pinHash){
      setPin(""); setError(""); setAttempts(0);
      onUnlock();
    } else {
      const na=attempts+1;
      setAttempts(na); setPin(""); doShake();
      if(na>=5){
        const until=Date.now()+30000;
        setLocked(true); setLockUntil(until);
        setError("Demasiados intentos. Espera 30 segundos.");
      } else {
        setError(`PIN incorrecto. ${5-na} intentos restantes.`);
      }
    }
  };

  const handleRecover=()=>{
    if(recInput.trim().toUpperCase()===auth.recoveryCode){
      saveAuth({...auth, pinHash:null, setupDone:false});
      onUnlock();
    } else {
      doShake(); setError("Código incorrecto");
    }
  };

  const dots=(val,max=6)=>Array.from({length:max},(_,i)=>(
    <div key={i} style={{width:12,height:12,borderRadius:"50%",background:i<val.length?"#7c6af7":th.border2,border:`2px solid ${i<val.length?"#7c6af7":th.border2}`,transition:"all 0.15s"}}/>
  ));

  const Pad=()=>(
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,width:"100%",maxWidth:320,margin:"0 auto"}}>
      {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i)=>(
        <button key={i} onClick={()=>d===""?null:d==="⌫"?handleDel():handleDigit(String(d))}
          disabled={locked}
          style={{height:76,borderRadius:20,border:`1px solid ${th.border2}`,background:d===""?"transparent":th.surface2,
            color:th.text,fontSize:d==="⌫"?22:26,fontWeight:700,cursor:d===""||locked?"default":"pointer",
            fontFamily:"'JetBrains Mono',monospace",opacity:d===""?0:locked?0.4:1,
          }}>{d}</button>
      ))}
    </div>
  );

  if(recovering) return(
    <div style={{position:"fixed",inset:0,background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9000,padding:24}}>
      <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
        <Zap size={22} color="#fff" fill="#fff"/>
      </div>
      <div style={{fontWeight:700,fontSize:18,color:th.text,marginBottom:8}}>Recuperar acceso</div>
      <div style={{fontSize:12,color:th.textMid,marginBottom:24,textAlign:"center",maxWidth:280}}>Ingresa el código de recuperación que guardaste al crear tu PIN</div>
      <input value={recInput} onChange={e=>setRecInput(e.target.value)}
        placeholder="XXXXX-XXXXX-XXXXX"
        style={{background:th.surface2,border:`1px solid ${th.border2}`,borderRadius:12,padding:"12px 16px",color:th.text,fontFamily:"'JetBrains Mono',monospace",fontSize:14,width:"100%",maxWidth:280,outline:"none",textAlign:"center",letterSpacing:2,animation:shake?"shakeDot 0.4s ease":"none"}}/>
      {error&&<div style={{fontSize:11,color:"#ff6060",marginTop:8,fontFamily:"'JetBrains Mono',monospace"}}>{error}</div>}
      <button onClick={handleRecover} style={{marginTop:20,background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:12,padding:"12px 32px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Recuperar acceso</button>
      <button onClick={()=>{setRecovering(false);setError("");}} style={{marginTop:12,background:"none",border:"none",color:th.textDim,fontSize:12,cursor:"pointer"}}>← Volver</button>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9000,padding:"24px",gap:0}}>
      <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
        <Zap size={22} color="#fff" fill="#fff"/>
      </div>
      <div style={{fontWeight:800,fontSize:22,color:th.text,marginBottom:4,letterSpacing:-0.5}}>finzio</div>
      <div style={{fontSize:12,color:th.textMid,marginBottom:20}}>Ingresa tu PIN</div>
      <div style={{display:"flex",gap:10,marginBottom:6,animation:shake?"shakeDot 0.4s ease":"none"}}>{dots(pin)}</div>
      <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:20,minHeight:14}}>{error}</div>
      <Pad/>
      {bioAvail&&(
        <button onClick={tryBio} style={{marginTop:16,background:th.surface2,border:"1px solid "+th.border2,borderRadius:12,padding:"10px 16px",color:"#7c6af7",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:600}}>
          <span style={{fontSize:16}}>🔐</span> Face ID / Huella
        </button>
      )}
      <button onClick={()=>setRecovering(true)} style={{marginTop:14,background:"none",border:"none",color:th.textDim,fontSize:11,cursor:"pointer"}}>
        ¿Olvidaste tu PIN? Usar código de recuperación
      </button>
      <button onClick={handleUnlock} disabled={pin.length<4||!!locked}
        style={{marginTop:12,width:"100%",maxWidth:280,background:pin.length>=4&&!locked?"linear-gradient(90deg,#7c6af7,#34d5b0)":th.surface2,border:"none",borderRadius:14,padding:"14px",color:pin.length>=4&&!locked?"#fff":th.textDim,fontWeight:700,fontSize:15,cursor:pin.length>=4&&!locked?"pointer":"default",transition:"all 0.2s"}}>
        Entrar →
      </button>
    </div>
  );
}

/* ── AUTH GATE ── */
function AuthGate({th, children}){
  const [status,setStatus]=useState(()=>{
    const a=loadAuth();
    if(!a?.setupDone) return "setup";
    return "locked";
  });

  // Auto-lock when tab goes background
  useEffect(()=>{
    const handler=()=>{ if(document.hidden&&status==="unlocked") setStatus("locked"); };
    document.addEventListener("visibilitychange",handler);
    return ()=>document.removeEventListener("visibilitychange",handler);
  },[status]);

  if(status==="setup") return <PinSetup th={th} onDone={()=>setStatus("locked")}/>;
  if(status==="locked") return <LockScreen th={th} onUnlock={()=>setStatus("unlocked")}/>;
  return children;
}

/* ═══════════════════════════════════════════════════════════════
   ONBOARDING — first-time setup wizard
═══════════════════════════════════════════════════════════════ */
const CARD_ACCENTS = ["#7c6af7","#f5a623","#34d5b0","#4a90e2","#ff6060","#6abf69","#e91e8c","#00bcd4"];
const CARD_COLORS  = ["#0d0d1e","#1a1008","#081612","#0a0f1e","#1a0808","#0a1a08","#1a0814","#081a1a"];

function Onboarding({th, onDone}){
  const [step,setStep]=useState(0);
  // step 0 = welcome
  // step 1 = add credit card (optional)
  // step 2 = add debit card (optional)
  // step 3 = first transaction
  // step 4 = done

  const [creditCards,setCreditCards]=useState([]);
  const [debitCards,setDebitCards]=useState([]);
  const [txs,setTxs]=useState([]);

  // Credit card form
  const [ccForm,setCcForm]=useState({name:"",limit:"",balance:"",accent:"#7c6af7",color:"#0d0d1e"});
  // Debit card form
  const [dcForm,setDcForm]=useState({name:"",balance:"",accent:"#4a90e2",color:"#0a0f1e"});
  // First tx form
  const [txForm,setTxForm]=useState({
    type:"expense",
    amount:"",
    description:"",
    date: new Date().toISOString().slice(0,10),
    cardId:"",
  });

  const today = new Date().toISOString().slice(0,10);
  const inp = {
    background:th.inputBg, border:`1px solid ${th.border2}`, borderRadius:10,
    padding:"10px 12px", color:th.text, fontSize:13, width:"100%", outline:"none",
    fontFamily:"'Syne',sans-serif",
  };
  const label = {fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1.5,marginBottom:5,display:"block"};

  const addCreditCard=()=>{
    if(!ccForm.name||!ccForm.limit) return;
    const limit=parseFloat(ccForm.limit)||0;
    const balance=parseFloat(ccForm.balance)||0;
    const id="cc"+genId();
    setCreditCards(p=>[...p,{id,kind:"credit",name:ccForm.name,color:ccForm.color,accent:ccForm.accent,limit,balance,available:Math.max(0,limit-balance)}]);
    setCcForm({name:"",limit:"",balance:"",accent:"#7c6af7",color:"#0d0d1e"});
    setStep(2);
  };
  const addDebitCard=()=>{
    if(!dcForm.name) return;
    const balance=parseFloat(dcForm.balance)||0;
    const id="dc"+genId();
    setDebitCards(p=>[...p,{id,kind:"debit",name:dcForm.name,color:dcForm.color,accent:dcForm.accent,balance}]);
    setDcForm({name:"",balance:"",accent:"#4a90e2",color:"#0a0f1e"});
    setStep(3);
  };

  const allCards=[...creditCards,...debitCards];

  const finish=(extraTx)=>{
    const finalTxs=extraTx?[extraTx]:txs;
    onDone({creditCards,debitCards,txs:finalTxs});
  };

  const addFirstTx=()=>{
    if(!txForm.amount||!txForm.description) return;
    const cardId=txForm.cardId||(allCards[0]?.id)||"none";
    const date=txForm.date||today;
    const tx={id:genId(),cardId,amount:parseFloat(txForm.amount),description:txForm.description,type:txForm.type,date:new Date(date).toISOString()};
    finish(tx);
  };

  // Progress bar
  const totalSteps=4;
  const pct=Math.round((step/totalSteps)*100);

  return(
    <div style={{position:"fixed",inset:0,background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",zIndex:8000,overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:480,padding:"24px 20px 60px",display:"flex",flexDirection:"column",gap:0}}>

        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Zap size={16} color="#fff" fill="#fff"/>
          </div>
          <span style={{fontWeight:800,fontSize:18,letterSpacing:-0.5,color:th.text}}>finzio <span style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",background:th.surface2,padding:"2px 7px",borderRadius:99,border:`1px solid ${th.border}`}}>AI</span></span>
        </div>

        {/* Progress */}
        {step>0&&step<4&&(
          <div style={{marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace"}}>PASO {step} DE {totalSteps}</span>
              <span style={{fontSize:10,color:"#7c6af7",fontFamily:"'JetBrains Mono',monospace"}}>{pct}%</span>
            </div>
            <div style={{height:3,background:th.border2,borderRadius:2}}>
              <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#7c6af7,#34d5b0)",borderRadius:2,transition:"width 0.4s ease"}}/>
            </div>
          </div>
        )}

        {/* ── STEP 0: Welcome ── */}
        {step===0&&(
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <div style={{fontSize:28,fontWeight:800,color:th.text,lineHeight:1.2,marginBottom:12}}>
              Bienvenido a<br/><span style={{background:"linear-gradient(90deg,#7c6af7,#34d5b0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Finzio</span> 👋
            </div>
            <div style={{fontSize:11,color:"#34d5b0",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:0.5,lineHeight:1.7,marginBottom:12,padding:"10px 14px",background:"#34d5b012",border:"1px solid #34d5b033",borderRadius:10}}>
              El primer paso para tu libertad financiera es administrar tus egresos e ingresos. Felicidades, estás en el camino adecuado 🌟
            </div>
            <div style={{fontSize:14,color:th.textMid,lineHeight:1.7,marginBottom:32}}>
              Tu asistente financiero personal. En los siguientes pasos configuraremos tu cuenta para que tengas control total de tus finanzas.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
              {[
                {icon:"💳", t:"Agrega tus tarjetas", d:"Crédito y débito, o empieza sin ellas"},
                {icon:"📊", t:"Registra movimientos", d:"Gastos, ingresos y pagos con fecha exacta"},
                {icon:"🔔", t:"Recibe recordatorios", d:"Alertas de pago antes de que venzan"},
                {icon:"🤖", t:"Chat con IA", d:"Registra gastos con lenguaje natural o fotos"},
              ].map(({icon,t,d})=>(
                <div key={t} style={{display:"flex",gap:12,alignItems:"center",background:th.surface,border:`1px solid ${th.border}`,borderRadius:14,padding:"12px 14px"}}>
                  <div style={{fontSize:22,flexShrink:0}}>{icon}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:th.text}}>{t}</div>
                    <div style={{fontSize:11,color:th.textDim,marginTop:1}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>setStep(1)} style={{width:"100%",background:"linear-gradient(90deg,#7c6af7,#34d5b0)",border:"none",borderRadius:14,padding:"15px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 8px 24px #7c6af740"}}>
              Comenzar →
            </button>
          </div>
        )}

        {/* ── STEP 1: Credit Card ── */}
        {step===1&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontSize:22,fontWeight:800,color:th.text,marginBottom:6}}>💳 Tarjeta de crédito</div>
            <div style={{fontSize:13,color:th.textMid,marginBottom:6,lineHeight:1.6}}>
              Agrega tu primera tarjeta de crédito para llevar control de gastos y pagos.
            </div>
            <div style={{background:"#7c6af718",border:"1px solid #7c6af733",borderRadius:10,padding:"9px 12px",marginBottom:20,fontSize:11,color:"#7c6af7",fontFamily:"'JetBrains Mono',monospace"}}>
              💡 Recomendado — tendrás mejor control desde el inicio
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <span style={label}>NOMBRE DE LA TARJETA</span>
                <input style={inp} placeholder="ej. Visa Platinum, BBVA Azul..." value={ccForm.name} onChange={e=>setCcForm(p=>({...p,name:e.target.value}))}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <span style={label}>LÍMITE DE CRÉDITO</span>
                  <input style={inp} type="number" placeholder="50000" value={ccForm.limit} onChange={e=>setCcForm(p=>({...p,limit:e.target.value}))}/>
                </div>
                <div>
                  <span style={label}>SALDO ACTUAL USADO</span>
                  <input style={inp} type="number" placeholder="0" value={ccForm.balance} onChange={e=>setCcForm(p=>({...p,balance:e.target.value}))}/>
                </div>
              </div>
              <div>
                <span style={label}>COLOR DE ACENTO</span>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {CARD_ACCENTS.map((c,i)=>(
                    <div key={c} onClick={()=>setCcForm(p=>({...p,accent:c,color:CARD_COLORS[i]}))}
                      style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`3px solid ${ccForm.accent===c?"#fff":"transparent"}`,transition:"all 0.15s"}}/>
                  ))}
                </div>
              </div>
              {/* Card preview */}
              {ccForm.name&&(
                <div style={{background:`linear-gradient(145deg,${ccForm.color},${ccForm.accent}22)`,border:`1px solid ${ccForm.accent}44`,borderRadius:16,padding:"14px 16px"}}>
                  <div style={{fontSize:9,color:ccForm.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>{ccForm.name.toUpperCase()}</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{fmt(parseFloat(ccForm.balance)||0)}</div>
                  <div style={{fontSize:9,color:"#ffffff44",fontFamily:"'JetBrains Mono',monospace"}}>de {fmt(parseFloat(ccForm.limit)||0)} · CRÉDITO</div>
                </div>
              )}
              <button onClick={addCreditCard} disabled={!ccForm.name||!ccForm.limit}
                style={{background:ccForm.name&&ccForm.limit?"linear-gradient(90deg,#7c6af7,#34d5b0)":"#333",border:"none",borderRadius:12,padding:"13px",color:"#fff",fontWeight:700,fontSize:14,cursor:ccForm.name&&ccForm.limit?"pointer":"default",opacity:ccForm.name&&ccForm.limit?1:0.5}}>
                Agregar tarjeta →
              </button>
              <button onClick={()=>setStep(2)} style={{background:"none",border:`1px solid ${th.border2}`,borderRadius:12,padding:"11px",color:th.textDim,fontSize:12,cursor:"pointer"}}>
                Omitir por ahora
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Debit Card ── */}
        {step===2&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontSize:22,fontWeight:800,color:th.text,marginBottom:6}}>🏦 Tarjeta de débito</div>
            <div style={{fontSize:13,color:th.textMid,marginBottom:6,lineHeight:1.6}}>
              Agrega una tarjeta de débito para registrar ingresos y egresos de tu cuenta bancaria.
            </div>
            <div style={{background:"#34d5b018",border:"1px solid #34d5b033",borderRadius:10,padding:"9px 12px",marginBottom:20,fontSize:11,color:"#34d5b0",fontFamily:"'JetBrains Mono',monospace"}}>
              💡 Recomendado — registra nómina y gastos del día a día
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <span style={label}>NOMBRE DE LA TARJETA</span>
                <input style={inp} placeholder="ej. BBVA Débito, Banorte..." value={dcForm.name} onChange={e=>setDcForm(p=>({...p,name:e.target.value}))}/>
              </div>
              <div>
                <span style={label}>SALDO ACTUAL</span>
                <input style={inp} type="number" placeholder="0" value={dcForm.balance} onChange={e=>setDcForm(p=>({...p,balance:e.target.value}))}/>
              </div>
              <div>
                <span style={label}>COLOR</span>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {CARD_ACCENTS.map((c,i)=>(
                    <div key={c} onClick={()=>setDcForm(p=>({...p,accent:c,color:CARD_COLORS[i]}))}
                      style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`3px solid ${dcForm.accent===c?"#fff":"transparent"}`,transition:"all 0.15s"}}/>
                  ))}
                </div>
              </div>
              {dcForm.name&&(
                <div style={{background:`linear-gradient(145deg,${dcForm.color},${dcForm.accent}22)`,border:`1px solid ${dcForm.accent}44`,borderRadius:16,padding:"14px 16px"}}>
                  <div style={{fontSize:9,color:dcForm.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>{dcForm.name.toUpperCase()}</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{fmt(parseFloat(dcForm.balance)||0)}</div>
                  <div style={{fontSize:9,color:"#ffffff44",fontFamily:"'JetBrains Mono',monospace"}}>SALDO DISPONIBLE · DÉBITO</div>
                </div>
              )}
              <button onClick={addDebitCard} disabled={!dcForm.name}
                style={{background:dcForm.name?"linear-gradient(90deg,#7c6af7,#34d5b0)":"#333",border:"none",borderRadius:12,padding:"13px",color:"#fff",fontWeight:700,fontSize:14,cursor:dcForm.name?"pointer":"default",opacity:dcForm.name?1:0.5}}>
                Agregar tarjeta →
              </button>
              <button onClick={()=>setStep(3)} style={{background:"none",border:`1px solid ${th.border2}`,borderRadius:12,padding:"11px",color:th.textDim,fontSize:12,cursor:"pointer"}}>
                Omitir por ahora
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: First Transaction ── */}
        {step===3&&(
          <div style={{animation:"fadeUp 0.3s ease"}}>
            <div style={{fontSize:22,fontWeight:800,color:th.text,marginBottom:6}}>📝 Primer movimiento</div>
            <div style={{fontSize:13,color:th.textMid,marginBottom:20,lineHeight:1.6}}>
              Registra tu primer ingreso o egreso. La fecha es importante — si no la recuerdas con exactitud, se usará la fecha de hoy.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {/* Type */}
              <div style={{display:"flex",gap:8}}>
                {[{v:"expense",l:"− Egreso / Gasto"},{v:"income",l:"+ Ingreso"}].map(({v,l})=>(
                  <button key={v} onClick={()=>setTxForm(p=>({...p,type:v}))}
                    style={{flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,
                      background:txForm.type===v?(v==="expense"?"#ff404028":"#00c37a28"):"transparent",
                      color:txForm.type===v?(v==="expense"?"#ff6060":"#00c37a"):th.textDim,
                      border:`1px solid ${txForm.type===v?(v==="expense"?"#ff606044":"#00c37a44"):th.border2}`}}>
                    {l}
                  </button>
                ))}
              </div>
              <div>
                <span style={label}>MONTO</span>
                <input style={inp} type="number" placeholder="0.00" value={txForm.amount} onChange={e=>setTxForm(p=>({...p,amount:e.target.value}))}/>
              </div>
              <div>
                <span style={label}>DESCRIPCIÓN</span>
                <input style={inp} placeholder="¿Qué fue?" value={txForm.description} onChange={e=>setTxForm(p=>({...p,description:e.target.value}))}/>
              </div>
              <div>
                <span style={label}>FECHA DEL MOVIMIENTO <span style={{color:"#7c6af7"}}>(por defecto: hoy)</span></span>
                <input style={inp} type="date" value={txForm.date||today} onChange={e=>setTxForm(p=>({...p,date:e.target.value}))}/>
                <div style={{fontSize:10,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>
                  Si no recuerdas la fecha exacta, deja la de hoy ✓
                </div>
              </div>
              {allCards.length>0&&(
                <div>
                  <span style={label}>TARJETA (opcional)</span>
                  <select style={{...inp,cursor:"pointer"}} value={txForm.cardId} onChange={e=>setTxForm(p=>({...p,cardId:e.target.value}))}>
                    <option value="">Sin tarjeta específica</option>
                    {allCards.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <button onClick={addFirstTx} disabled={!txForm.amount||!txForm.description}
                style={{background:txForm.amount&&txForm.description?"linear-gradient(90deg,#7c6af7,#34d5b0)":"#333",border:"none",borderRadius:12,padding:"13px",color:"#fff",fontWeight:700,fontSize:14,cursor:txForm.amount&&txForm.description?"pointer":"default",opacity:txForm.amount&&txForm.description?1:0.5}}>
                Registrar y entrar →
              </button>
              <button onClick={()=>finish(null)} style={{background:"none",border:`1px solid ${th.border2}`,borderRadius:12,padding:"11px",color:th.textDim,fontSize:12,cursor:"pointer"}}>
                Omitir y entrar a la app
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOCALSTORAGE HELPERS
═══════════════════════════════════════════════════════════════ */
const LS_KEY = "fintrack_v1";
function loadState(){
  try{ const raw=localStorage.getItem(LS_KEY); if(!raw) return null; return JSON.parse(raw); }
  catch{ return null; }
}
function saveState(state){
  try{ localStorage.setItem(LS_KEY,JSON.stringify(state)); }catch{}
}

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
export default function App(){
  const saved=loadState();
  const [dark,setDark]=useState(saved?.dark ?? true);
  const [fbUser,setFbUser]=useState(null);
  const [fbSyncing,setFbSyncing]=useState(false);
  const [fbLoaded,setFbLoaded]=useState(false);
  const th=dark?DARK:LIGHT;
  const [creditCards,setCreditCards]=useState(saved?.creditCards ?? CREDIT_CARDS);
  const [debitCards,setDebitCards]=useState(saved?.debitCards ?? DEBIT_CARDS);
  const cards={credit:creditCards,debit:debitCards};
  const [txs,setTxs]=useState(saved?.txs ?? SEED_TXS);
  const [active,setActive]=useState(()=>{
    const s=loadState();
    const all=[...(s?.creditCards??[]),...(s?.debitCards??[])];
    return all.find(c=>c.id===s?.activeId) ?? all[0] ?? null;
  });
  const [cardMode,setCardMode]=useState(saved?.cardMode ?? "credit");
  const [view,setView]=useState("dash");
  const [onboarding,setOnboarding]=useState(()=>!(loadState()?.onboardingDone));
  const [reminderSettings,setReminderSettings]=useState(saved?.reminderSettings ?? DEFAULT_REMINDER_SETTINGS);
  const [cardReminders,setCardReminders]=useState(saved?.cardReminders ?? DEFAULT_CARD_REMINDERS);
  const [budgets,setBudgets]=useState(saved?.budgets ?? {});
  const [goals,setGoals]=useState(saved?.goals ?? []);
  const {toasts,add:toast}=useToast();

  // Auth state listener
  useEffect(()=>{
    const unsub = onAuthStateChanged(fbAuth, async user => {
      setFbUser(user);
      if(user && !fbLoaded){
        setFbSyncing(true);
        const cloud = await loadFromFirestore(user.uid);
        if(cloud){
          if(cloud.creditCards?.length) setCreditCards(cloud.creditCards);
          if(cloud.debitCards?.length)  setDebitCards(cloud.debitCards);
          if(cloud.txs?.length)         setTxs(cloud.txs);
          if(cloud.budgets && Object.keys(cloud.budgets).length) setBudgets(cloud.budgets);
          if(cloud.goals?.length)       setGoals(cloud.goals);
        }
        setFbLoaded(true);
        setFbSyncing(false);
      }
    });
    return ()=>unsub();
  },[]);

  // Persist locally + sync to Firestore when data changes
  useEffect(()=>{
    saveState({dark,creditCards,debitCards,txs,activeId:active?.id,cardMode,reminderSettings,cardReminders,onboardingDone:!onboarding,budgets,goals});
    if(fbUser && fbLoaded){
      syncToFirestore(fbUser.uid,{creditCards,debitCards,txs,budgets,goals});
    }
  },[dark,creditCards,debitCards,txs,active?.id,cardMode,onboarding,budgets,goals,fbUser,fbLoaded]);

  const editTx=useCallback(tx=>{
    setTxs(p=>p.map(t=>t.id===tx.id?tx:t));
  },[]);

  const deleteTx=useCallback(id=>{
    setTxs(p=>p.filter(t=>t.id!==id));
  },[]);

  const addTx=useCallback(tx=>{
    const ntx={...tx,id:genId()};
    setTxs(p=>[ntx,...p]);
    if(tx.type==="expense"){
      const isCr=creditCards.some(c=>c.id===tx.cardId);
      if(isCr){ setCreditCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:c.balance+tx.amount,available:Math.max(0,c.available-tx.amount)}:c)); }
      else { setDebitCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:Math.max(0,c.balance-tx.amount)}:c)); }
    } else if(tx.type==="income"){
      setDebitCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:c.balance+tx.amount}:c));
    } else if(tx.type==="payment"){
      setCreditCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:Math.max(0,c.balance-tx.amount),available:Math.min(c.limit,c.available+tx.amount)}:c));
      setDebitCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:Math.max(0,c.balance-tx.amount)}:c));
    }
  },[creditCards,debitCards]);

  useDailyNotifCheck(creditCards,cardReminders,reminderSettings);

  // Onboarding shown before auth
  if(fbSyncing) return(
    <div style={{position:"fixed",inset:0,background:"#07070f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>⚡</div>
      <div style={{fontWeight:800,fontSize:18,color:"#fff",fontFamily:"'Syne',sans-serif"}}>finzio</div>
      <div style={{fontSize:12,color:"#34d5b0",fontFamily:"'JetBrains Mono',monospace",animation:"pulse 1.5s ease infinite"}}>Sincronizando datos…</div>
    </div>
  );

  if(onboarding) return(
    <Onboarding th={th} onDone={({creditCards:cc,debitCards:dc,txs:t})=>{
      if(cc.length) setCreditCards(cc);
      if(dc.length) setDebitCards(dc);
      if(t.length) setTxs(t);
      const first=[...cc,...dc][0]??null;
      if(first) setActive(first);
      setOnboarding(false);
    }}/>
  );

  return(
    <AuthGate th={th}>
      <div className="app-shell">
        {/* HEADER */}
        <div className="safe-top" style={{background:th.headerBg,borderBottom:`1px solid ${th.border}`,flexShrink:0}}>
          <div style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Zap size={14} color="#fff" fill="#fff"/>
              </div>
              <span style={{fontWeight:800,fontSize:17,letterSpacing:-0.5,color:th.text}}>finzio</span>
              <span style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",background:th.surface2,padding:"2px 7px",borderRadius:99,border:`1px solid ${th.border}`}}>AI</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {active&&<div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:active.accent}}/>
                <span style={{fontSize:10,color:th.textMid,fontFamily:"'JetBrains Mono',monospace"}}>{active.name.split(" ")[0]}</span>
              </div>}
              {/* Cloud sync button */}
              <button onClick={()=>fbUser?fbSignOut():fbSignIn()} title={fbUser?`Sincronizado: ${fbUser.email}`:"Sincronizar con Google"}
                style={{width:34,height:34,borderRadius:10,border:`1px solid ${fbUser?"#7c6af755":th.border2}`,background:fbUser?"#7c6af718":th.surface2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                {fbSyncing
                  ? <span style={{fontSize:14,animation:"spin 1s linear infinite",display:"block"}}>⟳</span>
                  : fbUser
                    ? (fbUser.photoURL
                        ? <img src={fbUser.photoURL} alt="" style={{width:22,height:22,borderRadius:"50%"}}/>
                        : <span style={{fontSize:14}}>☁</span>)
                    : <span style={{fontSize:14,color:th.textDim}}>☁</span>
                }
              </button>
              <button onClick={()=>setView("notifs")} style={{width:34,height:34,borderRadius:10,border:`1px solid ${th.border2}`,background:th.surface2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.textMid}}>
                <Bell size={15}/>
              </button>
              <button onClick={()=>setDark(d=>!d)} style={{width:34,height:34,borderRadius:10,border:`1px solid ${th.border2}`,background:th.surface2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.textMid}}>
                {dark?<Sun size={15}/>:<Moon size={15}/>}
              </button>
              {fbUser
                ?<button onClick={()=>signOut(fbAuth)} title={fbUser.displayName||"Cerrar sesión"}
                    style={{width:34,height:34,borderRadius:10,border:"1px solid #34d5b044",background:"#34d5b018",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    {fbUser.photoURL
                      ?<img src={fbUser.photoURL} style={{width:34,height:34,borderRadius:10,objectFit:"cover"}} alt=""/>
                      :<span style={{fontSize:13,fontWeight:700,color:"#34d5b0"}}>{(fbUser.displayName||"U")[0]}</span>}
                  </button>
                :<button onClick={()=>signInWithPopup(fbAuth,googleProvider).catch(()=>{})}
                    style={{height:34,padding:"0 10px",borderRadius:10,border:"1px solid #7c6af744",background:"#7c6af718",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:"#7c6af7",fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>
                    ☁ Sync
                  </button>
              }
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{flex:1,minHeight:0,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
          {view==="notifs"
            ?<NotificationsView
                creditCards={creditCards}
                cardReminders={cardReminders}
                setCardReminders={setCardReminders}
                reminderSettings={reminderSettings}
                setReminderSettings={setReminderSettings}
                th={th}
                onBack={()=>setView("dash")}
              />
            :view==="chat"
              ?<ChatView cards={cards} activeCard={active} th={th} onAddTx={addTx}/>
            :view==="history"
              ?<HistoryView transactions={txs} cards={cards} th={th} onEditTx={editTx} onDeleteTx={deleteTx}/>
            :view==="analytics"
              ?<AnalyticsView transactions={txs} th={th}/>
            :view==="budgets"
              ?<BudgetsView transactions={txs} budgets={budgets} setBudgets={setBudgets} th={th}/>
            :view==="goals"
              ?<GoalsView goals={goals} setGoals={setGoals} th={th}/>
              :<DashView
                  cards={cards}
                  setCards={{setCreditCards,setDebitCards}}
                  transactions={txs}
                  activeCard={active}
                  setActiveCard={setActive}
                  cardMode={cardMode}
                  setCardMode={setCardMode}
                  th={th}
                  onAddTx={addTx}
                  onEditTx={editTx}
                  onDeleteTx={deleteTx}
                />
          }
        </div>

        {/* NAV */}
        {view!=="notifs"&&(
          <div className="safe-bottom" style={{background:th.navBg,borderTop:`1px solid ${th.border}`,display:"flex",flexShrink:0}}>
            {[
              {id:"dash",icon:<LayoutDashboard size={20}/>,label:"INICIO"},
              {id:"history",icon:<Clock size={20}/>,label:"HISTORIAL"},
              {id:"chat",icon:<MessageCircle size={20}/>,label:"CHAT IA"},
              {id:"analytics",icon:<BarChart2 size={20}/>,label:"ANÁLISIS"},
              {id:"goals",icon:<Target size={20}/>,label:"METAS"},
            ].map(({id,icon,label})=>(
              <button key={id} onClick={()=>setView(id)}
                style={{flex:1,background:"none",border:"none",padding:"12px 0 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                  color:view===id?"#7c6af7":th.textDim}}>
                {icon}
                <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:1}}>{label}</span>
                {view===id&&<div style={{width:4,height:4,borderRadius:"50%",background:"#7c6af7"}}/>}
              </button>
            ))}
          </div>
        )}
        <Toasts toasts={toasts}/>
      </div>
    </AuthGate>
  );
}
