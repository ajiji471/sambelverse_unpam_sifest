<?php


// Header untuk mengatur CORS
// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');

// Tetapkan tipe konten sebagai JSON
header('Content-Type: application/json');

// Izinkan metode HTTP tertentu
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Izinkan header tertentu
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Menangani pre-flight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Menyertakan koneksi
require_once('koneksi.php');
// Menangani berbagai metode HTTP
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Mengambil ID dari parameter query jika ada
        $id = $_GET['id'] ?? null;

        // Query untuk mengambil data invoice
        try {
            if ($id) {
                // Ambil satu invoice berdasarkan ID
                $stmt = $conn->prepare("SELECT * FROM tbl_invoices WHERE id = :id");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                // Ambil semua data invoice
                $result = [];
                $stmt = $conn->query("SELECT * FROM tbl_invoices");
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $result[] = $row;
                }
            }
            echo json_encode(['status' => 'success', 'data' => $result]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Mendapatkan data JSON yang dikirim dari frontend
        $data = json_decode(file_get_contents('php://input'), true);

        // Validasi data yang diperlukan
        if (isset($data['user_id'], $data['pesanan'], $data['kategori'], $data['total_tagihan'], $data['keterangan'])) {
            try {
                // Query untuk menambah data invoice
                $stmt = $conn->prepare("INSERT INTO tbl_invoices (user_id, pesanan, kategori, total_tagihan, keterangan) VALUES (:user_id, :pesanan, :kategori, :total_tagihan, :keterangan)");
                $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_STR);
                $stmt->bindParam(':pesanan', $data['pesanan'], PDO::PARAM_STR);
                $stmt->bindParam(':kategori', $data['kategori'], PDO::PARAM_STR);
                $stmt->bindParam(':total_tagihan', $data['total_tagihan'], PDO::PARAM_STR);
                $stmt->bindParam(':keterangan', $data['keterangan'], PDO::PARAM_STR);
                $stmt->execute();
                
                // Mengembalikan response sukses
                echo json_encode(['status' => 'success', 'message' => 'Invoice created']);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
        }
        break;

    case 'PUT':
        // Mendapatkan data JSON yang dikirim dari frontend
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        // Validasi ID dan data yang diperlukan
        if ($id && isset($data['pesanan'], $data['kategori'], $data['total_tagihan'], $data['keterangan'])) {
            try {
                // Query untuk memperbarui data invoice berdasarkan ID
                $stmt = $conn->prepare("UPDATE tbl_invoices SET pesanan = :pesanan, kategori = :kategori, total_tagihan = :total_tagihan, keterangan = :keterangan WHERE id = :id");
                $stmt->bindParam(':pesanan', $data['pesanan'], PDO::PARAM_STR);
                $stmt->bindParam(':kategori', $data['kategori'], PDO::PARAM_STR);
                $stmt->bindParam(':total_tagihan', $data['total_tagihan'], PDO::PARAM_STR);
                $stmt->bindParam(':keterangan', $data['keterangan'], PDO::PARAM_STR);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                
                // Mengembalikan response sukses
                echo json_encode(['status' => 'success', 'message' => 'Invoice updated']);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid data or ID']);
        }
        break;

    case 'DELETE':
        // Mengambil ID dari parameter query
        $id = $_GET['id'] ?? null;

        // Validasi ID
        if ($id) {
            try {
                // Query untuk menghapus invoice berdasarkan ID
                $stmt = $conn->prepare("DELETE FROM tbl_invoices WHERE id = :id");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();

                // Mengembalikan response sukses
                echo json_encode(['status' => 'success', 'message' => 'Invoice deleted']);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
        }
        break;

    default:
        // Menangani metode yang tidak diizinkan
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
?>
