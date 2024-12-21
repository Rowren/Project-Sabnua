const prisma = require('../Config/prisma');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
        if (!name) {
            return res.status(400).json({ message: "Category name is required!" });
        }

        // สร้างหมวดหมู่ใหม่ในฐานข้อมูล
        const category = await prisma.category.create({
            data: {
                name: name,
            },
        });

        res.status(201).json(category);  // ส่งกลับหมวดหมู่ที่ถูกสร้าง
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error - Create Category" });
    }
};

exports.list = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);  // ส่งรายการหมวดหมู่ทั้งหมด
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error - List Categories" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        // ตรวจสอบว่า ID ที่ได้รับมาเป็นตัวเลขหรือไม่
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid Category ID!" });
        }

        // ลบหมวดหมู่จากฐานข้อมูล
        const category = await prisma.category.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).json(category);  // ส่งหมวดหมู่ที่ถูกลบ
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            // ถ้าไม่พบข้อมูลในฐานข้อมูล
            return res.status(404).json({ message: "Category not found!" });
        }
        res.status(500).json({ message: "Server Error - Delete Category" });
    }
};
