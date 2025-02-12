const jwt = require('jsonwebtoken');
const prisma = require('../Config/prisma');

/// เช็คสิทธิ์ผู้ใช้
exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization;
        console.log("🔑 Token ที่ได้รับ:", headerToken);

        // ถ้าไม่มี Token
        if (!headerToken) {
            return res.status(401).json({ message: "ไม่พบ Token, กรุณาเข้าสู่ระบบ" });
        }

        const token = headerToken.split(" ")[1];

        try {
            const decode = jwt.verify(token, process.env.SECRET);
            req.user = decode;
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่" });
            } else if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Token ไม่ถูกต้อง" });
            }
            throw err;
        }

        const user = await prisma.user.findUnique({
            where: { email: req.user.email },
        });

        if (!user) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
        }

        if (!user.enabled) {
            return res.status(403).json({ message: "บัญชีนี้ถูกระงับการใช้งาน" });
        }

        next();
    } catch (err) {
        console.error("⚠️ Error in authCheck:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
};

/// เช็คสิทธิ์แอดมิน
exports.adminCheck = async (req, res, next) => {
    try {
        const { email } = req.user;
        const adminUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!adminUser) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
        }

        if (adminUser.role !== 'admin') {
            return res.status(403).json({ message: "การเข้าถึงถูกปฏิเสธ: เฉพาะผู้ดูแลระบบเท่านั้น" });
        }

        next();
    } catch (err) {
        console.error("⚠️ Error in adminCheck:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
};

/// เช็คสิทธิ์พนักงาน หรือ แอดมิน
exports.employeeCheck = async (req, res, next) => {
    try {
        const { email } = req.user;
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
        }

        if (user.role !== 'employee' && user.role !== 'admin') {
            return res.status(403).json({ message: "การเข้าถึงถูกปฏิเสธ: เฉพาะพนักงานหรือผู้ดูแลระบบเท่านั้น" });
        }

        next();
    } catch (err) {
        console.error("⚠️ Error in employeeCheck:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
};
