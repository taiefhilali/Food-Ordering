import { Request, Response } from "express"
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
        const feedbacks = await Feedback.find({ restaurantId }).populate('userId', 'name');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
};

module.exports = {
  addFeedback,getFeedbacksByRestaurant
};
