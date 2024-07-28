import express from "express";
import authController from "../controllers/authController";
import User from "../models/User";
import multer from "multer"
import passport from "passport";
const { verifyToken, verifyUserType,verifyVendor } = require('../middleware/verifyToken')

const router=express.Router();
const CLIENT_URL = "http://localhost:3000";

router.post('/register',authController.createUser);
router.post("/login",authController.loginUser);
router.post("/log",authController.loguser);
router.post('/forgot-password',verifyToken, verifyVendor,authController.forgotPassword);
router.post('/reset-password',verifyToken, verifyVendor,authController.resetPassword);

router.get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        //   cookies: req.cookies
      });
    }
  });
  
  router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failure",
    });
  });
  
  
  router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
  
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
    })
  );
  
  router.get("/github", passport.authenticate("github", { scope: ["profile"] }));
  
  router.get(
    "/github/callback",
    passport.authenticate("github", {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
    })
  );
  
  router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));
  
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
    })
  );
  router.post('/clerk-user', async (req, res) => {
    try {
      const { userId, email, token, userType,username } = req.body; // Extract relevant user data
  
      // Check if user already exists in MongoDB
      let user = await User.findOne({ clerkId: userId });
  
      if (user) {
        return res.status(200).json({ message: 'User already exists in database' });
      }
  
      // If user does not exist, create a new user in MongoDB
      user = new User({
        clerkId: userId,
        email,
        userType,
        username
        // Add other relevant fields as needed
      });
  
      // Save the user to MongoDB
      await user.save();
  
      res.status(201).json({ message: 'User added to MongoDB successfully' });
    } catch (error) {
      console.error('Error saving user to MongoDB:', error);
      res.status(500).json({ message: 'Failed to save user to MongoDB' });
    }
  });
  
// Endpoint to authenticate with Facebook
export default router;