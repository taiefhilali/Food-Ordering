import { Request, Response } from "express"
import mongoose from "mongoose";
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
        const { replyText, createdAt, user, adminUsername, adminImageUrl } = req.body;
    
        // Create a new reply
        const newReply = new Reply({
          replyText,
          createdAt,
          user,
          adminUsername,
          adminImageUrl
        });
    
        await newReply.save();
    
        // Add reply to the feedback (assuming a feedback has a replies array)
        const feedback = await Feedback.findById(req.params.feedbackId);
        feedback.replies.push(newReply);
        await feedback.save();
    
        res.status(200).json(newReply);
      } catch (error) {
        console.error('Error saving reply:', error);
        res.status(500).json({ error: 'Failed to save reply' });
      }
};


  
module.exports = {
  addFeedback,getFeedbacksByRestaurant,feedbacksreplies
};
