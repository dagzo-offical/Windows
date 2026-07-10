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


// ── L02: TCP/IP Protocol ──────────────────────────────────────
function LessonL02(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"TCP/IP nima?","What is TCP/IP?")),
    React.createElement(P,null,t(lang,
      "TCP/IP — internet ishlashining asosi bo'lgan protokollar to'plami. Uni pochta tizimiga o'xshating: xat (ma'lumot) konvertga solinadi, manzil yoziladi, pochta bo'limlari orqali o'tadi va oxirida yetkaziladi. TCP/IP xuddi shunday qoidalar to'plami bo'lib, dunyodagi har qanday ikki qurilma bir-biri bilan gaplasha olishini ta'minlaydi.",
      "TCP/IP is the suite of protocols that the internet runs on. Think of it like the postal system: a letter (data) goes in an envelope, gets an address, passes through post offices, and is delivered at the end. TCP/IP is that same set of rules, letting any two devices in the world talk to each other."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"4 qatlamli model","The 4-layer model")),
    React.createElement(P,null,t(lang,
      "TCP/IP OSI ning 7 qatlamini 4 ta amaliy qatlamga soddalashtiradi. Har bir qatlam o'z vazifasiga ega:",
      "TCP/IP simplifies OSI's 7 layers into 4 practical layers. Each layer has its own job:"
    )),
    [["Application",t(lang,"Ilova","Application"),"HTTP, DNS, FTP, SMTP",t(lang,"Foydalanuvchi ko'radigan dasturlar shu yerda","The apps a user sees live here"),"#ff6b6b"],
     ["Transport",t(lang,"Transport","Transport"),"TCP, UDP",t(lang,"Ma'lumotni ishonchli yetkazish, portlar","Reliable delivery, ports"),"#69db7c"],
     ["Internet",t(lang,"Internet","Internet"),"IP, ICMP",t(lang,"IP manzillash va yo'naltirish","IP addressing and routing"),"#4dabf7"],
     ["Network Access",t(lang,"Tarmoq kirishi","Network Access"),"Ethernet, WiFi, ARP",t(lang,"Fizik uzatish va MAC manzillar","Physical transmission and MAC"),"#9775fa"]].map((l,i)=>
      React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"10px 14px",background:"var(--surface)",border:`1px solid ${l[4]}33`,borderRadius:10,alignItems:"flex-start"}},
        React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"var(--text-0)",minWidth:120}},l[1]),
        React.createElement("div",{style:{flex:1}},
          React.createElement("div",{style:{fontSize:11.5,color:"var(--text-2)",marginBottom:3}},l[3]),
          React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:l[4]}},l[2])))),
    React.createElement(H2,{num:"§3"},t(lang,"TCP va UDP farqi","TCP vs UDP")),
    React.createElement(P,null,t(lang,
      "Transport qatlamida ikkita asosiy protokol bor. TCP — ishonchli: har bir paket yetganini tasdiqlaydi, xuddi buyurtma qilingan pochta kabi. UDP — tez, ammo tasdiqlamaydi, xuddi oddiy xat tashlagandek — tez, lekin yetgani kafolatlanmaydi.",
      "The transport layer has two main protocols. TCP is reliable: it confirms every packet arrived, like registered mail. UDP is fast but does not confirm, like dropping a postcard in a box — quick, but delivery isn't guaranteed."
    )),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"12px 0"}},
      React.createElement("div",{style:{padding:14,background:"rgba(105,219,124,0.06)",border:"1px solid rgba(105,219,124,0.2)",borderRadius:10}},
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"#69db7c",fontWeight:700,marginBottom:8}},"TCP"),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.7}},t(lang,"✓ Ishonchli\n✓ Tartibli yetkazish\n✓ Xatolarni tuzatish\n✗ Sekinroq\nMisol: veb, email, fayl","✓ Reliable\n✓ Ordered delivery\n✓ Error correction\n✗ Slower\nUse: web, email, files").split("\n").map((x,i)=>React.createElement("div",{key:i},x)))),
      React.createElement("div",{style:{padding:14,background:"rgba(77,171,247,0.06)",border:"1px solid rgba(77,171,247,0.2)",borderRadius:10}},
        React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"#4dabf7",fontWeight:700,marginBottom:8}},"UDP"),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.7}},t(lang,"✓ Juda tez\n✓ Kam yuk\n✗ Tasdiqlamaydi\n✗ Paket yo'qolishi mumkin\nMisol: video, o'yin, DNS","✓ Very fast\n✓ Low overhead\n✗ No confirmation\n✗ Packets may drop\nUse: video, games, DNS").split("\n").map((x,i)=>React.createElement("div",{key:i},x))))),
    React.createElement(H2,{num:"§4"},t(lang,"3 bosqichli qo'l berish (Handshake)","The 3-way handshake")),
    React.createElement(P,null,t(lang,
      "TCP ulanishni boshlashdan oldin ikki qurilma \"qo'l beradi\" — bir-birini tayyor ekanini tasdiqlaydi. Bu suhbatni boshlashdan oldingi \"Salom — Salom, eshityapman — Yaxshi, boshladik\" kabi:",
      "Before TCP starts a connection, the two devices \"shake hands\" — confirming each is ready. It's like \"Hi — Hi, I hear you — Great, let's begin\" before a conversation:"
    )),
    React.createElement(Terminal,null,
`Client                         Server
  │   ── SYN ─────────────────►  │   1. "Ulanamizmi?"
  │   ◄──────── SYN-ACK ───────  │   2. "Ha, ulanamiz"
  │   ── ACK ─────────────────►  │   3. "Kelishdik!"
  │                              │
  │   ═══ Ma'lumot uzatish ════  │   Ulanish tayyor`),
    React.createElement(Quiz,{
      q:{uz:"Qaysi protokol video oqim (streaming) uchun ko'proq mos, chunki tezlik ishonchlilikdan muhimroq?",en:"Which protocol suits video streaming better, where speed matters more than reliability?"},
      opts:[{uz:"TCP",en:"TCP"},{uz:"UDP",en:"UDP"},{uz:"HTTP",en:"HTTP"},{uz:"ARP",en:"ARP"}],
      correct:1,
      exp:{uz:"UDP tasdiqlashsiz tez uzatadi — video/o'yin uchun bir-ikki paket yo'qolsa ham davom etaverish tezlik uchun afzalroq.",en:"UDP transmits fast without confirmation — for video/games, continuing even if a packet or two drops is preferable for speed."}
    })
  );
}

