<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once('config/database.php');

// Read JSON input
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Validate input
if (!isset($data['name'], $data['email'], $data['area'], $data['timeslot']) ||
    empty(trim($data['name'])) ||
    empty(trim($data['email'])) ||
    empty(trim($data['area'])) ||
    empty(trim($data['timeslot']))
) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "All fields (name, email, area, timeslot) are required."
    ]);
    exit();
}

// Sanitize inputs
$name = $conn->real_escape_string(trim($data['name']));
$email = $conn->real_escape_string(trim($data['email']));
$area = $conn->real_escape_string(trim($data['area']));
$timeslot = $conn->real_escape_string(trim($data['timeslot']));

// Optional: prevent duplicate reservations
$checkSql = "SELECT id FROM reservations WHERE email='$email' AND area='$area' AND timeslot='$timeslot' LIMIT 1";
$result = $conn->query($checkSql);
if ($result && $result->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "You already have a reservation for this area and timeslot."
    ]);
    exit();
}

// Insert reservation into database
$insertSql = "INSERT INTO reservations (name, email, area, timeslot, created_at)
              VALUES ('$name', '$email', '$area', '$timeslot', NOW())";

if ($conn->query($insertSql) === TRUE) {
    echo json_encode([
        "status" => "success",
        "message" => "Reservation created successfully!"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to create reservation: " . $conn->error
    ]);
}

// Close the database connection
$conn->close();
?>
