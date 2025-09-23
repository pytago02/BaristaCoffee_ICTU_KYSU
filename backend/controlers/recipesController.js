const db = require("../db");

exports.getAllRecipes = (req, res) => {
  db.query(
    `
    SELECT mi.* , m.menu_name, m.tutorial, i.name, i.unit
    FROM menu_ingredients mi
    JOIN menu m ON mi.menu_id = m.menu_id
    JOIN ingredients i ON i.ingredient_id  = mi.ingredient_id
    `,
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy công thức theo ID", err });
      }
      res.json(results);
    }
  );
};

exports.getRecipesByMenuId = (req, res) => {
  const id = req.params.menu_id;
  db.query(
    `
    SELECT mi.* , m.menu_name, m.tutorial, i.image, i.name, i.unit
    FROM menu_ingredients mi
    JOIN menu m ON mi.menu_id = m.menu_id
    JOIN ingredients i ON i.ingredient_id  = mi.ingredient_id
    WHERE mi.menu_id = ?
    `,
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy công thức theo ID", err });
      }
      res.json(results);
    }
  );
};

exports.addIngredientToMenu = (req, res) => {
  const { menu_id, ingredient_id, quantity } = req.body;
  db.query(
    `
        INSERT INTO menu_ingredients (menu_id, ingredient_id, quantity)
        VALUES (?, ?, ?)
        `,
    [menu_id, ingredient_id, quantity],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi thêm nguyên liệu vào món", err });
      }
      res.json({ message: "Thêm nguyên liệu vào món thành công", results });
    }
  );
};

exports.updateIngredientInMenu = (req, res) => {
  const { menu_id, ingredient_id, quantity } = req.body;
  db.query(
    `
        UPDATE menu_ingredients
        SET quantity = ?
        WHERE menu_id = ? AND ingredient_id = ?
        `,
    [quantity, menu_id, ingredient_id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi cập nhật nguyên liệu trong món", err });
      }
      res.json({
        message: "Cập nhật nguyên liệu trong món thành công",
        results,
      });
    }
  );
};

exports.deleteIngredientFromMenu = (req, res) => {
  const { menu_id, ingredient_id } = req.body;
  db.query(
    `
        DELETE FROM menu_ingredients
        WHERE menu_id = ? AND ingredient_id = ?
        `,
    [menu_id, ingredient_id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi xóa nguyên liệu khỏi món", err });
      }
      res.json({ message: "Xóa nguyên liệu khỏi món thành công", results });
    }
  );
};
