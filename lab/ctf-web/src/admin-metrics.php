<?php
// Internal metrics endpoint — intended to be reachable only from localhost
// (e.g. the ops sidecar). Returns the workspace flag to loopback callers only.
// Reachable externally via SSRF on /fetch.php (decimal-IP bypass).
header('Content-Type: text/plain; charset=utf-8');
$ra = $_SERVER['REMOTE_ADDR'] ?? '';
if ($ra === '127.0.0.1' || $ra === '::1') {
    $flag = trim((string) @file_get_contents('/opt/ctf/ssrf.txt'));
    echo "nimbus-internal metrics v1\n";
    echo "cpu=12% mem=41% queue_depth=3 workers=8 build=3.4.1\n";
    echo "db_replica_lag_ms=7\n";
    echo "workspace_flag=" . ($flag !== '' ? $flag : 'unavailable') . "\n";
} else {
    http_response_code(403);
    echo "403 Forbidden — internal metrics endpoint is restricted to localhost.\n";
    echo "your_ip=" . $ra . "\n";
}
