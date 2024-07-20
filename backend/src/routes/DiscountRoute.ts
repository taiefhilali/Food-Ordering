
const express = require('express');
const router = express.Router();
const {validatecoupon}=require('../controllers/DiscountController');


router.post('/validate-coupon',validatecoupon);
export default router;
