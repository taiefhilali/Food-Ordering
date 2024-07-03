
// import { NextFunction } from 'express';
// import mongoose from 'mongoose';

// const additiveSchema = new mongoose.Schema({
//     id: { type: Number, required: true },
//     title: { type: String, required: true },
//     price: { type: String, required: true },
// }, { _id: false });

// const cartSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Foods' },
//     additives: [{ id: Number, title: String, price: String }],
//     instruction: { type: String, default: '' },
//     quantity: { type: Number, default: 1 },
//     totalPrice: { type: Number, required: true },
//     imageUrl: { type: String, default: '' },
// }, { timestamps: true });

  
// // Create a compound index to ensure unique entries per user, product, and additives
// cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

// module.exports = mongoose.model('Cart', cartSchema);


// //----------------------//

// // cartModel.ts

// // ../models/Cart.ts

// // import mongoose, { Schema, Document } from 'mongoose';

// // export interface IAdditive {
// //   id: number;
// //   title: string;
// //   price: string;
// // }

// // export interface ICart extends Document {
// //   userId: string;
// //   productId: string;
// //   additives: IAdditive[];
// //   instruction: string;
// //   totalPrice: number;
// //   quantity: number;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const cartSchema: Schema = new Schema({
// //   userId: { type: String, required: true },
// //   productId: { type: String, required: true },
// //   additives: [{ id: Number, title: String, price: String }],
// //   instruction: { type: String, default: '' },
// //   totalPrice: { type: Number, required: true },
// //   quantity: { type: Number, required: true },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // const Cart = mongoose.model<ICart>('Cart', cartSchema);

// // export default Cart;


// //----------------------//



// // import mongoose from 'mongoose';

// // const cartItemSchema = new mongoose.Schema({
// //   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Foods' },
// //   additives: { type: [] },
// //   instruction: { type: String, default: '' },
// //   quantity: { type: Number, default: 1 },
// //   totalPrice: { type: Number, required: true },
// //   imageUrl: { type: String },
// // });

// // const cartSchema = new mongoose.Schema({
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// //   items: [cartItemSchema],
// // }, { timestamps: true });

// // module.exports = mongoose.model('Cart', cartSchema);
// // const cartSchema = new mongoose.Schema({
// //     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// //     products: [
// //         {
// //             productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Foods', required: true },
// //             additives: { type: [] },
// //             instruction: { type: String, default: '' },
// //             quantity: { type: Number, default: 1, required: true },
// //             totalPrice: { type: Number, required: true },
// //         },
// //     ],
// // }, { timestamps: true });


//2nd
// import mongoose from "mongoose";

// const cartItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   quantity: { type: Number, required: true },
//   totalPrice: { type: Number, required: true },
// });

// const cartSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: { type: [cartItemSchema], default: [] },
// });

// const Cart = mongoose.model('Cart', cartSchema);
// export default Cart;


//3rd
import mongoose, { Schema, Document } from 'mongoose';

interface ICartItem {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  totalPrice: number;
}

interface ICart extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [cartItemSchema], default: [] },
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);
export default Cart;
