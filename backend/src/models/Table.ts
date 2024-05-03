import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: {
      type: Number,
      required: true
    },
    restaurantName: {
      type:mongoose.Schema.ObjectId,ref:'Restaurant'
    }
  });
  // Create the Table model
const Table = mongoose.model('Table', tableSchema);

export default Table;
