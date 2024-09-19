import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log("CONNECTED TO DB!!"));//casting 
import RestaurantRoute from "./routes/RestaurantRoute";
// @ts-ignore
import bardRoute from './Apis/bardapi';
import ProductRoutes from "./routes/MyProductRoute";
import authRoute from "./routes/authRoute";
import chatRoute from "./routes/ChatRoute";
import feebackRoute from "./routes/FeedbackRoute";
import categoriesRoute from "./routes/CategoriesRoute";
import foodRoute from "./routes/FoodRoute";
import invoiceRoute from "./routes/InvoiceRoute";
import TableRoute from "./routes/QrCodeRoute";
import CartRoute from "./routes/CartRoute";
import NotifRoute from "./routes/NotificationRoute";
import Stripe from 'stripe';
const socketIo = require('socket.io');
const http = require('http');
import { Socket } from 'socket.io'; // Import Socket and Server from socket.io
import Notification from './models/Notification'; // Import Notification model
import passport from 'passport';
import User, { IUser } from './models/User';
const session = require('express-session');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
const FacebookStrategy = require('passport-facebook').Strategy;
import discountRoute from "./routes/DiscountRoute";
import crypto from 'crypto'; // Import crypto module
import Chat from "./models/Chat";
import { handleChatMessage } from "./controllers/ChatController";
const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
//   GenerativeModel,
// } from "@google/generative-ai";
const { GoogleAuth } = require('google-auth-library');

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
// Use environment variables
const mongoUri: string = process.env.MONGO_URI as string;

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// stripe configuration 
export const stripe = new Stripe('sk_test_51PM7rN03qVjqSurgaFDcUo3Y1GrtFJoYzoiHZZRIWvNhaIec7DrXqNPLFuori2tTwAjBPEQwHF4UOuLBIptnxx4m00OwswBdhb');


// const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyDlYwF1X42cvtJO7Iws_pY2hfuwdgJ3XFs";
const MODEL_NAME = "gemini-1.5-flash";

//firebase configuration
import firebase from 'firebase-admin';
const serviceAccount = require('../service.json');
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

const app = express();
const server = http.createServer(app);
// export const io = require('socket.io')(server, {
//   cors: {
//     origin: 'http://localhost:3000', // Replace with your frontend URL during development
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Authorization'],
//     credentials: true,
//   },
// });
const corsOptions = {
  origin: 'https://nice-ocean-0e358e710.5.azurestaticapps.net',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));
export const io = require('socket.io')(server, {
  cors: {
    origin: 'https://nice-ocean-0e358e710.5.azurestaticapps.net',
    methods: ['GET', 'POST']
  }
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
  methods: "GET,POST,PUT,DELETE,PATCH",
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
app.use('/api/my/notifications', NotifRoute);
app.use('/api/my/feedback', feebackRoute);
app.use('/api/my/messages', chatRoute);
app.use('/api/my/discounts', discountRoute);
app.use('/api/my/bard', bardRoute);
app.use('/api/my/invoice', invoiceRoute);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());



//gemini configuration 

// const client = new TextServiceClient({
//   authClient: new GoogleAuth().fromAPIKey(API_KEY),
// });

// const prompt = "Repeat after me: one, two,";

// // Log the request being made
// console.log("Making API request to Google Gemini API...");
// console.log("Request Data:", {
//   model: MODEL_NAME,
//   prompt: prompt,
// });

// client.generateText({
//     model: MODEL_NAME,
//     prompt: {
//       text: prompt,
//     },
//   })
//   .then((result: any) => {
//     // Log the response data
//     console.log("API Response Received:", JSON.stringify(result, null, 2));
//   })
//   .catch((error: any) => {
//     // Log the error details
//     console.error("API Error:", error.message);
//     console.error("Error Stack:", error.stack);
//   });
// Instantiate GoogleGenerativeAI client

//gemini configuration 

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
          // googleId: profile.id, // Set googleId from Google profile
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
  done(null, (user as IUser)._id); // Store user _id in session
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
    newFunction();
    res.redirect(`http://localhost:3000/settings?userId=${userId}&token=${token}`);

    function newFunction() {
    }
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
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:7000/auth/facebook/callback"
},
  async function (accessToken: string, refreshToken: string, profile: any, cb: (error: any, user?: any) => void) {
    try {
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
          // googleId: profile.id, // Set googleId from Google profile
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

  // Example: Handle 'newProductAdded' event
  socket.on('newProductAdded', async (data) => {
    console.log('New product added:', data);

    try {
      // Save notification to MongoDB or any other backend logic
      const notificationData = new Notification({
        event: 'newProductAdded',
        data: data,
        timestamp: new Date(),
        user: data.user // Assuming userId is passed with data
      });
      const savedNotification = await notificationData.save();

      // Example: Emitting 'messages' event with updated data
      io.emit('messages', notificationData); // Broadcast to all connected clients


    } catch (error) {
      console.error('Error handling newProductAdded:', error);
    }
  });


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

  // Handle incoming messages
  // Handle incoming messages
  socket.on('chat message', async (data) => {
    try {
      const { sender, content } = data;
      const newMessage = new Chat({ sender, content });
      await newMessage.save();

      // Broadcast message to all connected clients
      io.emit('chat message', {
        _id: newMessage._id,
        sender,
        content,
        createdAt: newMessage.createdAt,
      });

      console.log('Message broadcasted:', {
        _id: newMessage._id,
        sender,
        content,
        createdAt: newMessage.createdAt,
      });

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  socket.on('invoiceSaved', async (data) => {
    console.log('Invoice saved:', data);

    try {
      // Save notification to MongoDB
      const notificationData = new Notification({
        event: 'invoiceSaved',
        data: data,
        timestamp: new Date(),
      });

      const savedNotification = await notificationData.save();
      console.log('Notification saved to MongoDB:', savedNotification);
      console.log('Notification Data:', notificationData.data);

      // Emit notification to all connected clients
      io.emit('notifications', savedNotification);  // Emit the actual saved notification
    } catch (error) {
      console.error('Error saving notification to MongoDB:');
    }
  });
  socket.on('orderReady', async (data) => {
    console.log('orderReady event received:', data);

    try {
      // Create a new notification document
      const notificationData = new Notification({
        event: 'orderReady',
        data: data,
        timestamp: new Date(),
      });

      // Save the notification to MongoDB
      const savedNotification = await notificationData.save();
      console.log('Notification saved to MongoDB:', savedNotification);

      // Emit the notification to all connected clients
      io.emit('notifications', savedNotification);
    } catch (error) {
      console.error('Error saving notification to MongoDB:', error);
    }
  });
  // socket.on('chat message', async (data) => {
  //   try {
  //     // Save message to MongoDB
  //     const { sender, content } = data;
  //     const newMessage = new Chat({ sender, content });
  //     await newMessage.save();
  //     await handleChatMessage(data, io); // Pass 'socket' to handleChatMessage

  //     // Broadcast message to all clients
  //     io.emit('chat message', newMessage);
  //   } catch (error) {
  //     console.error('Error saving message:', error);
  //   }
  // });
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



