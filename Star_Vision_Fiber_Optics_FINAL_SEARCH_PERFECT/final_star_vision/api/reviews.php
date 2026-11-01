<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$store = __DIR__ . DIRECTORY_SEPARATOR . 'reviews.json';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function respond($status, $data) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_text($value, $max) {
    $value = trim((string)$value);
    $value = preg_replace('/\s+/u', ' ', $value);
    if (function_exists('mb_substr')) return mb_substr($value, 0, $max, 'UTF-8');
    return substr($value, 0, $max);
}

if (!file_exists($store)) {
    @file_put_contents($store, "[]\n", LOCK_EX);
}

if ($method === 'GET') {
    $raw = @file_get_contents($store);
    $reviews = json_decode($raw ?: '[]', true);
    if (!is_array($reviews)) $reviews = [];
    usort($reviews, function($a, $b) { return strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''); });
    respond(200, ['success' => true, 'reviews' => array_slice($reviews, 0, 100)]);
}

if ($method !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) $input = $_POST;

// Honeypot: normal visitors leave this blank; simple bots often fill it.
if (!empty($input['website'])) respond(400, ['success' => false, 'message' => 'Invalid submission.']);

$name = clean_text($input['name'] ?? '', 80);
$product = clean_text($input['product'] ?? '', 120);
$review = clean_text($input['review'] ?? '', 600);
$rating = (int)($input['rating'] ?? 0);

$allowed_products = [
    'Star Vision 300Mbps Wireless N Router',
    'Star Vision SV-1200-FTTH Dual Band Router',
    'Direct Internet Connection / FTTH Service',
    'Other Star Vision Product / Service'
];

if ($name === '' || (function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name)) < 2) respond(422, ['success' => false, 'message' => 'Please enter your name.']);
if (!in_array($product, $allowed_products, true)) respond(422, ['success' => false, 'message' => 'Please select a valid product or service.']);
if ($rating < 1 || $rating > 5) respond(422, ['success' => false, 'message' => 'Please select a rating from 1 to 5.']);
if ((function_exists('mb_strlen') ? mb_strlen($review, 'UTF-8') : strlen($review)) < 10) respond(422, ['success' => false, 'message' => 'Please write at least 10 characters in your review.']);

$raw = @file_get_contents($store);
$reviews = json_decode($raw ?: '[]', true);
if (!is_array($reviews)) $reviews = [];

// Keep the public file bounded so it stays fast on small shared hosting.
$reviews[] = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'product' => $product,
    'rating' => $rating,
    'review' => $review,
    'created_at' => gmdate('c')
];
$reviews = array_slice($reviews, -200);

$tmp = $store . '.tmp';
$encoded = json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (@file_put_contents($tmp, $encoded . "\n", LOCK_EX) === false || !@rename($tmp, $store)) {
    @unlink($tmp);
    respond(500, ['success' => false, 'message' => 'The review could not be saved. Please try again.']);
}

respond(201, ['success' => true, 'message' => 'Thank you! Your review is now live.']);
?>
