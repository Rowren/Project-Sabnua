const express = require("express");
const router = express.Router();

// Controller
const {
  create,
  list,
  remove,
  update,
  listby,
  searchFilters,
  read,
  createImages,
  removeImage
} = require("../controllers/product");

// Middleware for checking authorization
const {
  authCheck,
  adminCheck,
  employeeCheck,
} = require("../middlewares/authCheck");

// @ENDPOINT http://localhost:5004/api/product

// Route สำหรับการสร้างสินค้า (เฉพาะ admin เท่านั้น)
router.post("/product", authCheck, adminCheck, create);

// Route สำหรับแสดงรายการสินค้า (สามารถให้ admin และ employee เข้าถึงได้)
router.get("/products/:count", authCheck, adminCheck, employeeCheck, list);

// Route สำหรับการดูรายละเอียดสินค้า (สามารถให้ admin และ employee เข้าถึงได้)
router.get("/product/:id", authCheck, adminCheck, employeeCheck, read);

// Route สำหรับการอัพเดตสินค้า (เฉพาะ admin เท่านั้น)
router.put("/product/:id", authCheck, adminCheck, update);

// Route สำหรับการลบสินค้า (เฉพาะ admin เท่านั้น)
router.delete("/product/:id", authCheck, adminCheck, remove);

// Route สำหรับแสดงรายการสินค้าตามประเภทหรือเงื่อนไขที่กำหนด (สามารถให้ admin และ employee เข้าถึงได้)
router.post("/productby", authCheck, adminCheck, employeeCheck, listby);

// Route สำหรับค้นหาสินค้าตามเงื่อนไขต่างๆ (สามารถให้ admin และ employee เข้าถึงได้)
router.get(  "/search/filters",  authCheck,  adminCheck, employeeCheck, searchFilters);

router.post("/images", authCheck, adminCheck,createImages);
router.delete("/remove-image", authCheck, adminCheck,removeImage);

module.exports = router;
