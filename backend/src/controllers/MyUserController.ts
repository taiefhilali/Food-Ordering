import { Request, Response, response } from "express";
import User from "../models/User";
const nodemailer = require('nodemailer');
import cloudinary from "cloudinary";
const bcrypt = require('bcrypt');



// Function to generate a random verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substr(2, 8); // Example: "1a2b3c4d"
};
// Generate a salt and hash the password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};


const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const existingUser = await User.findOne({ id });

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};


// Register a new user
const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await hashPassword(password);

    const imageUrl = await uploadimage(req.file as Express.Multer.File);

    const verificationToken = generateVerificationToken();
    const newUser = new User({ email, firstname, lastname, imageUrl, verificationToken, password: hashedPassword });
    newUser.imageUrl = imageUrl;
    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      // Configure your SMTP settings here
      // Example using Gmail:
      service: 'Gmail',
      auth: {
        user: 'bobtaief@gmail.com',
        pass: 'zjlu tmcb qkky rvrq'
      }
    });

    const mailOptions = {
      from: 'bobtaief@gmail.com',
      to: email,
      subject: 'Verify Your Email Address',
      text: `Please click on the following link to verify your email: http://http://localhost:3000/authentication/${verificationToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
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

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true });
    res.status(200).json({ status: true, message: 'User Updated Successfully !' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};



export default { createCurrentUser, registerUser, loginUser, getUser, deleteUser,updateUser};
