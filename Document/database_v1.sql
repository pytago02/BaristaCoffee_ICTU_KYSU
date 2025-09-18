-- =========================================
-- 0) Khởi tạo database
-- =========================================
CREATE DATABASE IF NOT EXISTS cafe_ai
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe_ai;

-- =========================================
-- 1) Bảng người dùng
-- =========================================
CREATE TABLE users (
  user_id        INT AUTO_INCREMENT PRIMARY KEY,
  full_name      VARCHAR(100)        NOT NULL,
  email          VARCHAR(100)        UNIQUE,
  phone          VARCHAR(20)         UNIQUE,
  password_hash  VARCHAR(255)        NOT NULL,
  role           ENUM('admin','staff','barista','customer') NOT NULL DEFAULT 'customer',
  is_active      TINYINT(1)          NOT NULL DEFAULT 1,
  created_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users(role);

-- =========================================
-- 2) Bảng menu (món)
-- =========================================
CREATE TABLE menu (
  menu_id          INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(120)      NOT NULL,
  category         VARCHAR(50)       NOT NULL,
  description      TEXT,
  price            DECIMAL(10,2)     NOT NULL CHECK (price >= 0),
  sweetness_level  ENUM('low','medium','high') NULL,
  temperature      ENUM('hot','cold') NULL,
  image_url        VARCHAR(255),
  is_active        TINYINT(1)        NOT NULL DEFAULT 1,
  created_at       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_menu_category ON menu(category);
CREATE INDEX idx_menu_active ON menu(is_active);

-- =========================================
-- 3) Bảng nguyên liệu (kho)
-- =========================================
CREATE TABLE ingredients (
  ingredient_id  INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120)    NOT NULL UNIQUE,
  unit           VARCHAR(20)     NOT NULL,       -- gram, ml, pcs...
  stock_quantity DECIMAL(12,3)   NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  min_stock      DECIMAL(12,3)   NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================
-- 4) Bảng công thức món <-> nguyên liệu (n-n)
-- =========================================
CREATE TABLE menu_ingredients (
  menu_id        INT           NOT NULL,
  ingredient_id  INT           NOT NULL,
  quantity       DECIMAL(12,3) NOT NULL CHECK (quantity > 0),
  PRIMARY KEY(menu_id, ingredient_id),
  CONSTRAINT fk_mi_menu FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE CASCADE,
  CONSTRAINT fk_mi_ing  FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================
-- 5) Bảng đơn hàng
-- =========================================
CREATE TABLE orders (
  order_id        INT AUTO_INCREMENT PRIMARY KEY,
  customer_id     INT            NULL,
  staff_id        INT            NULL,                 -- nhân viên phục vụ tạo đơn
  status          ENUM('pending','preparing','completed','cancelled') NOT NULL DEFAULT 'pending',
  total_price     DECIMAL(12,2)  NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  payment_method  ENUM('cash','momo','zalopay','vnpay') NULL,
  created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_staff    FOREIGN KEY (staff_id)    REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- =========================================
-- 6) Bảng chi tiết đơn hàng
-- =========================================
CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id      INT           NOT NULL,
  menu_id       INT           NOT NULL,
  quantity      INT           NOT NULL CHECK (quantity > 0),
  price         DECIMAL(10,2) NOT NULL CHECK (price >= 0),  -- giá tại thời điểm bán
  note          VARCHAR(255)  NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_menu  FOREIGN KEY (menu_id)  REFERENCES menu(menu_id)   ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_oi_order ON order_items(order_id);

-- =========================================
-- 7) Bảng sở thích người dùng (phục vụ Content-based)
-- =========================================
CREATE TABLE user_preferences (
  pref_id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  category         VARCHAR(50)       NULL,
  sweetness_level  ENUM('low','medium','high') NULL,
  temperature      ENUM('hot','cold') NULL,
  weight           DECIMAL(6,3)      NOT NULL DEFAULT 1.0, -- mức độ ưu tiên
  last_updated     DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_pref_user ON user_preferences(user_id);

-- =========================================
-- 8) Lịch sử chat với chatbot (AI)
-- =========================================
CREATE TABLE chatbot_logs (
  chat_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NULL,
  sender     ENUM('user','bot') NOT NULL,
  message    TEXT         NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_chat_user_time ON chatbot_logs(user_id, created_at);

-- =========================================
-- 9) Dự báo doanh thu & gợi ý tồn kho (AI)
-- =========================================
CREATE TABLE sales_forecast (
  forecast_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  forecast_date      DATE            NOT NULL,
  predicted_revenue  DECIMAL(14,2)   NOT NULL CHECK (predicted_revenue >= 0),
  recommended_stock  JSON            NULL,    -- {"ingredient_id": số lượng đề xuất, ...}
  model_version      VARCHAR(50)     NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_forecast_date (forecast_date)
) ENGINE=InnoDB;

