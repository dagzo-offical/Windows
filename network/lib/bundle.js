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
  const types=[["Packet Filter",{uz:"IP/port bo'yicha filtrlaydi (sodda, tez)",en:"Filters by IP/port (simple, fast)"},"#4dabf7"],["Stateful",{uz:"Ulanish holatini eslaydi (aqlliroq)",en:"Remembers connection state (smarter)"},"#69db7c"],["Application / WAF",{uz:"Ilova mazmunini tekshiradi (chuqur)",en:"Inspects app-layer content (deep)"},"#9775fa"],["Next-Gen (NGFW)",{uz:"IPS + ilova + tahdid razvedkasi",en:"IPS + app + threat intel"},"#ff9145"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Firewall nima?","What is a firewall?")),
    React.createElement(P,null,t(lang,"Firewall — tarmoq va tashqi olam o'rtasidagi \"qorovul devor\". U har bir paketni qoidalar asosida tekshirib, o'tkazadi yoki bloklaydi — chegaradagi bojxona kabi.","A firewall is the \"guarded wall\" between a network and the outside. It checks each packet against rules and allows or blocks it — like customs at a border.")),
    React.createElement(H2,{num:"§2"},t(lang,"Paketni tekshirish","Inspecting a packet")),
    React.createElement(P,null,t(lang,"Firewall qoidalarni yuqoridan pastga tekshiradi va birinchi mos kelganida to'xtaydi. \"Ishga tushir\":","A firewall checks rules top-to-bottom and stops at the first match. Press Play:")),
    React.createElement(FlowSteps,{title:{uz:"Firewall qarori",en:"Firewall decision"},steps:[
      {icon:"📦",text:{uz:"Paket keladi (manba IP, port, protokol)",en:"Packet arrives (source IP, port, protocol)"}},
      {icon:"📋",text:{uz:"Qoidalar ro'yxati bilan solishtiriladi",en:"Compared against the rule list"}},
      {icon:"✅",text:{uz:"Mos ALLOW qoidasi → o'tkaziladi",en:"Matching ALLOW rule → forwarded"}},
      {icon:"⛔",text:{uz:"Aks holda → DROP (bloklanadi)",en:"Otherwise → DROP (blocked)"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Firewall turlari","Firewall types")),
    types.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,alignItems:"center",padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid "+x[2]+"44",borderLeft:"3px solid "+x[2],borderRadius:10,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontWeight:700,fontSize:12.5,color:x[2],minWidth:130}},x[0]),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
        React.createElement(H2,{num:"§4"},t(lang,"Firewall avlodlari","Firewall generations")),
    React.createElement(LayerStack,{layers:[{n:"L3-4",name:t(lang,"Packet filter","Packet filter"),color:"#ff6b6b",desc:{uz:"Faqat IP/port bo'yicha — holatni bilmaydi.",en:"By IP/port only — stateless."}},{n:"state",name:t(lang,"Stateful","Stateful"),color:"#69db7c",desc:{uz:"Ulanish holatini kuzatadi (afzal).",en:"Tracks connection state (preferred)."}},{n:"L7",name:t(lang,"NGFW / WAF","NGFW / WAF"),color:"#4dabf7",desc:{uz:"Ilova qatlamini ko'radi (DPI, IDS).",en:"Sees the application layer (DPI, IDS)."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: qoidalarni ko'rish","Practice: viewing rules")),
    React.createElement(P,null,t(lang,"Linux'da ufw yoki iptables firewall qoidalarini boshqaradi. Qoidalar yuqoridan pastga tekshiriladi — birinchi mos kelgani qo'llanadi, oxirida odatda «hammasini rad et» turadi.","On Linux, ufw or iptables manages firewall rules. Rules are checked top-down — the first match applies, and a «deny all» usually sits at the end.")),
    React.createElement(Terminal,null,"sudo ufw status numbered\n# [ 1] 22/tcp   ALLOW IN  Anywhere    ← SSH ruxsat\n# [ 2] 80/tcp   ALLOW IN  Anywhere\n# [ 3] Anywhere DENY IN  Anywhere    ← qolgan hammasi rad\nsudo iptables -L -n --line-numbers"),
React.createElement(Quiz,{q:{uz:"Firewall qoidalarni qanday tartibda tekshiradi?",en:"In what order does a firewall check rules?"},opts:[{uz:"Tasodifiy",en:"Randomly"},{uz:"Yuqoridan pastga, birinchi moslikda to'xtaydi",en:"Top-to-bottom, stops at first match"},{uz:"Pastdan yuqoriga",en:"Bottom-to-top"},{uz:"Alifbo bo'yicha",en:"Alphabetically"}],correct:1,exp:{uz:"Firewall qoidalarni yuqoridan pastga tekshiradi va birinchi mos qoidada to'xtaydi — shu sababli aniq ALLOW qoidalari umumiy DROP dan oldin turishi kerak.",en:"A firewall checks rules top-to-bottom and stops at the first match — so specific ALLOW rules must precede a general DROP."}}));
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
    React.createElement(H2,{num:"§3"},t(lang,"Foydali bayroqlar","Useful flags")),
    scans.map(function(s,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid "+s[3]+"44",borderLeft:"3px solid "+s[3],borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontWeight:700,color:s[3],fontSize:12,minWidth:44}},s[0]),
      React.createElement("span",{style:{fontSize:12,fontWeight:600,color:"var(--text-0)",minWidth:80}},s[1]),
      React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},t(lang,s[2].uz,s[2].en)));}),
    React.createElement(Terminal,null,"nmap -sV -sC 10.0.0.5\nnmap -sn 10.0.0.0/24     # tirik xostlar\nnmap -p- 10.0.0.5        # barcha portlar"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"Port skanerlashni faqat o'zingizga tegishli yoki yozma ruxsat berilgan tizimlarda o'tkazing. Ruxsatsiz skanerlash ko'p mamlakatda qonunga zid.","Only scan systems you own or are authorized (in writing) to test. Unauthorized scanning is illegal in many countries.")),
        React.createElement(H2,{num:"§4"},t(lang,"Port holatlari","Port states")),
    React.createElement(LayerStack,{layers:[{n:"open",name:t(lang,"open","open"),color:"#69db7c",desc:{uz:"Xizmat javob beradi — hujum yuzasi.",en:"A service answers — attack surface."}},{n:"closed",name:t(lang,"closed","closed"),color:"#ffd43b",desc:{uz:"Port yopiq, lekin xost tirik.",en:"Port closed, but the host is alive."}},{n:"filtered",name:t(lang,"filtered","filtered"),color:"#ff6b6b",desc:{uz:"Firewall to'sib qo'ygan — javob yo'q.",en:"A firewall blocks it — no reply."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: SYN skan","Practice: a SYN scan")),
    React.createElement(P,null,t(lang,"nmap -sS «yarim ochiq» skan qiladi — ulanishni tugatmaydi, shuning uchun tez va yashirinroq. -sV har portning xizmat versiyasini aniqlaydi.","nmap -sS does a «half-open» scan — it never completes the handshake, so it's fast and stealthier. -sV identifies each port's service version.")),
    React.createElement(Terminal,null,"sudo nmap -sS -sV -T4 10.0.0.5\n# PORT    STATE SERVICE VERSION\n# 22/tcp  open  ssh     OpenSSH 8.2\n# 80/tcp  open  http    nginx 1.18.0\n# 3306/tcp filtered mysql  ← firewall to'sgan"),
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
  const recs=[["A",{uz:"Nomni IPv4 ga bog'laydi",en:"Maps a name to IPv4"}],["AAAA",{uz:"Nomni IPv6 ga bog'laydi",en:"Maps a name to IPv6"}],["MX",{uz:"Pochta serverini ko'rsatadi",en:"Points to the mail server"}],["CNAME",{uz:"Taxallus (alias)",en:"Alias to another name"}],["NS",{uz:"Nom serverlari",en:"Name servers"}],["TXT",{uz:"Matn (SPF, DKIM)",en:"Text (SPF, DKIM)"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DNS nima?","What is DNS?")),
    React.createElement(P,null,t(lang,"DNS — internetning telefon kitobi. Odamlar nomlarni eslaydi (google.com), kompyuterlar esa IP manzillar bilan ishlaydi (142.250.187.206). DNS nomni IP ga aylantiradi.","DNS is the internet's phone book. People remember names (google.com), computers work with IPs (142.250.187.206). DNS translates a name into an IP.")),
    React.createElement(H2,{num:"§2"},t(lang,"So'rov qanday hal bo'ladi?","How a query is resolved")),
    React.createElement(P,null,t(lang,"Brauzerga google.com yozsangiz, kompyuter bir necha serverdan so'raydi, IP topilguncha. \"Ishga tushir\":","When you type google.com, your computer asks several servers until it finds the IP. Press Play:")),
    React.createElement(FlowSteps,{title:{uz:"DNS so'rovi",en:"DNS resolution"},steps:[
      {icon:"💻",text:{uz:"Kompyuter → Resolver:  \"google.com IP si?\"",en:"Computer → Resolver:  \"IP of google.com?\""}},
      {icon:"🌍",text:{uz:"Resolver → Root:  \".com qayerda?\"",en:"Resolver → Root:  \"where is .com?\""}},
      {icon:"🏛",text:{uz:"Resolver → TLD (.com):  \"google.com qayerda?\"",en:"Resolver → TLD (.com):  \"where is google.com?\""}},
      {icon:"📍",text:{uz:"Resolver → Authoritative:  \"IP = 142.250.187.206\"",en:"Resolver → Authoritative:  \"IP = 142.250.187.206\""}},
      {icon:"✓",text:{uz:"Resolver → Kompyuter:  IP qaytariladi (keshlanadi)",en:"Resolver → Computer:  IP returned (cached)"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"DNS yozuv turlari","DNS record types")),
    recs.map(function(r,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.05)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--accent)",minWidth:56}},r[0]),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,r[1].uz,r[1].en)));}),
    React.createElement(H2,{num:"§4"},t(lang,"Sinab ko'ring","Try it")),
    React.createElement(Terminal,null,"nslookup google.com\ndig google.com A\ndig google.com MX\ndig +trace google.com"),
        React.createElement(H2,{num:"§5"},t(lang,"DNS yozuv turlari","DNS record types")),
    React.createElement(LayerStack,{layers:[{n:"A",name:t(lang,"A","A"),color:"#4dabf7",desc:{uz:"Nom → IPv4 manzil.",en:"Name → IPv4 address."}},{n:"AAAA",name:t(lang,"AAAA","AAAA"),color:"#69db7c",desc:{uz:"Nom → IPv6 manzil.",en:"Name → IPv6 address."}},{n:"MX",name:t(lang,"MX","MX"),color:"#a855f7",desc:{uz:"Pochta serveri.",en:"Mail server."}},{n:"CNAME",name:t(lang,"CNAME","CNAME"),color:"#ffd43b",desc:{uz:"Taxallus (boshqa nomga).",en:"Alias (to another name)."}},{n:"NS",name:t(lang,"NS","NS"),color:"#ff6b6b",desc:{uz:"Domen nom serverlari.",en:"The domain's name servers."}},]}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: DNS so'rovi","Practice: a DNS query")),
    React.createElement(P,null,t(lang,"dig yoki nslookup bilan domen nomining ortidagi IP va yozuvlarni ko'rasiz. Bu tarmoq muammolarini va OSINT razvedkasini boshlashning birinchi qadami.","With dig or nslookup you see the IP and records behind a domain name. This is the first step for diagnosing network issues and for OSINT recon.")),
    React.createElement(Terminal,null,"dig example.com A +short\n# 93.184.216.34\ndig example.com MX +short\n# 10 mail.example.com.\nnslookup example.com\n# Server: 192.168.1.1\n# Address: 93.184.216.34"),
React.createElement(Quiz,{q:{uz:"DNS ning asosiy vazifasi nima?",en:"What is the main job of DNS?"},opts:[{uz:"Ma'lumotni shifrlash",en:"Encrypting data"},{uz:"Domen nomini IP ga aylantirish",en:"Translating a domain name into an IP"},{uz:"Paketlarni yo'naltirish",en:"Routing packets"},{uz:"Parol saqlash",en:"Storing passwords"}],correct:1,exp:{uz:"DNS internetning telefon kitobi — nomlarni (google.com) IP manzillarga aylantiradi.",en:"DNS is the internet's phone book — it translates names (google.com) into IP addresses."}}));
}
function LessonL05(){
  const lang=useLang();
  const methods=[["GET",{uz:"Ma'lumot olish",en:"Retrieve data"}],["POST",{uz:"Ma'lumot yuborish",en:"Send data"}],["PUT",{uz:"Yangilash",en:"Update"}],["DELETE",{uz:"O'chirish",en:"Delete"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"HTTP nima?","What is HTTP?")),
    React.createElement(P,null,t(lang,"HTTP — brauzer va veb-server o'rtasidagi \"til\". Brauzer so'rov yuboradi (\"bu sahifani ber\"), server javob qaytaradi (sahifa). Restoranda ovqat buyurtma qilib, keyin olishga o'xshaydi.","HTTP is the \"language\" between a browser and a web server. The browser sends a request (\"give me this page\"), the server returns a response (the page). Like ordering food at a restaurant then receiving it.")),
    React.createElement(H2,{num:"§2"},t(lang,"So'rov–javob tsikli","The request–response cycle")),
    React.createElement(FlowSteps,{title:{uz:"HTTP so'rov–javob",en:"HTTP request–response"},steps:[
      {icon:"🌐",text:{uz:"Brauzer → Server:  GET /index.html",en:"Browser → Server:  GET /index.html"}},
      {icon:"⚙",text:{uz:"Server so'rovni qayta ishlaydi",en:"Server processes the request"}},
      {icon:"📦",text:{uz:"Server → Brauzer:  200 OK + sahifa",en:"Server → Browser:  200 OK + page"}},
      {icon:"🖥",text:{uz:"Brauzer sahifani ko'rsatadi",en:"Browser renders the page"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Metodlar va holat kodlari","Methods and status codes")),
    React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap",margin:"6px 0 12px"}},
      methods.map(function(m,i){return React.createElement("div",{key:i,className:"na-rise",style:{flex:"1 1 120px",padding:"9px 12px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.05)+"s"}},
        React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--accent)",fontSize:12}},m[0]),
        React.createElement("div",{style:{fontSize:11,color:"var(--text-2)",marginTop:2}},t(lang,m[1].uz,m[1].en)));})),
    React.createElement(Terminal,null,"2xx OK      — 200 OK\n3xx Redirect — 301, 302\n4xx Client  — 404 Not Found, 403 Forbidden\n5xx Server  — 500, 503"),
    React.createElement(H2,{num:"§4"},t(lang,"HTTP vs HTTPS","HTTP vs HTTPS")),
    React.createElement(CompareCols,{
      left:{title:"HTTP",color:"#ff6b6b",rows:[{uz:"✗ Ochiq matn",en:"✗ Plain text"},{uz:"✗ Kim eshitsa o'qiydi",en:"✗ Anyone can read it"},{uz:"Parollar xavf ostida",en:"Passwords at risk"}]},
      right:{title:"HTTPS",color:"#69db7c",rows:[{uz:"✓ TLS bilan shifrlangan",en:"✓ Encrypted with TLS"},{uz:"✓ Qulf belgisi 🔒",en:"✓ Padlock icon 🔒"},{uz:"Maxfiy konvert kabi",en:"Like a sealed envelope"}]}}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"Ochiq WiFi da HTTP saytga parol kiritmang — u shifrlanmagan uzatiladi. Doim HTTPS (🔒) borligini tekshiring.","Never enter a password on an HTTP site over public WiFi — it travels unencrypted. Always check for HTTPS (🔒).")),
        React.createElement(H2,{num:"§5"},t(lang,"Metodlar va status kodlar","Methods and status codes")),
    React.createElement(CompareCols,{left:{title:{uz:"HTTP metodlar",en:"HTTP methods"},color:"#4dabf7",rows:[{uz:"GET — ma'lumot olish",en:"GET — fetch data"},{uz:"POST — ma'lumot yuborish",en:"POST — send data"},{uz:"PUT/DELETE — o'zgartirish/o'chirish",en:"PUT/DELETE — modify/remove"},]},right:{title:{uz:"Status kodlar",en:"Status codes"},color:"#69db7c",rows:[{uz:"200 OK — muvaffaqiyat",en:"200 OK — success"},{uz:"301/302 — yo'naltirish",en:"301/302 — redirect"},{uz:"403/404 — taqiq/topilmadi",en:"403/404 — forbidden/not found"},{uz:"500 — server xatosi",en:"500 — server error"},]}}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: HTTP sarlavhalari","Practice: HTTP headers")),
    React.createElement(P,null,t(lang,"curl -I faqat javob sarlavhalarini oladi — server turi, texnologiya va status kodini ko'rsatadi. Bu veb-razvedkaning (WhatWeb, Nikto) asosidir.","curl -I fetches only the response headers — showing the server type, technology and status code. This is the basis of web recon (WhatWeb, Nikto).")),
    React.createElement(Terminal,null,"curl -I https://example.com\n# HTTP/2 200\n# server: nginx/1.18.0\n# content-type: text/html; charset=UTF-8\n# strict-transport-security: max-age=63072000  ← HTTPS majburiy"),
React.createElement(Quiz,{q:{uz:"HTTPS ni HTTP dan farqlovchi asosiy narsa nima?",en:"What mainly sets HTTPS apart from HTTP?"},opts:[{uz:"Tezroq",en:"Faster"},{uz:"TLS bilan shifrlaydi",en:"Encrypts with TLS"},{uz:"Rasmlarni yaxshi ko'rsatadi",en:"Shows images better"},{uz:"Faqat mobil",en:"Mobile only"}],correct:1,exp:{uz:"HTTPS = HTTP + TLS shifrlash — yo'lda kim eshitsa ham mazmunni o'qiy olmaydi.",en:"HTTPS = HTTP + TLS encryption — anyone listening in transit can't read the content."}}));
}
function LessonL06(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"ARP nima?","What is ARP?")),
    React.createElement(P,null,t(lang,"ARP IP manzilni fizik MAC manzilga bog'laydi. IP — mantiqiy \"uy manzili\", MAC — qurilmaning doimiy \"pasport raqami\". Lokal tarmoqda yetkazish uchun MAC kerak, ARP uni topadi.","ARP links an IP address to a physical MAC address. IP is the logical \"home address\", MAC is the device's permanent \"passport number\". Local delivery needs the MAC, and ARP finds it.")),
    React.createElement(H2,{num:"§2"},t(lang,"ARP qanday ishlaydi","How ARP works")),
    React.createElement(P,null,t(lang,"Qurilma faqat IP ni bilsa, butun tarmoqqa baqiradi: \"192.168.1.5 kimda?\" — egasi javob beradi. Bir xonada \"Aziz kim?\" deb baqirib, Aziz qo'l ko'targandek. \"Ishga tushir\":","If a device only knows the IP, it shouts to the whole network: \"who has 192.168.1.5?\" — the owner replies. Like shouting \"who is Aziz?\" and Aziz raising his hand. Press Play:")),
    React.createElement(FlowSteps,{title:{uz:"ARP so'rov–javob",en:"ARP request–reply"},steps:[
      {icon:"📢",text:{uz:"A → HAMMA (broadcast):  \"192.168.1.5 kimda? MAC ingni ber\"",en:"A → EVERYONE (broadcast):  \"who has 192.168.1.5? send your MAC\""}},
      {icon:"🙋",text:{uz:"B → A (unicast):  \"Bu men! MAC = aa:bb:cc:dd:ee:ff\"",en:"B → A (unicast):  \"That's me! MAC = aa:bb:cc:dd:ee:ff\""}},
      {icon:"🧠",text:{uz:"A ARP jadvaliga IP↔MAC ni eslab qoladi",en:"A caches IP↔MAC in its ARP table"}},
      {icon:"✓",text:{uz:"Endi A to'g'ridan-to'g'ri B ga yuboradi",en:"Now A sends directly to B"}},
    ]}),
    React.createElement(PacketFlow,{from:{uz:"A · 192.168.1.2",en:"A · 192.168.1.2"},to:{uz:"B · 192.168.1.5",en:"B · 192.168.1.5"},label:"ARP"}),
    React.createElement(H2,{num:"§3"},t(lang,"ARP jadvalini ko'rish","Viewing the ARP table")),
    React.createElement(Terminal,null,"arp -a\n# 192.168.1.1   00:11:22:33:44:55   dynamic\n# 192.168.1.5   aa:bb:cc:dd:ee:ff   dynamic"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"ARP javobni tekshirmaydi — shu sababli \"ARP spoofing\" hujumi mumkin (L24). Hujumchi soxta javob yuborib trafikni o'g'irlaydi.","ARP doesn't verify replies — enabling \"ARP spoofing\" attacks (L24). An attacker sends a fake reply to steal traffic.")),
        React.createElement(H2,{num:"§4"},t(lang,"ARP jadvali va so'rov/javob","The ARP table and request/reply")),
    React.createElement(P,null,t(lang,"ARP IP manzilni MAC manzilga bog'laydi. Qurilma «10.0.0.1 kimda?» deb butun tarmoqqa so'rov (broadcast) yuboradi; egasi «bu men, MAC im shu» deb javob beradi. Natija ARP jadvalida saqlanadi. Bu ishonchga asoslangani uchun ARP spoofing (L24) hujumiga zaif.","ARP maps an IP address to a MAC address. A device broadcasts «who has 10.0.0.1?» to the whole network; the owner replies «that's me, here's my MAC». The result is stored in the ARP table. Because it is trust-based, it is vulnerable to ARP spoofing (L24).")),
    React.createElement(CompareCols,{left:{title:{uz:"ARP Request",en:"ARP Request"},color:"#4dabf7",rows:[{uz:"Broadcast — hammaga",en:"Broadcast — to everyone"},{uz:"«Bu IP kimda?»",en:"«Who has this IP?»"},]},right:{title:{uz:"ARP Reply",en:"ARP Reply"},color:"#69db7c",rows:[{uz:"Unicast — so'rovchiga",en:"Unicast — to the asker"},{uz:"«Bu men, MAC im...»",en:"«It's me, my MAC is...»"},]}}),
    React.createElement(Terminal,null,"arp -a\n# ? (192.168.1.1)  at 00:11:22:33:44:55 [ether] on eth0  ← router\n# ? (192.168.1.20) at aa:bb:cc:dd:ee:ff [ether] on eth0\nip neigh   # zamonaviy muqobil"),
React.createElement(Quiz,{q:{uz:"ARP nimani nimaga bog'laydi?",en:"What does ARP link to what?"},opts:[{uz:"Domen nomini IP ga",en:"A domain name to an IP"},{uz:"IP manzilni MAC ga",en:"An IP address to a MAC"},{uz:"Portni protokolga",en:"A port to a protocol"},{uz:"Parolni foydalanuvchiga",en:"A password to a user"}],correct:1,exp:{uz:"ARP mantiqiy IP manzilni fizik MAC manzilga bog'laydi.",en:"ARP links a logical IP address to a physical MAC address."}}));
}
function LessonL07(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DHCP nima?","What is DHCP?")),
    React.createElement(P,null,t(lang,"DHCP qurilmalarga IP manzilni avtomatik beradi. Usiz har bir qurilma uchun IP ni qo'lda kiritishga to'g'ri kelardi. DHCP — mehmonxona qabulxonasi kabi: kelasiz, u sizga xona (IP) va yo'l-yo'riq (gateway, DNS) beradi.","DHCP hands devices an IP automatically. Without it you'd type an IP by hand for every device. DHCP is like a hotel front desk: you arrive and it gives you a room (IP) and directions (gateway, DNS).")),
    React.createElement(H2,{num:"§2"},t(lang,"DORA jarayoni","The DORA process")),
    React.createElement(P,null,t(lang,"Qurilma tarmoqqa ulanganda 4 bosqichli \"DORA\" suhbati kechadi. \"Ishga tushir\":","When a device joins, a 4-step \"DORA\" exchange happens. Press Play:")),
    React.createElement(FlowSteps,{title:{uz:"DHCP · DORA",en:"DHCP · DORA"},steps:[
      {icon:"D",text:{uz:"Discover:  qurilma \"menga IP kerak!\" deb baqiradi",en:"Discover:  device shouts \"I need an IP!\""}},
      {icon:"O",text:{uz:"Offer:  DHCP server \"mana, 192.168.1.50\"",en:"Offer:  DHCP server \"here, 192.168.1.50\""}},
      {icon:"R",text:{uz:"Request:  qurilma \"roziman, shuni olaman\"",en:"Request:  device \"agreed, I'll take it\""}},
      {icon:"A",text:{uz:"Acknowledge:  server \"kelishdik, u sizniki (24 soat)\"",en:"Acknowledge:  server \"done, it's yours (24h)\""}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Ijara (lease)","The lease")),
    React.createElement(P,null,t(lang,"Berilgan IP abadiy emas — u \"ijaraga\" beriladi (masalan 24 soat). Muddat tugashidan oldin qurilma uni yangilaydi — bu manzillarni tejaydi.","The IP isn't forever — it's a \"lease\" (e.g. 24h). The device renews it before it expires — saving addresses.")),
    React.createElement(Terminal,null,"# Linux\nsudo dhclient -r   # eskisini qaytarish\nsudo dhclient      # yangisini olish\n# Windows\nipconfig /release\nipconfig /renew"),
        React.createElement(H2,{num:"§4"},t(lang,"DORA bosqichlari va ijara","The DORA stages and the lease")),
    React.createElement(LayerStack,{layers:[{n:"D",name:t(lang,"Discover","Discover"),color:"#4dabf7",desc:{uz:"Mijoz: «DHCP server bormi?» (broadcast).",en:"Client: «any DHCP server?» (broadcast)."}},{n:"O",name:t(lang,"Offer","Offer"),color:"#69db7c",desc:{uz:"Server: «mana senga 192.168.1.50».",en:"Server: «here's 192.168.1.50 for you»."}},{n:"R",name:t(lang,"Request","Request"),color:"#a855f7",desc:{uz:"Mijoz: «shu manzilni olaman».",en:"Client: «I'll take that address»."}},{n:"A",name:t(lang,"Acknowledge","Acknowledge"),color:"#ffd43b",desc:{uz:"Server: «tasdiqlandi, ijara N soat».",en:"Server: «confirmed, lease N hours»."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: ijarani yangilash","Practice: renewing the lease")),
    React.createElement(P,null,t(lang,"DHCP manzilni «ijaraga» beradi — muddat tugashidan oldin mijoz uni yangilaydi. Kali'da manzilni majburan qayta olish mumkin.","DHCP «leases» an address — before it expires the client renews it. In Kali you can force a fresh address.")),
    React.createElement(Terminal,null,"sudo dhclient -r eth0    # eski ijarani bekor qilish\nsudo dhclient eth0       # yangi manzil so'rash\nip a | grep inet\n# inet 192.168.1.50/24   ← DHCP bergan yangi manzil"),
React.createElement(Quiz,{q:{uz:"DHCP DORA jarayonining to'g'ri tartibi?",en:"Correct order of the DHCP DORA process?"},opts:[{uz:"Discover → Offer → Request → Acknowledge",en:"Discover → Offer → Request → Acknowledge"},{uz:"Offer → Discover → Acknowledge → Request",en:"Offer → Discover → Acknowledge → Request"},{uz:"Request → Discover → Offer → Acknowledge",en:"Request → Discover → Offer → Acknowledge"},{uz:"Acknowledge → Request → Offer → Discover",en:"Acknowledge → Request → Offer → Discover"}],correct:0,exp:{uz:"DORA: Discover (so'rov) → Offer (taklif) → Request (tasdiq) → Acknowledge (yakun).",en:"DORA: Discover → Offer → Request → Acknowledge."}}));
}
function LessonL08(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Routing nima?","What is routing?")),
    React.createElement(P,null,t(lang,"Routing — paketlarni bir tarmoqdan boshqasiga yo'naltirish. Router — tarmoqlararo \"chorraha politsiyachisi\": har paketning manzilini ko'rib, to'g'ri yo'nalishga jo'natadi. Internet — millionlab routerlar orqali bog'langan tarmoqlar to'ri.","Routing directs packets from one network to another. A router is the \"traffic officer\" between networks: it reads each packet's destination and sends it the right way. The internet is a web of networks joined by millions of routers.")),
    React.createElement(H2,{num:"§2"},t(lang,"Paket qanday sayohat qiladi","How a packet travels")),
    React.createElement(P,null,t(lang,"Paket manzilга yetguncha bir necha router (hop) dan o'tadi. \"Ishga tushir\":","A packet passes through several routers (hops) to reach its destination. Press Play:")),
    React.createElement(FlowSteps,{title:{uz:"Paket yo'li (hops)",en:"Packet path (hops)"},steps:[
      {icon:"💻",text:{uz:"Kompyuter → default gateway (uy routeri)",en:"Computer → default gateway (home router)"}},
      {icon:"🌐",text:{uz:"ISP routeri → magistral routerlar",en:"ISP router → backbone routers"}},
      {icon:"🔀",text:{uz:"Har router jadvaldan keyingi hop ni tanlaydi",en:"Each router picks the next hop from its table"}},
      {icon:"🎯",text:{uz:"Oxirgi router → manzil server",en:"Final router → destination server"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Marshrutlash jadvali","The routing table")),
    React.createElement(Terminal,null,"ip route\n# default via 192.168.1.1 dev eth0   ← asosiy chiqish\n# 192.168.1.0/24 dev eth0            ← lokal tarmoq\ntraceroute google.com"),
    React.createElement(P,null,t(lang,"Agar aniq yo'l bo'lmasa, paket \"default gateway\" ga yuboriladi — tarmoqning tashqi olamga eshigi.","With no specific route, the packet goes to the \"default gateway\" — the network's door to the outside world.")),
    React.createElement(CompareCols,{
      left:{title:{uz:"Statik",en:"Static"},color:"#4dabf7",rows:[{uz:"Administrator qo'lda kiritadi",en:"Admin enters routes by hand"},{uz:"Kichik tarmoqlar uchun",en:"For small networks"},{uz:"O'zgarishga moslashmaydi",en:"Doesn't adapt to change"}]},
      right:{title:{uz:"Dinamik",en:"Dynamic"},color:"#69db7c",rows:[{uz:"Routerlar avtomatik o'rganadi",en:"Routers learn automatically"},"OSPF · BGP",{uz:"Katta tarmoqlar uchun",en:"For large networks"}]}}),
        React.createElement(H2,{num:"§4"},t(lang,"Statik va dinamik marshrutlash","Static vs dynamic routing")),
    React.createElement(CompareCols,{left:{title:{uz:"Statik marshrut",en:"Static route"},color:"#ffd43b",rows:[{uz:"Admin qo'lda kiritadi",en:"Admin enters it by hand"},{uz:"Kichik, o'zgarmas tarmoq",en:"Small, stable network"},{uz:"Nazorat to'liq",en:"Full control"},]},right:{title:{uz:"Dinamik (RIP/OSPF/BGP)",en:"Dynamic (RIP/OSPF/BGP)"},color:"#4dabf7",rows:[{uz:"Routerlar o'zaro o'rganadi",en:"Routers learn from each other"},{uz:"Katta tarmoqlar uchun",en:"For large networks"},{uz:"O'zgarishga moslashadi",en:"Adapts to changes"},]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: marshrut jadvali","Practice: the routing table")),
    React.createElement(P,null,t(lang,"ip route qurilmaning marshrut jadvalini ko'rsatadi; default (0.0.0.0/0) — «boshqa hamma narsa shu shlyuzga». traceroute paket qaysi routerlardan o'tishini ko'rsatadi.","ip route shows the device's routing table; default (0.0.0.0/0) means «everything else goes to this gateway». traceroute shows which routers a packet passes through.")),
    React.createElement(Terminal,null,"ip route\n# default via 192.168.1.1 dev eth0   ← nomalum manzillar shu yerga\n# 192.168.1.0/24 dev eth0 proto kernel scope link\ntraceroute 8.8.8.8   # yo'nalishdagi har hop"),
React.createElement(Quiz,{q:{uz:"Router aniq yo'l topmasa, paketni qayerga yuboradi?",en:"With no specific route, where does a router send the packet?"},opts:[{uz:"O'chiradi",en:"Drops it"},{uz:"Default gateway ga",en:"To the default gateway"},{uz:"Orqaga qaytaradi",en:"Back to sender"},{uz:"DNS ga",en:"To DNS"}],correct:1,exp:{uz:"Aniq yo'l bo'lmasa, paket default gateway (asosiy chiqish) ga yuboriladi.",en:"With no specific route, the packet goes to the default gateway (main exit)."}}));
}
function LessonL09(){
  const lang=useLang();
  const vlans=[["VLAN 10",{uz:"Buxgalteriya",en:"Accounting"},"10.0.10.0/24","#ff6b6b"],["VLAN 20",{uz:"IT bo'limi",en:"IT dept"},"10.0.20.0/24","#4dabf7"],["VLAN 30",{uz:"Mehmonlar",en:"Guests"},"10.0.30.0/24","#69db7c"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Switch nima?","What is a switch?")),
    React.createElement(P,null,t(lang,"Switch — lokal tarmoqdagi qurilmalarni bog'lovchi \"aqlli tarqatgich\". U MAC jadvalini saqlaydi va ma'lumotni faqat kerakli qurilmaga yuboradi. Eski \"hub\" hammaga yuborardi (butun sinfga baqirgandek); switch aniq odamga pichirlaydi.","A switch is the \"smart distributor\" connecting devices on a LAN. It keeps a MAC table and sends data only to the right device. An old \"hub\" sent to everyone (shouting to the class); a switch whispers to the exact person.")),
    React.createElement(NodeMap,{label:{uz:"Yulduz (star): hamma switchga ulanadi",en:"Star: everyone connects to the switch"},nodes:[[140,80,"SW"],[140,25],[205,50],[205,110],[140,135],[75,110],[75,50]],links:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]]}),
    React.createElement(H2,{num:"§2"},t(lang,"VLAN nima?","What is a VLAN?")),
    React.createElement(P,null,t(lang,"VLAN bitta fizik switchni bir necha mantiqiy tarmoqqa bo'ladi — katta ofisni devorlar bilan alohida xonalarga bo'lgandek. Bir switchга ulangan bo'lsa ham, bo'limlar bir-birini ko'rmaydi.","A VLAN splits one physical switch into several logical networks — like dividing an office into separate rooms with walls. Even on the same switch, departments can't see each other.")),
    vlans.map(function(v,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,alignItems:"center",padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid "+v[3]+"44",borderLeft:"3px solid "+v[3],borderRadius:10,animationDelay:(i*0.07)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontWeight:700,color:v[3],fontSize:12,minWidth:70}},v[0]),
      React.createElement("span",{style:{flex:1,fontSize:12.5,color:"var(--text-0)"}},t(lang,v[1].uz,v[1].en)),
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-2)"}},v[2]));}),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,"Trunk: "),t(lang,"VLAN lar orasida trafikni tashiydigan maxsus port \"trunk\" deyiladi — u bir necha VLAN ni teglar (802.1Q) bilan tashiydi.","A special port carrying traffic between VLANs is a \"trunk\" — it carries several VLANs, tagging each (802.1Q).")),
        React.createElement(H2,{num:"§3"},t(lang,"Hub, switch va router","Hub, switch and router")),
    React.createElement(LayerStack,{layers:[{n:"Hub",name:t(lang,"Hub","Hub"),color:"#ff6b6b",desc:{uz:"Hamma portga takrorlaydi — eski, xavfsiz emas.",en:"Repeats to every port — old, insecure."}},{n:"Switch",name:t(lang,"Switch","Switch"),color:"#69db7c",desc:{uz:"MAC bo'yicha faqat kerakli portga (2-qatlam).",en:"By MAC, only to the right port (layer 2)."}},{n:"Router",name:t(lang,"Router","Router"),color:"#4dabf7",desc:{uz:"Tarmoqlar orasida (3-qatlam, IP).",en:"Between networks (layer 3, IP)."}},]}),
    React.createElement(H2,{num:"§4"},t(lang,"VLAN va amaliyot","VLAN and practice")),
    React.createElement(P,null,t(lang,"VLAN bitta fizik switchni bir necha mantiqiy tarmoqqa ajratadi — masalan mehmonlar va xodimlar bir kabelda, lekin ajratilgan. Bu xavfsizlik va tartib uchun. Trunk port bir necha VLAN ni bitta havola orqali tashiydi (802.1Q teglash).","A VLAN splits one physical switch into several logical networks — e.g. guests and staff on the same wiring but separated. This is for security and order. A trunk port carries several VLANs over one link (802.1Q tagging).")),
    React.createElement(Terminal,null,"# switchda (Cisco IOS)\nshow vlan brief\n# VLAN Name     Status  Ports\n# 10   Staff     active  Fa0/1, Fa0/2\n# 20   Guest     active  Fa0/3\n# → mehmon (20) xodim (10) trafigini ko'ra olmaydi"),
React.createElement(Quiz,{q:{uz:"VLAN nima uchun ishlatiladi?",en:"What is a VLAN used for?"},opts:[{uz:"Internet tezligini oshirish",en:"Boosting internet speed"},{uz:"Bitta switchni mantiqan alohida tarmoqlarga bo'lish",en:"Logically splitting one switch into separate networks"},{uz:"Parol saqlash",en:"Storing passwords"},{uz:"IP berish",en:"Handing out IPs"}],correct:1,exp:{uz:"VLAN bitta fizik switchni bir necha mantiqiy tarmoqqa bo'ladi — bo'limlarni ajratib xavfsizlik beradi.",en:"A VLAN splits one physical switch into several logical networks — separating departments for security."}}));
}
function LessonL10(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"NAT nima?","What is NAT?")),
    React.createElement(P,null,t(lang,"NAT ko'plab xususiy IP ni bitta ommaviy IP ga aylantiradi. Uydagi barcha qurilma internetga bitta ommaviy IP orqali chiqadi — ofis kommutatori kabi: tashqaridan bitta raqam, ichkarida ko'p ichki raqam.","NAT turns many private IPs into one public IP. All your home devices reach the internet through a single public IP — like an office switchboard: one number outside, many extensions inside.")),
    React.createElement(PacketFlow,{from:{uz:"Uy qurilmalari",en:"Home devices"},to:{uz:"Internet",en:"Internet"},label:{uz:"NAT (bitta ommaviy IP)",en:"NAT (one public IP)"}}),
    React.createElement(H2,{num:"§2"},t(lang,"Nega NAT kerak?","Why NAT?")),
    React.createElement(P,null,t(lang,"IPv4 manzillar kam (~4.3 mlrd), qurilmalar milliardlab. NAT bitta ommaviy IP ni ko'p qurilma bilan ulashadi — manzillarni tejaydi. Ichki qurilmalar internetdan to'g'ridan-to'g'ri ko'rinmaydi — qo'shimcha xavfsizlik.","IPv4 addresses are scarce (~4.3B), devices number in the billions. NAT shares one public IP among many devices — saving addresses. Internal devices aren't directly visible — extra security.")),
    React.createElement(H2,{num:"§3"},t(lang,"PAT — portlar bilan","PAT — using ports")),
    React.createElement(P,null,t(lang,"PAT — NAT ning eng keng tarqalgan turi. Router har ichki ulanishga alohida port beradi, shunda qaysi javob qaysi qurilmaga tegishli ekanini biladi (har kishiga alohida quti raqami bergandek).","PAT is the most common NAT. The router gives each internal connection a unique port, so it knows which reply belongs to which device (like giving each person a box number).")),
    React.createElement(Terminal,null,"192.168.1.5:52001 → 203.0.113.7:40001 → server\n192.168.1.6:49500 → 203.0.113.7:40002 → server\n# bitta ommaviy IP (203.0.113.7), ko'p port"),
        React.createElement(H2,{num:"§4"},t(lang,"NAT turlari: SNAT, DNAT, PAT","NAT types: SNAT, DNAT, PAT")),
    React.createElement(LayerStack,{layers:[{n:"SNAT",name:t(lang,"Source NAT","Source NAT"),color:"#4dabf7",desc:{uz:"Chiquvchi: ichki IP → ommaviy IP.",en:"Outbound: internal IP → public IP."}},{n:"DNAT",name:t(lang,"Destination NAT","Destination NAT"),color:"#69db7c",desc:{uz:"Kiruvchi: ommaviy → ichki server (port forward).",en:"Inbound: public → internal server (port forward)."}},{n:"PAT",name:t(lang,"Port Address Translation","Port Address Translation"),color:"#a855f7",desc:{uz:"Ko'p qurilma bitta IP, port bilan ajratiladi.",en:"Many devices, one IP, separated by port."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: NAT jadvali","Practice: the NAT table")),
    React.createElement(P,null,t(lang,"Uy routeri PAT ishlatadi: 10 ta qurilma bitta ommaviy IP dan chiqadi, router har birini port raqami bilan eslab qoladi. Linux'da iptables NAT jadvalini boshqaradi.","A home router uses PAT: 10 devices exit through one public IP, and the router remembers each by port number. On Linux, iptables manages the NAT table.")),
    React.createElement(Terminal,null,"sudo iptables -t nat -L -n\n# Chain POSTROUTING (policy ACCEPT)\n# MASQUERADE  all  --  192.168.1.0/24  0.0.0.0/0   ← SNAT/PAT\nsudo conntrack -L | head   # faol NAT ulanishlari"),
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
    React.createElement(P,null,t(lang,"Tarmoq topologiyasi — qurilmalar bir-biriga qanday ulanganining \"shakli\". Shahar ko'chalarini turlicha rejalashtirish mumkin bo'lgani kabi, tarmoqni ham turli shakllarda qurish mumkin. Har birining afzallik va kamchiligi bor.","A network topology is the \"shape\" of how devices connect. Like a city's streets can be laid out differently, a network can be built in different shapes. Each has pros and cons.")),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy topologiyalar","Main topologies")),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}},
      maps.map(function(m,i){return React.createElement(NodeMap,{key:i,label:m.label,color:m.color,nodes:m.nodes,links:m.links});})),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,t(lang,"Amalda: ","In practice: ")),t(lang,"zamonaviy tarmoqlar aksariyat Star topologiyasidan foydalanadi — har qurilma markaziy switchга ulanadi. Bitta qurilma uzilsa, boshqalar ishlayveradi.","most modern networks use the Star topology — each device connects to a central switch. If one device fails, the others keep working.")),
        React.createElement(H2,{num:"§3"},t(lang,"Topologiyalarni solishtirish","Comparing topologies")),
    React.createElement(CompareCols,{left:{title:{uz:"Yulduz (Star)",en:"Star"},color:"#69db7c",rows:[{uz:"Markazda switch/router",en:"A switch/router in the center"},{uz:"Bitta uzilsa — faqat o'zi",en:"One fails — only itself"},{uz:"Eng keng tarqalgan",en:"The most common"},]},right:{title:{uz:"Halqa/Shina (Ring/Bus)",en:"Ring/Bus"},color:"#ff6b6b",rows:[{uz:"Bitta uzilish hammani buzadi",en:"One break can down all"},{uz:"Eski, kam ishlatiladi",en:"Old, rarely used"},{uz:"Kabel tejaydi",en:"Saves cabling"},]}}),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: yetib borishni tekshirish","Practice: checking reachability")),
    React.createElement(P,null,t(lang,"ping qurilmaga yetib borish mumkinligini, traceroute yo'lni ko'rsatadi. Yulduz topologiyasida barcha yo'l markaziy qurilmadan o'tadi.","ping checks whether a device is reachable, traceroute shows the path. In a star topology every path goes through the central device.")),
    React.createElement(Terminal,null,"ping -c3 192.168.1.20\n# 64 bytes from 192.168.1.20: icmp_seq=1 ttl=64 time=0.8 ms\n# 3 packets transmitted, 3 received, 0% packet loss\nfping -a -g 192.168.1.0/24 2>/dev/null   # butun tarmoqni tez"),
React.createElement(Quiz,{q:{uz:"Qaysi topologiyada bitta qurilma uzilsa ham qolganlari ishlayveradi va u eng keng tarqalgan?",en:"In which topology do the rest keep working if one device fails, and which is most common?"},opts:[{uz:"Bus",en:"Bus"},{uz:"Star (yulduz)",en:"Star"},{uz:"Ring (halqa)",en:"Ring"},{uz:"Hech qaysi",en:"None"}],correct:1,exp:{uz:"Star da hamma markaziy switchга ulanadi — bitta uzilса boshqalarga ta'sir qilmaydi. Shu sababli eng keng tarqalgan.",en:"In Star everyone connects to a central switch — one failure doesn't affect others. That's why it's most common."}}));
}
function LessonL12(){
  const lang=useLang();
  const std=[["802.11n","WiFi 4","600 Mbps"],["802.11ac","WiFi 5",{uz:"bir necha Gbps",en:"several Gbps"}],["802.11ax","WiFi 6",{uz:"gavjum joyda yaxshi",en:"better in crowds"}]];
  const sec=[["WEP","#ff3a5e",{uz:"Buzilgan — ISHLATMANG",en:"Broken — DON'T USE"}],["WPA","#ff9145",{uz:"Eskirgan",en:"Outdated"}],["WPA2","#ffd43b",{uz:"Uzoq vaqt standart",en:"Long-time standard"}],["WPA3","#69db7c",{uz:"Eng yangi va xavfsiz",en:"Newest and safest"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Simsiz tarmoq nima?","What is a wireless network?")),
    React.createElement(P,null,t(lang,"WiFi — kabel o'rniga radio to'lqinlari orqali ma'lumot uzatadi. Qurilmangiz access point (router) bilan radio orqali gaplashadi. Havoda hamma \"eshitishi\" mumkin, shuning uchun shifrlash muhim.","WiFi sends data over radio waves instead of cables. Your device talks to an access point (router) by radio. Anyone in the air can \"hear\", so encryption matters.")),
    React.createElement(PacketFlow,{from:{uz:"Qurilma",en:"Device"},to:{uz:"Access Point",en:"Access Point"},label:{uz:"radio to'lqin",en:"radio waves"}}),
    React.createElement(H2,{num:"§2"},t(lang,"WiFi standartlari","WiFi standards")),
    std.map(function(s,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--accent)",fontSize:11.5,minWidth:80}},s[0]),
      React.createElement("span",{style:{fontSize:12,fontWeight:600,color:"var(--text-0)",minWidth:56}},s[1]),
      React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},typeof s[2]==="string"?s[2]:t(lang,s[2].uz,s[2].en)));}),
    React.createElement(H2,{num:"§3"},t(lang,"WiFi xavfsizligi","WiFi security")),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6,margin:"6px 0 12px"}},
      sec.map(function(s,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"9px 14px",background:s[1]+"0d",border:"1px solid "+s[1]+"44",borderRadius:9,animationDelay:(i*0.06)+"s"}},
        React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontWeight:700,color:s[1],fontSize:12,minWidth:56}},s[0]),
        React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,s[2].uz,s[2].en)));})),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"WEP ni hech qachon ishlatmang — bir necha daqiqada buziladi. Kamida WPA2, imkon bo'lsa WPA3 va kuchli parol qo'ying.","Never use WEP — it cracks in minutes. Use at least WPA2, ideally WPA3, with a strong password.")),
        React.createElement(H2,{num:"§4"},t(lang,"WiFi shifrlash avlodlari","WiFi encryption generations")),
    React.createElement(LayerStack,{layers:[{n:"WEP",name:t(lang,"WEP","WEP"),color:"#ff6b6b",desc:{uz:"Buzilgan — soniyalarda ochiladi. Ishlatmang.",en:"Broken — cracked in seconds. Do not use."}},{n:"WPA",name:t(lang,"WPA","WPA"),color:"#ffa94d",desc:{uz:"Eskirgan, zaif (TKIP).",en:"Outdated, weak (TKIP)."}},{n:"WPA2",name:t(lang,"WPA2","WPA2"),color:"#4dabf7",desc:{uz:"Ko'p yillik standart (AES).",en:"The long-time standard (AES)."}},{n:"WPA3",name:t(lang,"WPA3","WPA3"),color:"#69db7c",desc:{uz:"Eng yangi va xavfsiz — tavsiya.",en:"Newest and safest — recommended."}},]}),
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
    React.createElement(P,null,t(lang,"VPN internet ustidan xavfsiz, shifrlangan \"tunnel\" quradi. Ma'lumotingiz ochiq internetdan o'tsa ham, shifrlangan quvur ichida ketadi — ochiq maydondan o'tayotgan yashirin yer osti yo'li kabi.","A VPN builds a secure, encrypted \"tunnel\" over the internet. Even crossing the public internet, your data travels inside an encrypted pipe — like a hidden tunnel across an open field.")),
    React.createElement(PacketFlow,{from:{uz:"Siz",en:"You"},to:{uz:"Ofis / Internet",en:"Office / Internet"},label:{uz:"🔒 shifrlangan tunnel",en:"🔒 encrypted tunnel"},color:"#69db7c"}),
    React.createElement(H2,{num:"§2"},t(lang,"VPN nima uchun kerak?","Why use a VPN?")),
    React.createElement("div",{style:{margin:"6px 0 12px"}},
      [[{uz:"Maxfiylik",en:"Privacy"},{uz:"Provayder trafikingizni ko'ra olmaydi",en:"Your ISP can't see your traffic"}],
       [{uz:"Ochiq WiFi himoyasi",en:"Public WiFi safety"},{uz:"Kafe/aeroport WiFi da shifrlanadi",en:"Encrypted on café/airport WiFi"}],
       [{uz:"Masofaviy ish",en:"Remote work"},{uz:"Uydan ofis tarmog'iga xavfsiz ulanish",en:"Securely reach the office from home"}]].map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.06)+"s"}},
        React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:120}},t(lang,x[0].uz,x[0].en)),
        React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));})),
    React.createElement(H2,{num:"§3"},t(lang,"Turlari va protokollar","Types and protocols")),
    React.createElement(Terminal,null,"Turlari:\n  Site-to-Site  — ikki ofis tarmog'ini bog'laydi\n  Remote Access — bitta foydalanuvchi ulanadi\nProtokollar:  IPsec · OpenVPN · WireGuard"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"VPN sizni to'liq \"ko'rinmas\" qilmaydi — u faqat trafikni shifrlaydi. VPN provayderiga ishonishingiz kerak. Bepul VPN lar ko'pincha ma'lumotingizni sotadi.","A VPN doesn't make you fully \"invisible\" — it only encrypts traffic. You must trust the provider. Free VPNs often sell your data.")),
        React.createElement(H2,{num:"§4"},t(lang,"VPN turlari va protokollari","VPN types and protocols")),
    React.createElement(CompareCols,{left:{title:{uz:"Remote-access",en:"Remote-access"},color:"#4dabf7",rows:[{uz:"Bitta foydalanuvchi → tarmoq",en:"One user → a network"},{uz:"Masofadan ishlash uchun",en:"For remote work"},{uz:"OpenVPN, WireGuard",en:"OpenVPN, WireGuard"},]},right:{title:{uz:"Site-to-site",en:"Site-to-site"},color:"#69db7c",rows:[{uz:"Ofis ↔ ofis",en:"Office ↔ office"},{uz:"Doimiy tunnel",en:"A permanent tunnel"},{uz:"IPsec",en:"IPsec"},]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: tunnel holati","Practice: tunnel status")),
    React.createElement(P,null,t(lang,"VPN shifrlangan «tunnel» yaratadi — trafik ochiq tarmoqdan o'tsa ham o'qib bo'lmaydi. tun0 interfeysi VPN faol ekanini ko'rsatadi.","A VPN creates an encrypted «tunnel» — even if traffic crosses an open network, it can't be read. The tun0 interface shows the VPN is active.")),
    React.createElement(Terminal,null,"sudo wg show     # WireGuard holati\n# interface: wg0\n#   public key: xTIB...=   peer: 3.5.7.9:51820\n#   latest handshake: 12 seconds ago\nip a show tun0\n# inet 10.8.0.2/24   ← VPN ichidagi manzil"),
React.createElement(Quiz,{q:{uz:"VPN ma'lumotingiz bilan asosan nima qiladi?",en:"What does a VPN mainly do with your data?"},opts:[{uz:"Tezlashtiradi",en:"Speeds it up"},{uz:"Shifrlangan tunnel ichida uzatadi",en:"Sends it through an encrypted tunnel"},{uz:"O'chiradi",en:"Deletes it"},{uz:"Rasmga aylantiradi",en:"Turns it into an image"}],correct:1,exp:{uz:"VPN internet ustidan shifrlangan tunnel quradi — ma'lumot ochiq tarmoqdan o'tsa ham ichi ko'rinmaydi.",en:"A VPN builds an encrypted tunnel over the internet — the contents can't be seen even on a public network."}}));
}
function LessonL15(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"SSL/TLS nima?","What is SSL/TLS?")),
    React.createElement(P,null,t(lang,"TLS — internetda ma'lumotni shifrlaydigan protokol, HTTPS ning \"S\" harfi (SSL — eski nomi). U ikki narsani beradi: maxfiylik (hech kim o'qiy olmaydi) va ishonch (haqiqiy sayt bilan gaplashyapsiz).","TLS is the protocol that encrypts data on the internet — the \"S\" in HTTPS (SSL is the old name). It provides two things: confidentiality (no one can read it) and trust (you're talking to the real site).")),
    React.createElement(H2,{num:"§2"},t(lang,"TLS qo'l berishi","The TLS handshake")),
    React.createElement(P,null,t(lang,"Ulanishdan oldin client va server shifrni kelishadi va serverning haqiqiyligini tekshiradi. \"Ishga tushir\":","Before connecting, client and server agree on encryption and verify the server's identity. Press Play:")),
    React.createElement(FlowSteps,{color:"#69db7c",title:{uz:"TLS handshake",en:"TLS handshake"},steps:[
      {icon:"👋",text:{uz:"Client → Server:  \"salom, qaysi shifrlarni bilasan?\"",en:"Client → Server:  \"hello, which ciphers do you support?\""}},
      {icon:"📜",text:{uz:"Server → Client:  shifr + sertifikat",en:"Server → Client:  cipher + certificate"}},
      {icon:"🔍",text:{uz:"Client sertifikatni tekshiradi (CA imzosi?)",en:"Client verifies the certificate (CA signature?)"}},
      {icon:"🔑",text:{uz:"Ikkalasi umumiy maxfiy kalitni kelishadi",en:"Both agree on a shared secret key"}},
      {icon:"🔒",text:{uz:"Endi hamma narsa shifrlanadi",en:"Everything is now encrypted"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Sertifikat va CA","Certificates and CAs")),
    React.createElement(P,null,t(lang,"Sayt haqiqiyligini \"sertifikat\" bilan isbotlaydi (raqamli pasport). Uni ishonchli tashkilot (CA) imzolaydi. Brauzer CA ro'yxatini biladi, shuning uchun soxta sertifikatni darhol aniqlaydi.","A site proves it's genuine with a \"certificate\" (a digital passport), signed by a trusted CA. The browser knows the CA list, so it instantly detects a fake certificate.")),
        React.createElement(H2,{num:"§4"},t(lang,"TLS handshake bosqichlari","The TLS handshake")),
    React.createElement(FlowSteps,{color:"#69db7c",title:{uz:"HTTPS ulanishi",en:"An HTTPS connection"},steps:[{icon:"👋",text:{uz:"Client Hello — qo'llab-quvvatlanadigan shifrlar",en:"Client Hello — supported ciphers"}},{icon:"📜",text:{uz:"Server sertifikat + ochiq kalitni yuboradi",en:"Server sends its certificate + public key"}},{icon:"✅",text:{uz:"Brauzer CA imzosini tekshiradi",en:"The browser verifies the CA signature"}},{icon:"🔑",text:{uz:"Umumiy sessiya kaliti kelishiladi",en:"A shared session key is agreed"}},{icon:"🔒",text:{uz:"Shifrlangan ma'lumot almashinuvi",en:"Encrypted data exchange begins"}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: sertifikatni tekshirish","Practice: inspecting a certificate")),
    React.createElement(P,null,t(lang,"openssl s_client server sertifikatini, kim imzolaganini (Issuer = CA) va amal muddatini ko'rsatadi. Ishonchli CA imzolamagan sertifikat — brauzerda ogohlantirish beradi.","openssl s_client shows the server certificate, who signed it (Issuer = CA) and its validity. A certificate not signed by a trusted CA triggers a browser warning.")),
    React.createElement(Terminal,null,"openssl s_client -connect example.com:443 -brief\n# subject: CN=example.com\n# issuer: C=US, O=DigiCert Inc, CN=DigiCert TLS RSA CA  ← CA\n# Protocol: TLSv1.3   Cipher: TLS_AES_256_GCM_SHA384"),
React.createElement(Quiz,{q:{uz:"TLS sertifikatini kim imzolaydi, shunda brauzer ishonadi?",en:"Who signs a TLS certificate so the browser trusts it?"},opts:[{uz:"Foydalanuvchi",en:"The user"},{uz:"Certificate Authority (CA)",en:"A Certificate Authority (CA)"},{uz:"Provayder",en:"The ISP"},{uz:"DNS server",en:"The DNS server"}],correct:1,exp:{uz:"Ishonchli CA sertifikatni imzolaydi. Brauzer CA lar ro'yxatini biladi — haqiqiy va soxta sertifikatni ajratadi.",en:"A trusted CA signs the certificate. The browser knows the CA list — telling real from fake."}}));
}
function LessonL16(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"IDS va IPS nima?","What are IDS and IPS?")),
    React.createElement(P,null,t(lang,"IDS tarmoqni kuzatib, shubhali harakatni aniqlaydi va ogohlantiradi. IPS bir qadam oldinga o'tadi — hujumni bloklaydi ham. IDS — signalizatsiya (\"o'g'ri kirdi!\"), IPS — qulflaydigan qorovul.","An IDS watches the network and alerts on suspicious activity. An IPS goes further — it also blocks the attack. IDS is an alarm (\"a burglar!\"), IPS is a guard that locks the door.")),
    React.createElement(CompareCols,{
      left:{title:"IDS",color:"#ffd43b",rows:[{uz:"Aniqlaydi + ogohlantiradi",en:"Detects + alerts"},{uz:"Trafik nusxasini ko'radi (passiv)",en:"Sees a copy of traffic (passive)"},{uz:"Hujumni to'xtatmaydi",en:"Doesn't stop the attack"}]},
      right:{title:"IPS",color:"#ff3a5e",rows:[{uz:"Aniqlaydi + bloklaydi",en:"Detects + blocks"},{uz:"Trafik ichidan o'tadi (inline)",en:"Sits inline in the traffic path"},{uz:"Real vaqtda to'xtatadi",en:"Stops it in real time"}]}}),
    React.createElement(H2,{num:"§2"},t(lang,"Qanday ishlaydi","How it works")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"IPS oqimi",en:"IPS flow"},steps:[
      {icon:"👁",text:{uz:"Trafik kuzatiladi",en:"Traffic is monitored"}},
      {icon:"🔎",text:{uz:"Signature (ma'lum hujum) yoki anomaliya topiladi",en:"Signature (known attack) or anomaly detected"}},
      {icon:"🚨",text:{uz:"Ogohlantirish yaratiladi",en:"An alert is raised"}},
      {icon:"⛔",text:{uz:"IPS: zararli paket bloklanadi",en:"IPS: the malicious packet is blocked"}},
    ]}),
    React.createElement(Terminal,null,"# Snort qoida misoli (soddalashtirilgan):\nalert tcp any any -> 10.0.0.0/24 22 (msg:\"SSH urinishi\";)"),
        React.createElement(H2,{num:"§3"},t(lang,"Aniqlash usullari va joylashuvi","Detection methods and placement")),
    React.createElement(LayerStack,{layers:[{n:"sig",name:t(lang,"Signature","Signature"),color:"#4dabf7",desc:{uz:"Ma'lum hujum imzolari (tez, yangi hujumni o'tkazadi).",en:"Known attack signatures (fast, misses new attacks)."}},{n:"anom",name:t(lang,"Anomaly","Anomaly"),color:"#69db7c",desc:{uz:"Odatiy xatti-harakatdan chetlanish (yangi hujum).",en:"Deviation from normal (catches new attacks)."}},{n:"NIDS",name:t(lang,"NIDS","NIDS"),color:"#a855f7",desc:{uz:"Tarmoq bo'ylab (Snort, Suricata).",en:"Across the network (Snort, Suricata)."}},{n:"HIDS",name:t(lang,"HIDS","HIDS"),color:"#ffd43b",desc:{uz:"Xost ichida (OSSEC, Wazuh).",en:"On the host (OSSEC, Wazuh)."}},]}),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: ogohlantirishlar","Practice: alerts")),
    React.createElement(P,null,t(lang,"IDS faqat ogohlantiradi (kuzatuvchi), IPS esa bloklaydi (yo'lda turadi). Snort ma'lum hujum imzosiga mos trafikni ko'rganda ogohlantirish yozadi.","An IDS only alerts (a monitor), while an IPS blocks (sits inline). Snort writes an alert when traffic matches a known attack signature.")),
    React.createElement(Terminal,null,"# Snort ogohlantirishi (fast alert)\n# [**] [1:2100498:7] GPL ATTACK_RESPONSE id check [**]\n# [Priority: 2] {TCP} 10.0.0.9:445 -> 10.0.0.5:51324\n# → SMB hujumi shubhasi aniqlandi"),
React.createElement(Quiz,{q:{uz:"IDS va IPS o'rtasidagi asosiy farq nima?",en:"Key difference between IDS and IPS?"},opts:[{uz:"IDS tezroq",en:"IDS is faster"},{uz:"IPS hujumni bloklaydi, IDS faqat ogohlantiradi",en:"IPS blocks the attack, IDS only alerts"},{uz:"IDS faqat WiFi da",en:"IDS is WiFi-only"},{uz:"Farqi yo'q",en:"No difference"}],correct:1,exp:{uz:"IDS aniqlaydi va ogohlantiradi; IPS aniqlaydi va real vaqtda bloklaydi.",en:"IDS detects and alerts; IPS detects and blocks in real time."}}));
}
function LessonL17(){
  const lang=useLang();
  const zones=[["🌍 INTERNET",{uz:"Tashqi olam",en:"Outside world"},"#ff3a5e"],["🧱 Firewall 1",{uz:"Tashqi devor",en:"Outer wall"},"#ff9145"],["🖥 DMZ",{uz:"Veb/email server — internetdan ko'rinadi",en:"Web/email server — internet-facing"},"#ffd43b"],["🧱 Firewall 2",{uz:"Ichki devor (qat'iyroq)",en:"Inner wall (stricter)"},"#ff9145"],["🔒 ICHKI TARMOQ",{uz:"Maxfiy ma'lumot",en:"Sensitive data"},"#69db7c"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DMZ nima?","What is a DMZ?")),
    React.createElement(P,null,t(lang,"DMZ — ichki tarmoq va internet o'rtasidagi \"neytral zona\". Internetdan ko'rinishi kerak bo'lgan serverlar shu yerda turadi. Hujumchi DMZ dagi serverni buzsa ham, ichki maxfiy tarmoqqa kira olmaydi (uy oldidagi mehmonlar zali kabi).","A DMZ is a \"neutral zone\" between the internal network and the internet. Internet-facing servers live here. Even if an attacker breaks a DMZ server, they can't reach the sensitive internal network (like a reception hall in front of your house).")),
    React.createElement(H2,{num:"§2"},t(lang,"DMZ arxitekturasi","DMZ architecture")),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6,margin:"8px 0"}},
      zones.map(function(z,i){return React.createElement("div",{key:i,className:"na-rise",style:{textAlign:"center",padding:"10px 14px",background:z[2]+"12",border:"1px solid "+z[2]+"55",borderRadius:10,animationDelay:(i*0.09)+"s"}},
        React.createElement("div",{style:{fontWeight:700,fontSize:13,color:z[2]}},z[0]),
        React.createElement("div",{style:{fontSize:11,color:"var(--text-2)",marginTop:2}},t(lang,z[1].uz,z[1].en)));})),
    React.createElement(P,null,t(lang,"DMZ ikki devor orasida joylashadi. Tashqi devor internetdan DMZ ga cheklangan kirishga ruxsat beradi; ichki devor DMZ dan ichki tarmoqqa deyarli hech narsa o'tkazmaydi.","The DMZ sits between two firewalls. The outer allows limited access to the DMZ; the inner passes almost nothing from DMZ into the internal network.")),
        React.createElement(H2,{num:"§3"},t(lang,"DMZ arxitekturasi","The DMZ architecture")),
    React.createElement(P,null,t(lang,"DMZ (demilitarizatsiya zonasi) — internet va ichki tarmoq orasidagi «bufer» zona. Tashqaridan ko'rinishi kerak bo'lgan serverlar (veb, pochta) shu yerga qo'yiladi. Agar hujumchi DMZ dagi serverni buzsa ham, u to'g'ridan-to'g'ri ichki tarmoqqa (ma'lumotlar bazasi, xodimlar) o'ta olmaydi — ikkinchi firewall to'sadi.","A DMZ (demilitarized zone) is a «buffer» between the internet and the internal network. Servers that must be reachable from outside (web, mail) go here. Even if an attacker breaks a DMZ server, they can't move straight into the internal network (database, staff) — a second firewall blocks it.")),
    React.createElement(NodeMap,{nodes:[[28,80,"Internet"],[105,80,"Firewall"],[195,42,"DMZ Web"],[195,120,"Ichki"]],links:[[0,1],[1,2],[1,3]],color:"#4dabf7",label:{uz:"Internet → Firewall → DMZ / Ichki",en:"Internet → Firewall → DMZ / Internal"}}),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: qatlamli himoya","Practice: layered defense")),
    React.createElement(P,null,t(lang,"DMZ «defense in depth» tamoyilining amaliy ko'rinishi: bir necha to'siq. Tashqi firewall faqat 80/443 ni DMZ ga o'tkazadi; ichki firewall DMZ dan ichkariga faqat zarur portni ochadi.","The DMZ is «defense in depth» in practice: several barriers. The outer firewall passes only 80/443 to the DMZ; the inner firewall opens only the necessary port from the DMZ inward.")),
    React.createElement(Terminal,null,"# Tashqi firewall qoidasi (soddalashtirilgan)\n# ALLOW  internet -> DMZ_web : 80,443\n# DENY   internet -> internal : ALL\n# ALLOW  DMZ_web  -> DB : 3306 only   ← faqat kerakli port"),
React.createElement(Quiz,{q:{uz:"Veb-server odatda qayerga joylashtiriladi va nima uchun?",en:"Where is a web server usually placed, and why?"},opts:[{uz:"Ichki tarmoqda",en:"In the internal network"},{uz:"DMZ da — buzilса ham ichki tarmoq himoyalanadi",en:"In the DMZ — so a breach doesn't reach the internal network"},{uz:"Routerda",en:"On the router"},{uz:"Tarmoqsiz",en:"With no network"}],correct:1,exp:{uz:"Internetdan ko'rinadigan serverlar DMZ ga qo'yiladi. Buzilса ham, ikkinchi (ichki) firewall maxfiy tarmoqni himoya qiladi.",en:"Internet-facing servers go in the DMZ. Even if breached, the inner firewall protects the sensitive network."}}));
}
function LessonL18(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"802.1X va NAC nima?","What are 802.1X and NAC?")),
    React.createElement(P,null,t(lang,"802.1X — tarmoqqa kirishni nazorat qiluvchi standart. Qurilma portga ulanganda \"kim sen?\" deb so'raydi va faqat tasdiqlanganlarni kiritadi. NAC — shu g'oyaning kengroq nomi. Ofis eshigidagi qorovul kabi — propuskingizni ko'rsatasiz.","802.1X is a standard that controls network access. When a device connects, it asks \"who are you?\" and admits only verified devices. NAC is the broader name. Like a guard at the office door — you show your badge.")),
    React.createElement(H2,{num:"§2"},t(lang,"Uch ishtirokchi","Three players")),
    React.createElement(FlowSteps,{title:{uz:"802.1X autentifikatsiya",en:"802.1X authentication"},steps:[
      {icon:"💻",text:{uz:"Supplicant (qurilma) → Switch:  \"ulanaman\"",en:"Supplicant (device) → Switch:  \"I want to connect\""}},
      {icon:"🚪",text:{uz:"Authenticator (switch) → RADIUS:  \"kim u?\"",en:"Authenticator (switch) → RADIUS:  \"who is this?\""}},
      {icon:"🛂",text:{uz:"RADIUS server login/parolni tekshiradi",en:"RADIUS server checks the credentials"}},
      {icon:"✅",text:{uz:"To'g'ri → port ochiladi  |  ✗ Xato → bloklanadi",en:"OK → port opens  |  ✗ Wrong → blocked"}},
    ]}),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,"RADIUS: "),t(lang,"markazlashtirilgan autentifikatsiya serveri — foydalanuvchi ma'lumotlarini tekshiradi va kirishga ruxsat beradi yoki rad etadi. Yirik tashkilotlarda keng qo'llanadi.","a centralized authentication server — checks credentials and grants or denies access. Widely used in large organizations.")),
        React.createElement(H2,{num:"§3"},t(lang,"802.1X uch qismi","The three 802.1X parts")),
    React.createElement(LayerStack,{layers:[{n:"supplicant",name:t(lang,"Supplicant","Supplicant"),color:"#4dabf7",desc:{uz:"Kirmoqchi bo'lgan qurilma (mijoz).",en:"The device trying to connect (client)."}},{n:"authenticator",name:t(lang,"Authenticator","Authenticator"),color:"#69db7c",desc:{uz:"Switch/AP — «eshik qorovuli».",en:"The switch/AP — the «door guard»."}},{n:"radius",name:t(lang,"RADIUS server","RADIUS server"),color:"#a855f7",desc:{uz:"Haqiqiy tekshiruvni bajaradi.",en:"Performs the actual authentication."}},]}),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: NAC oqimi","Practice: the NAC flow")),
    React.createElement(P,null,t(lang,"802.1X (Network Access Control) qurilma tarmoqqa ulanishidan OLDIN uni tekshiradi. Switch o'zi qaror qilmaydi — u so'rovni RADIUS serveriga uzatadi; faqat tasdiqdan keyin port ochiladi.","802.1X (Network Access Control) checks a device BEFORE it joins the network. The switch doesn't decide itself — it relays the request to a RADIUS server; only after approval does the port open.")),
    React.createElement(Terminal,null,"# RADIUS log (freeradius)\n# rlm_ldap: user 'alice' authenticated\n# Access-Accept for user alice, VLAN=10\n# → port ochildi, xodim VLAN iga ulandi"),
React.createElement(Quiz,{q:{uz:"802.1X da qurilmani haqiqiy tekshiruvdan o'tkazadigan qism qaysi?",en:"In 802.1X, which part performs the actual verification?"},opts:[{uz:"Supplicant (qurilma)",en:"The supplicant (device)"},{uz:"Authenticator (switch)",en:"The authenticator (switch)"},{uz:"Auth server (RADIUS)",en:"The auth server (RADIUS)"},{uz:"DNS server",en:"The DNS server"}],correct:2,exp:{uz:"RADIUS auth server login/parolni tekshiradi. Switch faqat \"eshik\", qurilma esa supplicant.",en:"The RADIUS auth server checks the credentials. The switch is just the \"door\", the device is the supplicant."}}));
}
function LessonL19(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Paket filtrlash nima?","What is packet filtering?")),
    React.createElement(P,null,t(lang,"Paket filtrlash — har paketni ko'rib, qoidalar asosida o'tkazish yoki bloklash. Har paketning manba/manzil IP si, porti va protokoli tekshiriladi — chegaradagi bojxona kabi.","Packet filtering inspects each packet and allows or blocks it by rules. Each packet's source/destination IP, port and protocol are checked — like customs at a border.")),
    React.createElement(H2,{num:"§2"},t(lang,"Stateless va Stateful","Stateless vs stateful")),
    React.createElement(CompareCols,{
      left:{title:{uz:"Stateless (holatsiz)",en:"Stateless"},color:"#4dabf7",rows:[{uz:"Har paketni alohida ko'radi",en:"Judges each packet alone"},{uz:"Kontekstsiz",en:"No context"},{uz:"Tez, lekin sodda",en:"Fast but simple"}]},
      right:{title:{uz:"Stateful (holatli)",en:"Stateful"},color:"#69db7c",rows:[{uz:"Ulanish holatini eslaydi",en:"Remembers connection state"},{uz:"Javob paketlarini taniydi",en:"Recognizes reply packets"},{uz:"Aqlliroq, xavfsizroq",en:"Smarter, safer"}]}}),
    React.createElement(H2,{num:"§3"},t(lang,"iptables misoli","An iptables example")),
    React.createElement(Terminal,null,"# 22-portga faqat bitta IP dan ruxsat\nsudo iptables -A INPUT -p tcp -s 10.0.0.5 --dport 22 -j ACCEPT\n# Boshqa hamma SSH urinishini bloklash\nsudo iptables -A INPUT -p tcp --dport 22 -j DROP"),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,t(lang,"Qoidalar tartibi muhim: ","Rule order matters: ")),t(lang,"birinchi mos kelgan qoida ishlaydi — aniq ALLOW umumiy DROP dan oldin turishi kerak.","the first matching rule wins — specific ALLOW must come before a general DROP.")),
        React.createElement(H2,{num:"§4"},t(lang,"Paket filtrlash chuqurligi","Depth of packet filtering")),
    React.createElement(LayerStack,{layers:[{n:"stateless",name:t(lang,"Stateless","Stateless"),color:"#ff6b6b",desc:{uz:"Har paketni alohida ko'radi — sodda, tez.",en:"Sees each packet alone — simple, fast."}},{n:"stateful",name:t(lang,"Stateful","Stateful"),color:"#69db7c",desc:{uz:"Ulanish kontekstini eslaydi (javob paketini biladi).",en:"Remembers connection context (knows reply packets)."}},{n:"DPI",name:t(lang,"Deep packet","Deep packet"),color:"#4dabf7",desc:{uz:"Paket mazmunini tekshiradi (L7).",en:"Inspects packet contents (L7)."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: holatli qoida","Practice: a stateful rule")),
    React.createElement(P,null,t(lang,"Stateful firewall «o'rnatilgan ulanishning javobini avtomatik o'tkaz» degan qoidani biladi — shuning uchun har javob uchun alohida qoida yozish shart emas.","A stateful firewall knows the rule «automatically allow replies to established connections» — so you don't need a separate rule for every reply.")),
    React.createElement(Terminal,null,"sudo iptables -A INPUT -m conntrack \\\n  --ctstate ESTABLISHED,RELATED -j ACCEPT\n# ← o'rnatilgan ulanish javoblarini o'tkaz\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT\nsudo iptables -A INPUT -j DROP   # qolgan hammasi"),
React.createElement(Quiz,{q:{uz:"Stateful firewall ning afzalligi nima?",en:"What advantage does a stateful firewall have?"},opts:[{uz:"Tezroq va soddaroq",en:"Faster and simpler"},{uz:"Ulanish holatini eslaydi va javob paketlarini taniydi",en:"Remembers connection state and recognizes replies"},{uz:"Shifrlaydi",en:"Encrypts"},{uz:"IP bermaydi",en:"Doesn't hand out IPs"}],correct:1,exp:{uz:"Stateful firewall ulanish kontekstini eslaydi — qonuniy javob paketlarini taniydi, bu uni xavfsizroq qiladi.",en:"A stateful firewall remembers connection context — recognizing legitimate replies, making it safer."}}));
}
function LessonL20(){
  const lang=useLang();
  const types=[["Forward",{uz:"Foydalanuvchilar nomidan internetga chiqadi (filtr, kesh, anonimlik)",en:"Goes out for users (filter, cache, anonymity)"},"#4dabf7"],["Reverse",{uz:"Serverlar oldida turadi (yukni taqsimlash, himoya, kesh)",en:"Sits in front of servers (load balancing, protection, cache)"},"#69db7c"],["Transparent",{uz:"Foydalanuvchi sezmaydi — tarmoq avtomatik yo'naltiradi",en:"User doesn't notice — network redirects automatically"},"#9775fa"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Proxy nima?","What is a proxy?")),
    React.createElement(P,null,t(lang,"Proxy server — siz va internet o'rtasidagi \"vositachi\". So'rovingiz avval proxy ga boradi, u sizning nomingizdan serverга murojaat qiladi va javobni qaytaradi (kimdandir sizning o'rningizga xarid qilishni so'raganingizdek).","A proxy server is a \"middleman\" between you and the internet. Your request goes to the proxy first, which contacts the server on your behalf and returns the reply (like asking someone to shop for you).")),
    React.createElement(PacketFlow,{from:{uz:"Siz",en:"You"},to:{uz:"Server",en:"Server"},label:{uz:"Proxy (vositachi)",en:"Proxy (middleman)"}}),
    React.createElement(H2,{num:"§2"},t(lang,"Proxy turlari","Types of proxy")),
    types.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,alignItems:"center",padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid "+x[2]+"44",borderLeft:"3px solid "+x[2],borderRadius:10,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontWeight:700,fontSize:12.5,color:x[2],minWidth:100}},x[0]),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(P,null,t(lang,"Reverse proxy serverlarni himoya qiladi: haqiqiy serverlarni yashiradi, hujumlarni to'sadi va yukni taqsimlaydi (Nginx, Cloudflare).","A reverse proxy protects servers: hides them, absorbs attacks and balances load (Nginx, Cloudflare).")),
        React.createElement(H2,{num:"§3"},t(lang,"Forward va reverse proxy","Forward vs reverse proxy")),
    React.createElement(CompareCols,{left:{title:{uz:"Forward proxy",en:"Forward proxy"},color:"#4dabf7",rows:[{uz:"Mijozlar oldida turadi",en:"Sits in front of clients"},{uz:"Foydalanuvchini yashiradi",en:"Hides the user"},{uz:"Filtrlash/keshlash",en:"Filtering/caching"},]},right:{title:{uz:"Reverse proxy",en:"Reverse proxy"},color:"#69db7c",rows:[{uz:"Serverlar oldida turadi",en:"Sits in front of servers"},{uz:"Serverni yashiradi/himoya qiladi",en:"Hides/protects the server"},{uz:"Yuk taqsimlash (LB), TLS",en:"Load balancing, TLS"},]}}),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: reverse proxy sarlavhasi","Practice: reverse-proxy headers")),
    React.createElement(P,null,t(lang,"Reverse proxy (nginx, HAProxy) haqiqiy serverni internetdan yashiradi, yukni taqsimlaydi va TLS ni boshqaradi. Javob sarlavhalari ko'pincha proxy ekanini oshkor qiladi.","A reverse proxy (nginx, HAProxy) hides the real server from the internet, distributes load and handles TLS. Response headers often reveal the proxy.")),
    React.createElement(Terminal,null,"curl -I https://site.com\n# server: nginx            ← reverse proxy\n# x-cache: HIT             ← keshdan berildi\n# via: 1.1 varnish         ← oldida yana kesh bor"),
React.createElement(Quiz,{q:{uz:"Reverse proxy asosan kimni himoya qiladi?",en:"What does a reverse proxy mainly protect?"},opts:[{uz:"Foydalanuvchilarni",en:"The users"},{uz:"Orqadagi serverlarni",en:"The backend servers"},{uz:"DNS ni",en:"DNS"},{uz:"Hech kimni",en:"No one"}],correct:1,exp:{uz:"Reverse proxy serverlar oldida turadi — ularni yashiradi, hujumlarni to'sadi va yukni taqsimlaydi.",en:"A reverse proxy sits in front of servers — hiding them, absorbing attacks and balancing load."}}));
}
function LessonL21(){
  const lang=useLang();
  const pr=[[{uz:"Doim tekshir",en:"Always verify"},{uz:"Har kirish har safar tasdiqlanadi",en:"Every access is confirmed each time"}],[{uz:"Minimal huquq",en:"Least privilege"},{uz:"Har kim faqat kerakli narsaga kiradi",en:"Everyone gets only what they need"}],[{uz:"Buzilishni faraz qil",en:"Assume breach"},{uz:"Hujumchi allaqachon ichkarida deb himoyalan",en:"Defend as if an attacker is already inside"}],[{uz:"Mikrosegmentatsiya",en:"Microsegmentation"},{uz:"Tarmoq kichik zonalarga bo'linadi",en:"The network is split into small zones"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Zero Trust nima?","What is Zero Trust?")),
    React.createElement(P,null,t(lang,"Zero Trust — \"hech kimga ishonma, doim tekshir\" tamoyili. Eski model tarmoq ichidagini avtomatik ishonchli deb bilardi (qal'a devori kabi). Zero Trust esa har bir so'rovni — ichkaridan bo'lsa ham — tekshiradi.","Zero Trust means \"never trust, always verify\". The old model auto-trusted anything inside the network (like a castle wall). Zero Trust verifies every request — even from inside.")),
    React.createElement(H2,{num:"§2"},t(lang,"Har so'rov tekshiriladi","Every request is checked")),
    React.createElement(FlowSteps,{title:{uz:"Zero Trust tekshiruvi",en:"Zero Trust check"},steps:[
      {icon:"👤",text:{uz:"Kim? — foydalanuvchi shaxsi tasdiqlanadi (MFA)",en:"Who? — user identity verified (MFA)"}},
      {icon:"💻",text:{uz:"Qanday qurilma? — holati tekshiriladi",en:"What device? — its posture is checked"}},
      {icon:"📍",text:{uz:"Qayerdan? — kontekst (joy, vaqt)",en:"From where? — context (location, time)"}},
      {icon:"🔑",text:{uz:"Faqat kerakli resursga minimal ruxsat beriladi",en:"Minimal access granted to just the needed resource"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Asosiy tamoyillar","Core principles")),
    pr.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:150}},t(lang,x[0].uz,x[0].en)),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(InfoBox,{color:"var(--accent)"},React.createElement("strong",null,t(lang,"Oddiy misol: ","Simple example: ")),t(lang,"eski model: ofisga kirsangiz hamma xonaga kirasiz. Zero Trust: har xona eshigi alohida propuskingizni tekshiradi.","old model: once in the office you can enter any room. Zero Trust: each room's door checks your badge separately.")),
        React.createElement(H2,{num:"§4"},t(lang,"Zero Trust tamoyillari","Zero Trust principles")),
    React.createElement(LayerStack,{layers:[{n:"verify",name:t(lang,"Har doim tekshir","Always verify"),color:"#ff3a5e",desc:{uz:"Ichki tarmoqqa ham ishonma — har so'rov tekshiriladi.",en:"Trust nothing, even internal — verify every request."}},{n:"least",name:t(lang,"Eng kam imtiyoz","Least privilege"),color:"#69db7c",desc:{uz:"Faqat zarur kirish beriladi.",en:"Grant only the access needed."}},{n:"micro",name:t(lang,"Mikrosegmentatsiya","Micro-segmentation"),color:"#4dabf7",desc:{uz:"Tarmoq kichik izolyatsiyalangan bo'laklarga.",en:"Network split into small isolated segments."}},{n:"assume",name:t(lang,"Buzilishni faraz qil","Assume breach"),color:"#a855f7",desc:{uz:"Hujumchi allaqachon ichkarida deb ishlang.",en:"Work as if the attacker is already inside."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: eski model va Zero Trust","Practice: old model vs Zero Trust")),
    React.createElement(P,null,t(lang,"Eski «qal'a va handaq» modeli ichki tarmoqqa to'liq ishonardi — bir marta kirgan hujumchi erkin harakatlanardi. Zero Trust har qadamda qayta tekshiradi: kim, qaysi qurilma, qaysi resursga.","The old «castle and moat» model fully trusted the internal network — an attacker who got in moved freely. Zero Trust re-checks at every step: who, which device, which resource.")),
    React.createElement(Terminal,null,"# Zero Trust siyosati (soddalashtirilgan)\n# IF user=alice AND device=managed AND mfa=passed\n#   THEN allow -> app:payroll (faqat shu resurs)\n# ELSE deny + log   ← har so'rov qayta baholanadi"),
React.createElement(Quiz,{q:{uz:"Zero Trust ning asosiy shiori qanday?",en:"What is the core motto of Zero Trust?"},opts:[{uz:"Ichkaridagi hammaga ishon",en:"Trust everyone inside"},{uz:"Hech kimga ishonma, doim tekshir",en:"Never trust, always verify"},{uz:"Faqat parolga ishon",en:"Trust only the password"},{uz:"Devor yetarli",en:"A wall is enough"}],correct:1,exp:{uz:"Zero Trust \"hech kimga ishonma, doim tekshir\" — har so'rov, ichkaridan bo'lsa ham, tasdiqlanadi.",en:"Zero Trust is \"never trust, always verify\" — every request, even from inside, is confirmed."}}));
}
function LessonL23(){
  const lang=useLang();
  const items=[[{uz:"Xostlar",en:"Hosts"},{uz:"Tirik qurilmalar va IP lari",en:"Live devices and their IPs"}],[{uz:"Xizmatlar",en:"Services"},{uz:"Ochiq portlardagi dasturlar/versiyalar",en:"Programs/versions on open ports"}],[{uz:"Ulashmalar",en:"Shares"},{uz:"Ochiq fayl papkalari (SMB, NFS)",en:"Open file folders (SMB, NFS)"}],[{uz:"Foydalanuvchilar",en:"Users"},{uz:"Hisob nomlari va guruhlar",en:"Account names and groups"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Enumeratsiya nima?","What is enumeration?")),
    React.createElement(P,null,t(lang,"Enumeratsiya — nishon haqida iloji boricha ko'proq ma'lumot to'plash: qaysi qurilma, xizmat, foydalanuvchi bor. Bosqindan oldin bino rejasini o'rganishga o'xshaydi. Port skanerlashdan bir qadam keyingi — chuqurroq \"kim, nima, qayerda\".","Enumeration gathers as much as possible about a target: which devices, services and users exist. Like studying a building's floor plan before entering. One step beyond port scanning — deeper \"who, what, where\".")),
    React.createElement(H2,{num:"§2"},t(lang,"Nimalar aniqlanadi","What gets discovered")),
    items.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:110}},t(lang,x[0].uz,x[0].en)),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(Terminal,null,"nmap -sV -sC 10.0.0.5\nsmbclient -L //10.0.0.5 -N\nnmap --script smb-enum-shares -p445 10.0.0.5"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"Enumeratsiya faqat sizga tegishli yoki yozma ruxsat berilgan tarmoqlarda o'tkazilishi kerak.","Enumeration must only be done on networks you own or have written authorization to test.")),
        React.createElement(H2,{num:"§3"},t(lang,"Nimani sanash kerak","What to enumerate")),
    React.createElement(LayerStack,{layers:[{n:"hosts",name:t(lang,"Xostlar","Hosts"),color:"#4dabf7",desc:{uz:"Tirik qurilmalar va ularning IP/OS.",en:"Live devices and their IP/OS."}},{n:"svc",name:t(lang,"Xizmatlar","Services"),color:"#69db7c",desc:{uz:"Ochiq portlardagi dastur+versiya.",en:"Program+version on open ports."}},{n:"users",name:t(lang,"Foydalanuvchilar","Users"),color:"#a855f7",desc:{uz:"SMB/SNMP orqali hisob nomlari.",en:"Account names via SMB/SNMP."}},{n:"shares",name:t(lang,"Ulashmalar","Shares"),color:"#ffd43b",desc:{uz:"Ochiq papkalar va ruxsatlar.",en:"Open folders and permissions."}},]}),
    React.createElement(H2,{num:"§4"},t(lang,"Amaliyot: xizmatlarni sanash","Practice: enumerating services")),
    React.createElement(P,null,t(lang,"Enumeratsiya — skanerlashdan chuqurroq: har xizmatdan aniq ma'lumot tortib olish. Bu keyingi ekspluatatsiya uchun to'g'ri vektorni tanlashga yordam beradi.","Enumeration is deeper than scanning: pulling detailed info from each service. It helps pick the right vector for the next exploitation step.")),
    React.createElement(Terminal,null,"nmap --script smb-enum-shares,smb-os-discovery 10.0.0.5\n# | smb-os-discovery: Windows Server 2016\n# | smb-enum-shares:\n# |   \\\\10.0.0.5\\backups: READ/WRITE  ← ochiq ulashma"),
React.createElement(Quiz,{q:{uz:"Enumeratsiya bosqichining asosiy maqsadi nima?",en:"Main goal of the enumeration phase?"},opts:[{uz:"Ma'lumotni shifrlash",en:"Encrypting data"},{uz:"Nishon haqida iloji boricha ko'proq ma'lumot to'plash",en:"Gathering as much info about the target as possible"},{uz:"Faylni o'chirish",en:"Deleting a file"},{uz:"IP berish",en:"Handing out IPs"}],correct:1,exp:{uz:"Enumeratsiya — nishon tarmoq haqida (xostlar, xizmatlar, foydalanuvchilar) chuqur ma'lumot to'plash bosqichi.",en:"Enumeration is the phase of gathering deep information about the target (hosts, services, users)."}}));
}
function LessonL24(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"ARP spoofing nima?","What is ARP spoofing?")),
    React.createElement(P,null,t(lang,"ARP spoofing — hujumchi soxta ARP javoblari yuborib, o'zini boshqa qurilma (masalan router) qilib ko'rsatadi. ARP javobni tekshirmaydi (L06), shundan foydalaniladi: qurbon trafigi hujumchi orqali oqa boshlaydi.","ARP spoofing is when an attacker sends fake ARP replies to impersonate another device (e.g. the router). ARP doesn't verify replies (L06) — so the victim's traffic starts flowing through the attacker.")),
    React.createElement(H2,{num:"§2"},t(lang,"Hujum qanday kechadi","How the attack unfolds")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"ARP zaharlash",en:"ARP poisoning"},steps:[
      {icon:"😈",text:{uz:"Hujumchi qurbonga: \"router MAC = mening MAC im\"",en:"Attacker → victim: \"the router's MAC is my MAC\""}},
      {icon:"😈",text:{uz:"Hujumchi routerga: \"qurbon MAC = mening MAC im\"",en:"Attacker → router: \"the victim's MAC is my MAC\""}},
      {icon:"🔀",text:{uz:"Qurbon trafigi endi hujumchi orqali o'tadi",en:"Victim's traffic now passes through the attacker"}},
      {icon:"👁",text:{uz:"Hujumchi shifrlanmagan hamma narsani ko'radi",en:"Attacker sees everything unencrypted"}},
    ]}),
    React.createElement(PacketFlow,{from:{uz:"Qurbon",en:"Victim"},to:{uz:"Router",en:"Router"},label:{uz:"😈 hujumchi o'rtada (MITM)",en:"😈 attacker in the middle (MITM)"},color:"#ff3a5e"}),
    React.createElement(H2,{num:"§3"},t(lang,"Himoya","Defense")),
    React.createElement("div",{style:{margin:"6px 0 12px"}},
      [{uz:"Dynamic ARP Inspection (DAI) — switch soxta ARP ni bloklaydi",en:"Dynamic ARP Inspection (DAI) — switch blocks fake ARP"},{uz:"Statik ARP yozuvlari (muhim qurilmalar uchun)",en:"Static ARP entries (for critical devices)"},{uz:"HTTPS/VPN — mazmun shifrlansa, ko'rilса ham foydasiz",en:"HTTPS/VPN — if encrypted, seeing it is useless"}].map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{fontSize:12.5,color:"var(--text-1)",padding:"6px 0",borderBottom:"1px solid var(--border)",animationDelay:(i*0.06)+"s"}},"• "+t(lang,x.uz,x.en));})),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"ARP spoofing faqat o'z laboratoriyangizda yoki yozma ruxsat berilgan pentestda sinalishi kerak. Boshqa tarmoqda qo'llash jinoyat.","ARP spoofing must only be tested in your own lab or a written-authorized pentest. Using it on another network is a crime.")),
        React.createElement(H2,{num:"§4"},t(lang,"Hujumdan oldin va keyin","Before and after the attack")),
    React.createElement(CompareCols,{left:{title:{uz:"Oldin (normal)",en:"Before (normal)"},color:"#69db7c",rows:[{uz:"Shlyuz = haqiqiy MAC",en:"Gateway = real MAC"},{uz:"Trafik to'g'ri boradi",en:"Traffic flows correctly"},]},right:{title:{uz:"Keyin (spoofing)",en:"After (spoofing)"},color:"#ff3a5e",rows:[{uz:"Shlyuz = hujumchi MAC",en:"Gateway = attacker MAC"},{uz:"Trafik hujumchidan o'tadi",en:"Traffic passes through attacker"},]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: ARP jadvalining zaharlanishi","Practice: ARP table poisoning")),
    React.createElement(P,null,t(lang,"Hujumchi soxta ARP javoblari yuborib, qurbon jadvalidagi shlyuz MAC ini o'ziniki bilan almashtiradi. Endi qurbonning butun trafigi hujumchidan o'tadi (MITM).","The attacker sends fake ARP replies, replacing the gateway MAC in the victim's table with their own. Now all the victim's traffic flows through the attacker (MITM).")),
    React.createElement(Terminal,null,"sudo arpspoof -i eth0 -t 10.0.0.9 10.0.0.1\n# 8:0:27:aa:bb:cc 0:c:29:dd:ee:ff 0806 42: arp reply\n# 10.0.0.1 is-at 8:0:27:aa:bb:cc   ← qurbonga yolg'on\n# (echo 1 > /proc/sys/net/ipv4/ip_forward — trafikni uzatish)"),
React.createElement(Quiz,{q:{uz:"ARP spoofing ARP ning qaysi zaifligidan foydalanadi?",en:"Which ARP weakness does ARP spoofing exploit?"},opts:[{uz:"ARP juda sekin",en:"ARP is very slow"},{uz:"ARP javobning haqiqiyligini tekshirmaydi",en:"ARP doesn't verify that a reply is genuine"},{uz:"ARP shifrlangan",en:"ARP is encrypted"},{uz:"ARP faqat WiFi da",en:"ARP is WiFi-only"}],correct:1,exp:{uz:"ARP javobni tekshirmaydi — hujumchi soxta javob yuborib o'zini router qilib ko'rsatadi va trafikni o'g'irlaydi.",en:"ARP doesn't verify replies — an attacker sends a fake reply, impersonates the router and steals traffic."}}));
}
function LessonL25(){
  const lang=useLang();
  const tech=[["ARP Spoofing",{uz:"Lokal tarmoqda trafikni o'ziga yo'naltirish",en:"Redirect LAN traffic to itself"}],["DNS Spoofing",{uz:"Soxta IP berib soxta saytga yuborish",en:"Fake IP → fake site"}],["Evil Twin",{uz:"Soxta WiFi nuqtasi",en:"Fake WiFi hotspot"}],["SSL Strip",{uz:"HTTPS ni HTTP ga tushirish",en:"Downgrade HTTPS to HTTP"}]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"MITM hujumi nima?","What is a MITM attack?")),
    React.createElement(P,null,t(lang,"MITM (o'rtadagi odam) — hujumchi ikki tomon aloqasiga yashirin kirib, tinglaydi yoki o'zgartiradi. Ikki tomon to'g'ridan-to'g'ri gaplashyapti deb o'ylaydi, aslida hamma narsa hujumchi orqali o'tadi (xatlarni yashirincha o'qiydigan pochtachi kabi).","MITM (man-in-the-middle) — the attacker secretly inserts into a conversation to eavesdrop or alter it. The two parties think they talk directly, but everything passes through the attacker (like a mail carrier secretly reading letters).")),
    React.createElement(H2,{num:"§2"},t(lang,"Qanday kechadi","How it happens")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"MITM interseptsiya",en:"MITM interception"},steps:[
      {icon:"🎯",text:{uz:"Hujumchi ikki tomon orasiga o'rnashadi (masalan ARP spoofing)",en:"Attacker positions between the two (e.g. ARP spoofing)"}},
      {icon:"👂",text:{uz:"Barcha trafik hujumchi orqali oqadi",en:"All traffic flows through the attacker"}},
      {icon:"🔓",text:{uz:"Shifrlanmagan bo'lsa — o'qiydi/o'zgartiradi",en:"If unencrypted — reads/alters it"}},
      {icon:"🔒",text:{uz:"HTTPS bo'lsa — faqat shifrlangan ma'lumot ko'radi",en:"If HTTPS — only sees encrypted data"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Keng tarqalgan usullar","Common techniques")),
    tech.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,padding:"9px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:110}},x[0]),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"MITM texnikalari faqat ta'lim va ruxsat berilgan sinov muhitida o'rganilishi kerak. Real aloqani ruxsatsiz tinglash jiddiy jinoyat.","MITM techniques must only be studied in education and authorized test environments. Eavesdropping on real communication without permission is a serious crime.")),
        React.createElement(H2,{num:"§4"},t(lang,"MITM turlari","Types of MITM")),
    React.createElement(LayerStack,{layers:[{n:"arp",name:t(lang,"ARP spoofing","ARP spoofing"),color:"#ff3a5e",desc:{uz:"Mahalliy tarmoqda trafikni burish.",en:"Divert traffic on the local network."}},{n:"dns",name:t(lang,"DNS spoofing","DNS spoofing"),color:"#ffa94d",desc:{uz:"Soxta IP qaytarib, saytga yo'naltirish.",en:"Return a fake IP to redirect a site."}},{n:"rogue",name:t(lang,"Rogue AP","Rogue AP"),color:"#a855f7",desc:{uz:"Soxta WiFi nuqtasi ochish.",en:"Set up a fake WiFi access point."}},{n:"ssl",name:t(lang,"SSL strip","SSL strip"),color:"#4dabf7",desc:{uz:"HTTPS ni HTTP ga tushirishga urinish.",en:"Try to downgrade HTTPS to HTTP."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: trafikni tinglash","Practice: sniffing traffic")),
    React.createElement(P,null,t(lang,"MITM o'rnatilgach, hujumchi shifrlanmagan trafikni (HTTP, FTP) o'qiydi. HTTPS bunga to'sqinlik qiladi — sertifikat mos kelmasa brauzer ogohlantiradi.","Once MITM is set up, the attacker reads unencrypted traffic (HTTP, FTP). HTTPS blocks this — if the certificate doesn't match, the browser warns.")),
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
    React.createElement(H2,{num:"§3"},t(lang,"Himoya — DNSSEC","Defense — DNSSEC")),
    React.createElement(P,null,t(lang,"DNSSEC DNS javoblarini raqamli imzolaydi — qurilma javob haqiqiy va o'zgartirilmaganini tekshira oladi. Qo'shimcha: HTTPS (sertifikat mos kelmasa ogohlantiradi) va ishonchli DNS (DoH — DNS over HTTPS).","DNSSEC digitally signs DNS replies — a device can verify a reply is genuine and unaltered. Also: HTTPS (warns if the cert doesn't match) and trusted DNS (DoH — DNS over HTTPS).")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"DNS spoofing faqat nazorat qilinadigan laboratoriya yoki ruxsat berilgan sinovda o'rganilishi kerak.","DNS spoofing must only be studied in a controlled lab or an authorized test.")),
        React.createElement(H2,{num:"§4"},t(lang,"Haqiqiy va soxta javob","Real vs spoofed reply")),
    React.createElement(CompareCols,{left:{title:{uz:"Haqiqiy DNS",en:"Real DNS"},color:"#69db7c",rows:[{uz:"bank.com → 93.1.2.3",en:"bank.com → 93.1.2.3"},{uz:"Haqiqiy saytga boradi",en:"Goes to the real site"},]},right:{title:{uz:"Soxta DNS",en:"Spoofed DNS"},color:"#ff3a5e",rows:[{uz:"bank.com → 10.0.0.66",en:"bank.com → 10.0.0.66"},{uz:"Hujumchi soxta sahifasiga",en:"To the attacker's fake page"},]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: soxta javob","Practice: a forged reply")),
    React.createElement(P,null,t(lang,"MITM holatida hujumchi DNS so'roviga haqiqiy serverdan oldin javob beradi — qurbon soxta IP oladi va fishing sahifasiga tushadi. Himoya: DNSSEC va HTTPS.","In a MITM position the attacker answers a DNS query before the real server — the victim gets a fake IP and lands on a phishing page. Defense: DNSSEC and HTTPS.")),
    React.createElement(Terminal,null,"sudo dnsspoof -i eth0 -f hosts.txt\n# hosts.txt:  10.0.0.66  bank.com\n# 10.0.0.9.51000 > 1.1.1.1.53: 42+ A? bank.com\n# dnsspoof: bank.com -> 10.0.0.66   ← soxta javob yuborildi"),
React.createElement(Quiz,{q:{uz:"DNS spoofing hujumchiga nima imkonini beradi?",en:"What does DNS spoofing let an attacker do?"},opts:[{uz:"Faylni shifrlash",en:"Encrypt a file"},{uz:"To'g'ri nom yozilса ham soxta saytga yo'naltirish",en:"Redirect to a fake site even with the correct name typed"},{uz:"WiFi parolini o'zgartirish",en:"Change the WiFi password"},{uz:"Tarmoqni tezlashtirish",en:"Speed up the network"}],correct:1,exp:{uz:"DNS spoofing soxta DNS javob beradi — qurbon to'g'ri nom (bank.com) yozsa ham soxta saytga tushadi.",en:"DNS spoofing returns a fake reply — even typing the right name (bank.com), the victim lands on a fake site."}}));
}
function LessonL27(){
  const lang=useLang();
  const types=[[{uz:"Volumetrik",en:"Volumetric"},{uz:"Kanalni ulkan trafik bilan to'ldiradi (UDP flood)",en:"Floods the link with huge traffic (UDP flood)"},"#ff3a5e"],[{uz:"Protokol",en:"Protocol"},{uz:"Server resurslarini tugatadi (SYN flood)",en:"Exhausts server resources (SYN flood)"},"#ff9145"],[{uz:"Ilova qatlami",en:"Application"},{uz:"Og'ir so'rovlar bilan charchatadi (HTTP flood)",en:"Tires the app with heavy requests (HTTP flood)"},"#ffd43b"]];
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DoS va DDoS nima?","What are DoS and DDoS?")),
    React.createElement(P,null,t(lang,"DoS — serverni haddan tashqari so'rov bilan to'ldirib, xizmatni ishdan chiqarish. DDoS — xuddi shu, lekin minglab qurilmadan (botnet) bir vaqtda. Do'kon eshigini soxta mijozlar bilan to'ldirib, haqiqiylarni kirита olmaslikka o'xshaydi.","DoS overwhelms a server with excessive requests to knock the service offline. DDoS is the same but from thousands of devices (a botnet) at once. Like jamming a shop's door with fake customers so real ones can't enter.")),
    React.createElement(H2,{num:"§2"},t(lang,"Hujum turlari","Attack types")),
    types.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise na-card",style:{display:"flex",gap:12,padding:"10px 14px",marginBottom:7,background:"var(--surface)",border:"1px solid "+x[2]+"44",borderLeft:"3px solid "+x[2],borderRadius:10,animationDelay:(i*0.06)+"s"}},
      React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:x[2],minWidth:120}},t(lang,x[0].uz,x[0].en)),
      React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(H2,{num:"§3"},t(lang,"Himoya (mitigatsiya)","Mitigation")),
    React.createElement(Terminal,null,"✓ Rate limiting — bir IP dan so'rovlarni cheklash\n✓ CDN / DDoS himoya (Cloudflare, Akamai)\n✓ Firewall va trafik filtrlash\n✓ Monitoring — anomal trafikni erta sezish"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"DoS/DDoS ni boshqa birovning tizimiga uyushtirish jiddiy jinoyat — hatto \"sinash\" uchun ham. Bu mavzu faqat himoya (blue team) nuqtai nazaridan o'rganiladi.","Launching DoS/DDoS against someone else's system is a serious crime — even \"just to try\". Studied only from a defensive (blue team) perspective.")),
        React.createElement(H2,{num:"§4"},t(lang,"DoS hujum turlari","DoS attack types")),
    React.createElement(LayerStack,{layers:[{n:"vol",name:t(lang,"Volumetric","Volumetric"),color:"#ff3a5e",desc:{uz:"Kanalni to'ldirish (UDP/ICMP flood, amplification).",en:"Fill the pipe (UDP/ICMP flood, amplification)."}},{n:"proto",name:t(lang,"Protocol","Protocol"),color:"#ffa94d",desc:{uz:"Resurs tugatish (SYN flood).",en:"Exhaust resources (SYN flood)."}},{n:"app",name:t(lang,"Application","Application"),color:"#a855f7",desc:{uz:"Sekin so'rovlar (Slowloris, HTTP flood).",en:"Slow requests (Slowloris, HTTP flood)."}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: SYN flood belgisi","Practice: a SYN flood sign")),
    React.createElement(P,null,t(lang,"DDoS — minglab buzilgan qurilma (botnet) bir nishonga hujum qiladi, shuning uchun bitta IP ni bloklash yetmaydi. SYN flood serverni yarim ochiq ulanishlar bilan to'ldiradi.","A DDoS uses thousands of compromised devices (a botnet) against one target, so blocking a single IP isn't enough. A SYN flood fills the server with half-open connections.")),
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
    React.createElement(H2,{num:"§3"},t(lang,"Foydali filtrlar","Useful filters")),
    filt.map(function(x,i){return React.createElement("div",{key:i,className:"na-rise",style:{display:"flex",gap:12,alignItems:"center",padding:"8px 14px",marginBottom:6,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,animationDelay:(i*0.05)+"s"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",flex:1}},x[0]),
      React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},t(lang,x[1].uz,x[1].en)));}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"Boshqalarning trafigini ruxsatsiz ushlash maxfiylikni buzadi. Faqat o'z tarmog'ingiz yoki ruxsat berilgan muhitda ishlating.","Capturing others' traffic without permission violates privacy. Use only on your own network or an authorized environment.")),
        React.createElement(H2,{num:"§4"},t(lang,"Capture va display filtr","Capture vs display filter")),
    React.createElement(CompareCols,{left:{title:{uz:"Capture filtr",en:"Capture filter"},color:"#4dabf7",rows:[{uz:"Ushlashdan OLDIN cheklaydi",en:"Limits BEFORE capture"},{uz:"BPF sintaksisi (tcp port 80)",en:"BPF syntax (tcp port 80)"},{uz:"Diskni tejaydi",en:"Saves disk"},]},right:{title:{uz:"Display filtr",en:"Display filter"},color:"#69db7c",rows:[{uz:"Ushlagandan KEYIN filtrlaydi",en:"Filters AFTER capture"},{uz:"Wireshark sintaksisi (http)",en:"Wireshark syntax (http)"},{uz:"Moslashuvchan tahlil",en:"Flexible analysis"},]}}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: parolni topish","Practice: finding a password")),
    React.createElement(P,null,t(lang,"Shifrlanmagan protokolda login ochiq ketadi. Display filtr bilan aynan o'sha paketni topib, Follow Stream orqali butun suhbatni o'qish mumkin.","In an unencrypted protocol the login travels in the clear. A display filter finds that exact packet, and Follow Stream lets you read the whole conversation.")),
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
    React.createElement(H2,{num:"§3"},t(lang,"Himoya","Defense")),
    React.createElement(Terminal,null,"✓ WPA3 yoki kamida WPA2 (WEP emas!)\n✓ Uzun, murakkab parol (12+ belgi)\n✓ WPS ni o'chiring\n✓ Mehmonlar uchun alohida tarmoq"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},React.createElement("strong",null,"⚠ "),t(lang,"Simsiz hujum vositalarini faqat o'z tarmog'ingizda yoki yozma ruxsat bilan sinang. Birovning WiFi siga ruxsatsiz kirish jinoyat.","Test wireless attack tools only on your own network or with written permission. Unauthorized access to someone's WiFi is a crime.")),
        React.createElement(H2,{num:"§4"},t(lang,"WPA2 buzish oqimi","The WPA2 cracking flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"WiFi parolini sinash",en:"Testing the WiFi password"},steps:[{icon:"📡",text:{uz:"Monitor rejim — havoni tinglash (airmon-ng)",en:"Monitor mode — listen to the air (airmon-ng)"}},{icon:"🔍",text:{uz:"Nishon AP va mijozni topish (airodump-ng)",en:"Find the target AP and client (airodump-ng)"}},{icon:"👋",text:{uz:"Deauth → handshake ni ushlash",en:"Deauth → capture the handshake"}},{icon:"🔑",text:{uz:"Oflayn lug'at hujumi (aircrack-ng)",en:"Offline dictionary attack (aircrack-ng)"}},]}),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliyot: handshake buzish","Practice: cracking the handshake")),
    React.createElement(P,null,t(lang,"Handshake ushlangach, hujum OFLAYN davom etadi — parol lug'at bilan sinaladi. Kuchli, uzun parol bu hujumni amalda imkonsiz qiladi.","Once the handshake is captured, the attack continues OFFLINE — the password is tested against a wordlist. A strong, long password makes this attack practically impossible.")),
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
