const prisma = require('../Config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

exports.register = async (req, res) => {
    try {
        const { email, password, name, tell } = req.body;

        // Step 1: Validate body
        if (!email) {
            return res.status(400).json({ message: 'Email is required !!!' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required !!!' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Name is required !!!' });
        }
        if (!tell) {
            return res.status(400).json({ message: 'Phone number is required !!!' });
        }

        // Step 2: Check if email already exists in DB
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (user) {
            return res.status(400).json({ message: "Email already exists!!" });
        }

        // Step 3: Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Step 4: Register the user in the database
        await prisma.user.create({
            data: {
                email: email,
                password: hashPassword,
                name: name,
                tell: tell
            }
        });

        res.send('Register Success');
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.login =  async (req,res) => {
    try {
        //code
        const { email, password } = req.body
        // Step 1 Check Email
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user || !user.enabled) {
            return res.status(400).json({ message: 'User Not found or not Enabled' })
        }
        //step 2 Check Password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(500).json({message: "Password Invalid!!!"})
        }
        //step 3 Create Payload
        const payload ={
            id: user.id,
            email: user.email,
            role: user.role

        }
        //step 4 Generate Token
        jwt.sign(payload,process.env.SECRET,{
            expiresIn: '1h'
        },(err,token) =>{
            if(err){
                return res.status(500).json({ message:"Server Error"})
            }
            res.json({payload, token})
        })

    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.currentUser = async(req,res) => {
    try {
        //code
        const user = await prisma.user.findFirst({
            where:{email: req.user.email},
            select:{
                id:true,
                email:true,
                name:true,
                role:true
            }
        })
        res.json({user})

    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}


 