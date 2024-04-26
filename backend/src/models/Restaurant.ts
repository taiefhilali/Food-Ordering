import mongoose from "mongoose";



const menuItemSchema= new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    // imageItem: { type: String }, // Image URL
    // quantity: { type: Number, required: true } // Quantity of the menu item
});

const restaurantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    },
    restaurantName: { 
        type: String, 
        required: true },
    estimatedDeliveryTime: {
        type: Number,
         required: true
    },
    cuisines:[{ type:String, required:true}],
    menuItems:[menuItemSchema],
    imageUrl:{type:String,required:true},
    lastUpdated:{
        type:Date,required:true 
    },
    isAvailable: { type:Boolean, default:true},
    foods:[{ type:String, required:true}],
    pickup:{ type:Boolean, required:true ,default:true},
    rating:{ type:Number, min:1, max:5 },
    ratingCount:{ type:String}





}, {timestamps:true});

const Restaurant=mongoose.model("Restaurant",restaurantSchema);
export default Restaurant;
