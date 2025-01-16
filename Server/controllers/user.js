const { Prisma } = require("@prisma/client");
const prisma = require("../Config/prisma");
const { user } = require("../Config/prisma");

exports.listUsers = async (req, res) => {
  try {
    //code

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
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
exports.changeStatus = async (req, res) => {
  try {
    //code
    const { id, enabled } = req.body;
    console.log(id, enabled);
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled: enabled },
    });
    res.send("Update Status Success");
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};
exports.ChangeRole = async (req, res) => {
  try {
    //code
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role },
    });
    res.send("Update Role Success");
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};

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
    const adddressUser = await prisma.user.update({
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
    //code
    // Step 0 Check Stripe
    console.log("Request Body:", req.body); // Debugging

    // ตรวจสอบว่า payload และ paymentIntent มีอยู่หรือไม่
    if (!req.body.payload || !req.body.payload.paymentIntent) {
      return res.status(400).json({ error: 'Missing paymentIntent in request body payload' });
    }

    // ดึงข้อมูลจาก paymentIntent
    const { id, amount, status, currency } = req.body.payload.paymentIntent;

    //Step 1 Get User Cart
   const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: { products: true }, // ดึงรายละเอียดสินค้า
    });

    //Check Cart Empty
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Cart is Empty",
      });
    }

    const amountTHB = Number(amount) / 100

    // สร้าง order
    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: {
          connect: { id: req.user.id },
        },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currency: currency,
      },
    });


     // อัปเดตสินค้าคงคลัง
     const update = userCart.products.map((item) => ({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count },
      },
    }));
    await Promise.all(update.map((updated) => prisma.product.update(updated)));

    // ลบ cart หลังจากสร้าง order
    await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user.id) },
    });

    res.json({ ok: true, order });
  } catch (err) {
    console.error('Error in saveOrder:', err); // Log ข้อผิดพลาด
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    // ดึงคำสั่งซื้อทั้งหมดของผู้ใช้
    const orders = await prisma.order.findMany({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!orders || orders.length === 0) {
      return res.status(400).json({ ok: false, message: "No Order" });
    }

    console.log(orders); // ตรวจสอบข้อมูลใน console
    res.json({ ok: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
