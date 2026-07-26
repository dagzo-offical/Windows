<?php require __DIR__ . '/inc.php'; nb_head('Blog', 'blog'); ?>
<section class="hero"><div class="eyebrow">Blog</div><h1>News &amp; product updates</h1>
<p>What we're building, how teams use Nimbus, and lessons from the data trenches.</p></section>

<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-07-02 · Product</div>
  <h3 style="margin:.3em 0">Introducing scheduled quarterly board decks</h3>
  <p class="muted">You can now assemble a full board-ready deck from your saved reports and have it delivered
    the morning of your meeting. No more copy-pasting charts the night before.</p>
</article>

<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-06-18 · Engineering</div>
  <h3 style="margin:.3em 0">How we cut median query time to 42ms</h3>
  <p class="muted">A deep dive into our materialized-view cache, adaptive indexing and why we moved
    hot aggregates off the primary replica.</p>
</article>

<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-05-30 · Customers</div>
  <h3 style="margin:.3em 0">How Acme Analytics ships weekly investor updates</h3>
  <p class="muted">A look at the workflow one of our teams uses to turn raw Postgres tables into a
    polished investor email every Friday at 9am.</p>
</article>

<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-05-09 · Security</div>
  <h3 style="margin:.3em 0">Read-only by default: how we connect to your warehouse</h3>
  <p class="muted">Why every Nimbus connector uses least-privilege, read-only credentials — and how
    IP allow-listing and SSH tunnels keep your data yours.</p>
</article>

<p class="muted" style="font-size:13px">Want these in your inbox? <a href="/contact.php">Subscribe to the newsletter.</a></p>
<?php nb_foot(); ?>
