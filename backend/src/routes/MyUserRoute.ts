import express from "express";
import MyUserController from "../controllers/MyUserController";
import User from "../models/User";
import multer from "multer"

const router=express.Router();
const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5MB
    }
})


router.post("/",MyUserController.createCurrentUser);
// Register endpoint (for user registration)
router.post('/register', upload.single("imageFile"),MyUserController.registerUser);
router.post("/login",MyUserController.loginUser);
// Email verification endpoint
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(404).json({ message: 'Invalid token or user not found' });
  }

  // Update user's verification status
  user.isVerified = true;
  user.verificationToken = undefined; // Remove verification token after verification
  await user.save();

  res.status(200).json({ message: 'Email verified successfully' });
});

export default router;