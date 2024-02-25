import Restaurant from "../models/Restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
const Clerk = require('@clerk/clerk-sdk-node');

const createMyRestaurant = async (req: Request, res: Response) => {
    const clerk = new Clerk({ apiKey: 'your-api-pk_test_d29ydGh5LXJlZGJpcmQtNzQuY2xlcmsuYWNjb3VudHMuZGV2JA' });
    clerk.getSession('session-id')
        .then((session: { user_id: any; }) => {
            // Access the user ID from the session
            const userId = session.user_id;
            console.log('User ID:', userId);
        })
        .catch((error: any) => {
            console.error('Error:', error);
        });
    try {

        const existingRestaurant = await Restaurant.find({ user:req.body.id })
        if (existingRestaurant) {
            return res.status(409).json({ message: "User Restaurant already exists" })
        }

        const image = req.file as Express.Multer.File;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURL = `data:${image.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);

        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        restaurant.user = new mongoose.Types.ObjectId(req.body.id)


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" })
    }
}