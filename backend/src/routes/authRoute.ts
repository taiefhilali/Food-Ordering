import express from "express";
import authController from "../controllers/authController";
import User from "../models/User";
import multer from "multer"
import passport from "passport";
const { verifyToken, verifyUserType,verifyVendor } = require('../middleware/verifyToken')

const router=express.Router();
const CLIENT_URL = "http://localhost:3000";

router.post('/register',verifyToken, verifyUserType ,authController.createUser);
router.post("/login",authController.loginUser);
router.post("/log",verifyToken, verifyUserType ,authController.loguser);
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
// Endpoint to authenticate with Facebook
export default router;