const express = require('express');
const { authCheck } = require('../middlewares/authcheck');
const { payment } = require('../controllers/stripe');
const router = express.Router();

//import  controllers

router.post('/user/create-payment-intent',authCheck,payment)



module.exports = router;
