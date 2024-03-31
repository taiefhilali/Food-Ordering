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
exports.createProduct = async (req:Request, res:Response) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    restaurant: req.body.restaurant,
    quantity: req.body.quantity
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
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
