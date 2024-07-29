const express = require('express');
const router = express.Router();
const { addFeedback,getFeedbacksByRestaurant } = require('../controllers/FeebackController');

// POST /api/feedback - Add a new feedback
router.post('/', addFeedback);
router.get('/:restaurantId',getFeedbacksByRestaurant);
export default router;
