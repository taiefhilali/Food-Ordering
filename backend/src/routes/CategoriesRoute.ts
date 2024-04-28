const express = require('express');
const router = express.Router();
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    patchCategoryImage,
    getRandomCategories
} = require('../controllers/categoryController');
const {verifyToken, verifyAdmin} = require('../middleware/verifyToken')

// Route to create a new category
router.post('/', createCategory);

// Route to update a category by ID
router.put('/:id',verifyToken,verifyAdmin, updateCategory);

// Route to delete a category by ID
router.delete('/:id',verifyToken,verifyAdmin, deleteCategory);

// Route to get all categories
router.get('/',getAllCategories);

// Route to update category image by ID
router.post('/image/:id',verifyToken,verifyAdmin, patchCategoryImage);

// Route to get random categories
router.get('/random',getRandomCategories);

export default router;