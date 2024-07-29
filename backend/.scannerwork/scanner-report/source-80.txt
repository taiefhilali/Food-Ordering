import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    couponCode: { type: String, required: true },
    discount: { type: Number, required: true }, // e.g., 0.1 for 10% discount
    expirationDate: { type: Date, required: true },
    restaurantName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Reference to the Restaurant model
        required: true
    }
}, { timestamps: true });

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;