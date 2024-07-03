import express, { Request, Response } from 'express';
const router = express.Router();

const {
    addProductToCart,
    removeProductFromCart,
    fetchUserCart,
    clearUserCart,
    getCartCount,
    decrementProductQty,
    getAllCarts,
    updateCartItemQuantity,payment,getCartByUser,incrementProductQty
} = require('../controllers/CartController');
const { verifyToken, verifyUserType } = require('../middleware/verifyToken')


router.post('/', verifyToken, verifyUserType,addProductToCart);
router.post('/decrement', verifyToken, verifyUserType,decrementProductQty);
router.post('/increment', verifyToken, verifyUserType,incrementProductQty);
router.delete('/delete/:id', verifyToken, verifyUserType,removeProductFromCart);
router.get('/', verifyToken, verifyUserType,fetchUserCart);
router.get('/cart', verifyToken, verifyUserType,getCartByUser);
router.get('/count', verifyToken, verifyUserType,getCartCount);
router.delete('/count/:id', verifyToken, verifyUserType,clearUserCart);
router.get('/carts',verifyToken, verifyUserType,getAllCarts);
router.patch('/my/cart/:itemId', verifyToken, verifyUserType, updateCartItemQuantity);

// payment with stripe

router.post('/payments', verifyToken, verifyUserType, payment);

export default router;
