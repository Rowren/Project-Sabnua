const jwt = require('jsonwebtoken')
const prisma = require('../Config/prisma')

/// เช็คสิทธิ์ผู้ใช้
exports.authCheck = async (req,res,next)=>{
    try {
        //code
        const headerToken = req.headers.authorization
        console.log(headerToken)
        // ถ้าไม่มีข้อมูล error
        if(!headerToken){
            return res.status(401).json({message:"No Token , Authorization"})
        }
        const token = headerToken.split(" ")[1]

        const decode = jwt.verify(token,process.env.SECRET)        
        req.user = decode
        

        const user = await prisma.user.findFirst({
            where:{
                email: req.user.email
            }
        })

        //ถ้า ผู้ใช้ถูก
        if(!user.enabled){
            return res.status(400).json({message:'This account cannot '})
                }

        next()
    } catch (err) {
      //error
      console.log(err)
      res.status(500).json({message: ' Token Invalid'})
  }
}

/// เช็คสิทธิ์แอดมิน
exports.adminCheck = async(req,res,next) =>{
    try {
        const { email } = req.user
        const adminUser = await prisma.user.findFirst({
            where:{email: email}
        })
        // ถ้าไม่ใช้ admin error
        if(!adminUser || adminUser.role !== 'admin'){
            return res.status(403).json({message: "Access Denied: Admin Only"})
        }

        // console.log('admin check',email)

        next()

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error Admin access denied"})
    }
}

/// เช็คสิทธิ์พนักงาน หรือ แอดมิน
exports.employeeCheck = async (req, res, next) => {
    try {
        const { email } = req.user;
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // ถ้าไม่ใช่ employee หรือ admin
        if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
            return res.status(403).json({ message: "Access Denied: Employee or Admin Only" });
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error Employee/Admin access denied" });
    }
};

