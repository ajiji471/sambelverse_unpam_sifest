<?php

include('koneksi.php'); // Pastikan file koneksi.php menginisialisasi PDO sebagai $conn

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
// Ambil parameter filter dari query string
$filter_date = isset($_GET['date']) ? $_GET['date'] : '';
$filter_kategori = isset($_GET['kategori']) ? $_GET['kategori'] : '';
$filter_keterangan = isset($_GET['keterangan']) ? $_GET['keterangan'] : '';

// Membuat query dasar
$sql = "SELECT * FROM tbl_invoices WHERE 1";
$params = [];

// Menambahkan filter berdasarkan tanggal jika ada
if (!empty($filter_date)) {
    $sql .= " AND DATE(purchase_date) = :filter_date";
    $params[':filter_date'] = $filter_date;
}

// Menambahkan filter berdasarkan kategori (sore/siang) jika ada
if (!empty($filter_kategori)) {
    $sql .= " AND kategori = :filter_kategori";
    $params[':filter_kategori'] = $filter_kategori;
}

// Menambahkan filter berdasarkan keterangan (lunas/belum lunas) jika ada
if (!empty($filter_keterangan)) {
    $sql .= " AND keterangan = :filter_keterangan";
    $params[':filter_keterangan'] = $filter_keterangan;
}

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
