

import User from '../models/User';
const CryptoTs = require('crypto-ts');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
import { Request, Response } from "express";
const bcrypt = require('bcrypt');
import nodemailer from 'nodemailer';



// const createUser = async (req: Request, res: Response) => {
//     const user = req.body;

//     try {
//         // Check if the user already exists
//         // await admin.auth().getUserByEmail(user.email);
//         // If user exists, return a 400 response
//         // return res.status(400).json({ message: 'Email already registered' });
//     } catch (error: any) {
//         // Handle the error if the user does not exist
//         if (error.code === 'auth/user-not-found') {
//             try {
//                 // Create a new user using Firebase Admin SDK
//                 const userRecord = await admin.auth().createUser({
//                     email: user.email,
//                     emailVerified: false,
//                     password: user.password,
//                     disabled: false
//                 });

//                 // Create a new user document in your database (e.g., MongoDB)
//                 const newUser = new User({
//                     username: user.username,
//                     email: user.email,
//                     password: CryptoTs.AES.encrypt(user.password, process.env.JWT_SECRET).toString(),
//                     userType: 'Client'
//                 });
                
//                 await newUser.save(); // Save the new user document to the database

//                 // Return a success response
//                 return res.status(201).json({ message: 'User created successfully' });
//             } catch (createUserError: any) {
//                 // Handle errors that occur during user creation
//                 console.error('Error creating user:', createUserError);
//                 return res.status(500).json({ status: false, error: 'Error creating a user' });
//             }
//         } else {
//             // Handle other errors
//             console.error('Unknown error:', error);
//             return res.status(500).json({ status: false, error: 'Unknown error occurred' });
//         }
//     }
// };

// Controller function for user login
const loguser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!existingUser.password) {
      return res.status(400).json({ message: 'Invalid request: Missing password' });
    }

    // Compare the provided password with the hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const userToken = jwt.sign({
      id: existingUser._id,
      userType: existingUser.userType,
      email: existingUser.email
    }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '50 days' });

    // Send back the user data excluding the password and including the token
    const { password: _, ...userWithoutPassword } = existingUser.toObject();
    res.status(200).json({ ...userWithoutPassword, userToken });
  } catch (error) {
    console.error('Error logging in:', error);

    // Check if the error is an instance of Error to safely extract the message
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    } else {
      res.status(500).json({ message: 'Error logging in' });
    }
  }
};


// const loguser = async (req: Request, res: Response) => {
//     try {
//       const { email, password } = req.body;
  
//       // Find the user by email
//       const existingUser = await User.findOne({ email });
  
//       if (!existingUser) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       if (!existingUser.password) {
//         return res.status(400).json({ message: 'Invalid request: Missing password' });
//       }
  
//       // Compare the provided password with the hashed password using bcrypt
//       const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Generate JWT token
//       const userToken = jwt.sign({
//         id: existingUser._id,
//         userType: existingUser.userType,
//         email: existingUser.email
//       }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '50 days' });
  
//       // Send back the user data excluding the password and including the token
//       const { password: _, ...userWithoutPassword } = existingUser.toObject();
//       res.status(200).json({ ...userWithoutPassword, userToken });
//     } catch (error) {
//       console.error('Error logging in:', error);
//       res.status(500).json({ message: 'Error logging in' });
//     }
//   };
  
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

              },process.env.JWT_SECRET,{expiresIn:'50days'});
            
               const { email, password ,...others} = existingUser;
               res.status(200).json({...others,userToken});
               console.log('====================================');
               console.log(userToken);
               console.log('====================================');
            } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Error logging in' });
        }
   }
// Function to generate JWT token for password reset
const generateResetToken = (email: string) => {
  return jwt.sign(
    { email },
    process.env.JWT_RESET_SECRET || 'defaultresetsecret',
    { expiresIn: '30m' } // Token expires in 30 minutes
  );
};

// Controller function for handling forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT token (for password reset link)
    const resetToken = generateResetToken(existingUser.email);

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'bobtaief@gmail.com', // Your Gmail address
        pass: 'ovdt hawt cehv yrvh', // Your Gmail password or app-specific password
      },
    });
    

    // Email content
    const mailOptions = {
      from: 'bobtaief@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p><a href="http://localhost:3000/reset-password/${resetToken}</a></p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // For demonstration, we'll just return the reset token as JSON
    res.status(200).json({ resetToken });
  } catch (error) {
    console.error('Error sending password reset:', error);
    res.status(500).json({ message: 'Error sending password reset' });
  }
};

// Controller function for handling reset password with token input
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify if the provided token matches the stored reset token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || 'defaultresetsecret');
    if (decoded.email !== email) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password before saving
    console.log("Encrypting new password:", newPassword);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Hashed new password:", hashedPassword);
    existingUser.password = hashedPassword;
    await existingUser.save();
    

    // Return success response
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};



    export default { loginUser,loguser,forgotPassword,resetPassword}