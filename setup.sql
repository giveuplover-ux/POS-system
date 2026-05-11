-- 1. 建立資料庫
CREATE DATABASE IF NOT EXISTS smart_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_shop;

-- 2. 商品資料表
CREATE TABLE IF NOT EXISTS products (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
price INT NOT NULL,
category VARCHAR(100),
image VARCHAR(500),
stock INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 訂單資料表
CREATE TABLE IF NOT EXISTS orders (
id INT AUTO_INCREMENT PRIMARY KEY,
order_number VARCHAR(50) UNIQUE NOT NULL,
total_amount INT NOT NULL,
status VARCHAR(50) DEFAULT 'Paid',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 插入初始測試資料
INSERT INTO products (name, price, category, image, stock) VALUES
('未來派降噪耳機', 8900, '電子產品', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 15),
('極簡智慧手錶', 12500, '穿戴裝置', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 8),
('智能居家控制器', 4200, '智慧家居', 'https://images.unsplash.com/photo-1558002038-103792e07924?w=400', 20),
('高效能無線滑鼠', 2800, '配件', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 30);