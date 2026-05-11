<?php
require_once 'db.php';
header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => '資料格式錯誤']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO orders (order_number, total_amount) VALUES (?, ?)");
    $stmt->execute([$data['orderId'], $data['total']]);
    
    echo json_encode(['success' => true, 'message' => '訂單已存入資料庫']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>