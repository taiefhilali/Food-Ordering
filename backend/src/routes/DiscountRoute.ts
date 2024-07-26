
const express = require('express');
const router = express.Router();
const {validatecoupon,addCoupon}=require('../controllers/DiscountController');


router.post('/validate-coupon',validatecoupon);
router.post('/add-coupon', addCoupon);

export default router;
