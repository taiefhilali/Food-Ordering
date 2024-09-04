const express = require('express');
const router = express.Router();
const notificationcontroller = require('../controllers/NotificationController');
const { verifyToken, verifyVendor } = require('../middleware/verifyToken');

router.get('/all',verifyToken,verifyVendor,notificationcontroller.getNotificationsByUserId);

export default router;
