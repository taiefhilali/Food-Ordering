import Cart,{ ICartItem } from '../models/Cart';
import { Request, Response } from "express"
import mongoose from 'mongoose';
import stripe from 'stripe';
import User from '../models/User';
import { io } from './../index' 

require('dotenv').config(); // Ensure you have dotenv configured to load environment variables

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient = require('stripe')(stripeSecretKey);

// const stripeSecretKey = 'sk_test_51PM7rN03qVjqSurgaFDcUo3Y1GrtFJoYzoiHZZRIWvNhaIec7DrXqNPLFuori2tTwAjBPEQwHF4UOuLBIptnxx4m00OwswBdhb'; // Replace with your actual Stripe secret key
// const stripeClient = new stripe(stripeSecretKey);
interface CartItem {
  itemType: string;
  item: mongoose.Schema.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  additives: any; // Adjust the type as per your schema
  instruction: any; // Adjust the type as per your schema
}

export const addFoodToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id; // Extract user ID from request
  const { food, quantity, totalPrice, additives, instruction } = req.body; // Extract data from request body
  console.log('Received food ID:', food); // Add this line to log the received food ID

  if (!mongoose.Types.ObjectId.isValid(food)) {
    return res.status(400).json({ error: 'Invalid food ID' });
  }

  try {
    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Create a new ICartItem object
    const newCartItem: ICartItem = {
      itemType: 'food',
      item: new mongoose.Types.ObjectId(food),
      quantity,
      totalPrice,
      additives,
      instruction
    } as ICartItem;

    // Add the new ICartItem to the cart
    cart.items.push(newCartItem);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ status: true, message: 'Food added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding food to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getCartByUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const carts = await Cart.find({ user: userId });
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching carts by user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const addProductToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { product, quantity, totalPrice, additives, instruction } = req.body;

  if (!mongoose.Types.ObjectId.isValid(product)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item: ICartItem) => item.itemType === 'product' && item.item.toString() === product
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice += totalPrice;
    } else {
      // Create a new ICartItem object
      const newCartItem: ICartItem = {
        itemType: 'product',
        item: new mongoose.Types.ObjectId(product),
        quantity,
        totalPrice,
        additives,
        instruction
      } as ICartItem;

      cart.items.push(newCartItem);
    }

    await cart.save();

    res.status(200).json({ status: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const removeProductFromCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.items.findIndex((item: ICartItem) => item.itemType === 'product' && item.item.toString() === id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cart.items.splice(productIndex, 1);

    await cart.save();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const deleteAllCart = async (req: Request, res: Response) => {
  try {
    // Delete all items from the cart collection
    await Cart.deleteMany({});
    res.status(204).send(); // Send 204 (No Content) on successful deletion
  } catch (error) {
    console.error('Error deleting all cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const fetchUserCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "productId",
      select: "title imageUrl restaurant rating ratingCount"
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json({ statue: true, cart: cart });
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const clearUserCart = async (req: Request, res: Response) => {

  const userId = (req as any).user.id;
  try {
    // Find and delete the user's cart
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCartCount = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const count = cart.items.reduce((acc: number, curr: { quantity: number }) => acc + curr.quantity, 0);

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const updateCartItemQuantity = async (req: Request, res: Response) => {
  const userId = (req as any).user.id; // Assuming `req.user` contains authenticated user's information
  const itemId = req.params._id;
  const { quantity } = req.body;

  try {
    // Find the cart document containing the item
    const cart = await Cart.findOne({ user: userId, 'items._id': itemId });

    if (!cart) {
      return res.status(404).json({ status: false, message: 'Cart item not found' });
    }

    // Find the specific item in the cart
    const item = (cart.items as any).id(itemId);

    if (!item) {
      return res.status(404).json({ status: false, message: 'Cart item not found' });
    }

    // Update the item's quantity
    item.quantity = quantity;

    // Save the updated cart document
    await cart.save();

    res.status(200).json({ status: true, message: 'Cart item quantity updated successfully' });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ status: false, message: 'Error updating cart item quantity' });
  }
};

const payment = async (req: Request, res: Response) => {
    try {
      const { totalPrice } = req.body;
  
      if (!totalPrice) {
        return res.status(400).json({ status: false, message: 'Invalid amount' });
      }
  
      // Create a PaymentIntent with Stripe
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(Number(totalPrice) * 100), // Convert to cents
        currency: 'usd',
      });
  
      // Check if the PaymentIntent was successful
      if (paymentIntent.status === 'succeeded') {
        // Emit event after payment is successful
        io.emit('paymentSuccess', {
          message: 'Payment Successful!',
          orderDetails: {
            userId: (req as any).user.id, // Assuming user info is available in req.user
            amount: paymentIntent.amount,
            date: new Date(),
          },
        });
      }
  
      // Respond with the client_secret for the PaymentIntent
      return res.status(200).json({ 
        status: true, 
        client_secret: paymentIntent.client_secret 
      });
    } catch (error) {
      console.error('Payment Error:', error);
      return res.status(500).json({ 
        status: false, 
        message: 'Error in payment' 
      });
    }
  
  

};

// Fetch cart and display with amount and user details after payment
 const displayCartWithAmountAndUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id; // Extract user ID from request

  try {
    const user = await User.findById(userId);
    const cart = await Cart.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalAmount = cart ? cart.items.reduce((sum: number, item: ICartItem) => sum + item.totalPrice, 0) : 0;

    res.status(200).json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
      cart: cart ? cart.items : [],
      totalAmount,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const decrementProductQty = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.items.findIndex(
      (item: ICartItem) => item.itemType === 'product' && item.item.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (cart.items[productIndex].quantity > 1) {
      cart.items[productIndex].quantity -= 1;
    } else {
      cart.items.splice(productIndex, 1);
    }

    await cart.save();

    res.status(200).json({ message: 'Product quantity decremented successfully' });
  } catch (error) {
    console.error('Error decrementing product quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const incrementProductQty = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.items.findIndex(
      (item: ICartItem) => item.itemType === 'product' && item.item.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cart.items[productIndex].quantity += 1;

    await cart.save();

    res.status(200).json({ message: 'Product quantity incremented successfully' });
  } catch (error) {
    console.error('Error incrementing product quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  addProductToCart, payment, getAllCarts, getCartCount, removeProductFromCart, displayCartWithAmountAndUser,fetchUserCart, addFoodToCart,clearUserCart,deleteAllCart, decrementProductQty, updateCartItemQuantity,getCartByUser,incrementProductQty
}