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
