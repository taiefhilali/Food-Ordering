import { Request, Response } from "express";
import User from "../models/User";

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
exports.registerUser = async (req: Request, res: Response) => {
  try {
    const { email, firstname, lastname, imageUrl } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, firstname, lastname, imageUrl });
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
exports.loginUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(existingUser.toObject());
};

export default {createCurrentUser, };
