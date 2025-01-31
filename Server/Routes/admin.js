const express = require('express');
const { authCheck, adminCheck } = require('../middlewares/authcheck'); // Import adminCheck
const router = express.Router();

// Import controllers
const { getOrderAdmin, changeOrderStatus, listUsers, updateUser, deleteUser, getUserById, } = require('../controllers/admin');

// Routes
router.get('/admin/users', authCheck, adminCheck, listUsers);
router.get('/admin/user/:id', authCheck, adminCheck, getUserById);
router.put('/admin/update-user/:id', authCheck, adminCheck, updateUser);
router.delete('/admin/remove-user/:id', authCheck, adminCheck, deleteUser);


router.put('/admin/order-status', authCheck, adminCheck,changeOrderStatus);
router.get('/admin/orders', authCheck,adminCheck, getOrderAdmin);

module.exports = router;
