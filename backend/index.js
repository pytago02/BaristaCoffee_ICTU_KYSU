const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs"); //- thư viện bcryptjs, dùng để mã hóa mật khẩu (hash) và so sánh mật khẩu đã mã hóa.
const jwt = require("jsonwebtoken");
const cors = require("cors"); // cho phép server chấp nhận yêu cầu từ các domain khác
const db = require("./db");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// import Routers
const usersRouter = require("./routers/userRouter");
const tablesRouter = require("./routers/tablesRouter");
const zonesRouter = require("./routers/zonesRouter");
const menuRouter = require("./routers/menuRouter");
const menuCategoryRouter = require("./routers/menuCategoryRouter");
const orderRouter = require("./routers/orderRouter");
const ingredientsRouter = require("./routers/ingredientsRoutes");
const recipesRouter = require("./routers/recipesRouter");
const recommendationRoutes = require("./routers/recommendationRoutes");

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
app.use("/recipes", recipesRouter);
app.use("/recommendations", recommendationRoutes);

// test API
app.get("/", (req, res) => {
  res.send("Test API");
});

// ✅ Tạo HTTP server từ Express
const server = http.createServer(app);

// ✅ Khởi tạo Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả FE kết nối, bạn có thể giới hạn domain
  },
});

// Lắng nghe sự kiện kết nối
io.on("connection", (socket) => {
  console.log("⚡ Nhân viên hoặc khách kết nối WebSocket:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Người dùng ngắt kết nối:", socket.id);
  });
});

// ✅ Cho phép các router khác emit sự kiện qua io
app.set("io", io);

// Chạy server
app.listen(process.env.PORT, () => {
  console.log(`Server chạy tại http://localhost:${process.env.PORT}`);
});