// ── L03: IP Addressing ────────────────────────────────────────
function LessonL03(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"IP manzil nima?","What is an IP address?")),
    React.createElement(P,null,t(lang,
      "IP manzil — tarmoqdagi har bir qurilmaning yagona \"uy manzili\". Xuddi pochta xatni to'g'ri uyga yetkazish uchun manzilga muhtoj bo'lgani kabi, tarmoq ham ma'lumotni to'g'ri qurilmaga yetkazish uchun IP manzildan foydalanadi.",
      "An IP address is the unique \"home address\" of every device on a network. Just as the post office needs an address to deliver a letter to the right house, the network uses an IP address to deliver data to the right device."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"IPv4 tuzilishi","IPv4 structure")),
    React.createElement(P,null,t(lang,
      "IPv4 manzil nuqta bilan ajratilgan 4 ta sondan iborat (masalan 192.168.1.10). Har bir son 0 dan 255 gacha bo'ladi. Bu jami ~4.3 milliard manzil beradi — bu ko'p tuyulsa-da, dunyoda qurilmalar undan ko'p!",
      "An IPv4 address is 4 numbers separated by dots (e.g. 192.168.1.10). Each number ranges from 0 to 255. This gives ~4.3 billion addresses — which sounds like a lot, but there are more devices in the world than that!"
    )),
    React.createElement(Terminal,null,
`192  .  168  .  1  .  10
└────────┬────────┘  └─┬─┘
   Tarmoq qismi      Xost qismi
  (Network part)    (Host part)

Har bir son = 8 bit (bayt) = 0–255
Jami = 32 bit`),
    React.createElement(H2,{num:"§3"},t(lang,"Xususiy va ommaviy manzillar","Private and public addresses")),
    React.createElement(P,null,t(lang,
      "Ba'zi manzillar diapazoni \"xususiy\" — ular faqat ichki tarmoqda (uyingiz yoki ofisingizda) ishlatiladi va internetda ko'rinmaydi. Bu uy ichidagi xona raqamlari kabi — tashqi olam ularni bilmaydi.",
      "Some address ranges are \"private\" — used only inside a local network (your home or office) and never seen on the internet. It's like room numbers inside a house — the outside world doesn't know them."
    )),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [["10.0.0.0 – 10.255.255.255","10.0.0.0/8",t(lang,"Katta tarmoqlar","Large networks")],
       ["172.16.0.0 – 172.31.255.255","172.16.0.0/12",t(lang,"O'rta tarmoqlar","Medium networks")],
       ["192.168.0.0 – 192.168.255.255","192.168.0.0/16",t(lang,"Uy/kichik ofis","Home/small office")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"center"}},
          React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11.5,color:"var(--accent)",flex:1}},x[0]),
          React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-2)"}},x[1]),
          React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},x[2])))),
    React.createElement(H2,{num:"§4"},t(lang,"CIDR va subnetting","CIDR and subnetting")),
    React.createElement(P,null,t(lang,
      "CIDR yozuvi (masalan /24) manzilning qancha qismi \"tarmoq\", qanchasi \"xost\" ekanini bildiradi. /24 — birinchi 24 bit tarmoq, qolgan 8 bit xostlar uchun (256 ta manzil). Subnetting — katta tarmoqni kichik bo'laklarga bo'lish, xuddi katta binoni qavatlarga bo'lgandek.",
      "CIDR notation (e.g. /24) tells how much of an address is \"network\" and how much is \"host\". /24 means the first 24 bits are network, the remaining 8 bits are for hosts (256 addresses). Subnetting splits a big network into smaller pieces, like dividing a large building into floors."
    )),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,"IPv6: "),
      t(lang,"IPv4 manzillar tugab borgani uchun IPv6 yaratildi — u 128 bitli va deyarli cheksiz manzil beradi (masalan 2001:0db8:85a3::8a2e:0370:7334). Kelajak IPv6 da.",
        "Because IPv4 addresses are running out, IPv6 was created — it is 128-bit and provides almost unlimited addresses (e.g. 2001:0db8:85a3::8a2e:0370:7334). The future is IPv6.")),
    React.createElement(Quiz,{
      q:{uz:"192.168.1.10 manzili qanday manzil hisoblanadi?",en:"What kind of address is 192.168.1.10?"},
      opts:[{uz:"Ommaviy (public) internet manzili",en:"A public internet address"},{uz:"Xususiy (private) ichki tarmoq manzili",en:"A private internal network address"},{uz:"IPv6 manzili",en:"An IPv6 address"},{uz:"MAC manzili",en:"A MAC address"}],
      correct:1,
      exp:{uz:"192.168.0.0/16 diapazoni xususiy — u uy va kichik ofis tarmoqlarida ishlatiladi va to'g'ridan-to'g'ri internetda ko'rinmaydi.",en:"The 192.168.0.0/16 range is private — used in home and small-office networks and not directly visible on the internet."}
    })
  );
}

// ── L04: DNS ──────────────────────────────────────────────────
function LessonL04(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"DNS nima?","What is DNS?")),
    React.createElement(P,null,t(lang,
      "DNS (Domain Name System) — internetning telefon kitobi. Odamlar nomlarni eslaydi (google.com), lekin kompyuterlar IP manzillar bilan ishlaydi (142.250.187.206). DNS nomni IP manzilga aylantiradi, xuddi telefon kitobida ism bo'yicha raqam topgandek.",
      "DNS (Domain Name System) is the internet's phone book. People remember names (google.com), but computers work with IP addresses (142.250.187.206). DNS translates a name into an IP address, like looking up a number by a person's name in a phone book."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"DNS qanday ishlaydi","How DNS works")),
    React.createElement(P,null,t(lang,
      "Brauzerga google.com yozganingizda, kompyuteringiz bir necha serverdan so'raydi, toki IP manzilni topguncha. Bu jarayon bir necha bosqichdan iborat:",
      "When you type google.com into a browser, your computer asks several servers until it finds the IP address. This process has several steps:"
    )),
    React.createElement(Terminal,null,
`1. Kompyuter ──► Recursive resolver: "google.com IP si?"
2. Resolver  ──► Root server:        ".com qayerda?"
3. Resolver  ──► TLD server (.com):  "google.com qayerda?"
4. Resolver  ──► Authoritative:      "IP = 142.250.187.206"
5. Resolver  ──► Kompyuter:          "Mana IP!"

Keyingi safar javob keshdan (cache) tez olinadi`),
    React.createElement(H2,{num:"§3"},t(lang,"DNS yozuv turlari","DNS record types")),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [["A",t(lang,"Nomni IPv4 manzilga bog'laydi","Maps a name to an IPv4 address")],
       ["AAAA",t(lang,"Nomni IPv6 manzilga bog'laydi","Maps a name to an IPv6 address")],
       ["MX",t(lang,"Pochta serverini ko'rsatadi","Points to the mail server")],
       ["CNAME",t(lang,"Bir nomni boshqasiga taxallus qiladi","Aliases one name to another")],
       ["NS",t(lang,"Domenning nom serverlarini bildiradi","Lists the domain's name servers")],
       ["TXT",t(lang,"Matn (ko'pincha xavfsizlik: SPF, DKIM)","Text (often security: SPF, DKIM)")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"center"}},
          React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--accent)",minWidth:56}},x[0]),
          React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},x[1])))),
    React.createElement(H2,{num:"§4"},t(lang,"DNS ni sinab ko'rish","Trying DNS yourself")),
    React.createElement(Terminal,null,
`# Nomni IP ga aylantirish\nnslookup google.com\ndig google.com A\n\n# Pochta serverini ko'rish\ndig google.com MX\n\n# Batafsil so'rov izi\ndig +trace google.com`),
    React.createElement(Quiz,{
      q:{uz:"DNS ning asosiy vazifasi nima?",en:"What is the main job of DNS?"},
      opts:[{uz:"Ma'lumotni shifrlash",en:"Encrypting data"},{uz:"Domen nomini IP manzilga aylantirish",en:"Translating a domain name into an IP address"},{uz:"Paketlarni yo'naltirish",en:"Routing packets"},{uz:"Parollarni saqlash",en:"Storing passwords"}],
      correct:1,
      exp:{uz:"DNS internetning telefon kitobi — u odamlar eslaydigan nomlarni (google.com) kompyuterlar ishlatadigan IP manzillarga aylantiradi.",en:"DNS is the internet's phone book — it translates human-friendly names (google.com) into the IP addresses computers use."}
    })
  );
}

// ── L05: HTTP/HTTPS ───────────────────────────────────────────
function LessonL05(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"HTTP nima?","What is HTTP?")),
    React.createElement(P,null,t(lang,
      "HTTP (HyperText Transfer Protocol) — brauzer va veb-server o'rtasidagi \"til\". Siz saytga kirganingizda brauzer HTTP so'rov yuboradi (\"menga bu sahifani ber\"), server esa HTTP javob qaytaradi (sahifa mazmuni). Bu restoranda ovqat buyurtma qilib, keyin uni olishga o'xshaydi.",
      "HTTP (HyperText Transfer Protocol) is the \"language\" between a browser and a web server. When you visit a site, the browser sends an HTTP request (\"give me this page\") and the server returns an HTTP response (the page content). It's like ordering food at a restaurant and then receiving it."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"So'rov metodlari","Request methods")),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [["GET",t(lang,"Ma'lumot olish (sahifa ochish)","Retrieve data (open a page)")],
       ["POST",t(lang,"Ma'lumot yuborish (forma to'ldirish)","Send data (submit a form)")],
       ["PUT",t(lang,"Mavjud narsani yangilash","Update an existing resource")],
       ["DELETE",t(lang,"Narsani o'chirish","Delete a resource")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"center"}},
          React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--accent)",minWidth:70}},x[0]),
          React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},x[1])))),
    React.createElement(H2,{num:"§3"},t(lang,"Holat kodlari (Status codes)","Status codes")),
    React.createElement(P,null,t(lang,
      "Server har javobda uch xonali kod yuboradi — so'rov qanday tugaganini bildiradi:",
      "The server sends a three-digit code with each response — telling how the request ended:"
    )),
    React.createElement(Terminal,null,
`2xx — Muvaffaqiyat:   200 OK
3xx — Yo'naltirish:   301 Moved, 302 Found
4xx — Mijoz xatosi:   404 Not Found, 403 Forbidden
5xx — Server xatosi:  500 Internal, 503 Unavailable`),
    React.createElement(H2,{num:"§4"},t(lang,"HTTP vs HTTPS","HTTP vs HTTPS")),
    React.createElement(P,null,t(lang,
      "HTTP ma'lumotni ochiq matn ko'rinishida yuboradi — kim eshitsa, o'qiy oladi (masalan parollaringizni!). HTTPS esa TLS shifrlash qo'shadi — ma'lumot maxfiy konvertga solingandek bo'ladi. Brauzerdagi qulf belgisi HTTPS ishlayotganini bildiradi.",
      "HTTP sends data as plain text — anyone listening can read it (including your passwords!). HTTPS adds TLS encryption — the data is like being sealed in a private envelope. The padlock icon in the browser means HTTPS is active."
    )),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Ochiq WiFi da HTTP saytga parol kiritmang — u shifrlanmagan holda uzatiladi va oson ushlanadi. Doim HTTPS (qulf belgisi) borligini tekshiring.",
        "Never enter a password on an HTTP site over public WiFi — it travels unencrypted and is easily captured. Always check for HTTPS (the padlock icon).")),
    React.createElement(Quiz,{
      q:{uz:"HTTPS ni HTTP dan farqlovchi asosiy narsa nima?",en:"What mainly sets HTTPS apart from HTTP?"},
      opts:[{uz:"U tezroq",en:"It is faster"},{uz:"U TLS bilan ma'lumotni shifrlaydi",en:"It encrypts data with TLS"},{uz:"U rasmlarni yaxshiroq ko'rsatadi",en:"It shows images better"},{uz:"U faqat mobil qurilmalarda ishlaydi",en:"It only works on mobile"}],
      correct:1,
      exp:{uz:"HTTPS = HTTP + TLS shifrlash. Ma'lumot maxfiy konvertga solingandek — yo'lda kim eshitsa ham o'qiy olmaydi.",en:"HTTPS = HTTP + TLS encryption. Data is sealed like a private envelope — anyone listening in transit can't read it."}
    })
  );
}

