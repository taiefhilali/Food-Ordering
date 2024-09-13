import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  replyText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  feedbackText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema], // Add the replies field here
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
