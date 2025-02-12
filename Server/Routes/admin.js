const express = require('express');
const { authCheck, adminCheck } = require('../middlewares/authcheck'); // ตรวจสอบสิทธิ์ผู้ใช้
const router = express.Router();

// Import controllers
const {
  getOrderAdmin, 
  changeOrderStatus, 
  listUsers, 
  updateUser, 
  deleteUser, 
  getUserById, 
  getDashboardData
} = require('../controllers/admin');

// Routes สำหรับผู้ใช้
router.get('/admin/users', authCheck, adminCheck, listUsers);
router.get('/admin/user/:id', authCheck, adminCheck, getUserById);
router.put('/admin/update-user/:id', authCheck, adminCheck, updateUser);
router.delete('/admin/remove-user/:id', authCheck, adminCheck, deleteUser);

// Routes สำหรับคำสั่งซื้อ
router.put('/admin/order-status', authCheck, adminCheck, changeOrderStatus);
router.get('/admin/orders', authCheck, adminCheck, getOrderAdmin);

// Route สำหรับแดชบอร์ด
router.get('/admin/dashboard', authCheck, adminCheck, getDashboardData);

module.exports = router;
