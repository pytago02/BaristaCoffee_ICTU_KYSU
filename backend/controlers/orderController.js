const db = require("../db");

exports.getAllOrder = (req, res) => {
  db.query(
    `
    SELECT 
        o.order_id,
        o.created_at AS order_date,
        o.status,
        o.payment_method,
        o.total_price,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        s.full_name AS staff_name,
        t.table_name,
        z.zone_name,
        m.menu_name AS menu_item,
        m.image_url,
        oi.quantity,
        m.price,
        oi.note,
        (oi.quantity * m.price) AS item_total
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.user_id
    LEFT JOIN users s ON o.staff_id = s.user_id
    LEFT JOIN tables t ON o.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu m ON oi.menu_id = m.menu_id
    ORDER BY o.created_at DESC, oi.order_item_id ASC;
    `,
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách order", err });
      }

      // Nhóm theo order_id
      const ordersMap = new Map();

      results.forEach((row) => {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            order_id: row.order_id,
            order_date: row.order_date,
            status: row.status,
            payment_method: row.payment_method,
            total_price: row.total_price,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            staff_name: row.staff_name,
            table_name: row.table_name,
            zone_name: row.zone_name,
            items: [],
          });
        }

        ordersMap.get(row.order_id).items.push({
          menu_item: row.menu_item,
          quantity: row.quantity,
          price: row.price,
          item_total: row.item_total,
          note: row.note,
          image_url: row.image_url,
        });
      });

      res.json(Array.from(ordersMap.values()));
    }
  );
};

exports.getOrdersByDate = (req, res) => {
  const { date } = req.query; // format: YYYY-MM-DD

  if (!date) {
    return res.status(400).json({ error: "Thiếu tham số date (YYYY-MM-DD)" });
  }

  db.query(
    `
    SELECT 
        o.order_id,
        o.created_at AS order_date,
        o.status,
        o.payment_method,
        o.total_price,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        s.full_name AS staff_name,
        t.table_name,
        z.zone_name,
        m.menu_name AS menu_item,
        m.image_url,
        oi.quantity,
        m.price,
        oi.note,
        (oi.quantity * m.price) AS item_total
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.user_id
    LEFT JOIN users s ON o.staff_id = s.user_id
    LEFT JOIN tables t ON o.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu m ON oi.menu_id = m.menu_id
    WHERE DATE(o.created_at) = ?
    ORDER BY o.created_at DESC, oi.order_item_id ASC;
    `,
    [date],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách order", err });
      }

      const orders = {};
      results.forEach((row) => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            order_date: row.order_date,
            status: row.status,
            payment_method: row.payment_method,
            total_price: row.total_price,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            staff_name: row.staff_name,
            table_name: row.table_name,
            zone_name: row.zone_name,
            items: [],
          };
        }
        orders[row.order_id].items.push({
          menu_item: row.menu_item,
          quantity: row.quantity,
          price: row.price,
          item_total: row.item_total,
          note: row.note,
          image_url: row.image_url,
        });
      });

      res.json(Object.values(orders));
    }
  );
};

exports.getOrdersByRange = (req, res) => {
  const { from, to } = req.query; // format: YYYY-MM-DD

  if (!from || !to) {
    return res
      .status(400)
      .json({ error: "Thiếu tham số from hoặc to (YYYY-MM-DD)" });
  }

  db.query(
    `
    SELECT 
        o.order_id,
        o.created_at AS order_date,
        o.status,
        o.payment_method,
        o.total_price,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        s.full_name AS staff_name,
        t.table_name,
        z.zone_name,
        m.menu_name AS menu_item,
        m.image_url,
        oi.quantity,
        m.price,
        oi.note,
        (oi.quantity * m.price) AS item_total
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.user_id
    LEFT JOIN users s ON o.staff_id = s.user_id
    LEFT JOIN tables t ON o.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu m ON oi.menu_id = m.menu_id
    WHERE DATE(o.created_at) BETWEEN ? AND ?
    ORDER BY o.order_id DESC, oi.order_item_id ASC;
    `,
    [from, to],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách order", err });
      }

      const orders = {};
      results.forEach((row) => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            order_date: row.order_date,
            status: row.status,
            payment_method: row.payment_method,
            total_price: row.total_price,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            staff_name: row.staff_name,
            table_name: row.table_name,
            zone_name: row.zone_name,
            items: [],
          };
        }
        orders[row.order_id].items.push({
          menu_item: row.menu_item,
          quantity: row.quantity,
          price: row.price,
          item_total: row.item_total,
          note: row.note,
          image_url: row.image_url,
        });
      });

      res.json(Object.values(orders));
    }
  );
};

