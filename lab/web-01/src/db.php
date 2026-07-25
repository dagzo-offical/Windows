<?php
// ACME CMS — ma'lumotlar bazasi qatlami (SQLite).
// DIQQAT: ataylab zaif o'quv ilovasi (SQL injection namoyishi).
// Parollar md5crypt ($1$) hash sifatida saqlanadi — SQLi bilan sizib chiqqach,
// ular john bilan BUZILISHI (crack) kerak, so'ng SSH uchun ishlatiladi.
function db() {
  $path = __DIR__ . '/data.db';
  $pdo = new PDO('sqlite:' . $path);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
  $pdo->exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price TEXT)");
  $cnt = $pdo->query("SELECT COUNT(*) c FROM users")->fetch(PDO::FETCH_ASSOC);
  if ((int)$cnt['c'] === 0) {
    // nowdoc — PHP $ ni talqin qilmaydi, hash butun qoladi.
    // sysadmin paroli rockyou'da bor (chuqurroqda) -> john+rockyou bilan buziladi.
    // admin/editor — chalg'ituvchi (rockyou bilan tez buzilmaydi).
    $pdo->exec(<<<'SQL'
INSERT INTO users (username,password,role) VALUES
 ('admin','$1$acme01$LKXfufFStU2JIHhZ8jBW2/','admin'),
 ('sysadmin','$1$acme02$eJjYQgCVKMy0cZ59zFG9E.','operator'),
 ('editor','$1$acme03$xE1wR2RXoF42CJ0i6pHPh/','editor')
SQL);
    $pdo->exec("INSERT INTO products (name,price) VALUES
      ('Acme Firewall','1200'),
      ('Acme VPN Gateway','800'),
      ('Acme IDS Sensor','450')");
  }
  return $pdo;
}
