const prisma = require("../Config/prisma");
const stripe = require('stripe')('sk_test_51QfFWgPIj0maEGG5gTvFcaHCDsW5RBICc4CbgMnxdm0wwYYL6q2GPVak6q5NRRHsDX205xPL6gCuAmJQxxmTGAhN009Cpdscdu');

exports.payment = async (req, res) => {
  try {
    // ตรวจสอบว่ามี req.user.id หรือไม่
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ดึงข้อมูลตะกร้าสินค้าของผู้ใช้
    const cart = await prisma.cart.findFirst({
      where: { orderedById: req.user.id },
    });

    // ตรวจสอบว่ามีตะกร้าสินค้าหรือไม่
    if (!cart || cart.cartTotal === undefined) {
      return res.status(400).json({ message: "Cart not found or invalid total" });
    }

    const amountTHB = Math.round(cart.cartTotal * 100); // แปลงเป็นสตางค์

    // สร้าง PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      automatic_payment_methods: { enabled: true },
    });

    // ส่ง clientSecret กลับไปให้ Frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
