<?php
// Same-origin-only endpoint. Returns the workspace flag ONLY to a same-origin
// fetch (browsers send Sec-Fetch-Site: same-origin). A direct request (curl,
// address-bar navigation) sends "none"/"cross-site"/nothing → denied.
// Intended path: reflected XSS on /search.php that does fetch('/flag.php').
header('Content-Type: text/plain; charset=utf-8');
header('X-Content-Type-Options: nosniff');
$sfs = isset($_SERVER['HTTP_SEC_FETCH_SITE']) ? $_SERVER['HTTP_SEC_FETCH_SITE'] : '';
if ($sfs === 'same-origin') {
    $flag = @file_get_contents('/opt/ctf/xflag.txt');
    echo $flag !== false ? trim($flag) : 'flag unavailable';
} else {
    http_response_code(403);
    echo "403 Forbidden";
}
