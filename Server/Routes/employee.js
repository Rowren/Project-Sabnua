// employee.js
const express = require('express');
const { authCheck, employeeCheck } = require('../middlewares/authcheck');
const { 
    updateOrderStatus, 
    getUserInfo, 
    getDashboard, 
    getAllUsers, 
    getOrderEmployee, 
    updateUserEmp, 
    getUserByIdEmp, 
    changeStatusOrder, 
    getOrderUser 
} = require('../controllers/employee');
const router = express.Router();

// สำหรับการอัพเดตสถานะการสั่งซื้อ
router.put('/employee/order-status', authCheck, employeeCheck, updateOrderStatus);

// สำหรับการดึงข้อมูลผู้ใช้
router.get('/employee/user/:id', authCheck, employeeCheck, getUserByIdEmp);
router.get('/employee/users', authCheck, employeeCheck, getAllUsers);
router.put('/employee/update-user/:id', authCheck, employeeCheck, updateUserEmp);

router.get('/employee/dashboard', authCheck, employeeCheck, getDashboard);
router.get('/employee/order', authCheck, employeeCheck, getOrderEmployee);
router.get('/employee/order/:orderId', authCheck, employeeCheck, getOrderUser);
router.put('/employee/order-status', authCheck, employeeCheck, changeStatusOrder);

module.exports = router;
