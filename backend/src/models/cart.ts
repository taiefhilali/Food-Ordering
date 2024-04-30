
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Foods' },
    additives: { type: [] },
    instruction: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    totalPrice: { type: Number,required:true },

}, { timestamps: true });


module.exports = mongoose.model('Cart', cartSchema);