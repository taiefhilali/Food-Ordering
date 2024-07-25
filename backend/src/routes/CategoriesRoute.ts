import multer from "multer";

const express = require('express');
const router = express.Router();
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    patchCategoryImage,
    getRandomCategories,getDistinctCategories,categoriesByUserId
} = require('../controllers/categoryController');
const {verifyToken, verifyAdmin,verifyVendor} = require('../middleware/verifyToken')
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Route to create a new category
 router.post('/',verifyToken, verifyVendor, upload.single("imageFile"), createCategory);
//  router.post('/', upload.single("imageFile"), createCategory);

router.get('/all', verifyToken, categoriesByUserId);

// Route to update a category by ID
router.put('/:id',verifyToken,verifyAdmin, updateCategory);

// Route to delete a category by ID
router.delete('/:id',verifyToken,verifyVendor, deleteCategory);

// Route to get all categories
router.get('/',getAllCategories);

// Route to update category image by ID
router.post('/image/:id',verifyToken,verifyAdmin, patchCategoryImage);

// Route to get random categories
router.get('/random',getRandomCategories);
router.get('/categories', getDistinctCategories);


export default router;