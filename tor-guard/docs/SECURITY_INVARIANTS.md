# Tor Guard — Xavfsizlik Invariantlari

Bu invariantlar ishga tushirish, ish jarayoni, o‘chirish, nosozlik va tiklash
davomida DOIMO amal qilishi SHART. Har biri kodga va testga bog‘langan.

## Asosiy tamoyil

**FAIL CLOSED — HECH QACHON FAIL OPEN EMAS.** Har qanday noaniqlik, xatolik yoki
yetishmayotgan tekshiruv *bloklangan* holatga olib keladi, hech qachon oddiy
internetga emas.

## Invariantlar

| # | Invariant | Ta’minlovchi | Test |
|---|-----------|-------------|------|
| I1 | Faol paytda default-deny chiquvchi: aniq yo‘naltirilmagan/ruxsat etilmagan har qanday paket tashlanadi. | `firewall/generator.py` (output/forward’da `drop` siyosati) | `tests/unit/test_generator.py::test_default_drop_policy`, leak `test_direct_tcp` |
| I2 | Firewall Tor ishga tushishidan/qayta ishga tushishidan **oldin** qo‘llanadi (oddiy internet oynasi yo‘q). | `cli.py start` tartibi; `systemd` `Before=`/`After=` | `tests/unit/test_start_sequence.py` |
| I3 | Tor’ni to‘xtatish/ishdan chiqishi kill switch’ni olib tashlamaydi. | `ExecStop` flush yo‘q; `manager.stop()` hech qachon flush qilmaydi. | `tests/unit/test_manager_stop_keeps_lock.py` |
| I4 | Tor Guard’ni to‘xtatish oddiy internetni avtomatik tiklamaydi. | `cli.py stop` qoidalar to‘plamini qoldiradi; faqat `unlock-clearnet` tiklaydi. | `tests/unit/test_stop_keeps_firewall.py` |
| I5 | Faqat maxsus Tor uid to‘g‘ridan-to‘g‘ri chiqishi mumkin (PID bo‘yicha emas). | `meta skuid <tor-uid>` qoidasi | `tests/unit/test_generator.py::test_tor_uid_exception` |
| I6 | Barcha host DNS `DNSPort`ga yo‘naltiriladi yoki tashlanadi (UDP/TCP 53, tashqi resolverlar). | NAT redirect qoidalari + drop | `tests/unit/test_generator.py::test_dns_redirect`, leak `test_dns_*` |
| I7 | IPv6 firewall darajasida bloklanadi (faqat sysctl emas). | `table ip6` drop siyosati | `tests/unit/test_generator.py::test_ipv6_blocked`, leak `test_ipv6_tcp` |
| I8 | Umumiy chiquvchi UDP (QUIC/443-udp ham) tashlanadi; faqat zarur mahalliy UDP (DHCP/DNS-Tor’ga) ruxsat etiladi. | UDP drop qoidasi + aniq istisnolar | `tests/unit/test_generator.py::test_udp_blocked` |
| I9 | Qoidalar to‘plami bitta tekshirilgan fayldan atomik yuklanadi (`nft -f`), hech qachon o‘zgartiruvchi buyruqlar ketma-ketligidan emas. | `firewall/manager.py::apply` | `tests/unit/test_manager.py::test_atomic_apply` |
| I10 | Butunlik monitoringi Tor Guard jadvallari/zanjirlari/siyosatlarining olib tashlanishini/o‘zgartirilishini aniqlaydi va bloklovchi qoidalar to‘plamini tiklaydi. | `firewall/integrity.py`, `monitor/daemon.py` | `tests/unit/test_integrity.py` |
| I11 | Avtomatik tiklash Tor’ni qayta ishga tushirishi mumkin, lekin hech qachon to‘g‘ridan-to‘g‘ri internetni tiklamaydi. | `monitor/daemon.py` tiklash yo‘li | `tests/unit/test_daemon.py::test_recovery_never_unlocks` |
| I12 | Sozlama noto‘g‘ri → tarmoqda umuman o‘zgarish yo‘q. | `config.py` har qanday qo‘llashdan oldin tekshiradi; `cli.py` tartibi | `tests/unit/test_config.py`, `test_start_sequence.py` |
| I13 | `emergency-lock` Tor yo‘q/buzilgan bo‘lsa ham ishlaydi. | Statik ma’lum-yaxshi qoidalar to‘plami, Tor’ga bog‘liqlik yo‘q. | `tests/unit/test_generator.py::test_emergency_ruleset_no_tor` |
| I14 | Docker/Podman/libvirt/bridge/namespace/forward trafik chetlab o‘ta olmaydi. | `prerouting` + `forward` zanjirlarida drop siyosati + redirect | `tests/unit/test_generator.py::test_forward_blocked`, leak docker/netns |
| I15 | Tashqi-IP tekshiruvi muvaffaqiyatsizligi *tekshiruv mavjud emas* deb xabar qilinadi, hech qachon xavfsizlik yoki nosozlik dalili sifatida emas. | `network/routes.py`, `diagnostics/doctor.py` uch holatli natija | `tests/unit/test_leak_result.py` |
| I16 | Hamma yozishi mumkin bo‘lgan fayllar/papkalar/soketlar/loglar yo‘q; state/backup papkalari `0700`, config `0600`. | `privileges.py`, `install/installer.py` | `tests/unit/test_privileges.py` |

