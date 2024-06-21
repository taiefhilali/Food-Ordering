const express = require('express');
const router = express.Router();
const productController = require('../controllers/MyProductController');
const multer = require('multer');
const {verifyToken, verifyAdmin} = require('../middleware/verifyToken')

// Set up Multer storage for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
router.get('/',productController.getAllProducts);
router.get('/quantity',productController.quantityProduct);
router.post('/', upload.single("imageFile"), productController.createMyProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/toggle-approval', verifyToken,verifyAdmin, productController.toggleProductApproval);

export default router;