// ── L06: ARP ──────────────────────────────────────────────────
function LessonL06(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"ARP nima?","What is ARP?")),
    React.createElement(P,null,t(lang,
      "ARP (Address Resolution Protocol) IP manzilni fizik MAC manzilga bog'laydi. IP manzil — mantiqiy \"uy manzili\", MAC manzil esa qurilmaning ishlab chiqarishda berilgan doimiy \"pasport raqami\". Lokal tarmoqda ma'lumot yetkazish uchun MAC manzil kerak, ARP esa uni topadi.",
      "ARP (Address Resolution Protocol) links an IP address to a physical MAC address. An IP address is a logical \"home address\", while a MAC address is the device's permanent \"passport number\" set at manufacture. To deliver data on a local network you need the MAC address, and ARP finds it."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"ARP qanday ishlaydi","How ARP works")),
    React.createElement(P,null,t(lang,
      "Qurilma boshqasiga xabar yubormoqchi bo'lsa-yu, faqat IP sini bilsa, u butun tarmoqqa baqiradi: \"192.168.1.5 kimda? MAC ingni ber!\" — egasi javob beradi. Bu bir xonada \"Aziz kim?\" deb baqirib, Aziz qo'l ko'targanidek:",
      "When a device wants to message another but only knows its IP, it shouts to the whole network: \"Who has 192.168.1.5? Send me your MAC!\" — the owner replies. It's like shouting \"Who is Aziz?\" in a room and Aziz raising his hand:"
    )),
    React.createElement(Terminal,null,
`Kompyuter A (192.168.1.2)          Butun tarmoq
  │                                     │
  │ ── ARP so'rov (broadcast) ────────► │ "192.168.1.5 kimda?"
  │                                     │
  │ ◄── ARP javob (unicast) ─────────── │ B: "Bu men! MAC=aa:bb:cc..."
  │                                     │
  Endi A, B ga to'g'ridan yubora oladi`),
    React.createElement(H2,{num:"§3"},t(lang,"ARP jadvalini ko'rish","Viewing the ARP table")),
    React.createElement(Terminal,null,
`# Kompyuter eslab qolgan IP↔MAC juftliklari\narp -a\n\n# Natija:\n# 192.168.1.1   00:11:22:33:44:55   dynamic\n# 192.168.1.5   aa:bb:cc:dd:ee:ff   dynamic`),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"ARP ishonchga asoslanadi — u javob haqiqiy ekanini tekshirmaydi. Shu sababli \"ARP spoofing\" hujumi mumkin (L24 da o'rganamiz), unda hujumchi soxta javob yuborib trafikni o'g'irlaydi.",
        "ARP is trust-based — it doesn't verify that a reply is genuine. This makes \"ARP spoofing\" attacks possible (covered in L24), where an attacker sends a fake reply to steal traffic.")),
    React.createElement(Quiz,{
      q:{uz:"ARP nimani nimaga bog'laydi?",en:"What does ARP link to what?"},
      opts:[{uz:"Domen nomini IP ga",en:"A domain name to an IP"},{uz:"IP manzilni MAC manzilga",en:"An IP address to a MAC address"},{uz:"Portni protokolga",en:"A port to a protocol"},{uz:"Parolni foydalanuvchiga",en:"A password to a user"}],
      correct:1,
      exp:{uz:"ARP mantiqiy IP manzilni fizik MAC manzilga bog'laydi — lokal tarmoqda ma'lumotni to'g'ri qurilmaga yetkazish uchun.",en:"ARP links a logical IP address to a physical MAC address — so data reaches the right device on the local network."}
    })
  );
}

// ── L07: DHCP ─────────────────────────────────────────────────
function LessonL07(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"DHCP nima?","What is DHCP?")),
    React.createElement(P,null,t(lang,
      "DHCP (Dynamic Host Configuration Protocol) qurilmalarga IP manzilni avtomatik beradi. Usiz har bir telefon, noutbuk uchun IP ni qo'lda kiritishga to'g'ri kelardi. DHCP — bu mehmonxona qabulxonasi kabi: kelasiz, u sizga xona (IP) va yo'l-yo'riq (gateway, DNS) beradi.",
      "DHCP (Dynamic Host Configuration Protocol) automatically hands devices an IP address. Without it you'd have to type an IP by hand for every phone and laptop. DHCP is like a hotel front desk: you arrive, and it gives you a room (IP) and directions (gateway, DNS)."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"DORA jarayoni","The DORA process")),
    React.createElement(P,null,t(lang,
      "Qurilma tarmoqqa ulanganda 4 bosqichli \"DORA\" suhbati kechadi:",
      "When a device joins a network, a 4-step \"DORA\" conversation happens:"
    )),
    React.createElement(Terminal,null,
`D — Discover:  Qurilma "Menga IP kerak!" deb baqiradi
O — Offer:     DHCP server "Mana, 192.168.1.50 ni ol"
R — Request:   Qurilma "Roziman, shuni olaman"
A — Acknowledge: Server "Kelishdik, u sizniki (24 soat)"

Discover → Offer → Request → Acknowledge`),
    React.createElement(H2,{num:"§3"},t(lang,"Ijara (lease) tushunchasi","The lease concept")),
    React.createElement(P,null,t(lang,
      "DHCP bergan IP abadiy emas — u \"ijaraga\" (lease) beriladi, masalan 24 soatga. Muddat tugashidan oldin qurilma uni yangilaydi. Bu manzillarni tejaydi — ketgan mehmonning xonasi bo'shab, boshqasiga beriladi.",
      "The IP DHCP gives isn't forever — it's a \"lease\", say 24 hours. Before it expires the device renews it. This saves addresses — a departed guest's room frees up for someone else."
    )),
    React.createElement(Terminal,null,
`# Linux da yangi IP so'rash\nsudo dhclient -r    # eskisini qaytarish\nsudo dhclient       # yangisini olish\n\n# Windows da\nipconfig /release\nipconfig /renew`),
    React.createElement(Quiz,{
      q:{uz:"DHCP DORA jarayonining to'g'ri tartibi qanday?",en:"What is the correct order of the DHCP DORA process?"},
      opts:[{uz:"Discover → Offer → Request → Acknowledge",en:"Discover → Offer → Request → Acknowledge"},{uz:"Offer → Discover → Acknowledge → Request",en:"Offer → Discover → Acknowledge → Request"},{uz:"Request → Discover → Offer → Acknowledge",en:"Request → Discover → Offer → Acknowledge"},{uz:"Acknowledge → Request → Offer → Discover",en:"Acknowledge → Request → Offer → Discover"}],
      correct:0,
      exp:{uz:"DORA: qurilma Discover bilan so'raydi, server Offer beradi, qurilma Request bilan tasdiqlaydi, server Acknowledge bilan yakunlaydi.",en:"DORA: the device asks with Discover, the server Offers, the device confirms with Request, the server finalizes with Acknowledge."}
    })
  );
}

