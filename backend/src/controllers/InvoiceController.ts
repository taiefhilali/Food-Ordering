import mongoose from 'mongoose'; // Ensure mongoose is imported
import Invoice from '../models/Invoice'; // Adjust the path if necessary
import { Request, Response } from 'express'; // Adjust import as needed
import Restaurant from '../models/Restaurant';

export const saveInvoice = async (req: Request, res: Response) => {
  try {
    const { userId, cartItems } = req.body; // Extract userId and cartItems from request body

    // Validate presence of userId and cartItems
    if (!userId || !cartItems) {
      return res.status(400).json({ error: 'Missing userId or cartItems' });
    }

    // Map cartItems to match the Invoice schema
    const invoiceItems = cartItems.map((item: any) => ({
      name: item.name,
      price: item.price,
      totalPrice: item.totalPrice,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
    }));

    // Calculate the total amount for the invoice
    const totalAmount = invoiceItems.reduce((sum: any, item: { totalPrice: any; }) => sum + item.totalPrice, 0);
    const userIdd = (req as any).user.id;

    // Create a new Invoice document
    const newInvoice = new Invoice({
      userId: userIdd,
      items: invoiceItems,
      totalAmount: totalAmount,
      discount: 0, // Adjust if you have a discount logic
    });

    // Save the Invoice to the database
    const savedInvoice = await newInvoice.save();
    console.log('Invoice saved successfully:', savedInvoice);
    return res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error saving invoice:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getInvoicesByRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName } = req.params;

    // Find the restaurant by name to get the ObjectId
    const restaurant = await Restaurant.findOne({ name: restaurantName });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Find invoices by restaurant ObjectId
    const invoices = await Invoice.find({
      restaurant: restaurant._id
    }).populate('restaurant');

    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found for this restaurant' });
    }

    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().populate('restaurant'); // Optionally populate the restaurant details
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found' });
    }
    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};