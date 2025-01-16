const prisma = require("../Config/prisma");

exports.changeOrderStatus = async(req,res)=>{
    try {
        //code
        const {orderId, orderStatus} = req.body
        // console.log(orderId,OrderStatus)
        const orderUpdate = await prisma.order.update({
            where:{ id:orderId },
            data:{ orderStatus: orderStatus }
        })
        
        res.json(orderUpdate)

      } catch (err) {
        //error
        console.log(err);
        res.status(500).json({ message: " Sever Error" });
      }
}

exports.getOrderAdmin = async (req,res) => {
    try {
        //code
        const orders = await prisma.order.findMany({
            include:{
                products:{
                    include:{
                        product:true
                    }
                },
                orderedBy:{
                    select:{
                        id:true,
                        email:true,
                        address:true,
                        tell:true,
                        
                    }
                }
            }
        })
        res.json(orders)
      } catch (err) {
        //error
        console.log(err);
        res.status(500).json({ message: " Sever Error" });
      }
}