// ── L08: Routing ──────────────────────────────────────────────
function LessonL08(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Routing nima?","What is routing?")),
    React.createElement(P,null,t(lang,
      "Routing — paketlarni bir tarmoqdan boshqasiga yo'naltirish jarayoni. Router — tarmoqlararo \"chorraha politsiyachisi\": har bir paketning manzilini ko'rib, uni to'g'ri yo'nalishga jo'natadi. Internet — millionlab routerlar orqali bog'langan tarmoqlar to'ri.",
      "Routing is the process of directing packets from one network to another. A router is the \"traffic officer\" between networks: it reads each packet's destination and sends it down the right path. The internet is a web of networks connected by millions of routers."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Marshrutlash jadvali","The routing table")),
    React.createElement(P,null,t(lang,
      "Har bir router \"jadval\" saqlaydi — qaysi manzilga qaysi yo'l orqali borishni ko'rsatadi. Bu navigatordagi yo'l xaritasiga o'xshaydi. Agar aniq yo'l bo'lmasa, paket \"default gateway\" (asosiy chiqish) ga yuboriladi.",
      "Every router keeps a \"table\" — showing which path leads to which destination. It's like the road map in a GPS. If there's no specific route, the packet is sent to the \"default gateway\" (the main exit)."
    )),
    React.createElement(Terminal,null,
`# Marshrutlash jadvalini ko'rish\nip route\n\n# Natija:\n# default via 192.168.1.1 dev eth0   ← asosiy chiqish\n# 192.168.1.0/24 dev eth0            ← lokal tarmoq\n\n# Paket qaysi yo'ldan ketishini kuzatish\ntraceroute google.com`),
    React.createElement(H2,{num:"§3"},t(lang,"Statik va dinamik marshrutlash","Static vs dynamic routing")),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"12px 0"}},
      React.createElement("div",{style:{padding:14,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
        React.createElement("div",{style:{fontWeight:700,fontSize:12.5,color:"var(--accent)",marginBottom:6}},t(lang,"Statik","Static")),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.6}},t(lang,"Administrator yo'llarni qo'lda kiritadi. Kichik tarmoqlar uchun sodda, lekin o'zgarishga moslashmaydi.","An admin enters routes by hand. Simple for small networks, but doesn't adapt to change."))),
      React.createElement("div",{style:{padding:14,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
        React.createElement("div",{style:{fontWeight:700,fontSize:12.5,color:"var(--accent)",marginBottom:6}},t(lang,"Dinamik","Dynamic")),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.6}},t(lang,"Routerlar o'zaro gaplashib yo'llarni avtomatik o'rganadi (OSPF, BGP). Katta tarmoqlar uchun.","Routers talk to each other and learn routes automatically (OSPF, BGP). For large networks.")))),
    React.createElement(Quiz,{
      q:{uz:"Agar routerda paket manzili uchun aniq yo'l bo'lmasa, paket qayerga yuboriladi?",en:"If a router has no specific route for a packet's destination, where is the packet sent?"},
      opts:[{uz:"O'chiriladi",en:"It is dropped immediately"},{uz:"Default gateway ga",en:"To the default gateway"},{uz:"Orqaga qaytariladi",en:"Back to the sender"},{uz:"DNS serverga",en:"To the DNS server"}],
      correct:1,
      exp:{uz:"Aniq yo'l bo'lmasa, paket \"default gateway\" (asosiy chiqish) ga yuboriladi — bu tarmoqning tashqi olamga eshigi.",en:"With no specific route, the packet goes to the \"default gateway\" (the main exit) — the network's door to the outside world."}
    })
  );
}

// ── L09: Switching & VLAN ─────────────────────────────────────
function LessonL09(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Switch nima?","What is a switch?")),
    React.createElement(P,null,t(lang,
      "Switch (kommutator) — lokal tarmoqdagi qurilmalarni bog'lovchi \"aqlli tarqatgich\". U MAC manzillar jadvalini saqlaydi va ma'lumotni faqat kerakli qurilmaga yuboradi. Eski \"hub\" esa ma'lumotni hammaga yuborardi — xuddi butun sinfga baqirgandek. Switch esa aniq odamga pichirlaydi.",
      "A switch is the \"smart distributor\" that connects devices on a local network. It keeps a MAC address table and sends data only to the right device. An old \"hub\" sent data to everyone — like shouting to the whole class. A switch whispers to the exact person."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"MAC jadvali","The MAC table")),
    React.createElement(P,null,t(lang,
      "Switch har bir portga qaysi qurilma ulanganini o'rganadi va eslab qoladi. Paket kelganda, u manzil MAC ini jadvaldan topib, faqat o'sha portga jo'natadi — bu tarmoqni tez va xavfsizroq qiladi.",
      "A switch learns and remembers which device is connected to each port. When a packet arrives, it looks up the destination MAC in the table and forwards only to that port — making the network faster and more secure."
    )),
    React.createElement(H2,{num:"§3"},t(lang,"VLAN nima?","What is a VLAN?")),
    React.createElement(P,null,t(lang,
      "VLAN (Virtual LAN) bitta fizik switchni bir necha mantiqiy tarmoqqa bo'ladi. Bu bitta katta ofisni devorlar bilan alohida xonalarga bo'lgandek — bir switchga ulangan bo'lsa ham, buxgalteriya va IT bo'limi bir-birini ko'rmaydi. Bu xavfsizlik va tartib beradi.",
      "A VLAN (Virtual LAN) splits one physical switch into several logical networks. It's like dividing one big office into separate rooms with walls — even connected to the same switch, the accounting and IT departments can't see each other. This gives security and order."
    )),
    React.createElement(Terminal,null,
`Fizik switch (1 dona)
├── VLAN 10  →  Buxgalteriya  (10.0.10.0/24)
├── VLAN 20  →  IT bo'limi     (10.0.20.0/24)
└── VLAN 30  →  Mehmonlar      (10.0.30.0/24)

Har bir VLAN alohida tarmoq kabi ishlaydi`),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,"Trunk: "),
      t(lang,"VLAN lar o'rtasida yoki switchlar orasida trafikni tashiydigan maxsus port \"trunk\" deyiladi — u bir necha VLAN ma'lumotini teglar (802.1Q) bilan belgilab tashiydi.",
        "A special port that carries traffic between VLANs or between switches is called a \"trunk\" — it carries several VLANs' data, tagging each (802.1Q).")),
    React.createElement(Quiz,{
      q:{uz:"VLAN nima uchun ishlatiladi?",en:"What is a VLAN used for?"},
      opts:[{uz:"Internet tezligini oshirish",en:"Boosting internet speed"},{uz:"Bitta switchni mantiqan alohida tarmoqlarga bo'lish",en:"Logically splitting one switch into separate networks"},{uz:"Parollarni saqlash",en:"Storing passwords"},{uz:"IP manzil berish",en:"Handing out IP addresses"}],
      correct:1,
      exp:{uz:"VLAN bitta fizik switchni bir necha mantiqiy tarmoqqa bo'ladi — bo'limlarni ajratib, xavfsizlik va tartib beradi.",en:"A VLAN splits one physical switch into several logical networks — separating departments for security and order."}
    })
  );
}

// ── L10: NAT/PAT ──────────────────────────────────────────────
function LessonL10(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"NAT nima?","What is NAT?")),
    React.createElement(P,null,t(lang,
      "NAT (Network Address Translation) ko'plab xususiy IP manzillarni bitta ommaviy IP manzilga aylantiradi. Uyingizdagi barcha qurilmalar (telefon, TV, noutbuk) internetga bitta ommaviy IP orqali chiqadi. Bu ofis kommutatori kabi — tashqaridan bitta raqam ko'rinadi, ichkarida esa ko'p ichki raqamlar bor.",
      "NAT (Network Address Translation) turns many private IP addresses into one public IP address. All the devices in your home (phone, TV, laptop) reach the internet through a single public IP. It's like an office switchboard — outside there's one number, inside there are many extensions."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Nega NAT kerak?","Why do we need NAT?")),
    React.createElement(P,null,t(lang,
      "IPv4 manzillar kam (~4.3 mlrd), qurilmalar esa milliardlab. NAT bitta ommaviy IP ni ko'p qurilma bilan ulashishga imkon beradi — manzillarni tejaydi. Bundan tashqari, ichki qurilmalar internetdan to'g'ridan-to'g'ri ko'rinmaydi — bu qo'shimcha xavfsizlik.",
      "IPv4 addresses are scarce (~4.3 billion), but devices number in the billions. NAT lets one public IP be shared by many devices — saving addresses. It also hides internal devices from being directly visible on the internet — extra security."
    )),
    React.createElement(H2,{num:"§3"},t(lang,"PAT — portlar bilan","PAT — using ports")),
    React.createElement(P,null,t(lang,
      "PAT (Port Address Translation) — NAT ning eng keng tarqalgan turi. Router har bir ichki ulanishga alohida port raqami beradi, shunda qaysi javob qaysi qurilmaga tegishli ekanini biladi. Bu pochta bo'limi har bir kishiga alohida qutича raqami bergandek.",
      "PAT (Port Address Translation) is the most common form of NAT. The router assigns each internal connection a unique port number, so it knows which reply belongs to which device. It's like a post office giving each person a separate box number."
    )),
    React.createElement(Terminal,null,
`Ichki qurilma        Router NAT jadvali         Internet
192.168.1.5:52001 ──► 203.0.113.7:40001 ──────► server
192.168.1.6:49500 ──► 203.0.113.7:40002 ──────► server

Bitta ommaviy IP (203.0.113.7), ko'p port`),
    React.createElement(Quiz,{
      q:{uz:"NAT ning asosiy foydasi nima?",en:"What is the main benefit of NAT?"},
      opts:[{uz:"Ma'lumotni shifrlaydi",en:"It encrypts data"},{uz:"Ko'p qurilmaga bitta ommaviy IP ni ulashadi",en:"It shares one public IP among many devices"},{uz:"DNS ni tezlashtiradi",en:"It speeds up DNS"},{uz:"Parollarni tekshiradi",en:"It checks passwords"}],
      correct:1,
      exp:{uz:"NAT ko'plab xususiy manzilni bitta ommaviy IP ga aylantiradi — kam IPv4 manzilni tejaydi va ichki qurilmalarni yashiradi.",en:"NAT maps many private addresses to one public IP — saving scarce IPv4 addresses and hiding internal devices."}
    })
  );
}

