<?php
// ACME CMS konfiguratsiyasi
// DB: SQLite (data.db)
// TODO(devops): tizim hisobini secretsga ko'chirish!
$DB_DRIVER = 'sqlite';
$DB_PATH   = __DIR__ . '/data.db';
// Xizmat hisobi (SSH deploy uchun) — sysadmin
// Parol operatorlar bazasida ham saqlangan (users jadvali)
$SYS_USER  = 'sysadmin';
