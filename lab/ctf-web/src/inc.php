<?php
// Nimbus Reports — umumiy sarlavha/futer (haqiqiy SaaS ko'rinishi).
// DIQQAT: bu ataylab zaif o'quv ilovasi. Faqat izolyatsiya qilingan lab uchun.
function nb_head($title, $active = '') {
  $a = function ($k) use ($active) { return $k === $active ? ' class="on"' : ''; };
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
  echo '<meta name="viewport" content="width=device-width,initial-scale=1">';
  echo '<title>' . htmlspecialchars($title) . ' · Nimbus Reports</title>';
  echo '<link rel="stylesheet" href="/assets/style.css">';
  echo '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size%3D%2290%22%3E%E2%98%81%EF%B8%8F%3C/text%3E%3C/svg%3E">';
  echo '</head><body>';
  echo '<header class="nav"><div class="wrap">';
  echo '<a class="brand" href="/">☁️ Nimbus<span>Reports</span></a>';
  echo '<nav><a href="/"' . $a('home') . '>Overview</a>';
  echo '<a href="/about.php"' . $a('about') . '>Product</a>';
  echo '<a href="/blog.php"' . $a('blog') . '>Blog</a>';
  echo '<a href="/help.php"' . $a('help') . '>Help</a>';
  echo '<a href="/pricing.php"' . $a('pricing') . '>Pricing</a>';
  echo '<a href="/download.php"' . $a('reports') . '>My Reports</a>';
  echo '<a class="btn" href="/login.php">Sign in</a>';
  echo '</nav></div></header><main class="wrap">';
}
function nb_foot() {
  echo '</main><footer class="foot"><div class="wrap">';
  echo '<span>© 2024 Nimbus Reports, Inc. — cloud analytics &amp; reporting.</span>';
  echo '<span class="muted">status: operational · v3.4.1</span>';
  echo '</div></footer></body></html>';
}
