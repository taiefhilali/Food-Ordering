import mongoose from "mongoose";

const userSchema= new mongoose.Schema({

    id:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },

    firstname:{
        type:String,
    },

    lastname:{
        type:String,
    },
   
});
const User=mongoose.model("User",userSchema);
export default User;