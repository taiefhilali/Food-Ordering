import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";
const { verifyToken, verifyVendor } = require('../middleware/verifyToken')

const router= express.Router();

router.get("/search/:restaurantName",param("restaurantName").isString().trim().notEmpty().withMessage("restaurant name must be a valid string"),RestaurantController.searchRestaurant);
// Route to add a new restaurant
router.post("/", verifyToken,verifyVendor,RestaurantController.addrestaurant);

// Route to toggle service availability of a restaurant
router.patch("/serviceAvailability/:id",verifyToken,verifyVendor, RestaurantController.serviceAvailability);

// Route to delete a restaurant
router.delete("/:id",verifyToken,verifyVendor, RestaurantController.deleteResataurant);

// Route to get details of a restaurant
router.get("/:id",verifyToken,verifyVendor, RestaurantController.getRestaurant);
router.post('/restaurants/:id/ratings',RestaurantController.addratingtorestaurant)

export default router;