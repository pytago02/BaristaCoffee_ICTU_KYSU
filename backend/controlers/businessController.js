const db = require("../db");

exports.getAllBusiness = (req, res) => {
  db.query(`SELECT * FROM business`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "error getAllBusiness", err });
    }
    return res.json(results);
  });
};

exports.updateBusiness = (req, res) => {
  const {
    staff_salary,
    eletricity_bill,
    water_bill,
    rent,
    other,
    month,
    year,
  } = req.body;
  db.query(
    `UPDATE business SET staff_salary = ?, eletricity_bill = ?, water_bill = ?, rent = ?, other = ? WHERE month = ? AND year = ?`,
    [staff_salary, eletricity_bill, water_bill, rent, other, month, year],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "error updateBusiness", err });
      }
      return res.json(results);
    }
  );
};

exports.getRevenueByCategory = (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: "Thiếu tháng hoặc năm!" });
  }

  const sql = `
    SELECT 
        mc.menu_category_name AS category_name,
        SUM(oi.quantity * m.price) AS total_revenue
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu m ON oi.menu_id = m.menu_id
    JOIN menu_category mc ON m.menu_category_id = mc.menu_category_id
    WHERE 
        (o.status = 'completed' OR o.status = 'paid')
        AND MONTH(o.created_at) = ?
        AND YEAR(o.created_at) = ?
    GROUP BY 
        mc.menu_category_name
    ORDER BY 
        total_revenue DESC
  `;

  db.query(sql, [month, year], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn SQL:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi lấy dữ liệu!" });
    }

    res.json(results);
  });
};

exports.getForecasts = (req, res) => {
  db.query(
    "SELECT * FROM sales_forecast ORDER BY created_at DESC LIMIT 1",
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });
      res.json(rows[0]);
    }
  );
};

exports.getQuantityOrderItems = (req, res) => {
  const { month, year } = req.query;
  db.query(
    `SELECT 
      m.menu_id,
      m.menu_name,
      m.image_url,
      m.price,
      m.import_price,
      SUM(oi.quantity) AS total_quantity_ordered
  FROM 
      order_items oi
  JOIN 
      orders o ON oi.order_id = o.order_id
  JOIN 
      menu m ON oi.menu_id = m.menu_id
  WHERE 
      MONTH(o.created_at) = ?
      AND YEAR(o.created_at) = ?
      AND o.status IN ('paid')
  GROUP BY 
      m.menu_id, m.menu_name
  ORDER BY 
      total_quantity_ordered DESC;
  `,
    [month, year],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error getQuantityOrderItems", err });
      }
      res.json(results);
    }
  );
};

exports.getBusinessToday = async (req, res) => {
  try {
    const [order] = await db
      .promise()
      .query(
        `SELECT COUNT(*) AS total_orders FROM orders WHERE DATE(created_at) = CURDATE()`
      );

    const [revenue] = await db
      .promise()
      .query(
        `SELECT SUM(total_price) AS total_revenue FROM orders WHERE DATE(created_at) = CURDATE() AND status IN ('completed', 'paid')`
      );

    const [hotItem] = await db.promise().query(
      `SELECT m.menu_name, m.image_url, SUM(oi.quantity) AS total_quantity
       FROM order_items oi
       JOIN menu m ON oi.menu_id = m.menu_id
       WHERE DATE(oi.created_at) = CURDATE()
       GROUP BY m.menu_id
       ORDER BY total_quantity DESC
       LIMIT 1`
    );

    res.json({
      total_orders: order[0]?.total_orders || 0,
      total_revenue: revenue[0]?.total_revenue || "0.00",
      menu_name: hotItem[0]?.menu_name || null,
      total_quantity: hotItem[0]?.total_quantity || "0",
      image_url: hotItem[0]?.image_url || null,
    });
  } catch (err) {
    res.status(500).json({ error: "error getBusinessToday", err });
  }
};

exports.getHotTables = (req, res) => {
  const { month, year } = req.query;
  db.query(
    `
    SELECT t.*, COUNT(o.table_id) AS reservation_count
    FROM tables t
    JOIN orders o ON t.table_id = o.table_id
    WHERE MONTH(o.created_at) = ? AND YEAR(o.created_at) = ?
    GROUP BY t.table_id
    ORDER BY reservation_count DESC
    `,
    [month, year],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error getHotTable", details: err });
      }
      res.json(results);
    }
  );
};

exports.getQuantityItemByMonth = (req, res) => {
  const menu_id = req.body.menu_id;
  db.query(
    `
    SELECT
    m.menu_name,
    SUM(oi.quantity) AS total_quantity,
    MONTH(o.created_at) AS month,
    YEAR(o.created_at) AS year
    FROM menu m
    JOIN order_items oi ON m.menu_id = oi.menu_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE m.menu_id = ?
    GROUP BY year, month
    ORDER BY year, month
    LIMIT 12
    `,
    [menu_id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error getQuantityItemByMonth", err });
      }
      res.json(results);
    }
  );
};
