// jobs/forecastJob.js
const cron = require("node-cron");
const { spawn } = require("child_process");
const path = require("path");
const db = require("../db");

const mlFolder = path.join(__dirname, "../ml");
const trainScript = path.join(mlFolder, "train_model.py");
const predictScript = path.join(mlFolder, "predict_model.py");

// ========================
// 🔁 Hàm chạy train + predict
// ========================
function runForecastJob() {
  console.log("🚀 Bắt đầu quy trình train + forecast tự động...");

  // --------- BƯỚC 1: TRAIN LẠI MÔ HÌNH ---------
  const train = spawn("python", [trainScript]);
  let trainLog = "";
  let trainErr = "";

  train.stdout.on("data", (d) => (trainLog += d.toString()));
  train.stderr.on("data", (d) => (trainErr += d.toString()));

  train.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ Lỗi khi train model:", trainErr);
      return;
    }

    console.log("✅ Train hoàn tất. Log:");
    console.log(trainLog);

    // --------- BƯỚC 2: DỰ BÁO TỰ ĐỘNG ---------
    console.log("🔁 Bắt đầu chạy dự đoán tự động...");

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const sql = `
      SELECT staff_salary, eletricity_bill, water_bill, rent, other
      FROM business
      WHERE year = ? AND month = ?
      LIMIT 1
    `;

    db.query(sql, [prevYear, prevMonth], (err, rows) => {
      if (err) return console.error("❌ Lỗi đọc DB:", err);
      if (!rows.length)
        return console.warn("⚠️ Không có dữ liệu business tháng trước để dự đoán");

      const b = rows[0];
      const args = [
        "--month", String(month),
        "--year", String(year),
        "--staff_salary", String(b.staff_salary || 0),
        "--eletricity_bill", String(b.eletricity_bill || 0),
        "--water_bill", String(b.water_bill || 0),
        "--rent", String(b.rent || 0),
        "--other", String(b.other || 0)
      ];

      const py = spawn("python", [predictScript, ...args]);
      let out = "", errOut = "";

      py.stdout.on("data", (d) => (out += d.toString()));
      py.stderr.on("data", (d) => (errOut += d.toString()));

      py.on("close", (code) => {
        if (code !== 0) {
          console.error("❌ Lỗi Python khi dự đoán:", errOut);
          return;
        }

        try {
          const result = JSON.parse(out);
          const forecastDate = `${year}-${String(month).padStart(2, "0")}-01`;
          const recommendedStock = JSON.stringify({ note: "Auto forecast" });

          const insertSql = `
            INSERT INTO sales_forecast 
              (forecast_date, predicted_revenue, predicted_profit, predicted_total_order, recommended_stock, model_version)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.query(
            insertSql,
            [
              forecastDate,
              result.predicted_revenue,
              result.predicted_net_profit,
              result.predicted_total_order,
              recommendedStock,
              "rf-v1",
            ],
            (dbErr) => {
              if (dbErr) console.error("❌ Lỗi lưu forecast:", dbErr);
              else console.log(`✅ Dự đoán tự động ${forecastDate} lưu thành công`);
            }
          );
        } catch (e) {
          console.error("❌ Lỗi parse output:", e, out);
        }
      });
    });
  });
}

// ========================
// 🕓 Lên lịch chạy mỗi ngày 3:00 sáng
// ========================
cron.schedule("0 3 * * *", () => {
  runForecastJob();
});

// ========================
// 🕐 Kiểm tra khi server khởi động (chạy bù nếu cần)
// ========================
setTimeout(() => {
  const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  console.log("🔍 Kiểm tra dự báo hôm nay:", todayStr);
  db.query(
    "SELECT COUNT(*) AS cnt FROM sales_forecast WHERE created_at = ?",
    [todayStr],
    (err, rows) => {
      if (err) return console.error("DB error khi check forecast:", err);
      if (rows[0].cnt === 0) {
        console.log("⚠️ Chưa có dự báo hôm nay, chạy bù ngay...");
        runForecastJob();
      } else {
        console.log("✅ Dự báo hôm nay đã có, không cần chạy bù.");
      }
    }
  );
}, 10_000); // chạy kiểm tra sau 10 giây khi server start

module.exports = { runForecastJob };