// ── L11: Network Topologies ───────────────────────────────────
function LessonL11(){
  const lang=useLang();
  const topos=[
    {n:t(lang,"Bus (shina)","Bus"),d:t(lang,"Hamma bitta umumiy kabelga ulanadi. Arzon, lekin kabel uzilsa hamma to'xtaydi.","Everyone connects to one shared cable. Cheap, but if the cable breaks everyone stops."),c:"#ff6b6b"},
    {n:t(lang,"Star (yulduz)","Star"),d:t(lang,"Hamma markaziy switchga ulanadi. Eng keng tarqalgan. Bitta qurilma uzilsa boshqalar ishlayveradi.","Everyone connects to a central switch. Most common. If one device fails, others keep working."),c:"#69db7c"},
    {n:t(lang,"Ring (halqa)","Ring"),d:t(lang,"Qurilmalar halqa bo'lib ulanadi, ma'lumot aylanadi. Bir uzilish butun halqani buzishi mumkin.","Devices connect in a loop, data circulates. One break can disrupt the whole ring."),c:"#ffd43b"},
    {n:t(lang,"Mesh (to'r)","Mesh"),d:t(lang,"Har bir qurilma ko'plariga ulanadi. Juda ishonchli (ko'p yo'l), lekin qimmat.","Each device connects to many others. Very reliable (many paths), but expensive."),c:"#4dabf7"},
    {n:t(lang,"Hybrid (aralash)","Hybrid"),d:t(lang,"Yuqoridagilarning kombinatsiyasi — katta tarmoqlarda ishlatiladi.","A combination of the above — used in large networks."),c:"#9775fa"},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Topologiya nima?","What is a topology?")),
    React.createElement(P,null,t(lang,
      "Tarmoq topologiyasi — qurilmalar bir-biriga qanday ulanganining \"shakli\". Xuddi shahar ko'chalarini turlicha rejalashtirish mumkin bo'lgani kabi, tarmoqni ham turli shakllarda qurish mumkin. Har birining afzallik va kamchiligi bor.",
      "A network topology is the \"shape\" of how devices connect to each other. Just as a city's streets can be laid out in different ways, a network can be built in different shapes. Each has its pros and cons."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy topologiyalar","Main topologies")),
    topos.map((x,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:`1px solid ${x.c}33`,borderRadius:10,alignItems:"flex-start"}},
      React.createElement("div",{style:{fontWeight:700,fontSize:13,color:x.c,minWidth:100}},x.n),
      React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.55,flex:1}},x.d))),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Amalda: ","In practice: ")),
      t(lang,"Zamonaviy tarmoqlarning aksariyati Star (yulduz) topologiyasidan foydalanadi — har bir qurilma markaziy switchga ulanadi. Bu boshqarish va nosozlikni topishni osonlashtiradi.",
        "Most modern networks use the Star topology — each device connects to a central switch. This makes management and troubleshooting easier.")),
    React.createElement(Quiz,{
      q:{uz:"Qaysi topologiyada bitta qurilma uzilsa ham qolganlari ishlayveradi va u eng keng tarqalgan?",en:"In which topology do the rest keep working if one device fails, and which is the most common?"},
      opts:[{uz:"Bus",en:"Bus"},{uz:"Star (yulduz)",en:"Star"},{uz:"Ring (halqa)",en:"Ring"},{uz:"Hech qaysi",en:"None"}],
      correct:1,
      exp:{uz:"Star topologiyasida hamma markaziy switchga ulanadi — bitta qurilma uzilsa, boshqalarga ta'sir qilmaydi. Shu sababli u eng keng tarqalgan.",en:"In a Star topology everyone connects to a central switch — if one device fails, others are unaffected. That's why it's the most common."}
    })
  );
}

// ── L12: Wireless Networks ────────────────────────────────────
function LessonL12(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Simsiz tarmoq nima?","What is a wireless network?")),
    React.createElement(P,null,t(lang,
      "WiFi — kabel o'rniga radio to'lqinlari orqali ma'lumot uzatuvchi tarmoq texnologiyasi. Qurilmangiz simsiz nuqta (access point / router) bilan radio orqali gaplashadi. Bu suhbatni simli telefon o'rniga radio bilan qilgandek — qulay, lekin havoda hamma \"eshitishi\" mumkin, shuning uchun shifrlash muhim.",
      "WiFi is a network technology that sends data over radio waves instead of cables. Your device talks to an access point (router) via radio. It's like having a conversation over radio instead of a wired phone — convenient, but anyone in the air can \"hear\", so encryption matters."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"WiFi standartlari","WiFi standards")),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [["802.11n","WiFi 4",t(lang,"2.4/5 GHz, 600 Mbps gacha","2.4/5 GHz, up to 600 Mbps")],
       ["802.11ac","WiFi 5",t(lang,"5 GHz, bir necha Gbps","5 GHz, several Gbps")],
       ["802.11ax","WiFi 6",t(lang,"Tezroq, gavjum joylarda yaxshi","Faster, better in crowds")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"center"}},
          React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11.5,fontWeight:700,color:"var(--accent)",minWidth:80}},x[0]),
          React.createElement("span",{style:{fontSize:12,fontWeight:600,color:"var(--text-0)",minWidth:60}},x[1]),
          React.createElement("span",{style:{fontSize:11.5,color:"var(--text-2)"}},x[2])))),
    React.createElement(H2,{num:"§3"},t(lang,"WiFi xavfsizligi","WiFi security")),
    React.createElement(P,null,t(lang,
      "Simsiz tarmoq havo orqali uzatgani uchun shifrlash juda muhim. Xavfsizlik standartlari yillar davomida kuchaydi:",
      "Because a wireless network transmits through the air, encryption is critical. Security standards have strengthened over the years:"
    )),
    React.createElement(Terminal,null,
`WEP   — Eski, buzilgan. ISHLATMANG!
WPA   — WEP dan yaxshi, lekin eskirgan
WPA2  — Uzoq vaqt standart. Hali keng qo'llanadi
WPA3  — Eng yangi va eng xavfsiz (tavsiya)`),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"WEP shifrlashini hech qachon ishlatmang — u bir necha daqiqada buziladi. Uy tarmog'ingizda kamida WPA2, imkon bo'lsa WPA3 dan foydalaning va kuchli parol qo'ying.",
        "Never use WEP encryption — it can be cracked in minutes. Use at least WPA2, ideally WPA3, on your home network, and set a strong password.")),
    React.createElement(Quiz,{
      q:{uz:"Uy WiFi tarmog'i uchun bugungi kunda qaysi shifrlash tavsiya etiladi?",en:"Which encryption is recommended today for a home WiFi network?"},
      opts:[{uz:"WEP",en:"WEP"},{uz:"Ochiq (shifrsiz)",en:"Open (no encryption)"},{uz:"WPA2 yoki WPA3",en:"WPA2 or WPA3"},{uz:"HTTP",en:"HTTP"}],
      correct:2,
      exp:{uz:"WPA2 (yoki yangiroq WPA3) zamonaviy va xavfsiz. WEP buzilgan va ishlatilmasligi kerak.",en:"WPA2 (or the newer WPA3) is modern and secure. WEP is broken and should not be used."}
    })
  );
}


