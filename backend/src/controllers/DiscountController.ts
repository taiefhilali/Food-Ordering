import { Request, Response, response } from "express"
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