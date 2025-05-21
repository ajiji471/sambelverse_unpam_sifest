<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Import koneksi database
require_once 'koneksi.php';

// Ambil data JSON
$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (empty($email) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Username or new password is missing']);
    exit;
}

// Hash password baru
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Perbarui password di database
$sql = "UPDATE tbl_users SET password = ? WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $hashedPassword, $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update password']);
}

// Tutup koneksi
$stmt->close();
$conn->close();
?>