// ── L14: VPN ──────────────────────────────────────────────────
function LessonL14(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"VPN nima?","What is a VPN?")),
    React.createElement(P,null,t(lang,
      "VPN (Virtual Private Network) internet ustidan xavfsiz, shifrlangan \"tunnel\" quradi. Ma'lumotingiz ochiq internetdan o'tsa ham, u shifrlangan quvur ichida ketadi — tashqaridan hech kim ichini ko'ra olmaydi. Bu ochiq maydondan o'tayotgan yashirin yer osti yo'li kabi.",
      "A VPN (Virtual Private Network) builds a secure, encrypted \"tunnel\" over the internet. Even though your data crosses the public internet, it travels inside an encrypted pipe — no one outside can see inside. It's like a hidden underground tunnel crossing an open field."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"VPN nima uchun kerak?","Why use a VPN?")),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [[t(lang,"Maxfiylik","Privacy"),t(lang,"Internet-provayder va tarmoqdagilar trafikingizni ko'ra olmaydi","Your ISP and others on the network can't see your traffic")],
       [t(lang,"Ochiq WiFi himoyasi","Public WiFi safety"),t(lang,"Kafe/aeroport WiFi da ma'lumotingiz shifrlanadi","Your data is encrypted on café/airport WiFi")],
       [t(lang,"Masofaviy ish","Remote work"),t(lang,"Uydan ofis tarmog'iga xavfsiz ulanish","Securely connect to the office network from home")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"flex-start"}},
          React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:120}},x[0]),
          React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},x[1])))),
    React.createElement(H2,{num:"§3"},t(lang,"VPN turlari va protokollar","VPN types and protocols")),
    React.createElement(Terminal,null,
`Turlari:
  Site-to-Site  — ikki ofis tarmog'ini bog'laydi
  Remote Access — bitta foydalanuvchi tarmoqqa ulanadi

Protokollar:
  IPsec      — korporativ standart
  OpenVPN    — ochiq kodli, moslashuvchan
  WireGuard  — yangi, tez va sodda`),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"VPN sizni to'liq \"ko'rinmas\" qilmaydi — u faqat trafikni shifrlaydi. VPN provayderiga ishonishingiz kerak, chunki u sizning trafikingizni ko'radi. Bepul VPN lar ko'pincha ma'lumotingizni sotadi.",
        "A VPN doesn't make you fully \"invisible\" — it only encrypts traffic. You must trust the VPN provider, because it sees your traffic. Free VPNs often sell your data.")),
    React.createElement(Quiz,{
      q:{uz:"VPN ma'lumotingiz bilan asosan nima qiladi?",en:"What does a VPN mainly do with your data?"},
      opts:[{uz:"Uni tezlashtiradi",en:"Speeds it up"},{uz:"Shifrlangan tunnel ichida uzatadi",en:"Sends it through an encrypted tunnel"},{uz:"O'chirib tashlaydi",en:"Deletes it"},{uz:"Rasmga aylantiradi",en:"Turns it into an image"}],
      correct:1,
      exp:{uz:"VPN internet ustidan shifrlangan tunnel quradi — ma'lumotingiz ochiq tarmoqdan o'tsa ham, ichini tashqaridan ko'rib bo'lmaydi.",en:"A VPN builds an encrypted tunnel over the internet — even crossing a public network, the contents can't be seen from outside."}
    })
  );
}

// ── L15: SSL/TLS ──────────────────────────────────────────────
function LessonL15(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"SSL/TLS nima?","What is SSL/TLS?")),
    React.createElement(P,null,t(lang,
      "TLS (Transport Layer Security) — internetda ma'lumotni shifrlaydigan protokol. U HTTPS ning \"S\" harfi. SSL — TLS ning eski nomi. TLS ikki narsani ta'minlaydi: maxfiylik (hech kim o'qiy olmaydi) va ishonch (siz haqiqiy sayt bilan gaplashyapsiz, soxtasi bilan emas).",
      "TLS (Transport Layer Security) is the protocol that encrypts data on the internet. It's the \"S\" in HTTPS. SSL is the old name for TLS. TLS ensures two things: confidentiality (no one can read it) and trust (you're talking to the real site, not a fake)."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Sertifikat va CA","Certificates and CAs")),
    React.createElement(P,null,t(lang,
      "Sayt o'zining haqiqiyligini \"sertifikat\" bilan isbotlaydi — bu raqamli pasport kabi. Sertifikatni ishonchli tashkilot (CA — Certificate Authority) imzolaydi. Brauzer CA ro'yxatini biladi, shuning uchun soxta sertifikatni darhol aniqlaydi va ogohlantiradi.",
      "A site proves it's genuine with a \"certificate\" — like a digital passport. The certificate is signed by a trusted organization (a CA — Certificate Authority). The browser knows the list of CAs, so it instantly detects a fake certificate and warns you."
    )),
    React.createElement(H2,{num:"§3"},t(lang,"TLS qo'l berishi","The TLS handshake")),
    React.createElement(Terminal,null,
`1. Client:  "Salom, qaysi shifrlarni bilasan?"
2. Server:  "Manavilarni. Mana sertifikatim"
3. Client:  sertifikatni tekshiradi (CA imzosi?)
4. Ikkalasi: umumiy maxfiy kalitni kelishadi
5. ═══ Endi hamma narsa shifrlanadi ═══`),
    React.createElement(P,null,t(lang,
      "TLS ikki xil shifrlashni birlashtiradi: asimmetrik (ikki kalit — ochiq va yashirin) kalitni xavfsiz kelishish uchun, keyin simmetrik (bir kalit) tez shifrlash uchun. Bu qulfni ochish uchun maxsus kalit, keyin tezkor ish uchun oddiy kalitdan foydalangandek.",
      "TLS combines two kinds of encryption: asymmetric (two keys — public and private) to safely agree on a key, then symmetric (one key) for fast encryption. It's like using a special key to unlock the door, then a simple key for the fast everyday work."
    )),
    React.createElement(Quiz,{
      q:{uz:"TLS sertifikatini kim imzolaydi, shunda brauzer unga ishonadi?",en:"Who signs a TLS certificate so the browser trusts it?"},
      opts:[{uz:"Foydalanuvchi",en:"The user"},{uz:"Certificate Authority (CA)",en:"A Certificate Authority (CA)"},{uz:"Internet-provayder",en:"The ISP"},{uz:"DNS server",en:"The DNS server"}],
      correct:1,
      exp:{uz:"Ishonchli CA sertifikatni imzolaydi. Brauzer CA lar ro'yxatini biladi, shuning uchun haqiqiy va soxta sertifikatni ajrata oladi.",en:"A trusted CA signs the certificate. The browser knows the list of CAs, so it can tell a real certificate from a fake one."}
    })
  );
}

// ── L16: IDS/IPS ──────────────────────────────────────────────
function LessonL16(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"IDS va IPS nima?","What are IDS and IPS?")),
    React.createElement(P,null,t(lang,
      "IDS (Intrusion Detection System) — tarmoqni kuzatib, shubhali harakatni aniqlaydi va ogohlantiradi. IPS (Intrusion Prevention System) esa bir qadam oldinga o'tadi — u nafaqat aniqlaydi, balki hujumni bloklaydi. IDS — signalizatsiya (\"o'g'ri kirdi!\" deb baqiradi), IPS — qulflab qo'yadigan qorovul.",
      "An IDS (Intrusion Detection System) watches the network, detects suspicious activity and raises an alert. An IPS (Intrusion Prevention System) goes one step further — it not only detects but blocks the attack. An IDS is an alarm (it shouts \"a burglar!\"), an IPS is a guard that locks the door."
    )),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"12px 0"}},
      React.createElement("div",{style:{padding:14,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
        React.createElement("div",{style:{fontWeight:700,fontSize:12.5,color:"var(--accent)",marginBottom:6}},"IDS"),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.6}},t(lang,"Aniqlaydi + ogohlantiradi.\nTrafik nusxasini ko'radi (passiv).\nHujumni to'xtatmaydi.","Detects + alerts.\nSees a copy of traffic (passive).\nDoesn't stop the attack."))),
      React.createElement("div",{style:{padding:14,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
        React.createElement("div",{style:{fontWeight:700,fontSize:12.5,color:"var(--accent)",marginBottom:6}},"IPS"),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.6}},t(lang,"Aniqlaydi + bloklaydi.\nTrafik ichidan o'tadi (inline).\nHujumni real vaqtda to'xtatadi.","Detects + blocks.\nSits inline in the traffic path.\nStops the attack in real time.")))),
    React.createElement(H2,{num:"§2"},t(lang,"Aniqlash usullari","Detection methods")),
    React.createElement(P,null,t(lang,
      "Ikki asosiy usul bor. Signature-based (imzoga asoslangan) — ma'lum hujumlarning \"barmoq izlari\" bilan solishtiradi (antivirus kabi). Anomaly-based (anomaliyaga asoslangan) — normal xatti-harakatni o'rganib, undan chetlanishni topadi (odatiy bo'lmagan narsani sezadi).",
      "There are two main methods. Signature-based compares against \"fingerprints\" of known attacks (like antivirus). Anomaly-based learns normal behavior and flags deviations from it (senses something unusual)."
    )),
    React.createElement(Terminal,null,
`# Snort — mashhur ochiq kodli IDS/IPS\n# Qoida misoli (soddalashtirilgan):\nalert tcp any any -> 10.0.0.0/24 22 (msg:"SSH urinishi";)\n\n# = "Har qanday manbadan 22-portga (SSH) urinish bo'lsa,\n#    ogohlantirish ber"`),
    React.createElement(Quiz,{
      q:{uz:"IDS va IPS o'rtasidagi asosiy farq nima?",en:"What is the key difference between an IDS and an IPS?"},
      opts:[{uz:"IDS tezroq",en:"IDS is faster"},{uz:"IPS hujumni bloklaydi, IDS faqat ogohlantiradi",en:"IPS blocks the attack, IDS only alerts"},{uz:"IDS faqat WiFi da ishlaydi",en:"IDS only works on WiFi"},{uz:"Hech qanday farq yo'q",en:"There is no difference"}],
      correct:1,
      exp:{uz:"IDS aniqlaydi va ogohlantiradi (signalizatsiya), IPS esa aniqlaydi va hujumni real vaqtda bloklaydi (qulflaydigan qorovul).",en:"An IDS detects and alerts (an alarm), while an IPS detects and blocks the attack in real time (a guard that locks the door)."}
    })
  );
}

