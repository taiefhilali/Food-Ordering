// controllers/productController.js
import Restaurant from "../models/Restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
const Product = require('../models/product');
import { Error } from 'mongoose'; // Import the Error type from mongoose

// Get all products
exports.getAllProducts = async (req:Request, res:Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Create a new product

// Create a new product
exports.createMyProduct = async (req: Request, res: Response) => {
  try {
    // Extract userId from authenticated user data
    const userId = (req as any).user.id;

    // Upload image to Cloudinary
    const imageUrl = await uploadimage(req.file as Express.Multer.File);

    // Create new Product instance
    const product = new Product({
      ...req.body, // Assuming req.body contains other product data
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
exports.getProductById = async (req:Request, res:Response) => {
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

// Update a product
exports.updateProduct = async (req:Request, res:Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a product
exports.deleteProduct = async (req:Request, res:Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// statistics 
exports.quantityProduct= async(req:Request,res:Response)=>{
  
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
exports.toggleProductApproval = async(req:Request,res:Response) => {
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
exports.productsByUserId =async (req:Request,res:Response) => {
  const userId = (req as any).user.id;
  console.log('============userid========================',userId);
  try {
    // Fetch products from MongoDB based on userId
    const products = await Product.find({ user: userId });

    res.json(products);
    console.log('====================================');
    console.log(products);
    console.log('====================================');
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

exports.searchProductByName=async (req:Request,res:Response) => {
  const productName = req.query.name;

  try {
    const products = await Product.find({ name: { $regex: productName, $options: 'i' } }); // Case-insensitive search
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
}