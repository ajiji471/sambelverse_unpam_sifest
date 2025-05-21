<?php
require 'koneksi.php'; // Menggunakan koneksi dari koneksi.php

date_default_timezone_set('Asia/Jakarta'); // ✅ Set zona waktu ke WIB

header('Access-Control-Allow-Origin: http://localhost:5173');
// header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse3/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Mengambil data JSON dari body request
    $data = json_decode(file_get_contents('php://input'), true);

    // Memeriksa apakah data yang diperlukan ada dalam request
    $kode_menu = $data['kode_menu'] ?? "";
    $user_id = $data['user_id'] ?? "";
    $rating = $data['rating'] ?? "";
    $testimoni = $data['testimoni'] ?? "";

    // Validasi input
    if (empty($kode_menu) || empty($user_id) || empty($rating)) {
        echo json_encode(["success" => false, "message" => "Semua field wajib diisi!"]);
        exit;
    }

    try {
        // Menyimpan data ke dalam database
        $stmt = $conn->prepare("INSERT INTO tbl_ratings (kode_menu, user_id, rating, testimoni) VALUES (?, ?, ?, ?)");
        $stmt->execute([$kode_menu, $user_id, $rating, $testimoni]);

        echo json_encode(["success" => true, "message" => "Rating berhasil ditambahkan!"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Metode request tidak diizinkan"]);
}
?>
