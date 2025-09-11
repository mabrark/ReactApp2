<?php
require_once('../config/config.php');
require_once('../config/database.php');
session_start();

// 🔐 Enforce login
if (!isset($_SESSION['isLoggedIn']) || $_SESSION['isLoggedIn'] !== true) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized - Please log in.'
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get booking ID from query string (?id=)
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Booking ID is required'
        ]);
        exit();
    }

    $id = intval($_GET['id']);

    $query = "SELECT id, name, email, area, timeslot, created_at, image 
              FROM reservations 
              WHERE id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $booking = $result->fetch_assoc();

        // Use placeholder if no image uploaded
        $imagePath = !empty($booking['image'])
            ? "http://localhost/reservation-api/uploads/" . basename($booking['image'])
            : "http://localhost/reservation-api/uploads/placeholder.jpg";

        // Optional: Only admins see email
        $email = ($_SESSION['role'] === 'admin') ? $booking['email'] : 'Hidden';

        $response = [
            'status' => 'success',
            'data' => [
                'id'       => $booking['id'],
                'name'     => $booking['name'],
                'email'    => $email,
                'area'     => $booking['area'],
                'timeslot' => $booking['timeslot'],
                'date'     => date("l jS \\of F Y", strtotime($booking['created_at'])),
                'image'    => $imagePath
            ]
        ];

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Booking not found'
        ]);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed'
    ]);
}
?>
