<?php
// Konfigurasi koneksi database
require_once('koneksi.php'); // Pastikan file ini mendefinisikan $host, $dbname, $username, dan $password

// Header untuk mengatur CORS dan metode HTTP
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // header("Access-Control-Allow-Origin: http://localhost:5173");
    header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200); 
    exit();
}

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');

header('Content-Type: application/json');

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
try {
    // Membuat koneksi ke database
    $pdo = new PDO("mysql:servername=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        'status' => 'error',
        'message' => 'Error connecting to database: ' . $e->getMessage(),
    ]));
}

// Menangani permintaan POST untuk membuat invoice baru
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Mendekode data JSON dari body permintaan
    $data = json_decode(file_get_contents('php://input'), true);

    // Validasi JSON dan data input
    if (!$data) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid JSON data',
        ]);
        exit;
    }

    if (
        isset($data['kode_menu'], $data['user_id'], $data['rating'], $data['testimoni'], $data['keterangan']) &&
        in_array($data['kategori'], ['siang', 'sore', 'lainnya'], true) &&
        in_array($data['keterangan'], ['lunas', 'belum lunas'], true) &&
        is_numeric($data['total_tagihan']) // Memastikan total tagihan adalah angka
    ) {
        $user_id = $data['user_id'];
        $pesanan = $data['pesanan'];
        $kategori = $data['kategori'];
        $total_tagihan = $data['total_tagihan'];
        $keterangan = $data['keterangan'];

        try {
            // Periksa apakah user_id ada di tabel tbl_users
            $userCheck = $pdo->prepare("SELECT COUNT(*) FROM tbl_users WHERE id = :user_id");
            $userCheck->execute([':user_id' => $user_id]);
            if ($userCheck->fetchColumn() == 0) {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'User ID not found',
                ]);
                exit;
            }

            // Menyisipkan data ke tabel tbl_invoices
            $stmt = $pdo->prepare("
                INSERT INTO tbl_invoices (user_id, pesanan, kategori, total_tagihan, keterangan)
                VALUES (:user_id, :pesanan, :kategori, :total_tagihan, :keterangan)
            ");

            $stmt->execute([
                ':user_id' => $user_id,
                ':pesanan' => $pesanan,
                ':kategori' => $kategori,
                ':total_tagihan' => $total_tagihan,
                ':keterangan' => $keterangan,
            ]);

            // Mengirimkan respon sukses
            echo json_encode([
                'status' => 'success',
                'message' => 'Invoice successfully created',
                'invoice_id' => $pdo->lastInsertId(),
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create invoice: ' . $e->getMessage(),
            ]);
        }
    } else {
        // Mengirimkan respon gagal jika data tidak valid
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request data',
        ]);
    }
} else {
    // Menangani permintaan selain POST
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed',
    ]);
}
?>
