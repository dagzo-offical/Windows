<?php
require __DIR__ . '/inc.php';
$sent = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) { $sent = true; }
nb_head('Contact', 'contact');
?>
<section class="hero"><div class="eyebrow">Contact</div><h1>Talk to the team.</h1>
<p>Questions about a plan, a demo, or a security review? Send a note and we'll reply within one business day.</p></section>
<div class="panel" style="max-width:560px">
  <?php if ($sent): ?>
    <div class="note" style="border-color:var(--brand);background:#0a2a20;color:#9ff0d3">Thanks — your message has been queued. We'll be in touch.</div>
  <?php else: ?>
  <form method="post">
    <label>Work email</label><input type="email" name="email" placeholder="you@company.com" required>
    <label>How can we help?</label><input type="text" name="msg" placeholder="I'd like a demo of scheduled reports">
    <div style="margin-top:16px"><button class="btn" type="submit">Send message</button></div>
  </form>
  <?php endif; ?>
</div>
<p class="muted">Or email <span class="mono">hello@nimbus-reports.example</span> · SOC/security: <span class="mono">security@nimbus-reports.example</span></p>
<?php nb_foot(); ?>