exports.getOrdersByCustomerName = (req, res) => {
  const { name } = req.query; // lấy từ query string

  if (!name) {
    return res.status(400).json({ error: "Thiếu tham số name" });
  }

  db.query(
    `
    SELECT 
        o.order_id,
        o.created_at AS order_date,
        o.status,
        o.payment_method,
        o.total_price,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        s.full_name AS staff_name,
        t.table_name,
        z.zone_name,
        m.menu_name AS menu_item,
        oi.quantity,
        m.price,
        oi.note,
        (oi.quantity * m.price) AS item_total
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.user_id
    LEFT JOIN users s ON o.staff_id = s.user_id
    LEFT JOIN tables t ON o.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu m ON oi.menu_id = m.menu_id
    WHERE c.full_name LIKE ?
    ORDER BY o.created_at DESC, oi.order_item_id ASC;
    `,
    [`%${name}%`], // tìm gần đúng
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách order", err });
      }

      // Nhóm dữ liệu theo order_id
      const orders = {};
      results.forEach((row) => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            order_date: row.order_date,
            status: row.status,
            payment_method: row.payment_method,
            total_price: row.total_price,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            staff_name: row.staff_name,
            table_name: row.table_name,
            zone_name: row.zone_name,
            items: [],
          };
        }
        orders[row.order_id].items.push({
          menu_item: row.menu_item,
          quantity: row.quantity,
          price: row.price,
          item_total: row.item_total,
          note: row.note,
        });
      });

      res.json(Object.values(orders));
    }
  );
};

exports.getOrdersByUserId = (req, res) => {
  // const { user_id } = req.query;
  const user_id = req.params.user_id;

  db.query(
    `
    SELECT 
        o.order_id,
        o.created_at AS order_date,
        o.status,
        o.payment_method,
        o.total_price,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        s.full_name AS staff_name,
        t.table_name,
        z.zone_name,
        m.menu_name AS menu_item,
        m.image_url,
        oi.quantity,
        m.price,
        oi.note,
        (oi.quantity * m.price) AS item_total
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.user_id
    LEFT JOIN users s ON o.staff_id = s.user_id
    LEFT JOIN tables t ON o.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu m ON oi.menu_id = m.menu_id
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC, oi.order_item_id ASC;
  `,
    [user_id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách order theo user_id", err });
      }

      const orders = new Map();

      results.forEach((row) => {
        if (!orders.has(row.order_id)) {
          orders.set(row.order_id, {
            order_id: row.order_id,
            order_date: row.order_date,
            status: row.status,
            payment_method: row.payment_method,
            total_price: row.total_price,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            staff_name: row.staff_name,
            table_name: row.table_name,
            zone_name: row.zone_name,
            items: [],
          });
        }

        orders.get(row.order_id).items.push({
          menu_item: row.menu_item,
          quantity: row.quantity,
          price: row.price,
          item_total: row.item_total,
          note: row.note,
          image_url: row.image_url,
        });
      });

      res.json(Array.from(orders.values()));
    }
  );
};

// exports.getOrdersByTableId = (req, res) => {
//   const { table_id } = req.params;

//   if (!table_id) {
//     return res.status(400).json({ error: "Thiếu tham số table_id" });
//   }

//   db.query(
//     `
//     SELECT
//         o.order_id,
//         o.created_at AS order_date,
//         o.status,
//         o.payment_method,
//         o.total_price,
//         c.full_name AS customer_name,
//         c.phone AS customer_phone,
//         s.full_name AS staff_name,
//         t.table_name,
//         z.zone_name,
//         m.menu_name AS menu_item,
//         m.image_url,
//         oi.quantity,
//         oi.order_item_id,
//         m.price,
//         oi.note,
//         (oi.quantity * m.price) AS item_total
//     FROM orders o
//     LEFT JOIN users c ON o.customer_id = c.user_id
//     LEFT JOIN users s ON o.staff_id = s.user_id
//     LEFT JOIN tables t ON o.table_id = t.table_id
//     LEFT JOIN zone z ON t.zone_id = z.zone_id
//     JOIN order_items oi ON o.order_id = oi.order_id
//     JOIN menu m ON oi.menu_id = m.menu_id
//     WHERE o.table_id = ?
//     ORDER BY o.created_at DESC, oi.order_item_id ASC;
//     `,
//     [table_id],
//     (err, results) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ error: "Lỗi khi lấy danh sách order theo table_id", err });
//       }

