<?php
// config/database.php

// Database configuration
$dbHost     = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName     = "simple_blog_db";  // Change this to your actual DB name

// Create database connection
$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status"  => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}

// Optional: set charset to UTF-8 for better handling of special characters
$conn->set_charset("utf8");
?>
