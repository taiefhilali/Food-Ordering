import { Request, Response } from "express";
import User from "../models/User";
const nodemailer = require('nodemailer');
import cloudinary from "cloudinary";



// Function to generate a random verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substr(2, 8); // Example: "1a2b3c4d"
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
    const { email, firstname, lastname } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const imageUrl = await uploadimage(req.file as Express.Multer.File);

    const verificationToken = generateVerificationToken();
    const newUser = new User({ email, firstname, lastname, imageUrl, verificationToken });
    newUser.imageUrl=imageUrl;
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
      text: `Please click on the following link to verify your email: http://your_frontend_url/verify/${verificationToken}`
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
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(existingUser.toObject());
};
const uploadimage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURL = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
  return uploadResponse.url;
}

export default {createCurrentUser, registerUser, loginUser ,};
