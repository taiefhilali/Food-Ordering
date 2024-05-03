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

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET



})

const admin= require('firebase-admin');
const serviceAccount = require('../firebaseprivkey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/my/auth",authRoute);
app.use("/api/my/user",myUserRoute);
app.use("/api/my/restaurant",myRestaurantRoute);
app.use("/api/restaurant",RestaurantRoute);
app.use('/api/my/products', ProductRoutes);
app.use('/api/my/categories', categoriesRoute);
app.use('/api/my/foods', foodRoute);
app.use('/api/my/table', TableRoute);
app.use('/api/my/cart', CartRoute);



app.listen(7000, () => {
    console.log("server runing on 7000");
});