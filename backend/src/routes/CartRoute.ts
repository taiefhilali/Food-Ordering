import express, { Request, Response } from 'express';
const router = express.Router();

const {
    addProductToCart,
    removePrductFromCart,
    fetchUserCart,
    clearUserCart,
    getCartCount,
    decrementProductQty,
    getAllCarts,
    updateCartItemQuantity
} = require('../controllers/CartController');
const { verifyToken, verifyUserType } = require('../middleware/verifyToken')


router.post('/', verifyToken, verifyUserType,addProductToCart);
router.post('/decrement', verifyToken, verifyUserType,decrementProductQty);
router.delete('/delete/:id', verifyToken, verifyUserType,removePrductFromCart);
router.get('/', verifyToken, verifyUserType,fetchUserCart);
router.get('/count', verifyToken, verifyUserType,getCartCount);
router.delete('/count/:id', verifyToken, verifyUserType,clearUserCart);
router.get('/carts',verifyToken, verifyUserType,getAllCarts);
router.patch('/my/cart/:itemId', verifyToken, verifyUserType, updateCartItemQuantity);


export default router;
