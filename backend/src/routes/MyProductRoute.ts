const express = require('express');
const router = express.Router();
const productController = require('../controllers/MyProductController');
const multer = require('multer');

// Set up Multer storage for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
router.get('/',productController.getAllProducts);
router.post('/', upload.single("imageFile"), productController.createMyProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;