const express = require('express');
const router = express.Router();
const {
    addPrductToCart,
    removePrductFromCart,
    fetchUserCart,
    clearUserCart,
    getCartCount,
    decrementProductQty
} = require('../controllers/CartController');
const { verifyToken, verifyUserType } = require('../middleware/verifyToken')


router.post('/', verifyToken, verifyUserType,addPrductToCart);
router.post('/decrement', verifyToken, verifyUserType,decrementProductQty);
router.delete('/delete/:id', verifyToken, verifyUserType,removePrductFromCart);
router.get('/', verifyToken, verifyUserType,fetchUserCart);
router.get('/count', verifyToken, verifyUserType,getCartCount);
router.delete('/count/:id', verifyToken, verifyUserType,clearUserCart);




export default router;