//       const orders = new Map();

//       results.forEach((row) => {
//         if (!orders.has(row.order_id)) {
//           orders.set(row.order_id, {
//             order_id: row.order_id,
//             order_date: row.order_date,
//             status: row.status,
//             payment_method: row.payment_method,
//             total_price: row.total_price,
//             customer_name: row.customer_name,
//             customer_phone: row.customer_phone,
//             staff_name: row.staff_name,
//             table_name: row.table_name,
//             zone_name: row.zone_name,
//             items: [],
//           });
//         }

//         orders.get(row.order_id).items.push({
//           order_item_id: row.order_item_id,
//           menu_item: row.menu_item,
//           quantity: row.quantity,
//           price: row.price,
//           item_total: row.item_total,
//           note: row.note,
//           image_url: row.image_url,
//         });
//       });

//       res.json(Array.from(orders.values()));
//       // console.log("SQL:", sql, params);
//     }
//   );
// };

// POST /orders/add
// GET /orders/table/:table_id
exports.getOrdersByTableId = (req, res) => {
  const { table_id } = req.params;

  if (!table_id) {
    return res.status(400).json({ error: "Thiếu tham số table_id" });
  }

  const sql = `
    SELECT 
        o.order_id,
        o.created_at AS order_date,
        o.status,
        o.payment_method,
        o.total_price,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        s.full_name AS staff_name,
        t.table_name,
        z.zone_name,
        m.menu_name,
        m.image_url,
        oi.quantity,
        oi.order_item_id,
        m.price,
        oi.note,
        (oi.quantity * m.price) AS item_total
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.user_id
    LEFT JOIN users s ON o.staff_id = s.user_id
    LEFT JOIN tables t ON o.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN menu m ON oi.menu_id = m.menu_id
    WHERE o.table_id = ? AND t.table_status != 'available'
    ORDER BY o.created_at DESC, oi.order_item_id ASC;
  `;

  db.query(sql, [table_id], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Lỗi khi lấy danh sách order", err });

    const orders = new Map();

    results.forEach((row) => {
      if (!orders.has(row.order_id)) {
        orders.set(row.order_id, {
          order_id: row.order_id,
          order_date: row.order_date,
          status: row.status,
          payment_method: row.payment_method,
          total_price: row.total_price,
          customer_name: row.customer_name,
          customer_phone: row.customer_phone,
          staff_name: row.staff_name,
          table_name: row.table_name,
          zone_name: row.zone_name,
          items: [],
        });
      }

      if (row.order_item_id) {
        orders.get(row.order_id).items.push({
          order_item_id: row.order_item_id,
          menu_name: row.menu_name,
          quantity: row.quantity,
          price: row.price,
          item_total: row.item_total,
          note: row.note,
          image_url: row.image_url,
        });
      }
    });

    res.json(Array.from(orders.values()));
  });
};

