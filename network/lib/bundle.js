"use strict";
// ─────────────────────────────────────────────────────────────
// NETWORK ACADEMY — Main Bundle
// ─────────────────────────────────────────────────────────────
const {useState,useEffect,useRef,useCallback,createContext,useContext}=React;

// ── Constants ────────────────────────────────────────────────
const PROG_KEY="na_progress",ROUTE_KEY="na_route",THEME_KEY="na_theme",LANG_KEY="na_lang";
const AI_KEYS_STORE="wa_ai_keys",AI_ACTIVE_STORE="wa_ai_active_id";

// ── AI helpers (shares keys with Windows Academy) ─────────────
function loadAiKeys(){try{const s=localStorage.getItem(AI_KEYS_STORE);if(s)return JSON.parse(s);}catch{}return[];}
function getActiveAiKey(){const k=loadAiKeys();if(!k.length)return null;const id=localStorage.getItem(AI_ACTIVE_STORE)||"";return k.find(x=>x.id===id)||k[0];}
async function callAI(prompt){
  const px=localStorage.getItem("wa_ai_proxy")||"";
  if(px){const r=await fetch(px,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider:"",prompt})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Proxy error");return d.text;}
  const a=getActiveAiKey();if(!a||!a.key)throw new Error("no_key");
  const {provider:pv,key}=a;
  if(pv==="groq"){const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"user",content:prompt}],max_tokens:900,temperature:0.3})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"Groq error");return d.choices[0].message.content;}
  if(pv==="openai"){const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}],max_tokens:900})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"OpenAI error");return d.choices[0].message.content;}
  if(pv==="anthropic"){const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:900,messages:[{role:"user",content:prompt}]})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"Anthropic error");return d.content[0].text;}
  if(pv==="gemini"){const r=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:900,temperature:0.3}})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"Gemini error");return d.candidates[0].content.parts[0].text;}
  throw new Error("no_key");
}

// ── Progress ─────────────────────────────────────────────────
function todayStr(){return new Date().toISOString().slice(0,10);}
function loadProgress(){try{const s=localStorage.getItem(PROG_KEY);if(s)return{...defaultProgress(),...JSON.parse(s)};}catch{}return defaultProgress();}
function defaultProgress(){return{xp:0,level:1,completedLessons:[],name:"Student",lastLogin:null,streak:0};}
function saveProgress(p){try{localStorage.setItem(PROG_KEY,JSON.stringify(p));}catch{}}
function xpToLevel(xp){return Math.max(1,Math.floor(xp/500)+1);}

// ── Language ─────────────────────────────────────────────────
const LangCtx=createContext("uz");
function useLang(){return useContext(LangCtx);}
function t(lang,uz,en){return lang==="en"?en:uz;}

// ── Icons (SVG paths) ─────────────────────────────────────────
const ICONS={
  shield:"M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3z",
  network:"M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
  lock:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  star:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  code:"M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  cpu:"M9 3H7c-2.2 0-4 1.8-4 4v2h2V7c0-1.1.9-2 2-2h2V3zm8 0h-2v2h2c1.1 0 2 .9 2 2v2h2V7c0-2.2-1.8-4-4-4zM3 15v2c0 2.2 1.8 4 4 4h2v-2H7c-1.1 0-2-.9-2-2v-2H3zm18 0v2c0 1.1-.9 2-2 2h-2v2h2c2.2 0 4-1.8 4-4v-2h-2zM7 7h10v10H7z",
  layers:"M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z",
  x:"M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 0 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z",
  send:"M2.01 21L23 12 2.01 3 2 10l15 2-15 2z",
  spark:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  key:"M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
  check:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
  arrow:"M8 5v14l11-7z",
  settings:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  database:"M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.5-6-2v-1.5c1.26.83 3.5 1.5 6 1.5s4.74-.67 6-1.5V17c0 .5-2.13 2-6 2z",
  wifi:"M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
};
function Icon({name,size=16,style={}}){const d=ICONS[name]||ICONS.star;return React.createElement("svg",{width:size,height:size,viewBox:"0 0 24 24",fill:"currentColor",style:{flexShrink:0,...style}},React.createElement("path",{d}));}

// ── Core UI components ─────────────────────────────────────────
function H2({num,children}){return React.createElement("h2",{style:{fontFamily:"var(--font-display)",fontSize:18,fontWeight:700,margin:"28px 0 10px",color:"var(--text-0)",display:"flex",alignItems:"center",gap:10}},num&&React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",fontWeight:900}},num),children);}
function P({children,style={}}){return React.createElement("p",{style:{fontSize:13.5,lineHeight:1.75,color:"var(--text-1)",margin:"0 0 14px",...style}},children);}
function Term({children}){return React.createElement("code",{style:{background:"rgba(0,212,255,0.1)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"1px 6px",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)"}},children);}
function Terminal({children}){return React.createElement("pre",{style:{background:"rgba(0,0,0,0.5)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",fontFamily:"var(--font-mono)",fontSize:12,color:"#7effb2",overflowX:"auto",margin:"12px 0",lineHeight:1.65}},children);}
function InfoBox({children,color="var(--accent)"}){return React.createElement("div",{style:{background:`${color}0d`,border:`1px solid ${color}33`,borderRadius:12,padding:"12px 16px",margin:"12px 0",fontSize:12.5,color:"var(--text-1)",lineHeight:1.7}},children);}

// ── Lessons data ──────────────────────────────────────────────
const LESSONS={
  1:{num:"L01",sec:1,uz:"OSI Modeli",en:"OSI Model",sub:"7 ta qatlam va ularning vazifalari"},
  2:{num:"L02",sec:1,uz:"TCP/IP Protokol",en:"TCP/IP Protocol",sub:"Internet protokol to'plami"},
  3:{num:"L03",sec:1,uz:"IP Manzillash",en:"IP Addressing",sub:"IPv4, IPv6, CIDR, subnetting"},
  4:{num:"L04",sec:1,uz:"DNS",en:"DNS",sub:"Domen nomlari tizimi qanday ishlaydi"},
  5:{num:"L05",sec:1,uz:"HTTP/HTTPS",en:"HTTP/HTTPS",sub:"Veb protokollari va TLS asoslari"},
  6:{num:"L06",sec:1,uz:"ARP",en:"ARP",sub:"Manzil aniqlash protokoli"},
  7:{num:"L07",sec:1,uz:"DHCP",en:"DHCP",sub:"Dinamik xost konfiguratsiyasi"},
  8:{num:"L08",sec:1,uz:"Routing",en:"Routing",sub:"Paketlarni yo'naltirish asoslari"},
  9:{num:"L09",sec:1,uz:"Switching va VLAN",en:"Switching & VLAN",sub:"Kommutatsiya va virtual tarmoqlar"},
  10:{num:"L10",sec:1,uz:"NAT/PAT",en:"NAT/PAT",sub:"Tarmoq manzillarini tarjima qilish"},
  11:{num:"L11",sec:1,uz:"Tarmoq topologiyalari",en:"Network Topologies",sub:"Bus, Star, Ring, Mesh, Hybrid"},
  12:{num:"L12",sec:1,uz:"Simsiz tarmoqlar",en:"Wireless Networks",sub:"WiFi standartlari, WPA2, WPA3"},
  13:{num:"L13",sec:2,uz:"Firewall",en:"Firewall",sub:"Tarmoq xavfsizlik devori turlari"},
  14:{num:"L14",sec:2,uz:"VPN",en:"VPN",sub:"Virtual xususiy tarmoq protokollari"},
  15:{num:"L15",sec:2,uz:"SSL/TLS",en:"SSL/TLS",sub:"Xavfsiz ulanish protokoli"},
  16:{num:"L16",sec:2,uz:"IDS/IPS",en:"IDS/IPS",sub:"Bosqinlarni aniqlash va oldini olish"},
  17:{num:"L17",sec:2,uz:"DMZ",en:"DMZ",sub:"Demilitarizatsiya zonasi arxitekturasi"},
  18:{num:"L18",sec:2,uz:"802.1X",en:"802.1X NAC",sub:"Tarmoqqa kirish nazorati"},
  19:{num:"L19",sec:2,uz:"Packet Filtering",en:"Packet Filtering",sub:"Paket filtrlash qoidalari"},
  20:{num:"L20",sec:2,uz:"Proxy Serverlar",en:"Proxy Servers",sub:"Forward, reverse, transparent proxy"},
  21:{num:"L21",sec:2,uz:"Zero Trust",en:"Zero Trust Network",sub:"Ishonchsiz tarmoq arxitekturasi"},
  22:{num:"L22",sec:3,uz:"Port Scanning",en:"Port Scanning",sub:"Nmap bilan portlarni skanerlash"},
  23:{num:"L23",sec:3,uz:"Network Enumeration",en:"Network Enumeration",sub:"Tarmoq elementlarini aniqlash"},
  24:{num:"L24",sec:3,uz:"ARP Spoofing",en:"ARP Spoofing",sub:"ARP zaharlash hujumi va himoya"},
  25:{num:"L25",sec:3,uz:"MITM hujumi",en:"MITM Attacks",sub:"O'rtadagi odam hujumlari"},
  26:{num:"L26",sec:3,uz:"DNS Spoofing",en:"DNS Spoofing",sub:"DNS zaharlash hujumi"},
  27:{num:"L27",sec:3,uz:"DoS/DDoS",en:"DoS/DDoS",sub:"Xizmatni rad etish hujumlari"},
  28:{num:"L28",sec:3,uz:"Wireshark",en:"Wireshark",sub:"Tarmoq trafigini tahlil qilish"},
  29:{num:"L29",sec:3,uz:"Wireless Attacks",en:"Wireless Attacks",sub:"WiFi hujumlari va himoya usullari"},
  30:{num:"L30",sec:3,uz:"Network Forensics",en:"Network Forensics",sub:"Tarmoq sud-tibbiyoti tahlili"},
};

const SECTIONS={
  1:{num:"01",uz:"Tarmoq Asoslari",en:"Network Fundamentals",color:"var(--c-system)",icon:"network",count:12,
     descUz:"OSI modeli, TCP/IP, IP manzillash, DNS, HTTP va tarmoqning asosiy protokollarini chuqur o'rganing.",
     descEn:"Master OSI model, TCP/IP, IP addressing, DNS, HTTP and core network protocols."},
  2:{num:"02",uz:"Tarmoq Xavfsizligi",en:"Network Security",color:"var(--c-auth)",icon:"shield",count:9,
     descUz:"Firewall, VPN, SSL/TLS, IDS/IPS va tarmoq xavfsizligini ta'minlash usullarini o'rganing.",
     descEn:"Learn Firewall, VPN, SSL/TLS, IDS/IPS and methods to secure your network."},
  3:{num:"03",uz:"Tarmoq Hujumlari",en:"Network Attacks",color:"var(--c-attack)",icon:"cpu",count:9,
     descUz:"Nmap, ARP spoofing, MITM, DDoS va boshqa tarmoq hujumlarini va ulardan himoyalanishni o'rganing.",
     descEn:"Learn Nmap, ARP spoofing, MITM, DDoS and other network attacks with defense techniques."},
};

// ── Lesson content: L01 OSI Model ────────────────────────────
function Quiz({q,opts,correct,exp}){
  const lang=useLang();
  const [sel,setSel]=useState(null);
  const tx=x=>x==null?"":typeof x==="string"?x:t(lang,x.uz,x.en);
  return React.createElement("div",{style:{margin:"18px 0",padding:"16px 18px",background:"var(--surface)",border:"1px solid var(--accent-border)",borderRadius:14}},
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:12}},
      React.createElement(Icon,{name:"spark",size:14,style:{color:"var(--accent)"}}),
      React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--accent)",fontWeight:700,letterSpacing:1}},t(lang,"BILIMNI TEKSHIRING","QUICK QUIZ"))
    ),
    React.createElement("div",{style:{fontSize:13.5,fontWeight:600,color:"var(--text-0)",marginBottom:12,lineHeight:1.6}},tx(q)),
    opts.map((o,i)=>{
      const chosen=sel===i,isCorrect=i===correct;
      const bg=sel==null?"var(--bg-2)":isCorrect?"rgba(0,255,136,0.12)":chosen?"rgba(255,58,94,0.12)":"var(--bg-2)";
      const bd=sel==null?"var(--border)":isCorrect?"#00ff88":chosen?"var(--c-attack)":"var(--border)";
      return React.createElement("button",{key:i,onClick:()=>sel==null&&setSel(i),disabled:sel!=null,
        style:{display:"flex",alignItems:"center",gap:10,width:"100%",boxSizing:"border-box",textAlign:"left",marginBottom:7,padding:"10px 12px",borderRadius:9,cursor:sel==null?"pointer":"default",appearance:"none",border:`1.5px solid ${bd}`,background:bg,color:"var(--text-0)",fontSize:12.5}},
        React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-3)",fontWeight:700}},String.fromCharCode(65+i)),
        React.createElement("span",{style:{flex:1}},tx(o)),
        sel!=null&&isCorrect&&React.createElement(Icon,{name:"check",size:14,style:{color:"#00ff88"}}),
        sel!=null&&chosen&&!isCorrect&&React.createElement(Icon,{name:"x",size:14,style:{color:"var(--c-attack)"}})
      );
    }),
    sel!=null&&React.createElement("div",{style:{marginTop:10,padding:"10px 12px",borderRadius:9,background:sel===correct?"rgba(0,255,136,0.08)":"rgba(255,58,94,0.08)",border:`1px solid ${sel===correct?"rgba(0,255,136,0.3)":"rgba(255,58,94,0.3)"}`,fontSize:12,color:"var(--text-1)",lineHeight:1.6}},
      React.createElement("strong",{style:{color:sel===correct?"#00ff88":"var(--c-attack)"}},sel===correct?t(lang,"To'g'ri! ","Correct! "):t(lang,"Noto'g'ri. ","Incorrect. ")),
      tx(exp))
  );
}

// ── Animated-diagram engine (shared) ──────────────────────────
function NetAnimStyle(){
  return React.createElement("style",null,
`@keyframes na-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes na-glow{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
@keyframes na-flow{0%{left:1%;opacity:0}12%{opacity:1}88%{opacity:1}100%{left:95%;opacity:0}}
@keyframes na-dash{to{stroke-dashoffset:-18}}
@keyframes na-blink{0%,100%{opacity:1}50%{opacity:.3}}
.na-rise{animation:na-rise .5s cubic-bezier(.2,.8,.2,1) both}
.na-card{transition:transform .2s ease,border-color .2s ease}
.na-card:hover{transform:translateY(-3px)}
.na-step{transition:all .4s ease;opacity:.4}
.na-step.lit{opacity:1}
.na-dot{width:8px;height:8px;border-radius:50%;animation:na-glow 1s infinite}
.na-wire{position:relative;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);border-radius:2px}
.na-pkt{position:absolute;top:50%;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%);animation:na-flow 2.4s linear infinite}
@media (prefers-reduced-motion:reduce){.na-rise,.na-pkt,.na-dot,.na-card{animation:none!important}.na-pkt{left:47%}}`);
}

// color-coded vertical layer stack (generalized OSI visual)
function LayerStack({layers}){
  const lang=useLang();
  return React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8,margin:"6px 0 4px"}},
    layers.map((l,i)=>React.createElement("div",{key:l.n,className:"na-rise na-card",
      style:{display:"flex",gap:12,alignItems:"flex-start",padding:"11px 14px",background:"var(--surface)",border:`1px solid ${l.color}44`,borderLeft:`3px solid ${l.color}`,borderRadius:11,animationDelay:(i*0.06)+"s"}},
      React.createElement("div",{style:{flexShrink:0,width:30,height:30,borderRadius:8,display:"grid",placeItems:"center",fontFamily:"var(--font-mono)",fontWeight:900,fontSize:13,color:l.color,background:l.color+"22",border:`1.5px solid ${l.color}`}},l.n),
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontWeight:700,fontSize:13.5,color:"var(--text-0)"}},l.name,l.uz&&React.createElement("span",{style:{fontWeight:400,fontSize:11.5,color:"var(--text-2)",marginLeft:8}},l.uz)),
        l.desc&&React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",margin:"3px 0 4px",lineHeight:1.5}},t(lang,l.desc.uz,l.desc.en)),
        l.proto&&React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10.5,color:l.color,opacity:.9}},l.proto)))));
}

// interactive step-through flow (Play / Reset)
function FlowSteps({title,steps,color}){
  const lang=useLang();
  const c=color||"var(--accent)";
  const [step,setStep]=useState(-1);
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    if(!playing)return;
    if(step>=steps.length-1){setPlaying(false);return;}
    const id=setTimeout(()=>setStep(s=>s+1),1050);
    return()=>clearTimeout(id);
  },[playing,step,steps.length]);
  const tx=x=>x==null?"":typeof x==="string"?x:t(lang,x.uz,x.en);
  const showAll=step<0;
  return React.createElement("div",{style:{background:"var(--bg-1)",border:"1px solid var(--border)",borderRadius:14,padding:16,margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:8,flexWrap:"wrap"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--text-0)"}},tx(title)),
      React.createElement("div",{style:{display:"flex",gap:6}},
        React.createElement("button",{onClick:()=>{setStep(0);setPlaying(true);},style:{padding:"5px 13px",background:c,color:"#04060d",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}},t(lang,"▶ Ishga tushir","▶ Play")),
        React.createElement("button",{onClick:()=>{setStep(-1);setPlaying(false);},style:{padding:"5px 12px",background:"var(--bg-2)",color:"var(--text-1)",border:"1px solid var(--border)",borderRadius:8,fontSize:12,cursor:"pointer"}},"↺"))),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:7}},
      steps.map((s,i)=>{
        const lit=showAll||i<=step, cur=i===step;
        return React.createElement("div",{key:i,className:"na-step"+(lit?" lit":""),
          style:{display:"flex",alignItems:"center",gap:11,padding:"9px 13px",borderRadius:10,
            background:lit?(cur?c+"14":"rgba(255,255,255,.02)"):"transparent",
            border:`1px solid ${lit?(cur?c+"66":"var(--border)"):"rgba(255,255,255,.05)"}`}},
          React.createElement("div",{style:{flexShrink:0,width:30,height:30,borderRadius:"50%",display:"grid",placeItems:"center",fontSize:15,color:lit?c:"var(--text-2)",background:lit?c+"18":"rgba(255,255,255,.03)",border:`1px solid ${lit?c+"55":"var(--border)"}`}},s.icon||(i+1)),
          React.createElement("div",{style:{flex:1}},
            React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:9.5,letterSpacing:".08em",color:lit?c:"var(--text-2)",marginBottom:1}},"STEP "+(i+1)),
            React.createElement("div",{style:{fontSize:12.5,color:lit?"var(--text-0)":"var(--text-2)",lineHeight:1.45}},tx(s.text))),
          cur&&React.createElement("div",{className:"na-dot",style:{background:c}}));
      })));
}

// animated packet gliding along a wire between two nodes
function PacketFlow({from,to,label,color}){
  const lang=useLang();const c=color||"var(--accent)";
  const tx=x=>typeof x==="string"?x:t(lang,x.uz,x.en);
  return React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,margin:"12px 0",padding:"14px 12px",background:"var(--bg-1)",border:"1px solid var(--border)",borderRadius:12}},
    React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"var(--text-0)",textAlign:"center",minWidth:60}},tx(from)),
    React.createElement("div",{style:{flex:1,position:"relative"}},
      label&&React.createElement("div",{style:{textAlign:"center",fontFamily:"var(--font-mono)",fontSize:10,color:c,marginBottom:6}},tx(label)),
      React.createElement("div",{className:"na-wire"},React.createElement("div",{className:"na-pkt",style:{background:c,boxShadow:`0 0 8px ${c}`}}))),
    React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"var(--text-0)",textAlign:"center",minWidth:60}},tx(to)));
}

// animated two-column comparison
function CompareCols({left,right}){
  const lang=useLang();
  const tx=x=>typeof x==="string"?x:t(lang,x.uz,x.en);
  const col=d=>React.createElement("div",{className:"na-rise",style:{padding:14,borderRadius:12,background:d.color+"0d",border:`1px solid ${d.color}33`}},
    React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700,color:d.color,marginBottom:9}},tx(d.title)),
    d.rows.map((r,i)=>React.createElement("div",{key:i,style:{fontSize:12,color:"var(--text-1)",padding:"5px 0",borderBottom:i<d.rows.length-1?"1px solid var(--border)":"none",lineHeight:1.5}},tx(r))));
  return React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"12px 0"}},col(left),col(right));
}

// topology diagram — nodes + animated dashed links (SVG)
function NodeMap({nodes,links,color,label}){
  const lang=useLang();const c=color||"var(--accent)";
  return React.createElement("div",{style:{margin:"12px 0",padding:"14px",background:"var(--bg-1)",border:"1px solid var(--border)",borderRadius:12}},
    label&&React.createElement("div",{style:{textAlign:"center",fontFamily:"var(--font-mono)",fontSize:11,color:c,marginBottom:8,fontWeight:700}},typeof label==="string"?label:t(lang,label.uz,label.en)),
    React.createElement("svg",{viewBox:"0 0 280 160",style:{width:"100%",maxWidth:300,display:"block",margin:"0 auto"}},
      links.map((lk,i)=>React.createElement("line",{key:"l"+i,x1:nodes[lk[0]][0],y1:nodes[lk[0]][1],x2:nodes[lk[1]][0],y2:nodes[lk[1]][1],stroke:c,strokeWidth:1.7,strokeDasharray:"5 4",style:{animation:"na-dash 1s linear infinite",opacity:.75}})),
      nodes.map((n,i)=>React.createElement("g",{key:"n"+i},
        React.createElement("circle",{cx:n[0],cy:n[1],r:10,fill:c+"22",stroke:c,strokeWidth:1.9}),
        n[2]&&React.createElement("text",{x:n[0],y:n[1]+22,fill:"var(--text-2)",fontSize:8,textAnchor:"middle",fontFamily:"var(--font-mono)"},n[2])))));
}

function DMZSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",O="#f97316",BL="#3b82f6",Y="#facc15",SL="#1e293b",SL2="#0f172a";
  const wrap=useRef(null);
  const rInt=useRef(null),rExt=useRef(null),rWeb=useRef(null),rIntf=useRef(null),rDb=useRef(null),rPc=useRef(null);
  const REF={internet:rInt,extfw:rExt,web:rWeb,intfw:rIntf,db:rDb,pc:rPc};
  const SC={
    s1:{start:"internet",col:BL,frames:[
      {to:"extfw",fw:{k:"ext",ok:true},log:{uz:"Tashqi Firewall: 80-portga (Veb) RUXSAT.",en:"Outer firewall: port 80 (web) ALLOWED."}},
      {to:"web",log:{uz:"Paket DMZ dagi Veb Serverga yetib bordi.",en:"The packet reached the DMZ web server."},end:"allow"}]},
    s2:{start:"internet",col:D,frames:[
      {to:"extfw",fw:{k:"ext",ok:false},log:{uz:"Tashqi Firewall: Internet→LAN to'g'ridan-to'g'ri QAT'IYAN MAN ETILGAN (DROP).",en:"Outer firewall: direct Internet→LAN is strictly DENIED (DROP)."},end:"deny"}]},
    s3:{start:"web",col:O,frames:[
      {to:"intfw",fw:{k:"int",ok:false},log:{uz:"Ichki Firewall: DMZ→LAN BLOKLANDI — DMZ ga hech qachon ishonilmaydi! (eng muhim qoida)",en:"Inner firewall: DMZ→LAN BLOCKED — the DMZ is never trusted! (the key rule)"},end:"deny"}]},
    s4:{start:"pc",col:A,frames:[
      {to:"intfw",fw:{k:"int",ok:true},log:{uz:"Ichki Firewall: ishonchli LAN dan RUXSAT berildi.",en:"Inner firewall: ALLOWED from the trusted LAN."}},
      {to:"web",log:{uz:"Xodim DMZ dagi Veb Serverni yangiladi.",en:"The staff member updated the DMZ web server."},end:"allow"}]},
    s5:{start:"pc",col:A,frames:[
      {to:"intfw",fw:{k:"int",ok:true},log:{uz:"Ichki Firewall: chiquvchi so'rovga RUXSAT (NAT).",en:"Inner firewall: outbound request ALLOWED (NAT)."}},
      {to:"extfw",fw:{k:"ext",ok:true},log:{uz:"Tashqi Firewall: chiquvchi so'rovga RUXSAT.",en:"Outer firewall: outbound request ALLOWED."}},
      {to:"internet",log:{uz:"Xodim internetga muvaffaqiyatli chiqdi.",en:"The staff member reached the internet."},end:"allow"}]}
  };
  const SCEN=[
    {k:"s1",c:BL,uz:"1. Foydalanuvchi → Veb Server",en:"1. User → Web Server",duz:"Internetdan so'rov DMZ veb-saytni ochadi. (Ruxsat)",den:"An internet request opens the DMZ website. (Allowed)"},
    {k:"s2",c:D,uz:"2. Xaker → Ichki Ma'lumotlar Bazasi",en:"2. Hacker → Internal Database",duz:"Internetdan to'g'ridan-to'g'ri LAN ichiga kirmoqchi. (Bloklanadi)",den:"Trying to enter the LAN directly from the internet. (Blocked)"},
    {k:"s3",c:O,uz:"3. Xaker (DMZ dan) → Ichki Tarmoqqa",en:"3. Hacker (from DMZ) → Internal Network",duz:"Veb-serverni buzdi, endi LAN ga o'tmoqchi. (Bloklanadi!)",den:"Broke the web server, now moving to the LAN. (Blocked!)"},
    {k:"s4",c:A,uz:"4. Xodim → Veb Serverni yangilash",en:"4. Staff → Update Web Server",duz:"Ichki xodim DMZ serverga ulanadi. (Ruxsat)",den:"An internal employee connects to the DMZ server. (Allowed)"},
    {k:"s5",c:A,uz:"5. Xodim → Internet",en:"5. Staff → Internet",duz:"Ichki xodim internetdan foydalanadi (NAT). (Ruxsat)",den:"An internal employee uses the internet (NAT). (Allowed)"}
  ];
  const [run,setRun]=useState(null);
  const [fi,setFi]=useState(-1);
  const [pkt,setPkt]=useState(null);
  const centerOf=(key)=>{const el=REF[key]&&REF[key].current,w=wrap.current;if(!el||!w)return null;const r=el.getBoundingClientRect(),wr=w.getBoundingClientRect();return{x:r.left-wr.left+r.width/2,y:r.top-wr.top+r.height/2};};
  useEffect(()=>{
    if(run==null){setPkt(null);return;}
    const fr=SC[run].frames;
    const node=fi<0?SC[run].start:fr[fi].to;
    const dead=fi>=0&&fr[fi].end==="deny";
    const c=centerOf(node); if(c)setPkt({x:c.x,y:c.y,dead:dead,col:SC[run].col});
    if(fi<0){const id=setTimeout(()=>setFi(0),160);return()=>clearTimeout(id);}
    if(fi>=fr.length-1||fr[fi].end) return;
    const id=setTimeout(()=>setFi(fi+1),1150);return()=>clearTimeout(id);
  },[run,fi]);
  const sc=run?SC[run]:null,frames=sc?sc.frames:[],cur=fi>=0&&fi<frames.length?frames[fi]:null;
  let fwExt=null,fwInt=null;
  for(let i=0;i<=fi&&i<frames.length;i++){const f=frames[i];if(f.fw){if(f.fw.k==="ext")fwExt=f.fw.ok?"ok":"block";else fwInt=f.fw.ok?"ok":"block";}}
  const verdict=cur&&cur.end?cur.end:null,dead=verdict==="deny";
  const logs=[];for(let i=0;i<=fi&&i<frames.length;i++)logs.push(frames[i].log);
  const start=(k)=>{setRun(k);setFi(-1);};
  const zone=(bg,br,children)=>React.createElement("div",{style:{background:bg,border:"1px solid "+br,borderRadius:14,padding:"12px 10px",display:"flex",flexDirection:"column",gap:8}},children);
  const nodeBox=(ref,ic,label,sub,subc)=>React.createElement("div",{ref:ref,style:{background:SL,border:"1px solid rgba(148,163,184,.25)",borderRadius:10,padding:"9px 6px",textAlign:"center"}},
    React.createElement("div",{style:{fontSize:20,lineHeight:1}},ic),
    React.createElement("div",{style:{fontSize:11,fontWeight:600,color:"#e2e8f0",marginTop:3}},label),
    sub&&React.createElement("div",{style:{fontSize:9,color:subc||"#94a3b8",marginTop:2,fontFamily:"var(--font-mono)"}},sub));
  const fwbox=(ref,label,state,idleCol,idleTxt)=>{const col=state==="ok"?A:state==="block"?D:idleCol;return React.createElement("div",{ref:ref,style:{background:col+"33",border:"2px solid "+col,borderRadius:10,padding:"7px 6px",textAlign:"center",transition:"all .3s"}},
    React.createElement("div",{style:{fontSize:12,fontWeight:800,color:col}},"🔥 "+label),
    React.createElement("div",{style:{fontSize:9.5,color:col,marginTop:2,fontFamily:"var(--font-mono)"}},state==="ok"?t(lang,"RUXSAT ✓","ALLOW ✓"):state==="block"?t(lang,"BLOKLANDI (DROP)","BLOCKED (DROP)"):idleTxt));};
  const abtn=(k,ic,label,bc)=>React.createElement("button",{onClick:()=>start(k),style:{flex:"1 1 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:SL,border:"1px solid "+bc+"55",borderRadius:8,padding:"7px 4px",cursor:"pointer",color:"#e2e8f0",fontSize:10}},
    React.createElement("span",{style:{fontSize:18}},ic),React.createElement("span",null,t(lang,label.uz,label.en)));
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{ref:wrap,style:{position:"relative"}},
      React.createElement("div",{style:{overflowX:"auto"}},
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1.05fr 1fr",gap:12,minWidth:620,alignItems:"stretch"}},
          zone(D+"14",D+"55",[
            React.createElement("div",{key:"t",style:{color:D,fontWeight:800,fontSize:13,textAlign:"center",marginBottom:2}},t(lang,"🌐 Internet (Xavfli)","🌐 Internet (Unsafe)")),
            React.createElement("div",{key:"n",ref:rInt,style:{background:SL,border:"1px solid "+D+"44",borderRadius:10,padding:"12px",textAlign:"center"}},React.createElement("div",{style:{fontSize:26}},"🌐"),React.createElement("div",{style:{fontSize:11,color:"#e2e8f0",marginTop:2}},"Internet")),
            React.createElement("div",{key:"b",style:{display:"flex",gap:6}},abtn("s2","🥷",{uz:"Xaker",en:"Hacker"},D),abtn("s1","👨‍💻",{uz:"Foydalanuvchi",en:"User"},A))]),
          React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:9,justifyContent:"center"}},
            fwbox(rExt,t(lang,"Tashqi Firewall","Outer Firewall"),fwExt,O,t(lang,"Qoidalar tekshiruvi","Rule check")),
            zone(BL+"14",BL+"55",[
              React.createElement("div",{key:"t",style:{color:BL,fontWeight:800,fontSize:13,textAlign:"center"}},t(lang,"🏢 DMZ (Oraliq)","🏢 DMZ (Buffer)")),
              React.createElement("div",{key:"s",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}},
                nodeBox(rWeb,"🌍",t(lang,"Veb Server","Web Server"),":80 ✓","#93c5fd"),
                nodeBox(null,"📧",t(lang,"Mail Server","Mail Server"),":25",null))]),
            fwbox(rIntf,t(lang,"Ichki Firewall","Inner Firewall"),fwInt,D,t(lang,"Qat'iy nazorat","Strict control"))),
          zone(A+"14",A+"55",[
            React.createElement("div",{key:"t",style:{color:A,fontWeight:800,fontSize:13,textAlign:"center",marginBottom:2}},t(lang,"🛡 LAN (Ichki Tarmoq)","🛡 LAN (Internal)")),
            nodeBox(rDb,"🗄",t(lang,"Ma'lumotlar Bazasi","Database"),t(lang,"Yopiq server","Closed server"),"#fca5a5"),
            React.createElement("div",{key:"pc",ref:rPc,style:{background:SL,border:"1px solid "+A+"44",borderRadius:10,padding:"9px 6px",textAlign:"center"}},
              React.createElement("div",{style:{fontSize:20}},"💻"),React.createElement("div",{style:{fontSize:11,color:"#e2e8f0",marginTop:2}},t(lang,"Xodim Kompyuteri","Staff PC")),
              React.createElement("div",{style:{display:"flex",gap:4,marginTop:6,justifyContent:"center"}},
                React.createElement("button",{onClick:()=>start("s5"),style:{fontSize:9,background:A+"33",border:"none",color:"#dcfce7",borderRadius:5,padding:"3px 7px",cursor:"pointer"}},t(lang,"Net-ga","To Net")),
                React.createElement("button",{onClick:()=>start("s4"),style:{fontSize:9,background:BL+"33",border:"none",color:"#dbeafe",borderRadius:5,padding:"3px 7px",cursor:"pointer"}},t(lang,"DMZ-ga","To DMZ"))))])
        )),
      pkt&&React.createElement("div",{style:{position:"absolute",left:pkt.x,top:pkt.y,width:16,height:16,borderRadius:"50%",background:pkt.dead?D:Y,border:"2px solid #fff",boxShadow:"0 0 14px "+(pkt.dead?D:Y),transform:"translate(-50%,-50%)",transition:"left .85s ease-in-out,top .85s ease-in-out,opacity .4s",opacity:pkt.dead?0.15:1,zIndex:30,pointerEvents:"none"}})),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}},
      React.createElement("div",{style:{background:SL,border:"1px solid rgba(148,163,184,.2)",borderRadius:12,padding:14}},
        React.createElement("div",{style:{fontSize:13,fontWeight:700,color:"#93c5fd",marginBottom:10}},t(lang,"Ssenariylarni tanlang","Choose a scenario")),
        SCEN.map(s=>React.createElement("button",{key:s.k,onClick:()=>start(s.k),style:{width:"100%",textAlign:"left",padding:"9px 11px",marginBottom:7,background:run===s.k?s.c+"22":SL2,border:"1px solid "+(run===s.k?s.c:"rgba(148,163,184,.15)"),borderLeft:"4px solid "+s.c,borderRadius:8,cursor:"pointer"}},
          React.createElement("div",{style:{fontWeight:600,fontSize:12,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:2}},t(lang,s.duz,s.den))))),
      React.createElement("div",{style:{background:SL,border:"1px solid rgba(148,163,184,.2)",borderRadius:12,padding:14,display:"flex",flexDirection:"column"}},
        React.createElement("div",{style:{fontSize:13,fontWeight:700,color:"#93c5fd",marginBottom:10}},t(lang,"Jarayon tahlili","Process analysis")),
        React.createElement("div",{style:{flex:1,background:SL2,borderRadius:8,padding:"11px 12px",fontFamily:"var(--font-mono)",fontSize:11.5,lineHeight:1.6,minHeight:120,border:"1px solid rgba(148,163,184,.15)"}},
          run==null?React.createElement("div",{style:{color:"#64748b",textAlign:"center",paddingTop:24}},t(lang,"Simulyatsiyani boshlash uchun ssenariy yoki diagrammadagi tugmani bosing.","Pick a scenario or a diagram button to start the simulation.")):
          React.createElement("div",null,
            logs.map((l,i)=>React.createElement("div",{key:i,className:"na-rise",style:{color:"#cbd5e1",marginBottom:5}},(i+1)+". "+t(lang,l.uz,l.en))),
            verdict&&React.createElement("div",{style:{marginTop:8,fontWeight:800,color:verdict==="allow"?A:D}},verdict==="allow"?t(lang,"✓ Natija: Muvaffaqiyatli — LAN xavfsiz qoldi.","✓ Result: Success — the LAN stayed safe."):t(lang,"✗ Natija: Bloklandi — hujum to'xtatildi.","✗ Result: Blocked — the attack was stopped.")))),
        React.createElement("div",{style:{marginTop:12,paddingTop:10,borderTop:"1px solid rgba(148,163,184,.15)"}},
          React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#cbd5e1",marginBottom:6}},t(lang,"Asosiy qoidalar (Firewall Rules):","Key rules (Firewall Rules):")),
          React.createElement("div",{style:{fontSize:10.5,fontFamily:"var(--font-mono)",lineHeight:1.8}},
            React.createElement("div",null,React.createElement("span",{style:{color:A,fontWeight:700}},"ALLOW: "),t(lang,"Internet → DMZ (faqat HTTP/SMTP)","Internet → DMZ (HTTP/SMTP only)")),
            React.createElement("div",null,React.createElement("span",{style:{color:D,fontWeight:700}},"DENY: "),t(lang,"Internet → LAN (barchasi yopiq)","Internet → LAN (all blocked)")),
            React.createElement("div",null,React.createElement("span",{style:{color:D,fontWeight:700}},"DENY: "),t(lang,"DMZ → LAN (eng muhim qoida!)","DMZ → LAN (the key rule!)")),
            React.createElement("div",null,React.createElement("span",{style:{color:A,fontWeight:700}},"ALLOW: "),t(lang,"LAN → Internet / DMZ","LAN → Internet / DMZ"))))))
  );
}
function FirewallSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",SL="#1e293b",SL2="#0f172a",AM="#f59e0b";
  const RULES=[
    {act:"ALLOW",proto:"TCP",port:80,src:"any",uz:"Veb (HTTP)",en:"Web (HTTP)"},
    {act:"ALLOW",proto:"TCP",port:443,src:"any",uz:"Veb (HTTPS)",en:"Web (HTTPS)"},
    {act:"DENY",proto:"TCP",port:22,src:"internet",uz:"SSH — tashqaridan taqiq",en:"SSH — deny from outside"},
    {act:"ALLOW",proto:"ANY",port:"any",src:"LAN",uz:"Chiquvchi (ichkaridan)",en:"Outbound (from inside)"},
    {act:"DENY",proto:"ANY",port:"any",src:"any",uz:"STANDART: qolgan hammasi",en:"DEFAULT: everything else"}
  ];
  const PKT={
    p1:{src:"internet",port:80,proto:"TCP",ic:"🌍",uz:"HTTP so'rovi",en:"HTTP request"},
    p2:{src:"internet",port:22,proto:"TCP",ic:"🔑",uz:"SSH urinishi",en:"SSH attempt"},
    p3:{src:"internet",port:443,proto:"TCP",ic:"🔒",uz:"HTTPS so'rovi",en:"HTTPS request"},
    p4:{src:"internet",port:23,proto:"TCP",ic:"📟",uz:"Telnet urinishi",en:"Telnet attempt"},
    p5:{src:"LAN",port:3306,proto:"TCP",ic:"💻",uz:"LAN → DB (chiquvchi)",en:"LAN → DB (outbound)"}
  };
  const BTN=[["p1","🌍",{uz:"HTTP :80",en:"HTTP :80"}],["p2","🔑",{uz:"SSH :22",en:"SSH :22"}],["p3","🔒",{uz:"HTTPS :443",en:"HTTPS :443"}],["p4","📟",{uz:"Telnet :23",en:"Telnet :23"}],["p5","💻",{uz:"LAN→DB",en:"LAN→DB"}]];
  const match=(r,p)=>(r.src==="any"||r.src===p.src)&&(r.port==="any"||r.port===p.port)&&(r.proto==="ANY"||r.proto===p.proto);
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const p=PKT[run];
    if(step<0){const id=setTimeout(()=>setStep(0),160);return()=>clearTimeout(id);}
    if(step>=RULES.length) return;
    if(match(RULES[step],p)) return;
    if(step>=RULES.length-1) return;
    const id=setTimeout(()=>setStep(step+1),800);return()=>clearTimeout(id);
  },[run,step]);
  const p=run?PKT[run]:null;
  let matched=-1;
  if(p&&step>=0){for(let i=0;i<=step&&i<RULES.length;i++){if(match(RULES[i],p)){matched=i;break;}}}
  const outcome=matched>=0?RULES[matched].act:null;
  const logs=[];
  if(p&&step>=0){const upto=matched>=0?matched:step;for(let i=0;i<=upto;i++){
    if(matched>=0&&i===matched)logs.push({t:t(lang,"Qoida "+(i+1)+" MOS KELDI → "+RULES[i].act,"Rule "+(i+1)+" MATCHED → "+RULES[i].act),c:RULES[i].act==="ALLOW"?A:D});
    else logs.push({t:t(lang,"Qoida "+(i+1)+": mos emas → keyingisiga o'tildi","Rule "+(i+1)+": no match → moved on"),c:"#94a3b8"});}}
  const start=(k)=>{setRun(k);setStep(-1);};
  const fld=(l,v)=>React.createElement("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderBottom:"1px solid rgba(148,163,184,.12)"}},
    React.createElement("span",{style:{color:"#94a3b8"}},l),React.createElement("span",{style:{color:"#e2e8f0",fontFamily:"var(--font-mono)",fontWeight:600}},v));
  const ruleRow=(r,i)=>{
    let st="idle";
    if(matched>=0){st=i===matched?"hit":(i<matched?"skip":"idle");}
    else if(run){st=i<step?"skip":(i===step?"check":"idle");}
    const hitCol=r.act==="ALLOW"?A:D;
    const bg=st==="hit"?hitCol+"26":st==="check"?BL+"1f":st==="skip"?"rgba(148,163,184,.05)":SL2;
    const bd=st==="hit"?hitCol:st==="check"?BL:"rgba(148,163,184,.18)";
    const dim=st==="skip"?.45:1;
    return React.createElement("div",{key:i,style:{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",marginBottom:5,background:bg,border:"1px solid "+bd,borderLeft:"4px solid "+(r.act==="ALLOW"?A:D),borderRadius:8,opacity:dim,transition:"all .25s",fontFamily:"var(--font-mono)"}},
      React.createElement("span",{style:{fontSize:10,color:"#64748b",minWidth:14}},i+1),
      React.createElement("span",{style:{fontSize:9.5,fontWeight:800,color:r.act==="ALLOW"?A:D,background:(r.act==="ALLOW"?A:D)+"22",borderRadius:4,padding:"2px 6px",minWidth:52,textAlign:"center"}},r.act),
      React.createElement("span",{style:{fontSize:10.5,color:"#cbd5e1",minWidth:118}},r.proto+" "+(r.port==="any"?"*":":"+r.port)+" ← "+r.src),
      React.createElement("span",{style:{fontSize:10.5,color:"#94a3b8",flex:1}},t(lang,r.uz,r.en)),
      st==="check"&&React.createElement("span",{style:{fontSize:12,color:BL}},"🔎"),
      st==="hit"&&React.createElement("span",{style:{fontSize:12,color:hitCol,fontWeight:900}},r.act==="ALLOW"?"✓":"✗"));};
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{overflowX:"auto"}},
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"0.85fr 1.5fr",gap:12,minWidth:560,alignItems:"start"}},
        React.createElement("div",{style:{background:SL,border:"1px solid "+(p?(outcome==="ALLOW"?A:outcome==="DENY"?D:BL):"rgba(148,163,184,.25)")+"66",borderRadius:12,padding:14}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#93c5fd",marginBottom:8}},t(lang,"📦 Kiruvchi paket","📦 Incoming packet")),
          p?React.createElement("div",null,
            React.createElement("div",{style:{fontSize:34,textAlign:"center",marginBottom:6}},p.ic),
            React.createElement("div",{style:{fontSize:11.5,fontWeight:600,color:"#e2e8f0",textAlign:"center",marginBottom:10}},t(lang,p.uz,p.en)),
            fld(t(lang,"Manba","Source"),p.src),fld(t(lang,"Port","Port"),":"+p.port),fld(t(lang,"Protokol","Protocol"),p.proto)):
          React.createElement("div",{style:{fontSize:11,color:"#64748b",textAlign:"center",padding:"24px 4px"}},t(lang,"Pastdan paket tanlang","Choose a packet below"))),
        React.createElement("div",{style:{background:SL,border:"1px solid rgba(148,163,184,.2)",borderRadius:12,padding:"12px 12px 8px"}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#93c5fd",marginBottom:8}},t(lang,"🧱 Firewall qoidalari (yuqoridan pastga)","🧱 Firewall rules (top to bottom)")),
          RULES.map(function(r,i){return ruleRow(r,i);})))),
    outcome&&React.createElement("div",{style:{marginTop:12,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:13,background:(outcome==="ALLOW"?A:D)+"1f",border:"1px solid "+(outcome==="ALLOW"?A:D),color:outcome==="ALLOW"?A:D}},
      outcome==="ALLOW"?t(lang,"✓ RUXSAT — paket ichki tarmoqqa o'tkazildi","✓ ALLOW — the packet was forwarded to the network"):t(lang,"✗ DROP — paket bloklandi va yo'q qilindi","✗ DROP — the packet was blocked and discarded")),
    React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}},
      BTN.map(function(b){return React.createElement("button",{key:b[0],onClick:()=>start(b[0]),style:{flex:"1 1 auto",padding:"8px 10px",background:run===b[0]?BL+"22":SL,color:run===b[0]?"#93c5fd":"#cbd5e1",border:"1px solid "+(run===b[0]?BL:"rgba(148,163,184,.3)"),borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer"}},b[1]+" "+t(lang,b[2].uz,b[2].en));})),
    React.createElement("div",{style:{marginTop:10,background:SL2,border:"1px solid rgba(148,163,184,.15)",borderRadius:10,padding:"11px 13px",minHeight:60,fontFamily:"var(--font-mono)",fontSize:11.5,lineHeight:1.65}},
      run==null?React.createElement("div",{style:{color:"#64748b",textAlign:"center"}},t(lang,"⬆ Paket tanlang — firewall qoidalarni yuqoridan pastga qanday tekshirishini ko'ring.","⬆ Pick a packet — watch the firewall check the rules top to bottom.")):
      logs.map(function(l,i){return React.createElement("div",{key:i,className:"na-rise",style:{color:l.c,marginBottom:3,fontWeight:l.c==="#94a3b8"?400:700}},(i+1)+". "+l.t);})));
}

function TLSSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",PU="#a855f7",AM="#f59e0b",SL="#1e293b",SL2="#0f172a";
  const STEPS=[
    {dir:"c2s",ic:"👋",col:BL,uz:"Client Hello",en:"Client Hello",duz:"Brauzer qo'llab-quvvatlanadigan shifrlar ro'yxati va tasodifiy sonni yuboradi.",den:"The browser sends its supported ciphers and a random number."},
    {dir:"s2c",ic:"📜",col:PU,uz:"Server Hello + Sertifikat",en:"Server Hello + Certificate",duz:"Server shifrni tanlaydi va o'z sertifikatini (ochiq kalit) yuboradi.",den:"The server picks a cipher and sends its certificate (public key)."},
    {dir:"chk",ic:"🔎",col:AM,uz:"Sertifikatni tekshirish",en:"Verify certificate",duz:"Brauzer sertifikat ishonchli CA tomonidan imzolanganini tekshiradi.",den:"The browser checks the certificate is signed by a trusted CA."},
    {dir:"c2s",ic:"🔑",col:A,uz:"Kalit almashinuvi (ECDHE)",en:"Key exchange (ECDHE)",duz:"Ikkala tomon umumiy maxfiy sessiya kalitini kelishadi.",den:"Both sides agree on a shared secret session key."},
    {dir:"done",ic:"🔒",col:A,uz:"Shifrlangan ulanish",en:"Encrypted connection",duz:"Simmetrik shifrlash boshlanadi — barcha ma'lumot xavfsiz.",den:"Symmetric encryption begins — all data is secure."}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  const certOk=run==="safe";
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    if(step<0){const id=setTimeout(()=>setStep(0),160);return()=>clearTimeout(id);}
    if(step===2&&!certOk) return;
    if(step>=STEPS.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1050);return()=>clearTimeout(id);
  },[run,step]);
  const failed=run==="fake"&&step>=2;
  const secure=run==="safe"&&step>=STEPS.length-1;
  const dirBadge=(s)=>{
    if(s.dir==="chk"||s.dir==="done") return null;
    const rev=s.dir==="s2c";
    return React.createElement("div",{style:{width:100,flexShrink:0}},
      React.createElement("div",{style:{fontSize:8.5,color:"#64748b",textAlign:"center",fontFamily:"var(--font-mono)",marginBottom:4}},rev?"Server → Client":"Client → Server"),
      React.createElement("div",{className:"na-wire",style:{transform:rev?"scaleX(-1)":"none"}},
        React.createElement("div",{className:"na-pkt",style:{background:s.col,boxShadow:"0 0 8px "+s.col}})));
  };
  const card=(s,i)=>{
    const isChk=s.dir==="chk";const chkFail=isChk&&run==="fake";const col=chkFail?D:s.col;
    return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",marginBottom:7,background:step===i?col+"1f":SL2,border:"1px solid "+col+(step===i?"":"44"),borderLeft:"4px solid "+col,borderRadius:10,transition:"all .25s"}},
      React.createElement("div",{style:{fontSize:22,lineHeight:1}},chkFail?"⚠":s.ic),
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontSize:12.5,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
        React.createElement("div",{style:{fontSize:11,color:"#94a3b8",marginTop:2,lineHeight:1.5}},t(lang,s.duz,s.den)),
        isChk&&React.createElement("div",{style:{fontSize:10.5,fontWeight:700,marginTop:4,color:chkFail?D:A,fontFamily:"var(--font-mono)"}},chkFail?t(lang,"✗ Sertifikat ISHONCHSIZ — soxta! CA imzosi mos emas.","✗ Certificate UNTRUSTED — fake! CA signature invalid."):t(lang,"✓ Sertifikat ishonchli — CA imzosi to'g'ri.","✓ Certificate trusted — CA signature valid."))),
      dirBadge(s));
  };
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:10,gap:8,alignItems:"center"}},
      React.createElement("div",{style:{flex:1,textAlign:"center",padding:"8px",background:SL,border:"1px solid "+BL+"55",borderRadius:10,fontSize:12,fontWeight:700,color:"#93c5fd"}},t(lang,"🌐 Client (Brauzer)","🌐 Client (Browser)")),
      React.createElement("div",{style:{color:"#64748b",fontSize:18,padding:"0 4px"}},"⇄"),
      React.createElement("div",{style:{flex:1,textAlign:"center",padding:"8px",background:SL,border:"1px solid "+A+"55",borderRadius:10,fontSize:12,fontWeight:700,color:"#86efac"}},t(lang,"🖥 Server","🖥 Server"))),
    React.createElement("div",{style:{minHeight:60}},
      run==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"16px"}},t(lang,"⬇ Ssenariy tanlang — TLS qo'l berishi (handshake) bosqichma-bosqich qanday kechishini ko'ring.","⬇ Pick a scenario — watch the TLS handshake unfold step by step.")):
      STEPS.map(function(s,i){return step>=i?card(s,i):null;})),
    (secure||failed)&&React.createElement("div",{style:{marginTop:6,padding:"11px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:13,background:(secure?A:D)+"1f",border:"1px solid "+(secure?A:D),color:secure?A:D}},
      secure?t(lang,"🔒 Xavfsiz ulanish o'rnatildi — ma'lumot to'liq shifrlangan.","🔒 Secure connection established — data is fully encrypted."):t(lang,"⚠ Sertifikat ishonchsiz — brauzer ulanishni RAD ETDI (MITM hujumi oldini olindi).","⚠ Untrusted certificate — the browser REFUSED the connection (MITM prevented).")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("safe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="safe"?A+"22":SL,color:run==="safe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 Xavfsiz ulanish","🔒 Secure connection")),
      React.createElement("button",{onClick:()=>{setRun("fake");setStep(-1);},style:{flex:1,padding:"9px",background:run==="fake"?D+"22":SL,color:run==="fake"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}},t(lang,"🥷 Soxta sertifikat (MITM)","🥷 Fake certificate (MITM)"))));
}

function VPNSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",SL="#1e293b",SL2="#0f172a";
  const X={you:12,mid:50,dst:88};
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=2) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const on=run==="on";
  const px=step<=0?X.you:step===1?X.mid:X.dst;
  const revealed=step>=1;
  const node=(xk,ic,label,col)=>React.createElement("div",{style:{position:"absolute",left:X[xk]+"%",top:"46%",transform:"translate(-50%,-50%)",width:96,textAlign:"center",padding:"9px 4px",background:SL,border:"1px solid "+col+"66",borderTop:"3px solid "+col,borderRadius:11,zIndex:4}},
    React.createElement("div",{style:{fontSize:24,lineHeight:1}},ic),
    React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#e2e8f0",marginTop:3}},label));
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{overflowX:"auto"}},
      React.createElement("div",{style:{position:"relative",height:150,minWidth:520,background:SL2,border:"1px solid rgba(148,163,184,.2)",borderRadius:14}},
        on&&React.createElement("div",{style:{position:"absolute",left:"5%",right:"5%",top:"46%",height:44,transform:"translateY(-50%)",background:A+"14",border:"1.5px dashed "+A,borderRadius:22,zIndex:1}},
          React.createElement("div",{style:{position:"absolute",top:-9,left:0,right:0,textAlign:"center",fontSize:9.5,fontWeight:800,color:A,fontFamily:"var(--font-mono)"}},t(lang,"🔒 Shifrlangan VPN tunnel","🔒 Encrypted VPN tunnel"))),
        React.createElement("div",{style:{position:"absolute",left:"12%",right:"12%",top:"46%",height:2,transform:"translateY(-50%)",background:"repeating-linear-gradient(90deg,var(--text-3) 0 7px,transparent 7px 15px)",opacity:.5,zIndex:2}}),
        node("you","🧑",t(lang,"Siz","You"),BL),
        node("mid","🕵",t(lang,"Xaker / Provayder","Hacker / ISP"),D),
        node("dst","🌍",t(lang,"Sayt","Website"),A),
        run&&React.createElement("div",{style:{position:"absolute",left:px+"%",top:"46%",width:24,height:24,borderRadius:on?7:"50%",background:on?A:D,border:"2px solid #fff",boxShadow:"0 0 14px "+(on?A:D),transform:"translate(-50%,-50%)",transition:"left .85s ease-in-out",zIndex:6,display:"grid",placeItems:"center",fontSize:12}},on?"🔒":"✉"))),
    React.createElement("div",{style:{marginTop:12,background:SL2,border:"1px solid "+(revealed?(on?A:D):"rgba(148,163,184,.2)"),borderRadius:12,padding:"12px 14px",minHeight:70}},
      React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:8}},"🕵 "+t(lang,"O'rtadagi xaker/provayder nima ko'radi:","What the hacker/ISP in the middle sees:")),
      !revealed?React.createElement("div",{style:{color:"#64748b",fontSize:11,fontFamily:"var(--font-mono)"}},t(lang,"paket kutilmoqda...","waiting for the packet...")):
      on?React.createElement("div",null,
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:12,color:"#94a3b8",wordBreak:"break-all",background:"#00000033",padding:"8px 10px",borderRadius:6}},"4a9f2e7b1c...Zk@9#Lp!vB2xQ...e8d0f  (AEAD)"),
        React.createElement("div",{style:{marginTop:8,fontWeight:700,color:A,fontSize:12.5}},t(lang,"🔒 Tushunarsiz shifr — VPN ma'lumotni himoya qilyapti.","🔒 Unreadable ciphertext — the VPN is protecting the data."))):
      React.createElement("div",null,
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:12,color:"#fca5a5",background:D+"14",padding:"8px 10px",borderRadius:6}},"POST /login  user=admin  password=Secret123"),
        React.createElement("div",{style:{marginTop:8,fontWeight:700,color:D,fontSize:12.5}},t(lang,"⚠ Hammasi ochiq matnda — login va parol o'qildi!","⚠ Everything in plain text — the login and password were read!")))),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("off");setStep(-1);},style:{flex:1,padding:"9px",background:run==="off"?D+"22":SL,color:run==="off"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}},t(lang,"📴 VPN YO'Q (ochiq)","📴 No VPN (plain)")),
      React.createElement("button",{onClick:()=>{setRun("on");setStep(-1);},style:{flex:1,padding:"9px",background:run==="on"?A+"22":SL,color:run==="on"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 VPN YONIQ (tunnel)","🔒 VPN ON (tunnel)"))));
}

function DNSSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",PU="#a855f7",AM="#f59e0b",SL="#1e293b",SL2="#0f172a";
  const UNCACHED=[
    {a:"💻",b:"🔁",col:BL,uz:"Client → Resolver: «google.com ning IP si nima?»",en:"Client → Resolver: «what's the IP of google.com?»",duz:"Kompyuter odatda provayder yoki 1.1.1.1/8.8.8.8 kabi resolverga so'rov yuboradi.",den:"Your computer asks a resolver — usually your ISP's or a public one like 1.1.1.1/8.8.8.8."},
    {a:"🔁",b:"🌐",col:PU,uz:"Resolver → Root: «.com qayerda?»",en:"Resolver → Root: «where is .com?»",duz:"Root serveri javobni bilmaydi, lekin .com TLD serverlarining manzilini ko'rsatadi (referral).",den:"The root server doesn't know the answer, but points to the .com TLD servers (a referral)."},
    {a:"🔁",b:"🏛",col:AM,uz:"Resolver → TLD (.com): «google.com qayerda?»",en:"Resolver → TLD (.com): «where is google.com?»",duz:"TLD serveri ham javobni bilmaydi — google.com ning authoritative NS'larini ko'rsatadi.",den:"The TLD server also doesn't know — it points to google.com's authoritative name servers."},
    {a:"🔁",b:"📍",col:"#f472b6",uz:"Resolver → Authoritative: «A yozuvi?»",en:"Resolver → Authoritative: «A record?»",duz:"Authoritative server — aniq javobni biladigan YAGONA server. 142.250.187.206 qaytaradi.",den:"The authoritative server — the ONLY one that actually knows. It returns 142.250.187.206."},
    {a:"🔁",b:"💻",col:A,uz:"Resolver → Client: IP qaytariladi va KESHLANADI",en:"Resolver → Client: the IP is returned and CACHED",duz:"Resolver javobni TTL muddatigacha xotirada saqlaydi — keyingi so'rov tezroq bo'ladi.",den:"The resolver stores the answer until the TTL expires — the next query will be faster."}
  ];
  const CACHED=[
    {a:"💻",b:"🔁",col:BL,uz:"Client → Resolver: «google.com ning IP si nima?»",en:"Client → Resolver: «what's the IP of google.com?»",duz:"Xuddi shu so'rov — lekin bu safar resolver avval yodlab qo'ygan.",den:"The same query — but this time the resolver already remembers it."},
    {a:"🔁",b:"💻",col:A,uz:"Resolver: keshdan darhol javob — Root/TLD/Authoritative'ga umuman murojaat yo'q!",en:"Resolver: instant answer from cache — no trip to Root/TLD/Authoritative at all!",duz:"TTL hali tugamagan bo'lsa, resolver xotiradan javob beradi — millisekundlarda.",den:"If the TTL hasn't expired, the resolver answers from memory — in milliseconds."}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="cold"?UNCACHED:CACHED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),900);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="cold"?UNCACHED:run==="warm"?CACHED:null;
  const done=list&&step>=list.length-1;
  const nodeRow=["💻","🔁","🌐","🏛","📍"];
  const nodeLbl=[t(lang,"Client","Client"),t(lang,"Resolver","Resolver"),"Root",t(lang,"TLD (.com)","TLD (.com)"),t(lang,"Authoritative","Authoritative")];
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",gap:6,marginBottom:12,overflowX:"auto"}},
      nodeRow.map(function(ic,i){return React.createElement("div",{key:i,style:{flex:"1 0 auto",minWidth:78,textAlign:"center",padding:"9px 4px",background:SL,border:"1px solid rgba(148,163,184,.25)",borderRadius:10}},
        React.createElement("div",{style:{fontSize:20}},ic),React.createElement("div",{style:{fontSize:9.5,color:"#94a3b8",marginTop:2,fontFamily:"var(--font-mono)"}},nodeLbl[i]));})),
    React.createElement("div",{style:{minHeight:56}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"16px"}},t(lang,"⬇ Ssenariy tanlang — DNS so'rovi qanday hal bo'lishini bosqichma-bosqich ko'ring.","⬇ Pick a scenario — watch how a DNS query gets resolved step by step.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",marginBottom:7,background:step===i?s.col+"1f":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:18,display:"flex",gap:2,flexShrink:0}},s.a,React.createElement("span",{style:{color:"#64748b",fontSize:12}},"→"),s.b),
          React.createElement("div",{style:{flex:1}},
            React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
            React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:2,lineHeight:1.5}},t(lang,s.duz,s.den))));})),
    done&&React.createElement("div",{style:{marginTop:6,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:A+"1f",border:"1px solid "+A,color:A}},
      run==="cold"?t(lang,"✓ To'liq (rekursiv) so'rov: ~5 qadam, ~50-200ms","✓ Full (recursive) lookup: ~5 steps, ~50-200ms"):t(lang,"⚡ Keshdan javob: 1 qadam, <1ms — TTL tugagach yana to'liq so'rov kerak bo'ladi","⚡ Answered from cache: 1 step, <1ms — a full lookup will be needed again once the TTL expires")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("cold");setStep(-1);},style:{flex:1,padding:"9px",background:run==="cold"?BL+"22":SL,color:run==="cold"?"#93c5fd":"#cbd5e1",border:"1px solid "+BL+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🧊 Birinchi so'rov (keshsiz)","🧊 First query (no cache)")),
      React.createElement("button",{onClick:()=>{setRun("warm");setStep(-1);},style:{flex:1,padding:"9px",background:run==="warm"?A+"22":SL,color:run==="warm"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⚡ Keyingi so'rov (keshdan)","⚡ Next query (from cache)"))));
}

function HTTPSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",AM="#f59e0b",SL="#1e293b",SL2="#0f172a";
  const SCEN={
    ok:{method:"GET",path:"/",status:200,statusText:"OK",col:A,sens:false,
      req:"GET / HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0",
      res:"HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html>...bosh sahifa...</html>",
      uz:"GET / — bosh sahifani olish",en:"GET / — fetch the homepage"},
    notfound:{method:"GET",path:"/missing",status:404,statusText:"Not Found",col:D,sens:false,
      req:"GET /missing HTTP/1.1\nHost: example.com",
      res:"HTTP/1.1 404 Not Found\nContent-Type: text/html\n\n<h1>404</h1>",
      uz:"GET /missing — mavjud bo'lmagan sahifa",en:"GET /missing — a page that doesn't exist"},
    login:{method:"POST",path:"/login",status:302,statusText:"Found",col:AM,sens:true,sensLbl:{uz:"login va parol",en:"login and password"},
      req:"POST /login HTTP/1.1\nHost: example.com\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin&password=Secret123",
      res:"HTTP/1.1 302 Found\nLocation: /dashboard\nSet-Cookie: session=abc123xyz",
      uz:"POST /login — tizimga kirish",en:"POST /login — logging in"},
    admin:{method:"GET",path:"/admin",status:403,statusText:"Forbidden",col:D,sens:true,sensLbl:{uz:"sessiya cookie",en:"session cookie"},
      req:"GET /admin HTTP/1.1\nHost: example.com\nCookie: session=abc123xyz",
      res:"HTTP/1.1 403 Forbidden\nContent-Type: text/html\n\n<h1>Access Denied</h1>",
      uz:"GET /admin — ruxsatsiz kirish urinishi",en:"GET /admin — an unauthorized access attempt"}
  };
  const [scen,setScen]=useState(null);
  const [step,setStep]=useState(-1);
  const [proto,setProto]=useState("https");
  useEffect(()=>{
    if(scen==null){setStep(-1);return;}
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=1) return;
    const id=setTimeout(()=>setStep(1),950);return()=>clearTimeout(id);
  },[scen,step]);
  const s=scen?SCEN[scen]:null;
  const line=(dir,ic,mono,col)=>React.createElement("div",{className:"na-rise",style:{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 13px",marginBottom:7,background:col+"14",border:"1px solid "+col+"55",borderLeft:"4px solid "+col,borderRadius:10}},
    React.createElement("div",{style:{fontSize:17}},ic),
    React.createElement("div",{style:{flex:1}},
      React.createElement("div",{style:{fontSize:9.5,fontWeight:800,color:col,fontFamily:"var(--font-mono)",marginBottom:3,letterSpacing:.4}},dir),
      React.createElement("pre",{style:{margin:0,fontFamily:"var(--font-mono)",fontSize:11,color:"#e2e8f0",whiteSpace:"pre-wrap",lineHeight:1.55}},mono)));
  const cipher="16 03 03 01 2f a4 9f 2e 7b 1c 88 3d ... 5e Zk#Lp!vB2xQ ... e8 d0 f3  (TLS shifrlangan yozuv)";
  const wireOn=s&&step>=0;
  const httpText=s?(s.req+(step>=1?"\n\n"+s.res:"")):"";
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",gap:8,marginBottom:10}},
      React.createElement("button",{onClick:()=>setProto("http"),style:{flex:1,padding:"7px",background:proto==="http"?D+"22":SL,color:proto==="http"?D:"#94a3b8",border:"1px solid "+D+"55",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 HTTP (ochiq)","🔓 HTTP (plain)")),
      React.createElement("button",{onClick:()=>setProto("https"),style:{flex:1,padding:"7px",background:proto==="https"?A+"22":SL,color:proto==="https"?A:"#94a3b8",border:"1px solid "+A+"55",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 HTTPS (shifrlangan)","🔒 HTTPS (encrypted)"))),
    React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}},
      Object.keys(SCEN).map(function(k){const x=SCEN[k];return React.createElement("button",{key:k,onClick:()=>{setScen(k);setStep(-1);},style:{flex:"1 1 auto",padding:"8px 9px",background:scen===k?x.col+"22":SL,color:scen===k?x.col:"#cbd5e1",border:"1px solid "+(scen===k?x.col:"rgba(148,163,184,.3)"),borderRadius:8,fontSize:10.5,fontWeight:700,cursor:"pointer",fontFamily:"var(--font-mono)"}},x.method+" "+x.path);})),
    React.createElement("div",{style:{minHeight:40}},
      s==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬆ So'rov tanlang — so'rov/javob va tarmoqdagi kuzatuvchi nima ko'rishini solishtiring.","⬆ Pick a request — compare the request/response and what an observer on the wire sees.")):
      React.createElement("div",null,
        step>=0&&line("BROWSER → SERVER","📤",s.req,BL),
        step>=1&&line("SERVER → BROWSER · "+s.status+" "+s.statusText,"📥",s.res,s.col))),
    React.createElement("div",{style:{marginTop:4,background:SL2,border:"1px solid "+(wireOn?(proto==="https"?A:D):"rgba(148,163,184,.2)"),borderRadius:12,padding:"12px 14px",minHeight:64}},
      React.createElement("div",{style:{fontSize:11.5,fontWeight:700,color:"#e2e8f0",marginBottom:8}},"🕵 "+t(lang,"Tarmoqdagi kuzatuvchi (masalan ochiq WiFi) nima ko'radi:","What an observer on the network (e.g. public WiFi) sees:")),
      !wireOn?React.createElement("div",{style:{color:"#64748b",fontSize:11,fontFamily:"var(--font-mono)"}},t(lang,"so'rov kutilmoqda...","waiting for a request...")):
      proto==="https"?React.createElement("div",null,
        React.createElement("pre",{style:{margin:0,fontFamily:"var(--font-mono)",fontSize:10.5,color:"#94a3b8",whiteSpace:"pre-wrap",wordBreak:"break-all",background:"#00000033",padding:"8px 10px",borderRadius:6}},cipher),
        React.createElement("div",{style:{marginTop:7,fontWeight:700,color:A,fontSize:12}},t(lang,"🔒 Tushunarsiz shifr — metod, yo'l va ma'lumot yashirin.","🔒 Unreadable ciphertext — method, path and data are hidden."))):
      React.createElement("div",null,
        React.createElement("pre",{style:{margin:0,fontFamily:"var(--font-mono)",fontSize:10.5,color:s.sens?"#fca5a5":"#e2e8f0",whiteSpace:"pre-wrap",wordBreak:"break-all",background:D+"14",padding:"8px 10px",borderRadius:6}},httpText),
        React.createElement("div",{style:{marginTop:7,fontWeight:700,color:D,fontSize:12}},s.sens?"⚠ "+t(lang,"Ochiq matnda "+t(lang,s.sensLbl.uz,s.sensLbl.en)+" ham ko'rinadi!","Plain text — even the "+t(lang,s.sensLbl.uz,s.sensLbl.en)+" is visible!"):t(lang,"⚠ So'rov ochiq — qaysi sahifaga kirganingiz ko'rinadi.","⚠ The request is in the open — which page you visited is visible.")))));
}

function ARPSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",GY="#64748b",SL="#1e293b",SL2="#0f172a";
  const BCAST=[
    {uz:"A → HAMMA (broadcast): «192.168.1.5 kimda? MAC ingni yuboring!»",en:"A → EVERYONE (broadcast): «who has 192.168.1.5? send your MAC!»",
     duz:"Ethernet darajasida broadcast (FF:FF:FF:FF:FF:FF) — LAN dagi HAR BIR qurilma bu so'rovni oladi.",den:"An Ethernet-level broadcast (FF:FF:FF:FF:FF:FF) — EVERY device on the LAN receives this request.",st:{b:"pulse",c:"pulse",d:"pulse"}},
    {uz:"B va D: «bu men emas» — javob bermay e'tiborsiz qoldiradi",en:"B and D: «not me» — silently ignore it",
     duz:"Har qurilma so'ralgan IP o'zinikimi tekshiradi. Mos kelmasa, hech narsa yubormaydi.",den:"Each device checks whether the requested IP is its own. If not, it sends nothing back.",st:{b:"ignore",c:"owner",d:"ignore"}},
    {uz:"C (egasi) → A (unicast): «Bu men! MAC = aa:bb:cc:dd:ee:ff»",en:"C (the owner) → A (unicast): «That's me! MAC = aa:bb:cc:dd:ee:ff»",
     duz:"Faqat IP egasi to'g'ridan-to'g'ri (unicast) javob beradi. A bu javobni ARP jadvaliga yozadi va keshlaydi.",den:"Only the IP's owner replies directly (unicast). A stores this answer in its ARP table and caches it.",st:{b:"ignore",c:"owner",d:"ignore",cache:true}}
  ];
  const CACHED=[
    {uz:"A: ARP jadvalini tekshiradi — 192.168.1.5 ALLAQACHON bor!",en:"A: checks its ARP table — 192.168.1.5 is ALREADY there!",
     duz:"Kesh muddati (odatda ~60 soniya — bir necha daqiqa) hali tugamagan bo'lsa, broadcast shart emas.",den:"If the cache timeout (typically ~60 seconds to a few minutes) hasn't expired, no broadcast is needed.",st:{b:"idle",c:"owner",d:"idle"}},
    {uz:"A → C: darhol to'g'ridan-to'g'ri (unicast) trafik yuboradi",en:"A → C: sends traffic directly (unicast) right away",
     duz:"Butun tarmoqqa baqirish o'rniga — bitta xotiradagi yozuv orqali millisekundlarda.",den:"Instead of shouting to the whole network — a single memory lookup, in milliseconds.",st:{b:"idle",c:"owner",d:"idle",cache:true}}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="cold"?BCAST:CACHED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="cold"?BCAST:run==="warm"?CACHED:null;
  const cur=list&&step>=0?list[step]:null;
  const st=cur?cur.st:{b:"idle",c:"idle",d:"idle"};
  const nodeCol=function(k){return st[k]==="pulse"?BL:st[k]==="owner"?A:st[k]==="ignore"?GY:"rgba(148,163,184,.3)";};
  const nodeOp=function(k){return st[k]==="ignore"?.4:1;};
  const nbox=function(k,ic,label){return React.createElement("div",{style:{flex:1,textAlign:"center",padding:"10px 4px",background:SL,border:"1.5px solid "+nodeCol(k),borderRadius:10,opacity:nodeOp(k),transition:"all .3s",boxShadow:st[k]==="pulse"?"0 0 12px "+BL+"88":st[k]==="owner"?"0 0 12px "+A+"88":"none"}},
    React.createElement("div",{style:{fontSize:20}},ic),React.createElement("div",{style:{fontSize:9.5,color:"#cbd5e1",marginTop:2,fontFamily:"var(--font-mono)"}},label));};
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",gap:6,marginBottom:12}},
      nbox("a","💻",t(lang,"A (so'ragan)","A (asking)")),
      nbox("b","💻","B"),
      nbox("c","🎯",t(lang,"C (egasi)","C (owner)")),
      nbox("d","💻","D")),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — ARP so'rovi butun tarmoqqami yoki keshdanmi hal bo'lishini ko'ring.","⬇ Pick a scenario — see whether the ARP query goes to the whole network or is answered from cache.")):
      list.map(function(s,i){ if(step<i) return null;
        const col=i===list.length-1?A:BL;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?col+"14":SL2,border:"1px solid "+col+(step===i?"":"44"),borderLeft:"4px solid "+col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.st.cache&&React.createElement("div",{style:{marginTop:2,padding:"9px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12,background:A+"1f",border:"1px solid "+A,color:A}},
      run==="cold"?t(lang,"✓ ARP jadvaliga yozildi: 192.168.1.5 → aa:bb:cc:dd:ee:ff (keshlangan)","✓ Written to the ARP table: 192.168.1.5 → aa:bb:cc:dd:ee:ff (cached)"):t(lang,"⚡ Keshdan — broadcast yo'q, darhol javob","⚡ From cache — no broadcast, instant answer")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("cold");setStep(-1);},style:{flex:1,padding:"9px",background:run==="cold"?BL+"22":SL,color:run==="cold"?"#93c5fd":"#cbd5e1",border:"1px solid "+BL+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"📢 Birinchi so'rov (broadcast)","📢 First query (broadcast)")),
      React.createElement("button",{onClick:()=>{setRun("warm");setStep(-1);},style:{flex:1,padding:"9px",background:run==="warm"?A+"22":SL,color:run==="warm"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⚡ Keyingi so'rov (keshdan)","⚡ Next query (from cache)"))));
}

function DHCPSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",PU="#a855f7",AM="#f59e0b",SL2="#0f172a";
  const DORA=[
    {ic:"📢",col:BL,dir:"BROADCAST · UDP 68→67",uz:"Client → HAMMA: «Menga IP kerak!» (DHCPDISCOVER)",en:"Client → EVERYONE: «I need an IP!» (DHCPDISCOVER)",duz:"Qurilmaning hali IP si yo'q, shuning uchun manzil bilmagan holda butun tarmoqqa (255.255.255.255) yuboradi.",den:"The device has no IP yet, so it broadcasts to the whole network (255.255.255.255) without knowing any address."},
    {ic:"🎁",col:PU,dir:"BROADCAST/UNICAST",uz:"Server → Client: «192.168.1.50 ni taklif qilaman» (DHCPOFFER)",en:"Server → Client: «I'm offering you 192.168.1.50» (DHCPOFFER)",duz:"Server o'z diapazonidan bo'sh manzil tanlab, vaqtincha band qilib qo'yadi.",den:"The server picks a free address from its pool and reserves it temporarily."},
    {ic:"🤝",col:AM,dir:"BROADCAST",uz:"Client → HAMMA: «192.168.1.50 ni tanladim!» (DHCPREQUEST)",en:"Client → EVERYONE: «I chose 192.168.1.50!» (DHCPREQUEST)",duz:"Bu ham broadcast — agar bir nechta server taklif yuborgan bo'lsa, boshqalari o'z takliflarini bekor qiladi.",den:"This is also a broadcast — if several servers made offers, the others withdraw theirs."},
    {ic:"✅",col:A,dir:"UNICAST",uz:"Server → Client: «Tasdiqlandi! Ijara: 24 soat» (DHCPACK)",en:"Server → Client: «Confirmed! Lease: 24 hours» (DHCPACK)",duz:"Manzil rasman biriktirildi. T1 (~ijaraning yarmida) qurilma uni yangilashga harakat qiladi.",den:"The address is now officially assigned. At T1 (~halfway through the lease) the device will try to renew it."}
  ];
  const RENEW=[
    {ic:"🔄",col:BL,dir:"UNICAST — to'g'ridan-to'g'ri",uz:"Client → Server: «Ijaramni yangilayman» (DHCPREQUEST)",en:"Client → Server: «Renewing my lease» (DHCPREQUEST)",duz:"T1 vaqtida qurilma serverni allaqachon bilgani uchun broadcast'siz, to'g'ridan-to'g'ri so'raydi.",den:"At T1 the device already knows the server, so it asks directly — no broadcast needed."},
    {ic:"✅",col:A,dir:"UNICAST",uz:"Server → Client: «Tasdiqlandi, yana 24 soat» (DHCPACK)",en:"Server → Client: «Confirmed, another 24 hours» (DHCPACK)",duz:"Discover va Offer shart emas — to'rt qadamdan faqat ikkitasi yetarli.",den:"Discover and Offer aren't needed — only two of the four steps are required."}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="dora"?DORA:RENEW;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="dora"?DORA:run==="renew"?RENEW:null;
  const done=list&&step>=list.length-1;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",gap:8,marginBottom:12}},
      React.createElement("div",{style:{flex:1,textAlign:"center",padding:"9px",background:SL2,border:"1px solid "+BL+"55",borderRadius:10,fontSize:12,fontWeight:700,color:"#93c5fd"}},t(lang,"💻 Client (yangi qurilma)","💻 Client (new device)")),
      React.createElement("div",{style:{color:"#64748b",fontSize:16,padding:"0 2px"}},"⇄"),
      React.createElement("div",{style:{flex:1,textAlign:"center",padding:"9px",background:SL2,border:"1px solid "+A+"55",borderRadius:10,fontSize:12,fontWeight:700,color:"#86efac"}},t(lang,"🗄 DHCP Server","🗄 DHCP Server"))),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — yangi qurilma to'liq DORA jarayonidan o'tishini va ijara yangilash qanchalik qisqaroq ekanini solishtiring.","⬇ Pick a scenario — compare a new device going through the full DORA process versus how much shorter a lease renewal is.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:19,lineHeight:1}},s.ic),
          React.createElement("div",{style:{flex:1}},
            React.createElement("div",{style:{fontSize:9,fontWeight:800,color:s.col,fontFamily:"var(--font-mono)",marginBottom:3,letterSpacing:.4}},s.dir),
            React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
            React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den))));})),
    done&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:A+"1f",border:"1px solid "+A,color:A}},
      run==="dora"?t(lang,"✓ To'liq DORA: 4 qadam, 2 tasi broadcast","✓ Full DORA: 4 steps, 2 of them broadcasts"):t(lang,"⚡ Yangilash: bor-yo'g'i 2 qadam, ikkalasi ham unicast — tezroq va shovqinsiz","⚡ Renewal: just 2 steps, both unicast — faster and quieter")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("dora");setStep(-1);},style:{flex:1,padding:"9px",background:run==="dora"?BL+"22":SL2,color:run==="dora"?"#93c5fd":"#cbd5e1",border:"1px solid "+BL+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🆕 Yangi qurilma (to'liq DORA)","🆕 New device (full DORA)")),
      React.createElement("button",{onClick:()=>{setRun("renew");setStep(-1);},style:{flex:1,padding:"9px",background:run==="renew"?A+"22":SL2,color:run==="renew"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔄 Ijarani yangilash","🔄 Renewing the lease"))));
}

function RoutingSim(){
  const lang=useLang();
  const A="#22c55e",BL="#3b82f6",PU="#a855f7",AM="#f59e0b",GY="#64748b",SL2="#0f172a";
  const MULTI={
    nodes:[["💻","PC"],["🏠","R1"],["🌐","R2"],["🛰","R3"],["🎯",t(lang,"Manzil","Dest")]],
    steps:[
      {col:BL,ttl:"TTL=64",uz:"PC (10.0.0.5): paket yaratildi — manzil 8.8.8.8",en:"PC (10.0.0.5): packet created — destination 8.8.8.8",duz:"Kompyuter subnet mask bilan solishtiradi: 8.8.8.8 o'z tarmog'ida emas → default gateway'ga yuboradi.",den:"The computer compares against its subnet mask: 8.8.8.8 isn't on its own network → sends it to the default gateway."},
      {col:PU,ttl:"TTL 64→63",uz:"R1 (uy routeri): aniq yo'l yo'q → standart (0.0.0.0/0) orqali ISP'ga",en:"R1 (home router): no specific route → via the default (0.0.0.0/0) to the ISP",duz:"Jadvalda 8.8.8.8 uchun aniq yozuv yo'q — standart yo'l ishlatiladi.",den:"No exact entry for 8.8.8.8 in the table — the default route is used."},
      {col:AM,ttl:"TTL 63→62",uz:"R2 (ISP routeri): eng mos yo'l tanlanadi (longest prefix match)",en:"R2 (ISP router): the best-matching route is chosen (longest prefix match)",duz:"Ko'plab yo'l orasidan 8.8.8.0/24 ga ENG ANIQ mos kelgani tanlanadi.",den:"Among many routes, the one that matches 8.8.8.0/24 MOST PRECISELY is chosen."},
      {col:"#f472b6",ttl:"TTL 62→61",uz:"R3 (magistral router): manzil tarmog'iga to'g'ridan-to'g'ri yo'l topildi",en:"R3 (backbone router): a direct route to the destination network is found",duz:"Manzilga yaqinlashilgani sari yo'llar aniqroq bo'lib boradi.",den:"The closer to the destination, the more specific the routes become."},
      {col:A,ttl:"TTL=61 qoldi",uz:"Manzilga yetib keldi! (8.8.8.8) — 4 ta hop bosib o'tildi",en:"Arrived at the destination! (8.8.8.8) — 4 hops crossed",duz:"Har hop TTL ni 1 taga kamaytiradi — bu paketning abadiy aylanib yurishining oldini oladi (0 bo'lsa, tashlanadi).",den:"Each hop decrements TTL by 1 — this stops a packet looping forever (if it hits 0, the packet is dropped).",final:true}
    ]
  };
  const DIRECT={
    nodes:[["💻","PC"],["🎯",t(lang,"Manzil","Dest")]],
    steps:[
      {col:BL,ttl:"TTL=64",uz:"PC (10.0.0.5): manzil 10.0.0.8 — subnet mask bilan tekshiriladi",en:"PC (10.0.0.5): destination 10.0.0.8 — checked against the subnet mask",duz:"255.255.255.0 niqobi bilan solishtirilsa, ikkalasi ham 10.0.0.0/24 da — demak manzil SHU YERDA, mahalliy.",den:"Compared with a 255.255.255.0 mask, both are on 10.0.0.0/24 — meaning the destination is LOCAL."},
      {col:A,ttl:"TTL=64 (o'zgarmadi)",uz:"Router SHART EMAS — ARP bilan MAC topilib, to'g'ridan-to'g'ri yuboriladi",en:"NO router needed — the MAC is found via ARP and it's sent directly",duz:"Bir xil tarmoqdagi qurilmalar switch orqali bevosita gaplashadi (L06 ARP darsini eslang). Routing faqat TARMOQLAR orasida kerak.",den:"Devices on the same network talk directly through a switch (recall L06 ARP). Routing is only needed BETWEEN networks.",final:true}
    ]
  };
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const d=run==="multi"?MULTI:DIRECT;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=d.steps.length-1) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const data=run==="multi"?MULTI:run==="direct"?DIRECT:null;
  const done=data&&step>=data.steps.length-1;
  return React.createElement("div",{style:{margin:"14px 0"}},
    data&&React.createElement("div",{style:{display:"flex",gap:6,marginBottom:12}},
      data.nodes.map(function(n,i){const lit=step>=i;return React.createElement("div",{key:i,style:{flex:1,textAlign:"center",padding:"9px 4px",background:SL2,border:"1.5px solid "+(lit?A:"rgba(148,163,184,.3)"),borderRadius:10,opacity:lit?1:.5,transition:"all .3s",boxShadow:lit&&i===step?"0 0 12px "+A+"88":"none"}},
        React.createElement("div",{style:{fontSize:19}},n[0]),React.createElement("div",{style:{fontSize:9,color:"#cbd5e1",marginTop:2,fontFamily:"var(--font-mono)"}},n[1]));})),
    React.createElement("div",{style:{minHeight:50}},
      data==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bir xil tarmoqda va uzoq manzilga borishda yo'l qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the path differs for a same-network vs a distant destination.")):
      data.steps.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",gap:8}},
            React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
            React.createElement("div",{style:{fontSize:9.5,fontWeight:800,color:s.col,fontFamily:"var(--font-mono)",flexShrink:0}},s.ttl)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:4,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    done&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:A+"1f",border:"1px solid "+A,color:A}},
      run==="multi"?t(lang,"✓ 4 hop orqali yetib bordi — har router o'z jadvalidan yo'l tanladi","✓ Delivered across 4 hops — each router picked a path from its own table"):t(lang,"⚡ Router shart emas — bir xil tarmoqda to'g'ridan-to'g'ri yetkazildi","⚡ No router needed — delivered directly on the same network")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("direct");setStep(-1);},style:{flex:1,padding:"9px",background:run==="direct"?A+"22":SL2,color:run==="direct"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🏠 Bir xil tarmoqda","🏠 Same network")),
      React.createElement("button",{onClick:()=>{setRun("multi");setStep(-1);},style:{flex:1,padding:"9px",background:run==="multi"?BL+"22":SL2,color:run==="multi"?"#93c5fd":"#cbd5e1",border:"1px solid "+BL+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🌐 Uzoq manzil (4 hop)","🌐 Distant destination (4 hops)"))));
}

function VLANSim(){
  const lang=useLang();
  const VC={10:"#ef4444",20:"#3b82f6",30:"#22c55e"};
  const AM="#f59e0b",GY="#64748b",A="#22c55e",D="#ef4444",SL2="#0f172a";
  const PORTS=[{k:"p1",vlan:10,lb:"P1"},{k:"p2",vlan:10,lb:"P2"},{k:"p3",vlan:20,lb:"P3"},{k:"p4",vlan:20,lb:"P4"},{k:"p5",vlan:30,lb:t(lang,"P5 (Mehmon)","P5 (Guest)")}];
  const VLAN_STEPS=[
    {st:{p1:"src",p2:"idle",p3:"idle",p4:"idle",p5:"idle"},uz:"P1 (VLAN 10, Buxgalteriya): broadcast frame yuboradi",en:"P1 (VLAN 10, Accounting): sends a broadcast frame",duz:"Frame Ethernet darajasida VLAN 10 teg (802.1Q) bilan belgilangan.",den:"The frame is tagged at the Ethernet level with VLAN 10 (802.1Q)."},
    {st:{p1:"src",p2:"same",p3:"blocked",p4:"blocked",p5:"blocked"},uz:"Switch: faqat VLAN 10 portlariga yuboradi — P2 oladi",en:"Switch: forwards only to VLAN 10 ports — P2 receives it",duz:"P3, P4 (VLAN 20) va P5 (VLAN 30) bu frame'ni umuman OLMAYDI — boshqa broadcast domenida.",den:"P3, P4 (VLAN 20) and P5 (VLAN 30) never receive this frame at all — they're in a different broadcast domain.",final:true}
  ];
  const HUB_STEPS=[
    {st:{p1:"src",p2:"idle",p3:"idle",p4:"idle",p5:"idle"},uz:"P1: signal yuboradi (eski HUB — VLAN tushunchasi yo'q)",en:"P1: sends a signal (an old HUB — no concept of VLANs)",duz:"Hub 1-qatlamda ishlaydi — u MAC ham, VLAN ham bilmaydi, faqat elektr signalni kuchaytiradi.",den:"A hub works at layer 1 — it knows neither MAC nor VLAN, it just repeats the electrical signal."},
    {st:{p1:"src",p2:"flood",p3:"flood",p4:"flood",p5:"flood"},uz:"Hub HAMMA portga takrorlaydi — filtrlash yo'q",en:"The hub repeats to EVERY port — no filtering at all",duz:"Mehmon porti (P5) ham Buxgalteriya (P1-P2) va IT (P3-P4) trafigini eshitadi!",den:"Even the guest port (P5) hears Accounting's (P1-P2) and IT's (P3-P4) traffic!",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="vlan"?VLAN_STEPS:HUB_STEPS;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="vlan"?VLAN_STEPS:run==="hub"?HUB_STEPS:null;
  const cur=list&&step>=0?list[step]:null;
  const stateOf=function(k){return cur?cur.st[k]:"idle";};
  const portBox=function(p){
    const s=stateOf(p.k);
    const col=s==="src"?VC[p.vlan]:s==="same"?VC[p.vlan]:s==="flood"?AM:s==="blocked"?GY:"rgba(148,163,184,.3)";
    const op=s==="blocked"?.35:1;
    return React.createElement("div",{key:p.k,style:{flex:1,textAlign:"center",padding:"9px 4px",background:SL2,border:"1.5px solid "+col,borderRadius:10,opacity:op,transition:"all .3s",boxShadow:(s==="src"||s==="same"||s==="flood")?"0 0 10px "+col+"88":"none"}},
      React.createElement("div",{style:{fontSize:17}},s==="blocked"?"🚫":"🔌"),
      React.createElement("div",{style:{fontSize:9,color:"#cbd5e1",marginTop:2,fontFamily:"var(--font-mono)"}},p.lb),
      React.createElement("div",{style:{fontSize:8,color:col,fontWeight:700,marginTop:1}},"VLAN "+p.vlan));
  };
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{textAlign:"center",padding:"8px",marginBottom:8,background:SL2,border:"1px solid rgba(148,163,184,.25)",borderRadius:10,fontSize:11,fontWeight:700,color:"#94a3b8",fontFamily:"var(--font-mono)"}},run==="hub"?t(lang,"🔌 HUB (1-qatlam, filtrisiz)","🔌 HUB (layer 1, no filtering)"):t(lang,"🔀 SWITCH (VLAN bilan)","🔀 SWITCH (with VLANs)")),
    React.createElement("div",{style:{display:"flex",gap:6,marginBottom:12}},PORTS.map(portBox)),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — VLAN bilan trafik qanday izolyatsiya qilinishini va oddiy hub bilan solishtiring.","⬇ Pick a scenario — see how VLANs isolate traffic, compared with a plain hub.")):
      list.map(function(s,i){ if(step<i) return null;
        const col=s.final?(run==="vlan"?A:D):"#3b82f6";
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?col+"14":SL2,border:"1px solid "+col+(step===i?"":"44"),borderLeft:"4px solid "+col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(run==="vlan"?A:D)+"1f",border:"1px solid "+(run==="vlan"?A:D),color:run==="vlan"?A:D}},
      run==="vlan"?t(lang,"✓ VLAN izolyatsiyasi ishladi — mehmon/IT bu trafikni ko'rmadi","✓ VLAN isolation worked — the guest/IT ports never saw this traffic"):t(lang,"⚠ Hub'da hech qanday izolyatsiya yo'q — hamma hammani ko'radi","⚠ No isolation on a hub — everyone sees everyone")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("vlan");setStep(-1);},style:{flex:1,padding:"9px",background:run==="vlan"?A+"22":SL2,color:run==="vlan"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔀 Switch + VLAN","🔀 Switch + VLAN")),
      React.createElement("button",{onClick:()=>{setRun("hub");setStep(-1);},style:{flex:1,padding:"9px",background:run==="hub"?D+"22":SL2,color:run==="hub"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔌 Oddiy HUB (solishtirish)","🔌 A plain HUB (compare)"))));
}

function NATSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",PU="#a855f7",AM="#f59e0b",GY="#64748b",SL2="#0f172a";
  const ROWS=[{intip:"192.168.1.5:52001",pub:"203.0.113.7:40001",who:"A"},{intip:"192.168.1.6:49500",pub:"203.0.113.7:40002",who:"B"},{intip:"192.168.1.7:51122",pub:"203.0.113.7:40003",who:"C"}];
  const OUT=[
    {col:BL,uz:"A (192.168.1.5:52001) tashqariga ulanmoqchi",en:"A (192.168.1.5:52001) wants to connect out",duz:"Router manba manzilini 203.0.113.7:40001 ga almashtiradi va NAT jadvaliga yozadi.",den:"The router rewrites the source to 203.0.113.7:40001 and logs it in the NAT table."},
    {col:PU,uz:"B (192.168.1.6:49500) tashqariga ulanmoqchi",en:"B (192.168.1.6:49500) wants to connect out",duz:"Boshqa tashqi port (40002) beriladi — shu bilan A ning ulanishidan ajratiladi.",den:"A different external port (40002) is assigned — keeping it distinct from A's connection."},
    {col:AM,uz:"C (192.168.1.7:51122) tashqariga ulanmoqchi",en:"C (192.168.1.7:51122) wants to connect out",duz:"Yana boshqa port (40003). Uchalasi ham bitta ommaviy IP — 203.0.113.7 — dan chiqadi.",den:"Yet another port (40003). All three exit through one public IP — 203.0.113.7.",final:true}
  ];
  const IN=[
    {col:BL,uz:"Serverdan javob keldi: 203.0.113.7:40002 ga",en:"A reply arrived from the server: to 203.0.113.7:40002",duz:"Router NAT jadvalini tekshiradi — bu port kimning ulanishiga tegishli edi?",den:"The router checks its NAT table — whose connection does this port belong to?"},
    {col:A,uz:"Topildi! Router B ga (192.168.1.6:49500) forward qiladi",en:"Found it! The router forwards it to B (192.168.1.6:49500)",duz:"Jadvaldagi yozuv tufayli javob aynan TO'G'RI qurilmaga yetib boradi.",den:"Thanks to the table entry, the reply reaches exactly the RIGHT device.",hi:1},
    {col:AM,uz:"Hujumchi: 203.0.113.7:9999 ga so'ralmagan paket yuboradi",en:"Attacker: sends an unsolicited packet to 203.0.113.7:9999",duz:"Bu portda hech qanday yozuv yo'q — hech kim bunday ulanishni so'ramagan edi.",den:"There's no entry for this port — nobody ever requested such a connection."},
    {col:D,uz:"Router: mos yozuv topilmadi → paket TASHLANADI",en:"Router: no matching entry found → the packet is DROPPED",duz:"NAT rasmiy firewall bo'lmasa-da, so'ralmagan kiruvchi trafikni tasodifan to'sadi.",den:"NAT isn't formally a firewall, but it incidentally blocks unsolicited inbound traffic.",final:true,attack:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="out"?OUT:IN;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="out"?OUT:run==="in"?IN:null;
  const cur=list&&step>=0?list[step]:null;
  const showAttackRow=run==="in"&&step>=2;
  const rowState=function(i){
    if(run==="out") return step>=i?"on":"hidden";
    if(run==="in") return cur&&cur.hi===i?"hi":"on";
    return "hidden";
  };
  const tblRow=function(r,i){
    const s=rowState(i);
    const bg=s==="hi"?A+"1f":"transparent",bd=s==="hi"?A:"rgba(148,163,184,.15)",op=s==="hidden"?.2:1;
    return React.createElement("div",{key:i,style:{display:"grid",gridTemplateColumns:"28px 1fr 1fr",gap:6,padding:"6px 8px",background:bg,border:"1px solid "+bd,borderRadius:6,opacity:op,transition:"all .3s",marginBottom:3}},
      React.createElement("span",{style:{fontSize:11,fontWeight:800,color:s==="hi"?A:"#94a3b8"}},r.who),
      React.createElement("span",{style:{fontSize:10.5,fontFamily:"var(--font-mono)",color:"#cbd5e1"}},r.intip),
      React.createElement("span",{style:{fontSize:10.5,fontFamily:"var(--font-mono)",color:s==="hi"?A:"#93c5fd"}},r.pub));
  };
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{background:SL2,border:"1px solid rgba(148,163,184,.2)",borderRadius:12,padding:"10px 12px",marginBottom:12}},
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"28px 1fr 1fr",gap:6,padding:"0 8px 6px",fontSize:9,fontWeight:800,color:"#64748b",fontFamily:"var(--font-mono)",letterSpacing:.4}},
        React.createElement("span",null,"#"),React.createElement("span",null,t(lang,"ICHKI (LAN)","INTERNAL (LAN)")),React.createElement("span",null,t(lang,"OMMAVIY","PUBLIC"))),
      ROWS.map(tblRow),
      showAttackRow&&React.createElement("div",{className:"na-rise",style:{display:"grid",gridTemplateColumns:"28px 1fr 1fr",gap:6,padding:"6px 8px",background:D+"1f",border:"1px solid "+D,borderRadius:6,marginTop:4}},
        React.createElement("span",{style:{fontSize:13}},"🥷"),React.createElement("span",{style:{fontSize:10.5,color:D,fontFamily:"var(--font-mono)"}},"?"),React.createElement("span",{style:{fontSize:10.5,color:D,fontFamily:"var(--font-mono)"}},"203.0.113.7:9999 ✗"))),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — NAT jadvali qanday quriladi va javob qanday to'g'ri qurilmani topishini ko'ring.","⬇ Pick a scenario — see how the NAT table is built and how a reply finds the right device.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="out"?t(lang,"✓ 3 qurilma, bitta ommaviy IP, 3 xil port","✓ 3 devices, one public IP, 3 different ports"):t(lang,"⚠ So'ralmagan kiruvchi trafik — hech qayerga yo'naltirilmaydi","⚠ Unsolicited inbound traffic — has nowhere to be routed")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("out");setStep(-1);},style:{flex:1,padding:"9px",background:run==="out"?BL+"22":SL2,color:run==="out"?"#93c5fd":"#cbd5e1",border:"1px solid "+BL+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"📤 Chiquvchi (jadval quriladi)","📤 Outbound (building the table)")),
      React.createElement("button",{onClick:()=>{setRun("in");setStep(-1);},style:{flex:1,padding:"9px",background:run==="in"?A+"22":SL2,color:run==="in"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"📥 Kiruvchi (javob vs hujumchi)","📥 Inbound (reply vs attacker)"))));
}

function TopoSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",GY="#64748b",SL2="#0f172a";
  const T={
    star:{nodes:[[140,80],[140,25],[205,50],[205,110],[140,135],[75,110],[75,50]],edges:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]],cut:2,affected:[3],col:AM,
      uz:"Bitta kabel (HUB↔qurilma) uziladi",en:"One cable (HUB↔device) is cut",
      duz:"Faqat O'SHA bitta qurilma tarmoqdan ajraladi — qolgan hammasi HUB orqali ishlayveradi.",den:"Only THAT one device drops off — everyone else keeps working through the HUB.",
      fin:"⚠ Faqat 1 ta qurilma yo'qotildi — qolganlari xavfsiz",finE:"⚠ Only 1 device lost — the rest are safe"},
    bus:{nodes:[[40,80],[105,80],[175,80],[240,80]],edges:[[0,1],[1,2],[2,3]],cut:1,affected:[2,3],col:D,
      uz:"Umumiy kabelning o'rtasi uziladi",en:"The shared cable is cut in the middle",
      duz:"Bus — bitta uzun umumiy kabel. Kesilgan joydan narigi TOMONDAGI barcha qurilmalar butunlay ajraladi.",den:"A bus is one long shared cable. Every device on the far side of the cut is completely isolated.",
      fin:"✗ Tarmoq ikkiga bo'lindi — yarim qurilma butunlay yo'qoldi",finE:"✗ The network split in two — half the devices are completely gone"},
    ring:{nodes:[[140,25],[210,70],[185,140],[95,140],[70,70]],edges:[[0,1],[1,2],[2,3],[3,4],[4,0]],cut:2,affected:[0,1,2,3,4],col:D,
      uz:"Halqaning bir nuqtasi uziladi",en:"One point of the ring is cut",
      duz:"Ma'lumot faqat bitta yo'nalishda aylanadi (klassik Token Ring). Zaxira ikkinchi halqa bo'lmasa, BUTUN aylanish to'xtaydi.",den:"Data circulates in one direction only (classic Token Ring). Without a backup second ring, the ENTIRE loop stops.",
      fin:"✗ Butun halqa to'xtadi — hech kim ma'lumot uzata olmaydi",finE:"✗ The whole ring stopped — no one can pass data"},
    mesh:{nodes:[[70,45],[210,45],[210,125],[70,125]],edges:[[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]],cut:0,affected:[],col:A,
      uz:"Bitta bog'lanish (0↔1) uziladi",en:"One connection (0↔1) is cut",
      duz:"Har tugun bir nechta yo'lga ega (masalan 0→2→1 orqali ham yetadi) — bitta uzilish HECH KIMGA ta'sir qilmaydi.",den:"Every node has multiple paths (e.g. 0→2→1 still works) — one break affects NO ONE.",
      fin:"✓ Barcha tugunlar hali ham to'liq bog'langan!",finE:"✓ Every node is still fully connected!"}
  };
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=1) return;
    const id=setTimeout(()=>setStep(1),1100);return()=>clearTimeout(id);
  },[run,step]);
  const d=run?T[run]:null;
  const cutDone=d&&step>=1;
  const mid=function(a,b){return[(a[0]+b[0])/2,(a[1]+b[1])/2];};
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}},
      ["star","bus","ring","mesh"].map(function(k){const lbl={star:t(lang,"⭐ Yulduz","⭐ Star"),bus:t(lang,"➖ Shina","➖ Bus"),ring:t(lang,"⭕ Halqa","⭕ Ring"),mesh:t(lang,"🕸 To'r","🕸 Mesh")}[k];
        return React.createElement("button",{key:k,onClick:()=>{setRun(k);setStep(-1);},style:{flex:"1 1 auto",padding:"8px 6px",background:run===k?T[k].col+"22":SL2,color:run===k?T[k].col:"#cbd5e1",border:"1px solid "+(run===k?T[k].col:"rgba(148,163,184,.3)"),borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},lbl);})),
    React.createElement("div",{style:{background:SL2,border:"1px solid rgba(148,163,184,.2)",borderRadius:12,padding:14,marginBottom:10}},
      d==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"30px 4px"}},t(lang,"⬆ Topologiya tanlang — kabel uzilganda nima bo'lishini ko'ring.","⬆ Pick a topology — see what happens when a cable is cut.")):
      React.createElement("svg",{viewBox:"0 0 280 160",style:{width:"100%",maxWidth:280,display:"block",margin:"0 auto"}},
        d.edges.map(function(e,i){const isCut=i===d.cut;const a=d.nodes[e[0]],b=d.nodes[e[1]];
          return React.createElement("g",{key:"e"+i},React.createElement("line",{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:isCut&&cutDone?D:"#475569",strokeWidth:isCut&&cutDone?1.5:1.7,strokeDasharray:isCut&&cutDone?"3 4":"5 4",opacity:isCut&&cutDone?.4:.75,style:{animation:isCut&&cutDone?"none":"na-dash 1s linear infinite"}}),
            isCut&&cutDone&&(function(){const m=mid(a,b);return React.createElement("text",{x:m[0],y:m[1]+3,fill:D,fontSize:13,textAnchor:"middle",fontWeight:900},"✗");})());}),
        d.nodes.map(function(n,i){const bad=cutDone&&d.affected.indexOf(i)!==-1;const col=bad?D:(cutDone?A:"var(--accent, #4dabf7)");
          return React.createElement("g",{key:"n"+i},React.createElement("circle",{cx:n[0],cy:n[1],r:i===0&&run==="star"?12:9,fill:col+"22",stroke:col,strokeWidth:1.9}),
            i===0&&run==="star"&&React.createElement("text",{x:n[0],y:n[1]+3,fill:col,fontSize:7,textAnchor:"middle",fontFamily:"var(--font-mono)",fontWeight:800},"HUB"));}))),
    d&&React.createElement("div",{className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:(cutDone?d.col:"#3b82f6")+"14",border:"1px solid "+(cutDone?d.col:"#3b82f6")+"55",borderLeft:"4px solid "+(cutDone?d.col:"#3b82f6"),borderRadius:10}},
      React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},cutDone?t(lang,d.uz,d.en):t(lang,"Normal holat — barchasi bog'langan","Normal state — everything is connected")),
      React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},cutDone?t(lang,d.duz,d.den):t(lang,"Kuting — kabel hozir uziladi...","Wait — the cable is about to be cut..."))),
    cutDone&&React.createElement("div",{style:{padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:d.col+"1f",border:"1px solid "+d.col,color:d.col}},t(lang,d.fin,d.finE)));
}

function WiFiSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",PU="#a855f7",AM="#f59e0b",SL2="#0f172a";
  const WPA=[
    {col:BL,dir:"AP → Client",uz:"ANonce (tasodifiy son) yuboriladi",en:"An ANonce (random number) is sent",duz:"4 tomonlama qo'l berishning (4-way handshake) 1-qadami — umumiy parol (PSK) hech qachon havoda uzatilmaydi.",den:"Step 1 of the 4-way handshake — the shared password (PSK) is never transmitted over the air."},
    {col:PU,dir:"Client → AP",uz:"SNonce + MIC yuboriladi",en:"An SNonce + MIC is sent",duz:"Client PSK va ikkala nonce'dan noyob sessiya kaliti (PTK) hisoblaydi va buni MIC bilan isbotlaydi.",den:"The client derives a unique session key (PTK) from the PSK and both nonces, proving it with a MIC."},
    {col:AM,dir:"AP → Client",uz:"GTK (guruh kaliti) shifrlangan holda yuboriladi",en:"The GTK (group key) is sent, encrypted",duz:"Bu kalit broadcast/multicast trafikni shifrlash uchun barcha qurilmalarga kerak.",den:"This key is needed by all devices to encrypt broadcast/multicast traffic."},
    {col:A,dir:"Client → AP",uz:"Tasdiqlanadi — ulanish shifrlangan holda o'rnatildi",en:"Confirmed — the connection is now established, encrypted",duz:"Endi barcha trafik noyob sessiya kaliti bilan shifrlanadi. Parolning o'ZI hech qachon havoda ko'rinmadi.",den:"All traffic is now encrypted with the unique session key. The password ITSELF was never sent over the air.",final:true}
  ];
  const OPEN=[
    {col:D,dir:"Client → AP",uz:"To'g'ridan-to'g'ri ulanadi — hech qanday qo'l berish yo'q",en:"Connects directly — no handshake at all",duz:"Ochiq tarmoqda shifrlash UMUMAN yo'q. WEP esa zaif RC4+statik kalit ishlatadi va daqiqalarda buziladi.",den:"An open network has NO encryption at all. WEP uses weak RC4+a static key and is broken within minutes.",final:true,attack:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="wpa"?WPA:OPEN;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="wpa"?WPA:run==="open"?OPEN:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",gap:8,marginBottom:12}},
      React.createElement("div",{style:{flex:1,textAlign:"center",padding:"9px",background:SL2,border:"1px solid "+BL+"55",borderRadius:10,fontSize:12,fontWeight:700,color:"#93c5fd"}},t(lang,"📶 Access Point","📶 Access Point")),
      React.createElement("div",{style:{color:"#64748b",fontSize:16,padding:"0 2px"}},"⇄"),
      React.createElement("div",{style:{flex:1,textAlign:"center",padding:"9px",background:SL2,border:"1px solid "+A+"55",borderRadius:10,fontSize:12,fontWeight:700,color:"#86efac"}},t(lang,"📱 Client","📱 Client"))),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — WPA2/WPA3 qo'l berishida parol nega hech qachon havoda uzatilmasligini ko'ring.","⬇ Pick a scenario — see why the password is never sent over the air in a WPA2/WPA3 handshake.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{flex:1}},
            React.createElement("div",{style:{fontSize:9,fontWeight:800,color:s.col,fontFamily:"var(--font-mono)",marginBottom:3,letterSpacing:.4}},s.dir),
            React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
            React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den))));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="wpa"?t(lang,"✓ Parol hech qachon havoda uzatilmadi — faqat matematik isbot (MIC)","✓ The password was never sent over the air — only a mathematical proof (MIC)"):t(lang,"⚠ Barcha trafik ochiq — atrofdagi HAR KIM uni o'qiy oladi","⚠ All traffic is in the clear — ANYONE nearby can read it")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("wpa");setStep(-1);},style:{flex:1,padding:"9px",background:run==="wpa"?A+"22":SL2,color:run==="wpa"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 WPA2/WPA3 (4-way handshake)","🔒 WPA2/WPA3 (4-way handshake)")),
      React.createElement("button",{onClick:()=>{setRun("open");setStep(-1);},style:{flex:1,padding:"9px",background:run==="open"?D+"22":SL2,color:run==="open"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 Ochiq / WEP","🔓 Open / WEP"))));
}

function IDSIPSSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const IDS_S=[
    {col:BL,uz:"Zararli paket (SQLi urinishi) tarmoqqa kiradi",en:"A malicious packet (an SQLi attempt) enters the network",duz:"Paket to'g'ridan-to'g'ri asosiy yo'l bo'ylab serverga qarab ketmoqda.",den:"The packet is heading straight down the main path toward the server."},
    {col:AM,uz:"IDS trafik NUSXASINI ko'radi (SPAN/TAP porti — yon tarmoqda)",en:"The IDS sees a COPY of the traffic (a SPAN/TAP port — off to the side)",duz:"IDS asosiy yo'lda EMAS — u faqat oynadagi (mirrored) nusxani passiv kuzatadi.",den:"The IDS is NOT on the main path — it passively watches only a mirrored copy."},
    {col:AM,uz:"IDS: signature mos keldi → OGOHLANTIRISH yaratildi",en:"IDS: signature matched → an ALERT is raised",duz:"IDS hujumni to'g'ri aniqladi va xavfsizlik jamoasiga xabar yubordi.",den:"The IDS correctly identified the attack and notified the security team."},
    {col:D,uz:"Ammo ASL paket to'xtatilmadi — serverga baribir yetib bordi!",en:"But the ORIGINAL packet wasn't stopped — it still reached the server!",duz:"IDS faqat kuzatadi, hech narsani ushlab qololmaydi — bu uning asosiy cheklovi.",den:"An IDS only watches, it can't intercept anything — this is its key limitation.",final:true,attack:true}
  ];
  const IPS_S=[
    {col:BL,uz:"Zararli paket (SQLi urinishi) tarmoqqa kiradi",en:"A malicious packet (an SQLi attempt) enters the network",duz:"Paket asosiy yo'l bo'ylab ketmoqda — lekin bu safar yo'lda IPS turibdi.",den:"The packet is heading down the main path — but this time the IPS sits right on it."},
    {col:AM,uz:"IPS trafik ICHIDAN o'tadi (inline) — har paketni real vaqtda tekshiradi",en:"The IPS sits INLINE — checking every packet in real time",duz:"Barcha trafik majburiy ravishda IPS orqali o'tadi, chunki u yo'lning bir qismi.",den:"All traffic is forced through the IPS, because it's physically part of the path."},
    {col:AM,uz:"IPS: signature mos keldi → OGOHLANTIRISH yaratildi",en:"IPS: signature matched → an ALERT is raised",duz:"Xuddi IDS kabi hujumni aniqlaydi — lekin bu yerda hikoya tugamaydi.",den:"Just like an IDS, it detects the attack — but here the story doesn't end."},
    {col:A,uz:"Paket DARHOL bloklandi — serverga hech qachon yetib bormadi",en:"The packet was IMMEDIATELY blocked — it never reached the server",duz:"IPS yo'lda turgani uchun zararli paketni real vaqtda ushlab qola oladi.",den:"Because the IPS sits on the path, it can catch the malicious packet in real time.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="ids"?IDS_S:IPS_S;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="ids"?IDS_S:run==="ips"?IPS_S:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{textAlign:"center",padding:"8px",marginBottom:10,background:SL2,border:"1px solid rgba(148,163,184,.25)",borderRadius:10,fontSize:11,fontWeight:700,color:"#94a3b8",fontFamily:"var(--font-mono)"}},
      run==="ids"?t(lang,"🥷 Xujumchi → 🌐 Asosiy yo'l → 🖥 Server   (IDS = yon tarmoqda kuzatuvchi)","🥷 Attacker → 🌐 Main path → 🖥 Server   (IDS = watching from the side)"):
      run==="ips"?t(lang,"🥷 Xujumchi → 🛡 IPS (yo'lning o'zida) → 🖥 Server","🥷 Attacker → 🛡 IPS (right on the path) → 🖥 Server"):
      t(lang,"🥷 Xujumchi → 🌐 Tarmoq → 🖥 Server","🥷 Attacker → 🌐 Network → 🖥 Server")),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bir xil hujum IDS va IPS orqali o'tganda natija qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the outcome differs when the same attack passes an IDS versus an IPS.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="ids"?t(lang,"⚠ IDS: aniqladi, LEKIN to'xtata olmadi","⚠ IDS: detected it, but couldn't stop it"):t(lang,"✓ IPS: aniqladi VA bloklab, hujumni to'xtatdi","✓ IPS: detected it AND blocked it, stopping the attack")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("ids");setStep(-1);},style:{flex:1,padding:"9px",background:run==="ids"?AM+"22":SL2,color:run==="ids"?AM:"#cbd5e1",border:"1px solid "+AM+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"👁 IDS (yon tarmoqda)","👁 IDS (off to the side)")),
      React.createElement("button",{onClick:()=>{setRun("ips");setStep(-1);},style:{flex:1,padding:"9px",background:run==="ips"?A+"22":SL2,color:run==="ips"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🛡 IPS (yo'lning o'zida)","🛡 IPS (right on the path)"))));
}

function NACSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",PU="#a855f7",SL2="#0f172a";
  const OK=[
    {col:BL,uz:"Supplicant (xodim noutbuki) → Switch: «ulanaman» (EAPOL-Start)",en:"Supplicant (staff laptop) → Switch: «I want to connect» (EAPOL-Start)",duz:"Qurilma switch portiga ulanishi bilanoq, port hali «yopiq» holatda — faqat autentifikatsiya trafigiga ruxsat bor.",den:"As soon as the device connects to the switch port, the port is still «closed» — only authentication traffic is allowed."},
    {col:PU,uz:"Authenticator (switch) → RADIUS: hisob ma'lumotlarini uzatadi",en:"Authenticator (switch) → RADIUS: forwards the credentials",duz:"Switch o'zi qaror qilmaydi — u shunchaki oraliq, so'rovni markazlashtirilgan serverga yo'naltiradi.",den:"The switch doesn't decide anything itself — it's just a relay, forwarding the request to the central server."},
    {col:"#a855f7",uz:"RADIUS: login/parol TO'G'RI — Access-Accept + VLAN 10",en:"RADIUS: credentials CORRECT — Access-Accept + VLAN 10",duz:"RADIUS foydalanuvchini bazadan topdi va tasdiqladi, hatto qaysi VLAN'ga tegishli ekanini ham ko'rsatdi.",den:"RADIUS found and verified the user in its database, even specifying which VLAN they belong to."},
    {col:A,uz:"Switch porti OCHILADI — qurilma Staff VLAN'ga ulandi",en:"The switch port OPENS — the device joins the Staff VLAN",duz:"Endi qurilma ichki tarmoqqa to'liq kirish huquqiga ega.",den:"The device now has full access to the internal network.",final:true}
  ];
  const BAD=[
    {col:BL,uz:"Noma'lum qurilma bo'sh xona rozetkasiga ulanadi",en:"An unknown device is plugged into an empty office jack",duz:"Hech qanday login kiritilmagan yoki soxta noutbuk ulangan — port hali «yopiq».",den:"No credentials were entered, or a rogue laptop was plugged in — the port is still «closed»."},
    {col:PU,uz:"Authenticator (switch) → RADIUS: ma'lumot so'raydi",en:"Authenticator (switch) → RADIUS: requests credentials",duz:"Switch baribir RADIUS'ga murojaat qiladi — lekin qurilma javob bera olmaydi yoki noto'g'ri javob beradi.",den:"The switch still contacts RADIUS — but the device can't respond, or responds incorrectly."},
    {col:D,uz:"RADIUS: hisob topilmadi — Access-Reject",en:"RADIUS: no matching account — Access-Reject",duz:"Bazada bunday foydalanuvchi yo'q, shuning uchun kirish rad etiladi.",den:"No such user exists in the database, so access is denied."},
    {col:D,uz:"Switch porti YOPIQ qoladi — ichki tarmoqqa kirish yo'q",en:"The switch port stays CLOSED — no access to the internal network",duz:"Eng ko'pi bilan cheklangan «mehmon» VLAN'ga tushadi. Ofisga jismoniy kirgan hujumchi ham tarmoqqa ulana olmaydi!",den:"At most it lands in a restricted «guest» VLAN. Even an attacker who physically entered the office can't join the network!",final:true,attack:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="ok"?OK:BAD;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="ok"?OK:run==="bad"?BAD:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{display:"flex",gap:6,marginBottom:12}},
      [["💻",t(lang,"Supplicant","Supplicant")],["🔌",t(lang,"Authenticator","Authenticator")],["🛂","RADIUS"]].map(function(n,i){return React.createElement("div",{key:i,style:{flex:1,textAlign:"center",padding:"9px 4px",background:SL2,border:"1px solid rgba(148,163,184,.3)",borderRadius:10}},
        React.createElement("div",{style:{fontSize:18}},n[0]),React.createElement("div",{style:{fontSize:9,color:"#cbd5e1",marginTop:2,fontFamily:"var(--font-mono)"}},n[1]));})),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — to'g'ri hisobli xodim va noma'lum qurilma uchun natija qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the outcome differs for a staff member with valid credentials versus an unknown device.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="ok"?t(lang,"✓ Xodim ishchi tarmoqqa ulandi","✓ The staff member joined the working network"):t(lang,"🔒 Rozetkaga ulash yetarli emas — tarmoqqa kirish uchun autentifikatsiya shart","🔒 Plugging in isn't enough — authentication is required to access the network")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("ok");setStep(-1);},style:{flex:1,padding:"9px",background:run==="ok"?A+"22":SL2,color:run==="ok"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"👤 Xodim (to'g'ri hisob)","👤 Staff (valid credentials)")),
      React.createElement("button",{onClick:()=>{setRun("bad");setStep(-1);},style:{flex:1,padding:"9px",background:run==="bad"?D+"22":SL2,color:run==="bad"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🥷 Noma'lum qurilma","🥷 Unknown device"))));
}

function StatefulSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",BL="#3b82f6",AM="#f59e0b",SL2="#0f172a";
  const LESS=[
    {col:BL,uz:"Client → Server: chiquvchi so'rov (port 51000 → 443)",en:"Client → Server: outbound request (port 51000 → 443)",duz:"Chiquvchi qoida bu paketni o'tkazadi.",den:"An outbound rule allows this packet through."},
    {col:AM,uz:"Server → Client: javob keladi (443 → 51000)",en:"Server → Client: a reply arrives (443 → 51000)",duz:"Bu paket endi tarmoqqa KIRUVCHI hisoblanadi.",den:"This packet now counts as INBOUND traffic."},
    {col:AM,uz:"Stateless filtr: bu paketni ilgari ko'rmaganman — hech qanday «xotira» yo'q",en:"Stateless filter: I've never seen this packet before — no «memory» at all",duz:"Filtr har paketni ALOHIDA, kontekstsiz ko'radi. Bu javob ekanini bilmaydi.",den:"The filter judges every packet in ISOLATION, with no context. It has no idea this is a reply."},
    {col:D,uz:"Agar aniq inbound qoida yo'q bo'lsa → BLOKLANADI (yoki xavfli keng qoida kerak)",en:"With no explicit inbound rule → BLOCKED (or a risky broad rule is needed)",duz:"Yechim: administrator MINGLAB mumkin bo'lgan javob porti uchun qoida yozishi kerak bo'ladi — amalda buning o'rniga xavfli «hammasiga ruxsat» qoidalari yoziladi.",den:"The fix: the admin would need rules for THOUSANDS of possible reply ports — in practice this leads to risky «allow everything» rules instead.",final:true,attack:true}
  ];
  const STATEFUL=[
    {col:BL,uz:"Client → Server: chiquvchi so'rov (port 51000 → 443)",en:"Client → Server: outbound request (port 51000 → 443)",duz:"Xuddi shu chiquvchi so'rov.",den:"The exact same outbound request."},
    {col:"#a855f7",uz:"Firewall: ulanishni jadvalga yozadi (state: NEW → ESTABLISHED)",en:"Firewall: logs the connection in its table (state: NEW → ESTABLISHED)",duz:"Bu — stateful filtrning kaliti: u har ulanishni «eslab qoladi».",den:"This is the key to a stateful filter: it «remembers» every connection."},
    {col:AM,uz:"Server → Client: javob keladi (443 → 51000)",en:"Server → Client: a reply arrives (443 → 51000)",duz:"Xuddi avvalgi ssenariydagi bir xil kiruvchi paket.",den:"The exact same inbound packet as before."},
    {col:A,uz:"Firewall: bu ESTABLISHED ulanishning javobi — avtomatik RUXSAT",en:"Firewall: this is a reply to an ESTABLISHED connection — automatically ALLOWED",duz:"Alohida inbound qoida kerak emas — «ctstate ESTABLISHED,RELATED» bitta qoida barcha javoblarni qamrab oladi.",den:"No separate inbound rule needed — one «ctstate ESTABLISHED,RELATED» rule covers every reply.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="less"?LESS:STATEFUL;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="less"?LESS:run==="stateful"?STATEFUL:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — javob paketi stateless va stateful filtrda qanday farq bilan ko'rilishini solishtiring.","⬇ Pick a scenario — compare how a reply packet is treated by a stateless versus a stateful filter.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="less"?t(lang,"⚠ Har javob uchun qo'lda qoida kerak — boshqarish qiyin va xavfli","⚠ Every reply needs a manual rule — hard to manage and risky"):t(lang,"✓ Bitta qoida barcha qonuniy javoblarni avtomatik qamrab oladi","✓ One rule automatically covers every legitimate reply")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("less");setStep(-1);},style:{flex:1,padding:"9px",background:run==="less"?D+"22":SL2,color:run==="less"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"📋 Stateless (xotirasiz)","📋 Stateless (no memory)")),
      React.createElement("button",{onClick:()=>{setRun("stateful");setStep(-1);},style:{flex:1,padding:"9px",background:run==="stateful"?A+"22":SL2,color:run==="stateful"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🧠 Stateful (ulanishni eslaydi)","🧠 Stateful (remembers connections)"))));
}

function ProxySim(){
  const lang=useLang();
  const A="#22c55e",BL="#3b82f6",PU="#a855f7",SL2="#0f172a";
  const FWD=[
    {col:BL,uz:"Siz (10.0.0.5) → Forward Proxy: so'rov yuborasiz",en:"You (10.0.0.5) → Forward Proxy: send a request",duz:"So'rov avval kompaniya/provayder proxy serveriga boradi, to'g'ridan-to'g'ri saytga emas.",den:"The request goes to the company/ISP proxy first, not directly to the site."},
    {col:PU,uz:"Forward Proxy → Sayt: O'Z IP'si (203.0.113.9) bilan so'raydi",en:"Forward Proxy → Site: requests using ITS OWN IP (203.0.113.9)",duz:"Proxy sizning nomingizdan harakat qiladi — sayt so'rovni proxy'dan kelgan deb ko'radi.",den:"The proxy acts on your behalf — the site sees the request as coming from the proxy."},
    {col:"#a855f7",uz:"Sayt → Forward Proxy → Siz: javob shu yo'l bilan qaytadi",en:"Site → Forward Proxy → You: the reply travels back the same way",duz:"Javob ham proxy orqali filtrlanib/keshlanib qaytishi mumkin.",den:"The reply can also be filtered/cached by the proxy on its way back."},
    {col:A,uz:"Natija: sayt SIZNING haqiqiy IP'ingizni hech qachon ko'rmaydi",en:"Result: the site never sees YOUR real IP",duz:"Faqat proxy'ning IP'si ko'rinadi — sizning shaxsingiz (client) serverdan yashiringan.",den:"Only the proxy's IP is visible — your identity (the client) is hidden from the server.",final:true}
  ];
  const REV=[
    {col:BL,uz:"Foydalanuvchi → example.com: oddiy so'rov yuboradi",en:"User → example.com: sends a normal request",duz:"Foydalanuvchi hech narsani bilmaydi — u to'g'ridan-to'g'ri saytga murojaat qilayotganini o'ylaydi.",den:"The user doesn't know anything special — they think they're talking directly to the site."},
    {col:PU,uz:"Aslida so'rov Reverse Proxy'ga (Cloudflare/nginx) tushadi",en:"In reality the request lands on a Reverse Proxy (Cloudflare/nginx)",duz:"DNS example.com ni HAQIQIY serverga emas, reverse proxy'ga yo'naltiradi.",den:"DNS for example.com points to the reverse proxy, not the real server."},
    {col:"#a855f7",uz:"Reverse Proxy → Ichki server: so'rovni yashiringan tarmoqqa uzatadi",en:"Reverse Proxy → Internal server: forwards the request into the hidden network",duz:"Haqiqiy server ichki (masalan 10.0.5.20) manzilda — internetdan to'g'ridan-to'g'ri erishib bo'lmaydi.",den:"The real server sits at an internal address (e.g. 10.0.5.20) — unreachable directly from the internet."},
    {col:A,uz:"Natija: foydalanuvchi HAQIQIY server IP'sini hech qachon bilmaydi",en:"Result: the user never learns the REAL server's IP",duz:"Bu himoya beradi (DDoS so'rilishi, to'g'ridan-to'g'ri hujum imkonsiz) va yuk taqsimlash/TLS'ni markazlashtiradi.",den:"This provides protection (DDoS absorption, no direct attack surface) and centralizes load balancing/TLS.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="fwd"?FWD:REV;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="fwd"?FWD:run==="rev"?REV:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — forward va reverse proxy'da kimning shaxsi kimdan yashirilishini solishtiring.","⬇ Pick a scenario — see whose identity is hidden from whom, with a forward vs a reverse proxy.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:A+"1f",border:"1px solid "+A,color:A}},
      run==="fwd"?t(lang,"✓ Forward proxy: MIJOZ shaxsi yashiringan","✓ Forward proxy: the CLIENT's identity is hidden"):t(lang,"✓ Reverse proxy: SERVER shaxsi yashiringan","✓ Reverse proxy: the SERVER's identity is hidden")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("fwd");setStep(-1);},style:{flex:1,padding:"9px",background:run==="fwd"?BL+"22":SL2,color:run==="fwd"?"#93c5fd":"#cbd5e1",border:"1px solid "+BL+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"👤 Forward proxy (mijoz yashirin)","👤 Forward proxy (client hidden)")),
      React.createElement("button",{onClick:()=>{setRun("rev");setStep(-1);},style:{flex:1,padding:"9px",background:run==="rev"?A+"22":SL2,color:run==="rev"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🖥 Reverse proxy (server yashirin)","🖥 Reverse proxy (server hidden)"))));
}

function ZeroTrustSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",SL2="#0f172a";
  const OLD=[
    {col:AM,uz:"Hujumchi fishing orqali bitta xodim kompyuterini buzadi",en:"An attacker compromises one employee's PC via phishing",duz:"Bu — deyarli har bir haqiqiy buzilishning boshlanish nuqtasi.",den:"This is the starting point of nearly every real-world breach."},
    {col:AM,uz:"Eski model («qal'a va handaq»): bu qurilma ALLAQACHON ichkarida",en:"Old model («castle and moat»): this device is ALREADY inside",duz:"Perimetr (firewall) bir marta o'tilgach, ichkaridagi hamma narsaga avtomatik ishoniladi.",den:"Once the perimeter (firewall) is crossed once, everything inside is automatically trusted."},
    {col:D,uz:"Hujumchi to'g'ridan-to'g'ri Payroll bazasiga so'rov yuboradi",en:"The attacker sends a request straight to the Payroll database",duz:"Qayta tekshiruv YO'Q — ichki tarmoqdagi so'rov «xavfsiz» deb qabul qilinadi.",den:"There's NO re-check — a request from inside the network is assumed «safe»."},
    {col:D,uz:"Kirish berildi — hujumchi butun tarmoqda ERKIN harakatlanadi",en:"Access granted — the attacker moves FREELY across the network",duz:"Bu «lateral movement» deyiladi — bitta zaif nuqta butun tashkilotni xavf ostiga qo'yadi.",den:"This is called «lateral movement» — one weak point puts the entire organization at risk.",final:true,attack:true}
  ];
  const ZTS=[
    {col:AM,uz:"Hujumchi fishing orqali bitta xodim kompyuterini buzadi",en:"An attacker compromises one employee's PC via phishing",duz:"Zero Trust bu bosqichni oldini OLMAYDI — u «buzilish sodir bo'ladi» deb faraz qiladi (assume breach).",den:"Zero Trust doesn't PREVENT this step — it assumes a breach will happen (assume breach)."},
    {col:"#3b82f6",uz:"Zero Trust: bu so'rov ham QAYTA tekshiriladi — ichkaridan bo'lsa ham",en:"Zero Trust: this request is RE-VERIFIED too — even though it's from inside",duz:"«Hech kimga ishonma, doim tekshir» — manba ichki tarmoqda bo'lishi ishonch bermaydi.",den:"«Never trust, always verify» — being on the internal network grants no automatic trust."},
    {col:AM,uz:"Tekshiruv: qurilma holati shubhali, MFA tasdiqlanmagan",en:"Check: device posture is suspicious, MFA not confirmed",duz:"Siyosat kim + qaysi qurilma + qanday kontekstni birga baholaydi — biri mos kelmasa, yetarli emas.",den:"The policy evaluates who + which device + what context together — if one fails, it's not enough."},
    {col:A,uz:"Kirish RAD ETILDI — hujumchi boshqa hech narsaga o'ta olmaydi",en:"Access DENIED — the attacker can't reach anything else",duz:"Mikrosegmentatsiya tufayli buzilgan qurilma FAQAT o'zi bilan cheklanadi — Payroll bazasi xavfsiz qoladi.",den:"Thanks to microsegmentation, the compromised device is CONTAINED to itself — the Payroll database stays safe.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="old"?OLD:ZTS;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="old"?OLD:run==="zt"?ZTS:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{textAlign:"center",padding:"8px",marginBottom:10,background:SL2,border:"1px solid rgba(148,163,184,.25)",borderRadius:10,fontSize:11,fontWeight:700,color:"#94a3b8",fontFamily:"var(--font-mono)"}},t(lang,"🥷 Fishing → 💻 Xodim PC → 🎯 Payroll bazasi","🥷 Phishing → 💻 Employee PC → 🎯 Payroll database")),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bitta buzilgan qurilma eski model va Zero Trust'da qanday oqibatga olib kelishini ko'ring.","⬇ Pick a scenario — see what one compromised device leads to under the old model versus Zero Trust.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="old"?t(lang,"✗ Bitta zaif nuqta — butun tashkilot xavf ostida","✗ One weak point — the whole organization is at risk"):t(lang,"✓ Bitta zaif nuqta — faqat o'zi bilan cheklandi","✓ One weak point — contained to itself")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("old");setStep(-1);},style:{flex:1,padding:"9px",background:run==="old"?D+"22":SL2,color:run==="old"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🏰 Eski model (qal'a-handaq)","🏰 Old model (castle-moat)")),
      React.createElement("button",{onClick:()=>{setRun("zt");setStep(-1);},style:{flex:1,padding:"9px",background:run==="zt"?A+"22":SL2,color:run==="zt"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🛡 Zero Trust","🛡 Zero Trust"))));
}

function ScanSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const SYN=[
    {col:BL,uz:"Attacker → Target:22 — SYN yuboriladi",en:"Attacker → Target:22 — a SYN is sent",duz:"Odatiy TCP qo'l berishning 1-qadami — ulanish so'rovi.",den:"Step 1 of the normal TCP handshake — a connection request."},
    {col:AM,uz:"Target → Attacker — SYN-ACK qaytaradi",en:"Target → Attacker — replies with SYN-ACK",duz:"Bu javob PORT OCHIQ ekanini bildiradi — xizmat ulanishga tayyor.",den:"This reply means the PORT IS OPEN — the service is ready to accept a connection."},
    {col:AM,uz:"Attacker → Target — ACK O'RNIGA RST yuboradi",en:"Attacker → Target — sends RST INSTEAD OF an ACK",duz:"Nmap ulanishni ATAYLAB yakunlamaydi — shuning uchun «yarim ochiq» (half-open) skan deyiladi.",den:"Nmap deliberately never completes the connection — that's why it's called a «half-open» scan."},
    {col:A,uz:"Natija: port OCHIQ — lekin TO'LIQ ulanish HECH QACHON o'rnatilmadi",en:"Result: the port is OPEN — but a FULL connection was NEVER established",duz:"Ko'p server ilovasi faqat TO'LIQ ulanishlarni logga yozadi — shuning uchun -sS «yashirinroq».",den:"Many server applications only log FULLY established connections — that's why -sS is «stealthier».",final:true}
  ];
  const CONNECT=[
    {col:BL,uz:"Attacker → Target:22 — SYN yuboriladi",en:"Attacker → Target:22 — a SYN is sent",duz:"Xuddi shu birinchi qadam.",den:"The exact same first step."},
    {col:AM,uz:"Target → Attacker — SYN-ACK qaytaradi",en:"Target → Attacker — replies with SYN-ACK",duz:"Port ochiq — xuddi avvalgi ssenariydek.",den:"The port is open — just like the previous scenario."},
    {col:AM,uz:"Attacker → Target — ACK yuboradi (to'liq qo'l berish!)",en:"Attacker → Target — sends an ACK (a full handshake!)",duz:"connect() tizim chaqiruvi ishlatiladi — bu odatiy, to'liq TCP ulanish.",den:"The connect() system call is used — this is a normal, complete TCP connection."},
    {col:D,uz:"Natija: port OCHIQ — lekin TO'LIQ ulanish O'RNATILDI",en:"Result: the port is OPEN — but a FULL connection WAS established",duz:"Aksariyat server ilovasi buni oddiy mijoz sifatida LOGGA yozadi — kamroq yashirin.",den:"Most server applications log this as a normal client connection — much less stealthy.",final:true,attack:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="syn"?SYN:CONNECT;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),950);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="syn"?SYN:run==="connect"?CONNECT:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — SYN scan (-sS) va Connect scan (-sT) paket darajasida qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how a SYN scan (-sS) differs from a Connect scan (-sT) at the packet level.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="syn"?t(lang,"✓ -sS: yashirinroq — to'liq ulanish hech qachon yaratilmaydi","✓ -sS: stealthier — a full connection is never created"):t(lang,"⚠ -sT: aniqroq izlanadi — to'liq ulanish loglarda qoladi","⚠ -sT: leaves more of a trace — a full connection shows up in logs")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("syn");setStep(-1);},style:{flex:1,padding:"9px",background:run==="syn"?A+"22":SL2,color:run==="syn"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🥷 SYN scan (-sS)","🥷 SYN scan (-sS)")),
      React.createElement("button",{onClick:()=>{setRun("connect");setStep(-1);},style:{flex:1,padding:"9px",background:run==="connect"?D+"22":SL2,color:run==="connect"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔗 Connect scan (-sT)","🔗 Connect scan (-sT)"))));
}

function EnumSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const BAD=[
    {col:BL,uz:"nmap -sn: xost TIRIK — ICMP so'roviga javob beradi",en:"nmap -sn: host is ALIVE — replies to the ICMP probe",duz:"Birinchi qadam bajarildi — nishon mavjudligi tasdiqlandi.",den:"Step one done — the target's existence is confirmed."},
    {col:AM,uz:"nmap -sV: SSH banner ochiladi — «OpenSSH 7.2» (2016-yilgi, ZAIF)",en:"nmap -sV: the SSH banner is exposed — «OpenSSH 7.2» (from 2016, WEAK)",duz:"Aniq versiya ma'lum bo'lganda, unga mos ma'lum zaifliklarni (CVE) izlash mumkin.",den:"Once the exact version is known, known vulnerabilities (CVEs) for it can be looked up."},
    {col:AM,uz:"smbclient -L: «backups» ulashmasi READ/WRITE — anonim kirish mumkin",en:"smbclient -L: the «backups» share is READ/WRITE — anonymous access works",duz:"Parolsiz kirish mumkin bo'lgan ulashma — potensial maxfiy fayllar oshkor.",den:"A share reachable without a password — potentially sensitive files exposed."},
    {col:D,uz:"enum4linux: 15 ta foydalanuvchi nomi olindi (admin, backup, svc_sql...)",en:"enum4linux: 15 usernames were harvested (admin, backup, svc_sql...)",duz:"TO'LIQ profil tayyor: OS, versiya, ochiq ulashma, foydalanuvchi nomlari — keyingi hujum (brute-force, exploit) uchun yetarli.",den:"A COMPLETE profile is ready: OS, version, open share, usernames — enough for the next attack (brute-force, exploit).",final:true,attack:true}
  ];
  const GOOD=[
    {col:BL,uz:"nmap -sn: ICMP BLOKLANGAN — host discovery uchun port skan kerak",en:"nmap -sn: ICMP is BLOCKED — host discovery needs a port scan instead",duz:"Nishon ping so'roviga javob bermaydi — bu hujumchini sekinlatadi.",den:"The target doesn't reply to ping — this slows the attacker down."},
    {col:AM,uz:"nmap -sV: banner YASHIRINGAN — faqat «22/tcp open», versiya noma'lum",en:"nmap -sV: the banner is HIDDEN — only «22/tcp open», version unknown",duz:"Server sozlamalarida versiya matni o'chirilgan — CVE qidirish qiyinlashadi.",den:"The version string was disabled in the server config — makes CVE lookup harder."},
    {col:AM,uz:"smbclient -L: Access Denied — anonim SMB kirish O'CHIRILGAN",en:"smbclient -L: Access Denied — anonymous SMB access is DISABLED",duz:"Ulashmalarni ko'rish uchun ham autentifikatsiya talab qilinadi.",den:"Even listing shares now requires authentication."},
    {col:A,uz:"enum4linux: hech qanday foydalanuvchi ro'yxati olinmadi",en:"enum4linux: no user list could be retrieved at all",duz:"Profil DEYARLI BO'SH — hujumchi keyingi qadam uchun deyarli hech narsa bilmaydi.",den:"The profile is NEARLY EMPTY — the attacker knows almost nothing to act on.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="bad"?BAD:GOOD;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="bad"?BAD:run==="good"?GOOD:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu vositalar yomon sozlangan va qattiqlashtirilgan tizimda qancha ma'lumot ochib berishini solishtiring.","⬇ Pick a scenario — see how much the same tools reveal against a poorly configured versus a hardened system.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="bad"?t(lang,"✗ To'liq profil oshkor bo'ldi — keyingi hujum uchun tayyor","✗ A full profile was exposed — ready for the next attack"):t(lang,"✓ Deyarli hech narsa oshkor bo'lmadi — qattiqlashtirish ishladi","✓ Almost nothing was exposed — hardening worked")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("bad");setStep(-1);},style:{flex:1,padding:"9px",background:run==="bad"?D+"22":SL2,color:run==="bad"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 Yomon sozlangan tizim","🔓 Poorly configured system")),
      React.createElement("button",{onClick:()=>{setRun("good");setStep(-1);},style:{flex:1,padding:"9px",background:run==="good"?A+"22":SL2,color:run==="good"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 Qattiqlashtirilgan tizim","🔒 Hardened system"))));
}

function ARPSpoofSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",SL2="#0f172a";
  const NO_DEF=[
    {col:AM,uz:"Hujumchi soxta ARP javobini yuboradi: «10.0.0.1 (gateway) — bu MEN!»",en:"The attacker sends a fake ARP reply: «10.0.0.1 (gateway) — that's ME!»",duz:"ARP javobni hech kim tekshirmaydi (L06) — bu paket haqiqiy router javobidan farqlanmaydi.",den:"No one verifies an ARP reply (L06) — this packet is indistinguishable from a real router reply.",tbl:"attacker"},
    {col:D,uz:"Qurbon ARP jadvali: gateway yozuvi ZAHARLANDI",en:"Victim's ARP table: the gateway entry is POISONED",duz:"Eski to'g'ri MAC hujumchi MAC'i bilan almashtirildi — jadval endi noto'g'ri.",den:"The correct old MAC has been overwritten with the attacker's MAC — the table is now wrong.",tbl:"attacker"},
    {col:D,uz:"Qurbonning BARCHA trafigi endi hujumchi orqali oqadi",en:"ALL of the victim's traffic now flows through the attacker",duz:"Bu — to'liq MITM holati (L25 darsida davomi).",den:"This is a full MITM position (continued in L25).",tbl:"attacker"},
    {col:D,uz:"Hujum MUVAFFAQIYATLI — hujumchi trafikni o'qiy/o'zgartira oladi",en:"Attack SUCCEEDED — the attacker can read/modify the traffic",duz:"Himoya bo'lmagani uchun soxta ARP hech qanday to'siqsiz qabul qilindi.",den:"With no defense, the fake ARP was accepted without any obstacle.",final:true,attack:true,tbl:"attacker"}
  ];
  const DAI=[
    {col:AM,uz:"Hujumchi soxta ARP javobini yuboradi: «10.0.0.1 — bu MEN!»",en:"The attacker sends a fake ARP reply: «10.0.0.1 — that's ME!»",duz:"Xuddi avvalgi hujum urinishi — lekin bu safar switch'da DAI yoqilgan.",den:"The same attack attempt — but this time the switch has DAI enabled.",tbl:"real"},
    {col:"#3b82f6",uz:"Switch (DAI): javobni DHCP Snooping jadvali bilan solishtiradi",en:"Switch (DAI): checks the reply against the DHCP Snooping table",duz:"DAI har IP↔MAC juftligining ishonchli manbadan (DHCP) kelganini biladi.",den:"DAI knows which IP↔MAC pairing came from a trusted source (DHCP).",tbl:"real"},
    {col:AM,uz:"Nomuvofiqlik topildi — bu MAC 10.0.0.1 uchun ro'yxatda yo'q",en:"Mismatch found — this MAC isn't on record for 10.0.0.1",duz:"Hujumchi MAC'i DHCP orqali hech qachon 10.0.0.1 ga berilmagan.",den:"The attacker's MAC was never assigned to 10.0.0.1 via DHCP.",tbl:"real"},
    {col:A,uz:"Soxta ARP paketi TASHLANDI — qurbon jadvali toza qoladi",en:"The fake ARP packet is DROPPED — the victim's table stays clean",duz:"Hujum MUVAFFAQIYATSIZ — DAI soxta javobni chekka portda blokladi.",den:"Attack FAILED — DAI blocked the fake reply right at the edge port.",final:true,tbl:"real"}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="no"?NO_DEF:DAI;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="no"?NO_DEF:run==="dai"?DAI:null;
  const cur=list&&step>=0?list[step]:null;
  const tblState=cur?cur.tbl:"real";
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{background:SL2,border:"1px solid "+(tblState==="attacker"?D:"rgba(148,163,184,.25)"),borderRadius:12,padding:"10px 12px",marginBottom:12,transition:"all .3s"}},
      React.createElement("div",{style:{fontSize:10.5,fontWeight:700,color:"#94a3b8",marginBottom:6,fontFamily:"var(--font-mono)"}},t(lang,"Qurbonning ARP jadvali","The victim's ARP table")),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,padding:"7px 10px",background:tblState==="attacker"?D+"1f":A+"14",border:"1px solid "+(tblState==="attacker"?D:A),borderRadius:8}},
        React.createElement("span",{style:{fontSize:11,fontFamily:"var(--font-mono)",color:"#cbd5e1"}},"10.0.0.1 (gateway)"),
        React.createElement("span",{style:{fontSize:11,fontFamily:"var(--font-mono)",fontWeight:700,color:tblState==="attacker"?D:A}},tblState==="attacker"?"08:00:27:AA:BB:CC 🥷":"00:11:22:33:44:55 ✓"))),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — himoyasiz va DAI yoqilgan switch'da hujum natijasi qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the attack's outcome differs on an undefended switch versus one with DAI enabled.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="no"?t(lang,"✗ Himoyasiz tarmoq — ARP spoofing muvaffaqiyatli","✗ Undefended network — ARP spoofing succeeded"):t(lang,"✓ DAI hujumni chekka portda to'xtatdi","✓ DAI stopped the attack right at the edge port")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("no");setStep(-1);},style:{flex:1,padding:"9px",background:run==="no"?D+"22":SL2,color:run==="no"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🥷 Himoyasiz tarmoq","🥷 Undefended network")),
      React.createElement("button",{onClick:()=>{setRun("dai");setStep(-1);},style:{flex:1,padding:"9px",background:run==="dai"?A+"22":SL2,color:run==="dai"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🛡 DAI yoqilgan","🛡 DAI enabled"))));
}

function MITMSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const PASSIVE=[
    {col:BL,uz:"Client → Server: login so'rovi yuboriladi",en:"Client → Server: a login request is sent",duz:"Hujumchi allaqachon o'rtada (masalan ARP spoofing orqali, L24).",den:"The attacker is already in the middle (e.g. via ARP spoofing, L24)."},
    {col:AM,uz:"Hujumchi: nusxasini o'qiydi, LEKIN o'zgartirmasdan uzatadi",en:"Attacker: reads a copy, but forwards it UNCHANGED",duz:"Faqat kuzatib turadi — login/parolni yozib oladi, lekin paketning o'ziga tegmaydi.",den:"Just observing — logs the login/password, but doesn't touch the packet itself."},
    {col:AM,uz:"Server → Client: original javob to'siqsiz yetib boradi",en:"Server → Client: the original reply arrives unobstructed",duz:"Foydalanuvchi hech qanday g'alati narsa sezmaydi — hammasi normal ishlayotgandek ko'rinadi.",den:"The user notices nothing odd — everything appears to work normally."},
    {col:D,uz:"👁 Faqat josuslik — foydalanuvchi bilmagan holda ma'lumot o'g'irlandi",en:"👁 Pure espionage — data was stolen without the user ever knowing",duz:"Passiv MITM aniqlash eng qiyin turlardan biri, chunki hech narsa o'zgarmaydi.",den:"Passive MITM is one of the hardest to detect, because nothing ever changes.",final:true,attack:true}
  ];
  const ACTIVE=[
    {col:BL,uz:"Client → Server: update.exe faylini yuklab olish so'rovi",en:"Client → Server: a request to download update.exe",duz:"Foydalanuvchi haqiqiy, ishonchli dasturni yuklab olmoqchi.",den:"The user is trying to download a genuine, trusted program."},
    {col:AM,uz:"Hujumchi: serverning javobini USHLAYDI",en:"Attacker: INTERCEPTS the server's response",duz:"Bu safar hujumchi shunchaki o'qib qo'ymaydi — paketni to'liq nazorat qiladi.",den:"This time the attacker doesn't just read it — they take full control of the packet."},
    {col:D,uz:"Hujumchi: asl faylni ZARARLI fayl bilan ALMASHTIRADI",en:"Attacker: REPLACES the real file with a MALICIOUS one",duz:"Bu — «faol» (active) MITM: mazmunning o'zi in-transit o'zgartiriladi.",den:"This is «active» MITM: the content itself is modified in transit."},
    {col:D,uz:"☠ Client zararli update.exe ni yuklab oldi — buni HAQIQIY deb o'ylaydi",en:"☠ The client downloaded the malicious update.exe — believing it's GENUINE",duz:"Foydalanuvchi manba (server) ni tekshirgan, lekin yo'ldagi o'zgarishni sezmagan.",den:"The user verified the source (the server), but never noticed the tampering along the way.",final:true,attack:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="pass"?PASSIVE:ACTIVE;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="pass"?PASSIVE:run==="act"?ACTIVE:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{textAlign:"center",padding:"8px",marginBottom:10,background:SL2,border:"1px solid rgba(148,163,184,.25)",borderRadius:10,fontSize:11,fontWeight:700,color:"#94a3b8",fontFamily:"var(--font-mono)"}},t(lang,"💻 Client ⇄ 😈 Hujumchi (o'rtada) ⇄ 🖥 Server","💻 Client ⇄ 😈 Attacker (in the middle) ⇄ 🖥 Server")),
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — passiv (faqat tinglash) va faol (mazmunni o'zgartirish) MITM farqini ko'ring.","⬇ Pick a scenario — see the difference between passive (just listening) and active (tampering with content) MITM.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:D+"1f",border:"1px solid "+D,color:D}},
      run==="pass"?t(lang,"👁 Passiv MITM: ma'lumot o'g'irlandi, hech narsa o'zgarmadi","👁 Passive MITM: data stolen, nothing changed"):t(lang,"☠ Faol MITM: mazmunning o'zi almashtirildi","☠ Active MITM: the content itself was swapped")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("pass");setStep(-1);},style:{flex:1,padding:"9px",background:run==="pass"?AM+"22":SL2,color:run==="pass"?AM:"#cbd5e1",border:"1px solid "+AM+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"👁 Passiv (faqat tinglaydi)","👁 Passive (just listens)")),
      React.createElement("button",{onClick:()=>{setRun("act");setStep(-1);},style:{flex:1,padding:"9px",background:run==="act"?D+"22":SL2,color:run==="act"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ Faol (mazmunni o'zgartiradi)","☠ Active (tampers with content)"))));
}

function DNSSpoofSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const NOSEC=[
    {col:BL,uz:"Client → Resolver: \"bank.com ning IP manzili nima?\"",en:"Client → Resolver: \"What's the IP address of bank.com?\"",duz:"So'rov tarmoq orqali shifrlanmagan holda ketadi.",den:"The query travels over the network unencrypted."},
    {col:AM,uz:"Hujumchi: soxta javobni haqiqiy serverdan OLDIN yuboradi — \"IP=6.6.6.6\"",en:"Attacker: sends a forged reply BEFORE the real server — \"IP=6.6.6.6\"",duz:"G'olib bo'lish uchun faqat tezroq javob berish kifoya — imzo yoki tasdiq talab qilinmaydi.",den:"Winning the race only requires answering first — no signature or proof is required."},
    {col:AM,uz:"Resolver: imzo tekshiruvi yo'q — javobni tekshirmasdan qabul qiladi",en:"Resolver: no signature check — accepts the reply without verifying it",duz:"Resolver birinchi kelgan javobni «haqiqiy» deb hisoblaydi va keshlab qo'yadi.",den:"The resolver treats the first reply that arrives as «real» and caches it."},
    {col:D,uz:"🎣 Client soxta saytga ulanadi va login/parolni kiritadi",en:"🎣 Client connects to the fake site and enters login/password",duz:"Manzil satrida hali ham «bank.com» yozilgan — foydalanuvchi shubhalanmaydi.",den:"The address bar still shows «bank.com» — the user has no reason to suspect anything.",final:true,attack:true}
  ];
  const SEC=[
    {col:BL,uz:"Client → Resolver: \"bank.com IP si?\" (DNSSEC so'ralgan, DO bit)",en:"Client → Resolver: \"IP of bank.com?\" (DNSSEC requested, DO bit)",duz:"So'rovda «imzolangan javob kerak» belgisi ham yuboriladi.",den:"The query also carries a flag saying «a signed reply is required»."},
    {col:AM,uz:"Hujumchi: xuddi shu soxta javobni yuboradi — \"IP=6.6.6.6\" (imzosiz)",en:"Attacker: sends the same forged reply — \"IP=6.6.6.6\" (unsigned)",duz:"Hujumchi haqiqiy zonaning maxfiy kalitiga ega emas — imzo qo'ya olmaydi.",den:"The attacker doesn't have the real zone's private key — they can't forge a valid signature."},
    {col:AM,uz:"Resolver: RRSIG imzosini zonaning ochiq kaliti bilan tekshiradi — MOS KELMAYDI",en:"Resolver: checks the RRSIG signature against the zone's public key — DOESN'T MATCH",duz:"Kriptografik tekshiruv — tezlik emas, matematik dalil hal qiladi.",den:"A cryptographic check — not speed, but mathematical proof decides."},
    {col:A,uz:"🛡 Resolver soxta javobni RAD etadi — faqat to'g'ri imzolangan javob qabul qilinadi",en:"🛡 Resolver REJECTS the forged reply — only a correctly signed reply is accepted",duz:"Client asl serverdan kelgan, to'g'ri imzolangan javobni kutib oladi.",den:"The client waits for and receives the correctly signed reply from the real server.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="off"?NOSEC:SEC;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="off"?NOSEC:run==="on"?SEC:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu soxta javob ikki xil resolver'da qanday qabul qilinishini solishtiring.","⬇ Pick a scenario — compare how the same forged reply is handled by two different resolvers.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="off"?t(lang,"🎣 Soxta javob qabul qilindi — qurbon fishing sahifasiga tushdi","🎣 The forged reply was accepted — the victim landed on a phishing page"):t(lang,"🛡 Soxta javob rad etildi — DNSSEC imzoni tekshirib ushladi","🛡 The forged reply was rejected — DNSSEC caught it via signature check")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("off");setStep(-1);},style:{flex:1,padding:"9px",background:run==="off"?D+"22":SL2,color:run==="off"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 Oddiy DNS (DNSSEC yo'q)","🔓 Plain DNS (no DNSSEC)")),
      React.createElement("button",{onClick:()=>{setRun("on");setStep(-1);},style:{flex:1,padding:"9px",background:run==="on"?A+"22":SL2,color:run==="on"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 DNSSEC yoqilgan","🔒 DNSSEC enabled"))));
}

function DDoSSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const FLOOD=[
    {col:BL,uz:"Botnet: minglab bot bir vaqtda SYN so'rov yubora boshlaydi",en:"Botnet: thousands of bots start sending SYN requests simultaneously",duz:"Har bir bot o'zi zararlangan oddiy qurilma — egasi bexabar.",den:"Each bot is just an ordinary infected device — its owner has no idea."},
    {col:AM,uz:"Server: har bir SYN uchun yarim ochiq ulanish ochadi va navbatga qo'yadi",en:"Server: opens a half-open connection for every SYN and queues it",duz:"Server ACK javobini kutadi — lekin botlar javob bermaydi.",den:"The server waits for the ACK reply — but the bots never answer."},
    {col:AM,uz:"Ulanishlar navbati TO'LDI — yangi so'rov uchun joy qolmadi",en:"The connection queue is FULL — no room left for new requests",duz:"Server xotirasi/resurslari soxta yarim-ulanishlar bilan band bo'lib qoldi.",den:"The server's memory/resources are all tied up in fake half-connections."},
    {col:D,uz:"⛔ Haqiqiy mijoz ulana olmaydi — «Connection timed out»",en:"⛔ A real customer can't connect — «Connection timed out»",duz:"Xizmat ishlab turibdi, lekin hech kimga javob bera olmaydi — bu aynan DoS maqsadi.",den:"The service is running, but can't respond to anyone — that's exactly the DoS goal.",final:true,attack:true}
  ];
  const MITIG=[
    {col:BL,uz:"Botnet: xuddi shu minglab bot SYN toshqinini boshlaydi",en:"Botnet: the same thousands of bots start the SYN flood",duz:"Hujum hajmi bir xil — farq faqat serverning javob berish usulida.",den:"The attack volume is identical — the difference is only in how the server responds."},
    {col:AM,uz:"Server: holat saqlamaydi — o'rniga shifrlangan «SYN cookie» yuboradi",en:"Server: keeps no state — instead sends a cryptographic «SYN cookie»",duz:"Ulanish uchun xotira faqat ACK haqiqiy kelganda ajratiladi.",den:"Memory for the connection is only allocated once a genuine ACK arrives."},
    {col:AM,uz:"Botlar to'g'ri ACK qaytara olmaydi — chegarada rate-limit ortiqcha manbalarni kesadi",en:"Bots can't return a valid ACK — the edge rate-limit also cuts off excess sources",duz:"Soxta ulanishlar hech qachon to'liq ochilmaydi — server resursi band bo'lmaydi.",den:"The fake connections never fully open — the server's resources stay free."},
    {col:A,uz:"✅ Haqiqiy mijoz normal ulanadi — server resurslari band emas",en:"✅ A real customer connects normally — the server's resources are free",duz:"SYN cookie + rate-limit + CDN filtri toshqinni chegarada to'xtatadi.",den:"SYN cookies + rate-limiting + a CDN filter stop the flood at the edge.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="raw"?FLOOD:MITIG;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="raw"?FLOOD:run==="safe"?MITIG:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu SYN toshqini himoyasiz va himoyalangan serverda qanday tugashini solishtiring.","⬇ Pick a scenario — compare how the same SYN flood ends against an unprotected versus a protected server.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.attack?D:A)+"1f",border:"1px solid "+(cur.attack?D:A),color:cur.attack?D:A}},
      run==="raw"?t(lang,"⛔ Xizmat ishdan chiqdi — resurslar soxta ulanishlar bilan tugadi","⛔ The service went down — resources exhausted by fake connections"):t(lang,"🛡 Xizmat ishlashda davom etdi — toshqin chegarada so'ndirildi","🛡 The service kept running — the flood was absorbed at the edge")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("raw");setStep(-1);},style:{flex:1,padding:"9px",background:run==="raw"?D+"22":SL2,color:run==="raw"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🌊 Himoyasiz server","🌊 Unprotected server")),
      React.createElement("button",{onClick:()=>{setRun("safe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="safe"?A+"22":SL2,color:run==="safe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🛡 SYN cookie + rate-limit","🛡 SYN cookies + rate-limit"))));
}

function WiresharkSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const RAW=[
    {col:BL,uz:"Capture boshlandi — eth0 interfeysida barcha trafik yozib olinmoqda",en:"Capture started — all traffic on eth0 is being recorded",duz:"Hech qanday cheklov yo'q — TCP, UDP, ARP, broadcast, hammasi tushadi.",den:"No restriction at all — TCP, UDP, ARP, broadcast, everything comes in."},
    {col:AM,uz:"2 daqiqada 14 000+ aralash paket yig'ildi",en:"In 2 minutes, 14,000+ mixed packets piled up",duz:"DNS so'rovlar, brauzer fon trafigi, keraksiz broadcast — barchasi bir ro'yxatda.",den:"DNS queries, browser background chatter, useless broadcasts — all in one list."},
    {col:AM,uz:"Filtr qo'llanilmadi — tahlilchi har birini qo'lda ko'rib chiqishga majbur",en:"No filter applied — the analyst must scroll through each one by hand",duz:"Kerakli POST so'rov qaysi qatorda ekani noma'lum.",den:"Which row holds the POST request you need is unknown."},
    {col:D,uz:"🌊 20+ daqiqadan keyin ham kerakli so'rov topilmadi — signal shovqinda cho'kib ketdi",en:"🌊 Even after 20+ minutes the request wasn't found — the signal drowned in noise",duz:"Vaqt ketdi, natija yo'q — bu filtrsiz tahlilning odatiy holati.",den:"Time spent, no result — the usual fate of unfiltered analysis.",final:true,bad:true}
  ];
  const FILT=[
    {col:BL,uz:"Capture boshlandi — xuddi shu 14 000+ paket yig'ilmoqda",en:"Capture started — the same 14,000+ packets are piling up",duz:"Trafik hajmi bir xil — farq faqat keyingi qadamda.",den:"The traffic volume is identical — the difference is only in the next step."},
    {col:AM,uz:"Display filtr qo'llanildi:  http.request.method==\"POST\"",en:"A display filter is applied:  http.request.method==\"POST\"",duz:"Faqat aynan shu shartga mos paketlar qoldiriladi.",den:"Only packets matching this exact condition are kept."},
    {col:AM,uz:"Wireshark ro'yxatni darhol 14 000 tadan 3 taga qisqartiradi",en:"Wireshark instantly narrows the list from 14,000 down to 3",duz:"Qolgan minglab paket ko'rinishdan yashirildi, o'chirilmadi.",den:"The remaining thousands are hidden from view, not deleted."},
    {col:A,uz:"🎯 3 soniyada topildi — Follow Stream orqali login/parol ochiq ko'rinadi",en:"🎯 Found in 3 seconds — Follow Stream reveals the login/password in the clear",duz:"To'g'ri filtr — soatlab qidiruvni soniyalarga tushiradi.",den:"The right filter turns an hours-long search into seconds.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="raw"?RAW:FILT;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="raw"?RAW:run==="filt"?FILT:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu 14 000 paket ichidan kerakli POST so'rovni filtrsiz va filtr bilan qidiring.","⬇ Pick a scenario — search the same 14,000 packets for the POST request, with and without a filter.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="raw"?t(lang,"✗ Filtrsiz: 14 000 paket ichida qo'lda qidiruv — samarasiz","✗ Unfiltered: a manual search through 14,000 packets — ineffective"):t(lang,"✓ Filtr bilan: to'g'ri so'rov soniyalarda topildi","✓ Filtered: the right request found in seconds")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("raw");setStep(-1);},style:{flex:1,padding:"9px",background:run==="raw"?D+"22":SL2,color:run==="raw"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🌊 Filtrsiz qidirish","🌊 Search unfiltered")),
      React.createElement("button",{onClick:()=>{setRun("filt");setStep(-1);},style:{flex:1,padding:"9px",background:run==="filt"?A+"22":SL2,color:run==="filt"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🎯 Filtr bilan qidirish","🎯 Search with a filter"))));
}

function WirelessCrackSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const WEAK=[
    {col:BL,uz:"Handshake ushlandi — WPA2 4-tomonlama qo'l siqish yozib olindi",en:"Handshake captured — the WPA2 4-way handshake is recorded",duz:"Ikkala ssenariyda ham bu qadam bir xil — farq keyingi bosqichda.",den:"This step is identical in both scenarios — the difference is in what comes next."},
    {col:AM,uz:"Nishon parol: «parol123» — mashhur lug'atlarda mavjud",en:"Target password: «parol123» — already sits in common wordlists",duz:"Millionlab odam xuddi shunga o'xshash oddiy parol tanlaydi.",den:"Millions of people pick a similarly simple password."},
    {col:AM,uz:"aircrack-ng lug'at hujumini boshlaydi — soniyasiga minglab urinish",en:"aircrack-ng starts the dictionary attack — thousands of tries per second",duz:"Har bir urinish handshake bilan solishtiriladi — mos kelguncha davom etadi.",den:"Each guess is checked against the handshake — it keeps going until one matches."},
    {col:D,uz:"🔓 8 soniyada topildi — «parol123» deyarli bir zumda ochildi",en:"🔓 Found in 8 seconds — «parol123» cracked almost instantly",duz:"Kuchli shifrlash (WPA2) ham zaif parolni qutqara olmaydi.",den:"Even strong encryption (WPA2) can't save a weak password.",final:true,bad:true}
  ];
  const STRONG=[
    {col:BL,uz:"Handshake ushlandi — WPA2 4-tomonlama qo'l siqish yozib olindi",en:"Handshake captured — the WPA2 4-way handshake is recorded",duz:"Hujumchi uchun bu qadam xuddi avvalgidek oson.",den:"This step is just as easy for the attacker as before."},
    {col:AM,uz:"Nishon parol: 18 belgili tasodifiy parol (harf+raqam+belgi)",en:"Target password: an 18-character random password (letters+digits+symbols)",duz:"Hech qanday lug'atda yo'q — faqat tasodifiy tanlash orqali topish mumkin.",den:"It's in no wordlist — the only way to find it is pure random guessing."},
    {col:AM,uz:"aircrack-ng xuddi shu tezlikda urinadi — lekin variantlar soni astronomik",en:"aircrack-ng tries at the same speed — but the number of possibilities is astronomical",duz:"18 belgili tasodifiy parolning kombinatsiyasi kvadrilliondan ham ko'p.",den:"An 18-character random password has combinations numbering in the quadrillions and beyond."},
    {col:A,uz:"🔒 Millionlab yillar kerak bo'ladi — amalda buzib bo'lmaydi",en:"🔒 Would take millions of years — practically uncrackable",duz:"Handshake ushlangan bo'lsa ham, parolning o'zi asosiy himoya bo'lib qoladi.",den:"Even with the handshake captured, the password itself remains the real line of defense.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="weak"?WEAK:STRONG;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="weak"?WEAK:run==="strong"?STRONG:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu ushlangan handshake zaif va kuchli parolda qanday farqli tugashini ko'ring.","⬇ Pick a scenario — see how the same captured handshake ends very differently for a weak versus a strong password.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="weak"?t(lang,"✗ Zaif parol: handshake + lug'at = soniyalarda ochilish","✗ Weak password: handshake + wordlist = cracked in seconds"):t(lang,"✓ Kuchli parol: handshake ushlansa ham parol amalda buzilmaydi","✓ Strong password: even with the handshake, it's practically uncrackable")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("weak");setStep(-1);},style:{flex:1,padding:"9px",background:run==="weak"?D+"22":SL2,color:run==="weak"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 Zaif parol","🔓 Weak password")),
      React.createElement("button",{onClick:()=>{setRun("strong");setStep(-1);},style:{flex:1,padding:"9px",background:run==="strong"?A+"22":SL2,color:run==="strong"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 Kuchli parol","🔒 Strong password"))));
}

function LessonL01(){
  const lang=useLang();
  const layers=[
    {n:7,name:"Application",uz:"Ilova",proto:"HTTP · FTP · SMTP · DNS",desc:{uz:"Foydalanuvchi ilovalari bilan bevosita ishlaydi.",en:"Works directly with user applications."},color:"#ff6b6b"},
    {n:6,name:"Presentation",uz:"Taqdimot",proto:"SSL/TLS · JPEG · MP4",desc:{uz:"Ma'lumotni formatlash, shifrlash va siqish.",en:"Formats, encrypts and compresses data."},color:"#ffa94d"},
    {n:5,name:"Session",uz:"Sessiya",proto:"NetBIOS · RPC · SQL",desc:{uz:"Ulanishni o'rnatish, boshqarish va tugatish.",en:"Sets up, manages and ends connections."},color:"#ffd43b"},
    {n:4,name:"Transport",uz:"Transport",proto:"TCP · UDP",desc:{uz:"End-to-end ulanish, portlar, oqim nazorati.",en:"End-to-end delivery, ports, flow control."},color:"#69db7c"},
    {n:3,name:"Network",uz:"Tarmoq",proto:"IP · ICMP · OSPF · BGP",desc:{uz:"IP manzillash va paketlarni yo'naltirish.",en:"IP addressing and packet routing."},color:"#4dabf7"},
    {n:2,name:"Data Link",uz:"Ma'lumot havolasi",proto:"Ethernet · WiFi · ARP",desc:{uz:"MAC manzillash va kadrlar (frames).",en:"MAC addressing and frames."},color:"#9775fa"},
    {n:1,name:"Physical",uz:"Fizik",proto:"Kabel · Optik · Radio",desc:{uz:"Bitlarni fizik signal sifatida uzatish.",en:"Transmits bits as physical signals."},color:"#f783ac"},
  ];
  const words=["All ","People ","Seem ","To ","Need ","Data ","Processing"];
  const wcol=["#ff6b6b","#ffa94d","#ffd43b","#69db7c","#4dabf7","#9775fa","#ff6b6b"];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"OSI modeli nima?","What is the OSI Model?")),
    React.createElement(P,null,t(lang,"OSI (Open Systems Interconnection) modeli — tarmoq aloqasini 7 ta mantiqiy qatlamga bo'lib tushuntiruvchi konseptual freymvork. ISO tomonidan 1984-yilda turli ishlab chiqaruvchilar va protokollarni standartlashtirish uchun yaratilgan.","The OSI (Open Systems Interconnection) model is a conceptual framework that splits network communication into 7 logical layers. Created by ISO in 1984 to standardize different vendors and protocols.")),
    React.createElement(InfoBox,{color:"var(--accent)"},
      t(lang,"Eslab qolish uchun (7→1):","Mnemonic to remember (7→1):"),React.createElement("br",null),
      words.map(function(w,i){return React.createElement("span",{key:i,style:{color:wcol[i],fontWeight:800}},w);})),
    React.createElement(H2,{num:"§2"},t(lang,"7 ta qatlam","The 7 Layers")),
    React.createElement(LayerStack,{layers:layers}),
    React.createElement(H2,{num:"§3"},t(lang,"Ma'lumot qanday harakatlanadi?","How does data travel?")),
    React.createElement(P,null,t(lang,"Yuboruvchida ma'lumot 7→1 qatlamga tushib, har qatlamda sarlavha (header) qo'shiladi — encapsulation. Qabul qiluvchida 1→7 ga chiqib, har sarlavha olib tashlanadi — decapsulation. \"Ishga tushir\" ni bosib kuzating:","On the sender, data goes 7→1, each layer adding a header — encapsulation. On the receiver it goes 1→7, each header removed — decapsulation. Press Play to watch:")),
    React.createElement(FlowSteps,{title:{uz:"Encapsulation — yuboruvchi (7→1)",en:"Encapsulation — sender (7→1)"},steps:[
      {icon:"📄",text:{uz:"7 Application — ma'lumot yaratiladi",en:"7 Application — data is created"}},
      {icon:"🔌",text:{uz:"4 Transport — port + TCP/UDP sarlavha qo'shiladi",en:"4 Transport — port + TCP/UDP header added"}},
      {icon:"🌐",text:{uz:"3 Network — IP manzil sarlavhasi qo'shiladi",en:"3 Network — IP address header added"}},
      {icon:"🔗",text:{uz:"2 Data Link — MAC manzil (kadr) qo'shiladi",en:"2 Data Link — MAC address (frame) added"}},
      {icon:"📡",text:{uz:"1 Physical — bitlar kabel orqali uzatiladi",en:"1 Physical — bits sent over the cable"}},
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"TCP/IP vs OSI","TCP/IP vs OSI")),
    React.createElement(P,null,t(lang,"Amalda internet TCP/IP modelini ishlatadi — u OSI ning 7 qatlamini 4 qatlamga soddalashtirgan:","In practice the internet uses the TCP/IP model — it simplifies OSI's 7 layers into 4:")),
    React.createElement(CompareCols,{
      left:{title:"OSI · 7 qatlam",color:"#4dabf7",rows:["7 Application","6 Presentation","5 Session","4 Transport","3 Network","2 Data Link","1 Physical"]},
      right:{title:"TCP/IP · 4 qatlam",color:"#69db7c",rows:["4 Application → OSI 5,6,7","3 Transport → OSI 4","2 Internet → OSI 3","1 Network Access → OSI 1,2"]}}),
        React.createElement(H2,{num:"§5"},t(lang,"Qatlamlar amalda","The layers in practice")),
    React.createElement(P,null,t(lang,"Har bir qatlam alohida ishlaydi, lekin birga bir ma'lumot uzatadi. traceroute buyrug'i 3-qatlam (Network) marshrutini ko'rsatadi — paket manzilga yetguncha qancha router (hop) dan o'tishini. Bu OSI modelini «jonli» ko'rishning eng oson yo'li.","Each layer works separately, but together they carry one message. The traceroute command shows the layer-3 (Network) route — how many routers (hops) a packet passes to reach its destination. This is the easiest way to see the OSI model «live».")),
    React.createElement(Terminal,null,"traceroute google.com\n#  1  192.168.1.1     1.2 ms   ← 2/3-qatlam: mahalliy router\n#  2  10.20.0.1       8.5 ms   ← ISP shlyuzi\n#  3  72.14.exchange  12 ms\n#  4  google.com      15 ms    ← manzilga yetdi (7-qatlam ilova)"),
React.createElement(Quiz,{
      q:{uz:"OSI modelida IP manzillash va paketlarni yo'naltirish qaysi qatlamda bajariladi?",en:"In the OSI model, which layer handles IP addressing and packet routing?"},
      opts:[{uz:"7 — Application",en:"7 — Application"},{uz:"4 — Transport",en:"4 — Transport"},{uz:"3 — Network",en:"3 — Network"},{uz:"1 — Physical",en:"1 — Physical"}],
      correct:2,
      exp:{uz:"3-qatlam (Network) IP manzillash va marshrutlash bilan shug'ullanadi — IP, ICMP, OSPF shu yerda.",en:"Layer 3 (Network) handles IP addressing and routing — IP, ICMP and OSPF live here."}})
  );
}
function LessonL13(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Firewall nima?","What is a firewall?")),
    React.createElement(P,null,t(lang,"Firewall — tarmoq va tashqi olam o'rtasidagi «qorovul devor». Uni chegaradagi bojxona nazoratchisiga o'xshating: har bir o'tuvchi paketni oldindan yozilgan qoidalar ro'yxati bilan solishtiradi va faqat ruxsat berilganini o'tkazadi, qolganini bloklaydi. Firewall'siz tarmoq — darvozasi ochiq uy kabi.","A firewall is the «guard wall» between a network and the outside world. Think of it as a customs officer at a border: it compares every passing packet against a pre-written list of rules and lets through only what is allowed, blocking the rest. A network without a firewall is like a house with its gate wide open.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator","Interactive simulator")),
    React.createElement(P,null,t(lang,"Pastdan paket tanlang — firewall uni qoidalar ro'yxati bilan YUQORIDAN PASTGA solishtiradi va BIRINCHI mos qoidada to'xtaydi. O'sha qoida ALLOW bo'lsa — paket o'tadi, DENY bo'lsa — bloklanadi.","Pick a packet below — the firewall compares it against the rule list TOP TO BOTTOM and stops at the FIRST matching rule. If that rule is ALLOW the packet passes; if DENY it is blocked.")),
    React.createElement(FirewallSim),
    React.createElement(H2,{num:"§3"},t(lang,"Qoidalar qanday ishlaydi","How the rules work")),
    React.createElement(P,null,t(lang,"Firewall qoidalari TARTIBLI ro'yxat — yuqoridan pastga o'qiladi va birinchi mos kelgan qoida qo'llanadi, qolganlari tekshirilmaydi. Shu sababli TARTIB juda muhim: aniq qoidalar (masalan «22-portni bloklash») umumiy qoidalardan (masalan «hammani ruxsat») OLDIN turishi kerak. Ro'yxat oxirida deyarli har doim «standart: qolgan hammasini rad et» (default deny) turadi — bu «ruxsat berilmagan — taqiqlangan» tamoyili, eng xavfsiz yondashuv.","Firewall rules are an ORDERED list — read top to bottom, and the first matching rule is applied; the rest aren't checked. That's why ORDER matters a lot: specific rules (e.g. «block port 22») must come BEFORE general ones (e.g. «allow everyone»). At the end of the list there is almost always a «default: deny everything else» (default deny) — the «what isn't allowed is forbidden» principle, the safest approach.")),
    React.createElement(H2,{num:"§4"},t(lang,"Firewall turlari (4 ta)","Firewall types (4)")),
    React.createElement(P,null,t(lang,"Firewall'lar oddiy port filtridan aqlli, ilova-darajasidagi tizimlargacha to'rt bosqichda rivojlangan. Har yangi tur oldingisidan chuqurroq tekshiradi:","Firewalls have evolved through four stages, from a simple port filter to smart, application-aware systems. Each newer type inspects more deeply than the last:")),
    React.createElement(LayerStack,{layers:[
      {n:"1",name:t(lang,"Packet Filter","Packet Filter"),color:"#ff6b6b",desc:{uz:"IP va port bo'yicha filtrlaydi — ulanish holatini bilmaydi (stateless). Sodda va tez.",en:"Filters by IP and port — doesn't know connection state (stateless). Simple and fast."}},
      {n:"2",name:t(lang,"Stateful","Stateful"),color:"#69db7c",desc:{uz:"Ulanish holatini eslaydi — o'rnatilgan ulanish javobini avtomatik o'tkazadi (aqlliroq). Bugungi standart.",en:"Remembers connection state — auto-allows replies to established connections (smarter). Today's standard."}},
      {n:"3",name:t(lang,"Application / WAF","Application / WAF"),color:"#a855f7",desc:{uz:"Ilova mazmunini (L7) tekshiradi — DPI. WAF veb-hujumlarni (SQLi, XSS) to'sadi. Chuqur tekshiruv.",en:"Inspects application content (L7) — DPI. A WAF blocks web attacks (SQLi, XSS). Deep inspection."}},
      {n:"4",name:t(lang,"Next-Gen (NGFW)","Next-Gen (NGFW)"),color:"#ff9145",desc:{uz:"Hammasi birga: IPS + ilova nazorati + tahdid razvedkasi (threat intel). Eng zamonaviy.",en:"All in one: IPS + application control + threat intel. The most modern."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Stateful va stateless — farqi","Stateful vs stateless — the difference")),
    React.createElement(CompareCols,{
      left:{title:{uz:"Stateless (packet filter)",en:"Stateless (packet filter)"},color:"#ff6b6b",rows:[{uz:"Har paketni alohida ko'radi",en:"Sees each packet in isolation"},{uz:"Javob paketi uchun alohida qoida kerak",en:"Needs a separate rule for reply packets"},{uz:"Tez, lekin oson aldanadi",en:"Fast, but easier to trick"}]},
      right:{title:{uz:"Stateful",en:"Stateful"},color:"#22c55e",rows:[{uz:"Ulanish holatini kuzatadi",en:"Tracks connection state"},{uz:"«O'rnatilgan ulanish javobini o'tkaz» — bitta qoida",en:"«Allow replies to established» — one rule"},{uz:"Xavfsizroq, hozir standart",en:"Safer, now the standard"}]}}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: Linux firewall","Practice: the Linux firewall")),
    React.createElement(P,null,t(lang,"Linux'da ufw (sodda) yoki iptables/nftables (kuchli) firewall'ni boshqaradi. Quyida qoidalarni ko'rish va stateful qoida yozish namunasi:","On Linux, ufw (simple) or iptables/nftables (powerful) manages the firewall. Below is how to view rules and write a stateful rule:")),
    React.createElement(Terminal,null,"sudo ufw status numbered\n# [ 1] 80/tcp    ALLOW IN  Anywhere      ← Veb ruxsat\n# [ 2] 443/tcp   ALLOW IN  Anywhere\n# [ 3] 22/tcp    DENY IN   Anywhere      ← SSH taqiq\n\n# Stateful qoida (o'rnatilgan ulanish javobini o'tkaz):\nsudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A INPUT -j DROP        # ← default deny (oxirida)"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Firewall qoidalarini masofadan (SSH orqali) o'zgartirayotganda ehtiyot bo'ling — noto'g'ri «default deny» o'zingizni ham qulflab qo'yishi mumkin. Har doim ruxsat qoidangizni default deny'dan OLDIN qo'ying.","Be careful editing firewall rules remotely (over SSH) — a wrong «default deny» can lock you out too. Always place your allow rule BEFORE the default deny.")),
    React.createElement(Quiz,{q:{uz:"Firewall qoidalarni qanday tartibda tekshiradi?",en:"In what order does a firewall check rules?"},opts:[{uz:"Tasodifiy",en:"Randomly"},{uz:"Yuqoridan pastga, birinchi moslikda to'xtaydi",en:"Top-to-bottom, stops at first match"},{uz:"Pastdan yuqoriga",en:"Bottom-to-top"},{uz:"Alifbo bo'yicha",en:"Alphabetically"}],correct:1,exp:{uz:"Firewall qoidalarni yuqoridan pastga tekshiradi va birinchi mos qoidada to'xtaydi — shu sababli aniq ALLOW/DENY qoidalari umumiy default deny'dan oldin turishi kerak.",en:"A firewall checks rules top-to-bottom and stops at the first match — so specific ALLOW/DENY rules must precede the general default deny."}}));
}
function LessonL22(){
  const lang=useLang();
  const scans=[["-sS","TCP SYN",{uz:"Yarim ochiq — tez, yashirinroq (root)",en:"Half-open — fast, stealthier (root)"},"#69db7c"],["-sV","Version",{uz:"Xizmat va versiyani aniqlaydi",en:"Detects service and version"},"#4dabf7"],["-O","OS Detect",{uz:"Operatsion tizimni taxmin qiladi",en:"Fingerprints the OS"},"#9775fa"],["-sn","Ping Scan",{uz:"Faqat tirik xostlarni topadi",en:"Finds live hosts only"},"#ffd43b"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Port skanerlash nima?","What is port scanning?")),
    React.createElement(P,null,t(lang,"Port skanerlash — nishonda qaysi portlar ochiq va qaysi xizmatlar ishlayotganini aniqlash. Nmap — eng mashhur vosita. Bino oldidan aylanib, qaysi eshik-derazalar ochiq ekanini tekshirishga o'xshaydi.","Port scanning finds which ports are open and which services run on a target. Nmap is the most popular tool. It's like walking around a building to see which doors and windows are open.")),
    React.createElement(H2,{num:"§2"},t(lang,"Skan qanday ishlaydi","How a scan works")),
    React.createElement(FlowSteps,{color:"#ffd43b",title:{uz:"Nmap skan jarayoni",en:"Nmap scan process"},steps:[
      {icon:"📡",text:{uz:"Tirik xostlar aniqlanadi (host discovery)",en:"Live hosts are discovered (host discovery)"}},
      {icon:"🚪",text:{uz:"Har portga so'rov yuboriladi",en:"A probe is sent to each port"}},
      {icon:"🔎",text:{uz:"Javob → open / closed / filtered",en:"Response → open / closed / filtered"}},
      {icon:"🏷",text:{uz:"Ochiq portlarda xizmat + versiya aniqlanadi",en:"Service + version detected on open ports"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: SYN vs Connect scan","Interactive simulator: SYN vs Connect scan")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — xuddi shu ochiq portga qarshi ikki skan turi paket darajasida qanday farq qilishini va nega biri «yashirinroq» ekanini ko'ring:","Try both scenarios — see how two scan types differ at the packet level against the same open port, and why one is «stealthier»:")),
    React.createElement(ScanSim),
    React.createElement(H2,{num:"§4"},t(lang,"Foydali bayroqlar","Useful flags")),
    scans.map(function(s,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid "+s[3]+"44",borderLeft:"3px solid "+s[3],borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontWeight:700,color:s[3],fontSize:12,minWidth:44}},s[0]),
      React.createElement("span",{style:{fontSize:12,fontWeight:600,color:"var(--text-0)",minWidth:80}},s[1]),
      React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},t(lang,s[2].uz,s[2].en)));}),
    React.createElement(Terminal,null,"sudo nmap -sS -sV -T4 10.0.0.5   # SYN + versiya (root kerak)\nnmap -sT 10.0.0.5                 # Connect scan (root shart emas)\nnmap -sn 10.0.0.0/24              # tirik xostlar\nnmap -p- 10.0.0.5                 # barcha 65535 port"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Port skanerlashni faqat o'zingizga tegishli yoki yozma ruxsat berilgan tizimlarda o'tkazing. Ruxsatsiz skanerlash ko'p mamlakatda qonunga zid.","Only scan systems you own or are authorized (in writing) to test. Unauthorized scanning is illegal in many countries.")),
    React.createElement(H2,{num:"§5"},t(lang,"Port holatlari","Port states")),
    React.createElement(LayerStack,{layers:[
      {n:"open",name:"open",color:"#69db7c",desc:{uz:"Xizmat javob beradi (SYN-ACK) — hujum yuzasi.",en:"A service answers (SYN-ACK) — attack surface."}},
      {n:"closed",name:"closed",color:"#ffd43b",desc:{uz:"Port yopiq (RST qaytaradi), lekin xost tirik.",en:"Port closed (returns RST), but the host is alive."}},
      {n:"filtered",name:"filtered",color:"#ff6b6b",desc:{uz:"Firewall to'sib qo'ygan — hech qanday javob yo'q.",en:"A firewall blocks it — no reply at all."}}
    ]}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: to'liq natijani o'qish","Practice: reading a full result")),
    React.createElement(P,null,t(lang,"nmap -sS «yarim ochiq» skan qiladi — bu simulyatordagi aynan birinchi ssenariy. -sV har portning xizmat versiyasini aniqlaydi.","nmap -sS does a «half-open» scan — exactly the first scenario in the simulator. -sV identifies each port's service version.")),
    React.createElement(Terminal,null,"sudo nmap -sS -sV -T4 10.0.0.5\n# PORT     STATE    SERVICE VERSION\n# 22/tcp   open     ssh     OpenSSH 8.2\n# 80/tcp   open     http    nginx 1.18.0\n# 3306/tcp filtered  mysql  ← firewall to'sgan"),
React.createElement(Quiz,{q:{uz:"Nmap -sV bayrog'i nima qiladi?",en:"What does the Nmap -sV flag do?"},opts:[{uz:"Faqat ping yuboradi",en:"Only pings"},{uz:"Ochiq portdagi xizmat va versiyani aniqlaydi",en:"Detects the service and version on an open port"},{uz:"Faylni o'chiradi",en:"Deletes a file"},{uz:"VPN yoqadi",en:"Enables a VPN"}],correct:1,exp:{uz:"-sV ochiq port ortidagi xizmat va uning aniq versiyasini aniqlaydi — bu ma'lum zaifliklarni izlash uchun asos.",en:"-sV detects the service and its exact version behind an open port — a basis for finding known vulnerabilities."}}));
}
function ComingSoon({lesson}){
  const lang=useLang();
  return React.createElement("div",{style:{textAlign:"center",padding:"60px 20px",color:"var(--text-3)"}},
    React.createElement("div",{style:{fontSize:48,marginBottom:16}},"🔧"),
    React.createElement("div",{style:{fontFamily:"var(--font-display)",fontSize:20,fontWeight:700,color:"var(--text-1)",marginBottom:8}},
      t(lang,"Tez kunda","Coming Soon")),
    React.createElement("div",{style:{fontSize:13,color:"var(--text-2)"}},
      lesson?.uz||lesson?.en||"")
  );
}

// ── TopNav ────────────────────────────────────────────────────
function TopNav({setRoute,user,onOpenProfile,onOpenAI}){
  const lang=useLang();
  return React.createElement("nav",{style:{position:"sticky",top:0,zIndex:100,height:60,background:"rgba(4,6,13,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",padding:"0 24px",gap:12}},
    React.createElement("button",{onClick:()=>setRoute("dashboard"),style:{appearance:"none",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:"var(--accent)",fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700,letterSpacing:1,padding:0}},
      React.createElement(Icon,{name:"network",size:16}),
      "NETWORK ACADEMY"
    ),
    React.createElement("div",{style:{flex:1}}),
    user&&React.createElement("button",{onClick:onOpenProfile,style:{appearance:"none",background:"var(--accent-soft)",border:"1px solid var(--accent-border)",borderRadius:8,cursor:"pointer",padding:"6px 12px",fontFamily:"var(--font-mono)",fontSize:10,color:"var(--accent)",fontWeight:700}},
      user.name?.slice(0,2).toUpperCase()||"NA"
    ),
    React.createElement("button",{onClick:onOpenAI,style:{appearance:"none",background:"none",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",padding:"6px 10px",color:"var(--text-2)",fontSize:13,display:"flex",alignItems:"center",gap:4}},
      React.createElement(Icon,{name:"spark",size:13})," AI"
    )
  );
}

// ── Landing Screen ────────────────────────────────────────────
function LandingScreen({setRoute}){
  const lang=useLang();
  return React.createElement("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}},
    React.createElement("div",{style:{maxWidth:600}},
      React.createElement("div",{style:{width:72,height:72,borderRadius:20,background:"var(--accent-soft)",border:"1px solid var(--accent-border)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 32px var(--accent-glow)"}},
        React.createElement(Icon,{name:"network",size:32,style:{color:"var(--accent)"}})
      ),
      React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",letterSpacing:3,marginBottom:12}},
        "NETWORK ACADEMY v1.0"
      ),
      React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(28px,5vw,48px)",fontWeight:900,margin:"0 0 16px",lineHeight:1.15}},
        t(lang,"Tarmoq Xavfsizligini","Network Security"),
        React.createElement("br",null),
        React.createElement("span",{style:{background:"linear-gradient(135deg,var(--accent),#4d8bff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}},
          t(lang,"O'rganing","Mastered")
        )
      ),
      React.createElement("p",{style:{fontSize:15,color:"var(--text-2)",marginBottom:32,lineHeight:1.7}},
        t(lang,
          "OSI modelidan tarmoq hujumlarigacha — 30 ta dars, amaliy laboratoriyalar va AI muallim bilan professional darajaga yetishing.",
          "From OSI model to network attacks — 30 lessons, hands-on labs and AI tutor to reach professional level."
        )
      ),
      React.createElement("div",{style:{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}},
        React.createElement("button",{
          onClick:()=>setRoute("dashboard"),
          style:{padding:"14px 32px",borderRadius:12,cursor:"pointer",appearance:"none",background:"var(--accent)",border:"none",color:"#04060d",fontFamily:"var(--font-display)",fontSize:15,fontWeight:700,boxShadow:"0 0 24px var(--accent-glow)"}
        },t(lang,"Boshlash →","Start →")),
        React.createElement("a",{
          href:"../index.html",
          style:{padding:"14px 24px",borderRadius:12,cursor:"pointer",appearance:"none",background:"transparent",border:"1px solid var(--border)",color:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:6}
        },React.createElement(Icon,{name:"layers",size:13})," Windows Academy")
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:48}},
        [{icon:"network",n:"30",uz:"Dars",en:"Lessons"},{icon:"cpu",n:"3",uz:"Bo'lim",en:"Sections"},{icon:"star",n:"∞",uz:"XP",en:"XP"}].map((s,i)=>
          React.createElement("div",{key:i,style:{padding:16,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12}},
            React.createElement(Icon,{name:s.icon,size:20,style:{color:"var(--accent)",display:"block",margin:"0 auto 8px"}}),
            React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:18,fontWeight:900,color:"var(--text-0)"}},s.n),
            React.createElement("div",{style:{fontSize:11,color:"var(--text-3)"}},t(lang,s.uz,s.en))
          )
        )
      )
    )
  );
}

// ── Dashboard Screen ──────────────────────────────────────────
function DashboardScreen({setRoute,user}){
  const lang=useLang();
  const completed=user?.completedLessons||[];
  return React.createElement("div",{style:{maxWidth:900,margin:"0 auto",padding:"24px 16px"}},
    React.createElement("div",{style:{marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between"}},
      React.createElement("div",null,
        React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontSize:24,fontWeight:800,margin:0}},
          t(lang,"Kurslar","Courses")),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-2)",marginTop:4,fontFamily:"var(--font-mono)"}},
          completed.length,"/30 ",t(lang,"dars bajarildi","lessons completed")
        )
      ),
      React.createElement("div",{style:{textAlign:"right"}},
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-3)"}},"LVL "+xpToLevel(user?.xp||0)),
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:16,fontWeight:900,color:"var(--accent)"}},(user?.xp||0)+" XP")
      )
    ),
    Object.values(SECTIONS).map(sec=>React.createElement("div",{key:sec.num,
      onClick:()=>setRoute({name:"section",sec:parseInt(sec.num)}),
      style:{marginBottom:16,padding:20,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,cursor:"pointer",transition:"all 200ms"}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:10}},
        React.createElement("div",{style:{width:44,height:44,borderRadius:12,background:sec.color+"22",border:`1px solid ${sec.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
          React.createElement(Icon,{name:sec.icon,size:20,style:{color:sec.color}})
        ),
        React.createElement("div",null,
          React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:sec.color,fontWeight:700,letterSpacing:1}},
            "SEC "+sec.num),
          React.createElement("div",{style:{fontFamily:"var(--font-display)",fontSize:17,fontWeight:700,color:"var(--text-0)"}},
            t(lang,sec.uz,sec.en)
          )
        ),
        React.createElement("div",{style:{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-3)"}},
          sec.count+" "+t(lang,"dars","lessons"))
      ),
      React.createElement("p",{style:{fontSize:12.5,color:"var(--text-2)",margin:0,lineHeight:1.6}},
        t(lang,sec.descUz,sec.descEn))
    ))
  );
}

// ── Section Screen ─────────────────────────────────────────────
function SectionScreen({setRoute,user,sec=1}){
  const lang=useLang();
  const section=SECTIONS[sec];
  const lessons=Object.values(LESSONS).filter(l=>l.sec===sec);
  const completed=user?.completedLessons||[];
  return React.createElement("div",{style:{maxWidth:800,margin:"0 auto",padding:"24px 16px"}},
    React.createElement("button",{onClick:()=>setRoute("dashboard"),style:{appearance:"none",background:"none",border:"none",cursor:"pointer",color:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:11,marginBottom:16,padding:0,display:"flex",alignItems:"center",gap:6}},
      "← ",t(lang,"Kurslar","Courses")
    ),
    React.createElement("div",{style:{marginBottom:24}},
      React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:section.color,fontWeight:700,letterSpacing:1,marginBottom:6}},
        "SEC "+section.num),
      React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontSize:26,fontWeight:800,margin:"0 0 8px"}},
        t(lang,section.uz,section.en)),
      React.createElement("p",{style:{fontSize:13,color:"var(--text-2)",margin:0}},
        t(lang,section.descUz,section.descEn))
    ),
    lessons.map(l=>{
      const key=`na_l${l.num.slice(1)}`;
      const done=completed.includes(key);
      return React.createElement("div",{key:l.num,
        onClick:()=>setRoute({name:"lesson",num:parseInt(l.num.slice(1))}),
        style:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",marginBottom:8,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,cursor:"pointer",transition:"all 150ms"}},
        React.createElement("div",{style:{width:32,height:32,borderRadius:8,background:done?"var(--accent-soft)":section.color+"22",border:`1px solid ${done?"var(--accent)":section.color+"44"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700,color:done?"var(--accent)":section.color}},
          done?React.createElement(Icon,{name:"check",size:14}):l.num.slice(1)
        ),
        React.createElement("div",{style:{flex:1}},
          React.createElement("div",{style:{fontWeight:600,fontSize:13,color:"var(--text-0)"}},
            t(lang,l.uz,l.en||l.uz)),
          React.createElement("div",{style:{fontSize:11,color:"var(--text-3)",marginTop:2}},l.sub)
        ),
        React.createElement(Icon,{name:"arrow",size:14,style:{color:"var(--text-3)"}})
      );
    })
  );
}

// ── Lesson Screen ─────────────────────────────────────────────
function LessonScreen({setRoute,user,markComplete,num=1}){
  const lang=useLang();
  const [done,setDone]=useState(false);
  const lesson=LESSONS[num]||LESSONS[1];
  const lessonKey=`na_l${String(num).padStart(2,"0")}`;
  const alreadyDone=(user?.completedLessons||[]).includes(lessonKey);
  const sec=SECTIONS[lesson.sec];

  const content=num===1?React.createElement(LessonL01):
    num===2?React.createElement(LessonL02):
    num===3?React.createElement(LessonL03):
    num===4?React.createElement(LessonL04):
    num===5?React.createElement(LessonL05):
    num===6?React.createElement(LessonL06):
    num===7?React.createElement(LessonL07):
    num===8?React.createElement(LessonL08):
    num===9?React.createElement(LessonL09):
    num===10?React.createElement(LessonL10):
    num===11?React.createElement(LessonL11):
    num===12?React.createElement(LessonL12):
    num===13?React.createElement(LessonL13):
    num===14?React.createElement(LessonL14):
    num===15?React.createElement(LessonL15):
    num===16?React.createElement(LessonL16):
    num===17?React.createElement(LessonL17):
    num===18?React.createElement(LessonL18):
    num===19?React.createElement(LessonL19):
    num===20?React.createElement(LessonL20):
    num===21?React.createElement(LessonL21):
    num===22?React.createElement(LessonL22):
    num===23?React.createElement(LessonL23):
    num===24?React.createElement(LessonL24):
    num===25?React.createElement(LessonL25):
    num===26?React.createElement(LessonL26):
    num===27?React.createElement(LessonL27):
    num===28?React.createElement(LessonL28):
    num===29?React.createElement(LessonL29):
    num===30?React.createElement(LessonL30):
    React.createElement(ComingSoon,{lesson});

  return React.createElement("div",{style:{maxWidth:800,margin:"0 auto",padding:"24px 16px"}},
    React.createElement("button",{onClick:()=>setRoute({name:"section",sec:lesson.sec}),style:{appearance:"none",background:"none",border:"none",cursor:"pointer",color:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:11,marginBottom:16,padding:0,display:"flex",alignItems:"center",gap:6}},
      "← ",t(lang,sec.uz,sec.en)
    ),
    React.createElement("div",{style:{marginBottom:24,padding:"20px 24px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16}},
      React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:sec.color,fontWeight:700,letterSpacing:1,marginBottom:6}},
        lesson.num),
      React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,margin:"0 0 6px"}},
        t(lang,lesson.uz,lesson.en||lesson.uz)),
      React.createElement("div",{style:{fontSize:12,color:"var(--text-2)"}},lesson.sub)
    ),
    content,
    !alreadyDone&&!done&&num<=30&&React.createElement("button",{
      onClick:()=>{markComplete&&markComplete(lessonKey);setDone(true);},
      style:{marginTop:24,padding:"12px 28px",borderRadius:10,cursor:"pointer",appearance:"none",background:"var(--accent)",border:"none",color:"#04060d",fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,boxShadow:"0 0 20px var(--accent-glow)"}
    },t(lang,"Darsni yakunlash ✓","Complete Lesson ✓")),
    (alreadyDone||done)&&React.createElement("div",{style:{marginTop:24,padding:"14px",background:"var(--accent-soft)",border:"1px solid var(--accent-border)",borderRadius:10,textAlign:"center",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)"}},
      t(lang,"✓ Dars bajarildi! +50 XP","✓ Lesson completed! +50 XP"))
  );
}

// ── Profile Modal ─────────────────────────────────────────────
function ProfileModal({user,theme,setTheme,onSave,onClose,lang}){
  const [name,setName]=useState(user?.name||"Student");
  const [saved,setSaved]=useState(false);
  const [aiKeys,setAiKeys]=useState(()=>loadAiKeys());
  const [activeId,setActiveId]=useState(()=>{
    const k=loadAiKeys();const id=localStorage.getItem(AI_ACTIVE_STORE)||"";
    return k.find(x=>x.id===id)?id:(k[0]?.id||"");
  });
  const [adding,setAdding]=useState(false);
  const [nProv,setNProv]=useState("");
  const [nKey,setNKey]=useState("");
  const [showKey,setShowKey]=useState(false);
  const PROVS=[{id:"groq",label:"Groq",hint:"gsk_...",free:true},{id:"openai",label:"OpenAI",hint:"sk-..."},{id:"anthropic",label:"Claude",hint:"sk-ant-..."},{id:"gemini",label:"Gemini",hint:"AIza..."}];
  const THEMES=["blue","green","purple"];
  const save=()=>{onSave({name:name.trim()||"Student"});setSaved(true);setTimeout(()=>setSaved(false),1800);};
  const addKey=()=>{
    if(!nProv||!nKey.trim()||aiKeys.length>=3)return;
    const e={id:Date.now().toString(),provider:nProv,key:nKey.trim()};
    const u=[...aiKeys,e];setAiKeys(u);
    try{localStorage.setItem(AI_KEYS_STORE,JSON.stringify(u));}catch{}
    if(!activeId){setActiveId(e.id);try{localStorage.setItem(AI_ACTIVE_STORE,e.id);}catch{}}
    setNProv("");setNKey("");setAdding(false);
  };
  const removeKey=id=>{
    const u=aiKeys.filter(k=>k.id!==id);setAiKeys(u);
    try{localStorage.setItem(AI_KEYS_STORE,JSON.stringify(u));}catch{}
    if(activeId===id){const nx=u[0]?.id||"";setActiveId(nx);try{localStorage.setItem(AI_ACTIVE_STORE,nx);}catch{}}
  };
  const activateKey=id=>{setActiveId(id);try{localStorage.setItem(AI_ACTIVE_STORE,id);}catch{}};
  return React.createElement("div",{style:{position:"fixed",inset:0,zIndex:1000,background:"rgba(2,4,10,0.85)",backdropFilter:"blur(8px)",display:"grid",placeItems:"center",padding:20},
    onClick:e=>e.target===e.currentTarget&&onClose()},
    React.createElement("div",{style:{background:"rgba(8,12,24,0.98)",border:"1px solid var(--accent-border)",borderRadius:20,width:"100%",maxWidth:460,overflow:"hidden"}},
      React.createElement("div",{style:{padding:"18px 24px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("div",{style:{fontFamily:"var(--font-display)",fontSize:17,fontWeight:700}},t(lang,"Profil","Profile")),
        React.createElement("button",{onClick:onClose,style:{appearance:"none",background:"none",border:"none",cursor:"pointer",color:"var(--text-2)"}},React.createElement(Icon,{name:"x",size:16}))
      ),
      React.createElement("div",{style:{padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}},
        React.createElement("div",null,
          React.createElement("label",{style:{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--accent)",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}},
            t(lang,"// ISM","// NAME")),
          React.createElement("input",{value:name,onChange:e=>setName(e.target.value),maxLength:30,
            style:{width:"100%",boxSizing:"border-box",background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:8,padding:"9px 12px",fontSize:13,color:"var(--text-0)",outline:"none"}})
        ),
        React.createElement("div",null,
          React.createElement("label",{style:{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--accent)",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}},
            t(lang,"// RANG_MAVZU","// THEME")),
          React.createElement("div",{style:{display:"flex",gap:8}},
            THEMES.map(th=>{const colors={blue:"#00d4ff",green:"#00ff88",purple:"#c084fc"};return React.createElement("button",{key:th,onClick:()=>setTheme(th),style:{flex:1,padding:"8px 0",borderRadius:8,cursor:"pointer",appearance:"none",border:`2px solid ${theme===th?colors[th]:"var(--border)"}`,background:theme===th?`${colors[th]}18`:"var(--bg-2)",color:theme===th?colors[th]:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700,textTransform:"capitalize"}},th);})
          )
        ),
        React.createElement("div",null,
          React.createElement("label",{style:{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--accent)",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}},
            t(lang,"// AI_KALITLAR","// AI_KEYS")),
          aiKeys.map(k=>{const pv=PROVS.find(p=>p.id===k.provider);const isAct=k.id===activeId;const mk=k.key.length>8?k.key.slice(0,4)+"****"+k.key.slice(-4):"****";
            return React.createElement("div",{key:k.id,style:{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,marginBottom:5,border:`1.5px solid ${isAct?"var(--accent)":"var(--border)"}`,background:isAct?"var(--accent-soft)":"var(--bg-2)"}},
              React.createElement("div",{style:{width:7,height:7,borderRadius:"50%",background:isAct?"var(--accent)":"var(--border)",flexShrink:0}}),
              React.createElement("div",{style:{flex:1,minWidth:0}},
                React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700,color:isAct?"var(--accent)":"var(--text-1)"}},(pv?.label||k.provider)),
                React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-3)",marginLeft:6}},mk)
              ),
              isAct?React.createElement("span",{style:{fontSize:8,fontFamily:"var(--font-mono)",color:"var(--accent)",fontWeight:900,padding:"1px 5px",border:"1px solid var(--accent)",borderRadius:3}},t(lang,"FAOL","ACTIVE")):
                React.createElement("button",{onClick:()=>activateKey(k.id),style:{appearance:"none",background:"none",border:"1px solid var(--border)",borderRadius:5,cursor:"pointer",fontSize:8,fontFamily:"var(--font-mono)",color:"var(--text-2)",padding:"1px 5px",fontWeight:700}},t(lang,"Faollashtir","Activate")),
              React.createElement("button",{onClick:()=>removeKey(k.id),style:{appearance:"none",background:"none",border:"none",cursor:"pointer",color:"var(--c-attack)",opacity:0.7,padding:"0 2px",fontSize:12,lineHeight:1}},"✕")
            );
          }),
          aiKeys.length===0&&!adding&&React.createElement("div",{style:{fontSize:10,color:"var(--text-3)",fontFamily:"var(--font-mono)",textAlign:"center",padding:"6px 0"}},t(lang,"Hali kalit qo'shilmagan","No keys added")),
          adding&&React.createElement("div",{style:{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:8,padding:10,marginTop:4}},
            React.createElement("div",{style:{display:"flex",gap:4,marginBottom:7,flexWrap:"wrap"}},
              PROVS.map(p=>React.createElement("button",{key:p.id,onClick:()=>setNProv(p.id),style:{flex:"1 1 auto",padding:"5px 4px",borderRadius:6,cursor:"pointer",appearance:"none",border:`1.5px solid ${nProv===p.id?"var(--accent)":"var(--border)"}`,background:nProv===p.id?"var(--accent-soft)":"transparent",color:nProv===p.id?"var(--accent)":"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:9,fontWeight:700}},p.label,p.free&&React.createElement("span",{style:{display:"block",fontSize:7,color:"var(--accent)"}},t(lang,"BEPUL","FREE"))))
            ),
            nProv&&React.createElement("div",{style:{position:"relative",marginBottom:6}},
              React.createElement("input",{type:showKey?"text":"password",placeholder:PROVS.find(p=>p.id===nProv)?.hint||"",value:nKey,onChange:e=>setNKey(e.target.value),
                style:{width:"100%",boxSizing:"border-box",background:"rgba(0,0,0,0.3)",border:"1px solid var(--border)",borderRadius:6,padding:"7px 32px 7px 10px",fontSize:11,fontFamily:"var(--font-mono)",color:"var(--text-0)",outline:"none"}}),
              React.createElement("button",{onClick:()=>setShowKey(s=>!s),style:{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--text-3)",fontSize:12,padding:0}},showKey?"🙈":"👁")
            ),
            React.createElement("div",{style:{display:"flex",gap:5}},
              React.createElement("button",{onClick:()=>{setAdding(false);setNProv("");setNKey("");},style:{flex:"0 0 auto",padding:"5px 10px",borderRadius:5,cursor:"pointer",appearance:"none",border:"1px solid var(--border)",background:"transparent",color:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700}},t(lang,"Bekor","Cancel")),
              React.createElement("button",{onClick:addKey,disabled:!nProv||!nKey.trim(),style:{flex:1,padding:"5px 0",borderRadius:5,cursor:nProv&&nKey.trim()?"pointer":"not-allowed",appearance:"none",border:`1px solid ${nProv&&nKey.trim()?"var(--accent)":"var(--border)"}`,background:nProv&&nKey.trim()?"var(--accent)":"transparent",color:nProv&&nKey.trim()?"#04060d":"var(--text-3)",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700}},t(lang,"Qo'shish","Add"))
            )
          ),
          !adding&&aiKeys.length<3&&React.createElement("button",{onClick:()=>setAdding(true),style:{width:"100%",marginTop:5,padding:"6px 0",borderRadius:7,cursor:"pointer",appearance:"none",border:"1px dashed var(--border)",background:"transparent",color:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:600}},
            `+ ${t(lang,"API kalit qo'shish","Add API key")}${aiKeys.length>0?` (${aiKeys.length}/3)`:""}`)
        ),
        React.createElement("button",{onClick:save,style:{padding:"11px 0",borderRadius:10,cursor:"pointer",appearance:"none",border:`1px solid ${saved?"var(--accent)":"var(--accent-border)"}`,background:saved?"var(--accent-soft)":"var(--accent)",color:saved?"var(--accent)":"#04060d",fontFamily:"var(--font-display)",fontSize:13,fontWeight:700}},
          saved?t(lang,"✓ Saqlandi!","✓ Saved!"):t(lang,"Saqlash","Save"))
      )
    )
  );
}

// ── AI Chat ───────────────────────────────────────────────────
function AIChat({open,onClose,lang}){
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");
  const [loading,setLoading]=useState(false);
  const btm=useRef(null);
  useEffect(()=>{btm.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const hasKey=()=>!!(getActiveAiKey()||localStorage.getItem("wa_ai_proxy"));
  const send=async()=>{
    if(!inp.trim()||loading)return;
    const q=inp.trim();setInp("");
    setMsgs(p=>[...p,{role:"user",text:q}]);setLoading(true);
    try{
      const sys=`You are a patient, friendly networking tutor inside "Network Academy", teaching a COMPLETE BEGINNER. Explain every concept in simple, everyday language, step by step, using real-life analogies (post offices, phone books, guards). Avoid unexplained jargon; when you must use a term, define it briefly first. Keep answers well structured and encouraging.\n\nThe course covers: OSI model, TCP/IP, IP addressing (IPv4/IPv6, CIDR, subnetting), DNS, HTTP/HTTPS, ARP, DHCP, routing, switching & VLANs, NAT/PAT, topologies, wireless (WPA2/WPA3); security: firewalls, VPN, SSL/TLS, IDS/IPS, DMZ, 802.1X/NAC, packet filtering, proxies, Zero Trust; attacks & defense: port scanning, enumeration, ARP/DNS spoofing, MITM, DoS/DDoS, Wireshark, wireless attacks, network forensics.\n\nFor any offensive topic, assume the learner studies defensively or on systems they are authorized to test, and note authorized/lab use only. Answer in the SAME language the user writes in \u2014 default to Uzbek if unsure.`;
      const hist=msgs.slice(-6).map(m=>(m.role==="user"?"User: ":"Assistant: ")+m.text).join("\n");const reply=await callAI(sys+(hist?"\n\n"+hist:"")+"\n\nUser: "+q+"\nAssistant:");
      setMsgs(p=>[...p,{role:"ai",text:reply.trim()}]);
    }catch(e){
      setMsgs(p=>[...p,{role:"ai",text:e.message==="no_key"?t(lang,"Avval Profil sozlamalarida AI kalitini o'rnating.","Set your AI key in Profile settings first."):t(lang,"Xatolik: ","Error: ")+e.message,isErr:true}]);
    }finally{setLoading(false);}
  };
  if(!open)return null;
  return React.createElement("div",{style:{position:"fixed",bottom:80,right:20,zIndex:900,width:320,background:"rgba(8,12,24,0.97)",border:"1px solid var(--accent-border)",borderRadius:16,boxShadow:"0 20px 60px rgba(0,0,0,0.6)",display:"flex",flexDirection:"column",overflow:"hidden",maxHeight:"calc(100vh-100px)"}},
    React.createElement("div",{style:{padding:"11px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(180deg,rgba(0,212,255,0.05),transparent)"}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8}},
        React.createElement("div",{style:{width:28,height:28,borderRadius:7,background:"var(--accent-soft)",border:"1px solid var(--accent-border)",display:"grid",placeItems:"center"}},
          React.createElement(Icon,{name:"spark",size:13,style:{color:"var(--accent)"}})
        ),
        React.createElement("div",null,
          React.createElement("div",{style:{fontWeight:600,fontSize:12}},t(lang,"AI Muallim","AI Tutor")),
          React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:8,color:"var(--accent)",letterSpacing:0.5}},"NETWORK ACADEMY")
        )
      ),
      React.createElement("button",{onClick:onClose,style:{appearance:"none",background:"none",border:"none",cursor:"pointer",color:"var(--text-2)"}},React.createElement(Icon,{name:"x",size:14}))
    ),
    React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"12px 12px 0",minHeight:240}},
      msgs.length===0&&React.createElement("div",{style:{textAlign:"center",padding:"20px 10px",color:"var(--text-3)",fontSize:12}},
        React.createElement("div",{style:{fontSize:28,marginBottom:8}},"🌐"),
        t(lang,"Tarmoq haqida savol bering!","Ask about networking!"),
        !hasKey()&&React.createElement("div",{style:{marginTop:8,padding:"8px 10px",background:"rgba(255,180,0,0.08)",border:"1px solid rgba(255,180,0,0.25)",borderRadius:8,fontSize:11,color:"var(--c-warn)"}},
          t(lang,"⚠ Profilda AI kalitini o'rnating.","⚠ Set AI key in Profile."))
      ),
      msgs.map((m,i)=>React.createElement("div",{key:i,style:{marginBottom:8,display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}},
        React.createElement("div",{style:{maxWidth:"88%",padding:"7px 11px",borderRadius:m.role==="user"?"10px 10px 3px 10px":"10px 10px 10px 3px",background:m.role==="user"?"var(--accent)":m.isErr?"rgba(255,80,80,0.1)":"var(--surface)",border:m.role==="user"?"none":`1px solid ${m.isErr?"rgba(255,80,80,0.3)":"var(--border)"}`,color:m.role==="user"?"#04060d":m.isErr?"#ff6666":"var(--text-0)",fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap",wordBreak:"break-word"}},m.text)
      )),
      loading&&React.createElement("div",{style:{marginBottom:8}},React.createElement("div",{style:{padding:"7px 12px",borderRadius:"10px 10px 10px 3px",background:"var(--surface)",border:"1px solid var(--border)",fontSize:14,color:"var(--text-3)",letterSpacing:2}},"···")),
      React.createElement("div",{ref:btm,style:{height:12}})
    ),
    React.createElement("div",{style:{padding:"8px 10px",borderTop:"1px solid var(--border)",display:"flex",gap:6}},
      React.createElement("input",{value:inp,onChange:e=>setInp(e.target.value),onKeyDown:e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}},placeholder:t(lang,"Savol bering…","Ask a question…"),
        style:{flex:1,background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:7,padding:"7px 10px",color:"var(--text-0)",fontSize:12,outline:"none"}}),
      React.createElement("button",{onClick:send,disabled:!inp.trim()||loading,style:{appearance:"none",border:"none",cursor:inp.trim()&&!loading?"pointer":"not-allowed",width:32,height:32,borderRadius:7,flexShrink:0,background:inp.trim()&&!loading?"var(--accent)":"var(--surface)",color:inp.trim()&&!loading?"#04060d":"var(--text-3)",display:"grid",placeItems:"center"}},
        React.createElement(Icon,{name:"send",size:13}))
    )
  );
}

// ── App Root ──────────────────────────────────────────────────
function App(){
  const [theme,_setTheme]=useState(()=>{try{return localStorage.getItem(THEME_KEY)||"blue";}catch{return"blue";}});
  const setTheme=v=>{_setTheme(v);try{localStorage.setItem(THEME_KEY,v);}catch{}};
  const [lang,_setLang]=useState(()=>{try{return localStorage.getItem(LANG_KEY)||"uz";}catch{return"uz";}});
  const setLang=v=>{_setLang(v);try{localStorage.setItem(LANG_KEY,v);}catch{}};
  const [progress,_setProgress]=useState(loadProgress);
  const updateProgress=useCallback(patch=>{_setProgress(p=>{const n={...p,...patch};saveProgress(n);return n;});},[]);
  const markComplete=useCallback(key=>{_setProgress(p=>{if((p.completedLessons||[]).includes(key))return p;const cl=[...(p.completedLessons||[]),key];const xp=(p.xp||0)+50;const n={...p,completedLessons:cl,xp,level:xpToLevel(xp)};saveProgress(n);return n;});},[]);
  const [route,_setRoute]=useState(()=>{try{const s=localStorage.getItem(ROUTE_KEY);if(s)return JSON.parse(s);}catch{}return"landing";});
  const setRoute=r=>{_setRoute(r);try{localStorage.setItem(ROUTE_KEY,JSON.stringify(r));}catch{};window.scrollTo({top:0,behavior:"instant"});};
  const [profileOpen,setProfileOpen]=useState(false);
  const [aiOpen,setAiOpen]=useState(false);

  useEffect(()=>{
    const th=theme;
    document.documentElement.setAttribute("data-theme",th);
    const colors={blue:"#00d4ff",green:"#00ff88",purple:"#c084fc"};
    const c=colors[th]||colors.blue;
    const r=document.documentElement.style;
    r.setProperty("--accent",c);
    r.setProperty("--accent-glow",`${c}72`);
    r.setProperty("--accent-soft",`${c}1e`);
    r.setProperty("--accent-border",`${c}47`);
  },[theme]);

  const user={...progress,completedLessons:progress.completedLessons||[]};
  const routeName=typeof route==="string"?route:route?.name;
  const navProps={setRoute,user,onOpenProfile:()=>setProfileOpen(true),onOpenAI:()=>setAiOpen(true)};

  return React.createElement(LangCtx.Provider,{value:lang},
    React.createElement("div",null,
      routeName!=="landing"&&React.createElement(TopNav,navProps),
      routeName==="landing"?React.createElement(LandingScreen,{setRoute}):
      routeName==="dashboard"?React.createElement(DashboardScreen,{...navProps}):
      routeName==="section"?React.createElement(SectionScreen,{...navProps,sec:route?.sec||1}):
      routeName==="lesson"?React.createElement(LessonScreen,{...navProps,markComplete,num:route?.num||1}):
      React.createElement(LandingScreen,{setRoute}),
      profileOpen&&React.createElement(ProfileModal,{user,theme,setTheme,lang,onClose:()=>setProfileOpen(false),onSave:patch=>{updateProgress({name:patch.name});setProfileOpen(false);}}),
      React.createElement(AIChat,{open:aiOpen,onClose:()=>setAiOpen(false),lang})
    )
  );
}


// ── L02: TCP/IP Protocol ──────────────────────────────────────
function LessonL02(){
  const lang=useLang();
  const layers=[
    {n:4,name:"Application",uz:"Ilova",proto:"HTTP · DNS · FTP · SMTP",desc:{uz:"Foydalanuvchi ko'radigan dasturlar (OSI 5,6,7).",en:"The apps a user sees (OSI 5,6,7)."},color:"#ff6b6b"},
    {n:3,name:"Transport",uz:"Transport",proto:"TCP · UDP",desc:{uz:"Ishonchli yetkazish va portlar (OSI 4).",en:"Reliable delivery and ports (OSI 4)."},color:"#69db7c"},
    {n:2,name:"Internet",uz:"Internet",proto:"IP · ICMP",desc:{uz:"IP manzillash va yo'naltirish (OSI 3).",en:"IP addressing and routing (OSI 3)."},color:"#4dabf7"},
    {n:1,name:"Network Access",uz:"Tarmoq kirishi",proto:"Ethernet · WiFi · ARP",desc:{uz:"Fizik uzatish va MAC manzillar (OSI 1,2).",en:"Physical transmission and MAC (OSI 1,2)."},color:"#9775fa"},
  ];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"TCP/IP nima?","What is TCP/IP?")),
    React.createElement(P,null,t(lang,"TCP/IP — internet ishlashining asosi bo'lgan protokollar to'plami. Uni pochta tizimiga o'xshating: xat (ma'lumot) konvertga solinadi, manzil yoziladi, pochta bo'limlari orqali o'tib yetkaziladi. TCP/IP shu qoidalar to'plami bo'lib, dunyodagi har qanday ikki qurilma bir-biri bilan gaplasha olishini ta'minlaydi.","TCP/IP is the suite of protocols the internet runs on. Think of the postal system: a letter (data) goes in an envelope, gets an address, passes through post offices and is delivered. TCP/IP is that set of rules, letting any two devices talk.")),
    React.createElement(H2,{num:"§2"},t(lang,"4 qatlamli model","The 4-layer model")),
    React.createElement(P,null,t(lang,"TCP/IP OSI ning 7 qatlamini 4 ta amaliy qatlamga soddalashtiradi:","TCP/IP simplifies OSI's 7 layers into 4 practical layers:")),
    React.createElement(LayerStack,{layers:layers}),
    React.createElement(H2,{num:"§3"},t(lang,"TCP va UDP farqi","TCP vs UDP")),
    React.createElement(P,null,t(lang,"Transport qatlamida ikkita protokol bor. TCP — ishonchli (buyurtma qilingan pochta kabi: yetgani tasdiqlanadi). UDP — tez, ammo tasdiqlamaydi (oddiy xat tashlagandek).","The transport layer has two protocols. TCP is reliable (like registered mail: delivery is confirmed). UDP is fast but unconfirmed (like dropping a postcard).")),
    React.createElement(CompareCols,{
      left:{title:"TCP",color:"#69db7c",rows:[{uz:"✓ Ishonchli",en:"✓ Reliable"},{uz:"✓ Tartibli yetkazish",en:"✓ Ordered delivery"},{uz:"✓ Xatolarni tuzatish",en:"✓ Error correction"},{uz:"✗ Sekinroq",en:"✗ Slower"},{uz:"Veb, email, fayl",en:"Web, email, files"}]},
      right:{title:"UDP",color:"#4dabf7",rows:[{uz:"✓ Juda tez",en:"✓ Very fast"},{uz:"✓ Kam yuk",en:"✓ Low overhead"},{uz:"✗ Tasdiqlamaydi",en:"✗ No confirmation"},{uz:"✗ Paket yo'qolishi mumkin",en:"✗ Packets may drop"},{uz:"Video, o'yin, DNS",en:"Video, games, DNS"}]}}),
    React.createElement(H2,{num:"§4"},t(lang,"3 bosqichli qo'l berish (Handshake)","The 3-way handshake")),
    React.createElement(P,null,t(lang,"TCP ulanishdan oldin ikki qurilma \"qo'l beradi\" — bir-birini tayyor ekanini tasdiqlaydi. \"Ishga tushir\" ni bosing:","Before TCP connects, the two devices \"shake hands\" — confirming each is ready. Press Play:")),
    React.createElement(FlowSteps,{color:"#69db7c",title:{uz:"TCP 3-way handshake",en:"TCP 3-way handshake"},steps:[
      {icon:"→",text:{uz:"Client → Server:  SYN  (\"ulanamizmi?\")",en:"Client → Server:  SYN  (\"shall we connect?\")"}},
      {icon:"←",text:{uz:"Server → Client:  SYN-ACK  (\"ha, ulanamiz\")",en:"Server → Client:  SYN-ACK  (\"yes, let's\")"}},
      {icon:"→",text:{uz:"Client → Server:  ACK  (\"kelishdik!\")",en:"Client → Server:  ACK  (\"agreed!\")"}},
      {icon:"✓",text:{uz:"Ulanish tayyor — ma'lumot uzatiladi",en:"Connection ready — data flows"}},
    ]}),
        React.createElement(H2,{num:"§5"},t(lang,"Portlar va ulanish holati","Ports and connection state")),
    React.createElement(P,null,t(lang,"TCP har ulanishni port raqami bilan belgilaydi (HTTP=80, HTTPS=443, SSH=22) va uni holat mashinasi orqali boshqaradi: LISTEN (kutmoqda), ESTABLISHED (ulangan), TIME_WAIT (yopilmoqda). ss buyrug'i bu holatlarni ko'rsatadi — pentestda ochiq xizmatlarni topishga yordam beradi.","TCP identifies each connection by a port number (HTTP=80, HTTPS=443, SSH=22) and manages it via a state machine: LISTEN (waiting), ESTABLISHED (connected), TIME_WAIT (closing). The ss command shows these states — helpful in a pentest to find open services.")),
    React.createElement(LayerStack,{layers:[{n:"22",name:t(lang,"SSH","SSH"),color:"#4dabf7",desc:{uz:"Xavfsiz masofaviy kirish (TCP).",en:"Secure remote access (TCP)."}},{n:"53",name:t(lang,"DNS","DNS"),color:"#69db7c",desc:{uz:"Nom → IP (asosan UDP).",en:"Name → IP (mostly UDP)."}},{n:"80/443",name:t(lang,"HTTP/S","HTTP/S"),color:"#a855f7",desc:{uz:"Veb trafik (TCP).",en:"Web traffic (TCP)."}},{n:"3389",name:t(lang,"RDP","RDP"),color:"#ffd43b",desc:{uz:"Windows masofaviy ish stoli.",en:"Windows remote desktop."}},]}),
    React.createElement(Terminal,null,"ss -tan\n# State    Local Address:Port   Peer Address:Port\n# LISTEN   0.0.0.0:22           0.0.0.0:*      ← SSH kutmoqda\n# ESTAB    10.0.0.5:443         10.0.0.9:51324 ← faol HTTPS\n# TIME-WAIT 10.0.0.5:80         10.0.0.9:51001"),
React.createElement(Quiz,{
      q:{uz:"Qaysi protokol video oqim (streaming) uchun ko'proq mos, chunki tezlik ishonchlilikdan muhimroq?",en:"Which protocol suits video streaming better, where speed matters more than reliability?"},
      opts:[{uz:"TCP",en:"TCP"},{uz:"UDP",en:"UDP"},{uz:"HTTP",en:"HTTP"},{uz:"ARP",en:"ARP"}],
      correct:1,
      exp:{uz:"UDP tasdiqlashsiz tez uzatadi — video/o'yin uchun bir-ikki paket yo'qolsa ham davom etaverish afzal.",en:"UDP transmits fast without confirmation — for video/games, continuing even if a packet drops is preferable."}})
  );
}
function LessonL03(){
  const lang=useLang();
  const ranges=[["10.0.0.0/8","10.x.x.x",{uz:"Katta tarmoqlar",en:"Large networks"},"#69db7c"],
    ["172.16.0.0/12","172.16–31.x.x",{uz:"O'rta tarmoqlar",en:"Medium networks"},"#4dabf7"],
    ["192.168.0.0/16","192.168.x.x",{uz:"Uy / kichik ofis",en:"Home / small office"},"#9775fa"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"IP manzil nima?","What is an IP address?")),
    React.createElement(P,null,t(lang,"IP manzil — tarmoqdagi har bir qurilmaning yagona \"uy manzili\". Pochta xatni to'g'ri uyga yetkazish uchun manzilga muhtoj bo'lgani kabi, tarmoq ham ma'lumotni to'g'ri qurilmaga yetkazish uchun IP manzildan foydalanadi.","An IP address is the unique \"home address\" of every device on a network. Just as the post office needs an address to deliver to the right house, the network uses an IP to reach the right device.")),
    React.createElement(H2,{num:"§2"},t(lang,"IPv4 tuzilishi","IPv4 structure")),
    React.createElement("div",{className:"na-rise",style:{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",margin:"10px 0 14px"}},
      [["192","",false],["168","",false],["1","",true],["10","",true]].map(function(o,i){return React.createElement("div",{key:i,style:{textAlign:"center"}},
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontWeight:800,fontSize:20,color:o[2]?"#ffd43b":"#4dabf7",background:(o[2]?"#ffd43b":"#4dabf7")+"18",border:"1px solid "+(o[2]?"#ffd43b":"#4dabf7")+"55",borderRadius:8,padding:"8px 14px",minWidth:52}},o[0]),
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--text-2)",marginTop:4}},"8 bit"));})),
    React.createElement("div",{style:{textAlign:"center",fontSize:12,color:"var(--text-2)",marginBottom:14}},
      React.createElement("span",{style:{color:"#4dabf7"}},t(lang,"■ Tarmoq qismi","■ Network part"))," · ",
      React.createElement("span",{style:{color:"#ffd43b"}},t(lang,"■ Xost qismi","■ Host part"))," · ",t(lang,"jami 32 bit, har son 0–255","32 bits total, each 0–255")),
    React.createElement(H2,{num:"§3"},t(lang,"Xususiy va ommaviy manzillar","Private and public addresses")),
    React.createElement(P,null,t(lang,"Ba'zi diapazonlar \"xususiy\" — faqat ichki tarmoqda ishlaydi va internetda ko'rinmaydi (uy ichidagi xona raqamlari kabi).","Some ranges are \"private\" — used only inside a local network and never seen on the internet (like room numbers inside a house).")),
    ranges.map(function(r,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,alignItems:"center",padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid "+r[3]+"44",borderLeft:"3px solid "+r[3],borderRadius:10,animationDelay:(i*0.07)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:r[3],minWidth:120}},r[0]),
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-2)",flex:1}},r[1]),
      React.createElement("span",{style:{fontSize:11.5,color:"var(--text-1)"}},t(lang,r[2].uz,r[2].en)));}),
    React.createElement(H2,{num:"§4"},t(lang,"CIDR, subnetting va IPv6","CIDR, subnetting and IPv6")),
    React.createElement(P,null,t(lang,"CIDR yozuvi (masalan /24) manzilning qancha qismi \"tarmoq\", qanchasi \"xost\" ekanini bildiradi. /24 = birinchi 24 bit tarmoq, qolgan 8 bit xostlar uchun (256 manzil). Subnetting — katta tarmoqni kichik bo'laklarga bo'lish.","CIDR notation (e.g. /24) tells how much of an address is \"network\" vs \"host\". /24 = first 24 bits network, last 8 bits for hosts (256 addresses). Subnetting splits a big network into smaller pieces.")),
    React.createElement(CompareCols,{
      left:{title:"IPv4",color:"#4dabf7",rows:[{uz:"32 bit · ~4.3 mlrd manzil",en:"32-bit · ~4.3 billion addresses"},"192.168.1.10",{uz:"Manzillar tugab bormoqda",en:"Addresses are running out"}]},
      right:{title:"IPv6",color:"#69db7c",rows:[{uz:"128 bit · deyarli cheksiz",en:"128-bit · almost unlimited"},"2001:db8::8a2e:370:7334",{uz:"Kelajak IPv6 da",en:"The future is IPv6"}]}}),
        React.createElement(H2,{num:"§5"},t(lang,"Statik va dinamik IP","Static vs dynamic IP")),
    React.createElement(P,null,t(lang,"IP manzil qurilmaga ikki yo'l bilan beriladi. Dinamik — DHCP serveri avtomatik beradi va vaqti-vaqti bilan o'zgarishi mumkin (uy va ofis qurilmalari uchun qulay). Statik — qo'lda qat'iy o'rnatiladi va o'zgarmaydi (serverlar, routerlar, printerlar uchun zarur, chunki ular doimo bir manzilda topilishi kerak).","An IP is assigned to a device in two ways. Dynamic — given automatically by a DHCP server and may change over time (convenient for home and office devices). Static — set manually and never changes (required for servers, routers, printers, which must always be reachable at the same address).")),
    React.createElement(CompareCols,{left:{title:{uz:"Dinamik (DHCP)",en:"Dynamic (DHCP)"},color:"#4dabf7",rows:[{uz:"Avtomatik beriladi",en:"Assigned automatically"},{uz:"Vaqt o'tib o'zgarishi mumkin",en:"Can change over time"},{uz:"Oddiy qurilmalar uchun",en:"For ordinary devices"},]},right:{title:{uz:"Statik (qo'lda)",en:"Static (manual)"},color:"#ffd43b",rows:[{uz:"Qat'iy, o'zgarmas",en:"Fixed, unchanging"},{uz:"Qo'lda sozlanadi",en:"Configured by hand"},{uz:"Server/router/printer uchun",en:"For servers/routers/printers"},]}}),
    React.createElement(H2,{num:"§6"},t(lang,"Ommaviy va xususiy — va NAT","Public and private — and NAT")),
    React.createElement(P,null,t(lang,"Xususiy (private) manzillar faqat ichki tarmoqda ishlaydi va internetda takrorlanadi — millionlab uy bir xil 192.168.1.x dan foydalanadi. Ommaviy (public) manzil internetda yagona bo'lib, uni provayder (ISP) beradi. Ichki qurilmalar internetga chiqqanda NAT ularning xususiy manzilini bitta ommaviy manzilga almashtiradi — shu sabab bir uydagi 10 ta qurilma bitta ommaviy IP orqali internetga chiqadi.","Private addresses work only inside a local network and are reused across the internet — millions of homes use the same 192.168.1.x. A public address is unique on the internet and is given by your ISP. When internal devices go online, NAT swaps their private address for a single public one — which is why 10 devices in one home reach the internet through one public IP.")),
    React.createElement(LayerStack,{layers:[{n:"10.x",name:t(lang,"10.0.0.0/8","10.0.0.0/8"),color:"#69db7c",desc:{uz:"Xususiy — katta tarmoqlar.",en:"Private — large networks."}},{n:"172.16",name:t(lang,"172.16.0.0/12","172.16.0.0/12"),color:"#4dabf7",desc:{uz:"Xususiy — o'rta tarmoqlar.",en:"Private — medium networks."}},{n:"192.168",name:t(lang,"192.168.0.0/16","192.168.0.0/16"),color:"#a855f7",desc:{uz:"Xususiy — uy/kichik ofis.",en:"Private — home/small office."}},{n:"127.0.0.1",name:t(lang,"loopback","loopback"),color:"#ffd43b",desc:{uz:"O'z-o'ziga — «localhost».",en:"Yourself — «localhost»."}},{n:"169.254",name:t(lang,"APIPA","APIPA"),color:"#ff6b6b",desc:{uz:"DHCP topilmasa avto-beriladi.",en:"Auto-assigned when no DHCP."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: o'z IP ingizni ko'rish","Practice: seeing your own IP")),
    React.createElement(P,null,t(lang,"ip a interfeys va manzilni, ip route standart shlyuzni ko'rsatadi. /24 — birinchi 24 bit tarmoq, qolgan 8 bit 254 ta xost uchun. Ommaviy IP ni bilish uchun tashqi xizmatga murojaat qilinadi.","ip a shows the interface and address, ip route the default gateway. /24 means the first 24 bits are network, the last 8 give 254 hosts. To learn the public IP you query an external service.")),
    React.createElement(Terminal,null,"ip a\n# 2: eth0: inet 192.168.1.10/24 brd 192.168.1.255  ← xususiy, /24\nip route\n# default via 192.168.1.1 dev eth0   ← shlyuz (router)\ncurl ifconfig.me\n# 85.132.44.7   ← ISP bergan OMMAVIY IP (NAT orqasidagi butun uy)"),
React.createElement(Quiz,{q:{uz:"192.168.1.10 qanday manzil?",en:"What kind of address is 192.168.1.10?"},opts:[{uz:"Ommaviy (public)",en:"Public"},{uz:"Xususiy (private) ichki tarmoq",en:"Private internal network"},{uz:"IPv6",en:"IPv6"},{uz:"MAC",en:"MAC"}],correct:1,exp:{uz:"192.168.0.0/16 xususiy diapazon — uy va kichik ofis tarmoqlarida ishlatiladi, internetda to'g'ridan-to'g'ri ko'rinmaydi.",en:"192.168.0.0/16 is private — used in home/small-office networks, not directly visible on the internet."}}));
}
function LessonL04(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DNS nima?","What is DNS?")),
    React.createElement(P,null,t(lang,"DNS (Domain Name System) — internetning telefon kitobi. Odamlar nomlarni eslab qolishadi (google.com), kompyuterlar esa faqat IP manzillar bilan ishlaydi (142.250.187.206). DNS nomni IP ga aylantiradi — bu jarayon «resolution» (hal qilish) deyiladi va deyarli har bir internet amaliyoti (sayt ochish, email yuborish) undan boshlanadi.","DNS (Domain Name System) is the internet's phone book. People remember names (google.com), but computers only work with IP addresses (142.250.187.206). DNS translates a name into an IP — this process is called «resolution», and almost every internet action (opening a site, sending email) starts with it.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: so'rov qanday hal bo'ladi","Interactive simulator: how a query is resolved")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinab ko'ring — birinchi (keshsiz) so'rov nechta bosqichdan o'tishini va ikkinchi (keshlangan) so'rov qanchalik tezroq ekanini solishtiring:","Try both scenarios — compare how many steps the first (uncached) query takes versus how much faster the second (cached) one is:")),
    React.createElement(DNSSim),
    React.createElement(H2,{num:"§3"},t(lang,"Ierarxiya: Root, TLD, Authoritative","The hierarchy: Root, TLD, Authoritative")),
    React.createElement(P,null,t(lang,"DNS markazlashmagan, daraxt shaklidagi tizim — hech bir server yagona nuqta bo'lib qolmaydi. Har daraja faqat KEYINGI qadamni biladi, yakuniy javobni emas (bundan authoritative server mustasno):","DNS is a decentralized, tree-shaped system — no single server is a bottleneck. Each level only knows the NEXT step, not the final answer (except the authoritative server):")),
    React.createElement(LayerStack,{layers:[
      {n:"1",name:t(lang,"Root server","Root server"),color:"#a855f7",desc:{uz:"Dunyoda ~13 ta manzil (yuzlab server sifatida ko'zguladi). Faqat TLD serverlarining manzilini biladi.",en:"~13 addresses worldwide (mirrored as hundreds of servers). Only knows where the TLD servers are."}},
      {n:"2",name:t(lang,"TLD server","TLD server"),color:"#f59e0b",desc:{uz:".com, .uz, .org kabi har domen zonasi uchun alohida. O'sha zonadagi authoritative NS'larni biladi.",en:"A separate one per zone like .com, .uz, .org. Knows the authoritative NS servers for that zone."}},
      {n:"3",name:t(lang,"Authoritative NS","Authoritative NS"),color:"#f472b6",desc:{uz:"Muayyan domen (google.com) uchun YAKUNIY javobni beradigan yagona server.",en:"The one server that gives the FINAL answer for a specific domain (google.com)."}},
      {n:"⚡",name:t(lang,"Recursive resolver","Recursive resolver"),color:"#3b82f6",desc:{uz:"Client o'rniga butun zanjirni yuradi va natijani keshlaydi (masalan 1.1.1.1, 8.8.8.8).",en:"Walks the whole chain on the client's behalf and caches the result (e.g. 1.1.1.1, 8.8.8.8)."}}
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"DNS yozuv turlari","DNS record types")),
    React.createElement(LayerStack,{layers:[
      {n:"A",name:"A",color:"#4dabf7",desc:{uz:"Nomni IPv4 manzilga bog'laydi — eng ko'p ishlatiladigan yozuv.",en:"Maps a name to an IPv4 address — the most common record."}},
      {n:"AAAA",name:"AAAA",color:"#69db7c",desc:{uz:"Nomni IPv6 manzilga bog'laydi.",en:"Maps a name to an IPv6 address."}},
      {n:"MX",name:"MX",color:"#a855f7",desc:{uz:"Domen uchun pochta serverini ko'rsatadi (ustuvorlik raqami bilan).",en:"Points to the mail server for the domain (with a priority number)."}},
      {n:"CNAME",name:"CNAME",color:"#ffd43b",desc:{uz:"Taxallus — bir nomni boshqa nomga yo'naltiradi (masalan www → asosiy domen).",en:"An alias — points one name to another (e.g. www → the root domain)."}},
      {n:"NS",name:"NS",color:"#ff6b6b",desc:{uz:"Domen uchun qaysi serverlar authoritative ekanini ko'rsatadi.",en:"Shows which servers are authoritative for the domain."}},
      {n:"TXT",name:"TXT",color:"#f472b6",desc:{uz:"Erkin matn — ko'pincha SPF/DKIM kabi email tekshiruvlari uchun.",en:"Free-form text — often used for SPF/DKIM email verification."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: dig va nslookup","Practice: dig and nslookup")),
    React.createElement(P,null,t(lang,"dig +trace butun ierarxiyani (Root → TLD → Authoritative) qadam-baqadam ko'rsatadi — simulyatordagi jarayonni haqiqiy buyruqda ko'rasiz.","dig +trace shows the whole hierarchy (Root → TLD → Authoritative) step by step — you see the exact process from the simulator as a real command.")),
    React.createElement(Terminal,null,"dig example.com A +short\n# 93.184.216.34\n\ndig example.com MX +short\n# 10 mail.example.com.\n\ndig +trace example.com | tail -6\n# com.  172800  IN  NS  a.gtld-servers.net.        ← TLD\n# example.com. 86400 IN NS a.iana-servers.net.     ← Authoritative\n# example.com.  3600 IN A  93.184.216.34            ← yakuniy javob"),
    React.createElement(Quiz,{q:{uz:"Root DNS server so'rovga qanday javob beradi?",en:"How does a Root DNS server respond to a query?"},opts:[{uz:"Har doim yakuniy IP manzilni qaytaradi",en:"It always returns the final IP address"},{uz:"Yakuniy javobni bilmaydi — tegishli TLD serverga yo'naltiradi",en:"It doesn't know the final answer — it refers to the right TLD server"},{uz:"So'rovni bloklaydi",en:"It blocks the query"},{uz:"Faqat email manzillarga javob beradi",en:"It only answers for email addresses"}],correct:1,exp:{uz:"Root server yakuniy javobni bilmaydi — u faqat tegishli TLD (masalan .com) serverlarining manzilini ko'rsatadi (referral). Yakuniy javobni faqat authoritative server beradi.",en:"A Root server doesn't know the final answer — it only points to the right TLD (e.g. .com) servers (a referral). Only the authoritative server gives the final answer."}}));
}
function LessonL05(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"HTTP nima?","What is HTTP?")),
    React.createElement(P,null,t(lang,"HTTP (HyperText Transfer Protocol) — brauzer va veb-server o'rtasidagi «til». Brauzer SO'ROV yuboradi («bu sahifani ber»), server JAVOB qaytaradi (sahifa + holat kodi). Bu — restoranda taom buyurtma qilib, keyin uni olishga o'xshaydi: har doim bitta so'rov, bitta javob.","HTTP (HyperText Transfer Protocol) is the «language» between a browser and a web server. The browser sends a REQUEST («give me this page»), the server returns a RESPONSE (the page + a status code). It's like ordering food at a restaurant and then receiving it: always one request, one response.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: so'rov, javob va HTTP vs HTTPS","Interactive simulator: request, response, and HTTP vs HTTPS")),
    React.createElement(P,null,t(lang,"So'rov tanlang va HTTP/HTTPS orasida almashtiring — tarmoqdagi kuzatuvchi (masalan ochiq WiFi'dagi xaker) nimani ko'ra olishini solishtiring:","Pick a request and switch between HTTP/HTTPS — compare what an observer on the network (e.g. a hacker on public WiFi) can actually see:")),
    React.createElement(HTTPSim),
    React.createElement(H2,{num:"§3"},t(lang,"Asosiy metodlar","The main methods")),
    React.createElement(LayerStack,{layers:[
      {n:"GET",name:"GET",color:"#3b82f6",desc:{uz:"Ma'lumot o'qish uchun — server holatini o'zgartirmaydi. Sahifa ochishning asosiy usuli.",en:"For reading data — doesn't change server state. The main way pages are loaded."}},
      {n:"POST",name:"POST",color:"#f59e0b",desc:{uz:"Yangi ma'lumot yuborish uchun — forma to'ldirish, login qilish, fayl yuklash.",en:"For sending new data — submitting a form, logging in, uploading a file."}},
      {n:"PUT",name:"PUT",color:"#a855f7",desc:{uz:"Mavjud resursni to'liq yangilash uchun.",en:"For fully replacing an existing resource."}},
      {n:"DELETE",name:"DELETE",color:"#ef4444",desc:{uz:"Resursni o'chirish uchun.",en:"For deleting a resource."}}
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"Status kod oilalari","Status code families")),
    React.createElement(LayerStack,{layers:[
      {n:"1xx",name:t(lang,"Axborot","Informational"),color:"#64748b",desc:{uz:"Jarayon davom etmoqda (kamdan-kam ko'rinadi). Masalan 100 Continue.",en:"The process is continuing (rarely seen). E.g. 100 Continue."}},
      {n:"2xx",name:t(lang,"Muvaffaqiyat","Success"),color:"#22c55e",desc:{uz:"So'rov bajarildi. 200 OK, 201 Created.",en:"The request succeeded. 200 OK, 201 Created."}},
      {n:"3xx",name:t(lang,"Yo'naltirish","Redirection"),color:"#3b82f6",desc:{uz:"Boshqa manzilga o'ting. 301 doimiy, 302 vaqtinchalik.",en:"Go somewhere else. 301 permanent, 302 temporary."}},
      {n:"4xx",name:t(lang,"Mijoz xatosi","Client error"),color:"#f59e0b",desc:{uz:"So'rovda muammo bor. 404 topilmadi, 403 taqiqlangan, 401 avtorizatsiya kerak.",en:"Something's wrong with the request. 404 not found, 403 forbidden, 401 needs auth."}},
      {n:"5xx",name:t(lang,"Server xatosi","Server error"),color:"#ef4444",desc:{uz:"Server o'z ishini bajara olmadi. 500 ichki xato, 503 vaqtincha ishlamayapti.",en:"The server failed to do its job. 500 internal error, 503 temporarily unavailable."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"HTTP vs HTTPS — nega TLS muhim","HTTP vs HTTPS — why TLS matters")),
    React.createElement(P,null,t(lang,"HTTPS shunchaki HTTP + TLS shifrlash (TLS haqida to'liq — L15 darsida). Farq faqat «tezlik» yoki «ko'rinish» emas — HTTP'da so'rovning O'ZI (metod, yo'l, formaga kiritilgan har qanday ma'lumot, cookie'lar) yo'lda ochiq matnda ketadi. Buni istalgan kishi — provayder, ochiq WiFi'dagi boshqa foydalanuvchi, yo'ldagi router — ko'ra oladi.","HTTPS is simply HTTP + TLS encryption (full details in L15). The difference isn't just «speed» or «appearance» — with HTTP the request ITSELF (the method, path, any data typed into a form, cookies) travels in plain text. Anyone — your ISP, another user on public WiFi, a router along the way — can see it.")),
    React.createElement(CompareCols,{
      left:{title:"HTTP",color:"#ef4444",rows:[{uz:"✗ Butun so'rov ochiq matnda",en:"✗ The whole request is plain text"},{uz:"✗ Parol, cookie ham ko'rinadi",en:"✗ Passwords and cookies are visible too"},{uz:"Port 80 (odatiy)",en:"Port 80 (default)"}]},
      right:{title:"HTTPS",color:"#22c55e",rows:[{uz:"✓ TLS bilan to'liq shifrlangan",en:"✓ Fully encrypted with TLS"},{uz:"✓ Faqat sizu server ma'nosini biladi",en:"✓ Only you and the server know the content"},{uz:"Port 443 (odatiy), qulf 🔒",en:"Port 443 (default), padlock 🔒"}]}}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Ochiq WiFi'da HTTP saytga hech qachon parol kiritmang — u shifrlanmagan uzatiladi. Manzil satrida doim qulf 🔒 (HTTPS) borligini tekshiring.","Never enter a password on an HTTP site over public WiFi — it's sent unencrypted. Always check for the padlock 🔒 (HTTPS) in the address bar.")),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: haqiqiy so'rovni ko'rish","Practice: inspecting a real request")),
    React.createElement(P,null,t(lang,"curl -I faqat javob sarlavhalarini oladi; curl -v esa yuborilgan SO'ROVNI ham ko'rsatadi — simulyatordagi «BROWSER → SERVER» qatorining aynan o'zi.","curl -I fetches only the response headers; curl -v also shows the REQUEST that was sent — exactly like the «BROWSER → SERVER» line in the simulator.")),
    React.createElement(Terminal,null,"curl -I https://example.com\n# HTTP/2 200\n# server: nginx/1.18.0\n# content-type: text/html; charset=UTF-8\n\ncurl -v https://example.com 2>&1 | head -8\n# > GET / HTTP/2                    ← yuborilgan so'rov\n# > Host: example.com\n# < HTTP/2 200                      ← qaytgan javob"),
    React.createElement(Quiz,{q:{uz:"HTTPS ni HTTP dan farqlovchi asosiy narsa nima?",en:"What mainly sets HTTPS apart from HTTP?"},opts:[{uz:"Tezroq",en:"Faster"},{uz:"TLS bilan shifrlaydi",en:"Encrypts with TLS"},{uz:"Rasmlarni yaxshi ko'rsatadi",en:"Shows images better"},{uz:"Faqat mobil",en:"Mobile only"}],correct:1,exp:{uz:"HTTPS = HTTP + TLS shifrlash — yo'lda kim eshitsa ham so'rov/javob mazmunini (metod, yo'l, forma ma'lumoti) o'qiy olmaydi.",en:"HTTPS = HTTP + TLS encryption — anyone listening in transit can't read the request/response content (method, path, form data)."}}));
}
function LessonL06(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"ARP nima?","What is ARP?")),
    React.createElement(P,null,t(lang,"ARP (Address Resolution Protocol) mantiqiy IP manzilni fizik MAC manzilga bog'laydi. IP — qurilmaning «uy manzili» (o'zgarishi mumkin), MAC — tarmoq kartasiga ishlab chiqaruvchi tomonidan yozilgan doimiy «pasport raqami». Bir tarmoqdagi ikki qurilma bevosita gaplashishi uchun MAC manzil shart — ARP aynan shuni topib beradi.","ARP (Address Resolution Protocol) links a logical IP address to a physical MAC address. IP is a device's «home address» (it can change), MAC is the permanent «passport number» burned into the network card by its maker. Two devices on the same network need the MAC to talk directly — and ARP is what finds it.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: broadcast vs kesh","Interactive simulator: broadcast vs cache")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — birinchi so'rov nega BUTUN tarmoqqa yuborilishini va keyingi so'rov nega tezroq bo'lishini solishtiring:","Try both scenarios — compare why the first query is sent to the WHOLE network, and why the next one is faster:")),
    React.createElement(ARPSim),
    React.createElement(H2,{num:"§3"},t(lang,"ARP Request va Reply","ARP Request and Reply")),
    React.createElement(CompareCols,{
      left:{title:{uz:"ARP Request","en":"ARP Request"},color:"#3b82f6",rows:[{uz:"Broadcast — LAN dagi HAMMAGA",en:"Broadcast — to EVERYONE on the LAN"},{uz:"Ethernet manzili: FF:FF:FF:FF:FF:FF",en:"Ethernet address: FF:FF:FF:FF:FF:FF"},{uz:"«Bu IP kimda?»",en:"«Who has this IP?»"}]},
      right:{title:{uz:"ARP Reply",en:"ARP Reply"},color:"#22c55e",rows:[{uz:"Unicast — faqat so'rovchiga",en:"Unicast — only to the asker"},{uz:"Faqat IP egasi javob beradi",en:"Only the IP's owner replies"},{uz:"«Bu men, MAC im shu»",en:"«It's me, here's my MAC»"}]}}),
    React.createElement(P,null,t(lang,"Muhim nuans: ARP so'rovi Ethernet darajasida broadcast bo'lgani uchun, LAN dagi barcha qurilmalar uni «eshitadi» — hatto egasi bo'lmaganlar ham. Bu ARP ni ishonchga asoslangan (hech kim javobni tekshirmaydi) va shu bilan birga zaif qiladi.","An important nuance: because an ARP request is a broadcast at the Ethernet level, every device on the LAN «hears» it — even ones that aren't the owner. This makes ARP trust-based (no one verifies the reply) — and therefore vulnerable.")),
    React.createElement(H2,{num:"§4"},t(lang,"Nega bu xavfsizlik uchun muhim","Why this matters for security")),
    React.createElement(P,null,t(lang,"ARP javobni HECH QANDAY tarzda tekshirmaydi — birinchi kelgan «men shu MAC man» javobiga ishonadi. Agar tarmoqdagi hujumchi haqiqiy egasidan OLDIN yoki undan ko'proq soxta javob yuborsa, qurbon uni haqiqiy deb qabul qiladi. Bu — «ARP spoofing» deb ataladi va to'liq tafsilot L24-darsda.","ARP performs NO verification of a reply — it trusts whichever «I'm that MAC» response arrives first. If an attacker on the network sends a fake reply before (or more often than) the real owner, the victim accepts it as genuine. This is called «ARP spoofing», covered in full detail in L24.")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"ARP faqat lokal tarmoq (bir xil segment) ichida ishlaydi — routerdan narigi tomonga o'tmaydi. Shu sababli ARP spoofing faqat bir xil LAN/WiFi ichidagi qurilmalarga xavfli.","ARP only works within the local network (the same segment) — it never crosses a router. That's why ARP spoofing is only a threat to devices on the same LAN/WiFi.")),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: ARP jadvalini ko'rish","Practice: viewing the ARP table")),
    React.createElement(Terminal,null,"arp -a\n# ? (192.168.1.1)  at 00:11:22:33:44:55 [ether] on eth0  ← router\n# ? (192.168.1.5)  at aa:bb:cc:dd:ee:ff [ether] on eth0  ← C\n\nip neigh          # zamonaviy muqobil (Linux)\n# 192.168.1.5 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE"),
    React.createElement(Quiz,{q:{uz:"ARP nimani nimaga bog'laydi?",en:"What does ARP link to what?"},opts:[{uz:"Domen nomini IP ga",en:"A domain name to an IP"},{uz:"IP manzilni MAC ga",en:"An IP address to a MAC"},{uz:"Portni protokolga",en:"A port to a protocol"},{uz:"Parolni foydalanuvchiga",en:"A password to a user"}],correct:1,exp:{uz:"ARP mantiqiy IP manzilni fizik MAC manzilga bog'laydi — bir xil LAN ichida to'g'ridan-to'g'ri yetkazish uchun zarur.",en:"ARP links a logical IP address to a physical MAC address — needed for direct delivery within the same LAN."}}));
}
function LessonL07(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DHCP nima?","What is DHCP?")),
    React.createElement(P,null,t(lang,"DHCP (Dynamic Host Configuration Protocol) qurilmalarga IP manzilni avtomatik beradi — usiz har bir qurilma uchun IP ni qo'lda kiritishga to'g'ri kelardi. DHCP — mehmonxona qabulxonasi kabi: kelasiz, u sizga xona (IP manzil) va yo'l-yo'riq (gateway, DNS server) beradi, siz ketganingizda esa xona bo'shab qoladi.","DHCP (Dynamic Host Configuration Protocol) automatically hands devices an IP address — without it, you'd have to type one in by hand for every device. DHCP is like a hotel front desk: you arrive and it gives you a room (an IP) and directions (gateway, DNS server), and when you leave the room becomes free again.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: to'liq DORA vs yangilash","Interactive simulator: full DORA vs renewal")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — qurilma birinchi marta ulanganda va ijara muddati tugashiga yaqinlashganda nima farq qilishini solishtiring:","Try both scenarios — compare what's different when a device first connects versus when its lease is about to expire:")),
    React.createElement(DHCPSim),
    React.createElement(H2,{num:"§3"},t(lang,"DORA — to'rt bosqich","DORA — the four stages")),
    React.createElement(LayerStack,{layers:[
      {n:"D",name:"Discover",color:"#3b82f6",desc:{uz:"Client: «DHCP server bormi?» — broadcast, chunki hali IP yo'q.",en:"Client: «any DHCP server out there?» — a broadcast, since there's no IP yet."}},
      {n:"O",name:"Offer",color:"#a855f7",desc:{uz:"Server: «mana senga bir manzil» — vaqtincha zaxiralaydi.",en:"Server: «here's an address for you» — reserved temporarily."}},
      {n:"R",name:"Request",color:"#f59e0b",desc:{uz:"Client: «shu manzilni olaman» — bu ham broadcast (boshqa serverlar eshitadi).",en:"Client: «I'll take that one» — also a broadcast (other servers hear it too)."}},
      {n:"A",name:"Acknowledge",color:"#22c55e",desc:{uz:"Server: «tasdiqlandi, ijara N soat» — manzil rasman biriktirildi.",en:"Server: «confirmed, lease N hours» — the address is now officially assigned."}}
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"Ijara (lease) va uni yangilash","The lease and renewing it")),
    React.createElement(P,null,t(lang,"Berilgan IP abadiy emas — u ma'lum muddatga «ijaraga» beriladi (masalan 24 soat). Bu manzillarni tejaydi: agar qurilma tarmoqni tark etsa, uning manzili boshqasiga qayta beriladi. Ijara ikki muhim vaqt nuqtasiga ega: T1 (odatda ijaraning ~50% ida) — qurilma o'z serveriga to'g'ridan-to'g'ri (unicast) yangilash so'raydi; agar javob bo'lmasa, T2 da (~87.5%) broadcast orqali HAR QANDAY serverdan so'raydi.","The assigned IP isn't permanent — it's «leased» for a set time (e.g. 24 hours). This saves addresses: if a device leaves the network, its address becomes available again. A lease has two key timers: T1 (usually ~50% of the lease) — the device asks its own server directly (unicast) to renew; if there's no reply, at T2 (~87.5%) it broadcasts to ANY server.")),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: ijarani boshqarish","Practice: managing the lease")),
    React.createElement(P,null,t(lang,"dhclient joriy ijarani bekor qiladi yoki yangisini so'raydi. Windows'da xuddi shu vazifani ipconfig bajaradi.","dhclient releases the current lease or requests a new one. On Windows, ipconfig does the same job.")),
    React.createElement(Terminal,null,"# Linux\nsudo dhclient -r eth0   # eski ijarani qaytarish (DHCPRELEASE)\nsudo dhclient eth0      # yangi manzil so'rash (to'liq DORA)\nip a | grep inet\n# inet 192.168.1.50/24  ← DHCP bergan manzil\n\n# Windows\nipconfig /release\nipconfig /renew"),
    React.createElement(Quiz,{q:{uz:"DHCP DORA jarayonining to'g'ri tartibi?",en:"Correct order of the DHCP DORA process?"},opts:[{uz:"Discover → Offer → Request → Acknowledge",en:"Discover → Offer → Request → Acknowledge"},{uz:"Offer → Discover → Acknowledge → Request",en:"Offer → Discover → Acknowledge → Request"},{uz:"Request → Discover → Offer → Acknowledge",en:"Request → Discover → Offer → Acknowledge"},{uz:"Acknowledge → Request → Offer → Discover",en:"Acknowledge → Request → Offer → Discover"}],correct:0,exp:{uz:"DORA: Discover (so'rov) → Offer (taklif) → Request (tasdiq) → Acknowledge (yakun).",en:"DORA: Discover → Offer → Request → Acknowledge."}}));
}
function LessonL08(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Routing nima?","What is routing?")),
    React.createElement(P,null,t(lang,"Routing — paketlarni bir tarmoqdan boshqasiga yo'naltirish jarayoni. Router — tarmoqlararo «chorraha politsiyachisi»: har paketning manzilini ko'rib, to'g'ri yo'nalishga jo'natadi. Internet — millionlab routerlar orqali bog'langan tarmoqlar to'ri; hech bir router butun yo'lni bilmaydi, faqat «keyingi qadam» qayerga ekanini biladi.","Routing is the process of directing packets from one network to another. A router is the «traffic officer» between networks: it reads each packet's destination and sends it the right way. The internet is a web of networks joined by millions of routers; no single router knows the whole path, only where the «next step» is.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: bir xil tarmoq vs uzoq manzil","Interactive simulator: same network vs a distant destination")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — nega ba'zan router umuman kerak emasligini va uzoq manzilga borishda TTL nima uchun kamayib borishini ko'ring:","Try both scenarios — see why sometimes a router isn't needed at all, and why TTL decreases on the way to a distant destination:")),
    React.createElement(RoutingSim),
    React.createElement(H2,{num:"§3"},t(lang,"Marshrutlash jadvali va uzatish qarori","The routing table and the forwarding decision")),
    React.createElement(P,null,t(lang,"Har router o'z marshrutlash jadvaliga ega — «qaysi tarmoq qaysi interfeys/keyingi router orqali yetadi» ro'yxati. Bir nechta yozuv mos kelsa, ENG ANIQ (longest prefix match) tanlanadi — masalan 8.8.8.0/24 8.0.0.0/8 dan ustun turadi. Hech qanday aniq yozuv topilmasa, standart yo'l (0.0.0.0/0) ishlatiladi.","Every router has its own routing table — a list of «which network is reachable via which interface/next router». If several entries match, the MOST SPECIFIC one wins (longest prefix match) — e.g. 8.8.8.0/24 beats 8.0.0.0/8. If nothing matches at all, the default route (0.0.0.0/0) is used.")),
    React.createElement(Terminal,null,"ip route\n# default via 192.168.1.1 dev eth0     ← standart (hech narsa mos kelmasa)\n# 192.168.1.0/24 dev eth0 proto kernel  ← lokal tarmoq (eng aniq)\n# 10.8.0.0/24 via 192.168.1.1 dev eth0  ← VPN tarmog'i"),
    React.createElement(H2,{num:"§4"},t(lang,"Statik va dinamik marshrutlash","Static vs dynamic routing")),
    React.createElement(CompareCols,{
      left:{title:{uz:"Statik marshrut",en:"Static route"},color:"#f59e0b",rows:[{uz:"Administrator qo'lda kiritadi",en:"Admin enters it by hand"},{uz:"Kichik, o'zgarmas tarmoq uchun",en:"For small, stable networks"},{uz:"To'liq nazorat, lekin moslashmaydi",en:"Full control, but doesn't adapt"}]},
      right:{title:{uz:"Dinamik (RIP/OSPF/BGP)",en:"Dynamic (RIP/OSPF/BGP)"},color:"#3b82f6",rows:[{uz:"Routerlar bir-biridan avtomatik o'rganadi",en:"Routers learn from each other automatically"},{uz:"Katta, o'zgaruvchan tarmoqlar uchun",en:"For large, changing networks"},{uz:"Uzilishga tez moslashadi",en:"Adapts quickly to outages"}]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: yo'lni kuzatish","Practice: tracing the path")),
    React.createElement(P,null,t(lang,"traceroute aynan simulyatordagi mexanizmdan foydalanadi: TTL=1 bilan paket yuboradi, birinchi router uni rad etib xato qaytaradi (shu bilan o'zini oshkor qiladi), so'ng TTL=2, va hokazo — har hop shu tarzda ochiladi.","traceroute uses exactly the mechanism from the simulator: it sends a packet with TTL=1, the first router rejects it and reports back (revealing itself), then TTL=2, and so on — each hop is uncovered this way.")),
    React.createElement(Terminal,null,"traceroute 8.8.8.8\n#  1  192.168.1.1     1.2 ms   ← R1 (uy routeri)\n#  2  10.20.0.1       8.5 ms   ← R2 (ISP)\n#  3  72.14.exchange   12 ms   ← R3 (magistral)\n#  4  dns.google       15 ms   ← manzil"),
    React.createElement(Quiz,{q:{uz:"Router aniq yo'l topmasa, paketni qayerga yuboradi?",en:"With no specific route, where does a router send the packet?"},opts:[{uz:"O'chiradi",en:"Drops it"},{uz:"Default gateway ga",en:"To the default gateway"},{uz:"Orqaga qaytaradi",en:"Back to sender"},{uz:"DNS ga",en:"To DNS"}],correct:1,exp:{uz:"Aniq yo'l bo'lmasa, paket standart (default) yo'l — 0.0.0.0/0 — orqali default gateway ga yuboriladi.",en:"With no specific route, the packet is sent via the default route — 0.0.0.0/0 — to the default gateway."}}));
}
function LessonL09(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Switch nima?","What is a switch?")),
    React.createElement(P,null,t(lang,"Switch — lokal tarmoqdagi qurilmalarni bog'lovchi «aqlli tarqatgich». U har portdagi qurilmaning MAC manzilini o'rganib, ichki jadvalga yozadi va keyingi frame'larni faqat kerakli portga yuboradi. Eski «hub» esa hech narsani bilmasdi — kelgan signalni HAMMA portga takrorlar edi, xuddi butun sinfga baqirganday. Switch esa aniq odamga pichirlaydi.","A switch is the «smart distributor» connecting devices on a LAN. It learns each port's device MAC address, writes it to an internal table, and sends future frames only to the right port. An old «hub» knew nothing — it repeated every signal to EVERY port, like shouting to the whole classroom. A switch whispers to the exact person.")),
    React.createElement(NodeMap,{label:{uz:"Yulduz (star): hamma switchga ulanadi",en:"Star: everyone connects to the switch"},nodes:[[140,80,"SW"],[140,25],[205,50],[205,110],[140,135],[75,110],[75,50]],links:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]}),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: VLAN izolyatsiyasi vs hub","Interactive simulator: VLAN isolation vs a hub")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — VLAN bilan trafik nega faqat o'z bo'limiga yetishini va VLAN bo'lmasa (oddiy hub) nima xato ketishini solishtiring:","Try both scenarios — see why traffic with VLANs only reaches its own department, and what goes wrong without VLANs (a plain hub):")),
    React.createElement(VLANSim),
    React.createElement(H2,{num:"§3"},t(lang,"VLAN nima?","What is a VLAN?")),
    React.createElement(P,null,t(lang,"VLAN (Virtual LAN) bitta fizik switchni bir necha mustaqil mantiqiy tarmoqqa bo'ladi — katta ofisni devorlar bilan alohida xonalarga bo'lgandek. Bir xil switch'ga ulangan bo'lsa ham, turli VLAN'dagi portlar bir-birining broadcast trafigini UMUMAN ko'rmaydi — bu alohida fizik switch qo'ygandek samarali, lekin kabellarsiz.","A VLAN (Virtual LAN) splits one physical switch into several independent logical networks — like dividing a big office into separate rooms with walls. Even though connected to the same switch, ports on different VLANs never see each other's broadcast traffic at all — as effective as separate physical switches, but without the extra cabling.")),
    React.createElement(LayerStack,{layers:[
      {n:"10",name:t(lang,"VLAN 10","VLAN 10"),color:"#ef4444",desc:{uz:"Buxgalteriya — 10.0.10.0/24",en:"Accounting — 10.0.10.0/24"}},
      {n:"20",name:t(lang,"VLAN 20","VLAN 20"),color:"#3b82f6",desc:{uz:"IT bo'limi — 10.0.20.0/24",en:"IT department — 10.0.20.0/24"}},
      {n:"30",name:t(lang,"VLAN 30","VLAN 30"),color:"#22c55e",desc:{uz:"Mehmonlar — 10.0.30.0/24 (eng cheklangan)",en:"Guests — 10.0.30.0/24 (most restricted)"}}
    ]}),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,"Trunk: "),t(lang,"VLAN'lar orasida (masalan ikki switch orasida) trafikni tashiydigan maxsus port «trunk» deyiladi — u bir nechta VLAN'ni bitta jismoniy havola orqali, har frame'ni 802.1Q teg bilan belgilab tashiydi.","A special port that carries traffic between VLANs (e.g. between two switches) is called a «trunk» — it carries several VLANs over one physical link, tagging each frame with 802.1Q.")),
    React.createElement(H2,{num:"§4"},t(lang,"Hub, switch va router","Hub, switch and router")),
    React.createElement(LayerStack,{layers:[
      {n:"L1",name:t(lang,"Hub","Hub"),color:"#ef4444",desc:{uz:"Hamma portga takrorlaydi — eski, samarasiz va xavfsiz emas.",en:"Repeats to every port — old, inefficient and insecure."}},
      {n:"L2",name:t(lang,"Switch","Switch"),color:"#22c55e",desc:{uz:"MAC jadvali bo'yicha faqat kerakli portga (2-qatlam). VLAN bilan izolyatsiya qo'shadi.",en:"By MAC table, only to the right port (layer 2). VLANs add isolation on top."}},
      {n:"L3",name:t(lang,"Router","Router"),color:"#3b82f6",desc:{uz:"Tarmoqlar (shu jumladan VLAN'lar) orasida — 3-qatlam, IP asosida (L08 darsi).",en:"Between networks (including VLANs) — layer 3, IP-based (see L08)."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: VLAN'larni ko'rish","Practice: viewing VLANs")),
    React.createElement(P,null,t(lang,"Boshqariladigan switch'da VLAN sozlamalari va qaysi portlar qaysi VLAN'ga tegishli ekanini ko'rish mumkin.","On a managed switch you can see the VLAN configuration and which ports belong to which VLAN.")),
    React.createElement(Terminal,null,"# switchda (Cisco IOS uslubi)\nshow vlan brief\n# VLAN Name        Status   Ports\n# 10   Accounting  active   Gi0/1, Gi0/2\n# 20   IT          active   Gi0/3, Gi0/4\n# 30   Guest       active   Gi0/5\n# → VLAN 30 (mehmon) VLAN 10/20 trafigini ko'ra olmaydi"),
    React.createElement(Quiz,{q:{uz:"VLAN nima uchun ishlatiladi?",en:"What is a VLAN used for?"},opts:[{uz:"Internet tezligini oshirish",en:"Boosting internet speed"},{uz:"Bitta switchni mantiqan alohida tarmoqlarga bo'lish",en:"Logically splitting one switch into separate networks"},{uz:"Parol saqlash",en:"Storing passwords"},{uz:"IP berish",en:"Handing out IPs"}],correct:1,exp:{uz:"VLAN bitta fizik switchni bir necha mantiqiy tarmoqqa bo'ladi — bo'limlarni ajratib xavfsizlik va tartib beradi.",en:"A VLAN splits one physical switch into several logical networks — separating departments for security and order."}}));
}
function LessonL10(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"NAT nima?","What is NAT?")),
    React.createElement(P,null,t(lang,"NAT (Network Address Translation) ko'plab xususiy IP manzilni bitta ommaviy IP ga aylantiradi. Uydagi barcha qurilma (telefon, noutbuk, aqlli TV) internetga bitta ommaviy IP orqali chiqadi — ofis kommutatori kabi: tashqaridan bitta telefon raqami ko'rinadi, ichkarida esa ko'p ichki raqam bor.","NAT (Network Address Translation) turns many private IP addresses into one public IP. Every device at home (phone, laptop, smart TV) reaches the internet through a single public IP — like an office switchboard: one phone number is visible from outside, but there are many extensions inside.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: NAT jadvali","Interactive simulator: the NAT table")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — chiquvchi ulanishlar NAT jadvalini qanday to'ldirishini va kiruvchi javob shu jadval yordamida to'g'ri qurilmani qanday topishini ko'ring:","Try both scenarios — see how outbound connections fill the NAT table, and how an inbound reply uses that table to find the right device:")),
    React.createElement(NATSim),
    React.createElement(H2,{num:"§3"},t(lang,"Nega NAT kerak?","Why is NAT needed?")),
    React.createElement(P,null,t(lang,"IPv4 manzillari cheklangan (~4.3 milliard), qurilmalar esa milliardlab. NAT bitta ommaviy IP ni ko'p qurilma bilan ulashadi — bu manzillarni tejaydi va IPv6 ga to'liq o'tishni kechiktirishga yordam bergan asosiy omillardan biri bo'lgan. Qo'shimcha samara sifatida, ichki qurilmalar internetdan to'g'ridan-to'g'ri ko'rinmaydi.","IPv4 addresses are limited (~4.3 billion), while devices number in the billions. NAT shares one public IP among many devices — saving addresses, and it's one of the main reasons the full move to IPv6 has been delayed. As a side effect, internal devices aren't directly visible from the internet.")),
    React.createElement(H2,{num:"§4"},t(lang,"NAT turlari: SNAT, DNAT, PAT","NAT types: SNAT, DNAT, PAT")),
    React.createElement(LayerStack,{layers:[
      {n:"SNAT",name:t(lang,"Source NAT","Source NAT"),color:"#4dabf7",desc:{uz:"Chiquvchi: ichki IP → ommaviy IP. Simulyatordagi «Chiquvchi» ssenariysi aynan shu.",en:"Outbound: internal IP → public IP. Exactly the «Outbound» scenario in the simulator."}},
      {n:"DNAT",name:t(lang,"Destination NAT","Destination NAT"),color:"#69db7c",desc:{uz:"Kiruvchi: ommaviy → ichki server (port forwarding — masalan uy serveringizni ochish uchun).",en:"Inbound: public → internal server (port forwarding — e.g. to expose your home server)."}},
      {n:"PAT",name:t(lang,"Port Address Translation","Port Address Translation"),color:"#a855f7",desc:{uz:"Ko'p qurilma bitta ommaviy IP, lekin har biri boshqa tashqi port bilan ajratiladi.",en:"Many devices, one public IP, but each is distinguished by a different external port."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: NAT jadvalini ko'rish","Practice: viewing the NAT table")),
    React.createElement(P,null,t(lang,"Linux'da iptables NAT jadvalini boshqaradi; conntrack esa faol tarjima yozuvlarini (simulyatordagi jadval — jonli holatda) ko'rsatadi.","On Linux, iptables manages the NAT rules; conntrack shows the active translation entries (the table from the simulator — live)." )),
    React.createElement(Terminal,null,"sudo iptables -t nat -L -n\n# Chain POSTROUTING (policy ACCEPT)\n# MASQUERADE  all  --  192.168.1.0/24  0.0.0.0/0   ← SNAT/PAT qoidasi\n\nsudo conntrack -L | head -3\n# tcp 6 431999 ESTABLISHED src=192.168.1.6 dst=93.184.216.34\n#   sport=49500 dport=443 src=93.184.216.34 dst=203.0.113.7\n#   sport=443 dport=40002   ← aynan simulyatordagi B yozuvi"),
    React.createElement(Quiz,{q:{uz:"NAT ning asosiy foydasi nima?",en:"What is the main benefit of NAT?"},opts:[{uz:"Ma'lumotni shifrlaydi",en:"Encrypts data"},{uz:"Ko'p qurilmaga bitta ommaviy IP ni ulashadi",en:"Shares one public IP among many devices"},{uz:"DNS ni tezlashtiradi",en:"Speeds up DNS"},{uz:"Parolni tekshiradi",en:"Checks passwords"}],correct:1,exp:{uz:"NAT ko'plab xususiy manzilni bitta ommaviy IP ga aylantiradi — kam IPv4 ni tejaydi va ichki qurilmalarni yashiradi.",en:"NAT maps many private addresses to one public IP — saving scarce IPv4 and hiding internal devices."}}));
}
function LessonL11(){
  const lang=useLang();
  const maps=[
    {k:"star",label:{uz:"Star (yulduz) — eng keng tarqalgan",en:"Star — most common"},color:"#69db7c",nodes:[[140,80,"HUB"],[140,25],[205,50],[205,110],[140,135],[75,110],[75,50]],links:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]},
    {k:"bus",label:{uz:"Bus (shina) — bitta umumiy kabel",en:"Bus — one shared cable"},color:"#ff6b6b",nodes:[[40,80],[105,80],[175,80],[240,80]],links:[[0,1],[1,2],[2,3]]},
    {k:"ring",label:{uz:"Ring (halqa) — ma'lumot aylanadi",en:"Ring — data circulates"},color:"#ffd43b",nodes:[[140,25],[210,70],[185,140],[95,140],[70,70]],links:[[0,1],[1,2],[2,3],[3,4],[4,0]]},
    {k:"mesh",label:{uz:"Mesh (to'r) — ko'p yo'l, juda ishonchli",en:"Mesh — many paths, very reliable"},color:"#4dabf7",nodes:[[70,45],[210,45],[210,125],[70,125]],links:[[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]]},
  ];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Topologiya nima?","What is a topology?")),
    React.createElement(P,null,t(lang,"Tarmoq topologiyasi — qurilmalar bir-biriga qanday ulanganining «shakli». Shahar ko'chalarini turlicha rejalashtirish mumkin bo'lgani kabi, tarmoqni ham turli shakllarda qurish mumkin. Har birining afzallik va kamchiligi bor — ayniqsa bitta kabel uzilganda nima bo'lishi bo'yicha.","A network topology is the «shape» of how devices connect. Like a city's streets can be laid out differently, a network can be built in different shapes. Each has pros and cons — especially in what happens when one cable is cut.")),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy topologiyalar","Main topologies")),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}},
      maps.map(function(m,i){return React.createElement(NodeMap,{key:i,label:m.label,color:m.color,nodes:m.nodes,links:m.links});})),
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: kabel uzilsa nima bo'ladi?","Interactive simulator: what happens if a cable is cut?")),
    React.createElement(P,null,t(lang,"Har topologiyani tanlang va bitta kabel uzilganda aynan nechta qurilma tarmoqdan ajralishini ko'ring — bu topologiyalarni solishtirishning ASOSIY sababi:","Pick each topology and see exactly how many devices drop off the network when one cable is cut — this is the MAIN reason topologies are compared:")),
    React.createElement(TopoSim),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,t(lang,"Amalda: ","In practice: ")),t(lang,"zamonaviy tarmoqlar deyarli har doim Star topologiyasidan foydalanadi — bitta uzilish faqat bitta qurilmaga ta'sir qiladi, qolganlari ishlayveradi. Katta korxonalar esa muhim aloqalar uchun Mesh (yoki uning gibrid variantlari) qo'shadi.","modern networks almost always use Star topology — one break affects only one device, the rest keep working. Large enterprises add Mesh (or hybrid variants of it) for critical links.")),
    React.createElement(H2,{num:"§4"},t(lang,"Topologiyalarni solishtirish","Comparing topologies")),
    React.createElement(CompareCols,{left:{title:{uz:"Yulduz (Star)",en:"Star"},color:"#69db7c",rows:[{uz:"Markazda switch/router",en:"A switch/router in the center"},{uz:"Bitta uzilsa — faqat o'zi",en:"One fails — only itself"},{uz:"Eng keng tarqalgan",en:"The most common"},]},right:{title:{uz:"Halqa/Shina (Ring/Bus)",en:"Ring/Bus"},color:"#ff6b6b",rows:[{uz:"Bitta uzilish hammani buzadi",en:"One break can down all"},{uz:"Eski, kam ishlatiladi",en:"Old, rarely used"},{uz:"Kabel tejaydi",en:"Saves cabling"},]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: yetib borishni tekshirish","Practice: checking reachability")),
    React.createElement(P,null,t(lang,"ping qurilmaga yetib borish mumkinligini, traceroute yo'lni ko'rsatadi. Yulduz topologiyasida barcha yo'l markaziy qurilmadan o'tadi.","ping checks whether a device is reachable, traceroute shows the path. In a star topology every path goes through the central device.")),
    React.createElement(Terminal,null,"ping -c3 192.168.1.20\n# 64 bytes from 192.168.1.20: icmp_seq=1 ttl=64 time=0.8 ms\n# 3 packets transmitted, 3 received, 0% packet loss\nfping -a -g 192.168.1.0/24 2>/dev/null   # butun tarmoqni tez"),
React.createElement(Quiz,{q:{uz:"Qaysi topologiyada bitta qurilma uzilsa ham qolganlari ishlayveradi va u eng keng tarqalgan?",en:"In which topology do the rest keep working if one device fails, and which is most common?"},opts:[{uz:"Bus",en:"Bus"},{uz:"Star (yulduz)",en:"Star"},{uz:"Ring (halqa)",en:"Ring"},{uz:"Hech qaysi",en:"None"}],correct:1,exp:{uz:"Star da hamma markaziy switchга ulanadi — bitta uzilса boshqalarga ta'sir qilmaydi. Shu sababli eng keng tarqalgan.",en:"In Star everyone connects to a central switch — one failure doesn't affect others. That's why it's most common."}}));
}
function LessonL12(){
  const lang=useLang();
  const std=[["802.11n","WiFi 4","600 Mbps"],["802.11ac","WiFi 5",{uz:"bir necha Gbps",en:"several Gbps"}],["802.11ax","WiFi 6",{uz:"gavjum joyda yaxshi",en:"better in crowds"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Simsiz tarmoq nima?","What is a wireless network?")),
    React.createElement(P,null,t(lang,"WiFi — kabel o'rniga radio to'lqinlari orqali ma'lumot uzatadi. Qurilmangiz access point (router) bilan radio orqali gaplashadi. Havoda hamma «eshitishi» mumkin — devor orqasidagi qo'shni ham signalni qabul qiladi — shuning uchun shifrlash kabelli tarmoqdan ham muhimroq.","WiFi sends data over radio waves instead of cables. Your device talks to an access point (router) by radio. Anyone in the air can «hear» it — even a neighbor through the wall receives the signal — which is why encryption matters even more than on a wired network.")),
    React.createElement(PacketFlow,{from:{uz:"Qurilma",en:"Device"},to:{uz:"Access Point",en:"Access Point"},label:{uz:"radio to'lqin",en:"radio waves"}}),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: WPA2/WPA3 vs ochiq tarmoq","Interactive simulator: WPA2/WPA3 vs an open network")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — xavfsiz tarmoqqa ulanishda parolning o'zi nega hech qachon havoda uzatilmasligini va ochiq tarmoqda nega hamma narsa ochiq ekanini solishtiring:","Try both scenarios — see why the password itself is never transmitted over the air when joining a secure network, and why everything is exposed on an open one:")),
    React.createElement(WiFiSim),
    React.createElement(H2,{num:"§3"},t(lang,"WiFi standartlari","WiFi standards")),
    std.map(function(s,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--accent)",fontSize:11.5,minWidth:80}},s[0]),
      React.createElement("span",{style:{fontSize:12,fontWeight:600,color:"var(--text-0)",minWidth:56}},s[1]),
      React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},typeof s[2]==="string"?s[2]:t(lang,s[2].uz,s[2].en)));}),
    React.createElement(H2,{num:"§4"},t(lang,"WiFi shifrlash avlodlari","WiFi encryption generations")),
    React.createElement(LayerStack,{layers:[
      {n:"WEP",name:"WEP",color:"#ff6b6b",desc:{uz:"Buzilgan — statik kalit + zaif RC4. Bir necha daqiqada ochiladi. Ishlatmang.",en:"Broken — static key + weak RC4. Cracked within minutes. Do not use."}},
      {n:"WPA",name:"WPA",color:"#ffa94d",desc:{uz:"Eskirgan, zaif (TKIP) — WEP dan yaxshiroq, lekin hozir ishonchsiz.",en:"Outdated, weak (TKIP) — better than WEP, but untrustworthy today."}},
      {n:"WPA2",name:"WPA2",color:"#4dabf7",desc:{uz:"Ko'p yillik standart (AES + 4-way handshake). Hali ham xavfsiz.",en:"The long-time standard (AES + 4-way handshake). Still secure."}},
      {n:"WPA3",name:"WPA3",color:"#69db7c",desc:{uz:"Eng yangi — kuchsiz parolga ham chidamli (SAE). Tavsiya etiladi.",en:"The newest — resistant even to weak passwords (SAE). Recommended."}}
    ]}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"WEP ni hech qachon ishlatmang — bir necha daqiqada buziladi. Kamida WPA2, imkon bo'lsa WPA3 va kuchli parol qo'ying.","Never use WEP — it cracks in minutes. Use at least WPA2, ideally WPA3, with a strong password.")),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: atrofdagi tarmoqlar","Practice: nearby networks")),
    React.createElement(P,null,t(lang,"nmcli yaqin-atrofdagi WiFi tarmoqlarini va ularning xavfsizlik turini ko'rsatadi. Ochiq (--) yoki WEP tarmoq — jiddiy xavf belgisi.","nmcli shows nearby WiFi networks and their security type. An open (--) or WEP network is a serious risk sign.")),
    React.createElement(Terminal,null,"nmcli dev wifi list\n# SSID          SIGNAL  SECURITY\n# HomeNet       92      WPA2\n# Office_5G     78      WPA3\n# FreeWiFi      65      --      ← ochiq, xavfli!"),
React.createElement(Quiz,{q:{uz:"Uy WiFi uchun bugun qaysi shifrlash tavsiya etiladi?",en:"Which encryption is recommended for home WiFi today?"},opts:[{uz:"WEP",en:"WEP"},{uz:"Ochiq (shifrsiz)",en:"Open (none)"},{uz:"WPA2 yoki WPA3",en:"WPA2 or WPA3"},{uz:"HTTP",en:"HTTP"}],correct:2,exp:{uz:"WPA2 (yoki yangiroq WPA3) zamonaviy va xavfsiz. WEP buzilgan.",en:"WPA2 (or newer WPA3) is modern and secure. WEP is broken."}}));
}
function LessonL14(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"VPN nima?","What is a VPN?")),
    React.createElement(P,null,t(lang,"VPN (Virtual Private Network) — ochiq internet ustidan xavfsiz, shifrlangan «tunnel» quradi. Ma'lumotingiz ochiq tarmoqdan o'tsa ham, shifrlangan quvur ichida ketadi — gavjum ko'cha ostidagi yashirin yer osti yo'li kabi. Ikki narsani beradi: MAXFIYLIK (o'rtadagi hech kim — provayder, ochiq WiFi dagi xaker — ichini o'qiy olmaydi) va PRIVAT TARMOQQA KIRISH (uydan ofis tarmog'iga xuddi ichkarida turgandek ulanasiz).","A VPN (Virtual Private Network) builds a secure, encrypted «tunnel» over the public internet. Even crossing an open network, your data travels inside an encrypted pipe — like a hidden tunnel beneath a busy street. It gives two things: PRIVACY (no one in the middle — your ISP, a hacker on public WiFi — can read the contents) and PRIVATE-NETWORK ACCESS (you reach the office network from home as if you were inside).")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: VPN YO'Q vs YONIQ","Interactive simulator: VPN off vs on")),
    React.createElement(P,null,t(lang,"Paket sizdan saytga borishda o'rtadagi xaker/provayder yonidan o'tadi. Ikkala tugmani bosing va o'rtadagi kuzatuvchi NIMA ko'rishini solishtiring:","Your packet passes the hacker/ISP in the middle on its way to the site. Press both buttons and compare WHAT the middle observer sees:")),
    React.createElement(VPNSim),
    React.createElement(H2,{num:"§3"},t(lang,"VPN nima qiladi va NIMA qilmaydi","What a VPN does and does NOT do")),
    React.createElement(CompareCols,{
      left:{title:{uz:"✓ VPN himoyalaydi",en:"✓ A VPN protects"},color:"#22c55e",rows:[{uz:"Trafikni yo'lda shifrlaydi (provayder/WiFi ko'rmaydi)",en:"Encrypts traffic in transit (ISP/WiFi can't see)"},{uz:"Haqiqiy IP manzilingizni saytdan yashiradi",en:"Hides your real IP from the website"},{uz:"Privat (ofis) tarmoqqa xavfsiz ulaydi",en:"Securely connects you to a private (office) network"}]},
      right:{title:{uz:"✗ VPN himoyalamaydi",en:"✗ A VPN does NOT"},color:"#ef4444",rows:[{uz:"Sizni VPN provayderining o'zidan yashirmaydi (unga ishonasiz)",en:"Hide you from the VPN provider itself (you trust it)"},{uz:"Virus/fishing/zararli saytdan himoya qilmaydi",en:"Stop malware/phishing/malicious sites"},{uz:"VPN serveridan keyin trafik shifrsiz bo'lishi mumkin",en:"Encrypt traffic beyond the VPN server"}]}}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"VPN sizni to'liq «ko'rinmas» qilmaydi — u faqat trafikni yo'lda shifrlaydi. VPN provayderiga ishonishingiz kerak; bepul VPN lar ko'pincha ma'lumotingizni yig'adi yoki sotadi.","A VPN doesn't make you fully «invisible» — it only encrypts traffic in transit. You must trust the provider; free VPNs often collect or sell your data.")),
    React.createElement(H2,{num:"§4"},t(lang,"VPN protokollari","VPN protocols")),
    React.createElement(LayerStack,{layers:[
      {n:"WG",name:t(lang,"WireGuard","WireGuard"),color:"#22c55e",desc:{uz:"Zamonaviy va tavsiya etiladi. Juda kichik kod (~4000 qator — tekshirish oson), ChaCha20-Poly1305 shifri, UDP. Juda tez, Linux yadrosida.",en:"Modern and recommended. Very small codebase (~4,000 lines — easy to audit), ChaCha20-Poly1305, UDP. Very fast, in the Linux kernel."}},
      {n:"OVPN",name:t(lang,"OpenVPN","OpenVPN"),color:"#3b82f6",desc:{uz:"Yetuk va keng qo'llaniladi. OpenSSL (AES-GCM), TCP yoki UDP (port 1194). Juda moslashuvchan, lekin WireGuard'dan sekinroq.",en:"Mature and widely used. OpenSSL (AES-GCM), TCP or UDP (port 1194). Very flexible, but slower than WireGuard."}},
      {n:"IPsec",name:t(lang,"IPsec / IKEv2","IPsec / IKEv2"),color:"#a855f7",desc:{uz:"Sanoat standarti, 3-qatlamda ishlaydi. IKEv2 mobil uchun zo'r (tarmoq o'zgarsa tez qayta ulanadi). Ofis-ofis (site-to-site) uchun keng tarqalgan.",en:"Industry standard, works at layer 3. IKEv2 is great for mobile (reconnects fast when the network changes). Common for site-to-site."}},
      {n:"PPTP",name:t(lang,"PPTP / L2TP (eski)","PPTP / L2TP (legacy)"),color:"#ef4444",desc:{uz:"ESKIRGAN — PPTP buzilgan (MS-CHAPv2 zaif), ishlatmang. Faqat tarixiy misol uchun.",en:"OBSOLETE — PPTP is broken (weak MS-CHAPv2), do not use. Only a historical example."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Tunnel turlari","Tunnel types")),
    React.createElement(CompareCols,{
      left:{title:{uz:"Remote-access",en:"Remote-access"},color:"#3b82f6",rows:[{uz:"Bitta foydalanuvchi → tarmoq",en:"One user → a network"},{uz:"Masofadan ishlash (uydan ofisga)",en:"Remote work (home → office)"},{uz:"Odatda WireGuard/OpenVPN",en:"Usually WireGuard/OpenVPN"}]},
      right:{title:{uz:"Site-to-site",en:"Site-to-site"},color:"#22c55e",rows:[{uz:"Ofis ↔ ofis (tarmoq ↔ tarmoq)",en:"Office ↔ office (network ↔ network)"},{uz:"Doimiy tunnel, foydalanuvchi ilovasisiz",en:"A permanent tunnel, no user app"},{uz:"Odatda IPsec",en:"Usually IPsec"}]}}),
    React.createElement(P,null,t(lang,"Yana bir farq: to'liq tunnel (full-tunnel) — BARCHA trafik VPN orqali ketadi (xavfsizroq); bo'lingan tunnel (split-tunnel) — faqat ba'zi trafik VPN orqali, qolgani to'g'ridan-to'g'ri (tezroq, lekin kamroq himoyalangan).","One more distinction: full-tunnel — ALL traffic goes through the VPN (more secure); split-tunnel — only some traffic goes through the VPN, the rest goes directly (faster, but less protected).")),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: WireGuard","Practice: WireGuard")),
    React.createElement(P,null,t(lang,"WireGuard'da har tomon kalit juftligiga (private/public) ega. wg show tunnel holatini, so'nggi handshake va o'tgan trafikni ko'rsatadi; wg-quick tunnelni yoqadi/o'chiradi.","In WireGuard each side has a key pair (private/public). wg show displays the tunnel status, the last handshake and transferred traffic; wg-quick brings the tunnel up/down.")),
    React.createElement(Terminal,null,"sudo wg-quick up wg0            # tunnelni yoqish\nsudo wg show\n# interface: wg0   public key: xTIB...=   listening port: 51820\n# peer: 3.5.7.9:51820\n#   latest handshake: 12 seconds ago\n#   transfer: 1.24 MiB received, 890 KiB sent\nip a show wg0\n# inet 10.8.0.2/24               ← VPN ichidagi manzil"),
    React.createElement(Quiz,{q:{uz:"VPN YONIQ bo'lganda o'rtadagi xaker/provayder trafikda nimani ko'radi?",en:"With the VPN ON, what does the hacker/ISP in the middle see in the traffic?"},opts:[{uz:"Login va parolni ochiq matnda",en:"The login and password in plain text"},{uz:"Faqat tushunarsiz shifrlangan ma'lumot",en:"Only unreadable encrypted data"},{uz:"Hech narsa — internet o'chadi",en:"Nothing — the internet turns off"},{uz:"Faqat rasmlarni",en:"Only images"}],correct:1,exp:{uz:"VPN trafikni yo'lda shifrlaydi, shuning uchun o'rtadagi kuzatuvchi faqat tushunarsiz shifrlangan ma'lumotni ko'radi — login/parol himoyalangan.",en:"A VPN encrypts traffic in transit, so the middle observer sees only unreadable ciphertext — the login/password is protected."}}));
}
function LessonL15(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"SSL/TLS nima?","What is SSL/TLS?")),
    React.createElement(P,null,t(lang,"TLS — internetda ma'lumotni shifrlaydigan protokol; HTTPS dagi «S» harfi aynan shu (SSL — uning eski nomi). Brauzer manzil satridagi qulf 🔒 — TLS ishlayotganini bildiradi. U ikki muhim narsani beradi: MAXFIYLIK (o'rtadagi hech kim — provayder, xaker — trafikni o'qiy olmaydi) va ISHONCH (siz haqiqiy sayt bilan gaplashyapsiz, soxta bilan emas).","TLS is the protocol that encrypts data on the internet; it's the «S» in HTTPS (SSL is its old name). The padlock 🔒 in the address bar means TLS is active. It provides two key things: CONFIDENTIALITY (no one in the middle — ISP, hacker — can read the traffic) and TRUST (you're talking to the real site, not a fake).")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: TLS handshake","Interactive simulator: the TLS handshake")),
    React.createElement(P,null,t(lang,"Shifrlashdan oldin client va server «qo'l berishadi» (handshake) — shifrni kelishadi va serverning haqiqiyligini tekshiradi. Ikkala ssenariyni sinab ko'ring: xavfsiz ulanish va soxta sertifikatli MITM hujumi.","Before encrypting, the client and server «shake hands» (handshake) — they agree on a cipher and verify the server's identity. Try both scenarios: a secure connection and a fake-certificate MITM attack.")),
    React.createElement(TLSSim),
    React.createElement(H2,{num:"§3"},t(lang,"Sertifikat va ishonch zanjiri","Certificates and the chain of trust")),
    React.createElement(P,null,t(lang,"Sayt o'z haqiqiyligini «sertifikat» (raqamli pasport) bilan isbotlaydi. Sertifikatni ishonchli tashkilot — CA (Certificate Authority) imzolaydi. Ishonch zanjir bo'ylab quriladi: brauzer server sertifikatini oraliq CA gacha, undan Root CA gacha tekshiradi. Root CA lar brauzerga oldindan o'rnatilgan — shuning uchun soxta sertifikat darhol fosh bo'ladi.","A site proves it's genuine with a «certificate» (a digital passport). The certificate is signed by a trusted organization — a CA (Certificate Authority). Trust is built as a chain: the browser checks the server certificate up to an intermediate CA, then up to a Root CA. Root CAs are pre-installed in the browser — so a fake certificate is exposed instantly.")),
    React.createElement(LayerStack,{layers:[
      {n:"1",name:t(lang,"Root CA","Root CA"),color:"#22c55e",desc:{uz:"Brauzerga oldindan o'rnatilgan, eng ishonchli ildiz.",en:"Pre-installed in the browser, the most trusted root."}},
      {n:"2",name:t(lang,"Oraliq CA","Intermediate CA"),color:"#3b82f6",desc:{uz:"Root tomonidan imzolangan; server sertifikatlarini imzolaydi.",en:"Signed by the Root; signs server certificates."}},
      {n:"3",name:t(lang,"Server sertifikati","Server certificate"),color:"#a855f7",desc:{uz:"Oraliq CA imzolagan; aynan shu saytga (CN=example.com) tegishli.",en:"Signed by the intermediate CA; belongs to this exact site (CN=example.com)."}},
      {n:"✓",name:t(lang,"Ishonch zanjiri","Chain of trust"),color:"#f59e0b",desc:{uz:"Brauzer zanjirni Root gacha tekshiradi — biror bo'g'in ishonchsiz bo'lsa, ogohlantiradi.",en:"The browser verifies the chain up to the Root — if any link is untrusted, it warns."}}
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"SSL va TLS versiyalari","SSL and TLS versions")),
    React.createElement(CompareCols,{
      left:{title:{uz:"Eski (ishlatmang)",en:"Old (do not use)"},color:"#ef4444",rows:[{uz:"SSL 2.0 / 3.0 — buzilgan",en:"SSL 2.0 / 3.0 — broken"},{uz:"TLS 1.0 / 1.1 — eskirgan, zaif",en:"TLS 1.0 / 1.1 — outdated, weak"},{uz:"Ma'lum hujumlarga ochiq (POODLE, BEAST)",en:"Open to known attacks (POODLE, BEAST)"}]},
      right:{title:{uz:"Zamonaviy",en:"Modern"},color:"#22c55e",rows:[{uz:"TLS 1.2 — keng qo'llaniladi, xavfsiz",en:"TLS 1.2 — widely used, secure"},{uz:"TLS 1.3 — eng yangi, tezroq handshake",en:"TLS 1.3 — newest, faster handshake"},{uz:"Faqat kuchli shifrlar (AES-GCM, ChaCha20)",en:"Only strong ciphers (AES-GCM, ChaCha20)"}]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: sertifikatni tekshirish","Practice: inspecting a certificate")),
    React.createElement(P,null,t(lang,"openssl s_client server sertifikatini, uni kim imzolaganini (Issuer = CA), amal muddatini va TLS versiyasini ko'rsatadi. Ishonchli CA imzolamagan sertifikat — brauzerda ogohlantirish beradi.","openssl s_client shows the server certificate, who signed it (Issuer = CA), its validity and the TLS version. A certificate not signed by a trusted CA triggers a browser warning.")),
    React.createElement(Terminal,null,"openssl s_client -connect example.com:443 -brief\n# subject: CN=example.com                          ← sayt\n# issuer:  C=US, O=DigiCert Inc, CN=DigiCert TLS RSA CA   ← CA (imzolagan)\n# Protocol: TLSv1.3   Cipher: TLS_AES_256_GCM_SHA384\n# Verification: OK                                 ← zanjir ishonchli"),
    React.createElement(Quiz,{q:{uz:"TLS sertifikatini kim imzolaydi, shunda brauzer ishonadi?",en:"Who signs a TLS certificate so the browser trusts it?"},opts:[{uz:"Foydalanuvchi",en:"The user"},{uz:"Certificate Authority (CA)",en:"A Certificate Authority (CA)"},{uz:"Provayder",en:"The ISP"},{uz:"DNS server",en:"The DNS server"}],correct:1,exp:{uz:"Ishonchli CA sertifikatni imzolaydi. Brauzer CA lar ro'yxatini biladi — shuning uchun haqiqiy va soxta sertifikatni ajratadi va MITM hujumini to'sadi.",en:"A trusted CA signs the certificate. The browser knows the CA list — so it tells real from fake and blocks a MITM attack."}}));
}
function LessonL16(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"IDS va IPS nima?","What are IDS and IPS?")),
    React.createElement(P,null,t(lang,"IDS (Intrusion Detection System) tarmoqni kuzatib, shubhali harakatni aniqlaydi va ogohlantiradi. IPS (Intrusion Prevention System) bir qadam oldinga o'tadi — hujumni bloklaydi ham. Farq shunchaki «nima qiladi»da emas — ASOSIY farq ular tarmoqda QAYERDA turishida: IDS — signalizatsiya («o'g'ri kirdi!»), IPS — eshikni qulflaydigan qorovul.","An IDS (Intrusion Detection System) watches the network and alerts on suspicious activity. An IPS (Intrusion Prevention System) goes further — it also blocks the attack. The difference isn't just «what it does» — the KEY difference is WHERE each sits in the network: an IDS is an alarm («a burglar!»), an IPS is a guard that locks the door.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: bir xil hujum, ikki xil natija","Interactive simulator: the same attack, two different outcomes")),
    React.createElement(P,null,t(lang,"Xuddi shu zararli paketni IDS va IPS orqali yuboring — joylashuvning o'zi natijani qanday belgilashini ko'ring:","Send the exact same malicious packet through an IDS and an IPS — see how placement alone determines the outcome:")),
    React.createElement(IDSIPSSim),
    React.createElement(H2,{num:"§3"},t(lang,"IDS vs IPS — solishtiruv","IDS vs IPS — comparison")),
    React.createElement(CompareCols,{
      left:{title:"IDS",color:"#ffd43b",rows:[{uz:"Aniqlaydi + ogohlantiradi",en:"Detects + alerts"},{uz:"Trafik nusxasini ko'radi (passiv, out-of-band)",en:"Sees a copy of traffic (passive, out-of-band)"},{uz:"Hujumni TO'XTATMAYDI",en:"Does NOT stop the attack"}]},
      right:{title:"IPS",color:"#ff3a5e",rows:[{uz:"Aniqlaydi + bloklaydi",en:"Detects + blocks"},{uz:"Trafik ichidan o'tadi (inline)",en:"Sits inline in the traffic path"},{uz:"Real vaqtda TO'XTATADI",en:"Stops it in real time"}]}}),
    React.createElement(H2,{num:"§4"},t(lang,"Aniqlash usullari va joylashuv turlari","Detection methods and deployment types")),
    React.createElement(LayerStack,{layers:[
      {n:"sig",name:t(lang,"Signature","Signature"),color:"#4dabf7",desc:{uz:"Ma'lum hujum imzolari bilan solishtiradi — tez va aniq, lekin yangi hujumni o'tkazib yuboradi.",en:"Matches against known attack signatures — fast and precise, but misses brand-new attacks."}},
      {n:"anom",name:t(lang,"Anomaly","Anomaly"),color:"#69db7c",desc:{uz:"Odatiy xatti-harakatdan chetlanishni izlaydi — yangi hujumni ham tutadi, lekin ko'proq soxna signal beradi.",en:"Looks for deviation from normal behavior — catches new attacks too, but generates more false alarms."}},
      {n:"NIDS",name:"NIDS/NIPS",color:"#a855f7",desc:{uz:"Butun tarmoq segmentini kuzatadi (Snort, Suricata).",en:"Watches an entire network segment (Snort, Suricata)."}},
      {n:"HIDS",name:"HIDS/HIPS",color:"#ffd43b",desc:{uz:"Bitta xost ichida ishlaydi (OSSEC, Wazuh) — fayl o'zgarishi va jarayonlarni kuzatadi.",en:"Runs on a single host (OSSEC, Wazuh) — watches file changes and processes."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: ogohlantirishlarni ko'rish","Practice: viewing alerts")),
    React.createElement(P,null,t(lang,"Snort ma'lum hujum imzosiga mos trafikni ko'rganda ogohlantirish yozadi — bu simulyatordagi aynan «signature mos keldi» qadami.","Snort writes an alert when traffic matches a known attack signature — exactly the «signature matched» step from the simulator.")),
    React.createElement(Terminal,null,"# Snort qoida misoli (soddalashtirilgan):\nalert tcp any any -> 10.0.0.0/24 22 (msg:\"SSH urinishi\";)\n\n# Snort ogohlantirishi (fast alert formatida):\n# [**] [1:2100498:7] GPL ATTACK_RESPONSE id check [**]\n# [Priority: 2] {TCP} 10.0.0.9:445 -> 10.0.0.5:51324\n# → SMB hujumi shubhasi aniqlandi"),
React.createElement(Quiz,{q:{uz:"IDS va IPS o'rtasidagi asosiy farq nima?",en:"Key difference between IDS and IPS?"},opts:[{uz:"IDS tezroq",en:"IDS is faster"},{uz:"IPS hujumni bloklaydi, IDS faqat ogohlantiradi",en:"IPS blocks the attack, IDS only alerts"},{uz:"IDS faqat WiFi da",en:"IDS is WiFi-only"},{uz:"Farqi yo'q",en:"No difference"}],correct:1,exp:{uz:"IDS aniqlaydi va ogohlantiradi; IPS aniqlaydi va real vaqtda bloklaydi — chunki u yo'lning o'zida (inline) turadi.",en:"IDS detects and alerts; IPS detects and blocks in real time — because it sits right on the path (inline)."}}));
}
function LessonL17(){
  const lang=useLang();
  const A="#69db7c",D="#ff3a5e";
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DMZ nima? — Qal'a analogiyasi","What is a DMZ? — the castle analogy")),
    React.createElement(P,null,t(lang,"DMZ (Demilitarized Zone) — tarmog'ingizning «oraliq» yoki «bufer» hududi. O'zbekcha «qurolsizlantirilgan hudud», lekin IT sohasida atama o'z holicha ishlatiladi. Buni qal'a bilan tasavvur qiling: qal'a ICHI — bu LAN (podshoh, xazina, aholi ya'ni serverlar va xodimlar) — qattiq qo'riqlanadi. Qal'a TASHQARISI — bu Internet: savdogarlar ham, qaroqchilar (xakerlar) ham bor.","A DMZ (Demilitarized Zone) is your network's «buffer» area. In IT the term is used as-is. Picture a castle: the INSIDE is the LAN (the king, treasury, residents — i.e. servers and staff) — heavily guarded. The OUTSIDE is the Internet: both merchants and raiders (hackers) are out there.")),
    React.createElement(P,null,t(lang,"DMZ — darvoza oldidagi maxsus hovli. Siz savdo qilishingiz kerak (veb-saytingiz ishlashi kerak), shuning uchun darvoza tashqarisida, lekin baribir nazoratingizdagi alohida maydon qilasiz. Savdogarlar (foydalanuvchilar) shu hovliga kelib, sotuvchilaringiz (veb/pochta server) bilan ko'rishadi — lekin qal'a ichiga kira olmaydi. Yomon niyatli odam DMZ dagi serverni buzsa ham, o'rtada yana bitta devor (ikkinchi Firewall) borligi uchun LAN ga o'ta olmaydi.","The DMZ is a courtyard in front of the gate. You need to do business (your website must work), so you build a separate area outside the gate but still under your control. Merchants (users) come to this courtyard and meet your sellers (web/mail server) — but can't enter the castle. Even if an attacker breaks a DMZ server, a second wall (the inner firewall) stops them reaching the LAN.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator","Interactive simulator")),
    React.createElement(P,null,t(lang,"Quyidagi tugmalarni bosing — paket qaysi zonadan qayerga borishini va firewall qoidasi uni O'TKAZADI yoki BLOKLAYDI ekanini jonli ko'ring.","Click the buttons below — watch live where the packet travels between zones and whether the firewall rule ALLOWS or BLOCKS it.")),
    React.createElement(DMZSim),
    React.createElement(H2,{num:"§3"},t(lang,"DMZ qachon va nega ishlatiladi?","When and why is a DMZ used?")),
    React.createElement(P,null,t(lang,"Tashqi dunyo (Internet) uchun ochiq bo'lishi kerak bo'lgan xizmatlarni oddiy LAN ichida saqlash juda xavfli — chunki ular buzilsa, hujumchi to'g'ridan-to'g'ri ichki tarmoqqa tushadi. Shu sababli omma uchun ochiq serverlar DMZ ga joylashtiriladi:","Keeping services that must be reachable from the internet inside the plain LAN is very risky — if they're breached, the attacker lands straight in the internal network. That's why public-facing servers go in the DMZ:")),
    React.createElement(LayerStack,{layers:[
      {n:"🌍",name:t(lang,"Veb-server","Web server"),color:"#4dabf7",desc:{uz:"HTTP/HTTPS — sayt tashqaridan ochilishi kerak.",en:"HTTP/HTTPS — the site must be reachable from outside."}},
      {n:"📧",name:t(lang,"Pochta serveri","Mail server"),color:"#69db7c",desc:{uz:"SMTP/IMAP — xatlar kelib-ketishi kerak.",en:"SMTP/IMAP — mail must flow in and out."}},
      {n:"🔤",name:"DNS",color:"#a855f7",desc:{uz:"Tashqi nom so'rovlariga javob beradi.",en:"Answers external name queries."}},
      {n:"📁",name:"FTP",color:"#ffd43b",desc:{uz:"Tashqi fayl almashinuvi uchun.",en:"For external file exchange."}}
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"DMZ qoidalari qanday ishlaydi?","How the DMZ rules work")),
    React.createElement(P,null,t(lang,"Tarmoq ikkita firewall bilan ajratiladi. Qoidalar quyidagicha — eng muhimi qizil bilan belgilangan «DMZ→LAN taqiqlanadi»:","The network is split by two firewalls. The rules are as follows — the most important is the red «DMZ→LAN denied»:")),
    React.createElement("div",{style:{margin:"8px 0"}},
React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:6,background:"var(--surface)",border:"1px solid #69db7c44",borderLeft:"3px solid #69db7c",borderRadius:9}},React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:800,color:"#69db7c",minWidth:64}},"ALLOW"),React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,"Internet → DMZ: qisman (faqat kerakli portlar, masalan HTTP 80).","Internet → DMZ: partial (only needed ports, e.g. HTTP 80)."))),React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:6,background:"var(--surface)",border:"1px solid #ff3a5e44",borderLeft:"3px solid #ff3a5e",borderRadius:9}},React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:800,color:"#ff3a5e",minWidth:64}},"DENY"),React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,"Internet → LAN: barchasi yopiq.","Internet → LAN: everything blocked."))),React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:6,background:"var(--surface)",border:"1px solid #ff3a5e44",borderLeft:"3px solid #ff3a5e",borderRadius:9}},React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:800,color:"#ff3a5e",minWidth:64}},"DENY"),React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,"DMZ → LAN: QAT'IYAN taqiqlanadi — DMZ ga ishonib bo'lmaydi (eng muhim qoida!).","DMZ → LAN: strictly denied — the DMZ can't be trusted (the key rule!)."))),React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:6,background:"var(--surface)",border:"1px solid #69db7c44",borderLeft:"3px solid #69db7c",borderRadius:9}},React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:800,color:"#69db7c",minWidth:64}},"ALLOW"),React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,"LAN → DMZ: ruxsat (xodimlar serverni yangilaydi).","LAN → DMZ: allowed (staff update the server)."))),React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:6,background:"var(--surface)",border:"1px solid #69db7c44",borderLeft:"3px solid #69db7c",borderRadius:9}},React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:800,color:"#69db7c",minWidth:64}},"ALLOW"),React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,"LAN → Internet: ruxsat (xodimlar internetdan foydalanadi).","LAN → Internet: allowed (staff use the internet)."))),React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:6,background:"var(--surface)",border:"1px solid #ffd43b44",borderLeft:"3px solid #ffd43b",borderRadius:9}},React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:800,color:"#ffd43b",minWidth:64}},"PART"),React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,"DMZ → Internet: qisman (masalan yangilanish yuklab olish).","DMZ → Internet: partial (e.g. downloading updates)."))),),
    React.createElement(Terminal,null,"# Firewall qoidalari (soddalashtirilgan)\nALLOW  internet -> dmz_web   : 80,443\nDENY   internet -> lan       : ALL\nDENY   dmz       -> lan       : ALL      # ← eng muhim qoida\nALLOW  lan       -> dmz,internet : ALL"),
    React.createElement(H2,{num:"§5"},t(lang,"Uy routeridagi «DMZ Host» — bu haqiqiy DMZ emas!","The «DMZ Host» on a home router — not a real DMZ!")),
    React.createElement(P,null,t(lang,"Uy Wi-Fi routerlarida ham «DMZ» funksiyasi bor, lekin u haqiqiy DMZ EMAS. «DMZ Host» shunchaki bitta kompyuterning BARCHA portlarini internetga ochib yuborish (port forwarding'ning eng xavfli va oson yo'li). U qurilma baribir ichki tarmoqda (LAN) qoladi — agar unga virus tushsa, butun uy tarmog'ingizga tarqalishi mumkin.","Home Wi-Fi routers also have a «DMZ» feature, but it is NOT a real DMZ. «DMZ Host» simply exposes ALL ports of one computer to the internet (the most dangerous, easy form of port forwarding). That device still stays on the internal network (LAN) — if it gets infected, the malware can spread to your whole home network.")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Nima qilayotganingizni aniq bilmasangiz, uy routeringizda «DMZ Host» ni yoqmang — bu bitta qurilmani to'liq himoyasiz qoldiradi va butun tarmoqni xavf ostiga qo'yadi.","Don't enable «DMZ Host» on your home router unless you know exactly what you're doing — it leaves one device fully exposed and puts your whole network at risk.")),
    React.createElement(Quiz,{q:{uz:"DMZ ning eng muhim firewall qoidasi qaysi?",en:"What is the most important DMZ firewall rule?"},opts:[{uz:"Internet → DMZ ochiq",en:"Internet → DMZ open"},{uz:"DMZ → LAN QAT'IYAN taqiqlanadi",en:"DMZ → LAN is strictly denied"},{uz:"LAN → Internet yopiq",en:"LAN → Internet blocked"},{uz:"Hamma yo'nalish ochiq",en:"All directions open"}],correct:1,exp:{uz:"Eng muhim qoida — DMZ→LAN taqiqlash. Shunda hujumchi DMZ serverini buzsa ham, ichki maxfiy tarmoqqa (LAN) o'ta olmaydi.",en:"The key rule is denying DMZ→LAN. So even if an attacker breaks a DMZ server, they can't move into the sensitive internal network (LAN)."}}));
}
function LessonL18(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"802.1X va NAC nima?","What are 802.1X and NAC?")),
    React.createElement(P,null,t(lang,"802.1X — tarmoqqa jismoniy yoki simsiz kirishni nazorat qiluvchi standart. Qurilma switch portiga (yoki WiFi'ga) ulanganda «kim sen?» deb so'raladi va faqat tasdiqlanganlarga port ochiladi. NAC (Network Access Control) — shu g'oyaning kengroq nomi. Bu ofis eshigidagi qorovulga o'xshaydi — kirishdan oldin propuskingizni ko'rsatishingiz shart, hatto eshik ochiq bo'lsa ham.","802.1X is a standard that controls physical or wireless network access. When a device connects to a switch port (or WiFi), it's asked «who are you?», and the port only opens for verified devices. NAC (Network Access Control) is the broader name for this idea. It's like a guard at the office door — you must show your badge before entering, even if the door itself is unlocked.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: xodim vs noma'lum qurilma","Interactive simulator: staff vs an unknown device")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — to'g'ri hisobli xodim va bo'sh rozetkaga ulangan noma'lum qurilma uchun natija qanday farq qilishini ko'ring:","Try both scenarios — see how the outcome differs for a staff member with valid credentials versus an unknown device plugged into an empty jack:")),
    React.createElement(NACSim),
    React.createElement(H2,{num:"§3"},t(lang,"802.1X uch qismi","The three 802.1X parts")),
    React.createElement(LayerStack,{layers:[
      {n:"supplicant",name:t(lang,"Supplicant","Supplicant"),color:"#4dabf7",desc:{uz:"Kirmoqchi bo'lgan qurilma (mijoz) — noutbuk, telefon.",en:"The device trying to connect (client) — a laptop, a phone."}},
      {n:"authenticator",name:t(lang,"Authenticator","Authenticator"),color:"#69db7c",desc:{uz:"Switch/AP — «eshik qorovuli». O'zi qaror qilmaydi, faqat oraliq.",en:"The switch/AP — the «door guard». It doesn't decide anything, just relays."}},
      {n:"radius",name:t(lang,"RADIUS server","RADIUS server"),color:"#a855f7",desc:{uz:"Haqiqiy tekshiruvni bajaradi va qaysi VLAN'ga qo'yishni ham belgilaydi.",en:"Performs the actual verification, and can also decide which VLAN to assign."}}
    ]}),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,"RADIUS: "),t(lang,"markazlashtirilgan autentifikatsiya serveri — foydalanuvchi ma'lumotlarini tekshiradi va kirishga ruxsat beradi yoki rad etadi. Yirik tashkilotlarda keng qo'llanadi va bir vaqtning o'zida to'g'ri VLAN'ni ham belgilashi mumkin.","a centralized authentication server — checks credentials and grants or denies access. Widely used in large organizations, and can assign the correct VLAN at the same time.")),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: RADIUS jurnali","Practice: the RADIUS log")),
    React.createElement(P,null,t(lang,"802.1X qurilma tarmoqqa ulanishidan OLDIN uni tekshiradi — bu simulyatordagi jarayonning aynan o'zi. FreeRADIUS jurnali har urinishni yozib boradi.","802.1X checks a device BEFORE it joins the network — exactly the process from the simulator. The FreeRADIUS log records every attempt.")),
    React.createElement(Terminal,null,"# RADIUS log (freeradius) — muvaffaqiyatli:\n# rlm_ldap: user 'alice' authenticated\n# Access-Accept for user alice, VLAN=10\n\n# RADIUS log — rad etilgan:\n# rlm_ldap: user not found\n# Access-Reject for unknown supplicant, port remains closed"),
React.createElement(Quiz,{q:{uz:"802.1X da qurilmani haqiqiy tekshiruvdan o'tkazadigan qism qaysi?",en:"In 802.1X, which part performs the actual verification?"},opts:[{uz:"Supplicant (qurilma)",en:"The supplicant (device)"},{uz:"Authenticator (switch)",en:"The authenticator (switch)"},{uz:"Auth server (RADIUS)",en:"The auth server (RADIUS)"},{uz:"DNS server",en:"The DNS server"}],correct:2,exp:{uz:"RADIUS auth server login/parolni tekshiradi. Switch faqat \"eshik\", qurilma esa supplicant.",en:"The RADIUS auth server checks the credentials. The switch is just the \"door\", the device is the supplicant."}}));
}
function LessonL19(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Paket filtrlash nima?","What is packet filtering?")),
    React.createElement(P,null,t(lang,"Paket filtrlash — har paketni ko'rib, qoidalar asosida o'tkazish yoki bloklash. Har paketning manba/manzil IP si, porti va protokoli tekshiriladi — chegaradagi bojxona kabi. Filtrlashning eng muhim savoli: filtr har paketni ALOHIDA ko'radimi, yoki ulanish TARIXINI eslaydimi?","Packet filtering inspects each packet and allows or blocks it by rules. Each packet's source/destination IP, port and protocol are checked — like customs at a border. The most important question in filtering: does the filter judge each packet in ISOLATION, or does it remember the HISTORY of the connection?")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: javob trafigi muammosi","Interactive simulator: the return-traffic problem")),
    React.createElement(P,null,t(lang,"Chiquvchi so'rovga javob qaytganda ikkala filtr turi ham buni qanday ko'rishini solishtiring — bu stateful firewall'ning haqiqiy afzalligini ochib beradi:","Compare how each filter type sees a reply to an outbound request — this reveals the real advantage of a stateful firewall:")),
    React.createElement(StatefulSim),
    React.createElement(H2,{num:"§3"},t(lang,"Stateless va Stateful — solishtiruv","Stateless vs stateful — comparison")),
    React.createElement(CompareCols,{
      left:{title:{uz:"Stateless (holatsiz)",en:"Stateless"},color:"#4dabf7",rows:[{uz:"Har paketni alohida ko'radi",en:"Judges each packet alone"},{uz:"Kontekstsiz — javobni tanimaydi",en:"No context — doesn't recognize replies"},{uz:"Tez, lekin har yo'nalish uchun qoida kerak",en:"Fast, but needs a rule per direction"}]},
      right:{title:{uz:"Stateful (holatli)",en:"Stateful"},color:"#69db7c",rows:[{uz:"Ulanish holatini jadvalga yozadi",en:"Logs connection state in a table"},{uz:"Javob paketlarini avtomatik taniydi",en:"Automatically recognizes reply packets"},{uz:"Aqlliroq, xavfsizroq, boshqarish oson",en:"Smarter, safer, easier to manage"}]}}),
    React.createElement(H2,{num:"§4"},t(lang,"Paket filtrlash chuqurligi","Depth of packet filtering")),
    React.createElement(LayerStack,{layers:[
      {n:"L3-4",name:t(lang,"Stateless","Stateless"),color:"#ff6b6b",desc:{uz:"Har paketni alohida ko'radi — sodda, tez, lekin cheklangan.",en:"Sees each packet alone — simple, fast, but limited."}},
      {n:"conn",name:t(lang,"Stateful","Stateful"),color:"#69db7c",desc:{uz:"Ulanish kontekstini eslaydi (javob paketini biladi) — bugungi standart.",en:"Remembers connection context (knows reply packets) — today's standard."}},
      {n:"L7",name:t(lang,"Deep packet (DPI)","Deep packet (DPI)"),color:"#4dabf7",desc:{uz:"Paket MAZMUNINI ham tekshiradi (L7) — NGFW/WAF darajasi.",en:"Also inspects packet CONTENTS (L7) — NGFW/WAF level."}}
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: iptables qoidalari","Practice: iptables rules")),
    React.createElement(P,null,t(lang,"Quyidagi ikkinchi misol simulyatordagi «Stateful» ssenariysining aynan o'zi — bitta ctstate qoidasi barcha o'rnatilgan ulanish javoblarini qamrab oladi.","The second example below is exactly the simulator's «Stateful» scenario — one ctstate rule covers every reply to an established connection.")),
    React.createElement(Terminal,null,"# Oddiy (stateless) qoida — faqat bitta IP dan SSH:\nsudo iptables -A INPUT -p tcp -s 10.0.0.5 --dport 22 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 22 -j DROP\n\n# Stateful qoida — barcha o'rnatilgan ulanish javoblari:\nsudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT\nsudo iptables -A INPUT -j DROP   # qolgan hammasi"),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,t(lang,"Qoidalar tartibi muhim: ","Rule order matters: ")),t(lang,"birinchi mos kelgan qoida ishlaydi — aniq ALLOW umumiy DROP dan oldin turishi kerak (L13 darsini eslang).","the first matching rule wins — specific ALLOW must come before a general DROP (recall L13).")),
React.createElement(Quiz,{q:{uz:"Stateful firewall ning afzalligi nima?",en:"What advantage does a stateful firewall have?"},opts:[{uz:"Tezroq va soddaroq",en:"Faster and simpler"},{uz:"Ulanish holatini eslaydi va javob paketlarini taniydi",en:"Remembers connection state and recognizes replies"},{uz:"Shifrlaydi",en:"Encrypts"},{uz:"IP bermaydi",en:"Doesn't hand out IPs"}],correct:1,exp:{uz:"Stateful firewall ulanish kontekstini eslaydi — qonuniy javob paketlarini avtomatik taniydi, bu uni xavfsizroq va boshqarish osonroq qiladi.",en:"A stateful firewall remembers connection context — automatically recognizing legitimate replies, making it safer and easier to manage."}}));
}
function LessonL20(){
  const lang=useLang();
  const types=[["Forward",{uz:"Foydalanuvchilar nomidan internetga chiqadi (filtr, kesh, anonimlik)",en:"Goes out for users (filter, cache, anonymity)"},"#4dabf7"],["Reverse",{uz:"Serverlar oldida turadi (yukni taqsimlash, himoya, kesh)",en:"Sits in front of servers (load balancing, protection, cache)"},"#69db7c"],["Transparent",{uz:"Foydalanuvchi sezmaydi — tarmoq avtomatik yo'naltiradi",en:"User doesn't notice — network redirects automatically"},"#9775fa"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Proxy nima?","What is a proxy?")),
    React.createElement(P,null,t(lang,"Proxy server — siz va internet o'rtasidagi «vositachi». So'rovingiz avval proxy'ga boradi, u sizning nomingizdan serverga murojaat qiladi va javobni qaytaradi (kimdandir sizning o'rningizga xarid qilishni so'raganingizdek). Proxy'ning ikki asosiy turi bor va ular bir-biridan «kimning shaxsini yashirishi» bilan tubdan farq qiladi.","A proxy server is a «middleman» between you and the internet. Your request goes to the proxy first, which contacts the server on your behalf and returns the reply (like asking someone to shop for you). There are two main types of proxy, and they differ fundamentally in «whose identity they hide».")),
    React.createElement(PacketFlow,{from:{uz:"Siz",en:"You"},to:{uz:"Server",en:"Server"},label:{uz:"Proxy (vositachi)",en:"Proxy (middleman)"}}),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: kim kimdan yashiringan?","Interactive simulator: who is hidden from whom?")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — forward proxy mijozni serverdan qanday yashirishini, reverse proxy esa serverni mijozdan qanday yashirishini ko'ring:","Try both scenarios — see how a forward proxy hides the client from the server, and how a reverse proxy hides the server from the client:")),
    React.createElement(ProxySim),
    React.createElement(H2,{num:"§3"},t(lang,"Proxy turlari","Types of proxy")),
    types.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,alignItems:"center",padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid "+x[2]+"44",borderLeft:"3px solid "+x[2],borderRadius:10,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontWeight:700,fontSize:12.5,color:x[2],minWidth:100}},x[0]),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(H2,{num:"§4"},t(lang,"Forward va reverse proxy","Forward vs reverse proxy")),
    React.createElement(CompareCols,{left:{title:{uz:"Forward proxy",en:"Forward proxy"},color:"#4dabf7",rows:[{uz:"Mijozlar oldida turadi",en:"Sits in front of clients"},{uz:"Foydalanuvchini yashiradi",en:"Hides the user"},{uz:"Filtrlash/keshlash",en:"Filtering/caching"},]},right:{title:{uz:"Reverse proxy",en:"Reverse proxy"},color:"#69db7c",rows:[{uz:"Serverlar oldida turadi",en:"Sits in front of servers"},{uz:"Serverni yashiradi/himoya qiladi",en:"Hides/protects the server"},{uz:"Yuk taqsimlash (LB), TLS",en:"Load balancing, TLS"},]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: reverse proxy sarlavhasi","Practice: reverse-proxy headers")),
    React.createElement(P,null,t(lang,"Reverse proxy (nginx, HAProxy, Cloudflare) haqiqiy serverni internetdan yashiradi, yukni taqsimlaydi va TLS ni boshqaradi. Javob sarlavhalari ko'pincha proxy ekanini oshkor qiladi.","A reverse proxy (nginx, HAProxy, Cloudflare) hides the real server from the internet, distributes load and handles TLS. Response headers often reveal the proxy.")),
    React.createElement(Terminal,null,"curl -I https://site.com\n# server: nginx            ← reverse proxy\n# x-cache: HIT             ← keshdan berildi\n# via: 1.1 varnish         ← oldida yana kesh bor"),
React.createElement(Quiz,{q:{uz:"Reverse proxy asosan kimni himoya qiladi?",en:"What does a reverse proxy mainly protect?"},opts:[{uz:"Foydalanuvchilarni",en:"The users"},{uz:"Orqadagi serverlarni",en:"The backend servers"},{uz:"DNS ni",en:"DNS"},{uz:"Hech kimni",en:"No one"}],correct:1,exp:{uz:"Reverse proxy serverlar oldida turadi — ularni yashiradi, hujumlarni to'sadi va yukni taqsimlaydi.",en:"A reverse proxy sits in front of servers — hiding them, absorbing attacks and balancing load."}}));
}
function LessonL21(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Zero Trust nima?","What is Zero Trust?")),
    React.createElement(P,null,t(lang,"Zero Trust — «hech kimga ishonma, doim tekshir» tamoyili. Eski model tarmoq ichidagini avtomatik ishonchli deb bilardi — xuddi qal'a devori kabi: bir marta ichkariga kirsangiz, hamma narsaga erkin kirish bor edi. Zero Trust esa har bir so'rovni — hatto ichkaridan bo'lsa ham — alohida tekshiradi. Bu DMZ (L17) g'oyasining mantiqiy davomi: perimetrga ishonish o'rniga, HAR resursning o'z chegarasi bor.","Zero Trust means «never trust, always verify». The old model auto-trusted anything inside the network — like a castle wall: once you were in, you had free access to everything. Zero Trust checks every request individually — even from inside. It's the logical continuation of the DMZ idea (L17): instead of trusting the perimeter, EVERY resource has its own boundary.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: bitta buzilgan qurilmadan keyin nima bo'ladi?","Interactive simulator: what happens after one device is compromised?")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — xuddi shu boshlang'ich buzilish eski model va Zero Trust'da qanday tubdan farqli oqibatga olib kelishini ko'ring:","Try both scenarios — see how the exact same initial breach leads to radically different outcomes under the old model versus Zero Trust:")),
    React.createElement(ZeroTrustSim),
    React.createElement(H2,{num:"§3"},t(lang,"Har so'rov qanday tekshiriladi","How every request is checked")),
    React.createElement(FlowSteps,{title:{uz:"Zero Trust tekshiruvi",en:"Zero Trust check"},steps:[
      {icon:"👤",text:{uz:"Kim? — foydalanuvchi shaxsi tasdiqlanadi (MFA)",en:"Who? — user identity verified (MFA)"}},
      {icon:"💻",text:{uz:"Qanday qurilma? — holati (posture) tekshiriladi",en:"What device? — its posture is checked"}},
      {icon:"📍",text:{uz:"Qayerdan? — kontekst (joy, vaqt, xatti-harakat)",en:"From where? — context (location, time, behavior)"}},
      {icon:"🔑",text:{uz:"Faqat kerakli resursga minimal ruxsat beriladi",en:"Minimal access granted to just the needed resource"}},
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"Zero Trust tamoyillari","Zero Trust principles")),
    React.createElement(LayerStack,{layers:[
      {n:"verify",name:t(lang,"Har doim tekshir","Always verify"),color:"#ff3a5e",desc:{uz:"Ichki tarmoqqa ham ishonma — har so'rov tekshiriladi.",en:"Trust nothing, even internal — verify every request."}},
      {n:"least",name:t(lang,"Eng kam imtiyoz","Least privilege"),color:"#69db7c",desc:{uz:"Faqat zarur kirish beriladi — hech kim keragidan ortiq huquqqa ega bo'lmaydi.",en:"Grant only the access needed — no one has more rights than necessary."}},
      {n:"micro",name:t(lang,"Mikrosegmentatsiya","Micro-segmentation"),color:"#4dabf7",desc:{uz:"Tarmoq kichik izolyatsiyalangan bo'laklarga bo'linadi — L09 VLAN g'oyasi kengaytirilgan.",en:"The network is split into small isolated segments — an extension of the L09 VLAN idea."}},
      {n:"assume",name:t(lang,"Buzilishni faraz qil","Assume breach"),color:"#a855f7",desc:{uz:"Hujumchi allaqachon ichkarida deb ishlang — bu simulyatordagi asosiy g'oya.",en:"Work as if the attacker is already inside — the core idea in the simulator."}}
    ]}),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,t(lang,"Oddiy misol: ","Simple example: ")),t(lang,"eski model: ofisga kirsangiz hamma xonaga kirasiz. Zero Trust: har xona eshigi alohida propuskingizni tekshiradi.","old model: once in the office you can enter any room. Zero Trust: each room's door checks your badge separately.")),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: siyosat qoidasi","Practice: a policy rule")),
    React.createElement(P,null,t(lang,"Bu — simulyatordagi «tekshiruv» bosqichining aynan matn ko'rinishi: har shart (kim, qurilma, MFA) birga bajarilishi shart, aks holda rad etiladi.","This is the exact text form of the simulator's «check» step: every condition (who, device, MFA) must be satisfied together, or access is denied.")),
    React.createElement(Terminal,null,"# Zero Trust siyosati (soddalashtirilgan)\nIF user=alice AND device=managed AND mfa=passed\n  THEN allow -> app:payroll   # faqat shu resurs, faqat shu safar\nELSE deny + log                # har so'rov qayta baholanadi"),
React.createElement(Quiz,{q:{uz:"Zero Trust ning asosiy shiori qanday?",en:"What is the core motto of Zero Trust?"},opts:[{uz:"Ichkaridagi hammaga ishon",en:"Trust everyone inside"},{uz:"Hech kimga ishonma, doim tekshir",en:"Never trust, always verify"},{uz:"Faqat parolga ishon",en:"Trust only the password"},{uz:"Devor yetarli",en:"A wall is enough"}],correct:1,exp:{uz:"Zero Trust \"hech kimga ishonma, doim tekshir\" — har so'rov, ichkaridan bo'lsa ham, tasdiqlanadi.",en:"Zero Trust is \"never trust, always verify\" — every request, even from inside, is confirmed."}}));
}
function LessonL23(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Enumeratsiya nima?","What is enumeration?")),
    React.createElement(P,null,t(lang,"Enumeratsiya — nishon haqida iloji boricha ko'proq ma'lumot to'plash: qaysi qurilma, xizmat, foydalanuvchi bor. Bosqindan oldin bino rejasini o'rganishga o'xshaydi. Port skanerlashdan bir qadam keyingi — chuqurroq «kim, nima, qayerda». Har bir yig'ilgan ma'lumot bo'lagi keyingi hujum qadamini osonlashtiradi.","Enumeration gathers as much as possible about a target: which devices, services and users exist. Like studying a building's floor plan before entering. One step beyond port scanning — a deeper «who, what, where». Every piece of gathered information makes the next attack step easier.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: qancha ma'lumot oshkor bo'ladi?","Interactive simulator: how much gets exposed?")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — xuddi shu 4 ta vosita (nmap, smbclient, enum4linux) yomon sozlangan va qattiqlashtirilgan tizimda qanday farqli natija berishini ko'ring:","Try both scenarios — see how the exact same 4 tools (nmap, smbclient, enum4linux) produce very different results against a poorly configured versus a hardened system:")),
    React.createElement(EnumSim),
    React.createElement(H2,{num:"§3"},t(lang,"Nimani sanash kerak","What to enumerate")),
    React.createElement(LayerStack,{layers:[
      {n:"hosts",name:t(lang,"Xostlar","Hosts"),color:"#4dabf7",desc:{uz:"Tirik qurilmalar va ularning IP/OS.",en:"Live devices and their IP/OS."}},
      {n:"svc",name:t(lang,"Xizmatlar","Services"),color:"#69db7c",desc:{uz:"Ochiq portlardagi dastur+versiya.",en:"Program+version on open ports."}},
      {n:"shares",name:t(lang,"Ulashmalar","Shares"),color:"#ffd43b",desc:{uz:"Ochiq papkalar va ruxsatlar (SMB, NFS).",en:"Open folders and permissions (SMB, NFS)."}},
      {n:"users",name:t(lang,"Foydalanuvchilar","Users"),color:"#a855f7",desc:{uz:"SMB/SNMP/LDAP orqali hisob nomlari.",en:"Account names via SMB/SNMP/LDAP."}}
    ]}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Enumeratsiya faqat sizga tegishli yoki yozma ruxsat berilgan tarmoqlarda o'tkazilishi kerak.","Enumeration must only be done on networks you own or have written authorization to test.")),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: xizmatlarni sanash","Practice: enumerating services")),
    React.createElement(P,null,t(lang,"Bu buyruqlar aynan simulyatordagi «Yomon sozlangan tizim» ssenariysida ishlatilgan vositalar — real chiqishlar bilan.","These are exactly the tools used in the simulator's «Poorly configured system» scenario — with real output.")),
    React.createElement(Terminal,null,"nmap -sV -sC 10.0.0.5\nsmbclient -L //10.0.0.5 -N\nnmap --script smb-enum-shares,smb-os-discovery 10.0.0.5\n# | smb-os-discovery: Windows Server 2016\n# | smb-enum-shares:\n# |   \\\\10.0.0.5\\backups: READ/WRITE  ← ochiq ulashma"),
React.createElement(Quiz,{q:{uz:"Enumeratsiya bosqichining asosiy maqsadi nima?",en:"Main goal of the enumeration phase?"},opts:[{uz:"Ma'lumotni shifrlash",en:"Encrypting data"},{uz:"Nishon haqida iloji boricha ko'proq ma'lumot to'plash",en:"Gathering as much info about the target as possible"},{uz:"Faylni o'chirish",en:"Deleting a file"},{uz:"IP berish",en:"Handing out IPs"}],correct:1,exp:{uz:"Enumeratsiya — nishon tarmoq haqida (xostlar, xizmatlar, foydalanuvchilar) chuqur ma'lumot to'plash bosqichi.",en:"Enumeration is the phase of gathering deep information about the target (hosts, services, users)."}}));
}
function LessonL24(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"ARP spoofing nima?","What is ARP spoofing?")),
    React.createElement(P,null,t(lang,"ARP spoofing — hujumchi soxta ARP javoblari yuborib, o'zini boshqa qurilma (odatda router/gateway) qilib ko'rsatadi. ARP javobni tekshirmaydi (L06 darsini eslang) — aynan shu zaiflikdan foydalaniladi: qurbon trafigi bilmagan holda hujumchi orqali oqa boshlaydi.","ARP spoofing is when an attacker sends fake ARP replies to impersonate another device (usually the router/gateway). ARP doesn't verify replies (recall L06) — that exact weakness is exploited: the victim's traffic unknowingly starts flowing through the attacker.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: himoyasiz vs DAI","Interactive simulator: undefended vs DAI")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — qurbonning ARP jadvali zaharlanishini va Dynamic ARP Inspection (DAI) buni qanday to'xtatishini jonli ko'ring:","Try both scenarios — watch the victim's ARP table get poisoned live, and see how Dynamic ARP Inspection (DAI) stops it:")),
    React.createElement(ARPSpoofSim),
    React.createElement(H2,{num:"§3"},t(lang,"Hujumdan oldin va keyin","Before and after the attack")),
    React.createElement(CompareCols,{left:{title:{uz:"Oldin (normal)",en:"Before (normal)"},color:"#69db7c",rows:[{uz:"Shlyuz = haqiqiy MAC",en:"Gateway = real MAC"},{uz:"Trafik to'g'ri boradi",en:"Traffic flows correctly"},]},right:{title:{uz:"Keyin (spoofing)",en:"After (spoofing)"},color:"#ff3a5e",rows:[{uz:"Shlyuz = hujumchi MAC",en:"Gateway = attacker MAC"},{uz:"Trafik hujumchidan o'tadi",en:"Traffic passes through attacker"},]}}),
    React.createElement(H2,{num:"§4"},t(lang,"Himoya usullari","Defense methods")),
    React.createElement("div",{style:{margin:"6px 0 12px"}},
      [{uz:"Dynamic ARP Inspection (DAI) — switch soxta ARP ni bloklaydi (simulyatordagi ikkinchi ssenariy)",en:"Dynamic ARP Inspection (DAI) — the switch blocks fake ARP (the simulator's second scenario)"},{uz:"Statik ARP yozuvlari (muhim qurilmalar uchun)",en:"Static ARP entries (for critical devices)"},{uz:"HTTPS/VPN — mazmun shifrlansa, ko'rilsa ham foydasiz",en:"HTTPS/VPN — if encrypted, seeing it is useless"}].map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{fontSize:12.5,color:"var(--text-1)",padding:"6px 0",borderBottom:"1px solid var(--border)",animationDelay:(i*0.06)+"s"}},"• "+t(lang,x.uz,x.en));})),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"ARP spoofing faqat o'z laboratoriyangizda yoki yozma ruxsat berilgan pentestda sinalishi kerak. Boshqa tarmoqda qo'llash jinoyat.","ARP spoofing must only be tested in your own lab or a written-authorized pentest. Using it on another network is a crime.")),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: ARP jadvalining zaharlanishi","Practice: ARP table poisoning")),
    React.createElement(P,null,t(lang,"Bu — simulyatordagi «Himoyasiz tarmoq» ssenariysining aynan buyruq ko'rinishi.","This is exactly the simulator's «Undefended network» scenario in command form.")),
    React.createElement(Terminal,null,"sudo arpspoof -i eth0 -t 10.0.0.9 10.0.0.1\n# 8:0:27:aa:bb:cc 0:c:29:dd:ee:ff 0806 42: arp reply\n# 10.0.0.1 is-at 8:0:27:aa:bb:cc   ← qurbonga yolg'on\n# (echo 1 > /proc/sys/net/ipv4/ip_forward — trafikni uzatish)"),
React.createElement(Quiz,{q:{uz:"ARP spoofing ARP ning qaysi zaifligidan foydalanadi?",en:"Which ARP weakness does ARP spoofing exploit?"},opts:[{uz:"ARP juda sekin",en:"ARP is very slow"},{uz:"ARP javobning haqiqiyligini tekshirmaydi",en:"ARP doesn't verify that a reply is genuine"},{uz:"ARP shifrlangan",en:"ARP is encrypted"},{uz:"ARP faqat WiFi da",en:"ARP is WiFi-only"}],correct:1,exp:{uz:"ARP javobni tekshirmaydi — hujumchi soxta javob yuborib o'zini router qilib ko'rsatadi va trafikni o'g'irlaydi.",en:"ARP doesn't verify replies — an attacker sends a fake reply, impersonates the router and steals traffic."}}));
}
function LessonL25(){
  const lang=useLang();
  const tech=[["ARP Spoofing",{uz:"Lokal tarmoqda trafikni o'ziga yo'naltirish (L24)",en:"Redirect LAN traffic to itself (L24)"}],["DNS Spoofing",{uz:"Soxta IP berib soxta saytga yuborish (L26)",en:"Fake IP → fake site (L26)"}],["Evil Twin",{uz:"Soxta WiFi nuqtasi",en:"Fake WiFi hotspot"}],["SSL Strip",{uz:"HTTPS ni HTTP ga tushirishga urinish",en:"Try to downgrade HTTPS to HTTP"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"MITM hujumi nima?","What is a MITM attack?")),
    React.createElement(P,null,t(lang,"MITM (o'rtadagi odam) — hujumchi ikki tomon aloqasiga yashirin kirib, tinglaydi yoki o'zgartiradi. Ikki tomon to'g'ridan-to'g'ri gaplashyapti deb o'ylaydi, aslida hamma narsa hujumchi orqali o'tadi (xatlarni yashirincha o'qiydigan pochtachi kabi). MITM'ning kuchi shu — u faqat josuslik qilmaydi, balki ma'lumotni YO'LDA o'zgartirishi ham mumkin.","MITM (man-in-the-middle) — the attacker secretly inserts into a conversation to eavesdrop or alter it. The two parties think they talk directly, but everything passes through the attacker (like a mail carrier secretly reading letters). MITM's real power is this — it doesn't just spy, it can also alter data ALONG THE WAY.")),
    React.createElement(H2,{num:"§2"},t(lang,"Interaktiv simulyator: passiv vs faol MITM","Interactive simulator: passive vs active MITM")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — hujumchi shunchaki tinglaganda va mazmunning o'zini o'zgartirganda oqibat qanday farq qilishini ko'ring:","Try both scenarios — see how the outcome differs when the attacker merely listens versus when they alter the content itself:")),
    React.createElement(MITMSim),
    React.createElement(H2,{num:"§3"},t(lang,"Keng tarqalgan usullar","Common techniques")),
    tech.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:110}},x[0]),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"MITM texnikalari faqat ta'lim va ruxsat berilgan sinov muhitida o'rganilishi kerak. Real aloqani ruxsatsiz tinglash yoki o'zgartirish jiddiy jinoyat.","MITM techniques must only be studied in education and authorized test environments. Eavesdropping on or altering real communication without permission is a serious crime.")),
    React.createElement(H2,{num:"§4"},t(lang,"MITM turlari","Types of MITM")),
    React.createElement(LayerStack,{layers:[{n:"arp",name:t(lang,"ARP spoofing","ARP spoofing"),color:"#ff3a5e",desc:{uz:"Mahalliy tarmoqda trafikni burish.",en:"Divert traffic on the local network."}},{n:"dns",name:t(lang,"DNS spoofing","DNS spoofing"),color:"#ffa94d",desc:{uz:"Soxta IP qaytarib, saytga yo'naltirish.",en:"Return a fake IP to redirect a site."}},{n:"rogue",name:t(lang,"Rogue AP","Rogue AP"),color:"#a855f7",desc:{uz:"Soxta WiFi nuqtasi ochish.",en:"Set up a fake WiFi access point."}},{n:"ssl",name:t(lang,"SSL strip","SSL strip"),color:"#4dabf7",desc:{uz:"HTTPS ni HTTP ga tushirishga urinish.",en:"Try to downgrade HTTPS to HTTP."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: trafikni tinglash","Practice: sniffing traffic")),
    React.createElement(P,null,t(lang,"MITM o'rnatilgach, hujumchi shifrlanmagan trafikni (HTTP, FTP) o'qiydi — bu simulyatordagi «Passiv» ssenariysi. HTTPS bunga to'sqinlik qiladi (L15) — sertifikat mos kelmasa brauzer ogohlantiradi.","Once MITM is set up, the attacker reads unencrypted traffic (HTTP, FTP) — the simulator's «Passive» scenario. HTTPS blocks this (L15) — if the certificate doesn't match, the browser warns.")),
    React.createElement(Terminal,null,"sudo bettercap -iface eth0\n> net.probe on\n> set arp.spoof.targets 10.0.0.9\n> arp.spoof on ; net.sniff on\n# [sniff] http://site.com  POST user=admin pass=1234  ← ochiq!"),
React.createElement(Quiz,{q:{uz:"HTTPS MITM hujumida qanday yordam beradi?",en:"How does HTTPS help against MITM?"},opts:[{uz:"Trafikni tezlashtiradi",en:"Speeds up traffic"},{uz:"Mazmunni shifrlaydi — ushlansa ham o'qib bo'lmaydi",en:"Encrypts content — unreadable even if intercepted"},{uz:"IP ni yashiradi",en:"Hides the IP"},{uz:"Yordam bermaydi",en:"Doesn't help"}],correct:1,exp:{uz:"HTTPS mazmunni shifrlaydi — hujumchi trafikni ushlasa ham faqat shifrlangan ma'lumotni ko'radi.",en:"HTTPS encrypts the content — even intercepted, the attacker only sees encrypted data."}}));
}
function LessonL26(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DNS spoofing nima?","What is DNS spoofing?")),
    React.createElement(P,null,t(lang,"DNS spoofing — hujumchi soxta DNS javob berib, qurbonni noto'g'ri IP ga yo'naltiradi. Qurbon bank.com yozadi, lekin hujumchining soxta serveriga tushadi (telefon kitobidagi raqamni yashirincha almashtirgandek).","DNS spoofing — the attacker returns a fake DNS reply to send the victim to the wrong IP. The victim types bank.com but lands on the attacker's fake server (like swapping a number in a phone book).")),
    React.createElement(H2,{num:"§2"},t(lang,"Qanday ishlaydi","How it works")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"DNS zaharlash",en:"DNS poisoning"},steps:[
      {icon:"🔎",text:{uz:"Qurbon so'raydi:  \"bank.com IP si?\"",en:"Victim asks:  \"IP of bank.com?\""}},
      {icon:"😈",text:{uz:"Hujumchi soxta javob beradi:  \"IP = 6.6.6.6\"",en:"Attacker replies fake:  \"IP = 6.6.6.6\""}},
      {icon:"🕸",text:{uz:"Qurbon soxta saytga ulanadi (haqiqiy deb o'ylaydi)",en:"Victim connects to the fake site (thinks it's real)"}},
      {icon:"🔑",text:{uz:"Login/parol o'g'irlanadi",en:"Credentials are stolen"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: DNSSEC qalqon bo'la oladimi?","Interactive simulator: can DNSSEC act as a shield?")),
    React.createElement(P,null,t(lang,"Xuddi shu soxta javob ikki xil resolver'ga yuborilsa nima bo'ladi — biri imzoni tekshirmaydi, ikkinchisi tekshiradi:","See what happens when the same forged reply hits two different resolvers — one that never checks a signature, and one that does:")),
    React.createElement(DNSSpoofSim),
    React.createElement(H2,{num:"§4"},t(lang,"Himoya chuqurroq","Defense in depth")),
    React.createElement(P,null,t(lang,"DNSSEC har bir DNS yozuvini raqamli imzolaydi (RRSIG) — resolver imzoni zonaning ochiq kaliti bilan tekshiradi. Imzosiz yoki noto'g'ri imzolangan javob rad etiladi. Qo'shimcha qatlamlar: HTTPS (domen sertifikati mos kelmasa brauzer ogohlantiradi) va DoH/DoT (DNS so'rovlarini shifrlab, yo'ldagi almashtirishni qiyinlashtiradi).","DNSSEC digitally signs every DNS record (RRSIG) — the resolver checks the signature against the zone's public key. An unsigned or wrongly signed reply is rejected. Extra layers: HTTPS (the browser warns if the domain cert doesn't match) and DoH/DoT (encrypting DNS queries, making in-transit tampering harder).")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"DNS spoofing faqat nazorat qilinadigan laboratoriya yoki ruxsat berilgan sinovda o'rganilishi kerak.","DNS spoofing must only be studied in a controlled lab or an authorized test.")),
        React.createElement(H2,{num:"§5"},t(lang,"Haqiqiy va soxta javob","Real vs spoofed reply")),
    React.createElement(CompareCols,{left:{title:{uz:"Haqiqiy DNS",en:"Real DNS"},color:"#69db7c",rows:[{uz:"bank.com → 93.1.2.3",en:"bank.com → 93.1.2.3"},{uz:"Haqiqiy saytga boradi",en:"Goes to the real site"},]},right:{title:{uz:"Soxta DNS",en:"Spoofed DNS"},color:"#ff3a5e",rows:[{uz:"bank.com → 10.0.0.66",en:"bank.com → 10.0.0.66"},{uz:"Hujumchi soxta sahifasiga",en:"To the attacker's fake page"},]}}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: soxta javob","Practice: a forged reply")),
    React.createElement(P,null,t(lang,"MITM holatida hujumchi DNS so'roviga haqiqiy serverdan oldin javob beradi — qurbon soxta IP oladi va fishing sahifasiga tushadi. Himoya: DNSSEC va HTTPS.","In a MITM position the attacker answers a DNS query before the real server — the victim gets a fake IP and lands on a phishing page. Defense: DNSSEC and HTTPS.")),
    React.createElement(Terminal,null,"sudo dnsspoof -i eth0 -f hosts.txt\n# hosts.txt:  10.0.0.66  bank.com\n# 10.0.0.9.51000 > 1.1.1.1.53: 42+ A? bank.com\n# dnsspoof: bank.com -> 10.0.0.66   ← soxta javob yuborildi"),
React.createElement(Quiz,{q:{uz:"DNS spoofing hujumchiga nima imkonini beradi?",en:"What does DNS spoofing let an attacker do?"},opts:[{uz:"Faylni shifrlash",en:"Encrypt a file"},{uz:"To'g'ri nom yozilsa ham soxta saytga yo'naltirish",en:"Redirect to a fake site even with the correct name typed"},{uz:"WiFi parolini o'zgartirish",en:"Change the WiFi password"},{uz:"Tarmoqni tezlashtirish",en:"Speed up the network"}],correct:1,exp:{uz:"DNS spoofing soxta DNS javob beradi — qurbon to'g'ri nom (bank.com) yozsa ham soxta saytga tushadi.",en:"DNS spoofing returns a fake reply — even typing the right name (bank.com), the victim lands on a fake site."}}));
}
function LessonL27(){
  const lang=useLang();
  const types=[[{uz:"Volumetrik",en:"Volumetric"},{uz:"Kanalni ulkan trafik bilan to'ldiradi (UDP flood)",en:"Floods the link with huge traffic (UDP flood)"},"#ff3a5e"],[{uz:"Protokol",en:"Protocol"},{uz:"Server resurslarini tugatadi (SYN flood)",en:"Exhausts server resources (SYN flood)"},"#ff9145"],[{uz:"Ilova qatlami",en:"Application"},{uz:"Og'ir so'rovlar bilan charchatadi (HTTP flood)",en:"Tires the app with heavy requests (HTTP flood)"},"#ffd43b"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DoS va DDoS nima?","What are DoS and DDoS?")),
    React.createElement(P,null,t(lang,"DoS — serverni haddan tashqari so'rov bilan to'ldirib, xizmatni ishdan chiqarish. DDoS — xuddi shu, lekin minglab qurilmadan (botnet) bir vaqtda. Do'kon eshigini soxta mijozlar bilan to'ldirib, haqiqiylarni kira olmaslikka o'xshaydi.","DoS overwhelms a server with excessive requests to knock the service offline. DDoS is the same but from thousands of devices (a botnet) at once. Like jamming a shop's door with fake customers so real ones can't enter.")),
    React.createElement(H2,{num:"§2"},t(lang,"Hujum turlari","Attack types")),
    types.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid "+x[2]+"44",borderLeft:"3px solid "+x[2],borderRadius:10,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:x[2],minWidth:120}},t(lang,x[0].uz,x[0].en)),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: SYN flood — himoyasiz vs himoyalangan","Interactive simulator: SYN flood — unprotected vs protected")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — xuddi shu botnet toshqini himoyasiz va SYN cookie/rate-limit qo'llagan serverda qanday farqli tugashini ko'ring:","Try both scenarios — see how the exact same botnet flood ends differently against an unprotected server versus one using SYN cookies/rate-limiting:")),
    React.createElement(DDoSSim),
    React.createElement(H2,{num:"§4"},t(lang,"Himoya (mitigatsiya)","Mitigation")),
    React.createElement(P,null,t(lang,"Simulyatordagi «SYN cookie + rate-limit» ssenariysi quyidagi choralarning bir qismini ko'rsatadi — real hayotda bularning barchasi birgalikda qo'llaniladi:","The simulator's «SYN cookies + rate-limit» scenario shows part of the measures below — in real life they're all combined:")),
    React.createElement(Terminal,null,"✓ Rate limiting — bir IP dan so'rovlarni cheklash\n✓ SYN cookie — ulanish holatini saqlamasdan tekshirish\n✓ CDN / DDoS himoya (Cloudflare, Akamai)\n✓ Firewall va trafik filtrlash\n✓ Monitoring — anomal trafikni erta sezish"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"DoS/DDoS ni boshqa birovning tizimiga uyushtirish jiddiy jinoyat — hatto \"sinash\" uchun ham. Bu mavzu faqat himoya (blue team) nuqtai nazaridan o'rganiladi.","Launching DoS/DDoS against someone else's system is a serious crime — even \"just to try\". Studied only from a defensive (blue team) perspective.")),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: SYN flood belgisi","Practice: a SYN flood sign")),
    React.createElement(P,null,t(lang,"DDoS — minglab buzilgan qurilma (botnet) bir nishonga hujum qiladi, shuning uchun bitta IP ni bloklash yetmaydi. SYN flood serverni yarim ochiq ulanishlar bilan to'ldiradi — simulyatordagi «Himoyasiz server» ssenariysi aynan shu holat.","A DDoS uses thousands of compromised devices (a botnet) against one target, so blocking a single IP isn't enough. A SYN flood fills the server with half-open connections — exactly the simulator's «Unprotected server» scenario.")),
    React.createElement(Terminal,null,"# hujum belgisi: ko'p SYN_RECV holati\nnetstat -ant | grep SYN_RECV | wc -l\n# 4812   ← minglab yarim ochiq ulanish = SYN flood\n# himoya: SYN cookies, rate-limit, upstream/CDN filtr"),
React.createElement(Quiz,{q:{uz:"DDoS ni oddiy DoS dan farqlovchi asosiy narsa nima?",en:"What mainly distinguishes DDoS from DoS?"},opts:[{uz:"DDoS shifrlangan",en:"DDoS is encrypted"},{uz:"DDoS ko'plab qurilmadan (botnet) bir vaqtda keladi",en:"DDoS comes from many devices (a botnet) at once"},{uz:"DDoS sekinroq",en:"DDoS is slower"},{uz:"Farqi yo'q",en:"No difference"}],correct:1,exp:{uz:"DDoS — taqsimlangan DoS: hujum minglab qurilmadan (botnet) bir vaqtda keladi, to'sish qiyinroq.",en:"DDoS is distributed DoS: it comes from thousands of devices (a botnet) at once, harder to block."}}));
}
function LessonL28(){
  const lang=useLang();
  const filt=[["ip.addr == 10.0.0.5",{uz:"muayyan IP",en:"specific IP"}],["tcp.port == 80",{uz:"HTTP trafigi",en:"HTTP traffic"}],["dns",{uz:"faqat DNS",en:"DNS only"}],["http.request.method==\"POST\"",{uz:"POST so'rovlar",en:"POST requests"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Wireshark nima?","What is Wireshark?")),
    React.createElement(P,null,t(lang,"Wireshark — tarmoqdan o'tayotgan paketlarni real vaqtda ushlab, batafsil ko'rsatuvchi vosita. U tarmoqni \"rentgen\" qilib ko'rsatadi. Muammolarni topish, o'rganish va xavfsizlik tahlili uchun ishlatiladi.","Wireshark captures packets crossing the network in real time and shows them in detail — an \"X-ray\" of the network. Used for troubleshooting, learning and security analysis.")),
    React.createElement(H2,{num:"§2"},t(lang,"Ish jarayoni","Workflow")),
    React.createElement(FlowSteps,{title:{uz:"Wireshark bilan tahlil",en:"Analyzing with Wireshark"},steps:[
      {icon:"🎣",text:{uz:"Interfeysni tanlab, paketlarni ushlash (capture)",en:"Pick an interface and capture packets"}},
      {icon:"🔍",text:{uz:"Ko'rsatish filtri bilan keraklisini ajratish",en:"Narrow down with a display filter"}},
      {icon:"🧵",text:{uz:"\"Follow TCP Stream\" bilan suhbatni ko'rish",en:"See the conversation with \"Follow TCP Stream\""}},
      {icon:"📊",text:{uz:"Muammo yoki hujum izlarini aniqlash",en:"Spot the problem or attack traces"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: filtrsiz vs filtr bilan qidiruv","Interactive simulator: searching unfiltered vs with a filter")),
    React.createElement(P,null,t(lang,"14 000 ta ushlangan paket ichida bitta POST so'rovni topish kerak. Ikkala ssenariyni sinang — filtrning haqiqiy qiymatini his qiling:","You need to find one POST request among 14,000 captured packets. Try both scenarios — feel the real value of a filter:")),
    React.createElement(WiresharkSim),
    React.createElement(H2,{num:"§4"},t(lang,"Foydali filtrlar","Useful filters")),
    filt.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"8px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.05)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",flex:1}},x[0]),
      React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"Boshqalarning trafigini ruxsatsiz ushlash maxfiylikni buzadi. Faqat o'z tarmog'ingiz yoki ruxsat berilgan muhitda ishlating.","Capturing others' traffic without permission violates privacy. Use only on your own network or an authorized environment.")),
        React.createElement(H2,{num:"§5"},t(lang,"Capture va display filtr","Capture vs display filter")),
    React.createElement(CompareCols,{left:{title:{uz:"Capture filtr",en:"Capture filter"},color:"#4dabf7",rows:[{uz:"Ushlashdan OLDIN cheklaydi",en:"Limits BEFORE capture"},{uz:"BPF sintaksisi (tcp port 80)",en:"BPF syntax (tcp port 80)"},{uz:"Diskni tejaydi",en:"Saves disk"},]},right:{title:{uz:"Display filtr",en:"Display filter"},color:"#69db7c",rows:[{uz:"Ushlagandan KEYIN filtrlaydi",en:"Filters AFTER capture"},{uz:"Wireshark sintaksisi (http)",en:"Wireshark syntax (http)"},{uz:"Moslashuvchan tahlil",en:"Flexible analysis"},]}}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: parolni topish","Practice: finding a password")),
    React.createElement(P,null,t(lang,"Shifrlanmagan protokolda login ochiq ketadi. Simulyatordagi «Filtr bilan» ssenariysi kabi, display filtr bilan aynan o'sha paketni topib, Follow Stream orqali butun suhbatni o'qish mumkin.","In an unencrypted protocol the login travels in the clear. Just like the simulator's «With a filter» scenario, a display filter finds that exact packet, and Follow Stream lets you read the whole conversation.")),
    React.createElement(Terminal,null,"tshark -i eth0 -Y 'http.request.method==POST' -T fields -e http.file_data\n# username=admin&password=Secret123   ← ochiq parol!\n# capture filtr misoli: tshark -i eth0 -f 'tcp port 80'"),
React.createElement(Quiz,{q:{uz:"Ushlangan paketlardan faqat keraklisini ko'rsatish uchun nima ishlatiladi?",en:"What shows only the relevant captured packets?"},opts:[{uz:"Display filter (ko'rsatish filtri)",en:"A display filter"},{uz:"Firewall qoidasi",en:"A firewall rule"},{uz:"DNS yozuvi",en:"A DNS record"},{uz:"VPN tunnel",en:"A VPN tunnel"}],correct:0,exp:{uz:"Ko'rsatish filtri (masalan http yoki ip.addr==...) minglab paketdan keraklisini ajratadi.",en:"A display filter (e.g. http or ip.addr==...) narrows thousands of packets to the ones you need."}}));
}
function LessonL29(){
  const lang=useLang();
  const att=[["Deauth",{uz:"Qurilmani WiFi dan majburan uzadi",en:"Forcibly disconnects a device"}],["Evil Twin",{uz:"Soxta WiFi nuqtasi (haqiqiy nomni ko'chiradi)",en:"Fake AP cloning the real name"}],["Handshake capture",{uz:"WPA2 handshake ni ushlab, parolni oflayn buzish",en:"Capture WPA2 handshake, crack offline"}],["WPS hujumi",{uz:"WPS PIN zaifligidan foydalanish",en:"Exploit the WPS PIN weakness"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Simsiz hujumlar nima?","What are wireless attacks?")),
    React.createElement(P,null,t(lang,"WiFi havo orqali uzatgani uchun kabel tarmoqdan ko'ra ko'proq hujumga ochiq — signalni radiusdagi har kim \"eshitishi\" mumkin. Bu hujumlarni bilish o'z tarmog'ingizni himoya qilish uchun zarur.","Because WiFi transmits through the air, it's more exposed than wired networks — anyone in range can \"hear\" the signal. Knowing these attacks is essential to protect your own network.")),
    React.createElement(H2,{num:"§2"},t(lang,"Keng tarqalgan hujumlar","Common attacks")),
    att.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid var(--border)",borderLeft:"3px solid #ff9145",borderRadius:10,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"#ff9145",minWidth:150}},x[0]),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: zaif vs kuchli parol","Interactive simulator: weak vs strong password")),
    React.createElement(P,null,t(lang,"Handshake ikkala holatda ham bir xil ushlanadi — ammo aynan PAROL qanday tanlanganiga qarab, hujum natijasi tubdan farq qiladi. Ikkalasini sinang:","The handshake gets captured the same way either time — but the outcome hinges entirely on how the PASSWORD was chosen. Try both:")),
    React.createElement(WirelessCrackSim),
    React.createElement(H2,{num:"§4"},t(lang,"Himoya","Defense")),
    React.createElement(Terminal,null,"✓ WPA3 yoki kamida WPA2 (WEP emas!)\n✓ Uzun, murakkab parol (12+ belgi)\n✓ WPS ni o'chiring\n✓ Mehmonlar uchun alohida tarmoq"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"Simsiz hujum vositalarini faqat o'z tarmog'ingizda yoki yozma ruxsat bilan sinang. Birovning WiFi siga ruxsatsiz kirish jinoyat.","Test wireless attack tools only on your own network or with written permission. Unauthorized access to someone's WiFi is a crime.")),
        React.createElement(H2,{num:"§5"},t(lang,"WPA2 buzish oqimi","The WPA2 cracking flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"WiFi parolini sinash",en:"Testing the WiFi password"},steps:[{icon:"📡",text:{uz:"Monitor rejim — havoni tinglash (airmon-ng)",en:"Monitor mode — listen to the air (airmon-ng)"}},{icon:"🔍",text:{uz:"Nishon AP va mijozni topish (airodump-ng)",en:"Find the target AP and client (airodump-ng)"}},{icon:"👋",text:{uz:"Deauth → handshake ni ushlash",en:"Deauth → capture the handshake"}},{icon:"🔑",text:{uz:"Oflayn lug'at hujumi (aircrack-ng)",en:"Offline dictionary attack (aircrack-ng)"}},]}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: handshake buzish","Practice: cracking the handshake")),
    React.createElement(P,null,t(lang,"Handshake ushlangach, hujum OFLAYN davom etadi — parol lug'at bilan sinaladi, xuddi simulyatordagi «Zaif parol» ssenariysidek. Kuchli, uzun parol bu hujumni amalda imkonsiz qiladi.","Once the handshake is captured, the attack continues OFFLINE — the password is tested against a wordlist, just like the simulator's «Weak password» scenario. A strong, long password makes this attack practically impossible.")),
    React.createElement(Terminal,null,"aircrack-ng -w rockyou.txt capture.cap\n#   [00:03:12] 145203 keys tested\n#   KEY FOUND! [ MyWiFiPass2024 ]\n# → kuchsiz parol soatlarda ochiladi"),
React.createElement(Quiz,{q:{uz:"WPA2 \"handshake capture\" dan keyin hujumchi odatda nima qiladi?",en:"After a WPA2 \"handshake capture\", what does the attacker do?"},opts:[{uz:"Parolni oflayn buzishga urinadi",en:"Tries to crack the password offline"},{uz:"Routerni o'chiradi",en:"Turns off the router"},{uz:"IP beradi",en:"Hands out IPs"},{uz:"DNS ni tuzatadi",en:"Fixes DNS"}],correct:0,exp:{uz:"Ushlangan handshake parolning shifrlangan izini o'z ichiga oladi — hujumchi uni oflayn buzishga urinadi. Uzun parol buni deyarli imkonsiz qiladi.",en:"The captured handshake holds an encrypted trace of the password — the attacker tries to crack it offline. A long password makes this nearly impossible."}}));
}
function LessonL30(){
  const lang=useLang();
  const src=[[{uz:"Paket yozuvlari (PCAP)",en:"Packet captures (PCAP)"},{uz:"Aynan nima uzatilganini ko'rsatadi",en:"Show exactly what was transmitted"}],[{uz:"Firewall/IDS loglari",en:"Firewall/IDS logs"},{uz:"Bloklangan/ruxsat berilgan ulanishlar",en:"Blocked/allowed connections"}],[{uz:"Server loglari",en:"Server logs"},{uz:"Kirish urinishlari, so'rovlar, xatolar",en:"Login attempts, requests, errors"}],[{uz:"NetFlow",en:"NetFlow"},{uz:"Kim kim bilan qancha ma'lumot almashgani",en:"Who talked to whom and how much"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Tarmoq forensikasi nima?","What is network forensics?")),
    React.createElement(P,null,t(lang,"Tarmoq forensikasi — hodisadan keyin tarmoq ma'lumotlarini tekshirib, nima bo'lganini aniqlash. Detektiv ishi kabi: paketlar, loglar va izlarni yig'ib, \"kim, qachon, qanday\" ga javob topiladi. Himoya (blue team) va incident response ning muhim qismi.","Network forensics examines network data after an incident to determine what happened. Like detective work: collect packets, logs and traces to answer \"who, when, how\". A key part of defense (blue team) and incident response.")),
    React.createElement(H2,{num:"§2"},t(lang,"Tekshiruv jarayoni","The investigation process")),
    React.createElement(FlowSteps,{color:"#69db7c",title:{uz:"Forensika jarayoni",en:"Forensics process"},steps:[
      {icon:"📥",text:{uz:"Dalilni yig'ish (PCAP, loglar) — nusxadan ishlash",en:"Collect evidence (PCAP, logs) — work on a copy"}},
      {icon:"🔬",text:{uz:"Tahlil: filtrlar, oqimlar, vaqt chizig'i",en:"Analyze: filters, streams, timeline"}},
      {icon:"🧩",text:{uz:"\"Kim, qachon, qanday\" ni tiklash",en:"Reconstruct \"who, when, how\""}},
      {icon:"📝",text:{uz:"Hisobot + dalil zanjirini hujjatlash",en:"Report + document the chain of custody"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Dalil manbalari","Evidence sources")),
    src.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.05)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:150}},t(lang,x[0].uz,x[0].en)),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,t(lang,"Dalil zanjiri: ","Chain of custody: ")),t(lang,"dalil o'zgartirilmagani va kim unga tekkanligi hujjatlanishi shart — aks holda sudda kuchini yo'qotadi. Doim asl nusxadan ish nusxasi olib ishlanadi.","evidence must be documented as unaltered and who handled it recorded — otherwise it loses value in court. Always work on a copy, never the original.")),
        React.createElement(H2,{num:"§4"},t(lang,"Forensika artefaktlari","Forensic artifacts")),
    React.createElement(LayerStack,{layers:[{n:"pcap",name:t(lang,"PCAP","PCAP"),color:"#4dabf7",desc:{uz:"Ushlangan tarmoq trafigi (tcpdump/Wireshark).",en:"Captured network traffic (tcpdump/Wireshark)."}},{n:"logs",name:t(lang,"Loglar","Logs"),color:"#69db7c",desc:{uz:"Firewall/server/IDS yozuvlari.",en:"Firewall/server/IDS records."}},{n:"flow",name:t(lang,"NetFlow","NetFlow"),color:"#a855f7",desc:{uz:"Kim-kim bilan gaplashgani (metama'lumot).",en:"Who talked to whom (metadata)."}},{n:"hash",name:t(lang,"Hash","Hash"),color:"#ffd43b",desc:{uz:"Dalil o'zgarmaganini isbotlaydi (SHA256).",en:"Proves evidence is unchanged (SHA256)."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: pcap tahlili","Practice: analyzing a pcap")),
    React.createElement(P,null,t(lang,"Forensika — hodisadan KEYIN dalilni yig'ish va tahlil qilish. Dalil zanjiri: har fayl hashlanadi va kim tekkani yoziladi, shunda dalil sudda kuchga ega bo'ladi.","Forensics is collecting and analyzing evidence AFTER an incident. Chain of custody: each file is hashed and every handler recorded, so the evidence holds up in court.")),
    React.createElement(Terminal,null,"sha256sum capture.pcap   # dalilni muhrlash\n# 9f2c...  capture.pcap\ntcpdump -r capture.pcap -nn 'port 4444'\n# 10.0.0.9.51002 > 10.0.0.5.4444  ← shubhali reverse shell"),
React.createElement(Quiz,{q:{uz:"\"Dalil zanjiri\" (chain of custody) nima uchun muhim?",en:"Why is \"chain of custody\" important?"},opts:[{uz:"Tarmoqni tezlashtiradi",en:"Speeds up the network"},{uz:"Dalil o'zgartirilmagani va ishonchli ekanini isbotlaydi",en:"Proves the evidence is unaltered and trustworthy"},{uz:"Parolni shifrlaydi",en:"Encrypts the password"},{uz:"IP beradi",en:"Hands out IPs"}],correct:1,exp:{uz:"Dalil zanjiri dalil o'zgartirilmaganini va kim unga tekkanini hujjatlaydi — bu ishonchlilik va sud kuchini ta'minlaydi.",en:"Chain of custody documents that evidence is unaltered and who handled it — ensuring it's trustworthy and admissible."}}));
}
const root=ReactDOM.createRoot(document.getElementById("app"));
root.render(React.createElement(App));

/* ── Animated background particles (matches Windows module) ── */
(function(){
  function initBgParticles(){
    var el=document.getElementById("bg-root");
    if(!el) return;
    el.className="bg-stage bg-grid bg-scan";
    [].slice.call(el.querySelectorAll(".particle")).forEach(function(p){p.remove();});
    var count=30;
    for(var i=0;i<count;i++){
      var p=document.createElement("div");
      var isStar=i%5===0;
      p.className="particle"+(isStar?" particle-star":"");
      var s=isStar?3+Math.random()*3:1+Math.random()*2;
      p.style.width=p.style.height=s+"px";
      p.style.left=(Math.random()*100)+"%";
      p.style.top=(Math.random()*100)+"%";
      var angle=Math.random()*Math.PI*2;
      var dist=120+Math.random()*220;
      p.style.setProperty("--dx",(Math.cos(angle)*dist)+"px");
      p.style.setProperty("--dy",(Math.sin(angle)*dist-80)+"px");
      p.style.animationDuration=(isStar?20:12+Math.random()*20)+"s";
      p.style.animationDelay=(-Math.random()*35)+"s";
      el.appendChild(p);
    }
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initBgParticles);}
  else{initBgParticles();}
})();
