<?php
// Returns the workspace flag to a request made from WITHIN the site (a fetch/XHR
// issued by page JavaScript — e.g. the reflected XSS on /search.php). A bare tool
// request (curl with no browser context) is denied.
// Robust across browsers/proxies: accepts EITHER Sec-Fetch-Site same-origin/same-site
// OR a same-host Referer (which every browser sends for an in-page fetch, and Burp
// forwards). This avoids the Firefox/proxy Sec-Fetch-Site fragility.
header('Content-Type: text/plain; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$sfs  = isset($_SERVER['HTTP_SEC_FETCH_SITE']) ? $_SERVER['HTTP_SEC_FETCH_SITE'] : '';
$ref  = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';

$fromSite = ($sfs === 'same-origin' || $sfs === 'same-site')
         || ($host !== '' && $ref !== '' && strpos($ref, '://' . $host) !== false);

if ($fromSite) {
    echo trim((string) @file_get_contents('/opt/ctf/xflag.txt'));
} else {
    http_response_code(403);
    echo "403 Forbidden";
}
