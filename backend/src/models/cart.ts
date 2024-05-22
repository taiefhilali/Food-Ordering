
// import mongoose from 'mongoose';

// const cartSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Foods' },
//     additives: { type: [] },
//     instruction: { type: String, default: '' },
//     quantity: { type: Number, default: 1 },
//     totalPrice: { type: Number,required:true },
//     imageUrl: { type: String},

// }, { timestamps: true });


// module.exports = mongoose.model('Cart', cartSchema);
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Foods' },
  additives: { type: Array },
  instruction: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  imageUrl: { type: String },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
