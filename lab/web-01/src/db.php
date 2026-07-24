<?php
// ACME CMS — ma'lumotlar bazasi qatlami (SQLite).
// DIQQAT: bu ataylab zaif qilingan o'quv ilovasi. So'rovlar prepared statement
// ISHLATMAYDI — SQL injection namoyishi uchun.
function db() {
  $path = __DIR__ . '/data.db';
  $pdo = new PDO('sqlite:' . $path);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
  // idempotent seed
  $pdo->exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
  $pdo->exec("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price TEXT)");
  $cnt = $pdo->query("SELECT COUNT(*) c FROM users")->fetch(PDO::FETCH_ASSOC);
  if ((int)$cnt['c'] === 0) {
    $pdo->exec("INSERT INTO users (username,password,role) VALUES
      ('admin','S3cr3t2025!','admin'),
      ('sysadmin','Ac3m3S3rv3r!','operator'),
      ('editor','Summer2025!','editor')");
    $pdo->exec("INSERT INTO products (name,price) VALUES
      ('Acme Firewall','1200'),
      ('Acme VPN Gateway','800'),
      ('Acme IDS Sensor','450')");
  }
  return $pdo;
}
