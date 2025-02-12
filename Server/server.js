// Step import ...
const express = require('express')
const app = express()
const morgan = require('morgan')
const { readdirSync } = require('fs')
const cors = require('cors')
// const authRouter = require('./Routes/auth')
// const categoryRouter = require('./Routes/category')

// middleware
app.use(morgan('dev'))
app.use(express.json({limit:"30mb"}))
app.use(cors())

// app.use('/api',authRouter)
// app.use('/api',categoryRouter)
readdirSync('./Routes')
.map((c) => app.use('/api', require('./Routes/'+c)))

// Step 3 Router
// app.post('/api',(req,res)=>{
//     //code
//     const { username, password } = req.body
//     console.log(username, password)
//     res.send('Hello sss')
// })
///step 2 Start Sever
app.listen(5004,
    ()=> console.log('Server is running on port 5004')
)