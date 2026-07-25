<?php
session_start();
require __DIR__ . '/db.php';
$err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $u = $_POST['username'] ?? '';
  $p = $_POST['password'] ?? '';
  // ZAIF: username to'g'ridan-to'g'ri so'rovga qo'shiladi (SQLi). Parol md5crypt bilan tekshiriladi.
  $sql = "SELECT * FROM users WHERE username = '$u'";
  $row = db()->query($sql)->fetch(PDO::FETCH_ASSOC);
  if ($row && crypt($p, $row['password']) === $row['password']) {
    $_SESSION['user'] = $row['username'];
    $_SESSION['role'] = $row['role'] ?? 'user';
    header('Location: dashboard.php');
    exit;
  }
  $err = 'Login yoki parol noto\'g\'ri.';
}
?><!doctype html>
<html><head><meta charset="utf-8"><title>ACME CMS — Login</title>
<style>body{font-family:system-ui,sans-serif;background:#0b1120;color:#e5e7eb;display:grid;place-items:center;height:100vh;margin:0}
.card{background:#111827;border:1px solid #1f2937;border-radius:12px;padding:28px;width:320px}
h1{margin:0 0 4px;font-size:20px;color:#60a5fa}small{color:#6b7280}
input{width:100%;box-sizing:border-box;margin:8px 0;padding:10px;border-radius:8px;border:1px solid #374151;background:#0b1120;color:#e5e7eb}
button{width:100%;padding:10px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer}
.err{color:#f87171;font-size:13px}.foot{margin-top:12px;font-size:12px;color:#6b7280}</style></head>
<body><div class="card">
<h1>ACME CMS</h1><small>Internal Admin Portal</small>
<?php if($err) echo '<p class="err">'.htmlspecialchars($err).'</p>'; ?>
<form method="post">
  <input name="username" placeholder="Username" autocomplete="off">
  <input name="password" type="password" placeholder="Password" autocomplete="off">
  <button type="submit">Kirish</button>
</form>
<div class="foot">© 2024 Acme Corp · Internal Portal v2.4</div>
</div></body></html>
