<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
// Import koneksi database
require_once 'koneksi.php';

// Ambil data dari request
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Validasi input
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email or password is missing']);
    exit;
}

try {
    // Cari data pengguna di database (termasuk kolom 'id' dan 'password')
    $sql = "SELECT id, password FROM tbl_users WHERE email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    // Periksa apakah pengguna ditemukan
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        // Verifikasi password
        if (password_verify($password, $user['password'])) {
            // Jika login sukses, kirimkan token dan id pengguna
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => 'your-jwt-token', // Ganti dengan implementasi JWT sebenarnya
                'id' => $user['id'], // Mengirimkan id pengguna
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} catch (PDOException $e) {
    // Tangani kesalahan koneksi atau query
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
