
const express = require('express');
const router = express.Router();
const {validatecoupon,addCoupon,getCouponsByRestaurant}=require('../controllers/DiscountController');

router.post('/validate-coupon',validatecoupon);
router.post('/add-coupon', addCoupon);
router.get('/by-restaurant', getCouponsByRestaurant);

export default router;
