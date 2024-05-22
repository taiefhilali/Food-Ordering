import { Product } from './../../../frontend/src/types/product';
const Cart = require('../models/Cart')
import { Request, Response, response } from "express"
import { title } from "process";
import Cart, { CartItem } from '../models/Cart'; // Adjust the import based on your file structure

// interface CartItem {
//     productId: string;
//     additives: string[];
//     instructions: string;
//     totalPrice: number;
//     quantity: number;
//   }

//   const addProductToCart = async (req: Request, res: Response) => {
//     const userId = (req as any).user.id;
//     const { productId, totalPrice, quantity } = req.body;
//     let count;

//     try {
//         console.log('Received request body:', req.body);

//         const existingProduct = await Cart.findOne({ userId, productId });
//         count = await Cart.countDocuments({ userId });

//         if (existingProduct) {
//             existingProduct.totalPrice += totalPrice;
//             existingProduct.quantity += 1;
//             await existingProduct.save();
//             console.log('Existing product updated:', existingProduct);
//         } else {
//             const newCart = new Cart({
//                 userId: userId,
//                 productId: productId, // Ensure that productId is being assigned correctly here
//                 additives: req.body.additives,
//                 instruction: req.body.instructions,
//                 totalPrice: req.body.totalPrice,
//                 quantity: req.body.quantity,
//             });
//             await newCart.save();
//             console.log('New product added to cart:', newCart);
//             count = await Cart.countDocuments({ userId });
//         }

//         res.status(200).json({ status: true, count: count });

//     } catch (error) {
//         console.error('Error adding product to cart:', error);
//         res.status(500).json({ status: false, message: 'Error adding Product to cart ' });
//     }
// };

const addProductToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, totalPrice, quantity, additives, instruction } = req.body;

  try {
    console.log('Received request body:', req.body);

    // Find the user's cart
    let userCart = await Cart.findOne({ userId });

    if (userCart) {
      // Check if the product already exists in the cart
      const existingProductIndex = userCart.items.findIndex((item: CartItem) => item.productId.toString() === productId);

      if (existingProductIndex > -1) {
        // If the product exists, update its quantity and total price
        userCart.items[existingProductIndex].quantity += quantity;
        userCart.items[existingProductIndex].totalPrice += totalPrice;
      } else {
        // If the product doesn't exist, add it to the cart
        userCart.items.push({
          productId,
          additives,
          instruction,
          quantity,
          totalPrice,
          imageUrl: req.body.imageUrl, // Assuming the imageUrl is provided in the request body
        });
      }
    } else {
      // If the user doesn't have a cart yet, create one
      userCart = new Cart({
        userId,
        items: [{
          productId,
          additives,
          instruction,
          quantity,
          totalPrice,
          imageUrl: req.body.imageUrl,
        }],
      });
    }

    await userCart.save();
    console.log('Cart updated:', userCart);

    const itemCount = userCart.items.length;

    res.status(200).json({ status: true, count: itemCount });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ status: false, message: 'Error adding product to cart' });
  }
};

const removePrductFromCart = async (req: Request, res: Response) => {

    const userId = (req as any).user.id;

  try {
    const { id } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex((item: CartItem) => item.productId === id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAllCarts = async () => {
    try {
      // Fetch all carts from the database
      const carts = await Cart.find();
      return carts;
    } catch (error) {
      // Handle errors
      console.error('Error fetching carts:', error);
      throw error;
    }
  };
const fetchUserCart = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const cart = await Cart.findOne({ userId }).populate({
            path:"productId",
            select:"title imageUrl restaurant rating ratingCount"
        });
    
        if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
        }
    
        res.status(200).json({statue:true,cart:cart});
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
        const cart = await Cart.findOne({ userId });
    
        if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
        }
    
        const count = cart.products.reduce((acc: number, curr: { quantity: number }) => acc + curr.quantity, 0);
    
        res.status(200).json({ count });
      } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
};


const decrementProductQty = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
      // Get product ID from request body
      const { productId } = req.body;
  
      // Find the user's cart
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      // Find the index of the product in the cart
      const productIndex = cart.products.findIndex((item: CartItem) => item.productId === productId);
  
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }
  
      // Decrement the quantity of the product
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        // Remove the product if the quantity is 1
        cart.products.splice(productIndex, 1);
      }
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Product quantity decremented successfully' });
    } catch (error) {
      console.error('Error decrementing product quantity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}




module.exports = {
  addProductToCart, getAllCarts,getCartCount, removePrductFromCart, fetchUserCart, clearUserCart, decrementProductQty
}