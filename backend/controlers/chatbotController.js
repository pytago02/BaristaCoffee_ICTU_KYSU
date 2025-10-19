const axios = require("axios");
const fs = require("fs");
const path = require("path");
const db = require("../db");
require("dotenv").config();

const scriptPath = path.join(__dirname, "../data/cafe_script.json");

async function saveChatToDB(user_id, sender, message) {
  const sql =
    "INSERT INTO chatbot_logs (user_id, sender, message, created_at) VALUES (?, ?, ?, NOW())";
  db.query(sql, [user_id, sender, message], (err) => {
    if (err) console.error("Lỗi lưu lịch sử chat:", err);
  });
}

exports.chatWithGemini = async (req, res) => {
  try {
    const { message, user_id = null } = req.body;

    // 1️⃣ Lấy menu từ API
    const menuResponse = await axios.get("http://localhost:3000/menu/getAllMenu");
    const menuList = menuResponse.data || [];
    
    // 2️⃣ Đọc kịch bản có sẵn
    const cafeScript = JSON.parse(fs.readFileSync(scriptPath, "utf-8"));

    // 3️⃣ Xử lý phần hướng dẫn pha chế (tutorial)
    const tutorialInfo = [];
    for (const item of menuList) {
      if (item.tutorial && item.tutorial.trim() !== "") {
        tutorialInfo.push(`☕ ${item.menu_name}: ${item.tutorial}`);
      } else {
        // Nếu không có hướng dẫn, tìm từ internet
        try {
          const search = await axios.get(
            `https://www.googleapis.com/customsearch/v1`,
            {
              params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.SEARCH_ENGINE_ID, // Google CSE
                q: `Cách pha chế ${item.menu_name} cà phê`,
              },
            }
          );
          const snippet = search.data.items?.[0]?.snippet || "Không tìm thấy hướng dẫn.";
          tutorialInfo.push(`☕ ${item.menu_name}: ${snippet} (Nguồn: Internet)`);
        } catch (err) {
          tutorialInfo.push(`☕ ${item.menu_name}: Chưa có hướng dẫn pha chế.`);
        }
      }
    }

    // 4️⃣ Ghép prompt cho Gemini
    const menuText = menuList
      .map(
        (item) =>
          `• ${item.menu_name} (${item.menu_category_name}) - ${item.price}đ: ${item.description}`
      )
      .join("\n");

    const systemPrompt = `
Bạn là chatbot của quán cà phê "Barista Coffe".

Phạm vi kiến thức của bạn bao gồm:
- Tất cả thông tin liên quan đến **cà phê, đồ uống, nguyên liệu pha chế, quy trình pha, nguồn gốc, loại hạt, máy pha, và văn hóa cà phê**.
- Các thông tin về **menu, giá, khuyến mãi, giờ mở cửa, hướng dẫn nhân viên** tại Barista Coffe.
- Có thể giải thích các khái niệm như: "Cà phê là gì", "Latte khác Cappuccino như thế nào", "Arabica khác Robusta ra sao", v.v.

Nếu câu hỏi **hoàn toàn ngoài lĩnh vực đồ uống hoặc cà phê**, ví dụ như hỏi về chính trị, thể thao, công nghệ, hoặc giải trí — hãy trả lời lịch sự:
"Xin lỗi, tôi chỉ có thể hỗ trợ về lĩnh vực cà phê và đồ uống tại Barista Coffe ạ."

Menu hiện tại:
${menuText}

Hướng dẫn pha chế:
${tutorialInfo.join("\n")}

Một số kịch bản mẫu:
${cafeScript.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}

Câu hỏi khách hàng: ${message}
`;

    // 5️⃣ Gọi Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, tôi không hiểu câu hỏi.";

    // 6️⃣ Lưu lịch sử chat vào DB
    await saveChatToDB(user_id, "user", message);
    await saveChatToDB(user_id, "bot", reply);

    res.json({ reply });
  } catch (err) {
    console.error("Lỗi chatbot:", err.response?.data || err.message);
    res.status(500).json({ error: "Lỗi khi xử lý chatbot" });
  }
};

