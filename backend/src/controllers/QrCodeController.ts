import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
const qr = require('qrcode'); // Import the qrcode package
const fs = require('fs');
const path = require('path');
const QrCode=require('../models/QrCode');
const generateCode = async (req:Request, res:Response) => {
    try {
        const { restaurantName } = req.query;

        // Find the restaurant by restaurantName
        const restaurant = await Restaurant.findOne({ restaurantName });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Create a new QR code entry with default tableNumber of 12
        const newQrCode = new QrCode({
            tableNumber: 12, // Default table number
            restaurantName: restaurant._id // Assuming restaurant._id is ObjectId of the restaurant
        });

        // Save the QR code entry to the database
        await newQrCode.save();

        // Generate QR code data
        const qrCodeData = `12-${restaurantName}`; // Using default table number 12
        const qrCodeFilePath = path.join('C:\\Users\\msi\\Desktop\\Food-Ordering\\backend\\public',  `12-${restaurantName}.png`);

        // Generate QR code asynchronously
        const qrCodeImage = await qr.toDataURL(qrCodeData);

        // Convert base64 to buffer
        const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Save the QR code image to the assets folder
        fs.writeFile(qrCodeFilePath, imageBuffer, (err:any ) => {
            if (err) {
                console.error('Error saving QR code:', err);
                return res.status(500).json({ message: 'Error saving QR code' });
            }

            // Return the path to the saved QR code image
            res.json({ message: 'QR code generated and saved successfully', filePath: qrCodeFilePath });
        });
    } catch (error) {
        // Handle any errors that occur during QR code generation or QR code saving
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
