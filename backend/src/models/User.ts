import mongoose from "mongoose";

const userSchema = new mongoose.Schema({


    email: {
        type: String,
        required: true,
        unique: true

    },
    username: { type: String },
    uid: { type: String, unique: true },

    userType: { type: String, required: true, default: "Client", enum: ['Admin', 'Client', 'Vendor'] },
    phoneNumber: {
        type: Number,
        default:+21697009028
    },
    firstname: {
        type: String,
    },

    lastname: {
        type: String,
    },
    // profile: {
    //     type: String,
    //     required: true,
    //     default:"https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg"
    // },

    imageUrl: {
        type: String,
        required: true,
        default: "https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg"

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;