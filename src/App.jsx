import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic, CreditCard, TrendingUp, TrendingDown, Plus, X,
  Tag, Calendar, Zap, Send, Paperclip, FileText,
  MessageCircle, LayoutDashboard, Sparkles, Check, CheckCheck,
  Volume2, Sun, Moon, ArrowDownLeft, Wallet,
  Bell, Settings, ChevronRight, AlertTriangle
} from "lucide-react";

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
      html { height:100%; height:-webkit-fill-available; }
      body {
        background:${th.bg};
        font-family:'Syne',sans-serif;
        color:${th.text};
        height:100%; height:-webkit-fill-available;
        overflow:hidden;
        -webkit-font-smoothing:antialiased;
        overscroll-behavior:none;
        transition: background 0.3s ease, color 0.3s ease;
      }
      #root { height:100%; display:flex; align-items:stretch; justify-content:center; background:${th.bodyBg}; }
      .app-shell {
        display:flex; flex-direction:column; width:100%; max-width:480px;
        height:100%; min-height:0; position:relative;
        background:${th.shell}; overflow:hidden;
        transition: background 0.3s ease;
      }
      @media(min-width:768px){
        #root { align-items:center; }
        .app-shell {
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
      .safe-top    { padding-top: env(safe-area-inset-top, 0px); }
      .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA — CREDIT & DEBIT CARDS
═══════════════════════════════════════════════════════════════ */
const CREDIT_CARDS = [
  { id:"cc1", kind:"credit", name:"Visa Platinum",    color:"#0d0d1e", accent:"#7c6af7", limit:50000, balance:18420, available:31580 },
  { id:"cc2", kind:"credit", name:"Mastercard Gold",  color:"#1a1008", accent:"#f5a623", limit:30000, balance:7850,  available:22150 },
  { id:"cc3", kind:"credit", name:"Amex Infinite",    color:"#081612", accent:"#34d5b0", limit:80000, balance:32100, available:47900 },
];
const DEBIT_CARDS = [
  { id:"dc1", kind:"debit",  name:"BBVA Débito",      color:"#0a0f1e", accent:"#4a90e2", balance:15000 },
  { id:"dc2", kind:"debit",  name:"Banorte Débito",   color:"#0f1a0a", accent:"#6abf69", balance:8500  },
];

const SEED_TXS = [
  { id:"t1", cardId:"cc1", amount:1200, description:"Supermercado Chedraui", type:"expense", date:"2026-02-19T10:30:00Z" },
  { id:"t2", cardId:"cc1", amount:450,  description:"Gasolina Pemex",        type:"expense", date:"2026-02-18T15:00:00Z" },
  { id:"t3", cardId:"cc2", amount:2800, description:"Restaurante Pujol",     type:"expense", date:"2026-02-17T20:00:00Z" },
  { id:"t4", cardId:"cc3", amount:5500, description:"Vuelo CDMX-CUN",        type:"expense", date:"2026-02-16T08:00:00Z" },
  { id:"t5", cardId:"dc1", amount:320,  description:"Netflix & Spotify",     type:"expense", date:"2026-02-15T00:00:00Z" },
  { id:"t6", cardId:"dc1", amount:5000, description:"Depósito nómina",       type:"income",  date:"2026-02-14T09:00:00Z" },
  { id:"t7", cardId:"cc1", amount:3000, description:"Pago tarjeta",          type:"payment", date:"2026-02-13T11:00:00Z" },
];

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
   CLAUDE API
═══════════════════════════════════════════════════════════════ */
const SYSTEM = `Eres un asistente financiero personal en una app de gestión de finanzas.

REGLAS:
1. Detecta transacciones en el mensaje y responde con JSON al FINAL:
   [TRANSACTIONS]
   [{"amount":123.45,"description":"desc","type":"expense","cardHint":""}]
   [/TRANSACTIONS]
2. Múltiples items en un ticket → un objeto por item.
3. Imagen/PDF de ticket → extrae TODOS los artículos con precios.
4. Solo conversación → responde normalmente, sin bloque JSON.
5. Respuestas cortas y con emojis. amount siempre positivo.
6. type: "expense" para gastos, "income" para ingresos/depósitos, "payment" para pagos a tarjeta de crédito.
TARJETAS DE CRÉDITO: Visa Platinum, Mastercard Gold, Amex Infinite.
TARJETAS DE DÉBITO: BBVA Débito, Banorte Débito.`;

async function callClaude(messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:SYSTEM, messages })
  });
  if(!r.ok) throw new Error("API "+r.status);
  const d = await r.json();
  return d.content.map(b=>b.text||"").join("");
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
   VOICE RECORDER
