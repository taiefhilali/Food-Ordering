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
    const { feedbackId } = req.params;
    const { replyText, userId } = req.body;

    try {
        console.log('Request body:', req.body); // Log request body

        // Validate userId
        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        // Find the feedback and populate user details for replies
        const feedback = await Feedback.findById(feedbackId)
            .populate('userId', 'username imageUrl') // Populate user details for the feedback
            .populate({
                path: 'replies.user', // Populate user details for each reply
                select: 'username imageUrl',
            });

        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        // Add the new reply with user reference
        feedback.replies.push({
            replyText,
            createdAt: new Date(),
            user: new mongoose.Types.ObjectId(userId), // Ensure userId is of ObjectId type
        });

        await feedback.save();

        // Populate the newly added reply with user details
        const updatedFeedback = await Feedback.findById(feedbackId)
            .populate('userId', 'username imageUrl')
            .populate({
                path: 'replies.user',
                select: 'username imageUrl',
            });
            
        console.log('Reply added successfully:', updatedFeedback);
        res.status(200).json({ message: 'Reply added', feedback: updatedFeedback });
    } catch (error) {
        console.error('Error adding reply:', error); // Log the full error for debugging
        res.status(500).json({ error: 'Failed to add reply' });
    }
};


  
module.exports = {
  addFeedback,getFeedbacksByRestaurant,feedbacksreplies
};
