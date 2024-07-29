import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
// const qr = require('qrcode'); // Import the qrcode package
const fs = require('fs');
const path = require('path');
const QrCode=require('../models/QrCode');
import qrcode from 'qrcode';

const generateCode = async (req: Request, res: Response) => {
    try {
      const { restaurantName, tableNumber } = req.query;
  
      // Find the restaurant by restaurantName
      const restaurant = await Restaurant.findOne({ restaurantName });
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      // Generate QR code data
      const qrCodeData = `${tableNumber}-${restaurantName}`; // Using default table number 12
      const qrCodeFilePath = `${tableNumber}-${restaurantName}.png`; // Relative path
  
      // Generate QR code asynchronously
      await qrcode.toFile(path.join('C:\\Users\\msi\\Desktop\\Food-Ordering\\backend\\public', qrCodeFilePath), qrCodeData);
  
      // Return the relative path to the saved QR code image
      res.json({ message: 'QR code generated and saved successfully', filePath: qrCodeFilePath });
    } catch (error) {
      console.error('Error generating or saving QR code:', error);
      res.status(500).json({ message: 'Error generating or saving QR code' });
    }
  };

// Endpoint to process scanned QR code
const processCode = async (req: Request, res: Response) => {
    const { tableNumber, restaurantId } = req.body;
    try {
     
        await Restaurant.findOneAndUpdate(
            { _id: restaurantId },
            { $set: { tableNumber: tableNumber } }
        );
        // Placeholder response
        res.status(200).json({ message: 'Scanned QR code processed successfully', tableNumber, restaurantId });
    } catch (error) {
        console.error('Error processing QR code:', error);
        res.status(500).json({ error: 'An error occurred while processing the QR code' });
    }
};

export default {generateCode,processCode};
