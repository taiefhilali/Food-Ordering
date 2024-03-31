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
exports.createMyProduct = async (req: Request, res: Response) => {
    try {
      
      
      const imageUrl = await uploadimage(req.file as Express.Multer.File);
      const product = new Product(req.body);
      Product.imageUrl = imageUrl;
  
      // Save the restaurant to the database
      await product.save();
  
      res.status(201).json({ message: "product created successfully", product });
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
const uploadimage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURL = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
    return uploadResponse.url;
  }
