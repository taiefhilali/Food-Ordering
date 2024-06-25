import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log("CONNECTED TO DB!!"));//casting 
import RestaurantRoute from "./routes/RestaurantRoute";
import ProductRoutes from "./routes/MyProductRoute";
import authRoute from "./routes/authRoute";
import categoriesRoute from "./routes/CategoriesRoute";
import foodRoute from "./routes/FoodRoute";
import TableRoute from "./routes/TableRoute";
import CartRoute from "./routes/CartRoute";
import Stripe from 'stripe';
const socketIo = require('socket.io');
const http = require('http');
import { Server as SocketIOServer, Socket } from 'socket.io'; // Import Socket and Server from socket.io
import Notification, { NotificationDocument } from './models/Notification'; // Import Notification model
import passport from 'passport';
import User, { IUser } from './models/User';
const session = require('express-session');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
const FacebookStrategy = require('passport-facebook').Strategy;

import crypto from 'crypto'; // Import crypto module
import { Request, Response, NextFunction } from 'express'; // Import Request, Response, and NextFunction types

const generateRandomString = (length: number) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex'); // convert to hexadecimal format
};

const SESSION_SECRET = generateRandomString(32);
//cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET



})


// stripe configuration 
export const stripe = new Stripe('sk_test_51PM7rN03qVjqSurgaFDcUo3Y1GrtFJoYzoiHZZRIWvNhaIec7DrXqNPLFuori2tTwAjBPEQwHF4UOuLBIptnxx4m00OwswBdhb');


//firebase configuration
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseprivkey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})


const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL during development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
});
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET, // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
  },
}));

// Configure CORS to allow requests from localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL during development
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));

app.use("/api/my/auth", authRoute);
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", RestaurantRoute);
app.use('/api/my/products', ProductRoutes);
app.use('/api/my/categories', categoriesRoute);
app.use('/api/my/foods', foodRoute);
app.use('/api/my/table', TableRoute);
app.use('/api/my/cart', CartRoute);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize Facebook authentication strategy
// Configure Google OAuth2 strategy
passport.use(new GoogleStrategy({
  clientID: '146053191863-ho5vnnb06id57h1s7vm090n2m27ud3gu.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:7000/auth/google/callback',
},
  async function (accessToken, refreshToken, profile, cb) {
    try {
      console.log('Google profile:', profile); // Check profile data received

      // Check if user already exists in database based on Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user exists, return that user
        return cb(null, user);
      } else {
        // If user does not exist, create new user in database
        const newUser = new User({
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
          username: profile.displayName,
          userType: 'Vendor',
          imageUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          googleId: profile.id, // Set googleId from Google profile
          // Add other necessary fields
        });

        // Save new user to database
        user = await newUser.save();
        console.log('New user saved:', user); // Log the saved user

        return cb(null, user);
      }
    } catch (err) {
      console.error('Error in Google OAuth callback:', err);
      return cb(err);
    }
  }));
  // Serialize user into the session
 
  passport.serializeUser((user, done) => {
    done(null,( user as IUser)._id); // Store user _id in session
  });
  
  passport.deserializeUser((id: string, done: (err: Error | null, user: IUser | null) => void) => {
    User.findById(id)
      .then((user: IUser | null) => {
        done(null, user); // Retrieve user from MongoDB by id
      })
      .catch((err: Error) => {
        done(err, null); // Handle error if user retrieval fails
      });
  });
  
// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Google authentication route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    console.log('Google OAuth callback:', req.user); // Log user data
    const userId = (req as any).user._id;
    const token = (req as any).user.token; // Assuming you generate a token for the user
    console.log('====================================');
    console.log(token +' '+ userId);
    console.log('====================================');
    res.redirect(`http://localhost:3000/settings?userId=${userId}&token=${token}`);
  });
  app.get('/api/my/user/:id', async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  
// Example profile route (protected route)
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {

    res.redirect('http://localhost:3000/settings'); // Redirect to your frontend settings page
  } else {
    res.redirect('/login'); // Redirect to login if user is not authenticated
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.redirect('/');
});


//google end.


//facebook begin
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret:process.env.FACEBOOK_APP_SECRET ,
  callbackURL: "http://localhost:7000/auth/facebook/callback"
},
async function (accessToken: string, refreshToken: string, profile: any, cb: (error: any, user?: any) => void) {    try {
      console.log('Facebook profile:', profile); // Check profile data received

      // Check if user already exists in database based on Google ID
      let user = await User.findOne({ facebookId: profile.id });

      if (user) {
        // If user exists, return that user
        return cb(null, user);
      } else {
        // If user does not exist, create new user in database
        const newUser = new User({
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
          username: profile.displayName,
          userType: 'Vendor',
          imageUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          googleId: profile.id, // Set googleId from Google profile
          // Add other necessary fields
        });

        // Save new user to database
        user = await newUser.save();
        console.log('New user saved:', user); // Log the saved user

        return cb(null, user);
      }
    } catch (err) {
      console.error('Error in facebook OAuth callback:', err);
      return cb(err);
    }
  }));


  // Google authentication route
app.get('/auth/facebook',
passport.authenticate('facebook', { scope: ['profile', 'email'] }));
//facebook end
// Socket.io connection
io.on('connection', (socket: Socket) => { // Explicitly type Socket
  console.log('New client connected');
  // Socket.io event handling


  //add product notification
  socket.on('newProductAdded', (data) => {
    console.log('New product added:', data);
    // Handle the event
  });
  //add restaurant notifications

  socket.on('newRestaurantAdded', async (data) => {
    console.log('New restaurant added:', data);

    try {
      // Save notification to MongoDB
      const notificationData = new Notification({
        event: 'newRestaurantAdded',
        data: data,
        timestamp: new Date(),
      });

      const savedNotification = await notificationData.save();
      console.log('Notification saved to MongoDB:', savedNotification);
    } catch (error) {
      console.error('Error saving notification to MongoDB:', error);
    }
  });
  //add user notifications

  socket.on('newUserAdded', async (data) => {
    console.log('New restaurant added:', data);

    try {
      // Save notification to MongoDB
      const notificationData = new Notification({
        event: 'newUserAdded',
        data: data,
        timestamp: new Date(),
      });

      const savedNotification = await notificationData.save();
      console.log('Notification saved to MongoDB:', savedNotification);
    } catch (error) {
      console.error('Error saving notification to MongoDB:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// // Example: Notify clients when a new product is added
// socket.on('productAdded', (product) => {
//   console.log('Product added:', product);
//   socket.broadcast.emit('newProduct', product);
// });
// // Example: Handle event when a client sends a message
// socket.on('message', (message: string) => {
//     console.log(`Received message: ${message}`);
//     io.emit('message', `Server received: ${message}`);
//   });

// // Example: Notify clients when a product is deleted
// socket.on('productDeleted', (productId) => {
//   console.log('Product deleted:', productId);
//   socket.broadcast.emit('deletedProduct', productId);
// });


const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});

app.listen(7000, () => {
  console.log("server runing on 7000");
});



