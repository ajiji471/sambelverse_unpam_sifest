<?php
// getDataTagihan.php

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require_once '../koneksi.php'; // koneksi ke database

if (!isset($_GET['user_id']) || !is_numeric($_GET['user_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Parameter user_id tidak valid.'
    ]);
    exit;
}

$user_id = (int) $_GET['user_id'];

try {
    $stmt = $conn->prepare("
        SELECT u.id, u.name, u.email, u.whatsapp, t.total
        FROM tbl_users u
        JOIN total_tagihan t ON u.id = t.id_user
        WHERE u.id = :id
    ");
    $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode([
            'status' => 'success',
            'data' => $data
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Data tidak ditemukan untuk user_id tersebut.'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}
