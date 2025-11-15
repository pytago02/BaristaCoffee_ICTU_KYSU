-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 24, 2025 lúc 10:19 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `doankysu_01`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `business`
--

CREATE TABLE `business` (
  `id` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `staff_salary` int(11) NOT NULL,
  `eletricity_bill` int(11) NOT NULL,
  `water_bill` int(11) NOT NULL,
  `rent` int(11) NOT NULL,
  `other` int(11) NOT NULL,
  `revenue` int(11) NOT NULL,
  `net_profit` int(11) NOT NULL,
  `total_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `business`
--

INSERT INTO `business` (`id`, `month`, `year`, `staff_salary`, `eletricity_bill`, `water_bill`, `rent`, `other`, `revenue`, `net_profit`, `total_order`) VALUES
(1, 6, 2025, 45000000, 4800000, 1300000, 25000000, 3200000, 98000000, 18700000, 2940),
(2, 7, 2025, 46000000, 5000000, 1400000, 25000000, 3500000, 102000000, 21100000, 3050),
(3, 8, 2025, 47000000, 5200000, 1400000, 25000000, 3800000, 108000000, 25600000, 3230),
(4, 9, 2025, 47000000, 5500000, 1500000, 25000000, 4000000, 111928000, 29000000, 3380),
(5, 10, 2025, 48000000, 5700000, 1600000, 25000000, 4200000, 117984000, 33500000, 3520);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chatbot_logs`
--

CREATE TABLE `chatbot_logs` (
  `chat_id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sender` enum('user','bot') NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chatbot_logs`
--

INSERT INTO `chatbot_logs` (`chat_id`, `user_id`, `sender`, `message`, `created_at`) VALUES
(1, NULL, 'user', 'cách pha cà phê đen', '2025-10-19 14:58:40'),
(2, NULL, 'bot', 'Chào bạn! Để pha cà phê đen ngon tại nhà, bạn có thể tham khảo cách sau nha:\n\n1.  **Chuẩn bị:** Cà phê nguyên chất, phin pha cà phê, nước sôi.\n2.  **Tráng phin:** Tráng phin qua nước sôi để làm ấm và khử trùng.\n3.  **Cho cà phê vào phin:** Cho khoảng 20-25g cà phê vào phin.\n4.  **Ủ cà phê:** Chế một ít nước sôi (khoảng 20ml) vào phin, đậy nắp và ủ trong khoảng 1-2 phút để cà phê nở đều.\n5.  **Pha cà phê:** Chế thêm nước sôi vào phin (khoảng 70-80ml), đậy nắp và đợi cà phê nhỏ giọt.\n6.  **Thưởng thức:** Bạn có thể thêm đường hoặc đá tùy theo sở thích.\n\nChúc bạn pha được ly cà phê đen ngon miệng! Ghé Mocha House thưởng thức cà phê nhé! 😊\n', '2025-10-19 14:58:40'),
(3, NULL, 'user', 'cách pha cà phê đen', '2025-10-19 14:59:16'),
(4, NULL, 'bot', 'Chào bạn! Để pha cà phê đen ngon tại nhà, bạn có thể dùng phin hoặc máy pha cà phê.\n\n**Nếu dùng phin:**\n\n1.  Cho khoảng 20-25g cà phê bột vào phin.\n2.  Lắc nhẹ cho cà phê phẳng và ấn nhẹ bằng nắp gài.\n3.  Rót khoảng 20ml nước sôi vào phin, ủ trong 1-2 phút.\n4.  Rót thêm khoảng 50-60ml nước sôi và chờ cà phê nhỏ giọt.\n\n**Nếu dùng máy pha cà phê:**\n\n1.  Cho cà phê bột vào tay pha theo hướng dẫn của máy.\n2.  Nén cà phê bằng tamper.\n3.  Lắp tay pha vào máy và tiến hành pha theo hướng dẫn của máy.\n\nChúc bạn có một tách cà phê đen thơm ngon! 😊\n', '2025-10-19 14:59:16'),
(5, NULL, 'user', 'cách pha cà phê đen', '2025-10-19 15:03:34'),
(6, NULL, 'bot', 'Hiện tại, tôi chưa có hướng dẫn pha chế Cà Phê Đen (cả nóng và đá) ạ.\n', '2025-10-19 15:03:34'),
(7, NULL, 'user', 'cà phê là gì', '2025-10-19 15:04:11'),
(8, NULL, 'bot', 'Xin lỗi, tôi chỉ có thể giúp về dịch vụ và đồ uống tại Mocha House ạ.\n', '2025-10-19 15:04:11'),
(9, NULL, 'user', 'cà phê là gì', '2025-10-19 15:06:28'),
(10, NULL, 'bot', 'Cà phê là một loại thức uống được chế biến từ hạt cà phê rang, thường được ủ với nước nóng. Cà phê là một trong những thức uống phổ biến nhất trên thế giới, và nó có thể được thưởng thức theo nhiều cách khác nhau. Hạt cà phê chứa caffeine, một chất kích thích có thể giúp bạn tỉnh táo và tập trung. Ngoài ra, cà phê còn chứa nhiều chất chống oxy hóa có lợi cho sức khỏe.\n', '2025-10-19 15:06:28'),
(11, NULL, 'user', 'messi', '2025-10-19 15:07:24'),
(12, NULL, 'bot', 'Xin lỗi, tôi chỉ có thể hỗ trợ về lĩnh vực cà phê và đồ uống tại Mocha House ạ.\n', '2025-10-19 15:07:24'),
(13, NULL, 'user', 'menu hiện tại', '2025-10-19 15:08:05'),
(14, NULL, 'bot', 'Dạ vâng, đây là menu hiện tại của Mocha House ạ:\n\n**Cà Phê Máy:**\n*   Espresso Đá: 49.000đ\n*   Cappuccino Đá: 55.000đ\n*   Caramel Macchiato Đá: 65.000đ\n*   Caramel Macchiato Nóng: 69.000đ\n*   Americano Nóng: 45.000đ\n*   Cappuccino Nóng: 55.000đ\n*   Espresso Nóng: 45.000đ\n*   Latte Nóng: 59.000đ\n\n**Cà Phê Việt Nam:**\n*   Bạc Xỉu: 39.000đ\n*   Bạc Xỉu Nóng: 39.000đ\n*   Cà Phê Đen Nóng: 39.000đ\n*   Cà Phê Sữa Nóng: 39.000đ\n*   Cà Phê Đen Đá: 39.000đ\n*   Cà Phê Sữa Đá: 39.000đ\n\n**A-Mê:**\n*   A-Mê Classic: 39.000đ\n*   A-Mê Đào: 49.000đ\n*   A-Mê Mơ: 49.000đ\n*   A-Mê Thanh Yên: 49.000đ\n\n**Trà Trái Cây:**\n*   Oolong Tứ Quý Sen (Nóng): 59.000đ\n*   Oolong Tứ Quý Sen: 49.000đ\n*   Oolong Tứ Quý Dâu Trân Châu: 49.000đ\n*   Oolong Tứ Quý Vải: 49.000đ\n\n**Trà Sữa:**\n*   Trà Sữa Oolong Nướng Sương Sáo: 55.000đ\n*   Trà Sữa Oolong Tứ Quý Sương Sáo: 55.000đ\n*   Hồng Trà Sữa Nóng: 55.000đ\n*   Hồng Trà Sữa Trân Châu: 55.000đ\n*   Trà Đen Macchiato: 55.000đ\n*   Trà Sữa Oolong BLao: 39.000đ\n\n**Matcha:**\n*   Matcha Latte Tây Bắc: 45.000đ\n*   Matcha Latte Tây Bắc (Nóng): 49.000đ\n*   Matcha Latte Tây Bắc Sữa Yến Mạch (Nóng): 55.000đ\n*   Matcha Latte Tây Bắc Sữa Yến Mạch: 55.000đ\n*   Matcha Latte: 55.000đ\n*   Matcha Tây Bắc Trân Châu Hoàng Kim: 49.000đ\n\n**Chocolate:**\n*   Chocolate Đá: 55.000đ\n*   Chocolate Nóng: 55.000đ\n\n**Frappe:**\n*   Frappe Matcha Tây Bắc: 65.000đ\n*   Frappe Almond: 65.000đ\n*   Frappe Hazelnut: 65.000đ\n*   Frappe Choco Chip: 65.000đ\n\n**Bánh Mặn:**\n*   Bánh Mì Que Chà Bông Phô Mai Bơ Cay: 22.000đ\n*   Bánh Mì Que Bò Nấm Xốt Bơ: 22.000đ\n*   Bánh Mì Que Pate Cột Đèn: 19.000đ\n*   Croissant trứng muối: 39.000đ\n*   Butter Croissant Sữa Đặc: 35.000đ\n*   Chà Bông Phô Mai: 39.000đ\n\n**Bánh Ngọt:**\n*   Mít Sấy: 20.000đ\n*   Mochi Kem Trà Sữa Trân Châu: 19.000đ\n*   Mochi Kem Phúc Bồn Tử: 19.000đ\n*   Mochi Kem Việt Quất: 19.000đ\n*   Mochi Kem Chocolate: 19.000đ\n*   Mochi Kem Matcha: 19.000đ\n*   Mousse Tiramisu: 35.000đ\n*   Mousse Gấu Chocolate: 39.000đ\n\n**Bánh Pastry:**\n*   Butter Croissant: 29.000đ\n\nBạn muốn thử món nào không ạ?\n', '2025-10-19 15:08:05'),
(15, NULL, 'user', 'menu', '2025-10-19 15:27:07'),
(16, NULL, 'bot', '[Hiển thị menu]', '2025-10-19 15:27:07'),
(17, NULL, 'user', 'menu', '2025-10-19 15:28:28'),
(18, NULL, 'bot', '[Hiển thị menu]', '2025-10-19 15:28:28'),
(19, NULL, 'user', 'menu', '2025-10-19 15:31:22'),
(20, NULL, 'bot', '[Hiển thị menu]', '2025-10-19 15:31:22'),
(21, NULL, 'user', 'menu', '2025-10-19 15:32:01'),
(22, NULL, 'bot', '[Hiển thị menu]', '2025-10-19 15:32:01'),
(23, NULL, 'user', 'menu\\', '2025-10-19 15:33:14'),
(24, NULL, 'bot', 'Dạ vâng, em xin gửi menu hiện tại của Mocha House ạ:\n\n• Espresso Đá (Cà Phê Máy) - 49000đ\n• Cappuccino Đá (Cà Phê Máy) - 55000đ\n• Caramel Macchiato Đá (Cà Phê Máy) - 65000đ\n• Caramel Macchiato Nóng (Cà Phê Máy) - 69000đ\n• Americano Nóng (Cà Phê Máy) - 45000đ\n• Cappuccino Nóng (Cà Phê Máy) - 55000đ\n• Espresso Nóng (Cà Phê Máy) - 45000đ\n• Latte Nóng (Cà Phê Máy) - 59000đ\n• Bạc Xỉu (Cà Phê Việt Nam) - 39000đ\n• Bạc Xỉu Nóng (Cà Phê Việt Nam) - 39000đ\n• Cà Phê Đen Nóng (Cà Phê Việt Nam) - 39000đ\n• Cà Phê Sữa Nóng (Cà Phê Việt Nam) - 39000đ\n• Cà Phê Đen Đá (Cà Phê Việt Nam) - 39000đ\n• Cà Phê Sữa Đá (Cà Phê Việt Nam) - 39000đ\n• A-Mê Classic (A-Mê) - 39000đ\n• A-Mê Đào (A-Mê) - 49000đ\n• A-Mê Mơ (A-Mê) - 49000đ\n• A-Mê Thanh Yên (A-Mê) - 49000đ\n• Oolong Tứ Quý Sen (Nóng) (Trà Trái Cây) - 59000đ\n• Oolong Tứ Quý Sen (Trà Trái Cây) - 49000đ\n• Oolong Tứ Quý Dâu Trân Châu (Trà Trái Cây) - 49000đ\n• Oolong Tứ Quý Vải (Trà Trái Cây) - 49000đ\n• Trà Sữa Oolong Nướng Sương Sáo (Trà Sữa) - 55000đ\n• Trà Sữa Oolong Tứ Quý Sương Sáo (Trà Sữa) - 55000đ\n• Hồng Trà Sữa Nóng (Trà Sữa) - 55000đ\n• Hồng Trà Sữa Trân Châu (Trà Sữa) - 55000đ\n• Trà Đen Macchiato (Trà Sữa) - 55000đ\n• Trà Sữa Oolong BLao (Trà Sữa) - 39000đ\n• Matcha Latte Tây Bắc (Matcha) - 45000đ\n• Matcha Latte Tây Bắc (Nóng) (Matcha) - 49000đ\n• Matcha Latte Tây Bắc Sữa Yến Mạch (Nóng) (Matcha) - 55000đ\n• Matcha Latte Tây Bắc Sữa Yến Mạch (Matcha) - 55000đ\n• Matcha Latte (Matcha) - 55000đ\n• Matcha Tây Bắc Trân Châu Hoàng Kim (Matcha) - 49000đ\n• Chocolate Đá (Chocolate) - 55000đ\n• Chocolate Nóng (Chocolate) - 55000đ\n• Frappe Matcha Tây Bắc (Frappe) - 65000đ\n• Frappe Almond (Frappe) - 65000đ\n• Frappe Hazelnut (Frappe) - 65000đ\n• Frappe Choco Chip (Frappe) - 65000đ\n• Bánh Mì Que Chà Bông Phô Mai Bơ Cay (Bánh mặn) - 22000đ\n• Bánh Mì Que Bò Nấm Xốt Bơ (Bánh mặn) - 22000đ\n• Bánh Mì Que Pate Cột Đèn (Bánh mặn) - 19000đ\n• Croissant trứng muối (Bánh mặn) - 39000đ\n• Butter Croissant Sữa Đặc (Bánh mặn) - 35000đ\n• Chà Bông Phô Mai (Bánh mặn) - 39000đ\n• Mít Sấy (Bánh ngọt) - 20000đ\n• Mochi Kem Trà Sữa Trân Châu (Bánh ngọt) - 19000đ\n• Mochi Kem Phúc Bồn Tử (Bánh ngọt) - 19000đ\n• Mochi Kem Việt Quất (Bánh ngọt) - 19000đ\n• Mochi Kem Chocolate (Bánh ngọt) - 19000đ\n• Mochi Kem Matcha (Bánh ngọt) - 19000đ\n• Mousse Tiramisu (Bánh ngọt) - 35000đ\n• Mousse Gấu Chocolate (Bánh ngọt) - 39000đ\n• Butter Croissant (Bánh Pastry) - 29000đ\n', '2025-10-19 15:33:14'),
(25, NULL, 'user', 'cách pha cà phê đen đá', '2025-10-19 15:38:18'),
(26, NULL, 'bot', 'Chào bạn, cà phê đen đá là một thức uống quen thuộc và rất dễ pha chế tại nhà. Tuy hiện tại Mocha House chưa có hướng dẫn pha chế chi tiết cho món này, nhưng mình có thể chia sẻ với bạn cách pha cà phê đen đá đơn giản như sau:\n\n**Nguyên liệu:**\n\n*   Cà phê bột nguyên chất (Robusta hoặc Arabica tùy sở thích)\n*   Nước sôi\n*   Đường (tùy khẩu vị)\n*   Đá viên\n\n**Cách pha:**\n\n1.  **Pha cà phê phin:** Cho khoảng 2-3 muỗng cà phê bột vào phin. Lắc nhẹ cho cà phê dàn đều. Chế một ít nước sôi vào (khoảng 20-30ml) để cà phê ngấm đều, đợi khoảng 1-2 phút.\n2.  **Ủ cà phê:** Chế thêm nước sôi đầy phin. Đậy nắp và đợi cà phê nhỏ giọt xuống hết.\n3.  **Pha chế:** Cho đá viên vào ly. Thêm lượng đường tùy theo khẩu vị.\n4.  **Thưởng thức:** Rót cà phê đã pha từ phin vào ly đá. Khuấy đều và thưởng thức!\n\n**Lưu ý:**\n\n*   Bạn có thể điều chỉnh lượng cà phê và đường tùy theo khẩu vị cá nhân.\n*   Để cà phê ngon hơn, bạn có thể sử dụng nước tinh khiết.\n*   Nếu không có phin, bạn có thể sử dụng các loại máy pha cà phê tại nhà hoặc pha cà phê hòa tan.\n', '2025-10-19 15:38:18'),
(27, NULL, 'user', 'latte', '2025-10-19 16:02:18'),
(28, NULL, 'bot', 'Latte là gì vậy bạn nhỉ? Bạn muốn biết về Latte nói chung hay Latte của Mocha House ạ? Nếu bạn muốn biết về Latte của Mocha House thì bên mình có Latte nóng với giá 59.000đ ạ.\n', '2025-10-19 16:02:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `stock_quantity` decimal(12,3) NOT NULL,
  `min_stock` decimal(12,3) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL,
  `menu_name` varchar(255) NOT NULL,
  `menu_category_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `import_price` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `sweetness_level` enum('low','medium','high') DEFAULT NULL,
  `temperature` enum('hot','cold') DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `tutorial` text DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `menu`
--

INSERT INTO `menu` (`menu_id`, `menu_name`, `menu_category_id`, `description`, `quantity`, `import_price`, `price`, `sweetness_level`, `temperature`, `image_url`, `is_active`, `tutorial`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Latte Hạnh Nhân', 1, NULL, 82, 35400, 59000, 'medium', 'hot', '/assets/menu/Latte Hạnh Nhân.png', 1, NULL, 1, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(2, 'Latte Hazelnut', 1, NULL, 71, 35400, 59000, 'medium', 'hot', '/assets/menu/Latte Hazelnut.png', 1, NULL, 1, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(3, 'Latte Bạc Xỉu', 1, NULL, 12, 29400, 49000, 'medium', 'hot', '/assets/menu/Latte Bạc Xỉu.png', 1, NULL, 1, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(4, 'Latte Classic', 1, NULL, 47, 33000, 55000, 'medium', 'hot', '/assets/menu/Latte Classic.png', 1, NULL, 1, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(5, 'Espresso Đá', 1, NULL, 99, 29400, 49000, 'medium', 'cold', '/assets/menu/Espresso Đá.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(6, 'Cappuccino Đá', 1, NULL, 52, 33000, 55000, 'medium', 'cold', '/assets/menu/Cappuccino Đá.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(7, 'Caramel Macchiato Đá', 1, NULL, 63, 39000, 65000, 'high', 'cold', '/assets/menu/Caramel Macchiato Đá.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(8, 'Caramel Macchiato Nóng', 1, NULL, 60, 41400, 69000, 'high', 'hot', '/assets/menu/Caramel Macchiato Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(9, 'Americano Nóng', 1, NULL, 9, 27000, 45000, 'low', 'hot', '/assets/menu/Americano Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(10, 'Cappuccino Nóng', 1, NULL, 66, 33000, 55000, 'medium', 'hot', '/assets/menu/Cappuccino Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(11, 'Espresso Nóng', 1, NULL, 3, 27000, 45000, 'low', 'hot', '/assets/menu/Espresso Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(12, 'Latte Nóng', 1, NULL, 18, 35400, 59000, 'medium', 'hot', '/assets/menu/Latte Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(13, 'Bạc Xỉu', 2, NULL, 80, 23400, 39000, 'high', 'cold', '/assets/menu/Bạc Xỉu.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(14, 'Bạc Xỉu Nóng', 2, NULL, 47, 23400, 39000, 'high', 'hot', '/assets/menu/Bạc Xỉu Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(15, 'Cà Phê Đen Nóng', 2, NULL, 95, 23400, 39000, 'low', 'hot', '/assets/menu/Cà Phê Đen Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(16, 'Cà Phê Sữa Nóng', 2, NULL, 30, 23400, 39000, 'medium', 'hot', '/assets/menu/Cà Phê Sữa Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(17, 'Cà Phê Đen Đá', 2, NULL, 68, 23400, 39000, 'low', 'cold', '/assets/menu/Cà Phê Đen Đá.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(18, 'Cà Phê Sữa Đá', 2, NULL, 47, 23400, 39000, 'medium', 'cold', '/assets/menu/Cà Phê Sữa Đá.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(19, 'A-Mê Classic', 3, NULL, 32, 23400, 39000, 'medium', 'cold', '/assets/menu/A-Mê Classic.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(20, 'A-Mê Đào', 3, NULL, 19, 29400, 49000, 'medium', 'cold', '/assets/menu/A-Mê Đào.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(21, 'A-Mê Mơ', 3, NULL, 1, 29400, 49000, 'medium', 'cold', '/assets/menu/A-Mê Mơ.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(22, 'A-Mê Thanh Yên', 3, NULL, 50, 29400, 49000, 'medium', 'cold', '/assets/menu/A-Mê Thanh Yên.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(23, 'A-Mê Tuyết Quất', 3, NULL, 45, 35400, 59000, 'medium', 'cold', '/assets/menu/A-Mê Tuyết Quất.png', 1, NULL, 1, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(24, 'Oolong Tứ Quý Sen (Nóng)', 4, NULL, 76, 35400, 59000, 'low', 'hot', '/assets/menu/Oolong Tứ Quý Sen (Nóng).png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(25, 'Oolong Tứ Quý Sen', 4, NULL, 42, 29400, 49000, 'low', 'cold', '/assets/menu/Oolong Tứ Quý Sen.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(26, 'Oolong Tứ Quý Dâu Trân Châu', 4, NULL, 83, 29400, 49000, 'medium', 'cold', '/assets/menu/Oolong Tứ Quý Dâu Trân Châu.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(27, 'Oolong Tứ Quý Vải', 4, NULL, 90, 29400, 49000, 'medium', 'cold', '/assets/menu/Oolong Tứ Quý Vải.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(28, 'Trà Sữa Oolong Nướng Sương Sáo', 5, NULL, 0, 33000, 55000, 'high', 'cold', '/assets/menu/Trà Sữa Oolong Nướng Sương Sáo.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(29, 'Trà Sữa Oolong Tứ Quý Sương Sáo', 5, NULL, 33, 33000, 55000, 'high', 'cold', '/assets/menu/Trà Sữa Oolong Tứ Quý Sương Sáo.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(30, 'Hồng Trà Sữa Nóng', 5, NULL, 65, 33000, 55000, 'high', 'hot', '/assets/menu/Hồng Trà Sữa Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(31, 'Hồng Trà Sữa Trân Châu', 5, NULL, 24, 33000, 55000, 'high', 'cold', '/assets/menu/Hồng Trà Sữa Trân Châu.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(32, 'Trà Đen Macchiato', 5, NULL, 27, 33000, 55000, 'medium', 'cold', '/assets/menu/Trà Đen Macchiato.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(33, 'Trà Sữa Oolong BLao', 5, NULL, 64, 23400, 39000, 'high', 'cold', '/assets/menu/Trà Sữa Oolong BLao.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(34, 'Matcha Latte Tây Bắc', 6, NULL, 36, 27000, 45000, 'medium', 'cold', '/assets/menu/Matcha Latte Tây Bắc.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(35, 'Matcha Latte Tây Bắc (Nóng)', 6, NULL, 91, 29400, 49000, 'medium', 'hot', '/assets/menu/Matcha Latte Tây Bắc (Nóng).png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(36, 'Matcha Latte Tây Bắc Sữa Yến Mạch (Nóng)', 6, NULL, 44, 33000, 55000, 'medium', 'hot', '/assets/menu/Matcha Latte Tây Bắc Sữa Yến Mạch (Nóng).png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(37, 'Matcha Latte Tây Bắc Sữa Yến Mạch', 6, NULL, 49, 33000, 55000, 'medium', 'cold', '/assets/menu/Matcha Latte Tây Bắc Sữa Yến Mạch.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(38, 'Matcha Latte', 6, NULL, 12, 33000, 55000, 'medium', 'cold', '/assets/menu/Matcha Latte.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(39, 'Matcha Tây Bắc Trân Châu Hoàng Kim', 6, NULL, 16, 29400, 49000, 'medium', 'cold', '/assets/menu/Matcha Tây Bắc Trân Châu Hoàng Kim.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(40, 'Chocolate Đá', 7, NULL, 45, 33000, 55000, 'medium', 'cold', '/assets/menu/Chocolate Đá.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(41, 'Chocolate Nóng', 7, NULL, 75, 33000, 55000, 'medium', 'hot', '/assets/menu/Chocolate Nóng.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(42, 'Frappe Matcha Tây Bắc', 8, NULL, 38, 39000, 65000, 'medium', 'cold', '/assets/menu/Frappe Matcha Tây Bắc.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(43, 'Frappe Almond', 8, NULL, 69, 39000, 65000, 'medium', 'cold', '/assets/menu/Frappe Almond.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(44, 'Frappe Hazelnut', 8, NULL, 27, 39000, 65000, 'medium', 'cold', '/assets/menu/Frappe Hazelnut.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(45, 'Frappe Choco Chip', 8, NULL, 32, 39000, 65000, 'medium', 'cold', '/assets/menu/Frappe Choco Chip.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(46, 'Bánh Mì Que Chà Bông Phô Mai Bơ Cay', 9, NULL, 78, 13200, 22000, NULL, 'hot', '/assets/menu/Bánh Mì Que Chà Bông Phô Mai Bơ Cay.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(47, 'Bánh Mì Que Bò Nấm Xốt Bơ', 9, NULL, 92, 13200, 22000, NULL, 'hot', '/assets/menu/Bánh Mì Que Bò Nấm Xốt Bơ.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(48, 'Bánh Mì Que Pate Cột Đèn', 9, NULL, 23, 11400, 19000, NULL, 'hot', '/assets/menu/Bánh Mì Que Pate Cột Đèn.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(49, 'Croissant trứng muối', 9, NULL, 43, 23400, 39000, NULL, 'hot', '/assets/menu/Croissant trứng muối.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(50, 'Butter Croissant Sữa Đặc', 9, NULL, 46, 21000, 35000, NULL, 'hot', '/assets/menu/Butter Croissant Sữa Đặc.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(51, 'Chà Bông Phô Mai', 9, NULL, 99, 23400, 39000, NULL, 'hot', '/assets/menu/Chà Bông Phô Mai.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(52, 'Mít Sấy', 10, NULL, 56, 12000, 20000, NULL, NULL, '/assets/menu/Mít Sấy.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(53, 'Mochi Kem Trà Sữa Trân Châu', 10, NULL, 83, 11400, 19000, NULL, NULL, '/assets/menu/Mochi Kem Trà Sữa Trân Châu.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(54, 'Mochi Kem Phúc Bồn Tử', 10, NULL, 48, 11400, 19000, NULL, NULL, '/assets/menu/Mochi Kem Phúc Bồn Tử.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(55, 'Mochi Kem Việt Quất', 10, NULL, 94, 11400, 19000, NULL, NULL, '/assets/menu/Mochi Kem Việt Quất.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(56, 'Mochi Kem Chocolate', 10, NULL, 20, 11400, 19000, NULL, NULL, '/assets/menu/Mochi Kem Chocolate.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(57, 'Mochi Kem Matcha', 10, NULL, 20, 11400, 19000, NULL, NULL, '/assets/menu/Mochi Kem Matcha.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(58, 'Mousse Tiramisu', 10, NULL, 44, 21000, 35000, NULL, NULL, '/assets/menu/Mousse Tiramisu.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(59, 'Mousse Gấu Chocolate', 10, NULL, 56, 23400, 39000, NULL, NULL, '/assets/menu/Mousse Gấu Chocolate.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54'),
(60, 'Butter Croissant', 11, NULL, 51, 17400, 29000, NULL, 'hot', '/assets/menu/Butter Croissant.png', 1, NULL, 0, '2025-10-19 00:45:54', '2025-10-19 00:45:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menu_category`
--

CREATE TABLE `menu_category` (
  `menu_category_id` int(11) NOT NULL,
  `menu_category_name` varchar(255) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `menu_category`
--

INSERT INTO `menu_category` (`menu_category_id`, `menu_category_name`, `is_deleted`) VALUES
(1, 'Cà Phê Máy', 0),
(2, 'Cà Phê Việt Nam', 0),
(3, 'A-Mê', 0),
(4, 'Trà Trái Cây', 0),
(5, 'Trà Sữa', 0),
(6, 'Matcha', 0),
(7, 'Chocolate', 0),
(8, 'Frappe', 0),
(9, 'Bánh mặn', 0),
(10, 'Bánh ngọt', 0),
(11, 'Bánh Pastry', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menu_ingredients`
--

CREATE TABLE `menu_ingredients` (
  `menu_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` decimal(12,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `status` enum('pending','preparing','completed','cancelled','paid') NOT NULL DEFAULT 'pending',
  `total_price` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','banking') DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `staff_id`, `table_id`, `status`, `total_price`, `payment_method`, `created_at`, `updated_at`) VALUES
(6, 2, 1, 1, 'paid', 155000.00, 'cash', '2025-09-01 10:23:00', '2025-09-01 10:40:00'),
(7, 2, 1, 2, 'paid', 98000.00, 'banking', '2025-09-12 15:45:00', '2025-09-12 16:00:00'),
(8, 2, 1, 1, 'paid', 132000.00, 'cash', '2025-09-25 09:10:00', '2025-09-25 09:35:00'),
(9, 2, 1, 3, 'paid', 165000.00, 'banking', '2025-10-05 14:22:00', '2025-10-05 14:45:00'),
(10, 2, 1, 2, 'paid', 118000.00, 'cash', '2025-10-15 18:15:00', '2025-10-15 18:35:00'),
(11, 3, 1, 1, 'paid', 89000.00, 'cash', '2025-08-25 09:30:00', '2025-08-25 09:50:00'),
(12, 3, 1, 2, 'paid', 135000.00, 'banking', '2025-09-08 13:25:00', '2025-09-08 13:45:00'),
(13, 3, 1, 3, 'paid', 172000.00, 'cash', '2025-09-22 16:20:00', '2025-09-22 16:40:00'),
(14, 3, 1, 2, 'paid', 124000.00, 'banking', '2025-10-03 11:05:00', '2025-10-03 11:30:00'),
(15, 3, 1, 3, 'completed', 97000.00, 'cash', '2025-10-17 19:10:00', '2025-10-17 19:25:00'),
(16, 2, 1, 1, 'paid', 155000.00, 'cash', '2025-09-01 10:23:00', '2025-09-01 10:40:00'),
(17, 2, 1, 2, 'paid', 98000.00, 'banking', '2025-09-12 15:45:00', '2025-09-12 16:00:00'),
(18, 2, 1, 1, 'paid', 132000.00, 'cash', '2025-09-25 09:10:00', '2025-09-25 09:35:00'),
(19, 2, 1, 3, 'paid', 165000.00, 'banking', '2025-10-05 14:22:00', '2025-10-05 14:45:00'),
(20, 2, 1, 2, 'paid', 118000.00, 'cash', '2025-10-15 18:15:00', '2025-10-15 18:35:00'),
(21, 3, 1, 1, 'paid', 89000.00, 'cash', '2025-08-25 09:30:00', '2025-08-25 09:50:00'),
(22, 3, 1, 2, 'paid', 135000.00, 'banking', '2025-09-08 13:25:00', '2025-09-08 13:45:00'),
(23, 3, 1, 3, 'paid', 172000.00, 'cash', '2025-09-22 16:20:00', '2025-09-22 16:40:00'),
(24, 3, 1, 2, 'paid', 124000.00, 'banking', '2025-10-03 11:05:00', '2025-10-03 11:30:00'),
(25, 3, 1, 3, 'completed', 97000.00, 'cash', '2025-10-17 19:10:00', '2025-10-17 19:25:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `menu_id`, `quantity`, `note`, `created_at`, `updated_at`) VALUES
(28, 6, 1, 1, 'Không đường', '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(29, 6, 4, 1, NULL, '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(30, 7, 2, 2, NULL, '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(31, 8, 5, 1, 'Ít đá', '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(32, 8, 9, 1, NULL, '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(33, 9, 6, 1, NULL, '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(34, 9, 8, 2, 'Thêm ngọt', '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(35, 10, 3, 1, NULL, '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(36, 10, 13, 1, 'Mang đi', '2025-10-19 01:18:58', '2025-10-19 01:18:58'),
(37, 11, 2, 1, 'Thêm đá', '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(38, 11, 5, 1, NULL, '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(39, 12, 3, 2, NULL, '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(40, 12, 7, 1, NULL, '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(41, 13, 4, 1, NULL, '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(42, 13, 9, 1, 'Ít ngọt', '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(43, 14, 1, 1, NULL, '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(44, 14, 6, 1, 'Không đá', '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(45, 15, 2, 1, 'Mang đi', '2025-10-19 01:20:04', '2025-10-19 01:20:04'),
(46, 16, 19, 1, 'Không đường', '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(47, 16, 27, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(48, 17, 1, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(49, 18, 19, 1, 'Ít đá', '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(50, 18, 9, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(51, 19, 4, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(52, 19, 5, 2, 'Thêm ngọt', '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(53, 20, 2, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(54, 20, 3, 1, 'Mang đi', '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(55, 21, 1, 1, 'Thêm đá', '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(56, 21, 10, 2, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(57, 22, 2, 2, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(58, 22, 6, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(59, 23, 24, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(60, 23, 9, 1, 'Ít ngọt', '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(61, 24, 7, 1, NULL, '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(62, 24, 4, 1, 'Không đá', '2025-10-19 01:21:39', '2025-10-19 01:21:39'),
(63, 25, 1, 1, 'Mang đi', '2025-10-19 01:21:39', '2025-10-19 01:21:39');

--
-- Bẫy `order_items`
--
DELIMITER $$
CREATE TRIGGER `trg_after_insert_order_item` AFTER INSERT ON `order_items` FOR EACH ROW BEGIN
    DECLARE item_price DECIMAL(12,2);
    DECLARE item_total DECIMAL(12,2);

    -- Lấy giá của món
    SELECT price INTO item_price 
    FROM menu 
    WHERE menu_id = NEW.menu_id;

    SET item_total = item_price * NEW.quantity;

    -- 1️⃣ Cập nhật tổng giá trị đơn hàng
    UPDATE orders
    SET total_price = (
        SELECT COALESCE(SUM(m.price * oi.quantity),0)
        FROM order_items oi
        JOIN menu m ON m.menu_id = oi.menu_id
        WHERE oi.order_id = NEW.order_id
    ),
    updated_at = NOW()
    WHERE order_id = NEW.order_id;

    -- 2️⃣ Trừ nguyên liệu tồn kho
    UPDATE ingredients i
    JOIN menu_ingredients mi ON mi.ingredient_id = i.ingredient_id
    SET i.stock_quantity = i.stock_quantity - (mi.quantity * NEW.quantity),
        i.updated_at = NOW()
    WHERE mi.menu_id = NEW.menu_id;

    -- 3️⃣ Cập nhật doanh thu tháng hiện tại
    INSERT INTO business (month, year, staff_salary, eletricity_bill, water_bill, rent, other, revenue, net_profit, total_order)
    VALUES (MONTH(NOW()), YEAR(NOW()), 0,0,0,0,0, item_total, 0, 1)
    ON DUPLICATE KEY UPDATE 
        revenue = revenue + item_total,
        total_order = total_order + 1;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_after_update_order_item` AFTER UPDATE ON `order_items` FOR EACH ROW BEGIN
    DECLARE old_qty INT;
    DECLARE diff_qty INT;

    SET old_qty = OLD.quantity;
    SET diff_qty = NEW.quantity - OLD.quantity;

    -- 1️⃣ Cập nhật tổng giá trị đơn hàng
    UPDATE orders
    SET total_price = (
        SELECT COALESCE(SUM(m.price * oi.quantity),0)
        FROM order_items oi
        JOIN menu m ON m.menu_id = oi.menu_id
        WHERE oi.order_id = NEW.order_id
    ),
    updated_at = NOW()
    WHERE order_id = NEW.order_id;

    -- 2️⃣ Nếu có chênh lệch số lượng => điều chỉnh tồn kho
    IF diff_qty <> 0 THEN
        UPDATE ingredients i
        JOIN menu_ingredients mi ON mi.ingredient_id = i.ingredient_id
        SET i.stock_quantity = i.stock_quantity - (mi.quantity * diff_qty),
            i.updated_at = NOW()
        WHERE mi.menu_id = NEW.menu_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_business_after_insert` AFTER INSERT ON `order_items` FOR EACH ROW BEGIN
    DECLARE order_month INT;
    DECLARE order_year INT;
    DECLARE order_total DECIMAL(15,2);

    -- Lấy tháng và năm từ bảng orders
    SELECT MONTH(created_at), YEAR(created_at)
    INTO order_month, order_year
    FROM orders
    WHERE order_id = NEW.order_id;

    -- Cập nhật doanh thu của tháng/năm đó
    INSERT INTO business (month, year, revenue, total_order)
    VALUES (order_month, order_year, (NEW.quantity * (SELECT price FROM menu WHERE menu_id = NEW.menu_id)), 1)
    ON DUPLICATE KEY UPDATE
        revenue = revenue + (NEW.quantity * (SELECT price FROM menu WHERE menu_id = NEW.menu_id)),
        total_order = (
            SELECT COUNT(DISTINCT o.order_id)
            FROM orders o
            WHERE MONTH(o.created_at) = order_month AND YEAR(o.created_at) = order_year
        );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_business_after_update` AFTER UPDATE ON `order_items` FOR EACH ROW BEGIN
    DECLARE order_month INT;
    DECLARE order_year INT;
    DECLARE diff DECIMAL(15,2);

    SELECT MONTH(created_at), YEAR(created_at)
    INTO order_month, order_year
    FROM orders
    WHERE order_id = NEW.order_id;

    SET diff = (NEW.quantity * (SELECT price FROM menu WHERE menu_id = NEW.menu_id))
             - (OLD.quantity * (SELECT price FROM menu WHERE menu_id = OLD.menu_id));

    UPDATE business
    SET revenue = revenue + diff
    WHERE month = order_month AND year = order_year;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recommendations`
--

CREATE TABLE `recommendations` (
  `rec_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `score` decimal(6,3) NOT NULL,
  `generated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `report`
--

CREATE TABLE `report` (
  `id_report` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `report_category` enum('feedback','report','complaint','review','suggestion','other') NOT NULL DEFAULT 'feedback',
  `content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `request`
--

CREATE TABLE `request` (
  `id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `request_category` enum('call_staff','payment') NOT NULL DEFAULT 'call_staff',
  `status` tinyint(1) NOT NULL,
  `time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `request`
--

INSERT INTO `request` (`id`, `table_id`, `order_id`, `customer_id`, `request_category`, `status`, `time`) VALUES
(1, 6, NULL, 4, 'call_staff', 0, '00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sales_forecast`
--

CREATE TABLE `sales_forecast` (
  `forecast_id` bigint(20) NOT NULL,
  `forecast_date` date NOT NULL,
  `predicted_revenue` decimal(14,2) NOT NULL,
  `predicted_profit` decimal(14,2) NOT NULL,
  `predicted_total_order` decimal(14,2) NOT NULL,
  `recommended_stock` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recommended_stock`)),
  `model_version` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sales_forecast`
--

INSERT INTO `sales_forecast` (`forecast_id`, `forecast_date`, `predicted_revenue`, `predicted_profit`, `predicted_total_order`, `recommended_stock`, `model_version`, `created_at`) VALUES
(1, '2025-10-01', 105280000.00, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-22 18:06:28'),
(2, '2025-10-01', 105280000.00, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 10:34:45'),
(3, '2025-10-01', 105280000.00, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 10:35:08'),
(4, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:12:50'),
(5, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:12:56'),
(6, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:13:40'),
(7, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:13:46'),
(8, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:14:52'),
(9, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:14:55'),
(10, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:19:10'),
(11, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:19:13'),
(12, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:20:34'),
(13, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:20:37'),
(14, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:23:20'),
(15, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:23:39'),
(16, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:25:02'),
(17, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:25:05'),
(18, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:25:51'),
(19, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:25:58'),
(20, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:26:59'),
(21, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:27:03'),
(22, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:27:16'),
(23, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:27:21'),
(24, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:28:51'),
(25, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:28:57'),
(26, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:28:58'),
(27, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:29:01'),
(28, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:35:55'),
(29, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:35:59'),
(30, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:40:50'),
(31, '2025-10-01', 105272853.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:40:54'),
(32, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:40:54'),
(33, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:40:59'),
(34, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:43:09'),
(35, '2025-10-01', 112131253.33, 0.00, 0.00, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 20:55:02'),
(36, '2025-10-01', 105272853.33, 24062666.67, 3147.27, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 21:35:08'),
(37, '2025-10-01', 112131253.33, 29182000.00, 3333.87, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 21:35:32'),
(38, '2025-10-01', 112131253.33, 29182000.00, 3333.87, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 21:39:10'),
(39, '2025-10-01', 112131253.33, 29182000.00, 3333.87, '{\"note\":\"Tạm thời chưa implement logic stock\"}', 'rf-v1', '2025-10-23 21:39:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff_shifts`
--

CREATE TABLE `staff_shifts` (
  `id_staaff_shifts` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tables`
--

CREATE TABLE `tables` (
  `table_id` int(11) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `table_status` enum('available','pending','preparing','served','paid','unavailable') NOT NULL DEFAULT 'available',
  `zone_id` int(11) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tables`
--

INSERT INTO `tables` (`table_id`, `table_name`, `table_status`, `zone_id`, `is_deleted`) VALUES
(1, 'Bàn S1', 'available', 1, 0),
(2, 'Bàn S2', 'paid', 1, 0),
(3, 'Bàn S3', 'served', 1, 0),
(4, 'Bàn S4', 'unavailable', 1, 0),
(5, 'Bàn T1-1', 'available', 2, 0),
(6, 'Bàn T1-2', 'preparing', 2, 0),
(7, 'Bàn T1-3', 'served', 2, 0),
(8, 'Bàn T1-4', 'paid', 2, 0),
(9, 'Bàn T2-1', 'available', 3, 0),
(10, 'Bàn T2-2', 'pending', 3, 0),
(11, 'Bàn T2-3', 'preparing', 3, 0),
(12, 'Bàn T2-4', 'served', 3, 0),
(13, 'Bàn BC2-1', 'available', 4, 0),
(14, 'Bàn BC2-2', 'pending', 4, 0),
(15, 'Bàn BC2-3', 'served', 4, 0),
(16, 'Bàn BC2-4', 'paid', 4, 0),
(17, 'Bàn T3-1', 'available', 5, 0),
(18, 'Bàn T3-2', 'pending', 5, 0),
(19, 'Bàn T3-3', 'preparing', 5, 0),
(20, 'Bàn T3-4', 'unavailable', 5, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','barista','customer') NOT NULL DEFAULT 'customer',
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password`, `role`, `avatar`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', '0123456789', '$2b$08$CcbxxPdofDE5.P4uo3uaUepVc9vrTc9i3Dla4u3pw5aIuZj2z3M/m', 'admin', '/assets/avatar/messi.jpg', 1, 0, '2025-10-19 00:51:47', '2025-10-19 00:51:47'),
(2, 'Vũ Thương Hiếu', 'vth2003@gmail.com', '0354581069', '$2b$08$MXFC2euuHNJheCdToyWtjOp9xLIH.fawKHbHYz/eIDDga91UVxYj2', 'customer', '/assets/avatar/1760811949574.jpg', 1, 0, '2025-10-19 01:02:17', '2025-10-19 01:02:17'),
(3, 'Đinh Hoàng Trung Khánh', 'pytago02@gmail.com', '0898284203', '$2b$08$KWi8EZ8po.qHmJaFWVlSQOonA7eh3mZCg9Rpp0nXCP5/B3.LvBxsK', 'customer', '/assets/avatar/1760811975817.jpg', 1, 0, '2025-10-19 01:02:43', '2025-10-19 01:02:43'),
(4, 'Nhân viên thu ngân', 'staff01@gmail.com', '099988877', '$2b$08$S2ExLsK8wgSGevMHEw.EE.zEVkJniyVUPXARPsW9ZKo/pZRqQDOJS', 'staff', NULL, 1, 0, '2025-10-19 01:03:26', '2025-10-19 01:03:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_preferences`
--

CREATE TABLE `user_preferences` (
  `pref_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `sweetness_level` enum('low','medium','high') DEFAULT NULL,
  `temperature` enum('hot','cold') DEFAULT NULL,
  `weight` decimal(6,3) NOT NULL DEFAULT 1.000,
  `last_updated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `zone`
--

CREATE TABLE `zone` (
  `zone_id` int(11) NOT NULL,
  `zone_name` varchar(255) NOT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `zone`
--

INSERT INTO `zone` (`zone_id`, `zone_name`, `is_deleted`) VALUES
(1, 'Ngoài sân', 0),
(2, 'Tầng 1', 0),
(3, 'Tầng 2', 0),
(4, 'Ban công tầng 2', 0),
(5, 'Tầng 3', 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `chatbot_logs`
--
ALTER TABLE `chatbot_logs`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredient_id`);

--
-- Chỉ mục cho bảng `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`),
  ADD KEY `id_menu_category` (`menu_category_id`);

--
-- Chỉ mục cho bảng `menu_category`
--
ALTER TABLE `menu_category`
  ADD PRIMARY KEY (`menu_category_id`);

--
-- Chỉ mục cho bảng `menu_ingredients`
--
ALTER TABLE `menu_ingredients`
  ADD PRIMARY KEY (`menu_id`,`ingredient_id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `table_id` (`table_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Chỉ mục cho bảng `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`rec_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Chỉ mục cho bảng `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id_report`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `sales_forecast`
--
ALTER TABLE `sales_forecast`
  ADD PRIMARY KEY (`forecast_id`);

--
-- Chỉ mục cho bảng `staff_shifts`
--
ALTER TABLE `staff_shifts`
  ADD PRIMARY KEY (`id_staaff_shifts`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`table_id`),
  ADD KEY `zone_id` (`zone_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Chỉ mục cho bảng `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`pref_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`zone_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `business`
--
ALTER TABLE `business`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `chatbot_logs`
--
ALTER TABLE `chatbot_logs`
  MODIFY `chat_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT cho bảng `menu_category`
--
ALTER TABLE `menu_category`
  MODIFY `menu_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT cho bảng `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `rec_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `report`
--
ALTER TABLE `report`
  MODIFY `id_report` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `request`
--
ALTER TABLE `request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `sales_forecast`
--
ALTER TABLE `sales_forecast`
  MODIFY `forecast_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `staff_shifts`
--
ALTER TABLE `staff_shifts`
  MODIFY `id_staaff_shifts` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tables`
--
ALTER TABLE `tables`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `user_preferences`
--
ALTER TABLE `user_preferences`
  MODIFY `pref_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `zone`
--
ALTER TABLE `zone`
  MODIFY `zone_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chatbot_logs`
--
ALTER TABLE `chatbot_logs`
  ADD CONSTRAINT `chatbot_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`menu_category_id`) REFERENCES `menu_category` (`menu_category_id`);

--
-- Các ràng buộc cho bảng `menu_ingredients`
--
ALTER TABLE `menu_ingredients`
  ADD CONSTRAINT `menu_ingredients_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`),
  ADD CONSTRAINT `menu_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`);

--
-- Các ràng buộc cho bảng `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`);

--
-- Các ràng buộc cho bảng `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`),
  ADD CONSTRAINT `request_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `request_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `staff_shifts`
--
ALTER TABLE `staff_shifts`
  ADD CONSTRAINT `staff_shifts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zone` (`zone_id`);

--
-- Các ràng buộc cho bảng `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD CONSTRAINT `user_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
