import multer from "multer";

const express = require('express');
const router = express.Router();
import  CategoryController from '../controllers/CategoryController';


const {verifyToken, verifyAdmin,verifyVendor} = require('../middleware/verifyToken')
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// Route to create a new category
router.post('/', verifyToken, verifyVendor, upload.single("imageFile"), CategoryController.createCategory);
//  router.post('/', upload.single("imageFile"), createCategory);

router.get('/all',verifyToken,verifyVendor,CategoryController. categoriesByUserId);

// Route to update a category by ID
router.put('/:id',verifyToken, CategoryController.updateCategory);

// Route to delete a category by ID
router.delete('/:id',verifyToken, CategoryController.deleteCategory);

// Route to get all categories
router.get('/',CategoryController.getAllCategories);

// Route to update category image by ID
router.post('/image/:id',verifyToken,verifyAdmin, CategoryController.patchCategoryImage);

// Route to get random categories
router.get('/random',CategoryController.getRandomCategories);
router.get('/categories',CategoryController.getDistinctCategories);


export default router;