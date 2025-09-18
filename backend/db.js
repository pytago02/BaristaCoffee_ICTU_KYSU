const mysql = require('mysql2');
require("dotenv").config(); //(Lấy thông tin từ .env) Thư viện dotenv dùng để quản lý biến môi trường, giúp bảo mật thông tin nhạy cảm như mật khẩu cơ sở dữ liệu.

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.error("Lỗi kết nối MySQL:", err);
  else {
    console.log("Kết nối MySQL thành công!");
    console.log("")
  }
});

module.exports = db;
