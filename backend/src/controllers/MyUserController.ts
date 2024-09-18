import { Request, Response, response } from "express";
import User from "../models/User";
const nodemailer = require('nodemailer');
import cloudinary from "cloudinary";
const bcrypt = require('bcrypt');
import CryptoTs from 'crypto-ts';

const MAX_FILENAME_LENGTH = 100; // Example: Maximum filename length allowed

// Function to encrypt password using crypto-ts

const encryptPassword = (password: string): string => {
  const secret = process.env.SECRET || 'quickbite2023'; // Provide a default value or handle the undefined case
  return CryptoTs.AES.encrypt(password, secret).toString();
};

// Function to generate a random verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substr(2, 8); // Example: "1a2b3c4d"
};

// Function to hash the password using bcrypt
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Number of salt rounds
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, firstname, lastname, password, userType } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const hashedPassword = await hashPassword(password);

    // Example of uploading an image using an upload function
    const imageUrl = await uploadimage(req.file as Express.Multer.File);

    const verificationToken = generateVerificationToken();
    const newUser = new User({
      username,
      email,
      firstname,
      lastname,
      imageUrl,
      verificationToken,
      password: hashedPassword,
      userType,
      isVerified: false, // Add this to keep track of verification status
    });

    // Save user to database
    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'bobtaief@gmail.com',
        pass: 'ovdt hawt cehv yrvh'
      }
    });

    const mailOptions = {
      from: 'bobtaief@gmail.com',
      to: email,
      subject: 'Verify Your Email Address',
      text: `Please click on the following link to verify your email: http://localhost:3000/verify-email/${verificationToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};
const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Mark the user's email as verified and remove the verification token
    user.verificationToken = " ";
    user.isVerified = true; // Ensure you have a field in your User model for this
    await user.save();

    res.status(200).json({ message: 'Email successfully verified' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};





// Login user

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!existingUser.isVerified) {
      return res.status(401).json({ message: 'Email not verified. Please check your email for verification instructions.' });
    }

    if (!password || !existingUser.password) {
      return res.status(400).json({ message: 'Invalid request: Missing password' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json(existingUser.toObject());
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};



const uploadimage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURL = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
  return uploadResponse.url;
}


const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    const user = await User.findById(userId, { password: 0, __v: 0, createdAt: 0, updatedAt: 0 });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ status: true, message: 'User Deleted Successfully !' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};


const deleteProfilePicture = async (req: Request, res: Response) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ status: true, message: 'User Deleted Successfully !' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true });
    res.status(200).json({ status: true, message: 'User Updated Successfully !' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = req.file.originalname.substring(0, MAX_FILENAME_LENGTH);
    if (fileName.length > MAX_FILENAME_LENGTH) {
      return res.status(400).json({ message: 'Filename exceeds maximum length' });
    }

    // Upload file to Cloudinary or other storage service
    const result = await cloudinary.v2.uploader.upload(req.file.buffer.toString('base64'), { public_id: fileName });

    // Update user's imageUrl in database
    const userId = req.params.userId;
    // Replace with your actual database update logic
    // Example: const user = await User.findByIdAndUpdate(userId, { imageUrl: result.secure_url }, { new: true });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture', error });
  }
};
// Controller to fetch all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Exclude sensitive fields
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error retrieving users', error: error.message });
    } else {
      res.status(500).json({ message: 'Error retrieving users', error: String(error) });
    }
  }
};
const blockUser= async (req: Request, res: Response) => {
  const  id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { blocked: true },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Error blocking user' });
  }
};

const unblockUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { blocked: false },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Error unblocking user' });
  }
};

// Controller function to get all Admins
 const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await User.find({ userType: 'Admin' });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
};

// Controller function to get all Clients
 const getAllClients = async (req: Request, res: Response)=> {
  try {
    const clients = await User.find({ userType: 'Client' });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error });
  }
};

// Controller function to get all Vendors
 const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await User.find({ userType: 'Vendor' });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error });
  }
};

export default { registerUser, loginUser, getUser, deleteUser,updateUser,uploadProfilePicture,getAllUsers,blockUser,getAllAdmins,
  getAllClients,
  getAllVendors,unblockUser};
