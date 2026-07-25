<?php
require __DIR__ . '/db.php';
$q = $_GET['q'] ?? '';
$rows = [];
$sql = '';
if ($q !== '') {
  // ZAIF: UNION-based SQL injection nuqtasi (2 ustun: name, price)
  $sql = "SELECT name, price FROM products WHERE name LIKE '%$q%'";
  $stmt = db()->query($sql);
  if ($stmt) $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?><!doctype html>
<html><head><meta charset="utf-8"><title>ACME — Mahsulot qidiruvi</title>
<style>body{font-family:system-ui,sans-serif;background:#0b1120;color:#e5e7eb;margin:0;padding:30px}
.wrap{max-width:640px;margin:0 auto}input{padding:9px;border-radius:8px;border:1px solid #374151;background:#111827;color:#e5e7eb;width:70%}
button{padding:9px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;cursor:pointer}
table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #1f2937;padding:8px;text-align:left}
a{color:#60a5fa}code{color:#93c5fd}</style></head>
<body><div class="wrap">
<h2 style="color:#60a5fa">Mahsulot qidiruvi</h2>
<form method="get"><input name="q" value="<?php echo htmlspecialchars($q); ?>" placeholder="masalan: Acme"> <button>Qidirish</button></form>
<?php if($rows): ?>
<table><tr><th>Nomi</th><th>Narxi</th></tr>
<?php foreach($rows as $r){ echo '<tr><td>'.htmlspecialchars($r['name']).'</td><td>'.htmlspecialchars($r['price']).'</td></tr>'; } ?>
</table>
<?php elseif($q !== ''): ?><p>Hech narsa topilmadi.</p><?php endif; ?>
<p style="margin-top:20px"><a href="index.php">&larr; Login</a></p>
</div></body></html>
