import express from "express";
import authController from "../controllers/authController";
import User from "../models/User";
import multer from "multer"

const router=express.Router();

router.post('/register',authController.createUser);
router.post("/login",authController.loginUser);


export default router;