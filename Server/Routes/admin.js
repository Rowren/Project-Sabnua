const express = require('express');
const { authCheck } = require('../middlewares/authcheck');
const router = express.Router();

//import  controllers
const { getOrderAdmin, changeOrderStatus } = require('../controllers/admin')

router.put('/admin/order-status',authCheck,changeOrderStatus)
router.get('/admin/orders', authCheck,getOrderAdmin)



module.exports = router;
