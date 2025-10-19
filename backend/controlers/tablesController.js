const db = require("../db");

exports.getAllTables = (req, res) => {
  db.query(
    "SELECT tables.*, zone.zone_name FROM tables JOIN zone ON tables.zone_id = zone.zone_id WHERE tables.is_deleted = 0",
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách tất cả bàn", err });
      }
      res.json(results);
    }
  );
};

exports.getAllTablesByStatus = (req, res) => {
  const status = req.params.status;
  db.query(
    `SELECT tables.*,zone.zone_name 
    FROM tables 
    JOIN zone ON tables.zone_id = zone.zone_id 
    WHERE table_status = ? AND tables.is_deleted = 0`,
    [status],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách bàn theo trạng thái", err });
      }
      res.json(results);
    }
  );
};

// exports.getTablesById = (req, res) => {
//   const id = req.params.id;
//   db.query(
//     `SELECT tables.*, zone.zone_name, 
//     FROM tables 
//     JOIN zone ON tables.zone_id = zone.zone_id 
//     WHERE table_id = ? AND tables.is_deleted = 0`,
//     [id],
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: "Lỗi khi lấy bàn theo ID", err });
//       }
//       res.json(results[0]);
//     }
//   );
// };

exports.getTablesById = (req, res) => {
  const tableId = req.params.id;

  const query = `
    SELECT 
      t.table_id,
      t.table_name,
      t.table_status,
      z.zone_id,
      z.zone_name,

      o.order_id,
      o.status AS order_status,
      o.total_price,
      o.payment_method,
      o.created_at AS order_created_at,

      u.user_id AS customer_id,
      u.full_name AS customer_name,

      oi.order_item_id,
      oi.quantity AS itemQuantity,
      oi.note,

      m.*

    FROM tables t
    JOIN zone z ON t.zone_id = z.zone_id
    LEFT JOIN orders o ON o.table_id = t.table_id AND o.status NOT IN ('paid','cancelled')
    LEFT JOIN users u ON o.customer_id = u.user_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN menu m ON oi.menu_id = m.menu_id
    WHERE t.table_id = ? AND t.is_deleted = 0
    ORDER BY o.created_at DESC, oi.order_item_id ASC
  `;

  db.query(query, [tableId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy dữ liệu bàn và order", err });
    }

    if (!results.length) {
      return res.json({ 
        table_id: tableId, 
        message: "Chưa có order hiện tại cho bàn này" 
      });
    }

    const tableInfo = {
      table_id: results[0].table_id,
      table_name: results[0].table_name,
      table_status: results[0].table_status,
      zone: {
        zone_id: results[0].zone_id,
        zone_name: results[0].zone_name
      },
      orders: []
    };

    const orderMap = {};

    results.forEach(row => {
      if (!row.order_id) return;

      if (!orderMap[row.order_id]) {
        orderMap[row.order_id] = {
          order_id: row.order_id,
          status: row.order_status,
          total_price: row.total_price,
          payment_method: row.payment_method,
          created_at: row.order_created_at,
          customer: row.customer_id ? {
            user_id: row.customer_id,
            full_name: row.customer_name
          } : null,
          items: []
        };
        tableInfo.orders.push(orderMap[row.order_id]);
      }

      if (row.order_item_id) {
        orderMap[row.order_id].items.push({
          order_item_id: row.order_item_id,
          quantity: row.itemQuantity,
          price: row.item_price,
          note: row.note,
          menu: {
            menu_id: row.menu_id,
            name: row.menu_name,
            price: row.menu_price,
            image_url: row.image_url
          }
        });
      }
    });

    // res.json(results );
    res.json(tableInfo);
  });
};

exports.getInforTableById = (req, res)=>{
  const table_id = req.params.table_id;
  db.query(
    `SELECT t.table_id, t.table_name, z.zone_name
      FROM tables t
      JOIN zone z ON t.zone_id = z.zone_id
      WHERE t.table_id = ?`,
    [table_id],
    (err, results)=>{
      if(err){
        return res.status(500).json({error: "error getInforTableById:", err});
      }
      res.json(results);
    }
  )
}


exports.getAllTablesByZone = (req, res) => {
  const zoneId = req.params.zoneId;
  db.query(
    `SELECT tables.*, zone.zone_name 
    FROM tables 
    JOIN zone ON tables.zone_id = zone.zone_id 
    WHERE zone.zone_id = ? AND tables.is_deleted = 0`,
    [zoneId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi lấy danh sách bàn theo khu vực", err });
      }
      res.json(results);
    }
  );
};

exports.getAllZonesWithTables = (req, res) => {
  const query = `
    SELECT 
      z.zone_id, 
      z.zone_name, 
      t.table_id, 
      t.table_name, 
      t.table_status
    FROM zone z
    LEFT JOIN tables t ON z.zone_id = t.zone_id AND t.is_deleted = 0
    WHERE z.is_deleted = 0
    ORDER BY z.zone_id, t.table_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách zone + bàn", err });
    }

    // Group theo zone_id
    const zones = {};
    results.forEach((row) => {
      if (!zones[row.zone_id]) {
        zones[row.zone_id] = {
          zone_id: row.zone_id,
          zone_name: row.zone_name,
          tables: [],
        };
      }
      if (row.table_id) {
        zones[row.zone_id].tables.push({
          table_id: row.table_id,
          table_name: row.table_name,
          table_status: row.table_status,
        });
      }
    });

    res.json(Object.values(zones));
  });
};


exports.createTable = (req, res) => {
  const { table_name, zone_id } = req.body;
  db.query(
    "INSERT INTO tables (table_name, zone_id) VALUES (?, ?)",
    [table_name, zone_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi tạo bàn", err });
      }
      res
        .status(201)
        .json({ message: "Tạo bàn thành công", tableId: results.insertId });
    }
  );
};

exports.updateTable = (req, res) => {
  const { table_name, zone_id, table_status } = req.body;
  const id = req.params.id;
  db.query(
    "UPDATE tables SET table_name = ?, zone_id = ?, table_status = ? WHERE table_id = ?",
    [table_name, zone_id, table_status, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi cập nhật bàn" });
      }
      res.json({ message: "Cập nhật bàn thành công" });
    }
  );
};

exports.deleteTable = (req, res) => {
  const id = req.params.id;
  db.query(
    "UPDATE tables SET is_deleted = 1 WHERE table_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi xóa bàn" });
      }
      res.json({ message: "Xóa bàn thành công" });
    }
  );
};

exports.updateStausTable = (req, res)=>{
  const id = req.params.id;
  const {status} = req.body;
  db.query(
   "UPDATE tables SET table_status = ? WHERE table_id = ?",
   [status, id],
   (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi checkoutTable" });
      }
      res.json({ message: "checkoutTable thành công" });
    }
  )
};
