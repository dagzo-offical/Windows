<?php
session_start();
if (empty($_SESSION['user'])) { header('Location: index.php'); exit; }
$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
  // ZAIF: fayl turi/kengaytmasi TEKSHIRILMAYDI (unrestricted file upload -> RCE)
  $name = basename($_FILES['file']['name']);
  $dest = __DIR__ . '/uploads/' . $name;
  if (move_uploaded_file($_FILES['file']['tmp_name'], $dest)) {
    $msg = "Fayl yuklandi: uploads/" . htmlspecialchars($name);
  } else {
    $msg = "Yuklashda xatolik.";
  }
}
?><!doctype html>
<html><head><meta charset="utf-8"><title>ACME CMS — Dashboard</title>
<style>body{font-family:system-ui,sans-serif;background:#0b1120;color:#e5e7eb;margin:0;padding:30px}
.wrap{max-width:680px;margin:0 auto}h2{color:#60a5fa}.box{background:#111827;border:1px solid #1f2937;border-radius:12px;padding:20px;margin:16px 0}
input[type=file]{color:#e5e7eb}button{padding:9px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;cursor:pointer}
a{color:#60a5fa}.msg{color:#34d399}</style></head>
<body><div class="wrap">
<h2>Xush kelibsiz, <?php echo htmlspecialchars($_SESSION['user']); ?> (<?php echo htmlspecialchars($_SESSION['role']); ?>)</h2>
<div class="box">
  <h3>Media yuklash</h3>
  <p style="color:#6b7280;font-size:13px">Rasm yoki hujjat yuklang. (Fayl turi tekshirilmaydi.)</p>
  <form method="post" enctype="multipart/form-data">
    <input type="file" name="file"> <button type="submit">Yuklash</button>
  </form>
  <?php if($msg) echo '<p class="msg">'.$msg.'</p>'; ?>
  <p style="font-size:12px;color:#6b7280">Yuklangan fayllar: <a href="uploads/">/uploads/</a></p>
</div>
<p><a href="logout.php">Chiqish</a></p>
</div></body></html>
