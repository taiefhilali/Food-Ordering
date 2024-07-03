import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  dishType: { type: String, enum: ['main', 'side', 'beverage', 'entry', 'dessert'], required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
  isApproved: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Reference to the User model
  },
  soldQuantity: { type: Number, default: 0 }, // Track the quantity sold
  revenue: { type: Number, default: 0 }, // Track the revenue generated
  createdAt: { type: Date, default: Date.now },


});


// Virtual property to calculate total revenue (price * soldQuantity)
productSchema.virtual('totalRevenue').get(function() {
  return this.price * this.soldQuantity;
});

// Middleware to update soldQuantity and revenue when a product is sold
productSchema.methods.sell = async function(quantitySold: any) {
  this.soldQuantity += quantitySold;
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);
