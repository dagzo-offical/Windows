<?php
// Nimbus Reports — "My Reports": a report page + a download button.
// Reports live OUTSIDE the webroot (/opt/ctf/reports) and are served only through
// this endpoint by numeric id (in the POST body). The UI hands out ids sequentially
// (1,2,3,…); the content is identical. Intentionally vulnerable: the id is trusted —
// no ownership/range check, so id=0 (the internal archive) is reachable too.
require __DIR__ . '/inc.php';
$REPORT_DIR = '/opt/ctf/reports';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['report_id'])) {
    $id = (int) $_POST['report_id'];            // (int) blocks traversal, but NOT id=0
    $file = $REPORT_DIR . '/' . $id . '.txt';
    if (is_file($file)) {
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: attachment; filename="report-' . $id . '.txt"');
        readfile($file);
        exit;
    }
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Report #$id not found.";
    exit;
}

nb_head('My Reports', 'reports');
?>
<section class="hero"><div class="eyebrow">Workspace · acme-analytics</div>
<h1>Monthly report</h1>
<p>Your latest generated report. Download the full copy below — reports are numbered
   sequentially as they're issued.</p></section>

<div class="panel">
  <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;align-items:baseline">
    <h2 style="margin:0">Nimbus Reports — Monthly Summary</h2>
    <span class="muted mono" style="font-size:13px">acme-analytics · 2024 · delivered</span>
  </div>
  <p class="muted">Auto-generated performance summary for your workspace, reconciled against the
    production replica.</p>

  <table>
    <tr><th>Metric</th><th>This period</th><th>Prev.</th><th>Δ</th></tr>
    <tr><td>Active users</td><td class="mono">4,213</td><td class="mono muted">3,902</td><td style="color:var(--brand)">+8.0%</td></tr>
    <tr><td>Revenue</td><td class="mono">$128,400</td><td class="mono muted">$119,750</td><td style="color:var(--brand)">+7.2%</td></tr>
    <tr><td>Reports generated</td><td class="mono">1,204</td><td class="mono muted">1,088</td><td style="color:var(--brand)">+10.7%</td></tr>
    <tr><td>Median query time</td><td class="mono">42 ms</td><td class="mono muted">51 ms</td><td style="color:var(--brand)">−17.6%</td></tr>
    <tr><td>Uptime (30d)</td><td class="mono">98.9%</td><td class="mono muted">98.6%</td><td style="color:var(--brand)">+0.3%</td></tr>
  </table>

  <p class="muted" style="font-size:13.5px;margin-top:16px">Figures are indicative and identical across
    the monthly export bundle. Full breakdown is in the downloadable copy.</p>

  <form method="post" onsubmit="setTimeout(nextRep, 250)" style="margin-top:8px">
    <input type="hidden" name="report_id" id="rid" value="1">
    <button class="btn" type="submit">⬇ Download report #<span id="rnum">1</span></button>
    <span class="muted" style="font-size:13px;margin-left:8px">har yuklashda raqam ketma-ket oshadi</span>
  </form>
</div>

<script>
function nextRep(){
  var e = document.getElementById('rid');
  var n = parseInt(e.value || '1', 10) + 1;
  if (n > 12) n = 1;                    // issued reports 1..12
  e.value = n;
  document.getElementById('rnum').textContent = n;
}
</script>
<?php nb_foot(); ?>
