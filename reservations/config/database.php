<?php

$dbHost     = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName     = "simple_blog_db";

$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

if ($conn->connect_error) {
    
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        "status"  => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit();
}

$conn->set_charset("utf8");

function getConnection() {
    global $conn;
    return $conn;
}
?>
