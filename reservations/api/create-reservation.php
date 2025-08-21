<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('../config/config.php');
require_once('../config/database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request_body = file_get_contents('php://input'); 
$data = json_decode($request_body, true);

// Validate input fields
if (empty($data['name']) || empty($data['email']) || empty($data['area']) || empty($data['timeslot'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Error: Missing or empty required parameter']);
    exit();
}

// Sanitize input
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$area = filter_var($data['area'], FILTER_SANITIZE_STRING);
$timeslot = filter_var($data['timeslot'], FILTER_SANITIZE_STRING);

// Insert reservation
$stmt = $conn->prepare('INSERT INTO reservations (name, email, area, timeslot) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $name, $email, $area, $timeslot);

if ($stmt->execute()) {
    $id = $stmt->insert_id;
    http_response_code(201);
    echo json_encode(['message' => 'Reservation created successfully', 'id' => $id]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error creating reservation: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
