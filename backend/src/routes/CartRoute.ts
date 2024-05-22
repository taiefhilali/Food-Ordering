const express = require('express');
const router = express.Router();
const {
    addProductToCart,
    removePrductFromCart,
    fetchUserCart,
    clearUserCart,
    getCartCount,
    decrementProductQty,
    getAllCarts
} = require('../controllers/CartController');
const { verifyToken, verifyUserType } = require('../middleware/verifyToken')


router.post('/', verifyToken, verifyUserType,addProductToCart);
router.post('/decrement', verifyToken, verifyUserType,decrementProductQty);
router.delete('/delete/:id', verifyToken, verifyUserType,removePrductFromCart);
router.get('/', verifyToken, verifyUserType,fetchUserCart);
router.get('/count', verifyToken, verifyUserType,getCartCount);
router.delete('/count/:id', verifyToken, verifyUserType,clearUserCart);
router.get('/carts',getAllCarts);



export default router;
