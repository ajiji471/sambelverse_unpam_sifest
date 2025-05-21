<?php
// ==== CORS Headers ====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ==== Handle preflight request ====
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==== Load Midtrans Library ====
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';

use Midtrans\Config;
use Midtrans\Snap;

// ==== Midtrans Configuration ====
Config::$serverKey = 'SB-Mid-server-GaZup94eh3I6nQEY_r2eoPPM';
Config::$isProduction = false;
Config::$isSanitized = true;
Config::$is3ds = true;

// ==== Get JSON payload ====
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// ==== Validate payload ====
if (
    !$data ||
    !isset($data['total'], $data['name'], $data['email'], $data['phone'], $data['userId'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Data tidak lengkap atau format JSON salah.']);
    exit;
}

// ==== Validate amount ====
$total = intval($data['total']);
if ($total <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Jumlah total tidak boleh 0 atau negatif.']);
    exit;
}

// ==== Generate Unique Order ID ====
$orderId = "INV-" . time() . "-" . preg_replace("/[^0-9a-z]/i", "", $data['userId']);

// ==== Build Transaction Parameters ====
$params = [
    'transaction_details' => [
        'order_id' => $orderId,
        'gross_amount' => $total,
    ],
    'item_details' => [
        [
            'id' => 'item1',
            'price' => $total,
            'quantity' => 1,
            'name' => 'Pembayaran Tagihan User #' . $data['userId'],
        ]
    ],
    'customer_details' => [
        'first_name' => $data['name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
    ],
    'custom_field1' => $data['userId'],
];

try {
    // ==== Get Snap Token from Midtrans ====
    $snapToken = Snap::getSnapToken($params);

    // ==== Respond with token ====
    echo json_encode(['token' => $snapToken]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal mendapatkan Snap Token: ' . $e->getMessage()]);
}
