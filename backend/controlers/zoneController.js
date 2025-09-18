const db = require("../db");
const jwt = require("jsonwebtoken");

exports.getAllZones = (req, res)=>{
    db.query("SELECT * FROM zone WHERE is_deleted = 0", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi lấy danh sách khu vực", err });
        }
        res.json(results );
    });
};

exports.createZone = (req, res) => {
    const {zone_name} = req.body;
    db.query("INSERT INTO zone (zone_name) VALUES (?)", [zone_name], (err, results)=>{
        if(err){
            return res.status(500).json({error: "Lỗi khi tạo khu vực", err});
        }
        res.status(201).json({message: "Tạo khu vực thành công", zoneId: results.insertId});
    });
};

exports.updateZone = (req, res) => {
    const {zone_name} = req.body;
    const {id} = req.params;
    db.query("UPDATE zone SET zone_name = ? WHERE zone_id = ?", [zone_name, id], (err, results)=>{
        if(err){
            return res.status(500).json({error: "Lỗi khi cập nhật khu vực", err});
        }
        res.json({message: "Cập nhật khu vực thành công"});
    }); 
};

exports.deleteZone = (req, res) => {
    const { id } = req.params;

    db.query("SELECT is_deleted FROM zone WHERE zone_id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi kiểm tra trạng thái khu vực", err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Khu vực không tồn tại!" });
        }

        const currentStatus = results[0].is_deleted;
        const newStatus = currentStatus === 1 ? 0 : 1;

        db.query("UPDATE zone SET is_deleted = ? WHERE zone_id = ?", [newStatus, id], (err2) => {
            if (err2) {
                return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái khu vực", err: err2 });
            }
            res.json({
                message: newStatus === 1 ? "Đã ẩn khu vực thành công" : "Đã khôi phục khu vực thành công",
            });
        });
    });
};
