import mongoose from "mongoose";

const userSchema = new mongoose.Schema({


    email: {
        type: String,
        required: true,
        unique: true

    },

    firstname: {
        type: String,
    },

    lastname: {
        type: String,
    },


    imageUrl: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
});
const User = mongoose.model("User", userSchema);
export default User;