exports.addOrderToTable = (req, res) => {
  const { table_id, staff_id, customer_id, items } = req.body;

  if (!table_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Thiếu dữ liệu" });
  }


  // Kiểm tra order active (pending, preparing, completed nhưng chưa paid)
  const checkSql = `
    SELECT order_id FROM orders
    WHERE table_id = ? AND status IN ('pending','preparing','completed')
    ORDER BY created_at DESC LIMIT 1
  `;

  db.query(checkSql, [table_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Lỗi DB", err });

    let orderId;

    // Tạo order mới
    const customerValue = customer_id || null;

    const createOrder = (callback) => {
      const sql = `
        INSERT INTO orders (staff_id, customer_id, table_id, total_price, status) 
        VALUES (?, ?, ?, 0, 'pending')
      `;
      db.query(sql, [staff_id, customerValue, table_id], (err2, result) => {
        if (err2) return res.status(500).json({ error: "Lỗi tạo order", err2 });
        orderId = result.insertId;
        callback();
      });
    };

    // Thêm items vào order
    const addItems = () => {
      let total = 0;
      const menuIds = items.map((i) => i.menu_id);

      db.query(
        `SELECT menu_id, price FROM menu WHERE menu_id IN (?)`,
        [menuIds],
        (err3, menus) => {
          if (err3)
            return res.status(500).json({ error: "Lỗi lấy giá menu", err3 });

          const priceMap = {};
          menus.forEach((m) => (priceMap[m.menu_id] = m.price));

          const values = items.map((i) => {
            const price = priceMap[i.menu_id] || 0;
            total += price * i.quantity;
            return [orderId, i.menu_id, i.quantity, i.note || null];
          });

          db.query(
            `INSERT INTO order_items (order_id, menu_id, quantity, note) VALUES ?`,
            [values],
            (err4) => {
              if (err4)
                return res
                  .status(500)
                  .json({ error: "Lỗi thêm order items", err4 });

              db.query(
                `UPDATE orders SET total_price = total_price + ? WHERE order_id = ?`,
                [total, orderId]
              );

              // Emit sự kiện qua socket
              const io = req.app.get("io");
              const newOrder = {
                order_id: orderId,
                table_id,
                staff_id,
                items,
                total, 
                created_at: new Date(),
              };

              io.emit("orderCreated", newOrder);

              return res.json({
                message: "Thêm món thành công",
                order_id: orderId,
              });
            }
          );
        }
      );
    };

    if (rows.length > 0) {
      orderId = rows[0].order_id;
      addItems(); // Nếu có order active thì thêm món
    } else {
      createOrder(addItems); // Nếu không thì tạo mới
    }
  });
};

// Update số lượng món trong order
exports.updateOrderItem = (req, res) => {
  const { order_item_id, quantity } = req.body;

  if (!order_item_id || quantity === undefined) {
    return res.status(400).json({ error: "Thiếu dữ liệu" });
  }

  if (quantity <= 0) {
    // Xóa món nếu số lượng = 0
    db.query(
      `UPDATE order_items SET is_active = 0 WHERE order_item_id = ?`,
      [order_item_id],
      (err) => {
        if (err)
          return res.status(500).json({ error: "Lỗi set isActive", err });
        return res.json({ message: "Đã set isActive cho mon" });
      }
    );
  } else {
    db.query(
      `UPDATE order_items oi SET oi.quantity = ? WHERE oi.order_item_id = ?`,
      [quantity, order_item_id],
      (err) => {
        if (err) return res.status(500).json({ error: "Lỗi update item", err });

        // cập nhật lại tổng tiền
        const sql = `
        UPDATE orders o
        JOIN (
          SELECT oi.order_id, SUM(oi.quantity * m.price) as total 
          FROM order_items oi
          JOIN menu m ON oi.menu_id = m.menu_id 
          WHERE oi.order_id = (SELECT order_id FROM order_items WHERE order_item_id = ?)
          GROUP BY oi.order_id
        ) t ON o.order_id = t.order_id
        SET o.total_price = t.total
      `;
        db.query(sql, [order_item_id]);
        return res.json({ message: "Cập nhật số lượng thành công" });
      }
    );
  }
};

// Cập nhật trạng thái order sang 'completed'
exports.updateStatusOrder = (req, res) => {
  const { order_id, status } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: "Thiếu order_id" });
  }

  const sql = `UPDATE orders SET status = ? WHERE order_id = ?`;

  db.query(sql, [status, order_id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Lỗi cập nhật trạng thái", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy order" });
    }

    return res.json({ message: "Order đã chuyển sang completed" });
  });
};

exports.getPendingOrders = (req, res) => {
  const sql = `
    SELECT 
        o.order_id,
        o.created_at AS order_date,
        o.status,
        o.total_price,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        t.table_name,
        z.zone_name
    FROM orders o
    LEFT JOIN users c ON o.customer_id = c.user_id
    LEFT JOIN tables t ON o.table_id = t.table_id
    LEFT JOIN zone z ON t.zone_id = z.zone_id
    WHERE o.status = 'pending'
    ORDER BY o.created_at ASC;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách pending orders", err });
    }

    res.json(results);
  });
};

