const express = require('express');
const router = express.Router();
const {
    AddFood,
    getFoodById,
    getFoodByRestaurant,
    deleteFoods,
    foodAvailability,
    updateFood,
    addFoodTag,
    getRandomFoodByRating,
    addFoodType,
    getRandomByCategory
} = require('../controllers/FoodsController');
const {verifyVendor} = require('../middleware/verifyToken')

// Route to add a new food item
router.post('/', verifyVendor,AddFood);

// Route to add a tag to a food item
router.post('/tags/:id',verifyVendor, addFoodTag);

// Route to add a food type to a food item
router.post('/type/:id',verifyVendor, addFoodType);

// Route to get food item by ID
router.get('/:id', getFoodById);

// Route to get food items by restaurant
router.get('/restaurant/:restaurantId', getFoodByRestaurant);

// Route to delete a food item
router.delete('/:id',verifyVendor, deleteFoods);

// Route to toggle food availability
router.patch('/availability/:id',verifyVendor, foodAvailability);

// Route to update food item
router.put('/:id',verifyVendor, updateFood);

// Route to get random food items by rating count
router.get('/rating/:rating', getRandomFoodByRating);

// Route to get random food items by category
router.get('/category/:category', getRandomByCategory);

export default router;