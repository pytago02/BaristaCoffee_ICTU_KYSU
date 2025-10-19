const db = require("../db");

// Lấy tổng số đơn hàng của user
const getOrderCount = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) AS cnt FROM orders WHERE customer_id = ?`;
    db.query(sql, [user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].cnt);
    });
  });
};

// Bestseller
const getBestsellers = (limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT m.*, SUM(oi.quantity) AS sold
      FROM order_items oi
      JOIN menu m ON m.menu_id = oi.menu_id
      GROUP BY m.menu_id
      ORDER BY sold DESC
      LIMIT ?`;
    db.query(sql, [limit], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Gợi ý dựa trên lịch sử cá nhân
const getHistoryBased = (user_id, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT m.*, SUM(oi.quantity) AS my_count
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN menu m ON m.menu_id = oi.menu_id
      WHERE o.customer_id = ?
      GROUP BY m.menu_id
      ORDER BY my_count DESC
      LIMIT ?`;
    db.query(sql, [user_id, limit], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Gợi ý dựa trên sở thích
const getPreferenceBased = (user_id, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT DISTINCT m.*
      FROM user_preferences up
      JOIN menu m ON (
        m.sweetness_level = up.sweetness_level
        OR m.temperature = up.temperature
      )
      WHERE up.user_id = ?
      ORDER BY RAND()
      LIMIT ?`;
    db.query(sql, [user_id, limit], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Gợi ý dựa trên bảng recommendations
const getRecommendationBased = (user_id, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT m.*, r.score
      FROM recommendations r
      JOIN menu m ON m.menu_id = r.menu_id
      WHERE r.user_id = ?
      ORDER BY r.score DESC, r.generated_at DESC
      LIMIT ?`;
    db.query(sql, [user_id, limit], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// API chính
exports.getRecommendations = async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const orderCount = await getOrderCount(user_id);
    let results = [];

    if (orderCount === 0) {
      // Khách mới
      const bestsellers = await getBestsellers(5);
      const random = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM menu ORDER BY RAND() LIMIT 5`, (err, rows) =>
          err ? reject(err) : resolve(rows)
        );
      });
      results = [...bestsellers, ...random];
    } else if (orderCount < 3) {
      // Khách ít đơn
      const bestsellers = await getBestsellers(4);
      const prefs = await getPreferenceBased(user_id, 4);
      const recs = await getRecommendationBased(user_id, 4); // thêm
      const random = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM menu ORDER BY RAND() LIMIT 4`, (err, rows) =>
          err ? reject(err) : resolve(rows)
        );
      });

      // nếu có dữ liệu trong recommendations thì ưu tiên
      results =
        recs.length > 0
          ? [...recs, ...prefs, ...bestsellers]
          : [...bestsellers, ...prefs, ...random];
    } else {
      // Khách quen
      const recs = await getRecommendationBased(user_id, 5); // thêm
      const history = await getHistoryBased(user_id, 5);
      const prefs = await getPreferenceBased(user_id, 4);
      const bestsellers = await getBestsellers(3);

      results =
        recs.length > 0
          ? [...recs, ...prefs, ...bestsellers]
          : [...history, ...prefs, ...bestsellers];
    }

    // Loại trùng lặp menu_id
    const unique = [];
    const seen = new Set();
    for (const item of results) {
      if (!seen.has(item.menu_id)) {
        unique.push(item);
        seen.add(item.menu_id);
      }
    }

    res.json(unique);
  } catch (err) {
    console.error("Error in recommendations:", err);
    res.status(500).json({ error: "Lỗi server khi gợi ý món" });
  }
};
