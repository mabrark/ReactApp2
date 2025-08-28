<?php
// CORS configuration
$allowedOrigins = ['http://localhost:3000']; // Add other allowed origins as needed
$allowedHeaders = ['Content-Type'];
$allowedMethods = ['GET', 'POST', 'OPTIONS'];

// Get the origin of the request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Allow the request origin if it's in the allowed list
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true'); // allow cookies if needed
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header('Access-Control-Allow-Methods: ' . implode(', ', $allowedMethods));
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        $requestHeaders = array_map('trim', explode(',', $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']));
        if (count(array_intersect($requestHeaders, $allowedHeaders)) === count($requestHeaders)) {
            header('Access-Control-Allow-Headers: ' . implode(', ', $allowedHeaders));
        }
    }
    exit(0); // terminate OPTIONS requests early
}

// Optional: default content type
header('Content-Type: application/json; charset=UTF-8');
?>
