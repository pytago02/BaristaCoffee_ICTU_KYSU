const db = require("../db");

// Lấy tất cả nguyên liệu
exports.getAllIngredients = (req, res) => {
  db.query(
    `SELECT * FROM ingredients WHERE is_deleted = 0`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi lấy danh sách nguyên liệu", err });
      }
      res.json(results);
    }
  );
};

// Lấy nguyên liệu theo ID
exports.getIngredientById = (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM ingredients WHERE ingredient_id = ? AND is_deleted = 0",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi lấy nguyên liệu theo ID", err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy nguyên liệu" });
      }
      res.json(results[0]);
    }
  );
};

// Tạo nguyên liệu mới
exports.createIngredient = (req, res) => {
  const { name, unit, stock_quantity, min_stock } = req.body;
  const image = req.file ? `/assets/ingredient/${req.file.filename}` : null;

  db.query(
    `INSERT INTO ingredients (name, unit, stock_quantity, min_stock, image) 
     VALUES (?, ?, ?, ?, ?)`,
    [name, unit, stock_quantity, min_stock, image],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi tạo nguyên liệu", err });
      }
      res.status(201).json({
        message: "Tạo nguyên liệu thành công",
        ingredientId: results.insertId,
      });
    }
  );
};

// Cập nhật nguyên liệu
exports.updateIngredient = (req, res) => {
  const { name, unit, stock_quantity, min_stock } = req.body;
  const id = req.params.id;

  // nếu có upload ảnh mới thì dùng, nếu không giữ ảnh cũ
  const image = req.file ? `/assets/ingredient/${req.file.filename}` : req.body.image || null;

  db.query(
    `UPDATE ingredients 
     SET name = ?, unit = ?, stock_quantity = ?, min_stock = ?, image = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE ingredient_id = ? AND is_deleted = 0`,
    [name, unit, stock_quantity, min_stock, image, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi cập nhật nguyên liệu", err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy nguyên liệu để cập nhật" });
      }
      res.json({ message: "Cập nhật nguyên liệu thành công" });
    }
  );
};

// Xóa nguyên liệu (soft delete)
exports.deleteIngredient = (req, res) => {
  const id = req.params.id;
  db.query(
    "UPDATE ingredients SET is_deleted = 1 WHERE ingredient_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi xóa nguyên liệu", err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy nguyên liệu để xóa" });
      }
      res.json({ message: "Xóa nguyên liệu thành công" });
    }
  );
};

exports.updateImage = (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({ error: "Không có file nào được upload!" });
  }

  const image = `/assets/ingredient/${req.file.filename}`;

  db.query(
    "UPDATE ingredients SET image = ? WHERE ingredient_id = ?",
    [image, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Lỗi khi cập nhật image",
          err,
        });
      }
      res.json({
        message: "Cập nhật image thành công",
        image,
      });
    }
  );
};