// ── L17: DMZ ──────────────────────────────────────────────────
function LessonL17(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"DMZ nima?","What is a DMZ?")),
    React.createElement(P,null,t(lang,
      "DMZ (Demilitarized Zone) — ichki tarmoq va internet o'rtasidagi \"neytral zona\". Internetdan ko'rinishi kerak bo'lgan serverlar (veb-sayt, email) shu yerda joylashtiriladi. Agar hujumchi DMZ dagi serverni buzsa ham, u to'g'ridan-to'g'ri ichki maxfiy tarmoqqa kira olmaydi. Bu uy oldidagi mehmonlar zali kabi — mehmonlar u yerda, lekin yotoqxonangizga kira olmaydi.",
      "A DMZ (Demilitarized Zone) is a \"neutral zone\" between the internal network and the internet. Servers that must be reachable from the internet (website, email) are placed there. Even if an attacker breaks a server in the DMZ, they can't directly reach the sensitive internal network. It's like a reception hall in front of your house — guests are there, but they can't get into your bedroom."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"DMZ arxitekturasi","DMZ architecture")),
    React.createElement(Terminal,null,
`  INTERNET
     │
  [Firewall 1]  ← tashqi devor
     │
   ┌─ DMZ ──────────────┐
   │  Veb-server        │  ← internetdan ko'rinadi
   │  Email server      │
   └────────────────────┘
     │
  [Firewall 2]  ← ichki devor (qat'iyroq)
     │
   ICHKI TARMOQ (maxfiy ma'lumot)`),
    React.createElement(P,null,t(lang,
      "DMZ ikki devor (firewall) o'rtasida joylashadi. Tashqi devor internetdan DMZ ga cheklangan kirishga ruxsat beradi. Ichki devor esa DMZ dan ichki tarmoqqa deyarli hech narsa o'tkazmaydi. Shunday qilib, ochiq serverlar buzilса ham, asosiy tarmoq himoyalangan qoladi.",
      "The DMZ sits between two firewalls. The outer firewall allows limited access from the internet to the DMZ. The inner firewall passes almost nothing from the DMZ into the internal network. So even if the public servers are breached, the core network stays protected."
    )),
    React.createElement(Quiz,{
      q:{uz:"Veb-server odatda qayerga joylashtiriladi va nima uchun?",en:"Where is a web server usually placed, and why?"},
      opts:[{uz:"Ichki tarmoqda, xavfsizroq bo'lishi uchun",en:"In the internal network, to be safer"},{uz:"DMZ da — buzilса ham ichki tarmoq himoyalanadi",en:"In the DMZ — so even if breached, the internal network stays protected"},{uz:"Routerda",en:"On the router"},{uz:"Umuman tarmoqsiz",en:"With no network at all"}],
      correct:1,
      exp:{uz:"Internetdan ko'rinadigan serverlar DMZ ga qo'yiladi. Hujumchi uni buzsa ham, ikkinchi (ichki) firewall tufayli maxfiy tarmoqqa o'ta olmaydi.",en:"Internet-facing servers go in the DMZ. Even if an attacker breaches one, the second (inner) firewall stops them from reaching the sensitive network."}
    })
  );
}

// ── L18: 802.1X NAC ───────────────────────────────────────────
function LessonL18(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"802.1X va NAC nima?","What are 802.1X and NAC?")),
    React.createElement(P,null,t(lang,
      "802.1X — tarmoqqa kirishni nazorat qiluvchi standart. U qurilma tarmoq portiga ulanganda \"kim sen?\" deb so'raydi va faqat tasdiqlangan qurilmalarni kiritadi. NAC (Network Access Control) — shu g'oyaning kengroq nomi. Bu ofis eshigidagi qorovul kabi — bejizga kirmaysiz, avval propuskingizni ko'rsatasiz.",
      "802.1X is a standard that controls access to a network. When a device connects to a network port, it asks \"who are you?\" and lets in only verified devices. NAC (Network Access Control) is the broader name for this idea. It's like a guard at the office door — you don't just walk in, you show your badge first."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Uch ishtirokchi","Three players")),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [[t(lang,"Supplicant","Supplicant"),t(lang,"Ulanmoqchi bo'lgan qurilma (noutbuk, telefon)","The device wanting to connect (laptop, phone)")],
       [t(lang,"Authenticator","Authenticator"),t(lang,"Switch yoki access point — \"eshik\" vazifasini bajaradi","The switch or access point — acts as the \"door\"")],
       [t(lang,"Auth Server","Auth Server"),t(lang,"RADIUS server — haqiqiy tekshiruvni bajaradi","The RADIUS server — does the actual verification")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"flex-start"}},
          React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:120}},x[0]),
          React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},x[1])))),
    React.createElement(Terminal,null,
`Qurilma ──► Switch ──► RADIUS server
"Ulanaman"   "Kim u?"    "Login/parolni tekshir"
                         ✓ To'g'ri → port ochiladi
                         ✗ Xato   → port bloklanadi`),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,"RADIUS: "),
      t(lang,"RADIUS — markazlashtirilgan autentifikatsiya serveri. U foydalanuvchi ma'lumotlarini tekshiradi va tarmoqqa kirishga ruxsat beradi yoki rad etadi. Yirik tashkilotlarda keng qo'llanadi.",
        "RADIUS is a centralized authentication server. It checks user credentials and grants or denies network access. Widely used in large organizations.")),
    React.createElement(Quiz,{
      q:{uz:"802.1X da qurilmani haqiqiy tekshiruvdan o'tkazadigan qism qaysi?",en:"In 802.1X, which part performs the actual verification of a device?"},
      opts:[{uz:"Supplicant (qurilma)",en:"The supplicant (device)"},{uz:"Authenticator (switch)",en:"The authenticator (switch)"},{uz:"Auth server (RADIUS)",en:"The auth server (RADIUS)"},{uz:"DNS server",en:"The DNS server"}],
      correct:2,
      exp:{uz:"RADIUS auth server login/parolni tekshiradi. Switch (authenticator) faqat \"eshik\", qurilma esa supplicant.",en:"The RADIUS auth server checks the credentials. The switch (authenticator) is just the \"door\", and the device is the supplicant."}
    })
  );
}

