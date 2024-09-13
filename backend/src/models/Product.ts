import mongoose, { Document, Schema, Model } from 'mongoose';

const additivesSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  icon: { type: String, required: true },
});

// Define the Product interface extending mongoose Document
interface IProduct extends Document {
  name: string;
  description?: string;
  cost: number;
  price: number;
  dishType: 'main' | 'side' | 'beverage' | 'entry' | 'dessert';
  restaurant: mongoose.Schema.Types.ObjectId;
  quantity: number;
  imageUrl?: string;
  isApproved?: boolean;
  user?: mongoose.Schema.Types.ObjectId;
  soldQuantity: number;
  revenue?: number;
  createdAt?: Date;
  category: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  // likes?:number;
  additives: typeof additivesSchema[];
  totalRevenue?: number;
  sell: (quantitySold: number) => Promise<void>;
}

// Define the Product schema
const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  cost: { type: Number, required: true },
  price: { type: Number, required: true },
  dishType: { type: String, enum: ['main', 'side', 'beverage', 'entry', 'dessert'], required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
  isApproved: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldQuantity: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  // likes: { type: Number, default: 0 }, // Change likes to a number with a default of 0
  additives: {
    type: [additivesSchema],
    default: [],
  },});

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