-- =========================================
-- 10) Bảng gợi ý món được tạo sẵn (offline) bởi mô hình AI
--     (để Angular/Node lấy nhanh)
-- =========================================
CREATE TABLE recommendations (
  rec_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT           NOT NULL,
  menu_id      INT           NOT NULL,
  score        DECIMAL(6,3)  NOT NULL,  -- độ ưu tiên
  generated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_rec_menu FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_rec_user_score ON recommendations(user_id, score DESC);

-- =========================================
-- 11) VIEW hỗ trợ báo cáo nhanh
-- =========================================

-- Doanh thu theo ngày
CREATE OR REPLACE VIEW v_revenue_by_day AS
SELECT
  DATE(o.created_at) AS sale_date,
  SUM(oi.quantity * oi.price) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status IN ('preparing','completed')
GROUP BY DATE(o.created_at);

-- Top món bán chạy
CREATE OR REPLACE VIEW v_top_menu AS
SELECT
  m.menu_id, m.name, m.category,
  SUM(oi.quantity) AS total_qty,
  SUM(oi.quantity * oi.price) AS total_revenue
FROM order_items oi
JOIN menu m ON m.menu_id = oi.menu_id
JOIN orders o ON o.order_id = oi.order_id
WHERE o.status IN ('preparing','completed')
GROUP BY m.menu_id, m.name, m.category
ORDER BY total_qty DESC;

-- =========================================
-- 12) TRIGGER tự động trừ kho theo công thức khi thêm/sửa/xóa order_items
--      Lưu ý: yêu cầu tất cả nguyên liệu phải đủ mới cho phép insert.
-- =========================================

-- Helper: kiểm tra tồn kho đủ cho một dòng chi tiết
DROP FUNCTION IF EXISTS can_fulfill_item;
DELIMITER $$
CREATE FUNCTION can_fulfill_item(p_menu_id INT, p_qty INT)
RETURNS TINYINT
DETERMINISTIC
BEGIN
  DECLARE insufficient INT DEFAULT 0;
  -- kiểm tra từng nguyên liệu cần cho món
  SELECT COUNT(*) INTO insufficient
  FROM menu_ingredients mi
  JOIN ingredients i ON i.ingredient_id = mi.ingredient_id
  WHERE mi.menu_id = p_menu_id
    AND (i.stock_quantity < (mi.quantity * p_qty));
  RETURN IF(insufficient = 0, 1, 0);
END$$
DELIMITER ;

-- Insert: kiểm tra & trừ kho
DROP TRIGGER IF EXISTS trg_oi_before_insert;
DELIMITER $$
CREATE TRIGGER trg_oi_before_insert
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
  IF can_fulfill_item(NEW.menu_id, NEW.quantity) = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough stock for this menu item';
  END IF;

  -- trừ kho
  UPDATE ingredients i
  JOIN menu_ingredients mi ON mi.ingredient_id = i.ingredient_id
  SET i.stock_quantity = i.stock_quantity - (mi.quantity * NEW.quantity)
  WHERE mi.menu_id = NEW.menu_id;
END$$
DELIMITER ;

-- Update: hoàn kho phần cũ, kiểm tra phần mới, rồi trừ kho phần mới
DROP TRIGGER IF EXISTS trg_oi_before_update;
DELIMITER $$
CREATE TRIGGER trg_oi_before_update
BEFORE UPDATE ON order_items
FOR EACH ROW
BEGIN
  -- hoàn kho phần cũ
  UPDATE ingredients i
  JOIN menu_ingredients mi ON mi.ingredient_id = i.ingredient_id
  SET i.stock_quantity = i.stock_quantity + (mi.quantity * OLD.quantity)
  WHERE mi.menu_id = OLD.menu_id;

  -- kiểm tra đủ kho cho phần mới
  IF can_fulfill_item(NEW.menu_id, NEW.quantity) = 0 THEN
    -- khôi phục lại trừ kho cũ để giữ dữ liệu nhất quán
    UPDATE ingredients i
    JOIN menu_ingredients mi ON mi.ingredient_id = i.ingredient_id
    SET i.stock_quantity = i.stock_quantity - (mi.quantity * OLD.quantity)
    WHERE mi.menu_id = OLD.menu_id;

    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough stock for updated menu item';
  END IF;

  -- trừ kho theo giá trị mới
  UPDATE ingredients i
  JOIN menu_ingredients mi ON mi.ingredient_id = i.ingredient_id
  SET i.stock_quantity = i.stock_quantity - (mi.quantity * NEW.quantity)
  WHERE mi.menu_id = NEW.menu_id;
