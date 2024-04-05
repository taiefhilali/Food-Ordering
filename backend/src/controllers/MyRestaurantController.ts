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


// // Function to handle restaurant creation
// const createMyRestaurant = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.body;

//     // Check if a restaurant already exists for the user
//     const existingRestaurant = await Restaurant.findOne({ user: userId });

//     if (existingRestaurant) {
//       return res.status(409).json({ message: "User Restaurant already exists" });
//     }
//     // Check if req.file is undefined
//     if (!req.file) {
//       return res.status(400).json({ message: "Image file is required" });
//     }
//     // Upload the image to cloudinary
//     const imageUrl = await uploadimage(req.file as Express.Multer.File);
//     const imageItem = await uploadimage(req.file as Express.Multer.File);


//     // Create an array of menu items with provided data
//     const menuItems = req.body.menuItems.map((menuItem: any) => ({
//       name: menuItem.name,
//       price: menuItem.price,
//       imageItem: menuItem.imageItem, // Assign the image URL from the request
//       quantity: menuItem.quantity // Assign the quantity from the request
//     }));

//     // Create a new restaurant object with the provided data
//     const restaurant = new Restaurant({
//       user: new mongoose.Types.ObjectId(userId),
//       restaurantName: req.body.restaurantName,
//       estimatedDeliveryTime: req.body.estimatedDeliveryTime,
//       cuisines: req.body.cuisines,
//       menuItems: menuItems, // Assign the array of menu items
//       imageUrl: imageUrl,
//       lastUpdated: new Date()
//     });

//     // Save the restaurant to the database
//     await restaurant.save();

//     res.status(201).json({ message: "Restaurant created successfully", restaurant });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Something went wrong!" });
//   }
// };

// // Function to handle restaurant update
// const updateMyRestaurant = async (req: Request, res: Response) => {
//   const { userId } = req.body;

//   try {
//     // Find the restaurant associated with the user
//     const restaurant = await Restaurant.findOne({ user: userId });

//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: "Image file is required" });
//     }

//     // Update the restaurant data with the provided information
//     restaurant.restaurantName = req.body.restaurantName;
//     restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
//     restaurant.cuisines = req.body.cuisines;
//     restaurant.lastUpdated = new Date();

//     // Update menu items if provided in the request
//     if (req.body.menuItems) {
//       restaurant.menuItems = req.body.menuItems.map((menuItem: any) => ({
//         name: menuItem.name,
//         price: menuItem.price,
//         imageItem: menuItem.imageItem, // Assign the image URL from the request
//         quantity: menuItem.quantity // Assign the quantity from the request
//       }));
//     }

//     // Upload a new image if provided
//     if (req.file) {
//       const imageUrl = await uploadimage(req.file as Express.Multer.File);
//       restaurant.imageUrl = imageUrl;

//       // Upload image for each menuItem and assign it to the corresponding item
//       for (let i = 0; i < restaurant.menuItems.length; i++) {
//         const menuItem = await uploadimage(req.file as Express.Multer.File);
//         restaurant.menuItems[i].imageItem = menuItem;
//       }
//     }



//     // Save the updated restaurant data
//     await restaurant.save();

//     res.status(200).json({ message: "Restaurant Updated" });
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// const uploadimage = async (file: Express.Multer.File) => {
//   const image = file;
//   const base64Image = Buffer.from(image.buffer).toString("base64");
//   const dataURL = `data:${image.mimetype};base64,${base64Image}`;
//   const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
//   return uploadResponse.url;
// }


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


const getCuisinesStat = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const uploadimage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURL = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
  return uploadResponse.url;
}


export default { createMyRestaurant, getMyRestaurant, updateMyRestaurant, getAllRestaurant,getCuisinesStat };
