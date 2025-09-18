const db = require("../db");

exports.getAllCategoryMenu = (req, res) => {
    db.query("SELECT * FROM menu_category WHERE is_deleted = 0", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi lấy danh sách danh mục thực đơn", err });
        }
        res.json(results);
    });
};

exports.createCategoryMenu = (req, res) => {
    const { menu_category_name } = req.body;
    db.query("INSERT INTO menu_category (menu_category_name) VALUES (?)", [menu_category_name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi tạo danh mục thực đơn", err });
        }
        res.status(201).json({ message: "Tạo danh mục thực đơn thành công", categoryId: results.insertId });
    });
};

exports.updateCategoryMenu = (req, res) => {
    const { menu_category_name } = req.body;
    const id = req.params.id;
    db.query("UPDATE menu_category SET menu_category_name = ? WHERE menu_category_id = ?", [menu_category_name, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi cập nhật danh mục thực đơn", err });
        }
        res.json({ message: "Cập nhật danh mục thực đơn thành công" });
    });
};

exports.deleteCategoryMenu = (req, res) => {
    const id = req.params.id;
    db.query("UPDATE menu_category SET is_deleted = 1 WHERE menu_category_id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi xóa danh mục thực đơn", err });
        }
        res.json({ message: "Xóa danh mục thực đơn thành công" });
    });
};
