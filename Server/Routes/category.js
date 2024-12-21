const express = require('express');
const router = express.Router();
const { create, list, remove } = require('../controllers/category');
const { authCheck, adminCheck, employeeCheck } = require('../middlewares/authCheck');

// @ENDPOINT http://localhost:5004/api/category

// Route สำหรับสร้างหมวดหมู่ (เฉพาะ admin เท่านั้น)
router.post('/category', authCheck, adminCheck, create);

// Route สำหรับแสดงรายการหมวดหมู่ (admin และ employee เข้าถึงได้)
router.get('/category', authCheck, adminCheck, employeeCheck, list);

// Route สำหรับลบหมวดหมู่ (เฉพาะ admin เท่านั้น)
router.delete('/category/:id', authCheck, adminCheck, remove);

module.exports = router;
