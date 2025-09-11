<?php
session_start();
header("Content-Type: application/json");
require_once('../config/database.php');

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email']);
$password = $data['password'];

$stmt = $conn->prepare("SELECT id,name,password,role FROM users WHERE email=? LIMIT 1");
$stmt->bind_param("s",$email);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 1){
    $user = $result->fetch_assoc();
    if(password_verify($password, $user['password'])){
        $_SESSION['user'] = [
            "id"=>$user['id'],
            "name"=>$user['name'],
            "role"=>$user['role']
        ];
        echo json_encode(["status"=>"success","user"=>$_SESSION['user']]);
    } else {
        http_response_code(401);
        echo json_encode(["status"=>"error","message"=>"Invalid password"]);
    }
}else{
    http_response_code(404);
    echo json_encode(["status"=>"error","message"=>"User not found"]);
}
