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
import User from "./models/User";
const cookieSession = require("cookie-session");
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


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
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

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
  callbackURL: 'http://localhost:3000/auth/google/callback',
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
        userType: 'Client',
        imageUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
        googleId: profile.id,
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
  }}));

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Store user id in session
});

// Deserialize user from the session
// passport.deserializeUser((id: string, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user); // Retrieve user from MongoDB by id
//   });
// });

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
  (req, res) => {
    // Successful authentication, redirect to profile or home page
    res.redirect('/profile');
  });

// Example profile route (protected route)
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${(req as any).user.username}`);
  } else {
    res.redirect('/login');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.redirect('/');
});


//facebook end.



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