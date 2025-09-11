<?php
header("Content-Type: application/json");
require_once('../config/database.php');

$SECRET_ADMIN_CODE = "SuperSecret123"; // 🔑 only this code allows admin registration

$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name']);
$email = trim($data['email']);
$password = $data['password'];
$role = isset($data['role']) ? $data['role'] : 'user';
$adminCode = isset($data['adminCode']) ? $data['adminCode'] : '';

if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["status"=>"error","message"=>"All fields required"]);
    exit();
}

// Prevent duplicate email
$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s",$email);
$check->execute();
$check->store_result();
if($check->num_rows > 0){
    echo json_encode(["status"=>"error","message"=>"Email already registered"]);
    exit();
}

// Enforce admin secret
if ($role === "admin") {
    if ($adminCode !== $SECRET_ADMIN_CODE) {
        echo json_encode(["status"=>"error","message"=>"Invalid admin code"]);
        exit();
    }
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);
$stmt = $conn->prepare("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)");
$stmt->bind_param("ssss", $name, $email, $hashedPassword, $role);

if($stmt->execute()){
    echo json_encode(["status"=>"success","message"=>"Registered successfully"]);
}else{
    http_response_code(500);
    echo json_encode(["status"=>"error","message"=>"Database error: ".$stmt->error]);
}
