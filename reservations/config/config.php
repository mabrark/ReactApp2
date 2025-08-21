<?php
// config/cors.php

// Define configuration options
$allowedOrigins = ['http://localhost:3000']; // React dev server
$allowedHeaders = ['Content-Type'];
$allowedMethods = ['GET', 'POST', 'OPTIONS'];

// Get the request origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Allow only defined origins
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

// Always allow credentials if needed
header('Access-Control-Allow-Credentials: true');

// Handle preflight request