═══════════════════════════════════════════════════════════════ */
function useVoiceRecorder({onDone,toast}){
  const [rec,setRec]=useState(false);
  const [dur,setDur]=useState(0);
  const mrRef=useRef(null),strmRef=useRef(null),chkRef=useRef([]),tmrRef=useRef(null);
  useEffect(()=>()=>{ clearInterval(tmrRef.current); mrRef.current?.stop(); strmRef.current?.getTracks().forEach(t=>t.stop()); },[]);
  const stop=useCallback(()=>{ clearInterval(tmrRef.current); setDur(0); if(mrRef.current&&rec){mrRef.current.stop();setRec(false);} },[rec]);
  const start=async()=>{
    let stream;
    try{stream=await navigator.mediaDevices.getUserMedia({audio:true});strmRef.current=stream;}
    catch{toast("Sin acceso al micrófono","error");return;}
    try{
      const mr=new MediaRecorder(stream); mrRef.current=mr; chkRef.current=[];
      mr.ondataavailable=e=>{if(e.data.size>0)chkRef.current.push(e.data);};
      mr.onstop=async()=>{const blob=new Blob(chkRef.current,{type:"audio/webm"});const b=await b64(blob);stream.getTracks().forEach(t=>t.stop());onDone(b,dur);};
      mr.start(); setRec(true);
      tmrRef.current=setInterval(()=>setDur(d=>{if(d>=59){stop();return 0;}return d+1;}),1000);
    }catch{stream.getTracks().forEach(t=>t.stop());toast("Error al grabar","error");}
  };
  return {rec,dur,start,stop};
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
          <span style={{flex:1,fontSize:12,color:th.textMid,minWidth:80}}>{tx.description}</span>
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
    txs.forEach((tx,i)=>onAddTx({cardId:cardIds[i],amount:tx.amount,description:tx.description,type:tx.type,date:new Date().toISOString()}));
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

  const voiceDone=async(bdata,dur)=>{
    const mm=Math.floor(dur/60),ss=String(dur%60).padStart(2,"0"),uid=genId();
    setMsgs(p=>[...p,{id:uid,role:"user",text:"",isVoice:true,voiceDuration:`${mm}:${ss}`,rawContent:"[Nota de voz]",ts:Date.now(),status:"sent"}]);
    await sendClaude("[El usuario envió una nota de voz. Responde que la demo usa texto/imagen, pero puedes registrar si describe el gasto.]",null);
    setMsgs(p=>p.map(m=>m.id===uid?{...m,status:"read"}:m));
  };

  const voice=useVoiceRecorder({onDone:voiceDone,toast});
  const onKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0,background:th.shell}}>
      <div style={{padding:"12px 16px",borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0,background:th.headerBg}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Sparkles size={16} color="#fff"/>
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:th.text}}>Asistente FinTrack</div>
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
        {input.trim()||att
          ?<button onClick={send} disabled={thinking} style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:thinking?0.5:1}}>
              <Send size={15}/>
            </button>
          :<button onMouseDown={voice.start} onMouseUp={voice.stop} onTouchStart={voice.start} onTouchEnd={voice.stop}
              style={{width:38,height:38,borderRadius:12,background:voice.rec?"linear-gradient(135deg,#e03030,#ff6060)":th.surface2,border:`1px solid ${voice.rec?"#e0303055":th.border2}`,color:voice.rec?"#fff":"#7c6af7",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:voice.rec?"glow 1s ease infinite":"none"}}>
              {voice.rec?<span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{voice.dur}s</span>:<Mic size={15}/>}
            </button>
        }
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
   NOTIFICATIONS VIEW (full screen panel)
