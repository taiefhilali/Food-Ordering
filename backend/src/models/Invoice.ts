import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      imageUrl: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }, // Add this line
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
