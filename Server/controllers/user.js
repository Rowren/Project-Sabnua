const { Prisma } = require("@prisma/client");
const prisma = require("../Config/prisma");
const { user } = require("../Config/prisma");
const bcrypt = require('bcryptjs'); // หรือ 'bcrypt'




exports.userCart = async (req, res) => {
  try {
    //code
    const { cart } = req.body;
    console.log(cart);
    console.log(req.user.id);

    const user = await prisma.user.findFirst({
      where: { id: Number(req.user.id) },
    });
    //console.log(user)

    //Check quantity
    for (const item of cart) {
      console.log(item);
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { quantity: true, title: true },
      });
      // console.log(item)
      // console.log(product)

      //ถ้าไม่มีสินค้า
      if (!product || item.count >= product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `ขออภัย. สินค้า${product?.title || "product"}หมด`,
        });
      }
    }

    // Delete old Cart Item
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });

    //Delete old Cart
    await prisma.cart.deleteMany({
      where: { orderedById: user.id },
    });

    //เตรียมสินค้า
    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    // หาผลรวม
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    //New Cart
    const newCart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });

    console.log(newCart);

    res.send("Add Cart Success");
  } catch (error) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    //code
    // req.user.id  //run pass middleware away
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          // productOnCart
          include: {
            // ดึงข้อมูลชื่อสินค้ามา
            product: true,
          },
        },
      },
    });
    // console.log(cart)
    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    //code
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
    });
    if (!cart) {
      return res.status(400).json({ message: "No Cart" });
    }

    // ลบใน productOnCart
    await prisma.productOnCart.deleteMany({
      where: { cartId: cart.id },
    });

    //ลบใน Cart
    const result = await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user.id) },
    });

    console.log(result);
    res.json({
      message: "Cart Empty Success",
      deletedCount: result.count,
    });
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};

exports.saveAddress = async (req, res) => {
  try {
    //code
    const { address } = req.body;
    console.log(address);
    const addressUser = await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        address: address,
      },
    });

    res.json({ ok: true, message: "Update Address Success" });
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};

