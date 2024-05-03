import Restaurant from "../models/Restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
const Product = require('../models/product');
import { Error } from 'mongoose'; // Import the Error type from mongoose
const qr = require('qrcode'); // Import the qrcode package

// Endpoint to generate QR code
const generateCode = async (req: Request, res: Response) => {
    const { tableNumber, restaurantId } = req.query;
    const qrCodeData = `${tableNumber}-${restaurantId}`;
    
    try {
        // Generate QR code asynchronously
        const qrCodeImage = await qr.toDataURL(qrCodeData);
        // Return the QR code image to the client
        res.send(`<img src="${qrCodeImage}" alt="QR Code">`);
    } catch (error) {
        // Handle any errors that occur during QR code generation
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Error generating QR code' });
    }
};

// Endpoint to process scanned QR code
const processCode = async (req: Request, res: Response) => {
    const { tableNumber, restaurantId } = req.body;
    // Process scanned data (e.g., update database)
    // Placeholder response
    res.status(200).json({ message: 'Scanned QR code processed successfully', tableNumber, restaurantId });
}
module.exports = {generateCode,processCode};
