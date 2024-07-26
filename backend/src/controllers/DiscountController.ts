import { Request, Response, response } from "express"
import Restaurant from "../models/Restaurant";
const Discount = require('../models/Discount'); // Adjust the path as necessary
export const validatecoupon = async (req: Request, res: Response) => 
    {const { couponCode } = req.body;

try {
  const coupon = await Discount.findOne({ code: couponCode });
  if (!coupon) {
    return res.status(400).json({ message: 'Invalid coupon code' });
  }

  const currentDate = new Date();
  if (currentDate > coupon.expirationDate) {
    return res.status(400).json({ message: 'Coupon code has expired' });
  }

  return res.status(200).json({ discount: coupon.discount });
} catch (error) {
  return res.status(500).json({ message: 'Server error', error });
}
};


export const addCoupon = async (req: Request, res: Response) => {
  const { couponCode, discount, expirationDate, restaurantName } = req.body;

  try {
    // Check if the restaurant exists
    const restaurant = await Restaurant.findOne({ restaurantName: restaurantName });
    if (!restaurant) {
      return res.status(400).json({ message: 'Restaurant not found' });
    }

    // Create a new coupon
    const newCoupon = new Discount({
      code: couponCode,
      discount,
      expirationDate,
      restaurantName: restaurant._id // Assuming you have a reference to the restaurant in the Discount model
    });

    await newCoupon.save();

    return res.status(201).json({ message: 'Coupon code added successfully', coupon: newCoupon });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};