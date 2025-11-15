// controllers/modelController.js
const { spawn } = require("child_process");
const path = require("path");
const db = require("../db");
const fs = require("fs");

const mlFolder = path.join(__dirname, "../ml");
const trainScript = path.join(mlFolder, "train_model.py");
const predictScript = path.join(mlFolder, "predict_model.py");

// Trigger training (chạy python train script)
exports.trainModel = (req, res) => {
  // chạy python script
  const py = spawn("py", [trainScript]);

  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  py.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  py.on("close", (code) => {
    if (code === 0) {
      res.json({ message: "Training finished", log: stdout });
    } else {
      res.status(500).json({ error: "Training error", code, stderr });
    }
  });
};

// Predict endpoint: nhận JSON body với các feature cần thiết
exports.predict = (req, res) => {
  try {
    const {
      month,
      year,
      staff_salary = 0,
      eletricity_bill = 0,
      water_bill = 0,
      rent = 0,
      other = 0,
      total_revenue_from_orders = 0,
      total_items_sold = 0,
      avg_order_value = 0,
      user_id = null,
    } = req.body;

    // xây args cho python predict script
    const args = [
      "--month",
      String(month),
      "--year",
      String(year),
      "--staff_salary",
      String(staff_salary),
      "--eletricity_bill",
      String(eletricity_bill),
      "--water_bill",
      String(water_bill),
      "--rent",
      String(rent),
      "--other",
      String(other),
      "--total_revenue_from_orders",
      String(total_revenue_from_orders),
      "--total_items_sold",
      String(total_items_sold),
      "--avg_order_value",
      String(avg_order_value),
    ];

    const py = spawn("py", [predictScript, ...args]);

    let out = "";
    let err = "";

    py.stdout.on("data", (data) => (out += data.toString()));
    py.stderr.on("data", (data) => (err += data.toString()));

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("Predict error:", err);
        return res.status(500).json({ error: "Predict error", details: err });
      }
      let result;
      try {
        result = JSON.parse(out);
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Invalid model output", raw: out });
      }

      // Lưu forecast vào bảng sales_forecast
      // const sql = `INSERT INTO sales_forecast (forecast_date, predicted_revenue, recommended_stock, model_version) VALUES (?, ?, ?, ?)`;
      const sql = `
        INSERT INTO sales_forecast 
          (forecast_date, predicted_revenue, predicted_profit, predicted_total_order, recommended_stock, model_version)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const forecastDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const recommendedStock = JSON.stringify({
        note: "Tạm thời chưa implement logic stock",
      });

      db.query(
        sql,
        // [forecastDate, result.predicted_revenue, recommendedStock, "rf-v1"],
        [
          forecastDate,
          result.predicted_revenue,
          result.predicted_net_profit,
          result.predicted_total_order,
          recommendedStock,
          "rf-v1",
          user_id,
        ],
        (dbErr, dbRes) => {
          if (dbErr) {
            console.error("Lỗi lưu sales_forecast:", dbErr);
            return res.json({
              prediction: result,
              saved: false,
              dbError: dbErr.sqlMessage || dbErr,
            });
            // but still return prediction
          }
          res.json({ prediction: result, saved: !!dbRes?.insertId });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get saved forecasts
exports.getForecasts = (req, res) => {
  db.query(
    "SELECT * FROM sales_forecast ORDER BY forecast_date DESC LIMIT 50",
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });
      res.json(rows);
    }
  );
};