## Nosozlik-holat jadvali (rasmiy)

| Nosozlik | Talab qilinadigan xatti-harakat | Kod yo‘li |
|---------|-------------------|-----------|
| Tor o‘rnatilmagan | Bloklangan holatda qoladi | `tor/manager.ensure_installed` xato beradi; firewall qoladi |
| Tor ishga tushmaydi | Bloklangan holatda qoladi | `cli.start` firewall qo‘llangandan keyin bekor qiladi |
| Tor ulanish bosqichi < 100% | Bloklangan holatda qoladi | `tor/bootstrap.wait_for_bootstrap` vaqt tugashi → bekor qilish |
| Tor ishdan chiqadi | Bloklangan holatda qoladi/qaytadi | monitor aniqlaydi; Tor’ni qayta ishga tushiradi; firewall’ga tegilmaydi |
| DNSPort mavjud emas | Tegishli trafikni bloklaydi | firewall allaqachon to‘g‘ridan-to‘g‘ri 53’ni tashlaydi; cheklangan holat |
| TransPort mavjud emas | Tegishli trafikni bloklaydi | firewall to‘g‘ridan-to‘g‘ri TCP’ni tashlaydi; cheklangan holat |
| SOCKSPort mavjud emas | Cheklangan; to‘g‘ridan-to‘g‘ri qaytish yo‘q | `state=DEGRADED`, firewall butun |
| nftables qoidasi olib tashlangan | Bloklovchi qoidalarni tiklaydi / bloklangan qoladi | `integrity` + monitor qayta qo‘llash |
| IPv6 marshruti paydo bo‘ladi | IPv6 hali ham bloklangan | `ip6` jadval drop siyosati marshrutdan mustaqil |
| tashqi-IP tekshiruvi mavjud emas | *tekshiruv mavjud emas* deb xabar beriladi | uch holatli `VerifyResult.UNAVAILABLE` |
| sozlama noto‘g‘ri | Tarmoqni o‘zgartirmaydi | qo‘llashdan-oldin-tekshirish |
| o‘rnatuvchi uzildi | Oldingi holatga qaytaradi yoki ma’lum bloklangan holatda qoldiradi | `install/rollback.py` + emergency-lock |
| monitor ishdan chiqadi | Firewall faol qoladi | monitor hech qanday demontaj mas’uliyatini olmaydi |
| qayta yuklash (reboot) | Oddiy internetdan oldin himoyalangan/bloklangan holat tiklanadi | firewall birligi `Before=network-pre.target` |
| o‘chirish (uninstall) muvaffaqiyatsiz | Noma’lum qisman firewall holati yo‘q | uninstall xatoda emergency-lock qiladi |

## Aniq non-invariantlar (da’vo qilmang)

Tor Guard buzilgan host/yadro, mashinada root darajasidagi hujumchi, global
passiv raqiblar, ilova darajasidagi identifikatsiya oshkorligi, shaxsiy-hisob
korrelyatsiyasi, brauzer barmoq izlari, zararli hujjatlar, endpoint
telemetriyasi yoki xulq-atvor korrelyatsiyasiga qarshi anonimlikni
**kafolatlamaydi**. U *tasodifiy haqiqiy-IP/DNS oshkorligini* kamaytiradi.
Qarang: `docs/LIMITATIONS.md`.
