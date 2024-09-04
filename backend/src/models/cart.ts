


import mongoose, { Schema } from "mongoose";

// Define the interface for CartItem
export interface ICartItem extends Document {
  itemType: string;
  item: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  additives?: any;
  instruction?: any;
}

// Define the interface for Cart
export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

// Define CartItem schema
const CartItemSchema: Schema = new Schema({
  itemType: { type: String, required: true },
  item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemType' },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  additives: { type: Schema.Types.Mixed },
  instruction: { type: Schema.Types.Mixed }
});

// Define Cart schema
const CartSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema]
});

// Create and export the Cart model
const Cart = mongoose.model<ICart>('Cart', CartSchema);
export default Cart;