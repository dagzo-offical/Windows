<?php
// Nimbus Reports — "URL preview" (import a report from a public link).
// Intentionally vulnerable to SSRF: the denylist only string-matches obvious
// loopback forms; a decimal IP (http://2130706433/) slips past and is then
// resolved server-side to 127.0.0.1.
require __DIR__ . '/inc.php';

$url = isset($_GET['url']) ? trim($_GET['url']) : '';
$out = null; $err = null;

if ($url !== '') {
    $lc = strtolower($url);
    $deny = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '::1', '127.1', '0177.', '@'];
    $hit = false;
    foreach ($deny as $d) { if (strpos($lc, $d) !== false) { $hit = true; break; } }
    if ($hit) {
        $err = "Blocked: internal/loopback hosts are not allowed.";
    } else {
        $p = parse_url($url);
        if (!$p || (($p['scheme'] ?? '') !== 'http')) {
            $err = "Only http:// URLs are supported.";
        } else {
            $host = $p['host'] ?? '';
            if (ctype_digit($host)) { $host = long2ip((int) $host); }  // decimal IP -> dotted (the bypass lands here)
            $port = $p['port'] ?? 80;
            $path = ($p['path'] ?? '/') . (isset($p['query']) ? '?' . $p['query'] : '');
            $target = "http://{$host}:{$port}{$path}";
            $ctx = stream_context_create(['http' => ['timeout' => 4, 'method' => 'GET',
                'header' => "User-Agent: NimbusPreview/1.0\r\n", 'ignore_errors' => true]]);
            $body = @file_get_contents($target, false, $ctx);
            $out = ($body === false) ? "(could not fetch $target)" : $body;
        }
    }
}
nb_head('URL preview', '');
?>
<section class="hero"><div class="eyebrow">Import</div><h1>Preview a report URL</h1>
<p>Paste a public link to a CSV/JSON report and we'll fetch a preview server-side.</p></section>
<div class="panel" style="max-width:660px">
  <form method="get">
    <label>Report URL</label>
    <div style="display:flex;gap:10px">
      <input type="text" name="url" value="<?= htmlspecialchars($url, ENT_QUOTES) ?>" placeholder="http://example.com/data.csv">
      <button class="btn" type="submit">Fetch</button>
    </div>
  </form>
</div>
<?php if ($err !== null): ?>
  <div class="note" style="max-width:660px">⛔ <?= htmlspecialchars($err) ?></div>
<?php elseif ($out !== null): ?>
  <h2>Preview</h2>
  <div class="panel"><pre class="mono" style="white-space:pre-wrap;margin:0;color:#cfe0ff"><?= htmlspecialchars($out) ?></pre></div>
<?php endif; ?>
<?php nb_foot(); ?>
