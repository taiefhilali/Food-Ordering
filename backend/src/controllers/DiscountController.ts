import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import Discount from '../models/Discount'; // Adjust the path as necessary

export const validatecoupon = async (req: Request, res: Response) => {
  const { couponCode } = req.body;

  try {
    const coupon = await Discount.findOne({ couponCode });
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

const retryOperation = async (operation: () => Promise<any>, retries: number = 3): Promise<any> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error;
      }
      console.log(`Retrying operation, attempt ${attempt}`);
    }
  }
};

export const addCoupon = async (req: Request, res: Response) => {
  const { couponCode, discount, expirationDate, restaurantName } = req.body;

  try {
    if (!restaurantName) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    const restaurant = await Restaurant.findOne({ restaurantName });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const newCoupon = new Discount({
      couponCode,
      discount: parseFloat(discount), // Ensure discount is a number
      expirationDate: new Date(expirationDate), // Ensure expirationDate is a Date
      restaurantName: restaurant._id
    });

    await newCoupon.save();
    return res.status(201).json({ message: 'Coupon code added successfully', coupon: newCoupon });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        requestBody: req.body,
      });
      return res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      // Handle the case where error is not an instance of Error
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Server error', error: 'An unexpected error occurred' });
    }
  }
};

export const getCouponsByRestaurant = async (req: Request, res: Response) => {
  const { restaurantName } = req.query; // Using query parameter

  try {
    if (!restaurantName) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    const restaurant = await Restaurant.findOne({ restaurantName });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const currentDate = new Date();
    const coupons = await Discount.find({
      restaurantName: restaurant._id,
      expirationDate: { $gte: currentDate } // Filter out expired coupons
    });

    return res.status(200).json({ coupons });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteExpiredCoupons = async () => {
  try {
    const currentDate = new Date();
    const result = await Discount.deleteMany({ expirationDate: { $lt: currentDate } });
    console.log(`${result.deletedCount} expired coupons removed.`);
  } catch (error) {
    console.error('Error deleting expired coupons:', error);
  }
};