// ── L19: Packet Filtering ─────────────────────────────────────
function LessonL19(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Paket filtrlash nima?","What is packet filtering?")),
    React.createElement(P,null,t(lang,
      "Paket filtrlash — har bir tarmoq paketini ko'rib, qoidalar asosida o'tkazish yoki bloklash. Firewall shu tamoyilda ishlaydi. Har bir paketning manba/manzil IP si, porti va protokoli tekshiriladi. Bu chegaradagi bojxona kabi — har bir yukni ko'rib, ruxsat berish yoki qaytarish.",
      "Packet filtering means inspecting each network packet and allowing or blocking it based on rules. A firewall works on this principle. Each packet's source/destination IP, port and protocol are checked. It's like customs at a border — inspecting each shipment and either allowing or turning it back."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Stateless va Stateful","Stateless vs stateful")),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"12px 0"}},
      React.createElement("div",{style:{padding:14,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
        React.createElement("div",{style:{fontWeight:700,fontSize:12.5,color:"var(--accent)",marginBottom:6}},t(lang,"Stateless (holatsiz)","Stateless")),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.6}},t(lang,"Har paketni alohida ko'radi, kontekstsiz. Tez, lekin sodda.","Judges each packet alone, no context. Fast but simple."))),
      React.createElement("div",{style:{padding:14,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
        React.createElement("div",{style:{fontWeight:700,fontSize:12.5,color:"var(--accent)",marginBottom:6}},t(lang,"Stateful (holatli)","Stateful")),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.6}},t(lang,"Ulanish holatini eslaydi — javob paketlarini taniydi. Aqlliroq.","Remembers connection state — recognizes reply packets. Smarter.")))),
    React.createElement(H2,{num:"§3"},t(lang,"iptables misoli","An iptables example")),
    React.createElement(Terminal,null,
`# 22-portga (SSH) faqat bitta IP dan ruxsat\nsudo iptables -A INPUT -p tcp -s 10.0.0.5 --dport 22 -j ACCEPT\n\n# Boshqa hamma SSH urinishini bloklash\nsudo iptables -A INPUT -p tcp --dport 22 -j DROP\n\n# Joriy qoidalarni ko'rish\nsudo iptables -L -n`),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Qoidalar tartibi muhim: ","Rule order matters: ")),
      t(lang,"Firewall qoidalarni yuqoridan pastga tekshiradi va birinchi mos kelganida to'xtaydi. Shuning uchun aniqroq ruxsat qoidalari umumiy bloklashdan oldin turishi kerak.",
        "A firewall checks rules top to bottom and stops at the first match. So specific allow rules must come before a general block.")),
    React.createElement(Quiz,{
      q:{uz:"Stateful firewall stateless dan qanday afzalligi bor?",en:"What advantage does a stateful firewall have over stateless?"},
      opts:[{uz:"U tezroq va soddaroq",en:"It is faster and simpler"},{uz:"U ulanish holatini eslaydi va javob paketlarini taniydi",en:"It remembers connection state and recognizes reply packets"},{uz:"U shifrlaydi",en:"It encrypts"},{uz:"U IP bermaydi",en:"It doesn't hand out IPs"}],
      correct:1,
      exp:{uz:"Stateful firewall ulanish kontekstini eslaydi, shuning uchun qonuniy javob paketlarini taniydi — bu uni stateless dan aqlliroq va xavfsizroq qiladi.",en:"A stateful firewall remembers connection context, so it recognizes legitimate reply packets — making it smarter and safer than stateless."}
    })
  );
}

// ── L20: Proxy Servers ────────────────────────────────────────
function LessonL20(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Proxy nima?","What is a proxy?")),
    React.createElement(P,null,t(lang,
      "Proxy server — siz va internet o'rtasidagi \"vositachi\". So'rovingiz avval proxy ga boradi, u esa sizning nomingizdan serverга murojaat qiladi va javobni sizga qaytaradi. Bu kimdandir sizning o'rningizga xarid qilishni so'raganingizga o'xshaydi — do'kon sizni emas, vositachini ko'radi.",
      "A proxy server is a \"middleman\" between you and the internet. Your request goes to the proxy first, which then contacts the server on your behalf and returns the reply to you. It's like asking someone to shop for you — the store sees the middleman, not you."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Proxy turlari","Types of proxy")),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [[t(lang,"Forward (oldinga)","Forward"),t(lang,"Foydalanuvchilar nomidan internetga chiqadi. Filtrlash, kesh, anonimlik.","Goes out to the internet for users. Filtering, caching, anonymity.")],
       [t(lang,"Reverse (teskari)","Reverse"),t(lang,"Serverlar oldida turadi. Yukni taqsimlash, himoya, kesh.","Sits in front of servers. Load balancing, protection, caching.")],
       [t(lang,"Transparent","Transparent"),t(lang,"Foydalanuvchi sezmaydi — tarmoq avtomatik yo'naltiradi.","The user doesn't notice — the network redirects automatically.")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"flex-start"}},
          React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:120}},x[0]),
          React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},x[1])))),
    React.createElement(H2,{num:"§3"},t(lang,"Proxy nima uchun ishlatiladi?","Why proxies are used")),
    React.createElement(Terminal,null,
`Forward proxy foydasi:
  • Kesh — tez-tez so'ralgan sahifani saqlab, tezlashtiradi
  • Filtrlash — ba'zi saytlarni bloklaydi (maktab/ofis)
  • Anonimlik — server sizning haqiqiy IP ingizni ko'rmaydi
  • Kuzatuv — trafik jurnalini yuritadi`),
    React.createElement(P,null,t(lang,
      "Reverse proxy esa serverlarni himoya qiladi: u haqiqiy serverlarni yashiradi, hujumlarni to'sadi va bir necha server o'rtasida yukni taqsimlaydi (load balancing). Nginx va Cloudflare bunga misol.",
      "A reverse proxy protects servers: it hides the real servers, absorbs attacks and distributes load across several servers (load balancing). Nginx and Cloudflare are examples."
    )),
    React.createElement(Quiz,{
      q:{uz:"Reverse proxy asosan kimni himoya qiladi?",en:"What does a reverse proxy mainly protect?"},
      opts:[{uz:"Foydalanuvchilarni",en:"The users"},{uz:"Orqadagi serverlarni (yashiradi, yukni taqsimlaydi)",en:"The backend servers (hides them, balances load)"},{uz:"DNS ni",en:"DNS"},{uz:"Hech kimni",en:"No one"}],
      correct:1,
      exp:{uz:"Reverse proxy serverlar oldida turadi — ularni yashiradi, hujumlarni to'sadi va yukni bir necha server o'rtasida taqsimlaydi.",en:"A reverse proxy sits in front of servers — hiding them, absorbing attacks and balancing load across several servers."}
    })
  );
}

// ── L21: Zero Trust ───────────────────────────────────────────
function LessonL21(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Zero Trust nima?","What is Zero Trust?")),
    React.createElement(P,null,t(lang,
      "Zero Trust — \"hech kimga ishonma, doim tekshir\" tamoyiliga asoslangan xavfsizlik yondashuvi. Eski model tarmoq ichidagini avtomatik ishonchli deb hisoblardi (qal'a devori kabi). Zero Trust esa har bir so'rovni — ichkaridan bo'lsa ham — tekshiradi. Chunki devor buzilsa, ichkaridagi hamma narsa ochiq qolardi.",
      "Zero Trust is a security approach based on \"never trust, always verify\". The old model automatically trusted anything inside the network (like a castle wall). Zero Trust verifies every request — even from inside. Because once the wall is breached, everything inside would be exposed."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy tamoyillar","Core principles")),
    React.createElement("div",{style:{margin:"8px 0 14px"}},
      [[t(lang,"Doim tekshir","Always verify"),t(lang,"Har bir kirish har safar tasdiqlanadi (kim, qanday qurilma, qayerdan)","Every access is confirmed each time (who, what device, from where)")],
       [t(lang,"Minimal huquq","Least privilege"),t(lang,"Har kim faqat kerakli narsaga kirish oladi, ortiq emas","Everyone gets access only to what they need, no more")],
       [t(lang,"Buzilishni faraz qil","Assume breach"),t(lang,"Hujumchi allaqachon ichkarida deb faraz qilib himoyalanadi","Defend as if an attacker is already inside")],
       [t(lang,"Mikrosegmentatsiya","Microsegmentation"),t(lang,"Tarmoq kichik zonalarga bo'linadi — bir zona buzilса, boshqasi himoyalanadi","The network is split into small zones — a breach in one is contained")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:6,padding:"9px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:9,alignItems:"flex-start"}},
          React.createElement("span",{style:{fontSize:12.5,fontWeight:700,color:"var(--accent)",minWidth:150}},x[0]),
          React.createElement("span",{style:{fontSize:12,color:"var(--text-1)"}},x[1])))),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Oddiy misol: ","Simple example: ")),
      t(lang,"Eski model: ofisga kirsangiz, hamma xonaga kira olasiz. Zero Trust: har bir xona eshigi alohida propuskingizni tekshiradi — bittasini olsangiz ham, qolganlari yopiq.",
        "Old model: once in the office, you can enter any room. Zero Trust: each room's door checks your badge separately — even if you get into one, the rest stay locked.")),
    React.createElement(Quiz,{
      q:{uz:"Zero Trust ning asosiy shiori qanday?",en:"What is the core motto of Zero Trust?"},
      opts:[{uz:"Ichkaridagi hammaga ishon",en:"Trust everyone inside"},{uz:"Hech kimga ishonma, doim tekshir",en:"Never trust, always verify"},{uz:"Faqat parolga ishon",en:"Trust only the password"},{uz:"Devor yetarli",en:"A wall is enough"}],
      correct:1,
      exp:{uz:"Zero Trust \"hech kimga ishonma, doim tekshir\" tamoyiliga asoslanadi — har bir so'rov, ichkaridan bo'lsa ham, tasdiqlanadi.",en:"Zero Trust is based on \"never trust, always verify\" — every request, even from inside, is confirmed."}
    })
  );
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
