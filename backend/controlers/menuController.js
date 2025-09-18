const db = require("../db");

exports.getAllMenu = (req, res) => {
  db.query(
    `
        SELECT menu.*, menu_category.menu_category_name
        FROM menu
        JOIN menu_category ON menu.menu_category_id = menu_category.menu_category_id
        WHERE menu.is_deleted = 0`,
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách thực đơn", err });
      }
      res.json(results);
    }
  );
};

exports.getMenuById = (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM menu WHERE menu_id = ? AND is_active = 1 AND is_deleted = 0",
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy thực đơn theo ID", err });
      }
      res.json(results[0]);
    }
  );
};

exports.createMenu = (req, res) => {
  const {
    menu_name,
    menu_category_id,
    description,
    import_price,
    price,
    sweetness_level,
    temperature,
    quantity
  } = req.body;
  const image_url = req.file ? `/assets/menu/${req.file.filename}` : null;
  db.query(
    `INSERT INTO menu (menu_name, menu_category_id, description, import_price, price, sweetness_level, temperature,quantity, image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      menu_name,
      menu_category_id,
      description,
      import_price,
      price,
      sweetness_level,
      temperature,
      quantity,
      image_url,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi tạo thực đơn", err });
      }
      res
        .status(201)
        .json({ message: "Tạo thực đơn thành công", menuId: results.insertId });
    }
  );
};

// exports.updateMenu = (req, res)=>{
//     const {menu_name, menu_category_id, description, import_price, price, sweetness_level, temperature, image_url} = req.body;
//     const id = req.params.id;
//     db.query("UPDATE menu SET menu_name = ?, menu_category_id = ?, description = ?, import_price = ?, price = ?, sweetness_level = ?, temperature = ?, image_url = ? WHERE menu_id = ?",
//     [menu_name, menu_category_id, description, import_price, price, sweetness_level, temperature, image_url, id],
//     (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: "Lỗi khi cập nhật thực đơn", err });
//         }
//         res.json({ message: "Cập nhật thực đơn thành công" });
//     });
// };
exports.updateMenu = (req, res) => {
  const {menu_name, menu_category_id, description, import_price, price, sweetness_level, temperature, is_active, quantity} = req.body;

  const id = req.params.id;

  // Nếu có upload ảnh mới thì dùng ảnh mới, nếu không thì giữ ảnh cũ (truyền từ body lên)
  const image_url = req.file? `/assets/menu/${req.file.filename}`: req.body.image_url || null;

  db.query(
    `UPDATE menu 
     SET menu_name = ?, menu_category_id = ?, description = ?, import_price = ?, price = ?, sweetness_level = ?, temperature = ?, image_url = ?, is_active = ?, quantity = ?
     WHERE menu_id = ?`,
    [menu_name,menu_category_id,description,import_price,price,sweetness_level,temperature,image_url,is_active,quantity,id,],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi cập nhật thực đơn", err });
      }
      res.json({ message: "Cập nhật thực đơn thành công" });
    }
  );
};

exports.changeIsActive = (req, res) => {
  const id = req.params.id;
  db.query(
    "UPDATE menu SET is_active = NOT is_active WHERE menu_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi thay đổi trạng thái thực đơn", err });
      }
      res.json({ message: "Thay đổi trạng thái thực đơn thành công" });
    }
  );
};

exports.deleteMenu = (req, res) => {
  const id = req.params.id;
  db.query(
    "UPDATE menu SET is_deleted = 1 WHERE menu_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi xóa thực đơn", err });
      }
      res.json({ message: "Xóa thực đơn thành công" });
    }
  );
};
