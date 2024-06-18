import express from "express";
import authController from "../controllers/authController";
import User from "../models/User";
import multer from "multer"
const { verifyToken, verifyUserType } = require('../middleware/verifyToken')

const router=express.Router();

router.post('/register',verifyToken, verifyUserType ,authController.createUser);
router.post("/login",authController.loginUser);
router.post("/log",verifyToken, verifyUserType ,authController.loguser);


export default router;