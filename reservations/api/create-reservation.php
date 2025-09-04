<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once('config/database.php');

// If request is multipart (file + fields)
if (!empty($_FILES) || isset($_POST['name'])) {
    $name     = $conn->real_escape_string(trim($_POST['name'] ?? ''));
    $email    = $conn->real_escape_string(trim($_POST['email'] ?? ''));
    $area     = $conn->real_escape_string(trim($_POST['area'] ?? ''));
    $timeslot = $conn->real_escape_string(trim($_POST['timeslot'] ?? ''));

    // Validate input
    if (empty($name) || empty($email) || empty($area) || empty($timeslot)) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "All fields (name, email, area, timeslot) are required."
        ]);
        exit();
    }

    // Handle image upload
    $uploadDir = __DIR__ . "/uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $imagePath = "uploads/placeholder.jpg"; // default image
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmp  = $_FILES['image']['tmp_name'];
        $fileName = uniqid("img_") . "_" . basename($_FILES['image']['name']);
        $target   = $uploadDir . $fileName;

        if (move_uploaded_file($fileTmp, $target)) {
            $imagePath = "uploads/" . $fileName;
        }
    }

    // Prevent duplicate reservations
    $checkSql = "SELECT id FROM reservations WHERE email='$email' AND area='$area' AND timeslot='$timeslot' LIMIT 1";
    $result = $conn->query($checkSql);
    if ($result && $result->num_rows > 0) {
        echo json_encode([
            "status" => "error",
            "message" => "You already have a reservation for this area and timeslot."
        ]);
        exit();
    }

    // Insert reservation with image
    $insertSql = "INSERT INTO reservations (name, email, area, timeslot, image, created_at)
                  VALUES ('$name', '$email', '$area', '$timeslot', '$imagePath', NOW())";

    if ($conn->query($insertSql) === TRUE) {
        echo json_encode([
            "status" => "success",
            "message" => "Reservation created successfully!",
            "image"   => $imagePath
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to create reservation: " . $conn->error
        ]);
    }

    $conn->close();
    exit();
}

// If request is JSON (fallback for old frontend)
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if ($data) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Please send data as multipart/form-data to support image upload."
    ]);
    exit();
}
?>
