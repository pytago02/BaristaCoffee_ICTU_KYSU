const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Routers
const usersRouter = require("./routers/userRouter");
const tablesRouter = require("./routers/tablesRouter");
const zonesRouter = require("./routers/zonesRouter");
const menuRouter = require("./routers/menuRouter");
const menuCategoryRouter = require("./routers/menuCategoryRouter");
const orderRouter = require("./routers/orderRouter");
const ingredientsRouter = require("./routers/ingredientsRoutes");
const recipesRouter = require("./routers/recipesRouter");
const recommendationRoutes = require("./routers/recommendationRoutes");
const requestRouter = require("./routers/requestRouter");
const chatbotRouter = require('./routers/chatbotRoute');

const app = express();
app.use(cors());
app.use(express.json());

// Static assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

// API routes
app.use("/users", usersRouter);
app.use("/tables", tablesRouter);
app.use("/zones", zonesRouter);
app.use("/menu", menuRouter);
app.use("/menuCategory", menuCategoryRouter);
app.use("/order", orderRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/recipes", recipesRouter);
app.use("/recommendations", recommendationRoutes);
app.use("/request", requestRouter);
app.use("/chatbot", chatbotRouter);

// Test route
app.get("/", (req, res) => {
  res.send("✅ API đang hoạt động");
});

// HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Cho phép emit từ router
app.set("io", io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
