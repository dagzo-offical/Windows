<?php
// ZAIF: foydalanuvchi 'page' ni tekshirmasdan o'qiydi -> path traversal / LFI
$page = $_GET['page'] ?? 'welcome.txt';
$path = __DIR__ . '/docs/' . $page;
header('Content-Type: text/plain; charset=utf-8');
$data = @file_get_contents($path);
echo $data === false ? "Fayl topilmadi: $page" : $data;
