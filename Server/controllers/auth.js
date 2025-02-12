const prisma = require('../Config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ฟังก์ชันลงทะเบียน
exports.register = async (req, res) => {
    try {
        const { email, password, name, tell, image } = req.body;

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
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!!' });
        }

        // Step 3: Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

      


        // Step 5: Register the user in the database
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashPassword,
                name: name,
                tell: tell,
            },
        });

        res.status(201).json({
            message: 'Register Success',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
           
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ฟังก์ชันล็อกอิน
exports.login = async (req, res) => {
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
        // Step 2 Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Password Invalid!!!' })
        }
        // Step 3 Create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        // Step 4 Generate Token
        jwt.sign(payload, process.env.SECRET, { expiresIn: '3hr' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" })
            }
            res.json({ payload, token })

        })
    } catch (err) {
        // err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.currentUser = async (req, res) => {
    try {
        //code
        const user = await prisma.user.findFirst({
            where: { email: req.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({ user })
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}




