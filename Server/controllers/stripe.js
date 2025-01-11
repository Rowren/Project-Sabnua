const prisma = require("../Config/prisma");
const stripe = require("stripe")('sk_test_51QfFWYAR1tw9JtihEmz1h5FFqR1cujceDPbixbArQObLQI0Sn5lhoL9EmElTIJgUNJA92Uzo6FsMpiujWxaoyOcj00s51Izh78');

exports.payment = async (req, res) => {
  try {
    //code
    //check user
    const cart = await prisma.cart.findFirst({
      where:{
        orderedById:req.user.id
      }
    })
   const amountTHB = cart.cartTotal * 100


    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
  } catch (err) {
    //error
    console.log(err);
    res.status(500).json({ message: " Sever Error" });
  }
};