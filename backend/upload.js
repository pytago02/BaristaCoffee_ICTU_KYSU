const multer = require("multer");
const path = require("path");

// cho phép truyền biến môi trường hoặc config để đổi thư mục lưu ảnh
const UPLOAD_PATH = process.env.UPLOAD_PATH || path.join(__dirname, "assets/menu");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ========== UPLOAD AVATAR ==========
const AVATAR_UPLOAD_PATH = path.join(__dirname, "assets/avatar");
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVATAR_UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadAvatar = multer({ storage: avatarStorage });

// ========== UPLOAD AVATAR ==========
const INGREDIENT_UPLOAD_PATH = path.join(__dirname, "assets/ingredient");
const ingredientStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, INGREDIENT_UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadIngredient = multer({ storage: ingredientStorage });

module.exports = { upload, uploadAvatar, uploadIngredient };
