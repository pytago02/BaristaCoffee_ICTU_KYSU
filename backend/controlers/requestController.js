const db = require("../db");

// 🟡 Lấy danh sách yêu cầu chưa xử lý theo loại
exports.getPendingRequests = (req, res) => {
  const { category } = req.query; // 'call_staff' | 'payment'

  const sql = `
    SELECT 
      r.id AS request_id,
      r.table_id,
      t.table_name,
      z.zone_name,
      u.full_name AS customer_name,
      r.request_category,
      r.status,
      r.time
    FROM request r
    LEFT JOIN tables t ON r.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    LEFT JOIN users u ON r.customer_id = u.user_id
    WHERE r.status = 0
    ${category ? `AND r.request_category = ?` : ""}
    ORDER BY r.time DESC
  `;

  db.query(sql, category ? [category] : [], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách yêu cầu" });
    }
    res.json(results);
  });
};

exports.updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE request SET status = 1 WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi cập nhật yêu cầu" });
    res.json({
      message: "Đã xử lý yêu cầu",
      affectedRows: result.affectedRows,
    });
  });
};

// Gọi nhân viên
exports.callStaff = (req, res) => {
  const { table_id, order_id, customer_id } = req.body;
  if (!table_id) return res.status(400).json({ message: "Thiếu table_id" });

  const sql = `
    INSERT INTO request (table_id, order_id, customer_id, request_category)
    VALUES (?, ?, ?, 'call_staff')
  `;

  db.query(sql, [table_id, order_id, customer_id || null], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi khi gọi nhân viên", err });

    const io = req.app.get("io");
    const newRequest = {
      request_id: result.insertId,
      table_id,
      order_id,
      customer_id,
      type: "call_staff",
      created_at: new Date(),
    };

    io.emit("staffCalled", newRequest)

    return res.json({ message: "Đã gửi yêu cầu gọi nhân viên!", request: newRequest });
  });
};


// Yêu cầu thanh toán
exports.requestPayment = (req, res) => {
  const { table_id, order_id, customer_id } = req.body;
  if (!table_id) return res.status(400).json({ message: "Thiếu table_id" });

  const sql = `
    INSERT INTO request (table_id, order_id, customer_id, request_category)
    VALUES (?, ?, ?, 'payment')
  `;

  db.query(sql, [table_id, order_id, customer_id || null], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Lỗi khi yêu cầu thanh toán", err });

    const io = req.app.get("io");
    const newRequest = {
      request_id: result.insertId,
      table_id,
      order_id,
      customer_id,
      type: "payment",
      created_at: new Date(),
    };

    io.emit("paymentRequested", newRequest); // 💰 emit socket

    res.json({ message: "Đã gửi yêu cầu thanh toán!", request: newRequest });
  });
};
