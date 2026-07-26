<?php require __DIR__ . '/inc.php'; nb_head('Overview', 'home'); ?>
<section class="hero">
  <div class="eyebrow">Cloud analytics &amp; reporting</div>
  <h1>Every metric that matters,<br>in one clean dashboard.</h1>
  <p>Nimbus Reports turns your raw data into scheduled PDF/CSV reports, live dashboards
     and shareable links — trusted by 4,200+ teams.</p>
  <p style="margin-top:18px">
    <a class="btn" href="/download.php">Open my reports</a>
    &nbsp;<a class="btn ghost" href="/pricing.php">See pricing</a>
  </p>
</section>

<div class="kpi">
  <div class="box"><div class="n">4,213</div><div class="l">active workspaces</div></div>
  <div class="box"><div class="n">98.9%</div><div class="l">uptime (30d)</div></div>
  <div class="box"><div class="n">1.2M</div><div class="l">reports generated</div></div>
  <div class="box"><div class="n">42ms</div><div class="l">median query time</div></div>
</div>

<h2>What you get</h2>
<div class="grid">
  <div class="card"><h3>📊 Scheduled reports</h3><p>Daily, weekly and quarterly PDF/CSV exports delivered automatically to your inbox.</p></div>
  <div class="card"><h3>🔗 Shareable dashboards</h3><p>Publish a read-only link and let stakeholders explore the numbers themselves.</p></div>
  <div class="card"><h3>🔌 100+ integrations</h3><p>Connect Postgres, Stripe, GA4, Snowflake and more in a couple of clicks.</p></div>
  <div class="card"><h3>🛡️ SOC 2 &amp; SSO</h3><p>Enterprise-grade access control, audit logs and single sign-on.</p></div>
</div>

<h2>Trusted by data teams</h2>
<div class="panel">
  <p class="muted" style="font-size:16px">“Nimbus replaced three spreadsheets and a cron job. Our quarterly
  board deck now builds itself.”</p>
  <p class="mono" style="color:var(--brand)">— Dana R., Head of Analytics</p>
</div>
<?php nb_foot(); ?>
