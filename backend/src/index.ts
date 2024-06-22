import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"
import {v2 as cloudinary} from "cloudinary";
import myRestaurantRoute from"./routes/MyRestaurantRoute";
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=> console.log("CONNECTED TO DB!!"));//casting 
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


//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET



})




// stripe configuration 
export const stripe = new Stripe('sk_test_51PM7rN03qVjqSurgaFDcUo3Y1GrtFJoYzoiHZZRIWvNhaIec7DrXqNPLFuori2tTwAjBPEQwHF4UOuLBIptnxx4m00OwswBdhb');


//firebase configuration
const admin= require('firebase-admin');
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

// Configure CORS to allow requests from localhost:3000
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL during development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  }));

app.use("/api/my/auth",authRoute);
app.use("/api/my/user",myUserRoute);
app.use("/api/my/restaurant",myRestaurantRoute);
app.use("/api/restaurant",RestaurantRoute);
app.use('/api/my/products', ProductRoutes);
app.use('/api/my/categories', categoriesRoute);
app.use('/api/my/foods', foodRoute);
app.use('/api/my/table', TableRoute);
app.use('/api/my/cart', CartRoute);


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