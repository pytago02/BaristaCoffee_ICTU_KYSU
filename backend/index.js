const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs"); //- thư viện bcryptjs, dùng để mã hóa mật khẩu (hash) và so sánh mật khẩu đã mã hóa.
const jwt = require("jsonwebtoken");
const cors = require("cors"); // cho phép server chấp nhận yêu cầu từ các domain khác
const db = require("./db");
const path = require("path");

// import Routers
const usersRouter = require("./routers/userRouter");
const tablesRouter = require("./routers/tablesRouter");
const zonesRouter = require("./routers/zonesRouter");
const menuRouter = require("./routers/menuRouter");
const menuCategoryRouter = require("./routers/menuCategoryRouter");
const orderRouter = require("./routers/orderRouter")
const ingredientsRouter = require("./routers/ingredientsRoutes");

const app = express(); // Tạo một ứng dụng Express mới.
app.use(cors());
app.use(express.json());

// Gắn Routers
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/users", usersRouter);
app.use("/tables", tablesRouter);
app.use("/zones", zonesRouter);
app.use("/menu", menuRouter);
app.use("/menuCategory", menuCategoryRouter);
app.use("/order", orderRouter);
app.use("/ingredients", ingredientsRouter);

// test API
app.get("/", (req, res) => {
  res.send("Test API");
});

// Chạy server
app.listen(process.env.PORT, () => {
  console.log(`Server chạy tại http://localhost:${process.env.PORT}`);
});
