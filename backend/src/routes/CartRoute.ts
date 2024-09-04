import express from 'express';
const router = express.Router();

const {
    addProductToCart,
    removeProductFromCart,
    fetchUserCart,
    clearUserCart,
    getCartCount,
    decrementProductQty,
    getAllCarts,
    updateCartItemQuantity,payment,getCartByUser,incrementProductQty,deleteAllCart,addFoodToCart,displayCartWithAmountAndUser
} = require('../controllers/CartController');
const { verifyToken, verifyUserType } = require('../middleware/verifyToken')


router.post('/', verifyToken, verifyUserType,addProductToCart);
router.post('/food', verifyToken, verifyUserType,addFoodToCart);
router.post('/decrement/:productId', verifyToken, verifyUserType,decrementProductQty);
router.post('/increment/:productId', verifyToken, verifyUserType,incrementProductQty);
router.delete('/deleteAll', verifyToken, verifyUserType,deleteAllCart);
router.delete('/delete/:id', verifyToken, verifyUserType,removeProductFromCart);
router.get('/', verifyToken, verifyUserType,fetchUserCart);
router.get('/cart', verifyToken, verifyUserType,getCartByUser);
router.get('/count', verifyToken, verifyUserType,getCartCount);
router.get('/displaycart', verifyToken, verifyUserType,displayCartWithAmountAndUser);
router.delete('/count/:id', verifyToken, verifyUserType,clearUserCart);
router.get('/carts',verifyToken, verifyUserType,getAllCarts);
router.patch('/my/cart/:itemId', verifyToken, verifyUserType, updateCartItemQuantity);

// payment with stripe

router.post('/payments', verifyToken, verifyUserType, payment);

export default router;
