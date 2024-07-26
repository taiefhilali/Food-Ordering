
const express = require('express');
const router = express.Router();
const {validatecoupon,addCoupon,getCouponsByRestaurant,deleteExpiredCoupons}=require('../controllers/DiscountController');


router.post('/validate-coupon',validatecoupon);
router.post('/add-coupon', addCoupon);
router.get('/by-restaurant', getCouponsByRestaurant);
router.delete('/delete', deleteExpiredCoupons);
export default router;
