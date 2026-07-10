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
  if(pv==="groq"){const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"user",content:prompt}],max_tokens:600,temperature:0.3})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"Groq error");return d.choices[0].message.content;}
  if(pv==="openai"){const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}],max_tokens:600})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"OpenAI error");return d.choices[0].message.content;}
  if(pv==="anthropic"){const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:600,messages:[{role:"user",content:prompt}]})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"Anthropic error");return d.content[0].text;}
  if(pv==="gemini"){const r=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:600,temperature:0.3}})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"Gemini error");return d.candidates[0].content.parts[0].text;}
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
function LessonL01(){
  const lang=useLang();
  const layers=[
    {n:7,name:"Application",uz:"Ilova qatlami",proto:"HTTP, FTP, SMTP, DNS, SNMP",desc:"Foydalanuvchi ilovalari bilan to'g'ridan-to'g'ri ishlaydi",color:"#ff6b6b"},
    {n:6,name:"Presentation",uz:"Taqdimot qatlami",proto:"SSL/TLS, JPEG, MP4, ASCII",desc:"Ma'lumotlarni formatlash, shifrlash va siqish",color:"#ffa94d"},
    {n:5,name:"Session",uz:"Sessiya qatlami",proto:"NetBIOS, RPC, SQL",desc:"Ulanishlarni o'rnatish, boshqarish va tugatish",color:"#ffd43b"},
    {n:4,name:"Transport",uz:"Transport qatlami",proto:"TCP, UDP",desc:"End-to-end ulanish, portlar, oqim nazorati",color:"#69db7c"},
    {n:3,name:"Network",uz:"Tarmoq qatlami",proto:"IP, ICMP, OSPF, BGP",desc:"IP manzillash va paketlarni yo'naltirish",color:"#4dabf7"},
    {n:2,name:"Data Link",uz:"Ma'lumotlar havolasi",proto:"Ethernet, WiFi, PPP, ARP",desc:"MAC manzillash, kadrlar va fizik ulanish xatolarini tuzatish",color:"#9775fa"},
    {n:1,name:"Physical",uz:"Fizik qatlam",proto:"Ethernet kabeli, Optik, Radio",desc:"Bitlarni fizik signal sifatida uzatish",color:"#f783ac"},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"OSI modeli nima?","What is the OSI Model?")),
    React.createElement(P,null,t(lang,
      "OSI (Open Systems Interconnection) modeli — tarmoq aloqasini 7 ta mantiqiy qatlamga bo'lib tushuntiruvchi konseptual freymvork. Bu model turli ishlab chiqaruvchilar va protokollar o'rtasida muloqotni standartlashtirish uchun ISO tomonidan 1984 yilda yaratilgan.",
      "The OSI (Open Systems Interconnection) model is a conceptual framework that divides network communication into 7 logical layers. Created by ISO in 1984, it standardizes communication between different vendors and protocols."
    )),
    React.createElement(InfoBox,{color:"var(--accent)"},
      t(lang,"Eslab qolish uchun:","Mnemonic to remember layers:"),
      React.createElement("br",null),
      React.createElement("strong",null,"\""),
      React.createElement("span",{style:{color:"#ff6b6b"}},"A"),
      React.createElement("span",{style:{color:"#ffa94d"}},"ll"),
      " ",
      React.createElement("span",{style:{color:"#ffd43b"}},"P"),
      React.createElement("span",{style:{color:"#ffd43b"}},"eople"),
      " ",
      React.createElement("span",{style:{color:"#69db7c"}},"S"),
      React.createElement("span",{style:{color:"#69db7c"}},"eem"),
      " ",
      React.createElement("span",{style:{color:"#4dabf7"}},"T"),
      React.createElement("span",{style:{color:"#4dabf7"}},"o"),
      " ",
      React.createElement("span",{style:{color:"#9775fa"}},"N"),
      React.createElement("span",{style:{color:"#9775fa"}},"eed"),
      " ",
      React.createElement("span",{style:{color:"#f783ac"}},"D"),
      React.createElement("span",{style:{color:"#f783ac"}},"ata"),
      " ",
      React.createElement("span",{style:{color:"#ff6b6b"}},"P"),
      React.createElement("span",{style:{color:"#ff6b6b"}},"rocessing\""),
      React.createElement("br",null),
      React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:11,opacity:0.7}},
        t(lang,"(7→1: Application, Presentation, Session, Transport, Network, Data Link, Physical)","(7→1: Application, Presentation, Session, Transport, Network, Data Link, Physical)"))
    ),
    React.createElement(H2,{num:"§2"},t(lang,"7 ta qatlam","The 7 Layers")),
    layers.map(l=>React.createElement("div",{key:l.n,style:{display:"flex",gap:12,marginBottom:8,padding:"10px 14px",background:"var(--surface)",border:`1px solid ${l.color}33`,borderRadius:10,alignItems:"flex-start"}},
      React.createElement("div",{style:{width:28,height:28,borderRadius:8,background:l.color+"22",border:`1.5px solid ${l.color}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"var(--font-mono)",fontSize:11,fontWeight:900,color:l.color}},l.n),
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"var(--text-0)",marginBottom:2}},
          `${l.name}`,React.createElement("span",{style:{fontSize:11,color:"var(--text-2)",marginLeft:8,fontWeight:400}},l.uz)),
        React.createElement("div",{style:{fontSize:11.5,color:"var(--text-2)",marginBottom:3}},l.desc),
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:l.color,opacity:0.85}},l.proto)
      )
    )),
    React.createElement(H2,{num:"§3"},t(lang,"Ma'lumot qanday harakatlanadi?","How data travels?")),
    React.createElement(P,null,t(lang,
      "Yuboruvchi tomonida ma'lumot 7-qatlamdan 1-qatlamga qarab har bir qatlamda sarlavha (header) qo'shiladi — bu encapsulation deyiladi. Qabul qiluvchi tomonida esa 1-qatlamdan 7-qatlamga qarab har bir sarlavha olib tashlanadi — bu decapsulation.",
      "On the sender side, data travels from layer 7 to layer 1, with each layer adding a header — this is called encapsulation. On the receiver side, it travels from layer 1 to layer 7, with each layer removing its header — this is decapsulation."
    )),
    React.createElement(Terminal,null,
`Yuboruvchi (Sender)          Qabul qiluvchi (Receiver)
┌─────────────────┐          ┌─────────────────┐
│  7. Application │ ──data─► │  7. Application │
│  6. Presentation│          │  6. Presentation│
│  5. Session     │          │  5. Session     │
│  4. Transport   │          │  4. Transport   │
│  3. Network     │          │  3. Network     │
│  2. Data Link   │          │  2. Data Link   │
│  1. Physical    │ ══════►  │  1. Physical    │
└─────────────────┘   Kabel  └─────────────────┘`
    ),
    React.createElement(H2,{num:"§4"},t(lang,"TCP/IP vs OSI","TCP/IP vs OSI")),
    React.createElement(P,null,t(lang,
      "Amalda internet TCP/IP modelini ishlatadi — u OSI ning 7 qatlamini 4 qatlamga soddalashtirgan:",
      "In practice, the internet uses the TCP/IP model — it simplifies OSI's 7 layers into 4 layers:"
    )),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"12px 0"}},
      React.createElement("div",{style:{padding:14,background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:10}},
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--accent)",marginBottom:8,fontWeight:700}},"OSI MODEL (7 layers)"),
        ["7. Application","6. Presentation","5. Session","4. Transport","3. Network","2. Data Link","1. Physical"].map((l,i)=>
          React.createElement("div",{key:i,style:{fontSize:11.5,padding:"3px 0",color:"var(--text-1)",borderBottom:"1px solid var(--border)"}},l))
      ),
      React.createElement("div",{style:{padding:14,background:"rgba(100,255,100,0.06)",border:"1px solid rgba(100,255,100,0.2)",borderRadius:10}},
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:"#69db7c",marginBottom:8,fontWeight:700}},"TCP/IP MODEL (4 layers)"),
        [
          {l:"4. Application",sub:"→ OSI 5,6,7"},
          {l:"3. Transport",sub:"→ OSI 4"},
          {l:"2. Internet",sub:"→ OSI 3"},
          {l:"1. Network Access",sub:"→ OSI 1,2"},
        ].map(({l,sub},i)=>
          React.createElement("div",{key:i,style:{fontSize:11.5,padding:"3px 0",color:"var(--text-1)",borderBottom:"1px solid var(--border)"}},
            l,React.createElement("span",{style:{fontSize:10,color:"#69db7c",marginLeft:6,opacity:0.7}},sub)))
      )
    )
  );
}

// ── Lesson L13: Firewall ──────────────────────────────────────
function LessonL13(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Firewall nima?","What is a Firewall?")),
    React.createElement(P,null,t(lang,
      "Firewall — tarmoq trafigini oldindan belgilangan qoidalar asosida filtrlash orqali ruxsatsiz kirishni bloklaydi. U ichki tarmoq bilan tashqi tarmoq o'rtasida xavfsizlik devori vazifasini bajaradi.",
      "A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on pre-established security rules, acting as a barrier between internal and external networks."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Firewall turlari","Types of Firewalls")),
    [
      {name:"Packet Filter",uz:"Eng oddiy tur. IP, port va protokol asosida qaror qiladi. Stateless — har paketni alohida ko'radi.",en:"Simplest type. Decides based on IP, port and protocol. Stateless — sees each packet independently."},
      {name:"Stateful Inspection",uz:"Ulanish holatini kuzatadi. TCP握手 sessiyalarini tushunadi. Ko'pchilik zamonaviy firewalllar shu turda.",en:"Tracks connection state. Understands TCP handshake sessions. Most modern firewalls use this."},
      {name:"Application Layer (L7)",uz:"HTTP, DNS, FTP protokollarini chuqur tekshiradi. WAF (Web Application Firewall) shu turda.",en:"Deep inspection of HTTP, DNS, FTP protocols. WAF (Web Application Firewall) is this type."},
      {name:"Next-Gen (NGFW)",uz:"IDS/IPS, DPI, SSL inspection va application awareness ni birlashtiradi.",en:"Combines IDS/IPS, DPI, SSL inspection and application awareness."},
    ].map((f,i)=>React.createElement("div",{key:i,style:{marginBottom:8,padding:"12px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
      React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:4,fontWeight:700}},f.name),
      React.createElement("div",{style:{fontSize:12.5,color:"var(--text-1)",lineHeight:1.6}},t(lang,f.uz,f.en))
    )),
    React.createElement(H2,{num:"§3"},t(lang,"iptables misoli (Linux)","iptables Example (Linux)")),
    React.createElement(Terminal,null,
`# Barcha trafikni ko'rish
sudo iptables -L -v

# 22 (SSH) portni ochish
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 80 (HTTP) portni ochish
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Qolgan barcha kirishni bloklash
sudo iptables -A INPUT -j DROP`)
  );
}

// ── Lesson L22: Port Scanning ─────────────────────────────────
function LessonL22(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Port skanerlash nima?","What is Port Scanning?")),
    React.createElement(P,null,t(lang,
      "Port skanerlash — tarmoqdagi kompyuterlarning qaysi portlari ochiq yoki yopiqligini aniqlash jarayoni. Bu xavfsizlikni tekshirish va hujumchilar tomonidan ham keng qo'llaniladi.",
      "Port scanning is the process of discovering which ports on network computers are open or closed. It's used in security testing and by attackers alike."
    )),
    React.createElement(H2,{num:"§2"},"Nmap — asosiy vosita"),
    React.createElement(P,null,t(lang,
      "Nmap (Network Mapper) — eng keng tarqalgan port skaneri. Ko'plab skanerlash texnikalarini qo'llab-quvvatlaydi.",
      "Nmap (Network Mapper) is the most widely used port scanner, supporting many scanning techniques."
    )),
    React.createElement(Terminal,null,
`# Tezkor skan (top 1000 port)
nmap 192.168.1.1

# Barcha portlarni skanerlash
nmap -p- 192.168.1.1

# Servis versiyalarini aniqlash
nmap -sV 192.168.1.1

# OS aniqlash + agressiv skan
nmap -A 192.168.1.1

# SYN (stealth) skan
sudo nmap -sS 192.168.1.0/24

# UDP skan
sudo nmap -sU 192.168.1.1`),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Faqat ruxsat berilgan tizimlarni skanerlang! Ruxsatsiz port skanerlash ko'pgina mamlakatlarda noqonuniy.","Only scan systems you have permission to test! Unauthorized port scanning is illegal in many countries.")
    )
  );
}

// ── Coming Soon placeholder ───────────────────────────────────
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
    num===13?React.createElement(LessonL13):
    num===22?React.createElement(LessonL22):
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
    !alreadyDone&&!done&&num<=3&&React.createElement("button",{
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
      const sys=`You are an AI tutor for "Network Academy" — a platform teaching network security and protocols. Help with: OSI model, TCP/IP, DNS, HTTP, firewalls, VPN, IDS/IPS, network attacks, Nmap, Wireshark and related topics. Be concise and educational. Respond in the same language the user writes in.`;
      const reply=await callAI(sys+"\n\nUser: "+q+"\nAssistant:");
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

const root=ReactDOM.createRoot(document.getElementById("app"));
root.render(React.createElement(App));
