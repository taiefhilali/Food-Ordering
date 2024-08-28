import mongoose from "mongoose";
// Define the schema for the bot message
const botMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required']
},
  createdAt: { type: Date, default: Date.now }
});

// Create the model from the schema
const BotMessage = mongoose.model('BotMessage', botMessageSchema);

module.exports = BotMessage;
