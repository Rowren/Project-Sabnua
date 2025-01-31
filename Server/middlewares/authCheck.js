const jwt = require('jsonwebtoken');
const prisma = require('../Config/prisma');

/// เช็คสิทธิ์ผู้ใช้
exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization;
        console.log(headerToken);

        // ถ้าไม่มีข้อมูล Token
        if (!headerToken) {
            return res.status(401).json({ message: "ไม่พบ Token, กรุณาเข้าสู่ระบบ" });
        }

        const token = headerToken.split(" ")[1];

        const decode = jwt.verify(token, process.env.SECRET);
        req.user = decode;

        const user = await prisma.user.findFirst({
            where: {
                email: req.user.email,
            },
        });

        // ถ้าบัญชีถูกระงับ
        if (!user.enabled) {
            return res.status(400).json({ message: "บัญชีนี้ถูกระงับการใช้งาน" });
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Token ไม่ถูกต้องกรุณาเข้าสู่ระบบ" });
    }
};

/// เช็คสิทธิ์แอดมิน
exports.adminCheck = async (req, res, next) => {
    try {
        const { email } = req.user;
        const adminUser = await prisma.user.findFirst({
            where: { email: email },
        });

        // ถ้าไม่ใช่ Admin
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: "การเข้าถึงถูกปฏิเสธ: เฉพาะผู้ดูแลระบบเท่านั้น" });
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด: การเข้าถึงผู้ดูแลระบบถูกปฏิเสธ" });
    }
};

/// เช็คสิทธิ์พนักงาน หรือ แอดมิน
exports.employeeCheck = async (req, res, next) => {
    try {
        const { email } = req.user;
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        // ถ้าไม่ใช่ Employee หรือ Admin
        if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
            return res.status(403).json({ message: "การเข้าถึงถูกปฏิเสธ: เฉพาะพนักงานหรือผู้ดูแลระบบเท่านั้น" });
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด: การเข้าถึงพนักงาน/ผู้ดูแลระบบถูกปฏิเสธ" });
    }
};
