
const express = require('express');
const router = express.Router();
const {validatecoupon,addCoupon,getCouponsByRestaurant,deleteExpiredCoupons}=require('../controllers/DiscountController');

router.post('/add-coupon', addCoupon);
router.post('/validate-coupon',validatecoupon);
// router.delete('/delete', deleteExpiredCoupons);
router.get('/by-restaurant', getCouponsByRestaurant);

export default router;
