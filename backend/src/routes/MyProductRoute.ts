const express = require('express');
const router = express.Router();
const productController = require('../controllers/MyProductController');
const multer = require('multer');
const { verifyToken, verifyAdmin, verifyVendor } = require('../middleware/verifyToken');

// Set up Multer storage for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


router.get('/', productController.getAllProducts);
router.get('/quantity', productController.quantityProduct);
router.get('/all', verifyToken, productController.productsByUserId);
router.get('/search', productController.searchProductByName);
router.post('/sell', productController.sellProduct);
router.post('/', upload.single("imageFile"), verifyToken, verifyVendor, productController.createMyProduct);
router.get('/revenue/:date', productController.revenuStatistics);


// Define the more specific route before the less specific one
router.get('/:restaurantId/revenue', productController.calculateRestaurantRevenue);

router.get('/:id', productController.getProductById);
  
router.put('/:id', productController.updateProduct);

router.delete('/:id', verifyToken, verifyVendor, productController.deleteProduct);
router.patch('/:id/toggle-approval', verifyToken, verifyAdmin, productController.toggleProductApproval);
router.get('/:restaurantId', productController.productsByRestaurantId);
router.get('/category/:categoryId', verifyToken, verifyVendor,productController.getProductBycategory);
router.post('/like/:productId', productController.LikeProduct);

// Route for fetching products by restaurantId
export default router;


// const express = require('express');

// const router = express.Router();
// const productController = require('../controllers/MyProductController');
// const multer = require('multer');
// const {verifyToken, verifyAdmin,verifyVendor} = require('../middleware/verifyToken')

// // Set up Multer storage for file uploads
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });
// router.get('/',productController.getAllProducts);
// router.get('/quantity',productController.quantityProduct);
// router.get('/all',verifyToken,verifyVendor,productController.productsByUserId);
// router.get('/search',productController.searchProductByName);
// router.post('/sell', productController.sellProduct);
// router.post('/', upload.single("imageFile"), verifyToken,verifyVendor,productController.createMyProduct);
// router.get('/:restaurantId/revenue', productController.calculateRestaurantRevenue);
// router.get('/:id', productController.getProductById);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', verifyToken, verifyVendor,productController.deleteProduct);
// router.patch('/:id/toggle-approval', verifyToken,verifyAdmin, productController.toggleProductApproval);


// export default router;