// models/Invoice.js
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  orderDetails: { type: Object, required: true }, // Store details about the order
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
