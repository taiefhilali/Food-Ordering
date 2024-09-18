import express from "express";
import MyUserController from "../controllers/MyUserController";
import User from "../models/User";
import multer from "multer"
const { verifyToken, verifyUserType,verifyVendor } = require('../middleware/verifyToken')


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  }
})


router.post("/", MyUserController.registerUser);
router.get('/users',verifyToken,verifyVendor,MyUserController.getAllUsers);
// Route to get all Admins
router.get('/admins', MyUserController.getAllAdmins);

// Route to get all Clients
router.get('/clients', MyUserController.getAllClients); 

// Route to get all Vendors
router.get('/vendors',MyUserController.getAllVendors);
// Register endpoint (for user registration)
router.post('/register', upload.single("imageFile"), MyUserController.registerUser);

// router.post('/register',verifyToken, verifyUserType, upload.single("imageFile"), MyUserController.registerUser);
router.post("/login", verifyToken, verifyUserType, MyUserController.loginUser);
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

router.get("/:id",verifyToken,verifyVendor, MyUserController.getUser);
router.delete("/delete/:id",verifyToken,verifyVendor, MyUserController.deleteUser);
router.put("/update/:id",verifyToken,verifyVendor, MyUserController.updateUser);
router.post('/uploadProfilePicture/:userId', verifyToken,verifyVendor,upload.single('File'),MyUserController.uploadProfilePicture);
router.put('/block/:id',verifyToken,verifyVendor,MyUserController.blockUser);
router.put('/unblock/:id',verifyToken,verifyVendor, MyUserController.unblockUser);


export default router;