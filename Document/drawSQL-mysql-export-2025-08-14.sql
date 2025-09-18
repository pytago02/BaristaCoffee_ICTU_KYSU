CREATE TABLE `users`(
    `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM(
        'admin',
        'staff',
        'barista',
        'customer'
    ) NOT NULL DEFAULT 'customer',
    `is_active` TINYINT(1) NOT NULL DEFAULT '1',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `users` ADD UNIQUE `users_email_unique`(`email`);
ALTER TABLE
    `users` ADD UNIQUE `users_phone_unique`(`phone`);
ALTER TABLE
    `users` ADD INDEX `users_role_index`(`role`);
CREATE TABLE `menu`(
    `menu_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `id_menu_category` INT NOT NULL,
    `description` TEXT NULL,
    `import_price` INT NOT NULL,
    `price` INT NOT NULL,
    `sweetness_level` ENUM('low', 'medium', 'high') NULL,
    `temperature` ENUM('hot', 'cold') NULL,
    `image_url` VARCHAR(255) NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT '1',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `menu` ADD INDEX `menu_id_menu_category_index`(`id_menu_category`);
ALTER TABLE
    `menu` ADD INDEX `menu_is_active_index`(`is_active`);
CREATE TABLE `ingredients`(
    `ingredient_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `stock_quantity` DECIMAL(12, 3) NOT NULL,
    `min_stock` DECIMAL(12, 3) NOT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `ingredients` ADD UNIQUE `ingredients_name_unique`(`name`);
CREATE TABLE `menu_ingredients`(
    `menu_id` INT NOT NULL,
    `ingredient_id` INT NOT NULL,
    `quantity` DECIMAL(12, 3) NOT NULL,
    PRIMARY KEY(`menu_id`)
);
ALTER TABLE
    `menu_ingredients` ADD PRIMARY KEY(`ingredient_id`);
CREATE TABLE `orders`(
    `order_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customer_id` INT NULL,
    `staff_id` INT NULL,
    `status` ENUM(
        'pending',
        'preparing',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'pending',
    `total_price` DECIMAL(12, 2) NOT NULL,
    `payment_method` ENUM('cash', 'momo', 'zalopay', 'vnpay') NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `orders` ADD INDEX `orders_staff_id_created_at_index`(`staff_id`, `created_at`);
ALTER TABLE
    `orders` ADD INDEX `orders_customer_id_created_at_index`(`customer_id`, `created_at`);
ALTER TABLE
    `orders` ADD INDEX `orders_status_index`(`status`);
ALTER TABLE
    `orders` ADD INDEX `orders_created_at_index`(`created_at`);
CREATE TABLE `order_items`(
    `order_item_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `menu_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `note` VARCHAR(255) NULL
);
ALTER TABLE
    `order_items` ADD INDEX `order_items_order_id_index`(`order_id`);
CREATE TABLE `user_preferences`(
    `pref_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `category` VARCHAR(50) NULL,
    `sweetness_level` ENUM('low', 'medium', 'high') NULL,
    `temperature` ENUM('hot', 'cold') NULL,
    `weight` DECIMAL(6, 3) NOT NULL DEFAULT '1',
    `last_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `user_preferences` ADD INDEX `user_preferences_user_id_index`(`user_id`);
CREATE TABLE `chatbot_logs`(
    `chat_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `sender` ENUM('user', 'bot') NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `chatbot_logs` ADD INDEX `chatbot_logs_user_id_created_at_index`(`user_id`, `created_at`);
CREATE TABLE `sales_forecast`(
    `forecast_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `forecast_date` DATE NOT NULL,
    `predicted_revenue` DECIMAL(14, 2) NOT NULL,
    `recommended_stock` JSON NULL,
    `model_version` VARCHAR(50) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `sales_forecast` ADD UNIQUE `sales_forecast_forecast_date_unique`(`forecast_date`);
CREATE TABLE `recommendations`(
    `rec_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `menu_id` INT NOT NULL,
    `score` DECIMAL(6, 3) NOT NULL,
    `generated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `recommendations` ADD INDEX `recommendations_user_id_score_index`(`user_id`, `score`);
CREATE TABLE `business`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL,
    `staff_salary` INT NOT NULL,
    `eletricity_bill` INT NOT NULL,
    `water_bill` INT NOT NULL,
    `rent` INT NOT NULL,
    `other` INT NOT NULL,
    `revenue` INT NOT NULL,
    `net_profit` INT NOT NULL
);
CREATE TABLE `request`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `table_id` INT NOT NULL,
    `order_id` INT NOT NULL,
    `customer_id` INT NOT NULL,
    `id_request_category` INT NOT NULL,
    `status` TINYINT(1) NOT NULL,
    `time` TIME NOT NULL
);
CREATE TABLE `tables`(
    `table_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name_table` VARCHAR(255) NOT NULL,
    `new_column` BIGINT NOT NULL,
    `id_table_status` INT NOT NULL,
    `new_column` BIGINT NOT NULL,
    `is_delete` TINYINT NOT NULL
);
CREATE TABLE `table_status_list`(
    `id_table_status` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name_table_status` VARCHAR(255) NOT NULL
);
CREATE TABLE `request_category`(
    `id_request_category` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name_request_category` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `request` ADD CONSTRAINT `request_order_id_foreign` FOREIGN KEY(`order_id`) REFERENCES `orders`(`order_id`);
ALTER TABLE
    `order_items` ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY(`order_id`) REFERENCES `orders`(`order_id`);
ALTER TABLE
    `orders` ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `users`(`user_id`);
ALTER TABLE
    `orders` ADD CONSTRAINT `orders_staff_id_foreign` FOREIGN KEY(`staff_id`) REFERENCES `users`(`user_id`);
ALTER TABLE
    `request` ADD CONSTRAINT `request_id_request_category_foreign` FOREIGN KEY(`id_request_category`) REFERENCES `request_category`(`id_request_category`);
ALTER TABLE
    `tables` ADD CONSTRAINT `tables_id_table_status_foreign` FOREIGN KEY(`id_table_status`) REFERENCES `table_status_list`(`id_table_status`);
ALTER TABLE
    `ingredients` ADD CONSTRAINT `ingredients_ingredient_id_foreign` FOREIGN KEY(`ingredient_id`) REFERENCES `menu_ingredients`(`ingredient_id`);
ALTER TABLE
    `chatbot_logs` ADD CONSTRAINT `chatbot_logs_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`);
ALTER TABLE
    `request` ADD CONSTRAINT `request_table_id_foreign` FOREIGN KEY(`table_id`) REFERENCES `tables`(`table_id`);
ALTER TABLE
    `menu` ADD CONSTRAINT `menu_menu_id_foreign` FOREIGN KEY(`menu_id`) REFERENCES `menu_ingredients`(`menu_id`);
ALTER TABLE
    `order_items` ADD CONSTRAINT `order_items_menu_id_foreign` FOREIGN KEY(`menu_id`) REFERENCES `menu`(`menu_id`);
ALTER TABLE
    `user_preferences` ADD CONSTRAINT `user_preferences_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`);
ALTER TABLE
    `recommendations` ADD CONSTRAINT `recommendations_menu_id_foreign` FOREIGN KEY(`menu_id`) REFERENCES `menu`(`menu_id`);
ALTER TABLE
    `recommendations` ADD CONSTRAINT `recommendations_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`);