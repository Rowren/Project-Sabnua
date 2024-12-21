const express = require("express");
const router = express.Router();

//import  controllers
const { register, login, currentUser } = require("../controllers/auth");

const { authCheck, adminCheck, employeeCheck } = require("../middlewares/authCheck");

router.post("/register", register);
router.post("/login", login);
router.post("/current-user",authCheck, currentUser);
router.post("/current-admin",authCheck,adminCheck, currentUser);
router.post("/current-employee", authCheck, employeeCheck, currentUser);

module.exports = router;
