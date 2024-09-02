// controllers/productController.js
import Restaurant from "../models/Restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Product  from '../models/Product'; // Adjust the path as needed
import { Error } from 'mongoose'; // Import the Error type from mongoose
// const Product = require('../models/Product')

// Get all products
exports.getAllProducts = async (req: Request, res: Response) => {
  // try {
  //   const products = await Product.find();
  //   res.json(products);
  // } catch (error) {
  //   res.status(500).json({ message: (error as Error).message });
  // }
  try {
    const products = await Product.find();
    res.status(200).json(products);
} catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
};

// Create a new product

// Create a new product
// exports.createMyProduct = async (req: Request, res: Response) => {
//   try {
//     // Extract userId from authenticated user data
//     const userId = (req as any).user.id;

//     // Upload image to Cloudinary
//     const imageUrl = await uploadimage(req.file as Express.Multer.File);

//     // Parse additives field if it's a string
//     const additives = Array.isArray(req.body.additives)
//       ? req.body.additives
//       : JSON.parse(req.body.additives || "[]");

//     // Create new Product instance
//     const product = new Product({
//       ...req.body,
//       additives: additives,
//       imageUrl: imageUrl,
//       user: new mongoose.Types.ObjectId(userId), // Assign userId to the user field
//     });
//     console.log('Additives:', req.body.additives);

//     // Save the product to the database
//     await product.save();

//     // Send success response
//     res.status(201).json({ message: "Product created successfully", product });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Something went wrong!" });
//   }
// };

exports.createMyProduct = async (req: Request, res: Response) => {
  try {
    // Extract userId from authenticated user data
    const userId = (req as any).user.id;

    // Upload image to Cloudinary
    const imageUrl = await uploadimage(req.file as Express.Multer.File);

    // Parse additives field if it's a string
    const additives = Array.isArray(req.body.additives)
      ? req.body.additives
      : JSON.parse(req.body.additives || "[]");

    console.log('Parsed Additives:', additives);
    
    // Create new Product instance
    const product = new Product({
      ...req.body,
      additives: additives,
      imageUrl: imageUrl,
      user: new mongoose.Types.ObjectId(userId), // Assign userId to the user field
    });

    // Save the product to the database
    await product.save();

    // Send success response
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};


// Get a product by ID
exports.getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product === null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
exports.getProductBycategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
};
// Update a product
exports.updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a product
exports.deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// statistics 
exports.quantityProduct = async (req: Request, res: Response) => {

  try {
    // Aggregate products based on quantity and sort in descending order
    const topProducts = await Product.aggregate([
      {
        $sort: { quantity: -1 },
      },
      {
        $limit: 5, // Adjust the number based on your requirement
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const uploadimage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURL = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
  return uploadResponse.url;
}
// Toggle product approval status
exports.toggleProductApproval = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isApproved = !product.isApproved;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("Error toggling product approval status:", error);
    res.status(500).json({ message: "Error toggling product approval status" });
  }
};

// GET /api/my/products?userId=:userId
exports.productsByUserId = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  console.log('============userid========================', userId);
  try {
    // Fetch products from MongoDB based on userId
    const products = await Product.find({ user: userId });

    res.json(products);
  
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}


exports.productsByRestaurantId = async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId; // Assuming restaurantId is passed as a route parameter
  try {
    // Fetch products from MongoDB based on restaurantId
    const products = await Product.find({ restaurant: restaurantId });

    res.json(products);

  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
exports.searchProductByName = async (req: Request, res: Response) => {
  const productName = req.query.name;

  try {
    const products = await Product.find({ name: { $regex: productName, $options: 'i' } }); // Case-insensitive search
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
}

// Function to sell a product
// Function to sell a product
exports.sellProduct = async (req: Request, res: Response) => {
  const { productId, quantitySold } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if quantitySold is valid
    if (quantitySold <= 0) {
      return res.status(400).json({ message: 'Quantity sold must be greater than zero' });
    }

    // Call the sell method defined in the schema
      await product.sell(quantitySold);

    // Optionally, respond with updated product data or success message
    return res.status(200).json({ message: `Sold ${quantitySold} units of ${product.name}` });
  } catch (error) {
    console.error('Error selling product:');
    return res.status(500).json({ message: 'Failed to sell product' });
  }
};

// Function to calculate total revenue for a restaurant
exports.calculateRestaurantRevenue = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    // Aggregate total revenue across all products of the restaurant
    const totalRevenue = await Product.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
      { $group: { _id: null, totalRevenue: { $sum: { $multiply: ['$price', '$soldQuantity'] } } } }
    ]);

    if (totalRevenue.length === 0) {
      return res.status(404).json({ message: 'No products found for this restaurant' });
    }

    return res.status(200).json({ totalRevenue: totalRevenue[0].totalRevenue });
  } catch (error) {
    console.error('Error calculating restaurant revenue:');
    return res.status(500).json({ message: 'Failed to calculate restaurant revenue' });
  }
};
exports.revenuStatistics = async (req: Request, res: Response) => {
  try {
    const revenueData = await Product.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: { $multiply: ['$price', '$soldQuantity'] } },
        },
      },
    ]);


    if (!revenueData || revenueData.length === 0) {
      return res.status(404).json({ message: 'No revenue data found' });
    }

    const formattedData = revenueData.map((item: { _id: any; totalRevenue: any; }) => ({
      date: item._id,
      totalRevenue: item.totalRevenue
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ message: 'Failed to fetch revenue data' });
  }
};

exports.LikeProduct = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { productId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyLiked = product.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the product
      product.likes = product.likes.filter((id: { toString: () => any; }) => id.toString() !== userId);
    } else {
      // Like the product
      product.likes.push(userId);
    }

    await product.save();
    res.status(200).json({ message: 'Like status updated', likes: product.likes.length });
  } catch (error) {
    console.error('Error handling like:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
