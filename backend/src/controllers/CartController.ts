import { Product } from './../../../frontend/src/types/product';
import Cart, { ICartItem } from '../models/Cart'; // Ensure the correct path to the Cart model
import { Request, Response, response } from "express"
import mongoose, { model } from 'mongoose';
import { title } from "process";
import stripe from 'stripe';

// interface CartItem {
//   quantity: number;
//   totalPrice: number;
//   additives: any; // Adjust the type as per your schema
//   instruction: any; // Adjust the type as per your schema
// }
const stripeSecretKey = 'sk_test_51PM7rN03qVjqSurgaFDcUo3Y1GrtFJoYzoiHZZRIWvNhaIec7DrXqNPLFuori2tTwAjBPEQwHF4UOuLBIptnxx4m00OwswBdhb'; // Replace with your actual Stripe secret key
const stripeClient = new stripe(stripeSecretKey);
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

// export const addProductToCart = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;
//   const { product, quantity, totalPrice ,additives, instruction   } = req.body;
//   console.log(req.body);

//   if (!mongoose.Types.ObjectId.isValid(product)) {
//     return res.status(400).json({ error: 'Invalid product ID' });
//   }

//   try {
//     // Find the user's cart
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       // Create a new cart if it doesn't exist
//       cart = new Cart({ user: userId, items: [] });
//     }

//     // Check if the product already exists in the cart
//     const existingItemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === product
//     );

//     if (existingItemIndex !== -1) {
//       // Update the quantity and total price if the product already exists
//       cart.items[existingItemIndex].quantity += quantity;
//       cart.items[existingItemIndex].totalPrice += totalPrice;
//     } else {
//       // Add the new product to the cart
//       cart.items.push({ product, quantity, totalPrice,additives, instruction });
//     }

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ status: true, message: 'Product added to cart successfully', cart });
//   } catch (error) {
//     console.error('Error adding product to cart:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }

// };
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
// const addProductToCart = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;
//   const { productId, totalPrice, quantity, additives, instruction } = req.body;

//   try {
//     console.log('Received request body:', req.body);

//     // Find an existing cart item by userId, productId, and additives
//     let existingProduct = await Cart.findOne({
//       userId,
//       productId,
//       additives
//     });

//     if (existingProduct) {
//       // Update existing product in the cart
//       existingProduct.totalPrice += parseFloat(totalPrice);
//       existingProduct.quantity += parseInt(quantity, 10);
//       existingProduct.instruction = instruction || existingProduct.instruction;

//       await existingProduct.save();
//       console.log('Existing product updated:', existingProduct);
//     } else {
//       const newCart = new Cart({
//         userId: userId,
//         productId: productId,
//         additives: additives || [],
//         instruction: instruction || '',
//         totalPrice: parseFloat(totalPrice),
//         quantity: parseInt(quantity, 10),
//       });
//       await newCart.save();
//       console.log('New product added to cart:', newCart);
//     }

//     const count = await Cart.countDocuments({ userId });

//     res.status(200).json({ status: true, count: count });

//   } catch (error) {
//     console.error('Error adding product to cart:', error);
//     res.status(500).json({ status: false, message: 'Error adding Product to cart ' });
//   }
// };

// const addProductToCart = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;
//   const { productId, totalPrice, quantity, additives, instructions } = req.body;

//   try {
//       console.log('Received request body:', req.body);

//       // Find an existing cart item by userId, productId, and additives
//       let existingProduct = await Cart.findOne({ 
//           userId, 
//           productId, 
//           additives 
//       });

//       if (existingProduct) {
//           // Update existing product in the cart
//           existingProduct.totalPrice += parseFloat(totalPrice); // Ensure totalPrice is parsed to float
//           existingProduct.quantity += parseInt(quantity, 10); // Ensure quantity is parsed to integer

//           // Update instructions if provided
//           if (instructions) {
//               existingProduct.instructions = instructions; // Update instructions if provided
//           }

