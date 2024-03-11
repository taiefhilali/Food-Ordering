import express from "express";
import { param } from "express-validator";
import MyRestaurantController from "../controllers/MyRestaurantController";
import RestaurantController from "../controllers/RestaurantController";

const router= express.Router();

router.get("/search/:restaurantName",param("restaurantName").isString().trim().notEmpty().withMessage("restaurant name must be a valid string"),RestaurantController.searchRestaurant);

export default router;