
import mongoose from 'mongoose';
import Restaurant from './Restaurant';

const foodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    foodTags: { type: Array, required: true },
    foodType: { type: Array, required: true },
    category: { type: String, required: true },
    value: { type: String },
    isAvailable: { type: Boolean, required: true, default: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    ratingCount: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additives: { type: Array, required: true },
    imageUrl: { type: Array, required: true }, // Change the type to String


}, { timestamps: false });


module.exports = mongoose.model('Foods', foodSchema);