END$$
DELIMITER ;

-- Delete: hoàn kho lại
DROP TRIGGER IF EXISTS trg_oi_after_delete;
DELIMITER $$
CREATE TRIGGER trg_oi_after_delete
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
  UPDATE ingredients i
  JOIN menu_ingredients mi ON mi.ingredient_id = i.ingredient_id
  SET i.stock_quantity = i.stock_quantity + (mi.quantity * OLD.quantity)
  WHERE mi.menu_id = OLD.menu_id;
END$$
DELIMITER ;

-- =========================================
-- 13) Dữ liệu mẫu tối thiểu (tùy chọn)
-- =========================================
INSERT INTO users(full_name,email,phone,password_hash,role)
VALUES
('Admin','admin@cafe.local',NULL,'$2y$hash','admin'),
('Nhân viên phục vụ A','staffA@cafe.local',NULL,'$2y$hash','staff'),
('Barista B','baristaB@cafe.local',NULL,'$2y$hash','barista'),
('Khách C','customerC@cafe.local','0900000000','$2y$hash','customer');

INSERT INTO ingredients(name,unit,stock_quantity,min_stock)
VALUES
('Espresso','ml',5000,500),
('Sữa tươi','ml',8000,1000),
('Đá viên','pcs',2000,200),
('Đường','gram',5000,500),
('Trà đen','gram',2000,200);

INSERT INTO menu(name,category,price,sweetness_level,temperature,is_active)
VALUES
('Cà phê sữa đá','coffee',35000,'medium','cold',1),
('Americano nóng','coffee',30000,'low','hot',1),
('Trà đen đá','tea',28000,'medium','cold',1);

-- Công thức
-- Cà phê sữa đá: espresso 60ml, sữa 120ml, đá 1, đường 10g
INSERT INTO menu_ingredients(menu_id, ingredient_id, quantity)
SELECT m.menu_id, i.ingredient_id,
       CASE i.name
         WHEN 'Espresso' THEN 60
         WHEN 'Sữa tươi' THEN 120
         WHEN 'Đá viên'  THEN 1
         WHEN 'Đường'    THEN 10
       END
FROM menu m
JOIN ingredients i
WHERE m.name='Cà phê sữa đá' AND i.name IN ('Espresso','Sữa tươi','Đá viên','Đường');

-- Americano nóng: espresso 80ml, nước nóng ~ thay bằng 'Espresso' 80, đường 5g
INSERT INTO menu_ingredients(menu_id, ingredient_id, quantity)
SELECT m.menu_id, i.ingredient_id,
       CASE i.name
         WHEN 'Espresso' THEN 80
         WHEN 'Đường'    THEN 5
       END
FROM menu m
JOIN ingredients i
WHERE m.name='Americano nóng' AND i.name IN ('Espresso','Đường');

-- Trà đen đá: trà đen 8g, đường 10g, đá 1
INSERT INTO menu_ingredients(menu_id, ingredient_id, quantity)
SELECT m.menu_id, i.ingredient_id,
       CASE i.name
         WHEN 'Trà đen' THEN 8
         WHEN 'Đường'   THEN 10
         WHEN 'Đá viên' THEN 1
       END
FROM menu m
JOIN ingredients i
WHERE m.name='Trà đen đá' AND i.name IN ('Trà đen','Đường','Đá viên');

-- Đơn hàng mẫu (tạo 1 order + 2 dòng chi tiết -> trigger sẽ trừ kho)
INSERT INTO orders(customer_id, staff_id, status, payment_method)
VALUES ( (SELECT user_id FROM users WHERE role='customer' LIMIT 1),
         (SELECT user_id FROM users WHERE role='staff' LIMIT 1),
         'preparing','cash');

INSERT INTO order_items(order_id, menu_id, quantity, price)
VALUES
( (SELECT MAX(order_id) FROM orders),
  (SELECT menu_id FROM menu WHERE name='Cà phê sữa đá'), 2,
  (SELECT price FROM menu WHERE name='Cà phê sữa đá') ),
( (SELECT MAX(order_id) FROM orders),
  (SELECT menu_id FROM menu WHERE name='Trà đen đá'), 1,
  (SELECT price FROM menu WHERE name='Trà đen đá') );

-- =========================================
-- 14) Một số chỉ mục gợi ý thêm cho hiệu năng
-- =========================================
CREATE INDEX idx_orders_customer ON orders(customer_id, created_at);
CREATE INDEX idx_orders_staff    ON orders(staff_id, created_at);
