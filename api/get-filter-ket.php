<?php
require_once('koneksi.php');

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse3/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Menangani pre-flight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Mendapatkan nilai enum dari kolom 'keterangan'
try {
    // Query untuk mendapatkan definisi enum dari kolom 'keterangan' menggunakan PDO
    $stmt = $conn->query("DESCRIBE tbl_invoices keterangan");

    if ($stmt) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Ekstrak nilai enum dari kolom 'keterangan'
        preg_match_all("/'([^']+)'/", $row['Type'], $matches);
        $enumValues = $matches[1];
        
        // Mengembalikan data enum dalam format JSON
        echo json_encode(['status' => 'success', 'enum_values' => $enumValues]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error fetching enum values']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
