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
const { verifyAdmin} = require('../middleware/verifyToken')

// Route to create a new category
router.post('/',verifyAdmin, createCategory);

// Route to update a category by ID
router.put('/:id',verifyAdmin, updateCategory);

// Route to delete a category by ID
router.delete('/:id',verifyAdmin, deleteCategory);

// Route to get all categories
router.get('/',getAllCategories);

// Route to update category image by ID
router.post('/image/:id',verifyAdmin, patchCategoryImage);

// Route to get random categories
router.get('/random',getRandomCategories);

export default router;