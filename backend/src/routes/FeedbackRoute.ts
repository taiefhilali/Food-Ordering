const express = require('express');
const router = express.Router();
const { addFeedback,getFeedbacksByRestaurant,feedbacksreplies } = require('../controllers/FeebackController');

// POST /api/feedback - Add a new feedback

router.post('/', addFeedback);
router.post('/:feedbackId/reply',feedbacksreplies);
router.get('/:restaurantId',getFeedbacksByRestaurant);
export default router;
