const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next)  =>{
    const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header Authorization
    if(!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        req.user = decoded; // lưu trữ thông tin người dùng vào req.user
        next();
    }catch(err){
        return res.status(403).json({ message: "Token không hợp lệ!" });
    }
};
