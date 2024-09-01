import express from "express";
import multer from "multer"
import MyRestaurantController from "../controllers/MyRestaurantController";

import {validateMyRestaurantRequest} from "../middleware/validation"
const router=express.Router();
const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5MB
    }
})
const { verifyToken, verifyVendor } = require('../middleware/verifyToken')


// /api/my/restaurant,
router.post("/",upload.single("imageFile"),verifyToken,verifyVendor,validateMyRestaurantRequest,MyRestaurantController.createMyRestaurant);
router.get("/",verifyToken,verifyVendor,MyRestaurantController.getMyRestaurant);
router.get("/allmyrestaurants",verifyToken,verifyVendor,MyRestaurantController.getAllRestaurantbyUser);
router.get("/restaurants",MyRestaurantController.getAllRestaurant);
router.put("/",validateMyRestaurantRequest,MyRestaurantController.updateMyRestaurant)
router.get('/search', MyRestaurantController.searchRestaurantByName);

router.get('/:restaurantName',MyRestaurantController.getRestaurantbyName)
router.post('/like/:restaurantId', MyRestaurantController.LikeRestaurant);
// Route to toggle restaurant approval status
router.patch('/:id/toggle-approval', MyRestaurantController.toggleRestaurantApproval);
// API endpoint to fetch restaurant data
router.get('/:id',MyRestaurantController.getCuisinesStat);
// Get all restaurants for a specific user
router.get('/:userId/restaurants',MyRestaurantController.restaurantsbyspcuser);
export default router;