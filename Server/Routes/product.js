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

router.post("/product", create);
router.get("/products/:count", list);
router.get("/product/:id", read);
router.put("/product/:id",  update);
router.delete("/product/:id",  remove);
router.post("/productby",listby);
router.post("/search/filters", searchFilters);

router.post("/images", authCheck, adminCheck,createImages);
router.delete("/remove-image", authCheck, adminCheck,removeImage);

module.exports = router;
