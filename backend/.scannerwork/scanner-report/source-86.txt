import mongoose from "mongoose";
const QrCodeSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        default:12,
        required: true
    },
    restaurantName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Reference to the Restaurant model
        required: true
    }
});

const QrCode = mongoose.model('QrCode', QrCodeSchema);

module.exports =QrCode ;
