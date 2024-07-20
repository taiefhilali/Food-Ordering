import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    couponCode: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // e.g., 0.1 for 10% discount
    expirationDate: { type: Date, required: true }
}, { timestamps: true });

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
