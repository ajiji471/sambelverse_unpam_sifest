<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

date_default_timezone_set('Asia/Jakarta'); // ✅ Set zona waktu ke WIB

// header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Origin: https://eijiverse.my.id/sambelverse4/');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Import koneksi database
require_once 'koneksi.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD']; // Menambahkan pengecekan method

// Handle GET request for all menus
if ($method === 'GET' && $action === 'all-menus') {
    try {
        $query = "SELECT * FROM tbl_all_menu";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($menus);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// Handle POST request to set menu for today
if ($method === 'POST' && $action === 'set-menu-today') {
    $input = json_decode(file_get_contents('php://input'), true);
    $menu_ids = $input['menu_ids'] ?? [];
    $stokData = $input['stok'] ?? [];

    if (!is_array($menu_ids) || empty($menu_ids)) {
        echo json_encode(['success' => false, 'message' => 'Invalid or empty menu_ids']);
        exit;
    }

    try {
        $date = date('Y-m-d');

        // Menghapus menu yang sudah ada untuk tanggal hari ini
        $delete_query = "DELETE FROM tbl_menu_today WHERE tanggal = :tanggal";
        $stmt = $conn->prepare($delete_query);
        $stmt->bindParam(':tanggal', $date);
        $stmt->execute();

        // Menambahkan menu baru beserta stok untuk hari ini
        $insert_query = "INSERT INTO tbl_menu_today (kode_menu, tanggal, stok) VALUES (:menu_id, CURDATE(), :stok)";
        $stmt = $conn->prepare($insert_query);

        foreach ($stokData as $data) {
            $stmt->bindParam(':menu_id', $data['menu_id']);
            $stmt->bindParam(':stok', $data['stok']);
            $stmt->execute();
        }

        echo json_encode(['success' => true, 'message' => 'Menu for today has been set with stock!']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// Handle GET request for menu today with stock information
if ($method === 'GET' && $action === 'menus-today') {
    try {
        $date = date('Y-m-d');
        // Query untuk mendapatkan menu hari ini beserta stoknya
        $query = "SELECT m.*, t.stok FROM tbl_menu_today t
                  JOIN tbl_all_menu m ON t.kode_menu = m.kode_menu
                  WHERE t.tanggal=?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$date]);

        $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($menus);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// If none of the conditions are met, respond with an error
echo json_encode(['success' => false, 'message' => 'Invalid request method or action']);
exit;
?>
