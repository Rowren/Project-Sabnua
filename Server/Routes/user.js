const express = require('express')
const router = express.Router()
const {  userCart, getUserCart, saveAddress, saveOrder, emptyCart, getOrder, updateUser, getUserById } = require('../controllers/user')
const { authCheck,  } = require('../middlewares/authcheck')




router.post('/user/cart',authCheck,userCart)
router.get('/user/cart',authCheck,getUserCart)
router.delete('/user/cart',authCheck,emptyCart)

router.post('/user/address',authCheck,saveAddress)

router.post('/user/order',authCheck,saveOrder)
router.get('/user/order',authCheck,getOrder)

router.put('/users/:id', authCheck, updateUser);
router.get('/users/:id', authCheck, getUserById);


 

module.exports = router