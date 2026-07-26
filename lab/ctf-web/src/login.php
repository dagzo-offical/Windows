<?php
require __DIR__ . '/inc.php';
// Decoy login — NOT vulnerable (no SQL, constant-time-ish compare against nothing).
// Always fails; there is no auth bypass or injection here.
$err = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // credentials are not checked against any store — demo tenant is disabled.
  $err = true;
}
nb_head('Sign in', '');
?>
<section class="hero" style="text-align:center"><div class="eyebrow">Account</div><h1>Sign in to Nimbus</h1></section>
<div class="panel" style="max-width:420px;margin:0 auto">
  <?php if ($err): ?><div class="note">Invalid email or password. (Demo tenant sign-in is disabled.)</div><?php endif; ?>
  <form method="post">
    <label>Email</label><input type="email" name="email" placeholder="you@company.com" required>
    <label>Password</label><input type="password" name="password" placeholder="••••••••" required>
    <div style="margin-top:16px"><button class="btn blue" type="submit" style="width:100%">Sign in</button></div>
  </form>
  <p class="muted" style="text-align:center;margin-top:14px;font-size:13px">SSO users: use your company portal.</p>
</div>
<?php nb_foot(); ?>
