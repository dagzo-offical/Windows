<?php require __DIR__ . '/inc.php'; nb_head('Help Center', 'help'); ?>
<section class="hero"><div class="eyebrow">Support</div><h1>Help Center</h1>
<p>Browse guides by topic, or <a href="/search.php">search the knowledge base</a>.</p></section>

<h2>Getting started</h2>
<div class="grid">
  <div class="card"><h3 style="font-size:16px">Create your first workspace</h3><p>Sign up, name your workspace and invite your team. Each workspace keeps its data, reports and members separate.</p></div>
  <div class="card"><h3 style="font-size:16px">Connect a data source</h3><p>Add Postgres, MySQL, Snowflake, BigQuery or a CSV. We only ever request read-only access.</p></div>
  <div class="card"><h3 style="font-size:16px">Build your first report</h3><p>Pick a template, drag in metrics, and preview. Save it to reuse or schedule.</p></div>
</div>

<h2>Reports &amp; scheduling</h2>
<div class="grid">
  <div class="card"><h3 style="font-size:16px">Scheduling automated reports</h3><p>Choose a cadence (daily/weekly/quarterly) and recipients. Delivery as PDF or CSV.</p></div>
  <div class="card"><h3 style="font-size:16px">Exporting to CSV &amp; Sheets</h3><p>Download a raw CSV, or push a live export to Google Sheets.</p></div>
  <div class="card"><h3 style="font-size:16px">Report retention</h3><p>Generated reports are retained per your plan's data-retention policy; older ones are archived automatically.</p></div>
</div>

<h2>Security &amp; account</h2>
<div class="grid">
  <div class="card"><h3 style="font-size:16px">Roles &amp; SSO</h3><p>Assign admin/editor/viewer roles and enable SAML single sign-on on Team and Enterprise plans.</p></div>
  <div class="card"><h3 style="font-size:16px">Audit logs</h3><p>Every export, share and permission change is logged for 90 days.</p></div>
  <div class="card"><h3 style="font-size:16px">Billing &amp; invoices</h3><p>Manage your plan and download past invoices from <a href="/login.php">your account</a>.</p></div>
</div>

<div class="panel" style="margin-top:24px"><p class="muted">Can't find an answer? <a href="/contact.php">Contact support</a> — we reply within one business day.</p></div>
<?php nb_foot(); ?>
