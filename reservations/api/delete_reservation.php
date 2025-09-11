<?php
session_start();
require_once('../config/database.php');

if(!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin'){
    http_response_code(403);
    echo json_encode(["status"=>"error","message"=>"Forbidden"]);
    exit();
}

$id = intval($_GET['id']);
$stmt = $conn->prepare("DELETE FROM reservations WHERE id=?");
$stmt->bind_param("i",$id);
if($stmt->execute()){
    echo json_encode(["status"=>"success","message"=>"Reservation deleted"]);
}else{
    http_response_code(500);
    echo json_encode(["status"=>"error","message"=>"Error deleting reservation"]);
}
