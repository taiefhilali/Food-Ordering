// controllers/invoiceController.js
import Invoice from '../models/Invoice'; // Adjust the path
import { Request, Response, response } from "express"
import User from '../models/User';

export const saveInvoice = async (req: Request, res: Response) => {
    const { username, amount, orderDetails } = req.body;
  
    try {
      // Find the user by username to get the ObjectId
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const newInvoice = new Invoice({
        userId: user._id, // Use the ObjectId
        amount,
        orderDetails,
      });
  
      await newInvoice.save();
      res.status(201).json({ message: 'Invoice saved successfully', invoice: newInvoice });
    } catch (error) {
      console.error('Error saving invoice:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
