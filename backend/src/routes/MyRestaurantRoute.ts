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
const { verifyToken, verifyUserType } = require('../middleware/verifyToken')


// /api/my/restaurant,
router.post("/",upload.single("imageFile"),verifyToken,verifyUserType,validateMyRestaurantRequest,MyRestaurantController.createMyRestaurant);
router.get("/",MyRestaurantController.getMyRestaurant);
router.get("/restaurants",MyRestaurantController.getAllRestaurant);
router.put("/",validateMyRestaurantRequest,MyRestaurantController.updateMyRestaurant)
// API endpoint to fetch restaurant data
router.get('/:id',MyRestaurantController.getCuisinesStat);
export default router;