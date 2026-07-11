# Dasturchi qo‘llanmasi

## Tuzilma

```
src/tor_guard/
  cli.py            Typer CLI (yupqa taqdimot qatlami)
  context.py        dependency-injection konteyneri (build_context)
  orchestrator.py   start/stop/verify ketma-ketliklari (testlanadigan, fail-closed)
  config.py         tekshirilgan YAML -> muzlatilgan Config
  constants.py      yo'llar, jadval nomlari, standartlar, exit code'lar
  exceptions.py     istisno ierarxiyasi (barchasi -> bloklangan qoladi)
  logging_config.py strukturali loglar + sir/IP yashirish + audit log
  platform.py       OS/init/firewall qo'llab-quvvatlash tekshiruvlari
  privileges.py     root tekshiruvlari, uid aniqlash, ruxsat himoyalari
  services.py       systemctl wrapper
  state.py          saqlanadigan himoya holati + ruxsat etilgan o'tishlar
  subprocess_runner.py  yagona himoyalangan subprocess darvozasi
  firewall/  generator, validator, manager, integrity, models
  tor/       manager, controller (cookie auth), bootstrap, health
  network/   dns, routes (uch holatli verify), leak_tests, interfaces
  monitor/   daemon, checks, run (systemd kirish nuqtasi)
  install/   installer, backup, rollback, manifest
  diagnostics/ doctor, report
```

### Ma’lumotnoma tuzilmasidan chetlanishlar

- `services.py` — `tor.manager` va `install.installer` tomonidan ishlatiladigan
  umumiy systemd wrapper (systemd chaqiruvlarini bitta joyda saqlaydi).
- `context.py` + `orchestrator.py` — CLI yupqa qolishi va xavfsizlik uchun kritik
  start/stop mantig‘i in’ektsiya qilingan soxtalar bilan testlanishi uchun
  qo‘shilgan.

## Dependency injection

Tashqi dunyoga tegadigan har bir hamkor (subprocess, soketlar, HTTP, systemd)
in’ektsiya qilinadigan. `context.build_context(config)` ishlab chiqarish
implementatsiyalarini bog‘laydi; testlar root/Tor/tarmoqsiz fail-closed yo‘llarni
boshqarish uchun `AppContext` quradi (yoki soxtalarni to‘g‘ridan-to‘g‘ri uzatadi).
Qarang: `tests/unit/test_orchestrator.py` va `tests/conftest.py`ning `FakeRunner`i.

## Subprocess qoidalari (bitta joyda ta’minlanadi)

Barcha tashqi buyruqlar `subprocess_runner.SubprocessRunner` orqali o‘tadi:
`shell=True` yo‘q, faqat argv ro‘yxatlari, majburiy vaqt chegaralari, ushlangan
chiqish, tekshirilgan qaytish kodlari, yo‘q binar → `DependencyError`, yashirilgan
loglash. Boshqa hech qayerda `subprocess` chaqirmang.

## Firewall qoidasini qo‘shish

1. `firewall/generator.py`’ni o‘zgartiring (`RulesetParams`ning sof funksiyasi).
2. `tests/unit/test_generator.py`da birlik testini qo‘shing/moslang, jonli
   `nft -c` tasdig‘i bilan birga.
3. `make nft-check` va `make test`ni ishga tushiring.
4. Agar u `drop` bo‘lib qolishi kerak yangi jadval/zanjir kiritsa, uni
   `firewall/integrity.py`ning `_REQUIRED`iga va
   `manager.remove_tor_guard_tables`ga qo‘shing.

## Mahalliy sifat sikli

```bash
make format      # black + ruff --fix
make all         # ruff + mypy(strict) + bandit + shellcheck + unit testlar
make nft-check   # yaratilgan qoidalar to‘plamini tekshirish
```

Maqsadlar: ruff xatolari yo‘q, black-toza, mypy-strict toza, yuqori-jiddiylikdagi
Bandit yo‘q, shellcheck-toza, barcha unit testlar o‘tadi. Qabul qilingan lint
topilmalari `pyproject.toml`da hujjatlashtirilgan (`UP042`, `SIM105`,
`RUF001`/`RUF002`/`RUF003` — o‘zbek lotin yozuvi uchun, Bandit `B404`/`B603` va
izohli inline `# noqa`/`# nosec`).

## Kodlash qoidalari

- Hamma narsani tip bilan izohlang (mypy strict).
- Qiymat obyektlari uchun muzlatilgan dataclass’larni afzal ko‘ring.
- Xatolar "bloklangan qoladi" degani — hech qachon nosozlikda oddiy internetni
  ochadigan kod yo‘lini qo‘shmang.
- Haqiqiy ommaviy IP’ni hech qachon loglamang; sirlar paydo bo‘lishi mumkin
  bo‘lgan foydalanuvchiga ko‘rinadigan matnni redactor orqali o‘tkazing.

## Nashr qilish

1. `make all` yashil; `make nft-check` yashil.
2. Har bir qo‘llab-quvvatlanadigan distributivda VM matritsasini (`vm-tests/`)
   ishga tushiring; natijalarni arxivlang.
3. `docs/CHANGELOG.md`’ni yangilang.
4. Teg qo‘ying; CI statik + unit + integratsiya ishlarini bajaradi.
