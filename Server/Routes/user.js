const express = require('express')
const router = express.Router()
const { listUsers, changeStatus, ChangeRole, userCart, getUserCart, saveAddress, saveOrder, emptyCart, getOrder } = require('../controllers/user')
const { authCheck, adminCheck } = require('../middlewares/authcheck')

router.get('/users',authCheck,adminCheck,listUsers)
router.post('/change-status',authCheck,adminCheck,changeStatus)
router.post('/change-role',authCheck,adminCheck,ChangeRole)


router.post('/user/cart',authCheck,userCart)
router.get('/user/cart',authCheck,getUserCart)
router.delete('/user/cart',authCheck,emptyCart)

router.post('/user/address',authCheck,saveAddress)

router.post('/user/order',authCheck,saveOrder)
router.get('/user/order',authCheck,getOrder)

 

module.exports = router