//           await existingProduct.save();
//           console.log('Existing product updated:', existingProduct);
//       } else {
//           const newCart = new Cart({
//               userId: userId,
//               productId: productId,
//               additives: additives || [], // Initialize with provided additives or empty array
//               instruction: instructions || '', // Initialize with provided instructions or empty string
//               totalPrice: parseFloat(totalPrice), // Ensure totalPrice is parsed to float
//               quantity: parseInt(quantity, 10), // Ensure quantity is parsed to integer
//           });
//           await newCart.save();
//           console.log('New product added to cart:', newCart);
//       }

//       const count = await Cart.countDocuments({ userId });

//       res.status(200).json({ status: true, count: count });

//   } catch (error) {
//       console.error('Error adding product to cart:', error);
//       res.status(500).json({ status: false, message: 'Error adding Product to cart ' });
//   }
// };


// const addProductToCart = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;
//   const { items } = req.body; // Assuming items is an array of CartItem objects

//   try {
//     console.log('Received request body:', req.body);

//     let userCart = await Cart.findOne({ userId });

//     if (userCart) {
//       for (const item of items) {
//         const existingProductIndex = userCart.items.findIndex((cartItem: CartItem) => cartItem.productId.toString() === item.productId);

//         if (existingProductIndex > -1) {
//           userCart.items[existingProductIndex].quantity += item.quantity;
//           userCart.items[existingProductIndex].totalPrice += item.totalPrice;
//         } else {
//           userCart.items.push({
//             productId: item.productId,
//             additives: item.additives,
//             instruction: item.instruction,
//             quantity: item.quantity,
//             totalPrice: item.totalPrice,
//             imageUrl: item.imageUrl,
//           });
//         }
//       }
//     } else {
//       userCart = new Cart({
//         userId,
//         items,
//       });
//     }

//     await userCart.save();
//     console.log('Cart updated:', userCart);

//     const itemCount = userCart.items.length;

//     res.status(200).json({ status: true, count: itemCount });
//   } catch (error) {
//     console.error('Error adding product(s) to cart:', error);
//     res.status(500).json({ status: false, message: 'Error adding product(s) to cart' });
//   }
// }

// export const removeProductFromCart = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;

//   try {
//     const { id } = req.params;

//     // Find the user's cart
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }

//     // Find the index of the product in the cart
//     const productIndex = cart.items.findIndex((item: CartItem) => item.product.toString() === id);

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found in cart' });
//     }

//     // Remove the product from the cart
//     cart.items.splice(productIndex, 1);

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ message: 'Product removed from cart successfully' });
//   } catch (error) {
//     console.error('Error removing product from cart:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
// export const removeProductFromCart = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;

//   try {
//     const { id } = req.params;

//     // Find the user's cart
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }

//     // Find the index of the product in the cart
//     const productIndex = cart.items.findIndex((item: CartItem) => item.product.toString() === id);

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found in cart' });
//     }

//     // Remove the product from the cart
//     cart.items.splice(productIndex, 1);

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ message: 'Product removed from cart successfully' });
//   } catch (error) {
//     console.error('Error removing product from cart:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getAllCarts = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;

//   try {
//     const cartItems = await Cart.find({ userId }).exec();

//     res.status(200).json({ status: true, cartItems });
//   } catch (error) {
//     console.error('Error fetching cart items:', error);
//     res.status(500).json({ status: false, message: 'Error fetching cart items' });
//   }
// };
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

// const decrementProductQty = async (req: Request, res: Response) => {
//     const userId = (req as any).user.id;

//     try {
//       // Get product ID from request body
//       const { productId } = req.body;

//       // Find the user's cart
//       const cart = await Cart.findOne({ userId });

//       if (!cart) {
//         return res.status(404).json({ error: 'Cart not found' });
//       }

//       // Find the index of the product in the cart
//       const productIndex = cart.products.findIndex((item: CartItem) => item.productId === productId);

//       if (productIndex === -1) {
//         return res.status(404).json({ error: 'Product not found in cart' });
//       }

