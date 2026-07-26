<?php
// Nimbus Reports — "My Reports" download.
// Reports live OUTSIDE the webroot (/opt/ctf/reports) and are served only through
// this endpoint by numeric id. The UI lists reports #1..#12; the id travels in the
// POST body. (Intentionally vulnerable: the id is trusted — no ownership/range check.)
require __DIR__ . '/inc.php';
$REPORT_DIR = '/opt/ctf/reports';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['report_id'])) {
    $id = (int) $_POST['report_id'];            // (int) blocks path traversal, but NOT id=0
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
$months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
?>
<section class="hero"><div class="eyebrow">Workspace · acme-analytics</div>
<h1>My Reports</h1><p>Your generated monthly reports for 2024. Click to download the PDF/CSV bundle.</p></section>
<div class="panel">
  <table>
    <tr><th>#</th><th>Report</th><th>Period</th><th>Size</th><th></th></tr>
    <?php for ($i = 1; $i <= 12; $i++): ?>
    <tr>
      <td class="mono muted"><?= $i ?></td>
      <td>Monthly summary — <?= $months[$i-1] ?> 2024</td>
      <td class="muted"><?= $months[$i-1] ?> 1–<?= [31,29,31,30,31,30,31,31,30,31,30,31][$i-1] ?></td>
      <td class="muted mono"><?= 40 + $i ?> KB</td>
      <td>
        <form method="post" style="margin:0">
          <input type="hidden" name="report_id" value="<?= $i ?>">
          <button class="btn ghost" type="submit" style="padding:6px 12px;font-size:13px">Download</button>
        </form>
      </td>
    </tr>
    <?php endfor; ?>
  </table>
</div>
<p class="muted" style="font-size:13px">Reports are private to your workspace.
  Need to bring in an external report? <a href="/fetch.php">Import a dashboard from a URL</a>.</p>
<?php nb_foot(); ?>
