// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   dishType: { type: String, enum: ['main', 'side', 'beverage', 'entry', 'dessert'], required: true },
//   restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
//   quantity: { type: Number, required: true },
//   imageUrl: { type: String },
//   isApproved: { type: Boolean, default: false },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User" // Reference to the User model
//   },
//   soldQuantity: { type: Number, default: 0 }, // Track the quantity sold
//   revenue: { type: Number, default: 0 }, // Track the revenue generated
//   createdAt: { type: Date, default: Date.now },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true }, // Reference to the Categories model
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Add this line


// });


// // Virtual property to calculate total revenue (price * soldQuantity)
// productSchema.virtual('totalRevenue').get(function() {
//   return this.price * this.soldQuantity;
// });

// // Middleware to update soldQuantity and revenue when a product is sold
// productSchema.methods.sell = async function(quantitySold: any) {
//   this.soldQuantity += quantitySold;
//   await this.save();
// };

// const Product = mongoose.model('Product', productSchema);
// export default Product;
import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the Product interface extending mongoose Document
interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  dishType: 'main' | 'side' | 'beverage' | 'entry' | 'dessert';
  restaurant: mongoose.Schema.Types.ObjectId;
  quantity: number;
  imageUrl?: string;
  isApproved?: boolean;
  user?: mongoose.Schema.Types.ObjectId;
  soldQuantity: number; // Ensure soldQuantity is always a number
  revenue?: number;
  createdAt?: Date;
  category: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[]; // Ensure likes is always an array
  totalRevenue?: number;
  sell: (quantitySold: number) => Promise<void>;
}

// Define the Product schema
const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  dishType: { type: String, enum: ['main', 'side', 'beverage', 'entry', 'dessert'], required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
  isApproved: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  soldQuantity: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Ensure likes is an array
});

// Virtual property to calculate total revenue
productSchema.virtual('totalRevenue').get(function () {
  return this.price * (this.soldQuantity ?? 0);
});

// Method to update soldQuantity and revenue when a product is sold
productSchema.methods.sell = async function (this: IProduct, quantitySold: number) {
  this.soldQuantity = (this.soldQuantity ?? 0) + quantitySold;
  await this.save();
};

// Create and export the Product model
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
export default Product;