

import User from '../models/User';
const CryptoTs = require('crypto-ts');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
import { Request, Response } from "express";



const createUser = async (req: Request, res: Response) => {
    const user = req.body;

    try {
        // Check if the user already exists
        await admin.auth().getUserByEmail(user.email);
        // If user exists, return a 400 response
        return res.status(400).json({ message: 'Email already registered' });
    } catch (error: any) {
        // Handle the error if the user does not exist
        if (error.code === 'auth/user-not-found') {
            try {
                // Create a new user using Firebase Admin SDK
                const userRecord = await admin.auth().createUser({
                    email: user.email,
                    emailVerified: false,
                    password: user.password,
                    disabled: false
                });

                // Create a new user document in your database (e.g., MongoDB)
                const newUser = new User({
                    username: user.username,
                    email: user.email,
                    uid: userRecord.uid,
                    password: CryptoTs.AES.encrypt(user.password, process.env.JWT_SECRET).toString(),
                    userType: 'Client'
                });
                
                await newUser.save(); // Save the new user document to the database

                // Return a success response
                return res.status(201).json({ message: 'User created successfully' });
            } catch (createUserError: any) {
                // Handle errors that occur during user creation
                console.error('Error creating user:', createUserError);
                return res.status(500).json({ status: false, error: 'Error creating a user' });
            }
        } else {
            // Handle other errors
            console.error('Unknown error:', error);
            return res.status(500).json({ status: false, error: 'Unknown error occurred' });
        }
    }
};


const loginUser= async (req: Request, res: Response) => {

        try {

            const existingUser = await User.findOne({ email : req.body.email},{__v:0,updatedAt:0,createdAt:0});

            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!existingUser.password) {
                return res.status(400).json({ message: 'Invalid request: Missing password' });
            }
            const decryptedpassword =  CryptoTs.AES.decrypt(existingUser.password,process.env.SECRET);
            const decypted= decryptedpassword.toString( CryptoTs.enc.Utf8);
            // const isPasswordValid = await CryptoTs.compare( { password : req.body.password}, existingUser.password);

            if ( !decypted) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const userToken=jwt.sign({
                id: existingUser._id,
                userType: existingUser.userType,
                email: existingUser.email

              },process.env.JWT_SECRET,{expiresIn:'21days'});
            
               const { email, password ,...others} = existingUser;
               res.status(200).json({...others,userToken});
            } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Error logging in' });
        }
    }

    export default { createUser,loginUser };