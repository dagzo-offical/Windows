# eJPT Amaliy Lab — Docker Poligoni

Bu — **haqiqiy zaif mashinalar** to'plami. Ularni `nmap`, `hydra`, `smbclient`, web-exploit va boshqa vositalar bilan **haqiqatan buzib**, imtiyozni oshirib (privilege escalation), **flag**larni topasiz — xuddi eJPT imtihonidagidek. Hammasi **Docker** ichida, **izolyatsiya qilingan tarmoqda** ishlaydi — asosiy hostingizga zarar yetmaydi.

> ⚠️ **Nima uchun statik saytda emas?** GitHub Pages faqat statik HTML beradi — brauzer ichida haqiqiy SSH/SMB/RCE mashina ishlata olmaydi. Shuning uchun mashinalar **Docker** orqali sizning kompyuteringizda (yoki umumiy serverda) ishlaydi. Portal (veb-sayt) esa maqsadlar va **flag topshirish**ni boshqaradi.

## Talablar

- **Docker** va **Docker Compose** (Docker Desktop yoki Linux'da `docker` + `docker compose`).
- ~2–3 GB disk, ~2 GB RAM.

## Ishga tushirish

```bash
cd lab
docker compose up -d --build        # mashinalarni quradi va ishga tushiradi
docker compose ps                    # holatini ko'rish
```

Hujum qutisiga (o'z-o'zicha yetarli, Kali shart emas) kiring:

```bash
docker exec -it ejpt-attacker bash
# ichkarida:
cat /root/README.txt
nmap -sn 10.10.20.0/24
```

To'xtatish / tozalash:

```bash
docker compose down          # to'xtatadi
docker compose down --rmi local -v   # to'liq tozalaydi
```

### Boshqa foydalanuvchilar uchun (tarmoqda)

Poligonni umumiy serverda (VPS/ichki server) ishga tushiring — bir nechta o'quvchi o'z Kali'sidan hujum qilishi mumkin. Har birining flag progressi portalda o'z brauzerida saqlanadi. (Xohlasangiz, mashinalarning portlarini hostga `ports:` bilan ochib, tashqaridan ulanish mumkin — sukut bo'yicha faqat ichki lab tarmog'ida.)

## Mashinalar (tarmoq xaritasi)

Har mashina turli **zaiflik** va turli **qiyinlik** — lekin oqim bir xil:
**web zaifligi → SSH cred/hash → SSH → oddiy user → root.**

| Mashina | Daraja | IP | Xizmatlar | Kill-chain | Flaglar |
|---|---|---|---|---|---|
| **web-easy** (`shopzone`) | 🟢 EASY | 10.10.20.40 | HTTP(80), SSH(22) | ochiq `config.old` (info disclosure) → SSH `deploy` → `sudo bash` → **root** | user + root |
| **linux-02** (`backend`) | 🟢 easy | 10.10.20.20 | FTP(21), SSH(22) | anon FTP hint + zaif SSH → `bob` → SUID `find` → **root** | user + root |
| **web-01** (`acme.lab`) | 🟡 MEDIUM | 10.10.20.10 | HTTP(80), SSH(22) | web SQLi → parol **hash** sizadi → **crack (john)** → SSH → sudo → **root** | user + root |
| **smb-03** (`fileserver`) | 🟡 medium | 10.10.20.30 | SMB(445), SSH(22) | null-session SMB → cred → `carol` → yoziladigan root skript → **root** | user + root |
| **web-hard** (`monitorpanel`) | 🔴 HARD | 10.10.20.50 | HTTP(80), SSH(22) | **LFI** → SSH cred sizadi → SSH `webadmin` → `perl` **cap_setuid** → **root** | user + root |
| **internal-04** (`vault`) | 🔴 hard | 10.10.10.20 | HTTP(8080) | **FAQAT web-01 orqali pivot** → command injection → **final** | final |

`internal-04` alohida **ichki tarmoqda** (`internalnet`, 10.10.10.0/24) — hujumchi unga **to'g'ridan-to'g'ri yeta olmaydi**. Uni buzish uchun avval **web-01**ni egallab, o'sha host orqali **pivot** qilishingiz kerak (eJPT'ning eng muhim ko'nikmasi).

## Maqsadlar (objectives)

1. **Host discovery** — 10.10.20.0/24 da tirik mashinalarni toping.
2. **Enumeration** — har mashinada xizmat va versiyalarni aniqlang.
3. **web-01** — veb zaifligidan foydalanib shell oling, `www-data` → root, 2 flag.
4. **linux-02** — FTP/SSH orqali foothold, SUID bilan root, 2 flag.
5. **smb-03** — SMB enumeration → cred → root, 2 flag.
6. **PIVOT** — web-01 orqali `internal-04`ga o'ting, command injection bilan **final flag**.

Jami **11 ta flag**. Ularni portalning **«Amaliy Lab»** sahifasida topshiring.

## Xavfsizlik va etika

- Bu mashinalar **ataylab zaif** qilingan — faqat **shu izolyatsiya qilingan lab** uchun. Ularni internetga ochmang.
- Tarmoq `bridge` — host tarmog'i ishlatilmaydi; konteynerlar hostga tegmaydi.
- O'rgangan usullaringizni **faqat ruxsat berilgan** tizimlarda qo'llang.

## Yechimlar

To'liq qadam-baqadam yechim: [`WALKTHROUGH.md`](WALKTHROUGH.md) (spoyler!). Avval o'zingiz urinib ko'ring.
