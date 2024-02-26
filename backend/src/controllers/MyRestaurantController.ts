import Restaurant from "../models/Restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const createMyRestaurant = async (req: Request, res: Response) => {
    try {
        const { userId} = req.body;

        const existingRestaurant = await Restaurant.findOne({ user: userId });

        if (existingRestaurant) {
            return res.status(409).json({ message: "User Restaurant already exists" });
        }

        const image = req.file as Express.Multer.File;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURL = `data:${image.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);

        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        restaurant.user = new mongoose.Types.ObjectId(userId);
        restaurant.lastUpdated=new Date();

        // Save the restaurant to the database
        await restaurant.save();

        res.status(201).json({ message: "Restaurant created successfully", restaurant });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export default {createMyRestaurant,};
