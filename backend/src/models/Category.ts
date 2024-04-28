
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String,required: true },
  imageUrl: { type: String, required: true }, // Change the type to String


},{timestamps:false});


module.exports = mongoose.model('Categories', categorySchema);