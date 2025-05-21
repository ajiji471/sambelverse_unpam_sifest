<?php

include('koneksi.php'); // Pastikan file koneksi.php menginisialisasi PDO sebagai $conn

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Ambil parameter id_user dari query string
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : '';

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode(["error" => "user_id parameter is required"]);
    exit;
}

// Membuat query untuk mengambil data berdasarkan id_user
$sql = "SELECT * FROM tbl_invoices WHERE user_id = :user_id";
$params = [':user_id' => $user_id];

try {
    // Eksekusi query menggunakan prepared statement
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    // Mengambil hasil sebagai array
    $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Kembalikan hasil dalam format JSON
    echo json_encode($invoices);
} catch (PDOException $e) {
    // Menangani error database
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

// Tidak perlu menutup koneksi secara manual, PDO akan menutupnya secara otomatis
?>
