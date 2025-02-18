const prisma = require("../Config/prisma");
const { user } = require("../Config/prisma");
const bcrypt = require("bcryptjs"); // หรือ 'bcrypt'

// ฟังก์ชันในการอัพเดตสถานะการสั่งซื้อ
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    // ตรวจสอบว่า orderId และ orderStatus ถูกส่งมาในคำขอหรือไม่
    if (!orderId || !orderStatus) {
      return res
        .status(400)
        .json({ message: "Order ID and Order Status are required" });
    }

    const orderUpdate = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: orderStatus },
    });

    res.json(orderUpdate);
  } catch (err) {
    // ถ้ามีข้อผิดพลาดในฐานข้อมูล
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserByIdEmp = async (req, res) => {
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

// // ฟังก์ชันในการดึงข้อมูลผู้ใช้
// exports.getUserInfo = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // ตรวจสอบว่า userId ถูกส่งมาในคำขอหรือไม่
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // แปลง userId ให้เป็นตัวเลข (Int)
//     const userIdInt = parseInt(userId, 10);
//     if (isNaN(userIdInt)) {
//       return res.status(400).json({ message: "Invalid User ID" });
//     }

//     // ใช้ `userId` เป็นค่าในการค้นหาผู้ใช้
//     const userInfo = await prisma.user.findUnique({
//       where: {
//         id: userIdInt, // ระบุ id ของผู้ใช้ใน `where`
//       },
//       include: {
//         orders: true, // รวมข้อมูลคำสั่ง
//       },
//     });

//     if (!userInfo) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(userInfo);
//   } catch (err) {
//     // ถ้ามีข้อผิดพลาดในการดึงข้อมูล
//     console.log(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

exports.getAllUsers = async (req, res) => {
  try {
    // ดึงข้อมูลเฉพาะผู้ที่มี role เป็น 'user'
    const users = await prisma.user.findMany({
      where: {
        role: "user", // กรองเฉพาะผู้ที่มี role เป็น 'user'
      },
      include: {
        orders: true, // รวมข้อมูลคำสั่ง
      },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserEmp = async (req, res) => {
  try {
    const { id } = req.params; // ดึง id จาก URL พารามิเตอร์
    const { enabled, role, name, email, tell, address, password } = req.body;

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // ตรวจสอบสิทธิ์: อนุญาตเฉพาะ role "user" เท่านั้น
    if (user.role !== "user") {
      return res
        .status(403)
        .json({ message: "คุณไม่มีสิทธิ์แก้ไขข้อมูลผู้ใช้นี้" });
    }

    const updateData = {};
    if (enabled !== undefined) updateData.enabled = enabled;
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

    // อัปเดตข้อมูล
    await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getOrderEmployee = async (req, res) => {
  try {
    const { statusFilter, deliveryFilter, startDate, endDate, sortOrder } =
      req.query;

    let whereCondition = {};

    // กรองตามสถานะคำสั่งซื้อ
    if (statusFilter) whereCondition.orderStatus = statusFilter;

    // กรองตามวิธีการจัดส่ง
    if (deliveryFilter) whereCondition.deliveryMethod = deliveryFilter;

    // กรองตามช่วงวันที่
    if (startDate && endDate) {
      whereCondition.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // การจัดเรียงคำสั่งซื้อ (ค่าเริ่มต้น: จากใหม่ไปเก่า)
    const orderBy =
      sortOrder === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    // ดึงข้อมูลคำสั่งซื้อจาก Prisma
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

    // จัดรูปแบบข้อมูลก่อนส่งกลับ
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

exports.getDashboard = async (req, res) => {
  const { year } = req.query; // รับปีจาก query

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


exports.changeStatusOrder = async (req, res) => {
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

exports.getOrderUser = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("Order ID:", orderId); // ตรวจสอบค่าที่ได้รับ

    if (!orderId || isNaN(orderId)) {
      return res.status(400).json({ message: "กรุณาระบุ orderId ที่ถูกต้อง" });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId),
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                title: true,
                price: true,
              },
            },
          },
        },
        orderedBy: {
          select: {
            name: true,
            tell: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคำสั่งซื้อ" });
    }

    const formattedOrder = {
      id: order.id,
      orderedBy: {
        name: order.orderedBy.name,
        tell: order.orderedBy.tell,
        email: order.orderedBy.email,
      },
      createdAt: order.createdAt,
      products: order.products.map((item) => ({
        product: {
          title: item.product.title,
          price: item.product.price,
        },
        count: item.count,
        price: item.price,
      })),
      cartTotal: order.cartTotal,
      orderStatus: order.orderStatus,
      deliveryType: order.deliveryType,
      deliveryAddress: order.deliveryMethod === "DELIVERY" ? order.deliveryAddress : null,
    };

    console.log("Order sent to frontend:", formattedOrder);
    res.json(formattedOrder);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


