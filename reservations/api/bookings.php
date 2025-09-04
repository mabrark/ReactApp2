<?php
header("Content-Type: application/json");

require_once('../config/config.php');
require_once('../config/database.php');

$allowedMethods = ['GET'];
$maxBookingsPerPage = 4;

// Ensure only GET is allowed
if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;
$offset = ($page - 1) * $maxBookingsPerPage;

// Count total bookings
$countQuery = "SELECT COUNT(*) AS totalBookings FROM reservations";
$countResult = mysqli_query($conn, $countQuery);

if (!$countResult) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error querying database for total bookings count: ' . mysqli_error($conn)
    ]);
    mysqli_close($conn);
    exit();
}

$countRow = mysqli_fetch_assoc($countResult);
$totalBookings = (int)$countRow['totalBookings'];

// Fetch paginated bookings (include image column)
$query = "SELECT id, name, email, area, timeslot, created_at, image 
          FROM reservations 
          ORDER BY created_at DESC 
          LIMIT $offset, $maxBookingsPerPage";

$result = mysqli_query($conn, $query);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error querying database for paginated bookings: ' . mysqli_error($conn)
    ]);
    mysqli_close($conn);
    exit();
}

$bookings = mysqli_fetch_all($result, MYSQLI_ASSOC);

// Add placeholder for missing images
$baseUrl = "http://localhost/reservation-api/uploads/";
$placeholder = $baseUrl . "placeholder.jpg";

foreach ($bookings as &$booking) {
    if (!empty($booking['image'])) {
        $booking['image'] = $baseUrl . $booking['image'];
    } else {
        $booking['image'] = $placeholder;
    }
}

// Return response
if (empty($bookings)) {
    http_response_code(404);
    echo json_encode([
        'message' => 'No bookings found',
        'totalBookings' => $totalBookings
    ]); 
} else {
    echo json_encode([
        'bookings' => $bookings,
        'totalBookings' => $totalBookings,
        'currentPage' => $page,
        'perPage' => $maxBookingsPerPage
    ]); 
}

mysqli_close($conn);
?>
