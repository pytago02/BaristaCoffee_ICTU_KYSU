-- =========================================
-- DATABASE: CAFE_SYSTEM
-- =========================================
CREATE DATABASE IF NOT EXISTS doankysu_01 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE doankysu_01;

-- =========================================
-- TABLE DEFINITIONS (MySQL Compatible)
-- =========================================

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'barista', 'customer') NOT NULL DEFAULT 'customer',
  avatar VARCHAR(255),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE menu_category (
  id_menu_category INT AUTO_INCREMENT PRIMARY KEY,
  name_menu_category VARCHAR(255) NOT NULL,
  is_deleted TINYINT NOT NULL DEFAULT 0
);

CREATE TABLE menu (
  menu_id INT AUTO_INCREMENT PRIMARY KEY,
  menu_name VARCHAR(255) NOT NULL,
  id_menu_category INT NOT NULL,
  description TEXT,
  import_price INT NOT NULL,
  price INT NOT NULL,
  sweetness_level ENUM('low', 'medium', 'high'),
  temperature ENUM('hot', 'cold'),
  image_url VARCHAR(255),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  tutorial TEXT,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_menu_category) REFERENCES menu_category(id_menu_category)
);

CREATE TABLE ingredients (
  ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  stock_quantity DECIMAL(12,3) NOT NULL,
  min_stock DECIMAL(12,3) NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE menu_ingredients (
  menu_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity DECIMAL(12,3) NOT NULL,
  PRIMARY KEY (menu_id, ingredient_id),
  FOREIGN KEY (menu_id) REFERENCES menu(menu_id),
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

CREATE TABLE zone (
  zone_id INT AUTO_INCREMENT PRIMARY KEY,
  zone_name VARCHAR(255) NOT NULL
);

CREATE TABLE tables (
  table_id INT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(255) NOT NULL,
  table_status ENUM('available', 'pending', 'preparing', 'served', 'paid', 'unavailable') NOT NULL DEFAULT 'available',
  zone_id INT NOT NULL,
  is_deleted TINYINT NOT NULL DEFAULT 0,
  FOREIGN KEY (zone_id) REFERENCES zone(zone_id)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  staff_id INT,
  table_id INT,
  status ENUM('pending', 'preparing', 'completed', 'cancelled', 'paid') NOT NULL DEFAULT 'pending',
  total_price DECIMAL(12,2) NOT NULL,
  payment_method ENUM('cash', 'banking'),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(user_id),
  FOREIGN KEY (staff_id) REFERENCES users(user_id),
  FOREIGN KEY (table_id) REFERENCES tables(table_id)
);

CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_id INT NOT NULL,
  quantity INT NOT NULL,
  note VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
);

CREATE TABLE user_preferences (
  pref_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category VARCHAR(50),
  sweetness_level ENUM('low', 'medium', 'high'),
  temperature ENUM('hot', 'cold'),
  weight DECIMAL(6,3) NOT NULL DEFAULT 1,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE chatbot_logs (
  chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  sender ENUM('user', 'bot') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE sales_forecast (
  forecast_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  forecast_date DATE NOT NULL,
  predicted_revenue DECIMAL(14,2) NOT NULL,
  recommended_stock JSON,
  model_version VARCHAR(50),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
  rec_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  menu_id INT NOT NULL,
  score DECIMAL(6,3) NOT NULL,
  generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
);

CREATE TABLE business (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month INT NOT NULL,
  year INT NOT NULL,
  staff_salary INT NOT NULL,
  eletricity_bill INT NOT NULL,
  water_bill INT NOT NULL,
  rent INT NOT NULL,
  other INT NOT NULL,
  revenue INT NOT NULL,
  net_profit INT NOT NULL,
  total_order INT NOT NULL
);

CREATE TABLE request (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_id INT NOT NULL,
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  request_category ENUM('call_staff', 'payment') NOT NULL DEFAULT 'call_staff',
  status TINYINT(1) NOT NULL,
  time TIME NOT NULL,
  FOREIGN KEY (table_id) REFERENCES tables(table_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE TABLE staff_shifts (
  id_staff_shifts INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  start_time DATETIME,
  end_time DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE report (
  id_report INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  user_id INT NOT NULL,
  report_category ENUM('feedback', 'report', 'complaint', 'review', 'suggestion', 'other') NOT NULL DEFAULT 'feedback',
  content VARCHAR(255) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================================
-- END OF SCHEMA
-- =========================================
