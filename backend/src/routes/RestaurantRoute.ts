import express from "express";
import { param } from "express-validator";
import MyRestaurantController from "../controllers/MyRestaurantController";
import RestaurantController from "../controllers/RestaurantController";

const router= express.Router();

router.get("/search/:restaurantName",param("restaurantName").isString().trim().notEmpty().withMessage("restaurant name must be a valid string"),RestaurantController.searchRestaurant);
// Route to add a new restaurant
router.post("/", RestaurantController.addrestaurant);

// Route to toggle service availability of a restaurant
router.put("/:id/serviceAvailability", RestaurantController.serviceAvailability);

// Route to delete a restaurant
router.delete("/:id", RestaurantController.deleteResataurant);

// Route to get details of a restaurant
router.get("/:id", RestaurantController.getRestaurant);

export default router;