//       // Decrement the quantity of the product
//       if (cart.products[productIndex].quantity > 1) {
//         cart.products[productIndex].quantity -= 1;
//       } else {
//         // Remove the product if the quantity is 1
//         cart.products.splice(productIndex, 1);
//       }

//       // Save the updated cart
//       await cart.save();

//       res.status(200).json({ message: 'Product quantity decremented successfully' });
//     } catch (error) {
//       console.error('Error decrementing product quantity:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
// }


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
// const updateCartItemQuantity = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id; // Assuming `req.user` contains authenticated user's information
//   const itemId = req.params._id;
//   const { quantity } = req.body;

//   try {
//     // Find the cart document containing the item
//     const cart = await Cart.findOne({ userId, 'items._id': itemId });

//     if (!cart) {
//       return res.status(404).json({ status: false, message: 'Cart item not found' });
//     }

//     // Find the specific item in the cart
//     const item = cart.items.id(itemId);

//     if (!item) {
//       return res.status(404).json({ status: false, message: 'Cart item not found' });
//     }

//     // Update the item's quantity
//     item.quantity = quantity;

//     // Save the updated cart document
//     await cart.save();

//     res.status(200).json({ status: true, message: 'Cart item quantity updated successfully' });
//   } catch (error) {
//     console.error('Error updating cart item quantity:', error);
//     res.status(500).json({ status: false, message: 'Error updating cart item quantity' });
//   }
// };

// const payment = async (req: Request, res: Response) => {

//   try {
//     //get amount
//     const { totalPrice } = req.body;
//     //validation
// if(!totalPrice){
//   return res.status(404).json({ status: false, message: 'Invalid amount' });
// }
//     const { client_secret } = await stripe.paymentIntents.create({
//       amount: Number(totalPrice),
//       currency: 'usd'
//     })
//     res.status(200).json({ status: true, message: 'Payment completed successfully' });

//   } catch (error) {
//     console.error(' Payment Error :', error);
//     res.status(500).json({ status: false, message: 'Error in payment    ' });
//   }
// };

// const decrementProductQty = async (req: Request, res: Response) => {
//   const userId = (req as any).user.id;

//   try {
//     // Get product ID from request body
//     const { productId } = req.body;

//     // Find the user's cart
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }

//     // Find the index of the product in the cart
//     const productIndex = cart.items.findIndex((item: CartItem) => item.product.toString() === productId);

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found in cart' });
//     }

//     // Decrement the quantity of the product
//     if (cart.items[productIndex].quantity > 1) {
//       cart.items[productIndex].quantity -= 1;
//     } else {
//       // Remove the product if the quantity is 1
//       cart.items.splice(productIndex, 1);
//     }

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ message: 'Product quantity decremented successfully' });
//   } catch (error) {
//     console.error('Error decrementing product quantity:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
// const incrementProductQty = async (req: Request, res: Response) => {
// try {  
//   const userId = (req as any ).user.id; // Assuming you have authentication middleware setting req.user.id

//     // Extract productId from request parameters
//     const { productId } = req.params;

//     // Find the user's cart and increment product quantity
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }

//     // Find the index of the product in the cart
//     const productIndex = cart.items.findIndex((item) => item.product.toString() === productId);

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found in cart' });
//     }

//     // Increment the quantity of the product
//     cart.items[productIndex].quantity += 1;

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ message: 'Product quantity incremented successfully' });
//   } catch (error) {
//     console.error('Error incrementing product quantity:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
const payment = async (req: Request, res: Response) => {
  try {
    const { totalPrice } = req.body;

    if (!totalPrice) {
      return res.status(400).json({ status: false, message: 'Invalid amount' });
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Number(totalPrice),
      currency: 'usd',
    });

    res.status(200).json({ status: true, client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ status: false, message: 'Error in payment' });
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
  addProductToCart, payment, getAllCarts, getCartCount, removeProductFromCart, fetchUserCart, addFoodToCart,clearUserCart,deleteAllCart, decrementProductQty, updateCartItemQuantity,getCartByUser,incrementProductQty
}