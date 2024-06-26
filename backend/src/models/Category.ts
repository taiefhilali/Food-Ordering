
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String,required: true },
  imageUrl: { type: String,default:"https://d326fntlu7tb1e.cloudfront.net/uploads/4a4cd06e-94de-4478-8588-66eee01354d4-rice.png"}, // Change the type to String
  

},{timestamps:false});


module.exports = mongoose.model('Categories', categorySchema);