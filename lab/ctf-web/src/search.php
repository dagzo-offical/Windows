<?php
// Nimbus Reports — dataset search (legacy endpoint).
// Intentionally vulnerable: the query is reflected UNescaped (reflected XSS).
// A naive "WAF" blocks the obvious vectors — but not all of them.
require __DIR__ . '/inc.php';

$q = isset($_GET['q']) ? $_GET['q'] : '';
$blocked = false;
if ($q !== '') {
    // crude denylist WAF — blocks the usual suspects
    $bad = ['<script', '</script', 'onerror', 'javascript:', 'eval(', 'document.cookie', 'fromcharcode', '<iframe'];
    $lc = strtolower($q);
    foreach ($bad as $sig) {
        if (strpos($lc, $sig) !== false) { $blocked = true; break; }
    }
}
nb_head('Search', '');
?>
<section class="hero"><div class="eyebrow">Datasets</div><h1>Search reports &amp; datasets</h1>
<p>Find any saved report, dataset or dashboard across your workspace.</p></section>
<div class="panel" style="max-width:620px">
  <form method="get">
    <label>Query</label>
    <div style="display:flex;gap:10px">
      <input type="text" name="q" value="<?= htmlspecialchars($q, ENT_QUOTES) ?>" placeholder="e.g. revenue Q3" autofocus>
      <button class="btn" type="submit">Search</button>
    </div>
  </form>
</div>
<?php if ($q !== ''): ?>
  <?php if ($blocked): ?>
    <div class="note" style="max-width:620px">⛔ Your request was blocked by the Nimbus WAF (rule: reflected-script). Please rephrase your query.</div>
  <?php else: ?>
    <!-- reflected UNescaped on purpose -->
    <h2>Results for: <?= $q ?></h2>
    <div class="panel"><p class="muted">No datasets matched your query. Try a broader term.</p></div>
  <?php endif; ?>
<?php endif; ?>
<?php nb_foot(); ?>
