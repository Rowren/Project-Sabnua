const prisma = require("../Config/prisma");
const { user } = require("../Config/prisma");

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
    //code
    const orders = await prisma.order.findMany({
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
    res.json(orders);
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
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
    const { enabled, role, name, email, tell, address } = req.body;

    const updateData = {};
    if (enabled !== undefined) updateData.enabled = enabled;
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (tell) updateData.tell = tell;
    if (address) updateData.address = address;

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
