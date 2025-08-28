<?php
require_once('../config/config.php');
require_once('../config/database.php');

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

    $query = "SELECT id, name, email, area, timeslot, created_at 
              FROM reservations 
              WHERE id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $booking = $result->fetch_assoc();

        $response = [
            'status' => 'success',
            'data' => [
                'id'       => $booking['id'],
                'name'     => $booking['name'],
                'email'    => $booking['email'],
                'area'     => $booking['area'],
                'timeslot' => $booking['timeslot'],
                'date'     => date("l jS \\of F Y", strtotime($booking['created_at']))
            ]
        ];

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Booking not found'
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
    }

    $stmt->close();
    $conn->close();
}
?>
