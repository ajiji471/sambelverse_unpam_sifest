<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Import koneksi database
require_once 'koneksi.php';

// Ambil data JSON
$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$whatsapp = $data['whatsapp'] ?? '';
$gender = $data['gender'] ?? '';
$workplace = $data['workplace'] ?? '';

// Validasi input
if (empty($name) || empty($email) || empty($password) || empty($whatsapp) || empty($gender) || empty($workplace)) {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields']);
    exit;
}

// Periksa apakah email sudah ada menggunakan PDO
$sql_check = "SELECT id FROM tbl_users WHERE email = :email";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bindParam(":email", $email, PDO::PARAM_STR);
$stmt_check->execute();

if ($stmt_check->rowCount() > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already exists']);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Simpan ke database menggunakan PDO
$sql_insert = "INSERT INTO tbl_users (name, email, password, whatsapp, gender, workplace) VALUES (:name, :email, :password, :whatsapp, :gender, :workplace)";
 
$stmt_insert->bindParam(":name", $name, PDO::PARAM_STR);
$stmt_insert->bindParam(":email", $email, PDO::PARAM_STR);
$stmt_insert->bindParam(":password", $hashedPassword, PDO::PARAM_STR);
$stmt_insert->bindParam(":whatsapp", $whatsapp, PDO::PARAM_STR);
$stmt_insert->bindParam(":gender", $gender, PDO::PARAM_STR);
$stmt_insert->bindParam(":workplace", $workplace, PDO::PARAM_STR);

if ($stmt_insert->execute()) {
    echo json_encode(['success' => true, 'message' => 'User registered successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to register user']);
}

// Tutup koneksi
$stmt_check = null;
$stmt_insert = null;
$conn = null;
?>
