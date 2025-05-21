<?php
// Menyertakan koneksi database
require_once('koneksi.php');

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Menangani pre-flight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Memeriksa apakah 'user_id' ada di query string
if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    // Menyusun query untuk mengambil nama pengguna berdasarkan user_id
    try {
        // Query untuk mendapatkan nama pengguna berdasarkan user_id
        $query = "SELECT name FROM tbl_users WHERE id = :user_id";
        
        // Menyiapkan statement
        $stmt = $conn->prepare($query);
        
        // Mengikat parameter ke statement
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        
        // Menjalankan query
        $stmt->execute();
        
        // Mendapatkan hasilnya
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Memeriksa apakah ada hasil
        if ($result) {
            // Mengembalikan nama pengguna dalam format JSON
            echo json_encode(['status' => 'success', 'user_name' => $result['name']]);
        } else {
            // Jika tidak ada data yang ditemukan
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
        }
    } catch (Exception $e) {
        // Menangani exception jika terjadi error
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    // Jika 'user_id' tidak ada di query string
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
}
?>
