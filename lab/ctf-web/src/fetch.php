<?php
// Nimbus Reports — "Import dashboard from a public URL".
// (Intentionally vulnerable to SSRF: the denylist only string-matches obvious loopback
//  forms; a decimal IP slips past and is resolved server-side to 127.0.0.1.)
require __DIR__ . '/inc.php';

$url = isset($_GET['url']) ? trim($_GET['url']) : '';
$out = null; $err = null;

if ($url !== '') {
    $lc = strtolower($url);
    $deny = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '::1', '127.1', '0177.', '@'];
    $hit = false;
    foreach ($deny as $d) { if (strpos($lc, $d) !== false) { $hit = true; break; } }
    if ($hit) {
        $err = "We couldn't reach that link. Please check the URL and try again.";
    } else {
        $p = parse_url($url);
        if (!$p || (($p['scheme'] ?? '') !== 'http')) {
            $err = "Only public http:// links can be imported right now.";
        } else {
            $host = $p['host'] ?? '';
            if (ctype_digit($host)) { $host = long2ip((int) $host); }   // decimal IP normalised here
            $port = $p['port'] ?? 80;
            $path = ($p['path'] ?? '/') . (isset($p['query']) ? '?' . $p['query'] : '');
            $target = "http://{$host}:{$port}{$path}";
            $ctx = stream_context_create(['http' => ['timeout' => 4, 'method' => 'GET',
                'header' => "User-Agent: NimbusImport/1.0\r\n", 'ignore_errors' => true]]);
            $body = @file_get_contents($target, false, $ctx);
            $out = ($body === false) ? null : $body;
            if ($out === null) $err = "We couldn't reach that link. Please check the URL and try again.";
        }
    }
}
nb_head('Import', '');
?>
<section class="hero"><div class="eyebrow">Dashboards</div><h1>Import a dashboard</h1>
<p>Bring an existing report into your workspace from a public link — CSV, JSON or a shared Nimbus URL.</p></section>

<div class="panel" style="max-width:660px">
  <form method="get">
    <label>Dashboard URL</label>
    <div style="display:flex;gap:10px">
      <input type="text" name="url" value="<?= htmlspecialchars($url, ENT_QUOTES) ?>" placeholder="https://sheets.example.com/export/q3.csv">
      <button class="btn" type="submit">Import</button>
    </div>
  </form>
  <p class="muted" style="font-size:13px;margin-top:12px">Supported: Google Sheets export links, public CSV/JSON, and shared Nimbus dashboards.</p>
</div>

<?php if ($err !== null): ?>
  <div class="note" style="max-width:660px"><?= htmlspecialchars($err) ?></div>
<?php elseif ($out !== null): ?>
  <h2>Import preview</h2>
  <div class="panel"><pre class="mono" style="white-space:pre-wrap;margin:0;color:#cfe0ff"><?= htmlspecialchars($out) ?></pre></div>
  <p class="muted" style="font-size:13px">Looks right? Confirm to add this dashboard to <b>acme-analytics</b>.</p>
<?php else: ?>
  <h2>Recent imports</h2>
  <div class="panel">
    <table>
      <tr><th>Source</th><th>Imported</th><th>Rows</th></tr>
      <tr><td class="mono">sheets · q2-revenue.csv</td><td class="muted">2024-06-30</td><td class="muted">1,204</td></tr>
      <tr><td class="mono">nimbus · marketing-funnel</td><td class="muted">2024-06-14</td><td class="muted">862</td></tr>
      <tr><td class="mono">json · api-usage.json</td><td class="muted">2024-05-28</td><td class="muted">3,391</td></tr>
    </table>
  </div>
<?php endif; ?>
<?php nb_foot(); ?>
