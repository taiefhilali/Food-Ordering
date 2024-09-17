import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  replyText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    imageUrl: { type: String, required: true }
  }, 
});

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  feedbackText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema], // Add replies field
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
