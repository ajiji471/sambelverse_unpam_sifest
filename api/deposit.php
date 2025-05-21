<?php
// Include koneksi database
include 'koneksi.php';

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');

header('Content-Type: application/json');

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    try {
        // Query untuk mendapatkan deposit berdasarkan user_id menggunakan PDO
        $stmt = $conn->prepare("SELECT deposit FROM tbl_deposit WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $stmt->execute();

        // Cek apakah ada hasil
        if ($stmt->rowCount() > 0) {
            // Ambil data
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            // Tampilkan data dalam format JSON
            echo json_encode([
                "status" => "success",
                "deposit" => $row['deposit']
            ]);
        } else {
            // Tidak ada data ditemukan
            echo json_encode([
                "status" => "error",
                "message" => "Data tidak ditemukan untuk user_id: $user_id"
            ]);
        }
    } catch (PDOException $e) {
        // Tangani error koneksi atau query
        echo json_encode([
            "status" => "error",
            "message" => "Terjadi kesalahan: " . $e->getMessage()
        ]);
    }
} else {
    // Jika user_id tidak diberikan
    echo json_encode([
        "status" => "error",
        "message" => "Parameter user_id tidak diberikan"
    ]);
}

// Tutup koneksi (PDO tidak perlu ditutup secara eksplisit, karena koneksi akan ditutup saat script selesai)
?>
