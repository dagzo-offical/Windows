<?php
// Nimbus Reports — Help Center search.
// (Intentionally vulnerable: the query is reflected UNescaped. A blocklist strips a
//  few well-known tags, but misses others — reflected XSS survives via those.)
require __DIR__ . '/inc.php';

$q = isset($_GET['q']) ? $_GET['q'] : '';
$reflect = $q;
if ($q !== '') {
    // input hygiene — remove a handful of dangerous tokens (incomplete on purpose)
    $strip = ['<script', '</script', 'onerror', 'javascript:', 'eval(', '<iframe', 'fromcharcode'];
    $reflect = str_ireplace($strip, '', $reflect);
}

$articles = [
    ['Getting started with Nimbus Reports', 'Basics', 'Create your first workspace, connect a data source and generate a report in under five minutes.'],
    ['Scheduling automated reports', 'Reports', 'Send daily, weekly or quarterly PDF/CSV bundles to your team automatically.'],
    ['Connecting Postgres & Snowflake', 'Integrations', 'Read-only credentials, SSH tunnels and IP allow-listing for your warehouse.'],
    ['Sharing dashboards with a public link', 'Dashboards', 'Publish a read-only link so stakeholders can explore the numbers.'],
    ['Managing users, roles & SSO', 'Security', 'Invite teammates, assign roles and enable SAML single sign-on.'],
    ['Exporting to CSV and Google Sheets', 'Reports', 'Push any report to a spreadsheet or download a raw CSV export.'],
    ['Billing, plans and invoices', 'Account', 'Change your plan, update payment details and download past invoices.'],
    ['Troubleshooting slow queries', 'Performance', 'Indexing tips and query caching to keep dashboards snappy.'],
];
nb_head('Help Center', '');
?>
<section class="hero"><div class="eyebrow">Support</div><h1>Help Center</h1>
<p>Guides, answers and best practices for getting the most out of Nimbus Reports.</p></section>

<div class="panel" style="max-width:640px">
  <form method="get">
    <div style="display:flex;gap:10px">
      <input type="text" name="q" value="<?= htmlspecialchars($q, ENT_QUOTES) ?>" placeholder="Search the knowledge base…" autofocus>
      <button class="btn" type="submit">Search</button>
    </div>
  </form>
</div>

<?php if ($q === ''): ?>
  <h2>Popular articles</h2>
  <div class="grid">
    <?php foreach (array_slice($articles, 0, 6) as $a): ?>
      <div class="card"><span class="pill"><?= htmlspecialchars($a[1]) ?></span>
        <h3 style="margin-top:8px;font-size:16px"><?= htmlspecialchars($a[0]) ?></h3>
        <p><?= htmlspecialchars($a[2]) ?></p></div>
    <?php endforeach; ?>
  </div>
<?php else: ?>
  <!-- query reflected below (unescaped) -->
  <h2>Results for “<?= $reflect ?>”</h2>
  <?php
    $hits = array_values(array_filter($articles, function ($a) use ($q) {
        return stripos($a[0] . ' ' . $a[2], trim($q)) !== false;
    }));
  ?>
  <?php if ($hits): ?>
    <div class="grid">
      <?php foreach ($hits as $a): ?>
        <div class="card"><span class="pill"><?= htmlspecialchars($a[1]) ?></span>
          <h3 style="margin-top:8px;font-size:16px"><?= htmlspecialchars($a[0]) ?></h3>
          <p><?= htmlspecialchars($a[2]) ?></p></div>
      <?php endforeach; ?>
    </div>
  <?php else: ?>
    <div class="panel"><p class="muted">No articles matched your search. Browse
      <a href="/help.php">all help topics</a> or <a href="/contact.php">contact support</a>.</p></div>
  <?php endif; ?>
<?php endif; ?>
<?php nb_foot(); ?>
