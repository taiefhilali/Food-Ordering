import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
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
