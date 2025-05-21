<?php
require_once 'koneksi.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['token'])) {
    echo json_encode(["valid" => false, "message" => "Token not provided."]);
    exit();
}

$token = $data['token'];

// Query untuk memeriksa token
$sql = "SELECT * FROM user_tokens WHERE token = ? AND expires_at > NOW()";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["valid" => true]);
} else {
    echo json_encode(["valid" => false, "message" => "Invalid or expired token."]);
}

$stmt->close();
$conn->close();
?>
