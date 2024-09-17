const express = require('express');
const router = express.Router();
const { addFeedback,getFeedbacksByRestaurant,feedbacksreplies,deletefeedbacksreplies } = require('../controllers/FeebackController');
const {verifyToken, verifyAdmin} = require('../middleware/verifyToken')

// POST /api/feedback - Add a new feedback

router.post('/', verifyToken,verifyAdmin,addFeedback);
router.post('/:feedbackId/reply',feedbacksreplies);
router.get('/:restaurantId',getFeedbacksByRestaurant);
router.delete('/:feedbackId/reply/:replyId',verifyToken,verifyAdmin, deletefeedbacksreplies);
export default router;