exports.saveOrder = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    // ตรวจสอบว่า payload และ paymentIntent มีอยู่หรือไม่
    if (!req.body.payload || !req.body.payload.paymentIntent) {
      return res.status(400).json({ error: 'Missing paymentIntent in request body payload' });
    }

    const { id, amount, status, currency } = req.body.payload.paymentIntent;
    const deliveryMethod = req.body.payload?.deliveryMethod;

    // ✅ ตรวจสอบว่า deliveryMethod มีค่าหรือไม่
    if (!deliveryMethod) {
      return res.status(400).json({ error: 'Missing delivery method in request body payload' });
    }

    // ✅ ตรวจสอบค่า deliveryMethod ว่าถูกต้องหรือไม่
    if (!["PICKUP", "DELIVERY"].includes(deliveryMethod.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid delivery method' });
    }

    // ✅ ตรวจสอบสถานะการชำระเงิน
    if (status !== "succeeded") {
      return res.status(400).json({ error: 'Payment failed, please try again' });
    }

    // ✅ ดึงข้อมูล user
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      select: { address: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ กำหนด deliveryAddress
    let deliveryAddress = deliveryMethod.toUpperCase() === "DELIVERY" ? user.address || null : "รับที่ร้าน";

    if (deliveryMethod.toUpperCase() === "DELIVERY" && !user.address) {
      return res.status(400).json({ error: "No address found for delivery" });
    }

    // ✅ ดึงข้อมูลตะกร้าสินค้า
    const userCart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
      include: { products: true },
    });

    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ message: "Cart is Empty" });
    }

    const amountTHB = Number(amount) / 100;

    // ✅ สร้าง order
    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: { connect: { id: req.user.id } },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currency: currency,
        deliveryMethod: deliveryMethod.toUpperCase(),
        deliveryAddress: deliveryAddress,
      },
    });

    // ✅ อัปเดตสินค้าคงคลัง
    const update = userCart.products.map((item) => ({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count },
      },
    }));
    await Promise.all(update.map((updated) => prisma.product.update(updated)));

    // ✅ ลบ cart หลังจากสร้าง order
    await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user.id) },
    });

    res.json({ ok: true, order });
  } catch (err) {
    console.error('Error in saveOrder:', err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    // ดึงคำสั่งซื้อของผู้ใช้ และเรียงจากวันล่าสุด -> เก่าสุด
    const orders = await prisma.order.findMany({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" }, // 🔥 เรียงจากใหม่ -> เก่า
    });

    if (!orders || orders.length === 0) {
      return res.status(400).json({ ok: false, message: "No Order" });
    }

    console.log(orders);
    res.json({ ok: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateUser = async (req, res) => {
  try {
      const { id } = req.params; // ดึง id จาก URL params
      const { currentPassword, password, name, tell, address } = req.body; // ข้อมูลที่ต้องการอัปเดต

      if (!id) {
          return res.status(400).json({ message: 'User ID is required!' }); // ถ้าไม่มี id ให้แสดงข้อผิดพลาด
      }

      const existingUser = await prisma.user.findUnique({
          where: { id: parseInt(id) }, // แปลง id ให้เป็นตัวเลข
      });

      if (!existingUser) {
          return res.status(404).json({ message: 'User not found!' }); // ถ้าผู้ใช้ไม่พบให้แสดงข้อผิดพลาด
      }

      // ตรวจสอบรหัสผ่านเดิม
      if (password && !currentPassword) {
          return res.status(400).json({ message: 'Current password is required!' });
      }

      if (currentPassword) {
          const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
          if (!isPasswordValid) {
              return res.status(400).json({ message: 'Current password is incorrect!' }); // รหัสผ่านเดิมไม่ถูกต้อง
          }
      }

      // ถ้ามีการเปลี่ยนรหัสผ่าน, จะทำการแฮชรหัสผ่านใหม่
      let hashPassword = existingUser.password;
      if (password) {
          hashPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่านใหม่
      }

      const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) },
          data: {
              password: hashPassword,
              name: name || existingUser.name,
              tell: tell || existingUser.tell,
              address: address || existingUser.address,
          },
      });

      res.status(200).json({
          message: 'User updated successfully!',
          user: {
              id: updatedUser.id,
              name: updatedUser.name,
              tell: updatedUser.tell,
              address: updatedUser.address,
          },
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
};



exports.getUserById = async (req, res) => {
  try {
      const { id } = req.params;  // ดึงค่า id จาก URL params
      if (!id) {
          return res.status(400).json({ message: "กรุณาระบุ ID ของผู้ใช้" });
      }

      // ค้นหาผู้ใช้ในฐานข้อมูลตาม ID
      const user = await prisma.user.findUnique({
          where: {
              id: parseInt(id),  // ใช้ parseInt เพื่อแปลงค่า id เป็นตัวเลข
          },
      });

      if (!user) {
          return res.status(404).json({ message: "ไม่พบผู้ใช้" });
      }

      res.status(200).json({ user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }
};

exports.getUserAddress = async (req, res) => {
  try {
    const { id } = req.params;  // ดึงค่า id จาก URL params
    if (!id) {
      return res.status(400).json({ message: "กรุณาระบุ ID ของผู้ใช้" });
    }

    // ค้นหาผู้ใช้ในฐานข้อมูลและดึงที่อยู่
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),  // ใช้ parseInt เพื่อแปลงค่า id เป็นตัวเลข
      },
    });

    if (!user || !user.address) {
      return res.status(404).json({ message: "ไม่พบที่อยู่ของผู้ใช้" });
    }

    // ส่งที่อยู่
    res.status(200).json({ address: user.address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงที่อยู่ของผู้ใช้" });
  }
};