═══════════════════════════════════════════════════════════════ */
function NotificationsView({creditCards, cardReminders, setCardReminders, reminderSettings, setReminderSettings, th, onBack}) {
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

        <div style={{height:20}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD VIEW
═══════════════════════════════════════════════════════════════ */
function DashView({cards,setCards,transactions,activeCard,setActiveCard,cardMode,setCardMode,th,onAddTx}){
  const [modal,setModal]=useState(false);
  const [payModal,setPayModal]=useState(false);

  const currentCards = cardMode==="credit" ? cards.credit : cards.debit;
  const txs = transactions.filter(t=>t.cardId===activeCard.id);
  const exp = txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const inc = txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const pays= txs.filter(t=>t.type==="payment").reduce((s,t)=>s+t.amount,0);

  const handlePay=(amount,note)=>{
    // Add payment transaction
    onAddTx({cardId:activeCard.id,amount,description:note,type:"payment",date:new Date().toISOString()});
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
                ?<CreditCardVisual card={c} selected={activeCard.id===c.id} onClick={()=>setActiveCard(c)}/>
                :<DebitCardVisual  card={c} selected={activeCard.id===c.id} onClick={()=>setActiveCard(c)}/>
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

      {/* ── Stats ── */
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
          <div style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:2}}>{activeCard.name.toUpperCase()}</div>
        </div>
        {txs.length===0&&<div style={{textAlign:"center",padding:32,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>Sin movimientos</div>}
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {txs.map((tx,i)=>{
            const {label,color,bg}=txLabel(tx.type);
            return(
              <div key={tx.id} style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:14,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,animation:`fadeUp 0.28s ease ${i*0.03}s both`}}>
                <div style={{width:34,height:34,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {tx.type==="income"?<TrendingUp size={14} color="#00c37a"/>:tx.type==="payment"?<ArrowDownLeft size={14} color="#7c6af7"/>:<Tag size={14} color="#ff6060"/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:th.text}}>{tx.description}</div>
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
   LOCALSTORAGE HELPERS
═══════════════════════════════════════════════════════════════ */
const LS_KEY = "fintrack_v1";
function loadState(){
  try{
    const raw=localStorage.getItem(LS_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch{ return null; }
}
function saveState(state){
  try{ localStorage.setItem(LS_KEY,JSON.stringify(state)); }catch{}
}

export default function App(){
  // ── Hydrate from localStorage or fall back to defaults ──
  const saved = loadState();

  const [dark,setDark]=useState(saved?.dark ?? true);
  const th=dark?DARK:LIGHT;

  const [creditCards,setCreditCards]=useState(saved?.creditCards ?? CREDIT_CARDS);
  const [debitCards,setDebitCards]=useState(saved?.debitCards ?? DEBIT_CARDS);
  const cards={credit:creditCards,debit:debitCards};

  const [txs,setTxs]=useState(saved?.txs ?? SEED_TXS);
  const [active,setActive]=useState(
    ()=>{
      const s=loadState();
      const all=[...(s?.creditCards??CREDIT_CARDS),...(s?.debitCards??DEBIT_CARDS)];
      return all.find(c=>c.id===s?.activeId) ?? CREDIT_CARDS[0];
    }
  );
  const [cardMode,setCardMode]=useState(saved?.cardMode ?? "credit");
  const [view,setView]=useState("dash");
  const [reminderSettings,setReminderSettings]=useState(saved?.reminderSettings ?? DEFAULT_REMINDER_SETTINGS);
  const [cardReminders,setCardReminders]=useState(saved?.cardReminders ?? DEFAULT_CARD_REMINDERS);
  const [bannerDismissed,setBannerDismissed]=useState(false);
  const {toasts,add:toast}=useToast();

  // ── Persist on every change ──
  useEffect(()=>{
    saveState({dark,creditCards,debitCards,txs,activeId:active.id,cardMode,reminderSettings,cardReminders});
  },[dark,creditCards,debitCards,txs,active.id,cardMode]);

  const addTx=useCallback(tx=>{
    const ntx={...tx,id:genId()};
    setTxs(p=>[ntx,...p]);

    if(tx.type==="expense"){
      // Credit: increase balance, decrease available
      // Debit: decrease balance
      const isCr=creditCards.some(c=>c.id===tx.cardId);
      if(isCr){
        setCreditCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:c.balance+tx.amount,available:Math.max(0,c.available-tx.amount)}:c));
      } else {
        setDebitCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:Math.max(0,c.balance-tx.amount)}:c));
      }
    } else if(tx.type==="income"){
      // Debit only
      setDebitCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:c.balance+tx.amount}:c));
    } else if(tx.type==="payment"){
      // Credit: decrease balance (paid), increase available
      setCreditCards(p=>p.map(c=>c.id===tx.cardId?{...c,balance:Math.max(0,c.balance-tx.amount),available:Math.min(c.limit,c.available+tx.amount)}:c));
    }
  },[creditCards]);

  const NAV=[
    {id:"dash",   Icon:LayoutDashboard, label:"Inicio"},
    {id:"chat",   Icon:MessageCircle,   label:"Chat IA"},
    {id:"notifs", Icon:Bell,            label:"Avisos"},
  ];

  // Keep active card consistent with cardMode
  useEffect(()=>{
    const list=cardMode==="credit"?creditCards:debitCards;
    if(!list.some(c=>c.id===active.id)) setActive(list[0]);
  },[cardMode]);

  // Daily notification check
  useDailyNotifCheck(creditCards, cardReminders, reminderSettings);

  // Sync active card data when balances change
  useEffect(()=>{
    const all=[...creditCards,...debitCards];
    const updated=all.find(c=>c.id===active.id);
    if(updated) setActive(updated);
  },[creditCards,debitCards]);

  return(
    <>
      <GlobalStyles th={th}/>
      <div className="app-shell">

        {/* ── HEADER ── */}
        <div className="safe-top" style={{background:th.headerBg,borderBottom:`1px solid ${th.border}`,flexShrink:0}}>
          <div style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#7c6af7,#34d5b0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Zap size={14} color="#fff" fill="#fff"/>
              </div>
              <span style={{fontWeight:800,fontSize:17,letterSpacing:-0.5,color:th.text}}>fintrack</span>
              <span style={{fontSize:9,color:th.textDim,fontFamily:"'JetBrains Mono',monospace",background:th.surface2,padding:"2px 7px",borderRadius:99,border:`1px solid ${th.border}`}}>AI</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {/* Active card indicator */}
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:active.accent}}/>
                <span style={{fontSize:10,color:th.textMid,fontFamily:"'JetBrains Mono',monospace"}}>{active.name.split(" ")[0]}</span>
              </div>
              {/* Notifications bell */}
              <button onClick={()=>setView("notifs")} style={{
                width:34,height:34,borderRadius:10,border:`1px solid ${th.border2}`,
                background:th.surface2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                color:"#7c6af7",position:"relative",
              }}>
                <Bell size={15}/>
                {creditCards.some(c=>{const cfg=cardReminders[c.id];return cfg?.enabled&&daysUntilPayment(cfg.payDay)<=3;})&&(
                  <div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#ff6060",border:`2px solid ${th.shell}`}}/>
                )}
              </button>
              {/* Dark/Light toggle */}
              <button onClick={()=>setDark(d=>!d)} style={{
                width:34,height:34,borderRadius:10,border:`1px solid ${th.border2}`,
                background:th.surface2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                color:dark?"#f5a623":"#7c6af7",transition:"all 0.2s",
              }} title={dark?"Modo claro":"Modo oscuro"}>
                {dark?<Sun size={15}/>:<Moon size={15}/>}
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column"}}>
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
            :<>
              {!bannerDismissed&&<ReminderBanner
                creditCards={creditCards}
                cardReminders={cardReminders}
                th={th}
                onDismiss={()=>setBannerDismissed(true)}
                onGoTo={card=>{setActive(card);setCardMode("credit");setBannerDismissed(true);}}
              />}
              <DashView
                cards={cards}
                setCards={{credit:setCreditCards,debit:setDebitCards}}
                transactions={txs}
                activeCard={active}
                setActiveCard={setActive}
                cardMode={cardMode}
                setCardMode={setCardMode}
                th={th}
                onAddTx={addTx}
              />
            </>
          }
        </div>

        {/* ── BOTTOM NAV ── */}
        <div style={{background:th.navBg,borderTop:`1px solid ${th.border}`,display:"flex",flexShrink:0}} className="safe-bottom">
          {NAV.map(({id,Icon,label})=>(
            <button key={id} onClick={()=>setView(id)} style={{
              flex:1,border:"none",background:"none",cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              padding:"10px 0 8px",
              color:view===id?"#7c6af7":th.textDim,
              transition:"color 0.15s",
            }}>
              <div style={{position:"relative"}}>
                <Icon size={22} strokeWidth={view===id?2.5:1.8}/>
                {view===id&&<div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:"#7c6af7"}}/>}
              </div>
              <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",fontWeight:view===id?700:400,letterSpacing:0.5}}>
                {label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
      <Toasts toasts={toasts}/>
    </>
  );
}
