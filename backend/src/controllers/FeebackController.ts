import { Request, Response } from "express"
import mongoose from "mongoose";
import User from "../models/User";
const Feedback = require('../models/Feedback');

// Controller function to add a new feedback
const addFeedback = async (req:Request, res:Response) => {
    try {
        const { userId, restaurantId, feedbackText } = req.body;

        const feedback = new Feedback({
            userId: userId,
            restaurantId: restaurantId,
            feedbackText: feedbackText,
        });

        const savedFeedback = await feedback.save();
        res.json(savedFeedback);
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
};
const getFeedbacksByRestaurant = async (req:Request, res:Response) => {
    const { restaurantId } = req.params;

    try {
        const feedbacks = await Feedback.find({ restaurantId }).populate('userId', 'username imageUrl');
        res.status(200).json(feedbacks);
        console.log('================feedbacks====================');
        console.log(feedbacks);
        console.log('====================================');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};


const feedbacksreplies = async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const { replyText, user: userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch the feedback
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Fetch the user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newReply = {
      replyText,
      createdAt: new Date(),
      user: {
        _id: user._id,
        username: user.username,
        imageUrl: user.imageUrl
      }
    };

    feedback.replies.push(newReply);
    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  


const deletefeedbacksreplies = async (req: Request, res: Response) => {
    const { feedbackId, replyId } = req.params;
  
  try {
    // Use $pull to remove the reply from the feedback's replies array
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { $pull: { replies: { _id: replyId } } },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Reply deleted successfully', feedback });
  } catch (err) {
    console.error('Error deleting reply:', err);
    res.status(500).json({ message: 'Error deleting reply' });
  }

};

module.exports = {
  addFeedback,getFeedbacksByRestaurant,feedbacksreplies,deletefeedbacksreplies
};
