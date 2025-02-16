const prisma = require("../Config/prisma");
const { user } = require("../Config/prisma");
const bcrypt = require('bcryptjs'); // หรือ 'bcrypt'


exports.changeOrderStatus = async (req, res) => {
  try {
    //code
    const { orderId, orderStatus } = req.body;
    // console.log(orderId,OrderStatus)
    const orderUpdate = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: orderStatus },
    });

    res.json(orderUpdate);
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};

exports.getOrderAdmin = async (req, res) => {
  try {
    const { statusFilter, deliveryFilter, startDate, endDate, sortOrder } =
      req.query;

    let whereCondition = {};

    // Filter by order status
    if (statusFilter) {
      whereCondition.orderStatus = statusFilter;
    }

    // ไม่ต้องแปลงค่า deliveryFilter ให้ตรงกับ Frontend
    if (deliveryFilter) {
      whereCondition.deliveryMethod = deliveryFilter;
    }

    // Filter by date range
    if (startDate && endDate) {
      whereCondition.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Sorting order (default: latest first)
    const orderBy =
      sortOrder === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    // Fetch orders from database
    const orders = await prisma.order.findMany({
      where: whereCondition,
      orderBy,
      include: {
        products: {
          include: {
            product: true,
          },
        },
        orderedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            tell: true,
          },
        },
      },
    });

    // Formatting data before sending to frontend
    const formattedOrders = orders.map((order) => ({
      ...order,
      deliveryType:
        order.deliveryMethod === "PICKUP" ? "รับที่ร้าน" : "จัดส่งถึงบ้าน",
      deliveryAddress:
        order.deliveryMethod === "DELIVERY" ? order.deliveryAddress : null,
    }));

    console.log("Orders sent to frontend:", formattedOrders);
    res.json(formattedOrders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    //code

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        tell: true,
        role: true,
        enabled: true,
        address: true,
      },
    });
    res.json(users);
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id; // รับ ID จาก params

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }, // ค้นหาผู้ใช้โดยใช้ id (แปลงเป็นเลขหากเป็น string)
    });

    // ถ้าผู้ใช้ไม่พบ
    if (!user) {
      return res.status(404).json({ message: "ผู้ใช้ไม่พบ" });
    }

    // ส่งข้อมูลผู้ใช้กลับไป
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // ดึง id จาก URL พารามิเตอร์
    const { enabled, role, name, email, tell, address, password } = req.body;

    const updateData = {};
    if (enabled !== undefined) updateData.enabled = enabled;
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (tell) updateData.tell = tell;
    if (address) updateData.address = address;

    // ตรวจสอบว่ามี password และต้องทำการแฮช
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "ไม่มีข้อมูลสำหรับอัปเดต" });
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.send("Update User Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting user with ID: ", id);

    // ลบผู้ใช้ในฐานข้อมูล
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.send("Delete User Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getDashboardData = async (req, res) => {
  const { year } = req.query;  // รับปีจาก query

  try {
    // ✅ จำนวนคำสั่งซื้อทั้งหมด
    const totalOrders = await prisma.order.count();

    // ✅ จำนวนผู้ใช้งานทั้งหมด
    const totalUsers = await prisma.user.count();

    // ✅ จำนวนเมนูทั้งหมด
    const totalMenus = await prisma.product.count();

    // ✅ ยอดขายรวมทั้งหมด (ใช้ amount จาก Schema)
    const totalSales = await prisma.order.aggregate({
      _sum: {
        amount: true,
      },
    });

    // ✅ สถานะการสั่งซื้อ
    const pendingOrders = await prisma.order.count({
      where: { orderStatus: "รอดำเนินการ" },
    });
    const shippingOrders = await prisma.order.count({
      where: { orderStatus: "กำลังจัดส่ง" },
    });
    const completedOrders = await prisma.order.count({
      where: { orderStatus: "จัดส่งสำเร็จ" },
    });
    const canceledOrders = await prisma.order.count({
      where: { orderStatus: "ยกเลิก" },
    });

    // ✅ สินค้าที่ขายดี
    const topSellingProducts = await prisma.product.findMany({
      select: {
        title: true,
        sold: true,
      },
      orderBy: { sold: "desc" },
      take: 6,
    });

    // ✅ รายได้ต่อเดือนในปี
    const revenuePerMonth = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`), // ปีเริ่มต้นที่ผู้ใช้เลือก
          lt: new Date(`${Number(year) + 1}-01-01`), // ปีสิ้นสุด
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // แยกรายได้ออกเป็น 12 เดือน (เพิ่มเงื่อนไขตรวจสอบเดือนที่เป็น 0 แล้วให้ตั้งเป็น 0)
    const monthlyRevenue = Array(12).fill(0); // เตรียมอาร์เรย์ที่มีค่า 0 สำหรับ 12 เดือน

    revenuePerMonth.forEach((item) => {
      const month = new Date(item.createdAt).getMonth(); // คำนวณเดือนจากวันที่
      monthlyRevenue[month] += Number(item._sum.amount) || 0; // บวกยอดขายในเดือนนั้นๆ
    });

    // ส่งข้อมูลทั้งหมดกลับไปที่ frontend
    res.status(200).json({
      totalOrders,
      totalUsers,
      totalMenus,
      totalSales: Number(totalSales._sum.amount) || 0, // ถ้าไม่มีข้อมูลให้แสดงเป็น 0 และแปลงเป็น Number
      pendingOrders,
      shippingOrders,
      completedOrders,
      canceledOrders,
      topSellingProducts,
      monthlyRevenue, // ส่งข้อมูลยอดขายแต่ละเดือน
    });
  } catch (err) {
    console.error("Error getting dashboard data:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};



