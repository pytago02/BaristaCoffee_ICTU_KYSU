const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// register
exports.register = (req, res) => {
  const { full_name, email, phone } = req.body;
  let password = req.body.password || "1";
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Kiểm tra email hoặc số điện thoại tồn tại chưa
  db.query(
    "SELECT * FROM users WHERE email = ? OR phone = ?",
    [email, phone],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Lỗi khi kiểm tra tài khoản!",
          err,
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email hoặc số điện thoại đã tồn tại!",
        });
      }

      // Thêm user mới
      db.query(
        "INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)",
        [full_name, email, phone, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Đăng ký không thành công!",
              err,
            });
          }
          return res.status(201).json({
            message: "Đăng ký thành công!",
            userId: result.insertId, // trả về id của user mới tạo
          });
        }
      );
    }
  );
};

// register staff account
exports.registerStaff = (req, res) => {
  const { full_name, email, phone, role } = req.body;
  let password = req.body.password || "1";
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Kiểm tra email hoặc số điện thoại đã tồn tại chưa
  db.query(
    "SELECT * FROM users WHERE email = ? OR phone = ?",
    [email, phone],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi kiểm tra tài khoản!", err });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email hoặc số điện thoại đã tồn tại!",
        });
      }

      // 👉 Nếu chưa tồn tại thì thêm mới
      db.query(
        "INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        [full_name, email, phone, hashedPassword, role],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Đăng ký không thành công!", err });
          }
          return res.status(201).json({ message: "Đăng ký thành công!" });
        }
      );
    }
  );
};

// staff login
exports.staffLogin = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND (is_active = 1 AND is_deleted = 0)",
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Đăng nhập không thành công!" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }
      const user = results[0];

      // so sánh mật khẩu
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Thông tin đăng nhập không chính xác!" });
      }

      // Tạo token
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );
      delete user.password;
      // Trả về thông tin người dùng và token
      return res
        .status(200)
        .json({ message: "Đăng nhập thành công!", token, user });
    }
  );
};

// customer login
exports.customerLogin = (req, res) => {
  const { phone, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE phone = ? AND is_active = 1",
    [phone],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Đăng nhập không thành công!" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }
      const user = results[0];

      // so sánh mật khẩu
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Thông tin đăng nhập không chính xác!" });
      }

      // Tạo token
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );

      // Trả về thông tin người dùng và token
      return res.status(200).json({ message: "Đăng nhập thành công!", token });
    }
  );
};

// get all users
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách người dùng!", error: err });
    }

    const userData = results.map((user) => {
      delete user.password;
      return user;
    });
    return res.status(200).json({
      message: "Lấy danh sách người dùng thành công!",
      data: userData,
    });
  });
};

// get user by id
exports.getUserById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM users WHERE user_id = ? AND is_deleted = 0 AND is_active = 1",
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi lấy thông tin người dùng!", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }

      const userData = results[0];
      delete userData.password;
      return res.status(200).json({
        message: "Lấy thông tin người dùng thành công!",
        data: userData,
      });
    }
  );
};

exports.getMe = (req, res) => {
  const userId = req.user.user_id;

  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Lỗi khi lấy thông tin của bạn!",
          error: err,
        });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin tài khoản!" });
      }

      const userData = results[0];
      delete userData.password;
      return res.status(200).json({
        message: "Lấy thông tin cá nhân thành công!",
        data: userData,
      });
    }
  );
};

// update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, role, is_active } = req.body;

  db.query(
    "UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, is_active = ? WHERE user_id = ?",
    [full_name, email, phone, role, is_active, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Cập nhật người dùng không thành công!",
          error: err,
        });
      }
      return res
        .status(200)
        .json({ message: "Cập nhật người dùng thành công!" });
    }
  );
};

// change is_active
exports.changeIsActive = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  db.query(
    "UPDATE users SET is_active = ? WHERE user_id = ?",
    [is_active, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Cập nhật trạng thái người dùng không thành công!",
          error: err,
        });
      }
      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái người dùng thành công!" });
    }
  );
};

// delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET is_deleted = 1 WHERE user_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi xóa người dùng!", error: err });
      }
      return res.status(200).json({ message: "Xóa người dùng thành công!" });
    }
  );
};

// change password
exports.changePassword = (req, res) => {
  const { id } = req.params;
  const { password, new_password } = req.body;

  db.query(
    "SELECT password FROM users WHERE user_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi thay đổi mật khẩu!", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }

      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mật khẩu cũ không đúng!" });
      }

      const hashedNewPassword = bcrypt.hashSync(new_password, 8);
      db.query(
        "UPDATE users SET password = ? WHERE user_id = ?",
        [hashedNewPassword, id],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Lỗi khi cập nhật mật khẩu!", error: err });
          }
          return res
            .status(200)
            .json({ message: "Thay đổi mật khẩu thành công!" });
        }
      );
    }
  );
};

exports.getStaffAcount = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE (role = 'staff' OR role = 'barista') AND is_deleted = 0;",
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi lấy tài khoản staff!", error: err });
      }
      // xoá mật khẩu trước khi trả về
      const staffData = results.map((user) => {
        delete user.password;
        return user;
      });
      return res.status(200).json(staffData);
    }
  );
};

exports.getCustomerAcount = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE role = 'customer' AND is_deleted = 0;",
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi lấy tài khoản customer!", error: err });
      }
      // xoá mật khẩu trước khi trả về
      const customerData = results.map((user) => {
        delete user.password;
        return user;
      });
      return res.status(200).json(customerData);
    }
  );
};

// reset password to default "1"
exports.resetPassword = (req, res) => {
  const { id } = req.params;
  const defaultPassword = "1";
  const hashedPassword = bcrypt.hashSync(defaultPassword, 8);

  db.query(
    "UPDATE users SET password = ? WHERE user_id = ?",
    [hashedPassword, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Lỗi khi reset mật khẩu!",
          error: err,
        });
      }
      return res.status(200).json({ message: "Reset mật khẩu thành công!" });
    }
  );
};

exports.updateAvatar = (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({ error: "Không có file nào được upload!" });
  }

  const avatar = `/assets/avatar/${req.file.filename}`;

  db.query(
    "UPDATE users SET avatar = ? WHERE user_id = ?",
    [avatar, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Lỗi khi cập nhật avatar",
          err,
        });
      }
      res.json({
        message: "Cập nhật avatar thành công",
        avatar,
      });
    }
  );
};
