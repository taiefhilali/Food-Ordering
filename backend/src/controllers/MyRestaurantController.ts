import Restaurant from "../models/Restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";


const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query; // Access userId from query parameters

    const restaurants = await Restaurant.find({ user: userId });

    if (restaurants.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

const getAllRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({});

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: "Restaurants not found" });
    }

    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Error fetching restaurants" });
  }
};
const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const existingRestaurant = await Restaurant.findOne({ user: userId });

    if (existingRestaurant) {
      return res.status(409).json({ message: "User Restaurant already exists" });
    }

    // const image = req.file as Express.Multer.File;
    // const base64Image = Buffer.from(image.buffer).toString("base64");
    // const dataURL = `data:${image.mimetype};base64,${base64Image}`;
    // const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
    const imageUrl = await uploadimage(req.file as Express.Multer.File);
    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(userId);
    restaurant.lastUpdated = new Date();

    // Save the restaurant to the database
    await restaurant.save();

    res.status(201).json({ message: "Restaurant created successfully", restaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const restaurant = await Restaurant.findOneAndUpdate({
      user: userId

    });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();


    if (req.file) {
      const imageUrl = await uploadimage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    };

    await restaurant.save();
    res.status(200).json({ message: "Restaurant Updated" })
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "something went wrong" })
  }
}

const uploadimage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURL = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
  return uploadResponse.url;
}
export default { createMyRestaurant, getMyRestaurant, updateMyRestaurant, getAllRestaurant };
