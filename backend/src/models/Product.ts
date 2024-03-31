const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['main', 'side', 'beverage', 'entry'], required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String } // Add image URL field


});

module.exports = mongoose.model('Product', productSchema);
